---
title: Did the pilot work?
minutes: 25
summary: Evaluate the Lagos pilot honestly. Compare it with the other regions over the same months, so the season isn't mistaken for the change. Then check every measure the pilot was meant to move, and the ones it mustn't harm.
---

## The problem

From 1 April 2026, Lagos tried four changes:

1. A **document checklist app** for agents and phone staff, so claims can't be sent without the right documents.
2. **Photo assessment** for windscreen claims, instead of a physical inspection.
3. **Assessors approve** windscreen and accident claims under ₦1m, instead of waiting for the manager's Friday sign-off.
4. **SMS updates** telling customers what's happening and what's missing.

The Lagos claims manager says claims are "much faster". The head of IT says April to June is always different and the pilot proves nothing. They could both be partly right. Your job is to measure it fairly.

## The concept

**Before and after isn't enough**

Comparing Lagos in April to June with Lagos before mixes the pilot's effect with anything else that changed at the same time. April brings the rainy season, more accidents and busier assessors **everywhere**.

**A comparison group**

The other four regions didn't get the changes but did get the season. Their change over the same period shows what would probably have happened in Lagos without the pilot.

**Difference in differences**

(Lagos after − Lagos before) − (others after − others before). The second bracket removes whatever affected everyone. It assumes Lagos and the other regions would otherwise have moved together, so check that they were similar before.

**Check what it mustn't harm**

A faster process that rejects good claims or approves bad ones isn't a success. Look at rejection rates and the controls.

## Example

Days to settle, before and during the pilot, for Lagos and the others:

```sql
SELECT CASE WHEN region = 'Lagos' THEN 'Lagos' ELSE 'Other regions' END AS grp,
       CASE WHEN submitted_at < '2026-04-01' THEN '1 Before' ELSE '2 Pilot period' END AS period,
       COUNT(*) AS paid_claims,
       ROUND(AVG(julianday(closed_at) - julianday(submitted_at)), 1) AS avg_days
FROM claims
WHERE outcome = 'Paid'
GROUP BY grp, period
ORDER BY grp, period;
```

```text
grp            period          paid_claims  avg_days
Lagos          1 Before                676      24.9
Lagos          2 Pilot period          296      17.6
Other regions  1 Before               1228      25.4
Other regions  2 Pilot period          507      26.4
```

Before the pilot, Lagos and the other regions were almost identical, which makes the others a good comparison. During the pilot, the other regions got about a day **slower** (the season), while Lagos got more than seven days faster. The difference in differences:

```sql
WITH g AS (
  SELECT region = 'Lagos' AS lagos, submitted_at >= '2026-04-01' AS pilot,
         AVG(julianday(closed_at) - julianday(submitted_at)) AS days
  FROM claims WHERE outcome = 'Paid' GROUP BY lagos, pilot
)
SELECT ROUND((SELECT days FROM g WHERE lagos = 1 AND pilot = 1) - (SELECT days FROM g WHERE lagos = 1 AND pilot = 0)
           - ((SELECT days FROM g WHERE lagos = 0 AND pilot = 1) - (SELECT days FROM g WHERE lagos = 0 AND pilot = 0)), 1) AS did_days;
```

```text
did_days
    -8.4
```

A naive before-and-after would say 7.4 days. Allowing for the season, the pilot saved about 8.4 days per paid claim. Now the other measures:

```sql
WITH r AS (SELECT claim_id, MAX(activity = 'Documents requested') AS requested FROM events GROUP BY claim_id),
x AS (
  SELECT c.*, r.requested, (SELECT COUNT(*) FROM complaints m WHERE m.claim_id = c.claim_id) AS complaints
  FROM claims c JOIN r USING (claim_id)
)
SELECT CASE WHEN region = 'Lagos' THEN 'Lagos' ELSE 'Other regions' END AS grp,
       CASE WHEN submitted_at < '2026-04-01' THEN '1 Before' ELSE '2 Pilot period' END AS period,
       COUNT(*) AS claims,
       ROUND(100.0 * AVG(requested), 1) AS pct_docs_requested,
       ROUND(100.0 * AVG(outcome = 'Paid' AND julianday(closed_at) - julianday(submitted_at) > 30), 1) AS pct_paid_over_30,
       ROUND(100.0 * AVG(outcome = 'Withdrawn'), 1) AS pct_withdrawn,
       ROUND(100.0 * AVG(outcome = 'Rejected'), 1) AS pct_rejected,
       ROUND(100.0 * SUM(complaints) / COUNT(*), 1) AS complaints_per_100
FROM x
GROUP BY grp, period
ORDER BY grp, period;
```

```text
grp            period          claims  pct_docs_requested  pct_paid_over_30  pct_withdrawn  pct_rejected  complaints_per_100
Lagos          1 Before           793                47.3              18.7            7.4           7.3                19.4
Lagos          2 Pilot period     337                  16               3.9            2.1          10.1                 9.8
Other regions  1 Before          1446                44.7              19.9            7.2           7.9                19.5
Other regions  2 Pilot period     590                  41              21.9            6.4           7.6                22.4
```

