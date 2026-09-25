---
title: Data cleaning in Excel
minutes: 45
summary: Clean a real messy export with TRIM, PROPER, SUBSTITUTE, VALUE, Remove Duplicates, a mapping table and Power Query's locale-aware dates.
---

## The problem

Kolanut's customer list, exported from its old system, is a mess: names with stray spaces and random capitals, regions spelled 23 different ways, three date formats, credit limits stored as text with `₦` signs, and 12 customers listed twice. The new system needs a clean list, and finance wants the total credit extended to customers.

```dataset
{ "dataset": "cleaning", "files": ["customer_list_raw"] }
```

## The concept

**Text functions for cleaning**

| Function | Does | Example |
| :-- | :-- | :-- |
| `TRIM(x)` | Removes spaces at the start and end, and repeated spaces inside | `"  Ada  Mart "` → `"Ada Mart"` |
| `CLEAN(x)` | Removes invisible non-printing characters (common in exports) | |
| `PROPER(x)` | Capitalises Each Word | `"PEACE MART"` → `"Peace Mart"` |
| `UPPER(x)`, `LOWER(x)` | All capitals / all lower case | |
| `SUBSTITUTE(x, old, new)` | Replaces every `old` with `new` | remove `₦`: `SUBSTITUTE(x,"₦","")` |
| `VALUE(x)` | Turns text that looks like a number into a number | `"1200000"` → 1200000 |

Functions can be nested. A clean credit limit from text like `₦1,200,000.00`:

```excel
=IFERROR(VALUE(SUBSTITUTE(SUBSTITUTE(TRIM([@[Credit Limit]]),"₦",""),",","")), "")
```

(Inside the brackets of a Table reference, a column name with a space needs its own brackets: `[@[Credit Limit]]`.)

**Standardising categories with a mapping table.** Don't write a giant nested IF for 23 region spellings. Make a two-column table, `RegionMap`, with every messy spelling (in lower case) and its clean version, then look it up:

| raw | clean |
| :-- | :-- |
| lagos | Lagos |
| sw | South West |
| south-west | South West |
| south west | South West |
| … | … |

```excel
=XLOOKUP(LOWER(TRIM([@Region])), RegionMap[raw], RegionMap[clean], "CHECK")
```

Anything that shows `CHECK` is a spelling you haven't mapped yet.

**Remove duplicates** (**Data → Remove Duplicates**) deletes rows that repeat in the columns you choose. Excel ignores capital letters when comparing, but **not** spaces, so trim first.

**Dates: the trap.** The export mixes `2023-07-11`, `22/10/2023` and `5-Mar-2024`. On a computer set to US format, Excel reads `01/09/2022` as **9 January** and leaves `22/10/2023` as text, because there is no 22nd month. Half your dates are wrong and the other half aren't dates. The reliable fix is to import through Power Query and tell it the dates are day-first:

1. **Data → From Text/CSV** → choose the file → **Transform Data**.
2. Right-click the **Date Joined** column → **Change Type → Using Locale…**
3. Data type **Date**, locale **English (United Kingdom)** (day-first), OK.
4. **Home → Close & Load**.

Check a few rows against the raw file afterwards: `01/09/2022` should now be 1 September 2022.

## Example

| Raw | Clean |
| :-- | :-- |
| `kayode distributors   ` · `LAGOS` · `22/10/2023` · `₦2,050,000` | Kayode Distributors · Lagos · 22 Oct 2023 · 2,050,000 |
| `  ADA SUPERSTORE` · `Lagos` · `2023-07-11` · `1,200,000` | Ada Superstore · Lagos · 11 Jul 2023 · 1,200,000 |
| `Hajia Amina Superstore` · `north central` · `21/04/2023` · `850000` | Hajia Amina Superstore · North Central · 21 Apr 2023 · 850,000 |

## Walkthrough

A clean, repeatable workflow:

1. **Keep the raw sheet untouched.** Load the file (with the Power Query date fix above) into a sheet called `Raw`.
2. **Add helper columns** next to the data, one per cleaned field:
   - `Name`: `=PROPER(TRIM(CLEAN([@[Customer Name]])))`
   - `Region clean`: the XLOOKUP on `RegionMap`
   - `Limit`: the nested SUBSTITUTE/VALUE formula
3. **Filter each helper column** for `CHECK`, errors and blanks, and fix the mapping until none are left.
4. **Copy the helper columns** and paste them into a new sheet `Clean` with **Paste Special → Values** (Ctrl + Alt + V, then V). They're now fixed values, not formulas.
5. On `Clean`, **Data → Remove Duplicates** on the name column.
6. **Log it**: on a `Notes` sheet, write what you did and the row counts before and after (102 → 90).

