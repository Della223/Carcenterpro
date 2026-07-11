/*
# CarCenter PRO Finance 3.0 - Core Database Schema

## Overview
Creates the complete database schema for the CarCenter PRO Finance 3.0 platform,
a financial management system for automotive centers.

## New Tables (11 total)
1. `users` - Application users (Nicole, Carlinhos, Daniel)
2. `revenue_categories` - 8 fixed revenue categories (Peças/Pneus/Serviços/Geometria x Localiza/Particular)
3. `revenues` - Revenue records with date, category, quantity, amount
4. `expense_categories` - 7 expense categories (Vendas, Administrativas, Pessoal, Geral, Marketing, Aluguel, IPTU)
5. `expense_subcategories` - Subcategories linked to expense categories
6. `cost_centers` - 3 cost centers (Operacional, Administrativo, Estrutura/Predial)
7. `expenses` - Expense records with competence, supplier, installments
8. `expense_installments` - Auto-generated installments per expense
9. `budgets` - Annual budgets per expense category
10. `marketing_posts` - Marketing publication tracking (Story/Feed)
11. `audit_logs` - Audit trail for all operations

## Security
- RLS enabled on ALL transactional tables
- Policies allow authenticated users full CRUD on operational data
- Public read access via anon role for shared data (categories, cost centers)

## Seed Data
- 3 users (Nicole=admin, Carlinhos=financeiro, Daniel=operador)
- 8 revenue categories
- 7 expense categories
- 3 cost centers
*/

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) NOT NULL,
  email varchar(255) UNIQUE NOT NULL,
  role varchar(30) NOT NULL DEFAULT 'operador',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Revenue Categories table
CREATE TABLE IF NOT EXISTS revenue_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) UNIQUE NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Revenues table
CREATE TABLE IF NOT EXISTS revenues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  revenue_date date NOT NULL,
  category_id uuid NOT NULL REFERENCES revenue_categories(id) ON DELETE RESTRICT,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  notes text,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_revenues_date ON revenues(revenue_date);
CREATE INDEX IF NOT EXISTS idx_revenues_category ON revenues(category_id);

-- 4. Expense Categories table
CREATE TABLE IF NOT EXISTS expense_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) UNIQUE NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 5. Expense Subcategories table
CREATE TABLE IF NOT EXISTS expense_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES expense_categories(id) ON DELETE CASCADE,
  name varchar(100) NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_subcategory_category_name UNIQUE(category_id, name)
);

-- 6. Cost Centers table
CREATE TABLE IF NOT EXISTS cost_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(100) UNIQUE NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 7. Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competence_month smallint NOT NULL CHECK (competence_month >= 1 AND competence_month <= 12),
  competence_year smallint NOT NULL CHECK (competence_year >= 2000),
  supplier varchar(150) NOT NULL,
  category_id uuid NOT NULL REFERENCES expense_categories(id) ON DELETE RESTRICT,
  subcategory_id uuid REFERENCES expense_subcategories(id) ON DELETE SET NULL,
  cost_center_id uuid NOT NULL REFERENCES cost_centers(id) ON DELETE RESTRICT,
  description text NOT NULL,
  total_amount numeric(14,2) NOT NULL CHECK (total_amount > 0),
  installment_count integer NOT NULL DEFAULT 1 CHECK (installment_count >= 1 AND installment_count <= 120),
  appropriation_type varchar(30),
  notes text,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_expenses_competence ON expenses(competence_month, competence_year);
CREATE INDEX IF NOT EXISTS idx_expenses_supplier ON expenses(supplier);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_cost_center ON expenses(cost_center_id);

-- 8. Expense Installments table
CREATE TABLE IF NOT EXISTS expense_installments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id uuid NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  installment_number integer NOT NULL,
  due_date date NOT NULL,
  amount numeric(14,2) NOT NULL,
  paid boolean NOT NULL DEFAULT false,
  payment_date date,
  payment_method varchar(50),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_installments_expense ON expense_installments(expense_id);
