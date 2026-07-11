# 44-USER_INTERACTIONS.md

# Interações do Usuário

## Objetivo

Definir o comportamento esperado de todas as interações do usuário com a
interface do CarCenter PRO Finance.

------------------------------------------------------------------------

# Princípios

-   Resposta imediata às ações.
-   Consistência entre módulos.
-   Minimizar cliques.
-   Evitar perda de dados.

------------------------------------------------------------------------

# Navegação

-   O menu lateral permanece visível.
-   O módulo ativo deve permanecer destacado.
-   A troca de módulo preserva os filtros quando aplicável.

------------------------------------------------------------------------

# Mouse

## Clique simples

Seleciona registros, abre módulos e executa ações.

## Duplo clique

Não será utilizado na versão 1.0.

## Hover

Ao passar o mouse:

-   Destacar botão.
-   Exibir tooltip quando existir.
-   Evidenciar linha da tabela.

------------------------------------------------------------------------

# Teclado

## TAB

Percorre os campos na ordem lógica.

## SHIFT + TAB

Retorna ao campo anterior.

## ENTER

Confirma formulários quando permitido.

## ESC

Fecha modais e cancela seleções.

## CTRL + S

Salva formulários em edição.

------------------------------------------------------------------------

# Formulários

Ao abrir:

-   Foco no primeiro campo.

Ao salvar:

-   Validar dados.
-   Exibir loading.
-   Exibir toast de sucesso ou erro.

Ao cancelar:

-   Se houver alterações não salvas, solicitar confirmação.

------------------------------------------------------------------------

# Tabelas

Permitir:

-   Seleção de linha.
-   Ordenação por coluna.
-   Paginação.
-   Pesquisa.
-   Filtros.

Clique na linha:

-   Seleciona.

Clique em ação:

-   Editar.
-   Excluir.
-   Visualizar.

------------------------------------------------------------------------

# Exclusão

Fluxo:

1.  Clique em Excluir.
2.  Exibir confirmação.
3.  Confirmar.
4.  Executar exclusão lógica ou física conforme regra.
5.  Exibir feedback.

------------------------------------------------------------------------

# Exportação

Fluxo:

1.  Aplicar filtros.
2.  Escolher formato.
3.  Gerar arquivo.
4.  Informar conclusão.

------------------------------------------------------------------------

# Estados Visuais

Salvar:

Loading → Sucesso

Erro:

Loading → Erro → Permitir nova tentativa

------------------------------------------------------------------------

# Feedback

Todas as ações devem apresentar:

-   Feedback visual.
-   Mensagem em Português.
-   Estado final claro.

------------------------------------------------------------------------

# Acessibilidade

-   Todos os elementos acessíveis por teclado.
-   Indicador visível de foco.
-   Labels associados aos campos.

------------------------------------------------------------------------

# Critérios de Aceite

-   Nenhuma interação deve deixar o usuário sem retorno visual.
-   Todos os atalhos e comportamentos devem ser consistentes entre os
    módulos.
