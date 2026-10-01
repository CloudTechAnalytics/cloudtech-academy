---
title: Clean, Filter and Calculate
minutes: 15
summary: Fix column types, add a revenue column, filter rows that match a condition and sort the results.
---

## Fix the date column

Dates loaded as text can't be sorted or grouped by month properly. Convert them:

```python
orders["order_date"] = pd.to_datetime(orders["order_date"])
orders.info()
```

`order_date` is now `datetime64`. You can pull out parts of the date:

```python
orders["year"] = orders["order_date"].dt.year
orders["month"] = orders["order_date"].dt.to_period("M")
```

> [!TIP]
> You can also parse dates while loading: `pd.read_csv(url, parse_dates=["order_date"])`.

## Add a revenue column

Revenue for each line is quantity × unit price, minus the discount:

```python
orders["revenue"] = (
    orders["quantity"] * orders["unit_price"] * (1 - orders["discount_pct"] / 100)
)
orders["revenue"].sum()
```

Total revenue is **₦830,541,245**. Notice there's no loop: pandas does the maths for every row at once.

## Filter rows

Put a condition inside square brackets to keep only the matching rows:

```python
big = orders[orders["quantity"] >= 20]
len(big)                  # 1,032 lines
big["revenue"].sum()
```

Combine conditions with `&` (and) or `|` (or), with brackets around each one:

```python
discounted_2026 = orders[(orders["discount_pct"] > 0) & (orders["year"] == 2026)]
```

## Sort

```python
orders.sort_values("revenue", ascending=False).head(5)
```

This shows the five biggest order lines. Use `ascending=True` (the default) for smallest first.

## Check for problems

Real data is rarely this clean. These checks are worth running on any dataset:

```python
orders.isna().sum()          # missing values per column
orders.duplicated().sum()    # fully duplicated rows
(orders["quantity"] <= 0).sum()  # impossible values
```

This dataset passes all three, but make it a habit.

## Try it

Continue in the same notebook, after adding the `year`, `month` and `revenue` columns.

```answer
{
  "id": "pyda-m02-a1",
  "prompt": "How many order lines had a **10%** discount?",
  "answer": 525,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM orders WHERE discount_pct = 10",
  "pyVerify": "(orders['discount_pct'] == 10).sum()",
  "required": true
}
```

```answer
{
  "id": "pyda-m02-a2",
  "prompt": "How much **revenue** did those 10%-discount lines bring in? (A rounded figure is fine.)",
  "answer": 122835600,
  "format": "naira",
  "dataset": "sales",
  "files": [
    "orders"
  ],
  "verify": "SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders WHERE discount_pct = 10",
  "pyVerify": "orders.loc[orders['discount_pct'] == 10, 'revenue'].sum()",
  "hint": "orders[orders[\"discount_pct\"] == 10][\"revenue\"].sum()",
  "required": true
}
```

```answer
{
  "id": "pyda-m02-a3",
  "prompt": "What is the revenue of the **biggest single order line in 2026**?",
  "answer": 713400,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT MAX(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders WHERE order_date >= '2026-01-01'",
  "pyVerify": "orders.loc[orders['year'] == 2026, 'revenue'].max()",
  "hint": "Filter to year 2026, then sort_values(\"revenue\", ascending=False).head(1)",
  "required": true
}
```
