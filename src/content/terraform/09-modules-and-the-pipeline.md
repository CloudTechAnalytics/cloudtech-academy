---
title: Modules and the pipeline
minutes: 20
summary: Package repeated infrastructure as modules with pinned versions, and design the pull request pipeline (format, validate, plan, policy checks, review and apply) that turns everything in this course into the everyday way of working.
---

## The problem

Tallybook's web, API and worker servers are three copies of nearly the same code. When the team added encrypted disks, they changed two of the three and forgot the third. And until now, anyone with credentials could run `terraform apply` from their own laptop, with whatever version of the code they happened to have.

Two practices fix this: **modules**, so shared patterns are written once, and a **pipeline**, so every change follows the same safe path.

## The concept

**Modules**

A module is a folder of Terraform code with inputs (variables) and outputs, used like a function:

```hcl
module "api" {
  source = "./modules/server-group"

  name          = "api"
  instance_type = var.api_instance_type
  server_count  = var.api_count
  tags          = local.common_tags
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.13.0"
  # ...
}
```

**Pin versions** of external modules and providers, so the same code gives the same result next month.

**The pipeline**

| Stage | Runs | Fails the PR when |
| :-- | :-- | :-- |
| `terraform fmt -check` | every push | files aren't formatted |
| `terraform validate` | every push | code is invalid |
| `terraform plan` | every push | plan errors; the plan is posted on the PR |
| Policy checks (lesson 7) | every plan | a BLOCK policy is violated |
| Review | people | a reviewer requests changes |
| `terraform apply` | after merge, from the pipeline only | apply errors |

Only the pipeline has permission to apply. People review; the pipeline acts.

## Example

How much repetition is in Tallybook's servers? Compare the attribute names and the settings that vary across the four server groups in state:

```python
import json
from urllib.request import urlopen

import pandas as pd

with urlopen("https://academy.cloudtechanalytics.com/datasets/terraform/terraform.tfstate") as f:
    state = json.load(f)

rows = []
for r in state["resources"]:
    if r["type"] == "aws_instance":
        a = r["instances"][0]["attributes"]
        rows.append({"group": r["name"], "servers": len(r["instances"]), "instance_type": a["instance_type"],
                     "ami": a["ami"], "encrypted_disk": a["root_block_device"][0]["encrypted"], "attributes": len(a)})
pd.DataFrame(rows)
```

```text
group  servers instance_type                    ami  encrypted_disk  attributes
0      web        6     m5.xlarge  ami-0a1b2c3d4e5f60718            True           7
1      api        4    m5.2xlarge  ami-0a1b2c3d4e5f60718            True           7
2   worker        3     m5.xlarge  ami-0a1b2c3d4e5f60718            True           7
3  staging        6     t3.medium  ami-0a1b2c3d4e5f60718            True           7
```

Same AMI, same attributes, same disk settings: four groups differing only in name, count, size and tags. That's exactly what a `server-group` module's inputs would be, and a fix such as disk encryption would then be made once.

## Walkthrough

1. Run the cell. List the module's inputs and outputs you'd need for these four groups.
2. Which stage of the pipeline would have caught each of the six PRs' problems?
3. Who at Tallybook should be able to approve infrastructure PRs, and who should be able to apply?
4. Write the pipeline definition in plain language (the task below).

## Practice

```answer
{
  "id": "iac-09-p1",
  "prompt": "How many servers are in the four `aws_instance` groups together?",
  "answer": 19,
  "format": "number",
  "pyVerify": "sum(len(r['instances']) for r in state['resources'] if r['type'] == 'aws_instance')",
  "hint": "Add up the servers column.",
  "required": true
}
```

```task
{
  "id": "iac-09-t1",
  "prompt": "Describe Tallybook's **infrastructure pipeline**, one numbered stage per line, from opening a pull request to the change being live: at least **six** stages, including **fmt/validate**, **plan**, **policy checks**, **review** (who), **apply** (by what) and what happens if apply **fails**.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "1. On every push, ...",
  "rules": [
    { "label": "At least six numbered stages", "pattern": "^\\s*\\d+[.)]\\s+\\S", "min": 6 },
    { "label": "fmt or validate", "pattern": "fmt|validate" },
    { "label": "plan posted to the PR", "pattern": "plan" },
    { "label": "policy checks", "pattern": "polic" },
    { "label": "review by named roles", "pattern": "review[^\\n]*(lead|engineer|platform|senior|owner)" },
    { "label": "apply by the pipeline only", "pattern": "apply[^\\n]*(pipeline|ci|automat)|(pipeline|ci)[^\\n]*apply" },
    { "label": "a failed apply", "pattern": "fail" }
  ],
  "sample": "1. On every push to a pull request, the pipeline runs terraform fmt -check and terraform validate.\n2. It runs terraform plan for each affected environment and posts the plan summary and full plan on the pull request.\n3. It runs the policy checks on the plan JSON; any BLOCK violation fails the PR, and WARN violations request a senior reviewer.\n4. A platform engineer reviews the plan; changes to production databases or networking also need the platform lead.\n5. After merge, the pipeline applies the saved plan to staging, runs smoke tests, then applies to production; only the pipeline has apply permissions.\n6. If an apply fails, the pipeline stops, alerts the platform channel, and the on-call engineer fixes it with a new pull request rather than by hand.",
  "note": "Applying the saved plan, not a fresh one, guarantees that what was reviewed is what runs.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why pin a module's version?",
    "options": ["It's faster", "So the same code produces the same infrastructure later, even if the module changes", "To save money", "Pinning is required"],
    "answer": 1,
    "explanation": "Unpinned modules can change under you."
  },
  {
    "prompt": "Who should run terraform apply in production?",
    "options": ["Any engineer from their laptop", "Only the pipeline, after review", "The CTO only", "Nobody"],
    "answer": 1,
    "explanation": "People review; the pipeline acts."
  },
  {
    "prompt": "What problem do modules solve?",
    "options": ["Slow plans", "Repeated code drifting apart, by writing a shared pattern once", "State locking", "Secrets"],
    "answer": 1,
    "explanation": "Fix it once, everywhere."
  }
]
```
