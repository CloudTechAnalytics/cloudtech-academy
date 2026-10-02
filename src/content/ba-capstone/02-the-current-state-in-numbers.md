---
title: The current state in numbers
minutes: 25
summary: Measure the problem before explaining it. Find out how slow claims are by channel, region and type, what happens to claims that aren't paid, and what customers complain about.
---

## The problem

Everyone at Shieldline has a theory. The agency manager blames the claims desk; the claims desk blames agents; IT blames the old system. Before you test any theory, measure the problem itself. Where is it worst, and for whom? A number that varies a lot between groups is a clue. A number that's the same everywhere points to something shared, such as the process itself.

## The concept

**Cut the headline by every dimension you have**

Average days to settle is 25.2. Break it down by **channel** (how the claim came in), **region** and **claim type**. Look for the groups that stand out and the ones that don't.

**Look at every outcome, not just the happy one**

Paid claims are only part of the story. Claims that are **withdrawn** (closed because the customer stopped responding) are a failure the average hides.

**Customers' own words**

Complaints tell you what customers experience, which isn't always what the business measures. A claim "in progress" in the system can feel like silence to the customer.

## Example

Days to settle by channel:

```sql
SELECT channel,
       COUNT(*) AS paid_claims,
       ROUND(AVG(julianday(closed_at) - julianday(submitted_at)), 1) AS avg_days,
       ROUND(100.0 * AVG(julianday(closed_at) - julianday(submitted_at) > 30), 1) AS pct_over_30
FROM claims
WHERE outcome = 'Paid' AND submitted_at < '2026-04-01'
GROUP BY channel
ORDER BY avg_days DESC;
```

```text
channel  paid_claims  avg_days  pct_over_30
Agent            688      28.7         37.2
Phone            304      25.4         20.1
Branch           551      22.8         13.8
Web              361      22.3         11.9
```

Agent claims are the slowest, by about six days compared with the web. By region and claim type:

```sql
SELECT region,
       ROUND(AVG(julianday(closed_at) - julianday(submitted_at)), 1) AS avg_days
FROM claims
WHERE outcome = 'Paid' AND submitted_at < '2026-04-01'
GROUP BY region
ORDER BY avg_days DESC;
```

```text
region         avg_days
Port Harcourt      27.7
Lagos              24.9
Kano               24.9
Ibadan             24.5
Abuja              24.5
```

```sql
SELECT claim_type,
       COUNT(*) AS paid_claims,
       ROUND(AVG(claim_amount_ngn)) AS avg_amount,
       ROUND(AVG(julianday(closed_at) - julianday(submitted_at)), 1) AS avg_days
FROM claims
WHERE outcome = 'Paid' AND submitted_at < '2026-04-01'
GROUP BY claim_type
ORDER BY avg_days DESC;
```

```text
claim_type       paid_claims  avg_amount  avg_days
Theft                    177     6044661      31.1
Third party              303     1256865      24.8
Windscreen               578      282673      24.6
Accident damage          846      803901      24.6
```

Port Harcourt is about three days slower than everywhere else. Theft claims are slower, which is reasonable: they're large and need checks. But look at windscreens. A ₦280,000 windscreen claim takes as long as a ₦800,000 accident claim. Something in the process treats every claim the same, whatever its size.

What customers complain about:

```sql
SELECT reason,
       COUNT(*) AS complaints,
       ROUND(100.0 * COUNT(*) / (SELECT COUNT(*) FROM complaints), 1) AS pct
FROM complaints
GROUP BY reason
ORDER BY complaints DESC;
```

```text
reason                 complaints   pct
Delay                         305  50.7
No update on my claim         176  29.3
Settlement amount              78    13
Staff attitude                 42     7
```

Half the complaints are about delay. Another 29% are about **not knowing** what's happening, which is a separate problem with a separate fix: even a slow claim feels better when the customer is kept informed.

## Walkthrough

1. Run the queries, or build the same in a pivot table or Power BI.
2. Break down the outcomes (paid, rejected, withdrawn) by channel. Which channel has the most withdrawals?
3. Calculate the share of baseline claims that received at least one complaint.
4. Plot average days to settle by month of submission. Is the problem getting better or worse?
5. Write the current state summary (the task below).

## Practice

```answer
{
  "id": "bac-02-p1",
  "prompt": "In the baseline, what is the average number of days to settle a paid claim that came in through an **agent**? One decimal place.",
  "answer": 28.7,
  "format": "number",
  "dataset": "claims",
  "files": ["claims"],
  "verify": "SELECT ROUND(AVG(julianday(closed_at) - julianday(submitted_at)), 1) FROM claims WHERE outcome = 'Paid' AND channel = 'Agent' AND submitted_at < '2026-04-01'",
  "hint": "The first query, Agent row.",
  "required": true
}
```

```answer
{
  "id": "bac-02-p2",
  "prompt": "What percentage of all complaints are about **delay** or **no update on my claim**? One decimal place.",
  "answer": 80.0,
  "format": "percent",
  "dataset": "claims",
  "files": ["complaints"],
  "verify": "SELECT ROUND(100.0 * AVG(reason IN ('Delay', 'No update on my claim')), 1) FROM complaints",
  "hint": "Add the two reasons' shares.",
  "required": true
}
```

```task
{
  "id": "bac-02-t1",
  "prompt": "Write the **current state** in three or four bullets (50 to 130 words), each with a **number**: how slow claims are, **where** it's worst, what **customers** complain about, and one thing that **surprised** you.",
  "minutes": 7,
  "rows": 6,
  "placeholder": "- Paid claims take ...",
  "rules": [
    { "label": "Three or more bullets", "pattern": "^\\s*[-*•]\\s", "min": 3 },
    { "label": "Numbers in the bullets", "pattern": "\\d+(\\.\\d+)?", "min": 3 },
    { "label": "Names where it's worst (agent, channel, region or Port Harcourt)", "pattern": "agent|channel|region|port harcourt" },
    { "label": "Mentions complaints or customers' experience", "pattern": "complain|update|inform" },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "- Paid claims take 25.2 days on average to settle, and 22.9% take more than 30 days.\n- Agent claims are slowest (28.7 days, against 22.3 on the web), and Port Harcourt is about three days slower than other regions.\n- 80% of complaints are about delay (51%) or hearing nothing about the claim (29%).\n- Surprise: a ₦280,000 windscreen claim takes as long as an ₦800,000 accident claim (24.6 days each), so the process treats small claims like big ones.",
  "note": "The surprise is often the most useful bullet: it points to the root cause.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Windscreen and accident claims take the same time to settle, although windscreen claims are much smaller. What does that suggest?",
    "options": ["Windscreens are complicated", "The process treats every claim the same, whatever its size or risk", "The data is wrong", "Accident claims are fast"],
    "answer": 1,
    "explanation": "One route for everything means small claims wait behind big-claim controls."
  },
  {
    "prompt": "29% of complaints are about having no update. What does that tell you?",
    "options": ["Nothing new", "Keeping customers informed is a separate problem from speed, with its own fix", "Customers are impatient", "Complaints should be ignored"],
    "answer": 1,
    "explanation": "Status updates can reduce complaints even before the process gets faster."
  },
  {
    "prompt": "Why look at withdrawn claims, not just paid ones?",
    "options": ["They're more numerous", "Averages over paid claims hide customers who gave up", "They're cheaper", "The regulator requires it"],
    "answer": 1,
    "explanation": "A customer who gives up is a failure that never appears in days to settle."
  }
]
```
