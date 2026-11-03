---
title: Performance Measurement
minutes: 20
summary: Use the right KPIs (fill rate, on-time delivery, inventory turns and cash-to-cash), understand cost to serve, build dashboards and reviews and run continuous improvement.
---

## Why measure

You cannot improve what you do not measure, and you cannot manage what you measure badly. Good measures tell you **how the chain is performing, where it is failing and whether changes work.** Choose a small number of measures that match your goals: **service, cost, speed, quality and cash.**

## Key performance indicators

| KPI | Formula | What it shows |
| :-- | :-- | :-- |
| **Fill rate** | Units delivered from stock ÷ units ordered | How much of what customers order you can supply |
| **On-time delivery** | Orders delivered by the promised date ÷ total orders | Reliability |
| **OTIF** | Orders on time **and** complete ÷ total orders | The customer's real experience |
| **Perfect order rate** | Orders on time × complete × damage-free × correct documents | A strict overall service measure |
| **Inventory turnover** | Cost of goods sold ÷ average inventory value | How quickly stock sells |
| **Days of inventory** | 365 ÷ inventory turnover | How long stock sits |
| **Order cycle time** | Time from order to delivery | Speed |
| **Forecast accuracy** | 1 − error % | Planning quality |
| **Stock accuracy** | Items where records match count ÷ items counted | Data and process control |
| **Cash-to-cash cycle** | Days of inventory + days of sales outstanding − days of payables | Cash tied up in the chain |

Worked examples:

- **Fill rate:** customers ordered 1,000 units and you shipped 940 from stock. Fill rate = 940 ÷ 1,000 = **94%**.
- **Perfect order rate:** 95% on time and complete, 98% damage-free and 99% correct documents. 0.95 × 0.98 × 0.99 = **92.2%**.
- **Inventory turnover:** cost of goods sold ₦240,000,000 and average inventory ₦40,000,000. Turnover = **6 times a year**; days of inventory = 365 ÷ 6 = **about 61 days**.
- **Cash-to-cash:** 61 days of inventory + 30 days of sales outstanding − 45 days of payables = **46 days.** It means you fund the chain for about 46 days. Shortening it frees cash.

Define each KPI **precisely** (what counts as on time? from which date?) and use the **same definition** every time, or the numbers cannot be compared.

## Cost to serve

**Cost to serve** shows the true cost of supplying each customer or channel, not just the cost of the product. Two customers may buy the same goods but cost very different amounts to serve because of order size, delivery distance, special packaging, returns, payment terms and service demands.

Example for Customer X:

| Item | Amount |
| :-- | :-- |
| Revenue | ₦10,000,000 |
| Product cost | ₦6,000,000 |
| Delivery | ₦1,200,000 |
| Handling and packing | ₦500,000 |
| Cost of credit and admin | ₦300,000 |
| **Profit after cost to serve** | **₦2,000,000** (20%) |

If another customer buys the same revenue but needs many small urgent deliveries and returns goods often, the profit after cost to serve might be 5%, or even a loss. Cost to serve helps you **price properly, set minimum order sizes, change delivery rules and decide where to focus.**

## Dashboards and reviews

A **dashboard** shows the key numbers at a glance, with targets, trends and colour signals (green, amber, red). Keep it simple: 6 to 10 KPIs, clear definitions, a monthly trend and the reason for any red. Use charts that make comparison easy.

Hold **regular reviews:**

- **Daily:** short operations check (orders, stock, deliveries).
- **Weekly:** problem areas and actions.
- **Monthly:** performance against targets, as part of S&OP.
- **Quarterly:** strategy, supplier and customer reviews.

In each review ask: What happened? Why? What will we do? Who will do it and by when? Reviews fail when they only report numbers and never lead to action.

## Continuous improvement

Improvement is a loop. One common version is **Plan – Do – Check – Act (PDCA):**

1. **Plan:** pick a problem, find the root cause and design a fix with a target.
2. **Do:** test it on a small scale.
3. **Check:** measure the result against the target.
4. **Act:** adopt it if it works, adjust if it does not, then start the next cycle.

Tools: the 5 Whys, Pareto charts to find the biggest causes, process maps and simple experiments. Involve the people who do the work, celebrate improvements and keep a log of what you changed and what it achieved.

## Try it

```task
{
  "id": "scm-m10-t1",
  "prompt": "Customers ordered **1,000 units** and you shipped **940**. Cost of goods sold is **₦240,000,000** and average inventory is **₦40,000,000**. Work out the **fill rate**, **inventory turnover** and **days of inventory** (round to a whole number).",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Fill rate = ...",
  "rules": [
    { "label": "Fill rate of 94%", "pattern": "\\b94\\s?%|94 percent" },
    { "label": "Inventory turnover of 6", "pattern": "\\b6\\b" },
    { "label": "About 61 days", "pattern": "\\b6[01]\\b" }
  ],
  "sample": "Fill rate = 940 / 1,000 = 94%.\nInventory turnover = 240,000,000 / 40,000,000 = 6 times a year.\nDays of inventory = 365 / 6 = 60.8, about 61 days.",
  "required": true
}
```

```task
{
  "id": "scm-m10-t2",
  "prompt": "Days of inventory is **61**, days of sales outstanding **30** and days of payables **45**. Calculate the **cash-to-cash cycle**. Then give **two ways** to shorten it.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Cash-to-cash = ...",
  "rules": [
    { "label": "Cash-to-cash of 46 days", "pattern": "\\b46\\b" },
    { "label": "Shows 61 + 30 - 45", "pattern": "61\\s?\\+\\s?30\\s?[-−]\\s?45" },
    { "label": "Suggests two ways (reduce stock, collect faster, negotiate longer supplier terms)", "pattern": "(stock|inventory|collect|receivable|payable|supplier terms|longer terms|invoice)[\\s\\S]*(stock|inventory|collect|receivable|payable|supplier terms|longer terms|invoice)" }
  ],
  "sample": "Cash-to-cash = 61 + 30 - 45 = 46 days.\nI could shorten it by reducing inventory with better forecasting and smaller, more frequent orders, and by collecting from customers faster through clearer invoices and follow-up.",
  "required": true
}
```

```task
{
  "id": "scm-m10-t3",
  "prompt": "A customer orders ₦10,000,000 a year. Product cost is ₦6,000,000, delivery ₦1,200,000, handling ₦500,000 and credit and admin ₦300,000. Calculate the **profit after cost to serve** and the percentage. Then, in 30 to 60 words, say what you would do if another customer with the same revenue only made 3%.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Profit = ...",
  "rules": [
    { "label": "Profit of ₦2,000,000", "pattern": "2,?000,?000" },
    { "label": "Margin of 20%", "pattern": "\\b20\\s?%|20 percent" },
    { "label": "Suggests an action (minimum order, delivery charge, reprice, change terms)", "pattern": "minimum|charge|reprice|price|terms|delivery|order size|consolidat|review|renegotiat" },
    { "label": "Between 40 and 100 words in total", "minWords": 40, "maxWords": 110 }
  ],
  "sample": "Profit after cost to serve = 10,000,000 - 6,000,000 - 1,200,000 - 500,000 - 300,000 = ₦2,000,000, which is 20% of revenue.\nFor the customer making only 3%, I would find what drives the cost, then set a minimum order size, charge for urgent or small deliveries, or review the price and credit terms with them.",
  "required": false
}
```

Next lesson: global supply chains and trade.
