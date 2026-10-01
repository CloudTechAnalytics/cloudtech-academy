---
title: Model and measures
minutes: 25
summary: Build a model that joins tables at the right grain, look up the cost price in force on each sale date, compare actuals with monthly targets, and test the core measures.
---

## The problem

Two traps wait between a clean sales table and a correct profit figure.

**The cost trap.** Voltline's costs went up 18% on 1 January 2026. Join sales to `cost_prices` on product code alone and every sale matches **two** cost rows: 27,588 lines become 55,176, and every total doubles. Pick just the latest cost instead, and 2025's sales are costed at 2026 prices: the first half of 2025 shows a gross margin of **−2.7%**, as if Voltline sold everything at a loss.

**The target trap.** Targets are one number per store per **month**. Join them to sales lines and each target is repeated once per line, so a store's target appears hundreds of times over.

Both are **grain** problems, and both are invisible unless you check. This lesson builds the model that avoids them.

## The concept

**The star schema**

| Table | Grain | Key | Role |
| :-- | :-- | :-- | :-- |
| `sales_clean` | one till line | `txn_id` + `line_no` | fact |
| `stores` | one store | `store_code` | dimension |
| `products` | one product | `product_code` | dimension |
| `Date` | one day | `Date` | dimension |
| `targets` | one store per month | `store_id` + `month` | a second fact, at a coarser grain |

**Looking up a cost that changes over time**

Each sale needs the cost whose `effective_from` is the latest one **on or before** the sale date. That's a "range lookup":

| Tool | How |
| :-- | :-- |
| SQL | a correlated subquery: `(SELECT unit_cost FROM cost_prices cp WHERE cp.product_code = s.product_code AND cp.effective_from <= s.sale_date ORDER BY cp.effective_from DESC LIMIT 1)` |
| Excel | `XLOOKUP` with match mode `-1` (exact or next smaller) on a key of product and date, or `MAXIFS` to find the effective date, then a lookup |
| pandas | `pd.merge_asof(sales.sort_values("sale_date"), costs.sort_values("effective_from"), left_on="sale_date", right_on="effective_from", by="product_code")` |
| Power BI | a merge in Power Query, or the calculated column below |

The Power BI calculated column, on `sales_clean`:

```dax
Unit Cost =
VAR Code = sales_clean[product_code]
VAR SaleDate = sales_clean[sale_date]
VAR Effective =
    MAXX (
        FILTER ( cost_prices, cost_prices[product_code] = Code && cost_prices[effective_from] <= SaleDate ),
        cost_prices[effective_from]
    )
RETURN
    MAXX (
        FILTER ( cost_prices, cost_prices[product_code] = Code && cost_prices[effective_from] = Effective ),
        cost_prices[unit_cost]
    )
```

Whichever you use, check that the row count **doesn't change** after the lookup.

**Comparing with targets: aggregate first**

Total the sales to store and month, then compare with the targets. In Power BI, relate `targets` to `stores` (via `store_id`) and to `Date` (via a month-start date column you add to `targets`), and write `Target = SUM ( targets[net_sales_target] )`. The measure only makes sense at month level or above. On a single day it would show the whole month's target.

**The core measures**

```dax
Net Sales = SUM ( sales_clean[net_sales] )
Gross Profit = SUMX ( sales_clean, sales_clean[net_sales] - sales_clean[qty] * sales_clean[unit_cost] )
Gross Margin % = DIVIDE ( [Gross Profit], [Net Sales] )
Target = SUM ( targets[net_sales_target] )
Target Attainment % = DIVIDE ( [Net Sales], [Target] )
Transactions = DISTINCTCOUNT ( sales_clean[txn_id] )
```

## Example

Gross margin by category for January to June 2026, with costs looked up correctly:

| Category | Net sales (₦m) | Gross margin |
| :-- | --: | --: |
| Phones | 688.5 | 9.3% |
| Solar & power | 676.7 | 18.4% |
| Laptops | 369.2 | 9.6% |
| Home appliances | 341.7 | 13.2% |
| Accessories | 57.1 | 44.4% |

Phones and solar bring in almost the same sales, but solar's margin is twice as high, so solar now earns about **twice the gross profit** of phones. Accessories are tiny in sales but earn 44p in every naira. Keep that in mind for lesson 5.

## Walkthrough

