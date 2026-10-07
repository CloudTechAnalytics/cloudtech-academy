---
title: Final Project - Your Import or Export Business
minutes: 55
summary: Bring the course together by choosing your product and market, building the supplier and shipping plan, calculating costs and price, and presenting a business plan you can act on.
---

## What you are building

You have learned the whole path: choose a product, find and verify a supplier, negotiate, ship, clear customs, price and sell. In this final module you put it in one plan. The plan should be good enough that you could start the first order from it, and good enough to show a partner, a bank or a mentor.

Pick **one** product and **one** route, either an **import into Nigeria** or an **export from Nigeria**. Be specific: a real product, a real quantity, real numbers. Use today's prices from real suppliers, forwarders and marketplaces. Where you must assume a number, say so.

## Your plan has six parts

1. **Product and market.** The product, who buys it, why they will buy from you, and the evidence of demand and competition.
2. **Suppliers (or buyers).** A shortlist of at least three suppliers, compared on the same terms, and your verification steps. If you export, your target buyers and how you will check them.
3. **Order and shipping.** The order quantity, MOQ, sample plan, payment terms, shipping route (air, sea, courier), the forwarder and the documents.
4. **Compliance and clearance.** The agencies, permits and registrations your product needs, the HS code, and how you will clear it.
5. **Costs and price.** A full landed cost (or export price) per unit, your selling price, margin and the effect of a weaker naira.
6. **Selling, cash flow and risks.** Where and how you will sell, your first 90 days, your reorder rule and your top risks with fixes.

## Writing the plan

Write for a reader who knows nothing about your product. Use numbers instead of adjectives ("sold 40 units at ₦12,000" rather than "sold well"). Keep each part short, a few lines each, and put long tables in an appendix or attachment.

> [!TIP]
> If a number worries you, test it. Change the exchange rate by 10%, the freight by 20% and the selling price down by 10%, and see whether the plan still works. A plan that only works when everything goes right is not a plan.

## Try it

```task
{
  "id": "iemi-m12-t1",
  "prompt": "Describe your **product, market and buyers** in 60 to 140 words. Say what the product is, who will buy it and why, the price range you found in your market, and one competitor.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "My product is ...",
  "rules": [
    { "label": "Names the product", "pattern": "product|power bank|blender|ginger|sesame|shea|cases?|ring light|bag|shoes|hair|cream|stationery|[a-z]{4,}" },
    { "label": "Says who will buy it", "pattern": "customers?|buyers?|shops?|students|women|men|retailers?|traders?|families|offices" },
    { "label": "Gives a price range in naira or dollars", "pattern": "[₦$]\\s?\\d|\\bngn\\b|naira|dollars" },
    { "label": "Names a competitor or where competitors sell", "pattern": "competitor|jumia|jiji|instagram|seller|shop|brand|market" },
    { "label": "Between 60 and 140 words", "minWords": 60, "maxWords": 145 }
  ],
  "sample": "My product is a 20,000mAh power bank for people in Lagos who use their phones all day and lose power in traffic or during outages. My buyers are young professionals, students and small shops that resell phone accessories. I found about 25 sellers on Jumia and many on Instagram. Prices range from ₦8,500 for unknown brands to ₦20,000 for known ones, and a typical price is ₦12,000. A main competitor is a seller on Jumia with 300 reviews, but many reviews complain that the capacity is overstated and that it is slow to charge. I will compete by testing every unit and giving a 3-month replacement guarantee.",
  "required": true
}
```

```task
{
  "id": "iemi-m12-t2",
  "prompt": "Write your **supplier and shipping plan**: list your three shortlisted suppliers (one line each, with price, terms and MOQ), then your sample plan, payment terms, shipping method and the documents you will need. At least eight lines.",
  "minutes": 15,
  "rows": 12,
  "placeholder": "Supplier A - ...\nSample plan: ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Lists suppliers with prices", "pattern": "supplier[\\s\\S]*[$₦]\\s?\\d" },
    { "label": "States shipping terms", "pattern": "\\b(fob|exw|cif|dap|ddp)\\b" },
    { "label": "Includes a sample plan", "pattern": "sample" },
    { "label": "States payment terms", "pattern": "deposit|payment|balance|trade assurance|escrow" },
    { "label": "States the shipping method", "pattern": "air|sea|lcl|fcl|courier" },
    { "label": "Lists documents", "pattern": "invoice|packing list|bill of lading|air ?waybill|form m" }
  ],
  "sample": "Supplier A - Brightcell, Shenzhen, factory - $3.00 per unit, FOB, MOQ 200, verified by licence and video call\nSupplier B - PowerMax Trading, trader - $2.70, EXW, MOQ 500, not verified\nSupplier C - Zhuo Electronics, factory - $3.20, FOB, MOQ 100, ships to Nigeria often\nSample plan: order one sample from A and C by courier, test capacity, charging speed and safety, keep them for comparison.\nPayment terms: 30% deposit through Trade Assurance and 70% balance after pre-shipment inspection.\nShipping method: air cargo for 300 units, about 200 kg chargeable, with an experienced forwarder in Shenzhen.\nInsurance: cargo insurance on the full invoice value.\nDocuments: commercial invoice, packing list, air waybill, Form M, PAAR and the relevant SON certificate.",
  "required": true
}
```

