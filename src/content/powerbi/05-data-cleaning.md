---
title: Data cleaning in Power Query
minutes: 40
summary: Clean a messy export with Trim, Capitalize Each Word, Replace Values, locale-aware dates and case-sensitive duplicate removal.
---

## The problem

Kolanut's customer list exported from its old system has stray spaces, random capitals, 23 spellings of six regions, three date formats, money stored as text and 12 customers listed twice. In Excel you'd clean it with formulas. In Power Query you clean it with steps, and when next month's export arrives with the same problems, one refresh cleans it again.

```dataset
{ "dataset": "cleaning", "files": ["customer_list_raw"] }
```

## The concept

**Text cleaning** (select column → **Transform → Format**):

| Command | Does |
| :-- | :-- |
| **Trim** | Removes spaces at the start and end. Unlike Excel's TRIM, it leaves repeated spaces *inside* the text |
| **Clean** | Removes invisible control characters |
| **lowercase / UPPERCASE / Capitalize Each Word** | Changes case |

**Replace Values** (Transform → Replace Values) swaps one value for another in a column: `SW` → `South West`. For many variants, it's cleaner to lower-case and trim first, which collapses `Lagos`, `LAGOS` and `lagos ` into one, then replace what's left.

**Types with a locale.** Right-click a column → **Change Type → Using Locale…** Choose the type and the *locale the data was written in*. **English (United Kingdom)** reads `01/09/2022` as 1 September. The same step handles ISO dates like `2023-07-11` and text like `5-Mar-2024`.

![The data type menu of a Power Query column header, listing Decimal Number, Fixed decimal number, Whole Number and others, with Using Locale at the bottom.](/images/courses/powerbi/type-menu.webp "Click the type icon on any column header for this menu. Decimal Number is at the top (1); Using Locale is at the bottom (2).")

**Errors.** When a type change fails on some rows, those cells show **Error**. Right-click the column → **Replace Errors**, or better, find out why first with **Keep Rows → Keep Errors**.

**Removing duplicates is case-sensitive in Power Query.** `Ada Superstore` and `ADA SUPERSTORE` are *different* to it (Excel would treat them as the same). So fix case and spaces **before** Home → Remove Rows → **Remove Duplicates**.

## Example

Credit limits like `₦2,050,000`, `1,200,000`, `850000` and `1,400,000.00`:

1. Replace Values: `₦` → (nothing).
2. Replace Values: `,` → (nothing).
3. Change Type → **Decimal Number** (it reads `1400000.00` fine), or Whole Number after removing `.00`.
4. Blanks become `null`, which is correct: the limit is unknown.

## Walkthrough

1. **Get data → Text/CSV** → `customer_list_raw.csv` → **Transform Data**.
2. Rename the query `customers_clean`.
3. **Customer Name**: Transform → Format → **Trim**, then **Clean**, then **Capitalize Each Word**.
4. **Region**: Format → **Trim**, then **lowercase**. Now Replace Values for each remaining variant, lower-case to proper name:
   - `lagos` → `Lagos`
   - `south west`, `south-west`, `sw` → `South West`
   - and the same for South East (`se`), South South (`ss`), North Central (`nc`), North West (`nw`).

   Check with the column's filter drop-down: exactly six values should remain.
5. **City**: Trim, Capitalize Each Word.
6. **Date Joined**: right-click → **Change Type → Using Locale** → Date, **English (United Kingdom)**.
7. **Credit Limit**: Replace `₦` and `,` with nothing, then Change Type → Decimal Number.
8. Select **Customer Name** → **Home → Remove Rows → Remove Duplicates**.
9. Check the row count at the bottom of the editor, then **Close & Apply**.

Look at **Applied Steps**: that list is your cleaning log.

> [!WARNING]
> Remove Duplicates keeps the **first** copy it meets. If one copy of a customer has a credit limit and the other is blank, sort by Credit Limit descending first (so values come before nulls), and add **Table.Buffer** in the formula bar around the sort step if the order isn't respected. Otherwise you may keep the blank copy.

## Practice

```answer
{
  "id": "pbi-05-p1",
  "prompt": "After cleaning and removing duplicates, how many rows does `customers_clean` have?",
  "answer": 90,
  "format": "number",
  "dataset": "cleaning",
  "files": ["customer_list_raw"],
  "verify": "SELECT COUNT(DISTINCT LOWER(TRIM(\"Customer Name\"))) FROM customer_list_raw",
  "hint": "If you get more than 90, check that you trimmed and fixed capitals before removing duplicates: Power Query is case-sensitive.",
  "required": true
}
```

```answer
{
  "id": "pbi-05-p2",
  "prompt": "How many customers are in the **North West** region after cleaning?",
  "answer": 11,
  "format": "number",
  "dataset": "cleaning",
  "files": ["customer_list_raw"],
  "verify": "SELECT COUNT(*) FROM sales_customers WHERE region = 'North West'",
  "hint": "North West appears as North West, North-West, north west and NW in the raw file. After replacing them all and removing duplicates, count with a Card or the column profile.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In Power Query, 'Ada Superstore' and 'ADA SUPERSTORE' are:",
    "options": ["Duplicates, removed together", "Different values, until you make the case consistent", "An error", "Merged automatically"],
    "answer": 1,
    "explanation": "Power Query compares text case-sensitively."
  },
  {
    "prompt": "Dates like 01/09/2022 load as 9 January instead of 1 September. What should you set when changing the type?",
    "options": ["The locale, e.g. English (United Kingdom)", "The font", "The chart type", "The column width"],
    "answer": 0,
    "explanation": "Change Type → Using Locale reads the dates day-first."
  },
  {
    "prompt": "Why is Power Query cleaning better than cleaning by hand when a new export arrives every month?",
    "options": ["It's more colourful", "The recorded steps repeat automatically on refresh", "It deletes the raw data", "It doesn't need a computer"],
    "answer": 1,
    "explanation": "Clean once, refresh forever, as long as the export keeps the same structure."
  }
]
```
