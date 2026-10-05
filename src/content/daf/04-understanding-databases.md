---
title: Understanding databases
minutes: 20
summary: Spreadsheets versus databases, tables, primary and foreign keys, kinds of relationship, entity-relationship diagrams, normalisation, and a first look at SQL.
---

## The problem

Kolanut's `orders.csv` says customer **12** bought something. It doesn't say who customer 12 is, where they are, or which sales rep looks after them. That information lives in a different file, `customers.csv`. Why split it up? And how do you put it back together?

## The concept

A **database** is an organised store of data that many people and programs can use at the same time, safely. Most company data you'll analyse lives in one: the order system, the accounting system and the HR system each sit on top of a database.

### Spreadsheet or database?

| | Spreadsheet | Database |
| :-- | :-- | :-- |
| Size | Up to about a million rows per sheet; slow well before that | Millions or billions of rows |
| Users | One person edits at a time (or a few, carefully) | Thousands at once, without overwriting each other |
| Rules | Anyone can type anything anywhere | Each column has a type; keys must be unique; rules are enforced |
| Asking questions | Formulas, filters, pivots | SQL queries |
| Good for | Analysis, quick work, sharing results | Storing the business's records reliably |

Analysts use both: they pull data **out** of the database with SQL, then often finish the analysis in a spreadsheet or a BI tool.

A **relational database** (the most common kind) stores data in several **tables**, each about one kind of thing, and links them through **keys**. Common ones are PostgreSQL, MySQL, Microsoft SQL Server, Oracle and SQLite.

### Tables, rows and columns

| Database word | Means | Kolanut example |
| :-- | :-- | :-- |
| **Table** | All the records of one kind | `customers` |
| **Row** (record) | One of those things | Customer 27, Alhaji Musa Wholesale |
| **Column** (field) | One fact about each thing, with a fixed type | `region`, which is text |
| **Schema** | The list of tables, their columns and how they link | The diagram below |

### Keys and relationships

- A **primary key (PK)** uniquely identifies each row in its table. `customer_id` is the primary key of `customers`: no two customers share one, and none is empty.
- A **foreign key (FK)** is a column that points to a primary key in another table. `customer_id` in `orders` is a foreign key: it says *which* customer bought that line.

![Three tables: customers (primary key customer_id), orders (primary key order_id, foreign keys customer_id and product_id) and products (primary key product_id). Lines link each primary key to the matching foreign key, with one at the customers and products end and many at the orders end.](/images/courses/daf/kolanut-erd.svg "Kolanut's schema as an entity-relationship diagram (ERD).")

A drawing like this is called an **entity-relationship diagram (ERD)**. It's the map of a database; when you join a new company, ask for it first.

### Kinds of relationship

| Relationship | Means | Example |
| :-- | :-- | :-- |
| **One-to-many** | One row here matches many rows there | One customer has many order lines; one product appears on many order lines |
| **One-to-one** | One row matches exactly one row | One employee has one payroll record |
| **Many-to-many** | Many rows here match many rows there | Students and courses: a student takes many courses, a course has many students |

One-to-many is by far the most common. A many-to-many relationship is stored through a third table in the middle, sometimes called a **junction** or **bridge** table. Kolanut's `orders` is exactly that between customers and products: a customer buys many products, a product is bought by many customers, and each order line records one customer-product pair.

### Why not keep everything in one big sheet?

If every order line repeated the customer's name, region, city and rep, then:

- the same facts would be typed thousands of times, so mistakes creep in: "Alhaji Musa Wholesale" on 130 rows and "Alhaji Musa Wholesal" on four;
- when a customer moves city or changes rep, you'd have to change hundreds of rows, and miss some;
- the file grows much larger than it needs to be.

Storing each fact **once**, and linking with keys, avoids all three. This design is called **normalisation**.

The opposite is also useful. For analysis, you often want one wide table with everything side by side: each order line with its customer's region and product's category. Building that is called **denormalising**, and it's what a join does.

### SQL: asking a database questions

**SQL** (Structured Query Language, said "S-Q-L" or "sequel") is the language used to ask relational databases questions. Analysts use it every day. A query has a small set of parts, always in this order:

| Clause | Does | Example |
| :-- | :-- | :-- |
| `SELECT` | Which columns to show | `SELECT company_name, city` |
| `FROM` | Which table | `FROM customers` |
| `JOIN ... ON` | Bring in another table through a key | `JOIN customers c ON c.customer_id = s.customer_id` |
| `WHERE` | Which rows to keep | `WHERE city = 'Kano'` |
| `GROUP BY` | Which groups to summarise by | `GROUP BY city` |
| `ORDER BY` | How to sort the result | `ORDER BY shipments DESC` |

You'll learn each one properly in the SQL course. Here, it's enough to read a query and see what it's asking.

## Example

These queries run in your browser against a small freight company's database (Harbourline, used in the SQL course). It has customers, routes, shipments and payments. Press **Run** on each.

**One table, some rows.** The customers based in Kano:

