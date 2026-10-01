---
title: "Final project: Paystream's AI quality and safety plan"
minutes: 20
summary: Plan your final project, the evaluation and safety programme for a live AI assistant, with a release decision, red-team fixes, a fair guardrail, monitoring that would have caught every incident, and an incident playbook.
---

## The problem

Paystream's head of support and its security lead want one document: how the assistant will be kept accurate and safe from now on. It must answer three immediate questions (should r2 or r3 ship? what threshold should the guardrail use? why did the incidents take so long to find?) and set up the process that answers them next time without a crisis.

Your final project is that programme, built from the data in this course.

## The concept

**What the plan contains**

| Part | Built in |
| :-- | :-- |
| Regression suite review and new cases | lesson 2 |
| Release comparison and decision | lessons 3 and 4 |
| Red-team results and fix list | lesson 5 |
| Guardrail threshold and fairness | lesson 6 |
| Alerts with control limits | lessons 7 and 8 |
| Incident playbook and a postmortem | lesson 9 |

**A backtest of your monitoring**

The strongest evidence for a monitoring plan is to run it on the past: for each incident, the date your alerts would have fired, against the date it was actually found.

## Example

The start of the backtest: the first date each alert would have fired, for each incident.

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/llmops/"
daily = pd.read_csv(base + "daily_metrics.csv", parse_dates=["date"]).set_index("date")
incidents = pd.read_csv(base + "incidents.csv", parse_dates=["started", "detected", "resolved"])

def upper_limit(series):
    past = series.shift(1).rolling(28, min_periods=14)
    return past.mean() + 3 * past.std()

refusal_rate = daily["refusals"] / daily["conversations"]
alerts = pd.DataFrame({
    "refusal": refusal_rate > upper_limit(refusal_rate),
    "latency": daily["p95_latency_ms"] > upper_limit(daily["p95_latency_ms"]),
})
graded = daily[["graded_correct", "graded_sample"]].rolling(7).sum()
p = 0.9
alerts["accuracy_7d"] = graded["graded_correct"] / graded["graded_sample"] < p - 3 * np.sqrt(p * (1 - p) / graded["graded_sample"])

def first_alert(row):
    window = alerts.loc[row["started"]:row["resolved"]]
    fired = window[window.any(axis=1)]
    return fired.index.min()

incidents["would_detect"] = incidents.apply(first_alert, axis=1)
incidents["days_saved"] = (incidents["detected"] - incidents["would_detect"]).dt.days
incidents[["incident_id", "started", "detected", "would_detect", "days_saved"]]
```

```text
incident_id    started   detected would_detect  days_saved
0      INC-01 2026-06-20 2026-06-20   2026-06-20           0
1      INC-02 2026-07-14 2026-07-18   2026-07-14           4
2      INC-03 2026-08-04 2026-08-16   2026-08-09           7
```

Each row is evidence for the monitoring plan: the days of customer impact the alerts would have saved. (The accuracy baseline here is fixed at 90% for simplicity; your project should estimate it from the data, as in lesson 8.)

## Walkthrough

1. Complete the backtest with the alerts you defined in lesson 7, and count false alarms in quiet periods.
2. Make the release decision for r2 and r3 with the gate from lesson 4.
3. Choose the guardrail threshold and the plan for the Pidgin bias.
4. Open the project brief on the course page and plan the write-up.

## Practice

```dataset
{"dataset": "llmops", "files": ["eval_cases", "eval_results", "redteam_attacks", "redteam_results", "guardrail_reviews", "daily_metrics", "incidents"]}
```

```answer
{
  "id": "ops-10-p1",
  "prompt": "In total, how many days sooner would the alerts have detected the three incidents?",
  "answer": 11,
  "format": "number",
  "dataset": "llmops",
  "files": ["daily_metrics", "incidents"],
  "pyVerify": "int(incidents['days_saved'].sum())",
  "hint": "Sum the days_saved column.",
  "required": true
}
```

```task
{
  "id": "ops-10-t1",
  "prompt": "Write the **executive summary** of your quality and safety plan (100 to 200 words): the **release decision** for r2 and r3, the **guardrail** threshold and the Pidgin fix, the **monitoring** improvement with evidence from the backtest, and the **process** that keeps it working.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Neither candidate release should ship yet ...",
  "rules": [
    { "label": "Release decision naming r2 and r3", "pattern": "r2[\\s\\S]{0,400}r3|r3[\\s\\S]{0,400}r2" },
    { "label": "Guardrail threshold", "pattern": "threshold|0\\.\\d" },
    { "label": "Mentions the Pidgin fix", "pattern": "pidgin" },
    { "label": "Monitoring evidence (days, sooner, backtest)", "pattern": "days?|sooner|backtest|earlier" },
    { "label": "A process (gate, suite, red-team, postmortem, weekly)", "pattern": "gate|suite|red[- ]team|postmortem|weekly|every release", "min": 2 },
    { "label": "Between 100 and 200 words", "minWords": 100, "maxWords": 200 }
  ],
  "sample": "Neither candidate release should ship yet. r2 improves most categories but gets fraud cases right only 78% of the time against 90% live, and its overall gain isn't statistically clear; it can ship once a fraud rule restores those cases. r3 is twice as fast but fails on overall quality, safety cases and red-team attacks, and stays blocked. The input guardrail should use a threshold of 0.5, the lowest-cost point, but it blocks harmless Pidgin messages far more often than English ones, so blocked messages will go to an agent until it is retrained with Pidgin examples. Our backtest shows that refusal and pooled graded-accuracy alerts would have detected the July and August incidents 4 and 7 days sooner, sparing more than 20,000 conversations from the problems. To keep this working, every release runs the regression suite and an automatic gate, the security team red-teams each quarter, a support lead grades 30 conversations a day, and every incident ends with a blameless postmortem whose actions become new tests and alerts.",
  "note": "Every claim points back to a measurement in the project, which is what lets the reader trust the plan.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What's the strongest evidence that a new monitoring plan works?",
    "options": ["A colleague likes it", "A backtest showing when it would have detected past incidents", "It has many charts", "It's expensive"],
    "answer": 1,
    "explanation": "Run the plan on the past."
  },
  {
    "prompt": "Which keeps an AI assistant safe over time?",
    "options": ["One good evaluation at launch", "A loop: suite and gate on every change, red-teaming, monitoring, and postmortems that add tests", "A bigger model", "Customer feedback alone"],
    "answer": 1,
    "explanation": "Quality is a process, not a launch event."
  },
  {
    "prompt": "A plan's summary should lead with what?",
    "options": ["The history of AI", "The decisions, each backed by a measurement", "Technical details", "The team's names"],
    "answer": 1,
    "explanation": "Decisions first, evidence next."
  }
]
```
