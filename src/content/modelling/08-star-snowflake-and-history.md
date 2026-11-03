---
title: Stars, snowflakes, dates and history
minutes: 15
summary: When to snowflake a dimension, why every model needs a date dimension, and how to keep history when attributes change.
---

## The problem

On 1 April 2026, Peace Provisions moved from Kano (North West) to Abuja (North Central). If you simply update their region, every order they placed in 2025 now reports as North Central, and the North West's history quietly shrinks. Models for analysis must decide what happens to history when descriptions change.

## The concept

### Star or snowflake?

![Two layouts. Star: fact_order_lines joined to dim_product, which has category as a column. Snowflake: dim_product joined further to a dim_category table.](/images/courses/modelling/star-vs-snowflake.svg "A snowflake splits a dimension into further tables.")

- In a **star**, each dimension is one table, even if values repeat (category written on every product).
- In a **snowflake**, dimensions are normalised further (products point to a categories table).

For Power BI and most analytics, **prefer the star**: fewer relationships, simpler filters, faster queries. Snowflake only when a sub-dimension is large, shared, or maintained separately.

**The date dimension.** Every model with dates needs its own date table: one row per day, with year, quarter, month name, month number, week, weekday and flags such as *is_working_day* or *is_public_holiday*. It lets you:

- group consistently (every report's "Q2" means the same thing);
- show days with no sales (a fact table can't show what didn't happen);
- mark Nigerian public holidays and see their effect on orders;
- use time intelligence in DAX (year-to-date, same period last year).

**Slowly changing dimensions (SCDs)** are the standard answers to "what happens when an attribute changes?":

| Type | Method | History | Use when |
| :-- | :-- | :-- | :-- |
| **Type 1** | Overwrite the value | Lost | Corrections (a misspelt name) |
| **Type 2** | Add a new row with valid-from / valid-to dates; the fact points to the row that was current at the time | Kept | Changes that matter for reporting (region, rep, price band) |
| **Type 3** | Add a "previous value" column | Only one step back | Rare: a single planned reorganisation |

![Type 1 overwrites Peace Provisions' region to North Central in a single row. Type 2 keeps two rows for customer 13: key 13 North West valid until 31 March 2026, and key 91 North Central from 1 April 2026, marked current.](/images/courses/modelling/slowly-changing-dimensions.svg "Type 1 overwrites; type 2 adds a row, so old orders keep their old region.")

Type 2 is why dimensions use **surrogate keys**: customer 13 now has two rows, so the fact table can't use `customer_id` alone to know which version applied.

## Example

What difference would it make at Kolanut? Revenue for the North West in H1 2025 was ₦31.1m. If a large North West customer moved region and the dimension were type 1, their 2025 orders would move with them, and the H1 2025 figure for North West would shrink after the fact. Last year's board report would no longer match this year's rerun. Type 2 keeps both reports true.

## Walkthrough

Choosing the SCD type, attribute by attribute, for Kolanut's customers:

1. `customer_name`: corrected spellings → **type 1**.
2. `region` and `city`: real moves, and regional reporting matters → **type 2**.
3. `sales_rep`: reassignment changes commission and performance reports → **type 2**.
4. `credit_limit`: finance only needs the current value → **type 1**.
5. Record the decision in the model documentation, so everyone knows which history the reports show.

## Practice

```answer
{
  "id": "dmo-08-p1",
  "prompt": "Which slowly-changing-dimension type keeps full history by adding a new row? (Type the number.)",
  "answer": 2,
  "format": "number",
  "tolerance": 0,
  "required": true,
  "hint": "Type 1 overwrites the old value. The next type number keeps history."
}
```

```answer
{
  "id": "dmo-08-p2",
  "prompt": "A date dimension covering 1 January 2025 to 31 December 2026 has one row per day. How many rows does it have?",
  "answer": 730,
  "format": "number",
  "tolerance": 0,
  "hint": "Neither 2025 nor 2026 is a leap year.",
  "required": true
}
```


## More practice

Optional drills. They don't count towards the certificate, but each one checks you can apply the lesson to a new situation.

```answer
{
  "id": "dmo-08-d1",
  "prompt": "Which slowly-changing-dimension type **overwrites** the old value, keeping no history? (Type the number.)",
  "answer": 1,
  "format": "number",
  "hint": "The simplest type.",
  "required": false
}
```

```answer
{
  "id": "dmo-08-d2",
  "prompt": "A date dimension covers **2026 only**, one row per day. How many rows does it have?",
  "answer": 365,
  "format": "number",
  "hint": "2026 isn't a leap year.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why is a star usually preferred over a snowflake in Power BI?",
    "options": ["Snowflakes can't have measures", "Fewer relationships make filters simpler and queries faster", "Stars use less storage in every case", "Power BI can't import snowflakes"],
    "answer": 1,
    "explanation": "Each extra hop is another relationship for filters to travel through."
  },
  {
    "prompt": "A customer's name was misspelt when they signed up. Which SCD type fits the correction?",
    "options": ["Type 1: overwrite", "Type 2: add a row", "Type 3: previous-value column", "None"],
    "answer": 0,
    "explanation": "A correction isn't a real change worth keeping history for."
  },
  {
    "prompt": "With type 2 history, one customer can have several rows in the customer table. What tells each version apart?",
    "options": ["A separate surrogate key, one per version", "The customer's name", "The row colour", "Nothing, they're duplicates"],
    "answer": 0,
    "explanation": "Each version gets its own surrogate key, and the fact table stores the key of the version that applied."
  }
]
```
