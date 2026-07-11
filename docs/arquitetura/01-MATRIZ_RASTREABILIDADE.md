# Matriz de Rastreabilidade
## CarCenter PRO Finance

Rastreia, para cada módulo do sistema, onde cada aspecto (visão, regras, dados, tela, componentes, API, eventos, testes, operação) está documentado. Use como mapa de navegação: para implementar ou auditar qualquer módulo, esta matriz indica exatamente quais dos 101 documentos consultar.

---

## HOME

| Aspecto | Documento(s) fonte |
|---|---|
| Visão / objetivo | 00, 01, 05 |
| Regras de negócio | 13 / 48 (BR-001 a BR-005, Qualidade da Base) |
| Fórmulas | 24 (Projeção, Resultado) |
| Tela / UX detalhada | 52-SCREEN_HOME_DETAILED, 20 (wireframe), 31 |
| Componentes usados | 68 (KPI Card, FilterBar), 60 |
| Eventos consumidos | 47 (RevenueCreated, ExpenseCreated, ExpensePaid, BudgetUpdated, MarketingPublished) |
| Casos de uso | 74 (UC-001 contextual) |
| Testes | 62 (seção HOME), 29 (TST não numerado) |
| Manual de operação | 79, 80 |
| Critérios de aceite | 18, 96 |

## COMERCIAL (Receitas)

| Aspecto | Documento(s) fonte |
|---|---|
| Visão / objetivo | 06 |
| Regras de negócio | 13 / 48 (BR-100 a BR-104) |
| Modelo de domínio | 46 (Entidade Revenue) |
| Dados | 03/22 → 61 (tabela `revenues`), 32 (dicionário) |
| Fórmulas | 24 (Ticket Médio, Participação por Categoria) |
| Validações | 23 → 70, 69 (formulário) |
| Tela / UX detalhada | 53-SCREEN_COMMERCIAL_DETAILED, 20, 31 |
| Componentes | 68, 21 |
| API | 16 → 49 (`/revenues`) |
| Eventos publicados | 47 (RevenueCreated, RevenueUpdated, RevenueDeleted) |
| Casos de uso | 74 (UC-002) |
| Diagramas | 75 (SD-002), 77 (BP-001) |
| Testes | 29 (TST-010 a TST-013), 62 |
| Manual de operação | 79, 80, 81 |
| Critérios de aceite | 18, 96 |

## DESPESAS

| Aspecto | Documento(s) fonte |
|---|---|
| Visão / objetivo | 07 |
| Regras de negócio | 13 / 48 (BR-200 a BR-206) |
| Modelo de domínio | 46 (Expense Aggregate, ExpenseInstallment) |
| Máquina de estados | 76 (SM-001 Despesa, SM-002 Parcela) |
| Dados | 03/22 → 61 (`expenses`, `expense_installments`), 32 |
| Fórmulas | 24 (Total Pago, Saldo Remanescente) |
| Validações | 23 → 70, 69 |
| Tela / UX detalhada | 54-SCREEN_EXPENSES_DETAILED, 20, 31 |
| Componentes | 68, 21 |
| API | 16 → 49 (`/expenses`, `/expenses/{id}/payments`) |
| Eventos publicados | 47 (ExpenseCreated, ExpensePaid) |
| Casos de uso | 74 (UC-003, UC-004) |
| Diagramas | 75 (SD-003, SD-004), 77 (BP-002, BP-003) |
| Testes | 29 (TST-020 a TST-023), 62 |
| Manual de operação | 79, 80, 81 |
| Critérios de aceite | 18, 96 |

## DASHBOARD

| Aspecto | Documento(s) fonte |
|---|---|
| Visão / objetivo | 08 |
| Regras de negócio | 13 / 48 (BR-400 a BR-402) — somente leitura |
| Fórmulas | 24 (Projeção de Fechamento, Evolução Mensal) |
| Tela / UX detalhada | 55-SCREEN_DASHBOARD_DETAILED, 20, 31 |
| Componentes | 68 (KPI Card, gráficos Recharts), 60 |
| Eventos consumidos | 47 (Revenue*, Expense*, BudgetUpdated) |
| Casos de uso | 74 (UC-006) |
| Testes | 62 (seção Dashboard) |
| Performance (metas) | 37, 85 (< 3s) |
| Critérios de aceite | 18, 96 |

