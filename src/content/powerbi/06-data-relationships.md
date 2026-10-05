---
title: Data relationships
minutes: 15
summary: Connect tables with one-to-many relationships: cardinality, filter direction, active and inactive relationships, and the star schema of facts and dimensions.
---

## The problem

You put `region` from the customers table and `revenue` from orders into a bar chart, and every bar shows ₦830.5 million. Power BI doesn't know which orders belong to which region. The tables need a **relationship**.

## The concept

A **relationship** links two tables through a column they share, usually an ID. Once it exists, a filter on one table reaches the other: choose `Lagos` in `customers`, and Power BI counts only Lagos customers' orders. Without it, the two tables don't know about each other.

### The parts of a relationship

Double-click a relationship line in Model view and the **Edit relationship** dialog shows four settings:

| Setting | Means | For Kolanut |
| :-- | :-- | :-- |
| **Tables and columns** | Which column in each table holds the matching value | `orders[customer_id]` and `customers[customer_id]` |
| **Cardinality** | How many rows on each side can match | Many to one (\*:1): many orders, one customer |
| **Cross-filter direction** | Which way filters flow | Single: from customers to orders |
| **Active** | Whether Power BI uses it automatically | Yes |

### Cardinality

| Cardinality | Means | When |
| :-- | :-- | :-- |
| **One-to-many** (1:\*) | Each value appears once on one side, many times on the other | Almost always: one customer, many orders |
| **One-to-one** (1:1) | Each value appears once on both sides | Rare; usually a sign the two tables should be one |
| **Many-to-many** (\*:\*) | Values repeat on both sides | Avoid while learning; results are easy to misread |

The "one" side must have **unique** values. `customers[customer_id]` does: 90 rows, 90 IDs. If Power BI offers only many-to-many when you expected one-to-many, there's a duplicate ID on the side that should be "one". Find it before going further; it's a data problem, not a setting to change.

### Cross-filter direction

The small arrow in the middle of the line shows which way filters travel.

- **Single** (the default): from the one side to the many side. Picking a region filters customers, which filters their orders. This is right almost every time.
- **Both**: filters travel both ways, so picking a product would also filter the customers list down to those who bought it. Occasionally useful, but with several tables it can make filters take unexpected paths and slow the report. Use it only when you know exactly why.

### Active and inactive relationships

Only one **active** path can exist between two tables. A second relationship between the same tables is created as **inactive** and drawn as a dashed line. It does nothing unless a DAX formula switches it on with `USERELATIONSHIP` (for example, an orders table with both an order date and a delivery date, each related to the same date table).

### The star schema

![The orders fact table in the middle, with customers above it, products to the left and Date to the right. Each dimension has a one-to-many relationship into orders, with arrows showing filters flowing into orders.](/images/courses/powerbi/star-schema.svg "Kolanut's model as a star schema. Filters flow from the dimensions into the fact table.")

The standard design for Power BI models is the **star schema**:

| Table type | Holds | Kolanut | Use its fields for |
| :-- | :-- | :-- | :-- |
| **Fact table** | Events, with the numbers you add up | `orders`: 4,266 order lines | Measures in **Values** |
| **Dimension tables** | The things you describe, filter and group by | `customers`, `products`, and `Date` (next lesson) | **Axes, rows, legends and slicers** |

Each dimension relates **one-to-many** into the fact, so the diagram looks like a star. Two rules follow:

1. **Group by dimension fields**: use `customers[region]`, not a region column copied into orders.
2. **Measure fact fields**: revenue and quantity come from `orders`.

Why does Power BI work best this way? Filters always flow one clear way, from small dimension tables into the big fact table. Each fact lives once, and the model stays easy to understand when it grows.

### What happens without a relationship

If `customers` and `orders` aren't related and you put `customers[region]` next to `orders[revenue]`, every region shows the **same** number: the grand total, ₦830.5m. Power BI can't tell which orders belong to which region, so it doesn't filter at all. Identical numbers on every row are the classic sign of a missing or broken relationship.

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

