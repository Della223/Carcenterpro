# 31-SCREENS_SPECIFICATION.md

# Especificação Completa das Telas

## Objetivo

Definir detalhadamente cada tela da aplicação para eliminar ambiguidades
durante o desenvolvimento.

------------------------------------------------------------------------

# HOME

## Finalidade

Centralizar a rotina diária do gestor.

## Componentes

-   Cabeçalho
-   Menu lateral
-   Cards financeiros
-   Painel operacional
-   Painel de marketing
-   Assistente gerencial
-   Rodapé

## Cards Financeiros

### Receita Acumulada

Origem: revenues

### Despesa Acumulada

Origem: expense_installments (pagas na competência)

### Resultado

Fórmula: Receita - Despesa

### Projeção

Conforme documento 24-FORMULAS.md

------------------------------------------------------------------------

## Painel Operacional

Exibir:

-   Competência aberta
-   Qualidade da Base
-   Pendências financeiras
-   Receitas pendentes
-   Despesas pendentes

Cada item deve possuir clique para navegação.

------------------------------------------------------------------------

## Painel Marketing

Story

-   Status
-   Horário sugerido
-   Botão Publicado

Feed

-   Status
-   Horário sugerido
-   Botão Publicado

Registrar automaticamente:

-   Usuário
-   Data
-   Hora

------------------------------------------------------------------------

## Assistente Gerencial

Prioridade dos alertas:

1.  Competência inconsistente
2.  Parcelas vencidas
3.  Receita pendente
4.  Orçamento excedido
5.  Marketing pendente

Máximo de 5 alertas simultâneos.

------------------------------------------------------------------------

# Tela Comercial

## Barra Superior

-   Novo lançamento
-   Exportar
-   Pesquisa
-   Filtros

## Grade

Colunas:

-   Data
-   Categoria
-   Quantidade
-   Valor
-   Ticket Médio (calculado)
-   Observações
-   Usuário
-   Ações

## Formulário

Campos obrigatórios:

-   Data
-   Categoria
-   Quantidade
-   Valor

Campo opcional:

-   Observações

Botões:

-   Salvar
-   Cancelar

------------------------------------------------------------------------

# Tela Despesas

## Grade

Colunas:

-   Competência
-   Fornecedor
-   Categoria
-   Valor
-   Parcelas
-   Pago
-   Saldo
-   Situação

## Abas

-   Dados Gerais
-   Parcelas
-   Histórico

Cada aba mantém o contexto da despesa.

------------------------------------------------------------------------

# Tela Dashboard

Organização:

Linha 1: KPIs

Linha 2: Receita x Despesa

Linha 3: Gráficos de Categoria

Linha 4: Centros de Custo

Filtros sempre no topo.

------------------------------------------------------------------------

# Tela DRE

Tabela única.

Linhas protegidas.

Sem edição.

Comparativos exibidos à direita.

------------------------------------------------------------------------

# Tela Orçamentos

Grade anual.

Cada linha representa uma categoria.

Colunas:

-   Categoria
-   Orçado
-   Realizado
-   Diferença
-   Execução %

------------------------------------------------------------------------

# Tela Relatórios

Área de filtros superior.

Lista de relatórios ao centro.

Botões:

-   Visualizar
-   Exportar PDF
-   Exportar Excel
-   Exportar CSV
-   Imprimir

------------------------------------------------------------------------

# Tela Configurações

Menu lateral interno:

-   Categorias Receita
-   Categorias Despesa
-   Subcategorias
-   Centros de Custo
-   Competência
-   Marketing
-   Sistema

------------------------------------------------------------------------

# Rodapé

Exibir:

-   Usuário logado
-   Versão
-   Ambiente (Produção/Homologação)

------------------------------------------------------------------------

# Critérios de Aceite

Todas as telas deverão seguir esta especificação estrutural antes da
aplicação do design visual definitivo.
