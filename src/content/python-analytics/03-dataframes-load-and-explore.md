---
title: "DataFrames: load and explore"
minutes: 30
summary: Load CSV files into pandas DataFrames, check their size, columns and types, select columns, and get a first feel for the data with describe, value_counts and nunique.
---

## The problem

The sales director has sent Bisi three files from Kolanut's system: `orders.csv`, `customers.csv` and `products.csv`, and asked "what's in here?" before anyone builds a report on them.

That question comes first on every analysis. How many rows? Which columns, and what type is each? Are there gaps? What are typical values, and are there any odd ones? Ten minutes of exploring now saves you from a wrong answer later. In pandas, each of those questions is one short line of code.

## The concept

**pandas and the DataFrame**

**pandas** is the Python library for tables. Its main object is the **DataFrame**: rows and named columns, like a sheet in Excel. Each column is a **Series**, one column of values that all share a type. Everyone imports pandas with the short name `pd`:

```python
import pandas as pd
```

**Loading a CSV**

`pd.read_csv()` reads a file from a web address or from your computer:

```python
base = "https://academy.cloudtechanalytics.com/datasets/sales/"
orders = pd.read_csv(base + "orders.csv")
customers = pd.read_csv(base + "customers.csv")
products = pd.read_csv(base + "products.csv")
```

> [!TIP]
> To use a file from your own computer in Colab, click the folder icon on the left, upload the file, then `pd.read_csv("orders.csv")`. Uploaded files disappear when the session ends; for work you keep, put files in Google Drive.

**The first questions, in code**

| Question | Code | Gives you |
| :-- | :-- | :-- |
| What does it look like? | `orders.head()` / `orders.tail(3)` | The first 5 / last 3 rows |
| How big is it? | `orders.shape` | `(rows, columns)` |
| What columns? | `orders.columns` | The column names |
| What types, any gaps? | `orders.info()` | Each column's type and non-empty count |
| Typical values? | `orders.describe()` | Count, mean, min, quartiles and max of number columns |
| How often does each value appear? | `orders["discount_pct"].value_counts()` | Each value and its count |
| How many different values? | `orders["customer_id"].nunique()` | One number |

**Selecting columns**

- One column, as a Series: `orders["quantity"]`.
- Several columns, as a DataFrame: `orders[["order_date", "quantity"]]`. Note the **double** brackets: the inner pair is a list of names.

Series have their own methods: `.sum()`, `.mean()`, `.min()`, `.max()`, `.median()`, `.count()`.

**Types in pandas**

`info()` shows types with pandas names: `int64` (whole numbers), `float64` (decimals), `object` (usually text), `datetime64` (dates), `bool`. A date column that shows as `object` is being treated as text: it'll sort, but you can't take the month out of it or do date maths. You'll fix that in lesson 5.

## Example

Load the three files and look at the orders:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/sales/"
orders = pd.read_csv(base + "orders.csv")
customers = pd.read_csv(base + "customers.csv")
products = pd.read_csv(base + "products.csv")

print(orders.shape)
orders.head()
```

```text
(4266, 7)
   order_id  order_date  customer_id  product_id  quantity  unit_price  discount_pct
