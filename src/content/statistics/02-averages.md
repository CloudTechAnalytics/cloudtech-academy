---
title: "Averages: mean, median and mode"
minutes: 25
summary: Calculate the three averages, see how a few extreme values pull the mean, choose the right average for the question, and report it honestly.
---

## The problem

Ashgrove Chambers' managing partner asks two questions about the firm's invoices:

> "What's a typical invoice worth? And how long do clients usually take to pay?"

"Typical" sounds simple, but there are three different averages, and on real data they often disagree. Pick the wrong one and the partner sets fee targets or cash-flow plans on a number that describes almost nobody. This lesson is about choosing.

## The concept

**The three averages**

| Average | What it is | Excel / Sheets | Best for |
| :-- | :-- | :-- | :-- |
| **Mean** | Add everything up, divide by how many | `=AVERAGE(range)` | Values that are roughly symmetric, and anything you'll multiply back up to a total |
| **Median** | The middle value when sorted; half are below, half above | `=MEDIAN(range)` | Skewed data such as salaries, prices, invoice amounts, house prices |
| **Mode** | The most common value | `=MODE.SNGL(range)` | Categories and repeated values: the most common discount, shoe size, product |

With an even number of values, the median is the average of the middle two.

**Why they disagree: skew**

The mean uses every value's size, so a few very large values pull it up. The median only cares about order, so it barely moves.

- **Right-skewed** data (a long tail of high values) has **mean > median**. Salaries, invoice amounts and order sizes are almost always like this.
- **Left-skewed** data (a tail of low values) has **mean < median**: for example exam scores where most people did well.
- Roughly **symmetric** data has mean ≈ median.

So the gap between mean and median is itself useful information: it tells you the data is skewed and which way.

**Choosing**

- Asking "what does a **typical** one look like?" Use the **median** for skewed data.
- Asking "what's the **total** worth, or the per-unit cost?" Use the **mean**: mean × count = total, which is exactly what budgets need. The median can't be multiplied back up.
- Asking "what's the **most common** choice?" Use the **mode**.

When in doubt, report both, with a sentence explaining the gap.

**Averages for groups**

`AVERAGEIFS(average_range, criteria_range, criteria, …)` averages only the rows that meet conditions. There's no `MEDIANIFS`, but `=MEDIAN(IF(criteria_range = "x", values))` does the same job (press Ctrl + Shift + Enter in older Excel), and in Google Sheets you can wrap a `FILTER`: `=MEDIAN(FILTER(values, criteria_range = "x"))`.

**A middle way: the trimmed mean**

`=TRIMMEAN(range, 0.1)` drops the top and bottom 5% (10% in total) and averages the rest. It keeps most of the data's information while ignoring extremes, and it's used for things like judges' scores and some inflation measures.

> [!WARNING]
> Never average averages. The mean salary of Finance (₦637,000) and the mean of Operations (₦597,037) don't average to the mean of both departments together, because Operations has nearly three times as many people. Go back to the rows, or weight by group size (lesson 5).

## Example

The partner's two questions, on the legal dataset's `invoices.csv` (amount in column D, rows 2 to 411):

```excel
=AVERAGE(D2:D411)     2,931,098
=MEDIAN(D2:D411)      2,655,000
```

The mean invoice is about ₦2.93m, the median ₦2.66m: right-skewed, with some large invoices pulling the mean up. "A typical invoice is about ₦2.7m" is the honest answer; "₦2.9m" would overstate it. But for **budgeting** (expected billing next year from roughly 400 invoices), the mean is the right number: 410 × ₦2,931,098 is the actual total billed.

For days to pay, add a column `days_to_pay` = `paid_date - issued_date` (format it as a number). Unpaid invoices have no paid date, so the cell is empty or an error. `AVERAGE` and `MEDIAN` skip blanks, which is exactly right: you can't include a payment that hasn't happened. Then:

```excel
=AVERAGE(days_to_pay)    45.4
=MEDIAN(days_to_pay)     46
```

Here mean and median are almost equal, so payment times are roughly symmetric: "clients usually pay in about 46 days" is fair.

## Walkthrough

1. Download the legal dataset and open `invoices.csv`. Make it a Table (Ctrl + T).
2. Calculate the mean and median `amount_ngn`. Note which is larger and what that says about skew.
3. Add `days_to_pay`: `=IF([@[paid_date]]="", "", [@[paid_date]]-[@[issued_date]])`, formatted as a whole number. The `IF` leaves unpaid invoices blank.
4. Calculate the mean and median of `days_to_pay`.
5. Open the HR dataset's `employees.csv` and calculate the mean, median and mode of `monthly_salary`. Then `=TRIMMEAN(G2:G81, 0.1)`. Where does the trimmed mean fall between the other two?
6. Use `AVERAGEIFS` and `MEDIAN(IF(…))` to compare mean and median salary in **Operations**. The gap is unusually large: what does it tell you about pay in that department?

