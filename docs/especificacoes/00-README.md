# ===================================================================

# CarCenter PRO Finance

# Software Engineering Specification (SES)

# Documento: 00-README.md

# Versão: 1.0

# Status: Oficial

# Idioma da Interface: Português (Brasil)

# ===================================================================

# CarCenter PRO Finance

## Visão Geral

CarCenter PRO Finance é um ERP SaaS especializado em Centros
Automotivos.

Foi concebido inicialmente para uso interno da CarCenter, porém toda sua
arquitetura deverá ser escalável para permitir utilização por qualquer
empresa do segmento automotivo.

O sistema deverá substituir controles paralelos realizados em planilhas,
fornecendo uma plataforma única para gestão financeira, comercial e
gerencial.

O foco do software não é apenas controlar receitas e despesas.

Seu principal objetivo é entregar informações confiáveis para tomada de
decisão.

------------------------------------------------------------------------

# Filosofia

O sistema deverá obedecer obrigatoriamente os princípios abaixo.

## 1.

Uma informação nunca deverá ser digitada duas vezes.

Todo dado será cadastrado apenas uma vez.

Todas as demais informações deverão ser calculadas automaticamente.

## 2.

A operação deve ser simples.

Mesmo um usuário sem treinamento deverá conseguir utilizar o sistema.

## 3.

O sistema deverá responder rapidamente.

A experiência deve transmitir leveza.

## 4.

Nenhuma tela deverá apresentar excesso de informações.

Cada módulo deverá mostrar apenas o necessário para execução da tarefa.

## 5.

O Dashboard nunca será utilizado para lançamento de dados.

Ele será exclusivamente analítico.

## 6.

A HOME será operacional.

O Dashboard será analítico.

# Objetivos

-   Centralizar toda operação financeira.
-   Centralizar receitas.
-   Centralizar despesas.
-   Gerar automaticamente a DRE.
-   Gerar automaticamente indicadores.
-   Permitir acompanhamento diário.
-   Auxiliar tomada de decisão.
-   Controlar orçamento.
-   Organizar rotina comercial.
-   Organizar rotina financeira.
-   Organizar rotina de marketing.

# Idioma

Toda interface será desenvolvida em Português (Brasil).

# Usuários

-   Daniel
-   Nicole
-   Carlinhos

Todos possuem exatamente as mesmas permissões.

# Estrutura Geral

-   HOME
-   COMERCIAL
-   DESPESAS
-   DASHBOARD
-   DRE
-   ORÇAMENTOS
-   RELATÓRIOS
-   CONFIGURAÇÕES

# Tecnologias

Frontend: - Next.js - React - TypeScript - Tailwind CSS - shadcn/ui -
React Hook Form - Zod - TanStack Query - TanStack Table - Recharts

Backend: - Supabase

Banco: - PostgreSQL

ORM: - Drizzle ORM

Hospedagem: - Vercel

Storage: - Supabase Storage

Autenticação: - Supabase Auth

# Regra Fundamental

Toda funcionalidade deverá responder à pergunta:

> "Esta funcionalidade ajuda o gestor a tomar melhores decisões?"

Se a resposta for **não**, ela não deverá existir.

# Objetivo Final

Ao término do desenvolvimento, o usuário deverá conseguir administrar
completamente um centro automotivo utilizando apenas esta plataforma.
