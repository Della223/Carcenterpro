# 82-DATA_MIGRATION_GUIDE.md

# Guia de Migração de Dados

## Objetivo

Definir o processo oficial de migração de dados para o CarCenter PRO
Finance, permitindo a importação segura e consistente de informações
provenientes de planilhas, ERPs e outros sistemas legados.

------------------------------------------------------------------------

# Escopo

A migração contempla:

-   Categorias
-   Subcategorias
-   Centros de Custo
-   Receitas
-   Despesas
-   Parcelas
-   Orçamentos
-   Usuários (quando aplicável)

------------------------------------------------------------------------

# Fontes de Dados Suportadas

-   Microsoft Excel (.xlsx)
-   CSV UTF-8
-   PostgreSQL
-   SQL Server
-   MySQL
-   APIs REST (integrações futuras)

------------------------------------------------------------------------

# Estratégia de Migração

Ordem obrigatória:

1.  Categorias
2.  Subcategorias
3.  Centros de Custo
4.  Usuários
5.  Receitas
6.  Despesas
7.  Parcelas
8.  Orçamentos

Nenhuma etapa deve iniciar antes da conclusão da anterior.

------------------------------------------------------------------------

# Mapeamento de Campos

Cada importação deve possuir:

-   Campo de origem
-   Campo de destino
-   Tipo de dado
-   Regra de transformação
-   Obrigatoriedade

Todo mapeamento deve ser documentado.

------------------------------------------------------------------------

# Transformação dos Dados

Aplicar:

-   Remoção de espaços excedentes
-   Normalização de datas
-   Conversão monetária
-   Conversão de codificação para UTF-8
-   Validação de chaves estrangeiras

------------------------------------------------------------------------

# Validações

Antes da carga:

-   Duplicidades
-   Campos obrigatórios
-   Datas inválidas
-   Valores negativos indevidos
-   Referências inexistentes

Registros inválidos devem ser rejeitados e registrados em relatório.

------------------------------------------------------------------------

# Carga Inicial

Processo:

1.  Backup do banco.
2.  Executar importação em homologação.
3.  Validar resultados.
4.  Aprovar.
5.  Executar em produção.

------------------------------------------------------------------------

# Relatório de Migração

Ao final gerar:

-   Total de registros processados
-   Importados
-   Rejeitados
-   Tempo de execução
-   Motivos de rejeição

------------------------------------------------------------------------

# Rollback

Em caso de falha:

1.  Interromper migração.
2.  Restaurar backup.
3.  Corrigir inconsistências.
4.  Reiniciar processo.

------------------------------------------------------------------------

# Checklist

Antes:

-   Backup realizado
-   Ambiente validado
-   Arquivos conferidos

Durante:

-   Monitorar logs
-   Validar integridade

Após:

-   Conferir totais
-   Executar testes críticos
-   Aprovar migração

------------------------------------------------------------------------

# Critérios de Aceite

-   Migração reproduzível.
-   Dados íntegros.
-   Relatório emitido.
-   Rollback documentado.
-   Compatível com a arquitetura oficial do sistema.
