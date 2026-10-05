---
title: Forecasting from progress
minutes: 25
summary: Re-forecast the opening date from what has actually happened (finished tasks, work in progress and what's left), compare it with the deadline, and set an honest red, amber or green status.
---

## The problem

The baseline schedule said the depot would open on 11 September. It's now the end of week 10. The permits took longer than planned, and the fit-out started late and is only 46% done. The sponsor doesn't want to hear about the baseline any more: they want to know when the depot will **actually** open, based on where the project **is**.

## The concept

### Re-forecasting

From the status date, schedule only what's left:

- finished tasks take no more time;
- tasks in progress need their **remaining** work;
- tasks not started need their full estimate;
- nothing can finish before the status date.

### Which rate for remaining work?

| Assumption | Use when |
| :-- | :-- |
| Remaining work goes to plan | the cause of the delay is over (the permits are granted) |
| Remaining work goes at the rate so far | the cause is still there (the contractor is slow) |
| Re-estimate with the team | always worth doing for critical tasks |

### Red, amber, green

A status colour is only useful with clear rules, for example:

- **Green**: forecast meets the deadline with at least 5 days to spare, and CPI ≥ 0.95.
- **Amber**: forecast meets the deadline with less than 5 days to spare, or CPI between 0.90 and 0.95.
- **Red**: forecast misses the deadline, or CPI below 0.90.

![Re-forecasting from the status date: finished tasks need nothing, an in-progress task needs its remaining work, tasks not started need their full estimate; below, the green, amber and red rules](/images/courses/pm/forecast.svg "Schedule only what's left from the status date; status colours need clear rules.")

## Example

Forecast from week 10, assuming the remaining work goes to plan:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/project/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""}).set_index("task_id")
status = pd.read_csv(base + "weekly_status.csv")
START, STATUS_DAY = np.datetime64("2026-06-01"), 50
DEADLINE_DAYS = int(np.busday_count(START, np.datetime64("2026-09-30")) + 1)

pct = status[status["week"] == 10].set_index("task_id")["percent_complete"].reindex(tasks.index).fillna(0)
print("Finished:", list(pct.index[pct == 100]))
print("In progress:", {t: int(p) for t, p in pct.items() if 0 < p < 100})

def forecast_end(remaining):
    finish = {}
    for t, row in tasks.iterrows():
        preds = [p for p in row["predecessors"].split(";") if p]
        start = max([STATUS_DAY] + [finish[p] for p in preds])
        finish[t] = start + remaining[t]
    return finish

to_plan = tasks["likely_days"] * (1 - pct / 100)
finish = forecast_end(to_plan)
end = finish["F3"]
print(f"Forecast opening: working day {end:.1f}, {np.busday_offset(START, int(np.ceil(end)) - 1)}")
print(f"Deadline: working day {DEADLINE_DAYS}, days to spare: {DEADLINE_DAYS - end:.1f}")
```

```text
Finished: ['A1', 'A2', 'A3', 'B1', 'B3', 'C1', 'C2', 'C4', 'D1', 'D2', 'E1', 'E3']
In progress: {'B2': 46, 'B4': 86}
Forecast opening: working day 85.5, 2026-09-28
Deadline: working day 88, days to spare: 2.5
```

Even if everything left goes exactly to plan, the opening has very little room. The fit-out is the problem. It's been going slower than planned; if it carries on at its current rate:

```python
first_week = status[status["task_id"] == "B2"]["week"].min()
elapsed = STATUS_DAY - (first_week - 1) * 5
rate_per_day = pct["B2"] / 100 / elapsed
print(f"Fit-out: {pct['B2']:.0f}% done in about {elapsed} working days, so about {1 / rate_per_day:.0f} days in total at this rate")

at_current_rate = to_plan.copy()
at_current_rate["B2"] = (1 - pct["B2"] / 100) / rate_per_day
end_rate = forecast_end(at_current_rate)["F3"]
print(f"Forecast at the fit-out's current rate: working day {end_rate:.1f}, {np.busday_offset(START, int(np.ceil(end_rate)) - 1)}")
```

```text
Fit-out: 46% done in about 15 working days, so about 33 days in total at this rate
Forecast at the fit-out's current rate: working day 89.6, 2026-10-02
```

At the fit-out's current rate, the opening misses 30 September. Under the rules above, the forecast to plan (2.5 days to spare) would be amber, and the forecast at the current rate is **red**; with the fit-out still slow, red is the honest call. Cost is red too: lesson 6's CPI is 0.77. The question for the sponsor is no longer "are we on track?" but "what do we do about the fit-out?": the subject of lesson 9.

## Walkthrough

1. Run the cells. Using the rate-based forecast, which tasks are now critical?
2. Re-forecast with PERT expected durations for the tasks not yet started. What changes?
3. Apply the red, amber, green rules to both forecasts.
4. Write the status line (the task below).

## Practice

```answer
{
  "id": "pmf-07-p1",
  "prompt": "Forecasting the fit-out at its **current rate**, on which working day does the depot open? One decimal place.",
  "answer": 89.6,
  "tolerance": 0.06,
  "format": "number",
  "dataset": "project",
  "files": ["tasks", "weekly_status"],
  "pyVerify": "round(end_rate, 1)",
  "hint": "The last line printed.",
  "required": true
}
```

```task
{
  "id": "pmf-07-t1",
  "prompt": "Write the week 10 **status line** for the steering committee: one line each starting **Status:** (red, amber or green, with the rule that set it), **Forecast:** (both forecasts with dates), **Cause:**, and **Decision needed:**.",
  "minutes": 6,
  "rows": 5,
  "placeholder": "Status: Red, because ...",
  "rules": [
    { "label": "A Status line with a colour and a reason", "pattern": "^\\s*status\\s*:[^\\n]*(red|amber|green)[^\\n]*(because|as|since|forecast|cpi)" },
    { "label": "A Forecast line with two dates", "pattern": "^\\s*forecast\\s*:[^\\n]*\\d[^\\n]*\\d" },
    { "label": "A Cause line", "pattern": "^\\s*cause\\s*:[^\\n]*(fit-out|permit|contractor)" },
    { "label": "A Decision needed line", "pattern": "^\\s*decision needed\\s*:" }
  ],
  "sample": "Status: Red, because at the fit-out's current rate the forecast misses the 30 September deadline (cost is red too, CPI 0.77).\nForecast: 28 September, with only 2.5 days to spare, if the remaining work goes to plan; 2 October if the fit-out continues at its current pace.\nCause: permits took 9 working days longer than planned, delaying the fit-out start, and the fit-out is running slower than estimated.\nDecision needed: approve weekend working on the fit-out (change request CR3) this week, and defer scope changes that add to the fit-out.",
  "note": "A status line ends with the decision needed, so the meeting spends its time deciding, not reading.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why re-forecast from progress instead of reporting the baseline date?",
    "options": ["The baseline is secret", "The baseline assumes things that didn't happen; the forecast uses where the project actually is", "It's quicker", "Sponsors prefer it"],
    "answer": 1,
    "explanation": "Forecast from reality."
  },
  {
    "prompt": "When should remaining work be forecast at the rate so far?",
    "options": ["Never", "When the cause of the slowness is still present", "Always", "Only for finished tasks"],
    "answer": 1,
    "explanation": "Past performance predicts future performance if nothing changes."
  },
  {
    "prompt": "What makes a red, amber, green status useful?",
    "options": ["Bright colours", "Clear rules agreed in advance, applied the same way every week", "The project manager's feeling", "Always reporting green"],
    "answer": 1,
    "explanation": "Rules make colours comparable."
  }
]
```