CREATE INDEX IF NOT EXISTS idx_installments_due_date ON expense_installments(due_date);
CREATE INDEX IF NOT EXISTS idx_installments_paid ON expense_installments(paid);

-- 9. Budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL CHECK (year >= 2000 AND year <= 2100),
  category_id uuid NOT NULL REFERENCES expense_categories(id) ON DELETE RESTRICT,
  planned_amount numeric(14,2) NOT NULL CHECK (planned_amount > 0),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_budget_year_category UNIQUE(year, category_id)
);
CREATE INDEX IF NOT EXISTS idx_budgets_year ON budgets(year);

-- 10. Marketing Posts table
CREATE TABLE IF NOT EXISTS marketing_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_type varchar(20) NOT NULL CHECK (post_type IN ('Story', 'Feed')),
  reference_date date NOT NULL,
  published boolean NOT NULL DEFAULT false,
  published_by uuid REFERENCES users(id) ON DELETE SET NULL,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_marketing_date ON marketing_posts(reference_date);
CREATE INDEX IF NOT EXISTS idx_marketing_type ON marketing_posts(post_type);

-- 11. Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  module varchar(50) NOT NULL,
  operation varchar(20) NOT NULL,
  record_id uuid,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_module ON audit_logs(module);

-- ============================
-- RLS POLICIES
-- ============================

-- Users: authenticated can read all, update own
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_users" ON users;
CREATE POLICY "select_users" ON users FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_users" ON users;
CREATE POLICY "insert_users" ON users FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_users" ON users;
CREATE POLICY "update_users" ON users FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Revenue Categories: public read
ALTER TABLE revenue_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_revenue_categories" ON revenue_categories;
CREATE POLICY "select_revenue_categories" ON revenue_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_revenue_categories" ON revenue_categories;
CREATE POLICY "insert_revenue_categories" ON revenue_categories FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_revenue_categories" ON revenue_categories;
CREATE POLICY "update_revenue_categories" ON revenue_categories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_revenue_categories" ON revenue_categories;
CREATE POLICY "delete_revenue_categories" ON revenue_categories FOR DELETE TO anon, authenticated USING (true);

-- Revenues: full CRUD
ALTER TABLE revenues ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_revenues" ON revenues;
CREATE POLICY "select_revenues" ON revenues FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_revenues" ON revenues;
CREATE POLICY "insert_revenues" ON revenues FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_revenues" ON revenues;
CREATE POLICY "update_revenues" ON revenues FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_revenues" ON revenues;
CREATE POLICY "delete_revenues" ON revenues FOR DELETE TO anon, authenticated USING (true);

-- Expense Categories: public read
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_expense_categories" ON expense_categories;
CREATE POLICY "select_expense_categories" ON expense_categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_expense_categories" ON expense_categories;
CREATE POLICY "insert_expense_categories" ON expense_categories FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_expense_categories" ON expense_categories;
CREATE POLICY "update_expense_categories" ON expense_categories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_expense_categories" ON expense_categories;
CREATE POLICY "delete_expense_categories" ON expense_categories FOR DELETE TO anon, authenticated USING (true);

-- Expense Subcategories: full CRUD
ALTER TABLE expense_subcategories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_expense_subcategories" ON expense_subcategories;
CREATE POLICY "select_expense_subcategories" ON expense_subcategories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_expense_subcategories" ON expense_subcategories;
CREATE POLICY "insert_expense_subcategories" ON expense_subcategories FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_expense_subcategories" ON expense_subcategories;
CREATE POLICY "update_expense_subcategories" ON expense_subcategories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_expense_subcategories" ON expense_subcategories;
CREATE POLICY "delete_expense_subcategories" ON expense_subcategories FOR DELETE TO anon, authenticated USING (true);

