/*
# CarCenter PRO Finance - Fix Expenses Cost Center Snapshot

## Overview
Root cause of the "Carlinhos/PARTICULAR still shows under Operacional in the
DRE" issue, found by adding a diagnostic console.log to
`dre.service.ts:classifyCostCenter` and confirming the joined cost center
name was always a real value, never "Retiradas de Sócio" — for any expense.

`expenses.cost_center_id` is its OWN column (NOT NULL, FK to cost_centers),
set once when each expense is created — independent of, and never
resynced with, `expense_categories.cost_center_id`. Migrations 014 and 015
only updated the category's cost center, which only affects expenses created
from now on. Every expense already filed under "Carlinhos/PARTICULAR" still
carries its original snapshot ("Operacional"'s id).

## Fix
Retroactively updates `expenses.cost_center_id` to "Retiradas de Sócio" for
every expense whose category is "Carlinhos/PARTICULAR" (matched via the same
whitespace/case-normalized comparison as migration 015, joining through
`expense_categories.name` rather than trusting an exact string). Guarded to
only touch rows that actually need it, so re-running this migration is a
no-op the second time.
*/

UPDATE expenses e
SET cost_center_id = (SELECT id FROM cost_centers WHERE name = 'Retiradas de Sócio'),
    updated_at = now()
FROM expense_categories ec
WHERE e.category_id = ec.id
  AND regexp_replace(lower(ec.name), '\s+', '', 'g') = regexp_replace(lower('Carlinhos/PARTICULAR'), '\s+', '', 'g')
  AND e.cost_center_id IS DISTINCT FROM (SELECT id FROM cost_centers WHERE name = 'Retiradas de Sócio');
