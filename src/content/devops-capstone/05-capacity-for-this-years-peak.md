---
title: Capacity for this year's peak
minutes: 25
summary: Turn last year's peak and this year's forecast into a capacity target, read a load test to find what limits each configuration, and use Little's law to see why a connection pooler fixes last year's problem.
---

## The problem

Marketing expects this year's sale to bring **1.6 times** last year's peak traffic. The team ran a load test in staging (`loadtest.csv`): for each configuration, the highest request rate it handled while keeping p95 latency under 800 ms and errors under 1%. How much capacity does Kasuwa need, and which configuration delivers it?

## The concept

**A capacity target**

Target = last year's peak × expected growth × **headroom**. Headroom (here 30%) covers forecast error, uneven traffic within a minute, and losing an instance or two at the worst moment.

**Find the limiting resource**

Each configuration hits a different wall: app instances, database connections or database CPU. Adding more of something that isn't the limit does nothing, as last year showed.

**Little's law**

Average number of things in a system = arrival rate × time each spends there. For a database: connections busy at once = queries per second × seconds per query. It tells you how many connections you actually need, and it's usually far fewer than 20 per instance.

## Example

The target:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/platform/"
metrics = pd.read_csv(base + "sale_metrics.csv")
load = pd.read_csv(base + "loadtest.csv")
peak_2025 = metrics["requests_per_s"].max()
target = peak_2025 * 1.6 * 1.3
print(f"2025 peak {peak_2025:.1f} req/s × 1.6 growth × 1.3 headroom = target {target:.0f} req/s")
```

```text
2025 peak 160.3 req/s × 1.6 growth × 1.3 headroom = target 333 req/s
```

What each configuration can handle:

```python
table = load.pivot_table(index="instances", columns=["pooler", "db_class"], values="max_rps_within_slo")
print(table, "\n")
load.groupby(["pooler", "db_class"])["limited_by"].agg(lambda s: ", ".join(dict.fromkeys(s)))
```

```text
pooler               no            yes
db_class  db.r6g.xlarge db.r6g.2xlarge db.r6g.xlarge
instances
6                  74.0           73.0          69.0
9                 104.0          106.0         106.0
12                118.0          140.0         145.0
15                119.0          180.0         178.0
18                119.0          211.0         217.0
21                120.0          251.0         249.0
24                119.0          281.0         267.0
27                120.0          339.0         262.0
30                119.0          373.0         253.0

pooler  db_class
no      db.r6g.xlarge     app instances, database connections
yes     db.r6g.2xlarge                          app instances
        db.r6g.xlarge             app instances, database CPU
Name: limited_by, dtype: object
```

Without a pooler, capacity stops at about 120 requests a second, however many instances you add: the database connections run out, exactly as on sale day. With the pooler, capacity grows with instances until the current database's CPU becomes the limit. Only the larger database lets capacity keep growing. The smallest configuration that meets the target:

```python
enough = load[load["max_rps_within_slo"] >= target].sort_values("instances")
enough.head(3)
```

```text
pooler        db_class  instances  max_rps_within_slo     limited_by
25    yes  db.r6g.2xlarge         27                 339  app instances
26    yes  db.r6g.2xlarge         30                 373  app instances
```

So the plan is: the pooler, the larger database, and autoscaling allowed up to **30** instances, since the smallest passing size leaves almost no room beyond the headroom. That matches the `max_size` in PR 214.

Why does the pooler work? With Little's law, at the target rate, and assuming each request spends about 60 ms in the database:

```python
db_seconds_per_request = 0.060
busy_connections = target * db_seconds_per_request
print(f"Connections busy at once at {target:.0f} req/s: about {busy_connections:.0f}")
print(f"Connections last year's setup would open at 30 instances: {30 * 20}")
```

```text
Connections busy at once at 333 req/s: about 20
Connections last year's setup would open at 30 instances: 600
```

The work needs about twenty connections at a time. Last year's design opened twenty **per instance**, whether busy or idle. A pooler lets many app instances share a small set of real database connections.

## Walkthrough

1. Run the cells.
2. Recompute the target with growth of 1.4 and 2.0. Which configuration does each need?
3. Plot capacity against instances for the three configurations, with a horizontal line at the target.
4. List what the load test didn't cover: for example, the payment gateway's own limits.
5. Write the capacity plan (the task below).

## Practice

```answer
{
  "id": "cdc-05-p1",
  "prompt": "What is the **capacity target** in requests per second? Whole number.",
  "answer": 333,
  "format": "number",
  "dataset": "platform",
  "files": ["sale_metrics"],
  "pyVerify": "round(target)",
  "hint": "Last year's peak × 1.6 × 1.3.",
  "required": true
}
```

```answer
{
  "id": "cdc-05-p2",
  "prompt": "What is the **smallest number of instances** in the load test that meets the target?",
  "answer": 27,
  "format": "number",
  "dataset": "platform",
  "files": ["loadtest", "sale_metrics"],
  "pyVerify": "int(enough['instances'].iloc[0])",
  "hint": "The first row of the last table.",
  "required": true
}
```

```task
{
  "id": "cdc-05-t1",
  "prompt": "Write the **capacity plan** (60 to 140 words): the **target** and how you got it, the configuration you need and **why** the others fail, the role of the **pooler**, and one **limit** of the load test.",
  "minutes": 7,
  "rows": 6,
  "placeholder": "Target: ...",
  "rules": [
    { "label": "Gives the target", "pattern": "\\d{3}\\s*(req|requests)" },
    { "label": "Explains growth and headroom", "pattern": "headroom|1\\.6|1\\.3" },
    { "label": "Names the configuration (pooler, database size, instances)", "pattern": "2xlarge|larger database|bigger database" },
    { "label": "Explains why others fail (connections, CPU)", "pattern": "connection|cpu" },
    { "label": "Covers the pooler", "pattern": "pooler|pgbouncer" },
    { "label": "A limit of the test", "pattern": "didn't|did not|doesn't|does not|not cover|untested|payment gateway|staging" },
    { "label": "Between 60 and 140 words", "minWords": 60, "maxWords": 140 }
  ],
  "sample": "Target: 333 requests a second, from last year's peak of 160 × 1.6 expected growth × 1.3 headroom. We need the PgBouncer pooler, the db.r6g.2xlarge database and up to 30 checkout instances: 27 is the smallest size that passes, with almost no margin. Without a pooler, capacity is stuck at about 120 requests a second because the database runs out of connections; with the current database, CPU caps it at about 260. The pooler works because the load needs only about 20 database connections at once (Little's law), while last year's design opened 20 per instance. The load test ran in staging and didn't include the payment gateway's limits, so we'll confirm those with the provider.",
  "note": "A plan is only as good as its assumptions; name them.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Without a pooler, adding instances beyond 10 doesn't add capacity. Why?",
    "options": ["The load balancer is full", "The database's connection limit is the bottleneck", "Instances are slow", "The test was wrong"],
    "answer": 1,
    "explanation": "Scale the bottleneck, not something else."
  },
  {
    "prompt": "A system handles 300 queries a second, each taking 0.05 s. How many connections are busy on average?",
    "options": ["15", "300", "6,000", "50"],
    "answer": 0,
    "explanation": "Little's law: 300 × 0.05."
  },
  {
    "prompt": "Why add headroom to the forecast?",
    "options": ["To spend budget", "To cover forecast error, bursts within a minute and losing instances at the peak", "It's a tradition", "For the load test"],
    "answer": 1,
    "explanation": "Forecasts are never exact."
  }
]
```
