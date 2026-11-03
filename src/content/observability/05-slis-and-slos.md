---
title: SLIs and SLOs
minutes: 25
summary: Define service level indicators from what users experience, set objectives and error budgets, and measure Tallybook's August against them, including how much of the month's budget two mornings used.
---

## The problem

"Is the app reliable enough?" can't be answered with a feeling. Tallybook's customers can't send invoices when requests fail or crawl, and Tallybook's engineers can't ship features while firefighting. An agreed, measured target settles arguments in both directions: when to slow down and fix reliability, and when reliability is good enough to keep building.

## The concept

### SLI, SLO, error budget

- A **service level indicator** (SLI) measures what users experience, as a ratio of good events to all events. For example: the share of requests that succeed, or that finish in under one second.
- A **service level objective** (SLO) is the target for that ratio over a period: **99.9% of requests succeed, over 30 days**.
- The **error budget** is what's left: 0.1% of requests may fail. Spending it on releases and experiments is fine; running out means reliability work comes first.

![SLI (good events over all events) leads to an SLO (99.9% over 30 days) and an error budget (the remaining 0.1%); for 10 million requests a month, 10,000 may fail, about 43 minutes of full outage; budget left means ship, budget spent means reliability first](/images/courses/observability/error-budget.svg "SLI, SLO and the error budget, with example numbers.")

### Choose SLIs users would recognise

| SLI | Good event |
| :-- | :-- |
| Availability | request didn't return a 5xx error |
| Latency | request finished within 1 second |

Measure them where users meet the service (the load balancer or web tier), not deep inside.

### Pick realistic objectives

100% is the wrong target: it's impossible, and chasing it stops all change. Pick what users actually need, and what the system can achieve.

## Example

August's daily totals, measured at the web tier:

```python
import pandas as pd

daily = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/observability/daily_sli.csv", parse_dates=["date"])
daily["availability"] = 1 - daily["errors_5xx"] / daily["requests"]
daily["fast"] = 1 - daily["slow_requests"] / daily["requests"]

month = daily[["requests", "errors_5xx", "slow_requests"]].sum()
availability = 1 - month["errors_5xx"] / month["requests"]
fast = 1 - month["slow_requests"] / month["requests"]
print(f"August availability: {availability:.4%}   (SLO 99.9%)")
print(f"August requests under 1 s: {fast:.4%}   (SLO 99%)")
daily.sort_values("availability")[["date", "requests", "availability", "fast"]].head(4)
```

```text
August availability: 99.6917%   (SLO 99.9%)
August requests under 1 s: 98.9508%   (SLO 99%)
         date  requests  availability      fast
30 2026-08-31   8316694      0.979174  0.950193
27 2026-08-28   8198501      0.984194  0.958629
0  2026-08-01   1947225      0.999360  0.996685
28 2026-08-29   1997031      0.999361  0.996642
```

Both SLOs were missed for August. How much of the error budget did each day use?

```python
SLO = 0.999
budget = (1 - SLO) * month["requests"]          # failed requests allowed in August
daily["budget_used"] = daily["errors_5xx"] / budget
print(f"Error budget: {budget:,.0f} failed requests; used: {month['errors_5xx'] / budget:.0%}")
print(daily.sort_values("budget_used", ascending=False)[["date", "errors_5xx", "budget_used"]].head(3).round(3).to_string(index=False))
```

```text
Error budget: 118,739 failed requests; used: 308%
      date  errors_5xx  budget_used
2026-08-31      173205        1.459
2026-08-28      129583        1.091
2026-08-04        2802        0.024
```

The other 29 days together used about half the month's budget. Two month-end mornings used about two and a half budgets on their own. That makes the decision obvious: the month-end bulk job and the connection pool are the reliability work to do before anything else, and an error budget policy should say so in advance (lesson 9).

## Walkthrough

1. Run the cells. Recalculate August without the 28th and 31st. Would Tallybook have met both SLOs?
2. Compute a 28-day rolling availability. On which day did it first fall below 99.9%?
3. Why measure at the web tier rather than at the database?
4. Write Tallybook's SLOs (the task below).

## Practice

```answer
{
  "id": "obs-05-p1",
  "prompt": "What was August's **availability**? As a percentage, two decimal places.",
  "answer": 99.69,
  "tolerance": 0.006,
  "format": "number",
  "dataset": "observability",
  "files": ["daily_sli"],
  "pyVerify": "round(availability * 100, 2)",
  "hint": "The first line printed.",
  "required": true
}
```

```task
{
  "id": "obs-05-t1",
  "prompt": "Write Tallybook's **SLOs**: for each of **availability** and **latency**, one line giving the **SLI** (what counts as good), **where** it's measured, the **target** and the **window**. Add a line saying what happens when the **error budget** runs out.",
  "minutes": 6,
  "rows": 5,
  "placeholder": "Availability: ...",
  "rules": [
    { "label": "An availability line", "pattern": "availab" },
    { "label": "A latency line with a time threshold", "pattern": "latenc[^\\n]*\\d+\\s*(ms|s\\b|second)|\\d+\\s*(ms|second)[^\\n]*latenc" },
    { "label": "Targets as percentages", "pattern": "99(\\.\\d+)?\\s*%", "min": 2 },
    { "label": "A window (30 days, 28 days, rolling, month)", "pattern": "\\d+[- ]day|rolling|month" },
    { "label": "Where measured (web tier, load balancer)", "pattern": "web tier|load balancer|edge|where users" },
    { "label": "Error budget consequence", "pattern": "budget[^\\n]*(freeze|stop|pause|priorit|reliability)" }
  ],
  "sample": "Availability: the share of requests to the web tier that don't return a 5xx error; target 99.9% over a rolling 30 days.\nLatency: the share of requests to the web tier that complete within 1 second; target 99% over a rolling 30 days.\nError budget: when either budget is used up, feature releases pause except for fixes, and the team's next work is the reliability problem that used it.",
  "note": "Measuring at the web tier counts what customers actually saw, including failures the database never knew about.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "An SLO of 99.9% availability over 30 days with 10 million requests allows how many failures?",
    "options": ["100", "10,000", "1,000", "100,000"],
    "answer": 1,
    "explanation": "0.1% of 10 million."
  },
  {
    "prompt": "Why not set a 100% SLO?",
    "options": ["It's too easy", "It's impossible, and chasing it stops all change", "Customers don't care", "It's illegal"],
    "answer": 1,
    "explanation": "Pick what users need."
  },
  {
    "prompt": "What is an error budget for?",
    "options": ["Paying for errors", "Deciding when to prioritise reliability over new features", "Hiring", "Logging"],
    "answer": 1,
    "explanation": "Spend it deliberately; when it's gone, fix reliability."
  }
]
```
