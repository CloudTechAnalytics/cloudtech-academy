---
title: "Final project: customer health review"
minutes: 20
summary: Plan and start your final project, a customer health review for Kolanut Distribution. Find which customers are growing, which are slipping, and what's really behind the North West's fall.
---

## The problem

The board has seen Bisi's headline (lesson 9): North West revenue fell 47% from H1 2025 to H1 2026. The managing director's follow-up is the kind of question a final project should answer:

> "Is the North West problem the whole region, or a few customers? And across the business: who's growing, who's slipping, and who should the sales team call this week?"

This lesson sets up the project and gets you started on it. The project itself is submitted from the course page; its brief lists exactly what to hand in.

## The concept

### Customer health: recency, frequency, value

A simple, widely used way to judge customers is **RFM**:

- **Recency:** days since their last order. A customer who hasn't ordered for two months is at risk, however much they spent last year.
- **Frequency:** how many orders they've placed.
- **Monetary value:** how much revenue they've brought in.

Each is one `groupby` on the orders. Together they say who's healthy and who's slipping.

### Change per customer

The same H1-against-H1 comparison you made for regions in lesson 9 works per customer: a pivot table of revenue by customer and year, plus a `change` column. Sorting by `change` lists the biggest fallers first. Merging in customer details shows **who** they are and where.

### Explaining a total with its parts

When a region falls, ask how much of the fall comes from its biggest movers. If two customers account for most of it, the fix is two phone calls, not a regional strategy.

### A notebook someone else can follow

Structure the project notebook the way a reader thinks:

1. **Question** (text cell): what you were asked, in your own words.
2. **Data and checks**: load, merge with `validate`, row counts, missing values.
3. **Analysis**: one section per sub-question, each ending in a sentence that says what the result shows.
4. **Charts**: two or three, each with an action title.
5. **Findings and recommendations**, with caveats.

It must run from top to bottom with **Runtime → Run all**.

## Example

The starting point: recency, frequency and value for every customer.

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/sales/"
orders = pd.read_csv(base + "orders.csv", parse_dates=["order_date"])
customers = pd.read_csv(base + "customers.csv")
orders["revenue"] = orders["quantity"] * orders["unit_price"] * (1 - orders["discount_pct"] / 100)

as_of = orders["order_date"].max()
rfm = orders.groupby("customer_id").agg(
    last_order=("order_date", "max"),
    orders=("order_id", "nunique"),
    revenue=("revenue", "sum"),
)
rfm["days_since"] = (as_of - rfm["last_order"]).dt.days
rfm = rfm.merge(customers, on="customer_id", how="left", validate="one_to_one")

