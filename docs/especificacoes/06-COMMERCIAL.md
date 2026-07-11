# 06-COMMERCIAL.md

# Módulo Comercial

## Objetivo

Registrar diariamente todas as receitas da empresa, permitindo o
acompanhamento do desempenho comercial em tempo real e alimentando
automaticamente a HOME, Dashboard e DRE.

------------------------------------------------------------------------

# Fontes de Receita

Categorias obrigatórias:

-   Peças Localiza
-   Peças Particular
-   Pneus Localiza
-   Pneus Particular
-   Serviços Localiza
-   Serviços Particular
-   Geometria e Balanceamento Localiza
-   Geometria e Balanceamento Particular

As categorias serão cadastradas no banco e utilizadas em listas de
seleção.

------------------------------------------------------------------------

# Funcionalidades

-   Novo lançamento
-   Editar lançamento
-   Excluir lançamento
-   Pesquisar
-   Filtrar
-   Exportar
-   Visualizar indicadores

------------------------------------------------------------------------

# Campos do Cadastro

## Obrigatórios

-   Data
-   Categoria
-   Quantidade de vendas
-   Valor da receita

## Opcionais

-   Observações do dia

------------------------------------------------------------------------

# Regras

Data: - Não permitir datas futuras.

Quantidade: - Inteiro maior ou igual a zero.

Valor: - Decimal maior que zero.

Categoria: - Obrigatória.

------------------------------------------------------------------------

# Fluxo

1.  Usuário acessa Comercial.
2.  Seleciona "Novo Lançamento".
3.  Preenche os campos.
4.  Salva.
5.  Sistema grava o registro.
6.  Atualiza automaticamente:
    -   HOME
    -   Dashboard
    -   DRE
    -   Indicadores Comerciais

------------------------------------------------------------------------

# Indicadores

Exibir:

-   Receita do dia
-   Receita do mês
-   Quantidade de vendas do dia
-   Quantidade de vendas do mês
-   Ticket médio do dia
-   Ticket médio do mês
-   Receita por categoria
-   Participação por categoria
-   Projeção de fechamento do mês

Ticket Médio = Receita ÷ Quantidade de Vendas

------------------------------------------------------------------------

# Calendário Comercial

Cada dia deve indicar:

-   Receita lançada
-   Receita pendente
-   Observação registrada

Se o dia útil anterior não possuir lançamento, exibir alerta na HOME.

------------------------------------------------------------------------

# Observações do Dia

Campo de texto livre.

Objetivo:

Registrar acontecimentos relevantes que auxiliem na interpretação dos
resultados futuros.

Exemplos:

-   Chuva intensa.
-   Falta de energia.
-   Promoção especial.
-   Equipe reduzida.

------------------------------------------------------------------------

# Pesquisa

Permitir pesquisa por:

-   Data
-   Categoria
-   Faixa de valor
-   Texto das observações

------------------------------------------------------------------------

# Ordenação

-   Data
-   Valor
-   Categoria
-   Quantidade de vendas

------------------------------------------------------------------------

# Mensagens

Sucesso:

"Receita registrada com sucesso."

Erro:

"Não foi possível registrar a receita."

Confirmação de exclusão:

"Deseja realmente excluir este lançamento?"

------------------------------------------------------------------------

# Auditoria

Registrar:

-   Usuário
-   Data
-   Hora
-   Operação

------------------------------------------------------------------------

# Integrações

Após qualquer alteração atualizar automaticamente:

-   HOME
-   Dashboard
-   DRE
-   Relatórios

------------------------------------------------------------------------

# Critérios de Aceite

-   Cadastro em até 30 segundos.
-   Atualização automática dos indicadores.
-   Ticket médio calculado corretamente.
-   Projeção recalculada.
-   Integração automática com DRE e Dashboard.
