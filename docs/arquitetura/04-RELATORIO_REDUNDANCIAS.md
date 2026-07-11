# Relatório de Redundâncias
## CarCenter PRO Finance

Este relatório lista todos os grupos de documentos com conteúdo sobreposto, do mais crítico (duplicata literal) ao mais leve (mesmo tema, granularidade diferente). Decisões de qual documento prevalece estão detalhadas nos ADRs correspondentes em `03-ADRs.md`.

## 1. Duplicatas literais (byte-a-byte)

| Grupo | Arquivos | Ação |
|---|---|---|
| Backlog | `41-BACKLOG.md` = `41-BACKLOG (1).md` | Manter uma cópia; descartar a com sufixo `(1)` |
| Manual do Gestor | `80-MANAGER_OPERATION_MANUAL.md` = `80-MANAGER_OPERATION_MANUAL (1).md` | Manter uma cópia; descartar a com sufixo `(1)` |

## 2. Mesmo escopo, granularidade crescente (documento posterior substitui o anterior)

| Tema | Cadeia de evolução | Canônico | ADR |
|---|---|---|---|
| Banco de Dados | 03 → 22 → 33 → 61 | 61 | ADR-006 |
| Contratos de API | 16 → 49 | 49 | ADR-007 |
| Regras de Negócio | 13 → 48 | 48 | ADR-008 |
| Design System | 14 → 60 | 60 | — |
| Componentes de UI | 21 → 68 | 68 | — |
| Validações | 23 → 70 (com 69 para UX de formulário) | 70 | — |
| Testes | 29 → 62 | 62 | — |
| Implementação (sequência de sprints) | 28 → 50 (mas ver conflito com 95) | 50, com ressalva | ADR-001 |
| Estrutura de repositório | 51 → 92 | 92 | ADR-005 |
| Deploy | 35 → 78 | 78 | — |
| Observabilidade | 40 → 86 (87 detalha logging) | 86 | — |
| Prompt mestre para IA | 19 → 30 → 93/94 → 99/100 | 99, 100 | ADR-004 |
| Segurança | 34 → 88 | 88 | — |
| Especificação de telas | 05-12 (regra) + 20 (esboço) + 31 (estrutura) → 52-59 (completo) | 52-59 para UI; 05-12 para regra | ADR-010 |

## 3. Mesmo título, escopos diferentes (não é redundância — risco de confusão de nome)

| Tema | Arquivos | Distinção |
|---|---|---|
| Máquina de Estados | 25 vs. 76 | 25 = estados de componentes de UI; 76 = estados de entidades de domínio | 

Ver ADR-003 para a convenção de nomenclatura recomendada.

## 4. Conteúdo complementar (nenhum substitui o outro — leitura conjunta necessária)

| Tema | Documentos | Relação |
|---|---|---|
| Arquitetura | 02 (detalhado) + 97 (resumo executivo) | 97 é síntese de 02, não substituto |
| Fluxos/Processos | 15 (alto nível) + 27 (diagramas texto) + 75 (sequência Mermaid) + 77 (BPMN Mermaid) | Quatro níveis de detalhe do mesmo conjunto de fluxos, sem conflito |
| Operação/Produção | 64 (rotina) + 65 (runbook de incidentes) | 64 é operação contínua; 65 é resposta a incidentes |
| Observabilidade | 86 (visão geral + SLO/SLA) + 87 (padrão específico de logging) | 87 detalha um pilar de 86 |
| Manuais de usuário | 79 (usuário geral) + 80 (gestor) + 81 (financeiro) | Públicos-alvo diferentes, sem sobreposição de conteúdo |
| Mensagens/Erros | 38 (catálogo de erros técnicos, ERR-xxx) + 71 (catálogo de mensagens de UI, MSG-xxx) | 71 é mais amplo (inclui sucesso/confirmação), 38 é focado em erros com causa técnica |

## 5. Conflito de conteúdo real (não é apenas redundância — ver ADR)

| Tema | Documentos em conflito | ADR |
|---|---|---|
| Ordem de implementação dos módulos | 28/50 (Configurações por último) vs. 95 (Configurações primeiro) | ADR-001 |
| Escopo de perfis/permissões na v1.0 | 00/04/39 (permissões idênticas) vs. 66/74 (múltiplos atores ativos) | ADR-002 |

## Resumo Quantitativo

- **101 documentos** recebidos (00 a 100)
- **2 duplicatas literais** de upload (não contam como documentos adicionais)
- **14 grupos** de documentos com sobreposição por evolução de granularidade
- **1 par** de documentos com nome idêntico e escopo distinto
- **6 grupos** de conteúdo complementar sem conflito
- **2 conflitos reais** de conteúdo, ambos exigindo confirmação humana antes da implementação (ADR-001, ADR-002)
