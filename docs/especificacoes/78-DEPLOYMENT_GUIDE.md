# 78-DEPLOYMENT_GUIDE.md

# Guia Oficial de Implantação

## Objetivo

Descrever o processo completo de implantação do CarCenter PRO Finance em
ambiente de produção, garantindo uma instalação reproduzível, segura e
padronizada.

------------------------------------------------------------------------

# Arquitetura de Produção

Frontend: - Next.js - Vercel

Backend: - API Next.js / Route Handlers

Banco: - PostgreSQL (Supabase)

Autenticação: - Supabase Auth

Armazenamento: - Supabase Storage

------------------------------------------------------------------------

# Pré-requisitos

-   Conta Vercel
-   Projeto Supabase
-   Repositório Git
-   Node.js LTS
-   npm ou pnpm
-   Domínio configurado (opcional)

------------------------------------------------------------------------

# Variáveis de Ambiente

Obrigatórias:

-   NEXT_PUBLIC_SUPABASE_URL
-   NEXT_PUBLIC_SUPABASE_ANON_KEY
-   SUPABASE_SERVICE_ROLE_KEY
-   DATABASE_URL
-   APP_ENV
-   APP_VERSION

Nunca expor chaves administrativas ao frontend.

------------------------------------------------------------------------

# Configuração do Supabase

1.  Criar projeto.
2.  Executar migrations.
3.  Configurar RLS.
4.  Criar Storage Buckets (quando utilizados).
5.  Configurar Auth.
6.  Validar usuários iniciais.

------------------------------------------------------------------------

# Configuração da Vercel

1.  Importar repositório.
2.  Configurar variáveis de ambiente.
3.  Selecionar branch principal.
4.  Habilitar deploy automático.

------------------------------------------------------------------------

# Pipeline de Deploy

Fluxo:

1.  Commit
2.  Pull Request
3.  Revisão
4.  Merge
5.  Build
6.  Deploy
7.  Smoke Tests
8.  Liberação

------------------------------------------------------------------------

# Migrações

Executar na ordem definida em:

61-DATABASE_SQL_COMPLETE.md

Regras:

-   Nunca alterar migrations já executadas.
-   Criar nova migration para qualquer mudança estrutural.

------------------------------------------------------------------------

# Configuração do Domínio

-   Configurar DNS.
-   Validar HTTPS.
-   Redirecionar HTTP para HTTPS.

------------------------------------------------------------------------

# Validação Pós-Deploy

Checklist:

-   Login
-   HOME
-   Comercial
-   Despesas
-   Dashboard
-   DRE
-   Orçamentos
-   Relatórios
-   Configurações
-   Exportações
-   Auditoria

------------------------------------------------------------------------

# Rollback

Em caso de falha:

1.  Reverter versão na Vercel.
2.  Restaurar banco quando necessário.
3.  Validar sistema.
4.  Comunicar responsáveis.

------------------------------------------------------------------------

# Monitoramento

Após implantação acompanhar:

-   Disponibilidade
-   Tempo de resposta
-   Erros
-   Logs
-   Consumo de banco
-   Consumo de API

------------------------------------------------------------------------

# Segurança

-   HTTPS obrigatório.
-   Secrets somente no servidor.
-   RLS habilitado.
-   Headers de segurança ativos.
-   Dependências atualizadas.

------------------------------------------------------------------------

# Critérios de Aceite

-   Implantação reproduzível.
-   Ambiente seguro.
-   Variáveis configuradas.
-   Banco validado.
-   Sistema operacional em produção.
