/*
# CarCenter PRO Finance - Expense Module DRE Refactor

## Overview
Refactors the expense module to be DRE-oriented, removes accounts-payable concepts,
and adds suppliers, cost-center-linked categories, and per-installment competence.

## Changes

### 1. New Table: `suppliers`
- `id` (uuid, PK)
- `name` (varchar 150, unique, NOT NULL)
- `active` (boolean, default true)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- RLS enabled with full CRUD for anon+authenticated (single-tenant app)

### 2. Modified Table: `expense_categories`
- Added `cost_center_id` (uuid, FK -> cost_centers, nullable)
- Links categories to cost centers for DRE structure

### 3. Modified Table: `expenses`
- Added `payment_date` (date, nullable) — date the expense was paid
- Added `supplier_id` (uuid, FK -> suppliers, nullable) — optional link to suppliers table
- `supplier` column relaxed to nullable (supplier is now optional)
- `description` column relaxed to nullable

### 4. Modified Table: `expense_installments`
- Added `competence_month` (smallint) — competence month for this installment
- Added `competence_year` (smallint) — competence year for this installment
- `paid` column default changed to true (all installments born paid)
- Existing unpaid installments updated to paid=true

### 5. Seed Data
- New cost centers: CPV, CSP, Deduções, IR/CSLL, Operacional
- New expense categories linked to cost centers with subcategories per spec

### 6. Security
- RLS enabled on `suppliers` with full CRUD for anon+authenticated
*/

-- ============================================================
-- 1. Suppliers table
-- ============================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(150) UNIQUE NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
CREATE INDEX IF NOT EXISTS idx_suppliers_active ON suppliers(active);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_suppliers" ON suppliers;
CREATE POLICY "select_suppliers" ON suppliers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_suppliers" ON suppliers;
CREATE POLICY "insert_suppliers" ON suppliers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_suppliers" ON suppliers;
CREATE POLICY "update_suppliers" ON suppliers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_suppliers" ON suppliers;
CREATE POLICY "delete_suppliers" ON suppliers FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- 2. Add cost_center_id to expense_categories
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expense_categories' AND column_name = 'cost_center_id'
  ) THEN
    ALTER TABLE expense_categories ADD COLUMN cost_center_id uuid REFERENCES cost_centers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- 3. Add payment_date and supplier_id to expenses, relax constraints
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'payment_date'
  ) THEN
    ALTER TABLE expenses ADD COLUMN payment_date date;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'supplier_id'
  ) THEN
    ALTER TABLE expenses ADD COLUMN supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  ALTER TABLE expenses ALTER COLUMN supplier DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE expenses ALTER COLUMN description DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_expenses_payment_date ON expenses(payment_date);
CREATE INDEX IF NOT EXISTS idx_expenses_supplier_id ON expenses(supplier_id);

-- ============================================================
-- 4. Add competence fields to expense_installments, default paid=true
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expense_installments' AND column_name = 'competence_month'
  ) THEN
    ALTER TABLE expense_installments ADD COLUMN competence_month smallint;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expense_installments' AND column_name = 'competence_year'
  ) THEN
    ALTER TABLE expense_installments ADD COLUMN competence_year smallint;
  END IF;
END $$;

DO $$
BEGIN
  ALTER TABLE expense_installments ALTER COLUMN paid SET DEFAULT true;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

UPDATE expense_installments SET paid = true WHERE paid = false;

CREATE INDEX IF NOT EXISTS idx_installments_competence ON expense_installments(competence_month, competence_year);

-- ============================================================
-- 5. SEED: New cost centers
-- ============================================================
INSERT INTO cost_centers (name) VALUES
  ('CPV'),
  ('CSP'),
  ('Deduções'),
  ('IR/CSLL'),
  ('Operacional')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 6. SEED: New expense categories linked to cost centers
-- ============================================================
INSERT INTO expense_categories (name, cost_center_id)
SELECT 'Compra de Peças', cc.id FROM cost_centers cc WHERE cc.name = 'CPV'
ON CONFLICT (name) DO NOTHING;

UPDATE expense_categories SET cost_center_id = (SELECT id FROM cost_centers WHERE name = 'CPV')
WHERE name = 'Compra de Peças' AND cost_center_id IS NULL;

INSERT INTO expense_categories (name, cost_center_id)
SELECT 'Serviço Terceirizado', cc.id FROM cost_centers cc WHERE cc.name = 'CSP'
ON CONFLICT (name) DO NOTHING;

