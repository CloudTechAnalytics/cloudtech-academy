---
title: "Final project: Tallybook's cloud review"
minutes: 20
summary: Plan your final project, a cost, reliability and security review of a real-looking cloud estate, with every saving and risk measured and a 90-day plan the leadership can approve.
---

## The problem

Tallybook's CTO and finance director want one document: what the company should change in its cloud, in what order, what it will save, and what it will fix. They'll share it with investors, who have asked how Tallybook will keep cloud costs under control as it grows, and whether the month-end outages will happen again.

Your final project is that review, built from the data in this course.

## The concept

### The parts of the review

| Part | Built in |
| :-- | :-- |
| The bill explained: services, environments, teams, untagged spend, growth | lesson 2 |
| Savings: clean-up, rightsizing, schedules, pricing models | lessons 3 to 5 |
| Scaling for month-end | lesson 6 |
| Reliability: SLO, error budget, design changes | lesson 7 |
| Security findings and fixes | lesson 8 |
| Governance and unit costs | lesson 9 |

**Don't double-count savings.** Apply them in order: remove waste first, then rightsize what's left, then schedule, then commit to what remains. Each step's saving is calculated on what the previous step left.

## Example

A savings summary that applies the steps in order (monthly, in dollars, illustrative prices):

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/cloud/"
resources = pd.read_csv(base + "resources.csv", parse_dates=["created_date"])
util = pd.read_csv(base + "utilisation.csv")
traffic = pd.read_csv(base + "web_traffic.csv")
H = 730

vms = resources[(resources["type"] == "vm") & (resources["status"] == "running")].copy()
cpu = util.groupby("resource_id")["cpu_pct"].agg(p95=lambda x: x.quantile(0.95), peak="max")
vms = vms.join(cpu, on="resource_id")

idle = vms["peak"] < 5
steps = {"1. remove idle servers": (vms.loc[idle, "hourly_usd"] * H).sum()}
vms = vms[~idle]
api = vms["name"].str.startswith("prod-api")
steps["2. rightsize API servers (xlarge to large)"] = (api.sum() * (0.20 - 0.10)) * H
vms.loc[api, "hourly_usd"] = 0.10
dev = vms["name"].str.startswith("dev-")
steps["3. schedule development servers"] = (vms.loc[dev, "hourly_usd"] * (H - 11 * 21)).sum()
web_auto = np.maximum(2, np.ceil(traffic["requests"] / 5_400)).sum()
steps["4. autoscale web servers"] = (6 * 744 - web_auto) * 0.10 * H / 744
steps["5. commit 1 year: API servers and 2 web servers (35%)"] = (vms.loc[api, "hourly_usd"].sum() + 2 * 0.10) * H * 0.35

savings = pd.Series(steps).round(2)
print(savings)
print("Total monthly saving: $", round(savings.sum(), 2))
```

```text
1. remove idle servers                                   292.00
2. rightsize API servers (xlarge to large)               292.00
3. schedule development servers                          399.20
4. autoscale web servers                                 189.86
5. commit 1 year: API servers and 2 web servers (35%)    153.30
dtype: float64
Total monthly saving: $ 1326.36
```

Add the clean-up of disks, IP addresses and snapshots from lesson 4 to complete the picture, and compare the total with the August bill.

## Walkthrough

1. Complete the savings table with storage clean-up, and express it as a share of the August bill and in naira (with your assumed rate).
2. Add the reliability changes and their costs: a multi-zone database costs roughly twice a single-zone one.
3. Rank the security fixes by risk.
4. Open the project brief on the course page and plan the write-up.

## Practice

```dataset
{"dataset": "cloud", "files": ["resources", "billing", "utilisation", "web_traffic", "outages", "access"]}
```

```answer
{
  "id": "cld-10-p1",
  "prompt": "What is the **total monthly saving** from the five steps, in dollars? Two decimal places.",
  "answer": 1326.36,
  "tolerance": 0.01,
  "format": "number",
  "dataset": "cloud",
  "files": ["resources", "utilisation", "web_traffic"],
  "pyVerify": "round(savings.sum(), 2)",
  "hint": "The last line printed.",
  "required": true
}
```

```task
{
  "id": "cld-10-t1",
  "prompt": "Write the **executive summary** of your cloud review (100 to 200 words): the **monthly saving** and its share of the bill, the **reliability** changes and the SLO, the **security** priorities, and the **governance** that keeps it working, ending with a **90-day** plan.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Tallybook can cut its cloud bill by ...",
  "rules": [
    { "label": "A dollar saving", "pattern": "\\$\\s?[\\d,]+" },
    { "label": "A share of the bill", "pattern": "\\d+(\\.\\d+)?\\s*%" },
    { "label": "Reliability (SLO, availability, multi-zone, autoscaling)", "pattern": "slo|availab|multi[- ]zone|autoscal|99\\.9" },
    { "label": "Security (MFA, public, keys, access)", "pattern": "mfa|public|key|access|admin" },
    { "label": "Governance (tags, budgets, unit cost, review)", "pattern": "tag|budget|unit cost|review|showback" },
    { "label": "A 90-day plan", "pattern": "90[- ]day|90 days|three months|first month" },
    { "label": "Between 100 and 200 words", "minWords": 100, "maxWords": 200 }
  ],
  "sample": "Tallybook can cut its cloud bill by about $1,300 a month, nearly a quarter of August's $5,650, plus about $640 more by removing forgotten storage, without removing anything customers use: delete idle servers and forgotten storage, halve the oversized API servers, stop development servers at night and weekends, autoscale the web servers and commit for a year to the steady baseline. The same autoscaling fixes the month-end overloads, and moving the database to multiple zones removes the biggest cause of downtime, which together would have kept Tallybook within its 99.9% availability target in all three months. The most urgent security fixes are a public bucket of customer files, accounts of people who have left, six people without MFA and access keys over two years old. To keep costs under control as Tallybook grows, every resource will carry an owner tag, each team gets a budget with alerts, and we will track cost per thousand requests monthly. 90-day plan: security fixes and clean-up in the first two weeks; rightsizing, schedules and autoscaling in the first month; the multi-zone database in month two; commitments and the first quarterly review in month three.",
  "note": "The order of the 90-day plan follows risk first, then quick savings, then the changes that need testing.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why apply savings steps in order (waste, rightsizing, schedules, commitments)?",
    "options": ["It looks tidy", "Each step changes what the next applies to, so adding them independently double-counts", "Providers require it", "To delay savings"],
    "answer": 1,
    "explanation": "Never commit to, or rightsize, what you're about to delete."
  },
  {
    "prompt": "Which fix comes first in a 90-day plan?",
    "options": ["Signing a 3-year commitment", "Closing the public bucket of customer files and disabling leavers' access", "Changing the region", "Buying bigger servers"],
    "answer": 1,
    "explanation": "Active risks before savings."
  },
  {
    "prompt": "What makes a cloud review credible to investors?",
    "options": ["Long lists of services", "Every saving and risk measured from the account's own data, with a dated plan", "Promises", "Vendor brochures"],
    "answer": 1,
    "explanation": "Measured evidence and a plan."
  }
]
```
