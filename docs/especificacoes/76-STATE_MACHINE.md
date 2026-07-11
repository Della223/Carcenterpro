# 76-STATE_MACHINE.md

# Máquinas de Estado do Sistema

## Objetivo

Definir formalmente todos os estados possíveis das entidades críticas do
CarCenter PRO Finance, bem como as transições permitidas, eventos
disparadores e restrições.

------------------------------------------------------------------------

# Princípios

-   Toda mudança de estado deve ocorrer por regra de negócio.
-   Transições inválidas devem ser bloqueadas no backend.
-   Toda mudança relevante gera auditoria.

------------------------------------------------------------------------

# SM-001 --- Despesa

Estados:

-   Rascunho
-   Registrada
-   Parcialmente Paga
-   Paga
-   Cancelada

Transições:

Rascunho → Registrada

Registrada → Parcialmente Paga

Parcialmente Paga → Paga

Registrada → Cancelada

Parcialmente Paga → Cancelada (somente conforme política financeira)

Não permitido:

-   Paga → Registrada
-   Cancelada → Registrada

Eventos:

-   ExpenseCreated
-   ExpensePaid
-   ExpenseCancelled

------------------------------------------------------------------------

# SM-002 --- Parcela

Estados:

-   Em Aberto
-   Vencida
-   Paga
-   Cancelada

Regras:

-   Em Aberto → Vencida (automaticamente na data)
-   Em Aberto → Paga
-   Vencida → Paga
-   Em Aberto → Cancelada

Não permitido:

-   Paga → Em Aberto

Evento:

ExpensePaid

------------------------------------------------------------------------

# SM-003 --- Competência

Estados:

-   Aberta
-   Encerrada

Transições:

Aberta → Encerrada

Não permitido:

Encerrada → Aberta

Regras:

-   Apenas uma competência aberta por vez.
-   Encerramento registra auditoria.

------------------------------------------------------------------------

# SM-004 --- Orçamento

Estados:

-   Planejado
-   Em Execução
-   Excedido
-   Encerrado

Transições:

Planejado → Em Execução

Em Execução → Excedido

Em Execução → Encerrado

Excedido → Encerrado

Evento:

BudgetUpdated

------------------------------------------------------------------------

# SM-005 --- Notificação

Estados:

-   Não Lida
-   Lida
-   Arquivada

Transições:

Não Lida → Lida

Lida → Arquivada

------------------------------------------------------------------------

# SM-006 --- Sessão do Usuário

Estados:

-   Não Autenticado
-   Autenticado
-   Expirado

Transições:

Não Autenticado → Autenticado

Autenticado → Expirado

Autenticado → Não Autenticado (Logout)

Eventos:

-   UserLoggedIn
-   UserLoggedOut

------------------------------------------------------------------------

# Restrições Gerais

-   Toda transição inválida retorna erro de negócio.
-   Mudanças de estado devem ser idempotentes.
-   Estados históricos não podem ser alterados diretamente no banco.

------------------------------------------------------------------------

# Auditoria

Registrar:

-   Estado anterior
-   Estado atual
-   Usuário
-   Data/Hora
-   Motivo da transição

------------------------------------------------------------------------

# Critérios de Aceite

-   Todas as entidades críticas possuem máquina de estados definida.
-   Nenhuma transição inválida é permitida.
-   Eventos e auditoria sincronizados com cada mudança de estado.
