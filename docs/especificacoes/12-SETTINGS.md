# 12-SETTINGS.md

# Módulo Configurações

## Objetivo

Centralizar todos os parâmetros administrativos do sistema, permitindo
manutenção dos cadastros utilizados pelos demais módulos sem necessidade
de alterar código.

------------------------------------------------------------------------

# Princípios

-   Alterações devem refletir imediatamente em todo o sistema.
-   Configurações não alteram dados históricos.
-   Toda alteração deve ser auditada.

------------------------------------------------------------------------

# Cadastros

## Categorias de Receita

Permitir: - Criar - Editar - Desativar

Categorias iniciais: - Peças Localiza - Peças Particular - Pneus
Localiza - Pneus Particular - Serviços Localiza - Serviços Particular -
Geometria e Balanceamento Localiza - Geometria e Balanceamento
Particular

------------------------------------------------------------------------

## Categorias de Despesa

-   Vendas
-   Administrativas
-   Pessoal
-   Geral
-   Marketing
-   Aluguel
-   IPTU

------------------------------------------------------------------------

## Subcategorias

Cada subcategoria pertence obrigatoriamente a uma categoria de despesa.

Campos: - Nome - Categoria - Ativa

------------------------------------------------------------------------

## Centros de Custo

Cadastros iniciais:

-   Operacional
-   Administrativo
-   Estrutura / Predial

------------------------------------------------------------------------

## Competência

Configurações:

-   Competência aberta
-   Competência padrão ao abrir o sistema
-   Bloqueio de competências encerradas (preparado para versões futuras)

------------------------------------------------------------------------

## Sistema

Parâmetros:

-   Nome da empresa
-   Logotipo
-   Moeda (R\$)
-   Fuso horário
-   Idioma (Português Brasil)

------------------------------------------------------------------------

## Marketing

Parâmetros iniciais:

Story: - Segunda a Sexta - Horário sugerido: 12:00

Feed: - Terça e Quinta - Horário sugerido: 19:00

------------------------------------------------------------------------

## Auditoria

Registrar:

-   Usuário
-   Data
-   Hora
-   Configuração alterada
-   Valor anterior
-   Novo valor

------------------------------------------------------------------------

# Restrições

-   Não permitir exclusão de categorias utilizadas.
-   Não permitir exclusão de centros de custo utilizados.
-   Utilizar desativação para registros em uso.

------------------------------------------------------------------------

# Mensagens

Sucesso: "Configuração salva com sucesso."

Erro: "Não foi possível salvar a configuração."

------------------------------------------------------------------------

# Critérios de Aceite

-   Cadastros disponíveis.
-   Alterações refletidas imediatamente.
-   Auditoria registrada.
-   Integridade dos dados preservada.