```task
{
  "id": "iemi-m12-t3",
  "prompt": "Write your **landed cost and price** for your first order. One line each: quantity, product cost, freight and insurance, exchange rate, duty and VAT, clearing and port, local transport, bank charges, total landed cost, cost per unit, selling price, margin percentage.",
  "minutes": 15,
  "rows": 14,
  "placeholder": "Quantity: ...\nProduct cost: ...",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Includes quantity and product cost", "pattern": "quantity[\\s\\S]*product cost|product cost[\\s\\S]*quantity" },
    { "label": "Includes freight and insurance", "pattern": "freight[\\s\\S]*insurance|insurance[\\s\\S]*freight" },
    { "label": "Includes exchange rate", "pattern": "exchange rate|₦\\s?[\\d,]+\\s?(to|per|/)\\s?\\$" },
    { "label": "Includes duty and VAT", "pattern": "duty[\\s\\S]*vat|vat[\\s\\S]*duty" },
    { "label": "Includes total landed cost and cost per unit", "pattern": "total[\\s\\S]*(per unit|unit cost)|(per unit|unit cost)[\\s\\S]*total" },
    { "label": "Includes selling price and margin", "pattern": "selling price[\\s\\S]*margin|margin[\\s\\S]*selling price" }
  ],
  "sample": "Quantity: 300 units\nProduct cost: 300 x $3.00 = $900\nFreight and insurance: $150 + $10 = $160 (air)\nExchange rate: ₦1,500 to $1, so CIF is $1,060 = ₦1,590,000\nDuty at 20%: ₦318,000\nVAT at 7.5% on CIF plus duty: ₦143,100\nClearing and port charges: ₦120,000\nLocal transport: ₦30,000\nBank charges: ₦25,000\nTotal landed cost: ₦2,226,100\nCost per unit: about ₦7,420\nSelling price: ₦11,500 retail and ₦9,500 wholesale\nMargin: about 35% at retail",
  "required": true
}
```

```task
{
  "id": "iemi-m12-t4",
  "prompt": "Write your **first 90 days and your risks**: where you will sell, how many units by when, your reorder rule, and your **three biggest risks**, each with a fix. At least seven lines.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "Month 1: ...\nRisk: ... - Fix: ...",
  "rules": [
    { "label": "At least seven lines", "minLines": 7 },
    { "label": "Says where it will sell", "pattern": "instagram|whatsapp|jumia|jiji|shop|market|wholesale|retail|website|buyers?" },
    { "label": "Gives a time plan (month, week, days)", "pattern": "month|week|\\d+\\s*days" },
    { "label": "States a reorder rule", "pattern": "reorder|re-order|order again|repeat" },
    { "label": "Lists risks with fixes", "pattern": "risk[\\s\\S]*fix" }
  ],
  "sample": "Month 1: pre-sell 20 units to my existing Instagram and WhatsApp customers and place the order.\nMonth 2: the goods arrive and clear; sell 40 units at retail and 60 to three wholesale shops.\nMonth 3: sell the remaining units and review the numbers.\nReorder rule: reorder when stock falls to 100 units, which covers lead time plus a one-month buffer.\nRisk: the supplier takes the deposit and does not ship - Fix: verify the company and use Trade Assurance with a 30% deposit.\nRisk: the naira falls before payment - Fix: pay the supplier promptly and price with a 10% buffer.\nRisk: customs delay or document mismatch - Fix: check every document before shipping and use a licensed clearing agent.",
  "required": true
}
```

When you are done, submit your complete plan as your final project.