The relationship to `products` works the same way. Put `products[category]` and `customers[region]` in the same matrix, and each cell is filtered by **both** dimensions at once: Lagos and Beverages together come to ₦116,162,310. That's the star schema at work: any combination of dimensions, with no extra formulas.

## Walkthrough

1. Go to **Model view**. Power BI may already have created relationships: it auto-detects matching column names on load. Check them rather than trusting them.
2. If `customers` and `orders` aren't connected, drag `customer_id` from `customers` onto `customer_id` in `orders`.
3. Double-click the line to open **Edit relationship**. Check: Cardinality **Many to one (\*:1)** from orders to customers; Cross filter direction **Single**; **Make this relationship active** ticked.
4. Do the same for `products[product_id]` → `orders[product_id]`.
5. If you merged `category` into orders in lesson 4, delete that column now (in Power Query, delete the merge steps) and use `products[category]` instead.
6. Back in Report view, build a table visual with `customers[region]` and `orders[revenue]`. Each region should show a different number, and the total should be ₦830,541,245.
7. **Test the other relationship**: a table with `products[category]` and `orders[revenue]`. Again, different numbers on each row, the same total.

> [!TIP]
> Hide the ID columns on the "many" side (right-click `orders[customer_id]` → **Hide in report view**). Report builders should use `customers[customer_name]` or `customers[region]`, never the foreign key, which only confuses.

### Summary

| Term | Meaning |
| :-- | :-- |
| Relationship | A link between two tables through a shared column |
| One-to-many (1:\*) | The normal case: unique on one side, repeated on the other |
| Single direction | Filters flow from the one side to the many side |
| Inactive relationship | A dashed line, used only when DAX asks for it |
| Star schema | One fact table in the middle, dimensions around it |
| Same number on every row | Missing or broken relationship |

## Practice

```answer
{
  "id": "pbi-06-p1",
  "prompt": "With the relationships in place, what is total revenue from **South East** customers? (A rounded figure is fine.)",
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
  "required": true,
  "hint": "Which table lists each product only once?"
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "pbi-06-d1",
  "prompt": "With customers related to orders, what is total revenue from **Kiosk** customers?",
  "answer": 39888675,
  "format": "naira",
  "dataset": "sales",
  "files": [
    "orders",
    "customers"
  ],
  "verify": "SELECT SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.channel = 'Kiosk'",
  "hint": "Use channel from the customers table in a slicer or table, with the revenue measure.",
  "required": false
}
```

```answer
{
  "id": "pbi-06-d2",
  "prompt": "Load the legal dataset and relate clients → matters → invoices. What is the total invoiced to **Company** clients?",
  "answer": 678380000,
  "format": "naira",
  "dataset": "legal",
  "files": [
    "clients",
    "matters",
    "invoices"
  ],
  "verify": "SELECT SUM(i.amount_ngn) FROM invoices i JOIN matters m ON m.matter_id = i.matter_id JOIN clients c ON c.client_id = m.client_id WHERE c.client_type = 'Company'",
  "hint": "Two one-to-many relationships: clients[client_id] → matters[client_id], matters[matter_id] → invoices[matter_id].",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which column should you use on the axis of a 'revenue by region' chart?",
    "options": [
      "orders[customer_id]",
      "customers[region]",
      "orders[revenue]",
      "products[category]"
    ],
    "answer": 1,
    "explanation": "Group by fields from the dimension table; the relationship carries the filter to orders."
  },
  {
    "prompt": "A relationship filters from customers to orders. What happens when you pick a region in a slicer?",
    "options": ["Only that region's customers' orders are shown", "Nothing changes", "The slicer is deleted", "All regions are shown"],
    "answer": 0,
    "explanation": "The filter flows from customers (the one side) to their orders (the many side)."
  },
  {
    "prompt": "In a star schema, what sits at the centre?",
    "options": ["A dimension table like customers", "The fact table with the events and numbers, like orders", "The date table", "A measure"],
    "answer": 1,
    "explanation": "The fact table is surrounded by the dimensions that describe it."
  }
]
```
