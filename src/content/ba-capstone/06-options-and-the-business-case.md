---
title: Options and the business case
minutes: 30
summary: Put a value on slow claims through lost renewals, cost the benefits of rolling out the Lagos changes from the pilot's evidence, and compare the options by net present value and payback, with every assumption stated.
---

## The problem

Three options are on the table, in `options.csv`. The head of IT is pushing the new claims system. The managing director wants to know which option is worth the money. A business case answers that, but only if its benefits are built from evidence rather than from a supplier's brochure.

## The concept

**Options always include doing nothing**

"Do nothing" is the baseline the others are measured against. It isn't free: slow claims keep costing renewals.

**Benefits you can trace**

Each benefit should follow a chain: a change in the process → a change in what customers or staff do → money. Here:

- **Renewals.** Customers whose claims are slow or abandoned renew less. Fewer slow claims means more renewals.
- **Inspections avoided.** Windscreen claims no longer need a physical inspection.
- **Document chasing avoided.** Fewer requests means less staff time.

**Count contribution, not premium**

A renewed policy brings in premium, but much of that premium pays future claims and costs. Use the **contribution** (what's left), which Shieldline's finance team puts at 35% of premium.

**NPV and payback**

Net present value discounts future net benefits to today's money: NPV = −cost today + Σ net benefit ÷ (1 + rate)^year. Shieldline uses 15% and a three-year horizon. Payback is the time until the cumulative net benefit covers the up-front cost.

**Correlation isn't proof**

Customers with slow claims renew less. Some of that gap could be about the claims themselves (bigger, more stressful accidents take longer). Say so, and use the pilot's measured changes rather than the most optimistic figure.

## Example

The options:

```sql
SELECT option_id, option, one_off_cost_ngn, annual_running_cost_ngn, months_to_deliver, supplier_estimate_days_saved
FROM options;
```

```text
option_id  option             one_off_cost_ngn  annual_running_cost_ngn  months_to_deliver  supplier_estimate_days_saved
O1         Do nothing                        0                        0                  0
O2         Fix the process            42000000                 12000000                  4
O3         New claims system         280000000                 60000000                 14                            18
```

Renewal rates by the customer's claim experience, for policies with a baseline claim and policies with none:

```sql
SELECT CASE WHEN c.claim_id IS NULL THEN '1 No claim'
            WHEN c.outcome = 'Paid' AND julianday(c.closed_at) - julianday(c.submitted_at) <= 30 THEN '2 Paid within 30 days'
            WHEN c.outcome = 'Paid' THEN '3 Paid after 30 days'
            ELSE '4 ' || c.outcome END AS experience,
       COUNT(*) AS policies,
       ROUND(100.0 * AVG(r.renewed), 1) AS pct_renewed,
       ROUND(AVG(r.annual_premium_ngn)) AS avg_premium
FROM renewals r LEFT JOIN claims c USING (claim_id)
GROUP BY experience
ORDER BY experience;
```

```text
experience             policies  pct_renewed  avg_premium
1 No claim                 9000         80.4       391577
2 Paid within 30 days      1468         78.5       430427
3 Paid after 30 days        436         63.8       430408
4 Rejected                  172         46.5       415308
4 Withdrawn                 163         41.1       418761
```

A claim paid within 30 days barely dents loyalty. A slow claim costs about 15 points of renewal, and a customer who gives up (withdrawn) renews at only 41%. The yearly volumes, and the pilot's effect on document requests per claim:

```sql
SELECT ROUND(COUNT(*) * 12.0 / 9) AS claims_per_year,
       ROUND(SUM(claim_type = 'Windscreen') * 12.0 / 9) AS windscreens_per_year
FROM claims WHERE submitted_at < '2026-04-01';
```

```text
claims_per_year  windscreens_per_year
           2985                   892
```

```sql
WITH r AS (SELECT claim_id, SUM(activity = 'Documents requested') AS requests FROM events GROUP BY claim_id)
SELECT CASE WHEN region = 'Lagos' THEN 'Lagos' ELSE 'Other regions' END AS grp,
       CASE WHEN submitted_at < '2026-04-01' THEN '1 Before' ELSE '2 Pilot period' END AS period,
       ROUND(AVG(requests), 3) AS requests_per_claim
FROM r JOIN claims USING (claim_id)
GROUP BY grp, period
ORDER BY grp, period;
```

```text
grp            period          requests_per_claim
Lagos          1 Before                     0.648
Lagos          2 Pilot period               0.187
Other regions  1 Before                     0.589
Other regions  2 Pilot period               0.559
```

The difference in differences is (0.187 − 0.648) − (0.559 − 0.589) = **−0.431** requests per claim. From lesson 5, the pilot also cut paid claims over 30 days by (3.9 − 18.7) − (21.9 − 19.9) = **16.8 points**, and withdrawals by (2.1 − 7.4) − (6.4 − 7.2) = **4.5 points**.

The yearly benefit of rolling out option O2, using finance's figures of 35% contribution, ₦15,000 per physical inspection and ₦6,000 of staff time per document request:

| Benefit | Calculation | Per year |
| :-- | :-- | --: |
| Fewer slow claims | 2,985 × 16.8% × (78.5% − 63.8%) = 73.7 renewals | |
| Fewer withdrawals | 2,985 × 4.5% × (78.5% − 41.1%) = 50.2 renewals | |
| Renewals, as contribution | 124.0 renewals × ₦430,000 (the average premium with a paid claim) × 35% | ₦18.66m |
| Inspections avoided | 892 windscreens × ₦15,000 | ₦13.38m |
| Document requests avoided | 2,985 × 0.431 × ₦6,000 | ₦7.72m |
| **Total** | | **₦39.76m** |

Then the options over three years at 15%. The discount factors for years 1 to 3 add up to 0.870 + 0.756 + 0.658 = 2.283:

| Option | Up-front | Net benefit per year | NPV | Payback |
| :-- | --: | --: | --: | --: |
| O1 Do nothing | 0 | 0 | 0 | |
| O2 Fix the process | ₦42m | ₦39.76m − ₦12m = ₦27.76m | −42 + 27.76 × 2.283 = **₦21.4m** | 1.5 years |
| O3 New claims system | ₦280m | even at double O2's benefit: ₦79.52m − ₦60m = ₦19.52m | **−₦235.4m** | over 14 years |

O2 pays back in about a year and a half. O3 doesn't come close, even if its benefits were twice the pilot's and it were delivered immediately rather than in 14 months. Its supplier's estimate of 18 days saved is a claim; the pilot's 8.4 days is evidence. And a new system wouldn't, by itself, change the Friday approvals or add assessors in Port Harcourt.

## Walkthrough

1. Run the queries and rebuild the benefits table in a spreadsheet, with every input in its own cell.
2. Do a **sensitivity check**: what if the renewal effect is only half as big? What if contribution is 25%? Does O2 still pay back within three years?
3. Cost one extra assessor for Port Harcourt (say ₦9m a year). What would it need to achieve to pay for itself?
4. Write down every assumption, with its source.
5. Write the recommendation (the task below).

## Practice

```answer
{
  "id": "bac-06-p1",
  "prompt": "How many percentage points higher is the renewal rate for customers whose claim was **paid within 30 days** than for those **paid after 30 days**? One decimal place.",
  "answer": 14.8,
  "tolerance": 0.1,
  "format": "number",
  "dataset": "claims",
  "files": ["claims", "renewals"],
  "verify": "SELECT ROUND(100.0 * (AVG(CASE WHEN julianday(c.closed_at) - julianday(c.submitted_at) <= 30 THEN r.renewed END) - AVG(CASE WHEN julianday(c.closed_at) - julianday(c.submitted_at) > 30 THEN r.renewed END)), 1) FROM renewals r JOIN claims c USING (claim_id) WHERE c.outcome = 'Paid'",
  "hint": "Join renewals to claims, keep paid claims, and compare the two groups' renewal rates.",
  "explanation": "14.8 from the unrounded rates; 78.5 − 63.8 = 14.7 from the rounded ones in the table, which is also accepted.",
  "required": true
}
```

```answer
{
  "id": "bac-06-p2",
  "prompt": "Using the lesson's figures, what's the three-year **NPV** of option O2 at 15%, in ₦ millions? One decimal place.",
  "answer": 21.4,
  "format": "number",
  "hint": "−42 + 27.76 × (1/1.15 + 1/1.15² + 1/1.15³).",
  "required": true
}
```

```task
{
  "id": "bac-06-t1",
  "prompt": "Write the **recommendation** (60 to 150 words): which **option**, its **NPV and payback**, why **not** the others, the **key assumptions**, and what would change your mind.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "We recommend ...",
  "rules": [
    { "label": "Recommends an option", "pattern": "recommend" },
    { "label": "Gives NPV or payback with numbers", "pattern": "(npv|payback)[^.]*\\d" },
    { "label": "Explains why not the new system", "pattern": "new (claims )?system|O3" },
    { "label": "States assumptions", "pattern": "assum|contribution|35%" },
    { "label": "Says what would change the decision", "pattern": "change (my|our) mind|if [^.]*(were|was|turns out|proves)|would reconsider|unless" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "We recommend option O2: roll out the Lagos changes to every region. It costs ₦42m up front and ₦12m a year, returns about ₦39.8m a year, and has a three-year NPV of ₦21.4m with payback in about 18 months. We don't recommend a new claims system (O3) now: at ₦280m it loses money even at double the pilot's benefits, and it wouldn't fix approvals or assessor capacity by itself. Key assumptions: the pilot's effects hold in other regions, contribution is 35% of premium, and slow claims cause part of the lower renewals. If the renewal effect were only half as big, O2 would still break even over three years. We'd reconsider O3 if the current system reaches the end of its support life.",
  "note": "The recommendation is stronger because it shows its assumptions and the conditions under which it would be wrong.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why use contribution rather than the full premium of a renewed policy?",
    "options": ["It's bigger", "Much of the premium pays future claims and costs; only the contribution is benefit", "The regulator says so", "Premium is unknown"],
    "answer": 1,
    "explanation": "Count what the business actually keeps."
  },
  {
    "prompt": "A supplier says its system saves 18 days; a pilot measured 8.4. Which should the business case use?",
    "options": ["The supplier's figure", "The measured figure, treating the supplier's as an unproven claim", "The average", "Neither"],
    "answer": 1,
    "explanation": "Evidence beats promises."
  },
  {
    "prompt": "Why include \"do nothing\" as an option?",
    "options": ["It's always best", "It's the baseline the others are compared with, and it has costs of its own", "To fill the table", "Boards require three options"],
    "answer": 1,
    "explanation": "Doing nothing keeps losing renewals."
  }
]
```
