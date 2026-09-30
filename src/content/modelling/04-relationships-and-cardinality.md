---
title: Relationships and cardinality
minutes: 30
summary: One-to-one, one-to-many and many-to-many relationships, optional vs mandatory, and why many-to-many needs a bridge table.
---

## The problem

At Harbourline, a shipment is usually paid in one go, but some customers pay in two instalments. If the model assumed "one payment per shipment", a `payment_date` column on `shipments` would have nowhere to put the second payment. Getting **how many** right, for each relationship, decides where every column goes.

## The concept

**Cardinality** is how many rows on one side can relate to a row on the other.

![Three examples. One-to-one: employees and id_cards. One-to-many: customers and orders. Many-to-many: students and courses joined by an enrolments bridge table with a composite key. A legend explains the line endings.](/images/courses/modelling/cardinality.svg "The three kinds of relationship, and how crow's-foot lines draw them.")

| Type | Meaning | Where the key goes | Harbourline / Kolanut |
| :-- | :-- | :-- | :-- |
| **One-to-one** | Each row matches at most one row on the other side | Either side, usually the optional one | An employee and their staff ID card |
| **One-to-many** | One parent row, many child rows | FK on the **many** side | A customer and their shipments |
| **Many-to-many** | Many on both sides | A **bridge table** holding both keys | Students and courses; products and suppliers |

**Optional or mandatory.** Each end also says whether a related row *must* exist:

- A shipment **must** have exactly one customer (mandatory, one).
- A customer **may** have zero shipments, if they've just signed up (optional, many).

In crow's-foot notation, a bar means "one", a crow's foot means "many", and a circle means "zero is allowed". The legend in the diagram shows all four endings.

**Why many-to-many needs a bridge.** You can't put `course_id` on the students table (a student takes several courses) or `student_id` on courses (a course has several students). So you create a table with one row per pairing, `enrolments(student_id, course_id, enrolled_on)`, turning one many-to-many into two one-to-manys. The bridge often carries its own facts, such as the enrolment date or a grade.

## Example

Harbourline's shipments-to-payments relationship is **one-to-many**, and optional on the payments side. How many payments do shipments have?

```sql run
SELECT payments_per_shipment, COUNT(*) AS shipments
FROM (
  SELECT s.shipment_id, COUNT(p.payment_id) AS payments_per_shipment
  FROM shipments AS s
  LEFT JOIN payments AS p ON p.shipment_id = s.shipment_id
  GROUP BY s.shipment_id
)
GROUP BY payments_per_shipment
ORDER BY payments_per_shipment;
```

Some shipments have 0 payments (not yet paid, or cancelled), most have 1, and some have 2. The model has to allow all three, which it does because payments is its own table.

## Walkthrough

For each pair of entities, ask two questions **in both directions**:

1. *Can one A have many Bs?* and *Can one B have many As?*
   - Yes / No → one-to-many (FK on B).
   - Yes / Yes → many-to-many (bridge table).
   - No / No → one-to-one.
2. *Must every A have a B?* (mandatory or optional at each end)

Ashgrove Chambers, the law firm: can a client have many matters? Yes. Can a matter have many clients? In this data, no, so it's one-to-many and `matters.client_id` is the foreign key. (If the firm often acted for several clients jointly on one matter, it would need a `matter_clients` bridge.)

## Practice

```exercise
{
  "id": "dmo-04-p1",
  "prompt": "How many Harbourline shipments have **no** payment at all? Return one number.",
  "starter": "SELECT COUNT(*)\nFROM shipments AS s\nLEFT JOIN payments AS p ON p.shipment_id = s.shipment_id\nWHERE ",
  "solution": "SELECT COUNT(*) FROM shipments AS s LEFT JOIN payments AS p ON p.shipment_id = s.shipment_id WHERE p.payment_id IS NULL;",
  "hint": "Shipments with no matching payment have NULL in p.payment_id after the LEFT JOIN.",
  "required": true
}
```

```exercise
{
  "id": "dmo-04-p2",
  "prompt": "How many shipments were paid in **exactly two** payments? Return one number.",
  "starter": "",
  "solution": "SELECT COUNT(*) FROM (SELECT shipment_id FROM payments GROUP BY shipment_id HAVING COUNT(*) = 2);",
  "hint": "Group payments by shipment_id, keep groups with HAVING COUNT(*) = 2, then count those groups in an outer query.",
  "required": true
}
```

```answer
{
  "id": "dmo-04-p3",
  "prompt": "A hospital: a doctor treats many patients, and a patient sees many doctors. What is the name for the extra table you need? (Two words.)",
  "answer": "bridge table",
  "accept": ["junction table", "link table", "associative table", "bridging table", "join table", "linking table", "bridge", "junction"],
  "format": "text",
  "explanation": "A bridge (or junction) table such as appointments(doctor_id, patient_id, appointment_date) resolves the many-to-many.",
  "required": true,
  "hint": "It sits between the two tables and holds both keys. The lesson's diagram shows one for students and courses."
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "One product can appear on many order lines; each order line has one product. What is the relationship?",
    "options": ["One-to-one", "One-to-many from products to order lines", "Many-to-many", "No relationship"],
    "answer": 1,
    "explanation": "The foreign key product_id sits on order lines, the many side."
  },
  {
    "prompt": "In crow's-foot notation, what does a small circle at the end of a line mean?",
    "options": ["Exactly one", "Zero is allowed (optional)", "A primary key", "A deleted row"],
    "answer": 1,
    "explanation": "The circle means the relationship is optional at that end."
  },
  {
    "prompt": "Why not store several course IDs in one column of the students table, like '101, 204, 318'?",
    "options": ["It's too long", "It breaks one-value-per-cell; use a bridge table with one row per student per course", "Course IDs must be text", "SQL forbids commas"],
    "answer": 1,
    "explanation": "Lists in a cell can't be joined, counted or validated properly."
  }
]
```
