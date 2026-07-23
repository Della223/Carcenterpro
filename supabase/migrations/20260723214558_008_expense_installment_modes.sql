/*
# CarCenter PRO Finance - Expense Installment Modes

## Overview
Adds support for irregular installment schedules on expenses, in addition to
the existing fixed monthly schedule.

## Changes

### 1. Modified Table: `expenses`
- Added `installment_mode` (varchar 20, NOT NULL, default 'monthly') — one of
  'monthly', 'fixed_days', 'custom'
- Added `installment_interval_days` (integer, nullable) — used when
  installment_mode = 'fixed_days'; number of days between each installment
- Added CHECK constraint restricting installment_mode to the three known values

## Notes
- 'monthly': existing behavior, keeps the day of month and adds 1 month per installment
- 'fixed_days': due_date = payment_date + (installment_interval_days * installment_number)
- 'custom': due dates are entered manually per installment at creation time and
  stored as-is in expense_installments.due_date; installment_interval_days is unused
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'installment_mode'
  ) THEN
    ALTER TABLE expenses ADD COLUMN installment_mode varchar(20) NOT NULL DEFAULT 'monthly';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'installment_interval_days'
  ) THEN
    ALTER TABLE expenses ADD COLUMN installment_interval_days integer;
  END IF;
END $$;

ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_installment_mode_check;
ALTER TABLE expenses ADD CONSTRAINT expenses_installment_mode_check
  CHECK (installment_mode IN ('monthly', 'fixed_days', 'custom'));
