# 67-AUTHENTICATION_FLOW_COMPLETE.md

# Fluxo Completo de Autenticação

## Objetivo

Definir integralmente o processo de autenticação, autorização e
gerenciamento de sessão do CarCenter PRO Finance utilizando Supabase
Auth.

------------------------------------------------------------------------

# Tecnologias

-   Supabase Auth
-   JWT
-   Next.js Middleware
-   HTTPS obrigatório

------------------------------------------------------------------------

# Fluxo de Login

1.  Usuário acessa a tela de Login.
2.  Informa e-mail e senha.
3.  Validação de formato no frontend.
4.  Envio para autenticação.
5.  Supabase valida credenciais.
6.  Em caso de sucesso:
    -   Gera Access Token.
    -   Gera Refresh Token.
    -   Carrega perfil do usuário.
    -   Redireciona para HOME.
7.  Registrar evento `UserLoggedIn`.
8.  Registrar auditoria.

------------------------------------------------------------------------

# Tela de Login

Campos obrigatórios:

-   E-mail
-   Senha

Botões:

-   Entrar
-   Esqueci minha senha

Mensagens:

-   Credenciais inválidas.
-   Sessão expirada.
-   Erro inesperado.

------------------------------------------------------------------------

# Validações

E-mail:

-   Obrigatório.
-   Formato válido.

Senha:

-   Obrigatória.
-   Nunca armazenada no frontend.

------------------------------------------------------------------------

# Sessão

Após autenticação:

-   Persistir sessão.
-   Renovar automaticamente quando suportado.
-   Encerrar em logout ou expiração.

------------------------------------------------------------------------

# Refresh Token

Regras:

-   Utilizado apenas para renovação.
-   Nunca exposto em logs.
-   Invalidado no logout.

------------------------------------------------------------------------

# Logout

Fluxo:

1.  Usuário seleciona "Sair".
2.  Invalidar sessão local.
3.  Encerrar sessão no Supabase.
4.  Registrar auditoria.
5.  Publicar evento `UserLoggedOut`.
6.  Redirecionar para Login.

------------------------------------------------------------------------

# Recuperação de Senha

Fluxo:

1.  Informar e-mail.
2.  Enviar link de redefinição.
3.  Definir nova senha.
4.  Confirmar alteração.
5.  Registrar auditoria.

------------------------------------------------------------------------

# Proteção de Rotas

Rotas privadas:

-   HOME
-   Comercial
-   Despesas
-   Dashboard
-   DRE
-   Orçamentos
-   Relatórios
-   Configurações

Usuário não autenticado:

→ Redirecionar para Login.

------------------------------------------------------------------------

# Fluxos de Erro

-   Credenciais inválidas.
-   Token expirado.
-   Token inválido.
-   Usuário inativo.
-   Falha de conexão.

Todos devem utilizar códigos definidos em 38-ERROR_CATALOG.md.

------------------------------------------------------------------------

# Auditoria

Registrar:

-   Login
-   Logout
-   Recuperação de senha
-   Falhas de autenticação

------------------------------------------------------------------------

# Sequência Simplificada

Usuário → Login → Supabase Auth → JWT → Middleware → HOME

------------------------------------------------------------------------

# Critérios de Aceite

-   Login funcional.
-   Sessão persistente.
-   Rotas protegidas.
-   Logout completo.
-   Recuperação de senha operacional.
-   Auditoria registrada.
-   Integração total com Supabase Auth.
