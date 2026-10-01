---
title: Event logs and process mining
minutes: 25
summary: Turn the timestamps systems already record into a picture of how a process really runs: its variants, its rework and how long each step waits.
---

## The problem

You could map Harbourline's clearance process by interviewing the team, and you should. But interviews tell you how people **think** the process runs. The team will say "documents are usually fine" and "inspection takes a day or two". The systems have recorded every clearance, every activity, and when it started and finished. That record says how the process **actually** runs, for all 477 cases, not just the ones people remember.

Using those records to discover and measure a process is called **process mining**. Large companies buy specialist software for it (Celonis, Disco, Microsoft Process Advisor), but the core ideas need nothing more than Excel, SQL or Python and an event log.

## The concept

**An event log**

Every process-mining analysis starts from a table with at least three columns:

| Column | Harbourline example |
| :-- | :-- |
| **Case ID**: which instance of the process | `CLR-0042` |
| **Activity**: what happened | `Re-check documents` |
| **Timestamp(s)**: when it started and ended | `2026-02-11 09:00`, `2026-02-11 10:00` |
| Optional: **resource** or team, and case attributes | `Documentation`, importer type, channel |

**What you can derive**

- **Variants**: the distinct paths cases take. List each case's activities in time order and count the distinct sequences. A "simple" process often has dozens of variants.
- **Rework**: activities that repeat or exist only to fix something (*Request corrected documents*, *Re-check documents*).
- **Processing time**: end − start of each activity.
- **Waiting time**: the start of an activity minus the end of the previous one in the same case. Sort by case, then by start time, and take the previous row's end (`LAG` in SQL, `shift` in pandas, a formula referencing the row above in Excel).
- **Lead time**: last end − first start (or, for Harbourline, release − arrival).

**Cautions**

- Logs record only what systems record. A phone call chasing a customer may leave no trace.
- Timestamps can be when something was **entered**, not when it happened. Check a few cases with the people involved.
- Compare like with like: a pilot that changed the process (Harbourline's checklist, from May) creates new variants.

## Example

The most common variants of Harbourline's clearance process:

| Variant (activities in order) | Cases |
| :-- | --: |
| Check → Declare → Assess → Pay → **Inspect** → Release → Deliver | 148 |
| Check → Declare → Assess → Pay → Release → Deliver | 118 |
| Check → Declare → Assess → Pay → **Customs review** → Release → Deliver | 78 |
| Check → **Request correction → Re-check** → Declare → Assess → Pay → Inspect → Release → Deliver | 50 |

There are 9 variants in all. The rework variants (with a correction loop, sometimes two) aren't rare exceptions: together they're a large share of the work.

## Walkthrough

1. Sort `events.csv` by `case_id`, then `start_time`.
2. Add a processing time column (end − start, in hours).
3. Add a waiting time column: this row's start minus the previous row's end, only when the previous row is the same case.
4. Average the waiting time by activity. Which steps wait longest? (The first task below asks for one.)
5. Count the cases with at least one *Re-check documents*, before the pilot.

```sql
WITH e AS (
  SELECT
    case_id,
    activity,
    start_time,
    end_time,
    LAG(end_time) OVER (PARTITION BY case_id ORDER BY start_time) AS previous_end
  FROM events
)
SELECT
  activity,
  ROUND(AVG((julianday(start_time) - julianday(previous_end)) * 24), 1) AS avg_wait_hours
FROM e
WHERE previous_end IS NOT NULL
GROUP BY activity
ORDER BY avg_wait_hours DESC;
```

## Practice

```answer
{
  "id": "pil-03-p1",
  "prompt": "Before the pilot, what share of clearances needed **at least one Re-check documents**? One decimal place.",
  "answer": 33.9,
  "format": "percent",
  "dataset": "process",
  "files": ["cases", "events"],
  "verify": "SELECT ROUND(100.0 * COUNT(DISTINCT CASE WHEN e.activity = 'Re-check documents' THEN e.case_id END) / COUNT(DISTINCT c.case_id), 1) FROM cases c LEFT JOIN events e ON e.case_id = c.case_id WHERE c.checklist_pilot = 'No'",
  "hint": "Distinct cases with a Re-check documents event, among cases with checklist_pilot = No, ÷ all those cases.",
  "required": true
}
```

```answer
{
  "id": "pil-03-p2",
  "prompt": "Before the pilot, what was the average **waiting time** in hours before **Confirm duty payment** (from the end of the previous activity)? One decimal place.",
  "answer": 46.1,
  "format": "number",
  "dataset": "process",
  "files": ["cases", "events"],
  "verify": "WITH e AS (SELECT case_id, activity, start_time, LAG(end_time) OVER (PARTITION BY case_id ORDER BY start_time) AS prev_end FROM events) SELECT ROUND(AVG((julianday(e.start_time) - julianday(e.prev_end)) * 24), 1) FROM e JOIN cases c ON c.case_id = e.case_id WHERE e.activity = 'Confirm duty payment' AND c.checklist_pilot = 'No'",
  "hint": "Use the walkthrough query, filtered to pre-pilot cases.",
  "explanation": "Nearly two days waiting for the customer to pay duty, every clearance. The checklist pilot didn't touch this wait, so it's an obvious next target.",
  "required": true
}
```

```answer
{
  "id": "pil-03-p3",
  "prompt": "How many distinct **variants** (sequences of activities) does the event log contain?",
  "answer": 9,
  "format": "number",
  "dataset": "process",
  "files": ["events"],
  "verify": "SELECT COUNT(*) FROM (SELECT v FROM (SELECT case_id, group_concat(activity, ' > ') AS v FROM (SELECT * FROM events ORDER BY case_id, start_time) GROUP BY case_id) GROUP BY v)",
  "hint": "For each case, join its activities in time order into one text value; count the distinct values. In pandas: groupby('case_id')['activity'].agg(' > '.join).nunique().",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What are the three columns every event log needs?",
    "options": ["Name, address, phone", "Case ID, activity and timestamp", "Start, end and cost", "Team, manager and budget"],
    "answer": 1,
    "explanation": "Everything else (variants, waits, lead times) is derived from these."
  },
  {
    "prompt": "How do you calculate waiting time before an activity?",
    "options": ["End minus start of the same activity", "Its start minus the end of the previous activity in the same case", "Lead time divided by activities", "It can't be calculated"],
    "answer": 1,
    "explanation": "Sort by case and time, then compare with the previous row."
  },
  {
    "prompt": "The log shows no record of the phone calls made to chase customers. What does that mean?",
    "options": ["There were no calls", "Logs only show what systems record; check with the team what happens off-system", "The analysis is useless", "Add fake events"],
    "answer": 1,
    "explanation": "Combine data with observation and interviews."
  }
]
```
