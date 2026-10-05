---
title: Reading the cloud bill
minutes: 25
summary: Break a cloud bill down by service, environment and team, find the spend nobody owns, see what it costs in naira, and explain why it grew.
---

## The problem

Tallybook's cloud bill arrives as one dollar total each month. The finance director wants answers in plain language: what are we paying for, which team is spending it, and why is it going up?

Cloud providers give you far more than a total. Every resource's cost, every day, can be downloaded as a detailed billing export. It's only useful if the resources are **tagged** with who owns them.

## The concept

### The billing export

One row per resource per day (or hour), with the service, the cost, and any **tags** (labels such as `environment=production` and `team=invoicing`) attached to the resource.

### Allocate the cost

Group by service (what), environment (why) and team (who). Spend with no team tag is **unallocated**: nobody is accountable for it, and it's often where waste hides.

### Watch the currency

Cloud is billed in dollars. For a Nigerian company earning in naira, the naira cost can rise even when usage doesn't, so budgets should state the exchange rate they assume.

### Explain growth

Break the change between two months into its parts: which services, environments and teams grew, and whether it came from new resources or from more usage of existing ones.

## Example

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/cloud/"
billing = pd.read_csv(base + "billing.csv", parse_dates=["date"])
billing["month"] = billing["date"].dt.strftime("%Y-%m")

USD_TO_NGN = 1_550   # an assumed exchange rate, for illustration
monthly = billing.groupby("month")["cost_usd"].sum()
print(pd.DataFrame({"usd": monthly.round(0), "naira": (monthly * USD_TO_NGN).round(-3)}))

