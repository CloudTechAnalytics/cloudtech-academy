---
title: "Final project: Paystream's support agent"
minutes: 20
summary: Plan your final project, a support agent designed, tested on recorded runs, and made safe, with an evaluation and operating plan the head of support can sign off.
---

## The problem

Paystream's head of support has the traces for v1 and v2 and a decision to make: put an agent in front of customers, and if so, with which tools, limits and controls? Your final project is the design for **v3**, and the evidence for it.

You don't need an API key to do it well. The recorded runs, the data the tools read, and the labels are enough to design the tools, test the loop, check the rules and measure both versions. If you have a key, you can run your own v3 on the same requests and add it to the comparison.

## The concept

**What v3 needs**

| Part | Built in |
| :-- | :-- |
| Tool definitions, scoped and risk-classified | lessons 2 and 5 |
| A guarded loop with a trace | lesson 3 |
| Business rules as tools, tested against labels | lesson 4 |
| An evaluation of outcomes, errors and paths | lesson 6 |
| Injection defences | lesson 7 |
| Cost and latency, with limits | lesson 8 |
| An operating plan | lesson 9 |

**One evaluation function**

As with the support assistant in Generative AI Engineering, build one function that produces the same table for any version: accuracy, unsafe actions, hand-over rate, leaks, loops, cost per correct resolution and latency.

## Example

The start of the evaluation function:

```python
import json
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/agents/"
requests = pd.read_csv(base + "requests.csv")
runs = pd.read_csv(base + "runs.csv")
steps = pd.read_csv(base + "steps.csv")

UNSAFE_TOOLS = {"issue_refund"}

def scorecard(version):
    r = runs[runs["version"] == version].merge(requests[["request_id", "expected_action"]], on="request_id")
    s = steps[steps["run_id"].isin(r["run_id"])]
    return pd.Series({
        "accuracy": round((r["final_action"] == r["expected_action"]).mean(), 3),
        "unsafe_tool_calls": int(s["tool"].isin(UNSAFE_TOOLS).sum()),
        "handover_rate": round(r["final_action"].isin(["escalate_human", "escalate_fraud"]).mean(), 3),
        "loops": int((r["stop_reason"] == "max_steps").sum()),
        "mean_steps": round(r["steps"].mean(), 2),
    })

pd.DataFrame({v: scorecard(v) for v in ["v1", "v2"]}).T
```

```text
accuracy  unsafe_tool_calls  handover_rate  loops  mean_steps
v1     0.693                6.0          0.173    3.0        2.87
v2     0.933                0.0          0.287    0.0        3.07
```

Add the leak check from lesson 5 and the cost columns from lesson 8, and you have the table every future version must beat.

## Walkthrough

1. Complete the scorecard with leaks, injection outcomes, cost per correct resolution and p90 seconds.
2. Read every wrong v2 run and decide what v3 changes to fix them.
3. Write v3's tool list with risk levels, the loop's limits and the approval flow.
4. Open the project brief on the course page and plan the write-up.

## Practice

```dataset
{"dataset": "agents", "files": ["accounts", "transfers", "requests", "runs", "steps"]}
```

```answer
{
  "id": "agt-10-p1",
  "prompt": "What is **v2's hand-over rate** (escalate_human or escalate_fraud)? As a percentage, one decimal place.",
  "answer": 28.7,
  "format": "percent",
  "dataset": "agents",
  "files": ["requests", "runs", "steps"],
  "pyVerify": "round(scorecard('v2')['handover_rate'] * 100, 1)",
  "hint": "The handover_rate value in the v2 row.",
  "required": true
}
```

```task
{
  "id": "agt-10-t1",
  "prompt": "Write the **v3 design summary** for the head of support (100 to 200 words): the **tools** and their risk levels, the **limits** in the loop, what needs **approval**, how v3 will be **evaluated** before launch (with at least **two** numbers from v1 and v2), and the **rollout**.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "v3 keeps v2's scoped tools ...",
  "rules": [
    { "label": "Names tools and risk levels (read, write, handoff)", "pattern": "read|write|hand[- ]?off|risk" },
    { "label": "Describes loop limits (steps, repeated, budget)", "pattern": "step limit|max(imum)? steps|\\d+ steps|repeat|budget" },
    { "label": "Says what needs approval", "pattern": "approv" },
    { "label": "Uses at least two percentages", "pattern": "\\d+(\\.\\d+)?\\s*%", "min": 2 },
    { "label": "Describes rollout (shadow, pilot, %)", "pattern": "shadow|pilot|rollout|roll out" },
    { "label": "Between 100 and 200 words", "minWords": 100, "maxWords": 200 }
  ],
  "sample": "v3 keeps v2's tools and their limits. Read tools (get_account, get_transfer) are scoped to the logged-in customer and never return narrations. The safe write tool freeze_card is allowed and logged. check_reversal_eligibility decides the 24-hour rule in code, and open_transfer_case refuses unless that check passed. Handoffs to the fraud and support teams are always available. There is no refund tool: v3 can only propose a refund, which a team lead must approve. The loop stops after 8 steps or when the same call fails twice, and the customer is told a person will follow up. Before launch, v3 must beat v2's 93% accuracy on the same 150 labelled requests with zero unsafe actions or leaks, against v1's 69% accuracy, 6 refunds and 6 leaks, and must cut v2's unnecessary hand-overs. Rollout starts with two weeks in shadow mode, then 10% of live requests, with daily monitoring, a weekly reviewed sample and a kill switch held by the head of support.",
  "note": "Each claim about v3 is tied to a check that could fail. That's what makes it a design rather than a promise.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What must a new agent version show before it replaces the current one?",
    "options": ["It's newer", "It beats the current version on the same labelled requests, with no new unsafe actions", "It uses a bigger model", "It's cheaper per run"],
    "answer": 1,
    "explanation": "Same test, same scorecard, every version."
  },
  {
    "prompt": "Which design choice protects Paystream even if v3's model is fooled?",
    "options": ["A longer prompt", "No refund tool, scoped reads and rules enforced in code", "Higher temperature", "More examples"],
    "answer": 1,
    "explanation": "Controls in code don't depend on the model's behaviour."
  },
  {
    "prompt": "Why can you design and evaluate an agent well without live model calls?",
    "options": ["You can't", "Recorded traces, the tool data and labels let you test tools, rules, loops and evaluation code", "Models aren't needed for agents", "Because traces are free"],
    "answer": 1,
    "explanation": "Most agent engineering is ordinary, testable code."
  }
]
```
