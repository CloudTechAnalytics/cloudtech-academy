---
title: Business analysis patterns
minutes: 25
summary: Build three analyses finance and sales ask for again and again (receivables aging, Pareto concentration and RFM segmentation) by combining everything in this course.
---

## The problem

Harbourline's finance director has a number: ₦1.41 billion of freight charges on delivered shipments hasn't been paid. She needs to know **how worried to be**. ₦1.4 billion that's a week overdue is normal business. ₦1.4 billion that's six months overdue is a cash-flow crisis and possibly bad debt.

Meanwhile, the sales director wants to know which customers matter most and which are slipping away.

None of these is a new SQL feature. Each is a **pattern**: a standard analysis that companies everywhere ask for, built from the pieces you already have. Knowing the patterns means you can say "yes, by tomorrow" instead of "let me think about how".

## The concept

### Receivables aging

Group unpaid amounts into buckets by how long they've been owed (0–30, 31–60, 61–90, over 90 days) as of a fixed date. The older the bucket, the less likely the money is ever collected. Finance teams review an aging report every month.

Steps: total payments per shipment → outstanding = charge − paid → days since delivery, as of the report date → `CASE` into buckets → total by bucket.

### Pareto (concentration)

How much of revenue comes from the top customers? Sort customers by revenue, take a **running total**, and divide by the grand total. The row where the running share passes 80% tells you how concentrated the business is. High concentration is a risk: lose one big customer and revenue falls sharply.

### RFM segmentation

Score every customer on three things:

- **Recency**: days since their last order (fewer is better).
- **Frequency**: how many orders.
- **Monetary**: how much they've spent.

`NTILE(4) OVER (ORDER BY …)` splits customers into four equal groups for each measure, scored 1 to 4. A customer scoring 4-4-4 is your best; one with high frequency and money but a recency score of 1 is a valuable customer who's gone quiet, the first call for the account team.

> [!NOTE]
> `NTILE` puts tied values into different groups when a group boundary falls between them. Add a tie-breaker to its `ORDER BY` so the scores are the same every time.

## Example

The aging report as of 31 August 2026:

```sql run
WITH paid AS (
  SELECT shipment_id, SUM(amount) AS paid
  FROM payments
  GROUP BY shipment_id
),
open_items AS (
  SELECT
    s.shipment_id,
    s.customer_id,
    s.freight_charge - COALESCE(p.paid, 0) AS outstanding,
    julianday('2026-08-31') - julianday(s.delivery_date) AS days_owed
  FROM shipments AS s
  LEFT JOIN paid AS p ON p.shipment_id = s.shipment_id
  WHERE s.status = 'Delivered'
    AND s.freight_charge - COALESCE(p.paid, 0) > 0
)
SELECT
  CASE
    WHEN days_owed <= 30 THEN '0-30 days'
    WHEN days_owed <= 60 THEN '31-60 days'
    WHEN days_owed <= 90 THEN '61-90 days'
    ELSE 'Over 90 days'
  END AS bucket,
  COUNT(*) AS shipments,
  SUM(outstanding) AS outstanding,
  ROUND(100.0 * SUM(outstanding) / SUM(SUM(outstanding)) OVER (), 1) AS pct_of_total
FROM open_items
GROUP BY bucket
ORDER BY MIN(days_owed);
```

The answer to "how worried?" is **very**: ₦1.29 billion, **91.6%** of everything owed, is more than 90 days overdue, spread over 221 shipments. This isn't slow paperwork; it's old debt. The recommendation writes itself: a collection drive on the over-90 balances, starting with the largest.

## Walkthrough

1. Run the example and check the total: the four buckets add up to ₦1,411,777,000, the same as charged minus received on delivered shipments in lesson 3. Reconcile before you present.
2. Note why `paid` is a CTE: shipments paid in instalments would otherwise be counted once per payment.
3. Find who owes the old money. Change the final `SELECT` to group the over-90 items by customer:

