# 51-REPOSITORY_STRUCTURE.md

# Estrutura Oficial do Repositório

## Objetivo

Padronizar a organização física do código-fonte do CarCenter PRO Finance
para garantir escalabilidade, manutenção e facilidade de navegação.

------------------------------------------------------------------------

# Estrutura Raiz

``` text
carcenter-pro-finance/
├── docs/
├── public/
├── src/
├── drizzle/
├── scripts/
├── tests/
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

------------------------------------------------------------------------

# Pasta src

``` text
src/
├── app/
│   ├── (auth)/
│   ├── home/
│   ├── comercial/
│   ├── despesas/
│   ├── dashboard/
│   ├── dre/
│   ├── orcamentos/
│   ├── relatorios/
│   └── configuracoes/
├── components/
├── hooks/
├── services/
├── repositories/
├── lib/
├── types/
├── utils/
├── validations/
├── constants/
├── styles/
└── middleware/
```

------------------------------------------------------------------------

# Components

``` text
components/
├── ui/
├── layout/
├── shared/
├── home/
├── comercial/
├── despesas/
├── dashboard/
├── dre/
├── orcamentos/
├── relatorios/
└── configuracoes/
```

Regra: - Componentes reutilizáveis ficam em `shared`. - Componentes
básicos ficam em `ui`.

------------------------------------------------------------------------

# Services

Cada módulo possui seu próprio serviço.

Exemplo:

``` text
services/
├── revenue.service.ts
├── expense.service.ts
├── dashboard.service.ts
├── dre.service.ts
├── budget.service.ts
└── report.service.ts
```

------------------------------------------------------------------------

# Repositories

Responsáveis exclusivamente pelo acesso ao banco.

``` text
repositories/
├── revenue.repository.ts
├── expense.repository.ts
├── budget.repository.ts
└── user.repository.ts
```

------------------------------------------------------------------------

# Hooks

``` text
hooks/
├── useAuth.ts
├── useDashboard.ts
├── useRevenue.ts
├── useExpense.ts
└── useBudget.ts
```

------------------------------------------------------------------------

# Types

Todos os contratos TypeScript centralizados.

``` text
types/
├── revenue.ts
├── expense.ts
├── budget.ts
├── user.ts
└── api.ts
```

------------------------------------------------------------------------

# Testes

``` text
tests/
├── unit/
├── integration/
├── e2e/
└── fixtures/
```

------------------------------------------------------------------------

# Convenções

-   Um componente por arquivo.
-   Um serviço por domínio.
-   Um repositório por agregado.
-   Nomes em inglês para arquivos e código.
-   Interface do usuário em Português (Brasil).

------------------------------------------------------------------------

# Documentação

A pasta `docs/` deverá conter toda a documentação do projeto, numerada
conforme esta especificação.

------------------------------------------------------------------------

# Critérios de Aceite

-   Estrutura seguida integralmente.
-   Pastas com responsabilidade única.
-   Baixo acoplamento entre módulos.
-   Fácil localização de qualquer arquivo.
