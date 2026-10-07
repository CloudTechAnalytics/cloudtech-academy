---
title: Inventory Coordination
minutes: 20
summary: Set stock levels and reorder points, work with stores and the warehouse, forecast demand and avoid both stockouts and overstock.
---

## Why procurement cares about stock

Buyers decide when and how much to order, and those decisions fill the store. Order too little and the business **stocks out**: production stops, customers wait, rush orders cost more. Order too much and money sits on shelves, goods expire or are damaged, and space runs out. Good coordination with stores keeps stock **just right**.

## Stock levels and reorder points

Four numbers do most of the work:

- **Average usage:** how much you use per day, week or month.
- **Lead time:** how long from placing an order to having the goods ready to use.
- **Safety stock:** an extra buffer for surprise demand or late delivery.
- **Reorder point:** the stock level that triggers a new order.

*Reorder point = (average daily usage × lead time in days) + safety stock*

Example: the school uses **20 reams of paper a day**. Lead time is **7 days**. Safety stock is **40 reams**.
- Usage during lead time: 20 × 7 = 140 reams.
- Reorder point = 140 + 40 = **180 reams**.

When stock falls to 180, order. The 140 covers the wait and the 40 covers surprises.

Also set a **maximum level** so you do not over-order. And choose an **order quantity**: ordering more at once may earn a discount but costs more to store.

## Working with stores and the warehouse

Stores and procurement depend on each other:

- **Stores tell procurement** what is in stock, what is moving fast, what is slow and what is damaged or expired.
- **Procurement tells stores** what is on order, expected dates and any delay.
- **Count regularly.** A stock count against the records finds errors and theft early.
- **Use first-in, first-out (FIFO)** for goods that expire or deteriorate, so old stock is used first.
- **Receive properly.** Stock records are only as good as the goods received notes.
- **Agree who may issue stock** and require a signed requisition for every issue.

When requesters demand "urgent" purchases often, ask why. It usually means the reorder points are wrong.

## Forecasting demand

A forecast is an informed estimate of what you will use. Simple methods work well:

- **Past usage.** Look at the last 6 to 12 months.
- **Moving average.** Average of the last few periods. If you used 400, 450 and 500 units in the last three months, the average is (400 + 450 + 500) ÷ 3 = **450** a month.
- **Adjust for known changes:** seasons, promotions, new customers, a new project, price changes.
- **Ask the people who use it.** Sales, production and operations know what is coming.

Review the forecast against what actually happened. The gap tells you how to improve.

## Avoiding stockouts and overstock

| Problem | Causes | Fixes |
| :-- | :-- | :-- |
| **Stockouts** | Reorder point too low, late supplier, poor forecasts, missed counts | Raise safety stock, use a backup supplier, order earlier, track lead times |
| **Overstock** | Over-ordering for discounts, poor forecasts, no one using the item | Lower maximum level, stop reordering, return or sell surplus, share across branches |
| **Dead stock** | Items nobody uses | Review regularly, discount, return, or write off |
| **Expired or damaged stock** | Poor storage or FIFO | Better storage, smaller and more frequent orders |

Not all items need the same attention. Give most care to items that are **costly** or **critical**, and keep simple rules for cheap, low-risk items.

## Try it

```task
{
  "id": "proc-m08-t1",
  "prompt": "A clinic uses **30 boxes of gloves a day**. Lead time is **5 days** and safety stock is **60 boxes**. Work out the **reorder point** and say what the safety stock protects against.",
  "minutes": 8,
  "rows": 5,
  "placeholder": "Reorder point = ...",
  "rules": [
    { "label": "Usage during lead time of 150 boxes", "pattern": "\\b150\\b" },
    { "label": "Reorder point of 210 boxes", "pattern": "\\b210\\b" },
    { "label": "Says safety stock covers late delivery or higher demand", "pattern": "late|delay|surprise|higher demand|unexpected|variation|uncertain" }
  ],
  "sample": "Usage during lead time = 30 x 5 = 150 boxes.\nReorder point = 150 + 60 = 210 boxes.\nThe safety stock protects against late delivery or unexpectedly higher demand while waiting for the order.",
  "required": true
}
```

```task
{
  "id": "proc-m08-t2",
  "prompt": "A shop sold **400, 450 and 500** units in the last three months. Work out the three-month average forecast for next month. Then say in 30 to 70 words what else you would check before you place the order.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Forecast = ...",
  "rules": [
    { "label": "Average of 450", "pattern": "\\b450\\b" },
    { "label": "Mentions a trend, season, promotion or known change", "pattern": "trend|season|promotion|growing|rising|increase|festive|christmas|new customer|price" },
    { "label": "Mentions current stock or what is on order", "pattern": "stock|on order|in hand|already" },
    { "label": "Between 30 and 70 words (after the sum)", "minWords": 30, "maxWords": 100 }
  ],
  "sample": "Forecast = (400 + 450 + 500) / 3 = 450 units for next month.\nBefore ordering, I would check the trend: sales have risen each month, so 450 may be too low, and the festive season may push demand higher. I would also check how much stock is in hand and on order, any promotions planned, and what the shop manager expects, so that I order enough without overstocking.",
  "required": true
}
```

```task
{
  "id": "proc-m08-t3",
  "prompt": "A hospital pharmacy keeps running out of one item and has too much of another. List **four actions** you would take to reduce stockouts and overstock. One per line.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Raise the safety stock on ...",
  "rules": [
    { "label": "Four lines", "minLines": 4 },
    { "label": "Mentions reorder point, safety stock or order timing", "pattern": "reorder|safety stock|order (earlier|sooner)|lead time" },
    { "label": "Mentions stopping or reducing orders of the overstocked item", "pattern": "stop|reduce|lower|maximum|return|share|transfer" },
    { "label": "Mentions counts, records or forecasting", "pattern": "count|record|forecast|review|track" },
    { "label": "Mentions a backup supplier or expiry/FIFO", "pattern": "backup|second supplier|fifo|expir|first-in" }
  ],
  "sample": "Raise the reorder point and safety stock on the item that keeps running out.\nLine up a backup supplier for the critical item.\nStop reordering the overstocked item and lower its maximum level, or transfer or return the surplus.\nCount stock regularly and review usage monthly to improve the forecast, and use FIFO so the oldest stock is used before it expires.",
  "required": false
}
```

Next lesson: controlling cost and showing real savings.
