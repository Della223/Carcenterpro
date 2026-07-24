/*
# CarCenter PRO Finance - Monthly Budget Granularity

## Overview
Replaces the annual budget-per-category model with a monthly one: each budget
row is now scoped to (year, month, category). This corrects the automatic
suggestion introduced previously (which annualized a 3-month average and
compared it against a single month's actual spend, an apples-to-oranges
comparison) — the suggestion is now itself monthly, comparable directly
against the month's actual spend.

## Changes

### 1. Modified Table: `budgets`
- Added `month` (smallint, CHECK 1-31... 1-12) — NOT NULL after backfill.
- Unique constraint moved from (year, category_id) to (year, month, category_id).

### 2. Data migration
- Deletes existing 'automatico' budgets (they were annualized under the old
  approach and are meaningless under the monthly model; a correct monthly
  suggestion is regenerated on-demand next time the Orçamentos screen loads).
- Converts existing 'manual' budgets (previously annual figures the user set
  on purpose):
  - For the CURRENT year: one row for the CURRENT month, planned_amount
    divided by 12 (an approximation — flagged to the user for review). Other
    months of the current year are left unset; they'll be filled in as the
    user opens each month (automatic suggestion, or manual entry).
  - For any OTHER year (already-closed exercícios): replicated across all 12
    months of that year (divided by 12 each), since there's no "current
    month" concept for a non-current year and leaving those months blank
    would make historical browsing look incomplete.

## Important operational note
Step "current month" is evaluated at the moment this migration runs. Apply it
together with the corresponding application deploy so the two don't drift
apart on which month is "current".
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'month'
  ) THEN
    ALTER TABLE budgets ADD COLUMN month smallint;
  END IF;
END $$;

-- Discard the annualized 'automatico' budgets from the previous approach.
-- Scoped to month IS NULL so a re-run after the monthly model is live won't
-- delete freshly (correctly) generated automatic budgets.
DELETE FROM budgets WHERE origin = 'automatico' AND month IS NULL;

-- Drop the old (year, category_id) uniqueness so the data migration below can
-- create multiple months per category/year.
ALTER TABLE budgets DROP CONSTRAINT IF EXISTS uq_budget_year_category;

-- Current-year manual budgets: one row for the current month.
UPDATE budgets
SET month = EXTRACT(MONTH FROM now())::smallint,
    planned_amount = ROUND(planned_amount / 12, 2),
    updated_at = now()
WHERE origin = 'manual'
  AND month IS NULL
  AND year = EXTRACT(YEAR FROM now())::int;

-- Other-year manual budgets: replicate across all 12 months of that year.
INSERT INTO budgets (year, month, category_id, planned_amount, origin, created_by, created_at, updated_at)
SELECT b.year, gs.month, b.category_id, ROUND(b.planned_amount / 12, 2), 'manual', b.created_by, b.created_at, now()
FROM budgets b
CROSS JOIN generate_series(1, 12) AS gs(month)
WHERE b.origin = 'manual' AND b.month IS NULL;

-- Remove the now-superseded single-row-per-year originals for other years.
DELETE FROM budgets WHERE origin = 'manual' AND month IS NULL;

ALTER TABLE budgets ALTER COLUMN month SET NOT NULL;

ALTER TABLE budgets DROP CONSTRAINT IF EXISTS budgets_month_check;
ALTER TABLE budgets ADD CONSTRAINT budgets_month_check CHECK (month >= 1 AND month <= 12);

ALTER TABLE budgets DROP CONSTRAINT IF EXISTS uq_budget_year_month_category;
ALTER TABLE budgets ADD CONSTRAINT uq_budget_year_month_category UNIQUE (year, month, category_id);

CREATE INDEX IF NOT EXISTS idx_budgets_year_month ON budgets(year, month);
