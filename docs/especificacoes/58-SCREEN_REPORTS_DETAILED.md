# 58-SCREEN_REPORTS_DETAILED.md

# Especificação Detalhada da Tela Relatórios

## Objetivo

O módulo **Relatórios** centraliza todas as consultas gerenciais do
CarCenter PRO Finance, permitindo análise, impressão e exportação de
dados financeiros e operacionais.

------------------------------------------------------------------------

# Layout Geral

``` text
+--------------------------------------------------------------------------------------+
| Cabeçalho                                                                            |
+---------+----------------------------------------------------------------------------+
| Menu    | Tipo | Competência | Período | Categoria | Exportar                       |
| Lateral |----------------------------------------------------------------------------|
|         | KPIs: Relatórios Gerados | Exportações | Última Atualização              |
|         |----------------------------------------------------------------------------|
|         | Catálogo de Relatórios                                                   |
|         |----------------------------------------------------------------------------|
|         | Área de Visualização                                                     |
+---------+----------------------------------------------------------------------------+
```

------------------------------------------------------------------------

# Catálogo de Relatórios

Disponíveis na versão 1.0:

-   Receitas
-   Despesas
-   DRE
-   Orçamentos
-   Fluxo Financeiro
-   Despesas por Categoria
-   Receitas por Categoria
-   Centros de Custo
-   Auditoria
-   Marketing

Cada relatório apresenta:

-   Nome
-   Descrição
-   Última atualização
-   Botão **Visualizar**

------------------------------------------------------------------------

# Barra de Filtros

Campos:

-   Competência
-   Data Inicial
-   Data Final
-   Categoria
-   Subcategoria
-   Centro de Custo
-   Fornecedor

Botões:

-   Aplicar
-   Limpar
-   Exportar
-   Imprimir

Todos os relatórios devem respeitar os filtros ativos.

------------------------------------------------------------------------

# Área de Visualização

Deve exibir:

-   Cabeçalho do relatório
-   Período analisado
-   Tabela ou gráfico correspondente
-   Totais
-   Rodapé com data/hora de geração

------------------------------------------------------------------------

# Exportação

Formatos suportados:

-   PDF
-   Excel (.xlsx)
-   CSV

Regras:

-   Preservar formatação monetária.
-   Preservar datas.
-   Aplicar filtros ativos.
-   Incluir data e hora de geração no rodapé.

------------------------------------------------------------------------

# Impressão

Botão:

Imprimir

Regras:

-   Layout otimizado para A4.
-   Cabeçalho com nome do sistema.
-   Numeração de páginas.
-   Data de emissão.

------------------------------------------------------------------------

# Histórico de Exportações

Registrar automaticamente:

-   Usuário
-   Tipo do relatório
-   Formato
-   Data/Hora

Esses registros devem estar disponíveis para auditoria.

------------------------------------------------------------------------

# Atualizações Automáticas

Os relatórios refletem imediatamente alterações originadas por:

-   RevenueCreated
-   RevenueUpdated
-   RevenueDeleted
-   ExpenseCreated
-   ExpensePaid
-   BudgetUpdated

Sem necessidade de recarregar a aplicação.

------------------------------------------------------------------------

# Estados

Loading:

Skeleton da visualização.

Empty:

"Nenhum dado encontrado para os filtros selecionados."

Error:

Mensagem amigável.

Botão:

"Tentar novamente"

------------------------------------------------------------------------

# Performance

-   Geração de relatórios comuns inferior a 3 segundos.
-   Exportação inferior a 5 segundos.
-   Paginação para grandes volumes de dados.

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os relatórios respeitam filtros ativos.
-   Exportações consistentes em PDF, Excel e CSV.
-   Impressão formatada corretamente.
-   Histórico de exportações registrado.
-   Integração automática com os módulos financeiros.
