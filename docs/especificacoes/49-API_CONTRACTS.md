# 49-API_CONTRACTS.md

# Contratos da API

## Objetivo

Definir os contratos oficiais da API do CarCenter PRO Finance,
garantindo consistência entre frontend, backend e futuras integrações.

------------------------------------------------------------------------

# Padrões Gerais

-   API REST.
-   JSON UTF-8.
-   Autenticação via JWT (Supabase Auth).
-   Datas no padrão ISO 8601.
-   Valores monetários com precisão decimal.

Base sugerida:

/api/v1

------------------------------------------------------------------------

# Autenticação

## POST /auth/login

Descrição: Autenticar usuário.

Request

``` json
{
  "email": "usuario@empresa.com",
  "password": "********"
}
```

Response 200

``` json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "uuid",
    "name": "Daniel"
  }
}
```

Erros

401 Unauthorized

------------------------------------------------------------------------

# Comercial

## GET /revenues

Retorna receitas.

Filtros:

-   competência
-   categoria
-   data inicial
-   data final

Response

``` json
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "total": 150
}
```

------------------------------------------------------------------------

## POST /revenues

Cria receita.

Request

``` json
{
  "revenueDate":"2026-07-10",
  "categoryId":"uuid",
  "quantity":12,
  "amount":1450.80,
  "notes":"..."
}
```

Response

201 Created

------------------------------------------------------------------------

## PUT /revenues/{id}

Atualiza receita.

204 No Content

------------------------------------------------------------------------

## DELETE /revenues/{id}

Exclusão lógica.

204 No Content

------------------------------------------------------------------------

# Despesas

## GET /expenses

Lista despesas.

Filtros:

-   competência
-   fornecedor
-   categoria
-   situação

------------------------------------------------------------------------

## POST /expenses

Cadastrar despesa.

Payload

-   competência
-   fornecedor
-   categoria
-   subcategoria
-   centro de custo
-   parcelas
-   valor

------------------------------------------------------------------------

## POST /expenses/{id}/payments

Registrar pagamento.

------------------------------------------------------------------------

# Dashboard

## GET /dashboard

Retorna:

-   KPIs
-   gráficos
-   indicadores

------------------------------------------------------------------------

# DRE

## GET /dre

Parâmetros:

competência

Retorno:

Receita

Despesas

Resultado

------------------------------------------------------------------------

# Orçamentos

GET /budgets

POST /budgets

PUT /budgets/{id}

DELETE /budgets/{id}

------------------------------------------------------------------------

# Relatórios

GET /reports

POST /reports/export

Parâmetros:

-   tipo
-   filtros
-   formato

------------------------------------------------------------------------

# Configurações

GET /settings/categories

POST /settings/categories

PUT /settings/categories/{id}

DELETE /settings/categories/{id}

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

422 Unprocessable Entity

500 Internal Server Error

------------------------------------------------------------------------

# Estrutura de Erro

``` json
{
  "code":"ERR-200",
  "message":"Fornecedor obrigatório.",
  "details":[]
}
```

------------------------------------------------------------------------

# Paginação

Parâmetros:

page

pageSize

Resposta:

page

pageSize

total

items

------------------------------------------------------------------------

# Versionamento

Padrão:

/api/v1

Novas versões:

/api/v2

Sem quebra de compatibilidade sempre que possível.

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os endpoints documentados.
-   Estruturas consistentes.
-   Erros padronizados.
-   Compatível com OpenAPI futura.
