# 53-SCREEN_COMMERCIAL_DETAILED.md

# Especificação Detalhada da Tela Comercial

## Objetivo

O módulo Comercial é responsável pelo registro e acompanhamento das
receitas da empresa, servindo como origem dos indicadores financeiros,
Dashboard, DRE e Relatórios.

------------------------------------------------------------------------

# Layout Geral

``` text
+--------------------------------------------------------------------------------------+
| Cabeçalho                                                                            |
+---------+----------------------------------------------------------------------------+
| Menu    | Filtros                                                                    |
| Lateral |----------------------------------------------------------------------------|
|         | KPIs: Receita | Ticket Médio | Qtde Vendas | Média Diária                 |
|         |----------------------------------------------------------------------------|
|         | [ Novo Lançamento ] [ Exportar ] [ Pesquisar ]                            |
|         |----------------------------------------------------------------------------|
|         | Tabela de Receitas                                                        |
+---------+----------------------------------------------------------------------------+
```

------------------------------------------------------------------------

# Barra de Filtros

Campos:

-   Competência
-   Data Inicial
-   Data Final
-   Categoria
-   Texto livre

Botões:

-   Filtrar
-   Limpar

Regras:

-   Filtros permanecem ativos durante a navegação.
-   Alteração dos filtros atualiza KPIs e tabela.

------------------------------------------------------------------------

# KPIs

## Receita da Competência

Origem: SUM(revenues.amount)

Atualização: Tempo real.

------------------------------------------------------------------------

## Ticket Médio

Fórmula:

Receita ÷ Quantidade de Vendas

------------------------------------------------------------------------

## Quantidade de Vendas

Origem:

SUM(quantity)

------------------------------------------------------------------------

## Média Diária

Receita acumulada ÷ Dias decorridos da competência.

------------------------------------------------------------------------

# Botão Novo Lançamento

Abre modal de cadastro.

Campos obrigatórios:

-   Data
-   Categoria
-   Quantidade
-   Valor

Campo opcional:

-   Observações

Botões:

Salvar

Cancelar

------------------------------------------------------------------------

# Fluxo de Cadastro

1.  Usuário preenche formulário.
2.  Sistema valida dados.
3.  Persiste receita.
4.  Publica evento RevenueCreated.
5.  Atualiza:
    -   HOME
    -   Dashboard
    -   DRE
    -   Relatórios
6.  Exibe Toast de sucesso.

------------------------------------------------------------------------

# Tabela

Colunas:

-   Data
-   Categoria
-   Quantidade
-   Valor
-   Ticket Médio
-   Observações
-   Usuário
-   Última Alteração
-   Ações

Recursos:

-   Ordenação
-   Paginação
-   Pesquisa
-   Exportação

------------------------------------------------------------------------

# Ações

Editar

Excluir (lógica)

Visualizar

------------------------------------------------------------------------

# Exportação

Formatos:

-   Excel
-   CSV
-   PDF

Respeitar filtros ativos.

------------------------------------------------------------------------

# Estados

Loading

Exibir Skeleton.

Empty

Mensagem:

"Nenhuma receita encontrada."

Botão:

"Criar primeira receita"

Error

Mensagem amigável.

Botão:

"Tentar novamente"

------------------------------------------------------------------------

# Atualizações Automáticas

Eventos:

-   RevenueCreated
-   RevenueUpdated
-   RevenueDeleted

Atualizar KPIs, tabela e consumidores sem recarregar a página.

------------------------------------------------------------------------

# Critérios de Aceite

-   Cadastro funcional.
-   CRUD completo.
-   Ticket médio correto.
-   KPIs atualizados automaticamente.
-   Integração com HOME, Dashboard, DRE e Relatórios.
-   Performance inferior a 2 segundos para consultas usuais.
