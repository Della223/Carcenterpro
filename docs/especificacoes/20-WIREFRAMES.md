# 20-WIREFRAMES.md

# Wireframes Funcionais

## Objetivo

Este documento define a estrutura visual de todas as telas da versão
1.0. Os wireframes representam a organização dos componentes, não o
design final.

------------------------------------------------------------------------

# Tela de Login

    +------------------------------------------------------+
    |                 CarCenter PRO Finance                |
    |------------------------------------------------------|
    | E-mail: [______________________________]             |
    | Senha : [______________________________]             |
    |                                                      |
    | [ Entrar ]                                           |
    |                                                      |
    | Esqueci minha senha                                  |
    +------------------------------------------------------+

------------------------------------------------------------------------

# HOME

    +--------------------------------------------------------------------------------+
    | Logo | Bom dia, Daniel | Competência 07/2026 | Versão 1.0                      |
    +---------+---------------------------------------------------------------------+
    | Menu    | Receita | Despesa | Resultado | Projeção                            |
    | Lateral |---------------------------------------------------------------------|
    |         | Pendências | Qualidade da Base | Competência Aberta                 |
    |         |---------------------------------------------------------------------|
    |         | Marketing (Story / Feed)                                           |
    |         |---------------------------------------------------------------------|
    |         | Assistente Gerencial                                               |
    +---------+---------------------------------------------------------------------+

Cards: - Receita Acumulada - Despesa Acumulada - Resultado - Projeção -
Pendências - Qualidade da Base - Marketing - Assistente Gerencial

------------------------------------------------------------------------

# Comercial

    +--------------------------------------------------------------------------+
    | Filtros | Novo Lançamento | Exportar                                     |
    +--------------------------------------------------------------------------+
    | Data | Categoria | Qtde | Valor | Observações | Editar | Excluir         |
    +--------------------------------------------------------------------------+
    | Indicadores: Receita | Ticket Médio | Qtde Vendas | Projeção             |
    +--------------------------------------------------------------------------+

Formulário: - Data - Categoria - Quantidade de vendas - Valor -
Observações - Botões Salvar / Cancelar

------------------------------------------------------------------------

# Despesas

    +----------------------------------------------------------------------------+
    | Filtros | Nova Despesa | Registrar Pagamento | Exportar                    |
    +----------------------------------------------------------------------------+
    | Competência | Fornecedor | Categoria | Valor | Situação                    |
    +----------------------------------------------------------------------------+
    | Histórico Financeiro                                                      |
    | Total | Pago | Saldo | Parcelas                                           |
    +----------------------------------------------------------------------------+

Cadastro: - Competência - Fornecedor - Categoria - Subcategoria - Centro
de Custo - Descrição - Valor - Parcelamento - Primeira parcela -
Observações

------------------------------------------------------------------------

# Dashboard

    +-----------------------------------------------------------------------+
    | Filtros Globais                                                      |
    +-----------------------------------------------------------------------+
    | Receita | Despesa | Resultado | Projeção | Ticket Médio              |
    +-----------------------------------------------------------------------+
    | Gráfico Receita x Despesa                                            |
    +-----------------------------------------------------------------------+
    | Evolução Mensal                                                      |
    +-----------------------------------------------------------------------+
    | Receita por Categoria | Despesas por Categoria                       |
    +-----------------------------------------------------------------------+

------------------------------------------------------------------------

# DRE

    +-------------------------------------------------------------+
    | Competência | Exportar                                      |
    +-------------------------------------------------------------+
    | Receita Bruta                                                |
    | (-) Deduções                                                 |
    | (=) Receita Líquida                                          |
    | (-) Despesas Operacionais                                    |
    | (=) Resultado Operacional                                    |
    +-------------------------------------------------------------+

------------------------------------------------------------------------

# Orçamentos

    +------------------------------------------------------------------+
    | Ano | Categoria | Orçado | Realizado | Diferença | Execução (%)  |
    +------------------------------------------------------------------+

------------------------------------------------------------------------

# Relatórios

    +---------------------------------------------------------------+
    | Selecionar Relatório | Filtros | Gerar | Exportar | Imprimir  |
    +---------------------------------------------------------------+

------------------------------------------------------------------------

# Configurações

    +---------------------------------------------------------------+
    | Menu de Configurações                                         |
    |---------------------------------------------------------------|
    | Categorias                                                    |
    | Subcategorias                                                 |
    | Centros de Custo                                              |
    | Competência                                                   |
    | Marketing                                                     |
    | Sistema                                                       |
    +---------------------------------------------------------------+

------------------------------------------------------------------------

# Regras Gerais de Layout

-   Menu lateral fixo.
-   Cabeçalho fixo.
-   Área central rolável.
-   Rodapé discreto exibindo usuário logado e versão.
-   Nenhum popup para navegação entre módulos.
-   Todos os formulários devem possuir Salvar e Cancelar.

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os módulos seguem a mesma estrutura visual.
-   Navegação consistente.
-   Componentes reutilizáveis.
-   Interface preparada para implementação em React/shadcn-ui.
