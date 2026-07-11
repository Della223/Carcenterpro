# 55-SCREEN_DASHBOARD_DETAILED.md

# Especificação Detalhada da Tela Dashboard

## Objetivo

O Dashboard é o principal painel gerencial do CarCenter PRO Finance. Sua
função é consolidar informações financeiras e operacionais em tempo real
para apoiar a tomada de decisão.

------------------------------------------------------------------------

# Layout Geral

``` text
+--------------------------------------------------------------------------------------+
| Cabeçalho                                                                            |
+---------+----------------------------------------------------------------------------+
| Menu    | Barra Global de Filtros                                                   |
| Lateral |----------------------------------------------------------------------------|
|         | KPIs: Receita | Despesa | Resultado | Projeção | Ticket Médio            |
|         |----------------------------------------------------------------------------|
|         | Gráfico Receita x Despesa                                                 |
|         |----------------------------------------------------------------------------|
|         | Evolução Mensal                                                           |
|         |----------------------------------------------------------------------------|
|         | Receita por Categoria | Despesa por Categoria                             |
|         |----------------------------------------------------------------------------|
|         | Centros de Custo | Orçado x Realizado                                     |
+---------+----------------------------------------------------------------------------+
```

------------------------------------------------------------------------

# Barra Global de Filtros

Campos:

-   Competência
-   Período
-   Categoria
-   Centro de Custo

Botões:

-   Aplicar
-   Limpar

Regras:

-   Todos os gráficos e KPIs devem ser atualizados simultaneamente.
-   Filtros permanecem ativos durante a navegação.

------------------------------------------------------------------------

# KPIs

Exibir:

-   Receita Acumulada
-   Despesa Acumulada
-   Resultado
-   Projeção de Fechamento
-   Ticket Médio

Cada KPI deve conter:

-   Valor principal
-   Comparação com período anterior
-   Indicador visual de tendência
-   Clique para navegação ao módulo de origem

------------------------------------------------------------------------

# Gráfico Receita x Despesa

Tipo:

-   Barras verticais

Objetivo:

Comparar receitas e despesas por competência.

------------------------------------------------------------------------

# Evolução Mensal

Tipo:

-   Linha

Período:

Últimos 12 meses.

------------------------------------------------------------------------

# Receita por Categoria

Tipo:

-   Pizza ou barras horizontais.

------------------------------------------------------------------------

# Despesas por Categoria

Tipo:

-   Pizza ou barras horizontais.

------------------------------------------------------------------------

# Centros de Custo

Tabela resumida:

-   Centro
-   Valor
-   Participação %

------------------------------------------------------------------------

# Orçado x Realizado

Exibir:

-   Valor Orçado
-   Valor Realizado
-   Diferença
-   Percentual de Execução

------------------------------------------------------------------------

# Atualizações Automáticas

Responder aos eventos:

-   RevenueCreated
-   RevenueUpdated
-   RevenueDeleted
-   ExpenseCreated
-   ExpensePaid
-   BudgetUpdated

Sem recarregar a página.

------------------------------------------------------------------------

# Exportação

Permitir:

-   PDF
-   Excel
-   CSV

Respeitando os filtros ativos.

------------------------------------------------------------------------

# Estados

Loading:

Skeleton para KPIs e gráficos.

Empty:

Mensagem: "Não existem dados para os filtros selecionados."

Error:

Mensagem amigável.

Botão: "Tentar novamente"

------------------------------------------------------------------------

# Performance

-   Carregamento inicial inferior a 3 segundos.
-   Atualização dos filtros inferior a 2 segundos.
-   Gráficos renderizados sem bloqueio perceptível da interface.

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os KPIs consistentes com os dados do sistema.
-   Gráficos sincronizados com os filtros.
-   Atualização automática por eventos.
-   Exportações respeitando os filtros.
-   Interface consistente com o Design System.
