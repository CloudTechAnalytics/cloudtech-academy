---
title: Last year's outage
minutes: 30
summary: Reconstruct the 2025 sale-day outage from per-minute metrics and error logs, measure its impact, find the real cause, and see why autoscaling made it worse.
---

## The problem

Everyone at Kasuwa remembers the outage. Everyone remembers a different cause: "the database fell over", "we didn't have enough servers", "the payment gateway was down". The postmortem was never written. Before you change anything for this year, find out what actually happened, from the data.

You have per-minute metrics for checkout from 08:00 to 14:00 on sale day (`sale_metrics.csv`) and the checkout service's error logs, sampled one line in fifty (`sale_logs.jsonl`).

## The concept

### Impact first

When did it start and end, and how many requests failed? Use a clear definition: here, a minute is **bad** if more than 5% of requests failed.

### Look for what changed just before

Plot the metrics around the start. Something crosses a line: traffic, instances, connections, latency.

### Read the errors

The logs say what failed. If one message dominates the bad minutes, it points at the cause.

### Cause, not trigger

Traffic was the **trigger**: it was always going to rise. The **cause** is why the system couldn't handle it. Postmortems that stop at "traffic was high" lead to the wrong fix.

![An invented incident with bad minutes marked on a request chart, defining a bad minute first, and the difference between the trigger (traffic) and the cause (why the system could not cope)](/images/courses/devops-capstone/outage-review.svg "Impact first; then what crossed a line; then trigger versus cause.")

## Example

