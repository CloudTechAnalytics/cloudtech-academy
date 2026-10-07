---
title: Final Project - Analyse and Improve a Supply Chain
minutes: 55
summary: Map a real or realistic supply chain, find its problems with data, recommend improvements with numbers and present your case.
---

## What you are building

You now have the tools to plan demand, set stock, manage suppliers, design warehousing and transport, measure performance and weigh risk. In this project you apply them to **one supply chain** and show how it could work better.

Choose a chain you can find information about: a shop or business you know, a product you buy (rice, bread, phone accessories, a medicine), a school canteen, a company's published case study or a realistic business you invent with sensible numbers. Use real data where you can, and state your assumptions where you cannot.

## Your project has six parts

1. **The chain.** Describe the product and customers and **map** the chain from source to customer: the links, the flows of goods, information and money, and the strategy (efficient or responsive).
2. **The data.** Present the numbers you will use: demand history, lead times, stock levels, costs, delivery performance, service levels. Say where each came from.
3. **The diagnosis.** Calculate at least **four measures** (for example fill rate, on-time delivery, inventory turns, days of inventory, cost per delivery, cash-to-cash, forecast error) and identify the **three biggest problems**, with evidence.
4. **The improvements.** For each problem, a specific recommendation: a forecast method, a reorder point or EOQ, a supplier change, a layout or route change, a risk response. Show the **calculation** behind each.
5. **The business case.** The expected benefit in naira (savings, cash released or sales protected), the cost and effort, and the risks.
6. **The plan.** Who does what by when, and how you will measure whether it worked.

## Writing it up

Write for the owner or manager who will decide whether to act. Open with a one-paragraph summary: the main problems, the recommendations and the expected benefit. Use a diagram or table for the map and a table for the KPIs. Show formulas and workings so a reader can check them.

> [!TIP]
> Good projects choose a few problems and solve them with numbers, instead of listing everything that could be better. Rank by size of benefit and ease.

## Try it

```task
{
  "id": "scm-m12-t1",
  "prompt": "Describe your **chosen supply chain** in 60 to 140 words: the product, the customers, the main links from source to customer, and whether it should be an **efficient or responsive** chain and why.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "The product is ...",
  "rules": [
    { "label": "Names the product and customers", "pattern": "product|customers?|sells?|buys?|shop|business" },
    { "label": "Names links (supplier, producer, distributor, retailer, transport)", "pattern": "supplier|producer|manufactur|distribut|retail|wholesal|transport|warehouse" },
    { "label": "Chooses efficient or responsive", "pattern": "efficient|responsive" },
    { "label": "Gives a reason", "pattern": "because|since|so that|stable|predictable|fast-?changing|uncertain|cost|speed" },
    { "label": "Between 60 and 140 words", "minWords": 60, "maxWords": 145 }
  ],
  "sample": "The product is bagged rice sold by a family wholesale business in Ibadan to market traders and small shops. The chain runs from rice farms and a mill in the north, through a transporter and a regional distributor, to the wholesaler's warehouse and then to traders and shops. Demand is steady and prices are tight, so it should run an efficient chain, because customers value low cost and reliable availability more than speed, and demand is predictable apart from the festive season. The weak links appear to be the long lead time from the mill, too much stock at the warehouse and late deliveries to traders.",
  "required": true
}
```

```task
{
  "id": "scm-m12-t2",
  "prompt": "Present **four measures** for your chain with the numbers and the calculation, one per line: for example fill rate, on-time delivery, inventory turns or days of inventory, cost per delivery or cash-to-cash. Label any figure you assumed.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Fill rate = 900 / 1,000 = 90%",
  "rules": [
    { "label": "At least four lines", "minLines": 4 },
    { "label": "Shows calculations (divisions or equals signs)", "pattern": "=|/|÷", "perLine": true },
    { "label": "Includes a service measure (fill rate, on-time, OTIF)", "pattern": "fill rate|on-?time|otif|perfect order" },
    { "label": "Includes an inventory or cost measure", "pattern": "turn|days of inventory|cost per|cash-to-cash|inventory|accuracy" },
    { "label": "Gives percentages or numbers", "pattern": "\\d+\\s?%|\\d{2,}" }
  ],
  "sample": "Fill rate = 900 units shipped / 1,000 ordered = 90%\nOn-time delivery = 68 orders on time / 85 orders = 80%\nInventory turnover = cost of goods sold ₦180,000,000 / average inventory ₦45,000,000 = 4 times a year (assumed from the owner's estimate)\nDays of inventory = 365 / 4 = 91 days\nCost per delivery = ₦2,400,000 / 600 deliveries = ₦4,000",
  "required": true
}
```

```task
{
  "id": "scm-m12-t3",
  "prompt": "State your **three biggest problems** and a **recommendation with a calculation** for each, one per line, in the form \"Problem - evidence - recommendation - benefit\". At least three lines.",
  "minutes": 15,
  "rows": 9,
  "placeholder": "Problem: ... - Evidence: ... - Recommendation: ... - Benefit: ...",
  "rules": [
    { "label": "Three lines", "minLines": 3 },
    { "label": "Each line has a problem and a recommendation", "pattern": "problem[^\\n]*recommend", "perLine": true },
    { "label": "Each line has evidence or a number", "pattern": "\\d", "perLine": true },
    { "label": "Each line states a benefit", "pattern": "benefit|save|saving|release|protect|reduce|improve|₦", "perLine": true }
  ],
  "sample": "Problem: too much slow stock at the warehouse - Evidence: 91 days of inventory against a 60-day target - Recommendation: reorder with a reorder point and EOQ, and clear slow lines - Benefit: about ₦15 million of cash released.\nProblem: 20% of deliveries are late - Evidence: 68 of 85 orders on time - Recommendation: plan routes by area and confirm delivery windows - Benefit: fewer penalties and an on-time rate near 90%.\nProblem: stockouts in December - Evidence: fill rate of 90% at the festive peak - Recommendation: use a seasonal index of 1.4 and raise safety stock in November - Benefit: about 8% more sales protected.",
  "required": true
}
```

```task
{
  "id": "scm-m12-t4",
  "prompt": "Write your **business case and action plan** in 60 to 140 words: the total expected benefit in naira, the cost and effort, the main risk, who does what by when, and the KPI you will watch.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "The expected benefit is ...",
  "rules": [
    { "label": "States a benefit in naira", "pattern": "₦\\s?\\d|naira" },
    { "label": "States a cost or effort", "pattern": "cost|effort|invest|time|training|spend" },
    { "label": "States a risk", "pattern": "risk" },
    { "label": "Says who does what by when", "pattern": "by (end|the|week|month|\\d)|within|owner|manager|responsible|weeks?|months?" },
    { "label": "Names a KPI to watch", "pattern": "kpi|fill rate|on-?time|turnover|days of inventory|cash-to-cash|measure" },
    { "label": "Between 60 and 140 words", "minWords": 60, "maxWords": 145 }
  ],
  "sample": "The expected benefit is about ₦15 million of cash released from stock and ₦2.4 million a year saved on late-delivery penalties and rush trips, against a cost of about ₦600,000 for training and a simple tracking spreadsheet. The main risk is that staff do not follow the new reorder rules, so the warehouse manager will own them and train the team by the end of month one. The logistics supervisor will introduce route planning in month two. We will watch days of inventory and on-time delivery every month and review them in the management meeting.",
  "required": true
}
```

When you are done, submit your complete project.
