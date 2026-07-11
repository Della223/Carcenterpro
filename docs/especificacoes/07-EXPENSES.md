# 07-EXPENSES.md

# Módulo Despesas

## Objetivo

Controlar todas as despesas da empresa utilizando o critério de
competência, garantindo que a DRE represente corretamente o resultado do
período.

------------------------------------------------------------------------

# Categorias Obrigatórias

-   Vendas
-   Administrativas
-   Pessoal
-   Geral
-   Marketing
-   Aluguel
-   IPTU

Cada categoria poderá possuir diversas subcategorias cadastradas em
Configurações.

------------------------------------------------------------------------

# Centros de Custo

-   Operacional
-   Administrativo
-   Estrutura / Predial

------------------------------------------------------------------------

# Cadastro de Despesa

## Campos Obrigatórios

-   Competência (MM/AAAA)
-   Fornecedor
-   Categoria
-   Subcategoria
-   Centro de Custo
-   Descrição
-   Valor Total

## Campos Opcionais

-   Observações

------------------------------------------------------------------------

# Parcelamento

Ao cadastrar uma despesa o usuário deverá informar:

-   Pagamento à vista ou parcelado
-   Quantidade de parcelas
-   Data da primeira parcela

Caso parcelado:

O sistema deverá gerar automaticamente todas as parcelas.

Cada parcela conterá:

-   Número
-   Valor
-   Vencimento
-   Situação
-   Data do pagamento

------------------------------------------------------------------------

# Apropriação

A DRE deverá considerar apenas parcelas efetivamente pagas na
competência.

Exemplo:

Compra: R\$ 12.000

12 parcelas de R\$ 1.000

Competência Janeiro

Pagamento Janeiro = R\$ 1.000

Resultado da DRE Janeiro = R\$ 1.000

As demais parcelas serão apropriadas apenas quando pagas.

------------------------------------------------------------------------

# Histórico Financeiro

Cada despesa deverá apresentar:

-   Valor Total
-   Total Pago
-   Saldo Remanescente
-   Quantidade de Parcelas
-   Parcelas Pagas
-   Parcelas Pendentes

------------------------------------------------------------------------

# Registro de Pagamento

Ação:

Registrar Pagamento

Campos:

-   Data do pagamento
-   Valor pago
-   Forma de pagamento
-   Observação

Após registrar:

-   Atualizar saldo
-   Atualizar HOME
-   Atualizar Dashboard
-   Atualizar DRE
-   Atualizar Relatórios

------------------------------------------------------------------------

# Filtros

Permitir filtros por:

-   Competência
-   Categoria
-   Subcategoria
-   Fornecedor
-   Centro de Custo
-   Situação
-   Parcelado
-   Pago
-   Em aberto

------------------------------------------------------------------------

# Indicadores

Exibir:

-   Total de Despesas da Competência
-   Total Pago
-   Total em Aberto
-   Maior Categoria
-   Quantidade de Lançamentos

------------------------------------------------------------------------

# Pesquisa

Pesquisar por:

-   Fornecedor
-   Descrição
-   Categoria
-   Subcategoria

------------------------------------------------------------------------

# Mensagens

Sucesso

"Despesa registrada com sucesso."

Pagamento

"Pagamento registrado com sucesso."

Erro

"Não foi possível concluir a operação."

Exclusão

"Deseja realmente excluir esta despesa?"

------------------------------------------------------------------------

# Auditoria

Registrar automaticamente:

-   Usuário
-   Data
-   Hora
-   Operação
-   Valor alterado

------------------------------------------------------------------------

# Integrações

Após qualquer alteração atualizar automaticamente:

-   HOME
-   Dashboard
-   DRE
-   Orçamentos
-   Relatórios

------------------------------------------------------------------------

# Regras de Negócio

-   Não permitir valor negativo.
-   Não permitir categoria vazia.
-   Não permitir competência inválida.
-   Parcelas não podem ser excluídas individualmente.
-   Exclusão de despesa remove todas as parcelas vinculadas.
-   DRE utiliza somente parcelas pagas na competência.

------------------------------------------------------------------------

# Critérios de Aceite

-   Cadastro completo em menos de 1 minuto.
-   Parcelas geradas automaticamente.
-   Histórico financeiro atualizado.
-   DRE refletindo corretamente a competência.
-   Dashboard atualizado automaticamente.
