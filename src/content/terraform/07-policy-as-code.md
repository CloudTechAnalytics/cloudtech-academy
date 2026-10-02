---
title: Policy as code
minutes: 25
summary: Turn review rules into automatic checks that run on every plan (no destroying stateful resources, no sensitive ports open to the internet, required tags, flagged major upgrades) and see which of Tallybook's pull requests they block.
---

## The problem

Lessons 5 and 6 found serious problems by reading plans carefully. Careful reading doesn't scale: a busy reviewer on a Friday afternoon approves the "rename" PR. The rules that matter most should be checked by a program, on every plan, before a person even looks.

This is **policy as code**. Tools such as Open Policy Agent, Sentinel and Checkov do it at scale; underneath, every policy is a function that reads the plan JSON and returns violations. You'll write those functions in Python.

## The concept

**A policy is a function**: plan in, list of violations out. Each violation names the resource and the rule broken.

**Good first policies**

| Policy | Catches |
| :-- | :-- |
| No deletion of stateful resources | PR 102 |
| No ingress from 0.0.0.0/0 except ports 80 and 443 | PR 103 |
| Created taggable resources must have `environment` and `team` tags | untagged spend (cloud course) |
| Database major version changes need sign-off | PR 106 |
| No more than N deletions in one plan | PR 101 |

**Block or warn**

Some violations should **block** the merge (destroying a database); others should **warn** and require a named senior reviewer (a major upgrade). Every block can still be overridden, with a recorded reason.

## Example

Write the policies, then run every policy on every plan:

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

STATEFUL = {"aws_db_instance", "aws_s3_bucket", "aws_ebs_volume"}
TAGGABLE = {"aws_instance", "aws_launch_template", "aws_autoscaling_group", "aws_db_instance", "aws_s3_bucket", "aws_lb"}

def no_stateful_deletes(plan):
    return [rc["address"] for rc in plan["resource_changes"] if "delete" in rc["change"]["actions"] and rc["type"] in STATEFUL]

def no_open_sensitive_ports(plan):
    bad = []
    for rc in plan["resource_changes"]:
        after = rc["change"]["after"] or {}
        if rc["type"] == "aws_security_group_rule" and after.get("type") == "ingress" and "0.0.0.0/0" in after.get("cidr_blocks", []):
            if not {after["from_port"], after["to_port"]} <= {80, 443}:
                bad.append(f"{rc['address']} port {after['from_port']}")
    return bad

def required_tags(plan):
    bad = []
    for rc in plan["resource_changes"]:
        if rc["change"]["actions"] == ["create"] and rc["type"] in TAGGABLE:
            tags = (rc["change"]["after"] or {}).get("tags") or {}
            if not {"environment", "team"} <= set(tags):
                bad.append(rc["address"])
    return bad

def major_db_upgrades(plan):
    bad = []
    for rc in plan["resource_changes"]:
        before, after = rc["change"]["before"] or {}, rc["change"]["after"] or {}
        if rc["type"] == "aws_db_instance" and before and after:
            if before["engine_version"].split(".")[0] != after["engine_version"].split(".")[0]:
                bad.append(f"{rc['address']} {before['engine_version']} -> {after['engine_version']}")
    return bad

def too_many_deletes(plan, limit=3):
    deletes = [rc["address"] for rc in plan["resource_changes"] if "delete" in rc["change"]["actions"]]
    return deletes if len(deletes) > limit else []

POLICIES = {"no_stateful_deletes": ("block", no_stateful_deletes), "no_open_sensitive_ports": ("block", no_open_sensitive_ports),
            "required_tags": ("block", required_tags), "major_db_upgrades": ("warn", major_db_upgrades), "too_many_deletes": ("warn", too_many_deletes)}

