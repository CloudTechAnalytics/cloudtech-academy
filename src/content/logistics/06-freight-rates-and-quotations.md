---
title: Freight Rates and Quotations
minutes: 25
summary: Understand how freight is priced, the surcharges and extra charges that add up, how to build a clear quotation with your margin, and how to negotiate with carriers.
---

## How freight is priced

Freight prices depend on **what** you move, **how** and **where**:

- **Mode and service:** air, sea, road; express or standard.
- **Cargo size and weight:** air by chargeable kilogram; LCL sea by cubic metre or tonne (whichever is greater); FCL sea per container; road per truck or per tonne.
- **Route and distance:** direct or with transhipment; busy or quiet routes.
- **Demand and capacity:** rates rise in busy seasons and when space is tight, and fall when space is plentiful.
- **Fuel and operating costs.**
- **Cargo type:** special or dangerous cargo costs more than general cargo.
- **Terms and extras:** who pays port charges, insurance and delivery.

Rates are quoted **per unit**: per kilogram (air), per cubic metre (LCL), per container (FCL). They change often, so quotes have a **validity period**.

## Surcharges and extra charges

The headline freight rate is usually not the whole bill. Typical additions:

| Charge | What it is |
| :-- | :-- |
| **Origin handling / terminal handling charge (THC)** | Handling at the origin port or terminal |
| **Destination handling / THC** | Handling at the arrival port |
| **Documentation fee** | Preparing the transport documents |
| **Bunker or fuel surcharge** | Passes fuel cost changes to the customer |
| **Currency adjustment factor** | Covers exchange rate movement |
| **Peak season surcharge** | In periods of high demand |
| **Security and screening** | Cargo security checks, especially in air freight |
| **Customs clearance fee** | The agent's service |
| **Storage and demurrage / detention** | Charges if goods or containers are kept too long |
| **Inland haulage / delivery** | Truck from port to the customer |
| **Insurance** | If you arrange cover |

A good quotation lists every charge, states what is **included and excluded**, and shows the currency. Hidden extras destroy trust.

## Building a quotation

A forwarder buys services from carriers and others, adds their own margin and sells to the customer. Build the quote in steps:

1. **Collect the cargo details:** goods, quantity, weights, dimensions, origin, destination, terms of sale, dates.
2. **Get costs** from carriers and partners for each part of the journey.
3. **Add all the charges** in a consistent currency.
4. **Add your margin or fee.**
5. **State terms:** validity, payment terms, what is excluded, transit time estimate.

Example: LCL sea freight of 4 CBM.

| Item | Amount |
| :-- | :-- |
| Sea freight: 4 CBM × $90 | $360 |
| Origin handling | $50 |
| Documentation | $35 |
| Destination handling | $70 |
| Local delivery | $120 |
| **Subtotal (cost)** | **$635** |
| Margin at 15% of cost | $95.25 |
| **Quotation to the customer** | **$730.25** |

Be clear whether your margin is a percentage of cost or of the selling price, because they differ. Also state clearly what the customer must still pay separately, such as duty and VAT.

## Negotiating with carriers

Forwarders buy better when they:

- **Bring volume.** Consolidating many customers' cargo gives bargaining power and lower rates.
- **Commit to regular business** through a contract or agreed volume, rather than one-off bookings.
- **Plan and book early,** avoiding the high prices of last-minute space.
- **Compare several carriers** and routes, including indirect ones.
- **Pay on time,** which builds trust and can earn better terms.
- **Ask for the full picture:** rates, surcharges, free days at the port, and conditions.
- **Build relationships** with carrier sales and operations staff.

Always compare the **total cost and reliability**, not only the headline rate. A cheap rate on a route with constant delays can cost the customer more.

## Try it

```task
{
  "id": "lff-m06-t1",
  "prompt": "Build a quotation for **4 CBM LCL** cargo. Sea freight $90 per CBM, origin handling $50, documentation $35, destination handling $70, local delivery $120. Work out the subtotal and the final price with a **15% margin on cost**.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Sea freight = ...",
  "rules": [
    { "label": "Sea freight of $360", "pattern": "360" },
    { "label": "Subtotal of $635", "pattern": "635" },
    { "label": "Margin of $95.25", "pattern": "95\\.25|95\\.3" },
    { "label": "Final price of $730.25", "pattern": "730\\.25|730\\.3" }
  ],
  "sample": "Sea freight = 4 x $90 = $360.\nSubtotal = 360 + 50 + 35 + 70 + 120 = $635.\nMargin at 15% = 0.15 x 635 = $95.25.\nQuotation = 635 + 95.25 = $730.25.",
  "required": true
}
```

```task
{
  "id": "lff-m06-t2",
  "prompt": "A customer says: **\"Your quote is higher than another forwarder's. Why?\"** Write your reply in 60 to 120 words. Explain that you compare like with like, mention what your quote includes, and offer to compare the two line by line.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Thank you for ...",
  "rules": [
    { "label": "Polite", "pattern": "thank|appreciate|understand" },
    { "label": "Mentions what is included or charges", "pattern": "include|charge|surcharge|handling|insurance|delivery|documentation" },
    { "label": "Mentions hidden or missing extras on the other quote", "pattern": "exclud|missing|hidden|extra|not included|add" },
    { "label": "Offers to compare line by line", "pattern": "compare|line by line|side by side|go through" },
    { "label": "Between 60 and 120 words", "minWords": 60, "maxWords": 125 }
  ],
  "sample": "Thank you for sharing the other quote. I understand price matters, but the two may not cover the same things. Our quote includes origin and destination handling, documentation, insurance and delivery to your warehouse, with no hidden extras, while some quotes exclude those and add them later. If you send me the other quote, I would be happy to compare the two line by line and see whether they really cover the same service, and I can then confirm the lowest total cost for you.",
  "required": true
}
```

```task
{
  "id": "lff-m06-t3",
  "prompt": "List **six surcharges or extra charges** that can be added to a freight quote, with a few words on each. One per line.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "Documentation fee - ...",
  "rules": [
    { "label": "Six lines", "minLines": 6 },
    { "label": "Includes a handling charge", "pattern": "handling|thc" },
    { "label": "Includes a fuel or bunker surcharge", "pattern": "fuel|bunker" },
    { "label": "Includes documentation", "pattern": "documentation|document" },
    { "label": "Includes storage, demurrage or detention", "pattern": "storage|demurrage|detention" },
    { "label": "Includes peak season, security or currency", "pattern": "peak|security|currency|exchange" }
  ],
  "sample": "Terminal handling charge - handling at the port of loading or discharge\nDocumentation fee - preparing the bill of lading and other documents\nBunker or fuel surcharge - passes fuel price changes to the customer\nPeak season surcharge - added when demand is high\nSecurity or screening charge - cargo security checks\nStorage and demurrage - charges when goods or containers stay too long\nCurrency adjustment factor - covers exchange rate movement",
  "required": false
}
```

Next lesson: packing, container loading and special cargo.
