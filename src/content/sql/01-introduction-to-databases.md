---
title: Introduction to databases
minutes: 20
summary: What a database is, how tables connect, and your first query against a real one.
---

## The problem

You've just joined **Harbourline Freight**, a logistics company in Lagos that moves containers for its customers by sea, air and road. On your first morning, Kemi, the head of operations, asks a simple question:

> "Can you pull up our list of routes? I want to see where we ship to."

The answer isn't in a spreadsheet on someone's desktop. It lives in the company's **database**, and the way you ask a database a question is with **SQL**.

## The concept

A **database** is an organised store of data that many people and systems can use at once. The kind you'll use in this course is a **relational database**, which keeps data in **tables**.

A table looks a lot like a spreadsheet:

- Each **column** holds one kind of information, such as a company name or a booking date.
- Each **row** is one record: one customer, one shipment, one payment.
- Every table has a **primary key**, a column whose value is unique for each row. In `customers`, that's `customer_id`.

Tables connect to each other through **foreign keys**. Every shipment belongs to a customer, so the `shipments` table has a `customer_id` column that points back to a row in `customers`. That's what makes the database *relational*.

Harbourline's database has five tables:

| Table | One row is… | Key columns |
| :-- | :-- | :-- |
| `customers` | a company that ships with Harbourline | `customer_id`, `company_name`, `industry`, `city`, `account_manager_id` |
| `shipments` | one booking to move goods | `shipment_id`, `customer_id`, `route_id`, `booking_date`, `status`, `containers`, `freight_charge` |
| `routes` | a lane Harbourline operates | `route_id`, `origin`, `destination`, `mode`, `target_transit_days` |
| `payments` | money received for a shipment | `payment_id`, `shipment_id`, `payment_date`, `amount`, `method` |
| `employees` | a member of staff | `employee_id`, `full_name`, `role`, `team`, `manager_id` |

> [!NOTE]
> **SQL** stands for Structured Query Language. You'll hear it said as "S-Q-L" or "sequel"; both are fine. It works the same way in PostgreSQL, MySQL, SQL Server and SQLite, with small differences in some functions. This course runs on SQLite, right in your browser.

## Example

Here is the query that answers Kemi's question. Press **Run** to try it.

```sql run
SELECT * FROM routes;
```

## Walkthrough

- `SELECT` tells the database you want to read data.
- `*` means "every column".
- `FROM routes` says which table to read from.
- The semicolon `;` marks the end of the statement. Many tools don't require it, but it's a good habit.

The result is every row and column of the `routes` table: 30 routes, from sea lanes like Shanghai to Lagos (Apapa) to road routes like Lagos to Kano.

> [!TIP]
> SQL keywords aren't case-sensitive: `select * from routes` works too. Writing keywords in capitals is a convention that makes queries easier to read, and it's the style used in this course.

## Practice

```exercise
{
  "id": "sql-01-p1",
  "prompt": "Kemi wants to know who works at Harbourline. Show every column of the employees table.",
  "starter": "SELECT ",
  "solution": "SELECT * FROM employees;",
  "hint": "Use SELECT * FROM followed by the table name.",
  "required": true
}
```

## Challenge

```exercise
{
  "id": "sql-01-c1",
  "prompt": "Now show every column of the customers table. Look through the result: which columns connect a customer to another table?",
  "starter": "",
  "solution": "SELECT * FROM customers;",
  "hint": "The same pattern as before, with a different table name. Then look for columns that end in _id.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In the shipments table, what does one row represent?",
    "options": ["One customer", "One booking to move goods", "One payment", "One route"],
    "answer": 1,
    "explanation": "Each row in shipments is a single booking. Customers, payments and routes each have their own table."
  },
  {
    "prompt": "What is the job of a primary key?",
    "options": ["It sorts the table", "It uniquely identifies each row", "It stores the table's name", "It hides sensitive columns"],
    "answer": 1,
    "explanation": "A primary key has a different value for every row, so you can always point at exactly one record."
  },
  {
    "prompt": "The shipments table has a customer_id column. What kind of key is it?",
    "options": ["A primary key", "A foreign key", "A password", "A sort key"],
    "answer": 1,
    "explanation": "It points to the customer_id in the customers table, which makes it a foreign key."
  }
]
```
