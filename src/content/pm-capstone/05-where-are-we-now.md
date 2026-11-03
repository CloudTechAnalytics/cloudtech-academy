---
title: Where are we now?
minutes: 35
summary: Measure the project at the end of week 10 with earned value: what was planned, what has been earned and what has been spent, and which tasks explain the gap.
---

## The problem

The simulation said the plan was optimistic. Now look at what actually happened. The project is ten weeks in, and the sponsor's question is the oldest one in project management: **are we on schedule and on budget?** "Mostly" isn't an answer. "People are working hard" isn't an answer. "Behind, and over" might be, but only with numbers.

**Earned value management (EVM)** answers it with three figures in the same unit, naira: how much work was *planned* by now, how much has been *done*, and how much has been *spent*. The difference between them is what you manage.

## The concept

### The three measures

| Measure | Meaning | How |
| :-- | :-- | :-- |
| **PV** (planned value) | Budgeted cost of the work **planned** to be done by now | From the baseline schedule |
| **EV** (earned value) | Budgeted cost of the work **actually done** | % complete × each task's budget |
| **AC** (actual cost) | What has really been **spent** | From the project's accounts |

And the variances and indices that follow from them:

- **Schedule variance** SV = EV − PV (negative: behind). **SPI** = EV ÷ PV (below 1: behind).
- **Cost variance** CV = EV − AC (negative: over budget). **CPI** = EV ÷ AC (below 1: over budget).
- **BAC** (budget at completion) is the approved total budget.

![Planned value, earned value and actual cost curves for an invented project at week 10, showing it behind schedule and over budget, with SPI and CPI](/images/courses/pm-capstone/earned-value-curves.svg "PV, EV and AC: behind and over budget.")

EV is the key. It values progress at the **budgeted** price, so it doesn't matter how much was spent: a task that is 60% done has earned 60% of its budget, whatever it cost to get there.

### Two traps

- **Percent complete is a judgement.** "90% done" can stay 90% for weeks. Prefer measurable steps ("racking installed", "licence granted") to percentages where you can.
- **Spend isn't progress.** An overspend with little progress is a cost problem, not a pace problem. A project that has spent 77% of its budget on 58% of its work is in trouble, even if the spending looks "on schedule".

> [!NOTE]
> SPI in naira terms mixes tasks of very different sizes. It says how much budgeted work is done against plan, not how many days late the project is. The finish date comes from the schedule (lesson 6), not from SPI.

## Example

Load the plan and the weekly status, then rebuild the baseline schedule (the same function as lesson 3):

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/lab/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""})
status = pd.read_csv(base + "weekly_status.csv")

def schedule(tasks, durations):
    preds = {t: [p for p in ps.split(";") if p] for t, ps in zip(tasks["task_id"], tasks["predecessors"])}
    es, ef = {}, {}
    for t in tasks["task_id"]:
        es[t] = max((ef[p] for p in preds[t]), default=0)
        ef[t] = es[t] + durations[t]
    end = max(ef.values())
    ls, lf = {}, {}
    for t in reversed(list(tasks["task_id"])):
        successors = [s for s in tasks["task_id"] if t in preds[s]]
        lf[t] = min((ls[s] for s in successors), default=end)
        ls[t] = lf[t] - durations[t]
    out = pd.DataFrame({"es": es, "ef": ef, "ls": ls, "lf": lf})
    out["float"] = out["ls"] - out["es"]
    return out, end

tasks["budget"] = tasks["likely_days"] * tasks["daily_cost_ngn"]
plan, end = schedule(tasks, dict(zip(tasks["task_id"], tasks["likely_days"])))
BAC = tasks["budget"].sum()
print(f"BAC: ₦{BAC:,.0f}")
```

```text
BAC: ₦90,750,000
```

Planned value at the end of week 10 (working day 50) is the budget of the work the baseline schedule says should be done by then:

```python
def earned_value(week):
    day = week * 5
    # planned: the share of each task's baseline duration that has elapsed by now
    elapsed = (np.minimum(day, plan["ef"]) - plan["es"]).clip(lower=0)
    pv = (elapsed / tasks.set_index("task_id")["likely_days"] * tasks.set_index("task_id")["budget"]).sum()
    now = status[status["week"] == week].merge(tasks[["task_id", "budget"]], on="task_id")
    ev = (now["percent_complete"] / 100 * now["budget"]).sum()
    ac = now["actual_cost_ngn"].sum()
    return pv, ev, ac

