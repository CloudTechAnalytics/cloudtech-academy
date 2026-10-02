---
title: Cleaning messy data
minutes: 25
summary: Clean a real-world messy export in pandas, step by step: spaces and capitals, inconsistent categories, numbers stored as text, mixed date formats, phone numbers, missing values and duplicates.
---

## The problem

Kolanut is moving to a new system, and the old one can only export customers as `customer_list_raw.csv`. Open it and you'll see why nobody trusts it:

- Names with stray spaces and random capitals: `kayode distributors   `, `  ADA SUPERSTORE`.
- Regions spelled 23 different ways: `Lagos`, `LAGOS`, `Lagos `, `SW`, `South-West`, `south west`…
- Credit limits as text: `₦2,050,000`, `1,400,000.00`, `850000`, and a few blanks.
- Dates in three layouts: `2023-07-11`, `22/10/2023`, `30-Sep-2023`.
- Phone numbers as `0803…`, `0803 123 4567`, `+234 803…` and `234803…`.
- Some customers exported twice.

Count Lagos customers in this file without cleaning it and you get the wrong answer twice over: spelling variants are missed, and duplicates are counted twice. Cleaning isn't tidying for its own sake. It decides whether your numbers are right.

## The concept

**Load everything as text first**

```python
raw = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/cleaning/customer_list_raw.csv", dtype=str)
```

`dtype=str` stops pandas guessing types on a messy file. Without it, a phone column of digits becomes numbers and loses its leading `0`, and a column with one text value in it silently becomes text anyway. Load as text, then convert each column deliberately.

**Text methods: `.str`**

Every text column has a `.str` accessor with the cleaning tools you need:

| Method | Does |
| :-- | :-- |
| `.str.strip()` | Removes spaces at the start and end |
| `.str.split().str.join(" ")` | Also squashes repeated spaces inside |
| `.str.lower()`, `.str.upper()`, `.str.title()` | Changes capitals; `title` Capitalises Each Word |
| `.str.replace("old", "new")` | Replaces text |
| `.str.replace(r"[₦,]", "", regex=True)` | Removes every character in the brackets (a **regular expression**) |
| `.str.replace(r"\D", "", regex=True)` | Removes everything that isn't a digit |

Chain them: `raw["Customer Name"].str.strip().str.title()`.

**Standardise categories with a mapping**

Bring every variant to one form (lower case, no hyphens), then map the abbreviations with a dictionary:

```python
REGIONS = {"sw": "south west", "se": "south east", "ss": "south south", "nw": "north west", "nc": "north central"}
region = raw["Region"].str.strip().str.lower().str.replace("-", " ").replace(REGIONS).str.title()
```

Then **check**: `region.value_counts()` should show exactly the six regions you expect. Any extra value is a spelling you haven't handled.

**Numbers stored as text**

`pd.to_numeric` converts text to numbers. Remove the symbols first; blanks become `NaN` (Not a Number), pandas' marker for a missing value. Adding `errors="coerce"` turns anything else that won't convert into `NaN` too, instead of stopping with an error: useful, but check how many you lost.

**Mixed date layouts**

```python
pd.to_datetime(raw["Date Joined"], format="mixed", dayfirst=True)
```

`format="mixed"` works the layout out for each value; `dayfirst=True` reads `03/01/2023` as 3 January, as Nigerian systems write it.

**Missing values**

- Find them: `df.isna().sum()` counts blanks per column.
- Decide what a blank **means** before you touch it. A missing credit limit isn't a zero limit: filling it with 0 would quietly understate every total and average. Usually you leave it as `NaN` (pandas skips it in `sum` and `mean`) and report it.
- `fillna(value)` fills blanks; `dropna(subset=[...])` drops rows with blanks in the columns you name. Use them only when you can explain why.

**Duplicates**

- `df.duplicated(subset=["customer_name"]).sum()` counts repeats of a key.
- `df.drop_duplicates(subset=["customer_name"])` keeps the first copy of each.
- Clean the key first. `"  ADA SUPERSTORE"` and `"Ada Superstore"` are only duplicates once both are cleaned.

## Example

The whole cleaning script, one column per line, into a new, tidy DataFrame:

```python
import pandas as pd

raw = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/cleaning/customer_list_raw.csv", dtype=str)

REGIONS = {"sw": "south west", "se": "south east", "ss": "south south", "nw": "north west", "nc": "north central"}

clean = pd.DataFrame({
    "customer_name": raw["Customer Name"].str.strip().str.split().str.join(" ").str.title(),
    "region": raw["Region"].str.strip().str.lower().str.replace("-", " ").replace(REGIONS).str.title(),
    "city": raw["City"].str.strip().str.title(),
    "phone": raw["Phone"].str.replace(r"\D", "", regex=True).str.replace(r"^234", "0", regex=True),
    "joined_date": pd.to_datetime(raw["Date Joined"], format="mixed", dayfirst=True),
    "credit_limit": pd.to_numeric(raw["Credit Limit"].str.replace(r"[₦,]", "", regex=True)),
    "channel": raw["Channel"].str.strip(),
})

print(f"Rows before removing duplicates: {len(clean)}")
clean = clean.drop_duplicates(subset="customer_name")
print(f"Rows after: {len(clean)}")
clean["region"].value_counts()
```

```text
Rows before removing duplicates: 102
Rows after: 90
region
Lagos            34
South East       14
North West       11
South South      11
South West       10
North Central    10
Name: count, dtype: int64
```

Six regions, no stray spellings, 90 customers. The phone line removes every non-digit, then turns a leading `234` into `0`, so every number ends up as 11 digits starting with `0`.

## Walkthrough

