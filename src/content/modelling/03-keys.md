---
title: Keys
minutes: 25
summary: Primary keys, foreign keys, natural and surrogate keys, and composite keys - the columns that hold a model together.
---

## The problem

Two Kolanut customers are both called "Alhaji Musa Wholesale", one in Kano and one in Ikorodu. If orders recorded the customer's *name*, you couldn't tell whose order was whose. Every table needs a column (or set of columns) that identifies each row beyond doubt, and other tables need to point at it.

## The concept

**Primary key (PK):** the column that uniquely identifies each row.

- **Unique**: no two rows share a value.
- **Never empty**: every row has one.
- **Stable**: it doesn't change when the thing's details change.

**Foreign key (FK):** a column that holds another table's primary key, recording which row it relates to. `shipments.customer_id` is a foreign key to `customers.customer_id`.

This is how SQL Server shows them for Harbourline's `customers` table:

![SQL Server Object Explorer listing the columns of dbo.customers: customer_id marked PK, account_manager_id marked FK, and the other columns with their data types.](/images/courses/sql/ssms-object-explorer.webp "Harbourline in SQL Server: the key icon and PK mark the primary key (2); FK marks the foreign key (3). The tables are listed above (1).")

**Natural vs surrogate keys**

| | Natural key | Surrogate key |
| :-- | :-- | :-- |
| What | A real-world identifier | A meaningless number the system assigns |
| Examples | Bank verification number, email, car registration | `customer_id` 1, 2, 3… |
| Pros | Means something | Never changes, short, always available |
| Cons | Can change (email), can be missing, can be private (BVN) | Needs a lookup to mean anything |

Analytics models usually use **surrogate keys**, and keep natural keys as ordinary attributes.

**Composite key:** a key made of two or more columns together. In a table of which students take which courses, neither `student_id` nor `course_id` is unique alone, but the pair `(student_id, course_id)` is.

**Referential integrity:** every foreign key value must exist as a primary key in the other table. A shipment for customer 999 when there is no customer 999 is an **orphan**, and it silently drops out of inner joins.

## Example

Check that `customer_id` really is unique in Harbourline's customers table:

```sql run
SELECT COUNT(*) AS rows_, COUNT(DISTINCT customer_id) AS distinct_ids
FROM customers;
```

Both are 120, so it can be a primary key. A foreign key, by contrast, can be empty when the relationship is optional:

```sql run
SELECT company_name, city
FROM customers
WHERE account_manager_id IS NULL;
```

Eight customers have no account manager assigned. The model allows that, and the diagram in lesson 5 shows it with a small circle ("zero or one").

## Walkthrough

When you receive a new table, test its keys before building on it:

1. **Is the PK unique?** `COUNT(*)` vs `COUNT(DISTINCT key)`: they must match.
2. **Is it ever empty?** `WHERE key IS NULL` must return nothing.
3. **Do the FKs all match?** A LEFT JOIN from the child to the parent, keeping rows where the parent is missing, must return nothing.
4. **Which FKs may be empty?** Decide whether an empty value means "not yet known" or is a data problem.

## Practice

```exercise
{
  "id": "dmo-03-p1",
  "prompt": "How many Harbourline customers have **no** account manager? Return one number.",
  "starter": "SELECT COUNT(*)\nFROM customers\nWHERE ",
  "solution": "SELECT COUNT(*) FROM customers WHERE account_manager_id IS NULL;",
  "hint": "Empty foreign keys are NULL. Use IS NULL, not = NULL.",
  "required": true
}
```

```exercise
{
  "id": "dmo-03-p2",
  "prompt": "Referential-integrity check: count the shipments whose `route_id` has **no matching row** in `routes`. (A healthy model returns 0.)",
  "starter": "SELECT COUNT(*)\nFROM shipments AS s\nLEFT JOIN routes AS r ON r.route_id = s.route_id\nWHERE ",
  "solution": "SELECT COUNT(*) FROM shipments AS s LEFT JOIN routes AS r ON r.route_id = s.route_id WHERE r.route_id IS NULL;",
  "hint": "After a LEFT JOIN, rows with no match have NULL in every column from routes.",
  "required": true
}
```

```answer
{
  "id": "dmo-03-p3",
  "prompt": "A table records which products each supplier can deliver: `(supplier_id, product_id, price)`. One supplier delivers many products; one product has many suppliers. What kind of primary key does it need? (One word.)",
  "answer": "composite",
  "accept": ["composite key", "compound", "compound key", "a composite key"],
  "format": "text",
  "explanation": "Only the pair (supplier_id, product_id) is unique, so the key is composite.",
  "required": true,
  "hint": "Neither supplier_id nor product_id is unique on its own. A key made of two columns is called…"
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "dmo-03-d1",
  "prompt": "In the legal `hearings.csv`, which column is the **foreign key** that links a hearing to its matter?",
  "answer": "matter_id",
  "format": "text",
  "hint": "It ends in _id and isn't the table's own key.",
  "required": false
}
```

```answer
{
  "id": "dmo-03-d2",
  "prompt": "employee_id identifies an employee, but it is **not** unique in `attendance.csv`. How many times does employee **1005** appear there?",
  "answer": 22,
  "format": "number",
  "dataset": "hr",
  "files": [
    "attendance"
  ],
  "verify": "SELECT COUNT(*) FROM attendance WHERE employee_id = 1005",
  "hint": "Filter employee_id to 1005.",
  "explanation": "So attendance needs a composite key: (employee_id, date).",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why is a customer's email a risky primary key?",
    "options": ["Emails are too long to store", "It can change, be missing, or be shared, and the key must be stable and unique", "SQL can't compare text", "It's private"],
    "answer": 1,
    "explanation": "Keys must be unique, present and stable. Emails fail all three sometimes."
  },
  {
    "prompt": "What is an orphan row?",
    "options": ["A row with no primary key", "A child row whose foreign key matches no parent row", "The first row of a table", "A duplicated row"],
    "answer": 1,
    "explanation": "Orphans quietly disappear from inner joins and make totals wrong."
  },
  {
    "prompt": "Where does the foreign key go in a one-to-many relationship between customers and shipments?",
    "options": ["customers", "shipments", "Both", "Neither"],
    "answer": 1,
    "explanation": "The many side (shipments) holds the key of the one side (customers)."
  }
]
```