```sql run
WITH paid AS (
  SELECT shipment_id, SUM(amount) AS paid FROM payments GROUP BY shipment_id
)
SELECT c.company_name, COUNT(*) AS shipments, SUM(s.freight_charge - COALESCE(p.paid, 0)) AS over_90
FROM shipments AS s
LEFT JOIN paid AS p ON p.shipment_id = s.shipment_id
JOIN customers AS c ON c.customer_id = s.customer_id
WHERE s.status = 'Delivered'
  AND s.freight_charge > COALESCE(p.paid, 0)
  AND s.delivery_date <= date('2026-08-31', '-90 days')
GROUP BY c.customer_id, c.company_name
ORDER BY over_90 DESC
LIMIT 10;
```

4. Oakridge Motors Plc tops the list with about ₦92 million across 8 shipments. 63 customers have something over 90 days, so this is a widespread collections problem, not one bad customer.

## Practice

```exercise
{
  "id": "asql-10-p1",
  "prompt": "Pareto: rank customers by delivered freight charges and show each one's cumulative share of the total. Show customer_id, revenue and cumulative_pct (1 decimal place), highest revenue first (ties by customer_id).",
  "starter": "WITH revenue AS (\n  SELECT customer_id, SUM(freight_charge) AS revenue\n  FROM shipments\n  WHERE status = 'Delivered'\n  GROUP BY customer_id\n)\nSELECT customer_id, revenue\nFROM revenue\nORDER BY revenue DESC, customer_id;",
  "solution": "WITH revenue AS (SELECT customer_id, SUM(freight_charge) AS revenue FROM shipments WHERE status = 'Delivered' GROUP BY customer_id) SELECT customer_id, revenue, ROUND(100.0 * SUM(revenue) OVER (ORDER BY revenue DESC, customer_id ROWS UNBOUNDED PRECEDING) / SUM(revenue) OVER (), 1) AS cumulative_pct FROM revenue ORDER BY revenue DESC, customer_id;",
  "hint": "A running total (SUM(revenue) OVER (ORDER BY revenue DESC, customer_id ROWS UNBOUNDED PRECEDING)) divided by the grand total (SUM(revenue) OVER ()).",
  "required": true,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-10-p2",
  "prompt": "RFM scores, as of 2026-08-31, for every customer who has booked. Recency = days since last booking; frequency = number of shipments; monetary = total freight_charge on delivered shipments. Score each with NTILE(4) so that 4 is best (most recent, most frequent, highest spend), breaking ties by customer_id. Show customer_id, recency_days, frequency, monetary, r, f and m, ordered by customer_id.",
  "starter": "WITH base AS (\n  SELECT\n    customer_id,\n    CAST(julianday('2026-08-31') - julianday(MAX(booking_date)) AS INTEGER) AS recency_days,\n    COUNT(*) AS frequency,\n    SUM(CASE WHEN status = 'Delivered' THEN freight_charge ELSE 0 END) AS monetary\n  FROM shipments\n  GROUP BY customer_id\n)\nSELECT *\nFROM base\nORDER BY customer_id;",
  "solution": "WITH base AS (SELECT customer_id, CAST(julianday('2026-08-31') - julianday(MAX(booking_date)) AS INTEGER) AS recency_days, COUNT(*) AS frequency, SUM(CASE WHEN status = 'Delivered' THEN freight_charge ELSE 0 END) AS monetary FROM shipments GROUP BY customer_id) SELECT customer_id, recency_days, frequency, monetary, NTILE(4) OVER (ORDER BY recency_days DESC, customer_id) AS r, NTILE(4) OVER (ORDER BY frequency, customer_id) AS f, NTILE(4) OVER (ORDER BY monetary, customer_id) AS m FROM base ORDER BY customer_id;",
  "hint": "NTILE gives 1 to the first rows in its order, so order from worst to best: recency_days DESC (longest ago first), frequency ascending, monetary ascending. Add customer_id as the tie-breaker in each.",
  "required": true,
  "orderMatters": true
}
```

## Challenge

