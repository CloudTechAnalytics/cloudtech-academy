---
title: Dimensional modelling
minutes: 15
summary: Model for analysis with facts and dimensions, choose the grain first, and build the star schema that Power BI works best with.
---

## The problem

A normalised database is ideal for *recording* business: each fact once, easy to update. But a report that asks *"revenue by region, category and month"* may need six or seven joins through it. Analytics models are shaped differently: around the **events you measure** and the **ways you slice them**. That's **dimensional modelling**.

## The concept

A dimensional model has two kinds of table:

| | Fact table | Dimension table |
| :-- | :-- | :-- |
| Holds | Events and their **numbers** | **Descriptions** used to filter and group |
| Examples | Order lines, payments, hearings, attendance | Date, customer, product, sales rep, court |
| Columns | Foreign keys + measures (quantity, revenue) | A key + text attributes (name, region, category) |
| Shape | Long and narrow: many rows | Short and wide: fewer rows, more columns |

Put together, the fact sits in the middle and the dimensions around it: a **star schema**.

![A star schema: fact_order_lines in the centre with date_key, customer_key, product_key and rep_key foreign keys plus quantity, unit_price, discount_pct and revenue; dim_date, dim_customer, dim_product and dim_sales_rep around it, each joined one-to-many to the fact.](/images/courses/modelling/star-schema.svg "Kolanut's sales as a star schema. The grain of the fact table is stated first.")

**Kimball's four steps** (from Ralph Kimball, who popularised the method):

1. **Choose the business process**: taking orders.
2. **Declare the grain**: one row per product on one order.
3. **Identify the dimensions**: when (date), who (customer, rep), what (product).
4. **Identify the facts**: quantity, price, discount, revenue.

**Grain first, always.** Every measure in the fact table must be true at that grain. `credit_limit` is a fact about a customer, not an order line; put it in the fact table and summing it across lines would multiply it.

### Kinds of fact

Not every number in a fact table can simply be added up. Check each one:

| Kind | Can be summed across | Kolanut example | Careful with |
| :-- | :-- | :-- | :-- |
| **Additive** | Every dimension | `quantity`, `revenue`: total by month, customer, product, anything | Nothing: these are the easy ones |
| **Semi-additive** | Some dimensions, not time | A stock level or account balance: add across warehouses, but not across days | Use the last value, or the average, over time |
| **Non-additive** | Nothing | `unit_price`, `discount_pct`, any ratio | Never sum; recalculate from additive parts (revenue ÷ packs) |

Summing `discount_pct` across Kolanut's lines gives a meaningless number. The average discount should be calculated from totals: (gross revenue − net revenue) ÷ gross revenue. Storing the additive parts (`quantity`, gross and net amounts) makes every ratio possible.

### Kinds of fact table

| Kind | One row per | Example | Use for |
| :-- | :-- | :-- | :-- |
| **Transaction** | Event, when it happens | Each order line; each payment | Most analysis: what happened, when, to whom |
| **Periodic snapshot** | Thing per period | Each product's stock at the end of each day | Levels over time: stock, balances, headcount |
| **Accumulating snapshot** | Process instance, updated as it moves | Each shipment, with booked, shipped and delivered dates | Process durations: days from booking to delivery |

Kolanut's `orders` is a transaction fact. Harbourline's `shipments` is close to an accumulating snapshot: one row per shipment, with dates filled in as the shipment moves.

### Dimension attributes

Good dimensions are **wide** and **descriptive**. Everything a report might filter or group by belongs there, in words people use:

| dim_customer column | Why |
| :-- | :-- |
| `customer_key` | The key the fact table uses |
| `customer_name`, `city`, `region` | Who and where |
| `channel` | Kiosk, Supermarket or Wholesale |
| `sales_rep` | Who looks after them |
| `joined_year`, `size_band` | Derived attributes, worked out once instead of in every report |

