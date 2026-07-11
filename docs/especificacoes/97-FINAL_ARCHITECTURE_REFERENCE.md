# 97-FINAL_ARCHITECTURE_REFERENCE.md

# Referência Final da Arquitetura

## Objetivo

Consolidar a arquitetura oficial do CarCenter PRO Finance em um único
documento de referência, resumindo as decisões arquiteturais,
tecnologias, fluxos e relações entre os principais componentes da
solução.

------------------------------------------------------------------------

# Visão Geral

Arquitetura em camadas:

-   Frontend (Next.js + React + TypeScript)
-   Backend (Route Handlers + Services)
-   Persistência (Drizzle ORM + PostgreSQL/Supabase)
-   Autenticação (Supabase Auth)
-   Armazenamento (Supabase Storage)
-   Observabilidade e Auditoria

------------------------------------------------------------------------

# Stack Tecnológica

-   Next.js
-   React
-   TypeScript (strict)
-   Tailwind CSS
-   Drizzle ORM
-   PostgreSQL
-   Supabase
-   Vitest
-   Playwright

------------------------------------------------------------------------

# Camadas

## Apresentação

Interface do usuário e componentes reutilizáveis.

## Aplicação

Services com regras de negócio.

## Persistência

Repositories responsáveis pelo acesso aos dados.

## Infraestrutura

Integrações, autenticação, storage e monitoramento.

------------------------------------------------------------------------

# Fluxo de Dados

1.  Usuário interage com a interface.
2.  Frontend valida entradas.
3.  Service aplica regras de negócio.
4.  Repository acessa o banco.
5.  Evento é publicado quando necessário.
6.  Interface é atualizada.

------------------------------------------------------------------------

# Fluxo de Autenticação

Login → Supabase Auth → JWT → Middleware → Autorização → Aplicação.

------------------------------------------------------------------------

# Comunicação Entre Módulos

Eventos principais:

-   RevenueCreated
-   ExpenseCreated
-   ExpensePaid
-   BudgetUpdated
-   UserLoggedIn
-   UserLoggedOut
-   ConfigChanged

Os módulos permanecem desacoplados por eventos.

------------------------------------------------------------------------

# Banco de Dados

Domínios principais:

-   Usuários
-   Receitas
-   Despesas
-   Parcelas
-   Orçamentos
-   Categorias
-   Centros de Custo
-   Auditoria

------------------------------------------------------------------------

# APIs

Padrões:

-   REST
-   Versionamento por URL
-   JSON
-   Tratamento padronizado de erros
-   OpenAPI

------------------------------------------------------------------------

# Segurança

-   HTTPS obrigatório
-   RLS
-   JWT
-   Rate Limiting
-   CSP
-   Auditoria
-   Gestão de segredos

------------------------------------------------------------------------

# Deploy e Operação

-   CI/CD
-   Vercel
-   Supabase
-   Backups
-   Health Checks
-   Observabilidade
-   Runbooks

------------------------------------------------------------------------

# Relação com a Documentação

Esta referência consolida os documentos produzidos ao longo do projeto e
deve ser utilizada como visão arquitetural resumida antes da consulta
aos documentos específicos.

------------------------------------------------------------------------

# Critérios de Aceite

-   Arquitetura consistente.
-   Camadas bem definidas.
-   Fluxos alinhados com a documentação.
-   Referência suficiente para orientar implementação e manutenção.
