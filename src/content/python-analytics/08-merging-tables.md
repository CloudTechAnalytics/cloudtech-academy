---
title: Merging tables
minutes: 30
summary: Combine tables on a shared key with merge, choose between inner and left joins, catch row explosions with validate, find records with no match, and stack tables with concat.
---

## The problem

Kolanut's orders only hold IDs. The sales director's questions are about **names**:

> "Revenue by region and by sales rep, please. And which product categories sell best through supermarkets?"

Region, rep and channel live in `customers.csv`; category lives in `products.csv`. To answer, Bisi has to bring those columns onto each order line by matching IDs: `customer_id` to `customer_id`, `product_id` to `product_id`. That's a **merge** (a join, in SQL). It's also the step where analyses most often go quietly wrong, so this lesson is as much about checking a merge as doing one.

## The concept

### `merge`: match rows on a key

```python
orders_full = orders.merge(customers, on="customer_id", how="left")
orders_full.shape
```

```text
(4266, 15)
```

- `on` is the column both tables share. If the names differ, use `left_on="cust_id", right_on="customer_id"`.
- `how` decides which rows survive:

| `how=` | Keeps | Use when |
| :-- | :-- | :-- |
| `"inner"` (default) | Only rows with a match in both tables | You only want matched records |
| `"left"` | Every row of the left table; blanks (NaN) where there's no match | Adding details to a fact table like orders |
| `"right"` | Every row of the right table | Rare; swap the tables and use left |
| `"outer"` | Every row of both | Comparing two lists |

For "add customer details to every order", use `how="left"`: an order should never disappear just because its customer is missing from the lookup table. You want to **see** that problem as a blank, not lose the order silently.

### Check the row count, every time

A left merge onto a lookup table should leave the number of rows **unchanged**. If `orders` has 4,266 rows and `orders_full` has more, the lookup table has duplicate keys, and every duplicated customer's orders are now counted twice. Your revenue total will be wrong with no error message.

`validate` makes pandas check for you:

```python
orders.merge(customers, on="customer_id", how="left", validate="many_to_one")
```

```text
order_id  order_date  customer_id  product_id  quantity  unit_price  discount_pct   revenue              customer_name      channel       region      city      sales_rep joined_date  credit_limit
0        10001  2025-01-01           27           3        14       18600             0  260400.0      Alhaji Musa Wholesale    Wholesale        Lagos      Yaba   Tolu Adeyemi  2023-06-10       3100000
1        10002  2025-01-01           56           1         7       13200             0   92400.0          Yakubu Superstore  Supermarket        Lagos   Ikorodu  Chidi Okonkwo  2022-12-31        850000
2        10003  2025-01-01           37           2         4        3600             0   14400.0  Hajia Amina Mini Mart Uyo        Kiosk  South South       Uyo     Ebi Tamuno  2024-11-23        500000
3        10004  2025-01-01           26           7        28        6000             5  159600.0          Chuks Trading Co.    Wholesale   South West  Abeokuta    Funke Alabi  2024-10-30       4250000
4        10005  2025-01-01           27           8        19       10500             5  189525.0      Alhaji Musa Wholesale    Wholesale        Lagos      Yaba   Tolu Adeyemi  2023-06-10       3100000
...        ...         ...          ...         ...       ...         ...           ...       ...                        ...          ...          ...       ...            ...         ...           ...
4261     14262  2026-06-30           68           7        18        6600             5  112860.0   Divine Trading Co. Ikeja    Wholesale        Lagos     Ikeja  Chidi Okonkwo  2023-04-20       3400000
4262     14263  2026-06-30           47           7        22        6600             0  145200.0              Ada Wholesale    Wholesale   South East     Nnewi     Ikenna Obi  2022-04-07       4950000
4263     14264  2026-06-30           35          14        17       20700             5  334305.0          Divine Superstore  Supermarket        Lagos   Ikorodu   Tolu Adeyemi  2024-09-05       1150000
4264     14265  2026-06-30           84          16        17       18100             0  307700.0         Olumide Superstore  Supermarket        Lagos     Lekki  Chidi Okonkwo  2025-04-12       1950000
4265     14266  2026-06-30           52          11        12       20700             5  235980.0       Madam Titi Wholesale    Wholesale        Lagos     Ikeja  Chidi Okonkwo  2023-05-14       3450000

[4266 rows x 15 columns]
```

