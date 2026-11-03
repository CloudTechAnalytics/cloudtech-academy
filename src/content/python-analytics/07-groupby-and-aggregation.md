---
title: groupby and aggregation
minutes: 30
summary: Summarise data by group with groupby: totals, averages and counts per product, month or department, several measures at once with named aggregation, and each group's share of the total.
---

## The problem

Kolanut's managing director asks the questions every manager asks:

> "Which products bring in the most money? How did each month go? And in HR: which departments are we losing people from, and what do we pay at each level?"

Every one of those is **split, apply, combine**: split the rows into groups (by product, month or department), apply a calculation to each group (sum, average, count), and combine the results into one small table. In Excel that's a pivot table. In pandas it's `groupby`, and it's the single most useful tool in this course.

## The concept

### The pattern

```python
orders.groupby("product_id")["revenue"].sum()
```

```text
product_id
1     59804940.0
2     15375160.0
3     74837880.0
4     74594380.0
5     34168995.0
6     32751300.0
7     21029160.0
8     37727020.0
9     78372810.0
10    43396020.0
11    70241610.0
12    52758600.0
13    71586900.0
14    63334275.0
15    44217180.0
16    56345015.0
Name: revenue, dtype: float64
```

Read it left to right: take `orders`, **group by** `product_id`, take the `revenue` column, and **sum** it within each group. The result is a Series with one row per product.

Common calculations: `.sum()`, `.mean()`, `.median()`, `.min()`, `.max()`, `.count()` (non-empty values), `.nunique()` (distinct values) and `.size()` (rows per group, including blanks).

### Sorting and the top N

Add `.sort_values(ascending=False)` to rank the groups, and `.head(5)` for the top five. `.idxmax()` gives the label of the largest group directly.

### Several measures at once: named aggregation

```python
orders.groupby("product_id").agg(
    revenue=("revenue", "sum"),
    lines=("order_id", "count"),
    avg_quantity=("quantity", "mean"),
)
```

```text
revenue  lines  avg_quantity
product_id
1           59804940.0    308     14.538961
2           15375160.0    323     13.120743
3           74837880.0    282     14.326241
4           74594380.0    322     13.723602
5           34168995.0    269     14.111524
6           32751300.0    283     13.837456
7           21029160.0    246     14.256098
8           37727020.0    269     13.308550
9           78372810.0    258     14.244186
10          43396020.0    226     13.491150
11          70241610.0    272     13.580882
12          52758600.0    250     13.596000
13          71586900.0    237     13.333333
14          63334275.0    253     13.237154
15          44217180.0    224     13.745536
16          56345015.0    244     13.844262
```

Each line is `new_name=(column, calculation)`. You get a tidy table with exactly the columns you named.

### Grouping by more than one column

`orders.groupby(["year", "discount_pct"])["revenue"].sum()` gives one row per combination. Add `.unstack()` to turn the second level into columns, which reads like a pivot table.

### Back to an ordinary table: `reset_index()`

The group labels become the result's **index**. `.reset_index()` turns them back into a normal column, which you'll want before merging, charting or saving.

### Shares of a total

Divide each group by the total: `by_product / by_product.sum()`. To put each row's group total back on every row, use `transform`:

```python
orders["product_total"] = orders.groupby("product_id")["revenue"].transform("sum")
orders[["product_id", "revenue", "product_total"]].head(3)
```

```text
product_id   revenue  product_total
0           3  260400.0     74837880.0
1           1   92400.0     59804940.0
2           2   14400.0     15375160.0
```

That's useful for "what share of its product's revenue is this line?"

> [!NOTE]
> `count()` and `size()` differ only when there are blanks: `count()` skips them, `size()` doesn't. When counting rows, `size()` is the safer habit.

## Example

Set up revenue and dates as in lesson 5, then rank products and look at the months:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/sales/"
orders = pd.read_csv(base + "orders.csv")
products = pd.read_csv(base + "products.csv")
orders["revenue"] = orders["quantity"] * orders["unit_price"] * (1 - orders["discount_pct"] / 100)
orders["order_date"] = pd.to_datetime(orders["order_date"])
orders["month"] = orders["order_date"].dt.to_period("M")

