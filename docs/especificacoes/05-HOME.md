# 05-HOME.md

# Módulo HOME

## Objetivo

A HOME é o centro operacional do CarCenter PRO Finance.

Sua função é apresentar ao usuário um resumo da situação atual da
empresa e permitir acesso rápido aos demais módulos.

A HOME nunca será utilizada para análises profundas. Essa função
pertence ao Dashboard.

------------------------------------------------------------------------

# Layout

A tela será dividida em cinco áreas:

1.  Cabeçalho
2.  Menu lateral
3.  Painel Financeiro
4.  Painel Operacional
5.  Painel Marketing
6.  Assistente Gerencial

------------------------------------------------------------------------

# Cabeçalho

Exibir:

-   Logotipo CarCenter PRO Finance
-   Saudação dinâmica:
    -   Bom dia
    -   Boa tarde
    -   Boa noite
-   Nome do usuário logado
-   Data atual
-   Competência aberta (MM/AAAA)
-   Versão do sistema

------------------------------------------------------------------------

# Menu Lateral

Itens fixos:

-   HOME
-   Comercial
-   Despesas
-   Dashboard
-   DRE
-   Orçamentos
-   Relatórios
-   Configurações

O menu deve permanecer visível durante toda a navegação.

------------------------------------------------------------------------

# Painel Financeiro

Cards obrigatórios:

## Receita Acumulada

Exibir: - Valor acumulado no mês.

Origem: Tabela revenues.

------------------------------------------------------------------------

## Despesa Acumulada

Exibir: - Total apropriado na competência.

Origem: Parcelas pagas da tabela expense_installments.

------------------------------------------------------------------------

## Resultado

Fórmula:

Receita Acumulada - Despesa Acumulada

------------------------------------------------------------------------

## Projeção do Mês

Calcular projeção simples considerando os dias transcorridos da
competência.

Exibir: - Valor projetado - Percentual de evolução

------------------------------------------------------------------------

# Painel Operacional

Exibir:

-   Receitas pendentes de lançamento (dia anterior)
-   Despesas pendentes
-   Qualidade da Base (%)
-   Competência aberta

Qualidade da Base inicia em 100% e reduz conforme registros obrigatórios
ausentes.

------------------------------------------------------------------------

# Painel Marketing

Objetivo:

Auxiliar a rotina de publicações.

Exibir:

## Story

Dias: Segunda a sexta

Status: - Pendente - Publicado

Ao marcar "Publicado": Registrar automaticamente: - usuário - data -
hora

Sugestão de horário: 12:00

## Feed

Dias: Terça e Quinta

Status: - Não previsto - Pendente - Publicado

Ao marcar "Publicado": Registrar: - usuário - data - hora

Sugestão de horário: 19:00

------------------------------------------------------------------------

# Assistente Gerencial

Exibir automaticamente:

-   Pendências importantes
-   Competência em aberto
-   Alertas financeiros
-   Lembretes operacionais

Não utilizar inteligência artificial nesta versão.

As mensagens serão baseadas em regras de negócio.

------------------------------------------------------------------------

# Navegação

Cada card poderá direcionar para seu módulo correspondente.

Exemplos:

Receita → Comercial

Despesa → Despesas

Resultado → Dashboard

------------------------------------------------------------------------

# Estados

Loading

Sem dados

Com dados

Erro

Todos os estados devem possuir mensagens claras ao usuário.

------------------------------------------------------------------------

# Critérios de Aceite

-   HOME carregada em menos de 2 segundos.
-   Cards atualizados automaticamente.
-   Menu lateral funcional.
-   Saudação dinâmica correta.
-   Usuário identificado.
-   Competência exibida.
-   Painel Marketing funcionando.
-   Assistente Gerencial apresentando mensagens conforme regras.