```exercise
{
  "id": "asql-10-c1",
  "prompt": "Using the RFM scores, find valuable customers who've gone quiet: f = 4 and m = 4 but r <= 2. Show customer_id, company_name, recency_days, frequency and monetary, longest recency first.",
  "starter": "",
  "solution": "WITH base AS (SELECT customer_id, CAST(julianday('2026-08-31') - julianday(MAX(booking_date)) AS INTEGER) AS recency_days, COUNT(*) AS frequency, SUM(CASE WHEN status = 'Delivered' THEN freight_charge ELSE 0 END) AS monetary FROM shipments GROUP BY customer_id), scored AS (SELECT *, NTILE(4) OVER (ORDER BY recency_days DESC, customer_id) AS r, NTILE(4) OVER (ORDER BY frequency, customer_id) AS f, NTILE(4) OVER (ORDER BY monetary, customer_id) AS m FROM base) SELECT s.customer_id, c.company_name, s.recency_days, s.frequency, s.monetary FROM scored AS s JOIN customers AS c ON c.customer_id = s.customer_id WHERE s.f = 4 AND s.m = 4 AND s.r <= 2 ORDER BY s.recency_days DESC, s.customer_id;",
  "hint": "Put the scoring query in a CTE, then filter and join the names.",
  "required": false,
  "orderMatters": true
}
```

## More practice

```exercise
{
  "id": "asql-10-d1",
  "prompt": "Average days to pay by customer: for customers with at least 10 payments, show customer_id, payments and avg_days_to_pay (payment_date − delivery_date, 1 decimal place), slowest first.",
  "starter": "",
  "solution": "SELECT s.customer_id, COUNT(*) AS payments, ROUND(AVG(julianday(p.payment_date) - julianday(s.delivery_date)), 1) AS avg_days_to_pay FROM payments AS p JOIN shipments AS s ON s.shipment_id = p.shipment_id GROUP BY s.customer_id HAVING COUNT(*) >= 10 ORDER BY avg_days_to_pay DESC, s.customer_id;",
  "hint": "Join payments to shipments, group by customer, HAVING COUNT(*) >= 10.",
  "required": false,
  "orderMatters": true
}
```

```exercise
{
  "id": "asql-10-d2",
  "prompt": "Aging by mode: for unpaid amounts on delivered shipments as of 2026-08-31, show mode, outstanding (total) and over_90 (the part more than 90 days since delivery), largest outstanding first.",
  "starter": "",
  "solution": "WITH paid AS (SELECT shipment_id, SUM(amount) AS paid FROM payments GROUP BY shipment_id) SELECT r.mode, SUM(s.freight_charge - COALESCE(p.paid, 0)) AS outstanding, SUM(CASE WHEN julianday('2026-08-31') - julianday(s.delivery_date) > 90 THEN s.freight_charge - COALESCE(p.paid, 0) ELSE 0 END) AS over_90 FROM shipments AS s LEFT JOIN paid AS p ON p.shipment_id = s.shipment_id JOIN routes AS r ON r.route_id = s.route_id WHERE s.status = 'Delivered' AND s.freight_charge > COALESCE(p.paid, 0) GROUP BY r.mode ORDER BY outstanding DESC;",
  "hint": "The aging CTE plus a join to routes, with SUM(CASE …) for the over-90 part.",
  "required": false,
  "orderMatters": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "₦1.4bn is outstanding and 92% of it is more than 90 days old. What's the best summary for finance?",
    "options": ["Normal working capital", "Mostly old debt: a collections problem and a bad-debt risk, not slow paperwork", "The data is wrong", "Customers have overpaid"],
    "answer": 1,
    "explanation": "The aging profile, not the total, tells you how worried to be."
  },
  {
    "prompt": "The running share of revenue passes 80% at customer 38 of 102. What does that mean?",
    "options": ["38 customers owe money", "About 37% of customers bring in 80% of revenue", "Revenue grew 80%", "38% of customers are inactive"],
    "answer": 1,
    "explanation": "That's a Pareto analysis of concentration."
  },
  {
    "prompt": "In NTILE(4) OVER (ORDER BY recency_days DESC, customer_id), which customers get a score of 4?",
    "options": ["Those who booked longest ago", "Those who booked most recently", "Random customers", "Those with the most shipments"],
    "answer": 1,
    "explanation": "NTILE gives 1 to the first rows and 4 to the last; ordering by recency_days DESC puts the most recent last."
  }
]
```
