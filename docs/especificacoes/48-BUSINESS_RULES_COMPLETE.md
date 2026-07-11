# 48-BUSINESS_RULES_COMPLETE.md

# Catálogo Completo de Regras de Negócio

## Objetivo

Consolidar todas as regras obrigatórias do CarCenter PRO Finance em um
único documento normativo. Estas regras prevalecem sobre comportamentos
implícitos.

------------------------------------------------------------------------

# Convenções

-   BR-xxx: Identificador único.
-   Toda regra deve ser implementada no backend.
-   O frontend apenas orienta e valida a experiência do usuário.

------------------------------------------------------------------------

# Gerais

## BR-001

Nenhum usuário não autenticado pode acessar módulos internos.

## BR-002

Toda operação financeira deve registrar auditoria.

## BR-003

Todos os valores monetários utilizam BRL com precisão de duas casas
decimais.

## BR-004

Nenhuma exclusão física é permitida para registros financeiros
históricos.

## BR-005

Toda alteração relevante deve atualizar automaticamente os módulos
consumidores.

------------------------------------------------------------------------

# Receitas

## BR-100

Receitas devem possuir data válida.

## BR-101

Não permitir receitas com valor menor ou igual a zero.

## BR-102

Categoria é obrigatória e deve estar ativa.

## BR-103

Quantidade de vendas deve ser inteira e maior ou igual a zero.

## BR-104

Após salvar uma receita: - Atualizar HOME - Atualizar Dashboard -
Recalcular DRE - Atualizar Relatórios - Registrar auditoria

------------------------------------------------------------------------

# Despesas

## BR-200

Toda despesa pertence a uma competência.

## BR-201

Fornecedor é obrigatório.

## BR-202

Categoria, subcategoria e centro de custo são obrigatórios.

## BR-203

Parcelamento mínimo: 1 parcela.

## BR-204

Pagamento altera apenas parcelas em aberto.

## BR-205

Pagamento não pode exceder o valor da parcela.

## BR-206

Pagamento confirmado atualiza: - HOME - Dashboard - DRE - Relatórios -
Auditoria

------------------------------------------------------------------------

# DRE

## BR-300

A DRE é exclusivamente calculada.

## BR-301

Não permitir edição manual.

## BR-302

Receitas compõem Receita Bruta.

## BR-303

Despesas são apropriadas conforme regras definidas para a competência.

## BR-304

Toda alteração financeira deve refletir imediatamente na DRE.

------------------------------------------------------------------------

# Dashboard

## BR-400

KPIs utilizam dados em tempo real.

## BR-401

Filtros devem afetar todos os gráficos e indicadores.

## BR-402

Sem dados, exibir Empty State.

------------------------------------------------------------------------

# Orçamentos

## BR-500

Apenas um orçamento por categoria e exercício.

## BR-501

Comparativo utiliza realizado acumulado.

## BR-502

Ultrapassar orçamento gera alerta no Assistente Gerencial.

------------------------------------------------------------------------

# Marketing

## BR-600

Registrar publicação de Story.

## BR-601

Registrar publicação de Feed.

## BR-602

Gravar automaticamente usuário, data e hora.

------------------------------------------------------------------------

# Configurações

## BR-700

Não excluir categorias vinculadas a registros.

## BR-701

Categorias inativas não podem ser utilizadas em novos lançamentos.

------------------------------------------------------------------------

# Auditoria

## BR-800

Registrar: - Usuário - Data/Hora - Operação - Módulo - Registro afetado

## BR-801

Auditoria não pode ser alterada pela interface.

------------------------------------------------------------------------

# Exportação

## BR-900

Exportações respeitam filtros ativos.

## BR-901

Arquivos devem preservar valores monetários e datas.

------------------------------------------------------------------------

# Segurança

## BR-950

RLS habilitado nas tabelas transacionais.

## BR-951

Variáveis sensíveis nunca expostas ao cliente.

------------------------------------------------------------------------

# Invariantes

## BR-990

Nenhuma receita sem categoria.

## BR-991

Nenhuma despesa sem competência.

## BR-992

Toda parcela pertence exatamente a uma despesa.

## BR-993

Nenhum cálculo financeiro pode divergir das fórmulas oficiais.

## BR-994

Toda regra deste documento possui prioridade sobre implementações
implícitas.

------------------------------------------------------------------------

# Critérios de Aceite

-   Todas as regras implementadas no backend.
-   Regras críticas cobertas por testes automatizados.
-   Qualquer alteração futura deve atualizar este documento antes da
    implementação.
