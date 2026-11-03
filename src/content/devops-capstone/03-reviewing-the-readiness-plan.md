---
title: Reviewing the readiness plan
minutes: 25
summary: Read the Terraform plan for the sale-readiness changes, write policy checks in Python, and catch the change that would have deleted the orders database, plus two security holes, before anyone applies it.
---

## The problem

The platform team has opened **PR 214: sale readiness**. It raises the autoscaling limits, moves the orders database to a bigger instance, adds a connection pooler (PgBouncer) and a burn-rate alarm, and cleans up an old test machine. The plan output is long, and the team is keen to apply it today.

A plan review is where infrastructure mistakes are cheapest to catch. Read what Terraform will **do**, not what the pull request says it does.

## The concept

### Actions in a plan

| Actions | Meaning |
| :-- | :-- |
| `create` | A new resource |
| `update` | Changed in place |
| `delete` | Destroyed |
| `delete`, `create` | **Replaced**: destroyed, then created again. For a database, that means the data is gone unless restored |

Some attribute changes can't be made in place, so Terraform replaces the resource. Renaming a database's `identifier` is one of them.

### Policy as code

Write the rules once, in code, and run them on every plan:

- No production database may be deleted or replaced, and every database needs `deletion_protection`.
- No security group may open a database port to the internet (`0.0.0.0/0`).
- No bucket may be made public.
- Every resource created or updated needs an `owner` tag.

![The four Terraform plan actions with replace highlighted as dangerous for a database, and four policy-as-code rules that run on every plan](/images/courses/devops-capstone/terraform-plan.svg "Read what the plan will do, and let policy as code stop the dangerous ones.")

## Example

What the plan will do:

```python
import json
import urllib.request

base = "https://academy.cloudtechanalytics.com/datasets/platform/"
plan = json.load(urllib.request.urlopen(base + "plan-sale-readiness.json"))
print(plan["pull_request"], "\n")
for rc in plan["resource_changes"]:
    print(f"{' + '.join(rc['change']['actions']):15} {rc['address']}")
```

```text
PR 214: sale readiness

update          aws_autoscaling_group.checkout_api
delete + create aws_db_instance.orders
create          aws_instance.pgbouncer
create          aws_security_group_rule.db_ingress
create          aws_s3_bucket_acl.sale_banners
create          aws_cloudwatch_metric_alarm.checkout_burn_rate
update          aws_elasticache_cluster.session_cache
delete          aws_instance.temp_test_9
```

One line says `delete + create` for the orders database. The policy checks:

```python
def check(plan):
    findings = []
    for rc in plan["resource_changes"]:
        actions, after = rc["change"]["actions"], rc["change"]["after"] or {}
        if rc["type"] == "aws_db_instance":
            if "delete" in actions:
                findings.append((rc["address"], "database would be DESTROYED (" + rc.get("action_reason", "delete") + ")"))
            if after and not after.get("deletion_protection"):
                findings.append((rc["address"], "deletion_protection is off"))
        if rc["type"] == "aws_security_group_rule" and "0.0.0.0/0" in after.get("cidr_blocks", []) and after.get("from_port") == 5432:
            findings.append((rc["address"], "database port open to the internet"))
        if rc["type"] == "aws_s3_bucket_acl" and after.get("acl", "").startswith("public"):
            findings.append((rc["address"], "bucket made public"))
        if actions != ["delete"] and "tags" in after and not after["tags"].get("owner"):
            findings.append((rc["address"], "no owner tag"))
    return findings

findings = check(plan)
for address, problem in findings:
    print(f"{address:45} {problem}")
print(f"\n{len(findings)} findings")
```

```text
aws_db_instance.orders                        database would be DESTROYED (replace_because_cannot_update)
aws_db_instance.orders                        deletion_protection is off
aws_security_group_rule.db_ingress            database port open to the internet
aws_s3_bucket_acl.sale_banners                bucket made public
aws_elasticache_cluster.session_cache         no owner tag

5 findings
```

