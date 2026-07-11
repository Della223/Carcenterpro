/*
# CarCenter PRO Finance - Marketing Intelligence & Home Intelligence

## Overview
Extends the marketing module to support Reels and Campaigns, adds marketing KPIs tracking,
and creates an Instagram Business integration table for future OAuth-based API connection.

## Changes

### 1. Modified Table: `marketing_posts`
- `post_type` CHECK constraint expanded to include 'Reel' and 'Campanha'
- Existing 'Story' and 'Feed' values remain valid

### 2. New Table: `marketing_kpis`
Tracks marketing performance metrics per week/month.
- `id` (uuid, PK)
- `reference_date` (date, NOT NULL) — the date of the KPI record
- `period_type` (varchar 10) — 'weekly' or 'monthly'
- `stories_count` (integer, default 0)
- `feed_count` (integer, default 0)
- `reels_count` (integer, default 0)
- `campaigns_count` (integer, default 0)
- `followers` (integer, default 0)
- `reach` (integer, default 0)
- `engagement` (numeric 8,2, default 0) — engagement rate percentage
- `weekly_goal` (integer, default 0) — weekly Stories goal
- `monthly_goal` (integer, default 0) — monthly goal
- `created_at`, `updated_at` (timestamptz)

### 3. New Table: `instagram_integration`
Stores OAuth credentials for Instagram Business API connection.
- `id` (uuid, PK)
- `instagram_business_id` (varchar 255, nullable)
- `facebook_page_id` (varchar 255, nullable)
- `access_token` (text, nullable) — encrypted in production
- `refresh_token` (text, nullable)
- `token_expires_at` (timestamptz, nullable)
- `connected` (boolean, default false)
- `connected_at` (timestamptz, nullable)
- `disconnected_at` (timestamptz, nullable)
- `created_at`, `updated_at` (timestamptz)

### 4. Security
- RLS enabled on both new tables with full CRUD for anon+authenticated
*/

-- ============================================================
-- 1. Expand marketing_posts post_type constraint
-- ============================================================
DO $$
BEGIN
  -- Drop old constraint and add new one with Reel and Campanha
  ALTER TABLE marketing_posts DROP CONSTRAINT IF EXISTS marketing_posts_post_type_check;
  ALTER TABLE marketing_posts ADD CONSTRAINT marketing_posts_post_type_check
    CHECK (post_type IN ('Story', 'Feed', 'Reel', 'Campanha'));
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- ============================================================
-- 2. marketing_kpis table
-- ============================================================
CREATE TABLE IF NOT EXISTS marketing_kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_date date NOT NULL,
  period_type varchar(10) NOT NULL DEFAULT 'weekly' CHECK (period_type IN ('weekly', 'monthly')),
  stories_count integer NOT NULL DEFAULT 0,
  feed_count integer NOT NULL DEFAULT 0,
  reels_count integer NOT NULL DEFAULT 0,
  campaigns_count integer NOT NULL DEFAULT 0,
  followers integer NOT NULL DEFAULT 0,
  reach integer NOT NULL DEFAULT 0,
  engagement numeric(8,2) NOT NULL DEFAULT 0,
  weekly_goal integer NOT NULL DEFAULT 0,
  monthly_goal integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketing_kpis_date ON marketing_kpis(reference_date);
CREATE INDEX IF NOT EXISTS idx_marketing_kpis_period ON marketing_kpis(period_type);

ALTER TABLE marketing_kpis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_marketing_kpis" ON marketing_kpis;
CREATE POLICY "select_marketing_kpis" ON marketing_kpis FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_marketing_kpis" ON marketing_kpis;
CREATE POLICY "insert_marketing_kpis" ON marketing_kpis FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_marketing_kpis" ON marketing_kpis;
CREATE POLICY "update_marketing_kpis" ON marketing_kpis FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_marketing_kpis" ON marketing_kpis;
CREATE POLICY "delete_marketing_kpis" ON marketing_kpis FOR DELETE TO anon, authenticated USING (true);

-- ============================================================
-- 3. instagram_integration table
-- ============================================================
CREATE TABLE IF NOT EXISTS instagram_integration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_business_id varchar(255),
  facebook_page_id varchar(255),
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  connected boolean NOT NULL DEFAULT false,
  connected_at timestamptz,
  disconnected_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE instagram_integration ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_instagram_integration" ON instagram_integration;
CREATE POLICY "select_instagram_integration" ON instagram_integration FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_instagram_integration" ON instagram_integration;
CREATE POLICY "insert_instagram_integration" ON instagram_integration FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_instagram_integration" ON instagram_integration;
CREATE POLICY "update_instagram_integration" ON instagram_integration FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_instagram_integration" ON instagram_integration;
CREATE POLICY "delete_instagram_integration" ON instagram_integration FOR DELETE TO anon, authenticated USING (true);
