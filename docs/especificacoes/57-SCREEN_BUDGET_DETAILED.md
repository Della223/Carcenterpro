# 57-SCREEN_BUDGET_DETAILED.md

# Especificação Detalhada da Tela Orçamentos

## Objetivo

O módulo **Orçamentos** permite planejar despesas anuais por categoria,
acompanhar a execução do orçamento e alertar o gestor quando os limites
planejados forem ultrapassados.

------------------------------------------------------------------------

# Layout Geral

``` text
+--------------------------------------------------------------------------------------+
| Cabeçalho                                                                            |
+---------+----------------------------------------------------------------------------+
| Menu    | Exercício | Categoria | Centro de Custo | Exportar                         |
| Lateral |----------------------------------------------------------------------------|
|         | KPIs: Orçado | Realizado | Diferença | Execução (%)                      |
|         |----------------------------------------------------------------------------|
|         | [ Novo Orçamento ] [ Importar ] [ Exportar ]                              |
|         |----------------------------------------------------------------------------|
|         | Grade de Orçamentos                                                       |
+---------+----------------------------------------------------------------------------+
```

------------------------------------------------------------------------

# Barra de Filtros

Campos:

-   Exercício
-   Categoria
-   Centro de Custo (preparado para evolução)
-   Status (Dentro / Acima do Orçamento)

Botões:

-   Aplicar
-   Limpar

------------------------------------------------------------------------

# KPIs

Exibir:

-   Valor Orçado
-   Valor Realizado
-   Diferença
-   Percentual de Execução

Atualização em tempo real após alterações financeiras.

------------------------------------------------------------------------

# Grade

Colunas:

-   Categoria
-   Valor Orçado
-   Valor Realizado
-   Diferença
-   Execução (%)
-   Última Atualização
-   Ações

Recursos:

-   Ordenação
-   Pesquisa
-   Paginação
-   Exportação

------------------------------------------------------------------------

# Cadastro

Campos obrigatórios:

-   Exercício
-   Categoria
-   Valor Orçado

Regras:

-   Apenas um orçamento por categoria e exercício.
-   Valores devem ser maiores que zero.
-   Categorias inativas não podem receber novos orçamentos.

------------------------------------------------------------------------

# Edição

Permitida apenas para orçamentos do exercício selecionado.

Toda alteração:

-   Atualiza Dashboard
-   Atualiza HOME
-   Publica evento BudgetUpdated
-   Registra auditoria

------------------------------------------------------------------------

# Alertas

Quando:

Realizado \> Orçado

Ações:

-   Destacar linha.
-   Exibir alerta no Assistente Gerencial.
-   Atualizar indicador da HOME.

------------------------------------------------------------------------

# Comparativos

Mostrar:

-   Diferença absoluta
-   Diferença percentual
-   Tendência

------------------------------------------------------------------------

# Exportação

Formatos:

-   PDF
-   Excel
-   CSV

Sempre respeitando filtros ativos.

------------------------------------------------------------------------

# Estados

Loading: Skeleton para KPIs e grade.

Empty: "Nenhum orçamento cadastrado."

Botão: "Criar primeiro orçamento"

Error: Mensagem amigável.

Botão: "Tentar novamente"

------------------------------------------------------------------------

# Performance

-   Atualização dos indicadores inferior a 2 segundos.
-   Exportação inferior a 5 segundos.

------------------------------------------------------------------------

# Critérios de Aceite

-   Cadastro e edição funcionais.
-   Comparativos corretos.
-   Alertas automáticos.
-   Integração com Dashboard, HOME e DRE.
-   Auditoria registrada.
-   Interface consistente com o Design System.
