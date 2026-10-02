---
title: Dangerous changes
minutes: 25
summary: Recognise the plans that destroy data or cause downtime (replacements of stateful resources, renames, mass deletions and hidden attribute changes) and fix them with moved blocks, lifecycle rules and safer sequencing.
---

## The problem

Three of Tallybook's six pull requests could cause serious damage if applied as they are, and none of their titles says so:

- PR 102, "rename database", destroys the production database.
- PR 101, "web autoscaling", deletes all six web servers in the same step that creates their replacement.
- PR 106, "multi-AZ database", also upgrades the database to a new major version, immediately.

Each has a standard fix. Knowing them is a core skill for anyone who approves infrastructure changes.

## The concept

**Renames: `moved` blocks**

Tell Terraform the resource moved, and the rename becomes a no-op:

```hcl
moved {
  from = aws_db_instance.prod
  to   = aws_db_instance.main
}
```

**Protect what can't be recreated**

```hcl
resource "aws_db_instance" "main" {
  # ...
  deletion_protection = true

  lifecycle {
    prevent_destroy = true
  }
}
```

`prevent_destroy` makes Terraform refuse any plan that would destroy the resource. `deletion_protection` makes the cloud provider refuse it too, even from the console.

**Sequence risky changes**

- Create the new thing in one PR; switch traffic and delete the old thing in another, after checking.
- `create_before_destroy` in a `lifecycle` block makes replacements create first.

**Check every changed attribute**

An update can hide changes the title doesn't mention. Compare `before` and `after` for every attribute, not just the one you expected.

## Example

Find the changed attributes in every update, across all plans:

```python
import json
from urllib.request import urlopen

base = "https://academy.cloudtechanalytics.com/datasets/terraform/"
PRS = ["101-web-autoscaling", "102-rename-database", "103-reporting-access", "104-cost-tags", "105-rightsize-api", "106-multi-az-database"]

def load(name):
    with urlopen(base + name) as f:
        return json.load(f)

plans = {pr: load(f"plan-pr-{pr}.json") for pr in PRS}

def changed_attributes(rc):
    before, after = rc["change"]["before"] or {}, rc["change"]["after"] or {}
    return sorted(k for k in set(before) | set(after) if before.get(k) != after.get(k))

for pr, plan in plans.items():
    updates = [rc for rc in plan["resource_changes"] if rc["change"]["actions"] == ["update"]]
    if updates:
        attrs = sorted({a for rc in updates for a in changed_attributes(rc)})
        print(f"PR {pr}: {len(updates)} updates, changing {attrs}")
```

```text
PR 104-cost-tags: 19 updates, changing ['tags']
PR 105-rightsize-api: 4 updates, changing ['instance_type']
PR 106-multi-az-database: 1 updates, changing ['allow_major_version_upgrade', 'apply_immediately', 'engine_version', 'multi_az']
```

PR 104 changes only tags, and PR 105 only instance types. PR 106 changes four attributes: `multi_az` as intended, plus `engine_version` (15.4 to 16.3, a major upgrade), `allow_major_version_upgrade`, and `apply_immediately`, which means "do it now, during business hours, not in the maintenance window". Now the deletions of stateful resources:

```python
STATEFUL = {"aws_db_instance", "aws_s3_bucket", "aws_ebs_volume", "aws_efs_file_system"}

for pr, plan in plans.items():
    for rc in plan["resource_changes"]:
        if "delete" in rc["change"]["actions"] and rc["type"] in STATEFUL:
            before = rc["change"]["before"]
            print(f"PR {pr}: deletes {rc['address']} ({before['identifier']}, {before['allocated_storage']} GB), deletion_protection={before['deletion_protection']}")
```

```text
PR 102-rename-database: deletes aws_db_instance.prod (tallybook-prod, 500 GB), deletion_protection=False
```

The production database has `deletion_protection` switched off, so nothing outside Terraform would stop this either. Two fixes, both needed: a `moved` block in PR 102, and `prevent_destroy` plus `deletion_protection` on the database in a separate PR.

## Walkthrough

1. Run the cells. Write the `moved` block that makes PR 102 safe.
2. Split PR 101 into two PRs. What does each contain, and what do you check in between?
3. Split PR 106: which attributes go in the first PR, and when should the version upgrade happen?
4. Write your review comments (the task below).

## Practice

```answer
{
  "id": "iac-06-p1",
  "prompt": "How many attributes does PR 106's update change?",
  "answer": 4,
  "format": "number",
  "pyVerify": "len(changed_attributes(plans['106-multi-az-database']['resource_changes'][0]))",
  "hint": "Count the attributes listed for PR 106.",
  "required": true
}
```

```task
{
  "id": "iac-06-t1",
  "prompt": "Write **review comments** for PRs **102**, **101** and **106**, one paragraph each starting with the PR number and a colon: what the plan really does, why it's dangerous, and the **specific fix** (a `moved` block, splitting the PR, `prevent_destroy`, removing `apply_immediately`, and so on).",
  "minutes": 10,
  "rows": 9,
  "placeholder": "102: ...",
  "rules": [
    { "label": "A paragraph for each of 102, 101 and 106", "pattern": "^\\s*(PR )?(102|101|106)\\s*:", "min": 3 },
    { "label": "102: a moved block", "pattern": "moved" },
    { "label": "Protection for the database (prevent_destroy or deletion_protection)", "pattern": "prevent_destroy|deletion_protection" },
    { "label": "101: split or sequence the change", "pattern": "split|two (PRs|pull requests|steps)|first[^\\n]*then|after[^\\n]*healthy|create_before_destroy" },
    { "label": "106: the major version upgrade", "pattern": "engine_version|major (version )?upgrade|16\\.3|version upgrade" },
    { "label": "106: apply_immediately or the maintenance window", "pattern": "apply_immediately|maintenance window" }
  ],
  "sample": "102: This plan destroys aws_db_instance.prod (500 GB, with deletion protection off) and creates an empty aws_db_instance.main. Add a moved block from aws_db_instance.prod to aws_db_instance.main so Terraform renames it in state instead, and in a separate PR add lifecycle { prevent_destroy = true } and deletion_protection = true.\n101: The autoscaling group is the right change, but this plan deletes all six web servers in the same apply. Split it: first create the autoscaling group and attach it to the load balancer; once its servers are healthy and serving traffic, remove the old instances in a second PR.\n106: The title says multi-AZ, but the plan also upgrades Postgres from 15.4 to 16.3 with apply_immediately, during business hours. Keep only multi_az here, without apply_immediately, so it happens in the maintenance window; do the major version upgrade separately, after testing it on staging.",
  "note": "Each comment names the exact fix, so the author knows what to change without another round of questions.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does a `moved` block do?",
    "options": ["Moves a server to another region", "Tells Terraform a resource's address changed, so it renames it in state instead of destroying it", "Copies data", "Deletes the old resource"],
    "answer": 1,
    "explanation": "Renames without destruction."
  },
  {
    "prompt": "What does `prevent_destroy = true` do?",
    "options": ["Makes the resource faster", "Makes Terraform refuse any plan that would destroy the resource", "Backs it up", "Hides it from the plan"],
    "answer": 1,
    "explanation": "A guard against accidental deletion."
  },
  {
    "prompt": "An update's title mentions one setting, but the plan changes four attributes. What should a reviewer do?",
    "options": ["Approve: it's an update, not a delete", "Ask why each extra change is there, and split out anything unrelated", "Reject all updates", "Ignore the extras"],
    "answer": 1,
    "explanation": "Every changed attribute needs a reason."
  }
]
```