The headline: renaming the database from `orders-db` to `kasuwa-orders-db` forces Terraform to **destroy and recreate** it, eight weeks before the sale, with deletion protection off. Applying this plan would delete every order. The fix is to change only the instance class, which happens in place, turn on deletion protection, and add a lifecycle guard so Terraform refuses to destroy it:

```hcl
resource "aws_db_instance" "orders" {
  identifier          = "orders-db"
  instance_class      = "db.r6g.2xlarge"
  deletion_protection = true

  lifecycle {
    prevent_destroy = true
  }
}
```

The security group rule would expose the database to the whole internet; it should allow only the PgBouncer instance's security group. The public bucket for sale banners should be served through the CDN instead.

## Walkthrough

1. Run the cells.
2. Change the database entry in a copy of the plan to an in-place `update` with `deletion_protection` true, and rerun the checks.
3. Add a rule of your own: for example, that `max_size` of an autoscaling group never more than doubles in one change without a note.
4. Decide where these checks run: in the pull request pipeline, blocking the merge.
5. Write the plan review (the task below).

## Practice

```answer
{
  "id": "cdc-03-p1",
  "prompt": "How many **findings** do the policy checks report on this plan?",
  "answer": 5,
  "format": "number",
  "pyVerify": "len(findings)",
  "hint": "The last line printed.",
  "required": true
}
```

```answer
{
  "id": "cdc-03-p2",
  "prompt": "Which resource address would be **destroyed and recreated**?",
  "answer": "aws_db_instance.orders",
  "format": "text",
  "pyVerify": "[rc['address'] for rc in plan['resource_changes'] if rc['change']['actions'] == ['delete', 'create']][0]",
  "hint": "The line with delete + create.",
  "required": true
}
```

```task
{
  "id": "cdc-03-t1",
  "prompt": "Write the **plan review** comment for PR 214 (60 to 150 words): the **blocking** problems, **why** the database would be replaced, the **fix** for each, and what's **fine** to merge.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Blocking: ...",
  "rules": [
    { "label": "Says it's blocked (request changes, don't apply)", "pattern": "block|request changes|do not (apply|merge)|don't (apply|merge)" },
    { "label": "Explains the replacement (identifier, rename)", "pattern": "identifier|renam" },
    { "label": "A fix for the database (in place, deletion protection, prevent_destroy)", "pattern": "in.place|deletion.protection|prevent_destroy" },
    { "label": "Covers the open database port", "pattern": "0\\.0\\.0\\.0|internet|5432|security group" },
    { "label": "Covers the public bucket", "pattern": "public|bucket|acl" },
    { "label": "Says what's fine", "pattern": "fine|ok|good|approve|can (go|merge)" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "Blocking, please don't apply. 1) aws_db_instance.orders will be destroyed and recreated because the identifier changes from orders-db to kasuwa-orders-db, and deletion protection is off: every order would be lost. Keep the identifier, change only instance_class (an in-place update), set deletion_protection = true and add prevent_destroy. 2) The new security group rule opens port 5432 to 0.0.0.0/0; allow only the PgBouncer security group. 3) The sale_banners bucket is made public-read; serve banners through the CDN instead. 4) session_cache has no owner tag. The autoscaling change, the PgBouncer instance, the burn-rate alarm and removing temp-test-9 are fine to merge once these are fixed.",
  "note": "Say what's good too: a review is a decision, not a list of complaints.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A plan shows delete and create for a database. What does that mean?",
    "options": ["A minor update", "The database will be destroyed and created again, losing its data", "A backup", "A rename only"],
    "answer": 1,
    "explanation": "Replacement is destruction."
  },
  {
    "prompt": "Why run policy checks in code on every plan?",
    "options": ["They're faster to read", "Rules are applied the same way every time, before anything is applied, not left to a tired reviewer", "Terraform requires it", "To write less HCL"],
    "answer": 1,
    "explanation": "Automated guardrails catch what people miss."
  },
  {
    "prompt": "What does lifecycle prevent_destroy do?",
    "options": ["Speeds up applies", "Makes Terraform refuse any plan that would destroy the resource", "Encrypts the resource", "Hides it from state"],
    "answer": 1,
    "explanation": "A last line of defence for critical resources."
  }
]
```
