---
title: Calculated columns and dates
minutes: 30
summary: Add calculated columns to a whole table at once, convert text to real dates and pull out years, months and weekdays, and build categories with np.where and pd.cut.
---

## The problem

Kolanut's orders file has no revenue column, and its dates are text. Before Bisi can answer "how much did we sell in each quarter?" or "do Saturdays sell more?", she needs two things the raw file doesn't have:

- a **revenue** figure on every line, after discount, and
- **real dates**, so she can ask for the year, quarter, month or weekday of each order.

In Excel you'd write a formula in the first row and drag it down 4,266 rows. In pandas you write it **once for the whole column**.

## The concept

### Column arithmetic works on every row at once

```python
orders["revenue"] = orders["quantity"] * orders["unit_price"] * (1 - orders["discount_pct"] / 100)
orders[["quantity", "unit_price", "discount_pct", "revenue"]].head(3)
```

```text
quantity  unit_price  discount_pct   revenue
0        14       18600             0  260400.0
1         7       13200             0   92400.0
2         4        3600             0   14400.0
```

There's no loop: pandas multiplies the columns row by row for you. This is called **vectorised** code, and it's both shorter and far faster than looping over rows yourself. Assigning to a name that doesn't exist yet (`orders["revenue"]`) creates the column; assigning to one that exists replaces it.

### Text to dates: `pd.to_datetime`

```python
orders["order_date"] = pd.to_datetime(orders["order_date"])
orders["order_date"].head(3)
```

```text
0   2025-01-01
1   2025-01-01
2   2025-01-01
Name: order_date, dtype: datetime64[ns]
```

After this, `orders.info()` shows `datetime64[ns]`, and the **`.dt` accessor** gives you the parts of each date:

| Code | Gives | Example for 2026-03-14 |
| :-- | :-- | :-- |
| `.dt.year` | Year | 2026 |
| `.dt.quarter` | Quarter | 1 |
| `.dt.month` | Month number | 3 |
| `.dt.month_name()` | Month name | March |
| `.dt.day_name()` | Weekday | Saturday |
| `.dt.to_period("M")` | Year-month | 2026-03 |

Dates written day-first, like `14/03/2026`, need `pd.to_datetime(col, dayfirst=True)`. Dates in other layouts need a `format`, such as `format="%d-%b-%Y"` for `14-Mar-2026`. Always check a few converted dates against the original text: a day/month mix-up is silent and expensive.

### Real dates filter by real ranges

```python
q1_2026 = orders[(orders["order_date"] >= "2026-01-01") & (orders["order_date"] < "2026-04-01")]
len(q1_2026)
```

```text
695
```

Using `< "2026-04-01"` rather than `<= "2026-03-31"` is a good habit: it still works when timestamps include a time of day.

### Categories from conditions

- Two outcomes: `np.where(condition, value_if_true, value_if_false)`, from the **numpy** library (imported as `np`), which pandas is built on.
- Several bands: `pd.cut(column, bins=[...], labels=[...])`. With `bins=[0, 9, 19, 30]`, a value goes in the band whose range includes it: 1–9, 10–19 or 20–30. By default the left edge is excluded and the right edge included.

### Tidy number columns

- `.round(2)` rounds; `.astype(int)` converts to whole numbers.
- Money is often stored in whole naira. If a column of whole numbers shows as `float64`, a missing value is usually the reason.

## Example

Add revenue, convert the dates, and look at revenue by year:

```python
import numpy as np
import pandas as pd

orders = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/sales/orders.csv")

orders["revenue"] = orders["quantity"] * orders["unit_price"] * (1 - orders["discount_pct"] / 100)
orders["order_date"] = pd.to_datetime(orders["order_date"])
orders["year"] = orders["order_date"].dt.year

print(f"Total revenue: ₦{orders['revenue'].sum():,.0f}")
print(f"2025: ₦{orders.loc[orders['year'] == 2025, 'revenue'].sum():,.0f}")
print(f"2026 (Jan-Jun): ₦{orders.loc[orders['year'] == 2026, 'revenue'].sum():,.0f}")
```

```text
Total revenue: ₦830,541,245
2025: ₦539,810,790
2026 (Jan-Jun): ₦290,730,455
```

