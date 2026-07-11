# 65-PRODUCTION_RUNBOOK.md

# Runbook Oficial de Produção

## Objetivo

Documentar os procedimentos operacionais necessários para manter o
CarCenter PRO Finance em produção com segurança, previsibilidade e
rápida recuperação em caso de incidentes.

------------------------------------------------------------------------

# Checklist Pré-Início

Antes de iniciar qualquer intervenção:

-   Confirmar janela de manutenção.
-   Verificar backup concluído.
-   Confirmar acesso ao Supabase.
-   Confirmar acesso à Vercel.
-   Confirmar acesso ao repositório Git.
-   Registrar responsável pela operação.

------------------------------------------------------------------------

# Deploy em Produção

Sequência obrigatória:

1.  Confirmar aprovação da versão.
2.  Validar testes automatizados.
3.  Aplicar migrations.
4.  Publicar frontend.
5.  Validar autenticação.
6.  Validar HOME.
7.  Validar Dashboard.
8.  Validar DRE.
9.  Validar Relatórios.
10. Registrar conclusão.

------------------------------------------------------------------------

# Validação Pós-Deploy

Executar:

-   Login.
-   Cadastro de receita.
-   Cadastro de despesa.
-   Registro de pagamento.
-   Atualização da DRE.
-   Exportação PDF.
-   Exportação Excel.
-   Auditoria.

Todos os testes devem ser concluídos antes da liberação aos usuários.

------------------------------------------------------------------------

# Diagnóstico Rápido

## Sistema indisponível

Verificar:

-   Status da Vercel.
-   Status do Supabase.
-   DNS.
-   Certificados HTTPS.

## Lentidão

Verificar:

-   Consultas lentas.
-   Uso de CPU.
-   Uso de memória.
-   Índices do banco.

## Falhas de Login

Verificar:

-   Supabase Auth.
-   JWT.
-   Variáveis de ambiente.
-   Políticas RLS.

------------------------------------------------------------------------

# Resposta a Incidentes

## Crítico

Tempo alvo:

Até 15 minutos.

Ações:

-   Acionar equipe.
-   Restaurar serviço.
-   Executar rollback se necessário.

## Alto

Tempo alvo:

Até 1 hora.

## Médio

Até 4 horas.

## Baixo

Próxima janela de manutenção.

------------------------------------------------------------------------

# Rollback

Executar quando:

-   Erro crítico.
-   Perda de integridade.
-   Falha financeira.

Passos:

1.  Restaurar versão anterior.
2.  Validar banco.
3.  Executar testes críticos.
4.  Comunicar usuários.

------------------------------------------------------------------------

# Recuperação de Banco

1.  Selecionar backup.
2.  Restaurar homologação.
3.  Validar integridade.
4.  Restaurar produção.
5.  Executar testes financeiros.

------------------------------------------------------------------------

# Monitoramento

Acompanhar continuamente:

-   Disponibilidade.
-   Erros.
-   Tempo de resposta.
-   Exportações.
-   Auditoria.
-   Crescimento do banco.

------------------------------------------------------------------------

# Encerramento da Operação

Checklist:

-   Logs revisados.
-   Nenhum erro crítico.
-   Usuários comunicados.
-   Documentação atualizada.
-   Incidente encerrado (quando aplicável).

------------------------------------------------------------------------

# Controles

Toda operação deve registrar:

-   Responsável.
-   Data/Hora.
-   Versão.
-   Motivo.
-   Resultado.
-   Evidências.

------------------------------------------------------------------------

# Critérios de Aceite

-   Procedimentos reproduzíveis.
-   Rollback documentado.
-   Diagnóstico rápido disponível.
-   Operação segura em produção.
