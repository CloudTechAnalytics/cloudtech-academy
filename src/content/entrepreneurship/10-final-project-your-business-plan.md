---
title: "Final Project: Your Business Plan"
minutes: 40
summary: Pull your work together into a business plan, write it clearly, prepare to present and defend it and set out your first 90 days.
---

## What you are building

Over the last nine modules you have found a problem, tested an idea, built a model, planned, set up, thought through marketing, operations, money and people. This project pulls it into **one business plan** you could use to start, show a bank or a funder, or guide a team.

Your plan should describe a **real business you could start**, or one you are already running. Use your own research, interviews and real prices. Where you must assume, say so.

## Your plan has eight parts

1. **Executive summary.** One page: the problem, solution, customers, model, money needed and what you will achieve. Write this last.
2. **The problem and the opportunity.** Who has the problem, evidence from your interviews and tests, and the size of the opportunity.
3. **Product and value proposition.** What you offer and why customers choose it, with your MVP.
4. **Market and competition.** Your target customer, competitors and how you position yourself.
5. **Marketing and sales.** Channels, brand, pricing and your plan for the first customers.
6. **Operations, legal and team.** How the work gets done, suppliers, structure and registration, permits, people and who does what.
7. **Financial plan.** Start-up costs, pricing, break-even, a 6-month cash flow forecast, funding needed and sources.
8. **Risks and the first 90 days.** Your top risks with responses, and a week-by-week or month-by-month action plan with milestones.

## Writing and presenting it

Write for a reader who knows nothing about your business. Use plain language, short paragraphs and tables for numbers. Support claims with evidence, such as interview quotes, test results and price lists. Show your workings so figures can be checked.

Prepare to **present and defend** it in five minutes: the problem, your solution, the proof customers want it, how you make money, what you need and what you will do first. Expect questions such as: *Why will customers choose you? What if sales are half of what you expect? What happens if a key supplier fails? How did you work out these costs?* Have honest answers ready.

> [!TIP]
> A plan that says "we expect to sell 100 a month because 10 of 50 people paid deposits" is far stronger than one that says "everyone will love it."

## Try it

```task
{
  "id": "ent-m10-t1",
  "prompt": "Write your **executive summary** in 80 to 160 words: the problem, your solution, your customers, how you earn, the money you need and the result you aim for in the first year.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "Our business solves ...",
  "rules": [
    { "label": "States the problem", "pattern": "problem|struggle|cannot|lose|waste|difficult" },
    { "label": "States the solution", "pattern": "solution|solves?|we (offer|provide|sell|deliver)|our (product|service)" },
    { "label": "Names the customers", "pattern": "customers?|workers|students|parents|businesses|owners" },
    { "label": "Says how it earns", "pattern": "earn|charge|price|revenue|₦\\s?\\d" },
    { "label": "States money needed", "pattern": "need|require|funding|capital|start-?up" },
    { "label": "States a first-year goal", "pattern": "year|month|goal|target|aim" },
    { "label": "Between 80 and 160 words", "minWords": 80, "maxWords": 165 }
  ],
  "sample": "Office workers in Ikeja have only 30 minutes for lunch and lose half of it queuing at the one canteen, so many skip meals. Our business, Desk Lunch, solves this by delivering fresh, hot lunch boxes to their desks by 12:30, ordered by WhatsApp. Our customers are workers aged 25 to 40 in offices on Allen Avenue. We charge ₦2,500 a meal and ₦11,000 for a weekly subscription, earning about ₦700 profit a meal. In a two-week test, 10 of 50 people paid a ₦5,000 deposit. We need ₦600,000 to start, mainly for equipment, packaging and working capital, funded from savings and a small family loan. In the first year we aim to reach ₦600,000 in monthly sales and 100 regular subscribers.",
  "required": true
}
```

