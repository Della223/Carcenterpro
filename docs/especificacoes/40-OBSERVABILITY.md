# 40-OBSERVABILITY.md

# Observabilidade

## Objetivo

Definir a estratégia de observabilidade do CarCenter PRO Finance para
garantir operação estável, rastreabilidade e rápida identificação de
problemas em produção.

------------------------------------------------------------------------

# Princípios

-   Monitorar antes de reagir.
-   Logs estruturados.
-   Métricas mensuráveis.
-   Alertas acionáveis.
-   Auditoria separada dos logs técnicos.

------------------------------------------------------------------------

# Logs da Aplicação

Todos os logs devem conter:

-   Timestamp (ISO 8601)
-   Ambiente
-   Usuário (quando autenticado)
-   Módulo
-   Operação
-   Nível
-   Mensagem
-   Correlation ID

Níveis:

-   DEBUG
-   INFO
-   WARNING
-   ERROR
-   CRITICAL

------------------------------------------------------------------------

# Eventos de Negócio

Registrar eventos relevantes:

-   Login
-   Logout
-   Receita criada
-   Receita alterada
-   Despesa criada
-   Pagamento registrado
-   Orçamento alterado
-   Exportação de relatório
-   Alteração de configurações

------------------------------------------------------------------------

# Métricas

## Aplicação

-   Tempo médio de resposta
-   Requisições por minuto
-   Taxa de erro
-   Tempo de carregamento da HOME
-   Tempo de carregamento do Dashboard

## Banco de Dados

-   Consultas lentas
-   Número de conexões
-   Tempo médio de consulta

------------------------------------------------------------------------

# Health Check

Endpoints sugeridos:

GET /health GET /health/database

Resposta:

-   Status
-   Banco disponível
-   Versão
-   Timestamp

------------------------------------------------------------------------

# Alertas

Gerar alertas para:

-   Falha de autenticação em excesso
-   Erros críticos consecutivos
-   Falha de conexão com banco
-   Tempo de resposta acima do limite
-   Falha em migrations
-   Espaço de armazenamento crítico

------------------------------------------------------------------------

# Rastreamento

Cada requisição deve possuir um Correlation ID para permitir
rastreamento completo entre frontend, backend e banco.

------------------------------------------------------------------------

# Dashboards Operacionais

Monitorar:

-   Usuários ativos
-   Operações por módulo
-   Erros por hora
-   Tempo médio de resposta
-   Exportações realizadas
-   Auditorias registradas

------------------------------------------------------------------------

# Retenção

Logs técnicos: 90 dias

Auditoria: Conforme política da empresa (recomendado mínimo de 5 anos
para dados financeiros).

------------------------------------------------------------------------

# Integração Futura

Arquitetura preparada para integração com:

-   Sentry
-   Grafana
-   Prometheus
-   OpenTelemetry

Sem dependência obrigatória na versão 1.0.

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os eventos críticos registrados.
-   Health checks disponíveis.
-   Logs estruturados.
-   Métricas consistentes.
-   Rastreabilidade completa das operações.
