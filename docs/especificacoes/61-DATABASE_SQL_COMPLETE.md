# 61-DATABASE_SQL_COMPLETE.md

# Banco de Dados SQL Completo

## Objetivo

Definir a estrutura SQL oficial do CarCenter PRO Finance como referência
para implementação em PostgreSQL utilizando Supabase e Drizzle ORM.

------------------------------------------------------------------------

# Convenções

-   Banco: PostgreSQL
-   Chaves primárias: UUID
-   Datas: TIMESTAMPTZ
-   Valores monetários: NUMERIC(14,2)
-   Timezone: America/Sao_Paulo
-   UTF-8 obrigatório

------------------------------------------------------------------------

# Ordem das Migrations

001_extensions.sql

002_users.sql

003_categories.sql

004_cost_centers.sql

005_revenues.sql

006_expenses.sql

007_expense_installments.sql

008_budgets.sql

009_marketing.sql

010_audit.sql

011_views.sql

012_functions.sql

013_rls.sql

014_seed.sql

------------------------------------------------------------------------

# Extensões

``` sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

------------------------------------------------------------------------

# Tabelas Obrigatórias

-   users
-   revenue_categories
-   expense_categories
-   expense_subcategories
-   cost_centers
-   revenues
-   expenses
-   expense_installments
-   budgets
-   marketing_posts
-   audit_logs

Todas contendo:

-   id UUID PRIMARY KEY
-   created_at
-   updated_at

Tabelas transacionais também possuem:

-   created_by UUID

------------------------------------------------------------------------

# Índices Obrigatórios

revenues

-   revenue_date
-   category_id

expenses

-   competence_month
-   competence_year
-   supplier
-   category_id
-   cost_center_id

expense_installments

-   due_date
-   paid

budgets

-   year
-   category_id

audit_logs

-   created_at
-   module
-   operation

------------------------------------------------------------------------

# Constraints

Obrigatórias

-   UNIQUE categorias
-   UNIQUE orçamento por categoria/ano
-   CHECK valores positivos
-   CHECK quantidade parcelas \>=1
-   FOREIGN KEY em todos os relacionamentos

------------------------------------------------------------------------

# Views

vw_dashboard

Objetivo:

Consolidar KPIs.

------------------------------------------------------------------------

vw_dre

Objetivo:

Consolidar automaticamente a DRE.

------------------------------------------------------------------------

vw_budget_execution

Objetivo:

Comparar orçado x realizado.

------------------------------------------------------------------------

# Funções SQL

fn_generate_installments()

Responsável por gerar parcelas automaticamente.

------------------------------------------------------------------------

fn_update_dashboard()

Atualiza indicadores consolidados.

------------------------------------------------------------------------

fn_register_audit()

Insere registros na auditoria.

------------------------------------------------------------------------

# Triggers

Após INSERT em revenues

-   registrar auditoria
-   atualizar indicadores

Após INSERT/UPDATE expenses

-   registrar auditoria

Após pagamento

-   atualizar DRE
-   atualizar Dashboard
-   registrar auditoria

------------------------------------------------------------------------

# Seeds

Criar automaticamente:

Categorias padrão

Centros de custo padrão

Usuário administrador inicial

Configurações básicas

------------------------------------------------------------------------

# Row Level Security

Aplicar em:

-   revenues
-   expenses
-   expense_installments
-   budgets
-   marketing_posts
-   audit_logs

Política inicial:

Usuário autenticado possui acesso conforme autorização da aplicação.

------------------------------------------------------------------------

# Compatibilidade

O esquema deve ser compatível com:

-   Supabase
-   PostgreSQL
-   Drizzle ORM

------------------------------------------------------------------------

# Critérios de Aceite

-   Schema criado sem erros.
-   Constraints válidas.
-   Índices aplicados.
-   Triggers funcionando.
-   Views retornando dados corretos.
-   Preparado para migrations automatizadas.