The impact:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/platform/"
metrics = pd.read_csv(base + "sale_metrics.csv", parse_dates=["minute"])
metrics["requests"] = metrics["requests_per_s"] * 60
metrics["failed"] = metrics["requests"] * metrics["error_rate"]
bad = metrics[metrics["error_rate"] > 0.05]
print(f"Bad minutes: {len(bad)}, from {bad['minute'].min():%H:%M} to {bad['minute'].max():%H:%M}")
print(f"Failed requests that day: {metrics['failed'].sum():,.0f} of {metrics['requests'].sum():,.0f} ({metrics['failed'].sum() / metrics['requests'].sum():.1%})")
print(f"Peak traffic: {metrics['requests_per_s'].max():.1f} requests a second")
```

```text
Bad minutes: 94, from 09:19 to 10:54
Failed requests that day: 151,697 of 2,488,542 (6.1%)
Peak traffic: 160.3 requests a second
```

Now what was happening around the start, every five minutes from 09:00:

```python
cols = ["minute", "requests_per_s", "instances", "db_connections_requested", "db_max_connections", "error_rate", "p95_latency_ms"]
window = metrics[(metrics["minute"] >= "2025-11-28 09:00") & (metrics["minute"] <= "2025-11-28 11:10")]
print(window[cols].iloc[::5].to_string(index=False))
```

```text
minute  requests_per_s  instances  db_connections_requested  db_max_connections  error_rate  p95_latency_ms
2025-11-28 09:00:00            89.7          7                       140                 200      0.0051             547
2025-11-28 09:05:00            90.1          8                       160                 200      0.0042             436
2025-11-28 09:10:00           105.8          9                       180                 200      0.0043             483
2025-11-28 09:15:00           114.5          9                       180                 200      0.0044             520
2025-11-28 09:20:00           122.0         11                       220                 200      0.0959            3091
2025-11-28 09:25:00           124.9         11                       220                 200      0.1142            4173
2025-11-28 09:30:00           134.7         11                       220                 200      0.0978            3933
2025-11-28 09:35:00           133.3         11                       220                 200      0.1020            3161
2025-11-28 09:40:00           127.9         12                       240                 200      0.1701            4364
2025-11-28 09:45:00           140.6         12                       240                 200      0.1799            4491
2025-11-28 09:50:00           138.1         12                       240                 200      0.1789            4204
2025-11-28 09:55:00           147.8         12                       240                 200      0.1784            4837
2025-11-28 10:00:00           142.3         13                       260                 200      0.2040            4216
2025-11-28 10:05:00           149.3         12                       240                 200      0.1590            4202
2025-11-28 10:10:00           145.3         13                       260                 200      0.2197            3873
2025-11-28 10:15:00           144.2         12                       240                 200      0.1759            4343
2025-11-28 10:20:00           149.4         13                       260                 200      0.2763            4017
2025-11-28 10:25:00           135.0         12                       240                 200      0.1770            4692
2025-11-28 10:30:00           141.5         12                       240                 200      0.1622            4241
2025-11-28 10:35:00           144.0         12                       240                 200      0.1948            3830
2025-11-28 10:40:00           152.0         13                       260                 200      0.2644            3285
2025-11-28 10:45:00           145.2         13                       260                 200      0.2608            4333
2025-11-28 10:50:00           141.2         13                       260                 200      0.1781            3908
2025-11-28 10:55:00           138.2         13                       130                 200      0.0236             735
2025-11-28 11:00:00           150.4         13                       130                 200      0.0133             674
2025-11-28 11:05:00           138.1         13                       130                 200      0.0033             683
2025-11-28 11:10:00           153.2         12                       120                 200      0.0046             817
```

The errors start the moment the connections the app **wants** (instances × 20) exceed the 200 the database **allows**. Autoscaling did its job, adding instances as traffic rose, and each new instance opened 20 more connections the database couldn't accept. More servers made it worse. At 10:55 an engineer halved each instance's pool to 10 connections, and the errors stopped. The logs agree:

```python
logs = pd.read_json(base + "sale_logs.jsonl", lines=True)
logs["ts"] = pd.to_datetime(logs["ts"]).dt.tz_localize(None)
logs["during"] = logs["ts"].between(bad["minute"].min(), bad["minute"].max() + pd.Timedelta(minutes=1))
logs.groupby("during")["msg"].value_counts().unstack(0).fillna(0).astype(int)
```

```text
during                                              False  True
msg
inventory lock wait exceeded                           21     14
payment gateway timeout                                38     31
timeout acquiring database connection: pool exh...      0   2818
upstream catalog-api 503                                8      5
```

During the outage, nearly every error is a timeout waiting for a database connection. The payment gateway timeouts were there all morning, a background problem but not the cause. The database itself never "fell over". It refused connections beyond its limit, exactly as configured.

## Walkthrough

1. Run the cells.
2. Plot `db_connections_requested` against `db_max_connections`, with `error_rate` on a second axis.
3. Work out when the outage could have been detected: the first minute the error rate passed 5%.
4. Write the timeline: trigger, cause, detection, mitigation, recovery.
5. Write the postmortem summary (the task below).

## Practice

```answer
{
  "id": "cdc-02-p1",
  "prompt": "How many **bad minutes** (error rate above 5%) were there on sale day?",
  "answer": 94,
  "format": "number",
  "dataset": "platform",
  "files": ["sale_metrics"],
  "verify": "SELECT COUNT(*) FROM sale_metrics WHERE error_rate > 0.05",
  "hint": "The first line printed.",
  "required": true
}
```

```answer
{
  "id": "cdc-02-p2",
  "prompt": "During the outage, how many **instances** would have used up all 200 database connections at 20 connections each?",
  "answer": 10,
  "format": "number",
  "hint": "200 ÷ 20.",
  "explanation": "From the 11th instance on, every new instance asked for connections the database refused.",
  "required": true
}
```

```task
{
  "id": "cdc-02-t1",
  "prompt": "Write the **postmortem summary** (70 to 160 words): **impact** with numbers, the **trigger**, the **cause**, why **autoscaling** made it worse, how it was **mitigated**, and what was **not** the cause.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "On 28 November 2025 ...",
  "rules": [
    { "label": "Impact with numbers", "pattern": "\\d+\\s*(minutes|min)|[\\d,]{5,}" },
    { "label": "The trigger (traffic)", "pattern": "traffic|load|requests" },
    { "label": "The cause (connections)", "pattern": "connection" },
    { "label": "Explains autoscaling's role", "pattern": "autoscal|instances|more servers" },
    { "label": "The mitigation (pool size)", "pattern": "pool" },
    { "label": "Rules something out (payment gateway, database didn't fail)", "pattern": "not the cause|wasn't the cause|was not|never|background" },
    { "label": "Between 70 and 160 words", "minWords": 70, "maxWords": 160 }
  ],
  "sample": "On 28 November 2025, checkout errors exceeded 5% for 94 minutes, from 09:19 to 10:54, and about 152,000 requests failed that day (6.1% of all checkout traffic). The trigger was sale traffic rising to 160 requests a second. The cause was the database connection limit: each checkout instance opened a pool of 20 connections, and the database allowed 200. Autoscaling added instances as traffic rose, so from the 11th instance on, every new instance asked for connections the database refused, and requests timed out waiting. More servers made it worse. At 10:55 an engineer halved the pool size to 10 and errors stopped. The payment gateway timeouts were a background problem all morning, not the cause, and the database never failed: it enforced its limit.",
  "note": "Ruling out the popular explanations is part of the job.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why is \"traffic was too high\" a poor root cause?",
    "options": ["Traffic is never high", "Traffic was the trigger and was expected; the cause is why the system couldn't handle it", "It's too technical", "It blames customers"],
    "answer": 1,
    "explanation": "Fix causes, not triggers."
  },
  {
    "prompt": "How did autoscaling make the outage worse?",
    "options": ["It was too slow", "Each new instance opened more database connections than the database allowed", "It removed instances", "It cost too much"],
    "answer": 1,
    "explanation": "Scaling one tier overloaded the tier behind it."
  },
  {
    "prompt": "Payment gateway timeouts appear in the logs all morning. Are they the cause?",
    "options": ["Yes", "No: they're present before and after, while the outage's errors are database connection timeouts", "Only after 11:00", "Can't tell"],
    "answer": 1,
    "explanation": "Compare error types inside and outside the incident window."
  }
]
```
