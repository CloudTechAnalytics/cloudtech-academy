---
title: Statistics for analysts
minutes: 25
summary: What statistics does for an analyst, the difference between describing data and drawing conclusions from it, populations and samples, the kinds of variable you'll meet, and the three ways numbers most often mislead.
---

## The problem

Kolanut Distribution's HR director reads a report that says "the average employee earns ₦609,250 a month" and concludes that pay is generous. A junior analyst replies that most employees earn less than ₦500,000. A third colleague says the sample of 80 employees is too small to say anything at all.

All three are talking about the same file, and they can't all be right. The difference between them isn't arithmetic. It's **statistics**: knowing which number answers the question, how much it can vary, and how far you can trust a conclusion drawn from it.

This course gives you those skills, in Excel or Google Sheets, on Kolanut's sales and HR data, Harbourline Freight's shipments and Ashgrove Chambers' invoices.

## The concept

**Two jobs statistics does**

- **Descriptive statistics** summarise the data you have: the typical salary, how spread out delivery times are, how strongly two things move together. Lessons 2 to 6.
- **Inferential statistics** help you draw conclusions beyond the data you have: is a difference real or just luck, how precise is an estimate, will a trend continue? Lessons 7 to 10.

Most day-to-day analysis is descriptive. Inference is what stops you announcing a "finding" that's really noise.

**Population and sample**

- The **population** is everyone or everything you want to know about: all of Kolanut's customers, every shipment Harbourline will ever make.
- A **sample** is the part you actually have data on.

Sometimes your data is the whole population. Kolanut's `employees.csv` lists all 80 people who have worked there, so the average salary in it isn't an estimate; it's the fact. Often it isn't: a survey of 200 customers is a sample of all customers, and the answer would be slightly different with a different 200. Asking "is this all of them, or some of them?" decides which tools you need.

**Kinds of variable**

| Kind | What it is | Example | Typical summaries |
| :-- | :-- | :-- | :-- |
| **Categorical** | A label from a set | department, region, payment method | counts, percentages, the most common |
| **Ordinal** | Categories with an order | job level (Junior < Mid < Senior), a 1–5 rating | counts, the median |
| **Numerical, discrete** | Counts | containers per shipment, packs per order line | mean, median, spread |
| **Numerical, continuous** | Measurements | revenue, salary, weight, days to pay | mean, median, spread |

The kind decides what's meaningful. An "average region" is nonsense; an average salary is fine. A job level of "2.4" means nothing even if you coded Junior as 1 and Senior as 3.

**Three ways numbers mislead**

1. **The wrong average.** A few very high values pull the mean up. Kolanut's mean salary (₦609,250) is well above the median (₦492,500), because ten managers earn over ₦1.2 million. "The typical employee" is closer to the median. Lesson 2 shows how to choose.
2. **No sense of spread.** "Average delivery time is 27 days" hides whether almost every shipment takes 26–28 days or some take 10 and others 60. Customers experience the spread, not the average. Lesson 3.
3. **Mistaking noise for a signal.** Small groups and small differences bounce around by chance. Customer Service's resignation rate (3 of 8) sounds alarming, but three people is a small number. Lessons 7 to 9 give you the tools to tell the difference.

## Example

The HR director's question, answered properly. Open the HR dataset's `employees.csv` in Excel or Google Sheets and put these formulas in empty cells (the salary is column G, rows 2 to 81):

```excel
=AVERAGE(G2:G81)        609,250
=MEDIAN(G2:G81)         492,500
=COUNTIF(G2:G81,"<500000")   41
```

Read together: the **average** is ₦609,250, but **half** of all employees earn ₦492,500 or less, and **41 of 80** earn under ₦500,000. The mean is pulled up by the highest earners. A fair one-line answer for the director:

> *Most employees earn under ₦500,000 a month (the median is ₦492,500). The average is higher, ₦609,250, because ten managers earn over ₦1.2 million.*

That sentence is more useful than either number on its own, and it's statistics doing its job: choosing the right summary and saying what it means.

## Walkthrough

