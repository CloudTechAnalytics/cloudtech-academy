---
title: Availability and SLOs
minutes: 25
summary: Measure availability against a target, calculate how components in series and in parallel combine, and find which single change would remove most of the downtime.
---

## The problem

Tallybook promises customers that the app is available "99.9% of the time". Over June, July and August, there were six outages. Nobody had added them up against the promise, and nobody could say which change would prevent the most downtime: more web servers, a better deployment process, or a different database setup.

## The concept

**SLOs and error budgets**

A **service level objective** (SLO) is an availability target, such as 99.9% a month. The allowed downtime is the **error budget**: 0.1% of a 30-day month is 43.2 minutes. When the budget is spent, reliability work takes priority over new features.

**Components in series**

If the app needs the load balancer **and** the web tier **and** the API **and** the database, its availability is the **product** of theirs. Every component in the chain lowers the total.

**Components in parallel**

If any one of several redundant copies is enough, the chance they're all down at once is the **product of their unavailabilities**. Two copies at 99.5% each give 1 − 0.005² = 99.9975%.

**Single points of failure**

A component with no redundancy (one database in one zone) often dominates downtime, no matter how many web servers you add.

## Example

Downtime by month against a 99.9% SLO:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/cloud/"
outages = pd.read_csv(base + "outages.csv", parse_dates=["start"])
outages["month"] = outages["start"].dt.strftime("%Y-%m")

minutes_in_month = {"2026-06": 30 * 1440, "2026-07": 31 * 1440, "2026-08": 31 * 1440}
monthly = outages.groupby("month")["minutes"].sum().to_frame("downtime_min")
monthly["budget_min"] = [round(minutes_in_month[m] * 0.001, 1) for m in monthly.index]
monthly["availability_pct"] = [round(100 * (1 - d / minutes_in_month[m]), 3) for m, d in zip(monthly.index, monthly["downtime_min"])]
print(monthly)
outages.groupby("component")["minutes"].sum().sort_values(ascending=False)
```

```text
downtime_min  budget_min  availability_pct
month
2026-06            69        43.2            99.840
2026-07            86        44.6            99.807
2026-08           102        44.6            99.772
component
Database         102
Web              102
Load balancer     31
API               22
Name: minutes, dtype: int64
```

Tallybook missed its target every month. The database and the web tier at month-end account for most of the downtime. Now the design arithmetic, with illustrative availabilities for each component:

```python
def series(*parts):
    total = 1.0
    for p in parts:
        total *= p
    return total

def parallel(p, copies):
    return 1 - (1 - p) ** copies

LB, SERVER, DB_SINGLE_ZONE, DB_MULTI_ZONE = 0.9999, 0.995, 0.995, 0.9995   # illustrative

designs = {
    "now: 6 web, 4 API, single-zone DB": series(LB, parallel(SERVER, 6), parallel(SERVER, 4), DB_SINGLE_ZONE),
    "multi-zone DB": series(LB, parallel(SERVER, 6), parallel(SERVER, 4), DB_MULTI_ZONE),
    "multi-zone DB, 2 web, 2 API": series(LB, parallel(SERVER, 2), parallel(SERVER, 2), DB_MULTI_ZONE),
}
for name, a in designs.items():
    print(f"{name}: {a:.5%}  (about {(1 - a) * 30 * 1440:.0f} minutes down in a 30-day month)")
```

```text
now: 6 web, 4 API, single-zone DB: 99.49005%  (about 220 minutes down in a 30-day month)
multi-zone DB: 99.94000%  (about 26 minutes down in a 30-day month)
multi-zone DB, 2 web, 2 API: 99.93501%  (about 28 minutes down in a 30-day month)
```

With a single-zone database, the design can't reach 99.9% however many servers it has: the database alone allows more downtime than the whole budget. A multi-zone database (a standby copy in a second zone that takes over automatically) moves the design comfortably past the target. Notice too that the month-end outages weren't a design-availability problem at all: every server was up, there just weren't enough of them (lesson 6).

## Walkthrough

1. Run the cells. Which outages would a multi-zone database have prevented?
2. Which outage would a gradual deployment (one server at a time) have prevented? Which would certificate expiry alerts have prevented?
3. Calculate the availability with 3 API servers instead of 4. Does it matter?
4. Write the reliability plan (the task below).

## Practice

```answer
{
  "id": "cld-07-p1",
  "prompt": "How many minutes of downtime did Tallybook have in **August**?",
  "answer": 102,
  "format": "number",
  "dataset": "cloud",
  "files": ["outages"],
  "pyVerify": "int(monthly.loc['2026-08', 'downtime_min'])",
  "hint": "The 2026-08 row.",
  "required": true
}
```

```answer
{
  "id": "cld-07-p2",
  "prompt": "What is the error budget for a **30-day** month at 99.9%, in minutes? One decimal place.",
  "answer": 43.2,
  "tolerance": 0.05,
  "format": "number",
  "dataset": "cloud",
  "files": ["outages"],
  "pyVerify": "round(30 * 1440 * 0.001, 1)",
  "hint": "0.1% of 30 × 1,440 minutes.",
  "required": true
}
```

```task
{
  "id": "cld-07-t1",
  "prompt": "Write the **reliability plan**: one line per outage cause starting with a dash, each naming the **change** that prevents it and how much **downtime** it would have saved over the three months.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "- Database: ...",
  "rules": [
    { "label": "At least four lines, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 4 },
    { "label": "Multi-zone database", "pattern": "multi[- ]zone|second zone|standby" },
    { "label": "Autoscaling or capacity for month-end", "pattern": "autoscal|scheduled scaling|capacity" },
    { "label": "Safer deployment (gradual, one server, canary, rollback)", "pattern": "gradual|one (server )?at a time|canary|roll ?back|staged" },
    { "label": "Certificate renewal or expiry alert", "pattern": "certificate|tls|ssl" },
    { "label": "Minutes saved", "pattern": "\\d+\\s*min", "min": 3 }
  ],
  "sample": "- Database: move to a multi-zone database with automatic failover; prevents both database outages, 102 minutes.\n- Month-end overload: autoscaling with scheduled scaling before month-end (lesson 6); prevents 102 minutes.\n- Faulty release: deploy to one API server at a time with automatic rollback on errors; prevents 22 minutes.\n- Expired certificate: use automatically renewed certificates and alert 30 days before any expiry; prevents 31 minutes.\nTogether these remove all 257 minutes of downtime from the three months.",
  "note": "Ordering by minutes saved shows where the money and effort should go first.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Four components each 99.9% available, all needed (in series). Roughly what's the total?",
    "options": ["99.9%", "About 99.6%", "99.99%", "100%"],
    "answer": 1,
    "explanation": "Multiply: 0.999⁴ ≈ 0.996."
  },
  {
    "prompt": "Two redundant servers, each 99.5% available. What's the chance both are down?",
    "options": ["0.5%", "0.0025%", "1%", "99%"],
    "answer": 1,
    "explanation": "0.005 × 0.005 = 0.000025."
  },
  {
    "prompt": "What happens when the error budget is spent?",
    "options": ["Nothing", "Reliability work takes priority over new features until it recovers", "The SLO is raised", "Customers are refunded automatically"],
    "answer": 1,
    "explanation": "The budget turns reliability into a planning rule."
  }
]
```