pv, ev, ac = earned_value(10)
print(f"PV ₦{pv:,.0f}   EV ₦{ev:,.0f}   AC ₦{ac:,.0f}")
print(f"SV ₦{ev - pv:,.0f}   CV ₦{ev - ac:,.0f}")
print(f"SPI {ev / pv:.2f}   CPI {ev / ac:.2f}")
```

```text
PV ₦60,910,000   EV ₦52,675,000   AC ₦69,849,000
SV ₦-8,235,000   CV ₦-17,174,000
SPI 0.86   CPI 0.75
```

At the end of week 10, ₦60.9m of work should have been done and ₦52.7m has been. That's a **schedule index of 0.86**: 14% less work done than planned. But ₦69.8m has been spent to earn ₦52.7m of work: a **cost index of 0.75**. The project is behind **and** costs a third more than planned for the work it has done, which is a harder problem than either alone.

The trend matters as much as the snapshot:

```python
trend = pd.DataFrame([(w, *earned_value(w)) for w in range(2, 11, 2)], columns=["week", "PV", "EV", "AC"])
trend["SPI"] = (trend["EV"] / trend["PV"]).round(2)
trend["CPI"] = (trend["EV"] / trend["AC"]).round(2)
print(trend[["week", "SPI", "CPI"]].to_string(index=False))
```

```text
week  SPI  CPI
    2 0.96 0.96
    4 0.87 0.80
    6 0.87 0.79
    8 0.87 0.77
   10 0.86 0.75
```

Both indices are drifting down, and they haven't levelled off. Which tasks explain it?

```python
now = status[status["week"] == 10].merge(tasks[["task_id", "name", "budget"]], on="task_id")
now["earned"] = now["percent_complete"] / 100 * now["budget"]
now["cost_variance"] = now["earned"] - now["actual_cost_ngn"]
print(now.sort_values("cost_variance")[["task_id", "name", "percent_complete", "cost_variance"]].head(4).to_string(index=False))
```

```text
task_id                                       name  percent_complete  cost_variance
     B4             Import and clear the analysers                63     -7497000.0
     B2    Fit-out: floors, power and air handling                97     -4176000.0
     C2 Buy computers, scanners and label printers               100     -3100000.0
     A3                Obtain the facility licence               100     -1423000.0
