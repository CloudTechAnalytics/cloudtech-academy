---
title: How sure are we?
minutes: 30
summary: Run a Monte Carlo simulation over the plan's three-point estimates, find the real chance of the promised date, and turn P50 and P80 dates into a reserve the sponsor can decide on.
---

## The problem

The baseline said **Friday 5 March**, one working day before the promise. But that date is a single path through a plan whose tasks vary a great deal. Some tasks overrun far more than they underrun, and when several paths run in parallel, the project finishes when the **slowest** one does. That makes the real finish later than any single estimate suggests.

The managing director doesn't need a date. They need to know **how likely** the promised date is, and what date they could commit to if they wanted to be reasonably sure. Both come from simulation.

## The concept

### Monte Carlo simulation

For each of thousands of **runs**, draw a duration for every task from a distribution shaped by its three estimates (a triangular distribution: minimum, most likely, maximum), run the schedule, and record the finish. After 10,000 runs you have 10,000 possible finish days. The spread tells you how uncertain the plan is.

From the results you can read:

- **The chance of meeting a date:** the share of runs that finish by it.
- **P50:** the day half the runs beat. A coin toss.
- **P80:** the day 80% of runs beat. A date you could commit to with reasonable confidence.
- **The reserve:** the gap between the baseline and P80, which is the schedule contingency the plan needs and doesn't have.

### Why the simulated finish is later than the plan

Take two parallel paths of equal length. Each has a 50% chance of finishing on time. The project is on time only when **both** do: about 25%. A project with many near-critical paths loses more still. This is the "merge bias" of project networks, and it's why a plan built on likely durations is almost always optimistic.

![A histogram of invented simulated finish days with the baseline, the promise, the median and the P80 date marked](/images/courses/pm-capstone/cushion-percentiles.svg "Baseline, promise, median and P80 on one line.")

> [!WARNING]
> A simulation is only as good as its inputs. It doesn't know about a customs strike, and it assumes tasks vary independently. It's a way of taking your own estimates seriously, not a forecast of events nobody has thought of. That's what the risk register (lesson 7) is for.

## Example

Reload the plan, then simulate. This version draws all the durations at once and works through the tasks in order, so 10,000 runs take a moment:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/lab/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""})
START = np.datetime64("2026-11-02")
PROMISE_DAY = 91                         # Monday 8 March 2027 is working day 91

ids = list(tasks["task_id"])
index = {t: i for i, t in enumerate(ids)}

def simulate(tasks, runs=10_000, seed=42):
    rng = np.random.default_rng(seed)
    d = rng.triangular(tasks["optimistic_days"].values, tasks["likely_days"].values,
                       tasks["pessimistic_days"].values, size=(runs, len(ids)))
    ef = np.zeros((runs, len(ids)))
    for i, ps in enumerate(tasks["predecessors"]):
        pred = [index[p] for p in ps.split(";") if p]
        start = ef[:, pred].max(axis=1) if pred else 0
        ef[:, i] = start + d[:, i]
    return ef.max(axis=1)

finish = simulate(tasks)
print(f"Mean finish: day {finish.mean():.1f}")
print(f"Chance of finishing by day {PROMISE_DAY}: {(finish <= PROMISE_DAY).mean():.1%}")
for p in (50, 80, 90):
    print(f"P{p}: day {np.percentile(finish, p):.1f}")
```

```text
Mean finish: day 103.6
Chance of finishing by day 91: 2.8%
P50: day 103.4
P80: day 109.6
P90: day 112.9
```

On the plan's own estimates, the chance of making the promised date was **under 3%**. The date was never likely, and it was promised before the plan was simulated. Convert the P50 and P80 days to dates:

```python
def finish_date(days):
    return np.busday_offset(START, int(np.ceil(days)) - 1, roll="forward")

