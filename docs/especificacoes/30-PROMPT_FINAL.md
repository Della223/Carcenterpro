# 30-PROMPT_FINAL.md

# PROMPT FINAL PARA IA DESENVOLVEDORA

## Missão

Você é uma IA especialista em engenharia de software.

Sua tarefa é desenvolver integralmente o **CarCenter PRO Finance**, um
ERP SaaS para centros automotivos, utilizando exclusivamente a
documentação deste repositório como fonte oficial.

Não improvise requisitos. Não remova funcionalidades. Não simplifique
regras de negócio.

------------------------------------------------------------------------

# Documentação Obrigatória

Considere como documentação oficial todos os arquivos:

00-README.md 01-PRODUCT_VISION.md 02-ARCHITECTURE.md 03-DATABASE.md
04-AUTHENTICATION.md 05-HOME.md 06-COMMERCIAL.md 07-EXPENSES.md
08-DASHBOARD.md 09-DRE.md 10-BUDGET.md 11-REPORTS.md 12-SETTINGS.md
13-BUSINESS_RULES.md 14-DESIGN_SYSTEM.md 15-FLOWS.md 16-API.md
17-USER_STORIES.md 18-ACCEPTANCE_CRITERIA.md 19-MASTER_PROMPT.md
20-WIREFRAMES.md 21-COMPONENTS.md 22-DATABASE_FULL.md 23-VALIDATIONS.md
24-FORMULAS.md 25-STATE_MACHINE.md 26-UX_RULES.md 27-DIAGRAMS.md
28-IMPLEMENTATION.md 29-TESTS.md

Todos possuem o mesmo objetivo e devem ser respeitados.

------------------------------------------------------------------------

# Ordem de Prioridade

Em caso de conflito entre documentos, utilizar:

1.  13-BUSINESS_RULES.md
2.  24-FORMULAS.md
3.  18-ACCEPTANCE_CRITERIA.md
4.  Documentos específicos do módulo
5.  22-DATABASE_FULL.md
6.  02-ARCHITECTURE.md
7.  Demais documentos

------------------------------------------------------------------------

# Stack Obrigatória

Frontend - Next.js - React - TypeScript - Tailwind CSS - shadcn/ui

Backend - Supabase

Banco - PostgreSQL

ORM - Drizzle ORM

Autenticação - Supabase Auth

Hospedagem - Vercel

------------------------------------------------------------------------

# Diretrizes de Implementação

-   Interface 100% em Português (Brasil).
-   Código limpo, modular e tipado.
-   Componentes reutilizáveis.
-   Nenhuma regra de negócio no frontend.
-   Atualizações automáticas entre módulos.
-   Auditoria em todas as operações de escrita.
-   Responsividade para desktop e notebook.

------------------------------------------------------------------------

# Restrições

-   Não criar módulos adicionais.
-   Não alterar nomes de categorias.
-   Não modificar fórmulas.
-   Não alterar fluxos de negócio.
-   Não remover integrações automáticas.

------------------------------------------------------------------------

# Critérios de Conclusão

O software será considerado concluído apenas quando:

-   Todos os módulos estiverem implementados.
-   Todos os critérios de aceite forem atendidos.
-   Todos os testes críticos forem aprovados.
-   Não existirem erros críticos.
-   A aplicação estiver pronta para produção.

Ao concluir, gerar documentação técnica, instruções de execução local,
scripts de banco de dados e ambiente de produção.

Fim do Prompt Final.