1. Load the raw file with `dtype=str` and run `raw.head(10)`. Spot each problem from the list above.
2. Check the region mess before fixing it: `raw["Region"].nunique()` gives 23.
3. Build the `clean` DataFrame from the Example one line at a time, running `clean.head()` after each new column to see the result.
4. Check the phones: `clean["phone"].str.len().value_counts()` should show only 11. A different length is a number that needs a closer look.
5. Spot-check dates: compare `raw["Date Joined"].head(10)` with `clean["joined_date"].head(10)`. `22/10/2023` must be 22 October.
6. Count blanks: `clean.isna().sum()`. Three credit limits are missing.
7. Count duplicates **before** dropping them: `clean.duplicated(subset="customer_name").sum()` gives 12.
8. Drop duplicates and re-check `clean["region"].value_counts()`.
9. Save the result for later: `clean.to_csv("customers_clean.csv", index=False)`. In Colab, the file appears in the Files panel to download.

> [!TIP]
> Keep the raw data untouched and build a new, clean table from it, as the Example does. If you discover a new problem later, you fix one line and run the notebook again, rather than unpicking edits made in place.

> [!WARNING]
> `drop_duplicates` keeps the **first** copy of each name. If the copies differ, for example one has a credit limit and the other is blank, which copy you keep changes your totals. Sort first (`sort_values("credit_limit", na_position="last")`) to keep the most complete copy, and say what you did.

## Practice

```dataset
{"dataset": "cleaning", "files": ["customer_list_raw"]}
```

```answer
{
  "id": "pyan-06-p1",
  "prompt": "After cleaning and removing duplicates, how many customers are in the **South East** region?",
  "answer": 14,
  "format": "number",
  "dataset": "cleaning",
  "files": ["customer_list_raw"],
  "verify": "SELECT COUNT(*) FROM sales_customers WHERE region = 'South East'",
  "pyVerify": "(clean['region'] == 'South East').sum()",
  "hint": "Clean the region column with the mapping, drop duplicate names, then value_counts().",
  "required": true
}
```

```answer
{
  "id": "pyan-06-p2",
  "prompt": "After cleaning and removing duplicates, how many customers **joined in 2023**?",
  "answer": 28,
  "format": "number",
  "dataset": "cleaning",
  "files": [
    "customer_list_raw"
  ],
  "verify": "SELECT COUNT(*) FROM sales_customers WHERE joined_date LIKE '2023-%'",
  "pyVerify": "(clean['joined_date'].dt.year == 2023).sum()",
  "hint": "pd.to_datetime(..., format=\"mixed\", dayfirst=True), then .dt.year == 2023.",
  "explanation": "If you read the dates month-first, some 2023 dates fail to convert or land in the wrong month. Day-first is the right reading for this file.",
  "required": true
}
```

```answer
{
  "id": "pyan-06-p3",
  "prompt": "What is the **average credit limit** of the cleaned, de-duplicated customers, ignoring the ones with no limit? Round to the nearest naira.",
  "answer": 1510795,
  "format": "naira",
  "dataset": "cleaning",
  "files": ["customer_list_raw"],
  "verify": "SELECT ROUND(AVG(credit_limit)) FROM sales_customers WHERE customer_name NOT IN ('Bola Mini Mart', 'Ada Provisions')",
  "pyVerify": "round(clean['credit_limit'].mean())",
  "hint": "mean() skips NaN automatically.",
  "explanation": "If you'd filled the blanks with 0, the average would be lower, and wrong: those customers don't have a zero limit, we just don't know theirs.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "pyan-06-c1",
  "prompt": "How many rows of the **raw** file have a phone number written in the international form (starting with `+234` or `234`)?",
  "answer": 42,
  "format": "number",
  "dataset": "cleaning",
  "files": [
    "customer_list_raw"
  ],
  "verify": "SELECT COUNT(*) FROM customer_list_raw WHERE \"Phone\" LIKE '+234%' OR \"Phone\" LIKE '234%'",
  "pyVerify": "raw['Phone'].str.strip().str.match(r'\\+?234').sum()",
  "hint": "raw[\"Phone\"].str.match(r\"\\+?234\") is True where the number starts with 234, with or without the +.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why load a messy file with dtype=str?",
    "options": ["It makes the file smaller", "So pandas doesn't guess types: phone numbers keep their leading 0 and you convert each column deliberately", "Text is faster", "It removes duplicates"],
    "answer": 1,
    "explanation": "Guessed types lose information. Load as text, then convert on purpose."
  },
  {
    "prompt": "Three customers have a blank credit limit. What should you usually do?",
    "options": ["Fill them with 0", "Leave them as NaN, exclude them from averages, and report them", "Fill them with the average", "Delete those customers"],
    "answer": 1,
    "explanation": "0 is a real value with a meaning. A blank means 'unknown', and should be reported as such."
  },
  {
    "prompt": "drop_duplicates(subset=\"customer_name\") on the raw names (before stripping and fixing capitals) removes fewer rows than expected. Why?",
    "options": ["It only checks the first column", "'  ADA SUPERSTORE' and 'Ada Superstore' are different text until they're cleaned", "It needs keep=\"last\"", "Duplicates can't be removed in pandas"],
    "answer": 1,
    "explanation": "Clean the key first, then remove duplicates."
  },
  {
    "prompt": "After mapping regions, value_counts() shows 7 regions instead of 6. What does that tell you?",
    "options": ["Kolanut opened a new region", "There's a spelling variant your mapping doesn't handle yet", "value_counts is wrong", "Nothing; 7 is fine"],
    "answer": 1,
    "explanation": "Checking the result against what you expect is how you find the variants you missed."
  }
]
```
