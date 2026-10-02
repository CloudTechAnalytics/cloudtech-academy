---
title: Schedule risk and simulation
minutes: 25
summary: Replace a single opening date with a probability, by simulating the project thousands of times with each task's three-point estimate, and use the result to set honest dates and buffers.
---

## The problem

The sponsor asked: "Will we open by 30 September?" The plan says 11 September with most likely durations, and later with PERT. Both are single dates. Neither answers the real question, which is about **chance**: how likely is it that everything that matters goes well enough?

## The concept

**Monte Carlo simulation**

1. For each task, draw a random duration from its range (here, a triangular distribution between optimistic and pessimistic, peaking at most likely).
2. Schedule the project with those durations and record the end date.
3. Repeat thousands of times.
4. The results form a **distribution** of end dates: you can read off the probability of meeting any date.

**Merge bias**

When several paths join (training waits for hiring **and** system testing), the task starts when the **slowest** finishes. Each path alone might be on time, but the chance that all of them are is lower. That's why simulation usually shows later dates than adding up one path's estimates.

**Using the results**

- Quote dates with confidence: "P80" is the date you have an 80% chance of meeting.
- A **schedule buffer** is the gap between the plan's date and the date you commit to.

## Example

Simulate the project 10,000 times. The random generator has a fixed seed so your numbers match these:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/project/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""})
START = np.datetime64("2026-06-01")
DEADLINE_DAYS = int(np.busday_count(START, np.datetime64("2026-09-30")) + 1)   # working days to 30 September

rng = np.random.default_rng(42)
N = 10_000
durations = {t.task_id: rng.triangular(t.optimistic_days, t.likely_days, t.pessimistic_days, N) for t in tasks.itertuples()}

finish = {}
for t in tasks.itertuples():
    preds = [p for p in t.predecessors.split(";") if p]
    start = np.max([finish[p] for p in preds], axis=0) if preds else np.zeros(N)
    finish[t.task_id] = start + durations[t.task_id]
end = finish["F3"]

print("Deadline is working day", DEADLINE_DAYS)
print("Chance of opening by 30 September:", f"{(end <= DEADLINE_DAYS).mean():.0%}")
print("Chance of opening by 11 September (the most likely plan):", f"{(end <= 75).mean():.0%}")
for p in [50, 80, 90]:
    day = int(np.ceil(np.percentile(end, p)))
    print(f"P{p}: day {day}, {np.busday_offset(START, day - 1)}")
```

```text
Deadline is working day 88
Chance of opening by 30 September: 64%
Chance of opening by 11 September (the most likely plan): 3%
P50: day 86, 2026-09-28
P80: day 92, 2026-10-06
P90: day 95, 2026-10-09
```

The most likely plan's date had almost no chance of being met. The 30 September deadline is roughly a two-in-three chance before anything has even gone wrong. Which tasks drive the risk? Count how often each task was on the longest path:

```python
critical = pd.Series(0.0, index=tasks["task_id"])
latest = {}
for t in tasks.itertuples():
    preds = [p for p in t.predecessors.split(";") if p]
    if preds:
        stacked = np.vstack([finish[p] for p in preds])
        latest[t.task_id] = np.array(preds)[stacked.argmax(axis=0)]
for i in range(N):
    task = "F3"
    while True:
        critical[task] += 1
        if task not in latest:
            break
        task = latest[task][i]
print((critical / N).sort_values(ascending=False).head(10).round(2).to_string())
```

```text
task_id
A1    1.00
A2    1.00
F3    1.00
F2    1.00
A3    0.99
B2    0.99
C5    0.99
C3    0.99
D3    0.85
E2    0.15
```

The planned critical path is the longest path in almost every run. The interesting split is at the end: staff training (D3) is on the longest path about 85% of the time, but in the other runs it's stocking the opening inventory (E2) that the trial run waits for. Racking and hiring almost never decide the date. So the project manager's attention belongs on permits, fit-out, network and system testing, and both training and stocking.

## Walkthrough

1. Run the cells. What's the P80 date? Would you tell the sponsor that, or 30 September?
2. Make the permits certain (O = M = P = 15) and rerun. How much does the chance improve?
3. What would cutting the fit-out's pessimistic estimate to 30 days do?
4. Write the answer to the sponsor (the task below).

## Practice

```answer
{
  "id": "pmf-05-p1",
  "prompt": "In the simulation, what's the chance of opening by **30 September**? As a percentage, whole number.",
  "answer": 64,
  "format": "percent",
  "dataset": "project",
  "files": ["tasks"],
  "pyVerify": "round((end <= DEADLINE_DAYS).mean() * 100)",
  "hint": "The second line printed.",
  "required": true
}
```

```task
{
  "id": "pmf-05-t1",
  "prompt": "Answer the sponsor's question \"Will we open by 30 September?\" in 50 to 120 words: give the **probability**, a date you're **80% confident** in, **why** the most likely plan's date is misleading, and **one action** that would improve the odds.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "Not with certainty. ...",
  "rules": [
    { "label": "A probability as a percentage", "pattern": "\\d+\\s*%" },
    { "label": "An 80% or P80 date", "pattern": "80\\s*%|p80" },
    { "label": "Explains why most likely is misleading", "pattern": "most likely|everything (goes|going) (well|right)|best case" },
    { "label": "An action (permits, fit-out, buffer, contractor)", "pattern": "permit|fit-out|contractor|buffer|weekend|agent" },
    { "label": "Between 50 and 120 words", "minWords": 50, "maxWords": 120 }
  ],
  "sample": "Not with certainty. Simulating the plan 10,000 times with each task's realistic range gives about a 64% chance of opening by 30 September; the date we can be 80% confident in is about 6 October. The 11 September date in the original plan assumed every task would take its most likely time, which almost never happens across 23 tasks. The permits and the fit-out drive most of the risk. Hiring a permit agent now and agreeing weekend working with the fit-out contractor would protect the 30 September date best.",
  "note": "Leading with the probability answers the question asked; the action turns it into a decision.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does a P80 date mean?",
    "options": ["80 days from now", "The date you have an 80% chance of meeting", "The average date", "The latest possible date"],
    "answer": 1,
    "explanation": "A date with a stated confidence."
  },
  {
    "prompt": "Why does simulation often give later dates than adding up one path?",
    "options": ["Random errors", "Where paths merge, the task waits for the slowest, so the chance all are on time is lower", "Computers are pessimistic", "It doesn't"],
    "answer": 1,
    "explanation": "Merge bias."
  },
  {
    "prompt": "Why fix the random seed in the simulation?",
    "options": ["It's more accurate", "So the results can be reproduced and checked", "It's required", "To make it faster"],
    "answer": 1,
    "explanation": "Reproducible analysis."
  }
]
```
