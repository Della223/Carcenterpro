/*
# Link users table to Supabase Auth + secure RLS

## Purpose
This migration connects the existing `users` table to Supabase Auth's `auth.users` table,
enabling real email/password authentication. It also tightens RLS policies to require
authentication and adds admin-only management policies.

## Changes

### 1. Add `auth_id` column to `users` table
- New column: `auth_id` (uuid, nullable, references `auth.users(id)` ON DELETE CASCADE)
- This links the application profile to the Supabase Auth user
- Existing records are preserved (column is nullable for backward compatibility)

### 2. Add unique index on `auth_id`
- Ensures one profile per auth user

### 3. Update RLS policies on `users` table
- Remove old anon-accessible policies
- Add authenticated-only policies:
  - SELECT: any authenticated user can read all profiles (needed for user management)
  - UPDATE: users can update their own profile, admins can update any
  - INSERT: admins can insert new profiles
  - DELETE: admins can delete profiles

### 4. Add helper function: `is_admin()`
- Returns true if the current authenticated user has role 'admin' in the users table
- Used by RLS policies for admin-only operations

### 5. Update RLS on all data tables
- revenues, expenses, expense_installments, revenue_categories, expense_categories,
  expense_subcategories, cost_centers, suppliers, budgets, audit_logs, marketing_posts,
  marketing_kpis, instagram_integration:
  - Change from anon+authenticated to authenticated-only
  - All authenticated users share the same business data (single-tenant)

### Security
- All data now requires authentication
- Admin-only operations (user management) are enforced via the `is_admin()` helper
- No data is lost — existing records keep their values
*/

-- ============================================================
-- 1. Add auth_id column to users table
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'auth_id'
  ) THEN
    ALTER TABLE users ADD COLUMN auth_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS users_auth_id_unique ON users (auth_id) WHERE auth_id IS NOT NULL;

-- ============================================================
-- 2. Helper function: is_admin()
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_id = auth.uid() AND role = 'admin' AND active = true
  );
$$;

-- ============================================================
-- 3. Update RLS policies on users table
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_users" ON users;
DROP POLICY IF EXISTS "anon_insert_users" ON users;
DROP POLICY IF EXISTS "anon_update_users" ON users;
DROP POLICY IF EXISTS "anon_delete_users" ON users;

DROP POLICY IF EXISTS "authenticated_select_users" ON users;
CREATE POLICY "authenticated_select_users"
  ON users FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_update_users" ON users;
CREATE POLICY "authenticated_update_users"
  ON users FOR UPDATE TO authenticated
  USING (auth.uid() = auth_id OR is_admin())
  WITH CHECK (auth.uid() = auth_id OR is_admin());

DROP POLICY IF EXISTS "admin_insert_users" ON users;
CREATE POLICY "admin_insert_users"
  ON users FOR INSERT TO authenticated
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "admin_delete_users" ON users;
CREATE POLICY "admin_delete_users"
  ON users FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- 4. revenues
-- ============================================================
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_revenues" ON revenues;
DROP POLICY IF EXISTS "anon_insert_revenues" ON revenues;
DROP POLICY IF EXISTS "anon_update_revenues" ON revenues;
DROP POLICY IF EXISTS "anon_delete_revenues" ON revenues;

DROP POLICY IF EXISTS "auth_select_revenues" ON revenues;
CREATE POLICY "auth_select_revenues" ON revenues FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_revenues" ON revenues;
CREATE POLICY "auth_insert_revenues" ON revenues FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_revenues" ON revenues;
CREATE POLICY "auth_update_revenues" ON revenues FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_revenues" ON revenues;
CREATE POLICY "auth_delete_revenues" ON revenues FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 5. expenses
-- ============================================================
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_expenses" ON expenses;
DROP POLICY IF EXISTS "anon_insert_expenses" ON expenses;
DROP POLICY IF EXISTS "anon_update_expenses" ON expenses;
DROP POLICY IF EXISTS "anon_delete_expenses" ON expenses;

DROP POLICY IF EXISTS "auth_select_expenses" ON expenses;
CREATE POLICY "auth_select_expenses" ON expenses FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_expenses" ON expenses;
CREATE POLICY "auth_insert_expenses" ON expenses FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_expenses" ON expenses;
CREATE POLICY "auth_update_expenses" ON expenses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_expenses" ON expenses;
CREATE POLICY "auth_delete_expenses" ON expenses FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 6. expense_installments
-- ============================================================
ALTER TABLE expense_installments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_expense_installments" ON expense_installments;
DROP POLICY IF EXISTS "anon_insert_expense_installments" ON expense_installments;
DROP POLICY IF EXISTS "anon_update_expense_installments" ON expense_installments;
DROP POLICY IF EXISTS "anon_delete_expense_installments" ON expense_installments;

