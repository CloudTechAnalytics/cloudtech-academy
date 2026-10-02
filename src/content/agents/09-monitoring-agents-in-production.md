---
title: Monitoring agents in production
minutes: 20
summary: Decide what to log, which numbers to watch every day, when to alert a person, and how to roll an agent out gradually, so that problems are found by your dashboard, not your customers.
---

## The problem

Passing an evaluation once doesn't keep an agent safe. After launch, new kinds of requests arrive, a tool's data changes, the model provider updates the model, someone edits the prompt. Any of these can quietly change what the agent does.

Paystream's head of support asks for the operating plan: what will be watched, who looks at it, what triggers an alarm, and what happens when one goes off.

## The concept

**Log every step**

The trace format from this course (run, step, tool, arguments, result, tokens, seconds), plus the prompt version, model version and final action. Without traces, you can't investigate a complaint or an incident.

**Watch daily**

| Measure | Why |
| :-- | :-- |
| Share of runs by final action | a sudden rise in case openings or hand-overs signals a change |
| Hand-over rate | the main safety valve; too high wastes staff, too low may mean over-confidence |
| Tool error and not_found rates | data or integration problems |
| Step-limit stops and repeated calls | loops |
| Tokens and seconds per run | cost and customer wait |
| Injection flags | attacks |

**Sample and review**

People review a random sample of runs every week, graded with the same labels as the evaluation set, so accuracy is measured on live traffic, not just the test set.

**Roll out gradually**

Start with **shadow mode** (the agent proposes, people act), then a small share of live requests, then more, with a **kill switch** that sends everything back to people instantly.

## Example

A daily monitoring table from the traces (here, all the v2 runs treated as one day's traffic):

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/agents/"
runs = pd.read_csv(base + "runs.csv")
steps = pd.read_csv(base + "steps.csv")

def daily_report(version):
    r = runs[runs["version"] == version]
    s = steps[steps["run_id"].isin(r["run_id"])]
    return pd.Series({
        "runs": len(r),
        "handover_rate": round(r["final_action"].isin(["escalate_human", "escalate_fraud"]).mean(), 3),
        "case_rate": round((r["final_action"] == "open_transfer_case").mean(), 3),
        "tool_error_rate": round((s["result"] == "error").mean(), 3),
        "step_limit_stops": int((r["stop_reason"] == "max_steps").sum()),
        "mean_steps": round(r["steps"].mean(), 2),
        "p90_seconds": round(r["seconds"].quantile(0.9), 1),
    })

pd.DataFrame({v: daily_report(v) for v in ["v1", "v2"]})
```

```text
v1       v2
runs              150.000  150.000
handover_rate       0.173    0.287
case_rate           0.393    0.187
tool_error_rate     0.009    0.007
step_limit_stops    3.000    0.000
mean_steps          2.870    3.070
p90_seconds         9.900   12.300
```

Look at the case rate. v1 opened cases on a far larger share of requests than v2. If v2 were live and its case rate suddenly moved towards v1's, that alone would be a reason to investigate, before anyone had graded a single run.

## Walkthrough

1. Run the cell. Which measure would have caught v1's problems fastest?
2. Set an alert threshold for each measure, based on v2's values.
3. Write the operating plan (the task below).
4. Decide who owns the kill switch, and how quickly it must work.

## Practice

```answer
{
  "id": "agt-09-p1",
  "prompt": "What share of **v1** runs ended with **open_transfer_case**? As a percentage, one decimal place.",
  "answer": 39.3,
  "format": "percent",
  "dataset": "agents",
  "files": ["runs", "steps"],
  "pyVerify": "round(daily_report('v1')['case_rate'] * 100, 1)",
  "hint": "The case_rate row, v1 column.",
  "required": true
}
```

```task
{
  "id": "agt-09-t1",
  "prompt": "Write the **operating plan** for running v2 live, one line each starting **Logging:**, **Daily checks:**, **Alerts:**, **Review:**, **Rollout:** and **Kill switch:**.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "Logging: ...",
  "rules": [
    { "label": "A Logging line", "pattern": "^\\s*[-*]?\\s*logging\\s*:" },
    { "label": "A Daily checks line naming measures", "pattern": "^\\s*[-*]?\\s*daily checks\\s*:[^\\n]*(rate|steps|tokens|seconds|hand)" },
    { "label": "An Alerts line with a threshold", "pattern": "^\\s*[-*]?\\s*alerts\\s*:[^\\n]*(\\d|above|below|more than|doubles)" },
    { "label": "A Review line with a sample", "pattern": "^\\s*[-*]?\\s*review\\s*:[^\\n]*(sample|\\d)" },
    { "label": "A Rollout line that starts small (shadow, pilot, %)", "pattern": "^\\s*[-*]?\\s*rollout\\s*:[^\\n]*(shadow|pilot|%|percent|small)" },
    { "label": "A Kill switch line", "pattern": "^\\s*[-*]?\\s*kill switch\\s*:" }
  ],
  "sample": "Logging: every step's tool, arguments, result, tokens and seconds, with the prompt and model version, kept for a year.\nDaily checks: hand-over rate, case rate, tool error rate, step-limit stops, tokens and p90 seconds per run, on a dashboard the support lead reads each morning.\nAlerts: page the on-call engineer if the case rate or hand-over rate moves more than 50% from last week's level, or any run calls a tool it isn't allowed.\nReview: a team lead grades a random sample of 50 runs a week against the evaluation labels.\nRollout: two weeks in shadow mode, then 10% of live requests, then 50%, moving on only if weekly accuracy stays above 90%.\nKill switch: the head of support can send all requests back to people with one setting, effective within a minute.",
  "note": "Every line names a number or a person. A plan without either is a hope.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The model provider updates the model and v2's case rate doubles overnight. How would you notice first?",
    "options": ["Customer complaints", "The daily monitoring of final-action rates, with an alert threshold", "Annual review", "You wouldn't"],
    "answer": 1,
    "explanation": "Watch the action mix; it moves before anyone grades a run."
  },
  {
    "prompt": "What is shadow mode?",
    "options": ["Running at night", "The agent proposes actions, but people take them, so you can compare without risk", "Hiding the agent from customers", "A cheaper model"],
    "answer": 1,
    "explanation": "Measure on live traffic before giving the agent control."
  },
  {
    "prompt": "Why review a sample of live runs each week when you already have an evaluation set?",
    "options": ["Evaluations are useless", "Live traffic changes; the test set can't show new kinds of requests", "To keep staff busy", "Regulators require exactly 50"],
    "answer": 1,
    "explanation": "Keep measuring where the agent actually works."
  }
]
```
