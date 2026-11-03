---
title: Vendor Evaluation
minutes: 25
summary: Choose evaluation criteria, score suppliers on a weighted scale across quality, delivery, price and risk, and use visits, references and trials to check the scores.
---

## Why evaluate

The cheapest quote is not always the best supplier. A cheap supplier who delivers late, sends faulty goods or disappears costs far more than the saving. **Vendor evaluation** compares suppliers on several things that matter, using the same method for each, so the choice is fair and you can explain it.

## Choosing the criteria

Pick the criteria that matter for **this** purchase. Common ones:

| Criterion | What to look at |
| :-- | :-- |
| **Price** | Unit price and total cost, including delivery and any extras |
| **Quality** | Meets the specification, defect rate, certifications, samples |
| **Delivery** | Lead time, reliability, ability to meet your date |
| **Service and support** | Responsiveness, after-sales, warranty, handling of problems |
| **Financial stability** | Likely to be in business to complete and support the order |
| **Capacity** | Able to supply your volume, now and as you grow |
| **Compliance and reputation** | Registered, tax compliant, approvals, references, ethical practice |
| **Risk** | Dependence on one source, location, currency exposure |

For a routine item like stationery, price and delivery may dominate. For a safety-critical part, quality and compliance should carry the most weight.

## Weighted scoring

A **scoring matrix** turns judgment into numbers.

1. List the criteria.
2. Give each a **weight** showing its importance. Weights add to 100%.
3. Score each supplier on each criterion, for example from 1 (poor) to 10 (excellent).
4. **Multiply** each score by its weight and add up.

Example weights: price 40%, quality 30%, delivery 20%, service 10%.

| Criterion | Weight | Supplier A score | A weighted | Supplier B score | B weighted |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Price | 40% | 8 | 3.2 | 6 | 2.4 |
| Quality | 30% | 6 | 1.8 | 9 | 2.7 |
| Delivery | 20% | 7 | 1.4 | 8 | 1.6 |
| Service | 10% | 9 | 0.9 | 7 | 0.7 |
| **Total** | 100% | | **7.3** | | **7.4** |

Supplier B scores slightly higher: dearer, but better quality and delivery. The matrix does not decide for you, but it makes you state your priorities and shows when two suppliers are close.

> [!NOTE]
> Agree the criteria and weights **before** you look at the quotes. Changing them afterwards to favour a supplier you already like is unfair, and a classic sign of bias.

## Quality, delivery, price and risk

- **Quality:** ask for samples, test reports and certificates. Check the defect rate on past orders where you have it.
- **Delivery:** ask for lead times and check them with references. Ask what happens when a delivery is late.
- **Price:** compare **total cost**, including delivery, installation, payment terms and what is not included.
- **Risk:** a supplier who is cheapest and sole source with unclear finances is a risk. Look for backup options.

## Visits, references and trials

Documents show what a supplier says. These show what they do:

- **References.** Call two or three current customers and ask: Does the supplier deliver on time? How are problems handled? Would you buy from them again?
- **Site visits.** See the premises, stock, equipment and staff. Is it real, organised and big enough?
- **Samples.** Test them against the specification.
- **Trial orders.** For a new supplier, start with a small order before committing to a large one.
- **Financial and legal checks.** Registration, tax compliance and, for large contracts, financial health.

## Try it

```task
{
  "id": "proc-m03-t1",
  "prompt": "Score two suppliers using weights **price 40%, quality 30%, delivery 20%, service 10%**. Supplier X scores 9, 5, 6, 7 (in that order). Supplier Y scores 6, 8, 8, 8. Work out each **weighted total** and say which supplier is better.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "X = ...\nY = ...",
  "rules": [
    { "label": "X total of 7.0", "pattern": "7\\.0|\\b7\\b" },
    { "label": "Y total of 7.2", "pattern": "7\\.2" },
    { "label": "Says Y is better", "pattern": "\\by\\b[^.]*(better|higher|win|choose|best)|choose y|supplier y" },
    { "label": "Shows the weighted calculation", "pattern": "0\\.4|40\\s?%" }
  ],
  "sample": "X = 9 x 0.4 + 5 x 0.3 + 6 x 0.2 + 7 x 0.1 = 3.6 + 1.5 + 1.2 + 0.7 = 7.0.\nY = 6 x 0.4 + 8 x 0.3 + 8 x 0.2 + 8 x 0.1 = 2.4 + 2.4 + 1.6 + 0.8 = 7.2.\nSupplier Y is better overall, although X is cheaper, because Y is stronger on quality and delivery.",
  "required": true
}
```

```task
{
  "id": "proc-m03-t2",
  "prompt": "You are buying **diesel generators** for a hospital. Choose five evaluation criteria, give each a weight (adding to 100%) and say in a few words why. One per line, in the form \"Criterion - weight - why\".",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Reliability - 30% - ...",
  "rules": [
    { "label": "Five criteria", "minLines": 5 },
    { "label": "Every line has a percentage", "pattern": "\\d+\\s?%", "perLine": true },
    { "label": "Includes quality or reliability", "pattern": "quality|reliab|durab" },
    { "label": "Includes price or cost", "pattern": "price|cost" },
    { "label": "Includes service, support or spare parts", "pattern": "service|support|spare|warranty|maintenance" },
    { "label": "Includes delivery or lead time", "pattern": "deliver|lead time|install" }
  ],
  "sample": "Reliability and quality - 30% - a hospital cannot afford power failures\nPrice and running cost - 25% - fuel use and cost over the years matter\nService, spare parts and warranty - 20% - repairs must be fast and local\nDelivery and installation time - 15% - we need power before the new ward opens\nFinancial stability and references - 10% - the supplier must be around to support the machine",
  "required": true
}
```

```task
{
  "id": "proc-m03-t3",
  "prompt": "Write **four questions** you will ask a supplier's reference (a current customer). One per line, each ending with a question mark.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Does the supplier deliver on time?",
  "rules": [
    { "label": "Four questions", "minLines": 4 },
    { "label": "Every line is a question", "pattern": "\\?\\s*$", "perLine": true },
    { "label": "Asks about delivery", "pattern": "deliver|on time|late" },
    { "label": "Asks about quality or problems", "pattern": "quality|problem|issue|complain|fault" },
    { "label": "Asks whether they would buy again", "pattern": "again|recommend|continue" }
  ],
  "sample": "Does the supplier deliver on time and in full?\nHow good is the quality, and how many faulty items have you had?\nWhen something goes wrong, how quickly and fairly do they fix it?\nWould you buy from them again, and would you recommend them?",
  "required": false
}
```

Next lesson: asking for prices with RFQs and RFPs.
