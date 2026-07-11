# 13-BUSINESS_RULES.md

# Regras de Negócio

## Objetivo

Este documento consolida todas as regras de negócio do CarCenter PRO
Finance. Nenhuma implementação poderá contrariar estas regras.

------------------------------------------------------------------------

# Regras Gerais

1.  Um dado deve ser digitado apenas uma vez.
2.  Toda informação derivada deve ser calculada automaticamente.
3.  Nenhum módulo poderá duplicar dados de outro módulo.
4.  Toda alteração deverá ser auditada.
5.  Todos os valores monetários serão armazenados em Real (R\$).

------------------------------------------------------------------------

# Receitas

-   Toda receita pertence a exatamente uma categoria.
-   Não permitir receitas com valor menor ou igual a zero.
-   Não permitir datas futuras.
-   A quantidade de vendas poderá ser zero somente quando houver ajuste
    administrativo.
-   Cada lançamento atualiza automaticamente HOME, Dashboard, DRE e
    Relatórios.

------------------------------------------------------------------------

# Despesas

-   Toda despesa pertence a uma categoria, subcategoria e centro de
    custo.
-   Não permitir valor negativo.
-   Toda despesa parcelada gera automaticamente todas as parcelas.
-   Parcelas individuais não podem ser excluídas.
-   Exclusão da despesa exclui todas as parcelas vinculadas.

------------------------------------------------------------------------

# Competência

-   Competência é informada no cadastro da despesa.
-   A DRE considera apenas parcelas efetivamente pagas na competência.
-   Despesas futuras não impactam competências anteriores.

------------------------------------------------------------------------

# Pagamentos

Ao registrar um pagamento o sistema deverá:

1.  Atualizar parcela.
2.  Atualizar saldo remanescente.
3.  Atualizar histórico financeiro.
4.  Atualizar HOME.
5.  Atualizar Dashboard.
6.  Atualizar DRE.
7.  Atualizar Relatórios.

------------------------------------------------------------------------

# DRE

-   Nunca recebe edição manual.
-   É alimentada exclusivamente por Comercial, Despesas e Orçamentos.
-   Sempre refletirá a competência selecionada.

------------------------------------------------------------------------

# Dashboard

-   Somente leitura.
-   Todos os indicadores são calculados automaticamente.
-   Nunca permitir edição de dados.

------------------------------------------------------------------------

# Orçamentos

-   Um orçamento por exercício.
-   Não permitir categorias duplicadas no mesmo ano.
-   Alterações devem refletir imediatamente nos comparativos.

------------------------------------------------------------------------

# Marketing

Story: - Obrigatório de segunda a sexta. - Horário sugerido: 12:00.

Feed: - Terça e quinta. - Horário sugerido: 19:00.

Ao marcar "Publicado", registrar automaticamente: - Usuário - Data -
Hora

------------------------------------------------------------------------

# Qualidade da Base

A qualidade da base inicia em 100%.

Reduzir pontuação quando existirem:

-   Dias úteis sem receitas.
-   Categorias obrigatórias não cadastradas.
-   Parcelas vencidas sem pagamento.
-   Competência inconsistente.

A pontuação nunca poderá ser inferior a 0%.

------------------------------------------------------------------------

# Assistente Gerencial

Baseado exclusivamente em regras.

Exemplos:

-   Receita do dia não lançada.
-   Competência aberta.
-   Orçamento excedido.
-   Parcelas vencidas.
-   Feed pendente.
-   Story pendente.

Não utilizar IA na versão 1.0.

------------------------------------------------------------------------

# Auditoria

Registrar em toda operação:

-   Usuário
-   Data
-   Hora
-   Operação
-   Registro afetado
-   Valor anterior (quando aplicável)
-   Valor atual

------------------------------------------------------------------------

# Integridade

-   Não excluir registros financeiros históricos.
-   Utilizar desativação quando necessário.
-   Manter rastreabilidade completa.

------------------------------------------------------------------------

# Critérios de Aceite

O sistema será considerado aderente quando todas as regras deste
documento forem respeitadas integralmente em todos os módulos.
