# 08-DASHBOARD.md

# Módulo Dashboard

## Objetivo

O Dashboard é o ambiente analítico do CarCenter PRO Finance.

Seu objetivo é transformar os dados registrados nos módulos Comercial e
Despesas em informações gerenciais para tomada de decisão.

O Dashboard não permite lançamentos ou edições de dados.

------------------------------------------------------------------------

# Princípios

-   Somente leitura.
-   Atualização automática.
-   Dados em tempo real.
-   Todos os indicadores derivados do banco de dados.

------------------------------------------------------------------------

# Filtros Globais

-   Competência (MM/AAAA)
-   Ano
-   Categoria de Receita
-   Categoria de Despesa
-   Centro de Custo

Todos os componentes da tela devem responder aos filtros.

------------------------------------------------------------------------

# Indicadores Principais

## Financeiro

-   Receita do Mês
-   Despesa do Mês
-   Resultado do Mês
-   Resultado Acumulado
-   Projeção de Fechamento

## Comercial

-   Quantidade de Vendas
-   Ticket Médio
-   Receita por Categoria
-   Participação por Categoria

## Despesas

-   Total por Categoria
-   Total por Subcategoria
-   Total por Centro de Custo
-   Total Pago
-   Total em Aberto

------------------------------------------------------------------------

# Gráficos

Obrigatórios:

-   Receita x Despesa (colunas)
-   Evolução Mensal (linhas)
-   Receita por Categoria (pizza)
-   Despesas por Categoria (barras)
-   Centros de Custo (rosca)

Todos os gráficos devem permitir exportação em imagem.

------------------------------------------------------------------------

# Cards

Exibir:

-   Receita
-   Despesa
-   Resultado
-   Projeção
-   Ticket Médio
-   Maior Categoria de Despesa

------------------------------------------------------------------------

# Atualização

Atualizar automaticamente após:

-   Novo lançamento de receita
-   Edição de receita
-   Exclusão de receita
-   Novo pagamento de despesa
-   Alteração de orçamento

------------------------------------------------------------------------

# Exportação

Permitir:

-   PDF
-   Excel
-   CSV
-   Impressão

------------------------------------------------------------------------

# Mensagens

Sem dados: "Nenhum dado encontrado para os filtros selecionados."

Erro: "Não foi possível carregar os indicadores."

------------------------------------------------------------------------

# Critérios de Aceite

-   Atualização automática.
-   Tempo de carregamento inferior a 3 segundos.
-   Todos os gráficos respeitando os filtros.
-   Nenhuma edição de dados permitida.
