---
title: Modelling in practice
minutes: 15
summary: A repeatable process for designing a model, turning it into tables, and testing it with real queries before anyone builds a report on it.
---

## The problem

You've learned the pieces: entities, keys, relationships, normalisation, stars. At work, the job arrives as a sentence: *"Can we get a dashboard of our law firm's workload and billing?"* This lesson puts the pieces in order, from that sentence to a model you can trust.

## The concept

![Five steps: questions, entities, attributes and keys, relationships, test.](/images/courses/modelling/design-steps.svg "The design process. Steps 2 to 4 are what you've practised; steps 1 and 5 are what separate a good model from a pretty diagram.")

1. **List the questions** the model must answer. Write them down with the people who'll ask them.
2. **Identify the entities** from the nouns in those questions.
3. **Define attributes and keys**, with data types and grain.
4. **Connect the relationships** with cardinality, and resolve many-to-manys.
5. **Test** by loading real data and running the questions as queries.

**Documentation that matters:** one line per table stating its grain, the key, where the data comes from, and any rule (such as "region is type 2").

## Example

Turning a model into tables. This creates a tiny version of Kolanut's product and category tables in the practice database, loads three rows, and joins them. It uses temporary tables, which disappear when you reset the database:

```sql run
CREATE TEMP TABLE IF NOT EXISTS categories (
  category_id   INTEGER PRIMARY KEY,
  category_name TEXT NOT NULL UNIQUE
);
CREATE TEMP TABLE IF NOT EXISTS products (
  product_id   INTEGER PRIMARY KEY,
  product_name TEXT NOT NULL,
  category_id  INTEGER NOT NULL REFERENCES categories (category_id),
  list_price   INTEGER CHECK (list_price > 0)
);
INSERT OR IGNORE INTO categories VALUES (1, 'Beverages'), (2, 'Snacks');
INSERT OR IGNORE INTO products VALUES
  (1, 'Malt drink 330ml (24)', 1, 14800),
  (2, 'Bottled water 75cl (12)', 1, 4000),
  (7, 'Cabin biscuits (24)', 2, 6600);
SELECT p.product_name, c.category_name, p.list_price
FROM products AS p
JOIN categories AS c ON c.category_id = p.category_id;
```

Each line of the model became a rule the database enforces: `PRIMARY KEY` (unique, present), `NOT NULL` (mandatory), `REFERENCES` (a foreign key), `CHECK` (a business rule), `UNIQUE` (no duplicate category names).

## Walkthrough

**Step 5, testing, on Harbourline.** Before trusting a model, run these checks. You've met each one in this course:

| Check | Query pattern | Expect |
| :-- | :-- | :-- |
| Keys are unique | `COUNT(*)` vs `COUNT(DISTINCT key)` | Equal |
| Keys are present | `WHERE key IS NULL` | No rows |
| No orphans | LEFT JOIN child to parent, parent key IS NULL | No rows |
| Optional relationships are really optional | Count children with no parent, or parents with no children | Explainable numbers |
| Totals reconcile | Total in the model = total in the source | Equal |
| The questions run | Each question from step 1 as a query | Sensible answers |

A model that passes these is ready for a dashboard. A model that doesn't will produce a dashboard nobody trusts.

## Practice

```exercise
{
  "id": "dmo-09-p1",
  "prompt": "Totals reconcile? Return, in one row, the **total freight charged** on Delivered shipments and the **total amount paid** across all payments, as two columns. (They won't match exactly: some shipments are unpaid or part-paid, and seeing by how much is the point.)",
  "starter": "SELECT\n  (SELECT SUM(freight_charge) FROM shipments WHERE status = 'Delivered') AS charged,\n  ",
  "solution": "SELECT (SELECT SUM(freight_charge) FROM shipments WHERE status = 'Delivered') AS charged, (SELECT SUM(amount) FROM payments) AS paid;",
  "hint": "Two scalar subqueries side by side in one SELECT.",
  "required": true
}
```

```exercise
{
  "id": "dmo-09-p2",
  "prompt": "Keys are unique? For `shipments`, return the row count and the number of distinct shipment IDs as two columns.",
  "starter": "",
  "solution": "SELECT COUNT(*), COUNT(DISTINCT shipment_id) FROM shipments;",
  "hint": "COUNT(*) and COUNT(DISTINCT shipment_id).",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is the first step in designing a model?",
    "options": ["Drawing the boxes", "Listing the questions it must answer", "Choosing colours", "Writing CREATE TABLE statements"],
    "answer": 1,
    "explanation": "Questions decide which entities, attributes and grain you need."
  },
  {
    "prompt": "Which constraint enforces a foreign key?",
    "options": ["CHECK", "UNIQUE", "REFERENCES", "DEFAULT"],
    "answer": 2,
    "explanation": "REFERENCES other_table(column) makes the database reject orphans."
  },
  {
    "prompt": "Why test a model with real queries before building a dashboard?",
    "options": ["It's faster to build dashboards first", "Key, orphan and reconciliation problems show up as wrong numbers later, when they're far harder to trace", "Dashboards can't use models", "Queries fix the data automatically"],
    "answer": 1,
    "explanation": "Checks at the model stage are cheap; wrong dashboards are expensive."
  }
]
```

When you've finished, take the final assessment, then start the final project from the course page.
