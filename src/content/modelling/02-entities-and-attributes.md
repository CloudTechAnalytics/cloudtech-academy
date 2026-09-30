---
title: Entities, attributes and grain
minutes: 25
summary: Turn things into tables and facts into columns, choose data types, and state the grain - what one row means.
---

## The problem

Kolanut wants to store its customers properly. Someone suggests one column called `details` holding *"Peace Provisions, Kiosk, Kano, rep 7"*. It's easy to type, and impossible to filter, count or join. Deciding what the table is, which columns it has, and what one row means is the core skill of modelling.

## The concept

**An entity** is a kind of thing the business stores data about: customers, products, invoices. Each entity becomes a **table**.

**An attribute** is one fact about that thing: a customer's name, channel, region. Each attribute becomes a **column**, with one **data type**.

**An instance** is one particular thing: one customer. It becomes a **row**.

![A customers table with callouts: the table is the entity, each column an attribute, each row one instance, the primary key identifies each row and the foreign key points to a sales rep.](/images/courses/modelling/entity-anatomy.svg "The parts of a table, using Kolanut's customers.")

**Rules for good attributes**

1. **One fact per column.** Not `"Kano, North West"`; use `city` and `region`.
2. **One value per cell.** Not `"Malt drink, Chin chin"`; that's two rows of something else.
3. **The right data type.** Numbers you calculate with are numbers; dates are dates; IDs and phone numbers are **text** or integers you never add up. (`08031234567` stored as a number loses its leading zero.)
4. **Clear names.** `customer_name`, not `name2` or `CustNm`.

**Common data types**

| Type | For | Examples |
| :-- | :-- | :-- |
| Integer | Counts and IDs | `quantity`, `customer_id` |
| Decimal / money | Amounts | `unit_price`, `amount_ngn` |
| Text | Names, codes, categories | `region`, `phone` |
| Date / datetime | When something happened | `order_date` |
| Boolean | Yes / no | `is_active` |

**Grain** is the answer to *what does one row represent?* Always state it in one sentence:

- `customers`: one row per customer.
- `orders.csv`: one row per **product on an order** (an order line), not one row per order.
- `attendance.csv`: one row per employee per working day.

Most double-counting mistakes are grain mistakes: summing a customer's credit limit across their order lines, or counting order lines as orders.

## Example

Harbourline's `shipments` table: one row per shipment. It has 2,683 rows but only 105 different customers, because customers book many shipments:

```sql run
SELECT COUNT(*)                    AS shipments,
       COUNT(DISTINCT customer_id) AS customers_who_booked
FROM shipments;
```

## Walkthrough

Designing Kolanut's product table, step by step:

1. **Entity:** product. **Grain:** one row per product (one pack size of one item).
2. **Attributes:** name, category, list price. Brand and pack size could be separate columns if managers filter by them.
3. **Types:** `product_id` integer, `product_name` text, `category` text, `list_price` money.
4. **Check against a question:** *"Revenue by category"*: category must be a clean column with a fixed list of values. ✓

## Practice

```answer
{
  "id": "dmo-02-p1",
  "prompt": "Complete the grain of Kolanut's `orders.csv`: one row per ___ on one order. (One word.)",
  "answer": "product",
  "accept": ["product line", "item", "line", "order line", "line item", "products"],
  "format": "text",
  "explanation": "Each row has one product_id and a quantity of it. In this dataset each order_id appears once, so an order line and an order coincide, but the design would allow several products per order.",
  "required": true,
  "hint": "Look at the columns: each row has one product_id and a quantity of it."
}
```

```exercise
{
  "id": "dmo-02-p2",
  "prompt": "Harbourline's `payments` table: return the number of payment rows and the number of **different shipments** they pay for, as two columns.",
  "starter": "SELECT\nFROM payments;",
  "solution": "SELECT COUNT(*), COUNT(DISTINCT shipment_id) FROM payments;",
  "hint": "COUNT(*) and COUNT(DISTINCT shipment_id). If the two differ, some shipments were paid more than once.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A column holds values like 'Lagos, Ikeja'. What's wrong?",
    "options": ["Nothing", "It stores two facts in one column; split it into region and city", "It should be a number", "It needs a primary key"],
    "answer": 1,
    "explanation": "One fact per column makes filtering and grouping possible."
  },
  {
    "prompt": "Which data type suits a phone number like 08031234567?",
    "options": ["Decimal number", "Text", "Date", "Boolean"],
    "answer": 1,
    "explanation": "You never calculate with it, and as a number it loses its leading zero."
  },
  {
    "prompt": "An attendance table has one row per employee per working day. What is that sentence called?",
    "options": ["The primary key", "The grain", "The schema", "The index"],
    "answer": 1,
    "explanation": "The grain says what one row represents."
  }
]
```
