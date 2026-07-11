# 92-PROJECT_STRUCTURE_FINAL.md

# Estrutura Final do Projeto

## Objetivo

Definir a organização definitiva do código-fonte do CarCenter PRO
Finance, padronizando diretórios, responsabilidades e convenções para
facilitar manutenção, escalabilidade e desenvolvimento por IA.

------------------------------------------------------------------------

# Arquitetura

-   Frontend: Next.js + React + TypeScript
-   Backend: Route Handlers + Services
-   Banco: PostgreSQL (Supabase)
-   ORM: Drizzle ORM

------------------------------------------------------------------------

# Estrutura de Diretórios

``` text
carcenter-pro-finance/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── shared/
│   ├── home/
│   ├── comercial/
│   ├── despesas/
│   ├── dashboard/
│   ├── dre/
│   ├── orcamentos/
│   ├── relatorios/
│   └── configuracoes/
├── hooks/
├── lib/
├── services/
├── repositories/
├── db/
│   ├── schema/
│   ├── migrations/
│   └── seeds/
├── types/
├── utils/
├── validators/
├── styles/
├── public/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── docs/
```

------------------------------------------------------------------------

# Organização por Camada

## Components

Responsáveis apenas pela interface.

## Hooks

Encapsulam lógica reutilizável de frontend.

## Services

Contêm todas as regras de negócio.

## Repositories

Responsáveis exclusivamente pelo acesso ao banco.

## Validators

Centralizam validações compartilhadas.

## Types

Interfaces e tipos TypeScript.

## Utils

Funções utilitárias sem regra de negócio.

------------------------------------------------------------------------

# Convenções

-   Um componente por arquivo.
-   Um serviço por domínio.
-   Nomes em inglês.
-   Pastas em minúsculas.
-   Arquivos TypeScript (.ts/.tsx).

------------------------------------------------------------------------

# Testes

Cada módulo possui:

-   Testes unitários.
-   Testes de integração.
-   Testes E2E quando aplicável.

------------------------------------------------------------------------

# Scripts

Scripts recomendados:

-   dev
-   build
-   lint
-   test
-   test:e2e
-   migrate
-   seed

------------------------------------------------------------------------

# Configurações

Arquivos principais:

-   package.json
-   tsconfig.json
-   drizzle.config.ts
-   next.config.ts
-   eslint.config.\*
-   prettier.config.\*
-   .env.local
-   .env.production

------------------------------------------------------------------------

# Critérios de Aceite

-   Estrutura única para todo o projeto.
-   Separação clara de responsabilidades.
-   Compatível com a arquitetura oficial.
-   Preparada para crescimento do sistema.