0     10001  2025-01-01           27           3        14       18600             0
1     10002  2025-01-01           56           1         7       13200             0
2     10003  2025-01-01           37           2         4        3600             0
3     10004  2025-01-01           26           7        28        6000             5
4     10005  2025-01-01           27           8        19       10500             5
```

Each row is one **order line**: one product on one order. The numbers on the left (0, 1, 2…) are the **index**, pandas' row labels.

```python
orders.info()
```

`info()` reports 4,266 non-null values in every column, so nothing is missing, and shows `order_date` as `object`: text, for now.

```python
orders.describe().round(1)
```

From `describe()`: quantities run from 1 to 30 cartons with an average of 13.8, unit prices from ₦3,600 to ₦24,600, and discounts are 0, 5 or 10%.

## Walkthrough

1. Open a new Colab notebook and run the Example's first cell to load the three files.
2. Run `customers.head()` and `products` (a table this small you can just display). Note how they link to orders: `customer_id` and `product_id`.
3. Check the sizes: `customers.shape` is (90, 8) and `products.shape` is (16, 4).
4. Run `orders["discount_pct"].value_counts()`: 2,519 lines had no discount, 1,222 had 5% and 525 had 10%.
5. Add `normalize=True` to get shares instead: `orders["discount_pct"].value_counts(normalize=True)`. About 59% of lines had no discount.
6. How many different customers ordered? `orders["customer_id"].nunique()` gives 90: every customer has at least one order.
7. Select two columns with double brackets, `orders[["order_date", "quantity"]].head()`, and compare it with the single-bracket `orders["quantity"].head()`. One is a table, the other a single column.
8. Add a text cell summarising the dataset in three sentences: what one row is, the date range, and anything you'd want to check.

> [!NOTE]
> `value_counts()` sorts by count, highest first. To sort by the values instead, add `.sort_index()`.

## Practice

```dataset
{"dataset": "sales", "files": ["orders", "customers", "products"], "note": "You can load these straight from the web addresses in the lesson; download them only if you want to look at them in Excel too."}
```

```answer
{
  "id": "pyan-03-p1",
  "prompt": "Which **product_id** appears in the most order lines?",
  "answer": 2,
  "format": "number",
  "dataset": "sales",
  "files": [
    "orders"
  ],
  "verify": "SELECT product_id FROM orders GROUP BY product_id ORDER BY COUNT(*) DESC LIMIT 1",
  "hint": "orders[\"product_id\"].value_counts().head()",
  "explanation": "Product 2 (bottled water) is on 323 lines, just ahead of product 4 on 322. It's the most frequent product, though not the biggest earner: it's also the cheapest.",
  "pyVerify": "orders['product_id'].value_counts().index[0]",
  "required": true
}
```

```answer
{
  "id": "pyan-03-p2",
  "prompt": "How many customers in `customers.csv` are in the **Wholesale** channel?",
  "answer": 21,
  "format": "number",
  "dataset": "sales",
  "files": [
    "customers"
  ],
  "verify": "SELECT COUNT(*) FROM customers WHERE channel = 'Wholesale'",
  "hint": "customers[\"channel\"].value_counts()",
  "pyVerify": "(customers['channel'] == 'Wholesale').sum()",
  "required": true
}
```

```answer
{
  "id": "pyan-03-p3",
  "prompt": "What is the **median** credit_limit of Kolanut's customers, in naira?",
  "answer": 1050000,
  "format": "naira",
  "dataset": "sales",
  "files": [
    "customers"
  ],
  "verify": "SELECT AVG(credit_limit) FROM (SELECT credit_limit FROM customers ORDER BY credit_limit LIMIT 2 OFFSET 44)",
  "hint": "customers[\"credit_limit\"].median()",
  "explanation": "With 90 customers the median is the average of the 45th and 46th values in order. The mean is higher, because a few wholesalers have very large limits: when values are skewed like this, the median is the better 'typical' figure.",
  "pyVerify": "customers['credit_limit'].median()",
  "required": true
}
```

## Challenge

```answer
{
  "id": "pyan-03-c1",
  "prompt": "How many **different sales reps** look after Kolanut's customers?",
  "answer": 6,
  "format": "number",
  "dataset": "sales",
  "files": [
    "customers"
  ],
  "verify": "SELECT COUNT(DISTINCT sales_rep) FROM customers",
  "hint": "nunique() on the sales_rep column.",
  "pyVerify": "customers['sales_rep'].nunique()",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "orders.shape returns (4266, 7). What does that mean?",
    "options": ["4,266 columns and 7 rows", "4,266 rows and 7 columns", "4,266 customers in 7 regions", "The file is 4,266 KB"],
    "answer": 1,
    "explanation": "shape is always (rows, columns)."
  },
  {
    "prompt": "Why does orders[[\"order_date\", \"quantity\"]] need two pairs of square brackets?",
    "options": ["It's a typing mistake that pandas forgives", "The inner brackets are a list of column names", "Two brackets make it faster", "It selects rows, not columns"],
    "answer": 1,
    "explanation": "You pass a list of names to select several columns, and lists are written in square brackets."
  },
  {
    "prompt": "info() shows order_date as object. What does that tell you?",
    "options": ["The dates are missing", "The dates are stored as text and need converting before date calculations", "The column is a number", "The file is broken"],
    "answer": 1,
    "explanation": "object usually means text. pd.to_datetime turns it into real dates (lesson 5)."
  },
  {
    "prompt": "Which line counts how many different customers placed orders?",
    "options": ["orders[\"customer_id\"].count()", "orders[\"customer_id\"].nunique()", "len(orders)", "orders[\"customer_id\"].sum()"],
    "answer": 1,
    "explanation": "count() counts non-empty values (4,266 here); nunique() counts distinct ones."
  }
]
```
