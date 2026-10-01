---
title: From chatbot to agent
minutes: 15
summary: What an AI agent is (a model that chooses tools in a loop, while your code runs them), how it differs from a fixed workflow, and how to read the step-by-step record of an agent run.
---

## The problem

Paystream's help assistant can answer questions from articles. But most support requests need **action**: look up a transfer, check whether it's due a reversal, open a case, freeze a lost card, hand a fraud report to the fraud team. Support agents do this hundreds of times a day.

The team built an **AI agent** to do some of that work. Two versions have been tested on the same 150 real requests, and every step of every run was recorded. Some of what v1 did would have cost Paystream money and broken customers' privacy. This course is about building agents that don't: tools designed with limits, rules kept in code, people approving risky actions, and every run measured.

## The concept

**What makes something an agent**

A chatbot takes text and returns text. An **agent** is given **tools** (functions it may ask to call) and works in a loop:

1. The model reads the request and the tool descriptions, and either asks for a tool call or gives its final answer.
2. **Your code** runs the tool (the model never runs anything itself) and sends the result back.
3. Repeat until the model answers, or a limit is reached.

**Workflow or agent?**

| Approach | The steps are decided by | Use when |
| :-- | :-- | :-- |
| **Workflow** | your code, in a fixed order | the steps are known in advance, such as "classify, then route" |
| **Agent** | the model, one step at a time | requests vary and need different tools in different orders |

Agents are more flexible and harder to control. A good rule: use a workflow when you can, an agent when you must, and keep the agent's choices narrow.

**Reading a run**

Every serious agent system records each step: which tool was called, with what arguments, what came back, and the tokens and time used. These **traces** are how you debug, evaluate and audit an agent.

## Example

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/agents/"
requests = pd.read_csv(base + "requests.csv")
runs = pd.read_csv(base + "runs.csv")
steps = pd.read_csv(base + "steps.csv")

print(len(requests), "requests,", len(runs), "runs,", len(steps), "recorded steps")
print(requests["expected_action"].value_counts())
```

```text
150 requests, 300 runs, 892 recorded steps
expected_action
answer                57
open_transfer_case    31
escalate_fraud        18
freeze_card           17
escalate_human        15
ask_for_details       12
Name: count, dtype: int64
```

Each request has an **expected action** set by a support lead: what a good human agent would have done. Now read one run step by step:

```python
run = "RQ010-v2"
print(requests.loc[requests["request_id"] == run[:5], ["account_id", "received_at", "message"]].to_string(index=False))
steps.loc[steps["run_id"] == run, ["step", "tool", "arguments", "result"]]
```

```text
account_id      received_at                                                                 message
  PS100383 2026-09-11 15:15 Transfer TRF401840 failed and the money left my account. Please refund.
    step                        tool                                          arguments result
54     1                get_transfer  {"account_id":"PS100383","transfer_id":"TRF401...     ok
55     2  check_reversal_eligibility  {"account_id":"PS100383","transfer_id":"TRF401...     ok
56     3                       reply                  {"message":"(reply to customer)"}     ok
```

The agent looked the transfer up, checked the reversal rule, and replied: the rule said no case was needed yet, so it didn't open one. Each line is a decision the model made and code carried out.

## Walkthrough

1. Run the cells. Read three more v2 runs, for requests of different kinds.
2. Read the same requests' v1 runs (`-v1`). Note one difference in each.
3. Count which tools are called most often: `steps["tool"].value_counts()`.
4. For three requests, decide whether a fixed workflow could handle them, or whether they really need an agent.

## Practice

```dataset
{"dataset": "agents", "files": ["accounts", "transfers", "requests", "runs", "steps"]}
```

```answer
{
  "id": "agt-01-p1",
  "prompt": "How many requests have the expected action **open_transfer_case**?",
  "answer": 31,
  "format": "number",
  "dataset": "agents",
  "files": ["requests"],
  "pyVerify": "int((requests['expected_action'] == 'open_transfer_case').sum())",
  "hint": "The value counts.",
  "required": true
}
```

```answer
{
  "id": "agt-01-p2",
  "prompt": "What is the **average number of steps** in a **v2** run? One decimal place.",
  "answer": 3.1,
  "tolerance": 0.05,
  "format": "number",
  "dataset": "agents",
  "files": ["runs"],
  "pyVerify": "round(runs.loc[runs['version'] == 'v2', 'steps'].mean(), 1)",
  "hint": "Filter runs to v2 and average the steps column.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In an agent, who actually runs the tools?",
    "options": ["The model", "Your code, after the model asks for a tool call", "The customer", "The API provider"],
    "answer": 1,
    "explanation": "The model only asks; your code decides whether and how to run it."
  },
  {
    "prompt": "Every request needs the same three steps in the same order. What should you build?",
    "options": ["An agent", "A workflow: fixed steps in code, with a model only where judgement is needed", "Two agents", "A chatbot"],
    "answer": 1,
    "explanation": "Use a workflow when you can, an agent when you must."
  },
  {
    "prompt": "What is a trace?",
    "options": ["A bug", "The step-by-step record of an agent run: tools, arguments, results, tokens and time", "A prompt", "A type of tool"],
    "answer": 1,
    "explanation": "Traces are how agents are debugged, evaluated and audited."
  }
]
```