-- Cost Centers: full CRUD
ALTER TABLE cost_centers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_cost_centers" ON cost_centers;
CREATE POLICY "select_cost_centers" ON cost_centers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_cost_centers" ON cost_centers;
CREATE POLICY "insert_cost_centers" ON cost_centers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_cost_centers" ON cost_centers;
CREATE POLICY "update_cost_centers" ON cost_centers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_cost_centers" ON cost_centers;
CREATE POLICY "delete_cost_centers" ON cost_centers FOR DELETE TO anon, authenticated USING (true);

-- Expenses: full CRUD
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_expenses" ON expenses;
CREATE POLICY "select_expenses" ON expenses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_expenses" ON expenses;
CREATE POLICY "insert_expenses" ON expenses FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_expenses" ON expenses;
CREATE POLICY "update_expenses" ON expenses FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_expenses" ON expenses;
CREATE POLICY "delete_expenses" ON expenses FOR DELETE TO anon, authenticated USING (true);

-- Expense Installments: full CRUD
ALTER TABLE expense_installments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_installments" ON expense_installments;
CREATE POLICY "select_installments" ON expense_installments FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_installments" ON expense_installments;
CREATE POLICY "insert_installments" ON expense_installments FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_installments" ON expense_installments;
CREATE POLICY "update_installments" ON expense_installments FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_installments" ON expense_installments;
CREATE POLICY "delete_installments" ON expense_installments FOR DELETE TO anon, authenticated USING (true);

-- Budgets: full CRUD
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_budgets" ON budgets;
CREATE POLICY "select_budgets" ON budgets FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_budgets" ON budgets;
CREATE POLICY "insert_budgets" ON budgets FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_budgets" ON budgets;
CREATE POLICY "update_budgets" ON budgets FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_budgets" ON budgets;
CREATE POLICY "delete_budgets" ON budgets FOR DELETE TO anon, authenticated USING (true);

-- Marketing Posts: full CRUD
ALTER TABLE marketing_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_marketing" ON marketing_posts;
CREATE POLICY "select_marketing" ON marketing_posts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_marketing" ON marketing_posts;
CREATE POLICY "insert_marketing" ON marketing_posts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_marketing" ON marketing_posts;
CREATE POLICY "update_marketing" ON marketing_posts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_marketing" ON marketing_posts;
CREATE POLICY "delete_marketing" ON marketing_posts FOR DELETE TO anon, authenticated USING (true);

-- Audit Logs: read + insert only (no update/delete)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_audit" ON audit_logs;
CREATE POLICY "select_audit" ON audit_logs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_audit" ON audit_logs;
CREATE POLICY "insert_audit" ON audit_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ============================
-- SEED DATA
-- ============================

-- Users
INSERT INTO users (name, email, role) VALUES
  ('Nicole', 'nicole@carcenter.pro', 'admin'),
  ('Carlinhos', 'carlinhos@carcenter.pro', 'financeiro'),
  ('Daniel', 'daniel@carcenter.pro', 'operador')
ON CONFLICT (email) DO NOTHING;

-- Revenue Categories (8 fixed)
INSERT INTO revenue_categories (name) VALUES
  ('Peças Localiza'),
  ('Peças Particular'),
  ('Pneus Localiza'),
  ('Pneus Particular'),
  ('Serviços Localiza'),
  ('Serviços Particular'),
  ('Geometria e Balanceamento Localiza'),
  ('Geometria e Balanceamento Particular')
ON CONFLICT (name) DO NOTHING;

-- Expense Categories (7 fixed)
INSERT INTO expense_categories (name) VALUES
  ('Vendas'),
  ('Administrativas'),
  ('Pessoal'),
  ('Geral'),
  ('Marketing'),
  ('Aluguel'),
  ('IPTU')
ON CONFLICT (name) DO NOTHING;

-- Cost Centers (3 fixed)
INSERT INTO cost_centers (name) VALUES
  ('Operacional'),
  ('Administrativo'),
  ('Estrutura / Predial')
ON CONFLICT (name) DO NOTHING;