## DRE

| Aspecto | Documento(s) fonte |
|---|---|
| Visão / objetivo | 09 |
| Regras de negócio | 13 / 48 (BR-300 a BR-304) — somente leitura, sem edição manual |
| Fórmulas | 24 (Receita Bruta/Líquida, Resultado Operacional) |
| Tela / UX detalhada | 56-SCREEN_DRE_DETAILED, 20, 31 |
| Eventos consumidos | 47 |
| Casos de uso | 74 (UC-007) |
| Diagramas | 77 (BP-005) |
| Testes | 29 (TST-030 a TST-032), 62 |
| Critérios de aceite | 18, 96 |

## ORÇAMENTOS

| Aspecto | Documento(s) fonte |
|---|---|
| Visão / objetivo | 10 |
| Regras de negócio | 13 / 48 (BR-500 a BR-502) |
| Modelo de domínio | 46 (Budget Aggregate) |
| Máquina de estados | 76 (SM-004 Orçamento) |
| Dados | 03/22 → 61 (`budgets`), 32 |
| Fórmulas | 24 (Diferença, Execução %) |
| Validações | 23 → 70, 69 |
| Tela / UX detalhada | 57-SCREEN_BUDGET_DETAILED, 20, 31 |
| API | 16 → 49 (`/budgets`) |
| Eventos publicados | 47 (BudgetUpdated) |
| Casos de uso | 74 (UC-005) |
| Diagramas | 77 (BP-006) |
| Testes | 29 (TST-050, TST-051), 62 |
| Critérios de aceite | 18, 96 |

## RELATÓRIOS

| Aspecto | Documento(s) fonte |
|---|---|
| Visão / objetivo | 11 |
| Regras de negócio | 13 / 48 (BR-900, BR-901) |
| Tela / UX detalhada | 58-SCREEN_REPORTS_DETAILED, 20, 31 |
| API | 16 → 49 (`/reports`, `/reports/export`) |
| Casos de uso | 74 (UC-008) |
| Diagramas | 77 (BP-007) |
| Testes | 29 (TST-070 a TST-072), 62 |
| Critérios de aceite | 18, 96 |

## CONFIGURAÇÕES

| Aspecto | Documento(s) fonte |
|---|---|
| Visão / objetivo | 12 |
| Regras de negócio | 13 / 48 (BR-700, BR-701) |
| Dados | 03/22 → 61 (categorias, subcategorias, centros de custo) |
| Tela / UX detalhada | 59-SCREEN_SETTINGS_DETAILED, 20, 31 |
| API | 16 → 49 (`/settings/*`) |
| Eventos publicados | 47 (ConfigChanged) |
| Casos de uso | 74 (UC-009) |
| Testes | 29, 62 |
| Guia do administrador | 66 |
| Critérios de aceite | 18, 96 |

## AUTENTICAÇÃO / SEGURANÇA / PERMISSÕES (transversal)

| Aspecto | Documento(s) fonte |
|---|---|
| Regras gerais | 04 |
| Fluxo completo | 67 |
| Perfis (arquitetura RBAC, preparatória) | 39, 66 ⚠ ADR-002 |
| Segurança / hardening | 34 → 88 |
| Diagramas | 75 (SD-001), 77 (BP-008) |
| Casos de uso | 74 (UC-001) |
| Testes | 29 (TST-001 a TST-003), 62 |
| Catálogo de erros | 38, 71 |

## TRANSVERSAL (Design System, Componentes, Mensagens, Auditoria, Observabilidade)

| Aspecto | Documento(s) fonte |
|---|---|
| Design System | 14 → 60, 73 |
| Biblioteca de componentes | 21 → 68 |
| Formulários | 69 |
| Validações | 23 → 70 |
| Mensagens do sistema | 38, 71 |
| Notificações | 72 |
| Auditoria | 48 (BR-800, BR-801), 34/88 |
| Observabilidade / Logs | 40 → 86, 87 |
| Estrutura de pastas | 02, 51 → 92 |
| Padrões de código | 36 |
| Requisitos não funcionais | 37, 85 |
| Migração de dados | 82 |
| Integrações futuras | 42, 83 |
| Versionamento de API | 84 |
| Backup / DR | 89 |
| Release / Change Management | 90, 91 |
