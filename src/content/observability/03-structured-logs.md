---
title: Structured logs
minutes: 25
summary: Why logs should be structured (JSON) rather than free text, how to filter and count them like data, and how to use them to find the event that started an incident.
---

## The problem

Metrics told you **when** the outage started and **which** resource ran out. They can't tell you **why** the database's connection pool suddenly filled at 09:40 on the dot. Something happened at 09:40. Logs record events, and one of them is the answer.

Tallybook's services write **structured** logs: one JSON object per line, with named fields. That makes them data you can filter, count and join, rather than text to squint at.

## The concept

### Free text versus structured

```text nocheck
2026-08-31 09:58:12 ERROR db pool exhausted for /api/invoices after 5000ms (40/40)
{"ts": "2026-08-31T09:58:12.031Z", "level": "error", "service": "api", "message": "db pool exhausted: no connection within 5000 ms", "route": "GET /api/invoices", "pool_in_use": 40, "pool_size": 40, "trace_id": "4f1c..."}
```

The second can be filtered by `service`, grouped by `route`, and linked to a trace by `trace_id`, without fragile text matching.

![A free-text log line compared with the same event as JSON fields: ts, level, service, message, route, pool_in_use, pool_size and trace_id, with arrows showing filter, group, compare and follow; below, the four log levels](/images/courses/observability/structured-logs.svg "Structured logs: every detail is a field you can filter, group or follow.")

### Log levels

`debug` (detail for developers), `info` (normal events), `warn` (something odd, still working), `error` (a request failed). Alert on rates of errors, not individual lines.

### Good logging habits

- Log events with context (IDs, durations, counts), not prose.
- Include a **trace ID** so a log line leads to the full request.
- Never log secrets or personal data (passwords, card numbers, full phone numbers).

## Example

Load the logs from 09:30 to 10:45 and count by level and service:

```python
import pandas as pd

logs = pd.read_json("https://academy.cloudtechanalytics.com/datasets/observability/app_logs.jsonl", lines=True)
logs["ts"] = pd.to_datetime(logs["ts"])
print(len(logs), "log lines")
pd.crosstab(logs["service"], logs["level"])
```

```text
1080 log lines
level    error  info  warn
service
api        189   604   118
web        140     0     0
worker       0    29     0
```

Errors per 10 minutes, by message:

```python
errors = logs[logs["level"] == "error"]
errors.groupby([errors["ts"].dt.floor("10min").dt.strftime("%H:%M"), "message"]).size().unstack(fill_value=0)
```

```text
message  db pool exhausted: no connection within 5000 ms  upstream timed out after 30000 ms
ts
09:40                                                 25                                 29
09:50                                                 32                                 30
10:00                                                 37                                 26
10:10                                                 43                                 24
10:20                                                 37                                 23
10:30                                                 15                                  8
```

The errors start in the 09:40 window and stop by 10:40. Now the key question: what else happened at those moments? Look at every log line that isn't a routine request or error, from the worker and from configuration changes:

```python
events = logs[~logs["message"].isin(["request completed", "slow db connection acquire", "db pool exhausted: no connection within 5000 ms",
                                    "upstream timed out after 30000 ms", "bulk send batch sent"])]
print(events[["ts", "service", "message", "job", "invoices_queued", "concurrency", "changed_by"]].to_string(index=False))
```

```text
ts service                                message                 job  invoices_queued  concurrency changed_by
2026-08-31 09:40:02.114000+00:00  worker                  bulk send job started month-end-bulk-send          41250.0         24.0        NaN
2026-08-31 10:33:40.502000+00:00     api config reloaded: db pool size 40 -> 80                 NaN              NaN          NaN        ada
2026-08-31 10:34:05.871000+00:00  worker                bulk send job throttled month-end-bulk-send              NaN          4.0        ada
```

That's the story. At 09:40:02, the month-end bulk send job started, queueing tens of thousands of invoices to send with 24 at a time, each needing a database connection from the same pool the API uses. At 10:33 and 10:34, Ada doubled the pool and throttled the job. The errors stopped. The web servers had nothing to do with it.

## Walkthrough

1. Run the cells. How many "bulk send batch sent" lines are there, and how many invoices did they send?
2. Which routes appear most in the error lines? Does any route escape?
3. Pick one error line's trace ID. Lesson 4 shows what a trace ID leads to.
4. Write three logging rules for Tallybook's developers (the task below).

## Practice

```answer
{
  "id": "obs-03-p1",
  "prompt": "How many **error**-level log lines are there in the file?",
  "answer": 329,
  "format": "number",
  "pyVerify": "int((logs['level'] == 'error').sum())",
  "hint": "Add the error column of the first table.",
  "required": true
}
```

```task
{
  "id": "obs-03-t1",
  "prompt": "Write **logging rules** for Tallybook's developers, one per line starting with a dash: at least **four**, covering **structure**, **trace IDs**, what **never** to log, and **levels**.",
  "minutes": 5,
  "rows": 5,
  "placeholder": "- Log as JSON ...",
  "rules": [
    { "label": "At least four rules, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 4 },
    { "label": "Structured (JSON, fields)", "pattern": "json|structured|field" },
    { "label": "Trace IDs", "pattern": "trace" },
    { "label": "Never log secrets or personal data", "pattern": "never[^\\n]*(password|secret|token|card|personal|phone)|(password|secret|token|personal)[^\\n]*never" },
    { "label": "Levels", "pattern": "level|error|warn" }
  ],
  "sample": "- Log one JSON object per line, with named fields (service, route, duration_ms), not sentences.\n- Include the trace_id on every line written while handling a request.\n- Never log passwords, tokens, card numbers or full phone numbers; log IDs instead.\n- Use error only when a request or job fails, warn for unusual but handled situations, info for key events such as jobs starting and config changes.\n- Log every configuration change and background job start with who or what triggered it.",
  "note": "The last rule is the one that made 31 August's cause findable: the job's start and Ada's fixes were logged as events.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why log as JSON instead of free text?",
    "options": ["It's shorter", "Fields can be filtered, grouped and joined reliably", "It's encrypted", "It's required by law"],
    "answer": 1,
    "explanation": "Structured logs are data."
  },
  {
    "prompt": "What does a trace ID in a log line let you do?",
    "options": ["Delete the log", "Find every other log line and span for the same request", "Encrypt it", "Count users"],
    "answer": 1,
    "explanation": "It links logs to the request's trace."
  },
  {
    "prompt": "Metrics show errors started at 09:40. What do logs add?",
    "options": ["Nothing", "The events around that time, such as a job starting, that explain why", "Faster servers", "Prices"],
    "answer": 1,
    "explanation": "Metrics say when; logs say what happened."
  }
]
```
