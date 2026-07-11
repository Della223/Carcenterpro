# 35-DEPLOYMENT.md

# Estratégia de Implantação

## Objetivo

Definir o processo oficial de publicação, atualização e recuperação do
CarCenter PRO Finance.

------------------------------------------------------------------------

# Ambientes

## Desenvolvimento

Finalidade: - Desenvolvimento de funcionalidades. - Testes locais.

Infraestrutura: - Next.js local - Supabase Development - PostgreSQL
Development

------------------------------------------------------------------------

## Homologação

Finalidade: - Validação funcional. - Testes de integração. - Homologação
do usuário.

Infraestrutura independente da produção.

------------------------------------------------------------------------

## Produção

Finalidade: - Uso pelos usuários finais.

Hospedagem: - Frontend: Vercel - Backend/Banco: Supabase

------------------------------------------------------------------------

# Variáveis de Ambiente

Obrigatórias:

-   NEXT_PUBLIC_SUPABASE_URL
-   NEXT_PUBLIC_SUPABASE_ANON_KEY
-   SUPABASE_SERVICE_ROLE_KEY
-   DATABASE_URL

Nunca versionar arquivos .env.

------------------------------------------------------------------------

# Processo de Deploy

1.  Commit na branch principal.
2.  Executar pipeline de build.
3.  Validar testes automatizados.
4.  Executar migrations.
5.  Publicar frontend.
6.  Validar aplicação.
7.  Liberar uso.

------------------------------------------------------------------------

# Migrations

Regras:

-   Versionadas.
-   Incrementais.
-   Nunca editar migrations já aplicadas.
-   Sempre testadas em homologação.

------------------------------------------------------------------------

# Rollback

Executar quando:

-   Erro crítico.
-   Inconsistência financeira.
-   Falha de autenticação.
-   Indisponibilidade significativa.

Procedimento:

1.  Restaurar versão anterior.
2.  Validar banco.
3.  Validar integrações.
4.  Comunicar usuários.

------------------------------------------------------------------------

# Backup

Banco:

-   Diário.
-   Retenção mínima de 30 dias.

Documentação:

-   Versionada em repositório Git.

------------------------------------------------------------------------

# Monitoramento

Acompanhar:

-   Disponibilidade.
-   Tempo de resposta.
-   Erros da aplicação.
-   Erros de autenticação.
-   Falhas de integração.

------------------------------------------------------------------------

# Versionamento

Padrão:

MAJOR.MINOR.PATCH

Exemplo:

1.0.0

1.0.1

1.1.0

2.0.0

------------------------------------------------------------------------

# Checklist Pré-Deploy

-   Build sem erros.
-   Testes críticos aprovados.
-   Migrations aplicadas.
-   Variáveis configuradas.
-   Auditoria validada.
-   Backup realizado.

------------------------------------------------------------------------

# Checklist Pós-Deploy

-   Login funcional.
-   HOME carregando.
-   Dashboard atualizado.
-   DRE consistente.
-   Comercial funcional.
-   Despesas funcionais.
-   Relatórios exportando.
-   Logs sem erros críticos.

------------------------------------------------------------------------

# Critérios de Aceite

-   Deploy reproduzível.
-   Rollback documentado.
-   Ambientes isolados.
-   Aplicação pronta para operação contínua.