1. Download the HR dataset (below) and open `employees.csv` in Excel or Google Sheets.
2. Press Ctrl + T to make it a Table. Check there are 80 employees.
3. For each column, write down which kind of variable it is: `department` (categorical), `job_level` (ordinal), `monthly_salary` (continuous), and so on.
4. Calculate the mean and median salary with `AVERAGE` and `MEDIAN`, and count how many earn under ₦500,000 with `COUNTIF`.
5. Calculate the mean and median for **Junior** staff only: `=AVERAGEIFS(G2:G81, D2:D81, "Junior")` and `=MEDIAN(IF(D2:D81="Junior", G2:G81))`. In older Excel, finish that last one with Ctrl + Shift + Enter.
6. Write one sentence, for the HR director, that uses both numbers honestly.

## Practice

```dataset
{"dataset": "hr", "files": ["employees", "attendance", "leave"]}
```

```answer
{
  "id": "stat-01-p1",
  "prompt": "How many employees in `employees.csv` earn **more than ₦1,000,000** a month?",
  "answer": 12,
  "format": "number",
  "dataset": "hr",
  "files": ["employees"],
  "verify": "SELECT COUNT(*) FROM employees WHERE monthly_salary > 1000000",
  "pyVerify": "(data('hr', 'employees')['monthly_salary'] > 1000000).sum()",
  "hint": "=COUNTIF(G2:G81, \">1000000\")",
  "required": true
}
```

```answer
{
  "id": "stat-01-p2",
  "prompt": "What is the **median** monthly salary of **Mid**-level staff?",
  "answer": 525000,
  "format": "naira",
  "dataset": "hr",
  "files": ["employees"],
  "pyVerify": "data('hr', 'employees').query('job_level == \"Mid\"')['monthly_salary'].median()",
  "hint": "=MEDIAN(IF(D2:D81=\"Mid\", G2:G81)), or filter to Mid and use MEDIAN on the visible values.",
  "required": true
}
```

```answer
{
  "id": "stat-01-p3",
  "prompt": "A researcher surveys 300 of Kolanut's 4,000 retail customers about delivery times. Are the 300 a **population** or a **sample**?",
  "answer": "sample",
  "format": "text",
  "accept": ["a sample"],
  "explanation": "They're part of the group the researcher wants to know about (all 4,000), so any figure from them is an estimate.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "stat-01-c1",
  "prompt": "`job_level` is stored as text (Junior, Mid, Senior, Manager). What kind of variable is it? (One word from this lesson's table.)",
  "answer": "ordinal",
  "format": "text",
  "accept": ["ordinal categorical", "categorical ordinal"],
  "explanation": "The categories have a natural order, but the gaps between them aren't equal numbers, so averages of levels are meaningless. Medians and counts are fine.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Kolanut's employees.csv lists every person who has worked there. Is its average salary an estimate?",
    "options": ["Yes, every average is an estimate", "No: the file is the whole population, so the average is a fact about it", "Only if there are more than 100 rows", "Only for active staff"],
    "answer": 1,
    "explanation": "Inference is needed for samples. With the whole population, you're describing, not estimating."
  },
  {
    "prompt": "Mean salary ₦609,250, median ₦492,500. What best explains the gap?",
    "options": ["A data error", "A few high earners pull the mean up", "Most people earn more than the mean", "The median is always lower"],
    "answer": 1,
    "explanation": "The mean is sensitive to extreme values; the median isn't."
  },
  {
    "prompt": "Which of these is a categorical variable?",
    "options": ["Monthly salary", "Payment method", "Weight in kg", "Days to pay"],
    "answer": 1,
    "explanation": "Payment method is a label. The others are numbers you can average."
  },
  {
    "prompt": "Three of Customer Service's eight staff resigned. What's the right caution?",
    "options": ["Ignore it, eight is too small", "It's worth noting, but small groups vary a lot by chance, so be careful how strongly you claim it", "It proves the manager is the problem", "Report it as 37.5% with no comment"],
    "answer": 1,
    "explanation": "Small numbers deserve careful wording. Later lessons show how to measure that uncertainty."
  }
]
```
