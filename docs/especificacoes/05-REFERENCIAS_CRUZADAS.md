# Referências Cruzadas
## CarCenter PRO Finance

Mapeia as citações explícitas entre documentos (ex.: "conforme 24-FORMULAS.md") e as dependências implícitas de dados entre módulos.

## Citações explícitas encontradas no texto original

| Documento de origem | Cita | Contexto |
|---|---|---|
| 31-SCREENS_SPECIFICATION | 24-FORMULAS | Cálculo de Projeção na HOME |
| 32-DATA_DICTIONARY | 24-FORMULAS | Qualidade da Base é calculada, não armazenada |
| 52-SCREEN_HOME_DETAILED | 24-FORMULAS | Origem do cálculo de Projeção |
| 53-SCREEN_COMMERCIAL_DETAILED | (implícito) 24-FORMULAS | Ticket Médio, Média Diária |
| 54-SCREEN_EXPENSES_DETAILED | 24-FORMULAS | Regra de arredondamento no parcelamento |
| 56-SCREEN_DRE_DETAILED | 24-FORMULAS | Percentuais e arredondamento |
| 67-AUTHENTICATION_FLOW_COMPLETE | 38-ERROR_CATALOG | Códigos de erro de autenticação |
| 70-VALIDATION_RULES | 38-ERROR_CATALOG | Catálogo completo de erros de validação |
| 74-USE_CASES_COMPLETE | 70-VALIDATION_RULES, 71-SYSTEM_MESSAGES_CATALOG | Todas as validações e mensagens seguem esses documentos |
| 78-DEPLOYMENT_GUIDE | 61-DATABASE_SQL_COMPLETE | Ordem de execução de migrations |
| 98-COMPLETE_INDEX | (todos) | Índice de leitura recomendada |
| 99-MASTER_DOCUMENT | 98, 97, 93/100, 95, 96 | Lista de referências obrigatórias |
| 100-AI_IMPLEMENTATION_MASTER_PROMPT | 99, 98 | Ordem obrigatória de consulta |

## Dependências de dados entre módulos (de 45-MODULE_SPECIFICATIONS)

```
Configurações → (fornece categorias/subcategorias/centros de custo para) → Comercial, Despesas, Orçamentos
Comercial → HOME, Dashboard, DRE, Relatórios
Despesas → HOME, Dashboard, DRE, Relatórios, Orçamentos (comparativo)
Orçamentos → Dashboard, DRE (comparativo), HOME (alertas)
Relatórios ← consome de todos os módulos (somente leitura)
```

## Eventos de domínio e seus consumidores (de 47-EVENT_CATALOG)

| Evento | Publicado por | Consumido por |
|---|---|---|
| RevenueCreated / RevenueUpdated / RevenueDeleted | Comercial | HOME, Dashboard, DRE, Relatórios, Auditoria |
| ExpenseCreated | Despesas | HOME, Dashboard, Relatórios |
| ExpensePaid | Despesas | HOME, Dashboard, DRE, Relatórios, Auditoria |
| BudgetUpdated | Orçamentos | HOME (Assistente Gerencial), Dashboard |
| MarketingPublished | HOME (painel Marketing) | HOME, Auditoria |
| UserLoggedIn / UserLoggedOut | Autenticação | Auditoria, Observabilidade |
| ConfigChanged | Configurações | Todos os módulos dependentes |

Ordem de processamento de eventos definida em 47: Auditoria → HOME → Dashboard → DRE → Relatórios → Observabilidade.

## Máquinas de estado e módulos afetados (de 76-STATE_MACHINE)

| Entidade | Estados | Módulo |
|---|---|---|
| Despesa | Rascunho → Registrada → Parcialmente Paga → Paga / Cancelada | Despesas |
| Parcela | Em Aberto → Vencida → Paga / Cancelada | Despesas |
| Competência | Aberta → Encerrada | Configurações (transversal a todos) |
| Orçamento | Planejado → Em Execução → Excedido → Encerrado | Orçamentos |
| Notificação | Não Lida → Lida → Arquivada | Notificações (transversal) |
| Sessão do Usuário | Não Autenticado → Autenticado → Expirado | Autenticação (transversal) |

## Diagramas de sequência (75) × Processos BPMN (77) — mesmo fluxo, notações diferentes

| Fluxo de negócio | Diagrama de sequência (75) | BPMN (77) |
|---|---|---|
| Login | SD-001 | BP-008 |
| Cadastro de Receita | SD-002 | BP-001 |
| Cadastro de Despesa | SD-003 | BP-002 |
| Registro de Pagamento | SD-004 | BP-003 |
| Exportação | SD-005 | BP-007 |
| Auditoria | SD-006 | (transversal a todos os BP) |
| Fechamento de Competência | — | BP-004 |
| Geração da DRE | — | BP-005 |
| Controle Orçamentário | — | BP-006 |

## Documentos "guarda-chuva" que referenciam praticamente todo o conjunto

- **98-COMPLETE_INDEX.md** — mapa de leitura de todos os 101 documentos, organizados em 6 grandes grupos (Visão, Arquitetura, Desenvolvimento, Infraestrutura, Operação, Governança).
- **99-MASTER_DOCUMENT.md** — ponto de entrada oficial; referencia explicitamente 98, 97, 96, 95, 93/100.
- **96-ACCEPTANCE_CHECKLIST.md** — consolida critérios de aceite espalhados por 18, e por cada documento de módulo (05-12) e detalhado (52-59).
