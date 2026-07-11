# 36-CODING_STANDARDS.md

# Padrões de Desenvolvimento

## Objetivo

Definir os padrões obrigatórios de desenvolvimento para garantir
consistência, legibilidade, manutenção e escalabilidade do CarCenter PRO
Finance.

------------------------------------------------------------------------

# Stack Oficial

Frontend - Next.js - React - TypeScript - Tailwind CSS - shadcn/ui

Backend - Supabase - PostgreSQL - Drizzle ORM

------------------------------------------------------------------------

# Estrutura de Pastas

``` text
src/
 ├── app/
 ├── components/
 │    ├── ui/
 │    ├── layout/
 │    ├── dashboard/
 │    ├── commercial/
 │    ├── expenses/
 │    └── shared/
 ├── hooks/
 ├── services/
 ├── repositories/
 ├── lib/
 ├── types/
 ├── utils/
 ├── validations/
 ├── constants/
 └── styles/
```

------------------------------------------------------------------------

# Convenções de Nomenclatura

Arquivos: - kebab-case

Componentes React: - PascalCase

Funções: - camelCase

Constantes: - UPPER_SNAKE_CASE

Interfaces: - Prefixo `I` (ex.: IUser)

Enums: - Sufixo `Enum`

------------------------------------------------------------------------

# Componentes

-   Um componente por arquivo.
-   Máximo recomendado: 300 linhas.
-   Separar lógica da apresentação.
-   Componentes reutilizáveis em `components/shared`.

------------------------------------------------------------------------

# Hooks

-   Prefixo obrigatório `use`.
-   Não acessar banco diretamente.
-   Encapsular lógica reutilizável.

Exemplos: - useAuth - useDashboard - useExpenses

------------------------------------------------------------------------

# Services

Responsáveis por regras de aplicação e orquestração.

Não acessar interface.

------------------------------------------------------------------------

# Repositories

Responsáveis exclusivamente pelo acesso ao banco de dados.

Não conter regras de negócio.

------------------------------------------------------------------------

# TypeScript

-   `strict: true`
-   Evitar `any`.
-   Tipar parâmetros, retornos e estados.
-   Centralizar tipos em `types/`.

------------------------------------------------------------------------

# Tratamento de Erros

-   Nunca silenciar exceções.
-   Mensagens amigáveis ao usuário.
-   Logs técnicos para diagnóstico.
-   Erros financeiros devem ser auditados.

------------------------------------------------------------------------

# Logs

Registrar: - Erros inesperados - Falhas de integração - Exceções
críticas

Nunca registrar: - Senhas - Tokens - Chaves privadas

------------------------------------------------------------------------

# Clean Code

-   Funções pequenas.
-   Nomes descritivos.
-   Baixo acoplamento.
-   Alta coesão.
-   Evitar duplicação (DRY).

------------------------------------------------------------------------

# SOLID

Aplicar os cinco princípios sempre que possível.

------------------------------------------------------------------------

# Commits

Padrão sugerido:

-   feat:
-   fix:
-   refactor:
-   docs:
-   test:
-   chore:

Exemplo: `feat: implementar cadastro de despesas`

------------------------------------------------------------------------

# Documentação

Todos os módulos públicos devem possuir comentários explicando:

-   Objetivo
-   Entradas
-   Saídas
-   Dependências

------------------------------------------------------------------------

# Critérios de Aceite

-   Código consistente.
-   Estrutura padronizada.
-   Sem duplicação desnecessária.
-   Tipagem completa.
-   Fácil manutenção e evolução.
