/*
# CarCenter PRO Finance - Reciclagem Revenue Category

## Overview
Adds a new revenue main category, "Reciclagem", with 3 subcategories:
"Venda de Óleo Usado", "Venda de Sucata" and "Venda de Carcaça". Seeded
directly via migration, same as the original Localiza/Particular/Migração
seed in migration 006 — now that the "Nova Venda" screen and the admin
management screens (Configurações -> Categoria Principal / Subcategoria de
Receita) both read live from `revenue_main_categories`/`revenue_subcategories`,
this becomes immediately usable without any further seeding needed for future
categories (that's what the new admin screens are for).

## Changes
Idempotent — ON CONFLICT DO NOTHING on both inserts, safe to re-run.
*/

INSERT INTO revenue_main_categories (name) VALUES ('Reciclagem')
ON CONFLICT (name) DO NOTHING;

INSERT INTO revenue_subcategories (main_category_id, name)
SELECT mc.id, sub.name
FROM revenue_main_categories mc
CROSS JOIN (VALUES ('Venda de Óleo Usado'), ('Venda de Sucata'), ('Venda de Carcaça')) AS sub(name)
WHERE mc.name = 'Reciclagem'
ON CONFLICT (main_category_id, name) DO NOTHING;