> [!BUSINESS]
> 2026 looks much smaller, but it's only six months. Comparing a half year with a full year is the most common mistake in sales reporting. Compare like with like: H1 2026 against H1 2025.

Now size bands for each line, and the weekday:

```python
orders["size"] = pd.cut(orders["quantity"], bins=[0, 9, 19, 30], labels=["Small", "Medium", "Large"])
orders["discounted"] = np.where(orders["discount_pct"] > 0, "Yes", "No")
orders["weekday"] = orders["order_date"].dt.day_name()
orders[["order_date", "weekday", "quantity", "size", "discounted", "revenue"]].head()
```

```text
  order_date    weekday  quantity    size discounted   revenue
0 2025-01-01  Wednesday        14  Medium         No  260400.0
1 2025-01-01  Wednesday         7   Small         No   92400.0
2 2025-01-01  Wednesday         4   Small         No   14400.0
3 2025-01-01  Wednesday        28   Large        Yes  159600.0
4 2025-01-01  Wednesday        19  Medium        Yes  189525.0
```

## Walkthrough

1. Load the orders and run the revenue line. Check one row by hand: line 0 is 14 × ₦18,600 with no discount = ₦260,400.
2. Run `orders.dtypes` before and after `pd.to_datetime` to see `order_date` change from `object` to `datetime64[ns]`.
3. Add the `year` column and run the Example's three totals.
4. Compare like with like: `h1 = orders[orders["order_date"].dt.month <= 6]`, then `h1.groupby("year")["revenue"].sum()`. (You'll learn `groupby` properly in lesson 7.)
5. Add `size`, `discounted` and `weekday` as in the Example.
6. Count lines per size band with `orders["size"].value_counts()`.
7. Try a deliberate mistake: `orders["order_date"].dt.year` on a fresh copy of the file, before converting. The error, "Can only use .dt accessor with datetimelike values", means the column is still text.

## Practice

```answer
{
  "id": "pyan-05-p1",
  "prompt": "What was Kolanut's revenue in **Q1 2026** (January to March)?",
  "answer": 143209130,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT SUM(quantity * unit_price * (1 - discount_pct / 100.0)) FROM orders WHERE order_date BETWEEN '2026-01-01' AND '2026-03-31'",
  "pyVerify": "orders.loc[(orders['order_date'] >= '2026-01-01') & (orders['order_date'] < '2026-04-01'), 'revenue'].sum()",
  "hint": "Filter with two date conditions, then sum the revenue column.",
  "required": true
}
```

```answer
{
  "id": "pyan-05-p2",
  "prompt": "How many order lines fall in the **Large** size band (20 to 30 cartons)?",
  "answer": 1032,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM orders WHERE quantity >= 20",
  "pyVerify": "(orders['size'] == 'Large').sum()",
  "hint": "orders[\"size\"].value_counts()",
  "required": true
}
```

```answer
{
  "id": "pyan-05-p3",
  "prompt": "On which **weekday** did Kolanut take the most revenue across the whole period?",
  "answer": "Friday",
  "format": "text",
  "dataset": "sales",
  "files": [
    "orders"
  ],
  "verify": "SELECT CASE strftime('%w', order_date) WHEN '0' THEN 'Sunday' WHEN '1' THEN 'Monday' WHEN '2' THEN 'Tuesday' WHEN '3' THEN 'Wednesday' WHEN '4' THEN 'Thursday' WHEN '5' THEN 'Friday' ELSE 'Saturday' END FROM orders GROUP BY strftime('%w', order_date) ORDER BY SUM(quantity * unit_price * (1 - discount_pct / 100.0)) DESC LIMIT 1",
  "pyVerify": "orders.groupby('weekday')['revenue'].sum().idxmax()",
  "hint": "orders.groupby(\"weekday\")[\"revenue\"].sum().sort_values()",
  "required": true
}
```

## Challenge

```answer
{
  "id": "pyan-05-c1",
  "prompt": "What did discounts cost Kolanut in **2026** (January to June)? That's gross value (quantity × unit_price) minus revenue.",
  "answer": 10301145,
  "format": "naira",
  "dataset": "sales",
  "files": [
    "orders"
  ],
  "verify": "SELECT SUM(quantity * unit_price * discount_pct / 100.0) FROM orders WHERE order_date >= '2026-01-01'",
  "pyVerify": "(orders['quantity'] * orders['unit_price'] - orders['revenue'])[orders['year'] == 2026].sum()",
  "hint": "Add a gross column, then (gross − revenue) for the 2026 rows.",
  "required": false
}
```

## More practice

Optional drills on the legal dataset: Ashgrove Chambers' invoices. Load them with `invoices = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/legal/invoices.csv")`.

```answer
{
  "id": "pyan-05-d1",
  "prompt": "Convert `issued_date` and `paid_date` to dates and add `days_to_pay` = paid_date − issued_date, in days (use `.dt.days`). What is the **average** days_to_pay for paid invoices, to one decimal place?",
  "answer": 45.4,
  "format": "number",
  "dataset": "legal",
  "files": [
    "invoices"
  ],
  "verify": "SELECT ROUND(AVG(julianday(paid_date) - julianday(issued_date)), 1) FROM invoices WHERE status = 'Paid'",
  "pyVerify": "(lambda i: round((pd.to_datetime(i['paid_date']) - pd.to_datetime(i['issued_date'])).dt.days.mean(), 1))(pd.read_csv('https://academy.cloudtechanalytics.com/datasets/legal/invoices.csv'))",
  "hint": "Subtracting two date columns gives durations; .dt.days turns them into numbers. Unpaid invoices have no paid_date, so their days_to_pay is empty and mean() skips them.",
  "required": false
}
```

```answer
{
  "id": "pyan-05-d2",
  "prompt": "In which **month name** were the most invoices issued, across all years?",
  "answer": "May",
  "format": "text",
  "dataset": "legal",
  "files": [
    "invoices"
  ],
  "verify": "SELECT CASE strftime('%m', issued_date) WHEN '01' THEN 'January' WHEN '02' THEN 'February' WHEN '03' THEN 'March' WHEN '04' THEN 'April' WHEN '05' THEN 'May' WHEN '06' THEN 'June' WHEN '07' THEN 'July' WHEN '08' THEN 'August' WHEN '09' THEN 'September' WHEN '10' THEN 'October' WHEN '11' THEN 'November' ELSE 'December' END FROM invoices GROUP BY strftime('%m', issued_date) ORDER BY COUNT(*) DESC LIMIT 1",
  "pyVerify": "(lambda i: pd.to_datetime(i['issued_date']).dt.month_name().value_counts().index[0])(pd.read_csv('https://academy.cloudtechanalytics.com/datasets/legal/invoices.csv'))",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why is orders[\"quantity\"] * orders[\"unit_price\"] better than a for loop over the rows?",
    "options": ["It isn't; loops are clearer", "It works on the whole column at once: shorter and much faster", "Loops can't multiply", "It skips the first row"],
    "answer": 1,
    "explanation": "Vectorised column arithmetic is the normal way to calculate in pandas."
  },
  {
    "prompt": "orders[\"order_date\"].dt.month fails with \"Can only use .dt accessor with datetimelike values\". What's wrong?",
    "options": ["The column has no months", "The dates are still text; convert them with pd.to_datetime first", "dt only works on numbers", "You need numpy"],
    "answer": 1,
    "explanation": ".dt needs real dates."
  },
  {
    "prompt": "A file has dates like 03/04/2026 meaning 3 April. What do you need?",
    "options": ["pd.to_datetime(col)", "pd.to_datetime(col, dayfirst=True)", "col.astype(int)", "Nothing; pandas always guesses right"],
    "answer": 1,
    "explanation": "Without dayfirst=True, 03/04/2026 can be read as 4 March. Always spot-check converted dates."
  },
  {
    "prompt": "Revenue for 2026 is about half of 2025's. Before reporting a fall, what should you check?",
    "options": ["Nothing, it's a fall", "Whether both periods cover the same number of months", "Whether pandas is up to date", "The font in the report"],
    "answer": 1,
    "explanation": "The data runs to June 2026. Compare H1 with H1."
  }
]
```