```sql run
SELECT company_name, city, industry
FROM customers
WHERE city = 'Kano';
```

Read it almost like English: *select* these columns *from* the customers table *where* the city is Kano.

**Following a relationship.** Each shipment has a `customer_id`. A **join** looks it up in `customers`, so names appear next to shipments:

```sql run
SELECT s.shipment_id, c.company_name, s.containers
FROM shipments AS s
JOIN customers AS c ON c.customer_id = s.customer_id
LIMIT 10;
```

`s` and `c` are short nicknames (aliases) for the two tables. `ON c.customer_id = s.customer_id` is the key that links them.

**A summary.** How many customers are in each city, biggest first:

```sql run
SELECT city, COUNT(*) AS customers
FROM customers
GROUP BY city
ORDER BY customers DESC;
```

Lagos comes first with 46 of Harbourline's 120 customers. That's the same question you'd answer with a pivot table, asked of a database.

## Walkthrough

You can follow a relationship by hand, too. Suppose you want to know where the customer on Kolanut order **10050** is based.

1. In `orders.csv`, find order_id **10050**. Its `customer_id` is **13**.
2. In `customers.csv`, find customer_id **13**: *Peace Provisions*, a kiosk in **Kano**, region **North West**, looked after by **Sani Garba**.
3. While you're in `orders.csv`, note its `product_id`: **5**. In `products.csv`, product 5 is **Plantain chips 150g (20)**, a snack.

So order line 10050 was five packs of plantain chips for a kiosk in Kano. Three tables, two keys, one complete picture. That two-step lookup is exactly what a database join does, for every row at once. In spreadsheets you'll do the same with a lookup formula (XLOOKUP, in the Excel course).

**Check the keys.** A primary key must be unique. In a spreadsheet, compare the number of rows with the number of distinct IDs: `customers.csv` has 90 rows and 90 different `customer_id` values, so it's a valid key. If a column has fewer distinct values than rows, it can't be the primary key.

### Summary

| Term | Meaning |
| :-- | :-- |
| Database | An organised, shared, rule-enforcing store of data |
| Table / row / column | All records of one kind / one record / one fact about each |
| Primary key | Unique ID for each row of a table |
| Foreign key | A column pointing to another table's primary key |
| One-to-many | The most common relationship: one customer, many orders |
| Normalisation | Storing each fact once and linking with keys |
| ERD | The diagram of tables and relationships |
| SQL | The language for asking databases questions |

## Practice

```exercise
{
  "id": "daf-04-p1",
  "prompt": "Change the query so it lists Harbourline customers in **Lagos** instead of Kano. Keep the same three columns.",
  "starter": "SELECT company_name, city, industry\nFROM customers\nWHERE city = 'Kano';",
  "solution": "SELECT company_name, city, industry FROM customers WHERE city = 'Lagos';",
  "hint": "Only the text inside the quotes needs to change. Capital L matters.",
  "required": true
}
```

```answer
{
  "id": "daf-04-p2",
  "prompt": "Back to Kolanut. Which **region** is the customer on order **10500** in? Look up the order in `orders.csv`, then the customer in `customers.csv`.",
  "answer": "North West",
  "accept": ["northwest", "north-west"],
  "format": "text",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT c.region FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE o.order_id = 10500",
  "hint": "Order 10500 has a customer_id. Find that customer_id in customers.csv and read the region column. Ctrl + F helps.",
  "explanation": "Order 10500 belongs to customer 12, Hajia Amina Supermarket in Kano, North West.",
  "required": true
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "daf-04-d1",
  "prompt": "In the legal dataset, which **client** is matter **2010** for? Look up the matter in `matters.csv`, then its client_id in `clients.csv`. Give the client_name.",
  "answer": "Ibrahim Ndukwe",
  "format": "text",
  "dataset": "legal",
  "files": [
    "matters",
    "clients"
  ],
  "verify": "SELECT c.client_name FROM matters m JOIN clients c ON c.client_id = m.client_id WHERE m.matter_id = 2010",
  "hint": "matters.client_id is a foreign key to clients.client_id.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In Kolanut's data, what kind of key is product_id in orders.csv?",
    "options": ["Primary key", "Foreign key", "Not a key", "A date"],
    "answer": 1,
    "explanation": "It points to the primary key of products.csv, so in orders it's a foreign key."
  },
  {
    "prompt": "The relationship between customers and orders is:",
    "options": ["One-to-one", "One-to-many", "Many-to-many", "No relationship"],
    "answer": 1,
    "explanation": "One customer, many orders; each order has one customer."
  },
  {
    "prompt": "Why is it better to store a customer's city once in the customers table rather than on every order?",
    "options": ["Databases can't store text on orders", "A change of city then needs updating in one place, and there's no risk of conflicting copies", "Orders can't have more than five columns", "It makes SQL faster to type"],
    "answer": 1,
    "explanation": "Storing each fact once prevents inconsistent copies and makes updates simple."
  }
]
```