The checklist did what it was meant to: claims needing documents chased fell from 47% to 16% in Lagos, while the other regions barely changed. Withdrawals and complaints fell too, and slow claims (over 30 days) almost disappeared.

One number needs watching: Lagos rejected 10.1% of claims during the pilot, against 7.3% before. That's 34 claims out of 337, a small sample, and a rise in rejections doesn't suggest assessors are approving too freely. But it's worth a sample audit before rollout, and the finance controller will ask.

## Walkthrough

1. Run the queries and reproduce the difference in differences.
2. Check that Lagos and the other regions moved together **before** the pilot. Plot monthly days to settle for both, from July 2025.
3. Split the Lagos pilot claims by type. How much faster were windscreen claims, which no longer had an inspection?
4. List what the pilot **can't** tell you: for example, whether it would work in Port Harcourt with only two assessors.
5. Write the pilot result (the task below).

## Practice

```answer
{
  "id": "bac-05-p1",
  "prompt": "What's the **difference in differences** in average days to settle a paid claim: Lagos's change minus the other regions' change? One decimal place (it's negative).",
  "answer": -8.4,
  "format": "number",
  "dataset": "claims",
  "files": ["claims"],
  "verify": "WITH g AS (SELECT region = 'Lagos' AS lagos, submitted_at >= '2026-04-01' AS pilot, AVG(julianday(closed_at) - julianday(submitted_at)) AS days FROM claims WHERE outcome = 'Paid' GROUP BY lagos, pilot) SELECT ROUND((SELECT days FROM g WHERE lagos = 1 AND pilot = 1) - (SELECT days FROM g WHERE lagos = 1 AND pilot = 0) - ((SELECT days FROM g WHERE lagos = 0 AND pilot = 1) - (SELECT days FROM g WHERE lagos = 0 AND pilot = 0)), 1)",
  "hint": "(Lagos pilot − Lagos before) − (others pilot − others before), using unrounded averages.",
  "required": true
}
```

```answer
{
  "id": "bac-05-p2",
  "prompt": "During the pilot, what percentage of **Lagos** claims had documents requested at least once? One decimal place.",
  "answer": 16.0,
  "format": "percent",
  "dataset": "claims",
  "files": ["claims", "events"],
  "verify": "WITH r AS (SELECT claim_id, MAX(activity = 'Documents requested') AS requested FROM events GROUP BY claim_id) SELECT ROUND(100.0 * AVG(requested), 1) FROM r JOIN claims USING (claim_id) WHERE region = 'Lagos' AND submitted_at >= '2026-04-01'",
  "hint": "Lagos claims submitted from 1 April 2026.",
  "required": true
}
```

```task
{
  "id": "bac-05-t1",
  "prompt": "Write the **pilot result** for the board (50 to 130 words): the effect on days to settle **compared with the other regions**, two other measures that moved, one thing to **watch**, and one thing the pilot **can't tell you**.",
  "minutes": 7,
  "rows": 6,
  "placeholder": "Compared with the other regions, ...",
  "rules": [
    { "label": "Uses the comparison with other regions", "pattern": "other regions|comparison|difference in differences|compared with" },
    { "label": "Gives the days saved", "pattern": "8(\\.\\d)?\\s*days" },
    { "label": "Numbers for other measures", "pattern": "\\d+(\\.\\d+)?\\s*%", "min": 2 },
    { "label": "Something to watch (rejections, controls, audit)", "pattern": "reject|audit|control|watch" },
    { "label": "A limit of the pilot (one region, Port Harcourt, capacity, three months)", "pattern": "port harcourt|one region|only lagos|capacity|three months|short" },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "Compared with the other regions over the same months, the Lagos pilot cut the average time to settle a paid claim by about 8.4 days (from 24.9 to 17.6, while other regions slowed slightly in the rainy season). Claims needing documents chased fell from 47% to 16%, and withdrawals from 7.4% to 2.1%. To watch: rejections rose from 7.3% to 10.1%, on a small sample; we'll audit pilot decisions before rollout. The pilot ran for three months in one region, so it can't tell us whether it works in Port Harcourt, where the bottleneck is assessor capacity.",
  "note": "Honest and useful: the effect is clear, and so are its limits.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why compare Lagos with the other regions instead of just before and after?",
    "options": ["The board prefers it", "To remove changes that affected everyone at the same time, such as the season", "Lagos is bigger", "It gives a bigger number"],
    "answer": 1,
    "explanation": "The comparison group shows what would have happened anyway."
  },
  {
    "prompt": "What does difference in differences assume?",
    "options": ["Nothing", "Without the pilot, Lagos would have moved like the other regions", "Lagos is unique", "The pilot was random"],
    "answer": 1,
    "explanation": "Check it by looking at the trends before the pilot."
  },
  {
    "prompt": "Rejections rose slightly in the pilot, on a small sample. What's the right response?",
    "options": ["Stop the pilot", "Ignore it", "Note it, and audit a sample of decisions before rolling out", "Hide it"],
    "answer": 2,
    "explanation": "Proportionate checking, reported openly."
  }
]
```
