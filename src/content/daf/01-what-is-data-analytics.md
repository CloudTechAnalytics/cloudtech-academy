---
title: What is data analytics?
minutes: 20
summary: What analysts actually do, the four kinds of analytics, and the steps every analysis follows.
---

## The problem

Kolanut Distribution sells drinks, snacks and household goods to shops across Nigeria. Every order is written into a system: who bought, what, how many, at what price, on which day. After eighteen months that system holds more than four thousand order lines.

The managing director doesn't want four thousand rows. She wants answers:

- Are we selling more than last year?
- Which regions are growing, and which are slipping?
- Should we keep giving wholesalers 10% discounts?

Turning the rows into those answers is **data analytics**.

## The concept

**Data analytics** is the work of collecting, cleaning and examining data to answer questions and support decisions.

The word that matters is *decisions*. A table of numbers is not analysis. Analysis ends when someone can act: restock earlier, call a customer, drop a product, hire in one region instead of another.

Analytics questions come in four kinds, each harder than the last:

| Kind | Question it answers | Kolanut example |
| :-- | :-- | :-- |
| **Descriptive** | What happened? | Revenue in March 2025 was ₦46.3 million. |
| **Diagnostic** | Why did it happen? | North West revenue fell because shops there ordered less often, not because we lost them. |
| **Predictive** | What is likely to happen? | December 2026 sales will again be far above an average month (in 2025 they were about 45% higher). |
| **Prescriptive** | What should we do? | Send more stock to Lagos warehouses in November. |

Most day-to-day analyst work is descriptive and diagnostic. They are the foundation: you can't predict what you can't describe.

## Example

Here is Kolanut's revenue for the first six months of 2025, rounded to millions of naira:

| Month | Revenue (₦ million) |
| :-- | --: |
| January | 37.1 |
| February | 36.1 |
| March | 46.3 |
| April | 44.6 |
| May | 40.3 |
| June | 39.8 |

A **descriptive** reading: revenue ranged from ₦36.1m to ₦46.3m, and March was the best month.

A **diagnostic** question it raises: *why* were March and April stronger? (In this data, drink sales rise in the hot, dry months, and Easter shopping falls in that period.)

## Walkthrough

Every analysis, big or small, follows roughly the same steps:

1. **Ask.** Agree the question with the person who will use the answer. "How are sales?" is vague. "Did first-half revenue grow compared with last year, and in which regions?" is answerable.
2. **Collect.** Find the data that can answer it: which system, which tables, which dates.
3. **Clean.** Fix what would mislead you: duplicates, inconsistent spellings, missing values.
4. **Analyse.** Summarise, compare, look for patterns and exceptions.
5. **Share.** Present the finding so the audience understands it in a minute: a clear chart, a short summary.
6. **Act.** Someone makes a decision, and you check later whether it worked.

> [!BUSINESS]
> In most companies the analyst sits between the people who hold the data (IT, operations) and the people who make decisions (managers). Half the job is technical; the other half is asking good questions and explaining answers in plain language.

The rest of this course takes each step in turn. By the end you'll run the whole cycle yourself on real-looking company data.

> [!NOTE]
> From lesson 3 onwards you'll need a spreadsheet program. Google Sheets is free with a Google account and works in the browser; Microsoft Excel works too.

## Practice

```answer
{
  "id": "daf-01-p1",
  "prompt": "Using the table in the Example, which month in the first half of 2025 had the **lowest** revenue?",
  "answer": "February",
  "accept": ["feb"],
  "format": "text",
  "hint": "Look for the smallest number in the Revenue column.",
  "explanation": "February, at ₦36.1m. It's also the shortest month, so it had fewer trading days, which is often part of the reason.",
  "required": true
}
```

```answer
{
  "id": "daf-01-p2",
  "prompt": "How many million naira separate the best month from the worst month in that table? Give the answer in millions, for example 3.5.",
  "answer": 10.2,
  "format": "number",
  "hint": "Best month minus worst month: 46.3 − 36.1.",
  "explanation": "46.3 − 36.1 = 10.2. The spread between best and worst months is a quick way to see how uneven sales are.",
  "required": true
}
```


## More practice

Optional drills. They don't count towards the certificate, but each one checks you can apply the lesson to a new situation.

```answer
{
  "id": "daf-01-d1",
  "prompt": "A shop sold ₦4.2 million in March and ₦3.5 million in April. By what percentage did sales **fall**? Give the size of the fall as a positive number, one decimal place.",
  "answer": 16.7,
  "format": "percent",
  "hint": "(old − new) ÷ old × 100 = (4.2 − 3.5) ÷ 4.2 × 100.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "\"Which of our products will sell out first next month?\" is which kind of analytics question?",
    "options": ["Descriptive", "Diagnostic", "Predictive", "Prescriptive"],
    "answer": 2,
    "explanation": "It asks what is likely to happen, so it's predictive."
  },
  {
    "prompt": "Why is \"How are sales doing?\" a weak starting question?",
    "options": ["Sales can't be measured", "It doesn't say which sales, compared with what, or for which decision", "Managers don't care about sales", "It is too specific"],
    "answer": 1,
    "explanation": "A good question names the measure, the comparison and the period, so you know when you've answered it."
  },
  {
    "prompt": "An analyst finds that late deliveries doubled after a warehouse moved. Which step comes next?",
    "options": ["Delete the late deliveries from the data", "Share the finding clearly with the people who can act on it", "Stop, because the analysis is complete", "Collect more data from a different company"],
    "answer": 1,
    "explanation": "A finding only creates value once the people who can act on it understand it."
  }
]
```
