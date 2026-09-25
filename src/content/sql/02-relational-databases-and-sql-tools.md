---
title: Relational databases, SQL Server and MySQL
minutes: 30
summary: What a relational database is, the database products you'll meet at work, how their SQL differs, and how to find your way around SQL Server Management Studio and MySQL Workbench.
---

## The problem

In this course you write SQL in your browser, against a small database. At work, the data lives in a company database: **SQL Server** at a bank, **MySQL** behind a website, **PostgreSQL** at a start-up, **Oracle** at a telecoms company. You'll open a different program, connect to a server, and find the SQL mostly the same, with a few words that differ.

This lesson maps that world, so the first day on a real database doesn't feel foreign.

## The concept

**A relational database** stores data in **tables** (relations) of rows and columns, and links the tables through **keys**:

- a **primary key (PK)** identifies each row: `customer_id` in `customers`;
- a **foreign key (FK)** holds another table's primary key, which is how rows relate: `customer_id` in `shipments` says which customer booked each shipment.

Here is the Harbourline database you've been querying, drawn as an **entity-relationship diagram** (ERD):

![Entity-relationship diagram of the Harbourline database with five tables: employees, customers, shipments, routes and payments. Lines connect each foreign key to the primary key it points to.](/images/courses/sql/harbourline-erd.svg "Harbourline Freight: five tables joined by keys. Each line runs from a primary key to the foreign keys that point at it.")

Read one line: a customer **books zero or many** shipments; each shipment belongs to **exactly one** customer. The crow's foot (three prongs) marks the "many" end. Every JOIN you wrote in this course follows one of these lines.

**An RDBMS** (relational database management system) is the software that stores the tables, enforces the keys, and runs your SQL. The ones you'll meet most:

| RDBMS | Made by | Where you'll see it | Main tool |
| :-- | :-- | :-- | :-- |
| **SQL Server** (and Azure SQL) | Microsoft | Banks, large companies, anything built on Microsoft tools | SQL Server Management Studio (SSMS), or VS Code with the MSSQL extension |
| **MySQL** (and its fork MariaDB) | Oracle (open source) | Websites and web apps: WordPress, PHP and many start-ups | MySQL Workbench |
| **PostgreSQL** | Open-source community | Start-ups, analytics teams, geographic data | pgAdmin, DBeaver |
| **Oracle Database** | Oracle | Telecoms, government, very large systems | SQL Developer |
| **SQLite** | Open source | Inside phones, browsers and apps. **This course's practice database** | Built into the app |

All of them speak **SQL**, a standard language. Each adds its own **dialect**: extra functions and a few different keywords. SQL Server's dialect is called **T-SQL** (Transact-SQL).

**Where you'll notice the differences**

| Task | SQLite (this course) | SQL Server (T-SQL) | MySQL | PostgreSQL |
| :-- | :-- | :-- | :-- | :-- |
| First 10 rows | `LIMIT 10` | `SELECT TOP (10) …` | `LIMIT 10` | `LIMIT 10` |
| Today's date | `DATE('now')` | `CAST(GETDATE() AS date)` | `CURDATE()` | `CURRENT_DATE` |
| Year of a date | `strftime('%Y', d)` | `YEAR(d)` | `YEAR(d)` | `EXTRACT(YEAR FROM d)` |
| Join two texts | `a \|\| b` | `a + b` or `CONCAT(a, b)` | `CONCAT(a, b)` | `a \|\| b` |
| Name with a space | `"order date"` | `[order date]` | `` `order date` `` | `"order date"` |

Everything else you've learned (SELECT, WHERE, GROUP BY, HAVING, JOINs, CASE, subqueries, CTEs, window functions) works the same way in all of them.

## Example

This is the same Harbourline data loaded into **SQL Server**, queried in **SQL Server Management Studio (SSMS)**. The query finds the ten customers who shipped the most containers in 2025. Don't worry about every line yet: you'll write queries like it by the JOINs lesson. For now, notice `TOP (10)` where this course uses `LIMIT 10`.

![SQL Server Management Studio showing the HarbourlineFreight database in Object Explorer, a T-SQL query in the editor, and a results grid listing the ten customers who shipped the most containers in 2025.](/images/courses/sql/ssms-window.webp "SQL Server Management Studio 22, connected to a SQL Server copy of the Harbourline database. Account details are blurred.")

1. **Object Explorer**: the server, its databases, and each database's tables. Press **F8** if it's hidden.
2. **Columns** of `dbo.customers`, with their data types. `PK` marks the primary key, `FK` a foreign key.
3. **Available databases**: which database your query runs against. Check this first when a table "doesn't exist".
4. **Execute** (or **F5**): runs the query, or only the part you've highlighted.
5. **The query editor**: one tab per query window.
6. **Results grid**: the output. The **Messages** tab beside it shows errors and row counts.
7. **Status bar**: *Query executed successfully*, the server, the database, time taken and the number of rows.

