---
title: What is a data model?
minutes: 20
summary: Why data needs a design before it needs a dashboard, and the three levels a model moves through - conceptual, logical and physical.
---

## The problem

Kolanut's first "database" was one enormous spreadsheet: every order with the customer's name, city, phone number and sales rep typed in again on each row. When a customer moved from Kano to Abuja, their old orders still said Kano and their new ones said Abuja. Nobody could say how many customers Kolanut had, because "Peace Provisions" and "Peace Provision" were counted as two.

The data wasn't wrong because people were careless. It was wrong because nobody had **designed** it.

## The concept

A **data model** is the design of how data is organised: what *things* are stored, what is known about each, how they connect, and what rules they follow. It's the plan you build a database (or a Power BI model) from.

Models are usually described at three levels, from business language down to database detail:

![Three panels side by side. Conceptual: Customer, Order and Product as bubbles with the words places and contains. Logical: Customer and Order tables with attributes, a primary key and a foreign key, joined by a relationship line. Physical: a CREATE TABLE statement with data types and constraints.](/images/courses/modelling/model-levels.svg "The same idea at three levels of detail.")

| Level | Describes | Who uses it | Kolanut example |
| :-- | :-- | :-- | :-- |
| **Conceptual** | The things the business cares about and how they relate | Managers and analysts agreeing scope | *A customer places orders; an order contains products.* |
| **Logical** | Each thing's attributes, its key, and the relationships with their cardinality | Analysts and designers | *Customer (Customer ID, Name, Region); Order (Order ID, Customer ID, …); one customer to many orders.* |
| **Physical** | Real tables in one specific database: names, data types, constraints, indexes | Database developers | `CREATE TABLE orders (order_id INT PRIMARY KEY, …)` in SQL Server |

**Why it matters to an analyst**

- Good models make questions easy: "revenue by region" is one join, not a cleaning project.
- Most "the numbers don't match" arguments come from models that store the same fact twice.
- In Power BI, the model *is* half the work: relationships decide what filters what.

## Example

The Harbourline Freight database you've queried in the SQL course is a physical model with five tables. Its conceptual version fits in one sentence: *employees look after customers; customers book shipments on routes; shipments are paid for by payments.*

That sentence already contains the whole design: five **entities** (employees, customers, shipments, routes, payments) and four **relationships** (look after, book, on, paid for by). The next lessons turn sentences like this into tables, keys and lines.

## Walkthrough

When you meet any database or dataset, recover its model in three questions:

1. **What are the things?** Usually the nouns: customers, matters, invoices, employees.
2. **How do they connect?** Usually the verbs: a client *has* matters; a matter *has* hearings.
3. **What identifies each one?** An ID column, or a combination of columns.

Try it on Ashgrove Chambers, the law firm in the Power BI course: *clients have matters; matters have hearings and invoices.* Four things, three relationships, each identified by an ID (`client_id`, `matter_id`, `hearing_id`, `invoice_id`).

## Practice

```answer
{
  "id": "dmo-01-p1",
  "prompt": "At which level of a data model do **data types** such as `INT` or `DATE` first appear? (One word.)",
  "answer": "physical",
  "accept": ["the physical level", "physical model", "physical level"],
  "format": "text",
  "explanation": "Conceptual and logical models describe things and attributes; data types belong to a specific database, so they're physical.",
  "required": true,
  "hint": "Conceptual, logical, physical: which level is tied to one particular database?"
}
```

```answer
{
  "id": "dmo-01-p2",
  "prompt": "How many **entities** are there in this description? *A school has teachers and students. Teachers teach classes; students enrol in classes; each class takes place in a classroom.*",
  "answer": 5,
  "format": "number",
  "hint": "List the nouns that are things the school would store data about. Is the school itself one of them?",
  "explanation": "Teachers, students, classes, classrooms and enrolments. The school is the whole database, not a table in it, and 'enrol' hides an entity: an enrolment (which student is in which class) is a thing with its own rows. If you said 4, you missed enrolments; lesson 4 explains why they need their own table.",
  "tolerance": 0,
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A manager says: 'Every sale belongs to one branch, and each branch has one manager.' Which level of model is that?",
    "options": ["Conceptual", "Logical", "Physical", "None, it's a report"],
    "answer": 0,
    "explanation": "It names things and how they relate, in business language, with no attributes or types."
  },
  {
    "prompt": "What is the main risk of storing a customer's city on every order row?",
    "options": ["The file is slow to open", "The same fact can end up with different values on different rows", "SQL can't read it", "Cities can't be text"],
    "answer": 1,
    "explanation": "Storing a fact many times lets the copies disagree, which is exactly what went wrong at Kolanut."
  },
  {
    "prompt": "Which question helps you find a model's entities?",
    "options": ["What colour are the charts?", "What are the things (nouns) the business stores data about?", "How big is the file?", "Who wrote the data?"],
    "answer": 1,
    "explanation": "Entities are usually the nouns: customers, orders, matters."
  }
]
```
