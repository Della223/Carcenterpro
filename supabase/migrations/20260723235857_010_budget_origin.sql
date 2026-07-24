/*
# CarCenter PRO Finance - Automatic Budgets (3-Month Moving Average)

## Overview
Adds an origin flag to budgets so the system can suggest an annual budget per
category automatically (based on the last 3 closed months of actual spend),
while letting the user override any category's value manually at any time.

## Changes

### 1. Modified Table: `budgets`
- Added `origin` (varchar 20, NOT NULL, default 'manual') — one of 'automatico',
  'manual'. Existing rows default to 'manual' since they were user-entered.
  When the user edits a budget's value directly, it's marked 'manual' and the
  automatic recalculation stops overwriting it until the user opts back into
  'automatico'.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'origin'
  ) THEN
    ALTER TABLE budgets ADD COLUMN origin varchar(20) NOT NULL DEFAULT 'manual';
  END IF;
END $$;

ALTER TABLE budgets DROP CONSTRAINT IF EXISTS budgets_origin_check;
ALTER TABLE budgets ADD CONSTRAINT budgets_origin_check
  CHECK (origin IN ('automatico', 'manual'));