DROP POLICY IF EXISTS "auth_select_expense_installments" ON expense_installments;
CREATE POLICY "auth_select_expense_installments" ON expense_installments FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_expense_installments" ON expense_installments;
CREATE POLICY "auth_insert_expense_installments" ON expense_installments FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_expense_installments" ON expense_installments;
CREATE POLICY "auth_update_expense_installments" ON expense_installments FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_expense_installments" ON expense_installments;
CREATE POLICY "auth_delete_expense_installments" ON expense_installments FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 7. revenue_categories
-- ============================================================
ALTER TABLE revenue_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_revenue_categories" ON revenue_categories;
DROP POLICY IF EXISTS "anon_insert_revenue_categories" ON revenue_categories;
DROP POLICY IF EXISTS "anon_update_revenue_categories" ON revenue_categories;
DROP POLICY IF EXISTS "anon_delete_revenue_categories" ON revenue_categories;

DROP POLICY IF EXISTS "auth_select_revenue_categories" ON revenue_categories;
CREATE POLICY "auth_select_revenue_categories" ON revenue_categories FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_revenue_categories" ON revenue_categories;
CREATE POLICY "auth_insert_revenue_categories" ON revenue_categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_revenue_categories" ON revenue_categories;
CREATE POLICY "auth_update_revenue_categories" ON revenue_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_revenue_categories" ON revenue_categories;
CREATE POLICY "auth_delete_revenue_categories" ON revenue_categories FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 8. expense_categories
-- ============================================================
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_expense_categories" ON expense_categories;
DROP POLICY IF EXISTS "anon_insert_expense_categories" ON expense_categories;
DROP POLICY IF EXISTS "anon_update_expense_categories" ON expense_categories;
DROP POLICY IF EXISTS "anon_delete_expense_categories" ON expense_categories;

DROP POLICY IF EXISTS "auth_select_expense_categories" ON expense_categories;
CREATE POLICY "auth_select_expense_categories" ON expense_categories FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_expense_categories" ON expense_categories;
CREATE POLICY "auth_insert_expense_categories" ON expense_categories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_expense_categories" ON expense_categories;
CREATE POLICY "auth_update_expense_categories" ON expense_categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_expense_categories" ON expense_categories;
CREATE POLICY "auth_delete_expense_categories" ON expense_categories FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 9. expense_subcategories
-- ============================================================
ALTER TABLE expense_subcategories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_expense_subcategories" ON expense_subcategories;
DROP POLICY IF EXISTS "anon_insert_expense_subcategories" ON expense_subcategories;
DROP POLICY IF EXISTS "anon_update_expense_subcategories" ON expense_subcategories;
DROP POLICY IF EXISTS "anon_delete_expense_subcategories" ON expense_subcategories;

DROP POLICY IF EXISTS "auth_select_expense_subcategories" ON expense_subcategories;
CREATE POLICY "auth_select_expense_subcategories" ON expense_subcategories FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_expense_subcategories" ON expense_subcategories;
CREATE POLICY "auth_insert_expense_subcategories" ON expense_subcategories FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_expense_subcategories" ON expense_subcategories;
CREATE POLICY "auth_update_expense_subcategories" ON expense_subcategories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_expense_subcategories" ON expense_subcategories;
CREATE POLICY "auth_delete_expense_subcategories" ON expense_subcategories FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 10. cost_centers
-- ============================================================
ALTER TABLE cost_centers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_cost_centers" ON cost_centers;
DROP POLICY IF EXISTS "anon_insert_cost_centers" ON cost_centers;
DROP POLICY IF EXISTS "anon_update_cost_centers" ON cost_centers;
DROP POLICY IF EXISTS "anon_delete_cost_centers" ON cost_centers;

DROP POLICY IF EXISTS "auth_select_cost_centers" ON cost_centers;
CREATE POLICY "auth_select_cost_centers" ON cost_centers FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_cost_centers" ON cost_centers;
CREATE POLICY "auth_insert_cost_centers" ON cost_centers FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_cost_centers" ON cost_centers;
CREATE POLICY "auth_update_cost_centers" ON cost_centers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_cost_centers" ON cost_centers;
CREATE POLICY "auth_delete_cost_centers" ON cost_centers FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 11. suppliers
-- ============================================================
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_suppliers" ON suppliers;
DROP POLICY IF EXISTS "anon_insert_suppliers" ON suppliers;
DROP POLICY IF EXISTS "anon_update_suppliers" ON suppliers;
DROP POLICY IF EXISTS "anon_delete_suppliers" ON suppliers;

