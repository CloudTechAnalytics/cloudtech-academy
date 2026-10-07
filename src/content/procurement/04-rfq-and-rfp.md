---
title: RFQ and RFP
minutes: 25
summary: Choose between an RFQ, an RFP and a tender, write a clear request, compare and score bids on total cost and keep the process fair and documented.
---

## Three ways to ask

Once you have a short list, you ask suppliers for offers in writing. Which method to use depends on the size and complexity of the purchase.

| Method | Use it when | What you ask for |
| :-- | :-- | :-- |
| **RFQ (Request for Quotation)** | The item is clear and standard, and price is the main difference | A price and terms for exactly what you specify |
| **RFP (Request for Proposal)** | The need is complex and suppliers may propose different solutions | A proposal explaining how they would meet the need, their approach, team and price |
| **Tender / formal bidding** | The value is high, or rules (such as for public bodies) require open competition | Sealed bids under fixed rules and deadlines |

Many organisations set **value thresholds**: for example, under a small amount, get one quote; between that and a higher amount, get three written quotes; above it, run a formal tender. Public bodies in Nigeria follow the Public Procurement Act and its thresholds and processes. Your own company should have a policy, and you should follow it.

## Writing a clear request

A weak request leads to quotes you cannot compare. A good RFQ includes:

- **Who you are** and a named contact.
- **What you need:** the full specification and quantity.
- **Where and when:** delivery location and date.
- **What the price must include:** delivery, installation, VAT, packaging.
- **Terms you expect:** payment terms, warranty, validity of the quote.
- **How to respond:** deadline, format, who to send it to, and where to ask questions.
- **How you will decide:** the main criteria, so suppliers know what matters.

A good **RFP** adds the background and the problem, the outcomes you want, what you want in the proposal (approach, timeline, team, references, price breakdown) and the evaluation criteria with weights.

Give **every** supplier the same information at the same time. If one supplier asks a question, share your answer with all.

## Comparing and scoring bids

Do not compare headline prices. Put the bids side by side on the same basis:

| | Supplier A | Supplier B | Supplier C |
| :-- | :-- | :-- | :-- |
| Unit price | ₦24,000 | ₦22,500 | ₦23,000 |
| Quantity | 500 | 500 | 500 |
| Goods total | ₦12,000,000 | ₦11,250,000 | ₦11,500,000 |
| Delivery to site | Included | ₦400,000 extra | Included |
| **Total cost** | **₦12,000,000** | **₦11,650,000** | **₦11,500,000** |
| Delivery time | 14 days | 30 days | 21 days |
| Payment terms | 30 days | On delivery | 14 days |
| Warranty | 12 months | 6 months | 12 months |

Supplier B looked cheapest per unit, but once delivery is added Supplier C is lowest, with a better warranty and shorter delivery. For an RFP, score the **technical** proposal and the **price** separately, then combine with agreed weights. Check each bid is **compliant**: does it meet the specification and the instructions? A very low price from a non-compliant bid is not the best bid.

> [!WARNING]
> Be careful with bids that are far lower than the others. They can mean a misunderstanding of the specification, poorer quality, or an attempt to win and then raise the price later with "variations".

## Fairness and documentation

- **Treat all suppliers equally:** same information, same deadline, same rules.
- **Keep bids confidential** until the deadline. Never show one supplier's price to another.
- **Do not change the criteria** after you have seen the bids.
- **Declare conflicts of interest** and step back if you have one.
- **Record everything:** the request, the bids received, the scoring and who decided, and the reason. Keep it for audit.
- **Tell unsuccessful suppliers politely**, and give brief feedback if they ask.

A decision you can explain and document is a decision you can defend.

## Try it

