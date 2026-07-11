# 93-AI_DEVELOPMENT_GUIDE.md

# Guia de Desenvolvimento Assistido por IA

## Objetivo

Definir como uma Inteligência Artificial deve interpretar, priorizar e
implementar o CarCenter PRO Finance a partir da documentação oficial do
projeto, garantindo consistência, previsibilidade e conformidade
arquitetural.

------------------------------------------------------------------------

# Princípios

-   A documentação é a fonte única da verdade.
-   Nenhuma decisão arquitetural deve ser tomada sem respaldo
    documental.
-   Em caso de conflito, prevalece o documento mais específico.
-   Nunca implementar funcionalidades não especificadas.

------------------------------------------------------------------------

# Ordem de Leitura da Documentação

A IA deve consumir a documentação nesta ordem:

1.  MASTER_DOCUMENT.md (quando disponível)
2.  PRD
3.  Arquitetura
4.  Modelo de Dados
5.  Regras de Negócio
6.  APIs
7.  Frontend
8.  Backend
9.  Testes
10. Operação

Somente após compreender toda a documentação a implementação poderá
iniciar.

------------------------------------------------------------------------

# Ordem de Implementação

1.  Estrutura do projeto
2.  Configurações
3.  Banco de dados
4.  Autenticação
5.  Componentes reutilizáveis
6.  Layout
7.  Módulos
8.  Dashboard
9.  DRE
10. Relatórios
11. Testes
12. Otimizações

------------------------------------------------------------------------

# Regras Obrigatórias

A IA deve:

-   Utilizar TypeScript em modo strict.
-   Respeitar a arquitetura em camadas.
-   Centralizar regras de negócio em Services.
-   Nunca acessar o banco diretamente pelo frontend.
-   Criar código reutilizável.
-   Evitar duplicação.

------------------------------------------------------------------------

# Tratamento de Conflitos

Caso encontre divergências entre documentos:

1.  Interromper a implementação.
2.  Registrar a inconsistência.
3.  Solicitar validação humana.
4.  Não assumir comportamento por conta própria.

------------------------------------------------------------------------

# Geração de Código

Todo código deve:

-   Ser tipado.
-   Ser modular.
-   Possuir tratamento de erros.
-   Seguir convenções do projeto.
-   Ser compatível com ESLint e Prettier.

------------------------------------------------------------------------

# Estratégia de Testes

Cada funcionalidade implementada deve incluir:

-   Testes unitários.
-   Testes de integração quando aplicável.
-   Testes E2E para fluxos críticos.

------------------------------------------------------------------------

# Estratégia de Commits

Commits devem ser pequenos e rastreáveis.

Padrão recomendado:

-   feat:
-   fix:
-   refactor:
-   docs:
-   test:
-   chore:

------------------------------------------------------------------------

# Checklist Antes de Concluir uma Tarefa

-   Implementação concluída.
-   Testes aprovados.
-   Sem erros de lint.
-   Sem erros de TypeScript.
-   Documentação atualizada quando necessário.
-   Critérios de aceite atendidos.

------------------------------------------------------------------------

# Critérios de Aceite

-   IA segue a documentação como referência principal.
-   Nenhuma decisão implícita é tomada.
-   Código consistente com a arquitetura oficial.
-   Implementação reproduzível e auditável.
