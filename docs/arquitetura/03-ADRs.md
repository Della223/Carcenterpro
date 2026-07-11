# Architecture Decision Records (ADRs)
## CarCenter PRO Finance

Cada ADR documenta um ponto de ambiguidade, conflito ou decisão de organização encontrado entre os 101 documentos originais. **Nenhuma regra de negócio foi criada, alterada ou removida** — os ADRs apenas registram qual documento prevalece, ou sinalizam explicitamente quando a decisão exige validação humana, conforme a própria diretriz dos documentos-fonte (93, 94, 99, 100: "em caso de dúvida, interrompa e solicite decisão humana").

---

### ADR-000 — Hierarquia de resolução de conflitos entre documentos

**Status**: Aceito (ratifica o que já está em 98 e 99)

**Contexto**: Quatro documentos definem hierarquias de prioridade ligeiramente diferentes: 19-MASTER_PROMPT (BUSINESS_RULES > ACCEPTANCE_CRITERIA > módulo > ARCHITECTURE > README), 30-PROMPT_FINAL (BUSINESS_RULES > FORMULAS > ACCEPTANCE_CRITERIA > módulo > DATABASE_FULL > ARCHITECTURE > demais), 94/100 (MASTER_DOCUMENT > COMPLETE_INDEX > domínio > PRD > Arquitetura > demais), e 98/99 (mais específico > mais recente > MASTER_DOCUMENT).

**Decisão**: Adotar a hierarquia de 98/99 como regra geral de desempate (mais específico > mais recente > MASTER_DOCUMENT), com uma exceção explícita herdada de 19/30: para qualquer conflito que envolva **regra de negócio** (cálculo, validação, fluxo financeiro), **48-BUSINESS_RULES_COMPLETE.md** e **24-FORMULAS.md** têm prioridade máxima, acima até do MASTER_DOCUMENT, por serem as fontes mais específicas do domínio.

**Consequência**: Este kit usa essa hierarquia para atribuir o status "canônico/substituído" no Índice Mestre.

---

### ADR-001 — Ordem de implementação dos módulos (conflito real) ⚠

**Status**: Conflito identificado — requer confirmação humana antes da implementação

**Contexto**: Dois grupos de documentos definem ordens diferentes:
- **28-IMPLEMENTATION** e **50-IMPLEMENTATION_GUIDE**: Comercial → Despesas → Dashboard → DRE → Orçamentos → Relatórios → **Configurações (por último)**.
- **95-IMPLEMENTATION_ORDER** (Fase 5): **Configurações (primeiro)** → Comercial → Despesas → Orçamentos → Dashboard → DRE → Relatórios.

Isso não é redundância de conteúdo — é uma divergência real de sequenciamento, com implicação prática: Configurações cadastra categorias/subcategorias/centros de custo que os demais módulos consomem via chaves estrangeiras.

**Análise**: Do ponto de vista técnico, implementar Configurações primeiro reduz retrabalho (categorias/centros de custo já existem quando Comercial/Despesas forem construídos), o que é consistente com a ordem de dependência de dados descrita em 03-DATABASE/61-DATABASE_SQL_COMPLETE (categorias e centros de custo são criados antes de receitas/despesas nas migrations). Isso favorece 95-IMPLEMENTATION_ORDER como a versão tecnicamente mais coerente e também a mais recente/numerada.

**Decisão proposta (não aplicada automaticamente)**: Recomenda-se adotar **95-IMPLEMENTATION_ORDER** como ordem canônica, mantendo 28/50 como referência histórica de granularidade por sprint. **Esta recomendação deve ser confirmada pelo responsável do produto antes do início da implementação**, pois altera o cronograma de sprints, não apenas a documentação.

---

### ADR-002 — Perfis e permissões: RBAC preparatório vs. usuários únicos na v1.0 ⚠

**Status**: Ambiguidade de escopo — requer esclarecimento

**Contexto**: 
- **00-README** e **04-AUTHENTICATION** afirmam que existem exatamente 3 usuários (Daniel, Nicole, Carlinhos), todos com as mesmas permissões, sem perfis administrativos na v1.0.
- **39-PERMISSIONS_AND_ROLES** já é mais preciso: declara que na v1.0 todos os usuários possuem o perfil único "Gestor", mas define uma matriz completa de 5 perfis (Admin/Gestor/Financeiro/Consultor/Leitura) como arquitetura preparatória — o que é coerente com 00/04, não contraditório.
- Porém **66-SYSTEM_ADMINISTRATION_GUIDE** e **74-USE_CASES_COMPLETE** tratam os 5 perfis como atores ativos e operantes ("Atores: Administrador, Gestor, Financeiro, Consultor, Usuário Somente Leitura"), sem deixar claro que isso é escopo futuro.

**Decisão**: Para a v1.0, prevalece 00/04/39: **um único perfil funcional ("Gestor") para os 3 usuários nomeados, com permissões idênticas de visualizar/inserir/editar/excluir em todos os módulos**. A matriz RBAC de 5 perfis (39, 66, 74) é arquitetura preparatória para versão futura (consistente com 42-FUTURE_ROADMAP v2.0 "Multiusuário com perfis personalizados") e **não deve ser implementada como controle de acesso ativo na v1.0** — apenas a estrutura de tabelas (`roles`, `permissions`, `role_permissions`, `user_roles`) pode ser criada de forma antecipada, sem lógica de bloqueio de UI por perfil.

**Consequência**: Casos de uso em 74-USE_CASES_COMPLETE que mencionam atores além de "Gestor" devem ser lidos como especificação de comportamento futuro, não como requisito da v1.0.

---

### ADR-003 — Duas "Máquinas de Estado" com o mesmo nome de documento

