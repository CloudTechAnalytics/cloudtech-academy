---
title: Alert quality and on-call
minutes: 25
summary: Measure how useful each alert is (how often it needs action, when it wakes people, how fast it's acknowledged), find the noisy ones, and design an on-call that people can sustain.
---

## The problem

In August, Tallybook's on-call engineer was paged nearly 80 times. Most pages needed no action at all, and many came in the middle of the night. When the real incident started on 31 August, the page arrived alongside the usual morning "WebHighCPU" page that everyone had learned to dismiss.

Alert fatigue is dangerous: people stop trusting alerts, acknowledge without looking, and burn out. The fix starts with measuring each alert's usefulness.

## The concept

**What makes a good page**

Every page should be: **urgent** (needs action now), **actionable** (a person can do something), and **real** (rarely a false alarm). Anything else should be a ticket, a dashboard, or deleted.

**Measure alerts**

| Measure | Question |
| :-- | :-- |
| Volume | how often does it fire? |
| Actionable rate | how often did someone need to do something? |
| Night pages | how often does it wake people? |
| Time to acknowledge | is it being taken seriously? |

**Symptoms, not causes**

Page on what users experience (SLO burn rate, lesson 6). High CPU, a busy queue, one host briefly unreachable: these are causes or noise; they belong on dashboards unless they directly threaten users.

**Sustainable on-call**

A small number of pages per shift, a rotation with enough people, handover notes, and time after a bad night to recover. Every page should be reviewed weekly: keep it, fix it, or delete it.

## Example

August's alerts, summarised by alert:

```python
import pandas as pd

alerts = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/observability/alerts.csv", parse_dates=["fired_at", "resolved_at"])
alerts["night"] = (alerts["fired_at"].dt.hour < 7) | (alerts["fired_at"].dt.hour >= 22)

summary = alerts.groupby(["alert", "severity"]).agg(
    fired=("alert_id", "size"),
    actionable_rate=("actionable", "mean"),
    night=("night", "sum"),
    median_ack_minutes=("minutes_to_acknowledge", "median"),
).round(2).sort_values("fired", ascending=False)
summary
```

```text
fired  actionable_rate  night  median_ack_minutes
alert                      severity
WebHighCPU                 page         42              0.1      0                15.5
HostDown prod-web-04       page         20              0.0     20                 7.5
DiskUsageVarAbove85        ticket       20              1.0     20               297.5
WorkerQueueDepthHigh       page          8              0.0      8                19.0
API5xxRateAbove1pct        page          4              0.5      0                 7.5
LatencyP95Above2s          page          4              0.5      0                 7.0
CertificateExpiresIn30Days ticket        1              1.0      0               180.0
```

Now the on-call engineer's month, in numbers:

```python
pages = alerts[alerts["severity"] == "page"]
print("Pages:", len(pages), " needing action:", int(pages["actionable"].sum()), f"({pages['actionable'].mean():.0%})")
print("Pages at night:", int(pages["night"].sum()), " of which needed action:", int(pages.loc[pages["night"], "actionable"].sum()))
```

```text
Pages: 78  needing action: 8 (10%)
Pages at night: 28  of which needed action: 0
```

Almost nine in ten pages were noise, and not one night-time page needed action. WebHighCPU fired twice every weekday because the web servers simply get busy at peak, and needed action only on the two incident days, when the SLO alerts were already firing. Meanwhile the one alert that kept being right, DiskUsageVarAbove85, was a ticket nobody acted on, and `/var` reached 97% (the Linux course found it).

## Walkthrough

1. Run the cells. For each alert, decide: keep as a page, make a ticket, put on a dashboard only, or delete.
2. If the noisy pages were removed, how many pages would August have had?
3. HostDown prod-web-04 fires briefly most nights. What would you investigate?
4. Write the alert review decisions (the task below).

## Practice

```answer
{
  "id": "obs-07-p1",
  "prompt": "How many **pages** fired in August?",
  "answer": 78,
  "format": "number",
  "dataset": "observability",
  "files": ["alerts"],
  "pyVerify": "len(pages)",
  "hint": "The first number printed.",
  "required": true
}
```

```task
{
  "id": "obs-07-t1",
  "prompt": "Write your **alert review decisions**, one line per alert starting with the alert's name and a colon: **keep**, **ticket**, **dashboard** or **delete**, with the evidence from the summary. Cover at least **five** alerts.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "WebHighCPU: ...",
  "rules": [
    { "label": "At least five alert lines", "pattern": "^\\s*[-*]?\\s*(WebHighCPU|DiskUsageVarAbove85|HostDown|WorkerQueueDepthHigh|API5xxRateAbove1pct|LatencyP95Above2s|CertificateExpiresIn30Days)[^:\\n]*:", "min": 5 },
  { "label": "A decision word on each line", "pattern": "^[^\\n]*:[^\\n]*\\b(keep|ticket|dashboard|delete|replace)", "min": 5 },
    { "label": "WebHighCPU demoted or deleted", "pattern": "WebHighCPU[^\\n]*(dashboard|delete|remove|ticket)" },
    { "label": "Uses evidence (a number or rate)", "pattern": "\\d", "min": 5 },
    { "label": "Mentions replacing with SLO burn-rate alerts", "pattern": "burn|slo" }
  ],
  "sample": "WebHighCPU: dashboard only; it fired 42 times, needed action on 10% of them, and only when the SLO alerts were already firing.\nHostDown prod-web-04: delete as a page; 20 night-time pages, none needing action; investigate the flaky health check in a ticket.\nWorkerQueueDepthHigh: ticket; 8 pages, none actionable, all from the nightly batch.\nAPI5xxRateAbove1pct: replace with the SLO burn-rate page; it caught both incidents but also paged for blips.\nLatencyP95Above2s: replace with the latency SLO burn-rate page; 2 of its 4 pages were the real incidents.\nDiskUsageVarAbove85: keep as a ticket but give it an owner and a 2-day deadline; it was right 20 times and ignored until /var hit 97%.",
  "note": "The disk alert shows that useful alerts can still fail if nobody owns the follow-up.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What should a page always be?",
    "options": ["Frequent", "Urgent, actionable and real", "About CPU", "Sent to everyone"],
    "answer": 1,
    "explanation": "Anything else is a ticket or a dashboard."
  },
  {
    "prompt": "An alert fires daily and almost never needs action. What's the risk?",
    "options": ["None", "People learn to dismiss it, and miss the day it matters", "It costs money", "It slows servers"],
    "answer": 1,
    "explanation": "Alert fatigue hides real incidents."
  },
  {
    "prompt": "Why page on SLO burn rate rather than high CPU?",
    "options": ["CPU is hard to measure", "Burn rate measures what users experience; busy CPU often doesn't hurt anyone", "It's cheaper", "CPU alerts are illegal"],
    "answer": 1,
    "explanation": "Page on symptoms, not causes."
  }
]
```
