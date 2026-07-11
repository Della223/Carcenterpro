# 11-REPORTS.md

# Módulo Relatórios

## Objetivo

Disponibilizar relatórios gerenciais, financeiros e operacionais para
consulta, exportação e impressão, utilizando sempre os dados registrados
nos demais módulos do sistema.

------------------------------------------------------------------------

# Princípios

-   Nenhum dado poderá ser alterado neste módulo.
-   Todos os relatórios serão gerados em tempo real.
-   Os filtros deverão ser aplicados antes da geração.
-   Todas as exportações utilizarão exatamente os dados exibidos.

------------------------------------------------------------------------

# Relatórios Obrigatórios

## Financeiros

-   DRE por competência
-   Despesas por categoria
-   Despesas por subcategoria
-   Despesas por centro de custo
-   Despesas por fornecedor
-   Parcelas em aberto
-   Parcelas pagas
-   Fluxo de pagamentos realizados

## Comerciais

-   Receita por categoria
-   Receita diária
-   Receita mensal
-   Quantidade de vendas
-   Ticket médio
-   Evolução das receitas

## Gerenciais

-   Orçado x Realizado
-   Evolução mensal
-   Comparativo entre competências
-   Ranking de categorias de despesas
-   Ranking de categorias de receitas

------------------------------------------------------------------------

# Filtros

Todos os relatórios deverão permitir, quando aplicável:

-   Competência
-   Ano
-   Período
-   Categoria
-   Subcategoria
-   Centro de Custo
-   Fornecedor
-   Usuário responsável

------------------------------------------------------------------------

# Exportação

Formatos suportados:

-   PDF
-   Excel (.xlsx)
-   CSV

A exportação deverá respeitar exatamente os filtros aplicados.

------------------------------------------------------------------------

# Impressão

Disponibilizar versão otimizada para impressão contendo:

-   Cabeçalho com logotipo
-   Nome do relatório
-   Data e hora de emissão
-   Usuário responsável
-   Paginação

------------------------------------------------------------------------

# Pesquisa

Permitir localizar rapidamente relatórios pelo nome.

------------------------------------------------------------------------

# Auditoria

Registrar:

-   Usuário
-   Relatório emitido
-   Data
-   Hora
-   Tipo de exportação

------------------------------------------------------------------------

# Mensagens

Sem resultados:

"Nenhum registro encontrado para os filtros selecionados."

Erro:

"Não foi possível gerar o relatório."

------------------------------------------------------------------------

# Integrações

Os relatórios deverão consumir dados dos módulos:

-   Comercial
-   Despesas
-   Dashboard
-   DRE
-   Orçamentos

Sem duplicação de informações.

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os relatórios gerados corretamente.
-   Exportação funcional.
-   Impressão formatada.
-   Dados consistentes com os módulos de origem.
