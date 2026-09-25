---
title: Data cleaning
minutes: 30
summary: The problems real data arrives with, how they mislead you, and a safe way to fix them.
---

## The problem

Kolanut is moving to a new system, and IT has exported the customer list from the old one. Open it and something is off straight away: some names are in capitals, some have spaces before them, Lagos is written four different ways, and a few customers appear twice.

If you counted customers in this file, you'd get the wrong number. If you totalled sales by region, "Lagos" and "LAGOS" would appear as two different regions. **Data cleaning** is fixing problems like these before you analyse.

## The concept

The most common problems:

| Problem | Example | What it breaks |
| :-- | :-- | :-- |
| **Duplicates** | The same customer listed twice | Counts and totals come out too high |
| **Inconsistent labels** | `Lagos`, `LAGOS`, `lagos`, `Lagos ` | Groups split into several |
| **Extra spaces** | `"  Ada Superstore"` | Matching and lookups fail silently |
| **Mixed formats** | `2023-07-11`, `11/07/2023`, `11-Jul-2023` | Dates sort and group wrongly |
| **Numbers stored as text** | `"₦1,200,000"` | Sums return 0 or an error |
| **Missing values** | A blank credit limit | Averages and totals change meaning |
| **Outliers** | A quantity of 10,000 when most are under 40 | Averages are dragged up; could be a typo |

**Rules for cleaning safely**

1. **Never edit the original.** Keep the raw file untouched; work on a copy.
2. **Keep a cleaning log.** Write down each change: what, why, how many rows. Anyone can then repeat or question your work.
3. **Fix the cause when you can.** If the old system allowed free-typed regions, the new one should use a drop-down list.
4. **Don't guess silently.** If a value is missing, decide on a rule (leave blank, mark "Unknown") and state it.

## Example

Four rows from the raw export:

| Customer Name | Region | Date Joined | Credit Limit |
| :-- | :-- | :-- | :-- |
| `kayode distributors   ` | LAGOS | 22/10/2023 | ₦2,050,000 |
| `  ADA SUPERSTORE` | Lagos | 2023-07-11 | 1,200,000 |
| `Hajia Amina Superstore` | north central | 21/04/2023 | 850000 |
| `  peace mart` | South-West | 01/09/2022 | 1500000 |

After cleaning:

| Customer Name | Region | Date Joined | Credit Limit |
| :-- | :-- | :-- | --: |
| Kayode Distributors | Lagos | 2023-10-22 | 2050000 |
| Ada Superstore | Lagos | 2023-07-11 | 1200000 |
| Hajia Amina Superstore | North Central | 2023-04-21 | 850000 |
| Peace Mart | South West | 2022-09-01 | 1500000 |

Look at `01/09/2022`. Is that 1 September or 9 January? Nigeria writes day first, so it's **1 September 2022**, but a spreadsheet set to US format would read it as 9 January. Mixed date formats are one of the most dangerous cleaning problems, because the wrong answer still *looks* like a date.

## Walkthrough

A cleaning plan for this file, in the order you'd do it:

1. **Save a copy** of the raw file and work only on the copy.
2. **Trim spaces and fix capitals** in names (spreadsheets have `TRIM` and `PROPER` functions for this; the Excel course shows them).
3. **Standardise regions** to six agreed spellings: Lagos, South West, South East, South South, North Central, North West. `SW`, `South-West` and `south west` all become `South West`.
4. **Remove duplicates** *after* steps 2 and 3. Before trimming, `ADA SUPERSTORE` and `Ada Superstore` look different, so duplicate removal would miss them.
5. **Convert dates** to one format, reading each as day/month/year.
6. **Turn money into numbers**: remove `₦`, commas and `.00`.
7. **Log** what you changed and how many rows it affected.

```dataset
{ "dataset": "cleaning", "files": ["customer_list_raw"] }
```

> [!TIP]
> In Google Sheets, **Data → Data cleanup → Trim whitespace** and **Data → Data cleanup → Remove duplicates** do steps 2 and 4 in a few clicks. In Excel, **Data → Remove Duplicates** does step 4.

## Practice

```answer
{
  "id": "daf-05-p1",
  "prompt": "How many data rows does the raw export `customer_list_raw.csv` contain (not counting the header)?",
  "answer": 102,
  "format": "number",
  "dataset": "cleaning",
  "files": ["customer_list_raw"],
  "verify": "SELECT COUNT(*) FROM customer_list_raw",
  "hint": "Open the file and jump to the last row with Ctrl + ↓. Subtract 1 for the header.",
  "required": true
}
```

```answer
{
  "id": "daf-05-p2",
  "prompt": "After trimming spaces, ignoring differences in capital letters, and removing duplicate customer names, how many **different customers** are in the list?",
  "answer": 90,
  "format": "number",
  "dataset": "cleaning",
  "files": ["customer_list_raw"],
  "verify": "SELECT COUNT(DISTINCT LOWER(TRIM(\"Customer Name\"))) FROM customer_list_raw",
  "hint": "Trim and fix the capitals in the name column first (or make a helper column), then remove duplicates on that column and count what's left.",
  "explanation": "90 customers. The export listed 12 of them twice, so an uncleaned count would have been 102, an overstatement of about 13%.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why should you remove duplicates only after trimming spaces and fixing capitals?",
    "options": ["Removing duplicates deletes capitals", "Until then, copies of the same customer look different and won't be detected", "Trimming is slower after removing duplicates", "It doesn't matter which comes first"],
    "answer": 1,
    "explanation": "\"  ADA SUPERSTORE\" and \"Ada Superstore\" only match once both are trimmed and in the same case."
  },
  {
    "prompt": "A date in the export reads 03/04/2024. The company writes dates day first. What date is it?",
    "options": ["3 April 2024", "4 March 2024", "It can't be a date", "3 March 2024"],
    "answer": 0,
    "explanation": "Day first: 03 is the day, 04 the month."
  },
  {
    "prompt": "What is the first thing to do before cleaning a file?",
    "options": ["Delete blank rows", "Keep an untouched copy of the original", "Sort by the first column", "Convert everything to capitals"],
    "answer": 1,
    "explanation": "The original is your safety net and your evidence. Always clean a copy."
  }
]
```
