# 74-USE_CASES_COMPLETE.md

# Casos de Uso Completos

## Objetivo

Documentar todos os casos de uso do CarCenter PRO Finance, definindo
atores, pré-condições, fluxos principais, exceções e pós-condições para
orientar implementação e testes.

------------------------------------------------------------------------

# Atores

-   Administrador
-   Gestor
-   Financeiro
-   Consultor
-   Usuário Somente Leitura

------------------------------------------------------------------------

# UC-001 --- Autenticar Usuário

## Atores

Todos os usuários.

## Pré-condições

-   Usuário ativo.
-   Credenciais válidas.

## Fluxo Principal

1.  Informar e-mail.
2.  Informar senha.
3.  Validar credenciais.
4.  Criar sessão.
5.  Registrar auditoria.
6.  Redirecionar para HOME.

## Fluxos Alternativos

-   Credenciais inválidas.
-   Usuário inativo.
-   Sessão expirada.

## Pós-condições

-   Sessão autenticada.

------------------------------------------------------------------------

# UC-002 --- Cadastrar Receita

## Atores

Gestor, Financeiro.

## Pré-condições

-   Usuário autenticado.
-   Competência ativa.

## Fluxo Principal

1.  Abrir Comercial.
2.  Selecionar "Nova Receita".
3.  Preencher formulário.
4.  Validar dados.
5.  Salvar.
6.  Publicar RevenueCreated.
7.  Atualizar Dashboard, HOME, DRE e Relatórios.

## Exceções

-   Valor inválido.
-   Categoria inativa.

------------------------------------------------------------------------

# UC-003 --- Cadastrar Despesa

Fluxo Principal

1.  Criar despesa.
2.  Gerar parcelas.
3.  Registrar auditoria.
4.  Atualizar módulos consumidores.

Exceções

-   Fornecedor obrigatório.
-   Parcelamento inválido.

------------------------------------------------------------------------

# UC-004 --- Registrar Pagamento

Fluxo Principal

1.  Selecionar parcela.
2.  Informar pagamento.
3.  Confirmar.
4.  Atualizar DRE.
5.  Atualizar Dashboard.
6.  Registrar auditoria.

------------------------------------------------------------------------

# UC-005 --- Gerenciar Orçamentos

Fluxo Principal

1.  Selecionar exercício.
2.  Criar ou editar orçamento.
3.  Validar duplicidade.
4.  Atualizar indicadores.

------------------------------------------------------------------------

# UC-006 --- Consultar Dashboard

Fluxo Principal

1.  Aplicar filtros.
2.  Carregar KPIs.
3.  Carregar gráficos.
4.  Permitir navegação por clique.

------------------------------------------------------------------------

# UC-007 --- Consultar DRE

Fluxo Principal

1.  Selecionar competência.
2.  Consolidar receitas.
3.  Consolidar despesas.
4.  Calcular resultado.
5.  Exibir percentuais.

------------------------------------------------------------------------

# UC-008 --- Exportar Relatórios

Fluxo Principal

1.  Selecionar relatório.
2.  Aplicar filtros.
3.  Escolher formato.
4.  Gerar arquivo.
5.  Registrar auditoria.

------------------------------------------------------------------------

# UC-009 --- Administrar Configurações

Fluxo Principal

1.  Selecionar seção.
2.  Alterar cadastro mestre.
3.  Validar regras.
4.  Registrar auditoria.
5.  Atualizar módulos dependentes.

------------------------------------------------------------------------

# Regras Gerais

-   Todos os casos de uso exigem autenticação, salvo Login.
-   Toda alteração gera auditoria.
-   Todas as validações seguem o documento 70-VALIDATION_RULES.md.
-   Todas as mensagens seguem o documento 71-SYSTEM_MESSAGES_CATALOG.md.

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os casos de uso possuem ator, pré-condições, fluxo principal,
    exceções e pós-condições.
-   Os casos de uso servem como base para testes E2E e implementação.