DROP POLICY IF EXISTS "auth_select_suppliers" ON suppliers;
CREATE POLICY "auth_select_suppliers" ON suppliers FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_suppliers" ON suppliers;
CREATE POLICY "auth_insert_suppliers" ON suppliers FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_suppliers" ON suppliers;
CREATE POLICY "auth_update_suppliers" ON suppliers FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_suppliers" ON suppliers;
CREATE POLICY "auth_delete_suppliers" ON suppliers FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 12. budgets
-- ============================================================
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_budgets" ON budgets;
DROP POLICY IF EXISTS "anon_insert_budgets" ON budgets;
DROP POLICY IF EXISTS "anon_update_budgets" ON budgets;
DROP POLICY IF EXISTS "anon_delete_budgets" ON budgets;

DROP POLICY IF EXISTS "auth_select_budgets" ON budgets;
CREATE POLICY "auth_select_budgets" ON budgets FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_budgets" ON budgets;
CREATE POLICY "auth_insert_budgets" ON budgets FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_budgets" ON budgets;
CREATE POLICY "auth_update_budgets" ON budgets FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_budgets" ON budgets;
CREATE POLICY "auth_delete_budgets" ON budgets FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 13. audit_logs (read-only: insert + select only, no update/delete)
-- ============================================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_audit_logs" ON audit_logs;
DROP POLICY IF EXISTS "anon_insert_audit_logs" ON audit_logs;
DROP POLICY IF EXISTS "anon_update_audit_logs" ON audit_logs;
DROP POLICY IF EXISTS "anon_delete_audit_logs" ON audit_logs;

DROP POLICY IF EXISTS "auth_select_audit_logs" ON audit_logs;
CREATE POLICY "auth_select_audit_logs" ON audit_logs FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_audit_logs" ON audit_logs;
CREATE POLICY "auth_insert_audit_logs" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- 14. marketing_posts
-- ============================================================
ALTER TABLE marketing_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_marketing_posts" ON marketing_posts;
DROP POLICY IF EXISTS "anon_insert_marketing_posts" ON marketing_posts;
DROP POLICY IF EXISTS "anon_update_marketing_posts" ON marketing_posts;
DROP POLICY IF EXISTS "anon_delete_marketing_posts" ON marketing_posts;

DROP POLICY IF EXISTS "auth_select_marketing_posts" ON marketing_posts;
CREATE POLICY "auth_select_marketing_posts" ON marketing_posts FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_marketing_posts" ON marketing_posts;
CREATE POLICY "auth_insert_marketing_posts" ON marketing_posts FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_marketing_posts" ON marketing_posts;
CREATE POLICY "auth_update_marketing_posts" ON marketing_posts FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_marketing_posts" ON marketing_posts;
CREATE POLICY "auth_delete_marketing_posts" ON marketing_posts FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 15. marketing_kpis
-- ============================================================
ALTER TABLE marketing_kpis ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_marketing_kpis" ON marketing_kpis;
DROP POLICY IF EXISTS "anon_insert_marketing_kpis" ON marketing_kpis;
DROP POLICY IF EXISTS "anon_update_marketing_kpis" ON marketing_kpis;
DROP POLICY IF EXISTS "anon_delete_marketing_kpis" ON marketing_kpis;

DROP POLICY IF EXISTS "auth_select_marketing_kpis" ON marketing_kpis;
CREATE POLICY "auth_select_marketing_kpis" ON marketing_kpis FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_marketing_kpis" ON marketing_kpis;
CREATE POLICY "auth_insert_marketing_kpis" ON marketing_kpis FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_marketing_kpis" ON marketing_kpis;
CREATE POLICY "auth_update_marketing_kpis" ON marketing_kpis FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_marketing_kpis" ON marketing_kpis;
CREATE POLICY "auth_delete_marketing_kpis" ON marketing_kpis FOR DELETE TO authenticated USING (true);

-- ============================================================
-- 16. instagram_integration
-- ============================================================
ALTER TABLE instagram_integration ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_instagram_integration" ON instagram_integration;
DROP POLICY IF EXISTS "anon_insert_instagram_integration" ON instagram_integration;
DROP POLICY IF EXISTS "anon_update_instagram_integration" ON instagram_integration;
DROP POLICY IF EXISTS "anon_delete_instagram_integration" ON instagram_integration;

DROP POLICY IF EXISTS "auth_select_instagram_integration" ON instagram_integration;
CREATE POLICY "auth_select_instagram_integration" ON instagram_integration FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_instagram_integration" ON instagram_integration;
CREATE POLICY "auth_insert_instagram_integration" ON instagram_integration FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_instagram_integration" ON instagram_integration;
CREATE POLICY "auth_update_instagram_integration" ON instagram_integration FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_instagram_integration" ON instagram_integration;
CREATE POLICY "auth_delete_instagram_integration" ON instagram_integration FOR DELETE TO authenticated USING (true);
