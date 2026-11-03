---
title: Data cleaning in Excel
minutes: 30
summary: Find and fix messy data step by step: TRIM, CLEAN, PROPER, SUBSTITUTE, VALUE, LEFT and RIGHT, mapping tables, Remove Duplicates and day-first dates.
---

## The problem

Kolanut's customer list, exported from its old system, is a mess: names with stray spaces and random capitals, regions spelled 23 different ways, three date formats, credit limits stored as text with `₦` signs, and 12 customers listed twice. The new system needs a clean list, and finance wants the total credit extended to customers.

```dataset
{ "dataset": "cleaning", "files": ["customer_list_raw"] }
```

## The concept

**Cleaning** means turning data that a person can read into data that a formula can trust. Excel treats `Lagos`, `LAGOS` and `Lagos ` (with a space) as text, and a SUMIFS for `"Lagos"` will miss the one with the space. A credit limit typed as `₦2,050,000` is text too, so `SUM` skips it without a word.

### Step 1: look before you fix

Before changing anything, find out what's wrong and how often. Here is what a quick inspection of the 102 rows of `customer_list_raw.csv` finds:

| Column | Problem | How many rows |
| :-- | :-- | --: |
| Customer Name | Spaces at the start | 22 |
| Customer Name | Spaces at the end | 28 |
| Customer Name | ALL CAPITALS / all lower case | 18 / 8 |
| Customer Name | The same customer listed twice | 12 pairs |
| Region | 23 different spellings of 6 regions | all |
| Phone | Three formats: `0803…`, `+234 803…`, `234803…`; some with spaces | 42 with spaces |
| Date Joined | Three formats: `2023-07-11`, `22/10/2023`, `15-May-2024` | 49 / 28 / 25 |
| Credit Limit | `₦` signs, commas, `.00` endings; 3 blank | 15 with ₦ |

Counting problems first matters for two reasons: you know when you've finished, and you can **prove** the fix worked by counting again afterwards.

Useful checks for finding problems:

| Check | Formula | TRUE means |
| :-- | :-- | :-- |
| Extra spaces | `=[@[Customer Name]]<>TRIM([@[Customer Name]])` | The value has stray spaces |
| Text, not a number | `=ISTEXT([@[Credit Limit]])` | SUM will skip it |
| Number | `=ISNUMBER([@[Credit Limit]])` | Ready to calculate with |
| Length | `=LEN([@Phone])` | (Returns the number of characters) |

> [!NOTE]
> Inside the brackets of a table reference, a column name with a space needs its own brackets: `[@[Customer Name]]`, not `[@Customer Name]`.

### TRIM

Removes spaces at the start and end, and turns runs of spaces inside the text into one.

```excel
=TRIM(text)
```

| Raw | `=TRIM(...)` | `LEN` before → after |
| :-- | :-- | :-- |
| `"kayode distributors   "` | `"kayode distributors"` | 22 → 19 |
| `"  ADA SUPERSTORE"` | `"ADA SUPERSTORE"` | 16 → 14 |
| `"  Peace   Mart "` | `"Peace Mart"` | 15 → 10 |

`TRIM` only removes the ordinary space character. Text copied from websites sometimes contains a **non-breaking space** (character 160) that `TRIM` leaves alone. If `TRIM` seems not to work, use `=TRIM(SUBSTITUTE(x, CHAR(160), " "))`.

### CLEAN

Removes invisible control characters, such as line breaks, that some systems put into exports.

```excel
=CLEAN(text)
```

You can't see what it removes, which is why it's often used together with TRIM as a matter of habit: `=TRIM(CLEAN(x))`.

### PROPER, UPPER and LOWER

Change the capitals.

| Function | Does | `"ADA SUPERSTORE"` becomes |
| :-- | :-- | :-- |
| `PROPER(text)` | Capital first letter of each word | `Ada Superstore` |
| `UPPER(text)` | ALL CAPITALS | `ADA SUPERSTORE` |
| `LOWER(text)` | all lower case | `ada superstore` |

`PROPER` is right for names, but check the results: it turns `ABC Stores` into `Abc Stores` and `McDonald` into `Mcdonald`. `LOWER` is useful for **matching**: compare lower-case versions and capitals stop mattering.

### SUBSTITUTE

Replaces every occurrence of some text with other text.

```excel
=SUBSTITUTE(text, old_text, new_text)
```