"Many orders to one customer". If a customer_id appears twice in `customers`, pandas stops with a `MergeError` instead of doubling your numbers.

### Finding records with no match

`indicator=True` adds a `_merge` column saying where each row came from: `both`, `left_only` or `right_only`.

```python
check = customers.merge(orders[["customer_id"]].drop_duplicates(), on="customer_id", how="left", indicator=True)
no_orders = check[check["_merge"] == "left_only"]
len(no_orders)
```

```text
0
```

That's the pandas version of SQL's `LEFT JOIN … WHERE … IS NULL`: customers who never ordered.

### Stacking tables: `concat`

Merging adds **columns** by matching keys. Stacking adds **rows**: for example monthly files with the same columns.

```python norun
all_months = pd.concat([jan, feb, mar], ignore_index=True)
```

## Example

Bring customer and product details onto every order, with checks:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/sales/"
orders = pd.read_csv(base + "orders.csv")
customers = pd.read_csv(base + "customers.csv")
products = pd.read_csv(base + "products.csv")
orders["revenue"] = orders["quantity"] * orders["unit_price"] * (1 - orders["discount_pct"] / 100)

full = (
    orders
    .merge(customers, on="customer_id", how="left", validate="many_to_one")
    .merge(products, on="product_id", how="left", validate="many_to_one")
)

print(len(orders), len(full))
print(full[["region", "category"]].isna().sum().sum(), "missing lookups")
full.groupby("region")["revenue"].sum().sort_values(ascending=False)
```

```text
4266 4266
0 missing lookups
region
Lagos            411162300.0
South West       131536985.0
North West        81581325.0
North Central     77540720.0
South South       68403230.0
South East        60316685.0
Name: revenue, dtype: float64
```

Same number of rows before and after, no blanks from the lookups: the merge is safe to use. Lagos brings in about half of all revenue.

> [!TIP]
> Writing a chain of steps inside brackets, one per line, keeps long pandas code readable. Python lets you break the line anywhere inside brackets.

## Walkthrough

1. Run the Example and check both numbers it prints before looking at the result.
2. See what goes wrong without checks. Make a customers table with one customer duplicated: `dup = pd.concat([customers, customers.head(1)])`.
3. Merge it: `len(orders.merge(dup, on="customer_id", how="left"))`. It's more than 4,266: customer 1's orders are now in the table twice.
4. Add `validate="many_to_one"` to the same merge and run it again: pandas refuses with a `MergeError`. That error just saved a report.
5. Two-level summary: `full.groupby(["channel", "category"])["revenue"].sum().unstack().round(-6)` answers the director's third question.
6. Rank the reps: `full.groupby("sales_rep")["revenue"].sum().sort_values(ascending=False)`.
7. Find matters with no hearings in the legal data:

```python
legal = "https://academy.cloudtechanalytics.com/datasets/legal/"
matters = pd.read_csv(legal + "matters.csv")
hearings = pd.read_csv(legal + "hearings.csv")

