# 46-DOMAIN_MODEL.md

# Modelo de Domínio

## Objetivo

Definir o modelo conceitual do CarCenter PRO Finance utilizando
princípios de Domain-Driven Design (DDD), estabelecendo as entidades,
agregados, objetos de valor, serviços de domínio e invariantes que
representam o negócio.

------------------------------------------------------------------------

# Bounded Contexts

## Financeiro

Responsável por: - Receitas - Despesas - Parcelas - DRE - Orçamentos

## Comercial

Responsável por: - Registro de receitas - Indicadores comerciais

## Administração

Responsável por: - Configurações - Categorias - Centros de custo -
Auditoria

## Plataforma

Responsável por: - Autenticação - Permissões - Logs - Observabilidade

------------------------------------------------------------------------

# Entidades

## Usuário (User)

Identidade: - id

Atributos: - nome - e-mail - status

Responsabilidades: - Autenticar - Executar operações - Gerar auditoria

------------------------------------------------------------------------

## Receita (Revenue)

Identidade: - id

Atributos: - data - categoria - quantidade - valor - observações

Invariantes: - Valor \> 0 - Categoria obrigatória - Data não futura

------------------------------------------------------------------------

## Despesa (Expense)

Identidade: - id

Atributos: - competência - fornecedor - categoria - subcategoria -
centro de custo - valor total

Invariantes: - Valor positivo - Competência válida

------------------------------------------------------------------------

## Parcela (ExpenseInstallment)

Identidade: - id

Atributos: - número - vencimento - valor - situação

Invariantes: - Pertence a exatamente uma despesa - Não pode existir sem
despesa

------------------------------------------------------------------------

## Orçamento (Budget)

Identidade: - id

Atributos: - exercício - categoria - valor planejado

Invariantes: - Um orçamento por categoria/ano

------------------------------------------------------------------------

# Agregados

## Expense Aggregate

Raiz: Expense

Filhos: - ExpenseInstallment

Toda alteração nas parcelas ocorre através da entidade Expense.

------------------------------------------------------------------------

## Budget Aggregate

Raiz: Budget

Sem entidades filhas na versão 1.0.

------------------------------------------------------------------------

# Value Objects

## Competência

Formato: MM/AAAA

Imutável.

------------------------------------------------------------------------

## Dinheiro

Representa valores monetários.

Características: - Precisão decimal - Moeda BRL - Operações seguras

------------------------------------------------------------------------

## Percentual

Representa indicadores percentuais.

Sempre entre 0 e 100 quando aplicável.

------------------------------------------------------------------------

# Serviços de Domínio

## RevenueService

Responsável por: - Registrar receita - Validar regras - Publicar eventos

## ExpenseService

Responsável por: - Criar despesas - Gerar parcelas - Registrar
pagamentos

## DreService

Responsável por: - Consolidar resultado - Calcular indicadores

## DashboardService

Responsável por: - Consolidar KPIs - Atualizar gráficos

------------------------------------------------------------------------

# Eventos de Domínio

-   RevenueCreated
-   RevenueUpdated
-   RevenueDeleted
-   ExpenseCreated
-   ExpensePaid
-   BudgetUpdated
-   MarketingPublished

Todos devem atualizar os módulos dependentes.

------------------------------------------------------------------------

# Invariantes Globais

-   Nenhuma receita com valor \<= 0.
-   Nenhuma despesa sem categoria.
-   DRE nunca recebe edição manual.
-   Toda operação financeira gera auditoria.
-   Parcelas pertencem a uma única despesa.
-   Dados financeiros históricos não devem ser removidos fisicamente.

------------------------------------------------------------------------

# Relacionamentos

User ├── Revenue ├── Expense ├── Budget └── AuditLog

Expense └── ExpenseInstallment

ExpenseCategory └── ExpenseSubcategory

RevenueCategory └── Revenue

------------------------------------------------------------------------

# Critérios de Aceite

-   Todas as entidades refletem o domínio do negócio.
-   Invariantes preservadas.
-   Agregados respeitados.
-   Eventos publicados corretamente.
-   Modelo de domínio utilizado como referência para implementação.