1. Add `unit_cost` to the clean sales with a range lookup in your chosen tool. Check the row count is still 27,588.
2. Calculate gross margin for January to June 2025. It should be about 12.9%. If you get −2.7%, your lookup used 2026 costs for 2025 sales.
3. Build the model: relate the fact to stores, products and a date table, and the targets to stores and dates (at month start).
4. Write the six core measures (or the equivalent SQL or pandas summaries) and format them.
5. Test them: total net sales should be ₦5,811,600,950 (from lesson 3), and target attainment for one store and month should match a hand calculation.

## Practice

```answer
{
  "id": "cap-04-p1",
  "prompt": "What was Voltline's **gross margin %** for **January to June 2026**? One decimal place.",
  "answer": 13.8,
  "format": "percent",
  "dataset": "retail",
  "files": ["sales_raw", "cost_prices"],
  "verify": "WITH c AS (SELECT * FROM (SELECT DISTINCT * FROM sales_raw WHERE product_code <> 'TEST') WHERE txn_date LIKE '2026-%' OR txn_date LIKE '__/__/2026'), k AS (SELECT c.*, (SELECT unit_cost FROM cost_prices cp WHERE cp.product_code = c.product_code AND cp.effective_from = '2026-01-01') AS unit_cost FROM c) SELECT ROUND(100.0 * (SUM(qty * unit_price - discount) - SUM(qty * unit_cost)) / SUM(qty * unit_price - discount), 1) FROM k",
  "hint": "Gross profit ÷ net sales, for sales dated 2026, using the 2026 costs.",
  "required": true
}
```

```answer
{
  "id": "cap-04-p2",
  "prompt": "What was the **gross profit** of the **Solar & power** category for **January to June 2026**? (A rounded figure is fine.)",
  "answer": 124251650,
  "format": "naira",
  "dataset": "retail",
  "files": ["sales_raw", "cost_prices", "products"],
  "verify": "WITH c AS (SELECT * FROM (SELECT DISTINCT * FROM sales_raw WHERE product_code <> 'TEST') WHERE txn_date LIKE '2026-%' OR txn_date LIKE '__/__/2026') SELECT SUM(c.qty * c.unit_price - c.discount - c.qty * cp.unit_cost) FROM c JOIN cost_prices cp ON cp.product_code = c.product_code AND cp.effective_from = '2026-01-01' JOIN products p ON p.product_code = c.product_code WHERE p.category = 'Solar & power'",
  "hint": "Gross profit filtered to the Solar & power category and to 2026.",
  "explanation": "₦124.3m, against ₦64.2m from phones. Solar is now Voltline's biggest profit earner.",
  "required": true
}
```

```answer
{
  "id": "cap-04-p3",
  "prompt": "Across all stores, what was **Target Attainment %** for **January to June 2026**? One decimal place.",
  "answer": 101.4,
  "format": "percent",
  "dataset": "retail",
  "files": ["sales_raw", "targets"],
  "verify": "SELECT ROUND(100.0 * (SELECT SUM(qty * unit_price - discount) FROM (SELECT DISTINCT * FROM sales_raw WHERE product_code <> 'TEST') WHERE txn_date LIKE '2026-%' OR txn_date LIKE '__/__/2026') / (SELECT SUM(net_sales_target) FROM targets WHERE month >= '2026-01'), 1)",
  "hint": "Net sales for 2026 divided by the sum of the 2026 targets.",
  "explanation": "Just over 100% for the chain, but that hides a wide range by store, which is lesson 5's job.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Joining 27,588 sales lines to cost_prices on product code gives 55,176 rows. What happened?",
    "options": ["The data doubled overnight", "Each product has two cost rows, so every sale matched both; the lookup must pick the cost in force on the sale date", "The join is correct", "Duplicates weren't removed"],
    "answer": 1,
    "explanation": "Always check the row count after a join or lookup."
  },
  {
    "prompt": "Why does 2025's gross margin come out at −2.7% with the latest costs?",
    "options": ["Voltline lost money in 2025", "2025 sales at 2025 prices were costed at the higher 2026 costs", "The margins are wrong in the source", "Returns were included"],
    "answer": 1,
    "explanation": "Use the cost in force on each sale date."
  },
  {
    "prompt": "Targets are monthly. At what level can a Target measure be shown meaningfully?",
    "options": ["Any level, including single days", "Month, quarter, year: the target's grain or coarser", "Only the grand total", "Only by product"],
    "answer": 1,
    "explanation": "Below the target's grain, the number repeats or misleads."
  }
]
```
