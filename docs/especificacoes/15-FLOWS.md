# 15-FLOWS.md

# Fluxos do Sistema

## Objetivo

Documentar todos os fluxos operacionais do CarCenter PRO Finance para
garantir comportamento consistente entre os módulos.

------------------------------------------------------------------------

# Fluxo 01 - Acesso

1.  Usuário acessa a aplicação.
2.  Informa e-mail e senha.
3.  Sistema autentica.
4.  HOME é carregada.
5.  Sessão inicia.
6.  Auditoria registra o acesso.

------------------------------------------------------------------------

# Fluxo 02 - Registro de Receita

HOME → Comercial → Novo Lançamento → Preencher formulário → Validar
dados → Salvar

Após salvar:

-   Atualizar Banco
-   Atualizar HOME
-   Atualizar Dashboard
-   Atualizar DRE
-   Atualizar Relatórios

------------------------------------------------------------------------

# Fluxo 03 - Registro de Despesa

HOME → Despesas → Nova Despesa → Informar competência → Informar
categoria → Informar fornecedor → Informar valor → Informar parcelamento
→ Salvar

Se parcelado:

-   Gerar parcelas automaticamente.

Após salvar:

-   Atualizar histórico financeiro.
-   Atualizar Dashboard.
-   Atualizar Relatórios.

------------------------------------------------------------------------

# Fluxo 04 - Pagamento de Parcela

Despesas → Localizar despesa → Selecionar parcela → Registrar pagamento

Sistema:

-   Atualiza parcela
-   Atualiza saldo remanescente
-   Atualiza DRE
-   Atualiza Dashboard
-   Atualiza HOME
-   Registra auditoria

------------------------------------------------------------------------

# Fluxo 05 - Atualização da DRE

Evento:

-   Receita criada
-   Receita alterada
-   Receita excluída
-   Pagamento registrado
-   Orçamento alterado

Sistema:

1.  Recalcular receitas.
2.  Recalcular despesas da competência.
3.  Atualizar DRE.
4.  Atualizar Dashboard.

------------------------------------------------------------------------

# Fluxo 06 - Publicação de Marketing

HOME → Painel Marketing

Story

Usuário marca "Publicado".

Sistema registra:

-   Usuário
-   Data
-   Hora

Feed

Mesmo comportamento.

------------------------------------------------------------------------

# Fluxo 07 - Consulta de Dashboard

Usuário aplica filtros.

Sistema:

-   Consulta banco.
-   Recalcula indicadores.
-   Atualiza cards.
-   Atualiza gráficos.

Sem edição de dados.

------------------------------------------------------------------------

# Fluxo 08 - Consulta de Relatórios

Selecionar relatório → Aplicar filtros → Visualizar

Opcional:

-   Exportar PDF
-   Exportar Excel
-   Exportar CSV
-   Imprimir

Registrar auditoria.

------------------------------------------------------------------------

# Fluxo 09 - Configurações

Usuário altera configuração.

Sistema:

-   Valida.
-   Salva.
-   Atualiza módulos afetados.
-   Registra auditoria.

Nunca alterar dados históricos.

------------------------------------------------------------------------

# Fluxo 10 - Assistente Gerencial

Ao carregar a HOME:

Sistema verifica:

-   Receitas pendentes.
-   Parcelas vencidas.
-   Story pendente.
-   Feed pendente.
-   Orçamento excedido.
-   Qualidade da base.

Exibe somente alertas relevantes.

------------------------------------------------------------------------

# Estados Gerais

Cada fluxo deverá contemplar:

-   Loading
-   Sucesso
-   Erro
-   Sem dados
-   Cancelado

Todos os estados devem possuir mensagens claras.

------------------------------------------------------------------------

# Critérios de Aceite

Todos os fluxos deverão executar automaticamente as integrações
descritas, sem necessidade de ações adicionais do usuário.
