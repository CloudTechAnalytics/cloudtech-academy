---
title: Estimating
minutes: 25
summary: Estimate with three points (optimistic, most likely, pessimistic) instead of one number, calculate PERT expected durations and their spread, and see why plans built on 'most likely' estimates usually run late.
---

## The problem

Ask someone how long the permits will take and they'll say "about 15 days": the most likely case. But permits can't take much less than 10 days, and they can easily take 30. The risks are lopsided. A plan made only from "most likely" numbers quietly assumes nothing will go wrong anywhere, which is the least likely outcome of all.

## The concept

**Three-point estimates**

For each task, ask for three numbers:

- **optimistic** (O): if everything goes well;
- **most likely** (M): the usual case;
- **pessimistic** (P): if things go wrong (but not a disaster).

**PERT**

A standard way to combine them:

> expected duration = (O + 4M + P) ÷ 6
> standard deviation ≈ (P − O) ÷ 6

When P is much further from M than O is (as with permits and imports), the expected duration is **longer** than the most likely one.

**Good estimating habits**

- Ask the people who'll do the work, and record their reasoning.
- Estimate effort in working days, then convert to dates with a calendar.
- Re-estimate as you learn: estimates are forecasts, not promises.

## Example

PERT for every task:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/project/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""})
tasks["expected_days"] = (tasks["optimistic_days"] + 4 * tasks["likely_days"] + tasks["pessimistic_days"]) / 6
tasks["sd_days"] = (tasks["pessimistic_days"] - tasks["optimistic_days"]) / 6
tasks["expected_minus_likely"] = tasks["expected_days"] - tasks["likely_days"]
cols = ["task_id", "name", "optimistic_days", "likely_days", "pessimistic_days", "expected_days", "sd_days"]
tasks.sort_values("expected_minus_likely", ascending=False)[cols].head(6).round(1)
```

```text
task_id                                      name  optimistic_days  likely_days  pessimistic_days  expected_days  sd_days
2       A3       Obtain building and trading permits               10           15                30           16.7      3.3
6       B4                  Import and clear racking               15           20                35           21.7      3.3
4       B2  Fit-out works: floor, power and security               20           25                40           26.7      3.3
10      C2        Buy laptops, scanners and printers                5           10                20           10.8      2.5
14      D1                        Hire depot manager               15           20                30           20.8      2.5
1       A2                Select site and sign lease                8           10                15           10.5      1.2
```

The tasks with the longest tails are the ones that depend on outsiders: permits, importing racking, the fit-out contractor, hiring. Across the whole project:

```python
print("Sum of most likely durations:", tasks["likely_days"].sum(), "days")
print("Sum of expected durations:   ", round(tasks["expected_days"].sum(), 1), "days")
print("Tasks where expected > likely:", int((tasks["expected_minus_likely"] > 0).sum()), "of", len(tasks))
```

```text
Sum of most likely durations: 214 days
Sum of expected durations:    225.3 days
Tasks where expected > likely: 22 of 23
```

Every task's expected duration is at least its most likely one, and all but one are longer, because almost every task can go wrong further than it can go right. (Only D2, hiring staff, has a symmetric range.) Lesson 4 turns these into a schedule, and lesson 5 shows what that does to the opening date.

## Walkthrough

1. Run the cells. Work out PERT for A3 (permits) by hand.
2. Which task is the most uncertain (largest standard deviation)? Who owns it?
3. Re-estimate a task (the task below).
4. Why are dependencies on outsiders the usual source of long tails?

## Practice

```answer
{
  "id": "pmf-03-p1",
  "prompt": "What is the PERT **expected duration** of **A3** (permits), in days? One decimal place.",
  "answer": 16.7,
  "format": "number",
  "dataset": "project",
  "files": ["tasks"],
  "pyVerify": "round(tasks.loc[tasks['task_id'] == 'A3', 'expected_days'].iloc[0], 1)",
  "hint": "(10 + 4 × 15 + 30) ÷ 6",
  "required": true
}
```

```task
{
  "id": "pmf-03-t1",
  "prompt": "You're re-estimating **B6 Install generator and solar backup** after talking to the contractor. Write the **three-point estimate** with a one-line **reason** for each number, then the **PERT expected** duration worked out.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "Optimistic: ... days, because ...",
  "rules": [
    { "label": "An optimistic estimate with a reason", "pattern": "optimistic[^\\n]*\\d+[^\\n]*(because|as|if|since)" },
    { "label": "A most likely estimate with a reason", "pattern": "(most likely|likely)[^\\n]*\\d+[^\\n]*(because|as|if|since)" },
    { "label": "A pessimistic estimate with a reason", "pattern": "pessimistic[^\\n]*\\d+[^\\n]*(because|as|if|since)" },
    { "label": "The PERT calculation", "pattern": "\\(\\s*\\d+\\s*\\+\\s*4\\s*[x×*]\\s*\\d+\\s*\\+\\s*\\d+\\s*\\)\\s*[/÷]\\s*6" }
  ],
  "sample": "Optimistic: 6 days, if the generator arrives on the agreed date and the roof needs no reinforcing.\nMost likely: 8 days, because solar panel mounting usually needs a day or two of adjustment.\nPessimistic: 14 days, since the inverter is imported and customs can hold it for a week.\nPERT expected: (6 + 4 × 8 + 14) ÷ 6 = 8.7 days.",
  "note": "Writing the reason next to each number lets the next person challenge or update it.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "O = 10, M = 15, P = 30. What's the PERT expected duration?",
    "options": ["15", "About 16.7", "18.3", "20"],
    "answer": 1,
    "explanation": "(10 + 60 + 30) ÷ 6."
  },
  {
    "prompt": "Why does a plan of 'most likely' durations usually run late?",
    "options": ["People are slow", "Tasks can go wrong by more than they can go right, so expected durations are longer", "Calendars are wrong", "It doesn't"],
    "answer": 1,
    "explanation": "Lopsided risks add up."
  },
  {
    "prompt": "Who should give the estimates?",
    "options": ["The sponsor alone", "The people who will do the work, with reasons", "The newest team member", "A random guess"],
    "answer": 1,
    "explanation": "They know the work."
  }
]
```
