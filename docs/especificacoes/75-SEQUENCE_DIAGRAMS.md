# 75-SEQUENCE_DIAGRAMS.md

# Diagramas de Sequência

## Objetivo

Definir a sequência oficial de interação entre Frontend, Backend, Banco
de Dados e Eventos do CarCenter PRO Finance utilizando diagramas
Mermaid.

------------------------------------------------------------------------

# SD-001 --- Login

``` mermaid
sequenceDiagram
actor Usuario
participant UI
participant Auth as Supabase Auth
participant API
participant DB

Usuario->>UI: Informa e-mail e senha
UI->>Auth: Solicita autenticação
Auth-->>UI: JWT + Refresh Token
UI->>API: Solicita perfil
API->>DB: Buscar usuário
DB-->>API: Dados do usuário
API-->>UI: Perfil
UI-->>Usuario: HOME
```

------------------------------------------------------------------------

# SD-002 --- Cadastro de Receita

``` mermaid
sequenceDiagram
actor Usuario
participant UI
participant Service
participant Repository
participant DB
participant Events

Usuario->>UI: Salvar receita
UI->>Service: Validar dados
Service->>Repository: Persistir
Repository->>DB: INSERT revenues
DB-->>Repository: OK
Repository-->>Service: Receita criada
Service->>Events: RevenueCreated
Events-->>UI: Atualizar KPIs
Events-->>UI: Atualizar Dashboard
Events-->>UI: Atualizar DRE
Events-->>UI: Atualizar HOME
```

------------------------------------------------------------------------

# SD-003 --- Cadastro de Despesa

``` mermaid
sequenceDiagram
actor Usuario
participant UI
participant ExpenseService
participant DB
participant Events

Usuario->>UI: Nova despesa
UI->>ExpenseService: Validar
ExpenseService->>DB: INSERT expense
ExpenseService->>DB: Gerar parcelas
ExpenseService->>Events: ExpenseCreated
Events-->>UI: Atualizar módulos
```

------------------------------------------------------------------------

# SD-004 --- Registro de Pagamento

``` mermaid
sequenceDiagram
actor Usuario
participant UI
participant ExpenseService
participant DB
participant Events

Usuario->>UI: Confirmar pagamento
UI->>ExpenseService: Registrar
ExpenseService->>DB: UPDATE parcela
ExpenseService->>Events: ExpensePaid
Events-->>UI: Atualizar Dashboard
Events-->>UI: Recalcular DRE
Events-->>UI: Atualizar HOME
```

------------------------------------------------------------------------

# SD-005 --- Exportação

``` mermaid
sequenceDiagram
actor Usuario
participant UI
participant ReportService
participant DB

Usuario->>UI: Exportar relatório
UI->>ReportService: Gerar
ReportService->>DB: Consultar dados
DB-->>ReportService: Resultado
ReportService-->>UI: Arquivo
UI-->>Usuario: Download
```

------------------------------------------------------------------------

# SD-006 --- Auditoria

``` mermaid
sequenceDiagram
participant Service
participant Audit
participant DB

Service->>Audit: Registrar operação
Audit->>DB: INSERT audit_logs
DB-->>Audit: OK
```

------------------------------------------------------------------------

# Regras

-   Services concentram regras de negócio.
-   Repositories apenas acessam dados.
-   Eventos notificam consumidores.
-   Frontend nunca acessa o banco diretamente.

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os fluxos críticos documentados.
-   Diagramas compatíveis com Mermaid.
-   Sequências alinhadas com a arquitetura oficial.