| You write | Result |
| :-- | :-- |
| `=SUBSTITUTE("₦2,050,000", "₦", "")` | `2,050,000` (still text) |
| `=SUBSTITUTE("2,050,000", ",", "")` | `2050000` (still text) |
| `=SUBSTITUTE("0915 628 5995", " ", "")` | `09156285995` |
| `=SUBSTITUTE("South-West", "-", " ")` | `South West` |

Replacing with `""` (nothing) deletes. To remove two different things, **nest** one SUBSTITUTE inside another: the inner one runs first.

### VALUE

Turns text that looks like a number into a real number.

```excel
=VALUE(text)
```

`=VALUE("2050000")` gives the number 2,050,000, which now sits on the **right** of the cell and can be summed. `VALUE` can't cope with a `₦` sign, so remove that first. Putting it all together for a credit limit:

```excel
=IFERROR(VALUE(SUBSTITUTE(SUBSTITUTE(TRIM([@[Credit Limit]]),"₦",""),",","")), "")
```

Read it from the inside out:

1. `TRIM(...)`: `"₦2,050,000"` (no change here, but it handles stray spaces)
2. `SUBSTITUTE(..., "₦", "")`: `"2,050,000"`
3. `SUBSTITUTE(..., ",", "")`: `"2050000"`
4. `VALUE(...)`: the number 2050000. `"500,000.00"` becomes 500000 the same way.
5. `IFERROR(..., "")`: a blank limit gives an error at step 4, so show a blank instead.

### LEFT, RIGHT, MID and LEN

Take part of a text value.

| Function | Returns | Example | Result |
| :-- | :-- | :-- | :-- |
| `LEFT(text, n)` | The first n characters | `=LEFT("08089165939", 4)` | `0808` |
| `RIGHT(text, n)` | The last n characters | `=RIGHT("2348136236612", 10)` | `8136236612` |
| `MID(text, start, n)` | n characters from position start | `=MID("2023-07-11", 6, 2)` | `07` |
| `LEN(text)` | How many characters | `=LEN("08089165939")` | 11 |

These are perfect for the phone numbers. Every Nigerian mobile number ends in the same 10 digits, whatever the prefix: `08136236612`, `+234 813 623 6612` and `2348136236612` are all the same phone. So remove spaces and `+`, keep the last 10 digits, and put a `0` in front:

```excel
="0"&RIGHT(SUBSTITUTE(SUBSTITUTE([@Phone]," ",""),"+",""),10)
```

All 102 phones come out as 11 digits starting `07`, `08` or `09`. The `&` joins text, and keeping the result as **text** protects the leading zero.

> [!WARNING]
> Never let Excel store a phone number as a number: it drops the leading `0` and may show long ones as `8.09E+09`. Phone numbers, account numbers and IDs with leading zeros are **text**.

### Standardising categories with a mapping table

The Region column has 23 spellings of 6 regions. After `LOWER(TRIM(...))` there are still 16: `south west`, `south-west`, `sw` and so on. You could write a huge nested IF, but a **mapping table** is easier to read, check and extend.

Make a two-column table called `RegionMap` with every messy spelling (lower case, trimmed) and its clean version:

| raw | clean |
| :-- | :-- |
| lagos | Lagos |
| sw | South West |
| south-west | South West |
| south west | South West |
| se | South East |
| … | … |

Then look each row up with XLOOKUP from lesson 6:

```excel
=XLOOKUP(LOWER(TRIM([@Region])), RegionMap[raw], RegionMap[clean], "CHECK")
```

Anything that shows `CHECK` is a spelling you haven't mapped yet. Add a row to `RegionMap` and it fixes itself. When nothing shows `CHECK`, every row has one of the six clean regions.

### Remove Duplicates

**Data → Remove Duplicates** deletes rows that repeat in the columns you choose, keeping the **first** copy it meets.

Two things decide whether it works:

1. **Clean first.** Excel ignores capitals when comparing, but not spaces: `Ada Stores` and `Ada Stores   ` look like two customers. Trim before removing duplicates.
2. **Choose the columns.** Tick only the columns that define "the same customer", here the cleaned name. With every column ticked, two copies count as duplicates only if every column matches exactly.

Because it keeps the first copy, **sort first** if one copy is better. To keep the copy that has a credit limit, sort the limit column largest to smallest before removing duplicates.

