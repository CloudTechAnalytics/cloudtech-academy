---
title: Entity-relationship diagrams
minutes: 30
summary: Read and draw ERDs in crow's-foot notation, and use one to plan any query across several tables.
---

## The problem

A new analyst at Harbourline is asked: *"How much has each industry paid us?"* The answer needs three tables: industry is on customers, payments are on payments, and the only connection between them is shipments. Without a map, the analyst guesses at joins. With an **entity-relationship diagram (ERD)**, the path is visible in seconds.

## The concept

An **ERD** draws a data model:

- a **box** per entity (table), listing its attributes (columns), with keys marked;
- a **line** per relationship, from a primary key to the foreign keys that point at it;
- **line endings** showing cardinality (crow's-foot notation).

Here is Harbourline's full ERD:

![Harbourline Freight's entity-relationship diagram: employees, customers, shipments, routes and payments, with crow's-foot lines for manages, reports to, books, used by and paid by.](/images/courses/sql/harbourline-erd.svg "Harbourline Freight. Follow any line to see which columns join two tables.")

**Reading one line, both ways.** Take the line between customers and shipments:

- From customers: *one customer books **zero or many** shipments* (circle + crow's foot at the shipments end).
- From shipments: *each shipment is booked by **exactly one** customer* (two bars at the customers end).

**A line back to the same table.** `employees.manager_id` points to `employees.employee_id`: a *self-relationship* (each employee reports to zero or one manager). This is how organisation charts are stored.

**Tools for drawing ERDs:** draw.io (diagrams.net, free), dbdiagram.io, Lucidchart, Microsoft Visio, or the diagram features in SSMS, MySQL Workbench and Power BI's Model view. Paper works too; the notation matters more than the tool.

## Example

*"How much has each industry paid us?"* On the diagram, walk from **customers** (industry) → **shipments** (via `customer_id`) → **payments** (via `shipment_id`). Each step is one JOIN:

```sql run
SELECT c.industry, SUM(p.amount) AS total_paid
FROM customers AS c
JOIN shipments AS s ON s.customer_id = c.customer_id
JOIN payments  AS p ON p.shipment_id = s.shipment_id
GROUP BY c.industry
ORDER BY total_paid DESC;
```

## Walkthrough

Drawing an ERD from scratch, for Ashgrove Chambers:

1. **Boxes:** clients, matters, hearings, invoices.
2. **Keys:** `client_id`, `matter_id`, `hearing_id`, `invoice_id` as primary keys.
3. **Lines:** clients → matters (a client has many matters: FK `matters.client_id`); matters → hearings (FK `hearings.matter_id`); matters → invoices (FK `invoices.matter_id`).
4. **Endings:** a matter must have one client (bars); a client may have zero matters (circle, crow's foot); a matter may have zero hearings (non-litigation work like contract review never goes to court).
5. **Check with a question:** *"Overdue amount per client"* → clients → matters → invoices. Two joins, no gaps. ✓

You'll draw this ERD properly in the final project.

## Practice

```exercise
{
  "id": "dmo-05-p1",
  "prompt": "Follow the diagram: return each **route's origin** and the **number of payments** received for shipments on that route. Two columns, one row per origin.",
  "starter": "SELECT r.origin, COUNT(p.payment_id) AS payments\nFROM routes AS r\n",
  "solution": "SELECT r.origin, COUNT(p.payment_id) AS payments FROM routes AS r JOIN shipments AS s ON s.route_id = r.route_id JOIN payments AS p ON p.shipment_id = s.shipment_id GROUP BY r.origin;",
  "hint": "routes → shipments on route_id, shipments → payments on shipment_id, then GROUP BY r.origin.",
  "required": true
}
```

```answer
{
  "id": "dmo-05-p2",
  "prompt": "Harbourline wants to record **which employee packed each shipment** (one packer per shipment). Which table gets the new foreign key column?",
  "answer": "shipments",
  "accept": ["shipment", "the shipments table"],
  "format": "text",
  "hint": "One employee packs many shipments; each shipment has one packer. The key goes on the many side.",
  "explanation": "Add shipments.packed_by_employee_id, a foreign key to employees.employee_id.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "On an ERD line, two short bars at one end mean:",
    "options": ["Zero or many", "Exactly one", "Zero or one", "Many-to-many"],
    "answer": 1,
    "explanation": "Bars mean one; a circle would make it optional; a crow's foot means many."
  },
  {
    "prompt": "employees.manager_id points to employees.employee_id. What is this called?",
    "options": ["A bridge table", "A self-relationship (recursive relationship)", "A composite key", "An orphan"],
    "answer": 1,
    "explanation": "A table relating to itself stores hierarchies such as reporting lines."
  },
  {
    "prompt": "To go from customers to payments in Harbourline, you pass through shipments. How many JOINs is that?",
    "options": ["Two: customers → shipments → payments", "One", "Three", "None"],
    "answer": 0,
    "explanation": "Each step between two tables is one JOIN."
  }
]
```
