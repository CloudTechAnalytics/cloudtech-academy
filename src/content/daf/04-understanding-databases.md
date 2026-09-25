---
title: Understanding databases
minutes: 30
summary: Tables, keys and relationships, why companies keep data in databases, and your first look at SQL.
---

## The problem

Kolanut's `orders.csv` says customer **12** bought something. It doesn't say who customer 12 is, where they are, or which sales rep looks after them. That information lives in a different file, `customers.csv`. Why split it up? And how do you put it back together?

## The concept

A **database** stores data in several **tables**, each about one kind of thing: customers, products, orders. Tables connect through **keys**.

- A **primary key** uniquely identifies each row in a table. `customer_id` is the primary key of `customers`: no two customers share one.
- A **foreign key** is a column that points to a primary key in another table. `customer_id` in `orders` is a foreign key: it says *which* customer placed the order.

The link between the two is a **relationship**. Here it's **one-to-many**: one customer can have many orders, but each order belongs to one customer.

```
customers (one)                 orders (many)
customer_id  customer_name  ←── customer_id  order_id  quantity …
```

**Why not keep everything in one big sheet?**

If every order line repeated the customer's name, region, city and rep, then:

- the same facts would be typed thousands of times, so mistakes creep in;
- when a customer moves city, you'd have to change hundreds of rows;
- the file grows much larger than it needs to be.

Storing each fact once, and linking with keys, avoids all three. This design is called **normalisation**.

**SQL** (Structured Query Language) is the language used to ask databases questions. Analysts use it every day. You'll learn it properly in the SQL course; here's a first taste.

## Example

This SQL runs in your browser against a small freight company's database (Harbourline, used in the SQL course). Press **Run**:

```sql run
SELECT company_name, city, industry
FROM customers
WHERE city = 'Kano';
```

Read it almost like English: *select* these columns *from* the customers table *where* the city is Kano.

Now a query that uses a relationship. It **joins** each shipment to its customer through `customer_id`, so we can see names next to shipments:

```sql run
SELECT s.shipment_id, c.company_name, s.containers
FROM shipments AS s
JOIN customers AS c ON c.customer_id = s.customer_id
LIMIT 10;
```

## Walkthrough

You can follow a relationship by hand, too. Suppose you want to know where the customer on Kolanut order **10050** is based.

1. In `orders.csv`, find order_id **10050**. Its `customer_id` is **13**.
2. In `customers.csv`, find customer_id **13**: *Peace Provisions*, region **North West**, city **Kano**.

That two-step lookup is exactly what a database join does, for every row at once. In spreadsheets you'll do the same with a lookup formula (XLOOKUP, in the Excel course).

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