```task
{
  "id": "proc-m04-t1",
  "prompt": "Compare three bids for 500 chairs. **A**: ₦24,000 each, delivery included. **B**: ₦22,500 each, delivery ₦400,000 extra. **C**: ₦23,000 each, delivery included. Work out the **total cost** of each and say which is lowest.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "A total = ...",
  "rules": [
    { "label": "A total of ₦12,000,000", "pattern": "12,?000,?000" },
    { "label": "B total of ₦11,650,000", "pattern": "11,?650,?000" },
    { "label": "C total of ₦11,500,000", "pattern": "11,?500,?000" },
    { "label": "Says C is lowest", "pattern": "\\bc\\b[^.]*(lowest|cheapest|best|least)|lowest[^.]*\\bc\\b" }
  ],
  "sample": "A = 500 x 24,000 = ₦12,000,000 (delivery included).\nB = 500 x 22,500 = 11,250,000 + 400,000 delivery = ₦11,650,000.\nC = 500 x 23,000 = ₦11,500,000 (delivery included).\nSupplier C has the lowest total cost, although B has the lowest unit price.",
  "required": true
}
```

```task
{
  "id": "proc-m04-t2",
  "prompt": "Write an **RFQ** (a request for quotation) for 500 office chairs. One item per line: your company and contact, the product and specification, quantity, delivery place and date, what the price must include, payment and warranty terms, the deadline and the main criteria for choosing. At least eight lines.",
  "minutes": 15,
  "rows": 12,
  "placeholder": "From: ...\nItem: ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Names the company and a contact", "pattern": "contact|from|company|officer|manager" },
    { "label": "States the item and quantity (500)", "pattern": "500" },
    { "label": "States delivery place or date", "pattern": "deliver[\\s\\S]*(date|by|within|lagos|site|warehouse)" },
    { "label": "States what the price includes", "pattern": "include|vat|delivery|installation" },
    { "label": "States payment or warranty terms", "pattern": "payment|warrant" },
    { "label": "States a deadline to respond", "pattern": "deadline|by \\d|before|closing|no later" },
    { "label": "States the criteria for choosing", "pattern": "criteria|evaluat|judged|selected|decide|award" }
  ],
  "sample": "From: Greenfield Training Centre, Procurement Office. Contact: Ngozi Okoro, purchasing officer, ngozi@example.com\nItem: 500 ergonomic office chairs with armrests, mesh back, adjustable height, weight rating of 120 kg\nQuantity: 500 units, one delivery\nDelivery: to our Ikeja site within 21 days of the order\nPrice must include: delivery, offloading, VAT and assembly\nPayment terms: please state your terms; we prefer 30 days after delivery and acceptance\nWarranty: minimum 12 months; please state spare parts availability\nDeadline: written quotations to reach us by 5 pm on Friday, 14 days from now\nCriteria: total cost, quality against the specification, delivery time, warranty and supplier references",
  "required": true
}
```

```task
{
  "id": "proc-m04-t3",
  "prompt": "One supplier's bid is **30% lower** than the next lowest. In 40 to 90 words, say what you would check before recommending it.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Before recommending it, I would ...",
  "rules": [
    { "label": "Checks the bid meets the specification (compliance)", "pattern": "specif|compliant|meets|requirements|scope" },
    { "label": "Checks for hidden costs or extras", "pattern": "hidden|extra|exclud|variation|not included|add" },
    { "label": "Checks quality, references or ability to deliver", "pattern": "quality|reference|capacity|ability|sample|deliver" },
    { "label": "Asks the supplier to clarify or confirm", "pattern": "clarif|confirm|ask|explain|check with" },
    { "label": "Between 40 and 90 words", "minWords": 40, "maxWords": 95 }
  ],
  "sample": "Before recommending it, I would check that the bid meets the full specification, because a low price may mean the supplier misunderstood the scope or left something out. I would ask them to clarify and confirm in writing what is included, look for hidden extras or variations that could be added later, test a sample for quality and call references to confirm they can deliver this volume on time. If everything checks out, the saving is real.",
  "required": false
}
```

Next lesson: negotiating better prices and terms.
