# 38-ERROR_CATALOG.md

# Catálogo de Erros

## Objetivo

Padronizar todos os erros do CarCenter PRO Finance para facilitar
desenvolvimento, suporte, monitoramento e auditoria.

------------------------------------------------------------------------

# Estrutura

Cada erro deverá possuir:

-   Código
-   Título
-   Mensagem ao usuário
-   Mensagem técnica
-   Severidade
-   Módulo
-   Possíveis causas
-   Ação recomendada

------------------------------------------------------------------------

# Severidades

-   INFO
-   WARNING
-   ERROR
-   CRITICAL

------------------------------------------------------------------------

# Autenticação

## ERR-001

Título: Credenciais inválidas

Usuário: "E-mail ou senha inválidos."

Técnico: Falha de autenticação.

Severidade: WARNING

Módulo: Login

Ação: Validar credenciais e registrar tentativa.

------------------------------------------------------------------------

## ERR-002

Título: Sessão expirada

Usuário: "Sua sessão expirou. Faça login novamente."

Severidade: INFO

Ação: Redirecionar para Login.

------------------------------------------------------------------------

# Comercial

## ERR-100

Receita inválida

Usuário: "O valor da receita deve ser maior que zero."

Severidade: ERROR

## ERR-101

Data futura

Usuário: "Não é permitido lançar receitas em datas futuras."

------------------------------------------------------------------------

# Despesas

## ERR-200

Competência inválida

Usuário: "A competência informada é inválida."

## ERR-201

Fornecedor obrigatório

Usuário: "Informe o fornecedor."

## ERR-202

Pagamento duplicado

Usuário: "Esta parcela já foi registrada como paga."

Severidade: CRITICAL

------------------------------------------------------------------------

# DRE

## ERR-300

Falha no cálculo

Usuário: "Não foi possível calcular a DRE."

Técnico: Erro durante consolidação financeira.

------------------------------------------------------------------------

# Dashboard

## ERR-400

Sem dados

Usuário: "Não existem dados para os filtros selecionados."

## ERR-401

Falha ao carregar indicadores

Usuário: "Não foi possível carregar o Dashboard."

------------------------------------------------------------------------

# Orçamentos

## ERR-500

Orçamento duplicado

Usuário: "Já existe um orçamento para esta categoria neste exercício."

------------------------------------------------------------------------

# Relatórios

## ERR-600

Falha na exportação

Usuário: "Não foi possível gerar o relatório."

------------------------------------------------------------------------

# Configurações

## ERR-700

Categoria em uso

Usuário: "Esta categoria não pode ser excluída porque possui registros
vinculados."

------------------------------------------------------------------------

# Banco de Dados

## ERR-900

Violação de integridade

Usuário: "Não foi possível concluir a operação."

Técnico: Violação de chave estrangeira ou constraint.

Severidade: CRITICAL

------------------------------------------------------------------------

# Registro em Log

Todo erro ERROR ou CRITICAL deve registrar:

-   Código
-   Usuário
-   Data/Hora
-   Módulo
-   Stack trace (quando disponível)
-   Contexto da operação

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os erros utilizam códigos únicos.
-   Mensagens ao usuário em Português (Brasil).
-   Erros críticos registrados em log e auditoria.