> [!NOTE]
> Run in SQLite, the same query returns the same ten customers, but two of them, tied on 104 containers, come back in the opposite order. With no tie-breaker in `ORDER BY`, each database may order ties differently. Add a second sort column when order matters, as you learned in the ORDER BY lesson.

## Walkthrough

**Getting a practice SQL Server on your own computer (Windows)**

1. Download **SQL Server Developer** (free for learning and testing) or **SQL Server Express** (free, smaller) from Microsoft.
2. Download **SQL Server Management Studio (SSMS)**, also free.
3. Open SSMS. In **Connect to Server**, type the server name (`localhost` for a default install, or `localhost\SQLEXPRESS` for Express), choose **Windows Authentication**, and tick **Trust server certificate** for a local practice server. Click **Connect**.
4. Right-click **Databases → New Database…** to create one, or restore a sample database.
5. **New Query** (Ctrl + N) opens an editor connected to the database selected in Object Explorer.

**SSMS shortcuts worth learning**

| Keys | Does |
| :-- | :-- |
| F5 (or Ctrl + E) | Execute; runs only the highlighted text if something is selected |
| Ctrl + N | New query window |
| F8 | Show Object Explorer |
| Ctrl + R | Show or hide the results pane |
| Ctrl + D / Ctrl + T | Results as a grid / as text |
| Ctrl + K, Ctrl + C | Comment out the selected lines |
| Ctrl + K, Ctrl + U | Uncomment them |
| Ctrl + Shift + R | Refresh IntelliSense after creating tables |
| Alt + F1 (on a highlighted table name) | Show the table's columns and keys |

**MySQL Workbench** is laid out much the same way. A simplified picture of its query screen:

![Simplified diagram of the MySQL Workbench window with numbered areas: toolbar with Run all and Run line buttons, Navigator with schemas and tables, the SQL editor, the result grid and the output panel.](/images/courses/sql/mysql-workbench-layout.svg "MySQL Workbench, simplified. In MySQL a database is called a schema.")

1. **Toolbar**: the lightning bolt runs everything (or the selection); the bolt with a cursor runs only the statement the cursor is in.
2. **Navigator → Schemas**: the databases and their tables. Double-click a schema to make it the default for your queries.
3. **SQL editor**: note `LIMIT 10`, as in this course.
4. **Result grid**: the output, which you can sort and export.
5. **Output**: each statement, its time and row count, or its error.

In Workbench, **Ctrl + Shift + Enter** runs everything (or the selection) and **Ctrl + Enter** runs the current statement.

## Practice

A colleague sends you a T-SQL query written for SQL Server:

```sql
SELECT TOP (5) company_name, city, signup_date
FROM customers
ORDER BY signup_date, customer_id;
```

```exercise
{
  "id": "sql-rdb-p1",
  "prompt": "Rewrite it so it runs here in SQLite: the five customers who signed up first, with company_name, city and signup_date.",
  "starter": "SELECT TOP (5) company_name, city, signup_date\nFROM customers\nORDER BY signup_date, customer_id;",
  "solution": "SELECT company_name, city, signup_date FROM customers ORDER BY signup_date, customer_id LIMIT 5;",
  "hint": "Remove TOP (5) from the SELECT line and add LIMIT 5 at the end.",
  "orderMatters": true,
  "required": true
}
```

```answer
{
  "id": "sql-rdb-p2",
  "prompt": "Looking at the diagram of Harbourline, which table holds the foreign key that links a payment to what it pays for? Name the **table**.",
  "answer": "payments",
  "accept": ["payment", "the payments table"],
  "format": "text",
  "hint": "Foreign keys sit on the 'many' side. One shipment can have several payments.",
  "explanation": "payments.shipment_id points to shipments.shipment_id. A shipment can be paid in more than one instalment, so the key lives on the payments side.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does a foreign key do?",
    "options": ["Makes every row unique", "Holds another table's primary key, linking the two tables", "Encrypts the table", "Sorts the rows"],
    "answer": 1,
    "explanation": "shipments.customer_id is a foreign key: it holds a customers primary key value."
  },
  {
    "prompt": "You move a query from this course to SQL Server. Which line will fail?",
    "options": ["SELECT city, COUNT(*)", "GROUP BY city", "LIMIT 10;", "ORDER BY 2 DESC"],
    "answer": 2,
    "explanation": "SQL Server uses SELECT TOP (10) instead of LIMIT."
  },
  {
    "prompt": "In SSMS, a query says the table dbo.shipments doesn't exist, but you can see it in Object Explorer. What should you check first?",
    "options": ["Your internet connection", "The database selected in the toolbar drop-down", "The font size", "Whether the table has a primary key"],
    "answer": 1,
    "explanation": "Queries run against the database selected in the Available Databases box, often 'master' by default."
  }
]
```
