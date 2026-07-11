# 19-MASTER_PROMPT.md

# MASTER PROMPT

## CarCenter PRO Finance v1.0

## Objetivo

Você é uma IA especializada em engenharia de software.

Sua missão é implementar integralmente o sistema **CarCenter PRO
Finance** utilizando toda a documentação deste repositório como fonte
única da verdade.

Não invente funcionalidades.

Não remova funcionalidades.

Em caso de conflito entre documentos, siga esta prioridade:

1.  BUSINESS_RULES
2.  ACCEPTANCE_CRITERIA
3.  DOCUMENTOS DOS MÓDULOS
4.  ARCHITECTURE
5.  README

------------------------------------------------------------------------

# Produto

Desenvolver um ERP SaaS para Centros Automotivos.

Idioma obrigatório da interface:

Português (Brasil).

Toda mensagem apresentada ao usuário deverá estar em Português.

------------------------------------------------------------------------

# Stack obrigatória

Frontend: - Next.js - React - TypeScript - Tailwind CSS - shadcn/ui

Backend: - Supabase

Banco: - PostgreSQL

ORM: - Drizzle ORM

Autenticação: - Supabase Auth

Hospedagem: - Vercel

------------------------------------------------------------------------

# Documentos que compõem a especificação

00-README.md 01-PRODUCT_VISION.md 02-ARCHITECTURE.md 03-DATABASE.md
04-AUTHENTICATION.md 05-HOME.md 06-COMMERCIAL.md 07-EXPENSES.md
08-DASHBOARD.md 09-DRE.md 10-BUDGET.md 11-REPORTS.md 12-SETTINGS.md
13-BUSINESS_RULES.md 14-DESIGN_SYSTEM.md 15-FLOWS.md 16-API.md
17-USER_STORIES.md 18-ACCEPTANCE_CRITERIA.md

Todos devem ser considerados obrigatórios.

------------------------------------------------------------------------

# Ordem de implementação

1.  Banco de Dados
2.  Autenticação
3.  Layout Base
4.  HOME
5.  Comercial
6.  Despesas
7.  Dashboard
8.  DRE
9.  Orçamentos
10. Relatórios
11. Configurações
12. Ajustes finais

Cada etapa deverá estar funcional antes da próxima.

------------------------------------------------------------------------

# Diretrizes

-   Interface limpa e corporativa.
-   Componentes reutilizáveis.
-   Nenhuma regra de negócio no frontend.
-   Atualizações automáticas entre módulos.
-   Auditoria em operações de escrita.
-   Responsividade para desktop e notebook.
-   Código limpo, tipado e organizado.

------------------------------------------------------------------------

# Restrições

-   Não criar módulos extras.
-   Não alterar regras de negócio.
-   Não alterar categorias de receitas e despesas.
-   Não remover integração automática entre módulos.
-   Não utilizar textos em inglês na interface.

------------------------------------------------------------------------

# Critério de conclusão

O software será considerado concluído quando:

-   Todos os critérios de aceite forem atendidos.
-   Todos os módulos estiverem integrados.
-   Todos os documentos forem respeitados.
-   A aplicação estiver pronta para implantação em produção.

Fim da especificação.
