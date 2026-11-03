---
title: Root causes
minutes: 25
summary: Find out why claims are slow. Split the delay by stage, then test each theory against the data. Look at documents by channel, the day managers approve claims, which claims really need an inspection, and assessor capacity.
---

## The problem

You now know where the time goes. Next is **why**. Each stakeholder has a theory, and some are right. The BA's job is to test each theory with evidence, and to reach causes that someone can actually change. "The old system is slow" is a theory. "Managers approve every claim, once a week" is a cause you can fix.

## The concept

### A Pareto view of the delay

Group the waits into stages and rank them. Fixing the biggest stage first gives the most benefit.

### Five whys

Keep asking why until you reach something the business controls. For documents, for example:

1. Why are claims slow? Many wait for missing documents.
2. Why are documents missing? Claims arrive incomplete.
3. Why do they arrive incomplete? Mostly from agents and phone staff.
4. Why from agents? Agents fill paper forms with no checklist, and post them to the branch.
5. Why no checklist? Agents are paid on sales, and nobody owns claims quality in the agency channel.

![A Pareto chart of delay by stage with invented numbers, and a five-whys chain ending in a cause the business controls](/images/courses/ba-capstone/root-causes.svg "Rank the delay by stage, then ask why five times.")

### Evidence for every cause

Each cause needs a number from the data, and ideally a quote from an interview that explains it. Numbers show **that** something happens; people explain **why**.

## Example

The delay by stage, as a share of all waiting, for paid baseline claims:

```sql
WITH steps AS (
  SELECT e.activity,
         LAG(e.activity) OVER (PARTITION BY e.claim_id ORDER BY e.timestamp) AS previous,
         julianday(e.timestamp) - julianday(LAG(e.timestamp) OVER (PARTITION BY e.claim_id ORDER BY e.timestamp)) AS gap_days
  FROM events e JOIN claims c USING (claim_id)
  WHERE c.outcome = 'Paid' AND c.submitted_at < '2026-04-01'
),
staged AS (
  SELECT CASE
           WHEN activity = 'Claim registered' THEN 'Registration'
           WHEN activity = 'Documents checked' AND previous = 'Claim registered' THEN 'First document check'
           WHEN activity IN ('Documents requested', 'Documents received', 'Documents checked') THEN 'Chasing documents'
           WHEN activity IN ('Assessor assigned', 'Inspection', 'Assessment completed') THEN 'Assessment'
           WHEN activity IN ('Manager approval', 'Head office approval') THEN 'Approval'
           ELSE 'Payment'
         END AS stage,
         gap_days
  FROM steps WHERE previous IS NOT NULL
)
SELECT stage, ROUND(100.0 * SUM(gap_days) / (SELECT SUM(gap_days) FROM staged), 1) AS pct_of_delay
FROM staged
GROUP BY stage
ORDER BY pct_of_delay DESC;
```

```text
stage                 pct_of_delay
Assessment                    37.8
Payment                       17.9
Chasing documents             17.1
Approval                      14.1
First document check             8
Registration                   5.1
```

Assessment is the biggest stage by far. Payment comes second, at 18%: finance takes about four and a half days to approve and pay. Nobody mentioned it in the interviews, so note it as a question for the finance controller. Chasing documents and approval follow close behind.

Now test the theories one by one. **Documents**, by channel:

```sql
WITH r AS (SELECT claim_id, MAX(activity = 'Documents requested') AS requested FROM events GROUP BY claim_id)
SELECT channel, COUNT(*) AS claims, ROUND(100.0 * AVG(requested), 1) AS pct_documents_requested
FROM r JOIN claims USING (claim_id)
WHERE submitted_at < '2026-04-01'
GROUP BY channel
ORDER BY pct_documents_requested DESC;
```

```text
channel  claims  pct_documents_requested
Agent       838                     61.8
Phone       359                     56.8
Branch      623                     30.3
Web         419                     26.5
```

Agent and phone claims arrive incomplete about twice as often as branch and web claims. The difference is the channel, not the customer.

**Approval**. The Lagos claims manager said they approve on Fridays. The log agrees:

```sql
SELECT CASE strftime('%w', timestamp) WHEN '1' THEN 'Monday' WHEN '2' THEN 'Tuesday' WHEN '3' THEN 'Wednesday'
         WHEN '4' THEN 'Thursday' WHEN '5' THEN 'Friday' WHEN '6' THEN 'Saturday' ELSE 'Sunday' END AS weekday,
       COUNT(*) AS manager_approvals
FROM events JOIN claims USING (claim_id)
WHERE activity = 'Manager approval' AND submitted_at < '2026-04-01'
GROUP BY weekday;
```

```text
weekday  manager_approvals
Friday                1904
```

Every manager approval happens on a Friday. A claim assessed on a Saturday waits almost a week for a signature. And which claims need a manager?

```sql
SELECT ROUND(100.0 * AVG(claim_amount_ngn < 1000000 AND claim_type IN ('Windscreen', 'Accident damage')), 1) AS pct_small_windscreen_or_accident
FROM claims
WHERE submitted_at < '2026-04-01';
```

```text
pct_small_windscreen_or_accident
                            62.3
```

