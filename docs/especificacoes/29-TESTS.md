# 29-TESTS.md

# Plano de Testes

## Objetivo

Garantir que o CarCenter PRO Finance atenda integralmente aos requisitos
funcionais, regras de negócio e critérios de aceite definidos na
documentação.

------------------------------------------------------------------------

# Estratégia de Testes

A aplicação deverá ser validada através de:

-   Testes Unitários
-   Testes de Integração
-   Testes Funcionais
-   Testes de Regressão
-   Testes de Usabilidade
-   Testes de Performance
-   Testes de Segurança

------------------------------------------------------------------------

# Testes de Autenticação

## TST-001

Cenário: Login com credenciais válidas.

Resultado esperado: Usuário autenticado e redirecionado para HOME.

## TST-002

Login com senha inválida.

Resultado esperado: Mensagem "E-mail ou senha inválidos."

## TST-003

Logout.

Resultado esperado: Sessão encerrada e retorno à tela de login.

------------------------------------------------------------------------

# Testes do Comercial

## TST-010

Cadastrar receita válida.

Esperado: Registro salvo e atualização automática da HOME, Dashboard,
DRE e Relatórios.

## TST-011

Cadastrar receita com valor igual a zero.

Esperado: Bloquear gravação e exibir mensagem de erro.

## TST-012

Cadastrar receita com data futura.

Esperado: Bloquear gravação.

## TST-013

Validar cálculo do Ticket Médio.

Esperado: Receita ÷ Quantidade de Vendas.

------------------------------------------------------------------------

# Testes de Despesas

## TST-020

Cadastrar despesa à vista.

Esperado: Registro salvo corretamente.

## TST-021

Cadastrar despesa parcelada.

Esperado: Parcelas geradas automaticamente.

## TST-022

Registrar pagamento.

Esperado: Atualizar saldo, DRE, Dashboard e HOME.

## TST-023

Excluir despesa.

Esperado: Remover despesa e parcelas vinculadas conforme regra definida.

------------------------------------------------------------------------

# Testes da DRE

## TST-030

Registrar receita.

Esperado: Atualização automática da DRE.

## TST-031

Registrar pagamento de parcela.

Esperado: Despesa apropriada apenas na competência correspondente.

## TST-032

Verificar edição manual.

Esperado: Não permitir alteração.

------------------------------------------------------------------------

# Testes do Dashboard

## TST-040

Aplicar filtros.

Esperado: Atualização de todos os cards e gráficos.

## TST-041

Sem dados.

Esperado: Exibir Empty State.

------------------------------------------------------------------------

# Testes dos Orçamentos

## TST-050

Cadastrar orçamento anual.

Esperado: Comparativos disponíveis.

## TST-051

Ultrapassar orçamento.

Esperado: Assistente Gerencial exibe alerta.

------------------------------------------------------------------------

# Testes de Marketing

## TST-060

Registrar Story.

Esperado: Gravar usuário, data e hora.

## TST-061

Registrar Feed.

Esperado: Gravar usuário, data e hora.

------------------------------------------------------------------------

# Testes de Relatórios

## TST-070

Exportar PDF.

Esperado: Arquivo gerado respeitando filtros.

## TST-071

Exportar Excel.

Esperado: Arquivo .xlsx válido.

## TST-072

Exportar CSV.

Esperado: Arquivo CSV válido.

------------------------------------------------------------------------

# Testes de Performance

-   HOME \< 2 segundos.
-   Dashboard \< 3 segundos.
-   Consultas com paginação.
-   Sem travamentos em operações simultâneas.

------------------------------------------------------------------------

# Testes de Segurança

-   Acesso apenas por usuários autenticados.
-   Validação de permissões.
-   Proteção contra manipulação de requisições.
-   Auditoria registrada em todas as operações de escrita.

------------------------------------------------------------------------

# Critérios de Aprovação

Cada caso de teste deverá registrar:

-   Identificador
-   Resultado esperado
-   Resultado obtido
-   Status (Aprovado/Reprovado)
-   Evidência
-   Responsável
-   Data da execução

O sistema será considerado apto para produção somente quando 100% dos
testes críticos estiverem aprovados.
