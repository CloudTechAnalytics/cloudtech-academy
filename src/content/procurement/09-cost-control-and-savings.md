---
title: Cost Control and Savings
minutes: 25
summary: Use total cost of ownership, analyse spend, cut cost without hurting quality and report savings honestly.
---

## Total cost of ownership

The purchase price is only part of what an item costs. **Total cost of ownership (TCO)** adds up everything you pay over its life: purchase price, delivery, installation, running costs, maintenance, training, downtime and disposal, minus any resale value.

Example: two printers for an office over three years.

| | Printer A | Printer B |
| :-- | :-- | :-- |
| Purchase price | ₦150,000 | ₦220,000 |
| Ink per year | ₦40,000 | ₦15,000 |
| Ink for 3 years | ₦120,000 | ₦45,000 |
| **TCO over 3 years** | **₦270,000** | **₦265,000** |

Printer A is ₦70,000 cheaper to buy, but Printer B costs ₦5,000 less overall, and it needs less maintenance and fewer refills. Buying on price alone would have chosen the dearer option. Always ask: *what will this cost us in total?*

## Spend analysis

**Spend analysis** looks at what the business buys, from whom and how much. It shows where the money goes so you can focus effort where it pays.

Steps:

1. **Collect** purchase data for a period (say 12 months): supplier, item, quantity, price, date, department.
2. **Clean** it: merge the same supplier written in different ways, group items into categories.
3. **Rank** categories and suppliers by spend.
4. **Look for patterns:** many suppliers for the same item, prices that vary between departments, items bought urgently at high prices, rising prices.

Often a few categories account for most of the spend, the **80/20 rule**. If the top three of ten categories take 80% of the money, put your best effort there and keep simple rules for the rest.

| Category | Annual spend | Share |
| :-- | :-- | :-- |
| Raw materials | ₦48,000,000 | 60% |
| Packaging | ₦16,000,000 | 20% |
| Transport | ₦8,000,000 | 10% |
| Office supplies | ₦4,000,000 | 5% |
| Other | ₦4,000,000 | 5% |

## Reducing cost without hurting quality

Cutting the price is only one way. Others:

- **Negotiate** price, terms and volume (module 5).
- **Combine demand:** buy together for several departments or sites to earn a larger discount.
- **Reduce the number of suppliers** for the same item to increase volume with each.
- **Standardise** specifications so you buy fewer variations in larger quantities.
- **Change the specification:** does it really need the premium grade or the extra feature?
- **Look at alternatives** or substitutes that do the job.
- **Cut waste:** avoid rush orders, over-ordering, expiry and duplicate purchases.
- **Improve payment terms** and take early-payment discounts where the saving beats the cost of money.
- **Fix the process:** fewer errors, fewer returns, less rework.

Beware of false savings: a cheaper product that breaks sooner, delays that stop production, or a supplier pushed so hard that quality falls. Always check quality and service stay at the level you need.

## Reporting savings

Report savings in a way finance will accept. Two main types:

- **Cost reduction:** you pay less than before for the same thing. Savings = (old price − new price) × quantity. Old price ₦5,000, new price ₦4,600, quantity 1,000: (5,000 − 4,600) × 1,000 = **₦400,000.**
- **Cost avoidance:** you avoided a price rise or an unneeded purchase. Useful, but it is not money out of the budget, so label it separately.

Be honest: compare with the **right baseline** (last price paid, or budget), include the costs of the change, and keep evidence. A savings figure that finance cannot check damages your credibility.

## Try it

```task
{
  "id": "proc-m09-t1",
  "prompt": "Compare the **three-year total cost of ownership** of two generators. **G1**: price ₦2,000,000, fuel ₦900,000 a year, servicing ₦100,000 a year. **G2**: price ₦2,600,000, fuel ₦650,000 a year, servicing ₦80,000 a year. Work out each TCO and say which is cheaper over three years and by how much.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "G1 = ...",
  "rules": [
    { "label": "G1 TCO of ₦5,000,000", "pattern": "5,?000,?000" },
    { "label": "G2 TCO of ₦4,790,000", "pattern": "4,?790,?000" },
    { "label": "Says G2 is cheaper", "pattern": "g2[^.]*(cheaper|lower|less|better)|cheaper[^.]*g2" },
    { "label": "Difference of ₦210,000", "pattern": "210,?000" }
  ],
  "sample": "G1 = 2,000,000 + 3 x (900,000 + 100,000) = 2,000,000 + 3,000,000 = ₦5,000,000.\nG2 = 2,600,000 + 3 x (650,000 + 80,000) = 2,600,000 + 2,190,000 = ₦4,790,000.\nG2 is cheaper over three years by ₦210,000, although it costs more to buy.",
  "required": true
}
```

```task
{
  "id": "proc-m09-t2",
  "prompt": "Annual spend: raw materials ₦48,000,000, packaging ₦16,000,000, transport ₦8,000,000, office supplies ₦4,000,000, other ₦4,000,000. Work out the **total** and the **percentage share** of raw materials and packaging together. Then say where you would focus your effort and why.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Total = ...",
  "rules": [
    { "label": "Total of ₦80,000,000", "pattern": "80,?000,?000" },
    { "label": "Raw materials and packaging total of ₦64,000,000", "pattern": "64,?000,?000" },
    { "label": "Share of 80%", "pattern": "\\b80\\s?%|80 percent" },
    { "label": "Focuses on raw materials and packaging", "pattern": "raw materials?[\\s\\S]*packaging|packaging[\\s\\S]*raw materials?|biggest|largest|most of the" },
    { "label": "Gives a reason (largest saving, 80/20)", "pattern": "because|since|biggest|largest|most|80/20|saving" }
  ],
  "sample": "Total = 48 + 16 + 8 + 4 + 4 = ₦80,000,000.\nRaw materials and packaging = 48,000,000 + 16,000,000 = ₦64,000,000, which is 64/80 = 80% of the spend.\nI would focus on raw materials and packaging, because they are where most of the money goes, so even a small percentage saving there is worth far more than a large one on office supplies.",
  "required": true
}
```

```task
{
  "id": "proc-m09-t3",
  "prompt": "You negotiated the price of an item from ₦5,000 to ₦4,600 on an annual quantity of 1,000. Calculate the **saving**, then say in 30 to 70 words what you would record as evidence and why a ₦400,000 saving should not be mixed with cost avoidance.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Saving = ...",
  "rules": [
    { "label": "Saving of ₦400,000", "pattern": "400,?000" },
    { "label": "Mentions evidence (quotes, old and new price, PO)", "pattern": "evidence|old price|new price|quote|purchase order|po|invoice|baseline|record" },
    { "label": "Mentions the difference between reduction and avoidance", "pattern": "avoid|reduction|budget|not (money|cash)|separate" },
    { "label": "Between 30 and 90 words in total", "minWords": 30, "maxWords": 100 }
  ],
  "sample": "Saving = (5,000 - 4,600) x 1,000 = ₦400,000.\nI would record the old price, the new price, the quantity, the quotes and the purchase orders as evidence, so finance can check the baseline. I would report it as a cost reduction, kept separate from cost avoidance, because a reduction is real money no longer spent while avoidance is only a rise that did not happen, and mixing them makes the figures hard to trust.",
  "required": false
}
```

Next lesson: managing supplier relationships over time.
