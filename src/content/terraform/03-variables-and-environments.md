---
title: Variables and environments
minutes: 25
summary: Use variables, variable files, locals and outputs so one set of code builds both staging and production, and compare the two environments to see where they differ and what each costs.
---

## The problem

Tallybook's staging environment is meant to be a smaller copy of production, so releases can be tested safely before customers see them. But when the two are built by hand, they drift apart, and a release that worked in staging fails in production for reasons nobody can see.

With Terraform, the same code builds both environments. Only the **variables** differ: how many servers, what size, how long backups are kept. Those differences are written down in two small files that anyone can compare.

## The concept

**Variables**

```hcl
variable "api_count" {
  type        = number
  description = "Number of API servers"
}

variable "api_instance_type" {
  type    = string
  default = "t3.medium"
}

resource "aws_instance" "api" {
  count         = var.api_count
  instance_type = var.api_instance_type
  # ...
}
```

Values come from a **variable file** per environment, such as `production.tfvars.json`, passed with `terraform plan -var-file=production.tfvars.json`.

**Locals and outputs**

```hcl
locals {
  common_tags = {
    environment = var.environment
    managed_by  = "terraform"
  }
}

output "db_endpoint" {
  value = aws_db_instance.main.endpoint
}
```

`locals` name values used in several places; `output` publishes values for people or other code (like the database's address).

**What should differ between environments**

Size and count (staging can be smaller), and things that only matter for real customers (multi-zone databases, long backup retention). What should **not** differ: software versions, security rules and the shape of the system, or staging stops being a useful test.

## Example

Compare the two variable files side by side:

```python
import json
from urllib.request import urlopen

import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/terraform/"
def load(name):
    with urlopen(base + name) as f:
        return json.load(f)

envs = pd.DataFrame({"staging": load("staging.tfvars.json"), "production": load("production.tfvars.json")})
envs["same"] = envs["staging"] == envs["production"]
envs
```

```text
staging     production   same
environment                    staging     production  False
web_min_size                         1              2  False
web_max_size                         2             16  False
api_count                            2              4  False
api_instance_type            t3.medium     m5.2xlarge  False
worker_count                         1              3  False
worker_instance_type         t3.medium      m5.xlarge  False
db_instance_class         db.m5.xlarge  db.m5.2xlarge  False
db_multi_az                      False          False   True
db_backup_retention_days             1              7  False
```

Staging is smaller everywhere, as it should be. One value stands out: production's database has `db_multi_az` false. The cloud course showed the single-zone database caused the two longest outages. Now estimate each environment's monthly server cost from these variables, with illustrative prices per hour:

```python
PRICE = {"t3.medium": 0.05, "m5.xlarge": 0.10, "m5.2xlarge": 0.20, "db.m5.xlarge": 0.23, "db.m5.2xlarge": 0.45}   # illustrative, $ per hour
HOURS = 730

def monthly_cost(v, web_type="m5.xlarge"):
    servers = (v["web_min_size"] * PRICE[web_type]
               + v["api_count"] * PRICE[v["api_instance_type"]]
               + v["worker_count"] * PRICE[v["worker_instance_type"]])
    database = PRICE[v["db_instance_class"]] * (2 if v["db_multi_az"] else 1)
    return round((servers + database) * HOURS, 2)

for env in ["staging", "production"]:
    print(env, "$", monthly_cost(load(f"{env}.tfvars.json")), "a month at minimum web size")

prod_multi_az = {**load("production.tfvars.json"), "db_multi_az": True}
print("production with a multi-zone database: $", monthly_cost(prod_multi_az))
```

```text
staging $ 350.4 a month at minimum web size
production $ 1277.5 a month at minimum web size
production with a multi-zone database: $ 1606.0
```

Turning on multi-zone doubles the database's cost (the standby copy runs all the time). That's the price of fixing the biggest cause of downtime, and it's a single changed value in one reviewed file.

## Walkthrough

1. Run the cells. Which values would you change in staging to make it a better test of production?
2. Write a `variable` block for `db_multi_az` with a type, a description and a safe default.
3. Use `monthly_cost` to price production with the API servers rightsized to `m5.xlarge`.
4. Write the `locals` block for common tags (the task below).

## Practice

```answer
{
  "id": "iac-03-p1",
  "prompt": "What is production's estimated monthly cost (minimum web size, single-zone database), in dollars? Two decimal places.",
  "answer": 1277.5,
  "tolerance": 0.01,
  "format": "number",
  "pyVerify": "monthly_cost(load('production.tfvars.json'))",
  "hint": "The production line.",
  "required": true
}
```

```task
{
  "id": "iac-03-t1",
  "prompt": "Write a **variable** block for `db_multi_az` (type, description, default) and a **locals** block named `common_tags` with `environment` (from a variable), `team` and `managed_by = \"terraform\"`.",
  "minutes": 6,
  "rows": 14,
  "placeholder": "variable \"db_multi_az\" {\n  ...",
  "rules": [
    { "label": "A variable block for db_multi_az", "pattern": "variable\\s+\"db_multi_az\"\\s*\\{" },
    { "label": "type = bool", "pattern": "type\\s*=\\s*bool" },
    { "label": "A description", "pattern": "description\\s*=\\s*\"[^\"]{10,}\"" },
    { "label": "A default", "pattern": "default\\s*=\\s*(true|false)" },
    { "label": "A locals block with common_tags", "pattern": "locals\\s*\\{[\\s\\S]*common_tags\\s*=\\s*\\{" },
    { "label": "environment from a variable", "pattern": "environment\\s*=\\s*var\\.environment" },
    { "label": "managed_by = \"terraform\"", "pattern": "managed_by\\s*=\\s*\"terraform\"" }
  ],
  "sample": "variable \"db_multi_az\" {\n  type        = bool\n  description = \"Run a standby copy of the database in a second zone\"\n  default     = true\n}\n\nlocals {\n  common_tags = {\n    environment = var.environment\n    team        = \"platform\"\n    managed_by  = \"terraform\"\n  }\n}",
  "note": "A default of true means a new environment is resilient unless someone deliberately turns it off, which is the safer way round.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "How do staging and production differ when built with the same Terraform code?",
    "options": ["They use different code", "Only in their variable values", "They can't be built with the same code", "In their providers"],
    "answer": 1,
    "explanation": "Same code, different variables."
  },
  {
    "prompt": "Which should be the same in staging and production?",
    "options": ["Number of servers", "Software versions and security rules", "Backup retention", "Database size"],
    "answer": 1,
    "explanation": "Otherwise staging stops testing what production runs."
  },
  {
    "prompt": "What is an output for?",
    "options": ["Logging errors", "Publishing a value, such as a database address, for people or other code", "Deleting resources", "Setting prices"],
    "answer": 1,
    "explanation": "Outputs expose values after apply."
  }
]
```
