---
title: "Final project: Tallybook's infrastructure review"
minutes: 20
summary: Plan your final project, a review of Tallybook's Terraform estate and six pending pull requests, with policy checks, drift and secrets findings, and the plan to make Terraform the only way infrastructure changes.
---

## The problem

Tallybook's CTO wants to adopt infrastructure as code properly, and wants one document to do it: what's wrong today, what to do with the six pull requests waiting, and the rules and pipeline from now on. Your final project is that review, built from the state, plans and variable files in this course.

## The concept

**The parts of the review**

| Part | Built in |
| :-- | :-- |
| Coverage: what Terraform manages and what it doesn't | lesson 1 |
| Environments compared, with costs | lesson 3 |
| State and secrets | lesson 4 |
| The six PRs: summaries, dangers, fixes | lessons 5 and 6 |
| Policies and their results | lesson 7 |
| Drift and unmanaged resources | lesson 8 |
| Modules and the pipeline | lesson 9 |

**One scorecard per PR**

For each PR: its plan summary, policy results, decision, and your review comment. That table is what the CTO will read first.

## Example

The start of the scorecard, combining the plan summary with a few of the checks:

```python
import json
from urllib.request import urlopen

import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/terraform/"
PRS = ["101-web-autoscaling", "102-rename-database", "103-reporting-access", "104-cost-tags", "105-rightsize-api", "106-multi-az-database"]

def load(name):
    with urlopen(base + name) as f:
        return json.load(f)

def scorecard(pr):
    changes = load(f"plan-pr-{pr}.json")["resource_changes"]
    actions = [rc["change"]["actions"] for rc in changes]
    return {
        "add": sum("create" in a for a in actions),
        "change": sum(a == ["update"] for a in actions),
        "destroy": sum("delete" in a for a in actions),
        "touches_database": any(rc["type"] == "aws_db_instance" for rc in changes),
        "touches_firewall": any(rc["type"] == "aws_security_group_rule" for rc in changes),
    }

pd.DataFrame({pr: scorecard(pr) for pr in PRS}).T
```

```text
add change destroy touches_database touches_firewall
101-web-autoscaling     4      0       6            False            False
102-rename-database     1      0       1             True            False
103-reporting-access    1      0       0            False             True
104-cost-tags           0     19       0            False            False
105-rightsize-api       0      4       0            False            False
106-multi-az-database   0      1       0             True            False
```

Add the policy decisions from lesson 7 and your review comments, and the table becomes the first page of the review.

## Walkthrough

1. Complete the scorecard with policy results and your decision for each PR.
2. Write the coverage, drift and secrets findings with their evidence.
3. Write the target rules: policies, drift policy and pipeline.
4. Open the project brief on the course page and plan the write-up.

## Practice

```answer
{
  "id": "iac-10-p1",
  "prompt": "How many of the six PRs touch a **database** resource?",
  "answer": 2,
  "format": "number",
  "pyVerify": "sum(scorecard(pr)['touches_database'] for pr in PRS)",
  "hint": "Count True in the touches_database column.",
  "required": true
}
```

```task
{
  "id": "iac-10-t1",
  "prompt": "Write the **executive summary** of your review (100 to 200 words): **coverage** (what's not in Terraform), the **secrets** finding, what happens to the **six PRs**, the **drift** found, and the **rules** from now on (policies and pipeline), ending with the first three actions.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Only about half of Tallybook's servers are managed by Terraform ...",
  "rules": [
    { "label": "Coverage (unmanaged, not in Terraform, by hand)", "pattern": "unmanaged|not (in|managed by) terraform|by hand|console" },
    { "label": "Secrets in state", "pattern": "password|secret" },
    { "label": "Mentions PR 102 or the database deletion", "pattern": "102|destroy[^.]*database|database[^.]*destroy" },
    { "label": "Drift", "pattern": "drift|worker-03|resized" },
    { "label": "Policies and pipeline", "pattern": "polic[\\s\\S]*pipeline|pipeline[\\s\\S]*polic" },
    { "label": "First actions", "pattern": "first|1\\.|immediately|this week|today" },
    { "label": "Between 100 and 200 words", "minWords": 100, "maxWords": 200 }
  ],
  "sample": "Only about half of Tallybook's servers, and none of its riskiest firewall rules, are managed by Terraform; the rest were made by hand, which is why they were forgotten or left open. The state file, once emailed to a contractor, contains both database passwords in plain text. Of the six pull requests waiting, two are blocked by the new policy checks: PR 102 would destroy the production database and PR 103 would open it to the internet. Two more need senior review: PR 101 must be split so web servers aren't deleted before their replacements work, and PR 106 hides a major database upgrade. PRs 104 and 105 can proceed. We also found drift: worker-03 was resized by hand, and Terraform would shrink it back. From now on, every change goes through a pull request pipeline with formatting, plans, policy checks and review, and only the pipeline can apply. First actions: rotate the database passwords and move state to an encrypted, locked backend; delete or restrict the three hand-made firewall rules; and turn on deletion protection for the production database.",
  "note": "Leading with coverage explains every other finding: problems lived where Terraform didn't.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which finding should be acted on first?",
    "options": ["Missing cost tags", "A production database password exposed in a shared state file", "Unformatted code", "A pinned module version"],
    "answer": 1,
    "explanation": "Exposed secrets are an active risk."
  },
  {
    "prompt": "What makes Terraform trustworthy as the record of infrastructure?",
    "options": ["Using the latest version", "Making it the only way changes are made, with drift detected and reconciled", "Having many modules", "Writing long plans"],
    "answer": 1,
    "explanation": "Manual changes erode trust in every plan."
  },
  {
    "prompt": "A reviewer's scorecard should start with what?",
    "options": ["Code style", "What each change creates, changes and destroys, and whether it breaks a policy", "Author names", "Line counts"],
    "answer": 1,
    "explanation": "Impact and risk first."
  }
]
```
