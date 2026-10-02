---
title: Cohorts and retention
minutes: 20
summary: Group customers by when they started, track how many keep coming back, and avoid the traps of left-censored data and part periods.
---

## The problem

Harbourline's commercial director has a worry: "We win new customers, but do they stay? Or do we keep replacing the ones we lose?"

Counting active customers per quarter doesn't answer it. The count was 80 in the first quarter of 2025 and 73 a year later, but that total mixes long-standing customers with new ones. A fall could mean old customers leaving, new ones not sticking, or both. To find out, you need to follow **groups of customers who started at the same time** and see what each group does next. That's **cohort analysis**, and it's one of the most requested analyses in subscription, retail and B2B companies.

## The concept

A **cohort** is a group of customers who share a starting point: here, the quarter of their first booking. A **retention table** counts how many from each cohort are active 0, 1, 2… periods later.

You build one in three steps:

1. **Activity**: one row per customer per period they were active (`SELECT DISTINCT customer_id, period`).
2. **Cohort**: each customer's first period (`MIN(period)`).
3. **Join and count**: for each cohort and each "periods since start", count the customers.

To work out "periods since start", give every quarter a number that counts up: `year × 4 + quarter`. Then 2026-Q1 minus 2025-Q3 is 2 quarters, even across a year boundary.

**Two traps to say out loud**

- **Left-censoring.** Harbourline's data starts in January 2025, but customers signed up as early as 2021. The "2025-Q1 cohort" is really **everyone already active** when the data begins, not new customers. Treat it as the existing base and compare the genuinely new cohorts separately.
- **Part periods.** The data ends on 31 August 2026, so 2026-Q3 has two months, not three. Activity in that quarter will look lower simply because it's shorter. Label it or leave it out.

## Example

The retention table, by quarter of first booking:

```sql run
WITH activity AS (
  SELECT DISTINCT
    customer_id,
    CAST(strftime('%Y', booking_date) AS INTEGER) * 4
      + (CAST(strftime('%m', booking_date) AS INTEGER) + 2) / 3 AS q_index
  FROM shipments
),
cohorts AS (
  SELECT customer_id, MIN(q_index) AS cohort_q
  FROM activity
  GROUP BY customer_id
)
SELECT
  (c.cohort_q - 1) / 4 || '-Q' || ((c.cohort_q - 1) % 4 + 1) AS cohort,
  a.q_index - c.cohort_q AS quarters_since_start,
  COUNT(*) AS active_customers
FROM activity AS a
JOIN cohorts AS c ON c.customer_id = a.customer_id
GROUP BY c.cohort_q, quarters_since_start
ORDER BY c.cohort_q, quarters_since_start;
```

Reading it:

- The existing base (2025-Q1, 80 customers) is steady: 63 were active the next quarter, and 56 were still booking in the short 2026-Q3.
- The 2025-Q2 cohort, the largest group of genuinely new customers, had 13 customers, but only 6 booked again the next quarter.

Does that mean new customers leave? Check before you say so. Of the 19 customers who first booked between April and December 2025, 16 booked again in 2026: 84%, about the same as the existing base (68 of 80, 85%). New customers aren't leaving more. They're **booking less often**, which is a different problem with a different fix (account management, not win-back campaigns).

## Walkthrough

1. Run the `activity` CTE on its own and check that a customer appears at most once per quarter.
2. Check the quarter number: `SELECT (2026 * 4 + 1) - (2025 * 4 + 3);` gives 2, which is 2025-Q3 to 2026-Q1.
3. Run the full example and find the 2025-Q2 row for `quarters_since_start = 4`. 11 of 13 were active a year later, more than in the quarters in between. A seasonal pattern? That's worth a question to the sales team.
4. Write the director's answer in two sentences, mentioning both traps.

## Practice

