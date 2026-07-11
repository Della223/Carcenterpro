# 27-DIAGRAMS.md

# Diagramas da Arquitetura

## Objetivo

Documentar visualmente a arquitetura lógica do CarCenter PRO Finance
utilizando diagramas textuais compatíveis com Markdown.

------------------------------------------------------------------------

# Arquitetura Geral

``` text
Usuário
   │
   ▼
Frontend (Next.js)
   │
   ▼
Services
   │
   ▼
Business Rules
   │
   ▼
Repositories
   │
   ▼
Supabase / PostgreSQL
```

------------------------------------------------------------------------

# Fluxo de Navegação

``` text
Login
  │
  ▼
HOME
 ├── Comercial
 ├── Despesas
 ├── Dashboard
 ├── DRE
 ├── Orçamentos
 ├── Relatórios
 └── Configurações
```

------------------------------------------------------------------------

# Fluxo de Receita

``` text
Novo Lançamento
      │
      ▼
Validação
      │
      ▼
Banco de Dados
      │
      ├── HOME
      ├── Dashboard
      ├── DRE
      └── Relatórios
```

------------------------------------------------------------------------

# Fluxo de Despesa

``` text
Cadastro
   │
   ▼
Parcelamento
   │
   ▼
Parcelas
   │
Pagamento
   │
   ▼
Atualização Automática
   ├── HOME
   ├── Dashboard
   ├── DRE
   └── Relatórios
```

------------------------------------------------------------------------

# Fluxo da DRE

``` text
Receitas
      │
Despesas Pagas
      │
Orçamentos
      │
      ▼
Recalcular DRE
      │
      ▼
Exibir Resultado
```

------------------------------------------------------------------------

# Fluxo do Dashboard

``` text
Filtros
   │
Consulta Banco
   │
Cálculos
   │
Cards
Gráficos
Indicadores
```

------------------------------------------------------------------------

# Relacionamento das Entidades

``` text
Users
 ├── Revenues
 ├── Expenses
 ├── Marketing Posts
 └── Audit Logs

Expense Categories
 └── Expense Subcategories
         └── Expenses
                └── Expense Installments

Revenue Categories
 └── Revenues

Budgets
 └── Expense Categories
```

------------------------------------------------------------------------

# Fluxo do Assistente Gerencial

``` text
Abrir HOME
   │
Verificar:
 ├── Receitas Pendentes
 ├── Parcelas Vencidas
 ├── Qualidade da Base
 ├── Story
 ├── Feed
 └── Orçamento
        │
        ▼
Exibir Alertas
```

------------------------------------------------------------------------

# Fluxo de Auditoria

``` text
Operação
   │
Registrar Usuário
Registrar Data/Hora
Registrar Valores
Salvar em audit_logs
```

------------------------------------------------------------------------

# Fluxo de Exportação

``` text
Selecionar Relatório
      │
Aplicar Filtros
      │
Gerar Dados
      │
Exportar:
PDF
Excel
CSV
```

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os diagramas representam fielmente os fluxos descritos na
    especificação.
-   Não existem fluxos paralelos não documentados.
-   Os módulos permanecem desacoplados, comunicando-se apenas pelas
    camadas definidas em Architecture.md.
