---
title: Cost, latency and limits
minutes: 15
summary: Work out what an agent costs per request and per correct resolution, why each extra step costs more than the last, how long customers wait, and which limits keep both under control.
---

## The problem

v2 costs more per run than v1: its system prompt is longer, and it makes an extra tool call to check eligibility. The finance manager asks the obvious question: is it worth it?

Comparing cost per run is the wrong comparison. A cheap run that issues a wrong refund, or opens a case a person must then close, isn't cheap. The question is what each version costs per request **resolved correctly**, and what its mistakes cost on top.

## The concept

### Why agents cost more than single calls

Each step re-sends the whole conversation so far: instructions, tool definitions, the request and every earlier tool result. So the input grows with each step, and a 6-step run costs much more than twice a 3-step run.

### What to measure

- **Tokens per run**, input and output, from the trace.
- **Cost per run**, with labelled price assumptions.
- **Cost per correct resolution**: total cost ÷ number of correct runs.
- **Latency**: total seconds per run, since the customer waits for every step.

### Limits that control cost

- a **step limit** (lesson 3);
- a **token budget** per run;
- **short tool results** (lesson 7): less to re-send each step;
- **prompt caching**, where providers offer it, to charge less for the instructions repeated at every step;
- a **smaller model** for simple steps, if evaluation shows it's good enough.

![Bars of input tokens per step, illustrated: a fixed base for instructions, tools and the request, plus a growing layer of earlier steps' results, from about 2,000 at step 1 to about 4,500 at step 6.](/images/courses/agents/token-growth.svg "Each step re-sends everything so far, so cost grows faster than the number of steps.")

## Example

Input tokens by step position show the growth:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/agents/"
runs = pd.read_csv(base + "runs.csv")
steps = pd.read_csv(base + "steps.csv")
requests = pd.read_csv(base + "requests.csv")

steps["version"] = steps["run_id"].str[-2:]
steps.pivot_table(index="step", columns="version", values="input_tokens", aggfunc="mean").round(0).head(6)
```

```text
version      v1      v2
step
1         979.0  1581.0
2        1241.0  1840.0
3        1501.0  2098.0
4        1754.0  2363.0
5        2017.0  2621.0
6        2269.0     NaN
```

Now cost per run and per correct resolution, with illustrative prices:

```python
INPUT_PRICE, OUTPUT_PRICE = 4_800, 24_000   # illustrative only: naira per million tokens

runs["cost_ngn"] = runs["input_tokens"] * INPUT_PRICE / 1e6 + runs["output_tokens"] * OUTPUT_PRICE / 1e6
runs["correct"] = runs.merge(requests[["request_id", "expected_action"]], on="request_id").eval("final_action == expected_action").values
summary = runs.groupby("version").agg(
    runs=("run_id", "size"),
    correct=("correct", "sum"),
    cost_per_run=("cost_ngn", "mean"),
    total_cost=("cost_ngn", "sum"),
    mean_seconds=("seconds", "mean"),
)
summary["cost_per_correct"] = summary["total_cost"] / summary["correct"]
summary.round(2)
```

```text
runs  correct  cost_per_run  total_cost  mean_seconds  cost_per_correct
version
v1        150      104         22.95     3441.84          8.70             33.09
v2        150      140         32.28     4841.35          9.44             34.58
```

v2 costs more per run, and the gap per correct resolution is smaller because it gets more requests right. Either way, the model calls cost about ₦20 to ₦35 per request on these assumed prices. The real cost difference is v1's mistakes: lesson 5 found refunds alone worth far more than every model call in this test combined.

## Walkthrough

1. Run the cells. Find the single most expensive run. Why was it so expensive?
2. Work out the monthly cost of v2 at 20,000 requests a month.
3. Estimate what prompt caching would save if v2's 1,500-token system prompt were charged at a tenth of the price after the first step (state it as an assumption).
4. Find the share of v2 runs that took longer than 10 seconds. Is that acceptable for a chat reply?

## Practice

```answer
{
  "id": "agt-08-p1",
  "prompt": "With the illustrative prices, what is **v2's cost per correct resolution**, in naira? Two decimal places.",
  "answer": 34.58,
  "tolerance": 0.006,
  "format": "number",
  "dataset": "agents",
  "files": ["runs", "requests"],
  "pyVerify": "round(summary.loc['v2', 'cost_per_correct'], 2)",
  "hint": "The cost_per_correct value in the v2 row.",
  "required": true
}
```

```answer
{
  "id": "agt-08-p2",
  "prompt": "What is the **average duration** of a v2 run, in seconds? One decimal place.",
  "answer": 9.4,
  "tolerance": 0.05,
  "format": "number",
  "dataset": "agents",
  "files": ["runs"],
  "pyVerify": "round(runs.loc[runs['version'] == 'v2', 'seconds'].mean(), 1)",
  "hint": "The mean_seconds value in the v2 row.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why does each extra agent step cost more than the one before?",
    "options": ["Prices rise during the day", "Each step re-sends the whole conversation so far, which keeps growing", "Tools charge per call", "Later steps use a bigger model"],
    "answer": 1,
    "explanation": "Input tokens grow with every step."
  },
  {
    "prompt": "Version A costs ₦4 per run and is right 70% of the time; B costs ₦6 and is right 93%. What's the fairer comparison?",
    "options": ["Cost per run: A wins", "Cost per correct resolution, plus the cost of each version's mistakes", "Speed only", "Whichever is newer"],
    "answer": 1,
    "explanation": "Cheap wrong answers aren't cheap."
  },
  {
    "prompt": "Which limit directly caps a runaway agent's cost?",
    "options": ["A friendly prompt", "A step limit and a token budget per run", "A higher temperature", "More tools"],
    "answer": 1,
    "explanation": "Hard limits in the loop bound the worst case."
  }
]
```
