---
title: The forecast
minutes: 35
summary: Turn week 10's progress into a forecast of the finish cost and the opening date, using the remaining work rather than a hopeful guess, and give the sponsor a range with a stated basis.
---

## The problem

You know where the project stands: behind, and over budget. The sponsor's next question is "so what will it finish at?" There are two tempting answers, and both are wrong. One is to say "we'll catch up", which assumes the problems of the past ten weeks will vanish. The other is to extrapolate a single index across the whole project, which assumes everything will go as badly as the worst part has.

A good forecast starts from **what's left to do**, says how fast it's likely to go, and gives a range. For cost, EVM supplies standard estimates at completion. For the date, you re-run the schedule on the remaining work.

## The concept

### Forecasting the cost: estimate at completion (EAC)

Three common versions, each with an assumption:

| EAC | Formula | Assumes |
| :-- | :-- | :-- |
| **Typical** | BAC ÷ CPI | The rest of the project costs as much per unit of work as so far |
| **Atypical** | AC + (BAC − EV) | The overrun so far was a one-off; the remaining work costs what was budgeted |
| **Re-estimate** | AC + a new bottom-up estimate of the work remaining | You know more now and have redone the estimate |

The **estimate to complete** is ETC = EAC − AC, and the **variance at completion** is VAC = BAC − EAC (negative: over budget at the end). When CPI has been stable or falling, the typical EAC is the safer planning figure. The atypical one is the best case.

### Forecasting the date: remaining work, re-scheduled

SPI isn't a date. To forecast the finish:

1. Mark each finished task as done (zero remaining duration).
2. For tasks in progress, estimate the **remaining** duration, either at the **planned rate** (the remaining percentage of the likely duration) or at the **rate actually achieved so far** (elapsed days ÷ percent done × percent left).
3. Leave tasks not started at their likely duration.
4. Run the critical path on what's left, and add the result to today's date (day 50).

The planned-rate forecast is the **hopeful** end of the range. The current-rate forecast is the **realistic** one when a task has genuinely been slower than planned.

![An invented cost forecast two ways and a date forecast at the planned and the current rate, reported as a range with its basis](/images/courses/pm-capstone/forecast-range.svg "Two cost forecasts and two date forecasts, each with its assumption.")

> [!TIP]
> Always give a forecast as a **range with its basis**: "19 to 26 March, depending on whether the analyser clearance speeds up." A single date invites a promise; a range with a reason invites a decision.

## Example

Set up, with the schedule function from lesson 3:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/lab/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""})
status = pd.read_csv(base + "weekly_status.csv")
START = np.datetime64("2026-11-02")
PROMISE_DAY = 91

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
    out["float"] = (out["ls"] - out["es"]).round(6)      # rounded: fractional durations leave tiny crumbs
    return out, end

def finish_date(days):
    return np.busday_offset(START, int(np.ceil(days)) - 1, roll="forward")

tasks["budget"] = tasks["likely_days"] * tasks["daily_cost_ngn"]
BAC = tasks["budget"].sum()
now = status[status["week"] == 10].set_index("task_id")
EV = (now["percent_complete"] / 100 * tasks.set_index("task_id").loc[now.index, "budget"]).sum()
AC = now["actual_cost_ngn"].sum()
CPI = EV / AC
```

The cost forecasts first:

```python
typical = BAC / CPI
atypical = AC + (BAC - EV)
print(f"BAC:                ₦{BAC:,.0f}")
print(f"Typical EAC (BAC/CPI): ₦{typical:,.0f}   over by ₦{typical - BAC:,.0f} ({typical / BAC - 1:.0%})")
print(f"Atypical EAC:          ₦{atypical:,.0f}   over by ₦{atypical - BAC:,.0f} ({atypical / BAC - 1:.0%})")
```

```text
BAC:                ₦90,750,000
Typical EAC (BAC/CPI): ₦120,337,860   over by ₦29,587,860 (33%)
Atypical EAC:          ₦107,924,000   over by ₦17,174,000 (19%)
```

Even the hopeful case is **₦17m over budget** because the overrun already happened. If the remaining work costs as much per unit as the work so far, the project finishes **₦29.6m over**, a third more than the sponsor approved. Neither includes a naira of the changes the sponsor is being asked to consider.

Now the date. Work out each task's **remaining duration** at the two rates, then reschedule what's left:

```python
first_week = status.groupby("task_id")["week"].min()

def remaining(rate):
    rem = {}
    for t, likely in zip(tasks["task_id"], tasks["likely_days"]):
        if t not in now.index:
            rem[t] = likely                                   # not started
            continue
        pc = now.loc[t, "percent_complete"] / 100
        elapsed = 5 * (10 - first_week[t] + 1)                  # days since it started reporting
        if pc >= 1:
            rem[t] = 0
        elif rate == "plan":
            rem[t] = likely * (1 - pc)                          # the rest at the planned pace
        else:
            rem[t] = elapsed * (1 - pc) / pc                    # the rest at the pace achieved so far
    return rem

for rate in ("plan", "current"):
    left, remaining_days = schedule(tasks, remaining(rate))
    finish_day = 50 + remaining_days
    print(f"At the {rate} rate: {remaining_days:.1f} days of work left, opening on {finish_date(finish_day)}"
          f" ({int(np.ceil(finish_day)) - PROMISE_DAY} working days after the promise)")
