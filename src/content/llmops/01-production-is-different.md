---
title: Production is different
minutes: 15
summary: Why an AI feature that passed its evaluation can still fail after launch, what changes underneath it, and what four months of a live assistant's metrics and incidents look like.
---

## The problem

Paystream's help assistant passed its evaluation and went live in May 2026. By the end of August, it had answered over 230,000 conversations, and it had three incidents. In two of them, customers noticed the problem days before Paystream did.

Nothing in the original evaluation was wrong. The world around the assistant changed: the model provider updated the model, someone rebuilt the search index, and a provider outage slowed everything down. This course is about the work that starts at launch: testing every change before release, attacking your own system, filtering harmful inputs fairly, and noticing problems from your own data, quickly.

## The concept

**What changes after launch**

| Change | Example | Who controls it |
| :-- | :-- | :-- |
| **Your prompt or code** | a new prompt version | you |
| **The model** | the provider updates the model behind the same name, or you switch models | the provider, or you |
| **Your data** | help articles edited, the search index rebuilt | you, often another team |
| **Your users** | new questions, new attacks, new languages | nobody |

**Offline and online evaluation**

- **Offline**: a fixed test suite, run before every release. It tells you whether a change is safe to ship.
- **Online**: measurements of live traffic (refusals, hand-overs, latency, feedback, graded samples). It tells you whether something has gone wrong since.

You need both. Offline tests can't see a provider's update; online metrics can't stop a bad release before customers see it.

**The lifecycle**

Change → offline regression suite → release gate → gradual rollout → online monitoring → incident response → new test cases from what went wrong → back to the suite.

## Example

Four months of daily metrics for the live assistant:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/llmops/"
daily = pd.read_csv(base + "daily_metrics.csv", parse_dates=["date"])
incidents = pd.read_csv(base + "incidents.csv")

print(daily.columns.tolist())
print("Conversations, May to August:", daily["conversations"].sum())
daily["refusal_rate"] = daily["refusals"] / daily["conversations"]
daily["graded_accuracy"] = daily["graded_correct"] / daily["graded_sample"]
daily.groupby(daily["date"].dt.month)[["conversations", "refusal_rate", "graded_accuracy", "p95_latency_ms"]].mean().round(3)
```

```text
['date', 'release', 'conversations', 'thumbs_up', 'thumbs_down', 'handovers', 'refusals', 'p95_latency_ms', 'graded_sample', 'graded_correct']
Conversations, May to August: 233808
      conversations  refusal_rate  graded_accuracy  p95_latency_ms
date
5          1715.581         0.030            0.900        3405.871
6          1862.700         0.029            0.911        3686.033
7          1974.194         0.041            0.894        3351.419
8          2049.806         0.030            0.847        3424.097
```

The monthly averages hint at trouble in July and August, but averages blur incidents. Here's the incident log:

```python
incidents[["incident_id", "title", "started", "detected", "how_detected"]]
```

```text
incident_id                                           title     started    detected                          how_detected
0      INC-01                 Provider outage: slow responses  2026-06-20  2026-06-20                         Latency alert
1      INC-02     Refusals rose after a provider model update  2026-07-14  2026-07-18  Customer complaints to support leads
2      INC-03  Search index rebuilt without six help articles  2026-08-04  2026-08-16        A customer's social media post
```

Two of three incidents were found by people outside the AI team. Every one of them left a clear mark in the daily metrics, as lessons 7 and 8 show.

## Walkthrough

1. Run the cells. Plot the daily refusal rate and graded accuracy (`daily.plot(x="date", y=[...])`). Can you see the incidents?
2. For each incident, decide which kind of change caused it (prompt, model, data, users, or infrastructure).
3. List the files in the dataset and what each one measures.
4. Write one sentence on what offline testing could and couldn't have caught in each incident.

## Practice

```dataset
{"dataset": "llmops", "files": ["eval_cases", "eval_results", "redteam_attacks", "redteam_results", "guardrail_reviews", "daily_metrics", "incidents"]}
```

```answer
{
  "id": "ops-01-p1",
  "prompt": "How many conversations did the assistant handle from May to August?",
  "answer": 233808,
  "format": "number",
  "dataset": "llmops",
  "files": ["daily_metrics"],
  "pyVerify": "int(daily['conversations'].sum())",
  "hint": "The second line printed.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The provider updates the model behind the name you use. Which evaluation can catch the effect?",
    "options": ["Only the offline suite you ran before launch", "Online monitoring of live traffic, and re-running the suite regularly", "Neither", "Customer surveys"],
    "answer": 1,
    "explanation": "Offline tests run when you change something; this change isn't yours."
  },
  {
    "prompt": "What is offline evaluation for?",
    "options": ["Watching live traffic", "Deciding whether a change is safe to release, before customers see it", "Billing", "Training the model"],
    "answer": 1,
    "explanation": "It's the release gate."
  },
  {
    "prompt": "Why add new test cases after an incident?",
    "options": ["To make the suite bigger", "So the same failure is caught automatically before any future release", "Regulators require it", "To slow releases down"],
    "answer": 1,
    "explanation": "Every incident should leave a test behind."
  }
]
```
