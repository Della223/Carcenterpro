# 09-DRE.md

# Módulo DRE

## Objetivo

A Demonstração do Resultado do Exercício (DRE) é o principal relatório
financeiro do sistema.

Ela será gerada automaticamente a partir dos módulos Comercial, Despesas
e Orçamentos, não permitindo edição manual.

------------------------------------------------------------------------

# Princípios

-   Nenhum lançamento direto.
-   Atualização automática.
-   Regime de competência conforme regras do sistema.
-   Apenas leitura.

------------------------------------------------------------------------

# Estrutura

## Receita Bruta

-   Peças Localiza
-   Peças Particular
-   Pneus Localiza
-   Pneus Particular
-   Serviços Localiza
-   Serviços Particular
-   Geometria e Balanceamento Localiza
-   Geometria e Balanceamento Particular

= Receita Bruta

## (-) Deduções

Estrutura preparada para impostos, devoluções e descontos.

= Receita Líquida

## (-) Despesas Operacionais

Categorias:

-   Vendas
-   Administrativas
-   Pessoal
-   Geral
-   Marketing
-   Aluguel
-   IPTU

= Resultado Operacional

## Resultado Final

Resultado = Receita Líquida - Despesas Operacionais

------------------------------------------------------------------------

# Alimentação

Receitas: Tabela revenues.

Despesas: Parcelas efetivamente pagas na competência
(expense_installments).

Orçamentos: Tabela budgets.

------------------------------------------------------------------------

# Competência

A DRE considera somente:

-   Receitas registradas na competência.
-   Parcelas pagas na competência.

Despesas futuras não afetam o resultado atual.

------------------------------------------------------------------------

# Comparativos

Exibir:

-   Realizado
-   Orçado
-   Diferença (R\$)
-   Diferença (%)

------------------------------------------------------------------------

# Indicadores

-   Receita Líquida
-   Total Despesas
-   Resultado
-   Margem Operacional (quando houver custo implementado em versão
    futura)

------------------------------------------------------------------------

# Filtros

-   Competência
-   Ano

------------------------------------------------------------------------

# Exportação

-   PDF
-   Excel
-   Impressão

------------------------------------------------------------------------

# Atualização

Atualizar automaticamente após:

-   Receita criada, editada ou excluída.
-   Pagamento de despesa.
-   Alteração de orçamento.

------------------------------------------------------------------------

# Restrições

-   Não permitir edição manual.
-   Não permitir exclusão de linhas.
-   Não permitir alteração de fórmulas.

------------------------------------------------------------------------

# Mensagens

Sem dados: "Não existem dados para a competência selecionada."

Erro: "Não foi possível calcular a DRE."

------------------------------------------------------------------------

# Critérios de Aceite

-   Geração automática.
-   Valores consistentes com Comercial e Despesas.
-   Comparativo Orçado x Realizado funcional.
-   Exportação disponível.
-   Nenhuma edição manual permitida.
