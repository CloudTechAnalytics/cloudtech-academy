---
title: Value stream mapping
minutes: 25
summary: Map a process as a value stream, with process time, waiting time and first-time quality at every step, and calculate the flow efficiency that shows how much of the lead time is real work.
---

## The problem

Ask Harbourline's operations director how long clearance takes and he'll say "about eight or nine days". Ask how much of that is **work** and he'll guess "half, maybe more: customs is slow". Both answers matter, but only one is a guess.

A **value stream map** (VSM) puts the two side by side for every step: how long the work takes, and how long the item waits before it. When you add them up, the result is almost always a shock. It changes the conversation from "work faster" to "stop waiting".

## The concept

**What a value stream map shows**

A VSM follows one item (a container) from trigger to customer, step by step, and records for each step:

| Data box | Meaning |
| :-- | :-- |
| **Process time (PT)** | hands-on time to do the step once |
| **Wait time (WT)** | time the item waits before the step starts |
| **% complete and accurate (%C&A)** | how often the step's output can be used by the next step without correction |
| Who does it | team or organisation |

Underneath, a **timeline** alternates waits and work, and totals them.

**Three numbers that summarise the stream**

- **Lead time** = total time from start to finish (all waits + all process time).
- **Total process time** = the sum of process times.
- **Flow efficiency** = total process time ÷ lead time.

In office and service processes, flow efficiency of **5% to 15%** is common. Below 5% means the item spends almost its whole life waiting.

**Rolled %C&A**

Multiply the %C&A of the steps together to see how often an item goes through the whole stream without any correction. Three steps at 90% each give 0.9 × 0.9 × 0.9 = 73% right first time.

## Example

Harbourline's clearance value stream, before the pilot (averages per clearance, in hours):

| Step | Team | Wait before | Process time |
| :-- | :-- | --: | --: |
| Check documents | Documentation | 22.1 | 2.0 |
| (if incomplete) request correction and re-check | Documentation, customer | about 72 | 1.5 |
| Submit customs declaration | Customs broker | 18.2 | 1.5 |
| Duty assessment | Customs | 30.5 | 1.0 |
| Confirm duty payment | Finance, customer | 46.1 | 0.5 |
| (Red channel) physical inspection | Customs | 42.1 | 3.0 |
| Release and gate-out | Terminal | 27.2 | 1.5 |

The first step's %C&A is about 66%: only 66% of clearances have complete documents on arrival. Every other clearance takes the correction loop, which on its own adds about three days.

## Walkthrough

1. For each pre-pilot case, sum the process times of all its activities except delivery.
2. Calculate the lead time at port: release − arrival, in hours.
3. Calculate flow efficiency: total process hours ÷ total lead time hours, across all pre-pilot cases (the first task below).
4. Build the VSM table for the steps, as in the example, using the waiting-time method from lesson 3.
5. Mark the three longest waits. They're your improvement targets, whatever the team believes is slow.

## Practice

```answer
{
  "id": "pil-04-p1",
  "prompt": "Before the pilot, what was the average **total process time** per clearance in hours (all activities except Deliver to customer)? One decimal place.",
  "answer": 9.0,
  "format": "number",
  "dataset": "process",
  "files": ["cases", "events"],
  "verify": "SELECT ROUND(AVG(p), 1) FROM (SELECT c.case_id, SUM((julianday(e.end_time) - julianday(e.start_time)) * 24) AS p FROM cases c JOIN events e ON e.case_id = c.case_id WHERE c.checklist_pilot = 'No' AND e.activity <> 'Deliver to customer' GROUP BY c.case_id)",
  "hint": "Sum end − start in hours for each case's activities (except delivery), then average across pre-pilot cases.",
  "required": true
}
```

```answer
{
  "id": "pil-04-p2",
  "prompt": "Before the pilot, what was the **flow efficiency** at port: total process hours (excluding delivery) ÷ total hours from arrival to release, across all pre-pilot cases? One decimal place.",
  "answer": 4.3,
  "format": "percent",
  "dataset": "process",
  "files": ["cases", "events"],
  "verify": "SELECT ROUND(100.0 * SUM(p) / SUM(lt), 1) FROM (SELECT c.case_id, (julianday(c.released_datetime) - julianday(c.arrival_datetime)) * 24 AS lt, SUM((julianday(e.end_time) - julianday(e.start_time)) * 24) AS p FROM cases c JOIN events e ON e.case_id = c.case_id WHERE c.checklist_pilot = 'No' AND e.activity <> 'Deliver to customer' GROUP BY c.case_id)",
  "hint": "Sum process hours over all pre-pilot cases, divided by the sum of their port hours.",
  "explanation": "4.3%: a container is worked on for about 9 hours of its 207 hours at port. Making the work faster would barely help; removing waits would.",
  "required": true
}
```

```task
{
  "id": "pil-04-t1",
  "prompt": "Summarise Harbourline's value stream for the operations director in 3 to 5 bullets: the **lead time**, the **process time**, the **flow efficiency**, the **biggest waits**, and what that means for where to improve.",
  "minutes": 6,
  "rows": 7,
  "placeholder": "- A container spends about ... at port, of which ...",
  "rules": [
    { "label": "Three to five bullets", "pattern": "^\\s*[-*]\\s+\\S", "min": 3 },
    { "label": "Gives the lead time", "pattern": "(8\\.\\d|20\\d|nine|eight)[^\\n]*(day|hour)|(day|hour)s? at port" },
    { "label": "Gives the flow efficiency", "pattern": "flow efficiency|4\\.3\\s*%" },
    { "label": "Names at least two of the longest waits", "pattern": "correct|re-?check|duty payment|pay|inspection", "min": 2 },
    { "label": "Concludes about waiting rather than working faster", "pattern": "wait|queue|idle" },
    { "label": "No more than 120 words", "maxWords": 120 }
  ],
  "sample": "- A container spends about 8.6 days (207 hours) at port, but is actually worked on for about 9 hours.\n- Flow efficiency is 4.3%: for 96% of the time, nothing is happening to it.\n- The longest waits are for corrected documents from customers (about 72 hours, on a third of clearances), customers paying duty (46 hours) and the physical inspection queue (42 hours).\n- Pushing the clearing team to work faster would save minutes; removing these waits would save days, and demurrage with them.",
  "note": "The last bullet is the one that changes the operations director's plan. Numbers alone inform; the \"so what\" persuades.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Lead time is 200 hours and total process time is 10 hours. What is the flow efficiency?",
    "options": ["95%", "5%", "20%", "50%"],
    "answer": 1,
    "explanation": "10 ÷ 200 = 5%."
  },
  {
    "prompt": "Three steps each have %C&A of 80%. Roughly how often does an item get through all three without correction?",
    "options": ["80%", "51%", "240%", "20%"],
    "answer": 1,
    "explanation": "0.8 × 0.8 × 0.8 = 0.51."
  },
  {
    "prompt": "Flow efficiency is 4%. Where will the biggest improvement come from?",
    "options": ["Making each step's work faster", "Removing or shortening the waits between steps", "Adding more steps", "Hiring a faster clerk"],
    "answer": 1,
    "explanation": "With 96% of the time spent waiting, waits are where the days are."
  }
]
```
