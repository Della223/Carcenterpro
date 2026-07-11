# 84-API_VERSIONING_STRATEGY.md

# Estratégia de Versionamento da API

## Objetivo

Definir a política oficial de versionamento da API do CarCenter PRO
Finance, permitindo evolução contínua sem quebrar compatibilidade com
clientes existentes.

------------------------------------------------------------------------

# Princípios

-   Compatibilidade retroativa sempre que possível.
-   Breaking changes apenas em nova versão principal.
-   Contratos documentados.
-   Versionamento explícito.

------------------------------------------------------------------------

# Convenção

Versão na URL:

/api/v1/ /api/v2/

A versão faz parte da rota e da documentação OpenAPI.

------------------------------------------------------------------------

# Ciclo de Vida

1.  Desenvolvimento
2.  Beta
3.  Estável
4.  Depreciada
5.  Removida

Toda versão possui data de lançamento e política de suporte.

------------------------------------------------------------------------

# Compatibilidade

Versões menores (v1.1, v1.2):

-   Correções
-   Melhorias
-   Novos campos opcionais

Versões principais (v2):

-   Alterações incompatíveis
-   Novos contratos
-   Mudanças estruturais

------------------------------------------------------------------------

# Breaking Changes

Exemplos:

-   Remoção de campos.
-   Alteração de tipos.
-   Mudança obrigatória em parâmetros.
-   Alteração de payload.

Devem ser anunciadas previamente.

------------------------------------------------------------------------

# Depreciação

Processo:

1.  Marcar endpoint como deprecated.
2.  Documentar alternativa.
3.  Emitir aviso em changelog.
4.  Manter período mínimo de suporte.
5.  Remover após prazo definido.

------------------------------------------------------------------------

# Eventos

Eventos publicados também seguem versão:

RevenueCreated.v1 ExpensePaid.v1

Mudanças incompatíveis exigem nova versão do evento.

------------------------------------------------------------------------

# Documentação

Cada versão deve possuir:

-   OpenAPI
-   Exemplos
-   Códigos de erro
-   Histórico de alterações

------------------------------------------------------------------------

# Frontend

O frontend deve consumir uma única versão estável da API por release.

Atualizações de versão exigem validação completa.

------------------------------------------------------------------------

# Testes

Executar:

-   Regressão
-   Compatibilidade
-   Contratos
-   Performance

Antes da publicação de nova versão.

------------------------------------------------------------------------

# Changelog

Toda versão deve registrar:

-   Novidades
-   Correções
-   Breaking changes
-   Endpoints adicionados
-   Endpoints removidos

------------------------------------------------------------------------

# Critérios de Aceite

-   Estratégia documentada.
-   Compatibilidade preservada.
-   Depreciação controlada.
-   Contratos versionados.
