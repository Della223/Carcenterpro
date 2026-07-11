# 37-NON_FUNCTIONAL_REQUIREMENTS.md

# Requisitos Não Funcionais

## Objetivo

Definir os requisitos de qualidade do CarCenter PRO Finance,
complementando os requisitos funcionais já documentados.

------------------------------------------------------------------------

# Desempenho

-   HOME: carregamento inferior a 2 segundos.
-   Dashboard: carregamento inferior a 3 segundos.
-   Consultas paginadas.
-   Operações de gravação concluídas em até 2 segundos em condições
    normais.

------------------------------------------------------------------------

# Escalabilidade

-   Arquitetura preparada para múltiplas empresas (multi-tenant em
    versão futura).
-   Componentes reutilizáveis.
-   Banco preparado para crescimento de dados sem alteração estrutural.

------------------------------------------------------------------------

# Disponibilidade

Meta mínima:

-   99,5% de disponibilidade mensal.

Paradas programadas deverão ocorrer fora do horário comercial.

------------------------------------------------------------------------

# Confiabilidade

-   Nenhuma perda de dados em operações confirmadas.
-   Operações financeiras devem ser transacionais.
-   Rollback automático em caso de falha.

------------------------------------------------------------------------

# Segurança

-   HTTPS obrigatório.
-   JWT para autenticação.
-   RLS habilitado.
-   Auditoria em todas as operações de escrita.
-   Dados sensíveis protegidos por variáveis de ambiente.

------------------------------------------------------------------------

# Usabilidade

-   Interface em Português (Brasil).
-   Fluxos intuitivos.
-   Máximo recomendado de 3 cliques para operações frequentes.
-   Feedback visual para todas as ações.

------------------------------------------------------------------------

# Compatibilidade

Navegadores suportados:

-   Google Chrome (últimas versões)
-   Microsoft Edge (últimas versões)
-   Mozilla Firefox (últimas versões)

Safari poderá ser homologado futuramente.

------------------------------------------------------------------------

# Responsividade

Prioridade:

1.  Desktop
2.  Notebook
3.  Tablet

Celulares não fazem parte da versão 1.0.

------------------------------------------------------------------------

# Observabilidade

Registrar:

-   Logs de erro.
-   Logs de autenticação.
-   Logs de auditoria.
-   Tempo de resposta das principais operações.

------------------------------------------------------------------------

# Manutenibilidade

-   Código modular.
-   Baixo acoplamento.
-   Alta coesão.
-   Cobertura de testes para funcionalidades críticas.
-   Documentação sincronizada com a implementação.

------------------------------------------------------------------------

# Backup e Recuperação

-   Backup diário do banco.
-   Retenção mínima de 30 dias.
-   Procedimento de restauração documentado e testado.

------------------------------------------------------------------------

# Internacionalização

Versão 1.0:

-   Interface exclusivamente em Português (Brasil).

Arquitetura preparada para múltiplos idiomas em versões futuras.

------------------------------------------------------------------------

# Critérios de Aceite

-   Todos os requisitos deste documento devem ser considerados durante o
    desenvolvimento, testes e homologação.
-   Nenhum requisito funcional poderá comprometer os requisitos de
    qualidade aqui definidos.