```task
{
  "id": "ent-m10-t2",
  "prompt": "Write your **financial plan summary**, one item per line: start-up costs, selling price, variable cost per unit, fixed costs per month, contribution per unit, break-even units, funding needed and its sources. Show the figures. At least eight lines.",
  "minutes": 15,
  "rows": 11,
  "placeholder": "Start-up costs: ₦...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Start-up costs", "pattern": "start-?up" },
    { "label": "Selling price and variable cost", "pattern": "price[\\s\\S]*variable|variable[\\s\\S]*price" },
    { "label": "Fixed costs", "pattern": "fixed" },
    { "label": "Contribution per unit", "pattern": "contribution" },
    { "label": "Break-even units", "pattern": "break-?even" },
    { "label": "Funding and sources", "pattern": "funding[\\s\\S]*(savings|loan|family|grant|investor|source)|(savings|loan|family|grant|investor)[\\s\\S]*funding" },
    { "label": "Uses naira figures", "pattern": "₦\\s?\\d", "min": 6 }
  ],
  "sample": "Start-up costs: ₦450,000 (equipment ₦200,000, packaging ₦50,000, registration ₦50,000, stock and working capital ₦150,000)\nSelling price: ₦2,500 per meal\nVariable cost: ₦1,800 per meal (ingredients, packaging, delivery)\nFixed costs: ₦140,000 per month (rider, rent share, data, gas)\nContribution per unit: 2,500 - 1,800 = ₦700\nBreak-even: 140,000 / 700 = 200 meals a month\nFunding needed: ₦600,000 including a ₦150,000 reserve\nSources: ₦350,000 savings and ₦250,000 family loan repaid over 12 months",
  "required": true
}
```

```task
{
  "id": "ent-m10-t3",
  "prompt": "Write your **first 90 days**: month 1, month 2 and month 3, each with two or three specific actions and a milestone with a number. At least six lines.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Month 1: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Has month 1, 2 and 3", "pattern": "month 1[\\s\\S]*month 2[\\s\\S]*month 3" },
    { "label": "Includes specific actions (register, buy, launch, pre-sell, hire)", "pattern": "register|buy|launch|pre-?sell|hire|open|set up|test|post|visit|order" },
    { "label": "Includes milestones with numbers", "pattern": "milestone[^\\n]*\\d|\\d+\\s*(customers|orders|meals|sales|subscribers|₦)", "min": 3 }
  ],
  "sample": "Month 1: register the business, buy equipment and packaging, and pre-sell to 30 customers.\nMonth 1 milestone: 30 paid pre-orders and the business account open.\nMonth 2: launch deliveries to three offices and collect feedback from every customer.\nMonth 2 milestone: 60 orders a week with 95% on-time delivery.\nMonth 3: introduce weekly subscriptions and ask for referrals.\nMonth 3 milestone: 40 subscribers and break-even at 200 meals a month.",
  "required": true
}
```

```task
{
  "id": "ent-m10-t4",
  "prompt": "Prepare for questions. Write **three tough questions** an investor might ask and your **honest answer** to each, one per line in the form \"Q: ... A: ...\".",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Q: ... A: ...",
  "rules": [
    { "label": "Three lines", "minLines": 3 },
    { "label": "Each line has a question and an answer", "pattern": "q:[^\\n]*a:", "perLine": true },
    { "label": "Includes numbers or evidence in the answers", "pattern": "a:[^\\n]*(\\d|test|interview|deposit|evidence)", "min": 3 }
  ],
  "sample": "Q: Why will customers choose you over the canteen? A: In our test, 10 of 50 workers paid a deposit because we save them 30 minutes and deliver to the desk.\nQ: What if sales are half what you expect? A: At 100 meals a month we lose about ₦70,000, so we keep fixed costs flexible and have a ₦150,000 cash reserve for three months.\nQ: What if your supplier fails? A: We already buy from 2 market suppliers and hold 3 days of stock of staples.",
  "required": false
}
```

When you are done, submit your complete business plan as your final project.
