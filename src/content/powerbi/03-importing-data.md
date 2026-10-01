---
title: Importing data
minutes: 25
summary: Load CSV files into Power BI, choose between Load and Transform Data, and check that what arrived is complete and correctly typed.
---

## The problem

Kolanut's data is in three CSV files. Before you can chart anything, they have to come into Power BI whole, with numbers as numbers and dates as dates. A file that loads with the wrong types, or a truncated preview mistaken for the full data, causes problems that surface much later as "wrong" numbers.

## The concept

**Get data** (Home → Get data) connects to hundreds of sources: Excel workbooks, CSV and text files, folders, SQL databases, SharePoint, web pages and online services.

For a CSV, Power BI shows a **preview** of the first rows with its guess at the delimiter and types, then two buttons:

| Button | Does |
| :-- | :-- |
| **Load** | Loads the data as it is into the model |
| **Transform Data** | Opens Power Query to clean and shape it first (next lesson) |

**Import mode.** Loading copies the data into the `.pbix` file. That makes reports fast. To see new data you **Refresh** (Home → Refresh), which re-reads the source files.

**Check what arrived**, every time:

1. **Row counts**: in Table view the row count for the selected table appears at the bottom-left of the window. Compare it with the source.
2. **Types**: each column's type shows in Table view under **Column tools → Data type**. Numbers should be Whole number or Decimal number, dates should be Date.
3. **Obvious oddities**: blanks where you expect values, dates in the wrong century, IDs shown as decimals.

## Example

Kolanut's files, once loaded:

| Table | Rows | Key columns |
| :-- | --: | :-- |
| `orders` | 4,266 | order_id, order_date (Date), customer_id, product_id, quantity, unit_price, discount_pct |
| `customers` | 90 | customer_id, customer_name, channel, region, city, sales_rep, joined_date, credit_limit |
| `products` | 16 | product_id, product_name, category, list_price |

## Walkthrough

1. Open `kolanut-sales.pbix` from the last lesson.
2. **Home → Get data**. The full list of sources opens:

   ![The Get Data dialog with a search box, source categories on the left and a list of connectors including Text/CSV, and a Connect button.](/images/courses/powerbi/get-data.webp "Get Data. Type in the search box (1) to find a connector quickly.")

   Choose **Text/CSV** (2), then **Connect** (3), and pick `orders.csv`.
3. Power BI shows a preview:

   ![The Power BI preview of orders.csv, with File Origin, Delimiter and Data Type Detection settings above the data, and Load and Transform Data buttons.](/images/courses/powerbi/csv-preview.webp "The CSV preview: encoding (1), delimiter (2), type detection (3), a sample of rows (4), and Load or Transform Data (5).")

   Check the delimiter is **Comma** and the columns look right. Click **Load**.
4. Repeat for `customers.csv` and `products.csv`.
5. Switch to **Table view**. Select each table in the Data pane and read the row count at the bottom of the window:

   ![Table view in Power BI Desktop showing the orders table's rows, with the Data pane listing customers, orders and products, and the status bar reading Table: orders (4,266 rows).](/images/courses/powerbi/table-view.webp "Table view (1): the rows of the selected table (2), the tables in the model (3), and the row count (4): 4,266 for orders.")
6. Click the `order_date` column and check **Column tools → Data type** says **Date**.
7. Save.

> [!TIP]
> Loading several tables from one Excel workbook? **Get data → Excel workbook** opens the **Navigator**, where you tick every table you want in one go:
>
> ![The Navigator window with customers, orders and products ticked and a preview of the products table.](/images/courses/powerbi/navigator.webp "The Navigator: tick the tables (1), check the preview (2), then Load or Transform Data (3).")

> [!TIP]
> If the files will live in one folder and grow over time (a new CSV each month), **Get data → Folder** combines every file in the folder into one table. Refreshing then picks up new files automatically.

## Practice

```answer
{
  "id": "pbi-03-p1",
  "prompt": "After loading, how many rows does the **orders** table have in Power BI?",
  "answer": 4266,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(*) FROM orders",
  "hint": "Table view → select orders in the Data pane → the row count is at the bottom-left.",
  "required": true
}
```

```answer
{
  "id": "pbi-03-p2",
  "prompt": "How many **different customers** placed an order in **June 2026**? Build a Card visual with customer_id from orders, set to **Count (Distinct)**, and filter order_date to June 2026.",
  "answer": 66,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT COUNT(DISTINCT customer_id) FROM orders WHERE order_date BETWEEN '2026-06-01' AND '2026-06-30'",
  "hint": "Add a Card; drag orders[customer_id] into it; click the arrow next to the field in the well → Count (Distinct). Then in the Filters pane, filter order_date to June 2026 (Advanced filtering: is on or after 1/6/2026 and is on or before 30/6/2026).",
  "explanation": "66 of Kolanut's 90 customers ordered in June 2026.",
  "required": true
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "pbi-03-d1",
  "prompt": "Load the HR dataset's `attendance.csv` into Power BI. How many rows does the attendance table have?",
  "answer": 1518,
  "format": "number",
  "dataset": "hr",
  "files": [
    "attendance"
  ],
  "verify": "SELECT COUNT(*) FROM attendance",
  "hint": "Check the row count at the bottom of Table view, or put Count of date in a Card.",
  "required": false
}
```

```answer
{
  "id": "pbi-03-d2",
  "prompt": "Load the legal dataset's `hearings.csv`. How many **different matters** have at least one hearing?",
  "answer": 95,
  "format": "number",
  "dataset": "legal",
  "files": [
    "hearings"
  ],
  "verify": "SELECT COUNT(DISTINCT matter_id) FROM hearings",
  "hint": "A Card with matter_id set to Count (Distinct).",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does Refresh do for imported CSV data?",
    "options": ["Nothing, imported data never changes", "Re-reads the source files and reloads the data", "Deletes the data", "Publishes the report"],
    "answer": 1,
    "explanation": "Import mode keeps a copy; Refresh updates that copy from the source."
  },
  {
    "prompt": "You loaded orders and Power BI shows 1,000 rows. The CSV has 4,266. What should you do?",
    "options": ["Ignore it", "Investigate: check the file, the load and any filters before building anything", "Multiply results by 4.266", "Delete the table"],
    "answer": 1,
    "explanation": "Row-count checks catch incomplete loads early. Find out why before trusting any number."
  },
  {
    "prompt": "When would you choose Transform Data instead of Load?",
    "options": ["When the data needs cleaning or reshaping first", "Always, Load doesn't work", "Only for Excel files", "When you want a chart"],
    "answer": 0,
    "explanation": "Transform Data opens Power Query so you can fix the data before it reaches the model."
  }
]
```
