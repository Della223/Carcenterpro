# 10-BUDGET.md

# Módulo Orçamentos

## Objetivo

Permitir o planejamento financeiro anual da empresa por categoria de
despesa, acompanhando automaticamente a execução do orçamento e
comparando os valores realizados com os planejados.

------------------------------------------------------------------------

# Princípios

-   Um orçamento por ano.
-   Valores distribuídos por categoria.
-   Comparação automática com o realizado.
-   Integração total com Dashboard e DRE.

------------------------------------------------------------------------

# Estrutura

Cada exercício possuirá um orçamento próprio.

Campos:

-   Ano
-   Categoria
-   Valor Orçado Anual

O sistema distribuirá automaticamente o orçamento anual em 12
competências iguais.

Versões futuras poderão permitir distribuição mensal personalizada.

------------------------------------------------------------------------

# Categorias

-   Vendas
-   Administrativas
-   Pessoal
-   Geral
-   Marketing
-   Aluguel
-   IPTU

------------------------------------------------------------------------

# Funcionalidades

-   Criar orçamento anual
-   Editar orçamento
-   Duplicar orçamento do ano anterior
-   Excluir orçamento
-   Visualizar histórico

------------------------------------------------------------------------

# Comparativos

Para cada categoria exibir:

-   Orçado
-   Realizado
-   Diferença em R\$
-   Diferença em %
-   Percentual de execução

------------------------------------------------------------------------

# Alertas

Exibir alerta quando:

-   Realizado \> 100% do orçamento
-   Execução superior a 90%
-   Categoria sem orçamento definido

------------------------------------------------------------------------

# Integrações

Atualizar automaticamente:

-   Dashboard
-   DRE
-   HOME (alertas do assistente gerencial)

------------------------------------------------------------------------

# Filtros

-   Ano
-   Categoria

------------------------------------------------------------------------

# Exportação

-   PDF
-   Excel
-   CSV

------------------------------------------------------------------------

# Regras

-   Apenas um orçamento ativo por ano.
-   Não permitir categorias duplicadas no mesmo exercício.
-   Alterações devem refletir imediatamente nos comparativos.

------------------------------------------------------------------------

# Mensagens

Sucesso: "Orçamento salvo com sucesso."

Erro: "Não foi possível salvar o orçamento."

------------------------------------------------------------------------

# Critérios de Aceite

-   Cadastro anual funcional.
-   Comparativo Orçado x Realizado atualizado automaticamente.
-   Alertas financeiros funcionando.
-   Integração com Dashboard e DRE concluída.
