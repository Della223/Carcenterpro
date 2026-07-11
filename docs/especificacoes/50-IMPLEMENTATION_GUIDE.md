# 50-IMPLEMENTATION_GUIDE.md

# Guia Oficial de Implementação

## Objetivo

Definir a sequência exata para construir o CarCenter PRO Finance,
reduzindo decisões de arquitetura durante o desenvolvimento.

------------------------------------------------------------------------

# Ordem de Construção

## Etapa 1 - Fundação

-   Criar repositório Git.
-   Configurar Next.js.
-   Configurar TypeScript (strict).
-   Configurar Tailwind CSS.
-   Instalar shadcn/ui.
-   Configurar ESLint e Prettier.

Critério: Aplicação inicia sem erros.

------------------------------------------------------------------------

## Etapa 2 - Infraestrutura

-   Configurar Supabase.
-   Configurar PostgreSQL.
-   Configurar Drizzle ORM.
-   Criar migrations iniciais.
-   Aplicar RLS.
-   Configurar variáveis de ambiente.

Critério: Banco acessível e migrations executadas.

------------------------------------------------------------------------

## Etapa 3 - Estrutura do Projeto

``` text
src/
  app/
  components/
  hooks/
  services/
  repositories/
  lib/
  types/
  utils/
  validations/
  constants/
```

Cada pasta deve possuir responsabilidade única.

------------------------------------------------------------------------

## Etapa 4 - Design System

Implementar primeiro:

-   Button
-   Input
-   Select
-   Card
-   Table
-   Modal
-   Toast
-   KPI Card
-   Filter Bar

Todos reutilizáveis.

------------------------------------------------------------------------

## Etapa 5 - Layout

Implementar:

-   Cabeçalho
-   Menu lateral
-   Rodapé
-   Layout autenticado
-   Página de login

Antes dos módulos.

------------------------------------------------------------------------

## Etapa 6 - Módulos

Ordem obrigatória:

1.  Comercial
2.  Despesas
3.  Dashboard
4.  DRE
5.  Orçamentos
6.  Relatórios
7.  Configurações

Cada módulo deve finalizar CRUD, validações, testes e integração antes
do próximo.

------------------------------------------------------------------------

## Camadas

Fluxo obrigatório:

UI → Hooks → Services → Repositories → Banco

Regras de negócio ficam exclusivamente em Services.

------------------------------------------------------------------------

## Testes

Para cada módulo:

-   Unitários
-   Integração
-   Funcionais

Corrigir defeitos antes de avançar.

------------------------------------------------------------------------

## Integração

Após cada entrega:

-   Atualizar HOME
-   Atualizar Dashboard
-   Atualizar DRE
-   Atualizar Relatórios
-   Registrar Auditoria

------------------------------------------------------------------------

## Homologação

Checklist:

-   Login
-   Navegação
-   CRUDs
-   Fórmulas
-   Exportações
-   Segurança
-   Performance

------------------------------------------------------------------------

## Publicação

-   Executar build.
-   Aplicar migrations.
-   Publicar frontend.
-   Validar produção.
-   Liberar acesso.

------------------------------------------------------------------------

# Critérios de Aceite

-   Implementação seguindo esta ordem.
-   Nenhuma camada acessa diretamente outra fora do fluxo definido.
-   Todos os documentos 00--49 utilizados como referência obrigatória.
