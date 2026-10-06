---
title: Scope, WBS and estimates
minutes: 30
summary: Check the plan you've inherited for gaps, turn three-point estimates into honest expected durations and costs with PERT, and see why the approved budget was never as safe as it looked.
---

## The problem

The plan you've inherited has 23 tasks, and the approved budget is the likely duration times the daily cost, added up. But "likely" is the single most probable duration, not the average. Most tasks can overrun far more than they can underrun: a licence that "usually takes 22 days" can take 45, and it can't take 5. Budgets and dates built from likely values are optimistic by design.

Before you test the plan against reality, check it's a plan at all: every task owned, every dependency real, nothing missing. Then replace likely values with expected ones.

## The concept

### A work breakdown structure you can check

A **work breakdown structure (WBS)** divides the project into phases and tasks so that everything in scope appears once and nothing outside it appears at all. Here the phases are Initiation, Facilities, Equipment, Systems, People, Operations and Launch. Check:

- **Every task has one owner**, a team answerable for it.
- **Every predecessor named exists**, and no task depends on itself or on a later task.
- **Every deliverable in the charter has a task**: licence, premises, analysers, system, staff, reagents, accreditation, opening.
- **Nothing is in the plan that isn't in scope.** A task that has crept in is a change that skipped change control.

### Three-point estimates and PERT

Each task has an **optimistic** (O), **likely** (M) and **pessimistic** (P) duration. The PERT approximation gives:

- **Expected duration** = (O + 4M + P) ÷ 6
- **Standard deviation** = (P − O) ÷ 6

Because P is usually further from M than O is, the expected duration is longer than the likely one. The more skewed a task, the bigger the gap. Where estimates are skewed, a plan built on likely values is a plan with no room for the way the world works.

![A triangular estimate for one invented task with optimistic, likely and pessimistic values and the expected duration above the likely one, and what that means for a plan built from likely values](/images/courses/pm-capstone/skewed-estimates.svg "Likely is the most probable value; expected is the average.")

### Cost follows duration

Here each task costs a fixed amount per working day, so the expected cost of a task is its expected duration times its daily cost. Add them up and compare with the approved budget. The difference is the first thing a sponsor should know: it's the money the plan needs but doesn't contain.

## Example

Check the plan's integrity first:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/lab/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""})

ids = set(tasks["task_id"])
unknown = [p for ps in tasks["predecessors"] for p in ps.split(";") if p and p not in ids]
print("Unknown predecessors:", unknown)
print("Tasks without an owner:", int(tasks["owner"].isna().sum()))
print("Tasks per owner:")
print(tasks["owner"].value_counts().to_string())
```

```text
Unknown predecessors: []
Tasks without an owner: 0
Tasks per owner:
owner
IT             5
Operations     4
Procurement    3
Contractor     3
HR             2
Laboratory     2
Regulatory     2
Board          1
Facilities     1
```

No gaps. Now the expected durations and costs:

```python
tasks["expected_days"] = (tasks["optimistic_days"] + 4 * tasks["likely_days"] + tasks["pessimistic_days"]) / 6
tasks["sd_days"] = (tasks["pessimistic_days"] - tasks["optimistic_days"]) / 6
tasks["likely_cost"] = tasks["likely_days"] * tasks["daily_cost_ngn"]
tasks["expected_cost"] = tasks["expected_days"] * tasks["daily_cost_ngn"]

view = tasks[["task_id", "likely_days", "expected_days", "sd_days"]].round(1)
print(view.sort_values("sd_days", ascending=False).head(5).to_string(index=False))
print()
print(f"Approved budget (likely):  ₦{tasks['likely_cost'].sum():,.0f}")
print(f"Expected cost (PERT):      ₦{tasks['expected_cost'].sum():,.0f}")
print(f"Gap:                       ₦{tasks['expected_cost'].sum() - tasks['likely_cost'].sum():,.0f}")
```

```text
task_id  likely_days  expected_days  sd_days
     A3           22           24.7      5.0
     B4           25           27.2      4.5
     B2           28           29.8      3.8
     D1           22           23.0      3.3
     D2           20           20.8      2.5

