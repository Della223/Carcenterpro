# 02-ARCHITECTURE.md

# Arquitetura do Sistema

## Objetivo

Definir a arquitetura oficial do CarCenter PRO Finance para garantir
escalabilidade, manutenção e separação entre interface, regras de
negócio e persistência.

------------------------------------------------------------------------

# Arquitetura em Camadas

Frontend (Next.js) ↓ Application Services ↓ Business Rules ↓
Repositories ↓ Database (PostgreSQL)

Nenhuma regra de negócio poderá existir na camada de interface.

------------------------------------------------------------------------

# Stack Oficial

Frontend - Next.js - React - TypeScript - Tailwind CSS - shadcn/ui

Validação - React Hook Form - Zod

Estado e Dados - TanStack Query

Tabelas - TanStack Table

Gráficos - Recharts

Backend - Supabase

ORM - Drizzle ORM

Banco - PostgreSQL

Autenticação - Supabase Auth

Arquivos - Supabase Storage

Hospedagem - Vercel

------------------------------------------------------------------------

# Estrutura de Pastas

src/ app/ components/ modules/ services/ repositories/ hooks/ lib/
types/ utils/

docs/

public/

------------------------------------------------------------------------

# Módulos

HOME COMERCIAL DESPESAS DASHBOARD DRE ORÇAMENTOS RELATÓRIOS
CONFIGURAÇÕES

Cada módulo deve possuir: - Página principal - Componentes próprios -
Serviços - Tipagens - Regras específicas

------------------------------------------------------------------------

# Fluxo Geral

Login → HOME → Comercial ou Despesas → Persistência no banco →
Atualização automática dos indicadores → Atualização da DRE →
Atualização do Dashboard

------------------------------------------------------------------------

# Comunicação

Frontend comunica apenas com Services.

Services utilizam Repositories.

Repositories acessam o banco.

O Frontend nunca acessa diretamente o banco de dados.

------------------------------------------------------------------------

# Padrões

-   Componentes reutilizáveis.
-   Tipagem estrita em TypeScript.
-   Nenhuma lógica duplicada.
-   Nomes de arquivos em PascalCase para componentes.
-   Variáveis em camelCase.
-   Tabelas do banco em snake_case.

------------------------------------------------------------------------

# Responsabilidades

HOME: Centro operacional.

DASHBOARD: Centro analítico.

COMERCIAL: Registro diário de receitas.

DESPESAS: Registro de despesas por competência.

DRE: Apresentação automática do resultado.

ORÇAMENTOS: Planejamento financeiro.

RELATÓRIOS: Consultas e exportações.

CONFIGURAÇÕES: Parâmetros do sistema.

------------------------------------------------------------------------

# Critério de Aceite

A implementação deverá respeitar rigorosamente esta arquitetura. Nenhum
módulo poderá violar a separação de responsabilidades definida neste
documento.