To **find** duplicates without deleting anything, count each name: `=COUNTIF([Name], [@Name])`. Anything above 1 appears more than once.

### Dates: the trap

The export mixes `2023-07-11`, `22/10/2023` and `15-May-2024`. On a computer set to US format, Excel reads `01/09/2022` as **9 January** and leaves `22/10/2023` as text, because there is no 22nd month. Half your dates are wrong and the other half aren't dates.

You can spot the problem: real dates sit on the **right** of the cell, text dates on the **left**, and `=ISNUMBER([@[Date Joined]])` is FALSE for text.

The reliable fix is to import through **Power Query** and tell it the dates are day-first:

1. **Data → From Text/CSV** → choose the file → **Transform Data**.
2. Right-click the **Date Joined** column → **Change Type → Using Locale…**
3. Data type **Date**, locale **English (United Kingdom)** (day-first), OK.
4. **Home → Close & Load**.

Check a few rows against the raw file afterwards: `01/09/2022` should now be 1 September 2022, and `15-May-2024` should be 15 May 2024.

### Import it properly first

Opened with **Data → From Text/CSV**, the messy file comes in far better than by double-clicking:

![The From Text/CSV preview of the messy customer export: File Origin is UTF-8, phone numbers keep their leading zeros, dates and credit limits are recognised.](/images/courses/excel/import-messy.webp "Excel's import preview for the messy export.")

1. **File Origin: 65001 Unicode (UTF-8)**, so `₦` is read correctly.
2. **Phone** stays as text, leading zeros intact.
3. **Date Joined** is recognised as dates. It read them day-first because this computer uses a UK date format. On a US-format computer, change the type with a locale in Power Query, as described above.
4. **Credit Limit** is recognised as numbers; the blank one shows as `null`.

Import gives the cleanest starting point, but names, regions and duplicates still need fixing, and that's what the formulas do.

## Example

Three raw rows, and what the cleaning formulas make of them:

| Raw | Clean |
| :-- | :-- |
| `kayode distributors   ` · `LAGOS` · `22/10/2023` · `₦2,050,000` | Kayode Distributors · Lagos · 22 Oct 2023 · 2,050,000 |
| `  ADA SUPERSTORE` · `Lagos` · `2023-07-11` · `1,200,000` | Ada Superstore · Lagos · 11 Jul 2023 · 1,200,000 |
| `Hajia Amina Superstore` · `north central` · `21/04/2023` · `850000` | Hajia Amina Superstore · North Central · 21 Apr 2023 · 850,000 |

Each cleaned value is one formula from this lesson. The name is `PROPER(TRIM(...))`, the region is the `RegionMap` lookup, the date is the Power Query locale, and the limit is the nested `SUBSTITUTE`/`VALUE`.

## Walkthrough

A clean, repeatable workflow:

1. **Keep the raw sheet untouched.** Load the file (with the Power Query date fix above) into a sheet called `Raw`. If something goes wrong later, you can always start again from it.
2. **Count the problems** with the checks from step 1 of this lesson, and write the counts down.
3. **Add helper columns** next to the data, one per cleaned field:
   - `Name`: `=PROPER(TRIM(CLEAN([@[Customer Name]])))`
   - `Region clean`: the XLOOKUP on `RegionMap`
   - `Phone clean`: the `RIGHT`/`SUBSTITUTE` formula
   - `Limit`: the nested `SUBSTITUTE`/`VALUE` formula

   Here are the helper columns on Kolanut's export, next to the raw data:

   ![The raw customer export with helper columns Name, Region clean and Limit added on the right; the formula bar shows the nested SUBSTITUTE and VALUE formula.](/images/courses/excel/cleaning.webp "Raw columns (1, 2) and their cleaned versions (4), built by formulas like the one in the formula bar (3).")