```exercise
{
  "id": "asql-06-p1",
  "prompt": "How many new customers did each quarter bring? Show cohort (as 'YYYY-Qn', from each customer's first booking) and new_customers, ordered by cohort.",
  "starter": "WITH firsts AS (\n  SELECT customer_id, MIN(booking_date) AS first_booking\n  FROM shipments\n  GROUP BY customer_id\n)\nSELECT\n  \nFROM firsts\nGROUP BY cohort\nORDER BY cohort;",
  "solution": "WITH firsts AS (SELECT customer_id, MIN(booking_date) AS first_booking FROM shipments GROUP BY customer_id) SELECT strftime('%Y', first_booking) || '-Q' || ((CAST(strftime('%m', first_booking) AS INTEGER) + 2) / 3) AS cohort, COUNT(*) AS new_customers FROM firsts GROUP BY cohort ORDER BY cohort;",
  "hint": "The quarter is (month + 2) / 3 with whole-number division. Build the label with strftime('%Y', first_booking) || '-Q' || ….",
  "required": true,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-06-p2",
  "prompt": "Retention for the existing base: for customers whose first booking was in 2025-Q1, show quarters_since_start, active_customers and retention_pct (active ÷ the cohort's 80 customers × 100, 1 decimal place), ordered by quarters_since_start. Work out the 80 in SQL rather than typing it.",
  "starter": "",
  "solution": "WITH activity AS (SELECT DISTINCT customer_id, CAST(strftime('%Y', booking_date) AS INTEGER) * 4 + (CAST(strftime('%m', booking_date) AS INTEGER) + 2) / 3 AS q_index FROM shipments), cohorts AS (SELECT customer_id, MIN(q_index) AS cohort_q FROM activity GROUP BY customer_id), base AS (SELECT a.q_index - c.cohort_q AS quarters_since_start, COUNT(*) AS active_customers FROM activity AS a JOIN cohorts AS c ON c.customer_id = a.customer_id WHERE c.cohort_q = 2025 * 4 + 1 GROUP BY quarters_since_start) SELECT quarters_since_start, active_customers, ROUND(100.0 * active_customers / FIRST_VALUE(active_customers) OVER (ORDER BY quarters_since_start), 1) AS retention_pct FROM base ORDER BY quarters_since_start;",
  "hint": "Filter the example to cohort_q = 2025 * 4 + 1. The cohort size is the quarter-0 count, so divide by FIRST_VALUE(active_customers) OVER (ORDER BY quarters_since_start).",
  "required": true,
  "orderMatters": true
}
```

## Challenge

```exercise
{
  "id": "asql-06-c1",
  "prompt": "Find customers who booked in 2025 but not at all in 2026. Show customer_id, company_name and last_booking, most recent last_booking first.",
  "starter": "",
  "solution": "SELECT c.customer_id, c.company_name, MAX(s.booking_date) AS last_booking FROM shipments AS s JOIN customers AS c ON c.customer_id = s.customer_id GROUP BY c.customer_id, c.company_name HAVING MAX(s.booking_date) < '2026-01-01' ORDER BY last_booking DESC, c.customer_id;",
  "hint": "Every customer here booked at some point, so 'not in 2026' means MAX(booking_date) < '2026-01-01'.",
  "required": false,
  "orderMatters": true
}
```

## More practice

```exercise
{
  "id": "asql-06-d1",
  "prompt": "Show active customers per quarter: quarter ('YYYY-Qn') and active_customers (distinct customers who booked), ordered by quarter.",
  "starter": "",
  "solution": "SELECT strftime('%Y', booking_date) || '-Q' || ((CAST(strftime('%m', booking_date) AS INTEGER) + 2) / 3) AS quarter, COUNT(DISTINCT customer_id) AS active_customers FROM shipments GROUP BY quarter ORDER BY quarter;",
  "hint": "COUNT(DISTINCT customer_id) grouped by the quarter label.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-06-d2",
  "prompt": "For customers whose first booking was in 2026, show customer_id, first_booking and shipments (their total), ordered by first_booking.",
  "starter": "",
  "solution": "SELECT customer_id, MIN(booking_date) AS first_booking, COUNT(*) AS shipments FROM shipments GROUP BY customer_id HAVING MIN(booking_date) >= '2026-01-01' ORDER BY first_booking, customer_id;",
  "hint": "HAVING MIN(booking_date) >= '2026-01-01'.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The data starts in January 2025, but some customers joined in 2021. What's true of the 2025-Q1 cohort?",
    "options": ["It's the best cohort of new customers", "It includes everyone already active when the data starts, so it isn't a cohort of new customers", "It should be deleted", "It has no retention"],
    "answer": 1,
    "explanation": "That's left-censoring. Compare it separately from cohorts of genuinely new customers."
  },
  {
    "prompt": "Why number quarters as year × 4 + quarter?",
    "options": ["To sort them alphabetically", "So subtracting two quarter numbers gives the number of quarters between them, even across years", "SQLite requires it", "To hide the year"],
    "answer": 1,
    "explanation": "2026-Q1 (8105) − 2025-Q3 (8103) = 2."
  },
  {
    "prompt": "Few new customers book in the quarter after they start, but most book again within a year. What's the best summary?",
    "options": ["New customers churn", "New customers stay, but book less often than established ones", "The data is wrong", "Retention is 100%"],
    "answer": 1,
    "explanation": "Retention depends on the window you choose. Check more than one before concluding."
  }
]
```
