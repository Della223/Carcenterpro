# 39-PERMISSIONS_AND_ROLES.md

# Perfis e Permissões

## Objetivo

Definir a arquitetura de autorização do CarCenter PRO Finance utilizando
RBAC (Role-Based Access Control), permitindo evolução futura sem
alterações estruturais.

------------------------------------------------------------------------

# Princípios

-   Menor privilégio possível.
-   Permissões concedidas por perfil.
-   Auditoria de todas as operações de escrita.
-   Arquitetura preparada para múltiplos perfis.

------------------------------------------------------------------------

# Versão 1.0

Todos os usuários autenticados possuem o perfil:

-   Gestor

A infraestrutura, porém, deverá suportar novos perfis sem refatoração.

------------------------------------------------------------------------

# Perfis Planejados

## Administrador

Acesso total ao sistema.

## Gestor

Acesso operacional completo.

## Financeiro

Gerencia Comercial, Despesas, DRE, Orçamentos e Relatórios.

## Consultor

Consulta indicadores e relatórios, sem alterações.

## Leitura

Somente visualização.

------------------------------------------------------------------------

# Ações Padronizadas

-   Visualizar
-   Criar
-   Editar
-   Excluir
-   Exportar
-   Configurar

Cada módulo utiliza exclusivamente essas ações.

------------------------------------------------------------------------

# Matriz de Permissões

  Módulo           Admin     Gestor     Financeiro   Consultor     Leitura
  --------------- ------- ------------ ------------ ------------ ------------
  HOME               ✔         ✔            ✔            ✔            ✔
  Comercial          ✔         ✔            ✔        Visualizar   Visualizar
  Despesas           ✔         ✔            ✔        Visualizar   Visualizar
  Dashboard          ✔         ✔            ✔            ✔            ✔
  DRE                ✔         ✔            ✔            ✔            ✔
  Orçamentos         ✔         ✔            ✔        Visualizar   Visualizar
  Relatórios         ✔         ✔            ✔         Exportar    Visualizar
  Configurações      ✔     Visualizar      Não          Não          Não

------------------------------------------------------------------------

# Regras

-   Usuários sem permissão não devem visualizar ações indisponíveis.
-   A API deve validar permissões independentemente da interface.
-   Alterações de perfil devem produzir registro de auditoria.

------------------------------------------------------------------------

# Estrutura Sugerida

Tabela roles

-   id
-   name
-   description

Tabela permissions

-   id
-   module
-   action

Tabela role_permissions

-   role_id
-   permission_id

Tabela user_roles

-   user_id
-   role_id

------------------------------------------------------------------------

# Integração

Permissões devem ser verificadas:

-   Ao carregar rotas.
-   Antes de executar ações.
-   Antes de exportar arquivos.
-   Antes de alterar configurações.

------------------------------------------------------------------------

# Auditoria

Registrar:

-   Usuário
-   Perfil
-   Ação
-   Módulo
-   Data/Hora

------------------------------------------------------------------------

# Evolução

Preparado para:

-   Multiempresa
-   Perfis personalizados
-   Permissões por empresa
-   Permissões por centro de custo

------------------------------------------------------------------------

# Critérios de Aceite

-   Controle baseado em perfis.
-   API protegida por autorização.
-   Interface adaptada às permissões.
-   Estrutura preparada para expansão futura.
