# 52-SCREEN_HOME_DETAILED.md

# Especificação Detalhada da Tela HOME

## Objetivo

A HOME é o centro operacional do CarCenter PRO Finance. Ela deve
permitir que o gestor compreenda a situação do negócio em poucos
segundos e navegue rapidamente para qualquer módulo.

------------------------------------------------------------------------

# Layout Geral

``` text
+----------------------------------------------------------------------------------+
| Logo | HOME | Competência | Usuário | Perfil | Sair                              |
+---------+-----------------------------------------------------------------------+
| Menu    | KPIs Financeiros                                                     |
| Lateral |-----------------------------------------------------------------------|
|         | Receita | Despesa | Resultado | Projeção                             |
|         |-----------------------------------------------------------------------|
|         | Qualidade da Base | Pendências | Marketing                           |
|         |-----------------------------------------------------------------------|
|         | Assistente Gerencial                                                 |
+---------+-----------------------------------------------------------------------+
| Rodapé: versão | ambiente | usuário                                            |
+----------------------------------------------------------------------------------+
```

------------------------------------------------------------------------

# Cabeçalho

Campos obrigatórios:

-   Logotipo
-   Nome do sistema
-   Competência ativa
-   Saudação ao usuário
-   Menu de perfil
-   Botão "Sair"

Altura: 64px.

------------------------------------------------------------------------

# Menu Lateral

Itens:

1.  HOME
2.  Comercial
3.  Despesas
4.  Dashboard
5.  DRE
6.  Orçamentos
7.  Relatórios
8.  Configurações

Regras:

-   Ícones monocromáticos.
-   Item ativo destacado.
-   Não recolher automaticamente.

------------------------------------------------------------------------

# Cards Financeiros

## Receita Acumulada

Origem: SUM(revenues.amount)

Clique: Navega para Comercial com filtro da competência.

Atualização: Tempo real após criação, edição ou exclusão de receitas.

------------------------------------------------------------------------

## Despesa Acumulada

Origem: Parcelas pagas da competência.

Clique: Abre módulo Despesas filtrado.

------------------------------------------------------------------------

## Resultado

Fórmula: Receita - Despesas Pagas

Exibir valor em BRL.

------------------------------------------------------------------------

## Projeção

Origem: Documento 24-FORMULAS.md

Exibir estimativa de fechamento do mês.

------------------------------------------------------------------------

# Painel Qualidade da Base

Exibir:

-   Percentual atual
-   Motivos de perda
-   Botão "Ver detalhes"

Atualização automática.

------------------------------------------------------------------------

# Pendências

Exibir no máximo 10 itens:

-   Parcelas vencidas
-   Receitas não registradas
-   Competência inconsistente
-   Orçamentos excedidos

Clique leva ao módulo correspondente.

------------------------------------------------------------------------

# Marketing

Cards:

-   Story
-   Feed

Informações:

-   Status
-   Horário sugerido
-   Última publicação

Botão:

"Marcar como publicado"

Ao confirmar:

-   Registrar usuário
-   Registrar data/hora
-   Atualizar HOME

------------------------------------------------------------------------

# Assistente Gerencial

Ordenação:

1.  Crítico
2.  Alto
3.  Médio
4.  Baixo

Cada alerta contém:

-   Ícone
-   Título
-   Descrição
-   Botão "Resolver"

Máximo de 5 alertas visíveis.

------------------------------------------------------------------------

# Atualizações Automáticas

A HOME deve reagir imediatamente aos eventos:

-   RevenueCreated
-   RevenueUpdated
-   RevenueDeleted
-   ExpenseCreated
-   ExpensePaid
-   BudgetUpdated
-   MarketingPublished

Sem necessidade de recarregar a página.

------------------------------------------------------------------------

# Estados

Loading: Skeleton para todos os cards.

Empty: Mensagem orientando o primeiro lançamento.

Error: Mensagem amigável + botão "Tentar novamente".

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os cards atualizam automaticamente.
-   Navegação por clique funcional.
-   Performance inferior a 2 segundos.
-   Interface consistente com o Design System.
-   Todas as informações em Português (Brasil).
