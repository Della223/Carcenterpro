/*
# CarCenter PRO Finance - Fix Retiradas de Sócio Category Match

## Overview
Migration 014 tried to reclassify the "Carlinhos/PARTICULAR" expense category
into the new "Retiradas de Sócio" cost center using an exact string match
(`WHERE name = 'Carlinhos/PARTICULAR'`). The category's real stored name has
extra whitespace (e.g. "Carlinhos/ PARTICULAR"), so the exact match affected
0 rows — silently, exactly like the migration's own comment predicted for the
case where the category doesn't exist at all. It does exist; the name just
doesn't match byte-for-byte.

## Fix
Compares both sides after stripping all whitespace and lowercasing, so this
works regardless of the exact spacing around "Carlinhos/...PARTICULAR"
(extra space after the slash, before it, doubled spaces, mixed case, etc.),
instead of gambling on getting the exact literal string right a second time.
Idempotent — safe to run again even after 014 is eventually fixed upstream.
*/

UPDATE expense_categories
SET cost_center_id = (SELECT id FROM cost_centers WHERE name = 'Retiradas de Sócio')
WHERE regexp_replace(lower(name), '\s+', '', 'g') = regexp_replace(lower('Carlinhos/PARTICULAR'), '\s+', '', 'g');
