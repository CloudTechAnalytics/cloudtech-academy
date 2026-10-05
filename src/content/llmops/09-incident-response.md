---
title: Incident response
minutes: 20
summary: Measure how long incidents took to detect and fix, decide severity and first actions in advance, roll back safely, and write a blameless postmortem that leaves the system better than before.
---

## The problem

Paystream's three incidents took very different times to detect: the outage was found the same day; the provider update after four days; the index rebuild after twelve. Each was handled by whoever happened to be around, with no agreed steps, and none of them led to lasting changes.

When an AI feature misbehaves, the first hour matters: who decides, what gets switched off, how customers are told. And after it's over, the most valuable thing is a clear, honest account of what happened, so it doesn't happen again.

## The concept

### Measure incidents

- **Time to detect**: from start to detection.
- **Time to resolve**: from detection to fix.
- **How detected**: your own alerts, or someone else (customers, social media)? Incidents found by others are the ones your monitoring missed.

![A timeline from problem starts to detected to resolved, with time to detect and time to resolve marked, and a note on whether your own alert or customers found it.](/images/courses/llmops/incident-timeline.svg "The two numbers every incident is measured by, and who found it.")

### Prepare before it happens

| Prepared in advance | Example |
| :-- | :-- |
| **Severity levels** | High: wrong answers about money, or safety failures. Medium: slow or unavailable |
| **Owner on call** | one named person with the authority to act |
| **Safe fallbacks** | pin the model version; roll back to the last good release or index; switch the assistant to "hand over everything" |
| **Customer message** | a pre-written notice that a person will help |

### Blameless postmortems

After each incident, write: timeline, impact, root cause, why it wasn't caught earlier, and actions with owners and dates. Focus on **systems**, not people. "Nobody checked the index" becomes "the index rebuild had no automated check that all articles were present."

## Example

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/llmops/"
incidents = pd.read_csv(base + "incidents.csv", parse_dates=["started", "detected", "resolved"])
daily = pd.read_csv(base + "daily_metrics.csv", parse_dates=["date"])

incidents["days_to_detect"] = (incidents["detected"] - incidents["started"]).dt.days
incidents["days_to_resolve"] = (incidents["resolved"] - incidents["detected"]).dt.days

def affected(row):
    window = daily[daily["date"].between(row["started"], row["resolved"])]
    return int(window["conversations"].sum())

incidents["conversations_affected"] = incidents.apply(affected, axis=1)
incidents[["incident_id", "severity", "how_detected", "days_to_detect", "days_to_resolve", "conversations_affected"]]
```

```text
incident_id severity                          how_detected  days_to_detect  days_to_resolve  conversations_affected
0      INC-01   Medium                         Latency alert               0                0                    1835
1      INC-02     High  Customer complaints to support leads               4                1                   11478
2      INC-03     High        A customer's social media post              12                1                   28395
```

Most of the impact sits in detection time, not repair time. Once found, each incident was fixed within a day or so. The index incident ran for two weeks and touched tens of thousands of conversations, almost all of them before anyone knew. Faster detection (lessons 7 and 8) is the biggest improvement available.

## Walkthrough

1. Run the cell. Using lessons 7 and 8, work out how many days sooner each incident could have been detected, and how many fewer conversations it would have affected.
2. For the index incident, write the timeline in five lines.
3. Decide the safe fallback for each incident type.
4. Write the postmortem (the task below).

## Practice

```answer
{
  "id": "ops-09-p1",
  "prompt": "How many conversations took place during incident **INC-03** (from start to resolution)?",
  "answer": 28395,
  "format": "number",
  "dataset": "llmops",
  "files": ["incidents", "daily_metrics"],
  "pyVerify": "int(incidents.loc[incidents['incident_id'] == 'INC-03', 'conversations_affected'].iloc[0])",
  "hint": "The conversations_affected value for INC-03.",
  "required": true
}
```

```task
{
  "id": "ops-09-t1",
  "prompt": "Write a **blameless postmortem** for INC-03 with lines starting **Summary:**, **Impact:**, **Root cause:**, **Why it wasn't caught:**, and at least **two** lines starting **Action:** that each name an **owner** and a **date**.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Summary: ...",
  "rules": [
    { "label": "A Summary line", "pattern": "^\\s*summary\\s*:" },
    { "label": "An Impact line with a number", "pattern": "^\\s*impact\\s*:[^\\n]*\\d" },
    { "label": "A Root cause line", "pattern": "^\\s*root cause\\s*:" },
    { "label": "A Why it wasn't caught line", "pattern": "^\\s*why it (wasn'?t|was not) caught\\s*:" },
    { "label": "At least two Action lines with an owner and a date", "pattern": "^\\s*action\\s*:[^\\n]*(owner|lead|engineer|team|manager)[^\\n]*(\\d{1,2} \\w+|\\w+ \\d{1,2}|\\d{4}-\\d{2}-\\d{2}|by \\w+)", "min": 2 },
    { "label": "Blames no individual by name", "pattern": "\\b(tunde|adaeze|emeka|ngozi|musa|segun)\\b|fault of|careless", "absent": true }
  ],
  "sample": "Summary: From 4 to 17 August 2026, the help assistant answered questions on six topics without the right help articles, because a search index rebuild left them out.\nImpact: about 28,000 conversations took place during the incident, and graded accuracy fell from about 90% to under 80%.\nRoot cause: the index rebuild script skipped articles with an unsupported character in the title, with no error reported.\nWhy it wasn't caught: the rebuild had no check that every article was present, and graded accuracy wasn't pooled or alerted on, so a ten-point drop looked like daily noise.\nAction: add an automated check that the index contains every published article, failing the rebuild otherwise. Owner: platform engineering lead. Due: 4 September 2026.\nAction: add the 7-day graded accuracy alert from lesson 8. Owner: AI engineering lead. Due: 28 August 2026.\nAction: add one regression case per help article so a missing article fails the suite. Owner: support operations lead. Due: 11 September 2026.",
  "note": "'Why it wasn't caught' is the most important line: it turns one incident into fixes for a whole class of problems.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Most of an incident's impact happened before anyone knew about it. What's the biggest improvement?",
    "options": ["Faster fixing", "Faster detection, through alerts on the right signals", "More staff", "A longer postmortem"],
    "answer": 1,
    "explanation": "Impact grows with time to detect."
  },
  {
    "prompt": "What does 'blameless' mean in a postmortem?",
    "options": ["Nobody is responsible for anything", "It focuses on the system's gaps, not on individuals, so people report problems honestly", "It isn't written down", "Only managers write it"],
    "answer": 1,
    "explanation": "Fix systems, not people."
  },
  {
    "prompt": "Which is a safe fallback for a provider model update that breaks behaviour?",
    "options": ["Wait for the provider", "Pin the previous model version, or switch the assistant to hand over everything", "Delete the assistant", "Raise the temperature"],
    "answer": 1,
    "explanation": "Prepare fallbacks before you need them."
  }
]
```
