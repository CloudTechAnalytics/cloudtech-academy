---
title: Scheduling and the critical path
minutes: 25
summary: Turn tasks and dependencies into a schedule with the critical path method (forward and backward passes, float), find the tasks that decide the opening date, and convert working days into calendar dates.
---

## The problem

Twenty-three tasks, each with an owner pushing to finish theirs. But they don't all matter equally for the opening date. Hiring staff can slip by weeks without delaying anything; one day lost on the permits delays the whole launch by a day. Knowing which is which tells the project manager where to spend attention.

## The concept

### The critical path method (CPM)

1. **Forward pass**: each task's **earliest start** is the latest finish of everything it depends on; earliest finish = earliest start + duration. The project's length is the last earliest finish.
2. **Backward pass**: working back from the end, each task's **latest finish** is the earliest latest start of the tasks that depend on it.
3. **Float** (slack) = latest start − earliest start: how long a task can slip without delaying the end.
4. The **critical path** is the chain of tasks with zero float. Any delay on it delays the project.

### Dates

Durations are working days. Convert with a working calendar (Monday to Friday here; real plans also remove public holidays).

![Six tasks with forward and backward pass values: the critical path A, B, D, F has zero float, while the racking order has 6 days of float and hiring has 14; project length 31 days](/images/courses/pm/critical-path.svg "Forward pass, backward pass, float, and the critical path (an illustration).")

## Example

A scheduling function you'll reuse in later lessons:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/project/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""})
START = np.datetime64("2026-06-01")      # a Monday

def schedule(tasks, durations):
    preds = {t: [p for p in ps.split(";") if p] for t, ps in zip(tasks["task_id"], tasks["predecessors"])}
    es, ef = {}, {}
    for t in tasks["task_id"]:                       # tasks are listed after their predecessors
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

def finish_date(days):
    return np.busday_offset(START, int(np.ceil(days)) - 1, roll="forward")

likely = dict(zip(tasks["task_id"], tasks["likely_days"]))
plan, end = schedule(tasks, likely)
print("Project length:", end, "working days, opening on", finish_date(end))
print("Critical path:", " -> ".join(plan.index[plan["float"] == 0]))
```

```text
Project length: 75 working days, opening on 2026-09-11
Critical path: A1 -> A2 -> A3 -> B2 -> C3 -> C5 -> D3 -> F2 -> F3
```

Nine of the 23 tasks are critical. The path runs from the charter through the lease, permits and fit-out, then the network, system testing, training, the trial run and the opening. Now the tasks with the most float:

```python
plan.sort_values("float", ascending=False).head(5)
```

```text
es  ef  ls  lf  float
C4  10  20  48  58     38
C1   3  10  41  48     38
E3  21  31  59  69     38
E1  13  21  51  59     38
C2  10  20  48  58     38
```

Choosing and configuring the warehouse system, buying equipment, agreeing supplier deliveries and setting up routes can each slip by 38 working days without moving the opening. Meanwhile the permits, the fit-out and the network and system testing have none. The plan says the depot opens on 11 September, comfortably before the 30 September deadline. But this plan uses **most likely** durations everywhere. Redo it with the PERT expected durations:

```python
expected = dict(zip(tasks["task_id"], (tasks["optimistic_days"] + 4 * tasks["likely_days"] + tasks["pessimistic_days"]) / 6))
plan_expected, end_expected = schedule(tasks, expected)
print("With expected durations:", round(end_expected, 1), "working days, opening on", finish_date(end_expected))
```

```text
With expected durations: 80.3 working days, opening on 2026-09-21
```

The opening moves later, and the deadline gets closer. Lesson 5 asks the better question: what's the **chance** of opening by 30 September?

## Walkthrough

1. Run the cells. Change the permits (A3) to 20 days. What happens to the opening date?
2. Change hiring the manager (D1) to 30 days. Does the opening move? Why not?
3. Draw the critical path as boxes and arrows.
4. Explain float to the HR lead (the task below).

## Practice

```answer
{
  "id": "pmf-04-p1",
  "prompt": "How many working days of **float** does **E3** (delivery routes) have in the most likely plan?",
  "answer": 38,
  "format": "number",
  "dataset": "project",
  "files": ["tasks"],
  "pyVerify": "int(plan.loc['E3', 'float'])",
  "hint": "The float column, E3 row.",
  "required": true
}
```

```task
{
  "id": "pmf-04-t1",
  "prompt": "The HR lead wants to know whether hiring can be done more slowly to save effort. Write a short reply (40 to 100 words) explaining **float** for **D1 and D2** with the **number of days**, what happens if hiring slips **beyond** that, and what you'd ask them to do.",
  "minutes": 5,
  "rows": 5,
  "placeholder": "Hiring has ... days of float ...",
  "rules": [
    { "label": "Mentions float or slack", "pattern": "float|slack" },
    { "label": "Gives a number of days", "pattern": "\\d+\\s*(working )?days" },
    { "label": "Says what happens beyond the float (delay, opening, critical)", "pattern": "delay|opening|critical|later" },
    { "label": "Makes a request", "pattern": "please|ask|could you|keep|tell me|let me know" },
    { "label": "Between 40 and 100 words", "minWords": 40, "maxWords": 100 }
  ],
  "sample": "Hiring has float: in the current plan, the manager and staff hiring together can slip by about 20 working days without delaying the opening, because staff training also waits for the system to be tested. Beyond that, every extra day of hiring delays training, the trial run and the opening by a day. So please don't plan to use that time; keep it as a buffer for candidates declining offers, and tell me as soon as any hire looks like slipping.",
  "note": "Float is a shared buffer, not a gift to one task: using it all makes the task critical.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is the critical path?",
    "options": ["The most expensive tasks", "The chain of tasks with zero float, which decides the end date", "The tasks the sponsor cares about", "The first tasks"],
    "answer": 1,
    "explanation": "Delay any of them and the project is delayed."
  },
  {
    "prompt": "A task has 10 days of float and slips by 4. What happens to the end date?",
    "options": ["It moves 4 days", "Nothing, but the task now has 6 days of float", "It moves 10 days", "The project fails"],
    "answer": 1,
    "explanation": "Float absorbs the slip."
  },
  {
    "prompt": "In the forward pass, a task's earliest start is...",
    "options": ["Its latest finish", "The latest earliest finish among the tasks it depends on", "Day 0 always", "Its float"],
    "answer": 1,
    "explanation": "It waits for all its predecessors."
  }
]
```
