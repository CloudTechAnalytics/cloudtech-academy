---
title: Reading a plan
minutes: 25
summary: Read a Terraform plan, both as people see it and as the JSON that tools read, summarise what each change will create, update, replace or destroy, and do it for six real pull requests.
---

## The problem

Six pull requests are waiting for review in Tallybook's infrastructure repository. Each has a title and a description written by its author, and a **plan** produced automatically by the pipeline: the list of everything that will happen if it's merged and applied.

The title is what the author **meant** to do. The plan is what **will** happen. Reviewing infrastructure means reading the plan, not the title.

## The concept

**Plan symbols**

| Symbol | Action in JSON | Meaning |
| :-- | :-- | :-- |
| `+` | `["create"]` | create a new resource |
| `~` | `["update"]` | change it in place |
| `-` | `["delete"]` | destroy it |
| `-/+` | `["delete", "create"]` | **replace**: destroy, then create a new one |
| `+/-` | `["create", "delete"]` | replace, creating the new one first |

The summary line counts a replacement as one add **and** one destroy: `Plan: 1 to add, 0 to change, 1 to destroy.`

**Plan JSON**

`terraform show -json plan.out` gives every change as data: the resource's address, the actions, and its attributes `before` and `after`. Review tools and policy checks (lesson 7) read this.

## Example

Load all six plans and summarise each the way Terraform's summary line does:

```python
import json
from urllib.request import urlopen

import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/terraform/"
PRS = ["101-web-autoscaling", "102-rename-database", "103-reporting-access", "104-cost-tags", "105-rightsize-api", "106-multi-az-database"]

def load(name):
    with urlopen(base + name) as f:
        return json.load(f)

plans = {pr: load(f"plan-pr-{pr}.json") for pr in PRS}

def summarise(plan):
    add = change = destroy = 0
    for rc in plan["resource_changes"]:
        actions = rc["change"]["actions"]
        add += "create" in actions
        destroy += "delete" in actions
        change += actions == ["update"]
    return {"add": add, "change": change, "destroy": destroy}

pd.DataFrame({pr: summarise(p) for pr, p in plans.items()}).T
```

```text
add  change  destroy
101-web-autoscaling      4       0        6
102-rename-database      1       0        1
103-reporting-access     1       0        0
104-cost-tags            0      19        0
105-rightsize-api        0       4        0
106-multi-az-database    0       1        0
```

Read across the table before reading any titles. PR 104 changes many resources but adds and destroys nothing: probably low risk. PR 101 destroys six resources. PR 102, "rename database", adds one and destroys one. Look at what exactly:

```python
for pr in ["101-web-autoscaling", "102-rename-database"]:
    print(f"PR {pr}:")
    for rc in plans[pr]["resource_changes"]:
        print("  ", "/".join(rc["change"]["actions"]).ljust(14), rc["address"])
```

```text
PR 101-web-autoscaling:
   create         aws_launch_template.web
   create         aws_autoscaling_group.web
   create         aws_autoscaling_policy.web_cpu
   create         aws_autoscaling_schedule.month_end
   delete         aws_instance.web[0]
   delete         aws_instance.web[1]
   delete         aws_instance.web[2]
   delete         aws_instance.web[3]
   delete         aws_instance.web[4]
   delete         aws_instance.web[5]
PR 102-rename-database:
   delete         aws_db_instance.prod
   create         aws_db_instance.main
```

PR 101 creates an autoscaling group (the cloud course's recommendation) and deletes the six fixed web servers, which is intended, but all at once. PR 102 deletes `aws_db_instance.prod` and creates `aws_db_instance.main`. A rename in code is, to Terraform, a deletion of one resource and the creation of another. Applied, it would **destroy the production database**. Lesson 6 is about catching and fixing exactly this.

## Walkthrough

1. Run the cells. List PR 104's changes. Which attribute changes on each resource?
2. List PR 106's single change. Is anything changing besides what the title says?
3. For each PR, write one sentence on what it does, based only on its plan.
4. Rank the six PRs from riskiest to safest (the task below).

## Practice

```answer
{
  "id": "iac-05-p1",
  "prompt": "How many resources does PR 104 (cost tags) **change** in place?",
  "answer": 19,
  "format": "number",
  "pyVerify": "summarise(plans['104-cost-tags'])['change']",
  "hint": "The change column for 104.",
  "required": true
}
```

```task
{
  "id": "iac-05-t1",
  "prompt": "Rank the **six PRs from riskiest to safest**, one per numbered line starting with the PR number, each with the **reason from its plan** (what it creates, changes or destroys).",
  "minutes": 8,
  "rows": 8,
  "placeholder": "1. PR 102: ...",
  "rules": [
    { "label": "Six numbered lines", "pattern": "^\\s*\\d+[.)]\\s+\\S", "min": 6 },
    { "label": "PR 102 ranked first", "pattern": "^\\s*1[.)][^\\n]*102" },
    { "label": "Mentions destroying the database", "pattern": "destroy[^\\n]*database|delet[^\\n]*database|database[^\\n]*(destroy|delet)" },
    { "label": "PR 104 in the last two", "pattern": "^\\s*[56][.)][^\\n]*104" },
    { "label": "Mentions the six web servers being deleted", "pattern": "(six|6)[^\\n]*(web|server|instance)" },
    { "label": "Mentions 0.0.0.0/0 or open to the internet", "pattern": "0\\.0\\.0\\.0/0|internet|anywhere|public" }
  ],
  "sample": "1. PR 102: destroys the production database and creates a new, empty one, because the resource was renamed.\n2. PR 103: opens the database port 5432 to 0.0.0.0/0, the whole internet.\n3. PR 101: deletes all six web servers in the same apply that creates the autoscaling group, so there may be a gap with no servers.\n4. PR 106: updates the database in place; the plan also changes the engine version, which the title doesn't mention.\n5. PR 105: changes the instance type of four API servers in place, which restarts each one.\n6. PR 104: adds a cost_centre tag to 19 servers; no creates or destroys.",
  "note": "PR 106 ranks above PR 105 here only because its plan contains a change its title doesn't mention; lesson 6 looks at it closely.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does `-/+` mean in a plan?",
    "options": ["Update in place", "Replace: destroy the resource, then create a new one", "Create only", "No change"],
    "answer": 1,
    "explanation": "For stateful resources, replacement means data loss."
  },
  {
    "prompt": "A PR titled 'rename database' plans one create and one delete. What's happening?",
    "options": ["A rename", "Terraform will destroy the old database and create a new, empty one", "Nothing", "A backup"],
    "answer": 1,
    "explanation": "Renaming an address is delete plus create, unless you tell Terraform it moved."
  },
  {
    "prompt": "What should a reviewer read first?",
    "options": ["The PR title", "The plan: what will actually happen", "The author's name", "The commit date"],
    "answer": 1,
    "explanation": "Titles say what was meant; plans say what will happen."
  }
]
```
