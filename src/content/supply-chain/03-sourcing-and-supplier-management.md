---
title: Sourcing and Supplier Management
minutes: 20
summary: Decide what to make and what to buy, choose and develop suppliers, plan around lead times and reliability and manage supplier risk.
---

## Make or buy

The first sourcing decision is whether to **make** something yourself or **buy** it. Make-or-buy depends on cost, capability, control and risk.

**Reasons to make in-house:**

- It is part of your core skill or competitive edge.
- You need tight control over quality, secrecy or timing.
- Volumes are high enough to cover the fixed cost.
- No reliable supplier exists.

**Reasons to buy:**

- A specialist can make it better or cheaper.
- Volumes are too low to justify equipment and staff.
- You want to focus capital and attention on what you do best.
- You need flexibility to scale up or down.

Compare costs honestly. Example: making a part costs **₦2,000,000 a year in fixed costs** (equipment, supervisor) plus **₦300 per unit**; buying costs **₦500 per unit**.
- Break-even volume = fixed cost ÷ (buy price − variable make cost) = 2,000,000 ÷ (500 − 300) = **10,000 units a year**.
- At 12,000 units: making costs 2,000,000 + 12,000 × 300 = ₦5,600,000; buying costs 12,000 × 500 = ₦6,000,000. **Make** is ₦400,000 cheaper.
- At 8,000 units: making costs 2,000,000 + 2,400,000 = ₦4,400,000; buying costs ₦4,000,000. **Buy** is cheaper.

Also weigh non-cost factors: quality control, capacity, supplier dependence and what else the money could do.

## Choosing and developing suppliers

Selection looks at more than price (see the Procurement & Sourcing course for the full process). For a supply chain, pay special attention to:

- **Capability and capacity:** can they meet your volume, and grow with you?
- **Quality systems:** consistent quality, certifications, defect rates.
- **Reliability:** on-time delivery and the variation in lead time.
- **Flexibility:** can they handle changes in order size or timing?
- **Financial health:** will they survive a bad year?
- **Location and risk exposure:** floods, strikes, port problems, political risk.
- **Cost and terms:** total cost, payment terms and price stability.

**Supplier development** means helping good suppliers get better: sharing forecasts, giving feedback and scorecards, training, joint improvement projects and fair, longer-term agreements. It builds loyalty and quality, and costs less than finding a new supplier every year.

## Lead times and reliability

**Lead time** is the time from placing an order to receiving it ready to use. Two numbers matter:

- **Average lead time:** how long it usually takes.
- **Variability:** how much it moves around. A supplier with a 10-day lead time that sometimes takes 20 days is harder to plan around than one who always takes 12.

Example: a supplier's last five lead times were 10, 12, 14, 10 and 14 days. Average = (10 + 12 + 14 + 10 + 14) ÷ 5 = **12 days**; the range is 10 to 14. You should plan around 14 days, or hold safety stock to cover the variation.

Shorter and more reliable lead times mean less stock, lower cost and better service. Work with suppliers to reduce both the time and the variation, and measure them.

## Supplier risk

Every supplier carries risk. Common types:

| Risk | Example |
| :-- | :-- |
| **Supply failure** | Factory fire, strike, shortage of materials |
| **Quality** | Defects, contamination, inconsistent batches |
| **Financial** | Supplier goes bankrupt |
| **Location / external** | Floods, port closure, conflict, exchange rate shocks |
| **Dependency** | One supplier provides a critical part |
| **Compliance and reputation** | Child labour, safety or environmental violations |

**Managing it:**

- **Rank suppliers by spend and by how critical they are,** and focus on the high-risk ones.
- **Dual-source** critical items, or at least pre-qualify a backup.
- **Hold safety stock** of vital parts.
- **Monitor** supplier performance, finances and news.
- **Write continuity terms** into contracts.
- **Audit** key suppliers.
- **Plan responses** for the main scenarios before they happen.

## Try it

```task
{
  "id": "scm-m03-t1",
  "prompt": "A part can be **made** for ₦2,000,000 a year fixed plus ₦300 a unit, or **bought** at ₦500 a unit. Work out the **break-even volume**, then the cost of each option at **12,000 units** and say which is cheaper.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Break-even = ...",
  "rules": [
    { "label": "Break-even of 10,000 units", "pattern": "10,?000" },
    { "label": "Make cost of ₦5,600,000", "pattern": "5,?600,?000" },
    { "label": "Buy cost of ₦6,000,000", "pattern": "6,?000,?000" },
    { "label": "Says make is cheaper at 12,000", "pattern": "mak(e|ing)[^.]*(cheaper|lower|less|better)|cheaper[^.]*mak(e|ing)" }
  ],
  "sample": "Break-even = 2,000,000 / (500 - 300) = 10,000 units a year.\nAt 12,000 units: make = 2,000,000 + 12,000 x 300 = ₦5,600,000; buy = 12,000 x 500 = ₦6,000,000.\nMaking is cheaper by ₦400,000 at 12,000 units, because volume is above the break-even.",
  "required": true
}
```

```task
{
  "id": "scm-m03-t2",
  "prompt": "A supplier's last five lead times were **10, 12, 14, 10 and 14** days. Work out the average, the range and say which lead time you would plan around and why. Then suggest one way to reduce the variation.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Average = ...",
  "rules": [
    { "label": "Average of 12 days", "pattern": "\\b12\\b" },
    { "label": "Range of 10 to 14 days", "pattern": "10[\\s\\S]*14" },
    { "label": "Plans around the longer lead time or safety stock", "pattern": "14|longest|safety stock|buffer|worst" },
    { "label": "Suggests a way to reduce variation", "pattern": "supplier|forecast|share|agree|meeting|improve|review|contract|scorecard|feedback" }
  ],
  "sample": "Average = (10 + 12 + 14 + 10 + 14) / 5 = 12 days, with a range of 10 to 14 days.\nI would plan around 14 days, or hold safety stock, because the lead time varies and a late delivery causes a stockout.\nTo reduce the variation I would share forecasts with the supplier and review lead time performance on a monthly scorecard.",
  "required": true
}
```

```task
{
  "id": "scm-m03-t3",
  "prompt": "A bakery buys its **flour from one supplier**. List **four actions** to reduce the risk. One per line.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Qualify a second supplier ...",
  "rules": [
    { "label": "Four lines", "minLines": 4 },
    { "label": "Includes a second or backup supplier", "pattern": "second|backup|alternative|dual|another supplier" },
    { "label": "Includes safety stock", "pattern": "safety stock|buffer|stock" },
    { "label": "Includes monitoring or audits", "pattern": "monitor|audit|watch|review|visit|track" },
    { "label": "Includes contract terms or communication", "pattern": "contract|agreement|terms|share|communicat|notice" }
  ],
  "sample": "Qualify a second flour supplier and buy a small share from them regularly.\nHold safety stock of flour to cover two weeks.\nMonitor the main supplier's delivery performance and finances monthly.\nAgree contract terms that require early notice of any shortage and priority supply.",
  "required": false
}
```

Next lesson: inventory management.
