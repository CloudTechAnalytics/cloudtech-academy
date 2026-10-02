---
title: How businesses use data
minutes: 20
summary: Where data comes from in a company, how each team uses it, and what a KPI is.
---

## The problem

A new analyst joins Kolanut and asks for "the data". The answer is: *which* data? Sales keeps orders. The warehouse tracks stock. Finance holds invoices and payments. HR has staff records and attendance. Each team uses its own data to run its own part of the business, and the most useful questions usually need two or more of them together.

## The concept

Every business activity leaves a record. Some common ones:

| Team | Data it produces | Decisions it supports |
| :-- | :-- | :-- |
| Sales | Orders, customers, prices, discounts | Which customers to visit, which products to push |
| Operations | Deliveries, stock levels, routes | How much to reorder, where to position trucks |
| Finance | Invoices, payments, costs | Who to chase for payment, where money is being lost |
| HR | Staff, salaries, attendance, leave | Hiring plans, where people are leaving |
| Marketing | Campaigns, website visits, enquiries | Which channels bring customers |

A **KPI (key performance indicator)** is a number a business watches regularly because it shows whether things are going well. A good KPI is:

- **Clearly defined.** Everyone calculates it the same way.
- **Tied to a goal.** It moves when the business gets better or worse.
- **Actionable.** Someone can do something when it changes.

Some KPIs you'll meet often:

| KPI | Calculation |
| :-- | :-- |
| Revenue | Sum of sales value in a period |
| Growth rate | (This period − last period) ÷ last period × 100 |
| Average order value | Revenue ÷ number of orders |
| On-time delivery rate | Deliveries on time ÷ all deliveries × 100 |
| Staff turnover | People who left ÷ average headcount × 100 |
| Collection rate | Invoices paid ÷ invoices issued × 100 |

## Example

Three businesses, three uses of data:

- **A distributor** (Kolanut) compares revenue by region each month. When one region drops, the sales manager calls the rep covering it before the quarter is lost.
- **A logistics company** tracks on-time delivery by route. A route that is late 30% of the time gets a new schedule or a different carrier.
- **A law firm** watches outstanding invoices. Partners get a weekly list of clients whose invoices are more than 30 days overdue.

In each case the data isn't collected *for* analysis. It exists because the business runs. Analytics makes it useful a second time.

## Walkthrough

Let's calculate two KPIs by hand for one month at Kolanut.

In a month, Kolanut delivered **1,240** orders. **62** arrived later than promised. Revenue was **₦48,000,000**.

**On-time delivery rate**

1. On-time deliveries = 1,240 − 62 = 1,178.
2. Divide by all deliveries: 1,178 ÷ 1,240 = 0.95.
3. Multiply by 100: **95%**.

**Average order value**

1. Revenue ÷ orders = 48,000,000 ÷ 1,240.
2. = **₦38,710** (rounded to the nearest naira).

> [!TIP]
> Always write down how a KPI is calculated, including what's left out (cancelled orders? returns?). Two people calculating "revenue" differently is one of the most common causes of confusion in meetings.

## Practice

```answer
{
  "id": "daf-02-p1",
  "prompt": "The next month, Kolanut delivered **1,500** orders and **90** were late. What was the on-time delivery rate, as a percentage? (Type just the number, for example 92.5.)",
  "answer": 94,
  "format": "percent",
  "hint": "On time = 1,500 − 90. Divide by 1,500, then multiply by 100.",
  "explanation": "1,410 ÷ 1,500 = 0.94, so 94% were on time. That's a drop from 95% the month before.",
  "required": true
}
```

```answer
{
  "id": "daf-02-p2",
  "prompt": "Kolanut had **75** staff at the start of the year and **80** at the end (an average headcount of 77.5). **8** people left during the year. What was staff turnover, to one decimal place?",
  "answer": 10.3,
  "format": "percent",
  "hint": "People who left ÷ average headcount × 100.",
  "explanation": "8 ÷ 77.5 × 100 = 10.3%. Dividing by the average headcount, not the starting or ending number, keeps the KPI fair when the company is growing.",
  "required": true
}
```


## More practice

Optional drills. They don't count towards the certificate, but each one checks you can apply the lesson to a new situation.

```answer
{
  "id": "daf-02-d1",
  "prompt": "Kolanut had **80** active customers last year and **90** this year. What is the customer growth rate? One decimal place.",
  "answer": 12.5,
  "format": "percent",
  "hint": "(new − old) ÷ old × 100.",
  "required": false
}
```

```answer
{
  "id": "daf-02-d2",
  "prompt": "A warehouse shipped **2,400** orders and **36** came back as returns. What is the return rate? One decimal place.",
  "answer": 1.5,
  "format": "percent",
  "hint": "Returns ÷ orders × 100.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which of these is the best KPI for a finance team that is short of cash?",
    "options": ["Number of website visitors", "Collection rate on invoices", "Number of products in the catalogue", "Average staff age"],
    "answer": 1,
    "explanation": "Collection rate shows how much of what was billed has been paid, which is exactly the cash problem."
  },
  {
    "prompt": "Revenue grew from ₦40m to ₦50m. What is the growth rate?",
    "options": ["10%", "20%", "25%", "80%"],
    "answer": 2,
    "explanation": "(50 − 40) ÷ 40 × 100 = 25%. Growth is always measured against the earlier period."
  },
  {
    "prompt": "What makes a KPI \"actionable\"?",
    "options": ["It is shown in a chart", "Someone can do something about it when it changes", "It is calculated daily", "It uses a large amount of data"],
    "answer": 1,
    "explanation": "If nobody can respond when the number moves, it's a statistic, not a KPI."
  }
]
```
