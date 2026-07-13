/*
# Revenue Main Categories + Subcategories + Competence Columns + Data Migration

## Purpose
Refactors the revenue module to use a two-level category hierarchy (Main Category → Subcategory),
adds competence month/year columns to the revenues table, and migrates all existing data
without any data loss.

## Changes

### 1. New table: `revenue_main_categories`
- `id` (uuid, primary key)
- `name` (varchar, unique, not null) — e.g. "Localiza", "Particular", "Migração"
- `active` (boolean, default true)
- `created_at` (timestamptz)

### 2. New table: `revenue_subcategories`
- `id` (uuid, primary key)
- `main_category_id` (uuid, FK to revenue_main_categories, ON DELETE CASCADE)
- `name` (varchar, not null)
- `active` (boolean, default true)
- `created_at` (timestamptz)
- Unique constraint on (main_category_id, name)

### 3. Add columns to `revenues` table
- `competence_month` (smallint, nullable) — for competence-based filtering
- `competence_year` (smallint, nullable) — for competence-based filtering
- `main_category_id` (uuid, FK to revenue_main_categories, nullable)
- `subcategory_id` (uuid, FK to revenue_subcategories, nullable)

### 4. Seed main categories
- "Localiza", "Particular", "Migração"

### 5. Migrate existing revenue_categories to subcategories
Rules:
- If category name contains "Localiza" → main_category = "Localiza", subcategory = name without "Localiza"
- If category name contains "Migração" → main_category = "Migração", subcategory = name without "Migração"
- Otherwise → main_category = "Particular", subcategory = original name

For each existing revenue_categories record:
  a. Determine the main category based on the name
  b. Create a revenue_subcategories record linked to the main category
  c. Update all revenues referencing this category to set main_category_id and subcategory_id
  d. Set competence_month and competence_year from revenue_date

### 6. RLS policies on new tables
- revenue_main_categories: authenticated CRUD
- revenue_subcategories: authenticated CRUD

### Important Notes
1. The original `revenue_categories` table and `category_id` column are preserved (not dropped)
   to maintain backward compatibility with existing code paths
2. All existing revenue records get their competence_month/year derived from revenue_date
3. No data is lost — every existing category is mapped to a main + subcategory
*/

-- ============================================================
-- 1. Create revenue_main_categories table
-- ============================================================
CREATE TABLE IF NOT EXISTS revenue_main_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE revenue_main_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_revenue_main_categories" ON revenue_main_categories;
CREATE POLICY "auth_select_revenue_main_categories"
  ON revenue_main_categories FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_revenue_main_categories" ON revenue_main_categories;
CREATE POLICY "auth_insert_revenue_main_categories"
  ON revenue_main_categories FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_revenue_main_categories" ON revenue_main_categories;
CREATE POLICY "auth_update_revenue_main_categories"
  ON revenue_main_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_revenue_main_categories" ON revenue_main_categories;
CREATE POLICY "auth_delete_revenue_main_categories"
  ON revenue_main_categories FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 2. Create revenue_subcategories table
-- ============================================================
CREATE TABLE IF NOT EXISTS revenue_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  main_category_id uuid NOT NULL REFERENCES revenue_main_categories(id) ON DELETE CASCADE,
  name varchar NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (main_category_id, name)
);

ALTER TABLE revenue_subcategories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_revenue_subcategories" ON revenue_subcategories;
CREATE POLICY "auth_select_revenue_subcategories"
  ON revenue_subcategories FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_revenue_subcategories" ON revenue_subcategories;
CREATE POLICY "auth_insert_revenue_subcategories"
  ON revenue_subcategories FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_revenue_subcategories" ON revenue_subcategories;
CREATE POLICY "auth_update_revenue_subcategories"
  ON revenue_subcategories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_revenue_subcategories" ON revenue_subcategories;
CREATE POLICY "auth_delete_revenue_subcategories"
  ON revenue_subcategories FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 3. Add columns to revenues table
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='revenues' AND column_name='competence_month') THEN
    ALTER TABLE revenues ADD COLUMN competence_month smallint;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='revenues' AND column_name='competence_year') THEN
    ALTER TABLE revenues ADD COLUMN competence_year smallint;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='revenues' AND column_name='main_category_id') THEN
    ALTER TABLE revenues ADD COLUMN main_category_id uuid REFERENCES revenue_main_categories(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='revenues' AND column_name='subcategory_id') THEN
    ALTER TABLE revenues ADD COLUMN subcategory_id uuid REFERENCES revenue_subcategories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- 4. Seed main categories (idempotent)
-- ============================================================
INSERT INTO revenue_main_categories (name) VALUES
  ('Localiza'), ('Particular'), ('Migração')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 5. Migrate existing revenue_categories to subcategories
-- ============================================================
DO $$
DECLARE
  cat RECORD;
  main_cat_id uuid;
  sub_cat_id uuid;
  clean_name text;
  main_name text;
BEGIN
  FOR cat IN SELECT id, name FROM revenue_categories LOOP
    -- Determine main category
    IF cat.name ILIKE '%Localiza%' THEN
      main_name := 'Localiza';
      clean_name := trim(regexp_replace(cat.name, 'Localiza', '', 'gi'));
      IF clean_name = '' THEN
        clean_name := 'Geral';
      END IF;
    ELSIF cat.name ILIKE '%Migração%' THEN
      main_name := 'Migração';
      clean_name := trim(regexp_replace(cat.name, 'Migração', '', 'gi'));
      IF clean_name = '' THEN
        clean_name := 'Geral';
      END IF;
    ELSE
      main_name := 'Particular';
      clean_name := cat.name;
    END IF;

    -- Get main category ID
    SELECT id INTO main_cat_id FROM revenue_main_categories WHERE name = main_name;

    -- Create subcategory (idempotent)
    INSERT INTO revenue_subcategories (main_category_id, name)
    VALUES (main_cat_id, clean_name)
    ON CONFLICT (main_category_id, name) DO NOTHING;

    -- Get subcategory ID
    SELECT id INTO sub_cat_id FROM revenue_subcategories
    WHERE main_category_id = main_cat_id AND name = clean_name;

    -- Update revenues referencing this category
    UPDATE revenues
    SET main_category_id = main_cat_id,
        subcategory_id = sub_cat_id,
        competence_month = EXTRACT(MONTH FROM revenue_date::date)::smallint,
        competence_year = EXTRACT(YEAR FROM revenue_date::date)::smallint
    WHERE category_id = cat.id
      AND (main_category_id IS NULL OR subcategory_id IS NULL);
  END LOOP;
END $$;

-- ============================================================
-- 6. Add indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_revenues_competence ON revenues (competence_month, competence_year);
CREATE INDEX IF NOT EXISTS idx_revenues_main_category ON revenues (main_category_id);
CREATE INDEX IF NOT EXISTS idx_revenues_subcategory ON revenues (subcategory_id);
CREATE INDEX IF NOT EXISTS idx_revenue_subcategories_main ON revenue_subcategories (main_category_id);
