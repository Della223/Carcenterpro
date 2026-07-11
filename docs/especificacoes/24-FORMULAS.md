# 24-FORMULAS.md

# Fórmulas e Indicadores

## Objetivo

Padronizar todos os cálculos matemáticos do CarCenter PRO Finance para
que qualquer implementação produza exatamente os mesmos resultados.

------------------------------------------------------------------------

# Regras Gerais

-   Todos os valores monetários devem utilizar precisão de 2 casas
    decimais.
-   Arredondamento padrão: HALF_UP.
-   Divisões por zero retornam 0, nunca erro.
-   Percentuais apresentados com 2 casas decimais.

------------------------------------------------------------------------

# Comercial

## Receita do Dia

Soma de todas as receitas da data selecionada.

    receitaDia = SUM(revenues.amount WHERE revenue_date = data)

## Receita da Competência

    receitaCompetencia = SUM(revenues.amount)

Filtrada pela competência.

## Quantidade de Vendas

    quantidade = SUM(revenues.quantity)

## Ticket Médio

    ticketMedio = receitaCompetencia / quantidade

Se quantidade = 0

    ticketMedio = 0

## Participação da Categoria

    participacao = (receitaCategoria / receitaCompetencia) * 100

------------------------------------------------------------------------

# Despesas

## Total Pago

    SUM(expense_installments.amount WHERE paid = true)

## Total em Aberto

    SUM(expense_installments.amount WHERE paid = false)

## Saldo Remanescente

    saldo = valorTotal - totalPago

## Percentual Pago

    (totalPago / valorTotal) * 100

------------------------------------------------------------------------

# Resultado

    resultado = receitaCompetencia - despesasCompetencia

------------------------------------------------------------------------

# DRE

## Receita Bruta

Soma de todas as categorias de receita.

## Receita Líquida

    receitaLiquida = receitaBruta - deducoes

## Despesas Operacionais

Soma apenas das parcelas pagas na competência.

## Resultado Operacional

    resultadoOperacional = receitaLiquida - despesasOperacionais

------------------------------------------------------------------------

# Orçamentos

## Diferença

    diferenca = realizado - orcado

## Diferença Percentual

    ((realizado - orcado) / orcado) * 100

Se orçamento = 0

Resultado = 0

## Execução

    (realizado / orcado) * 100

------------------------------------------------------------------------

# Dashboard

## Projeção de Fechamento

    projecao = (receitaCompetencia / diasDecorridos) * diasDoMes

## Evolução Mensal

    variacao = ((mesAtual - mesAnterior) / mesAnterior) * 100

Se mês anterior = 0

Resultado = 0

------------------------------------------------------------------------

# Qualidade da Base

Valor inicial:

100%

Descontos:

-   Dia útil sem receita: -5%
-   Parcela vencida: -2%
-   Categoria obrigatória ausente: -5%
-   Competência inconsistente: -10%

Limites:

Mínimo: 0%

Máximo: 100%

------------------------------------------------------------------------

# Marketing

## Story

    percentualStories = publicados / previstos * 100

## Feed

    percentualFeed = publicados / previstos * 100

------------------------------------------------------------------------

# Apresentação

Moeda:

R\$ 0,00

Percentual:

0,00%

Inteiros:

Sem casas decimais.

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os módulos utilizam exclusivamente estas fórmulas.
-   Nenhum cálculo duplicado.
-   Resultados consistentes entre HOME, Dashboard, DRE e Relatórios.
