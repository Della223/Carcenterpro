# 69-FORM_SPECIFICATIONS.md

# Especificação Completa dos Formulários

## Objetivo

Padronizar todos os formulários do CarCenter PRO Finance, definindo
comportamento, validações, integração e experiência do usuário.

------------------------------------------------------------------------

# Padrões Gerais

Todos os formulários devem possuir:

-   Label
-   Placeholder
-   Indicação de obrigatoriedade
-   Validação em tempo real
-   Mensagem de erro
-   Navegação por TAB
-   Suporte a ENTER para confirmação quando aplicável

------------------------------------------------------------------------

# Formulário de Receita

## Campos

### Data

Tipo: Date

Obrigatório: Sim

Validações: - Não aceitar data inválida. - Não aceitar data futura.

------------------------------------------------------------------------

### Categoria

Tipo: Select

Obrigatório: Sim

Origem: Categorias de Receita ativas.

------------------------------------------------------------------------

### Quantidade

Tipo: Número inteiro

Obrigatório: Sim

Valor mínimo: 0

------------------------------------------------------------------------

### Valor

Tipo: Moeda BRL

Obrigatório: Sim

Valor mínimo: 0,01

Máscara: R\$ 0.000,00

------------------------------------------------------------------------

### Observações

Tipo: Textarea

Obrigatório: Não

Máximo: 500 caracteres.

------------------------------------------------------------------------

# Formulário de Despesa

## Campos

-   Competência (MM/AAAA)
-   Fornecedor
-   Categoria
-   Subcategoria
-   Centro de Custo
-   Descrição
-   Valor Total
-   Quantidade de Parcelas
-   Data da Primeira Parcela
-   Observações

## Validações

-   Fornecedor obrigatório.
-   Categoria obrigatória.
-   Subcategoria obrigatória.
-   Centro de custo obrigatório.
-   Valor maior que zero.
-   Parcelas entre 1 e 120.

------------------------------------------------------------------------

# Formulário de Orçamento

Campos:

-   Exercício
-   Categoria
-   Valor Orçado

Regras:

-   Um orçamento por categoria/ano.
-   Valor maior que zero.

------------------------------------------------------------------------

# Formulário de Login

Campos:

-   E-mail
-   Senha

Validações:

-   E-mail válido.
-   Senha obrigatória.

Mensagens:

-   Credenciais inválidas.
-   Sessão expirada.

------------------------------------------------------------------------

# Formulários de Configuração

Categorias:

-   Nome
-   Tipo
-   Status

Subcategorias:

-   Categoria
-   Nome
-   Status

Centros de Custo:

-   Nome
-   Código
-   Status

------------------------------------------------------------------------

# Comportamentos

Ao salvar:

1.  Validar.
2.  Exibir loading.
3.  Persistir.
4.  Exibir toast.
5.  Atualizar módulos consumidores.

Ao cancelar:

Se houver alterações não salvas, solicitar confirmação.

------------------------------------------------------------------------

# Mensagens de Erro

-   Campo obrigatório.
-   Valor inválido.
-   Registro duplicado.
-   Operação não permitida.
-   Erro inesperado.

------------------------------------------------------------------------

# Integração

Todos os formulários enviam dados exclusivamente para a camada de
Services.

Nenhum formulário acessa diretamente o banco de dados.

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os campos documentados.
-   Máscaras consistentes.
-   Validações implementadas.
-   Mensagens padronizadas.
-   Integração respeitando a arquitetura do sistema.
