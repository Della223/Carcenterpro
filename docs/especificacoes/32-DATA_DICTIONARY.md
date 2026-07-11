# 32-DATA_DICTIONARY.md

# Dicionário de Dados

## Objetivo

Definir, de forma padronizada, todos os campos utilizados pelo CarCenter
PRO Finance.

Cada campo deverá possuir um único significado em toda a aplicação.

------------------------------------------------------------------------

# Convenções

## Tipos

-   UUID
-   Texto
-   Inteiro
-   Decimal
-   Booleano
-   Data
-   Data/Hora

## Obrigatoriedade

-   Obrigatório
-   Opcional
-   Calculado

------------------------------------------------------------------------

# Comercial

## Data da Receita

Nome técnico: revenue_date

Tipo: Date

Obrigatório: Sim

Formato: DD/MM/AAAA

Origem: Usuário

Destino: Dashboard, DRE, Relatórios

Validação: Não permitir data futura.

------------------------------------------------------------------------

## Categoria da Receita

Nome técnico: category_id

Tipo: UUID

Origem: Tabela revenue_categories

Obrigatório: Sim

------------------------------------------------------------------------

## Quantidade de Vendas

Nome técnico: quantity

Tipo: Integer

Obrigatório: Sim

Valor mínimo: 0

Valor máximo: 9999

Utilização: Cálculo do ticket médio.

------------------------------------------------------------------------

## Valor da Receita

Nome técnico: amount

Tipo: Decimal(14,2)

Obrigatório: Sim

Valor mínimo: 0,01

Formato: R\$ 0,00

------------------------------------------------------------------------

## Observações

Nome técnico: notes

Tipo: Texto

Obrigatório: Não

Máximo: 1000 caracteres

------------------------------------------------------------------------

# Despesas

## Competência

Nome técnico: competence

Formato: MM/AAAA

Obrigatório: Sim

------------------------------------------------------------------------

## Fornecedor

Nome técnico: supplier

Tipo: Texto

Obrigatório: Sim

Máximo: 150 caracteres

------------------------------------------------------------------------

## Categoria

Nome técnico: category_id

Origem: expense_categories

Obrigatório: Sim

------------------------------------------------------------------------

## Subcategoria

Nome técnico: subcategory_id

Obrigatório: Sim

Deve pertencer à categoria selecionada.

------------------------------------------------------------------------

## Centro de Custo

Nome técnico: cost_center_id

Obrigatório: Sim

------------------------------------------------------------------------

## Valor Total

Nome técnico: total_amount

Tipo: Decimal(14,2)

Obrigatório: Sim

------------------------------------------------------------------------

## Quantidade de Parcelas

Nome técnico: installment_count

Tipo: Inteiro

Obrigatório: Sim

Mínimo: 1

Máximo: 120

------------------------------------------------------------------------

## Data da Primeira Parcela

Nome técnico: first_due_date

Obrigatório: Quando parcelado.

------------------------------------------------------------------------

# Marketing

## Tipo

post_type

Valores:

-   Story
-   Feed

------------------------------------------------------------------------

## Publicado

published

Tipo: Boolean

------------------------------------------------------------------------

## Publicado por

published_by

Origem: Usuário autenticado

Calculado automaticamente.

------------------------------------------------------------------------

## Data/Hora da Publicação

published_at

Calculado automaticamente.

------------------------------------------------------------------------

# Auditoria

## Usuário

created_by

Preenchimento automático.

------------------------------------------------------------------------

## Data de Criação

created_at

Automático.

------------------------------------------------------------------------

## Data de Alteração

updated_at

Automático.

------------------------------------------------------------------------

# Campos Calculados

## Ticket Médio

Não armazenar no banco.

Calcular em tempo real.

------------------------------------------------------------------------

## Resultado

Não armazenar.

Calcular em tempo real.

------------------------------------------------------------------------

## Qualidade da Base

Não armazenar.

Calcular conforme documento 24-FORMULAS.md.

------------------------------------------------------------------------

# Critérios de Aceite

-   Nenhum campo duplicado semanticamente.
-   Todos os nomes técnicos padronizados.
-   Todos os módulos utilizam este dicionário como referência oficial.
