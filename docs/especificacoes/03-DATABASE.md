# 03-DATABASE.md

# Banco de Dados

## Objetivo

Definir a estrutura oficial do banco de dados do CarCenter PRO Finance.

Todo o sistema deverá utilizar PostgreSQL.

ORM oficial: Drizzle ORM.

------------------------------------------------------------------------

# Princípios

-   Banco normalizado.
-   Chaves primárias UUID.
-   Campos created_at e updated_at em todas as tabelas.
-   Exclusão lógica utilizando active quando aplicável.
-   Auditoria por usuário.

------------------------------------------------------------------------

# Tabelas Principais

## users

  Campo        Tipo           Obrigatório
  ------------ -------------- -------------
  id           uuid           Sim
  name         varchar(100)   Sim
  active       boolean        Sim
  created_at   timestamp      Sim
  updated_at   timestamp      Sim

------------------------------------------------------------------------

## revenue_categories

Categorias fixas:

-   Peças Localiza
-   Peças Particular
-   Pneus Localiza
-   Pneus Particular
-   Serviços Localiza
-   Serviços Particular
-   Geometria e Balanceamento Localiza
-   Geometria e Balanceamento Particular

Campos: - id - name - active

------------------------------------------------------------------------

## revenues

Campos:

-   id
-   revenue_date
-   category_id
-   quantity
-   amount
-   notes
-   created_by
-   created_at
-   updated_at

Regras:

-   quantity \>= 0
-   amount \> 0

------------------------------------------------------------------------

## expense_categories

Categorias:

-   Vendas
-   Administrativas
-   Pessoal
-   Geral
-   Marketing
-   Aluguel
-   IPTU

------------------------------------------------------------------------

## expense_subcategories

Relacionada à categoria.

Cada subcategoria pertence obrigatoriamente a apenas uma categoria.

------------------------------------------------------------------------

## cost_centers

Campos:

-   id
-   name

Valores iniciais:

-   Operacional
-   Administrativo
-   Estrutura / Predial

------------------------------------------------------------------------

## expenses

Campos:

-   id
-   competence_month
-   competence_year
-   supplier
-   category_id
-   subcategory_id
-   cost_center_id
-   description
-   total_amount
-   installment_count
-   appropriation_type
-   notes
-   created_by
-   created_at
-   updated_at

------------------------------------------------------------------------

## expense_installments

Campos:

-   id
-   expense_id
-   installment_number
-   due_date
-   amount
-   paid
-   payment_date

Regras:

Uma despesa parcelada gera automaticamente suas parcelas.

A DRE considera apenas parcelas pagas dentro da competência.

------------------------------------------------------------------------

## budgets

Campos:

-   id
-   year
-   category_id
-   planned_amount

------------------------------------------------------------------------

# Relacionamentos

users 1:N revenues

users 1:N expenses

expense_categories 1:N expense_subcategories

expense_categories 1:N budgets

expense_categories 1:N expenses

expense_subcategories 1:N expenses

cost_centers 1:N expenses

expenses 1:N expense_installments

------------------------------------------------------------------------

# Auditoria

Todo registro deverá armazenar:

-   usuário
-   data de criação
-   data de alteração

------------------------------------------------------------------------

# Integridade

Não permitir exclusão física de registros financeiros.

Utilizar desativação quando necessário.

------------------------------------------------------------------------

# Critério de Aceite

Toda informação financeira do sistema deverá estar contemplada nas
entidades descritas neste documento.