4. **Filter each helper column** for `CHECK`, errors and blanks, and fix the mapping until none are left.
5. **Copy the helper columns** and paste them into a new sheet `Clean` with **Paste Special → Values** (Ctrl + Alt + V, then V). They're now fixed values, not formulas.
6. On `Clean`, sort by `Limit` largest to smallest, then **Data → Remove Duplicates** (Alt, A, M) on the name column:

   ![The Remove Duplicates dialog listing the table's columns with tick boxes, and My data has headers ticked.](/images/courses/excel/remove-duplicates.webp "Remove Duplicates. Tick only the columns that define a duplicate (1): here, just the cleaned name.")

   1. **Columns**: untick everything except the cleaned name.
   2. **My data has headers** keeps the header row out of the comparison.
   3. **OK** reports how many duplicates were removed (12 here) and how many unique rows remain (90).
7. **Count again.** Six distinct regions, 90 customers, 90 distinct phones, every limit a number or blank.
8. **Log it**: on a `Notes` sheet, write what you did and the row counts before and after (102 → 90). Someone will ask.

> [!WARNING]
> If a formula shows up as text instead of calculating, the column was formatted as **Text** (common after importing with text columns). Set the column to **General** (Home → Number format), then click the cell, press **F2** and **Enter**.

> [!TIP]
> Flash Fill (**Data → Flash Fill**, or Ctrl + E) is handy for one-off pattern cleaning: type the cleaned version of the first two cells yourself and Excel guesses the rest. Always check its guesses; it can't explain its rule, and it won't update when the data changes.

### Summary

| Problem | Fix |
| :-- | :-- |
| Stray spaces | `TRIM` (and `SUBSTITUTE(x, CHAR(160), " ")` for web spaces) |
| Invisible characters | `CLEAN` |
| Random capitals | `PROPER`, `UPPER`, `LOWER` |
| Unwanted characters (₦, commas, dashes) | `SUBSTITUTE(x, old, "")` |
| Numbers stored as text | `VALUE` after removing symbols |
| Part of a value | `LEFT`, `RIGHT`, `MID`, `LEN` |
| Many spellings of one category | A mapping table and `XLOOKUP` |
| Repeated rows | Clean, sort, then Data → Remove Duplicates |
| Mixed date formats | Power Query → Change Type → Using Locale |

## Practice

```answer
{
  "id": "xls-07-p1",
  "prompt": "Before any cleaning, how many rows of the raw export have a **blank** Credit Limit?",
  "answer": 3,
  "format": "number",
  "dataset": "cleaning",
  "files": ["customer_list_raw"],
  "verify": "SELECT COUNT(*) FROM customer_list_raw WHERE \"Credit Limit\" IS NULL OR TRIM(\"Credit Limit\") = ''",
  "hint": "=COUNTBLANK() on the Credit Limit column, or filter it to (Blanks).",
  "explanation": "Three blanks. Decide on a rule, such as leaving them blank and flagging them for the finance team, rather than guessing a number.",
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
  "answer": 132950000,
  "tolerance": 1,
  "format": "naira",
  "dataset": "cleaning",
  "files": ["customer_list_raw"],
  "verify": "SELECT SUM(credit_limit) FROM sales_customers WHERE LOWER(customer_name) NOT IN ('bola mini mart', 'ada provisions')",
  "hint": "Clean the limits to numbers. Before removing duplicates, sort the limit column largest to smallest so rows with a value come first: Remove Duplicates keeps the first copy it meets.",
  "explanation": "₦132,950,000 for 88 customers. Two customers have no limit on file at all: Ada Provisions (blank on both of its copies) and Bola Mini Mart. That goes back to the finance team; it isn't something to guess.",
  "required": false
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "xls-07-d1",
  "prompt": "Before cleaning anything: how many rows of `customer_list_raw.csv` have a **Customer Name with extra spaces** at the start or end?",
  "answer": 42,
  "format": "number",
  "dataset": "cleaning",
  "files": [
    "customer_list_raw"
  ],
  "verify": "SELECT COUNT(*) FROM customer_list_raw WHERE \"Customer Name\" <> TRIM(\"Customer Name\")",
  "hint": "Add a helper column =[@[Customer Name]]<>TRIM([@[Customer Name]]) and count the TRUEs.",
  "explanation": "Finding the problems before you fix them is half of cleaning: you can then check the fix worked.",
  "required": false
}
```

```answer
{
  "id": "xls-07-d2",
  "prompt": "How many rows of the raw export have a **Phone** number containing a space?",
  "answer": 42,
  "format": "number",
  "dataset": "cleaning",
  "files": [
    "customer_list_raw"
  ],
  "verify": "SELECT COUNT(*) FROM customer_list_raw WHERE \"Phone\" LIKE '% %'",
  "hint": "=ISNUMBER(SEARCH(\" \", [@Phone])) in a helper column, then count TRUE. Or filter Phone with 'Contains' and a space.",
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
