# 87-LOGGING_STANDARD.md

# Padrão Oficial de Logs

## Objetivo

Definir o padrão de geração, estrutura, retenção e utilização de logs do
CarCenter PRO Finance para apoiar observabilidade, auditoria,
diagnóstico e suporte.

------------------------------------------------------------------------

# Princípios

-   Logs estruturados em JSON.
-   Informações consistentes.
-   Dados sensíveis mascarados.
-   Correlação entre requisições.
-   Baixo impacto na performance.

------------------------------------------------------------------------

# Estrutura

Campos obrigatórios:

-   timestamp
-   level
-   service
-   module
-   operation
-   message
-   correlationId
-   userId (quando aplicável)
-   requestId
-   durationMs

Campos opcionais:

-   stackTrace
-   metadata
-   entityId

------------------------------------------------------------------------

# Níveis

DEBUG - Desenvolvimento.

INFO - Operações normais.

WARN - Situações anormais sem interrupção.

ERROR - Falhas recuperáveis.

FATAL - Falhas críticas que comprometem o sistema.

------------------------------------------------------------------------

# Logs de Negócio

Registrar:

-   Cadastro de receita.
-   Cadastro de despesa.
-   Registro de pagamento.
-   Encerramento de competência.
-   Alteração de orçamento.

------------------------------------------------------------------------

# Logs Técnicos

Registrar:

-   Inicialização.
-   Encerramento.
-   Chamadas externas.
-   Tempo de resposta.
-   Erros de infraestrutura.

------------------------------------------------------------------------

# Auditoria

Eventos auditáveis:

-   Login
-   Logout
-   Alterações cadastrais
-   Exclusões
-   Mudanças de permissões
-   Configurações

------------------------------------------------------------------------

# Dados Sensíveis

Nunca registrar:

-   Senhas
-   Tokens
-   Chaves privadas
-   Service Role Key
-   Dados financeiros confidenciais sem necessidade

Mascarar:

-   CPF/CNPJ (quando houver)
-   E-mail parcialmente
-   Telefones

------------------------------------------------------------------------

# Retenção

-   DEBUG: desenvolvimento
-   INFO/WARN: 90 dias
-   ERROR/FATAL: 12 meses
-   Auditoria: conforme política da empresa

------------------------------------------------------------------------

# Correlação

Toda requisição deve possuir:

-   Correlation ID
-   Request ID

Esses identificadores acompanham toda a cadeia de processamento.

------------------------------------------------------------------------

# Integração

Compatível com:

-   Observabilidade
-   Auditoria
-   Alertas
-   Dashboards

------------------------------------------------------------------------

# Boas Práticas

-   Nunca utilizar print em produção.
-   Mensagens claras.
-   Evitar duplicidade.
-   Registrar contexto suficiente para diagnóstico.

------------------------------------------------------------------------

# Critérios de Aceite

-   Logs estruturados.
-   Padrão único em toda aplicação.
-   Dados sensíveis protegidos.
-   Correlação implementada.
-   Compatível com a estratégia de observabilidade.
