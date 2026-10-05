---
title: Change control
minutes: 25
summary: Assess change requests by their effect on the forecast finish, the budget and the deadline, use schedule compression where it pays, and recommend decisions the sponsor can make quickly.
---

## The problem

Five change requests arrived in weeks 9 and 10: a cold room, four more staff, weekend working on the fit-out, a customer pick-up counter and better laptops. Each requester thinks theirs is small. Together, and on the critical path, they could move the opening into the December rush, which the risk register prices at ₦12 million of lost sales.

Change control isn't saying no. It's showing the sponsor what each change really costs in days and naira, so they can decide.

## The concept

### Assess every change the same way

| Question | How |
| :-- | :-- |
| Which task does it affect? | from the request |
| Is that task on the critical path, or does it have float? | from the current forecast (lesson 7) |
| How much does it move the finish? | re-forecast with the change |
| What does it cost? | the request, plus any delay cost |
| Does it still meet the deadline and the budget plus contingency? | compare |

### Schedule compression

Two ways to finish sooner: **crashing** (spend money to shorten a critical task: weekend working, more crews) and **fast-tracking** (overlap tasks that were planned in sequence). Both only help on the critical path.

![A change request flow: a task with enough float absorbs the change and the finish is unchanged; a critical-path task moves the finish by the extra days; crashing and fast-tracking shorten the critical path](/images/courses/pm/change-control.svg "A change on a float task can be absorbed; on the critical path it moves the finish.")

### Decide, don't drift

Every request gets a decision (approve, reject, defer to after opening) with a reason, recorded in a change log.

## Example

Start from the week 10 forecast at the fit-out's current rate (lesson 7), then apply each change on its own:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/project/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""}).set_index("task_id")
status = pd.read_csv(base + "weekly_status.csv")
changes = pd.read_csv(base + "changes.csv").fillna({"affects_task": ""})
START, STATUS_DAY = np.datetime64("2026-06-01"), 50
DEADLINE_DAYS = int(np.busday_count(START, np.datetime64("2026-09-30")) + 1)

pct = status[status["week"] == 10].set_index("task_id")["percent_complete"].reindex(tasks.index).fillna(0)
remaining = tasks["likely_days"] * (1 - pct / 100)
first_week = status[status["task_id"] == "B2"]["week"].min()
remaining["B2"] = (1 - pct["B2"] / 100) / (pct["B2"] / 100 / (STATUS_DAY - (first_week - 1) * 5))

def forecast_end(remaining):
    finish = {}
    for t, row in tasks.iterrows():
        preds = [p for p in row["predecessors"].split(";") if p]
        finish[t] = max([STATUS_DAY] + [finish[p] for p in preds]) + remaining[t]
    return finish["F3"]

baseline_end = forecast_end(remaining)
rows = []
for c in changes.itertuples():
    changed = remaining.copy()
    if c.affects_task:
        changed[c.affects_task] = max(0, changed[c.affects_task] + c.extra_days)
    end = forecast_end(changed)
    rows.append({"change": c.change_id, "description": c.description, "cost_ngn": c.extra_cost_ngn,
                 "finish_moves_days": round(end - baseline_end, 1), "meets_deadline": end <= DEADLINE_DAYS})
impact = pd.DataFrame(rows)
print(f"Current forecast: working day {baseline_end:.1f} (deadline {DEADLINE_DAYS})")
impact
```

```text
Current forecast: working day 89.6 (deadline 88)
  change                                        description  cost_ngn  finish_moves_days  meets_deadline
0    CR1                 Add a cold room for chilled drinks  12000000               15.0           False
1    CR2   Hire 4 more depot staff for longer opening hours   2400000                0.0           False
2    CR3  Pay the contractor for weekend working on fit-out   2500000               -6.0            True
3    CR4                     Add a customer pick-up counter   3000000                5.0           False
4    CR5          Upgrade laptops to a higher specification   1800000                0.0           False
```

The changes that touch the fit-out move the opening day for day, because the fit-out is critical. The laptop upgrade adds 3 days to a task that's already finished, so it costs money but no time. Extra staff cost money but no time. Only weekend working moves the date the right way. Now the combinations the sponsor is really choosing between:

```python
def apply(change_ids):
    changed = remaining.copy()
    cost = 0
    for c in changes[changes["change_id"].isin(change_ids)].itertuples():
        if c.affects_task:
            changed[c.affects_task] = max(0, changed[c.affects_task] + c.extra_days)
        cost += c.extra_cost_ngn
    end = forecast_end(changed)
    return pd.Series({"finish_day": round(end, 1), "date": str(np.busday_offset(START, int(np.ceil(end)) - 1)),
                      "meets_deadline": end <= DEADLINE_DAYS, "extra_cost_ngn": cost})

