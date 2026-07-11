# 16-API.md

# Especificação da API

## Objetivo

Definir o contrato oficial entre Frontend e Backend do CarCenter PRO
Finance.

Base URL:

/api/v1

Formato:

JSON

Autenticação:

Bearer Token (JWT Supabase Auth)

------------------------------------------------------------------------

# Padrões

## Sucesso

HTTP 200 / 201

``` json
{
  "success": true,
  "data": {}
}
```

## Erro

``` json
{
  "success": false,
  "message": "Descrição do erro."
}
```

------------------------------------------------------------------------

# Endpoints

## Autenticação

POST /auth/login

POST /auth/logout

POST /auth/reset-password

GET /auth/me

------------------------------------------------------------------------

## Comercial

GET /revenues

GET /revenues/{id}

POST /revenues

PUT /revenues/{id}

DELETE /revenues/{id}

Filtros:

-   data
-   categoria
-   período

------------------------------------------------------------------------

## Despesas

GET /expenses

GET /expenses/{id}

POST /expenses

PUT /expenses/{id}

DELETE /expenses/{id}

POST /expenses/{id}/pay

GET /expenses/installments

Filtros:

-   competência
-   fornecedor
-   categoria
-   centro de custo
-   situação

------------------------------------------------------------------------

## Dashboard

GET /dashboard

GET /dashboard/cards

GET /dashboard/charts

------------------------------------------------------------------------

## DRE

GET /dre

GET /dre/{competencia}

------------------------------------------------------------------------

## Orçamentos

GET /budgets

POST /budgets

PUT /budgets/{id}

DELETE /budgets/{id}

------------------------------------------------------------------------

## Relatórios

GET /reports

POST /reports/export

POST /reports/print

------------------------------------------------------------------------

## Configurações

GET /settings

PUT /settings

GET /categories

POST /categories

PUT /categories/{id}

DELETE /categories/{id}

GET /subcategories

GET /cost-centers

------------------------------------------------------------------------

# Códigos HTTP

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

500 Internal Server Error

------------------------------------------------------------------------

# Validações

Todas as entradas devem ser validadas no backend.

Nunca confiar apenas na validação do frontend.

------------------------------------------------------------------------

# Auditoria

Operações de escrita deverão registrar:

-   usuário
-   data
-   hora
-   operação
-   recurso afetado

------------------------------------------------------------------------

# Critérios de Aceite

Todos os endpoints deverão seguir este contrato, utilizar autenticação
JWT e retornar respostas padronizadas em JSON.
