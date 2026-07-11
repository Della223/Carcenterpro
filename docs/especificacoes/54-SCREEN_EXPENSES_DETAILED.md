# 54-SCREEN_EXPENSES_DETAILED.md

# Especificação Detalhada da Tela Despesas

## Objetivo

O módulo **Despesas** controla todo o ciclo financeiro das despesas da
empresa: cadastro, parcelamento, pagamentos, apropriação por competência
e integração automática com HOME, Dashboard, DRE e Relatórios.

------------------------------------------------------------------------

# Layout Geral

``` text
+--------------------------------------------------------------------------------------+
| Cabeçalho                                                                            |
+---------+----------------------------------------------------------------------------+
| Menu    | Filtros                                                                    |
| Lateral |----------------------------------------------------------------------------|
|         | KPIs: Pago | Em Aberto | Total Competência | Parcelas Vencidas            |
|         |----------------------------------------------------------------------------|
|         | [ Nova Despesa ] [ Registrar Pagamento ] [ Exportar ]                     |
|         |----------------------------------------------------------------------------|
|         | Tabela de Despesas                                                        |
+---------+----------------------------------------------------------------------------+
```

------------------------------------------------------------------------

# Barra de Filtros

Campos:

-   Competência
-   Fornecedor
-   Categoria
-   Subcategoria
-   Centro de Custo
-   Situação

Botões:

-   Filtrar
-   Limpar

Todos os KPIs e a tabela devem respeitar os filtros ativos.

------------------------------------------------------------------------

# KPIs

## Total da Competência

Soma de todas as despesas da competência.

## Total Pago

Soma das parcelas pagas.

## Total em Aberto

Soma das parcelas pendentes.

## Parcelas Vencidas

Quantidade de parcelas vencidas e não pagas.

------------------------------------------------------------------------

# Cadastro de Despesa

Campos obrigatórios:

-   Competência
-   Fornecedor
-   Categoria
-   Subcategoria
-   Centro de Custo
-   Descrição
-   Valor Total
-   Quantidade de Parcelas
-   Data da Primeira Parcela

Campo opcional:

-   Observações

Botões:

-   Salvar
-   Cancelar

------------------------------------------------------------------------

# Parcelamento

Regras:

-   Mínimo: 1 parcela.
-   Máximo: 120 parcelas.
-   Gerar parcelas automaticamente.
-   Arredondamento conforme documento 24-FORMULAS.md.
-   Última parcela absorve diferenças de arredondamento.

------------------------------------------------------------------------

# Registro de Pagamento

Fluxo:

1.  Selecionar parcela.
2.  Informar data do pagamento.
3.  Confirmar forma de pagamento.
4.  Confirmar operação.
5.  Registrar auditoria.
6.  Publicar evento ExpensePaid.

------------------------------------------------------------------------

# Tabela

Colunas:

-   Competência
-   Fornecedor
-   Categoria
-   Valor Total
-   Parcelas
-   Pago
-   Saldo
-   Situação
-   Última Alteração
-   Ações

Recursos:

-   Pesquisa
-   Ordenação
-   Paginação
-   Exportação

------------------------------------------------------------------------

# Ações

-   Visualizar
-   Editar
-   Excluir (conforme regras de negócio)
-   Registrar Pagamento

------------------------------------------------------------------------

# Integrações Automáticas

Após criar despesa:

-   Atualizar HOME
-   Atualizar Dashboard
-   Atualizar Relatórios

Após pagamento:

-   Atualizar HOME
-   Atualizar Dashboard
-   Recalcular DRE
-   Atualizar Relatórios
-   Registrar Auditoria

------------------------------------------------------------------------

# Apropriação na DRE

-   Apenas despesas apropriadas conforme a regra da competência definida
    no sistema.
-   Nenhuma edição manual permitida na DRE.

------------------------------------------------------------------------

# Estados

Loading:

-   Skeleton para KPIs e tabela.

Empty:

Mensagem: "Nenhuma despesa encontrada."

Botão: "Criar primeira despesa"

Error:

Mensagem amigável.

Botão: "Tentar novamente"

------------------------------------------------------------------------

# Critérios de Aceite

-   CRUD completo.
-   Parcelamento automático correto.
-   Registro de pagamento funcional.
-   Atualização automática da HOME, Dashboard, DRE e Relatórios.
-   Auditoria registrada.
-   Performance inferior a 2 segundos para operações comuns.