aug = billing[billing["month"] == "2026-08"]
aug.groupby("service")["cost_usd"].sum().sort_values(ascending=False).round(0)
```

```text
usd      naira
month
2026-06  4908.0  7608000.0
2026-07  5462.0  8465000.0
2026-08  5647.0  8752000.0
service
Compute             2381.0
Data transfer       1334.0
Block storage        831.0
Managed database     506.0
Snapshots            329.0
Object storage       218.0
Load balancing        37.0
Public IPs            11.0
Name: cost_usd, dtype: float64
```

Compute is the biggest item, but data transfer (traffic leaving the cloud to users' phones and browsers) is second, ahead of the database. Now who owns the August spend:

```python
by_team = aug.groupby(aug["team"].fillna("(no team tag)"))["cost_usd"].sum().sort_values(ascending=False)
print((by_team / by_team.sum()).round(3))
pd.crosstab(aug["environment"].fillna("(none)"), aug["service"], values=aug["cost_usd"], aggfunc="sum").round(0).fillna(0)
```

```text
team
platform         0.660
(no team tag)    0.160
invoicing        0.119
payments         0.062
marketing        0.000
Name: cost_usd, dtype: float64
service      Block storage  Compute  Data transfer  Load balancing  Managed database  Object storage  Public IPs  Snapshots
environment
(none)               204.0     74.0            0.0             0.0               0.0             0.0        11.0        0.0
development          326.0    818.0            0.0             0.0               0.0            14.0         0.0      125.0
production           153.0   1265.0         1334.0            19.0             335.0           204.0         0.0      181.0
staging              148.0    223.0            0.0            19.0             171.0             0.0         0.0       23.0
```

About a sixth of August's spend has no team tag: no one would notice if it doubled. Finally, why the bill grew from June to August:

```python
growth = billing[billing["month"].isin(["2026-06", "2026-08"])].pivot_table(index="service", columns="month", values="cost_usd", aggfunc="sum").fillna(0)
growth["change"] = growth["2026-08"] - growth["2026-06"]
growth.sort_values("change", ascending=False).round(0)
```

```text
month             2026-06  2026-08  change
service
Data transfer      1020.0   1334.0   314.0
Compute            2088.0   2381.0   293.0
Block storage       774.0    831.0    56.0
Snapshots           279.0    329.0    50.0
Managed database    490.0    506.0    16.0
Object storage      211.0    218.0     7.0
Load balancing       36.0     37.0     1.0
Public IPs           11.0     11.0     0.0
```

Some growth is just calendar: August has 31 days to June's 30. The rest comes mostly from compute (new development machines in July) and data transfer (more traffic, especially at month-end).

## Walkthrough

1. Run the cells. Find the development VMs created in July. What do they add to the monthly bill?
2. Work out the cost per day for each month, to remove the effect of month length.
3. Recalculate the naira cost with an exchange rate 15% higher. What does that do to the annual budget?
4. Write the bill summary for the finance director (the task below).

## Practice

```answer
{
  "id": "cld-02-p1",
  "prompt": "What was the **August** cloud bill, in dollars? Round to the nearest dollar.",
  "answer": 5647,
  "tolerance": 1,
  "format": "number",
  "dataset": "cloud",
  "files": ["billing"],
  "pyVerify": "round(monthly['2026-08'])",
  "hint": "The 2026-08 row of the first table.",
  "required": true
}
```

```answer
{
  "id": "cld-02-p2",
  "prompt": "What share of August's spend has **no team tag**? As a percentage, one decimal place.",
  "answer": 16.0,
  "format": "percent",
  "dataset": "cloud",
  "files": ["billing"],
  "pyVerify": "round(by_team['(no team tag)'] / by_team.sum() * 100, 1)",
  "hint": "The (no team tag) share.",
  "required": true
}
```

```task
{
  "id": "cld-02-t1",
  "prompt": "Write the **bill summary** for the finance director (50 to 120 words): the August total in dollars **and naira** (with the exchange rate you assumed), the **two biggest services**, the **untagged** share, and **why** the bill grew since June.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "In August, Tallybook's cloud bill was ...",
  "rules": [
    { "label": "A dollar figure", "pattern": "\\$\\s?[\\d,]+" },
    { "label": "A naira figure", "pattern": "₦\\s?[\\d,.]+|naira" },
    { "label": "States the exchange rate assumed", "pattern": "exchange rate|₦\\s?[\\d,]+\\s*(to|per|/)\\s*(the |a )?(\\$|dollar)" },
    { "label": "Names compute and data transfer", "pattern": "compute[\\s\\S]*data transfer|data transfer[\\s\\S]*compute" },
    { "label": "Mentions untagged spend", "pattern": "untagged|no team|not tagged|unallocated" },
    { "label": "Between 50 and 120 words", "minWords": 50, "maxWords": 120 }
  ],
  "sample": "In August, Tallybook's cloud bill was about $5,650, or about ₦8.8 million at an assumed exchange rate of ₦1,550 to the dollar. The two biggest items were compute (servers), at about $2,400, and data transfer to users, at about $1,300. About 16% of the spend has no team tag, so no one is accountable for it. The bill grew by about $740 since June: partly because August is a day longer, but mostly from four development servers added in July and from more traffic, especially at month-end.",
  "note": "Stating the exchange rate makes the naira figure checkable, and shows how much of a future rise could come from the currency rather than usage.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What makes cloud spend allocatable to teams?",
    "options": ["The provider's invoice total", "Tags on each resource, such as team and environment", "The region", "The exchange rate"],
    "answer": 1,
    "explanation": "Untagged resources can't be allocated, so no one owns their cost."
  },
  {
    "prompt": "The naira cost rose 12% but dollar usage was flat. What happened?",
    "options": ["More servers", "The exchange rate moved", "A billing error", "More customers"],
    "answer": 1,
    "explanation": "Dollar-billed costs carry currency risk."
  },
  {
    "prompt": "Why compare cost per day rather than cost per month?",
    "options": ["Days are simpler", "Months have different lengths, which changes totals with no change in usage", "Providers bill daily", "It's always smaller"],
    "answer": 1,
    "explanation": "Remove calendar effects before explaining growth."
  }
]
```
