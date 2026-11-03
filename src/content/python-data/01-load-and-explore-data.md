---
title: Load and Explore Data
minutes: 15
summary: Load a real sales dataset into pandas in Google Colab and find out what's in it with head, shape, info and describe.
---

## Meet pandas

**pandas** is the Python library for working with tables of data, like Excel but with code. It's already installed in Google Colab. If you're new to Python, take **Python for Beginners** first.

You'll use a practice dataset from a fictional drinks and household goods distributor: every order line from January 2025 to June 2026.

## Load the data

Open a new notebook at **colab.research.google.com** and run:

```python
import pandas as pd

url = "https://academy.cloudtechanalytics.com/datasets/sales/orders.csv"
orders = pd.read_csv(url)
```

`orders` is now a **DataFrame**: a table with rows and named columns. `pd` is the usual short name for pandas.

![A small DataFrame with named columns, a row index and one type per column, and the six first-look commands: head, shape, info, describe, value_counts and nunique](/images/courses/python-data/dataframe.svg "A DataFrame is a table: named columns, a row index, one type per column.")

## Take a first look

Run each line in its own cell:

```python
orders.head()      # first 5 rows
orders.tail(3)     # last 3 rows
orders.shape       # (rows, columns)
orders.columns     # column names
```

You should see **4,266 rows** and **7 columns**:

| Column | Meaning |
| :-- | :-- |
| `order_id` | Unique ID for each order line |
| `order_date` | Date of the order |
| `customer_id` | Which customer (links to a customers table) |
| `product_id` | Which product (links to a products table) |
| `quantity` | Cartons ordered |
| `unit_price` | Price per carton in naira |
| `discount_pct` | Discount given: 0, 5 or 10 |

## Understand the columns

```python
orders.info()
```

`info()` shows each column's **type** and how many values are filled in. Here nothing is missing, but `order_date` is stored as text (`object`). You'll fix that in the next module.

```python
orders.describe()
```

`describe()` gives quick statistics for the number columns: count, mean, min, max and quartiles. For example, the average quantity is about **13.8** cartons and unit prices run from ₦3,600 to ₦24,600.

## Select columns and count values

```python
orders["quantity"]                 # one column
orders[["order_date", "quantity"]] # several columns (note the double brackets)
orders["discount_pct"].value_counts()
```

`value_counts()` shows how often each value appears: 2,519 lines had no discount, 1,222 had 5% and 525 had 10%.

> [!TIP]
> In Colab, the last line of a cell is displayed automatically, so you don't need `print()` to see a DataFrame.

## Try it

Load the orders in a Colab notebook and answer these with pandas.

```answer
{
  "id": "pyda-m01-a1",
  "prompt": "What is the **largest single quantity** ordered on one order line?",
  "answer": 30,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT MAX(quantity) FROM orders",
  "pyVerify": "orders['quantity'].max()",
  "hint": "orders[\"quantity\"].max(), or the max row of describe()",
  "required": true
}
```

```answer
{
  "id": "pyda-m01-a2",
  "prompt": "Which **product_id** appears in the most order lines?",
  "answer": 2,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT product_id FROM orders GROUP BY product_id ORDER BY COUNT(*) DESC LIMIT 1",
  "pyVerify": "orders['product_id'].value_counts().index[0]",
  "hint": "orders[\"product_id\"].value_counts().head()",
  "required": true
}
```

```answer
{
  "id": "pyda-m01-a3",
  "prompt": "How many **different customers** placed orders?",
  "answer": 90,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(DISTINCT customer_id) FROM orders",
  "pyVerify": "orders['customer_id'].nunique()",
  "hint": "orders[\"customer_id\"].nunique()",
  "required": true
}
```

Then write two sentences in a text cell describing the dataset in your own words: what one row is, and the period it covers.