by_product = orders.groupby("product_id").agg(
    revenue=("revenue", "sum"),
    lines=("order_id", "count"),
    avg_quantity=("quantity", "mean"),
).sort_values("revenue", ascending=False)
by_product.head().round(1)
```

```text
revenue  lines  avg_quantity
product_id
9           78372810.0    258          14.2
3           74837880.0    282          14.3
4           74594380.0    322          13.7
13          71586900.0    237          13.3
11          70241610.0    272          13.6
```

Product IDs aren't very readable. A dictionary of names, used with `.map()` (a lookup, like lesson 2's dictionaries), fixes that:

```python
names = dict(zip(products["product_id"], products["product_name"]))
by_product.index = by_product.index.map(names)
by_product.head(3)
```

Now the monthly picture:

```python
monthly = orders.groupby("month")["revenue"].sum()
print(f"Best month: {monthly.idxmax()} (₦{monthly.max():,.0f})")
print(f"Worst month: {monthly.idxmin()} (₦{monthly.min():,.0f})")
```

```text
Best month: 2025-12 (₦66,284,310)
Worst month: 2025-02 (₦36,138,690)
```

December is Kolanut's peak: festive stock-up by its retail customers.

## Walkthrough

1. Run the Example's set-up cell and the product ranking. Detergent (product 9) leads, though bottled water (product 2) appears on the most lines: frequent isn't the same as valuable.
2. Run the `names` cell and look at `by_product.head(3)` again with product names.
3. Shares: `share = by_product["revenue"] / by_product["revenue"].sum()` and `share.head(3)`. The top three products bring in about 27% of revenue.
4. Group by two columns: `orders.groupby([orders["order_date"].dt.year, "discount_pct"])["revenue"].sum().unstack()`. Read across a row: one year's revenue split by discount level.
5. Switch to the HR data:

```python
employees = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/hr/employees.csv")
by_dept = employees.groupby("department").agg(
    staff=("employee_id", "size"),
    resigned=("status", lambda s: (s == "Resigned").sum()),
    avg_salary=("monthly_salary", "mean"),
)
by_dept["resign_rate"] = by_dept["resigned"] / by_dept["staff"]
by_dept.sort_values("resign_rate", ascending=False).round(2)
```

6. The `lambda` is a small function written in place: for each department's `status` values, it counts how many are `"Resigned"`. Use it when the calculation you need isn't one of the built-in names.
7. Add `.reset_index()` to `by_dept` and see `department` become an ordinary column again.

> [!BUSINESS]
> A resignation **rate** beats a resignation **count**. A big department will always lose more people; the rate says whether it's losing a bigger **share** of them.

## Practice

```answer
{
  "id": "pyan-07-p1",
  "prompt": "Which **month** had Kolanut's highest number of **order lines** (not revenue)? Answer as YYYY-MM, for example 2025-03.",
  "answer": "2025-12",
  "format": "text",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT strftime('%Y-%m', order_date) FROM orders GROUP BY 1 ORDER BY COUNT(*) DESC LIMIT 1",
  "pyVerify": "str(orders.groupby('month').size().idxmax())",
  "hint": "orders.groupby(\"month\").size().idxmax()",
  "required": true
}
```

```answer
{
  "id": "pyan-07-p2",
  "prompt": "Which **customer_id** brought in the most revenue across the whole period?",
  "answer": 26,
  "format": "number",
  "dataset": "sales",
  "files": [
    "orders"
  ],
  "verify": "SELECT customer_id FROM orders GROUP BY customer_id ORDER BY SUM(quantity * unit_price * (1 - discount_pct / 100.0)) DESC LIMIT 1",
  "pyVerify": "orders.groupby('customer_id')['revenue'].sum().idxmax()",
  "hint": "Group by customer_id, sum revenue, idxmax().",
  "required": true
}
```

```answer
{
  "id": "pyan-07-p3",
  "prompt": "In the HR data, which **department** has the highest **resignation rate** (resigned ÷ all staff)?",
  "answer": "Customer Service",
  "format": "text",
  "dataset": "hr",
  "files": ["employees"],
  "verify": "SELECT department FROM employees GROUP BY department ORDER BY 1.0 * SUM(status = 'Resigned') / COUNT(*) DESC LIMIT 1",
  "pyVerify": "by_dept['resign_rate'].idxmax()",
  "hint": "Build by_dept as in the Walkthrough, then idxmax() on resign_rate.",
  "explanation": "Customer Service has lost 3 of its 8 people. Operations lost more people in total (5), but from a much bigger team.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "pyan-07-c1",
  "prompt": "What is the **average monthly salary** of **Senior** staff in the **IT** department? Group by two columns. Round to the nearest naira.",
  "answer": 916667,
  "format": "naira",
  "dataset": "hr",
  "files": [
    "employees"
  ],
  "verify": "SELECT ROUND(AVG(monthly_salary)) FROM employees WHERE department = 'IT' AND job_level = 'Senior'",
  "pyVerify": "round(employees.groupby(['department', 'job_level'])['monthly_salary'].mean().loc[('IT', 'Senior')])",
  "hint": "employees.groupby([\"department\", \"job_level\"])[\"monthly_salary\"].mean(), then .loc[(\"IT\", \"Senior\")].",
  "required": false
}
```

## More practice

Optional drills on the legal dataset. Load `matters.csv` and `invoices.csv` from `https://academy.cloudtechanalytics.com/datasets/legal/`.

