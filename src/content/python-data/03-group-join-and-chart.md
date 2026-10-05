---
title: Group, Join and Chart
minutes: 25
summary: Summarise data with groupby, join tables with merge, and turn the answers into charts you can share.
---

## Summarise with groupby

`groupby` is the pandas version of a pivot table. Total revenue by year:

![Six rows split into North and South groups, each summed, giving North 500 and South 450](/images/courses/python-data/groupby.svg "groupby: split into groups, calculate for each, combine the results.")

```python
orders.groupby("year")["revenue"].sum()
```

Revenue by month, then the best and worst months:

```python
monthly = orders.groupby("month")["revenue"].sum()
monthly.idxmax(), monthly.max()   # December 2025 was the best month
monthly.idxmin(), monthly.min()
```

## Join tables with merge

The orders table only has `product_id` and `customer_id`. The names, categories and regions live in two other tables. Load them and **merge**:

```python
base = "https://academy.cloudtechanalytics.com/datasets/sales/"
products = pd.read_csv(base + "products.csv")
customers = pd.read_csv(base + "customers.csv")

sales = (
    orders
    .merge(products, on="product_id")
    .merge(customers, on="customer_id")
)
sales.columns
```

`merge` matches rows where the key column has the same value, like a lookup in Excel.

![An orders table and a products table are matched on product_id, so each order gains the product name](/images/courses/python-data/merge.svg "merge matches rows on a key column, like a lookup in Excel.")

## Answer business questions

```python
sales.groupby("category")["revenue"].sum().sort_values(ascending=False)
```

| Category | Revenue |
| :-- | --: |
| Household | ₦244,769,040 |
| Personal care | ₦235,483,370 |
| Beverages | ₦224,612,360 |
| Snacks | ₦125,676,475 |

```python
sales.groupby("region")["revenue"].sum().sort_values(ascending=False)
```

Lagos brings in **₦411,162,300**, about half of all revenue, followed by South West and North West.

## Make charts

pandas can draw charts directly:

![Two charts drawn with illustrative numbers: a bar chart comparing four product groups and a line chart of monthly revenue rising to a peak in May, with the pandas plot code](/images/courses/python-data/charts.svg "Bars compare categories; lines show change over time.")

```python
by_region = sales.groupby("region")["revenue"].sum().sort_values()
by_region.plot(kind="barh", title="Revenue by region (₦)")
```

```python
monthly.plot(title="Monthly revenue (₦)")
```

Use `kind="barh"` for comparing categories and a line (the default) for trends over time.

> [!NOTE]
> The 2026 total looks much smaller than 2025 only because the data stops at the end of June 2026. Always check the date range before comparing periods.

## Share your analysis

Add **text cells** to explain what you found in plain words, not just code. Then save the notebook to GitHub (**File → Save a copy in GitHub**) or share the Colab link. That's a portfolio project.

## Try it

Use the merged `sales` table.

```answer
{
  "id": "pyda-m03-a1",
  "prompt": "Which **channel** brings in the most revenue?",
  "answer": "Wholesale",
  "format": "text",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT c.channel FROM orders o JOIN customers c ON c.customer_id = o.customer_id GROUP BY c.channel ORDER BY SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) DESC LIMIT 1",
  "pyVerify": "sales.groupby('channel')['revenue'].sum().idxmax()",
  "required": true
}
```

```answer
{
  "id": "pyda-m03-a2",
  "prompt": "Which **product** (product_name) brings in the most revenue?",
  "answer": "Detergent 900g (12)",
  "format": "text",
  "accept": ["detergent 900g", "detergent"],
  "dataset": "sales",
  "files": ["orders", "products"],
  "verify": "SELECT p.product_name FROM orders o JOIN products p ON p.product_id = o.product_id GROUP BY p.product_id ORDER BY SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) DESC LIMIT 1",
  "pyVerify": "sales.groupby('product_name')['revenue'].sum().idxmax()",
  "required": true
}
```

```task
{
  "id": "pyda-m03-t1",
  "prompt": "Make a bar chart of revenue by region and a line chart of monthly revenue. Then write **three sentences** for a manager summarising what they show, with at least two numbers.",
  "minutes": 12,
  "rows": 5,
  "placeholder": "Lagos brings in ...",
  "rules": [
    { "label": "Three sentences", "pattern": "[.!?](\\s|$)", "min": 3 },
    { "label": "At least two numbers", "pattern": "\\d[\\d,.]*", "min": 2 },
    { "label": "Mentions a region", "pattern": "lagos|south west|north west|north central|south south|south east" },
    { "label": "Says something about change over time (month, December, grew, fell, peak…)", "pattern": "month|december|january|june|peak|grew|grow|fell|fall|rose|trend|season" },
    { "label": "Written for a manager, not code (no brackets or underscores)", "pattern": "\\.groupby|\\[\"|_id|\\(\\)", "absent": true }
  ],
  "sample": "Lagos brings in about half of all revenue, ₦411 million of ₦831 million. Monthly revenue peaks in December 2025 at ₦66 million, when retailers stock up for the festive season. The data stops in June 2026, so 2026 totals should be compared with January to June 2025, not the whole year.",
  "required": true
}
```

Then save the notebook to GitHub (**File → Save a copy in GitHub**) or share the Colab link with a text cell at the top explaining what it does.
