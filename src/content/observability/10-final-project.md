---
title: "Final project: Tallybook's reliability review"
minutes: 20
summary: Plan your final project, a reliability review that finds the real cause of the month-end outages with metrics, logs and traces, and sets the SLOs, alerts, capacity plan and practices that prevent them.
---

## The problem

Tallybook's CTO has read three explanations of the month-end outages: too few web servers, a cryptominer, and now a database connection pool. The board wants one clear account and a plan. Your final project is the reliability review: what really happened, proved with telemetry, and what Tallybook will measure and change so it doesn't happen again.

## The concept

### The parts of the review

| Part | Built in |
| :-- | :-- |
| The cause, from metrics, logs and traces | lessons 1 to 4 |
| SLOs and August's performance against them | lesson 5 |
| Alerting: burn-rate rules and the alert clean-up | lessons 6 and 7 |
| Capacity: pool sizing and job isolation | lesson 8 |
| Toil and the error budget policy | lesson 9 |

### Reconcile the explanations

Good reviews don't just give the right answer; they explain why the earlier ones were incomplete. The web fleet and the miner were real issues that made things worse, but the evidence shows the pool was the cause. Say so, with the data.

## Example

The headline evidence in one table: the four golden signals for the API and database, before and during the incident.

```python
import pandas as pd

metrics = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/observability/metrics.csv", parse_dates=["minute"]).set_index("minute")
periods = {"before (08:40-09:39)": ("2026-08-31 08:40", "2026-08-31 09:39"), "during (09:40-10:33)": ("2026-08-31 09:40", "2026-08-31 10:33")}

rows = []
for label, (start, end) in periods.items():
    for service in ["web", "api", "db"]:
        m = metrics[metrics["service"] == service].loc[start:end]
        rows.append({"period": label, "service": service, "requests_per_min": round(m["requests"].mean()),
                     "error_rate_pct": round(m["errors"].sum() / m["requests"].sum() * 100, 2),
                     "p95_ms": round(m["p95_ms"].median()), "saturation_pct": round(m["saturation_pct"].median(), 1)})
pd.DataFrame(rows).set_index(["service", "period"]).sort_index()
```

```text
requests_per_min  error_rate_pct  p95_ms  saturation_pct
service period
api     before (08:40-09:39)              8293            0.05     581            70.8
        during (09:40-10:33)              8272           37.64   14960           100.0
db      before (08:40-09:39)             24878            0.00     173            81.8
        during (09:40-10:33)             24815            0.00     284           100.0
web     before (08:40-09:39)             11847            0.06     621            66.8
        during (09:40-10:33)             11817           26.38   15000            66.8
```

Traffic is almost unchanged; the database's saturation went to 100% and the API's errors and latency followed. The web tier's own saturation barely moved, which is why adding web servers wouldn't have helped.

## Walkthrough

1. Complete the evidence: the log events, the trace comparison and the Little's law calculation.
2. Write the SLOs, August's results and the error budget used.
3. Write the alerting changes and the capacity plan.
4. Open the project brief on the course page and plan the write-up.

## Practice

```answer
{
  "id": "obs-10-p1",
  "prompt": "What was the API's **error rate during** the incident, in per cent? Two decimal places.",
  "answer": 37.64,
  "tolerance": 0.006,
  "format": "number",
  "dataset": "observability",
  "files": ["metrics"],
  "pyVerify": "float(pd.DataFrame(rows).set_index(['service', 'period']).loc[('api', 'during (09:40-10:33)'), 'error_rate_pct'])",
  "hint": "The api, during row.",
  "required": true
}
```

```task
{
  "id": "obs-10-t1",
  "prompt": "Write the **executive summary** of your reliability review (100 to 200 words): the **real cause** with the evidence from **metrics, logs and traces**, why the **earlier explanations** were incomplete, the **SLO** result, and the **changes** (alerts, capacity, policy).",
  "minutes": 10,
  "rows": 9,
  "placeholder": "The month-end outages were caused by ...",
  "rules": [
    { "label": "Names the cause (connection pool, bulk job)", "pattern": "pool[\\s\\S]*(bulk|job)|(bulk|job)[\\s\\S]*pool" },
    { "label": "Cites metrics, logs and traces", "pattern": "metric[\\s\\S]*log[\\s\\S]*trace|trace[\\s\\S]*log[\\s\\S]*metric|log[\\s\\S]*trace[\\s\\S]*metric|metric[\\s\\S]*trace[\\s\\S]*log" },
    { "label": "Addresses earlier explanations (web servers, miner)", "pattern": "web server|miner|earlier|previous" },
    { "label": "An SLO result with a percentage", "pattern": "slo[\\s\\S]*\\d+(\\.\\d+)?\\s*%|\\d+(\\.\\d+)?\\s*%[\\s\\S]*slo" },
    { "label": "Changes (alert, pool, isolate, policy)", "pattern": "alert|isolat|policy|pool size", "min": 2 },
    { "label": "Between 100 and 200 words", "minWords": 100, "maxWords": 200 }
  ],
  "sample": "The month-end outages were caused by the bulk invoice-sending job sharing the API's database connection pool. On 31 August, metrics show traffic unchanged at 09:40 while database pool saturation hit 100% and API errors and latency soared; the logs show the bulk job starting at 09:40:02 and the errors stopping after the pool was doubled and the job throttled at 10:34; and traces show requests spending seconds waiting for a connection while queries themselves barely slowed. Earlier explanations were incomplete: the web servers were never saturated, and the cryptominer, though serious, affected one server. The two incidents used about three times August's error budget, leaving availability below the 99.9% SLO. We will isolate the bulk job in its own small pool and run it overnight, size the API pool for next month-end with 30% headroom, replace noisy CPU and host pages with SLO burn-rate alerts, and adopt an error budget policy agreed with product.",
  "note": "One sentence per kind of evidence makes the cause hard to argue with.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why explain why earlier explanations were incomplete?",
    "options": ["To blame people", "So readers trust the conclusion and the right fixes are funded", "It's tradition", "To lengthen the report"],
    "answer": 1,
    "explanation": "Reconciling evidence builds confidence."
  },
  {
    "prompt": "Which evidence showed the web servers weren't the bottleneck?",
    "options": ["Their names", "Their saturation barely changed while the database pool hit 100%", "Logs from the miner", "The bill"],
    "answer": 1,
    "explanation": "Saturation points at the constrained resource."
  },
  {
    "prompt": "What turns a reliability review into lasting change?",
    "options": ["A long report", "SLOs, alerts, capacity changes and a policy, each with an owner", "More dashboards", "Blame"],
    "answer": 1,
    "explanation": "Owned changes, measured against SLOs."
  }
]
```
