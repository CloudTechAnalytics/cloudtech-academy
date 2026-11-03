---
title: Drift and imports
minutes: 25
summary: Find drift (real infrastructure that no longer matches Terraform's state) and resources Terraform doesn't manage, then decide for each whether to import it, change it back or delete it.
---

## The problem

Terraform only works well if it's the **only** way infrastructure changes. At Tallybook, it isn't. During a busy week someone resized a worker server in the console. During a 2025 migration someone added firewall rules by hand. Developers create their own servers.

Every manual change creates **drift**: the real world no longer matches what Terraform believes. The next `apply` might undo someone's urgent fix, or fail, or, worse, everyone stops trusting the plan.

## The concept

### Two kinds of mismatch

| Kind | Example | Found by |
| :-- | :-- | :-- |
| **Attribute drift** | a managed server resized in the console | `terraform plan` shows a change nobody wrote |
| **Unmanaged resources** | a server or rule created by hand | comparing the cloud's inventory with state |

### Decide for each

- **Keep it, and bring it under Terraform**: write the code and **import** it.
- **Change it back**: let Terraform's next apply restore the coded value.
- **Accept the change**: update the code to match reality.
- **Delete it**: if nobody needs it.

### Importing

```hcl
import {
  to = aws_security_group_rule.office_admin
  id = "sgr-r08"
}
```

With an `import` block (Terraform 1.5 and later) and matching resource code, the next plan shows the resource being imported rather than created.

## Example

Attribute drift: compare each managed server's instance type in state with the cloud inventory. The inventory uses size names; map them to instance types first:

```python
import json
from urllib.request import urlopen

import pandas as pd

with urlopen("https://academy.cloudtechanalytics.com/datasets/terraform/terraform.tfstate") as f:
    state = json.load(f)
inventory = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/cloud/resources.csv")

SIZE_TO_TYPE = {"small": "t3.small", "medium": "t3.medium", "large": "m5.xlarge", "xlarge": "m5.2xlarge"}
in_state = pd.DataFrame([
    {"address": f"{r['type']}.{r['name']}[{i['index_key']}]", "resource_id": i["attributes"]["id"], "state_type": i["attributes"]["instance_type"]}
    for r in state["resources"] if r["type"] == "aws_instance" for i in r["instances"]
])
compare = in_state.merge(inventory[["resource_id", "name", "size"]], on="resource_id")
compare["real_type"] = compare["size"].map(SIZE_TO_TYPE)
compare[compare["state_type"] != compare["real_type"]]
```

```text
address resource_id state_type            name   size  real_type
12  aws_instance.worker[2]      r-0025   m5.large  prod-worker-03  large  m5.xlarge
```

One server drifted: worker-03 is really an `m5.xlarge`, but Terraform still believes it's an `m5.large`. Its next plan for this server would **shrink it back**, quietly undoing the fix someone made during a busy week. Now unmanaged firewall rules: the Linux course's rule list against the rules in state.

```python
rules = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/linux/firewall.csv")
managed_rule_ids = {i["attributes"]["id"] for r in state["resources"] if r["type"] == "aws_security_group_rule" for i in r["instances"]}
rules["in_terraform"] = ("sgr-" + rules["rule_id"].str.lower()).isin(managed_rule_ids)
rules.loc[~rules["in_terraform"], ["rule_id", "port_from", "source", "description"]]
```

```text
rule_id  port_from     source                              description
2     R03         22  0.0.0.0/0  SSH - temporary, for the 2025 migration
7     R08       8080  0.0.0.0/0                              Admin panel
9     R10       5432  0.0.0.0/0        Postgres - for the reporting tool
```

The three rules that aren't in Terraform are exactly the three open to the whole internet that the Linux course found: SSH, the admin panel and the database. They were never reviewed because they never went through code. Two should be deleted and one restricted, then all firewall changes should go through Terraform.

## Walkthrough

1. Run the cells. For worker-03, decide: change it back, or update the code? What would you check first?
2. Write the resource code and `import` block for a restricted version of R08 (admin panel from the office only).
3. List every unmanaged server from lesson 1 and decide import or delete for each group.
4. Write the drift policy (the task below).

## Practice

```answer
{
  "id": "iac-08-p1",
  "prompt": "How many firewall rules in firewall.csv are **not** managed by Terraform?",
  "answer": 3,
  "format": "number",
  "pyVerify": "int((~rules['in_terraform']).sum())",
  "hint": "Count the rows of the last output.",
  "required": true
}
```

```task
{
  "id": "iac-08-t1",
  "prompt": "Write Tallybook's **drift policy**, one rule per line starting with a dash: at least **four** rules covering how drift is **detected** (and how often), what happens to **manual changes**, **emergency** changes, and **unmanaged** resources.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "- Detection: ...",
  "rules": [
    { "label": "At least four rules, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 4 },
    { "label": "Scheduled detection (daily, nightly, scheduled plan)", "pattern": "daily|nightly|(every|each) (day|night|hour)|scheduled|cron" },
    { "label": "Manual changes (console, by hand, not allowed)", "pattern": "console|by hand|manual" },
    { "label": "Emergencies (emergency, incident, break-glass)", "pattern": "emergenc|incident|break[- ]glass|urgent" },
    { "label": "Unmanaged resources (import or delete)", "pattern": "import" }
  ],
  "sample": "- Detection: the pipeline runs terraform plan for every environment each night and posts any unexpected change to the platform channel.\n- Manual changes: nobody changes managed infrastructure in the console; console access is read-only for everyone except two break-glass accounts.\n- Emergencies: an urgent fix may be made by hand during an incident, but a pull request bringing the code into line must be merged within one working day.\n- Unmanaged resources: every resource found outside Terraform is either imported with an import block or deleted within two weeks, decided by its team lead.\n- Ownership: the platform lead reviews the drift report weekly and chases anything older than a week.",
  "note": "The emergency rule is what makes the policy realistic: people will change things by hand during an incident, so the policy says how to reconcile afterwards.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A server was resized in the console. What will Terraform's next apply do?",
    "options": ["Nothing", "Change it back to the size in the code", "Delete it", "Update the code"],
    "answer": 1,
    "explanation": "Terraform makes reality match the code."
  },
  {
    "prompt": "What does an `import` block do?",
    "options": ["Copies data", "Brings an existing resource under Terraform's management without recreating it", "Deletes a resource", "Downloads a provider"],
    "answer": 1,
    "explanation": "Import adopts what already exists."
  },
  {
    "prompt": "How should drift be detected?",
    "options": ["When something breaks", "By running plan on a schedule and alerting on unexpected changes", "By asking engineers", "It can't be"],
    "answer": 1,
    "explanation": "Scheduled plans are drift detectors."
  }
]
```
