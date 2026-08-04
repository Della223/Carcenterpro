/*
# CarCenter PRO Finance - Revenue Items (Multi-Subcategory Sales)

## Overview
Allows a single sale ("venda") to contain multiple items, each with its own
subcategory, quantity and value — e.g. a customer who bought tire replacement +
alignment + a part in one visit, previously requiring 3 separate `revenues`
rows. `revenues` becomes the sale header (date, main category, competence);
the per-subcategory breakdown moves to the new `revenue_items` table.

## Changes

### 1. New Table: `revenue_items`
- `revenue_id` (uuid, FK -> revenues, ON DELETE CASCADE)
- `subcategory_id` (uuid, FK -> revenue_subcategories, NOT NULL)
- `quantity`, `amount` — same shape as the columns they replace on `revenues`
- RLS: authenticated CRUD, matching the rest of the schema.

### 2. `revenues` table: unchanged, repurposed
No columns added, removed, or altered. `amount` becomes a denormalized total
of the sale's items (kept in sync by the application, the same way
`expenses.total_amount` relates to `expense_installments` — not by a DB
trigger). `subcategory_id`/`quantity` on `revenues` are left in place
untouched but are no longer the source of truth once a sale has more than one
item; they stay only for any legacy code path that still reads them directly.

## Data migration — purely additive, fully reversible
For every existing `revenues` row, inserts exactly one corresponding
`revenue_items` row copying its subcategory_id/quantity/amount, i.e. every
pre-existing revenue becomes "a sale with 1 item" automatically. This step
never updates, deletes, or alters a single `revenues` row — it only inserts
into the new table. If anything about this migration needs to be undone,
`DROP TABLE revenue_items` fully reverts it with zero impact on `revenues`.
*/

CREATE TABLE IF NOT EXISTS revenue_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  revenue_id uuid NOT NULL REFERENCES revenues(id) ON DELETE CASCADE,
  subcategory_id uuid NOT NULL REFERENCES revenue_subcategories(id) ON DELETE RESTRICT,
  quantity integer NOT NULL DEFAULT 1 CHECK (quantity >= 0),
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_revenue_items_revenue_id ON revenue_items(revenue_id);
CREATE INDEX IF NOT EXISTS idx_revenue_items_subcategory_id ON revenue_items(subcategory_id);

ALTER TABLE revenue_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_revenue_items" ON revenue_items;
CREATE POLICY "select_revenue_items" ON revenue_items FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "insert_revenue_items" ON revenue_items;
CREATE POLICY "insert_revenue_items" ON revenue_items FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "update_revenue_items" ON revenue_items;
CREATE POLICY "update_revenue_items" ON revenue_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "delete_revenue_items" ON revenue_items;
CREATE POLICY "delete_revenue_items" ON revenue_items FOR DELETE TO authenticated USING (true);

-- Backfill: one item per existing revenue row. Additive only — never touches
-- the `revenues` table itself. Idempotent (skips rows that already have an
-- item, and rows with no subcategory_id at all, which shouldn't exist given
-- the app's own validation, but are left alone defensively rather than
-- failing the migration).
INSERT INTO revenue_items (revenue_id, subcategory_id, quantity, amount, created_at, updated_at)
SELECT r.id, r.subcategory_id, r.quantity, r.amount, r.created_at, r.updated_at
FROM revenues r
WHERE r.subcategory_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM revenue_items ri WHERE ri.revenue_id = r.id);