**Status**: Resolvido por renomeação no kit (sem conflito de conteúdo)

**Contexto**: **25-STATE_MACHINE.md** e **76-STATE_MACHINE.md** têm o mesmo título mas escopos complementares e não sobrepostos: 25 define estados de componentes de UI (tela, formulário, botão, tabela, gráfico, modal, toast); 76 define estados de entidades de domínio (Despesa, Parcela, Competência, Orçamento, Notificação, Sessão).

**Decisão**: Referenciar sempre com o número do documento para evitar ambiguidade: **25 = "Máquina de Estados de UI"**, **76 = "Máquina de Estados de Domínio"**. Ambos são canônicos em seus respectivos escopos; nenhum substitui o outro.

---

### ADR-004 — Consolidação dos "Prompts Mestres" para IA

**Status**: Aceito

**Contexto**: Quatro documentos têm o mesmo propósito (instruir uma IA implementadora): 19-MASTER_PROMPT, 30-PROMPT_FINAL, 93-AI_DEVELOPMENT_GUIDE, 94-PROMPT_FOR_AI_IMPLEMENTATION, além de 99-MASTER_DOCUMENT e 100-AI_IMPLEMENTATION_MASTER_PROMPT.

**Decisão**: **99-MASTER_DOCUMENT.md** (ponto de entrada) e **100-AI_IMPLEMENTATION_MASTER_PROMPT.md** (prompt operacional) são as versões canônicas — mais recentes, mais completas, e as únicas que referenciam explicitamente o índice completo (98) e o checklist de aceite (96). 19 e 30 ficam como histórico. 93 permanece como guia complementar de boas práticas de codificação assistida por IA (não conflita, apenas detalha).

---

### ADR-005 — Estrutura de pastas do repositório

**Status**: Aceito

**Contexto**: **51-REPOSITORY_STRUCTURE** usa uma pasta `drizzle/` na raiz para migrations; **92-PROJECT_STRUCTURE_FINAL** (mais recente, nomeado "FINAL") usa `db/{schema,migrations,seeds}/` dentro de `src/` ou raiz.

**Decisão**: **92-PROJECT_STRUCTURE_FINAL** é a estrutura canônica, por ser explicitamente marcada como final e por consolidar também as pastas `validators/`, `tests/{unit,integration,e2e}/` que 51 não detalhava. 51 fica como histórico.

---

### ADR-006 — Fonte de dados: Database vs. Database Full vs. SQL Schema vs. Database SQL Complete

**Status**: Aceito

**Contexto**: Quatro documentos especificam o banco de dados com granularidade crescente: 03 (conceitual) → 22 (com tipos SQL e constraints) → 33 (DDL de referência) → 61 (o mais completo: adiciona ordem de migrations, views, funções, triggers e seeds).

**Decisão**: **61-DATABASE_SQL_COMPLETE.md** é a fonte primária para qualquer implementação de schema. 03/22/33 ficam como documentação histórica de evolução — não há conflito de conteúdo entre eles, apenas acréscimo progressivo de detalhe.

---

### ADR-007 — Contratos de API: 16-API vs. 49-API_CONTRACTS

**Status**: Aceito

**Contexto**: 16-API define endpoints e códigos HTTP em alto nível; 49-API_CONTRACTS adiciona payloads JSON de exemplo para cada endpoint.

**Decisão**: **49-API_CONTRACTS.md** é a fonte primária (mais específica). 16 permanece válido para a lista de endpoints e não há divergência de rotas entre os dois.

---

### ADR-008 — Regras de Negócio: 13-BUSINESS_RULES vs. 48-BUSINESS_RULES_COMPLETE

**Status**: Aceito

**Contexto**: 13 lista regras em prosa por módulo; 48 as reorganiza com identificadores únicos (BR-xxx), adiciona regras de auditoria, exportação, segurança e invariantes globais que 13 não cobre.

**Decisão**: **48-BUSINESS_RULES_COMPLETE.md** é a fonte primária e definitiva (usar os códigos BR-xxx em toda referência cruzada, testes e commits). Nenhuma regra de 13 foi contradita por 48 — apenas expandida.

---

### ADR-009 — Arquivos duplicados no upload (sem impacto de conteúdo)

**Status**: Aceito — apenas nota de higiene documental

**Contexto**: Dois pares de arquivos enviados são cópias byte-a-byte um do outro, diferindo apenas pelo sufixo `(1)` gerado pelo sistema de upload:
- `41-BACKLOG.md` = `41-BACKLOG (1).md`
- `80-MANAGER_OPERATION_MANUAL.md` = `80-MANAGER_OPERATION_MANUAL (1).md`

**Decisão**: Tratar como um único documento em cada caso; descartar a cópia com sufixo `(1)` do repositório final. Nenhum conteúdo é afetado.

---

### ADR-010 — Telas: documentos de módulo vs. wireframes vs. especificação de tela vs. "detailed"

**Status**: Aceito

**Contexto**: Existem até 4 camadas de especificação de UI para o mesmo módulo: o documento de módulo (05-12, regras funcionais), 20-WIREFRAMES (baixa fidelidade, ASCII art), 31-SCREENS_SPECIFICATION (estrutura de componentes por tela) e 52-59-SCREEN_*_DETAILED (mais completo: inclui eventos reativos, performance e estados).

**Decisão**: **52-59 (SCREEN_*_DETAILED)** são a fonte primária para implementação de UI. 31 serve como estrutura intermediária de referência rápida. 20 serve apenas como esboço visual inicial (não normativo). 05-12 permanecem como fonte primária para **regras de negócio do módulo**, não para layout de tela — a divisão de responsabilidade é: 05-12 = "o quê" (regra), 52-59 = "como" (interface).
