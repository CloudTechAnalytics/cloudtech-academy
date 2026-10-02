---
title: Earned value
minutes: 25
summary: Measure a project's progress and spending honestly with earned value (planned value, earned value and actual cost), calculate schedule and cost performance, and forecast the final cost at week 10.
---

## The problem

At the week 10 meeting, the finance director said: "We've spent about ₦58 million of an ₦81.5 million budget, so we're fine." The operations manager said: "Most tasks are finished, so we're ahead." Both were wrong, and for the same reason: neither compared what was spent with what was **achieved** for that money, and with what **should** have been achieved by now.

**Earned value** does exactly that comparison, in naira.

## The concept

**Three numbers at the status date**

| Measure | Question | How |
| :-- | :-- | :-- |
| **Planned value (PV)** | what work should be done by now, in budget terms? | budget of the work scheduled up to today |
| **Earned value (EV)** | what work **is** done, in budget terms? | each task's budget × its % complete |
| **Actual cost (AC)** | what have we spent? | from the accounts |

**What they tell you**

| Measure | Formula | Meaning |
| :-- | :-- | :-- |
| Schedule variance | EV − PV | negative: behind schedule |
| Cost variance | EV − AC | negative: over budget |
| SPI | EV ÷ PV | below 1: less done than planned |
| CPI | EV ÷ AC | below 1: getting less than ₦1 of work per ₦1 spent |
| Estimate at completion (EAC) | budget ÷ CPI | final cost if spending efficiency stays the same |

The budget for all the work is the **budget at completion** (BAC).

## Example

Budgets from most likely durations, the baseline schedule from lesson 4, and the progress reported at the end of week 10 (working day 50):

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/project/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""}).set_index("task_id")
status = pd.read_csv(base + "weekly_status.csv")
STATUS_DAY, WEEK = 50, 10

# Baseline: earliest start of each task in the most likely plan.
es, ef = {}, {}
for t, row in tasks.iterrows():
    preds = [p for p in row["predecessors"].split(";") if p]
    es[t] = max((ef[p] for p in preds), default=0)
    ef[t] = es[t] + row["likely_days"]
tasks["budget"] = tasks["likely_days"] * tasks["daily_cost_ngn"]
planned_fraction = ((STATUS_DAY - pd.Series(es)) / tasks["likely_days"]).clip(0, 1)

now = status[status["week"] == WEEK].set_index("task_id")
tasks["pv"] = tasks["budget"] * planned_fraction
tasks["ev"] = tasks["budget"] * now["percent_complete"].reindex(tasks.index).fillna(0) / 100
tasks["ac"] = now["actual_cost_ngn"].reindex(tasks.index).fillna(0)

