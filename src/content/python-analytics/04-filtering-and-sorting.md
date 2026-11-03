---
title: Filtering and sorting rows
minutes: 30
summary: Keep only the rows you need with boolean conditions, combine conditions with & and |, use isin, between and text matching, and sort or pick the top rows.
---

## The problem

The finance manager has three quick requests for Bisi:

> "Which order lines had a 10% discount and more than 25 cartons? Show me our Lagos supermarkets. And what were the five biggest order lines in June 2026?"

Each one means **keeping only the rows that meet a condition**, and sometimes putting them in order. In Excel you'd click through filter menus and start again for the next question. In pandas each request is one line you can re-run, change and keep.

## The concept

### A condition gives a True/False for every row

```python
orders["discount_pct"] == 10
```

```text
0       False
1       False
2       False
3       False
4       False
        ...
4261    False
4262    False
4263    False
4264    False
4265    False
Name: discount_pct, Length: 4266, dtype: bool
```

That doesn't filter anything yet: it returns a Series of 4,266 `True`/`False` values, one per row. It's called a **boolean mask**. Put the mask inside square brackets and pandas keeps the `True` rows:

```python
big_discounts = orders[orders["discount_pct"] == 10]
len(big_discounts)
```

```text
525
```

### Combining conditions

| Meaning | pandas | Note |
| :-- | :-- | :-- |
| and | `&` | both must be true |
| or | `\|` | either can be true |
| not | `~` | flips True and False |

Each condition needs its **own brackets**, because `&` and `|` are worked out before `==` and `>`:

```python
orders[(orders["discount_pct"] == 10) & (orders["quantity"] > 25)]
```

```text
order_id  order_date  customer_id  product_id  quantity  unit_price  discount_pct
88       10089  2025-01-14           57           2        28        3600            10
96       10097  2025-01-15           55          15        27       14400            10
119      10120  2025-01-18           55           3        26       18600            10
152      10153  2025-01-23           62           9        29       21600            10
154      10155  2025-01-24           27           1        26       13200            10
...        ...         ...          ...         ...       ...         ...           ...
4087     14088  2026-06-06           32           9        30       23300            10
4132     14133  2026-06-13           27           4        30       18800            10
4152     14153  2026-06-16           52           6        27        9200            10
4171     14172  2026-06-18           32          10        26       15600            10
4255     14256  2026-06-29           32          15        26       15600            10

[95 rows x 7 columns]
```

Without the inner brackets you get a confusing error about "truth value of a Series is ambiguous". When you see it, check your brackets.

> [!WARNING]
> Python's words `and` and `or` don't work on whole columns. Use `&` and `|` with pandas.

### Shortcuts for common conditions

- One of several values: `customers["region"].isin(["Lagos", "South West"])`
- A range, ends included: `orders["quantity"].between(10, 20)`
- Text: `customers["customer_name"].str.contains("Wholesale")`, `.str.startswith("Ada")`. Add `case=False` to ignore capitals.
- Missing values: `.isna()` and `.notna()`.

Dates stored as text in `YYYY-MM-DD` form compare correctly as text, so `orders["order_date"] >= "2026-06-01"` works even before you convert dates (lesson 5).

### Choosing rows and columns together: `.loc`

`orders.loc[mask, ["order_id", "quantity"]]` keeps the rows where the mask is True and only the columns you list. It's the clearest way to say "these rows, these columns", and the safe way to change values in a filtered part of a table.

### Sorting

- `orders.sort_values("quantity", ascending=False)`: largest first.
- Several columns: `sort_values(["region", "credit_limit"], ascending=[True, False])`.
- `orders.nlargest(5, "quantity")` and `nsmallest` are shortcuts for "sort and take the top 5".

### Counting what's left

`len(df)` is the number of rows. Because `True` counts as 1, `mask.sum()` counts the matching rows without making a new table.

## Example

Request 1: 10% discount and more than 25 cartons.

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/sales/"
orders = pd.read_csv(base + "orders.csv")
customers = pd.read_csv(base + "customers.csv")