print(f"Data ends {as_of:%d %B %Y}")
rfm.sort_values("days_since", ascending=False)[["customer_name", "region", "channel", "days_since", "revenue"]].head()
```

And the change per customer from H1 2025 to H1 2026:

```python
h1 = orders[orders["order_date"].dt.month <= 6].assign(year=lambda d: d["order_date"].dt.year)
change = h1.pivot_table(index="customer_id", columns="year", values="revenue", aggfunc="sum", fill_value=0)
change["change"] = change[2026] - change[2025]
change = change.merge(customers, on="customer_id", validate="one_to_one").sort_values("change")
change[["customer_name", "region", "channel", 2025, 2026, "change"]].head(3)
```

```text
customer_name      region    channel        2025       2026     change
57    Grace Wholesale  North West  Wholesale   9352695.0  2680855.0 -6671840.0
15  Olumide Wholesale  North West  Wholesale   9295740.0  3087875.0 -6207865.0
61   Divine Wholesale  South East  Wholesale  13566690.0  9439740.0 -4126950.0
```

`assign(year=lambda d: ...)` adds a column inside a chain of steps: `d` is the table at that point.

The top two fallers are both North West wholesalers. That's where your project starts.

## Walkthrough

1. Create a new notebook named `Kolanut customer health review` and add the five section headings above as text cells.
2. Run the Example's first cell under **Data and checks**, and add the checks: row counts before and after the merge, and `rfm.isna().sum()`.
3. Recency: how many customers haven't ordered in the last 30 days? `(rfm["days_since"] > 30).sum()`.
4. Run the change-per-customer cell. Then work out how much of the North West's fall comes from its two biggest fallers: filter `change` to North West and compare the sum of the two most negative rows with the region's total change.
5. Draw a bar chart of the 10 biggest fallers and the 10 biggest growers (`pd.concat([change.head(10), change.tail(10)])`, then `.plot.barh`), with an action title.
6. Write a first draft of your findings, then open the project brief on the course page and check every task is covered.

> [!TIP]
> Name the customers. "Two North West wholesalers explain 89% of the region's fall" is good. "Grace Wholesale and Olumide Wholesale explain 89% of the fall; call both this week" is what gets acted on.

## Practice

Warm-ups that check your set-up before you start the project.

```answer
{
  "id": "pyan-12-p1",
  "prompt": "How many customers have **not ordered for more than 30 days** by the end of the data (30 June 2026)?",
  "answer": 23,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM (SELECT customer_id, MAX(order_date) AS last FROM orders GROUP BY customer_id) WHERE julianday('2026-06-30') - julianday(last) > 30",
  "pyVerify": "(rfm['days_since'] > 30).sum()",
  "required": true
}
```

```answer
{
  "id": "pyan-12-p2",
  "prompt": "How many customers had **lower** revenue in H1 2026 than in H1 2025?",
  "answer": 38,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM (SELECT customer_id, SUM(CASE WHEN order_date BETWEEN '2026-01-01' AND '2026-06-30' THEN quantity * unit_price * (1 - discount_pct / 100.0) ELSE 0 END) - SUM(CASE WHEN order_date BETWEEN '2025-01-01' AND '2025-06-30' THEN quantity * unit_price * (1 - discount_pct / 100.0) ELSE 0 END) AS chg FROM orders GROUP BY customer_id) WHERE chg < 0",
  "pyVerify": "(change['change'] < 0).sum()",
  "required": true
}
```

```answer
{
  "id": "pyan-12-p3",
  "prompt": "What percentage of the **North West's** total H1 fall comes from its **two** biggest fallers? Round to a whole number.",
  "answer": 89,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "WITH c AS (SELECT o.customer_id, SUM(CASE WHEN o.order_date BETWEEN '2026-01-01' AND '2026-06-30' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) ELSE 0 END) - SUM(CASE WHEN o.order_date BETWEEN '2025-01-01' AND '2025-06-30' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) ELSE 0 END) AS chg FROM orders o JOIN customers cu ON cu.customer_id = o.customer_id WHERE cu.region = 'North West' GROUP BY o.customer_id) SELECT ROUND(100.0 * (SELECT SUM(chg) FROM (SELECT chg FROM c ORDER BY chg LIMIT 2)) / (SELECT SUM(chg) FROM c))",
  "pyVerify": "round(change.loc[change['region'] == 'North West', 'change'].nsmallest(2).sum() / change.loc[change['region'] == 'North West', 'change'].sum() * 100)",
  "hint": "Filter change to North West. Divide the sum of the two most negative changes by the region's total change.",
  "explanation": "Two customers explain almost all of the region's fall. That turns a worrying regional headline into two specific accounts the sales team can call.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A customer spent ₦20m last year but hasn't ordered for 75 days. What does RFM say?",
    "options": ["Healthy: high value", "At risk: high value but poor recency", "Irrelevant", "Lost for good"],
    "answer": 1,
    "explanation": "Recency is the early warning. High-value customers going quiet are the first calls to make."
  },
  {
    "prompt": "North West revenue fell ₦14.5m, and two customers fell ₦12.9m between them. What's the best recommendation?",
    "options": ["Close the North West region", "A new regional marketing campaign", "Contact those two customers to find out what changed", "Raise prices in the North West"],
    "answer": 2,
    "explanation": "When a few customers explain a total, act on the customers."
  },
  {
    "prompt": "What must be true of your project notebook before you submit it?",
    "options": ["It has at least 50 cells", "It runs from top to bottom with Run all, and each section ends with what it shows", "It uses every pandas function in the course", "It has no text cells"],
    "answer": 1,
    "explanation": "A reader should be able to run it and follow the reasoning."
  }
]
```