Almost two-thirds of claims are windscreen or accident claims under ₦1m, yet each gets the same physical inspection and manager sign-off as a ₦6m theft. The controls are sized for the riskiest claims and applied to all of them.

**Assessor capacity**, the longest wait:

```sql
SELECT region, ROUND(AVG(julianday(i.timestamp) - julianday(a.timestamp)), 1) AS days_to_inspection
FROM events a
JOIN events i ON i.claim_id = a.claim_id AND i.activity = 'Inspection'
JOIN claims c ON c.claim_id = a.claim_id
WHERE a.activity = 'Assessor assigned' AND c.submitted_at < '2026-04-01'
GROUP BY region
ORDER BY days_to_inspection DESC;
```

```text
region         days_to_inspection
Port Harcourt                 8.4
Kano                            6
Lagos                         5.9
Ibadan                        5.9
Abuja                         5.8
```

Port Harcourt waits over two days longer for an inspection, which matches the senior assessor's comment that it has only two assessors. That's a capacity problem, separate from the process.

## Walkthrough

1. Run the queries.
2. Write five whys for each of the four causes: documents, inspections, approvals and Port Harcourt's capacity.
3. Match each cause with a quote from `interviews.csv`.
4. Check one theory that turns out to be **wrong**. Does the old claims system cause the delay? Which steps would a new system actually speed up? (Look at what causes the long gaps.)
5. Write the root cause table (the task below).

## Practice

```answer
{
  "id": "bac-04-p1",
  "prompt": "In the baseline, what percentage of claims that came in through an **agent** had documents requested at least once? One decimal place.",
  "answer": 61.8,
  "format": "percent",
  "dataset": "claims",
  "files": ["claims", "events"],
  "verify": "WITH r AS (SELECT claim_id, MAX(activity = 'Documents requested') AS requested FROM events GROUP BY claim_id) SELECT ROUND(100.0 * AVG(requested), 1) FROM r JOIN claims USING (claim_id) WHERE submitted_at < '2026-04-01' AND channel = 'Agent'",
  "hint": "The documents-by-channel query, Agent row.",
  "required": true
}
```

```answer
{
  "id": "bac-04-p2",
  "prompt": "What percentage of baseline claims are **windscreen or accident damage** claims **under ₦1m**? One decimal place.",
  "answer": 62.3,
  "format": "percent",
  "dataset": "claims",
  "files": ["claims"],
  "verify": "SELECT ROUND(100.0 * AVG(claim_amount_ngn < 1000000 AND claim_type IN ('Windscreen', 'Accident damage')), 1) FROM claims WHERE submitted_at < '2026-04-01'",
  "hint": "Count claims with the right type and amount, as a share of all baseline claims.",
  "required": true
}
```

```task
{
  "id": "bac-04-t1",
  "prompt": "Write a **root cause table** or list (60 to 160 words) with at least **three causes**. For each, give the **evidence** (a number), the **reason** behind it, and **who owns** fixing it.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "| Cause | Evidence | Why | Owner |",
  "rules": [
    { "label": "Covers documents", "pattern": "document" },
    { "label": "Covers approvals (Friday, weekly, manager)", "pattern": "friday|weekly|once a week|manager" },
    { "label": "Covers inspections or assessors", "pattern": "inspect|assessor" },
    { "label": "Evidence with numbers", "pattern": "\\d+(\\.\\d+)?", "min": 3 },
    { "label": "Names owners", "pattern": "owner|head of|manager|agency|claims", "min": 2 },
    { "label": "Between 60 and 160 words", "minWords": 60, "maxWords": 160 }
  ],
  "sample": "| Cause | Evidence | Why | Owner |\n| :-- | :-- | :-- | :-- |\n| Incomplete documents | 61.8% of agent claims need documents chased, against 26.5% on the web | Agents use paper forms with no checklist and are paid on sales only | Agency manager |\n| Every claim inspected in person | 62.3% of claims are windscreen or accident claims under ₦1m; the inspection wait averages 6.3 days | One route for every claim, whatever its size | Head of claims |\n| Weekly approvals | Every manager approval is on a Friday; 3.1 days' average wait | Managers batch sign-offs because the week is full of meetings | Head of claims |\n| Too few assessors in Port Harcourt | 8.4 days to inspection, against about 6 elsewhere | Two assessors for the region | Head of claims |",
  "note": "Owners matter: a cause without an owner doesn't get fixed.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Every manager approval in the log happens on a Friday. What is the root cause?",
    "options": ["The system only works on Fridays", "Managers sign off claims in a weekly batch", "Customers submit on Fridays", "Finance is slow"],
    "answer": 1,
    "explanation": "A working habit, which is cheap to change."
  },
  {
    "prompt": "Which is a root cause someone can act on?",
    "options": ["Claims are slow", "The system is old", "Agents have no checklist, so 62% of their claims arrive incomplete", "Customers are disorganised"],
    "answer": 2,
    "explanation": "Specific, evidenced and ownable."
  },
  {
    "prompt": "Would a new claims system fix the longest wait, the 6.3 days before an inspection?",
    "options": ["Yes, always", "Not by itself: that wait comes from assessor capacity and inspecting every claim, not software", "Only in Lagos", "It would make it longer"],
    "answer": 1,
    "explanation": "Match the fix to the cause."
  }
]
```
