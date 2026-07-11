# 68-FRONTEND_COMPONENT_LIBRARY.md

# Biblioteca Oficial de Componentes Frontend

## Objetivo

Padronizar todos os componentes React do CarCenter PRO Finance,
definindo responsabilidades, propriedades, estados, eventos e regras de
reutilização.

------------------------------------------------------------------------

# Princípios

-   Componentes reutilizáveis.
-   Responsabilidade única.
-   Totalmente tipados em TypeScript.
-   Compatíveis com o Design System.
-   Sem regras de negócio.

------------------------------------------------------------------------

# Organização

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

------------------------------------------------------------------------

# Componentes Base

## Button

Responsabilidade: Executar ações.

Props:

-   variant
-   size
-   disabled
-   loading
-   icon
-   onClick

Estados:

-   Default
-   Hover
-   Focus
-   Active
-   Disabled
-   Loading

------------------------------------------------------------------------

## Input

Props:

-   label
-   placeholder
-   value
-   onChange
-   error
-   required
-   helperText

Estados:

-   Default
-   Focus
-   Error
-   Disabled

------------------------------------------------------------------------

## Select

Props:

-   options
-   value
-   placeholder
-   onChange

Suporta pesquisa quando houver muitos itens.

------------------------------------------------------------------------

## DataTable

Responsabilidade:

Exibir dados tabulares.

Props:

-   columns
-   rows
-   pagination
-   sorting
-   filters
-   loading
-   emptyMessage

Eventos:

-   onSort
-   onPageChange
-   onRowClick

------------------------------------------------------------------------

## Modal

Props:

-   title
-   open
-   size
-   onConfirm
-   onCancel

Fechamento por ESC permitido.

------------------------------------------------------------------------

## Toast

Tipos:

-   success
-   warning
-   error
-   info

Tempo padrão:

4 segundos.

------------------------------------------------------------------------

## KPI Card

Props:

-   title
-   value
-   comparison
-   trend
-   icon
-   onClick

------------------------------------------------------------------------

## FilterBar

Responsabilidade:

Agrupar filtros padronizados.

Botões:

-   Aplicar
-   Limpar

------------------------------------------------------------------------

## EmptyState

Props:

-   title
-   description
-   actionLabel
-   onAction

------------------------------------------------------------------------

## ErrorState

Props:

-   message
-   retryAction

------------------------------------------------------------------------

## Skeleton

Utilizado durante carregamento.

------------------------------------------------------------------------

# Componentes de Layout

-   Header
-   Sidebar
-   Footer
-   AuthLayout
-   MainLayout

------------------------------------------------------------------------

# Convenções

-   Um componente por arquivo.
-   Props tipadas.
-   Sem acesso direto ao banco.
-   Sem regras financeiras.

------------------------------------------------------------------------

# Testes

Cada componente deve possuir:

-   Renderização.
-   Eventos.
-   Estados.
-   Acessibilidade.

------------------------------------------------------------------------

# Critérios de Aceite

-   Componentes reutilizados em toda a aplicação.
-   Sem duplicação.
-   Compatíveis com o Design System.
-   Totalmente tipados.
