---
title: Clean and prepare
minutes: 25
summary: Turn the raw till export into a clean sales table you can rerun, in Power Query, SQL or pandas, and reconcile it with the raw data so you can prove nothing was lost.
---

## The problem

You have a data quality log with five decisions in it. Now you have to carry them out, and in a way that survives next month. Voltline's tills export a new file every month with the same problems. If your cleaning is a series of manual edits in Excel, you'll redo it every month, slightly differently each time, and nobody will be able to check it.

The goal is a cleaning process that's **repeatable** (rerun it on new data with one click or one command), **documented** (each step says what it does), and **reconciled** (you can show exactly which rows were removed and why).

## The concept

**The cleaning steps for Voltline**

1. **Remove exact duplicate rows** (Surulere's double upload).
2. **Exclude test transactions** (`product_code = 'TEST'`).
3. **Take the store from the transaction ID**: the first three characters of `txn_id`.
4. **Convert dates to real dates**, reading `DD/MM/YYYY` day first.
5. **Calculate net sales**: `qty × unit_price − discount`. Returns have a negative quantity and a negative discount, so they reduce net sales automatically.
6. **Keep the raw columns** you might need later, and **drop** the ones you've replaced (`branch`).

**The order matters.** Remove duplicates *before* you calculate anything. Exclude test rows *before* you check the totals. And convert dates *before* you filter by month.

**Reconcile**

Write down the row counts at every step: raw rows, minus duplicates, minus test rows, equals clean rows. If the counts don't add up, a step did something you didn't intend. It's the cleaning equivalent of balancing a bank statement.

## Example

The same cleaning in three tools. Pick the one you'll use for the project.

**SQL** (in SQLite, DB Browser for SQLite or any database you load the CSVs into):

```sql
CREATE VIEW sales_clean AS
SELECT DISTINCT
  txn_id,
  line_no,
  substr(txn_id, 1, 3) AS store_code,
  CASE
    WHEN txn_date LIKE '__/__/____'                     -- Port Harcourt: DD/MM/YYYY
      THEN substr(txn_date, 7, 4) || '-' || substr(txn_date, 4, 2) || '-' || substr(txn_date, 1, 2)
    ELSE txn_date
  END AS sale_date,
  product_code,
  qty,
  unit_price,
  discount,
  qty * unit_price - discount AS net_sales,
  payment_method
FROM sales_raw
WHERE product_code <> 'TEST';
```

**pandas**:

```python
import pandas as pd

raw = pd.read_csv("raw/sales_raw.csv", dtype={"txn_date": str})
sales = (
    raw.drop_duplicates()
       .query("product_code != 'TEST'")
       .assign(
           store_code=lambda d: d["txn_id"].str[:3],
           sale_date=lambda d: pd.to_datetime(d["txn_date"], format="mixed", dayfirst=True),
           net_sales=lambda d: d["qty"] * d["unit_price"] - d["discount"],
       )
       .drop(columns=["branch", "txn_date"])
)
print(len(raw), len(raw.drop_duplicates()), len(sales))
```

**Power Query**: Home → Remove Rows → **Remove Duplicates**; filter `product_code` to exclude TEST; **Add Column → Extract → First Characters** (3) on `txn_id`; for the date, add a custom column that uses `Date.FromText([txn_date], [Format = "dd/MM/yyyy"])` when the text contains "/" and `Date.FromText([txn_date])` otherwise; then a custom column for net sales.

> [!WARNING]
> `dayfirst=True` with `format="mixed"` reads every date day first when it's ambiguous, which is right for `14/03/2025` and harmless for `2025-03-14`. Never let a tool guess silently: check a known Port Harcourt row, such as 3 April, before and after converting.

## Walkthrough

1. Copy the raw files into a `raw/` folder and never edit them.
2. Build your cleaning steps in your chosen tool, one step at a time, checking the row count after each.
3. Fill in a reconciliation table: raw rows → after removing duplicates → after removing test rows. It should read 27,978 → 27,602 → 27,588.
4. Check the date conversion: count rows per month for Port Harcourt. Every month from January 2025 to June 2026 should appear, with no dates after June 2026.
5. Check net sales: returns should appear as negative net sales, and the total for a test day should match a hand calculation of a few lines.
6. Save the clean table to `clean/sales_clean.csv` (or keep the query or view), and note the steps in your cleaning log.

## Practice

```answer
{
  "id": "cap-03-p1",
  "prompt": "After cleaning, what is total **net sales** across the whole period (January 2025 to June 2026)? (A rounded figure is fine.)",
  "answer": 5811600950,
  "format": "naira",
  "dataset": "retail",
  "files": ["sales_raw"],
  "verify": "SELECT SUM(qty * unit_price - discount) FROM (SELECT DISTINCT * FROM sales_raw WHERE product_code <> 'TEST')",
  "hint": "Remove duplicates and test rows first, then sum qty × unit_price − discount.",
  "explanation": "₦5.81bn. Without removing the duplicates, you'd report about ₦65m more, all of it a second copy of Surulere's November.",
  "required": true
}
```

```answer
{
  "id": "cap-03-p2",
  "prompt": "After cleaning, how many lines are **returns** (negative quantity)?",
  "answer": 577,
  "format": "number",
  "dataset": "retail",
  "files": ["sales_raw"],
  "verify": "SELECT COUNT(*) FROM (SELECT DISTINCT * FROM sales_raw WHERE product_code <> 'TEST') WHERE qty < 0",
  "hint": "Count the clean rows where qty < 0.",
  "required": true
}
```

```answer
{
  "id": "cap-03-p3",
  "prompt": "What were Port Harcourt's net sales in **April 2026**? (A rounded figure is fine.) This checks your date conversion: get the day and month the wrong way round and the answer changes.",
  "answer": 35577150,
  "format": "naira",
  "dataset": "retail",
  "files": ["sales_raw"],
  "verify": "SELECT SUM(qty * unit_price - discount) FROM (SELECT DISTINCT * FROM sales_raw WHERE product_code <> 'TEST') WHERE substr(txn_id, 1, 3) = 'PHC' AND substr(txn_date, 4, 7) = '04/2026'",
  "hint": "Store code PHC, sale dates from 1 to 30 April 2026.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why remove duplicate rows before calculating any totals?",
    "options": ["It's faster", "Every total calculated before would include the duplicates, and they're easy to forget later", "Tools require it", "It doesn't matter when"],
    "answer": 1,
    "explanation": "Clean first, then calculate, in a fixed order you can repeat."
  },
  {
    "prompt": "Raw 27,978 rows; after removing duplicates 27,602; after removing test rows 27,588. What does this reconciliation prove?",
    "options": ["The data is perfect", "Exactly which rows were removed at each step, and that nothing else was lost", "The analysis is finished", "The dates are correct"],
    "answer": 1,
    "explanation": "Each step removed what it was meant to, and only that."
  },
  {
    "prompt": "Why is a cleaning process in Power Query, SQL or Python better than editing the file by hand in Excel?",
    "options": ["It looks more professional", "It can be rerun on next month's file and checked step by step", "Excel can't remove duplicates", "It's always faster the first time"],
    "answer": 1,
    "explanation": "Repeatable and documented beats quick and manual for anything you'll do more than once."
  }
]
```
