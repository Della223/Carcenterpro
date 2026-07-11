# 59-SCREEN_SETTINGS_DETAILED.md

# Especificação Detalhada da Tela Configurações

## Objetivo

O módulo **Configurações** concentra todos os cadastros mestres e
parâmetros do sistema. Alterações realizadas aqui impactam imediatamente
os demais módulos.

------------------------------------------------------------------------

# Layout Geral

``` text
+--------------------------------------------------------------------------------------+
| Cabeçalho                                                                            |
+---------+----------------------------------------------------------------------------+
| Menu    | Menu Interno                                                              |
| Lateral |----------------------------------------------------------------------------|
|         | Categorias | Subcategorias | Centros de Custo | Competência | Sistema     |
|         |----------------------------------------------------------------------------|
|         | Barra de ações                                                            |
|         |----------------------------------------------------------------------------|
|         | Grade / Formulário                                                        |
+---------+----------------------------------------------------------------------------+
```

------------------------------------------------------------------------

# Menu Interno

Seções:

-   Categorias de Receita
-   Categorias de Despesa
-   Subcategorias
-   Centros de Custo
-   Competência
-   Marketing
-   Parâmetros do Sistema

A troca entre seções não deve recarregar a aplicação.

------------------------------------------------------------------------

# Barra de Ações

Botões:

-   Novo
-   Editar
-   Excluir
-   Ativar/Inativar
-   Exportar

Todos respeitam as permissões do usuário.

------------------------------------------------------------------------

# Categorias

Campos:

-   Nome
-   Tipo (Receita/Despesa)
-   Status (Ativa/Inativa)

Regras:

-   Nome único por tipo.
-   Não excluir categorias vinculadas.
-   Categorias inativas não podem ser usadas em novos lançamentos.

------------------------------------------------------------------------

# Subcategorias

Campos:

-   Categoria
-   Nome
-   Status

Regras:

-   Devem pertencer a uma categoria existente.
-   Nome único dentro da categoria.

------------------------------------------------------------------------

# Centros de Custo

Campos:

-   Nome
-   Código (opcional)
-   Status

Regras:

-   Nome único.
-   Não excluir centros utilizados.

------------------------------------------------------------------------

# Competência

Permitir:

-   Abrir competência
-   Encerrar competência
-   Definir competência ativa

Regras:

-   Apenas uma competência ativa por vez.
-   Encerramento registra auditoria.

------------------------------------------------------------------------

# Marketing

Configurações:

-   Horário sugerido para Story
-   Horário sugerido para Feed
-   Ativar lembretes

------------------------------------------------------------------------

# Parâmetros do Sistema

Exibir:

-   Nome da empresa
-   Moeda (BRL)
-   Fuso horário
-   Versão do sistema

Versão 1.0:

Somente visualização, exceto campos explicitamente configuráveis.

------------------------------------------------------------------------

# Auditoria

Toda alteração deve registrar:

-   Usuário
-   Data/Hora
-   Seção
-   Operação
-   Valores anteriores
-   Valores atuais

------------------------------------------------------------------------

# Atualizações Automáticas

Alterações devem atualizar imediatamente:

-   HOME
-   Comercial
-   Despesas
-   Dashboard
-   DRE
-   Orçamentos
-   Relatórios

quando houver dependência.

------------------------------------------------------------------------

# Estados

Loading: Skeleton.

Empty: "Nenhum registro encontrado."

Error: Mensagem amigável com botão "Tentar novamente".

------------------------------------------------------------------------

# Performance

Consultas inferiores a 2 segundos. Atualizações inferiores a 2 segundos.

------------------------------------------------------------------------

# Critérios de Aceite

-   CRUD completo para cadastros permitidos.
-   Restrições de exclusão respeitadas.
-   Auditoria obrigatória.
-   Atualizações propagadas aos módulos dependentes.
-   Interface consistente com o Design System.
