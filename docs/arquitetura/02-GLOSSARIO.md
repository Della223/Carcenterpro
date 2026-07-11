# Glossário
## CarCenter PRO Finance

Termos de negócio e técnicos usados de forma consistente em toda a documentação. Fonte principal: 32-DATA_DICTIONARY, 46-DOMAIN_MODEL, 24-FORMULAS, 76-STATE_MACHINE.

| Termo | Definição |
|---|---|
| **Apropriação** | Reconhecimento de uma despesa (ou parcela) no resultado financeiro de uma competência específica; ocorre somente quando a parcela é efetivamente paga naquela competência. |
| **Assistente Gerencial** | Componente da HOME que exibe alertas baseados em regras de negócio (não IA) sobre pendências: receitas não lançadas, parcelas vencidas, orçamento excedido, marketing pendente, competência inconsistente. Máximo 5 alertas simultâneos, priorizados por criticidade. |
| **Auditoria (audit_logs)** | Registro imutável de toda operação de escrita no sistema (usuário, data/hora, módulo, operação, valores anteriores/atuais). Não editável pela interface. |
| **Bounded Context** | Fronteira lógica de domínio (DDD). O sistema define 4: Financeiro, Comercial, Administração, Plataforma (ver 46-DOMAIN_MODEL). |
| **Centro de Custo** | Classificação organizacional da despesa (Operacional, Administrativo, Estrutura/Predial). Independente de categoria/subcategoria. |
| **Competência** | Período de referência financeira, no formato MM/AAAA. Apenas uma competência pode estar "Aberta" por vez (ver Máquina de Estados SM-003). |
| **Correlation ID** | Identificador único que acompanha uma requisição por toda a cadeia (frontend → API → banco), usado para rastreamento e diagnóstico (observabilidade). |
| **DRE (Demonstração do Resultado do Exercício)** | Relatório financeiro central, gerado automaticamente a partir de Comercial + Despesas + Orçamentos. Somente leitura, sem edição manual. Estrutura: Receita Bruta → (-) Deduções → Receita Líquida → (-) Despesas Operacionais → Resultado Operacional. |
| **Evento de Domínio** | Fato de negócio já ocorrido, publicado para desacoplar módulos (ex.: `RevenueCreated`, `ExpensePaid`). Imutável; consumidores devem ser idempotentes (ver 47-EVENT_CATALOG). |
| **Execução (orçamentária)** | Percentual do orçamento já utilizado: `(realizado / orçado) × 100`. |
| **Exclusão lógica (soft delete)** | Prática obrigatória para dados financeiros: nunca excluir fisicamente; usar `active = false` ou equivalente. |
| **Qualidade da Base** | Indicador de 0% a 100%, iniciando em 100%, que penaliza a ausência de lançamentos obrigatórios, parcelas vencidas não pagas e inconsistências de competência (ver fórmulas em 24-FORMULAS). |
| **RLS (Row Level Security)** | Política de segurança do PostgreSQL/Supabase que restringe acesso a linhas de tabela por usuário autenticado; obrigatória em todas as tabelas transacionais. |
| **Saldo Remanescente** | `valorTotal - totalPago` de uma despesa parcelada. |
| **Ticket Médio** | `receita ÷ quantidade de vendas`; retorna 0 quando a quantidade é 0 (nunca gera erro de divisão). |
| **Value Object** | Objeto de domínio sem identidade própria, imutável (ex.: Competência, Dinheiro, Percentual — ver 46-DOMAIN_MODEL). |

## Entidades de Dados

| Entidade | Tabela | Descrição resumida |
|---|---|---|
| Usuário | `users` | Daniel, Nicole, Carlinhos — mesmas permissões na v1.0. |
| Receita | `revenues` | Lançamento comercial diário (data, categoria, quantidade, valor). |
| Categoria de Receita | `revenue_categories` | 8 categorias fixas (Peças/Pneus/Serviços/Geometria × Localiza/Particular). |
| Despesa | `expenses` | Lançamento de despesa por competência, fornecedor, categoria/subcategoria/centro de custo. |
| Parcela | `expense_installments` | Parcela individual de uma despesa; pertence a exatamente uma despesa. |
| Categoria de Despesa | `expense_categories` | Vendas, Administrativas, Pessoal, Geral, Marketing, Aluguel, IPTU. |
| Subcategoria de Despesa | `expense_subcategories` | Pertence obrigatoriamente a uma categoria de despesa. |
| Centro de Custo | `cost_centers` | Operacional, Administrativo, Estrutura/Predial. |
| Orçamento | `budgets` | Valor planejado anual por categoria de despesa. |
| Publicação de Marketing | `marketing_posts` | Registro de Story/Feed publicado (usuário, data/hora). |
| Log de Auditoria | `audit_logs` | Trilha de todas as operações de escrita. |

## Categorias Fixas de Receita (nunca renomear — regra inegociável)

1. Peças Localiza
2. Peças Particular
3. Pneus Localiza
4. Pneus Particular
5. Serviços Localiza
6. Serviços Particular
7. Geometria e Balanceamento Localiza
8. Geometria e Balanceamento Particular

## Categorias Fixas de Despesa (nunca renomear — regra inegociável)

1. Vendas
2. Administrativas
3. Pessoal
4. Geral
5. Marketing
6. Aluguel
7. IPTU

## Siglas e Convenções

| Sigla | Significado |
|---|---|
| ADR | Architecture Decision Record |
| BR-xxx | Identificador de regra de negócio (ver 48-BUSINESS_RULES_COMPLETE) |
| DDD | Domain-Driven Design |
| DoD / DoR | Definition of Done / Definition of Ready |
| ERR-xxx | Código de erro (ver 38-ERROR_CATALOG) |
| MSG-xxx | Código de mensagem padronizada (ver 71-SYSTEM_MESSAGES_CATALOG) |
| RBAC | Role-Based Access Control |
| RLS | Row Level Security |
| RPO / RTO | Recovery Point/Time Objective |
| SLI / SLO / SLA | Service Level Indicator/Objective/Agreement |
| SM-xxx | Identificador de máquina de estados (ver 76-STATE_MACHINE) |
| TST-xxx | Identificador de caso de teste (ver 29/62) |
| UC-xxx | Identificador de caso de uso (ver 74-USE_CASES_COMPLETE) |
| US-xxx | Identificador de história de usuário (ver 17-USER_STORIES) |
