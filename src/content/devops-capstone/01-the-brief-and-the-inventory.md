---
title: The brief and the inventory
minutes: 25
summary: Meet Kasuwa's platform eight weeks before its biggest sale, take stock of everything running in the cloud account, and find what isn't managed, isn't owned or isn't safe.
---

## The problem

This is the capstone of the Cloud & DevOps Engineer track. You'll take one platform through the whole job: inventory, an incident review, infrastructure as code, delivery, capacity, reliability, cost and a game day.

The company is **Kasuwa**, the online shop from the Data Scientist Capstone. Its biggest day is the November sale. Last year's sale went badly. Checkout failed for over an hour at the peak, and customers found out before the engineers did. The head of engineering has sent this:

> "The sale is in eight weeks. Last year we lost the most valuable hour of the year. Since then the cloud bill has crept up, half the infrastructure was built by hand during the incident, and every deploy feels like a gamble. Tell me what's wrong, fix what matters, and tell me honestly whether we're ready."

## The concept

**Start with an inventory**

You can't secure, scale or cost what you don't know exists. List every resource, its environment, who owns it, how it's managed and what it costs.

**Managed by Terraform, or by hand?**

Resources created by hand (in the console or during an incident) aren't reviewed, aren't reproducible and drift silently. Anything that matters in production should be in Terraform.

**Ownership and safety**

Every resource needs an owner, a team that's answerable for it. And anything public or unencrypted needs a reason.

**The plan for the eight weeks**

| Area | Question | Lesson |
| :-- | :-- | :-- |
| Inventory | What's running, and what's risky? | 1 |
| Incident | What really happened last year? | 2 |
| Infrastructure as code | Is the readiness change safe? | 3 |
| Delivery | How risky are deploys, and what should change before the sale? | 4 |
| Capacity | How much do we need for this year's peak? | 5 |
| Reliability | Will we know before customers do? | 6 |
| Cost | What can we stop paying for? | 7 |
| Game day | Are we ready? | 8 |

## Example

The inventory, by environment and by how it's managed:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/platform/"
resources = pd.read_csv(base + "resources.csv")
print(f"{len(resources)} resources, ${resources['monthly_cost_usd'].sum():,} a month\n")
resources.pivot_table(index="environment", columns="managed_by", values="monthly_cost_usd", aggfunc="sum", fill_value=0, margins=True)
```

```text
31 resources, $9,840 a month

managed_by   manual  terraform   All
environment
development    1190       1120  2310
production     1600       3230  4830
staging        2400        300  2700
All            5190       4650  9840
```

Staging costs more than half as much as production, and much of the spend is managed by hand. What's risky in production:

```python
prod = resources[resources["environment"] == "production"]
prod.loc[(prod["managed_by"] == "manual") | (prod["owner"].isna()) | (prod["encrypted"] == 0) | (prod["publicly_accessible"] == 1),
         ["name", "type", "managed_by", "publicly_accessible", "encrypted", "owner"]]
```

```text
name               type managed_by  publicly_accessible  encrypted          owner
2           web-frontend   cdn distribution  terraform                    1          1       web-team
3   public-load-balancer      load balancer  terraform                    1          1  platform-team
5      orders-db-replica  postgres database     manual                    0          1  payments-team
7           order-worker  autoscaling group     manual                    0          1  payments-team
8         product-images     storage bucket  terraform                    1          1       web-team
9             db-backups     storage bucket     manual                    0          0            NaN
11               bastion    virtual machine     manual                    1          1            NaN
```

The database replica and the order worker were built by hand during last year's incident and never brought into Terraform. The backup bucket is **unencrypted** and has no owner, so the most sensitive copy of customer orders is the least protected thing in the account. The bastion is public, hand-built and unowned. The CDN, load balancer and product images are meant to be public.

## Walkthrough

1. Download the dataset below and run the cells.
2. List every resource with no owner. Who should own each?
3. Which manual production resources should be imported into Terraform first? Rank them by risk.
4. Look at the development resources. Which look abandoned?
5. Write the inventory findings (the task below).

## Practice

```dataset
{"dataset": "platform", "files": ["resources", "sale_metrics", "deployments", "loadtest", "alerts", "gameday"]}
```

```answer
{
  "id": "cdc-01-p1",
  "prompt": "What percentage of the monthly cloud cost is for resources managed **by hand**? Whole number.",
  "answer": 53,
  "format": "percent",
  "dataset": "platform",
  "files": ["resources"],
  "verify": "SELECT ROUND(100.0 * SUM(CASE WHEN managed_by = 'manual' THEN monthly_cost_usd END) / SUM(monthly_cost_usd)) FROM resources",
  "hint": "The manual column's total divided by the overall total.",
  "required": true
}
```

```answer
{
  "id": "cdc-01-p2",
  "prompt": "How many resources have **no owner**?",
  "answer": 9,
  "format": "number",
  "dataset": "platform",
  "files": ["resources"],
  "verify": "SELECT COUNT(*) FROM resources WHERE owner IS NULL",
  "hint": "Count rows where owner is empty.",
  "required": true
}
```

```task
{
  "id": "cdc-01-t1",
  "prompt": "Write the **inventory findings** (60 to 150 words): the monthly cost and how much is **managed by hand**, the **riskiest** production resources and why, and what you'll do **first**.",
  "minutes": 7,
  "rows": 7,
  "placeholder": "Kasuwa runs ...",
  "rules": [
    { "label": "Gives the cost", "pattern": "\\$\\s*[\\d,]+" },
    { "label": "Covers manual or hand-built resources", "pattern": "manual|by hand|hand-built|terraform" },
    { "label": "Names the backup bucket", "pattern": "backup" },
    { "label": "Covers encryption or ownership", "pattern": "encrypt|owner" },
    { "label": "Says what to do first", "pattern": "first|priority|import|start" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "Kasuwa runs 31 resources costing $9,840 a month, and resources built by hand account for over half of that. In production, the riskiest is the db-backups bucket: it holds every order, yet it's unencrypted, has no owner and was created by hand. The orders-db replica and order-worker were built during last year's incident and never brought into Terraform, so nobody reviews changes to them. The bastion is public, hand-built and unowned. First: encrypt the backup bucket and give it an owner, then import the replica, worker, bucket and bastion into Terraform, and require an owner tag on every resource.",
  "note": "Rank by risk to customers, not by cost.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why start a readiness review with an inventory?",
    "options": ["It's quick", "You can't secure, scale or cost what you don't know exists", "Auditors require it", "To count servers"],
    "answer": 1,
    "explanation": "Know what you have first."
  },
  {
    "prompt": "What's the main risk of resources built by hand during an incident?",
    "options": ["They're slower", "Nobody reviews or reproduces them, and they drift silently", "They cost more by design", "They can't be deleted"],
    "answer": 1,
    "explanation": "Unmanaged infrastructure is invisible to review."
  },
  {
    "prompt": "Which is the most urgent finding?",
    "options": ["A public CDN", "An unencrypted, unowned bucket holding customer order backups", "A load balancer in staging", "A dev box with an owner"],
    "answer": 1,
    "explanation": "Sensitive data, unprotected and unowned."
  }
]
```
