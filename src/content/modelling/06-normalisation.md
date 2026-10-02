---
title: Normalisation
minutes: 15
summary: Remove repetition step by step - first, second and third normal form - so every fact is stored exactly once.
---

## The problem

Kolanut's old invoice sheet had one row per product sold, with the customer's name and city and the product's category typed on every row. Peace Provisions' city appeared on every line of every invoice. When they moved, some rows were updated and others weren't. That's an **update anomaly**, and a flat sheet makes it almost inevitable.

## The concept

**Normalisation** reorganises tables so each fact lives in exactly one place. It prevents three problems:

| Anomaly | What goes wrong | Kolanut example |
| :-- | :-- | :-- |
| **Update** | A fact changed in some rows but not others | Half the rows say Kano, half say Abuja |
| **Insert** | You can't record something until something else exists | A new product can't be added until someone buys it |
| **Delete** | Removing one row erases an unrelated fact | Deleting the only invoice for a product loses its category |

It's done in steps called **normal forms**:

1. **First normal form (1NF):** one value per cell, no repeating groups (no `product1`, `product2`, `product3` columns), and a key for every row.
2. **Second normal form (2NF):** 1NF, and every non-key column depends on the **whole** key. In a line table keyed by `(invoice_id, product_id)`, `invoice_date` depends only on `invoice_id`, so it moves to an invoices table.
3. **Third normal form (3NF):** 2NF, and no non-key column depends on **another non-key column**. `customer_city` depends on `customer`, not on the invoice, so it moves to a customers table.

A memory aid: every non-key column should depend on **the key, the whole key, and nothing but the key**.

![Before: a flat invoice sheet with repeated customer, city, product and category values shaded. After: customers, invoices, invoice_lines and products tables joined by keys.](/images/courses/modelling/normalisation.svg "The same data, before and after normalising to third normal form.")

**What stays on the line?** `unit_price` stays on `invoice_lines` even though products have a list price. The price *charged* is a fact about that sale (discounts, the January 2026 price rise), not about the product. Deciding which facts belong to which entity is the judgement at the heart of normalisation.

## Example

Kolanut's `customers.csv` stores the sales rep's name on every customer row. Should reps be their own table?

```dataset
{ "dataset": "sales", "files": ["customers"] }
```

There are only a few reps, each named on many customers. If a rep's surname changed, it would need updating on every one of their customers. In a fully normalised operational database, `sales_reps(rep_id, rep_name, region)` becomes its own table and customers keep a `rep_id`.

For **analysis**, though, a rep name on the customer table is often fine, as the next lesson explains.

## Walkthrough

Normalising a flat sheet, in order:

1. **Find the grain and key** of the flat sheet: here `(invoice, product)`.
2. **Split out repeating facts about the first key part**: invoice date and customer → `invoices`.
3. **Split out facts that depend on a non-key column**: customer city → `customers`; product category → `products`.
4. **Keep facts about the combination** on the line table: quantity, price charged.
5. **Add foreign keys** so the tables join back together.
6. **Test:** can you rebuild the original sheet with joins? You should get exactly the same rows.

## Practice

```answer
{
  "id": "dmo-06-p1",
  "prompt": "In the flat sheet in the diagram, how many times is Peace Provisions' city (Kano) stored? And after normalising? Give the **first** number.",
  "answer": 3,
  "format": "number",
  "tolerance": 0,
  "explanation": "Three times in the flat sheet (invoices 501, 501 and 503), once after normalising, in the customers table.",
  "required": true,
  "hint": "Count the rows for Peace Provisions in the flat sheet: each one repeats the city."
}
```

```answer
{
  "id": "dmo-06-p2",
  "prompt": "How many different sales reps appear in Kolanut's `customers.csv`? That's how many rows a `sales_reps` table would have.",
  "answer": 6,
  "format": "number",
  "dataset": "sales",
  "files": ["customers"],
  "verify": "SELECT COUNT(DISTINCT sales_rep) FROM customers",
  "hint": "Count the distinct values in the sales_rep column: remove duplicates or use UNIQUE / COUNTUNIQUE.",
  "required": true
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "dmo-06-d1",
  "prompt": "Lawyer names are typed out on every row of the legal `matters.csv`. If you normalised them into a `lawyers` table, how many rows would it have?",
  "answer": 8,
  "format": "number",
  "dataset": "legal",
  "files": [
    "matters"
  ],
  "verify": "SELECT COUNT(DISTINCT responsible_lawyer) FROM matters",
  "hint": "Count the different values in responsible_lawyer.",
  "required": false
}
```

```answer
{
  "id": "dmo-06-d2",
  "prompt": "Court names repeat in `hearings.csv`. How many rows would a `courts` table have?",
  "answer": 5,
  "format": "number",
  "dataset": "legal",
  "files": [
    "hearings"
  ],
  "verify": "SELECT COUNT(DISTINCT court) FROM hearings",
  "hint": "Count the different values in court.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A table has columns phone1, phone2, phone3. Which normal form does it break?",
    "options": ["First (repeating group)", "Second", "Third", "None"],
    "answer": 0,
    "explanation": "Repeating groups break 1NF. Use a phones table with one row per phone number."
  },
  {
    "prompt": "In invoice_lines keyed by (invoice_id, product_id), where should invoice_date go?",
    "options": ["Stay on invoice_lines", "Move to invoices, because it depends only on invoice_id", "Move to products", "Delete it"],
    "answer": 1,
    "explanation": "It depends on part of the key, which breaks 2NF."
  },
  {
    "prompt": "Why keep unit_price on invoice_lines when products has a list_price?",
    "options": ["It's a mistake", "The price charged on that sale can differ from the current list price", "To make the table bigger", "Because SQL requires it"],
    "answer": 1,
    "explanation": "It's a fact about the sale, not about the product."
  }
]
```