```

Three tasks account for most of the overspend: importing the analysers (naira costs and customs), the fit-out and the computers. The analyser import is also the critical task, and only 63% done at the point where the plan expected it to be finished.

## Walkthrough

1. Rebuild the baseline schedule and calculate BAC.
2. Calculate PV, EV and AC at week 10 using the `earned_value()` function.
3. Calculate SV, CV, SPI and CPI.
4. Calculate the same for weeks 2, 4, 6, 8 and 10 and look at the trend.
5. Find the tasks with the largest cost variance.
6. Write the status summary (the task below).

## Practice

```answer
{
  "id": "pmc-05-p1",
  "prompt": "What is the **earned value (EV)** at the end of week 10, in naira?",
  "answer": 52675000,
  "format": "naira",
  "dataset": "lab",
  "files": ["tasks", "weekly_status"],
  "pyVerify": "int(round(ev))",
  "hint": "The first line of the earned value cell.",
  "required": true
}
```

```answer
{
  "id": "pmc-05-p2",
  "prompt": "What is the **SPI** at the end of week 10? Two decimal places.",
  "answer": 0.86,
  "format": "number",
  "dataset": "lab",
  "files": ["tasks", "weekly_status"],
  "pyVerify": "round(ev / pv, 2)",
  "hint": "EV divided by PV.",
  "required": true
}
```

```answer
{
  "id": "pmc-05-p3",
  "prompt": "What is the **CPI** at the end of week 10? Two decimal places.",
  "answer": 0.75,
  "format": "number",
  "dataset": "lab",
  "files": ["tasks", "weekly_status"],
  "pyVerify": "round(ev / ac, 2)",
  "hint": "EV divided by AC.",
  "required": true
}
```

```answer
{
  "id": "pmc-05-p4",
  "prompt": "Which task has the **largest cost overrun** (the most negative cost variance) at week 10? Type its ID.",
  "answer": "B4",
  "format": "text",
  "accept": ["b4"],
  "dataset": "lab",
  "files": ["tasks", "weekly_status"],
  "pyVerify": "now.sort_values('cost_variance')['task_id'].iloc[0]",
  "hint": "The first row of the last cell.",
  "required": true
}
```

```task
{
  "id": "pmc-05-t1",
  "prompt": "Write the **week 10 status summary** (70 to 160 words) for the sponsor: **PV, EV and AC**, what **SPI** and **CPI** say, the **trend**, and the **tasks** that explain it. Lead with the answer.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "At the end of week 10 the project is ...",
  "rules": [
    { "label": "Leads with behind schedule and over budget", "pattern": "behind|late|over budget|overspen|over cost" },
    { "label": "Gives EV (about 52.7 million)", "pattern": "52[.,]?7|52,675" },
    { "label": "Gives AC (about 69.8 or 69.9 million)", "pattern": "69[.,]?8|69,849" },
    { "label": "Gives SPI (0.86)", "pattern": "0\\.86|SPI" },
    { "label": "Gives CPI (0.75)", "pattern": "0\\.75|CPI" },
    { "label": "Mentions the trend", "pattern": "trend|falling|worse|declin|drift|deteriorat|week" },
    { "label": "Names a task that explains it (analysers/import/fit-out/computers)", "pattern": "analyser|import|fit-out|computers|B4|B2|C2" },
    { "label": "Between 70 and 160 words", "minWords": 70, "maxWords": 160 }
  ],
  "sample": "At the end of week 10 the project is behind schedule and over budget. Work worth ₦60.9 million was planned (PV) and ₦52.7 million has been earned (EV), so the schedule index (SPI) is 0.86. We have spent ₦69.8 million (AC) to earn that, so the cost index (CPI) is 0.75: each naira of budgeted work is costing about ₦1.33. Both indices have been falling since week 2 and haven't levelled off. Most of the overspend sits in three tasks: importing the analysers, which is 63% done and is the critical task; the fit-out; and the computers, bought at higher naira prices. I'll turn this into a forecast next, because the sponsor needs a date and a cost, not an index.",
  "note": "The status leads with the verdict, supports it with the numbers, and points at the tasks. The next question, always, is \"so what will it finish at?\"",
  "hint": "Verdict first. Then PV/EV/AC, SPI/CPI, trend and causes.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A task with a ₦10m budget is 60% complete and has cost ₦8m. What is its earned value?",
    "options": ["₦8m", "₦6m", "₦10m", "₦4m"],
    "answer": 1,
    "explanation": "EV = % complete × budget = 0.6 × ₦10m = ₦6m, regardless of what was spent."
  },
  {
    "prompt": "SPI is 0.86 and CPI is 0.75. What is the best description?",
    "options": ["Ahead of schedule, under budget", "Behind schedule and over budget", "On schedule, over budget", "Behind schedule, under budget"],
    "answer": 1,
    "explanation": "Both indices are below 1: less work done than planned, and more spent than earned."
  },
  {
    "prompt": "Why use earned value rather than comparing spend with the budget?",
    "options": ["It's simpler", "Spending less than budget could mean being efficient or just behind: EV measures what the money bought", "It's required by law", "It ignores cost"],
    "answer": 1,
    "explanation": "Spend against budget confuses cost with progress; EV separates them."
  }
]
```
