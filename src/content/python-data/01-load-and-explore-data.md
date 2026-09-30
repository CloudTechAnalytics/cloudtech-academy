---
title: Load and Explore Data
minutes: 25
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

1. Load the orders data and check the shape is (4266, 7).
2. Use `describe()` to find the largest single quantity ordered.
3. Use `value_counts()` on `product_id` to find the product that appears in the most order lines.
4. Write two sentences in a text cell describing the dataset in your own words.
