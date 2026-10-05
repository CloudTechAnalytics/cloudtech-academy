---
title: When you can't randomise
minutes: 25
summary: Estimate an effect when a change was rolled out to some places and not others, with difference-in-differences, and check the parallel-trends assumption it depends on.
---

## The problem

In week 14 of 2026, Paystream launched cash-out agents (shops where customers can withdraw cash from their wallet) in three northern and south-eastern states: Kano, Kaduna and Enugu. Nobody randomised anything: the operations team chose states where it already had partners. Three months later, the question is whether agents increased weekly active users.

Weekly active users in the three agent states rose by about 6%. But a before-and-after comparison can't separate the agents' effect from everything else that changed in those weeks: seasons, salaries, a competitor, a fuel price rise. You need a comparison group, and a method that uses it.

## The concept

### Difference-in-differences (DiD)

Compare the **change** in the treated group with the **change** in a comparison group over the same period:

> effect ≈ (treated after − treated before) − (comparison after − comparison before)

or, in percentages, the treated group's growth minus the comparison group's growth. The comparison group's change stands in for what would have happened to the treated states without the agents.

![Lines for a comparison group and a treated group before and after a change. A dashed line shows the treated group's path without the change, parallel to the comparison group; the effect is the gap between the treated group's actual value and that line.](/images/courses/experiments/did.svg "Difference-in-differences, illustrated.")

### The parallel-trends assumption

DiD only works if, without the treatment, both groups would have moved in parallel. You can't check that directly, but you can check that they **did** move in parallel **before** the change. If their pre-period trends differ, the estimate is suspect.

### Other options when you can't randomise

- A **staggered rollout**: launch in different places at different times, which gives several before-and-after comparisons.
- **Holdouts**: keep a random set of places or users without the change for a while.
- If possible, randomise next time. Even randomising which states go first would have made this question easy.

## Example

```python
import pandas as pd
import numpy as np

rollout = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/experiments/rollout.csv")
rollout["group"] = np.where(rollout["state"].isin(["Kano", "Kaduna", "Enugu"]), "Agent states", "Other states")
rollout["period"] = np.where(rollout["week"] >= 14, "after", "before")

weekly = rollout.groupby(["group", "period", "week"])["weekly_active_users"].sum().groupby(["group", "period"]).mean()
table = weekly.unstack()[["before", "after"]]
table["change_pct"] = (table["after"] / table["before"] - 1) * 100
table.round(1)
```

```text
period         before    after  change_pct
group
Agent states   5242.2   5545.5         5.8
Other states  15861.1  15538.2        -2.0
```

The agent states grew while the other states shrank slightly over the same weeks. The difference-in-differences:

```python
did = (table.loc["Agent states", "change_pct"] - table.loc["Other states", "change_pct"]) / 100
print(f"Before-and-after in agent states: {table.loc['Agent states', 'change_pct'] / 100:+.1%}")
print(f"Difference-in-differences estimate: {did:+.1%}")
```

```text
Before-and-after in agent states: +5.8%
Difference-in-differences estimate: +7.8%
```

The before-and-after figure understates the effect, because the other states show that this period was a slightly weaker one. Now the parallel-trends check: the two groups' weekly totals, each indexed to their own average in the weeks before the launch:

```python
pre = rollout[rollout["week"] < 14]
idx = rollout.groupby(["group", "week"])["weekly_active_users"].sum().unstack(0)
idx = idx / idx.loc[1:13].mean()
idx.loc[[1, 5, 9, 13, 14, 18, 22, 26]].round(3)
```

```text
group  Agent states  Other states
week
1             0.949         0.949
5             1.001         0.994
9             0.996         1.007
13            1.014         1.016
14            1.053         0.978
18            1.033         0.949
22            1.064         0.979
26            1.128         1.044
```

Before week 14, the two groups move closely together; after it, the agent states pull ahead. That's the pattern that makes the DiD estimate believable.

## Walkthrough

1. Run the cells and plot the indexed weekly totals for both groups, with a line at week 14.
2. Calculate the DiD for each agent state separately. Are they similar?
3. Run a "placebo" DiD: pretend the launch was in week 7, using only weeks 1 to 13. The estimate should be close to zero.
4. Write the result for the operations director (the task below).

## Practice

```answer
{
  "id": "ab-08-p1",
  "prompt": "What is the **difference-in-differences** estimate of the agents' effect on weekly active users? As a percentage, one decimal place.",
  "answer": 7.8,
  "format": "percent",
  "dataset": "experiments",
  "files": ["rollout"],
  "pyVerify": "round(did * 100, 1)",
  "hint": "The second line printed.",
  "required": true
}
```

```task
{
  "id": "ab-08-t1",
  "prompt": "Write the result for the operations director (50 to 130 words): the **estimate**, why the **before-and-after** figure alone was misleading, the **assumption** behind it and the evidence for it, and how to make the next rollout easier to measure.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Cash-out agents increased weekly active users by about ...",
  "rules": [
    { "label": "Gives the estimate as a percentage", "pattern": "\\d+(\\.\\d+)?\\s*%" },
    { "label": "Explains the before-and-after problem (other states, same period, would have happened)", "pattern": "other states|same (period|weeks)|would have|comparison" },
    { "label": "Names the parallel-trends assumption or its check", "pattern": "parallel|moved together|same trend|before the launch" },
    { "label": "Suggests randomising, staggering or a holdout next time", "pattern": "random|stagger|holdout|hold-out|phase" },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "Cash-out agents increased weekly active users in Kano, Kaduna and Enugu by about 8%. A simple before-and-after comparison showed only about 6%, because weekly active users in the other states fell by about 2% over the same weeks, so without agents the three states would probably have dipped too. The estimate assumes the two groups would have moved in parallel without agents; before the launch they did move closely together, which supports it. For the next rollout, we suggest choosing the launch states at random from those with partners, or launching in stages, so the effect can be measured directly.",
  "note": "The suggestion at the end costs nothing operationally and would make the next answer far more certain.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Treated states grew 6% after a launch; comparison states fell 2% over the same weeks. What's the difference-in-differences estimate?",
    "options": ["6%", "+8%", "4%", "−2%"],
    "answer": 1,
    "explanation": "6% − (−2%) = 8%."
  },
  {
    "prompt": "What assumption does difference-in-differences rely on?",
    "options": ["Random assignment", "Without the treatment, both groups would have followed parallel trends", "Equal group sizes", "Normal data"],
    "answer": 1,
    "explanation": "Check that they moved together before the change."
  },
  {
    "prompt": "A 'placebo' test pretends the launch happened earlier and finds a large effect. What does that suggest?",
    "options": ["The real effect is larger", "The groups weren't moving in parallel, so the DiD estimate is suspect", "The data is perfect", "Nothing"],
    "answer": 1,
    "explanation": "A placebo should find nothing."
  }
]
```
