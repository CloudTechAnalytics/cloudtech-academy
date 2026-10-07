---
title: Landed Cost, Pricing and Profit
minutes: 25
summary: Add up every cost between the supplier and your shelf, allow for exchange rates and payment charges, set a selling price and margin, and build a landed cost calculator you can reuse.
---

## What landed cost is

**Landed cost** is the total cost of getting one unit of a product from the supplier to your warehouse, ready to sell. It is the number that decides whether an import makes money. The supplier's unit price is only the start.

Importers lose money when they price from the supplier's quote. They add a margin to $3.00 and discover later that the real cost was twice that. A landed cost calculator prevents that mistake.

## What goes into landed cost

| Cost | What it is |
| :-- | :-- |
| **Product cost** | Unit price × quantity (with samples and any tooling or branding) |
| **International freight** | Air, sea, courier or the forwarder's door-to-port price |
| **Insurance** | Cargo insurance on the shipment |
| **Duty** | Import duty on the customs value (CIF) |
| **VAT** | On customs value plus duty (some businesses can recover it; confirm with your accountant) |
| **Other levies and charges** | Small customs and processing charges |
| **Clearing agent fees** | Their service charge |
| **Port or terminal charges** | Handling, release, storage if goods stay beyond free days |
| **Local transport** | Port to warehouse, and onward delivery if you pay for it |
| **Bank and payment charges** | Transfer fees, Form M fees, FX margin charged by the bank |
| **Losses** | Damaged, missing or unsellable goods |

Add the last item as an allowance, for example 2% to 5% of product cost, until you have real data.

## Exchange rates and payment charges

You pay the supplier in dollars (or another currency) and sell in naira. If the dollar rises between your order and your payment, your cost in naira rises with it. Protect yourself by:

- **Pricing with a margin for movement.** Use a rate slightly worse than today's.
- **Paying promptly** after you agree the deal rather than waiting.
- **Ordering smaller and more often** if the currency is unstable, so you reprice more frequently.
- **Checking the rate your bank actually uses**, and any fees it adds. The rate on the internet is not the rate you get.

Customs also uses its own exchange rate for valuing goods, which can differ from the one your bank used.

## A worked example

Tunde orders 300 power banks.

| Item | Amount |
| :-- | :-- |
| Product cost: 300 × $3.00 | $900 |
| Air freight | $150 |
| Insurance | $10 |
| **CIF value** | **$1,060** |
| CIF in naira at ₦1,500 to $1 | ₦1,590,000 |
| Duty at 20% | ₦318,000 |
| VAT at 7.5% on (₦1,590,000 + ₦318,000 = ₦1,908,000) | ₦143,100 |
| Clearing agent and port charges | ₦120,000 |
| Local transport | ₦30,000 |
| Bank and payment charges | ₦25,000 |
| **Total landed cost** | **₦2,226,100** |
| **Per unit (÷ 300)** | **₦7,420** |

The supplier's price was $3.00, about ₦4,500 at ₦1,500. The real cost to Tunde is ₦7,420, about **65% higher.** That gap is why this lesson exists.

## Setting a selling price and margin

Start from the cost and the profit you need, then check the market.

- **Markup** is profit as a percentage of **cost**.
- **Margin** is profit as a percentage of the **selling price**.

They are different. A product costing ₦6,000 sold at ₦10,000 has a profit of ₦4,000. The markup is 4,000 ÷ 6,000 = 66.7% and the margin is 4,000 ÷ 10,000 = 40%.

To reach a target margin, divide the cost by (1 minus the margin):

*Selling price = landed cost ÷ (1 − target margin)*

For a cost of ₦7,420 and a 35% target margin: 7,420 ÷ 0.65 = **₦11,415.** Then compare it with competitors' prices. If the market pays less, you must lower cost, change the product or accept a smaller margin. If the market pays more, you may price higher.

Remember the costs still ahead: marketing, packaging, delivery, staff and your own time. A 35% gross margin is not a 35% profit once those are paid.

## A calculator you can reuse

Build one spreadsheet with an input column and formulas, and reuse it for every product:

1. Inputs: quantity, unit price, freight, insurance, exchange rate, duty rate, VAT rate, agent and port charges, transport, bank charges, loss allowance.
2. Formulas: CIF = product + freight + insurance; naira CIF = CIF × rate; duty = naira CIF × duty rate; VAT = (naira CIF + duty) × VAT rate; total; unit cost.
3. Outputs: landed cost per unit, selling price for your target margin, and profit for the batch.
4. A second copy with the dollar **10% higher**, so you can see the effect.

