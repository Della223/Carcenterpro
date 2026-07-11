# 25-STATE_MACHINE.md

# Máquina de Estados

## Objetivo

Definir todos os estados possíveis da aplicação para garantir
comportamento previsível em todos os módulos.

------------------------------------------------------------------------

# Estados Globais

Todos os módulos devem suportar:

-   Initial
-   Loading
-   Ready
-   Empty
-   Saving
-   Success
-   Error
-   Offline (quando aplicável)

Transições inválidas não devem ser permitidas.

------------------------------------------------------------------------

# Tela

Initial → Loading → Ready

Se não houver dados:

Loading → Empty

Se ocorrer erro:

Loading → Error

------------------------------------------------------------------------

# Formulários

Estados:

-   Idle
-   Editing
-   Validating
-   Saving
-   Saved
-   Error

Fluxo:

Idle → Editing → Validating → Saving → Saved

Em caso de erro:

Saving → Error → Editing

------------------------------------------------------------------------

# Botões

Estados:

Default

Hover

Pressed

Disabled

Loading

Durante Loading:

-   Exibir indicador visual.
-   Bloquear novo clique.

------------------------------------------------------------------------

# Tabelas

Estados:

Loading

Ready

Empty

Error

Ao carregar:

Exibir Skeleton.

Sem dados:

Exibir Empty State.

Erro:

Mensagem amigável e botão "Tentar novamente".

------------------------------------------------------------------------

# Gráficos

Loading

Ready

Empty

Error

Nunca exibir gráfico vazio sem mensagem.

------------------------------------------------------------------------

# Login

Estados:

-   Não autenticado
-   Autenticando
-   Autenticado
-   Sessão expirada
-   Erro

Sessão expirada:

Redirecionar para Login.

------------------------------------------------------------------------

# Dashboard

Sempre:

Loading → Ready

Após alteração de dados:

Refreshing → Ready

Sem bloquear interação desnecessariamente.

------------------------------------------------------------------------

# DRE

Após alteração financeira:

Recalculate → Refresh → Ready

------------------------------------------------------------------------

# Exportação

Estados:

Preparing

Generating

Downloading

Completed

Error

------------------------------------------------------------------------

# Upload (uso futuro)

Ready

Uploading

Completed

Error

Documento preparado para versões futuras.

------------------------------------------------------------------------

# Toast

Success

Warning

Error

Info

Tempo padrão:

4 segundos

------------------------------------------------------------------------

# Modal

Closed

Opening

Opened

Closing

------------------------------------------------------------------------

# Critérios de Aceite

Todos os componentes reutilizáveis devem implementar exclusivamente os
estados definidos neste documento, garantindo comportamento uniforme em
toda a aplicação.