```answer
{
  "id": "pyan-07-d1",
  "prompt": "Which **responsible_lawyer** handles the most matters?",
  "answer": "Zainab Abdullahi",
  "format": "text",
  "dataset": "legal",
  "files": ["matters"],
  "verify": "SELECT responsible_lawyer FROM matters GROUP BY responsible_lawyer ORDER BY COUNT(*) DESC LIMIT 1",
  "pyVerify": "pd.read_csv('https://academy.cloudtechanalytics.com/datasets/legal/matters.csv').groupby('responsible_lawyer').size().idxmax()",
  "required": false
}
```

```answer
{
  "id": "pyan-07-d2",
  "prompt": "Group the invoices by **status**. What is the **average** invoice amount for **Overdue** invoices? Round to the nearest naira.",
  "answer": 2686714,
  "format": "naira",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT ROUND(AVG(amount_ngn)) FROM invoices WHERE status = 'Overdue'",
  "pyVerify": "round(pd.read_csv('https://academy.cloudtechanalytics.com/datasets/legal/invoices.csv').groupby('status')['amount_ngn'].mean()['Overdue'])",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does orders.groupby(\"customer_id\")[\"revenue\"].sum() return?",
    "options": ["Total revenue as one number", "One row per customer with that customer's total revenue", "The customers sorted by revenue", "The first order of each customer"],
    "answer": 1,
    "explanation": "groupby splits by customer and sums each group. Sort it yourself if you need a ranking."
  },
  {
    "prompt": "You want revenue, number of lines and average quantity per product in one table. What should you use?",
    "options": ["Three separate groupby calls added together", "groupby(...).agg(revenue=(\"revenue\", \"sum\"), lines=(\"order_id\", \"count\"), avg_quantity=(\"quantity\", \"mean\"))", "orders.describe()", "orders.value_counts()"],
    "answer": 1,
    "explanation": "Named aggregation gives several measures with the names you choose."
  },
  {
    "prompt": "Operations lost 5 people and Customer Service lost 3. Which department has the bigger attrition problem?",
    "options": ["Operations, because 5 is more than 3", "You can't say without the team sizes: compare rates, not counts", "Customer Service, because it's smaller", "Neither"],
    "answer": 1,
    "explanation": "Rates make groups of different sizes comparable."
  },
  {
    "prompt": "What does reset_index() do after a groupby?",
    "options": ["Deletes the groups", "Turns the group labels from the index back into an ordinary column", "Sorts the result", "Undoes the groupby"],
    "answer": 1,
    "explanation": "Handy before merging, charting or saving the result."
  }
]
```