## Try it

```task
{
  "id": "iemi-m09-t1",
  "prompt": "Calculate the **total landed cost** and the **cost per unit** for 200 units. Product cost $4.00 a unit, freight $120, insurance $8, exchange rate ₦1,500 to $1, duty 10%, VAT 7.5% on CIF plus duty, clearing and port charges ₦90,000, local transport ₦20,000, bank charges ₦15,000. Show each step.",
  "minutes": 15,
  "rows": 12,
  "placeholder": "Product cost = ...\nCIF = ...",
  "rules": [
    { "label": "Product cost of $800", "pattern": "\\$?\\s?800\\b" },
    { "label": "CIF of $928 or ₦1,392,000", "pattern": "928|1,?392,?000" },
    { "label": "Duty of ₦139,200", "pattern": "139,?200" },
    { "label": "VAT of ₦114,840", "pattern": "114,?840" },
    { "label": "Total landed cost of ₦1,771,040", "pattern": "1,?771,?040" },
    { "label": "Cost per unit of about ₦8,855", "pattern": "8,?85[0-9]|8,?856" }
  ],
  "sample": "Product cost = 200 x $4.00 = $800.\nCIF = 800 + 120 + 8 = $928.\nCIF in naira = 928 x 1,500 = ₦1,392,000.\nDuty at 10% = ₦139,200.\nVAT = 7.5% of (1,392,000 + 139,200 = 1,531,200) = ₦114,840.\nOther costs = 90,000 + 20,000 + 15,000 = ₦125,000.\nTotal landed cost = 1,392,000 + 139,200 + 114,840 + 125,000 = ₦1,771,040.\nCost per unit = 1,771,040 / 200 = ₦8,855.2, about ₦8,855.",
  "required": true
}
```

```task
{
  "id": "iemi-m09-t2",
  "prompt": "A product has a landed cost of **₦6,000** per unit. (a) What selling price gives a **40% margin**? (b) What is the profit per unit? (c) What is the **markup** on cost at that price? Show the formula you used for (a).",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Selling price = ...",
  "rules": [
    { "label": "Selling price of ₦10,000", "pattern": "10,?000" },
    { "label": "Profit of ₦4,000", "pattern": "4,?000" },
    { "label": "Markup of about 66.7% (or 67%)", "pattern": "66\\.?7|\\b67\\s?%|66\\.6" },
    { "label": "Uses cost divided by (1 minus margin)", "pattern": "0\\.6|1\\s?-\\s?0\\.4|1\\s?-\\s?40" }
  ],
  "sample": "(a) Selling price = cost / (1 - margin) = 6,000 / (1 - 0.40) = 6,000 / 0.6 = ₦10,000.\n(b) Profit = 10,000 - 6,000 = ₦4,000 per unit.\n(c) Markup = 4,000 / 6,000 = 66.7% of cost.",
  "required": true
}
```

```task
{
  "id": "iemi-m09-t3",
  "prompt": "Your product cost is $900 and the exchange rate moves from ₦1,500 to ₦1,650 to the dollar. Work out the product cost in naira at each rate, the increase in naira and the percentage increase. Then write one sentence about how you protect your price from this.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "At ₦1,500 = ...",
  "rules": [
    { "label": "₦1,350,000 at the old rate", "pattern": "1,?350,?000" },
    { "label": "₦1,485,000 at the new rate", "pattern": "1,?485,?000" },
    { "label": "Increase of ₦135,000", "pattern": "135,?000" },
    { "label": "Increase of 10%", "pattern": "\\b10\\s?%|10 percent" },
    { "label": "Says how to protect the price (margin buffer, pay promptly, reprice, order smaller)", "pattern": "buffer|margin|promptly|reprice|smaller|often|allow" }
  ],
  "sample": "At ₦1,500: 900 x 1,500 = ₦1,350,000.\nAt ₦1,650: 900 x 1,650 = ₦1,485,000.\nIncrease = ₦135,000, which is 10%.\nI protect my price by pricing with a buffer for exchange rate movement, paying the supplier promptly and ordering smaller batches more often so I can reprice.",
  "required": false
}
```

Next lesson: selling what you have imported.
