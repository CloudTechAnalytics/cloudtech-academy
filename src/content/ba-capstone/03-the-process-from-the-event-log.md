---
title: The process from the event log
minutes: 25
summary: Map how claims really flow from the claims system's event log, not from the procedure manual. Find the common paths, the rework loops and the waits between steps.
---

## The problem

Shieldline's procedure manual shows a neat claims process: register, check, inspect, approve, pay. In workshops, staff describe that process too. But the claims system has recorded every step of every claim, with a timestamp, in `events.csv`. That log shows how claims **actually** flow, including the loops and waits nobody draws on a whiteboard.

## The concept

**An event log**

Each row is one step: a **case** (the claim), an **activity**, a **timestamp** and who did it (the **team**). Order the rows by case and time and you have each claim's path.

**Variants**

A variant is one distinct path through the process. The most common variant is the "happy path". How many claims follow it, and what the other variants have in common, tells you where the process breaks.

**Rework**

A loop back to an earlier step, here *Documents requested → Documents received → Documents checked*, repeated. Every loop adds days and work.

**Waiting time versus working time**

The gap between two steps is mostly **waiting**: the claim sits in a queue. Most of a slow process is waiting, not work. Find the longest gaps.

## Example

The most common paths through the process, for baseline claims:

```sql
WITH paths AS (
  SELECT claim_id, GROUP_CONCAT(activity, ' > ') AS path
  FROM (SELECT * FROM events ORDER BY claim_id, timestamp)
  GROUP BY claim_id
)
SELECT COUNT(*) AS claims,
       ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM claims WHERE submitted_at < '2026-04-01'), 1) AS pct,
       path
FROM paths JOIN claims USING (claim_id)
WHERE submitted_at < '2026-04-01'
GROUP BY path
ORDER BY claims DESC
LIMIT 5;
```

```text
claims   pct  path
  1072  47.9  Claim submitted > Claim registered > Documents checked > Assessor assigned > Inspection > Assessment completed > Manager approval > Payment approved > Claim paid
   562  25.1  Claim submitted > Claim registered > Documents checked > Documents requested > Documents received > Documents checked > Assessor assigned > Inspection > Assessment completed > Manager approval > Payment approved > Claim paid
   120   5.4  Claim submitted > Claim registered > Documents checked > Documents requested > Documents received > Documents checked > Documents requested > Documents received > Documents checked > Assessor assigned > Inspection > Assessment completed > Manager approval > Payment approved > Claim paid
   102   4.6  Claim submitted > Claim registered > Documents checked > Documents requested > Claim closed: no response
    90     4  Claim submitted > Claim registered > Documents checked > Assessor assigned > Inspection > Assessment completed > Claim rejected
```

Under half of claims follow the happy path. The next two variants are the same path with one or two document loops, and the fourth is a claim closed because the customer stopped responding after documents were requested. Documents are clearly a problem. Notice too that **every** claim, even a windscreen, goes through *Inspection* and *Manager approval*.

Now the waits. For each step, the time since the previous step, averaged over paid baseline claims:

```sql
WITH steps AS (
  SELECT e.claim_id, e.activity,
         LAG(e.activity) OVER (PARTITION BY e.claim_id ORDER BY e.timestamp) AS previous,
         julianday(e.timestamp) - julianday(LAG(e.timestamp) OVER (PARTITION BY e.claim_id ORDER BY e.timestamp)) AS gap_days
  FROM events e JOIN claims c USING (claim_id)
  WHERE c.outcome = 'Paid' AND c.submitted_at < '2026-04-01'
)
SELECT previous || ' → ' || activity AS step,
       COUNT(*) AS times,
       ROUND(AVG(gap_days), 1) AS avg_days,
       ROUND(SUM(gap_days) / (SELECT COUNT(*) FROM claims WHERE outcome = 'Paid' AND submitted_at < '2026-04-01'), 1) AS days_per_claim
FROM steps
WHERE previous IS NOT NULL
GROUP BY step
ORDER BY days_per_claim DESC;
```

```text
step                                      times  avg_days  days_per_claim
Assessor assigned → Inspection             1904       6.3             6.3
Documents requested → Documents received   1018       5.9             3.1
Assessment completed → Manager approval    1904       3.1             3.1
Manager approval → Payment approved        1798       2.9             2.7
Inspection → Assessment completed          1904       2.2             2.2
Claim registered → Documents checked       1904         2               2
Payment approved → Claim paid              1904       1.7             1.7
Claim submitted → Claim registered         1904       1.3             1.3
Documents received → Documents checked     1018         2             1.1
Documents checked → Assessor assigned      1904         1               1
Manager approval → Head office approval     106       8.1             0.5
Head office approval → Payment approved     106       2.7             0.2
Documents checked → Documents requested    1018       0.2             0.1
```

