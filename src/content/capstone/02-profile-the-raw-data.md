---
title: Profile the raw data
minutes: 25
summary: Check every column of a raw till export systematically, find the problems before they find you, and decide what to do about each one.
---

## The problem

Before you calculate a single total, imagine the board meeting. A director asks, "How do you know these numbers are right?" If your answer is "I loaded the file and summed it", you're in trouble, because Voltline's till export has problems that would quietly inflate, split or distort almost every number in the report.

**Profiling** means looking at every column of every file systematically, before analysing anything, so you know exactly what you're dealing with. It's the step most beginners skip, and the step experienced analysts never do.

## The concept

### A profiling checklist

For each file, and each column in it:

| Check | Question | Finds |
| :-- | :-- | :-- |
| Row count | How many rows? Does that make sense? | missing or extra data |
| Key | Is the ID unique? Is the combination that should be unique, unique? | duplicates |
| Text values | What are the distinct values, and how many of each? | inconsistent spellings, stray spaces |
| Dates | What format? What's the earliest and latest? | mixed formats, impossible dates |
| Numbers | Min, max, any negatives or zeros? | returns, errors, outliers |
| Blanks | How many missing values per column? | gaps to explain |
| Relationships | Does every code match a row in its lookup file? | orphans, test data |

![Seven profiling checks and what each finds, and the three decisions every problem gets: fix it, exclude it or keep it](/images/courses/capstone/profiling-checks.svg "Seven checks, then a decision for every problem.")

### The same checks in each tool

| Check | Excel / Power BI | SQL | pandas |
| :-- | :-- | :-- | :-- |
| Distinct values and counts | Filter drop-down, or Power Query's **Column distribution** | `SELECT col, COUNT(*) … GROUP BY col` | `df['col'].value_counts()` |
| Min and max | `MIN`, `MAX`, or **Column profile** | `MIN(col)`, `MAX(col)` | `df.describe()` |
| Exact duplicate rows | Remove Duplicates (count the difference) | `COUNT(*)` against `COUNT(*)` of `SELECT DISTINCT *` | `df.duplicated().sum()` |
| Codes with no match | XLOOKUP returning `#N/A` | `LEFT JOIN … WHERE … IS NULL` | `merge(…, indicator=True)` |

In Power Query, turn on **View → Column quality, Column distribution and Column profile**, and set profiling to **the entire data set** (bottom-left of the window). By default it only profiles the first 1,000 rows, and most of Voltline's problems are further down.

### Every problem gets a decision

For each problem, record what you found, how many rows it affects and what you decided. Some problems you fix. Some you exclude. Some aren't problems at all (returns are real business events, not errors). That record, the **data quality log**, is what lets you answer the director's question.

## Example

Profiling the `branch` column in SQL:

```sql
SELECT branch, COUNT(*) AS lines
FROM sales_raw
GROUP BY branch
ORDER BY branch;
```

There are **10** distinct values for **8** stores. `IKEJA` and `Ikeja Store` are the same shop: the till's settings changed in September 2025. `Port Harcourt` and `P/Harcourt` are the same too, and `Yaba ` has a trailing space that you can't even see in Excel.

But look at `txn_id`: every ID starts with a three-letter **store code** (`IKJ-000123`), and those codes match `stores.csv` exactly. The branch text is unreliable; the code inside the ID isn't. Finding a reliable column to replace an unreliable one is a typical profiling win.

## Walkthrough

1. Profile `branch`, as in the example, and list the spellings for each store.
2. Profile `txn_date`. Most dates look like `2025-03-14`, but one store's look like `14/03/2025`. Which store? In Excel these may turn into real dates or stay as text depending on your settings, so check carefully.
3. Look for exact duplicate rows. In pandas, `df.duplicated().sum()`; in SQL, compare `COUNT(*)` with `SELECT COUNT(*) FROM (SELECT DISTINCT * FROM sales_raw)`. Then find which store and month they come from.
4. Profile `product_code` against `products.csv`. One code isn't in the product list. Look at those rows: their dates, prices and store.
5. Profile `qty`. Some values are negative. Look at a few: are they errors, or returns?
6. Check `stores.csv` against the sales: when did Lekki open, and do any sales appear before that?
7. Write each finding in your data quality log (the task below).

## Practice

