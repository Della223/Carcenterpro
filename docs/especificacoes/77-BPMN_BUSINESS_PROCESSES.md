# 77-BPMN_BUSINESS_PROCESSES.md

# Processos de Negócio (BPMN)

## Objetivo

Documentar os principais processos do CarCenter PRO Finance em formato
compatível com BPMN/Mermaid, padronizando o fluxo operacional do
sistema.

------------------------------------------------------------------------

# BP-001 --- Cadastro de Receita

``` mermaid
flowchart TD
A[Início] --> B[Usuário autenticado]
B --> C[Preenche formulário]
C --> D{Dados válidos?}
D -- Não --> E[Exibir erros]
E --> C
D -- Sim --> F[Salvar receita]
F --> G[Registrar auditoria]
G --> H[Publicar RevenueCreated]
H --> I[Atualizar HOME, Dashboard, DRE]
I --> J[Fim]
```

------------------------------------------------------------------------

# BP-002 --- Cadastro de Despesa

``` mermaid
flowchart TD
A[Início] --> B[Nova despesa]
B --> C[Validar dados]
C --> D{Válido?}
D -- Não --> E[Corrigir]
E --> C
D -- Sim --> F[Salvar despesa]
F --> G[Gerar parcelas]
G --> H[Registrar auditoria]
H --> I[Publicar ExpenseCreated]
I --> J[Fim]
```

------------------------------------------------------------------------

# BP-003 --- Registro de Pagamento

``` mermaid
flowchart TD
A[Selecionar parcela] --> B[Informar pagamento]
B --> C{Pagamento válido?}
C -- Não --> D[Exibir erro]
C -- Sim --> E[Registrar pagamento]
E --> F[Atualizar DRE]
F --> G[Atualizar Dashboard]
G --> H[Registrar auditoria]
H --> I[Fim]
```

------------------------------------------------------------------------

# BP-004 --- Fechamento da Competência

Fluxo:

1.  Validar pendências.
2.  Validar parcelas críticas.
3.  Confirmar encerramento.
4.  Registrar auditoria.
5.  Alterar estado para Encerrada.
6.  Definir próxima competência como ativa.

------------------------------------------------------------------------

# BP-005 --- Geração da DRE

Fluxo:

1.  Consolidar receitas.
2.  Consolidar despesas apropriadas.
3.  Calcular indicadores.
4.  Exibir resultado.
5.  Permitir exportação.

------------------------------------------------------------------------

# BP-006 --- Controle Orçamentário

Fluxo:

1.  Carregar orçamento.
2.  Consolidar realizado.
3.  Comparar valores.
4.  Verificar excesso.
5.  Gerar alertas quando necessário.

------------------------------------------------------------------------

# BP-007 --- Exportação

Fluxo:

1.  Selecionar relatório.
2.  Aplicar filtros.
3.  Escolher formato.
4.  Gerar arquivo.
5.  Registrar auditoria.
6.  Disponibilizar download.

------------------------------------------------------------------------

# BP-008 --- Autenticação

Fluxo:

1.  Informar credenciais.
2.  Validar Supabase Auth.
3.  Criar sessão.
4.  Registrar UserLoggedIn.
5.  Redirecionar HOME.

------------------------------------------------------------------------

# Gateways

Utilizar decisões para:

-   Validação de dados
-   Permissões
-   Confirmações
-   Regras financeiras
-   Estados da competência

------------------------------------------------------------------------

# Eventos

Início: - Ação do usuário - Evento agendado

Fim: - Operação concluída - Erro tratado - Cancelamento

------------------------------------------------------------------------

# Critérios de Aceite

-   Processos representam o fluxo oficial do sistema.
-   Compatíveis com BPMN/Mermaid.
-   Alinhados às regras de negócio, casos de uso e diagramas de
    sequência.