`days_per_claim` spreads each step's total wait over all paid claims, so the column adds up to the average days to settle. The longest single wait is between an assessor being assigned and the inspection: over six days. Then come waiting for the customer's documents, and waiting for the manager's approval.

## Walkthrough

1. Run both queries. Check that `days_per_claim` adds up to about 25.2.
2. Draw the current process as a BPMN diagram with swimlanes for Customer or Agent, Claims desk, Assessors, Claims managers, Head office and Finance. Use the log, not the manual: include the document loop and the no-response exit.
3. Mark each step with its average wait.
4. Count how many document requests a claim can receive. What's the most?
5. Describe the process in writing (the task below).

## Practice

```answer
{
  "id": "bac-03-p1",
  "prompt": "What percentage of baseline claims had **documents requested** at least once? One decimal place.",
  "answer": 45.6,
  "format": "percent",
  "dataset": "claims",
  "files": ["claims", "events"],
  "verify": "WITH r AS (SELECT claim_id, MAX(activity = 'Documents requested') AS requested FROM events GROUP BY claim_id) SELECT ROUND(100.0 * AVG(requested), 1) FROM r JOIN claims USING (claim_id) WHERE submitted_at < '2026-04-01'",
  "hint": "For each claim, whether any event is 'Documents requested'; then the average over baseline claims.",
  "required": true
}
```

```answer
{
  "id": "bac-03-p2",
  "prompt": "For paid baseline claims, what's the average wait in days between **Assessor assigned** and **Inspection**? One decimal place.",
  "answer": 6.3,
  "format": "number",
  "dataset": "claims",
  "files": ["claims", "events"],
  "verify": "SELECT ROUND(AVG(julianday(i.timestamp) - julianday(a.timestamp)), 1) FROM events a JOIN events i ON i.claim_id = a.claim_id AND i.activity = 'Inspection' JOIN claims c ON c.claim_id = a.claim_id WHERE a.activity = 'Assessor assigned' AND c.outcome = 'Paid' AND c.submitted_at < '2026-04-01'",
  "hint": "The top row of the waits query.",
  "required": true
}
```

```task
{
  "id": "bac-03-t1",
  "prompt": "Describe the **current process** as numbered steps (60 to 150 words): **who** does each step, the **rework loop**, and the **three longest waits** with their numbers.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "1. The customer or an agent submits the claim ...",
  "rules": [
    { "label": "Numbered steps", "pattern": "^\\s*\\d+[.)]\\s", "min": 4 },
    { "label": "Names the teams (claims desk, assessor, manager, finance)", "pattern": "claims desk|assessor|manager|finance", "min": 3 },
    { "label": "Describes the document loop", "pattern": "document" },
    { "label": "Mentions the inspection", "pattern": "inspect" },
    { "label": "Gives waits in days", "pattern": "\\d+(\\.\\d+)?\\s*days?", "min": 3 },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "1. The customer or an agent submits the claim; the claims desk registers it (1.3 days later on average).\n2. The claims desk checks the documents (2.0 days later). If any are missing, it requests them and waits for the customer (5.9 days per request), then checks again. This loop can repeat; some customers give up.\n3. An assessor is assigned, then inspects the vehicle (6.3 days later: the longest wait), and completes the assessment.\n4. A claims manager approves every claim (3.1 days later); claims over ₦5m also need head office.\n5. Finance approves the payment and pays (about 4.5 days in total).\nThe three longest waits are the inspection (6.3 days), the customer's documents (5.9 days each time) and manager approval (3.1 days).",
  "note": "Every number comes from the log. The manual says none of this.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why map the process from the event log rather than the procedure manual?",
    "options": ["The manual is too long", "The log records what actually happens, including loops and waits", "Logs are prettier", "Managers prefer it"],
    "answer": 1,
    "explanation": "The real process is the one in the data."
  },
  {
    "prompt": "What does a variant with a repeated \"Documents requested\" step show?",
    "options": ["A faster claim", "Rework: the claim looped back for missing documents more than once", "A data error", "A rejected claim"],
    "answer": 1,
    "explanation": "Each loop adds days and work."
  },
  {
    "prompt": "Most of the 25 days to settle a claim is what?",
    "options": ["Staff working on it", "Waiting in queues between steps", "System downtime", "Payment processing"],
    "answer": 1,
    "explanation": "The gaps between steps are mostly waiting."
  }
]
```
