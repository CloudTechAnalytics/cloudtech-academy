---
title: Distributed traces
minutes: 15
summary: Read traces made of spans, rebuild a request's path through the web tier, API, database and email provider, and compare where time goes in normal and incident traffic.
---

## The problem

The logs pointed at the database connection pool. But a request at Tallybook passes through several services: the web tier, the API, the database, and for invoice-sending, a PDF renderer and an email provider. During an incident, everything looks slow. Which part is actually waiting, and on what?

**Traces** answer that. Tallybook samples requests and records each one's full path, with the time spent in every step.

## The concept

**Spans and traces**

A **trace** is one request's journey. It's made of **spans**: each span is one operation (an HTTP call, a database query), with a start time, a duration, a status, and a **parent** span. The spans form a tree.

```text nocheck
web   GET /api/invoices ─────────────────────────────────────┐ 5,015 ms
  api   GET /invoices ──────────────────────────────────────┐
    db    acquire connection ███████████████████████████████  4,900 ms
    db    SELECT invoices     █ 98 ms
```

**Self time and the critical path**

A parent span's duration includes its children. To find where time really goes, look at the **leaf** spans (the ones doing the work), or each span's **self time** (its duration minus its children's).

**Sampling**

Recording every request is expensive. Most systems sample (for example 1%), plus every request that errors or is very slow.

## Example

Load the spans, sampled at 08:30 (normal) and 09:55 (incident):

```python
import pandas as pd

spans = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/observability/spans.csv")
print(spans.groupby("window")["trace_id"].nunique())

one = spans[spans["trace_id"] == spans.loc[(spans["window"] == "incident") & (spans["operation"] == "acquire connection"), "trace_id"].iloc[0]]
one[["span_id", "parent_span_id", "service", "operation", "start_ms", "duration_ms", "status"]]
```

```text
window
incident    100
normal      100
Name: trace_id, dtype: int64
    span_id parent_span_id service                operation  start_ms  duration_ms status
480  s00481            NaN     web  POST /api/invoices/send         0         5015  error
481  s00482         s00481     api      POST /invoices/send         2         5007  error
482  s00483         s00482      db       acquire connection         5         5000  error
```

The root span (web) has no parent; the API span's parent is the root; the database spans' parent is the API span. Nearly all of this request's time was spent waiting to **acquire** a connection, not running the query. Now across all traces: median time per leaf operation, normal against incident.

```python
parents = set(spans["parent_span_id"].dropna())
leaves = spans[~spans["span_id"].isin(parents)]
leaves.pivot_table(index="operation", columns="window", values="duration_ms", aggfunc="median").round(0)
```

```text
window                           incident  normal
operation
POST /v3/mail/send                  184.0   197.0
SELECT invoice, lines, customer      98.0    54.0
SELECT invoices                     104.0    64.0
acquire connection                 4756.0     4.0
render invoice pdf                  128.0   131.0
```

The queries themselves took only a few dozen milliseconds longer. The PDF renderer and the email provider didn't change at all. The difference is almost entirely **waiting for a connection**: from a few milliseconds to several seconds. And how many incident traces gave up entirely?

```python
acquire = spans[spans["operation"] == "acquire connection"]
acquire.groupby("window").agg(traces=("trace_id", "nunique"), failed=("status", lambda s: (s == "error").sum()),
                              median_wait_ms=("duration_ms", "median"), max_wait_ms=("duration_ms", "max"))
```

```text
traces  failed  median_wait_ms  max_wait_ms
window
incident     100      47          4756.5         5000
normal       100       0             4.0            8
```

The 5,000 ms maximum is the pool's timeout: requests that waited that long were failed by the API, and the web tier turned them into errors for customers.

## Walkthrough

1. Run the cells. For one normal trace of `POST /api/invoices/send`, list every span in order and its self time.
2. What share of incident traces' total time was connection waiting?
3. Why would adding web servers have made this incident worse, not better? (Hint: more servers, more requests competing for the same pool.)
4. Explain to a non-engineer, in three sentences, what the traces show.

## Practice

```answer
{
  "id": "obs-04-p1",
  "prompt": "In how many **incident** traces did acquiring a database connection **fail**?",
  "answer": 47,
  "format": "number",
  "dataset": "observability",
  "files": ["spans"],
  "pyVerify": "int(((acquire['window'] == 'incident') & (acquire['status'] == 'error')).sum())",
  "hint": "The failed value in the incident row.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is a span?",
    "options": ["A whole request", "One operation within a request, with timing, status and a parent", "A log level", "A metric"],
    "answer": 1,
    "explanation": "Spans form a trace's tree."
  },
  {
    "prompt": "Why look at leaf spans or self time?",
    "options": ["They're shorter", "Parent spans include their children's time, so leaves show where work actually happens", "Leaves are errors", "It's required"],
    "answer": 1,
    "explanation": "Avoid counting the same time twice."
  },
  {
    "prompt": "Queries are slightly slower, but waiting for a connection takes seconds. What's the bottleneck?",
    "options": ["Slow queries", "Too few connections for the work arriving: the pool", "The email provider", "DNS"],
    "answer": 1,
    "explanation": "Waiting, not working."
  }
]
```