check = matters.merge(hearings[["matter_id"]].drop_duplicates(), on="matter_id", how="left", indicator=True)
no_hearings = check[check["_merge"] == "left_only"]
len(no_hearings)
```

```text
55
```

## Practice

```answer
{
  "id": "pyan-08-p1",
  "prompt": "Which **sales rep** is responsible for the most revenue across the whole period?",
  "answer": "Chidi Okonkwo",
  "format": "text",
  "dataset": "sales",
  "files": [
    "orders",
    "customers"
  ],
  "verify": "SELECT c.sales_rep FROM orders o JOIN customers c ON c.customer_id = o.customer_id GROUP BY c.sales_rep ORDER BY SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) DESC LIMIT 1",
  "pyVerify": "full.groupby('sales_rep')['revenue'].sum().idxmax()",
  "hint": "Merge customers onto orders, then group by sales_rep.",
  "required": true
}
```

```answer
{
  "id": "pyan-08-p2",
  "prompt": "What was **Snacks** revenue from **Supermarket** customers?",
  "answer": 30415520,
  "format": "naira",
  "dataset": "sales",
  "files": [
    "orders",
    "customers",
    "products"
  ],
  "verify": "SELECT SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) FROM orders o JOIN customers c ON c.customer_id = o.customer_id JOIN products p ON p.product_id = o.product_id WHERE c.channel = 'Supermarket' AND p.category = 'Snacks'",
  "pyVerify": "full.loc[(full['channel'] == 'Supermarket') & (full['category'] == 'Snacks'), 'revenue'].sum()",
  "hint": "Merge both lookup tables, filter on channel and category, sum revenue.",
  "required": true
}
```

```answer
{
  "id": "pyan-08-p3",
  "prompt": "In the legal data, how many **clients** have at least one matter with an **Overdue** invoice? (Merge invoices with matters to get each invoice's client_id.)",
  "answer": 32,
  "format": "number",
  "dataset": "legal",
  "files": [
    "invoices",
    "matters"
  ],
  "verify": "SELECT COUNT(DISTINCT m.client_id) FROM invoices i JOIN matters m ON m.matter_id = i.matter_id WHERE i.status = 'Overdue'",
  "pyVerify": "pd.read_csv('https://academy.cloudtechanalytics.com/datasets/legal/invoices.csv').merge(matters, on='matter_id', validate='many_to_one').query('status_x == \"Overdue\"')['client_id'].nunique()",
  "hint": "Both tables have a status column. After the merge pandas names them status_x (invoices) and status_y (matters); add suffixes=(\"_invoice\", \"_matter\") to choose clearer names.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "pyan-08-c1",
  "prompt": "Which **client_type** (Company or Individual) has the larger total of **Overdue** invoices, in naira? Merge invoices → matters → clients.",
  "answer": "Company",
  "format": "text",
  "dataset": "legal",
  "files": ["invoices", "matters", "clients"],
  "verify": "SELECT c.client_type FROM invoices i JOIN matters m ON m.matter_id = i.matter_id JOIN clients c ON c.client_id = m.client_id WHERE i.status = 'Overdue' GROUP BY c.client_type ORDER BY SUM(i.amount_ngn) DESC LIMIT 1",
  "pyVerify": "pd.read_csv('https://academy.cloudtechanalytics.com/datasets/legal/invoices.csv').merge(matters, on='matter_id', suffixes=('_invoice', '_matter')).merge(pd.read_csv('https://academy.cloudtechanalytics.com/datasets/legal/clients.csv'), on='client_id').query('status_invoice == \"Overdue\"').groupby('client_type')['amount_ngn'].sum().idxmax()",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "You merge customers onto 4,266 orders and get 4,301 rows. What's the most likely cause?",
    "options": ["pandas added a header row", "Some customer_ids appear more than once in customers, so those orders were duplicated", "Some orders have no customer", "The merge was inner"],
    "answer": 1,
    "explanation": "Duplicate keys in a lookup table multiply rows. validate=\"many_to_one\" catches it."
  },
  {
    "prompt": "Why use how=\"left\" when adding customer details to orders?",
    "options": ["It's faster", "Every order is kept, and a missing customer shows up as a blank you can see", "It removes duplicates", "It sorts the result"],
    "answer": 1,
    "explanation": "An inner merge would silently drop orders whose customer is missing."
  },
  {
    "prompt": "How do you find customers who have never ordered?",
    "options": ["customers.merge(orders, how=\"inner\")", "A left merge from customers with indicator=True, keeping rows where _merge is left_only", "orders.dropna()", "customers.drop_duplicates()"],
    "answer": 1,
    "explanation": "left_only means the customer had no match in orders."
  },
  {
    "prompt": "You have twelve monthly files with the same columns. Which combines them into one table?",
    "options": ["merge", "pd.concat", "groupby", "pivot_table"],
    "answer": 1,
    "explanation": "concat stacks rows; merge matches on keys."
  }
]
```
