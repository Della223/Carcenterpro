# 72-NOTIFICATION_SYSTEM_SPEC.md

# Especificação do Sistema de Notificações

## Objetivo

Definir o comportamento completo das notificações do CarCenter PRO
Finance, garantindo comunicação proativa, consistente e não intrusiva
com o usuário.

------------------------------------------------------------------------

# Princípios

-   Notificações relevantes.
-   Prioridade por impacto.
-   Linguagem clara em Português (Brasil).
-   Ação rápida sempre que possível.

------------------------------------------------------------------------

# Tipos de Notificação

## Toast

Uso:

-   Sucesso
-   Aviso
-   Erro
-   Informação

Tempo padrão:

-   4 segundos
-   Erros críticos permanecem até interação do usuário.

------------------------------------------------------------------------

## Centro de Notificações

Exibir:

-   Título
-   Descrição
-   Data/Hora
-   Prioridade
-   Status (Lida / Não lida)
-   Ação relacionada

Ordenação:

1.  Crítica
2.  Alta
3.  Média
4.  Baixa
5.  Mais recente

------------------------------------------------------------------------

## Assistente Gerencial

Alertas inteligentes:

-   Orçamento excedido
-   Parcelas vencidas
-   Competência sem fechamento
-   Receita abaixo da meta
-   Falhas de integração
-   Publicação de marketing pendente

Máximo de 5 alertas simultâneos na HOME.

------------------------------------------------------------------------

# Prioridades

## Crítica

-   Falha de autenticação
-   Erro financeiro
-   Perda de comunicação

## Alta

-   Parcelas vencidas
-   Orçamento excedido
-   Competência não encerrada

## Média

-   Atualizações concluídas
-   Exportações finalizadas

## Baixa

-   Dicas
-   Informações gerais

------------------------------------------------------------------------

# Estados

-   Não lida
-   Lida
-   Arquivada

Regras:

-   Toasts não são arquivados.
-   Alertas críticos não podem ser ignorados sem confirmação.

------------------------------------------------------------------------

# Eventos Geradores

-   RevenueCreated
-   ExpensePaid
-   BudgetUpdated
-   MarketingPublished
-   UserLoggedIn
-   UserLoggedOut
-   ConfigChanged

------------------------------------------------------------------------

# Ações

Cada notificação poderá:

-   Abrir módulo relacionado.
-   Executar ação rápida.
-   Marcar como lida.
-   Arquivar.

------------------------------------------------------------------------

# Lembretes

Automáticos:

-   Fechamento da competência.
-   Parcelas próximas do vencimento.
-   Pendências financeiras.
-   Marketing diário.

------------------------------------------------------------------------

# Auditoria

Registrar:

-   Criação
-   Leitura
-   Arquivamento
-   Ação executada

------------------------------------------------------------------------

# Performance

-   Exibição em menos de 500 ms.
-   Atualização em tempo real quando possível.

------------------------------------------------------------------------

# Critérios de Aceite

-   Notificações centralizadas.
-   Priorização consistente.
-   Atualização automática.
-   Linguagem padronizada.
-   Integração com HOME, Dashboard e Assistente Gerencial.
