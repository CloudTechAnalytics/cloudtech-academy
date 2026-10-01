---
title: Ranking and Top N
minutes: 25
summary: Rank customers and products with RANKX, handle ties and totals, measure how concentrated sales are with TOPN, and let report users choose N.
---

## The problem

The sales director wants a customer league table with each customer's **rank this year and last year**, so the account team can see who's climbing and who's slipping. She also wants one number for the board: "How dependent are we on our biggest five customers?"

Sorting a table visual puts customers in order, but it doesn't give you a rank you can show, compare or filter on, and it can't tell you what the top five add up to. Both need DAX.

## The concept

**RANKX**

```dax
RANKX ( <table>, <expression>, [value], [order], [ties] )
```

`RANKX` evaluates the expression for every row of the table, then finds where the current value sits among them. For a customer rank:

```dax
Customer Rank = RANKX ( ALL ( customers[customer_name] ), [Revenue] )
```

The **table** argument is the key decision. `ALL ( customers[customer_name] )` ranks against every customer, ignoring the visual's customer filter, which is what you want: on the row for Chuks Trading Co., the rank is calculated against all 90 customers, not against just Chuks. Use `ALLSELECTED` instead if the rank should be among the customers the user has selected.

Other arguments:

- `order`: `DESC` (the default, highest = 1) or `ASC`.
- `ties`: `SKIP` (the default: 1, 2, 2, 4) or `DENSE` (1, 2, 2, 3).

**Two things to tidy**

- **The total row.** At the total there's no single customer, so the rank is meaningless (it shows 1). Return BLANK there with `ISINSCOPE ( customers[customer_name] )`, which is true only when the visual is grouped by customer.
- **Customers with no sales** in the period get ranked last. Return BLANK when `[Revenue]` is blank.

**TOPN**

`TOPN ( n, <table>, <expression> )` returns the top n rows of a table as a virtual table, which you can then iterate:

```dax
Top 5 Revenue =
SUMX ( TOPN ( 5, ALL ( customers[customer_name] ), [Revenue] ), [Revenue] )
```

**Let the user choose N**

**Modeling → New parameter → Numeric range** creates a slicer and a measure, such as `[Top N Value]`, that returns the selected number. Use it in place of 5 to make the analysis interactive.

## Example

```dax
Customer Rank =
IF (
    ISINSCOPE ( customers[customer_name] ) && NOT ISBLANK ( [Revenue] ),
    RANKX ( ALL ( customers[customer_name] ), [Revenue] )
)

Customer Rank LY =
VAR RevenueLY = CALCULATE ( [Revenue], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )
RETURN
    IF (
        ISINSCOPE ( customers[customer_name] ) && NOT ISBLANK ( RevenueLY ),
        RANKX (
            ALL ( customers[customer_name] ),
            CALCULATE ( [Revenue], SAMEPERIODLASTYEAR ( 'Date'[Date] ) ),
            RevenueLY
        )
    )

Top 5 Share =
VAR Top5 = TOPN ( 5, ALL ( customers[customer_name] ), [Revenue] )
RETURN
    DIVIDE ( SUMX ( Top5, [Revenue] ), CALCULATE ( [Revenue], ALL ( customers[customer_name] ) ) )
```

