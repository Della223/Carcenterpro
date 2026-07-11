# 60-DESIGN_SYSTEM_COMPLETE.md

# Design System Completo

## Objetivo

Estabelecer a identidade visual oficial do CarCenter PRO Finance,
garantindo consistência, reutilização e escalabilidade da interface.

------------------------------------------------------------------------

# Princípios

-   Clareza acima de ornamentação.
-   Aparência corporativa.
-   Alta legibilidade.
-   Consistência entre módulos.
-   Componentes reutilizáveis.

------------------------------------------------------------------------

# Paleta de Cores

## Primária

-   Azul institucional

## Secundárias

-   Branco
-   Cinza claro
-   Cinza médio
-   Cinza escuro

## Semânticas

Sucesso - Verde

Aviso - Amarelo

Erro - Vermelho

Informação - Azul claro

Todos os valores deverão ser definidos como Design Tokens.

------------------------------------------------------------------------

# Tipografia

Fonte principal: - Inter

Pesos: - 400 Regular - 500 Medium - 600 SemiBold - 700 Bold

Hierarquia:

-   H1
-   H2
-   H3
-   Título de Card
-   Corpo
-   Legenda

------------------------------------------------------------------------

# Grid

Base:

8px

Espaçamentos:

4 8 12 16 24 32 40 48 64

------------------------------------------------------------------------

# Bordas

Radius:

-   4px
-   8px
-   12px

Cards utilizam 12px.

------------------------------------------------------------------------

# Sombras

-   Small
-   Medium
-   Large

Aplicadas apenas quando agregarem percepção de profundidade.

------------------------------------------------------------------------

# Componentes Base

Obrigatórios:

-   Button
-   IconButton
-   Input
-   TextArea
-   Select
-   Checkbox
-   Radio
-   Switch
-   Badge
-   Tooltip
-   Modal
-   Toast
-   Card
-   KPI Card
-   Table
-   Tabs
-   Dropdown
-   Pagination
-   Skeleton
-   Empty State
-   Error State

------------------------------------------------------------------------

# Botões

Estados:

-   Default
-   Hover
-   Focus
-   Active
-   Disabled
-   Loading

Tipos:

-   Primário
-   Secundário
-   Crítico
-   Fantasma

------------------------------------------------------------------------

# Formulários

Todos os campos possuem:

-   Label
-   Placeholder
-   Helper Text
-   Mensagem de Erro

Campos obrigatórios identificados visualmente.

------------------------------------------------------------------------

# Tabelas

Características:

-   Cabeçalho fixo
-   Ordenação
-   Paginação
-   Pesquisa
-   Seleção de linha
-   Estado vazio
-   Skeleton

------------------------------------------------------------------------

# KPIs

Estrutura:

-   Título
-   Valor
-   Comparativo
-   Tendência
-   Clique para navegação

------------------------------------------------------------------------

# Ícones

Biblioteca sugerida:

Lucide React

Regras:

-   Mesmo estilo em toda aplicação.
-   Entre 18 e 24 pixels.

------------------------------------------------------------------------

# Modais

Estrutura:

-   Cabeçalho
-   Conteúdo
-   Rodapé
-   Confirmar
-   Cancelar

Fechamento por ESC permitido.

------------------------------------------------------------------------

# Toasts

Tipos:

-   Sucesso
-   Aviso
-   Erro
-   Informação

Tempo padrão:

4 segundos.

------------------------------------------------------------------------

# Estados Visuais

Loading

Utilizar Skeleton.

Empty

Mensagem orientativa + CTA.

Error

Mensagem amigável + botão "Tentar novamente".

------------------------------------------------------------------------

# Responsividade

Prioridade:

1.  Desktop
2.  Notebook
3.  Tablet

Celular fora do escopo da versão 1.0.

------------------------------------------------------------------------

# Tokens

Centralizar em:

styles/tokens.ts

Categorias:

-   Colors
-   Typography
-   Radius
-   Shadows
-   Spacing
-   ZIndex
-   Breakpoints

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os componentes reutilizam tokens.
-   Interface consistente em todos os módulos.
-   Nenhum componente implementado fora do Design System.
