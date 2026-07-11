# 56-SCREEN_DRE_DETAILED.md

# Especificação Detalhada da Tela DRE

## Objetivo

A DRE (Demonstração do Resultado do Exercício) apresenta automaticamente
o resultado financeiro da competência, utilizando exclusivamente dados
consolidados do sistema. Nenhum valor pode ser editado manualmente.

------------------------------------------------------------------------

# Layout Geral

``` text
+--------------------------------------------------------------------------------------+
| Cabeçalho                                                                            |
+---------+----------------------------------------------------------------------------+
| Menu    | Competência | Comparar c/ período | Exportar                              |
| Lateral |----------------------------------------------------------------------------|
|         | DEMONSTRAÇÃO DO RESULTADO                                                 |
|         |----------------------------------------------------------------------------|
|         | Receita Bruta                                                             |
|         | (-) Deduções                                                              |
|         | (=) Receita Líquida                                                       |
|         | (-) Despesas Operacionais                                                 |
|         | (=) Resultado Operacional                                                 |
|         |----------------------------------------------------------------------------|
|         | Comparativos | Percentuais | Tendências                                  |
+---------+----------------------------------------------------------------------------+
```

------------------------------------------------------------------------

# Filtros

Campos:

-   Competência
-   Período comparativo

Botões:

-   Aplicar
-   Limpar
-   Exportar

------------------------------------------------------------------------

# Estrutura

## Receita Bruta

Origem: Todas as receitas da competência.

## (-) Deduções

Calculadas conforme regras fiscais configuradas.

## (=) Receita Líquida

Receita Bruta - Deduções.

## (-) Despesas Operacionais

Somente despesas apropriadas para a competência conforme regras do
sistema.

## (=) Resultado Operacional

Receita Líquida - Despesas Operacionais.

------------------------------------------------------------------------

# Comparativos

Exibir:

-   Valor atual
-   Valor período anterior
-   Diferença absoluta
-   Diferença percentual

------------------------------------------------------------------------

# Percentuais

Cada linha deve apresentar:

Valor da linha ÷ Receita Líquida × 100

Arredondamento conforme 24-FORMULAS.md.

------------------------------------------------------------------------

# Navegação

Clique em uma linha permite abrir o módulo de origem quando aplicável:

-   Receitas → Comercial
-   Despesas → Despesas

------------------------------------------------------------------------

# Atualizações Automáticas

Eventos:

-   RevenueCreated
-   RevenueUpdated
-   RevenueDeleted
-   ExpensePaid
-   BudgetUpdated

Recalcular imediatamente sem recarregar a página.

------------------------------------------------------------------------

# Exportação

Formatos:

-   PDF
-   Excel
-   CSV

Preservar hierarquia, totais e percentuais.

------------------------------------------------------------------------

# Restrições

-   Não permitir edição manual.
-   Não permitir inclusão de linhas pela interface.
-   Todas as fórmulas são centralizadas no backend.

------------------------------------------------------------------------

# Estados

Loading: Skeleton da tabela.

Empty: "Não existem dados para a competência selecionada."

Error: Mensagem amigável e botão "Tentar novamente".

------------------------------------------------------------------------

# Performance

-   Recalcular em menos de 2 segundos para volumes usuais.
-   Exportação inferior a 5 segundos.

------------------------------------------------------------------------

# Critérios de Aceite

-   Valores consistentes com Comercial e Despesas.
-   Fórmulas idênticas às especificadas em 24-FORMULAS.md.
-   Atualização automática por eventos.
-   Exportação íntegra.
-   Interface somente leitura para dados calculados.