```

```text
At the plan rate: 49.2 days of work left, opening on 2027-03-19 (9 working days after the promise)
At the current rate: 54.7 days of work left, opening on 2027-03-26 (14 working days after the promise)
```

Whichever rate you take, the promised date is **gone**: the opening is somewhere between Friday 19 March and Friday 26 March, **9 to 14 working days after** the promise. The critical chain is unchanged (analyser import, installation, reagents, validation, inspection, trial run), and it starts with the one task that is behind.

```python
left, _ = schedule(tasks, remaining("current"))
print("Critical now:", " -> ".join(left.index[(left["float"] == 0) & (left["ef"] > left["es"])]))
```

```text
Critical now: B4 -> B5 -> E2 -> F1 -> F2 -> F3 -> F4
```

## Walkthrough

1. Set up the schedule function, BAC, EV, AC and CPI as in lesson 5.
2. Calculate the typical and atypical EAC, and the variance at completion for each.
3. Calculate each task's remaining duration at the **planned** rate.
4. Re-run the schedule on the remaining durations, and add the result to day 50.
5. Repeat at the **current** rate.
6. Compare each forecast with the promised day.
7. Write the forecast for the sponsor (the task below).

## Practice

```answer
{
  "id": "pmc-06-p1",
  "prompt": "What is the **typical EAC** (BAC ÷ CPI), rounded to the nearest naira?",
  "answer": 120337860,
  "format": "naira",
  "dataset": "lab",
  "files": ["tasks", "weekly_status"],
  "pyVerify": "int(round(typical))",
  "hint": "The second line of the cost cell.",
  "required": true
}
```

```answer
{
  "id": "pmc-06-p2",
  "prompt": "If the remaining work goes at the **planned rate**, on what date does the project finish? Type it as YYYY-MM-DD.",
  "answer": "2027-03-19",
  "format": "text",
  "accept": ["19 march 2027", "2027-03-19", "19/03/2027", "19/3/2027"],
  "dataset": "lab",
  "files": ["tasks", "weekly_status"],
  "pyVerify": "str(finish_date(50 + schedule(tasks, remaining('plan'))[1]))",
  "hint": "The first line of the date cell.",
  "required": true
}
```

```answer
{
  "id": "pmc-06-p3",
  "prompt": "At the **current rate**, how many working days **after the promised day** does the project finish?",
  "answer": 14,
  "format": "number",
  "dataset": "lab",
  "files": ["tasks", "weekly_status"],
  "pyVerify": "int(np.ceil(50 + schedule(tasks, remaining('current'))[1])) - PROMISE_DAY",
  "hint": "The number in brackets on the second line.",
  "required": true
}
```

```task
{
  "id": "pmc-06-t1",
  "prompt": "Write the **forecast** for the sponsor (80 to 170 words): the **opening date range** and its basis, the **cost forecast** with the assumption behind each version, how far the promised date is **missed**, and what you'd **not** want them to assume.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Starting from week 10's progress ...",
  "rules": [
    { "label": "Gives a date range (19 to 26 March)", "pattern": "19 March|2027-03-19" },
    { "label": "Gives the upper date (26 March)", "pattern": "26 March|2027-03-26" },
    { "label": "Says the promised date is missed", "pattern": "miss|late|after the promise|not (be )?(open|ready) (by|on) 8 March|cannot (open|meet)|won't (open|meet)" },
    { "label": "Gives a cost forecast (107.9 or 120.3 million)", "pattern": "107[.,]?9|120[.,]?3|107,9|120,3" },
    { "label": "States an assumption (rate, one-off, CPI)", "pattern": "assum|if the|at the (planned|current)|one-off|CPI" },
    { "label": "Says what not to assume (catch up, no changes)", "pattern": "catch up|recover|assum|not include|excludes|before (any )?changes|without (any )?changes" },
    { "label": "Between 80 and 170 words", "minWords": 80, "maxWords": 170 }
  ],
  "sample": "Starting from week 10's progress and rescheduling only the work that's left, the laboratory opens between Friday 19 March and Friday 26 March: 9 to 14 working days after the promised 8 March. The earlier date assumes the remaining analyser import goes at its planned pace; the later one assumes it continues at the pace achieved so far. For cost, if the rest of the project costs as budgeted, we finish about ₦17 million over, at ₦107.9 million; if it costs as much per unit of work as so far (CPI 0.75), we finish at ₦120.3 million, about ₦29.6 million over. Neither includes any of the pending change requests. I'd ask you not to assume we'll catch up: the critical chain starts with the analysers, and nothing in the progress so far suggests it will speed up unaided.",
  "note": "A range, a basis, and a warning against the hopeful reading. This is the paragraph a sponsor will quote, so every word in it must be defensible.",
  "hint": "Date range and basis, cost range and assumptions, what to avoid assuming.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "CPI is 0.75 and BAC is ₦100m. What is the typical EAC?",
    "options": ["₦75m", "₦100m", "About ₦133m", "₦125m"],
    "answer": 2,
    "explanation": "BAC ÷ CPI = 100 ÷ 0.75 ≈ 133."
  },
  {
    "prompt": "Why shouldn't the forecast date come from SPI?",
    "options": ["SPI is inaccurate", "SPI is in money terms and ignores the critical path; the date comes from rescheduling the remaining work", "SPI is always above 1", "Dates can't be forecast"],
    "answer": 1,
    "explanation": "A late task on the critical path matters more than the average progress across all tasks."
  },
  {
    "prompt": "Which is the most honest way to report the forecast?",
    "options": ["\"We'll open on 19 March\"", "\"19 to 26 March, depending on whether the analyser clearance speeds up\"", "\"As soon as possible\"", "\"On 8 March, as promised\""],
    "answer": 1,
    "explanation": "A range with its basis is defensible and shows what would change it."
  }
]
```
