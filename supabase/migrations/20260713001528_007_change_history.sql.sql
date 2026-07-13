/*
# Change History Table (Field-Level Audit Log)

## Purpose
Creates a dedicated `change_history` table that tracks field-level changes to revenues and expenses.
Unlike the existing `audit_logs` table (which stores whole-record JSON snapshots), this table
records individual field changes with old and new values, the user who made the change, and a timestamp.

## Changes

### 1. New table: `change_history`
- `id` (uuid, primary key)
- `table_name` (varchar, not null) — 'revenues' or 'expenses'
- `record_id` (uuid, not null) — the ID of the changed record
- `field_name` (varchar, not null) — the name of the changed field
- `old_value` (text, nullable) — the previous value (string representation)
- `new_value` (text, nullable) — the new value (string representation)
- `changed_by` (uuid, nullable, FK to users) — who made the change
- `changed_at` (timestamptz, not null, default now())

### 2. RLS policies
- SELECT: any authenticated user can read (history is shared business data)
- INSERT: any authenticated user can insert
- NO UPDATE or DELETE — history is immutable (read-only)

### Important Notes
1. This table is append-only — records can never be modified or deleted
2. The `changed_by` field links to the application `users` table (not auth.users)
3. Old and new values are stored as text for simplicity and universal compatibility
4. The existing `audit_logs` table remains untouched for backward compatibility
*/

CREATE TABLE IF NOT EXISTS change_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name varchar NOT NULL,
  record_id uuid NOT NULL,
  field_name varchar NOT NULL,
  old_value text,
  new_value text,
  changed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE change_history ENABLE ROW LEVEL SECURITY;

-- Read-only: authenticated can read, insert; NO update or delete
DROP POLICY IF EXISTS "auth_select_change_history" ON change_history;
CREATE POLICY "auth_select_change_history"
  ON change_history FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_change_history" ON change_history;
CREATE POLICY "auth_insert_change_history"
  ON change_history FOR INSERT TO authenticated WITH CHECK (true);

-- No UPDATE or DELETE policies — change history is immutable

-- Index for efficient lookup by record
CREATE INDEX IF NOT EXISTS idx_change_history_record ON change_history (table_name, record_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS idx_change_history_changed_by ON change_history (changed_by);