UPDATE expense_categories SET cost_center_id = (SELECT id FROM cost_centers WHERE name = 'CSP')
WHERE name = 'Serviço Terceirizado' AND cost_center_id IS NULL;

INSERT INTO expense_categories (name, cost_center_id)
SELECT 'Impostos', cc.id FROM cost_centers cc WHERE cc.name = 'IR/CSLL'
ON CONFLICT (name) DO NOTHING;

UPDATE expense_categories SET cost_center_id = (SELECT id FROM cost_centers WHERE name = 'IR/CSLL')
WHERE name = 'Impostos' AND cost_center_id IS NULL;

-- Link existing categories to Operacional cost center
UPDATE expense_categories
SET cost_center_id = (SELECT id FROM cost_centers WHERE name = 'Operacional')
WHERE name IN ('Administrativas', 'Pessoal', 'Geral', 'Marketing', 'Aluguel', 'IPTU', 'Vendas')
  AND cost_center_id IS NULL;

-- Add new categories under Operacional
INSERT INTO expense_categories (name, cost_center_id)
SELECT 'Administrativo', cc.id FROM cost_centers cc WHERE cc.name = 'Operacional'
ON CONFLICT (name) DO NOTHING;

INSERT INTO expense_categories (name, cost_center_id)
SELECT 'Gerais', cc.id FROM cost_centers cc WHERE cc.name = 'Operacional'
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- 7. SEED: Subcategories
-- ============================================================
-- Administrativo subcategories
INSERT INTO expense_subcategories (category_id, name)
SELECT ec.id, sub.name FROM expense_categories ec
CROSS JOIN (VALUES ('Sistema'), ('Meio Ambiente'), ('Contador'), ('Advogado'), ('Coleta'), ('Vendas')) AS sub(name)
WHERE ec.name = 'Administrativo'
ON CONFLICT (category_id, name) DO NOTHING;

-- Vendas subcategories
INSERT INTO expense_subcategories (category_id, name)
SELECT ec.id, sub.name FROM expense_categories ec
CROSS JOIN (VALUES ('Taxa Maquininha'), ('Taxa Boleto'), ('Taxa Antecipação')) AS sub(name)
WHERE ec.name = 'Vendas'
ON CONFLICT (category_id, name) DO NOTHING;

-- Pessoal subcategories
INSERT INTO expense_subcategories (category_id, name)
SELECT ec.id, sub.name FROM expense_categories ec
CROSS JOIN (VALUES ('Salários'), ('Comissões'), ('Pró-labore'), ('Encargos da Folha')) AS sub(name)
WHERE ec.name = 'Pessoal'
ON CONFLICT (category_id, name) DO NOTHING;

-- Gerais subcategories
INSERT INTO expense_subcategories (category_id, name)
SELECT ec.id, sub.name FROM expense_categories ec
CROSS JOIN (VALUES ('Água'), ('Energia'), ('Telefone'), ('Internet'), ('Compra de Ferramentas'), ('Melhorias'), ('Limpeza')) AS sub(name)
WHERE ec.name = 'Gerais'
ON CONFLICT (category_id, name) DO NOTHING;

-- Marketing subcategories
INSERT INTO expense_subcategories (category_id, name)
SELECT ec.id, sub.name FROM expense_categories ec
CROSS JOIN (VALUES ('Empresa de Marketing'), ('Google'), ('Permutas')) AS sub(name)
WHERE ec.name = 'Marketing'
ON CONFLICT (category_id, name) DO NOTHING;

-- Compra de Peças subcategories
INSERT INTO expense_subcategories (category_id, name)
SELECT ec.id, sub.name FROM expense_categories ec
CROSS JOIN (VALUES ('Compra Pneus'), ('Compra Óleo'), ('Peças Geral')) AS sub(name)
WHERE ec.name = 'Compra de Peças'
ON CONFLICT (category_id, name) DO NOTHING;

-- Serviço Terceirizado subcategories
INSERT INTO expense_subcategories (category_id, name)
SELECT ec.id, sub.name FROM expense_categories ec
CROSS JOIN (VALUES ('Conserto de Rodas'), ('Torneiro')) AS sub(name)
WHERE ec.name = 'Serviço Terceirizado'
ON CONFLICT (category_id, name) DO NOTHING;

-- Impostos subcategories
INSERT INTO expense_subcategories (category_id, name)
SELECT ec.id, sub.name FROM expense_categories ec
CROSS JOIN (VALUES ('Imposto sobre Vendas'), ('Imposto sobre Serviços'), ('IR/CSLL')) AS sub(name)
WHERE ec.name = 'Impostos'
ON CONFLICT (category_id, name) DO NOTHING;