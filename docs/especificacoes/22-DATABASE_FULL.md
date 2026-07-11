# 22-DATABASE_FULL.md

# Especificação Completa do Banco de Dados

## Objetivo

Definir a implementação do banco PostgreSQL do CarCenter PRO Finance.

------------------------------------------------------------------------

# Convenções

-   UUID para todas as chaves primárias.
-   snake_case para tabelas e colunas.
-   created_at e updated_at obrigatórios.
-   created_by obrigatório para tabelas transacionais.
-   Soft delete utilizando active quando aplicável.

------------------------------------------------------------------------

# users

  Campo        Tipo SQL       Obrigatório   Observações
  ------------ -------------- ------------- -----------------
  id           uuid           Sim           PK
  name         varchar(100)   Sim           Nome do usuário
  email        varchar(255)   Sim           Único
  active       boolean        Sim           Default true
  created_at   timestamptz    Sim           
  updated_at   timestamptz    Sim           

Índices: - email (UNIQUE)

------------------------------------------------------------------------

# revenue_categories

id uuid PK

name varchar(100) UNIQUE

active boolean

------------------------------------------------------------------------

# revenues

  Campo          Tipo
  -------------- ----------------------------
  id             uuid
  revenue_date   date
  category_id    uuid FK revenue_categories
  quantity       integer
  amount         numeric(14,2)
  notes          text
  created_by     uuid FK users
  created_at     timestamptz
  updated_at     timestamptz

Índices: - revenue_date - category_id

Constraints: - amount \> 0 - quantity \>= 0

------------------------------------------------------------------------

# expense_categories

id uuid

name varchar(100)

active boolean

------------------------------------------------------------------------

# expense_subcategories

id uuid

category_id uuid FK expense_categories

name varchar(100)

active boolean

Constraint: (category_id,name) UNIQUE

------------------------------------------------------------------------

# cost_centers

id uuid

name varchar(100)

active boolean

------------------------------------------------------------------------

# expenses

id uuid

competence_month smallint

competence_year smallint

supplier varchar(150)

category_id uuid

subcategory_id uuid

cost_center_id uuid

description text

total_amount numeric(14,2)

installment_count integer

appropriation_type varchar(30)

notes text

created_by uuid

created_at timestamptz

updated_at timestamptz

Constraints:

-   total_amount \> 0
-   installment_count \>= 1

------------------------------------------------------------------------

# expense_installments

id uuid

expense_id uuid FK expenses

installment_number integer

due_date date

amount numeric(14,2)

paid boolean

payment_date date

payment_method varchar(50)

Indexes:

expense_id

due_date

paid

------------------------------------------------------------------------

# budgets

id uuid

year integer

category_id uuid

planned_amount numeric(14,2)

Constraint:

(year,category_id) UNIQUE

------------------------------------------------------------------------

# marketing_posts

id uuid

post_type varchar(20)

reference_date date

published boolean

published_by uuid

published_at timestamptz

------------------------------------------------------------------------

# audit_logs

id uuid

user_id uuid

module varchar(50)

operation varchar(20)

record_id uuid

old_value jsonb

new_value jsonb

created_at timestamptz

------------------------------------------------------------------------

# Relacionamentos

users -\> revenues

users -\> expenses

users -\> marketing_posts

users -\> audit_logs

expense_categories -\> expense_subcategories

expense_categories -\> expenses

expense_categories -\> budgets

expense_subcategories -\> expenses

cost_centers -\> expenses

expenses -\> expense_installments

------------------------------------------------------------------------

# Row Level Security

Todas as tabelas transacionais deverão possuir políticas RLS
habilitadas.

Usuários autenticados podem:

-   Ler registros.
-   Inserir registros.
-   Atualizar registros.

Exclusão física proibida para dados financeiros.

------------------------------------------------------------------------

# Auditoria

Toda operação INSERT, UPDATE e DELETE lógico deverá gerar registro em
audit_logs.

------------------------------------------------------------------------

# Migrações

Utilizar Drizzle ORM.

Cada alteração estrutural deverá possuir migration versionada.

Nunca alterar migrations antigas.

Criar novas migrations incrementais.

------------------------------------------------------------------------

# Critérios de Aceite

Banco criado sem inconsistências.

Integridade referencial preservada.

Índices criados.

Constraints aplicadas.

RLS habilitado.

Auditoria funcional.
