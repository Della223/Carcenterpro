/*
# CarCenter PRO Finance - Retiradas de Sócio Cost Center

## Overview
Separates partner/owner withdrawals (cash withdrawals, personal consórcio
payments, personal expenses — today mixed into the "Operacional" cost center
under the "Carlinhos/PARTICULAR" category) from the store's operational
performance. A dedicated cost center makes it possible to exclude these from
Resultado Operacional/Líquido everywhere (Dashboard, Home, DRE) while still
keeping the figures fully visible — reclassified, not hidden.

## Changes

### 1. New Cost Center: `Retiradas de Sócio`
Seeded via INSERT ... ON CONFLICT DO NOTHING, matching the pattern used for
the original CPV/CSP/Deduções/IR-CSLL/Operacional seed in migration 002.

### 2. Reclassify `Carlinhos/PARTICULAR`
Points the existing "Carlinhos/PARTICULAR" expense category at the new cost
center. This is a single-row UPDATE on `expense_categories` — no `expenses`
row is touched. Every historical expense already filed under this category
(past and present competências) is retroactively reclassified through the
existing category -> cost_center join, with zero risk of data loss or
duplication. If the category doesn't exist in a given environment, this is a
harmless no-op (0 rows affected).
*/

INSERT INTO cost_centers (name) VALUES ('Retiradas de Sócio')
ON CONFLICT (name) DO NOTHING;

UPDATE expense_categories
SET cost_center_id = (SELECT id FROM cost_centers WHERE name = 'Retiradas de Sócio')
WHERE name = 'Carlinhos/PARTICULAR';
