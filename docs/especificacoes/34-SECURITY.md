# 34-SECURITY.md

# Arquitetura de Segurança

## Objetivo

Definir os requisitos mínimos de segurança do CarCenter PRO Finance para
desenvolvimento, homologação e produção.

------------------------------------------------------------------------

# Princípios

-   Segurança por padrão.
-   Menor privilégio possível.
-   Auditoria obrigatória.
-   Dados financeiros protegidos.
-   Comunicação sempre criptografada.

------------------------------------------------------------------------

# Autenticação

Tecnologia: - Supabase Auth

Método: - JWT

Regras: - Login obrigatório. - Renovação automática de sessão quando
suportado. - Logout invalida a sessão local.

------------------------------------------------------------------------

# Autorização

Versão 1.0:

Todos os usuários possuem as mesmas permissões funcionais.

Arquitetura preparada para perfis futuros.

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

Usuário não autenticado deve ser redirecionado ao login.

------------------------------------------------------------------------

# Row Level Security (RLS)

Habilitar RLS nas tabelas transacionais:

-   revenues
-   expenses
-   expense_installments
-   budgets
-   marketing_posts
-   audit_logs

Política inicial:

Usuários autenticados podem ler e gravar registros conforme regras da
aplicação.

------------------------------------------------------------------------

# Auditoria

Registrar automaticamente:

-   Usuário
-   Data/Hora
-   Módulo
-   Operação
-   Registro afetado
-   Valores anteriores (quando aplicável)
-   Valores atuais

Auditoria não pode ser editada pela interface.

------------------------------------------------------------------------

# Proteção de Dados

-   Nunca armazenar senhas.
-   Nunca expor tokens na interface.
-   Variáveis sensíveis apenas em ambiente.
-   Utilizar HTTPS em produção.

------------------------------------------------------------------------

# Logs

Registrar:

-   Falhas de autenticação.
-   Erros críticos.
-   Alterações financeiras.
-   Alterações de configurações.

Evitar registrar dados sensíveis.

------------------------------------------------------------------------

# Backup

Recomendação:

-   Backup diário do banco.
-   Retenção mínima: 30 dias.
-   Teste periódico de restauração.

------------------------------------------------------------------------

# Produção

Checklist:

-   HTTPS ativo.
-   Variáveis de ambiente configuradas.
-   RLS habilitado.
-   Auditoria ativa.
-   Logs monitorados.

------------------------------------------------------------------------

# Critérios de Aceite

-   Nenhuma rota privada acessível sem autenticação.
-   Auditoria registrada em operações de escrita.
-   RLS ativo.
-   Dados sensíveis protegidos.
-   Aplicação pronta para produção segura.
