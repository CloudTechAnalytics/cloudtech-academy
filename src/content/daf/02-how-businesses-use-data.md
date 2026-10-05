---
title: How businesses use data
minutes: 20
summary: Where company data comes from, what makes a good KPI, leading and lagging indicators, and how a KPI tree shows why a number moved.
---

## The problem

A new analyst joins Kolanut and asks for "the data". The answer is: *which* data? Sales keeps orders. The warehouse tracks stock. Finance holds invoices and payments. HR has staff records and attendance. Each team uses its own data to run its own part of the business, and the most useful questions usually need two or more of them together.

## The concept

### Where business data comes from

Every business activity leaves a record. Most of it is produced by the systems people use to do their jobs, not collected for analysis:

| Source | What it is | Kolanut example |
| :-- | :-- | :-- |
| **Transaction systems** | Software that records each sale, payment or delivery as it happens | The order system that writes `orders.csv` |
| **ERP** (enterprise resource planning) | One system covering finance, stock and purchasing; SAP, Oracle, Odoo and Sage are common | Stock levels and supplier invoices |
| **CRM** (customer relationship management) | Customers, contacts, visits and deals | The customer list with channel and sales rep |
| **HR and payroll systems** | Staff, salaries, attendance, leave | `employees.csv`, `attendance.csv` |
| **Spreadsheets** | Anything a team tracks by hand | A rep's list of shops visited this week |
| **External data** | From outside the company | Exchange rates, inflation, fuel prices |

Each team uses its own data to run its own part of the business:

| Team | Data it produces | Decisions it supports |
| :-- | :-- | :-- |
| Sales | Orders, customers, prices, discounts | Which customers to visit, which products to push |
| Operations | Deliveries, stock levels, routes | How much to reorder, where to position trucks |
| Finance | Invoices, payments, costs | Who to chase for payment, where money is being lost |
| HR | Staff, salaries, attendance, leave | Hiring plans, where people are leaving |
| Marketing | Campaigns, website visits, enquiries | Which channels bring customers |

The most useful questions usually need **two or more** sources together. "Are our biggest customers paying on time?" needs sales data and finance data. Joining sources is a skill you'll practise in lesson 4 and in the SQL course.

### Metrics and KPIs

A **metric** is any number you can measure: order lines, website visits, calls made. A **KPI (key performance indicator)** is one of the few metrics a business chooses to watch regularly, because it shows whether things are going well.

Every KPI is a metric; most metrics are not KPIs. A sales team might track fifty metrics and report five KPIs.

A good KPI is:

- **Clearly defined.** Everyone calculates it the same way.
- **Tied to a goal.** It moves when the business gets better or worse.
- **Actionable.** Someone can do something when it changes.
- **Timely.** It's available often enough to act on: weekly or monthly, not once a year.

### The parts of a KPI definition

"Revenue" sounds obvious until two people calculate it differently. A written definition removes the argument:

| Part | Kolanut's revenue KPI |
| :-- | :-- |
| **Name** | Net revenue |
| **Formula** | Sum of quantity × unit price × (1 − discount ÷ 100), over all order lines |
| **Includes / excludes** | After discounts; before VAT; all channels |
| **Period** | Calendar month, reported by the 5th of the next month |
| **Source** | `orders.csv` from the order system |
| **Target** | ₦50m a month in 2026 |
| **Owner** | Sales director |

The **owner** matters: a KPI without someone responsible for it is just a number on a slide.

### Common KPIs and how they're calculated

| KPI | Calculation | Team |
| :-- | :-- | :-- |
| Revenue | Sum of sales value in a period | Sales |
| Growth rate | (This period − last period) ÷ last period × 100 | Everyone |
| Average order value | Revenue ÷ number of orders | Sales |
| Active customers | Customers with at least one order in the period | Sales |
| On-time delivery rate | Deliveries on time ÷ all deliveries × 100 | Operations |
| Staff turnover | People who left ÷ average headcount × 100 | HR |
| Collection rate | Invoices paid ÷ invoices issued × 100 | Finance |
| Days sales outstanding | Money owed by customers ÷ sales per day | Finance |

### Leading and lagging indicators

A **lagging** indicator tells you what has already happened: revenue, profit, staff who left. It's the result you care about, but by the time it moves, it's too late to change.

A **leading** indicator moves **before** the result, so there's time to act:

| Lagging (the result) | Leading (an early warning) |
| :-- | :-- |
| Monthly revenue | Orders booked this week; customers who haven't ordered in 30 days |
| Staff turnover | Absence rates; overtime hours |
| Bad debts written off | Invoices more than 30 days overdue |

A good dashboard shows both: the result, and the signals that predict it.

### Breaking a KPI into a tree

When a KPI moves, the next question is *why*. A **KPI tree** splits it into the parts that multiply to make it, so you can see which part moved.

For revenue: **revenue = active customers × order lines per customer × revenue per line.** And revenue per line = packs per line × price per pack.

![A KPI tree. Revenue of ₦290.7m in January to June 2026 (up 19.1%) splits into active customers (90, up 23.3%), order lines per customer (15.9, down 12.1%) and revenue per line (₦202,741, up 9.9%). Revenue per line splits into packs per line (13.7) and naira per pack (₦14,811, up 8.8%).](/images/courses/daf/kpi-tree.svg "Kolanut's first-half revenue as a KPI tree. Two branches grew; one shrank.")

Reading Kolanut's tree, first half of 2026 against the first half of 2025:

- Revenue grew **19.1%**, from ₦244.2m to ₦290.7m.
- **More customers** ordered: 90 against 73, as new shops joined.
- **Prices rose**: each pack earned 8.8% more, after January's price rise.
- But each customer ordered **less often**: 15.9 lines against 18.1.

The headline (+19.1%) hides a warning sign. Without the tree, "revenue is up" is the whole story; with it, you know to ask why customers are ordering less often.

### Vanity metrics

A **vanity metric** looks impressive but doesn't help anyone decide anything: total registered customers ever, total social media followers, total app downloads. They only go up, so they always look good.

Ask of any number: *if this went down, what would we do differently?* If the answer is "nothing", it isn't a KPI.

## Example

Three businesses, three uses of data:

- **A distributor** (Kolanut) compares revenue by region each month. When one region drops, the sales manager calls the rep covering it before the quarter is lost.
- **A logistics company** tracks on-time delivery by route. A route that is late 30% of the time gets a new schedule or a different carrier.
- **A law firm** watches outstanding invoices. Partners get a weekly list of clients whose invoices are more than 30 days overdue: a **leading** indicator for cash problems.

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

**Check it against a target.** If the target for on-time delivery is 97%, the month missed it by 2 percentage points: 25 more deliveries would have needed to arrive on time (97% of 1,240 is 1,203; 1,203 − 1,178 = 25). Turning a gap into a count like this makes it concrete for the people who have to fix it.

> [!TIP]
> Always write down how a KPI is calculated, including what's left out (cancelled orders? returns?). Two people calculating "revenue" differently is one of the most common causes of confusion in meetings.

### Summary

| Term | Meaning |
| :-- | :-- |
| Metric | Any number you can measure |
| KPI | One of the few metrics the business watches to judge performance |
| KPI definition | Name, formula, inclusions, period, source, target, owner |
| Lagging / leading | The result / an early warning of it |
| KPI tree | A KPI split into the parts that multiply to make it |
| Vanity metric | A number that looks good but drives no decision |

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
