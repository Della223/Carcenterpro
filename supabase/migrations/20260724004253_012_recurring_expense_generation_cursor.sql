/*
# CarCenter PRO Finance - Recurring Expense Generation Cursor

## Overview
Fixes a bug where deleting a recurring expense's occurrence (a row in
`expenses` with `recurring_expense_id` set) would come back the next time the
app generated pending occurrences (new page load / new login), because the
generator determined "where to resume from" by looking at
MAX(competence_month, competence_year) among the recurring expense's existing
`expenses` rows. Deleting the most recent occurrence made the generator think
that month/year still needed to be generated, so it silently recreated it.

## Changes

### 1. Modified Table: `recurring_expenses`
- Added `last_generated_month` / `last_generated_year` (smallint, NOT NULL) —
  an explicit cursor tracking the most recent competence period the generator
  has produced for this recurring expense, independent of whether that
  occurrence's `expenses` row still exists. Deleting an occurrence no longer
  makes the generator regenerate it, since the cursor only ever advances
  forward and is never inferred from currently-existing rows.

## Data migration
Backfills the cursor for existing recurring expenses from the actual max
generated occurrence in `expenses` (falling back to `start_month`/`start_year`
for a recurring expense with no occurrences at all, which shouldn't normally
happen since the first occurrence is created together with the definition).
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recurring_expenses' AND column_name = 'last_generated_month'
  ) THEN
    ALTER TABLE recurring_expenses ADD COLUMN last_generated_month smallint;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'recurring_expenses' AND column_name = 'last_generated_year'
  ) THEN
    ALTER TABLE recurring_expenses ADD COLUMN last_generated_year smallint;
  END IF;
END $$;

-- Backfill from the actual latest generated occurrence still present in `expenses`.
UPDATE recurring_expenses r
SET last_generated_year = sub.year,
    last_generated_month = sub.month
FROM (
  SELECT DISTINCT ON (recurring_expense_id)
    recurring_expense_id,
    competence_year AS year,
    competence_month AS month
  FROM expenses
  WHERE recurring_expense_id IS NOT NULL
  ORDER BY recurring_expense_id, competence_year DESC, competence_month DESC
) sub
WHERE r.id = sub.recurring_expense_id
  AND r.last_generated_month IS NULL;

-- Recurring expenses with no occurrences left at all (shouldn't normally
-- happen) fall back to their own start month/year.
UPDATE recurring_expenses
SET last_generated_month = start_month, last_generated_year = start_year
WHERE last_generated_month IS NULL;

ALTER TABLE recurring_expenses ALTER COLUMN last_generated_month SET NOT NULL;
ALTER TABLE recurring_expenses ALTER COLUMN last_generated_year SET NOT NULL;

ALTER TABLE recurring_expenses DROP CONSTRAINT IF EXISTS recurring_expenses_last_generated_month_check;
ALTER TABLE recurring_expenses ADD CONSTRAINT recurring_expenses_last_generated_month_check
  CHECK (last_generated_month >= 1 AND last_generated_month <= 12);
