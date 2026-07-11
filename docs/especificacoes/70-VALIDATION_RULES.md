# 70-VALIDATION_RULES.md

# Regras Oficiais de Validação

## Objetivo

Centralizar todas as regras de validação do CarCenter PRO Finance para
garantir integridade dos dados, comportamento consistente entre frontend
e backend e prevenção de inconsistências.

------------------------------------------------------------------------

# Princípios

-   Toda validação crítica deve existir no backend.
-   O frontend valida para melhorar a experiência do usuário.
-   Nunca confiar apenas na validação do cliente.
-   Mensagens sempre em Português (Brasil).

------------------------------------------------------------------------

# Validações Gerais

## Campos Obrigatórios

-   Não aceitar valores nulos quando obrigatórios.
-   Remover espaços em branco nas extremidades.
-   Exibir mensagem específica por campo.

## Texto

-   Sanitizar entrada.
-   Limitar tamanho conforme especificação.
-   Bloquear caracteres de controle.

## Numéricos

-   Aceitar apenas números válidos.
-   Impedir valores negativos quando não permitidos.
-   Utilizar precisão decimal para valores monetários.

## Datas

-   Formato ISO internamente.
-   Exibição DD/MM/AAAA.
-   Bloquear datas inválidas.
-   Bloquear datas futuras quando a regra exigir.

------------------------------------------------------------------------

# Receitas

Validar:

-   Data obrigatória.
-   Categoria ativa.
-   Valor \> 0.
-   Quantidade \>= 0.
-   Observação \<= 500 caracteres.

------------------------------------------------------------------------

# Despesas

Validar:

-   Competência obrigatória.
-   Fornecedor obrigatório.
-   Categoria obrigatória.
-   Subcategoria obrigatória.
-   Centro de custo obrigatório.
-   Valor \> 0.
-   Parcelas entre 1 e 120.
-   Primeiro vencimento válido.

------------------------------------------------------------------------

# Orçamentos

Validar:

-   Exercício válido.
-   Categoria ativa.
-   Apenas um orçamento por categoria/ano.
-   Valor planejado \> 0.

------------------------------------------------------------------------

# Login

Validar:

-   E-mail obrigatório.
-   Formato de e-mail válido.
-   Senha obrigatória.

Nunca informar qual campo está incorreto na autenticação.

------------------------------------------------------------------------

# Configurações

Categorias:

-   Nome único por tipo.

Subcategorias:

-   Nome único dentro da categoria.

Centros de Custo:

-   Nome único.

------------------------------------------------------------------------

# Validações Cruzadas

-   Não excluir categoria utilizada.
-   Não excluir centro de custo utilizado.
-   Não alterar registros históricos sem auditoria.
-   Não permitir pagamento acima do saldo da parcela.

------------------------------------------------------------------------

# Máscaras

-   Moeda: R\$ 0.000,00
-   Competência: MM/AAAA
-   Data: DD/MM/AAAA
-   Percentual: 0,00%

------------------------------------------------------------------------

# Sanitização

Aplicar:

-   Trim.
-   Escape de HTML quando aplicável.
-   Normalização Unicode.
-   Remoção de caracteres inválidos.

------------------------------------------------------------------------

# Códigos de Erro

ERR-001 Campo obrigatório.

ERR-002 Valor inválido.

ERR-003 Registro duplicado.

ERR-004 Operação não permitida.

ERR-005 Erro inesperado.

Consultar 38-ERROR_CATALOG.md para catálogo completo.

------------------------------------------------------------------------

# Critérios de Aceite

-   Regras implementadas no frontend e backend conforme criticidade.
-   Mensagens padronizadas.
-   Dados persistidos somente após validação completa.
