# 47-EVENT_CATALOG.md

# Catálogo de Eventos

## Objetivo

Padronizar todos os eventos internos do CarCenter PRO Finance para
garantir comunicação consistente entre módulos, baixo acoplamento e
atualização automática dos dados.

------------------------------------------------------------------------

# Princípios

-   Todo evento representa um fato de negócio já ocorrido.
-   Eventos são imutáveis.
-   Eventos não executam regras de negócio; apenas notificam.
-   Consumidores devem ser idempotentes.

------------------------------------------------------------------------

# Estrutura Padrão

Cada evento deve possuir:

-   Nome
-   Contexto
-   Origem
-   Momento de disparo
-   Payload
-   Consumidores
-   Ações executadas
-   Criticidade

------------------------------------------------------------------------

# RevenueCreated

Contexto: Comercial

Origem: Cadastro de Receita

Disparo: Após persistência com sucesso.

Payload:

-   revenueId
-   revenueDate
-   categoryId
-   amount
-   quantity
-   userId
-   timestamp

Consumidores:

-   HOME
-   Dashboard
-   DRE
-   Relatórios
-   Auditoria

Ações:

-   Atualizar KPIs
-   Recalcular indicadores
-   Registrar auditoria

------------------------------------------------------------------------

# RevenueUpdated

Disparo: Após alteração de receita.

Consumidores:

-   Dashboard
-   DRE
-   HOME
-   Relatórios

------------------------------------------------------------------------

# RevenueDeleted

Disparo: Após exclusão lógica.

Consumidores:

-   Dashboard
-   DRE
-   HOME
-   Auditoria

------------------------------------------------------------------------

# ExpenseCreated

Payload:

-   expenseId
-   competence
-   totalAmount
-   installmentCount
-   userId

Consumidores:

-   Dashboard
-   HOME
-   Relatórios

------------------------------------------------------------------------

# ExpensePaid

Disparo: Após confirmação do pagamento.

Payload:

-   installmentId
-   paymentDate
-   amount
-   userId

Consumidores:

-   DRE
-   Dashboard
-   HOME
-   Relatórios
-   Auditoria

------------------------------------------------------------------------

# BudgetUpdated

Consumidores:

-   Dashboard
-   HOME
-   Assistente Gerencial

------------------------------------------------------------------------

# MarketingPublished

Payload:

-   type (Story\|Feed)
-   referenceDate
-   publishedBy
-   publishedAt

Consumidores:

-   HOME
-   Auditoria

------------------------------------------------------------------------

# UserLoggedIn

Consumidores:

-   Auditoria
-   Observabilidade

------------------------------------------------------------------------

# UserLoggedOut

Consumidores:

-   Auditoria
-   Observabilidade

------------------------------------------------------------------------

# ConfigChanged

Consumidores:

-   Todos os módulos dependentes

------------------------------------------------------------------------

# Tratamento de Falhas

Caso um consumidor falhe:

-   Registrar erro.
-   Não impedir os demais consumidores.
-   Permitir reprocessamento quando aplicável.

------------------------------------------------------------------------

# Idempotência

Todo consumidor deve verificar se o evento já foi processado antes de
executar alterações.

------------------------------------------------------------------------

# Ordem de Processamento

1.  Auditoria
2.  HOME
3.  Dashboard
4.  DRE
5.  Relatórios
6.  Observabilidade

------------------------------------------------------------------------

# Critérios de Aceite

-   Eventos possuem nomenclatura padronizada.
-   Payloads consistentes.
-   Consumidores desacoplados.
-   Processamento idempotente.
-   Falhas isoladas sem impacto global.