options = {
    "approve everything": ["CR1", "CR2", "CR3", "CR4", "CR5"],
    "weekend working only": ["CR3"],
    "weekend working + staff": ["CR3", "CR2"],
    "weekend working + staff + counter": ["CR3", "CR2", "CR4"],
}
pd.DataFrame({name: apply(ids) for name, ids in options.items()}).T
```

```text
finish_day        date meets_deadline extra_cost_ngn
approve everything                     103.6  2026-10-22          False       21700000
weekend working only                    83.6  2026-09-24           True        2500000
weekend working + staff                 83.6  2026-09-24           True        4900000
weekend working + staff + counter       88.6  2026-10-01          False        7900000
```

Approving everything sends the opening well past the deadline and into the December risk. Weekend working on its own brings the forecast back within the deadline, and adding the extra staff doesn't change the date. The cold room and the counter belong after opening, when they can be built without touching the critical path.

## Walkthrough

1. Run the cells. Why doesn't CR5 move the date, even though it adds 3 days?
2. Price the delay: if each day past 30 September costs about ₦1 million in lost sales, what does "approve everything" really cost?
3. Could the cold room be fast-tracked (built alongside the end of the fit-out)? What would you need to know?
4. Write the change log entries (the task below).

## Practice

```answer
{
  "id": "pmf-09-p1",
  "prompt": "If **every** change is approved, on which working day does the forecast opening fall? One decimal place.",
  "answer": 103.6,
  "tolerance": 0.06,
  "format": "number",
  "dataset": "project",
  "files": ["tasks", "weekly_status", "changes"],
  "pyVerify": "float(apply(['CR1', 'CR2', 'CR3', 'CR4', 'CR5'])['finish_day'])",
  "hint": "The approve everything row.",
  "required": true
}
```

```task
{
  "id": "pmf-09-t1",
  "prompt": "Write the **change log** entries for CR1 to CR5, one line each starting with the ID: **decision** (approve, reject or defer), the **days** and **cost** impact, and the **reason**.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "CR1: defer ...",
  "rules": [
    { "label": "A line for each of CR1 to CR5", "pattern": "^\\s*[-*]?\\s*CR[1-5]\\s*:", "min": 5 },
    { "label": "A decision on each", "pattern": "^\\s*[-*]?\\s*CR[1-5]\\s*:[^\\n]*(approve|reject|defer)", "min": 5 },
    { "label": "CR3 approved", "pattern": "CR3\\s*:[^\\n]*approve" },
    { "label": "CR1 deferred or rejected", "pattern": "CR1\\s*:[^\\n]*(defer|reject)" },
    { "label": "Cost impacts in naira", "pattern": "₦|naira|\\d(\\.\\d)?\\s*m\\b", "min": 4 },
    { "label": "Reasons (critical, deadline, float, after opening)", "pattern": "critical|deadline|float|after opening|no (effect|change) on", "min": 3 }
  ],
  "sample": "CR1: defer to after opening; +15 days on the critical fit-out and ₦12m; it would push the opening past the deadline into the December peak.\nCR2: approve; no schedule effect, ₦2.4m from contingency; longer opening hours support the December peak.\nCR3: approve; −6 days on the critical fit-out for ₦2.5m; it brings the forecast back within the deadline.\nCR4: defer to after opening; +5 days on the critical fit-out and ₦3m; it can be built once the depot is running.\nCR5: reject; no schedule effect because the laptops are already bought, but ₦1.8m for a benefit the requester couldn't quantify.",
  "note": "Deferring isn't refusing: the cold room and counter still happen, just off the critical path.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A change adds 5 days to a task with 12 days of float. What happens to the finish?",
    "options": ["It moves 5 days", "Nothing, but the float falls to 7", "It moves 12 days", "The task becomes optional"],
    "answer": 1,
    "explanation": "Float absorbs it."
  },
  {
    "prompt": "What is crashing a schedule?",
    "options": ["Cancelling the project", "Spending money to shorten a critical task, such as weekend working", "Overlapping tasks", "Removing tasks"],
    "answer": 1,
    "explanation": "Fast-tracking is the overlap."
  },
  {
    "prompt": "Why record every change decision with a reason?",
    "options": ["Bureaucracy", "So everyone knows what was agreed and why, and scope doesn't creep unnoticed", "It's legally required", "To delay decisions"],
    "answer": 1,
    "explanation": "The change log is the scope's memory."
  }
]
```