## Practice

```dataset
{"dataset": "legal", "files": ["invoices"]}
```

```answer
{
  "id": "stat-02-p1",
  "prompt": "What is the **median** invoice amount in `invoices.csv`?",
  "answer": 2655000,
  "format": "naira",
  "dataset": "legal",
  "files": ["invoices"],
  "pyVerify": "data('legal', 'invoices')['amount_ngn'].median()",
  "hint": "=MEDIAN over the amount_ngn column.",
  "required": true
}
```

```answer
{
  "id": "stat-02-p2",
  "prompt": "What is the **median** days to pay for **paid** invoices?",
  "answer": 46,
  "format": "number",
  "dataset": "legal",
  "files": ["invoices"],
  "pyVerify": "(lambda i: (pd.to_datetime(i['paid_date']) - pd.to_datetime(i['issued_date'])).dt.days.median())(data('legal', 'invoices'))",
  "hint": "Make a days_to_pay column (paid_date − issued_date), leave unpaid invoices blank, then MEDIAN.",
  "required": true
}
```

```answer
{
  "id": "stat-02-p3",
  "prompt": "In Kolanut's `orders.csv`, which **discount_pct** value is the **mode**?",
  "answer": 0,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT discount_pct FROM orders GROUP BY discount_pct ORDER BY COUNT(*) DESC LIMIT 1",
  "pyVerify": "data('sales', 'orders')['discount_pct'].mode()[0]",
  "hint": "=MODE.SNGL over discount_pct, or a pivot table counting each value.",
  "explanation": "Most lines have no discount: 2,519 of 4,266.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "stat-02-c1",
  "prompt": "What is the **10% trimmed mean** of `monthly_salary` in the HR data (`=TRIMMEAN(range, 0.1)`)? Round to the nearest naira.",
  "answer": 581528,
  "format": "naira",
  "dataset": "hr",
  "files": ["employees"],
  "pyVerify": "round(stats.trim_mean(data('hr', 'employees')['monthly_salary'], 0.05))",
  "hint": "TRIMMEAN's 0.1 means 10% removed in total: 5% from each end.",
  "explanation": "₦581,528: between the median (₦492,500) and the mean (₦609,250). Dropping the extremes pulls it down, but the remaining high-ish salaries keep it above the median.",
  "required": false
}
```

## More practice

Optional drills on the HR data.

```answer
{
  "id": "stat-02-d1",
  "prompt": "Which **department** has the **largest gap** between its mean and median salary? (Mean minus median.)",
  "answer": "Operations",
  "format": "text",
  "dataset": "hr",
  "files": ["employees"],
  "pyVerify": "(lambda g: (g['mean'] - g['median']).idxmax())(data('hr', 'employees').groupby('department')['monthly_salary'].agg(['mean', 'median']))",
  "explanation": "Operations' mean is about ₦597k but its median only ₦395k: most of the department is junior staff, with a few well-paid managers on top.",
  "required": false
}
```

```answer
{
  "id": "stat-02-d2",
  "prompt": "What is the **mean** salary of **Senior** staff? Round to the nearest naira.",
  "answer": 891667,
  "format": "naira",
  "dataset": "hr",
  "files": ["employees"],
  "verify": "SELECT ROUND(AVG(monthly_salary)) FROM employees WHERE job_level = 'Senior'",
  "pyVerify": "round(data('hr', 'employees').query('job_level == \"Senior\"')['monthly_salary'].mean())",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "House prices in an area: mean ₦85m, median ₦48m. Which describes a typical house better?",
    "options": ["The mean", "The median", "Both equally", "Neither"],
    "answer": 1,
    "explanation": "The big gap means right skew from a few very expensive houses. The median is the typical one."
  },
  {
    "prompt": "You need next year's expected training budget for 120 staff. Which average of past cost per person?",
    "options": ["Median, because it's more typical", "Mean, because mean × people gives the total", "Mode", "Whichever is lower"],
    "answer": 1,
    "explanation": "Only the mean multiplies back up to a total."
  },
  {
    "prompt": "Mean ₦45,000, median ₦52,000. What shape is the data?",
    "options": ["Right-skewed", "Left-skewed", "Symmetric", "You can't tell"],
    "answer": 1,
    "explanation": "Mean below median: a tail of low values pulls the mean down."
  },
  {
    "prompt": "Department A (10 people) averages ₦400k; department B (90 people) averages ₦600k. What's the average across both?",
    "options": ["₦500k", "₦580k", "₦600k", "₦400k"],
    "answer": 1,
    "explanation": "(10 × 400 + 90 × 600) ÷ 100 = 580. Averaging the two averages ignores group size."
  }
]
```
