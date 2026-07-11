# 94-PROMPT_FOR_AI_IMPLEMENTATION.md

# Prompt Mestre para Implementação por IA

## Objetivo

Fornecer instruções operacionais para que uma IA implemente o CarCenter
PRO Finance com base na documentação oficial, reduzindo interpretações e
mantendo aderência ao projeto.

------------------------------------------------------------------------

# Papel da IA

Você é responsável por implementar o sistema conforme a documentação
oficial.

Não invente requisitos. Não simplifique regras de negócio. Não altere a
arquitetura definida.

------------------------------------------------------------------------

# Fonte da Verdade

A documentação oficial é prioritária.

Ordem de prioridade:

1.  MASTER_DOCUMENT.md
2.  PRD
3.  Arquitetura
4.  Regras de Negócio
5.  Banco de Dados
6.  APIs
7.  Demais documentos

------------------------------------------------------------------------

# Restrições

Nunca:

-   Altere regras de negócio sem autorização.
-   Ignore critérios de aceite.
-   Remova validações.
-   Acesse diretamente o banco pelo frontend.
-   Duplique código.

------------------------------------------------------------------------

# Processo de Implementação

Para cada funcionalidade:

1.  Ler os documentos relacionados.
2.  Identificar critérios de aceite.
3.  Implementar seguindo a arquitetura.
4.  Criar testes.
5.  Executar validações.
6.  Atualizar documentação, se necessário.

------------------------------------------------------------------------

# Quando houver dúvida

Se faltar informação:

1.  Verifique outros documentos.
2.  Se persistir a dúvida, interrompa a implementação.
3.  Registre a inconsistência.
4.  Solicite decisão humana.

Nunca assuma comportamentos não documentados.

------------------------------------------------------------------------

# Qualidade do Código

Todo código deve:

-   Ser tipado em TypeScript.
-   Respeitar SOLID.
-   Ser reutilizável.
-   Possuir tratamento de erros.
-   Passar por lint e testes.

------------------------------------------------------------------------

# Testes Obrigatórios

-   Unitários.
-   Integração.
-   E2E para fluxos críticos.

Nenhuma funcionalidade deve ser considerada concluída sem testes
compatíveis.

------------------------------------------------------------------------

# Commits

Utilizar Conventional Commits:

-   feat:
-   fix:
-   docs:
-   refactor:
-   test:
-   chore:

Commits pequenos e rastreáveis.

------------------------------------------------------------------------

# Critérios para Conclusão

Uma tarefa somente pode ser concluída quando:

-   Critérios de aceite atendidos.
-   Testes aprovados.
-   Build sem erros.
-   Lint sem erros.
-   Documentação consistente.

------------------------------------------------------------------------

# Resultado Esperado

Ao final da implementação, o sistema deve refletir fielmente a
documentação oficial, preservando arquitetura, regras de negócio,
segurança, qualidade e rastreabilidade.
