---
title: Cost governance and unit costs
minutes: 20
summary: Keep cloud costs under control after the clean-up, with ownership, budgets and alerts, and measure cost per unit of business (here, per thousand requests) so growth and waste can be told apart.
---

## The problem

A one-off clean-up saves money once. Six months later, without a process, the waste is back: new test servers, new snapshots, new untagged resources. And a rising bill on its own says nothing about whether Tallybook is wasting money or simply growing.

**FinOps** (cloud financial operations) is the practice of making cloud spending visible, owned and tied to business value, continuously.

## The concept

### Ownership and showback

Every resource has a team tag, and each team sees its own monthly cost (**showback**). Untagged resources are reported until they're claimed.

### Budgets and alerts

A monthly budget per team and environment, with alerts at, for example, 80% and 100%, and an alert on unusual daily spikes (the same control-limit idea as monitoring).

### Unit costs

Divide cost by a measure of business activity: cost per thousand requests, per invoice sent, per active customer. If the bill grows but unit cost stays flat or falls, the growth is the business growing. If unit cost rises, look for waste or a design problem.

### The review cycle

Monthly: review showback, unit costs and the waste report. Quarterly: review commitments, rightsizing and the architecture.

## Example

Unit cost of the production web service: production cost per thousand web requests, by day, for August:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/cloud/"
billing = pd.read_csv(base + "billing.csv", parse_dates=["date"])
traffic = pd.read_csv(base + "web_traffic.csv", parse_dates=["hour"])

prod = billing[(billing["environment"] == "production") & (billing["date"].dt.month == 8)].groupby("date")["cost_usd"].sum()
requests = traffic.groupby(traffic["hour"].dt.normalize())["requests"].sum()
unit = pd.DataFrame({"prod_cost_usd": prod, "requests": requests})
unit["usd_per_1000_requests"] = unit["prod_cost_usd"] / unit["requests"] * 1000
print("August average: $", round(unit["prod_cost_usd"].sum() / unit["requests"].sum() * 1000, 4), "per 1,000 requests")
unit["weekday"] = unit.index.day_name()
unit.groupby("weekday")["usd_per_1000_requests"].mean().round(4).sort_values()
```

```text
August average: $ 0.3586 per 1,000 requests
weekday
Friday       0.2804
Monday       0.2905
Tuesday      0.3033
Wednesday    0.3134
Thursday     0.3145
Saturday     0.6761
Sunday       0.7038
Name: usd_per_1000_requests, dtype: float64
```

Weekends cost far more per request: the fixed fleet runs at full price for half the traffic. That's the autoscaling saving from lesson 6, seen from the business side. Now showback by team for August, including the untagged spend:

```python
aug = billing[billing["date"].dt.month == 8]
showback = aug.groupby(aug["team"].fillna("UNTAGGED"))["cost_usd"].sum().round(2).sort_values(ascending=False)
showback
```

```text
team
platform     3725.31
UNTAGGED      901.79
invoicing     670.02
payments      348.56
marketing       0.94
Name: cost_usd, dtype: float64
```

## Walkthrough

1. Run the cells. Which day in August had the lowest cost per thousand requests, and why?
2. Set a monthly budget for each team, 10% above its August spend, and an alert at 80%.
3. Choose a better unit for Tallybook's business than requests (invoices sent? paying customers?) and say what data you'd need.
4. Write the governance policy (the task below).

## Practice

```answer
{
  "id": "cld-09-p1",
  "prompt": "What was the August average production cost per **1,000 requests**, in dollars? Four decimal places.",
  "answer": 0.3586,
  "tolerance": 0.00006,
  "format": "number",
  "dataset": "cloud",
  "files": ["billing", "web_traffic"],
  "pyVerify": "round(unit['prod_cost_usd'].sum() / unit['requests'].sum() * 1000, 4)",
  "hint": "The first line printed.",
  "required": true
}
```

```task
{
  "id": "cld-09-t1",
  "prompt": "Write Tallybook's **cloud cost governance policy**, one rule per line starting with a dash: at least **five** rules covering **tags**, **budgets and alerts**, a **unit cost**, the **monthly review**, and **who owns** what.",
  "minutes": 6,
  "rows": 7,
  "placeholder": "- Tags: ...",
  "rules": [
    { "label": "At least five rules, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 5 },
    { "label": "Required tags", "pattern": "tag" },
    { "label": "Budgets with alert thresholds", "pattern": "budget[^\\n]*\\d+\\s*%|alert[^\\n]*\\d+\\s*%" },
    { "label": "A unit cost", "pattern": "per (1,?000|thousand|invoice|customer|request)|unit cost" },
    { "label": "A monthly review", "pattern": "month" },
    { "label": "Ownership (team lead, owner, finance)", "pattern": "owner|team lead|finance|cto|responsible" }
  ],
  "sample": "- Tags: every resource must have team and environment tags; untagged resources are listed weekly and stopped after 14 days if unclaimed.\n- Budgets: each team has a monthly budget, with alerts to the team lead at 80% and 100%, and a daily spike alert above the 28-day mean + 3 SD.\n- Unit cost: we track production cost per 1,000 requests and per invoice sent, and investigate any month it rises by more than 10%.\n- Monthly review: the CTO, finance and team leads review showback, unit costs and the waste report in the first week of each month.\n- Ownership: each team lead owns their team's spend; the platform lead owns shared costs, commitments and the quarterly rightsizing review.",
  "note": "Rules with numbers and names are enforceable. 'Keep costs down' isn't.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The bill rose 20% while cost per 1,000 requests fell 5%. What does that suggest?",
    "options": ["Waste is growing", "The business grew faster than costs, and efficiency improved", "A billing error", "Nothing"],
    "answer": 1,
    "explanation": "Unit costs separate growth from waste."
  },
  {
    "prompt": "What is showback?",
    "options": ["Refunds from the provider", "Showing each team its own cloud costs, so spending has owners", "A type of server", "A backup"],
    "answer": 1,
    "explanation": "Visibility creates accountability."
  },
  {
    "prompt": "Why do weekend requests cost more each at Tallybook?",
    "options": ["Weekend prices are higher", "The fixed fleet costs the same while traffic halves", "Data transfer is dearer", "Engineers work weekends"],
    "answer": 1,
    "explanation": "Fixed capacity with variable demand raises unit cost in quiet periods."
  }
]
```
