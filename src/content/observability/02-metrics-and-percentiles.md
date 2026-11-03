---
title: Metrics and percentiles
minutes: 25
summary: Why averages hide what users experience, how percentiles (p50, p95, p99) show it, how to read latency over a day, and which metrics to put on a service's first dashboard.
---

## The problem

Tallybook's old dashboard showed one latency number: the average. On a normal day it said about 200 milliseconds, and everyone relaxed. But users don't experience averages. One in twenty requests can be several times slower than the average, and the people making those requests are the ones who complain, refresh, and retry, adding more load.

## The concept

### Percentiles

The **p95** is the time that 95% of requests are faster than; 5% are slower. p50 is the median; p99 is the slowest 1%.

| Measure | Tells you |
| :-- | :-- |
| p50 | the typical experience |
| p95 | what a meaningful minority experiences; good for SLOs |
| p99 | the tail: often a different problem (cold caches, lock waits, retries) |
| Average | dragged by outliers, matches nobody's experience |

### Percentiles don't average

You can't average p95s across minutes or servers and get the p95 of the whole. Compute percentiles from the raw data, or use histogram metrics that can be combined.

![Twenty request times sorted as bars: p50 is 255 ms, p95 is 900 ms, and the average of 498 ms is pulled up by one 4,200 ms request; a side box shows two servers' p95s of 100 and 1,000 ms averaging to 550 ms while the true p95 is about 1,000 ms](/images/courses/observability/percentiles.svg "p50, p95 and the average for 20 example requests; and why p95s can't be averaged.")

### A first dashboard

For each service: requests per minute, error rate, p50 and p95 (or p99) latency, and saturation of its tightest resource, on the same time axis.

## Example

The API's latency percentiles before the incident, by hour:

```python
import pandas as pd

metrics = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/observability/metrics.csv", parse_dates=["minute"])
api = metrics[metrics["service"] == "api"].set_index("minute")
normal = api.loc["2026-08-31 06:00":"2026-08-31 09:39"]
normal.groupby(normal.index.hour)[["requests", "p50_ms", "p95_ms", "p99_ms"]].mean().round(0)
```

```text
requests  p50_ms  p95_ms  p99_ms
minute
6         3372.0   207.0   445.0   812.0
7         5856.0   243.0   515.0   925.0
8         7717.0   269.0   567.0  1008.0
9         8339.0   278.0   586.0  1037.0
```

Even on a good morning, the slowest 1% of API requests take several times as long as the median, and latency rises with traffic. Now the same measures during the incident:

```python
during = api.loc["2026-08-31 09:40":"2026-08-31 10:33"]
pd.DataFrame({"before (06:00-09:39)": normal[["p50_ms", "p95_ms", "p99_ms"]].median(),
              "during (09:40-10:33)": during[["p50_ms", "p95_ms", "p99_ms"]].median()}).round(0)
```

```text
before (06:00-09:39)  during (09:40-10:33)
p50_ms                 254.0                6058.0
p95_ms                 539.0               14960.0
p99_ms                 962.0               15708.0
```

During the incident even the median request took about six seconds, and p95 and p99 were around 15 seconds. A dashboard showing only the average would have shown "slow"; the percentiles show that nearly every request was badly delayed, and the error rate (lesson 1) shows more than a third of API requests failing outright.

## Walkthrough

1. Run the cells. Compute the ratio of p99 to p50 for each hour before the incident. Is it stable?
2. Plot p50, p95 and p99 for the API across the day on a logarithmic axis.
3. Why is averaging the three services' p95s meaningless?
4. Sketch the four panels of the API's dashboard (the task below).

## Practice

```answer
{
  "id": "obs-02-p1",
  "prompt": "What was the API's median **p95** latency **during** the incident, in milliseconds?",
  "answer": 14960.5,
  "format": "number",
  "dataset": "observability",
  "files": ["metrics"],
  "pyVerify": "float(during['p95_ms'].median())",
  "hint": "The p95_ms row, during column.",
  "required": true
}
```

```task
{
  "id": "obs-02-t1",
  "prompt": "Design the **API's first dashboard**: one line per panel, starting with a dash, naming the **metric**, how it's **shown** and **why** it's there. Cover all **four golden signals**.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "- Traffic: ...",
  "rules": [
    { "label": "At least four panels, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 4 },
    { "label": "Traffic (requests per minute)", "pattern": "request|traffic" },
    { "label": "Errors (rate or percentage)", "pattern": "error" },
    { "label": "Latency with percentiles", "pattern": "p9[59]|percentile" },
    { "label": "Saturation (pool, CPU, connections)", "pattern": "saturat|pool|connection|cpu" },
    { "label": "No averages for latency", "pattern": "average latency|mean latency", "absent": true }
  ],
  "sample": "- Traffic: API requests per minute, as a line, to see load and compare with the same time last week.\n- Errors: share of requests returning 5xx, as a line with the SLO threshold drawn on it.\n- Latency: p50 and p95 (and p99 on a second axis), never the average, because users experience the tail.\n- Saturation: database connections in use as a share of the pool, with 100% marked, since the pool is the API's tightest resource.",
  "note": "Putting the pool on the API's dashboard, not only the database's, is the lesson from 31 August.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A p95 latency of 400 ms means what?",
    "options": ["The average is 400 ms", "95% of requests take 400 ms or less", "5% of requests take 400 ms", "The slowest request took 400 ms"],
    "answer": 1,
    "explanation": "And 5% take longer."
  },
  {
    "prompt": "Why are averages poor latency measures?",
    "options": ["They're hard to compute", "A few very slow requests distort them, and they match nobody's actual experience", "They're always too high", "They need percentiles"],
    "answer": 1,
    "explanation": "Use percentiles."
  },
  {
    "prompt": "Can you average five servers' p95 values to get the p95 for all of them?",
    "options": ["Yes", "No: compute percentiles from the combined data or mergeable histograms", "Only for the same hour", "Only for errors"],
    "answer": 1,
    "explanation": "Percentiles don't average."
  }
]
```
