---
title: What observability is
minutes: 15
summary: What observability means, the three kinds of telemetry (metrics, logs and traces), the four golden signals, and a first look at the minute-by-minute record of Tallybook's month-end outage.
---

## The problem

Across this track, the outage on the morning of 31 August has had several explanations. The cloud review blamed a fixed number of web servers. The Linux investigation found a cryptominer eating CPU on one server. Both were real problems. Neither was the cause.

Finding the real cause of a problem in a running system, quickly, is what **observability** is for. Tallybook had been collecting the data all along: metrics every minute, structured logs and request traces. In this course you'll use them to find out what actually happened, then build the SLOs, alerts and practices that would catch it sooner.

## The concept

**Monitoring and observability**

**Monitoring** answers questions you thought of in advance ("is CPU above 80%?"). **Observability** is being able to answer questions you didn't think of, from the data a system already produces ("why are only invoice-sending requests slow, and only since 09:40?").

**Three kinds of telemetry**

| Signal | What it is | Good for |
| :-- | :-- | :-- |
| **Metrics** | numbers over time (requests per minute, p95 latency) | seeing that something changed, and when; alerting |
| **Logs** | timestamped records of events, ideally structured (JSON) | details of what happened to specific requests |
| **Traces** | the path of one request through every service, with timings | seeing where time is spent, across services |

**The four golden signals**

For any service: **latency** (how long requests take), **traffic** (how many), **errors** (how many fail), and **saturation** (how full the most constrained resource is).

## Example

The minute-by-minute metrics for 31 August, for the web tier, the API and the database:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/observability/"
metrics = pd.read_csv(base + "metrics.csv", parse_dates=["minute"])
print(metrics["service"].value_counts())

web = metrics[metrics["service"] == "web"].set_index("minute")
web["error_rate"] = web["errors"] / web["requests"]
bad = web[web["error_rate"] > 0.05]
print("Minutes with more than 5% errors:", len(bad), "from", bad.index.min().strftime("%H:%M"), "to", bad.index.max().strftime("%H:%M"))
```

```text
service
web    1440
api    1440
db     1440
Name: count, dtype: int64
Minutes with more than 5% errors: 54 from 09:40 to 10:33
```

The metrics pin the outage to the minute. Now the four golden signals for each service, at 09:30 (before) and 10:00 (during):

```python
cols = ["requests", "errors", "p95_ms", "saturation_pct"]
snapshot = metrics[metrics["minute"].isin(pd.to_datetime(["2026-08-31 09:30", "2026-08-31 10:00"]))]
snapshot.set_index(["service", "minute"])[cols].sort_index()
```

```text
requests  errors  p95_ms  saturation_pct
service minute
api     2026-08-31 09:30:00      8206       4     594            71.7
        2026-08-31 10:00:00      8541    3594   16578           100.0
db      2026-08-31 09:30:00     24618       0     177            82.8
        2026-08-31 10:00:00     25623       0     288           100.0
web     2026-08-31 09:30:00     11723       7     634            67.7
        2026-08-31 10:00:00     12202    3598   16618            68.7
```

Traffic barely changed between 09:30 and 10:00. But errors and latency exploded, and look at saturation: the web tier is about as busy as before, while the database's connection pool went to 100%. The web servers weren't the bottleneck; something in the database was. The next lessons find out what.

## Walkthrough

1. Run the cells. Plot web error rate and database saturation over the whole day on one chart.
2. When does database saturation reach 100%, and when does it fall back?
3. What was the busiest minute of the day for traffic? Did it have errors?
4. For each golden signal, name the metric in this dataset that measures it for the API.

## Practice

```dataset
{"dataset": "observability", "files": ["metrics", "db_pool", "daily_sli", "spans", "alerts", "toil"]}
```

```answer
{
  "id": "obs-01-p1",
  "prompt": "How many minutes on 31 August had a web **error rate above 5%**?",
  "answer": 54,
  "format": "number",
  "dataset": "observability",
  "files": ["metrics"],
  "pyVerify": "len(bad)",
  "hint": "The second line printed.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which telemetry shows where time goes inside one request across several services?",
    "options": ["Metrics", "Traces", "Logs only", "Dashboards"],
    "answer": 1,
    "explanation": "Traces follow a request through every service."
  },
  {
    "prompt": "Which is NOT one of the four golden signals?",
    "options": ["Latency", "Saturation", "Number of engineers", "Errors"],
    "answer": 2,
    "explanation": "Latency, traffic, errors and saturation."
  },
  {
    "prompt": "Traffic is flat but errors jump and the database is 100% saturated. What's the likely bottleneck?",
    "options": ["Too many users", "The database, not the web servers", "The network", "DNS"],
    "answer": 1,
    "explanation": "Saturation shows which resource ran out."
  }
]
```
