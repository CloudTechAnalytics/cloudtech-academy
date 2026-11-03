---
title: "Final project: the next improvement cycle"
minutes: 20
summary: Plan your final project, a full improvement case for Harbourline's next PDCA cycle, and summarise it on one page in the A3 format Lean organisations use.
---

## The problem

The pre-arrival checklist worked: about 2.25 fewer days at port per clearance and roughly ₦103,000 less demurrage per container. The operations director wants to keep going. "What's next, and what will it be worth?"

The data already hints at the answer. During the pilot, the wait for **duty payment confirmation** didn't move (about 46 hours, before and after), and Red-channel clearances still spend over 7 days at port. Your final project is the full improvement case for the next cycle: map it, measure it, find the root causes, design the change, estimate the benefit, and plan the pilot and its controls.

## The concept

### The A3 report

Lean organisations summarise an improvement on one sheet of A3 paper, so the whole story fits on one page and anyone can follow the reasoning. Its sections follow PDCA:

| Section | Contains |
| :-- | :-- |
| **Background** | why this matters, in customer terms |
| **Current condition** | the process map and the key numbers |
| **Goal** | the target, with a date |
| **Root cause analysis** | fishbone, five whys, Pareto: the causes you'll act on |
| **Countermeasures** | the changes, each tied to a root cause |
| **Plan** | who does what, by when, and how the pilot will be judged |
| **Follow-up** | the control plan, and what you'll check after the pilot |

The discipline of fitting it on one page forces you to keep only what matters.

## Example

The A3 for the cycle you've just studied would open like this:

> **Background:** containers spent 8.6 days at port against 3 free days; customers paid ₦184m in demurrage in January to April 2026.
>
> **Current condition:** flow efficiency 4.3%; the longest waits were for corrected documents (about 72 hours, on a third of clearances), duty payment (46 hours) and inspection (42 hours, Red channel).
>
> **Goal:** documents complete on arrival from 66% to 85% by the end of June 2026.

## Walkthrough

1. Choose the focus of your next cycle: the duty-payment wait, the inspection queue for Red-channel files, or both.
2. Measure the current condition from the pilot-period data (May and June), since that's the new baseline.
3. Find the root causes, using the fishbone and five whys. The lesson 7 task on duty payment is a starting point.
4. Design the countermeasures and estimate the benefit in demurrage.
5. Plan the pilot, with a run chart, mix checks and a control plan.
6. Open the project brief on the course page and write the full case and the A3.

## Practice

```dataset
{"dataset": "process", "files": ["cases", "events"]}
```

```answer
{
  "id": "pil-10-p1",
  "prompt": "During the pilot, what was the average **wait in hours before Confirm duty payment**? One decimal place.",
  "answer": 46.6,
  "format": "number",
  "dataset": "process",
  "files": ["cases", "events"],
  "verify": "WITH e AS (SELECT case_id, activity, start_time, LAG(end_time) OVER (PARTITION BY case_id ORDER BY start_time) AS prev_end FROM events) SELECT ROUND(AVG((julianday(e.start_time) - julianday(e.prev_end)) * 24), 1) FROM e JOIN cases c ON c.case_id = e.case_id WHERE e.activity = 'Confirm duty payment' AND c.checklist_pilot = 'Yes'",
  "hint": "The lesson 3 waiting-time query, filtered to pilot cases.",
  "explanation": "Unchanged at about 46 hours. It's now the longest wait every clearance goes through, which makes it the obvious next target.",
  "required": true
}
```

```answer
{
  "id": "pil-10-p2",
  "prompt": "During the pilot, what was the average number of **days at port** for **Red** channel clearances? Two decimal places.",
  "answer": 7.19,
  "tolerance": 0.06,
  "format": "number",
  "dataset": "process",
  "files": ["cases"],
  "verify": "SELECT ROUND(AVG(julianday(released_datetime) - julianday(arrival_datetime)), 2) FROM cases WHERE checklist_pilot = 'Yes' AND customs_channel = 'Red'",
  "hint": "Pilot cases with customs_channel = Red.",
  "required": true
}
```

```task
{
  "id": "pil-10-t1",
  "prompt": "Write the **first three sections of an A3** for your next improvement cycle: **Background**, **Current condition** and **Goal**, each starting on its own line with its heading. Use at least **four numbers** from the data, and make the goal measurable with a date.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Background: ...\nCurrent condition: ...\nGoal: ...",
  "rules": [
    { "label": "A Background section", "pattern": "^\\W*background\\W*:?" },
    { "label": "A Current condition section", "pattern": "^\\W*current (condition|state)\\W*:?" },
    { "label": "A Goal section", "pattern": "^\\W*(goal|target)\\W*:?" },
    { "label": "At least four numbers", "pattern": "\\d+(\\.\\d+)?", "min": 4 },
    { "label": "The goal has a date or time frame", "pattern": "(goal|target)[^\\n]*(by|within|before) [^\\n]*(20\\d\\d|month|week|quarter|january|february|march|april|may|june|july|august|september|october|november|december)" },
    { "label": "No more than 200 words: an A3 is short", "maxWords": 200 }
  ],
  "sample": "Background: after the pre-arrival checklist, containers still spend 6.4 days at port against 3 free days, and customers paid about ₦174,000 of demurrage per container in May and June 2026.\nCurrent condition: the wait for duty payment confirmation is unchanged at about 46 hours and is now the longest wait on every clearance; Red-channel clearances still average 7.2 days at port, with about 42 hours waiting for inspection.\nGoal: by the end of December 2026, cut the wait for payment confirmation to under 24 hours and average days at port to under 5.5, reducing demurrage per container below ₦120,000.",
  "note": "Notice the baseline is the **pilot** period, not January to April. Each PDCA cycle starts from the new normal the previous one created.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why does an A3 report fit on one page?",
    "options": ["To save paper", "So the whole reasoning, from problem to follow-up, can be seen and challenged at once, keeping only what matters", "It's a legal requirement", "Managers don't read"],
    "answer": 1,
    "explanation": "One page forces focus."
  },
  {
    "prompt": "What baseline should the next improvement cycle use?",
    "options": ["January to April, before any change", "The pilot period: the new normal after the last change", "Last year", "The industry average"],
    "answer": 1,
    "explanation": "Each cycle builds on the last."
  },
  {
    "prompt": "The duty-payment wait didn't change during the checklist pilot. What does that suggest for the next cycle?",
    "options": ["It can't be improved", "It's untouched by the last change and is now the longest common wait, so it's a strong candidate", "The pilot failed", "It isn't important"],
    "answer": 1,
    "explanation": "Remove one constraint, and the next one shows."
  }
]
```
