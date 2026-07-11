# 66-SYSTEM_ADMINISTRATION_GUIDE.md

# Guia do Administrador do Sistema

## Objetivo

Definir os procedimentos e responsabilidades do administrador do
CarCenter PRO Finance para garantir o funcionamento correto, seguro e
padronizado da plataforma.

------------------------------------------------------------------------

# Responsabilidades

O administrador é responsável por:

-   Gerenciar usuários.
-   Gerenciar permissões.
-   Administrar competências.
-   Manter cadastros mestres.
-   Garantir integridade dos parâmetros.
-   Acompanhar auditorias.

------------------------------------------------------------------------

# Administração de Usuários

Operações permitidas:

-   Criar usuário
-   Editar usuário
-   Ativar
-   Inativar
-   Redefinir acesso
-   Consultar histórico

Campos mínimos:

-   Nome
-   E-mail
-   Status
-   Perfil
-   Data de criação
-   Último acesso

Regras:

-   E-mail único.
-   Usuários inativos não acessam o sistema.
-   Alterações registram auditoria.

------------------------------------------------------------------------

# Gestão de Perfis

Perfis previstos:

-   Administrador
-   Gestor
-   Financeiro
-   Consultor
-   Leitura

Toda alteração de perfil:

-   Registra auditoria.
-   Produz evento ConfigChanged.

------------------------------------------------------------------------

# Competências

Permitir:

-   Abrir competência.
-   Encerrar competência.
-   Alterar competência ativa.

Regras:

-   Apenas uma competência ativa.
-   Encerramento exige confirmação.
-   Encerramento registra auditoria.

------------------------------------------------------------------------

# Cadastros Mestres

Administrar:

-   Categorias de Receita
-   Categorias de Despesa
-   Subcategorias
-   Centros de Custo

Regras:

-   Não excluir registros utilizados.
-   Preferir inativação.

------------------------------------------------------------------------

# Parâmetros do Sistema

Administrar:

-   Nome da empresa
-   Moeda (BRL)
-   Fuso horário
-   Configurações de marketing
-   Parâmetros gerais

Alterações impactam imediatamente os módulos dependentes.

------------------------------------------------------------------------

# Auditoria

Consultar:

-   Usuário
-   Data/Hora
-   Operação
-   Módulo
-   Registro alterado

A auditoria é somente leitura.

------------------------------------------------------------------------

# Rotinas do Administrador

## Diárias

-   Verificar usuários bloqueados.
-   Conferir erros críticos.
-   Validar competência ativa.

## Semanais

-   Revisar auditoria.
-   Revisar categorias.
-   Revisar desempenho.

## Mensais

-   Revisar perfis.
-   Revisar centros de custo.
-   Revisar parâmetros.
-   Validar backups.

------------------------------------------------------------------------

# Boas Práticas

-   Utilizar menor privilégio possível.
-   Não compartilhar credenciais.
-   Registrar todas as alterações relevantes.
-   Validar mudanças em homologação antes da produção.

------------------------------------------------------------------------

# Checklist Mensal

-   Usuários revisados.
-   Perfis revisados.
-   Competência correta.
-   Cadastros consistentes.
-   Auditoria sem inconsistências.
-   Backups validados.

------------------------------------------------------------------------

# Critérios de Aceite

-   Todas as operações administrativas documentadas.
-   Auditoria obrigatória para alterações.
-   Administração preparada para expansão futura de perfis e
    funcionalidades.