Prefer text over codes (`Wholesale`, not `W`), and fill gaps with a clear value (`Unknown`) rather than blanks, so filters show something sensible.

**Dimensions are allowed to repeat.** `dim_customer` can hold `region` and `sales_rep` as text, even though that repeats values a normalised database would split out. Analysts filter by them constantly; one join is worth the repetition.

## Example

You've already built one. In the Power BI course, Kolanut's model looks like this:

![Power BI Model view with products, orders and customers: orders in the middle, related one-to-many to products and customers.](/images/courses/powerbi/model-view.webp "Power BI's Model view of Kolanut's data: orders is the fact table (2) and products (1) and customers (3) are dimensions.")

`orders` is the fact table; `products` and `customers` are dimensions. Add a date table (as the Power BI course does) and you have a complete star.

## Walkthrough

Designing a star for Ashgrove Chambers' **billing**:

1. **Process:** issuing invoices.
2. **Grain:** one row per invoice.
3. **Dimensions:** date issued, client, matter (with practice area and responsible lawyer), status.
4. **Facts:** amount billed, days to pay (for paid invoices).
5. **Questions it answers:** billed per practice area per month; overdue amount per client; average days to pay by lawyer.

A second star for **court work** would have a different grain (one row per hearing), sharing the date, client and matter dimensions. Shared dimensions are called **conformed** dimensions: they let you compare billing and hearings side by side.

## Practice

```answer
{
  "id": "dmo-07-p1",
  "prompt": "For analysing Ashgrove Chambers' **billing**, which of its four tables (clients, matters, hearings, invoices) is the fact table?",
  "answer": "invoices",
  "accept": ["invoice", "the invoices table"],
  "format": "text",
  "explanation": "Invoices are the events with a number to add up (amount_ngn); clients and matters describe them.",
  "required": true,
  "hint": "The fact table holds the events with a number to add up. Which table has an amount in naira?"
}
```

```answer
{
  "id": "dmo-07-p2",
  "prompt": "How many rows would that billing fact table have? (Count the rows in `invoices.csv`.)",
  "answer": 410,
  "format": "number",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT COUNT(*) FROM invoices",
  "hint": "Grain: one row per invoice.",
  "required": true
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "dmo-07-d1",
  "prompt": "If `attendance.csv` were the fact table of an HR star schema, how many rows would the fact table have?",
  "answer": 1518,
  "format": "number",
  "dataset": "hr",
  "files": [
    "attendance"
  ],
  "verify": "SELECT COUNT(*) FROM attendance",
  "hint": "One fact row per row of the file.",
  "required": false
}
```

```answer
{
  "id": "dmo-07-d2",
  "prompt": "In a star schema for Kolanut's sales, does **region** belong in the fact table or in a dimension? Answer with the dimension's name (one word).",
  "answer": "customer",
  "format": "text",
  "accept": [
    "customers",
    "dim_customer",
    "customer dimension"
  ],
  "hint": "Region describes who bought, not the sale itself.",
  "explanation": "Region is an attribute of the customer, so it lives in the customer dimension.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which column belongs in a dimension table rather than a fact table?",
    "options": ["quantity", "revenue", "product category", "discount amount"],
    "answer": 2,
    "explanation": "Category describes the product; you filter and group by it rather than add it up."
  },
  {
    "prompt": "What should you decide first when designing a fact table?",
    "options": ["The colours of the report", "The grain", "The number of dimensions", "The database product"],
    "answer": 1,
    "explanation": "Every measure must be true at the grain, so it comes first."
  },
  {
    "prompt": "Billing and hearings fact tables both use the same client and matter tables. Why is sharing them useful?",
    "options": ["One filter, like a client, works across both fact tables", "It makes the tables bigger", "It hides the fact tables", "It removes the need for keys"],
    "answer": 0,
    "explanation": "Shared (conformed) dimensions let one slicer filter every fact table that uses them."
  }
]
```
