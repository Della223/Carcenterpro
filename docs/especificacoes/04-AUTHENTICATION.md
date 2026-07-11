# 04-AUTHENTICATION.md

# Autenticação e Sessão

## Objetivo

Definir o funcionamento da autenticação, identificação do usuário,
sessão, auditoria e permissões do CarCenter PRO Finance.

------------------------------------------------------------------------

# Tecnologia

Autenticação: Supabase Auth

Sessão: JWT gerenciado pelo Supabase.

Persistência da sessão conforme configuração padrão do navegador.

------------------------------------------------------------------------

# Idioma

Toda interface de login deverá estar em Português (Brasil).

------------------------------------------------------------------------

# Fluxo de Acesso

1.  Usuário acessa a aplicação.
2.  Informa e-mail.
3.  Informa senha.
4.  Sistema valida credenciais.
5.  Redireciona para HOME.
6.  Exibe saudação personalizada.

------------------------------------------------------------------------

# Usuários

Nesta versão existirão apenas três usuários cadastrados:

-   Daniel
-   Nicole
-   Carlinhos

Todos possuem exatamente o mesmo nível de acesso.

Não existem perfis administrativos.

------------------------------------------------------------------------

# Sessão

Após login bem-sucedido:

-   Registrar usuário autenticado.
-   Registrar data/hora do login.
-   Registrar último acesso.
-   Exibir nome do usuário na HOME.
-   Exibir nome do usuário no rodapé do sistema.

------------------------------------------------------------------------

# Logout

Ao realizar logout:

-   Encerrar sessão.
-   Limpar informações locais.
-   Redirecionar para tela de login.

------------------------------------------------------------------------

# Recuperação de Senha

Fluxo:

-   Informar e-mail.
-   Receber link por e-mail.
-   Definir nova senha.
-   Retornar para login.

------------------------------------------------------------------------

# Auditoria

Toda operação deverá registrar:

-   Usuário
-   Data
-   Hora
-   Operação realizada
-   Módulo

------------------------------------------------------------------------

# Permissões

Versão 1.0

Todos os usuários possuem:

-   Visualizar
-   Inserir
-   Editar
-   Excluir

para todos os módulos.

------------------------------------------------------------------------

# Segurança

-   HTTPS obrigatório.
-   Tokens nunca expostos na interface.
-   Senhas nunca armazenadas localmente.
-   Utilizar políticas de Row Level Security do Supabase quando
    aplicável.

------------------------------------------------------------------------

# Mensagens

Login inválido:

"E-mail ou senha inválidos."

Logout:

"Sessão encerrada com sucesso."

Sessão expirada:

"Sua sessão expirou. Faça login novamente."

------------------------------------------------------------------------

# Critérios de Aceite

-   Login funcional.
-   Logout funcional.
-   Recuperação de senha funcional.
-   Usuário identificado durante toda a sessão.
-   Auditoria registrada em todas as operações.