Approved budget (likely):  ₦90,750,000
Expected cost (PERT):      ₦96,304,167
Gap:                       ₦5,554,167
```

The budget was set on the most likely case. Expected cost is about **₦5.6m higher**, before a single risk has been counted. A sponsor who approved ₦90.75m was approving a number that has less than an even chance of being enough.

The most skewed tasks are the ones controlled by other people: the facility licence (up to 45 days), importing the analysers (up to 45) and the accreditation inspection (up to 20). Those are also the ones you can't speed up by working harder.

## Walkthrough

1. Check the plan: unknown predecessors, missing owners, tasks per owner.
2. Calculate expected duration and standard deviation for every task.
3. Calculate the expected cost, and compare it with the approved budget.
4. Find the tasks where the pessimistic estimate is at least **twice** the likely one. These are the plan's soft spots.
5. Write up what the sponsor should be told about the budget (the task below).

## Practice

```answer
{
  "id": "pmc-02-p1",
  "prompt": "What is the project's **expected cost** (PERT expected days × daily cost, summed over all tasks), rounded to the nearest naira?",
  "answer": 96304167,
  "format": "naira",
  "dataset": "lab",
  "files": ["tasks"],
  "pyVerify": "int(round(((tasks['optimistic_days'] + 4 * tasks['likely_days'] + tasks['pessimistic_days']) / 6 * tasks['daily_cost_ngn']).sum()))",
  "hint": "The second line of the example's last cell.",
  "required": true
}
```

```answer
{
  "id": "pmc-02-p2",
  "prompt": "How many tasks have a **pessimistic** duration of at least **twice** the likely duration?",
  "answer": 3,
  "format": "number",
  "dataset": "lab",
  "files": ["tasks"],
  "pyVerify": "int((tasks['pessimistic_days'] >= 2 * tasks['likely_days']).sum())",
  "hint": "Compare the two columns for each task and count.",
  "required": true
}
```

```answer
{
  "id": "pmc-02-p3",
  "prompt": "Which task has the **biggest gap** between its expected and likely duration? Type its ID.",
  "answer": "A3",
  "format": "text",
  "accept": ["a3"],
  "dataset": "lab",
  "files": ["tasks"],
  "pyVerify": "(tasks.assign(gap=(tasks['optimistic_days'] + 4 * tasks['likely_days'] + tasks['pessimistic_days']) / 6 - tasks['likely_days']).sort_values('gap', ascending=False)['task_id'].iloc[0])",
  "hint": "Add a gap column, then sort.",
  "required": true
}
```

```task
{
  "id": "pmc-02-t1",
  "prompt": "Write a **note to the chief financial officer** (60 to 150 words) about the budget: say what the approved budget is based on, what the **expected** cost is and the **gap**, which tasks are the **soft spots** and why, and what you'll do about it.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "The approved budget of ...",
  "rules": [
    { "label": "States the approved budget", "pattern": "90[.,]?75|90,750,000" },
    { "label": "States the expected cost", "pattern": "96[.,]?3|96,304" },
    { "label": "States the gap (about 5.5 or 5.6 million)", "pattern": "5[.,][5-6]|5,55|5,5[0-9]{2},|gap|difference|shortfall" },
    { "label": "Says the budget was based on likely values", "pattern": "likely|most probable|single|optimistic" },
    { "label": "Names a soft-spot task or activity", "pattern": "licen[cs]e|import|analyser|accreditation|inspection" },
    { "label": "Says what you'll do (reserve, decision, track)", "pattern": "reserve|contingen|monitor|track|decision|ask|approve" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "The approved budget of ₦90.75 million was built from each task's most likely duration. Because the risks on this project are mostly on the upside (a task can run long far more than it can run short), the expected cost is ₦96.3 million, about ₦5.6 million more, before any risk is counted. The soft spots are the tasks that other people control: the facility licence, importing the analysers and the accreditation inspection, where the pessimistic estimate is at least twice the likely one. I'll report against the budget but flag that a reserve is needed, track those three tasks weekly, and bring you a proposed reserve once I've worked out the schedule risk and the risk register.",
  "note": "You've given the CFO what they asked for in the stakeholder email: no surprises. Being early about a gap is much cheaper than explaining it later.",
  "hint": "Approved, expected, gap, soft spots, next step.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A task has estimates 4, 6 and 14 days (optimistic, likely, pessimistic). What is its PERT expected duration?",
    "options": ["6 days", "7 days", "8 days", "9 days"],
    "answer": 1,
    "explanation": "(4 + 4 × 6 + 14) ÷ 6 = 42 ÷ 6 = 7 days."
  },
  {
    "prompt": "Why is expected cost higher than a budget built from likely durations?",
    "options": ["PERT adds a margin for error", "Pessimistic estimates are further from the likely one than optimistic ones, so the average is higher", "Daily costs rise over time", "The estimates are wrong"],
    "answer": 1,
    "explanation": "Overruns can be much larger than underruns, so the likely value is below the average."
  },
  {
    "prompt": "Which of these is a WBS problem?",
    "options": ["A task with a long duration", "A charter deliverable with no task, or a task nobody owns", "A critical task", "A task with a high daily cost"],
    "answer": 1,
    "explanation": "A WBS must cover the scope completely, once, with an owner for each piece."
  }
]
```
