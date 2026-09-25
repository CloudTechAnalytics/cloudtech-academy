---
title: Data relationships
minutes: 30
summary: Connect tables with one-to-many relationships so filters flow from customers and products to orders.
---

## The problem

You put `region` from the customers table and `revenue` from orders into a bar chart, and every bar shows ₦830.5 million. Power BI doesn't know which orders belong to which region. The tables need a **relationship**.

## The concept

A **relationship** links two tables through a column they share, usually an ID.

- **Cardinality.** Almost always **one-to-many** (shown as `1` and `*`): one customer, many orders. The "one" side must have unique values; `customers[customer_id]` does.
- **Cross-filter direction.** The arrow on the line shows which way filters flow. **Single** (from the one side to the many side) is the default and the right choice almost always: choosing a region filters the customers, which filters their orders.
- **Active vs inactive.** Only one active path can exist between two tables; others show as dashed lines and are used only when a DAX formula asks for them.

**Star schema.** The standard design, which the next lesson explores further:

```
            customers
                │ 1
                │
products ─1───* orders *───1─ Date
```

- **Fact table** in the middle: events with numbers (orders).
- **Dimension tables** around it: the things you filter and group by (customers, products, dates).

Filters flow from dimensions into the fact table. Put fields from **dimensions** on axes and slicers, and numbers from the **fact** table in values.

## Example

Here is Kolanut's model in **Model view**, with the relationships Power BI detected when the tables were loaded:

![Model view in Power BI Desktop showing the products, orders and customers tables, with a one-to-many line from products to orders and another from customers to orders.](/images/courses/powerbi/model-view.webp "Kolanut's model: products (1), orders (2) and customers (3), with two one-to-many relationships (4, 5). Model view is the third icon on the left (6).")

Read each line: the **1** sits beside the table where each ID appears once (`products`, `customers`); the **\*** (many) sits beside `orders`. The small arrow on the line shows the filter direction: from the one side into orders.

With the relationship `customers[customer_id] (1) → orders[customer_id] (*)`:

| region | revenue |
| :-- | --: |
| Lagos | ₦411.2m |
| South West | ₦131.5m |
| North West | ₦81.6m |
| North Central | ₦77.5m |
| South South | ₦68.4m |
| South East | ₦60.3m |

Without it, every row shows ₦830.5m.

## Walkthrough

1. Go to **Model view**. Power BI may already have created relationships: it auto-detects matching column names on load. Check them rather than trusting them.
2. If `customers` and `orders` aren't connected, drag `customer_id` from `customers` onto `customer_id` in `orders`.
3. Double-click the line to open **Edit relationship**. Check: Cardinality **Many to one (\*:1)** from orders to customers; Cross filter direction **Single**; **Make this relationship active** ticked.
4. Do the same for `products[product_id]` → `orders[product_id]`.
5. If you merged `category` into orders in lesson 4, delete that column now (in Power Query, delete the merge steps) and use `products[category]` instead.
6. Back in Report view, build a table visual with `customers[region]` and `orders[revenue]`. Each region should show a different number.

> [!TIP]
> Hide the ID columns on the "many" side (right-click `orders[customer_id]` → **Hide in report view**). Report builders should use `customers[customer_name]` or `customers[region]`, never the foreign key, which only confuses.

## Practice

```answer
{
  "id": "pbi-06-p1",
  "prompt": "With the relationships in place, what is total revenue from **South East** customers, to the nearest naira?",
  "answer": 60316685,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.region = 'South East'",
  "hint": "Table visual: customers[region] and orders[revenue]. If every row shows the same number, the relationship is missing.",
  "required": true
}
```

```answer
{
  "id": "pbi-06-p2",
  "prompt": "In the relationship between `products` and `orders`, which table is on the **one** side?",
  "answer": "products",
  "accept": ["product", "the products table"],
  "format": "text",
  "explanation": "Each product appears once in products and many times in orders.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which column should you use on the axis of a 'revenue by region' chart?",
    "options": ["orders[customer_id]", "customers[region]", "orders[revenue]", "products[category]"],
    "answer": 1,
    "explanation": "Group by fields from the dimension table; the relationship carries the filter to orders."
  },
  {
    "prompt": "What does a Single cross-filter direction from customers to orders mean?",
    "options": ["Orders can filter customers only", "Selecting customers filters their orders", "No filtering happens", "Both directions, always"],
    "answer": 1,
    "explanation": "Filters flow from the one side (customers) to the many side (orders)."
  },
  {
    "prompt": "In a star schema, what sits at the centre?",
    "options": ["A dimension table like customers", "The fact table with the events and numbers, like orders", "The date table", "A measure"],
    "answer": 1,
    "explanation": "The fact table is surrounded by the dimensions that describe it."
  }
]
```
