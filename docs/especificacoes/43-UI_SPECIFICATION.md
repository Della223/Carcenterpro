# 43-UI_SPECIFICATION.md

# Especificação Completa da Interface

## Objetivo

Definir detalhadamente todos os elementos visuais e interativos da
interface do CarCenter PRO Finance, eliminando ambiguidades de
implementação.

------------------------------------------------------------------------

# Diretrizes Gerais

-   Interface em Português (Brasil).
-   Aparência corporativa, limpa e moderna.
-   Priorizar leitura e produtividade.
-   Consistência entre todos os módulos.

------------------------------------------------------------------------

# Cabeçalho

Componentes obrigatórios:

-   Logotipo
-   Nome do sistema
-   Saudação ao usuário
-   Competência ativa
-   Botão de perfil
-   Botão sair

Altura recomendada: 64px

------------------------------------------------------------------------

# Menu Lateral

Itens:

-   HOME
-   Comercial
-   Despesas
-   Dashboard
-   DRE
-   Orçamentos
-   Relatórios
-   Configurações

Regras:

-   Ícones monocromáticos.
-   Item ativo destacado.
-   Nunca recolher automaticamente.

------------------------------------------------------------------------

# Botões

## Primário

Uso: - Salvar - Confirmar - Entrar

Estado: Default, Hover, Focus, Disabled, Loading

## Secundário

Uso: - Cancelar - Voltar - Limpar

## Crítico

Uso: - Excluir - Remover

Confirmação obrigatória.

------------------------------------------------------------------------

# Campos

Todos os campos devem possuir:

-   Label
-   Placeholder
-   Helper text (quando necessário)
-   Mensagem de erro
-   Indicação visual de obrigatoriedade

Nunca utilizar apenas placeholder como identificação.

------------------------------------------------------------------------

# Tabelas

Obrigatoriamente:

-   Cabeçalho fixo
-   Ordenação por coluna
-   Pesquisa
-   Paginação
-   Quantidade por página
-   Exportação (quando aplicável)
-   Estado vazio
-   Skeleton durante carregamento

------------------------------------------------------------------------

# Cards

Estrutura:

-   Título
-   Valor principal
-   Comparativo (opcional)
-   Ícone (opcional)
-   Ação (opcional)

------------------------------------------------------------------------

# Modais

Componentes:

-   Título
-   Conteúdo
-   Botão Confirmar
-   Botão Cancelar

Fechar por ESC permitido.

------------------------------------------------------------------------

# Tooltips

Obrigatórios para:

-   Ícones de ajuda
-   Campos complexos
-   Indicadores calculados

Tempo de abertura: 300 ms

------------------------------------------------------------------------

# Ícones

Padrão:

-   Monocromáticos
-   Tamanho entre 18px e 24px
-   Mesmo estilo em toda a aplicação

------------------------------------------------------------------------

# Mensagens

Sucesso: Operação realizada com sucesso.

Erro: Não foi possível concluir a operação.

Aviso: Verifique as informações antes de continuar.

Informação: Dados atualizados.

------------------------------------------------------------------------

# Espaçamento

Grid base: 8px

Margem externa padrão: 24px

Espaçamento entre componentes: 16px

------------------------------------------------------------------------

# Critérios de Aceite

Todos os elementos visuais devem seguir esta especificação, garantindo
consistência em todas as telas da aplicação.