BAC, PV, EV, AC = tasks["budget"].sum(), tasks["pv"].sum(), tasks["ev"].sum(), tasks["ac"].sum()
SPI, CPI = EV / PV, EV / AC
print(f"BAC ₦{BAC:,.0f}   PV ₦{PV:,.0f}   EV ₦{EV:,.0f}   AC ₦{AC:,.0f}")
print(f"Schedule variance ₦{EV - PV:,.0f}   SPI {SPI:.2f}")
print(f"Cost variance     ₦{EV - AC:,.0f}   CPI {CPI:.2f}")
print(f"Estimate at completion ₦{BAC / CPI:,.0f}   variance at completion ₦{BAC - BAC / CPI:,.0f}")
```

```text
BAC ₦81,530,000   PV ₦55,610,000   EV ₦44,515,000   AC ₦57,648,000
Schedule variance ₦-11,095,000   SPI 0.80
Cost variance     ₦-13,133,000   CPI 0.77
Estimate at completion ₦105,583,319   variance at completion ₦-24,053,319
```

Less work is done than planned (SPI 0.80), and the work that is done cost far more than budgeted (CPI 0.77). If spending efficiency stays as it has been, the project finishes about ₦24 million over budget. Even the kinder forecast, where everything left is done at budget (AC + BAC − EV), is about ₦94.7 million. Where is the overspend?

```python
tasks["cost_variance"] = tasks["ev"] - tasks["ac"]
tasks.loc[tasks["ac"] > 0, ["name", "budget", "ev", "ac", "cost_variance"]].sort_values("cost_variance").head(5).round(0)
```

```text
name    budget          ev          ac  cost_variance
task_id
B4                       Import and clear racking   8000000   6880000.0  13000000.0     -6120000.0
B2       Fit-out works: floor, power and security  23750000  10925000.0  13338000.0     -2413000.0
C2             Buy laptops, scanners and printers   6500000   6500000.0   8775000.0     -2275000.0
A3            Obtain building and trading permits   2250000   2250000.0   3769000.0     -1519000.0
D1                             Hire depot manager   1800000   1800000.0   2193000.0      -393000.0
```

The racking import is the biggest overrun: it took longer than planned and was priced in dollars, paid after the naira weakened. The fit-out and the permits come next, because running longer means paying the contractor and the team for more days. The laptops, scanners and printers were also priced in dollars. Most of this is risks R01 and R02 in the register (lesson 8) happening, not a team spending carelessly.

## Walkthrough

1. Run the cells. Compute SPI and CPI for the Facilities phase alone.
2. Recompute EAC assuming the remaining work will be done at budget (EAC = AC + BAC − EV). Which forecast do you believe, and why?
3. Why can't "most tasks are finished" tell you whether you're ahead?
4. Explain the numbers to the finance director (the task below).

## Practice

```answer
{
  "id": "pmf-06-p1",
  "prompt": "What is the project's **CPI** at week 10? Two decimal places.",
  "answer": 0.77,
  "tolerance": 0.006,
  "format": "number",
  "dataset": "project",
  "files": ["tasks", "weekly_status"],
  "pyVerify": "round(CPI, 2)",
  "hint": "The CPI on the third line.",
  "required": true
}
```

```task
{
  "id": "pmf-06-t1",
  "prompt": "Reply to the finance director's \"we've spent less than the budget, so we're fine\" in 50 to 120 words, using **earned value**: what was **spent**, what was **earned**, the **CPI**, the **forecast final cost**, and the **main cause**.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "Spending less than the budget doesn't tell us ...",
  "rules": [
    { "label": "Mentions earned value or work done", "pattern": "earned|work (done|completed)|worth" },
    { "label": "Gives the CPI", "pattern": "cpi|0\\.\\d{2}" },
    { "label": "Gives a forecast final cost", "pattern": "(forecast|estimate|expect|final)[^.]*₦|₦[^.]*(forecast|at completion|final)" },
    { "label": "Names the cause (naira, dollar, imported, racking, laptops)", "pattern": "naira|dollar|import|racking|laptop|exchange" },
    { "label": "Between 50 and 120 words", "minWords": 50, "maxWords": 120 }
  ],
  "sample": "Spending less than the budget doesn't tell us we're fine, because we haven't done all the work yet. By week 10 we've spent about ₦58 million, but the work completed is worth only about ₦45 million at budgeted rates, a CPI of 0.77: we're getting about 77 kobo of work for every naira. If that continues, our forecast final cost is about ₦106 million against the ₦81.5 million budget; even if everything left goes to budget, about ₦95 million. The main causes are the delayed racking import and IT equipment priced in dollars after the naira weakened, and the permits and fit-out running longer than planned.",
  "note": "The final sentence matters: it points to a known risk, not to careless spending, which changes what the sponsor should do.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "EV is ₦40m and AC is ₦50m. What's the CPI?",
    "options": ["1.25", "0.8", "10", "0.5"],
    "answer": 1,
    "explanation": "EV ÷ AC: 80 kobo of work per naira spent."
  },
  {
    "prompt": "SPI is 0.9. What does it mean?",
    "options": ["10% over budget", "90% of the work planned by now has been done", "The project is 90% complete", "10% ahead"],
    "answer": 1,
    "explanation": "Behind schedule, in budget terms."
  },
  {
    "prompt": "Why is 'we've spent less than budget' not evidence of being on track?",
    "options": ["It is", "Spending must be compared with the work achieved and the work planned by now", "Budgets are always wrong", "Spending doesn't matter"],
    "answer": 1,
    "explanation": "That's what earned value adds."
  }
]
```
