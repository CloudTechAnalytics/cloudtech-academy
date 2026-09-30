---
title: Group, Join and Chart
minutes: 30
summary: Summarise data with groupby, join tables with merge, and turn the answers into charts you can share.
---

## Summarise with groupby

`groupby` is the pandas version of a pivot table. Total revenue by year:

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

1. Merge the three tables into `sales`.
2. Find revenue by `channel`. Which channel is biggest?
3. Find the three products with the highest revenue.
4. Make one bar chart and one line chart, and write three sentences summarising what they show.