big_discounts = orders[(orders["discount_pct"] == 10) & (orders["quantity"] > 25)]
len(big_discounts)
```

```text
95
```

Request 2: Lagos supermarkets, only the useful columns, biggest credit limits first.

```python
lagos_supermarkets = customers.loc[
    (customers["region"] == "Lagos") & (customers["channel"] == "Supermarket"),
    ["customer_name", "city", "credit_limit"],
].sort_values("credit_limit", ascending=False)
lagos_supermarkets.head()
```

```text
customer_name    city  credit_limit
38           Ada Supermarket   Ikeja       2000000
83        Olumide Superstore   Lekki       1950000
86  Yakubu Superstore Festac  Festac       1550000
22         Emeka Supermarket   Ikeja       1450000
68          Mama Nkechi Mart  Festac       1250000
```

Request 3: the five biggest order lines in June 2026, by quantity.

```python
june_2026 = orders[orders["order_date"].between("2026-06-01", "2026-06-30")]
june_2026.nlargest(5, "quantity")
```

## Walkthrough

1. Load `orders` and `customers` as in the Example.
2. Run `orders["discount_pct"] == 10` on its own and look at the result: a column of True and False. Then run `(orders["discount_pct"] == 10).sum()` to count the 10% lines (525).
3. Run the Request 1 filter, then remove the inner brackets and run it again to see the "ambiguous" error. Put them back.
4. Count lines that were **not** discounted: `(~(orders["discount_pct"] > 0)).sum()`. `~` flips the condition. (`orders["discount_pct"] == 0` gives the same answer more simply.)
5. Use `isin`: `customers[customers["region"].isin(["North West", "North Central"])]` lists the northern customers.
6. Search text: `customers[customers["customer_name"].str.contains("wholesale", case=False)]`.
7. Run Request 3 and check the dates in the result are all in June 2026.

> [!TIP]
> Build a long filter one condition at a time. Run the first, check the row count, add the next. If the count drops to 0, the last condition you added is the problem.

## Practice

```answer
{
  "id": "pyan-04-p1",
  "prompt": "How many order lines in **2026** had **20 or more** cartons?",
  "answer": 340,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM orders WHERE order_date >= '2026-01-01' AND quantity >= 20",
  "pyVerify": "len(orders[(orders['order_date'] >= '2026-01-01') & (orders['quantity'] >= 20)])",
  "hint": "Two conditions, each in its own brackets, joined with &.",
  "required": true
}
```

```answer
{
  "id": "pyan-04-p2",
  "prompt": "How many customers are in the **North West** or **North Central** regions with a credit limit of **at least ₦1,000,000**?",
  "answer": 11,
  "format": "number",
  "dataset": "sales",
  "files": ["customers"],
  "verify": "SELECT COUNT(*) FROM customers WHERE region IN ('North West', 'North Central') AND credit_limit >= 1000000",
  "pyVerify": "len(customers[customers['region'].isin(['North West', 'North Central']) & (customers['credit_limit'] >= 1000000)])",
  "hint": "customers['region'].isin([...]) & (customers['credit_limit'] >= 1000000)",
  "required": true
}
```

```answer
{
  "id": "pyan-04-p3",
  "prompt": "Which customer (customer_name) has the **highest credit limit** in the **South East** region?",
  "answer": "Ada Wholesale",
  "format": "text",
  "dataset": "sales",
  "files": ["customers"],
  "verify": "SELECT customer_name FROM customers WHERE region = 'South East' ORDER BY credit_limit DESC LIMIT 1",
  "pyVerify": "customers[customers['region'] == 'South East'].nlargest(1, 'credit_limit')['customer_name'].iloc[0]",
  "hint": "Filter to South East, then nlargest(1, 'credit_limit').",
  "required": true
}
```

## Challenge

```answer
{
  "id": "pyan-04-c1",
  "prompt": "In the HR dataset's `employees.csv`, how many employees **resigned** (status Resigned) **within two years** of being hired? Compare exit_date with hire_date: an exit_date before the hire_date's second anniversary counts. *Hint: dates as text can't be added to, so convert both with pd.to_datetime and add pd.DateOffset(years=2).*",
  "answer": 9,
  "format": "number",
  "dataset": "hr",
  "files": ["employees"],
  "verify": "SELECT COUNT(*) FROM employees WHERE status = 'Resigned' AND exit_date < date(hire_date, '+2 years')",
  "pyVerify": "(lambda e: ((e['status'] == 'Resigned') & (pd.to_datetime(e['exit_date']) < pd.to_datetime(e['hire_date']) + pd.DateOffset(years=2))).sum())(pd.read_csv('https://academy.cloudtechanalytics.com/datasets/hr/employees.csv'))",
  "explanation": "9 of the 11 people who left did so within two years. That's a question about onboarding, not pay, and a good example of a filter turning into a finding.",
  "required": false
}
```

## More practice

Optional drills on a different dataset: the HR data. Load it with `employees = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/hr/employees.csv")`.