```answer
{
  "id": "cap-02-p1",
  "prompt": "How many rows in sales_raw are **exact duplicates** of another row (the extra copies only)?",
  "answer": 376,
  "format": "number",
  "dataset": "retail",
  "files": ["sales_raw"],
  "verify": "SELECT COUNT(*) - (SELECT COUNT(*) FROM (SELECT DISTINCT * FROM sales_raw)) FROM sales_raw",
  "hint": "Total rows minus distinct rows. In Excel, copy the sheet, use Remove Duplicates and compare the counts.",
  "explanation": "376 rows, all from Surulere in November 2025: that month's file was uploaded twice. Left in, they'd add Black Friday sales to Surulere a second time.",
  "required": true
}
```

```answer
{
  "id": "cap-02-p2",
  "prompt": "How many rows have a product_code that **isn't in products.csv**?",
  "answer": 14,
  "format": "number",
  "dataset": "retail",
  "files": ["sales_raw", "products"],
  "verify": "SELECT COUNT(*) FROM sales_raw s LEFT JOIN products p ON p.product_code = s.product_code WHERE p.product_code IS NULL",
  "hint": "A LEFT JOIN (or XLOOKUP) from sales to products, counting the rows with no match.",
  "explanation": "14 rows with code TEST, priced at ₦1, at Lekki in the week before it opened: staff training on the new tills. They were never real sales, so exclude them.",
  "required": true
}
```

```answer
{
  "id": "cap-02-p3",
  "prompt": "How many rows have their date in **DD/MM/YYYY** format?",
  "answer": 3473,
  "format": "number",
  "dataset": "retail",
  "files": ["sales_raw"],
  "verify": "SELECT COUNT(*) FROM sales_raw WHERE txn_date LIKE '__/__/____'",
  "hint": "Count the dates containing a slash. In pandas: df['txn_date'].str.contains('/').sum().",
  "explanation": "Every Port Harcourt row: that store's till exports dates the British way. Read them as YYYY-MM-DD dates and 3 April becomes 4 March, or fails to convert at all.",
  "required": true
}
```

```task
{
  "id": "cap-02-t1",
  "prompt": "Write your **data quality log**: at least four problems you found in the raw data. Put each on its own line starting with `-`, in the form **Issue | Rows affected | Decision**, for example `- Trailing spaces in branch | 3,559 | trim, then map to store codes`.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "- Issue | Rows affected | Decision\n- ...",
  "rules": [
    { "label": "At least four entries, each a line starting with -", "pattern": "^\\s*-\\s+\\S", "min": 4 },
    { "label": "Each entry has three parts separated by |", "pattern": "^\\s*-[^|\\n]+\\|[^|\\n]+\\|[^|\\n]+$", "min": 4 },
    { "label": "Each entry gives a number of rows", "pattern": "^\\s*-[^|\\n]+\\|[^|\\n]*\\d", "min": 4 },
    { "label": "Covers the duplicate upload", "pattern": "duplicat" },
    { "label": "Covers the date format", "pattern": "date|dd/mm" },
    { "label": "Covers the test transactions", "pattern": "test" }
  ],
  "sample": "- Duplicate upload of Surulere's November 2025 file | 376 | remove exact duplicate rows\n- Port Harcourt dates in DD/MM/YYYY format | 3,473 | convert to real dates, day first\n- TEST product code at Lekki before opening (staff training) | 14 | exclude\n- Branch names spelled 10 ways for 8 stores (case, spaces, renamed in the till) | 27,978 | ignore branch; use the store code from txn_id\n- Negative quantities | 577 after removing duplicates | keep: these are returns, which reduce net sales",
  "note": "The last entry matters as much as the others: returns *look* like a problem but aren't one. Writing \"keep\" as the decision, with the reason, saves the next person from \"fixing\" them.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Power Query's column profile shows no problems in the date column. Why might it still have some?",
    "options": ["Power Query can't read dates", "By default it profiles only the first 1,000 rows; switch to the entire data set", "Dates never have problems", "The profile only checks text"],
    "answer": 1,
    "explanation": "Set column profiling to the entire data set at the bottom of the Power Query window."
  },
  {
    "prompt": "Some sales lines have a negative quantity. What should you do first?",
    "options": ["Delete them", "Look at them: they may be returns, which are real business events", "Change them to positive", "Average them"],
    "answer": 1,
    "explanation": "Investigate before deciding. Returns should reduce net sales, not be deleted."
  },
  {
    "prompt": "The branch column has 10 spellings for 8 stores, but txn_id starts with a reliable store code. What's the best approach?",
    "options": ["Fix each spelling by hand", "Use the store code from txn_id to identify the store", "Drop the branch column and ignore stores", "Use the most common spelling"],
    "answer": 1,
    "explanation": "Prefer a reliable field to patching an unreliable one, and note the decision in the log."
  }
]
```
