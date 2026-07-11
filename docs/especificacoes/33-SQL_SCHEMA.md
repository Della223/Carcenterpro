# 33-SQL_SCHEMA.md

# Esquema SQL de Referência

## Objetivo

Este documento define a estrutura SQL de referência para implementação
do banco PostgreSQL do CarCenter PRO Finance. Ele serve como guia para
criação das migrations utilizando Drizzle ORM.

------------------------------------------------------------------------

# Convenções

-   Chaves primárias: UUID
-   Datas: timestamptz
-   Valores monetários: numeric(14,2)
-   Charset: UTF-8
-   Timezone: America/Sao_Paulo
-   Todas as tabelas transacionais possuem created_at, updated_at e
    created_by.

------------------------------------------------------------------------

# Tabela: users

``` sql
id UUID PRIMARY KEY
name VARCHAR(100) NOT NULL
email VARCHAR(255) UNIQUE NOT NULL
active BOOLEAN NOT NULL DEFAULT TRUE
created_at TIMESTAMPTZ NOT NULL
updated_at TIMESTAMPTZ NOT NULL
```

------------------------------------------------------------------------

# Tabela: revenue_categories

``` sql
id UUID PRIMARY KEY
name VARCHAR(100) UNIQUE NOT NULL
active BOOLEAN NOT NULL DEFAULT TRUE
```

------------------------------------------------------------------------

# Tabela: revenues

``` sql
id UUID PRIMARY KEY
revenue_date DATE NOT NULL
category_id UUID REFERENCES revenue_categories(id)
quantity INTEGER NOT NULL CHECK(quantity >= 0)
amount NUMERIC(14,2) NOT NULL CHECK(amount > 0)
notes TEXT
created_by UUID REFERENCES users(id)
created_at TIMESTAMPTZ NOT NULL
updated_at TIMESTAMPTZ NOT NULL
```

Índices: - revenue_date - category_id

------------------------------------------------------------------------

# Tabela: expense_categories

``` sql
id UUID PRIMARY KEY
name VARCHAR(100) UNIQUE NOT NULL
active BOOLEAN NOT NULL DEFAULT TRUE
```

------------------------------------------------------------------------

# Tabela: expense_subcategories

``` sql
id UUID PRIMARY KEY
category_id UUID REFERENCES expense_categories(id)
name VARCHAR(100) NOT NULL
active BOOLEAN NOT NULL DEFAULT TRUE
UNIQUE(category_id,name)
```

------------------------------------------------------------------------

# Tabela: cost_centers

``` sql
id UUID PRIMARY KEY
name VARCHAR(100) UNIQUE NOT NULL
active BOOLEAN NOT NULL DEFAULT TRUE
```

------------------------------------------------------------------------

# Tabela: expenses

``` sql
id UUID PRIMARY KEY
competence_month SMALLINT NOT NULL
competence_year SMALLINT NOT NULL
supplier VARCHAR(150) NOT NULL
category_id UUID REFERENCES expense_categories(id)
subcategory_id UUID REFERENCES expense_subcategories(id)
cost_center_id UUID REFERENCES cost_centers(id)
description TEXT NOT NULL
total_amount NUMERIC(14,2) NOT NULL
installment_count INTEGER NOT NULL
appropriation_type VARCHAR(30)
notes TEXT
created_by UUID REFERENCES users(id)
created_at TIMESTAMPTZ NOT NULL
updated_at TIMESTAMPTZ NOT NULL
```

------------------------------------------------------------------------

# Tabela: expense_installments

``` sql
id UUID PRIMARY KEY
expense_id UUID REFERENCES expenses(id)
installment_number INTEGER NOT NULL
due_date DATE NOT NULL
amount NUMERIC(14,2) NOT NULL
paid BOOLEAN NOT NULL DEFAULT FALSE
payment_date DATE
payment_method VARCHAR(50)
```

Índices: - expense_id - due_date - paid

------------------------------------------------------------------------

# Tabela: budgets

``` sql
id UUID PRIMARY KEY
year INTEGER NOT NULL
category_id UUID REFERENCES expense_categories(id)
planned_amount NUMERIC(14,2) NOT NULL
UNIQUE(year, category_id)
```

------------------------------------------------------------------------

# Tabela: marketing_posts

``` sql
id UUID PRIMARY KEY
post_type VARCHAR(20) NOT NULL
reference_date DATE NOT NULL
published BOOLEAN NOT NULL DEFAULT FALSE
published_by UUID REFERENCES users(id)
published_at TIMESTAMPTZ
```

------------------------------------------------------------------------

# Tabela: audit_logs

``` sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
module VARCHAR(50) NOT NULL
operation VARCHAR(20) NOT NULL
record_id UUID
old_value JSONB
new_value JSONB
created_at TIMESTAMPTZ NOT NULL
```

------------------------------------------------------------------------

# Integridade

-   Utilizar foreign keys em todos os relacionamentos.
-   Não permitir exclusão física de dados financeiros.
-   Registrar auditoria em INSERT, UPDATE e exclusão lógica.

------------------------------------------------------------------------

# Versionamento

-   Uma migration por alteração estrutural.
-   Nunca editar migrations publicadas.
-   Nome sugerido: YYYYMMDDHHMM_descricao.sql

------------------------------------------------------------------------

# Critérios de Aceite

-   Banco criado sem erros.
-   Todas as constraints válidas.
-   Índices implementados.
-   Relacionamentos íntegros.
-   Compatível com PostgreSQL e Drizzle ORM.