results = pd.DataFrame({pr: {name: len(check(plan)) for name, (_, check) in POLICIES.items()} for pr, plan in plans.items()}).T
results
```

```text
no_stateful_deletes  no_open_sensitive_ports  required_tags  major_db_upgrades  too_many_deletes
101-web-autoscaling                      0                        0              0                  0                 6
102-rename-database                      1                        0              0                  0                 0
103-reporting-access                     0                        1              0                  0                 0
104-cost-tags                            0                        0              0                  0                 0
105-rightsize-api                        0                        0              0                  0                 0
106-multi-az-database                    0                        0              0                  1                 0
```

Each number is the count of violations. Now the decision for each PR:

```python
def decision(pr):
    plan = plans[pr]
    levels = {POLICIES[name][0] for name, (_, check) in POLICIES.items() if check(plan)}
    return "BLOCKED" if "block" in levels else "needs senior review" if "warn" in levels else "ready for normal review"

for pr in PRS:
    print(pr.ljust(24), decision(pr))
```

```text
101-web-autoscaling      needs senior review
102-rename-database      BLOCKED
103-reporting-access     BLOCKED
104-cost-tags            ready for normal review
105-rightsize-api        ready for normal review
106-multi-az-database    needs senior review
```

The two most dangerous PRs are blocked automatically, two more are flagged for a senior reviewer, and the two routine ones go through normal review. That's the right split, and nobody had to read 1,000 lines of JSON to get it.

## Walkthrough

1. Run the cells. Print the actual violations for each blocked PR, not just the counts.
2. Add a policy: production servers may only use instance types from an approved list.
3. Would `required_tags` catch a resource created with `team = ""`? Fix it if not.
4. Write the policy document (the task below).

## Practice

```answer
{
  "id": "iac-07-p1",
  "prompt": "How many of the six PRs are **BLOCKED**?",
  "answer": 2,
  "format": "number",
  "pyVerify": "sum(decision(pr) == 'BLOCKED' for pr in PRS)",
  "hint": "Count BLOCKED in the last output.",
  "required": true
}
```

```task
{
  "id": "iac-07-t1",
  "prompt": "Write Tallybook's **infrastructure policy list**, one policy per line starting with **BLOCK:** or **WARN:**, at least **five** policies, each saying what it checks. End with a line starting **Override:** saying who can override a block and how it's recorded.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "BLOCK: ...",
  "rules": [
    { "label": "At least five BLOCK or WARN lines", "pattern": "^\\s*(BLOCK|WARN)\\s*:", "min": 5 },
    { "label": "At least two BLOCK lines", "pattern": "^\\s*BLOCK\\s*:", "min": 2 },
    { "label": "A rule about deleting stateful resources", "pattern": "delet[^\\n]*(database|bucket|stateful|volume)|destroy[^\\n]*(database|bucket|stateful)" },
    { "label": "A rule about 0.0.0.0/0 or the internet", "pattern": "0\\.0\\.0\\.0/0|internet|public" },
    { "label": "A rule about tags", "pattern": "tag" },
    { "label": "An Override line with who and a record", "pattern": "^\\s*override\\s*:[^\\n]*(lead|cto|head|engineer)[^\\n]*(record|log|written|reason)" }
  ],
  "sample": "BLOCK: deleting or replacing a database, storage bucket or volume.\nBLOCK: ingress from 0.0.0.0/0 on any port except 80 and 443.\nBLOCK: creating a taggable resource without non-empty environment and team tags.\nBLOCK: setting publicly_accessible = true on a database.\nWARN: a major version change to a database engine (needs the platform lead's approval).\nWARN: more than 3 deletions in one plan (needs a senior reviewer).\nOverride: the platform lead and CTO together may override a block, with a written reason recorded in the pull request and the change log.",
  "note": "The override rule matters as much as the policies: a block that anyone can quietly skip isn't a control.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is policy as code?",
    "options": ["Writing policies in Word", "Automatic checks that read every plan and flag or block rule violations", "A legal contract", "A type of provider"],
    "answer": 1,
    "explanation": "Rules a program applies on every change."
  },
  {
    "prompt": "Which violation should block a merge rather than just warn?",
    "options": ["A missing description", "Destroying the production database", "A long plan", "A new tag"],
    "answer": 1,
    "explanation": "Irreversible damage gets a hard stop."
  },
  {
    "prompt": "Why run policies before a person reviews?",
    "options": ["To replace reviewers", "So the most important rules are always checked, however busy the reviewer is", "To slow merges", "Because people can't read JSON"],
    "answer": 1,
    "explanation": "Automation guarantees the basics; people judge the rest."
  }
]
```