> [!TIP]
> Flash Fill (**Data → Flash Fill**, or Ctrl + E) is handy for one-off pattern cleaning: type the cleaned version of the first two cells yourself and Excel guesses the rest. Always check its guesses; it can't explain its rule.

## Practice

```answer
{
  "id": "xls-07-p1",
  "prompt": "Before any cleaning, how many rows of the raw export have a **blank** Credit Limit?",
  "answer": 5,
  "format": "number",
  "dataset": "cleaning",
  "files": ["customer_list_raw"],
  "verify": "SELECT COUNT(*) FROM customer_list_raw WHERE \"Credit Limit\" IS NULL OR TRIM(\"Credit Limit\") = ''",
  "hint": "=COUNTBLANK() on the Credit Limit column, or filter it to (Blanks).",
  "explanation": "Five blanks. Decide on a rule, such as leaving them blank and flagging them for the finance team, rather than guessing a number.",
  "required": true
}
```

```answer
{
  "id": "xls-07-p2",
  "prompt": "After trimming, standardising regions and removing duplicates, how many customers are in the **Lagos** region?",
  "answer": 34,
  "format": "number",
  "dataset": "cleaning",
  "files": ["customer_list_raw"],
  "verify": "SELECT COUNT(*) FROM sales_customers WHERE region = 'Lagos'",
  "hint": "Lagos appears as Lagos, LAGOS, lagos and 'Lagos ' (with a space). Map them all to Lagos, remove duplicate names, then COUNTIF.",
  "explanation": "34. Counting before removing duplicates gives a higher number; counting before standardising gives a lower one.",
  "required": true
}
```

```answer
{
  "id": "xls-07-p3",
  "prompt": "After fixing the dates (day first) and removing duplicates, how many customers joined in the **first half of 2024** (1 January to 30 June 2024)?",
  "answer": 5,
  "format": "number",
  "dataset": "cleaning",
  "files": ["customer_list_raw"],
  "verify": "SELECT COUNT(*) FROM sales_customers WHERE joined_date BETWEEN '2024-01-01' AND '2024-06-30'",
  "hint": "Convert Date Joined with Power Query → Change Type → Using Locale → English (United Kingdom). Then COUNTIFS with two date conditions.",
  "explanation": "Five. If the dates were read month-first, some would land in the wrong half of the year, and you'd get a different count.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "xls-07-c1",
  "prompt": "What is the **total credit limit** of the cleaned, de-duplicated customers, counting only customers whose limit is known? Where a customer appears twice and only one copy has a limit, keep the copy with the limit.",
  "answer": 133500000,
  "tolerance": 1,
  "format": "naira",
  "dataset": "cleaning",
  "files": ["customer_list_raw"],
  "verify": "SELECT SUM(credit_limit) FROM sales_customers WHERE LOWER(customer_name) <> 'bola mini mart'",
  "hint": "Clean the limits to numbers. Before removing duplicates, sort the limit column largest to smallest so rows with a value come first: Remove Duplicates keeps the first copy it meets.",
  "explanation": "₦133,500,000 for 89 customers. Four of the five blanks were on duplicate rows whose other copy had the limit; one customer (Bola Mini Mart) has no limit on file at all, which is something to send back to the finance team, not to guess.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does =TRIM(\"  Peace   Mart \") return?",
    "options": ["\"Peace   Mart\"", "\"Peace Mart\"", "\"PeaceMart\"", "\"  Peace Mart\""],
    "answer": 1,
    "explanation": "Excel's TRIM removes leading and trailing spaces and reduces repeated inner spaces to one."
  },
  {
    "prompt": "Why use a mapping table instead of a long nested IF to standardise regions?",
    "options": ["IF can't compare text", "A table is easier to read, extend and check, and unmapped values show up clearly", "Mapping tables are faster to type than one word", "Excel limits IF to two regions"],
    "answer": 1,
    "explanation": "Adding a new spelling is one new row, not a rewritten formula."
  },
  {
    "prompt": "On a US-format computer, how might Excel read the text 01/09/2022 from a Nigerian export?",
    "options": ["1 September 2022", "9 January 2022", "As an error", "As 2022-09-01 text"],
    "answer": 1,
    "explanation": "US format reads month first. Import with a day-first locale to get 1 September."
  }
]
```