```answer
{
  "id": "pyan-04-d1",
  "prompt": "How many **Active** employees earn **more than ₦800,000** a month?",
  "answer": 22,
  "format": "number",
  "dataset": "hr",
  "files": ["employees"],
  "verify": "SELECT COUNT(*) FROM employees WHERE status = 'Active' AND monthly_salary > 800000",
  "pyVerify": "(lambda e: ((e['status'] == 'Active') & (e['monthly_salary'] > 800000)).sum())(pd.read_csv('https://academy.cloudtechanalytics.com/datasets/hr/employees.csv'))",
  "required": false
}
```

```answer
{
  "id": "pyan-04-d2",
  "prompt": "Who was the **most recent** person hired into the **Finance** department? Give their full_name.",
  "answer": "Sade Bello",
  "format": "text",
  "dataset": "hr",
  "files": ["employees"],
  "verify": "SELECT full_name FROM employees WHERE department = 'Finance' ORDER BY hire_date DESC LIMIT 1",
  "pyVerify": "(lambda e: e[e['department'] == 'Finance'].sort_values('hire_date', ascending=False)['full_name'].iloc[0])(pd.read_csv('https://academy.cloudtechanalytics.com/datasets/hr/employees.csv'))",
  "hint": "Filter to Finance, sort by hire_date descending, take the first full_name.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does orders[\"quantity\"] > 25 return on its own?",
    "options": ["The rows with more than 25 cartons", "A True/False value for every row", "The number 25", "An error"],
    "answer": 1,
    "explanation": "A condition gives a boolean mask. Putting it inside orders[...] is what filters."
  },
  {
    "prompt": "Which filter keeps lines with a discount AND more than 25 cartons?",
    "options": ["orders[orders[\"discount_pct\"] > 0 and orders[\"quantity\"] > 25]", "orders[(orders[\"discount_pct\"] > 0) & (orders[\"quantity\"] > 25)]", "orders[orders[\"discount_pct\"] > 0 & orders[\"quantity\"] > 25]", "orders[(orders[\"discount_pct\"] > 0) | (orders[\"quantity\"] > 25)]"],
    "answer": 1,
    "explanation": "Use & for 'and', with each condition in its own brackets. | would mean 'or'."
  },
  {
    "prompt": "What is the quickest way to count the rows that match a condition?",
    "options": ["mask.sum()", "mask.count()", "len(mask)", "mask.max()"],
    "answer": 0,
    "explanation": "True counts as 1, so sum() counts the matches. count() and len() count every row."
  },
  {
    "prompt": "You want the 3 customers with the highest credit limits. Which is simplest?",
    "options": ["customers.head(3)", "customers.nlargest(3, \"credit_limit\")", "customers.sort_values(\"credit_limit\").head(3)", "customers[\"credit_limit\"].max()"],
    "answer": 1,
    "explanation": "nlargest sorts and takes the top in one step. sort_values ascending would give the lowest three."
  }
]
```
