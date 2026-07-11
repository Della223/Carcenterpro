# 23-VALIDATIONS.md

# Validações do Sistema

## Objetivo

Definir todas as validações obrigatórias para garantir consistência dos
dados no frontend e backend.

------------------------------------------------------------------------

# Regras Gerais

-   Toda validação deve existir no frontend e no backend.
-   Nunca confiar apenas na validação da interface.
-   Exibir mensagens claras em Português (Brasil).
-   Impedir gravação quando existir qualquer erro.

------------------------------------------------------------------------

# Comercial

## Data

-   Obrigatória
-   Formato: DD/MM/AAAA
-   Não permitir data futura

Mensagem: "A data informada é inválida."

## Categoria

-   Obrigatória
-   Deve existir na tabela revenue_categories
-   Não permitir categoria inativa

Mensagem: "Selecione uma categoria válida."

## Quantidade de Vendas

-   Obrigatória
-   Inteiro
-   Valor mínimo: 0
-   Valor máximo: 9999

Mensagem: "Informe uma quantidade válida."

## Valor

-   Obrigatório
-   Moeda brasileira
-   Maior que zero
-   Máximo: 999.999.999,99

Mensagem: "Informe um valor maior que zero."

## Observações

-   Opcional
-   Máximo: 1.000 caracteres

------------------------------------------------------------------------

# Despesas

## Competência

-   Obrigatória
-   Formato MM/AAAA
-   Não permitir mês inválido

## Fornecedor

-   Obrigatório
-   3 a 150 caracteres

## Categoria

-   Obrigatória
-   Categoria ativa

## Subcategoria

-   Obrigatória
-   Deve pertencer à categoria selecionada

## Centro de Custo

-   Obrigatório
-   Centro ativo

## Descrição

-   Obrigatória
-   Máximo: 500 caracteres

## Valor Total

-   Obrigatório
-   Maior que zero

## Parcelas

-   Inteiro
-   Mínimo: 1
-   Máximo: 120

## Data da Primeira Parcela

-   Obrigatória quando parcelado

------------------------------------------------------------------------

# Orçamentos

## Ano

-   Obrigatório
-   Entre 2000 e 2100

## Valor Orçado

-   Obrigatório
-   Maior que zero

Não permitir orçamento duplicado para a mesma categoria e ano.

------------------------------------------------------------------------

# Configurações

Categorias

-   Nome obrigatório
-   Máximo 100 caracteres
-   Não permitir duplicidade

Subcategorias

-   Nome obrigatório
-   Categoria obrigatória

Centros de Custo

-   Nome obrigatório
-   Não permitir duplicidade

------------------------------------------------------------------------

# Login

E-mail

-   Obrigatório
-   Formato válido

Senha

-   Obrigatória
-   Mínimo 8 caracteres

------------------------------------------------------------------------

# Mensagens Padrão

Campo obrigatório: "Este campo é obrigatório."

Valor inválido: "Valor inválido."

Registro duplicado: "Já existe um registro com estas informações."

Falha inesperada: "Ocorreu um erro inesperado. Tente novamente."

------------------------------------------------------------------------

# Critérios de Aceite

-   Todas as validações implementadas no frontend e backend.
-   Mensagens padronizadas.
-   Nenhum dado inválido persistido no banco.
