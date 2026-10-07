---
title: Inventory Management
minutes: 25
summary: Understand why stock is held, set reorder points and safety stock, calculate economic order quantity, classify items by ABC analysis and keep stock records accurate.
---

## Why hold stock

Inventory is money sitting on a shelf. It costs to hold, but it also does useful work:

- **Buffers against uncertainty** in demand and supply.
- **Smooths** production and delivery so you do not stop and start.
- **Earns discounts** from larger purchases.
- **Protects service,** by keeping goods available.
- **Hedges** against price rises and shortages.

The costs: capital tied up, storage space, handling, insurance, damage, theft, expiry and obsolescence. As a rule of thumb, holding stock costs roughly **15% to 30% of its value per year**. The aim is not zero stock but the **right** stock: enough to serve customers, no more.

## Reorder point and safety stock

When stock falls to the **reorder point (ROP)** you place an order, so that it arrives before you run out.

*ROP = (average daily demand × lead time in days) + safety stock*

**Safety stock** covers variation in demand and lead time. A simple statistical form for variable demand:

*Safety stock = z × (standard deviation of daily demand) × √(lead time in days)*

where **z** reflects the service level you want (about 1.28 for 90%, 1.65 for 95% and 2.33 for 99%).

Example: average demand 40 units a day, daily standard deviation 10, lead time 9 days, 95% service level.
- Safety stock = 1.65 × 10 × √9 = 1.65 × 10 × 3 = **49.5**, about **50 units**.
- ROP = (40 × 9) + 50 = 360 + 50 = **410 units**.

A higher service level needs much more safety stock, which is why 100% is almost never worth chasing.

## Economic order quantity (EOQ)

The **economic order quantity** is the order size that minimises the total of ordering cost and holding cost. Order too often and you pay for many orders; order too much and you pay to hold stock.

*EOQ = √(2 × D × S ÷ H)*

where **D** is annual demand, **S** is the cost of placing one order and **H** is the cost of holding one unit for a year.

Example: D = 12,000 units a year, S = ₦5,000 per order, H = ₦120 per unit a year.
- EOQ = √(2 × 12,000 × 5,000 ÷ 120) = √(120,000,000 ÷ 120) = √1,000,000 = **1,000 units**.
- Orders per year = 12,000 ÷ 1,000 = **12**, about one a month.

EOQ is a guide, not a law. Adjust for supplier minimums, price breaks, shelf life and storage space.

## ABC analysis

Not all items deserve the same attention. **ABC analysis** ranks items by annual usage value (units × cost) and groups them:

- **A items:** the top items that make up about **80%** of the value, usually a small share of items. Manage tightly: frequent review, accurate counts, careful forecasts, close supplier contact.
- **B items:** the next about **15%**. Moderate control.
- **C items:** the many items that make up the last about **5%**. Simple rules and bulk ordering.

Example: five items with annual usage value ₦60m (P), ₦20m (Q), ₦10m (R), ₦6m (S) and ₦4m (T), total ₦100m.
- P = 60% cumulative, Q = 80% → **A**.
- R = 90% → **B**.
- S = 96%, T = 100% → **C**.

## Stock accuracy and cycle counts

Good planning is useless if the records are wrong. **Stock accuracy** is how closely the records match the physical stock. Improve it by:

- **Recording every receipt and issue,** promptly and by one clear method.
- **Locating** each item with a fixed address.
- **Cycle counting:** count a few items every day or week, counting A items most often, instead of a once-a-year stocktake. Investigate every difference and fix the cause.
- **Controlling access** to the store and requiring signed issues.
- **Handling damaged, expired and returned goods** by clear procedures.

Aim for very high accuracy (95% to 99%+ by item). A recorded stock of 50 that is really 30 leads to stockouts nobody sees coming.

## Try it

```task
{
  "id": "scm-m04-t1",
  "prompt": "Annual demand is **12,000 units**, the cost of placing an order is **₦5,000** and the cost of holding a unit for a year is **₦120**. Calculate the **EOQ** and the **number of orders a year**. Say in one sentence why you would still check the result against supplier minimums and storage space.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "EOQ = ...",
  "rules": [
    { "label": "EOQ of 1,000 units", "pattern": "1,?000" },
    { "label": "12 orders a year", "pattern": "\\b12\\b" },
    { "label": "Shows the formula (square root of 2DS/H)", "pattern": "√|sqrt|square root|2\\s?[x×*]" },
    { "label": "Mentions minimums, storage, price breaks or shelf life", "pattern": "minimum|storage|space|price break|shelf|constraint|practical" }
  ],
  "sample": "EOQ = sqrt(2 x 12,000 x 5,000 / 120) = sqrt(1,000,000) = 1,000 units.\nOrders per year = 12,000 / 1,000 = 12.\nI would still check it against supplier minimum order sizes, price breaks, shelf life and storage space, because EOQ only balances ordering and holding cost.",
  "required": true
}
```

```task
{
  "id": "scm-m04-t2",
  "prompt": "Average demand is **40 units a day**, the daily standard deviation is **10**, lead time is **9 days** and you want a **95% service level (z = 1.65)**. Calculate the **safety stock** and the **reorder point**.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Safety stock = ...",
  "rules": [
    { "label": "Safety stock of about 49.5 (or 50)", "pattern": "49\\.5|\\b50\\b" },
    { "label": "Demand during lead time of 360", "pattern": "\\b360\\b" },
    { "label": "Reorder point of about 410", "pattern": "\\b41[0-9]\\b" }
  ],
  "sample": "Safety stock = 1.65 x 10 x sqrt(9) = 1.65 x 10 x 3 = 49.5, about 50 units.\nDemand during lead time = 40 x 9 = 360.\nReorder point = 360 + 50 = 410 units.",
  "required": true
}
```

```task
{
  "id": "scm-m04-t3",
  "prompt": "Classify these items by ABC analysis (A up to 80% cumulative, B to 95%, C the rest): **P ₦60m, Q ₦20m, R ₦10m, S ₦6m, T ₦4m** annual usage value. Give each item's cumulative percentage and class, one per line.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "P - 60% - A",
  "rules": [
    { "label": "Five lines", "minLines": 5 },
    { "label": "P and Q are class A (60% and 80%)", "pattern": "p[\\s\\S]*60[\\s\\S]*a[\\s\\S]*q[\\s\\S]*80[\\s\\S]*a" },
    { "label": "R is class B at 90%", "pattern": "r[^\\n]*90[^\\n]*b" },
    { "label": "S and T are class C", "pattern": "s[^\\n]*96[^\\n]*c[\\s\\S]*t[^\\n]*100[^\\n]*c" }
  ],
  "sample": "P - 60% - A\nQ - 80% - A\nR - 90% - B\nS - 96% - C\nT - 100% - C",
  "required": false
}
```

Next lesson: operations and production planning.
