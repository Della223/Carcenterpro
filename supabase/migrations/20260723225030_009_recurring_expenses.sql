/*
# CarCenter PRO Finance - Recurring Expenses

## Overview
Adds support for recurring expenses (rent, accounting, payroll, utilities, etc).
A recurring expense is defined once; every month the system generates the next
month's occurrence automatically, repeating the last confirmed amount, flagged
as "pending confirmation" until a user validates or edits it.

## Changes

### 1. New Table: `recurring_expenses`
- Defines a recurring expense template: category, cost center, supplier, day of
  month it's due, last confirmed amount, and an optional end date.
- `last_confirmed_amount` is updated every time a user confirms/edits an
  occurrence, so the next auto-generated occurrence repeats the right value.

### 2. Modified Table: `expenses`
- Added `recurring_expense_id` (uuid, FK -> recurring_expenses, nullable) —
  links a generated occurrence back to its recurring definition.
- Added `confirmation_status` (varchar 20, NOT NULL, default 'confirmed') — one
  of 'confirmed', 'pending_confirmation'. Regular (non-recurring) expenses are
  always 'confirmed'. Auto-generated recurring occurrences start as
  'pending_confirmation' until the user validates the amount.

### 3. Security
- RLS enabled on `recurring_expenses` with full CRUD for anon+authenticated,
  matching the existing pattern used by `expenses` and `suppliers`.

## Notes
- Reporting queries (dashboard KPIs, DRE, expense KPIs) must exclude expenses
  with confirmation_status = 'pending_confirmation' from totals, since an
  unconfirmed value shouldn't be treated as an actual expense yet.
*/

CREATE TABLE IF NOT EXISTS recurring_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description varchar(200) NOT NULL,
  category_id uuid NOT NULL REFERENCES expense_categories(id) ON DELETE RESTRICT,
  subcategory_id uuid REFERENCES expense_subcategories(id) ON DELETE SET NULL,
  cost_center_id uuid NOT NULL REFERENCES cost_centers(id) ON DELETE RESTRICT,
  supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  supplier varchar(150),
  due_day smallint NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  last_confirmed_amount numeric(14,2) NOT NULL CHECK (last_confirmed_amount > 0),
  start_month smallint NOT NULL CHECK (start_month >= 1 AND start_month <= 12),
  start_year smallint NOT NULL CHECK (start_year >= 2000),
  end_date date,
  active boolean NOT NULL DEFAULT true,
  notes text,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recurring_expenses_active ON recurring_expenses(active);

ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_recurring_expenses" ON recurring_expenses;
CREATE POLICY "select_recurring_expenses" ON recurring_expenses FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "insert_recurring_expenses" ON recurring_expenses;
CREATE POLICY "insert_recurring_expenses" ON recurring_expenses FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_recurring_expenses" ON recurring_expenses;
CREATE POLICY "update_recurring_expenses" ON recurring_expenses FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_recurring_expenses" ON recurring_expenses;
CREATE POLICY "delete_recurring_expenses" ON recurring_expenses FOR DELETE TO anon, authenticated USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'recurring_expense_id'
  ) THEN
    ALTER TABLE expenses ADD COLUMN recurring_expense_id uuid REFERENCES recurring_expenses(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'confirmation_status'
  ) THEN
    ALTER TABLE expenses ADD COLUMN confirmation_status varchar(20) NOT NULL DEFAULT 'confirmed';
  END IF;
END $$;

ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_confirmation_status_check;
ALTER TABLE expenses ADD CONSTRAINT expenses_confirmation_status_check
  CHECK (confirmation_status IN ('confirmed', 'pending_confirmation'));

CREATE INDEX IF NOT EXISTS idx_expenses_recurring_expense_id ON expenses(recurring_expense_id);
CREATE INDEX IF NOT EXISTS idx_expenses_confirmation_status ON expenses(confirmation_status);