In `Customer Rank LY`, the third argument of `RANKX` gives the value to place in the ranking (this customer's revenue last year), and the second argument ranks every customer by their own revenue last year.

With a 2026 filter, the top of the league table looks like this:

| Customer | Rank | Rank LY |
| :-- | --: | --: |
| Brother Sunday Wholesale | 1 | 4 |
| Alhaji Musa Wholesale Ikorodu | 2 | 3 |
| Chuks Trading Co. | 3 | 1 |
| Madam Titi Wholesale | 4 | 2 |

## Walkthrough

1. Add `Customer Rank` and put it in a table with `customers[customer_name]` and `[Revenue]`. Check that the total row is blank.
2. Remove the `ISINSCOPE` test and look at the total row: it shows 1. Put the test back.
3. Add `Customer Rank LY`, filter the page to 2026, and sort by `Customer Rank`. Who has climbed the most?
4. Add `Top 5 Share` to a card, with a `Date[Year]` slicer.
5. Create a numeric range parameter called `Top N` (1 to 20, increment 1). Change `Top 5 Share` to use `[Top N Value]` instead of 5, rename it `Top N Share`, and try different values.

## Practice

```answer
{
  "id": "dax-08-p1",
  "prompt": "In **2025**, what share of revenue came from the **top 5 customers**? One decimal place.",
  "answer": 26.3,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "WITH r AS (SELECT customer_id, SUM(quantity * unit_price * (1 - discount_pct / 100.0)) AS r FROM orders WHERE order_date < '2026-01-01' GROUP BY customer_id) SELECT ROUND(100.0 * (SELECT SUM(r) FROM (SELECT r FROM r ORDER BY r DESC LIMIT 5)) / (SELECT SUM(r) FROM r), 1)",
  "hint": "A card with Top 5 Share and a Date[Year] slicer set to 2025.",
  "explanation": "About a quarter of revenue from five customers, all of them wholesalers or trading companies. Losing one would cost Kolanut around 4% to 6% of sales.",
  "required": true
}
```

```answer
{
  "id": "dax-08-p2",
  "prompt": "Divine Trading Co. was ranked 5th in 2025. What is its **Customer Rank** in **2026**?",
  "answer": 10,
  "format": "number",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "WITH r AS (SELECT c.customer_name AS n, SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) AS r FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE o.order_date >= '2026-01-01' GROUP BY c.customer_name) SELECT COUNT(*) + 1 FROM r WHERE r > (SELECT r FROM r WHERE n = 'Divine Trading Co.')",
  "hint": "Filter the page to 2026 and find the customer in your league table.",
  "explanation": "From 5th to 10th. A related account, Divine Trading Co. Ikeja, is 9th, so check whether orders have moved between the two accounts before calling it a lost customer.",
  "required": true
}
```

```task
{
  "id": "dax-08-t1",
  "prompt": "Write **Product Rank in Category**: each product's rank by revenue **within its own category** (1 = best-selling product in the category), blank on category and total rows. Paste it here.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "Product Rank in Category = ...",
  "rules": [
    { "label": "Named Product Rank in Category", "pattern": "^\\s*Product Rank in Category\\s*=" },
    { "label": "Uses RANKX", "pattern": "RANKX\\s*\\(" },
    { "label": "Ranks within the category: ALLEXCEPT(products, products[category]), ALL(products[product_name]) or ALLSELECTED(products[product_name])", "pattern": "ALLEXCEPT\\s*\\(\\s*products\\s*,\\s*products\\[category\\]|ALL(SELECTED)?\\s*\\(\\s*products\\[product_name\\]" },
    { "label": "Blank above product level, using ISINSCOPE", "pattern": "ISINSCOPE\\s*\\(\\s*products\\[product_name\\]" }
  ],
  "sample": "```dax\nProduct Rank in Category =\nIF (\n    ISINSCOPE ( products[product_name] ),\n    RANKX ( ALL ( products[product_name] ), [Revenue] )\n)\n```",
  "note": "`ALL ( products[product_name] )` removes only the product filter. The category filter from the matrix row stays in place, so the ranking is among the products in that category. Ranking over `ALL ( products )` would rank against all 16 products instead.",
  "required": true
}
```

## More practice

```answer
{
  "id": "dax-08-d1",
  "prompt": "Using Product Rank in Category (all dates), which product ranks **1st in Snacks**? Type the product name.",
  "answer": "Groundnuts 250g (30)",
  "accept": ["Groundnuts 250g", "Groundnuts"],
  "format": "text",
  "hint": "A matrix of products[category] and products[product_name], with Revenue and your rank measure.",
  "required": false
}
```

```answer
{
  "id": "dax-08-d2",
  "prompt": "Legal data: rank lawyers (matters[responsible_lawyer]) by total billed. How much has the **top-ranked** lawyer billed? (A rounded figure is fine.)",
  "answer": 222960000,
  "format": "naira",
  "dataset": "legal",
  "files": ["invoices", "matters"],
  "verify": "SELECT MAX(t) FROM (SELECT m.responsible_lawyer, SUM(i.amount_ngn) AS t FROM invoices i JOIN matters m ON m.matter_id = i.matter_id GROUP BY m.responsible_lawyer)",
  "hint": "RANKX(ALL(matters[responsible_lawyer]), [Billed]) in a table by lawyer.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why use ALL(customers[customer_name]) as the table in RANKX?",
    "options": ["It's faster", "So each customer is ranked against every customer, not only against itself in the row's filter", "To include blank customers", "RANKX requires ALL"],
    "answer": 1,
    "explanation": "On each row the customer filter would leave a table of one, and everyone would rank 1."
  },
  {
    "prompt": "A rank measure shows 1 on the total row. How do you blank it?",
    "options": ["Format it as blank", "Wrap it in IF(ISINSCOPE(customers[customer_name]), …)", "Use DENSE", "Remove the total row from the model"],
    "answer": 1,
    "explanation": "ISINSCOPE is true only when the visual is grouped by that column."
  },
  {
    "prompt": "Two customers tie for 2nd. With RANKX's default ties setting, what rank does the next customer get?",
    "options": ["3", "4", "2", "Blank"],
    "answer": 1,
    "explanation": "SKIP is the default: 1, 2, 2, 4. Use DENSE for 1, 2, 2, 3."
  }
]
```