print("Baseline:", finish_date(90))
print("P50:     ", finish_date(np.percentile(finish, 50)))
print("P80:     ", finish_date(np.percentile(finish, 80)))
print("Reserve needed for P80:", int(np.ceil(np.percentile(finish, 80))) - 90, "working days")
```

```text
Baseline: 2027-03-05
P50:      2027-03-25
P80:      2027-04-02
Reserve needed for P80: 20 working days
```

A date the sponsor could commit to with 80% confidence is **Friday 2 April**, about 20 working days after the baseline. And this is the plan from **before** week 10. Nothing in this lesson knows yet that the analysers are stuck in customs. That's lesson 5.

## Walkthrough

1. Define `simulate()` and run it for 10,000 runs with seed 42.
2. Calculate the probability of finishing by day 91.
3. Calculate P50, P80 and P90, and convert them to dates.
4. Calculate the reserve in working days between the baseline (day 90) and P80.
5. Plot the finish days as a histogram with the baseline, the promise and P80 marked (optional, but sponsors remember pictures).
6. Write the schedule risk note (the task below).

## Practice

```answer
{
  "id": "pmc-04-p1",
  "prompt": "In the simulation, what is the chance of finishing by the **promised date** (day 91)? As a percentage, whole number.",
  "answer": 3,
  "format": "percent",
  "dataset": "lab",
  "files": ["tasks"],
  "pyVerify": "round((finish <= PROMISE_DAY).mean() * 100)",
  "hint": "The second line printed.",
  "required": true
}
```

```answer
{
  "id": "pmc-04-p2",
  "prompt": "What is the **P80** finish, rounded up to a whole working day?",
  "answer": 110,
  "format": "number",
  "dataset": "lab",
  "files": ["tasks"],
  "pyVerify": "int(np.ceil(np.percentile(finish, 80)))",
  "hint": "Round the P80 line up.",
  "required": true
}
```

```answer
{
  "id": "pmc-04-p3",
  "prompt": "On what date is the **P50** finish? Type it as YYYY-MM-DD.",
  "answer": "2027-03-25",
  "format": "text",
  "accept": ["25 march 2027", "2027-03-25", "25/03/2027", "25/3/2027"],
  "dataset": "lab",
  "files": ["tasks"],
  "pyVerify": "str(finish_date(np.percentile(finish, 50)))",
  "hint": "The P50 line of the last cell.",
  "required": true
}
```

```task
{
  "id": "pmc-04-t1",
  "prompt": "Write the **schedule risk note** for the sponsor (70 to 160 words): the **chance** of making the promised date, the **P50** and **P80** dates, the **reserve** the plan needs, why a single date is misleading, and what you'd ask them to decide.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "On the plan's own estimates ...",
  "rules": [
    { "label": "Gives the chance of the promised date (about 3%)", "pattern": "\\b3\\s?%|three per ?cent|under 3|about 3|less than 3|2\\.8" },
    { "label": "Gives the P50 date (25 March)", "pattern": "25 March|2027-03-25|P50|median|50%" },
    { "label": "Gives the P80 date (2 April)", "pattern": "2 April|2027-04-02|P80|80%" },
    { "label": "States the reserve (about 20 days)", "pattern": "reserve|contingen|buffer|20 (working )?days|four weeks|20 days" },
    { "label": "Says a single date misleads (uncertainty, many paths)", "pattern": "single|one date|uncertain|range|merge|parallel|paths|probab" },
    { "label": "Asks for a decision", "pattern": "decide|decision|agree|approve|commit|move the date|announce" },
    { "label": "Between 70 and 160 words", "minWords": 70, "maxWords": 160 }
  ],
  "sample": "On the plan's own estimates, the chance of opening by Monday 8 March is about 3%. The baseline of 5 March is a single path through a plan with many parallel paths, and the project finishes when the slowest of them does, so the real finish is later than any one estimate suggests. The median (P50) is 25 March; the date we could commit to with 80% confidence (P80) is Friday 2 April, about 20 working days after the baseline, and the plan has no reserve for it. This is before accounting for the analysers' delay, which I'll cover next. I'd ask you to agree that we stop treating 8 March as a plan and start deciding what to protect: a date, the full test menu or the budget.",
  "note": "Notice that the note says what the simulation can't see. Honest numbers come with their limits.",
  "hint": "Chance, P50, P80, reserve, why, decision.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A simulation says P80 is day 110. What does that mean?",
    "options": ["The project will finish on day 110", "80% of simulated runs finished by day 110", "There's an 80% chance of finishing on day 110 exactly", "The project is 80% done by day 110"],
    "answer": 1,
    "explanation": "P80 is the day 80% of runs beat."
  },
  {
    "prompt": "Why is the simulated finish usually later than the baseline built from likely durations?",
    "options": ["Simulations are pessimistic", "Overruns are bigger than underruns, and with parallel paths the project waits for the slowest one", "The simulation adds a margin", "Random numbers are biased"],
    "answer": 1,
    "explanation": "Skewed estimates plus merging paths push the average finish later."
  },
  {
    "prompt": "What can't a simulation of three-point estimates tell you?",
    "options": ["The chance of meeting a date", "The effect of an event that isn't in the estimates, like a customs strike", "The P80 date", "Which date to quote"],
    "answer": 1,
    "explanation": "It only models the variation in the estimates; named risks belong in the risk register."
  }
]
```
