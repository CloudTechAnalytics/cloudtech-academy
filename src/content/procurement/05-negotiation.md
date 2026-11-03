---
title: Negotiation
minutes: 25
summary: Prepare for a negotiation, look beyond price to total cost and terms, recognise common tactics and respond to them, and aim for agreements that work for both sides.
---

## Negotiation is preparation

Most negotiations are won or lost before the meeting. A buyer who walks in knowing the market, the alternatives and their limits is far stronger than one who improvises.

Before you negotiate, work out:

- **What you need and what is negotiable.** Price, quantity, delivery, payment terms, warranty, packaging, service.
- **Your target:** the outcome you would be happy with.
- **Your walk-away point:** the least favourable deal you will accept.
- **Your alternatives (BATNA: best alternative to a negotiated agreement).** If this deal fails, what is your next best option? The better your alternative, the stronger you are.
- **The supplier's position:** how much they want your business, their costs, their competition, their deadlines and any pressure they are under.
- **Market information:** other quotes, past prices paid, price trends.
- **What you can give:** larger volume, longer contract, faster payment, a referral, flexible delivery.

Write a short plan: opening position, target, walk-away, what you will trade.

## Price, terms and total cost

Price is only one part of what you pay. Negotiate the whole package:

| Item | Ways it changes your cost |
| :-- | :-- |
| **Unit price** | Volume discounts, tier pricing |
| **Payment terms** | 30 or 60 days to pay helps your cash flow; early-payment discounts save money |
| **Delivery** | Free delivery, delivery schedule, split deliveries |
| **Warranty and service** | Longer warranty, free installation or training |
| **Quantity and flexibility** | Call-off orders, price held for the year |
| **Quality and returns** | Replacement of faulty goods, return of unsold stock |
| **Price protection** | Fixed price for a period, or a cap on increases |

Example: a 3% volume discount on 400 units at ₦15,000 each. Goods total ₦6,000,000; 3% is ₦180,000; the new total is ₦5,820,000. That is real money, and it did not depend on the supplier cutting their headline price.

Always compare offers on **total cost**, not just the unit price.

## Common tactics and how to respond

| Tactic | What it sounds like | Response |
| :-- | :-- | :-- |
| **"This is our final price"** | A hard line early on | Stay calm; ask what could change it (volume, payment, term) |
| **Deadline pressure** | "Offer ends today" | Slow down; real deals rarely vanish in a day. Ask for the reason |
| **Good cop, bad cop** | One person is hard, another friendly | Notice it; keep to your plan |
| **The nibble** | Small extras added at the end | Review the whole deal; trade extras for something |
| **Silence** | A long pause after an offer | Wait; do not fill the silence by dropping your price |
| **Anchor** | A very high first number | Do not accept it as a base; make your own offer with reasons |
| **Competing offers** | "Another buyer will take it" | Ask for evidence; know your alternatives |

Your own good habits: listen more than you talk, ask questions, give reasons for what you ask, never lie, take notes and keep your temper.

## Win-win agreements

The best deals leave both sides willing to continue. A supplier squeezed to a loss will cut quality, deliver late or walk away. Look for trades where each side gives something cheap for them and valuable for the other: you commit to a larger or regular order; they give a better price and priority delivery. Finish by **confirming the agreement in writing**: price, quantity, delivery, payment, warranty and who does what by when.

## Try it

```task
{
  "id": "proc-m05-t1",
  "prompt": "You buy **400 units at ₦15,000**. The supplier offers a **3% volume discount** and **payment in 30 days** instead of on delivery. Work out the goods total before the discount, the discount in naira, and the total after the discount. Then say in one sentence why the payment terms are also valuable.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Total before discount = ...",
  "rules": [
    { "label": "Total before discount of ₦6,000,000", "pattern": "6,?000,?000" },
    { "label": "Discount of ₦180,000", "pattern": "180,?000" },
    { "label": "Total after discount of ₦5,820,000", "pattern": "5,?820,?000" },
    { "label": "Explains the value of longer payment terms (cash flow)", "pattern": "cash ?flow|cash|hold (the )?money|pay later|working capital" }
  ],
  "sample": "Total before discount = 400 x 15,000 = ₦6,000,000.\nDiscount at 3% = 0.03 x 6,000,000 = ₦180,000.\nTotal after discount = ₦5,820,000.\nPaying in 30 days helps my cash flow because I keep the money in the business for a month and can sell the goods before I pay.",
  "required": true
}
```

```task
{
  "id": "proc-m05-t2",
  "prompt": "Write a **negotiation plan** for buying 500 chairs, one item per line: your target price, your walk-away point, your best alternative, two things you can offer the supplier, and two things you will ask for besides price. At least six lines.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Target: ...\nWalk-away: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "States a target", "pattern": "target" },
    { "label": "States a walk-away point", "pattern": "walk-?away|limit|maximum|will not pay|no more than" },
    { "label": "States an alternative", "pattern": "alternative|batna|other supplier|second|backup|fall back" },
    { "label": "States what you can offer", "pattern": "offer|give|volume|regular|repeat|faster payment|longer contract" },
    { "label": "Asks for terms besides price", "pattern": "warrant|payment terms|delivery|installation|service|30 days" }
  ],
  "sample": "Target: ₦22,500 a chair delivered, total ₦11,250,000.\nWalk-away: I will not pay more than ₦24,000 a chair.\nBest alternative: Supplier C quoted ₦23,000 delivered and can supply in 21 days.\nOffer 1: a firm order for 500 now, with a possible 200 more next year.\nOffer 2: payment within 14 days of acceptance.\nAsk 1: free delivery and assembly.\nAsk 2: a 12-month warranty and 30-day payment terms.",
  "required": true
}
```

```task
{
  "id": "proc-m05-t3",
  "prompt": "A supplier says: **\"This is our final price, and the offer ends today.\"** Write your reply in 40 to 90 words, staying calm, asking what could change, and not giving in to the pressure.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Thank you ...",
  "rules": [
    { "label": "Polite tone", "pattern": "thank|appreciate|understand" },
    { "label": "Asks what could change the price (volume, terms, payment, delivery)", "pattern": "what|how|could|would|if we|if i" },
    { "label": "Mentions volume, terms, payment or a longer contract as ways to move", "pattern": "volume|terms|payment|contract|quantity|repeat|regular|delivery" },
    { "label": "Does not accept the deadline pressure", "pattern": "time|review|compare|consider|decid|need to|before we" },
    { "label": "Between 40 and 90 words", "minWords": 40, "maxWords": 95 }
  ],
  "sample": "Thank you, I appreciate the offer and I understand your position. I do need to review it against the other quotes before I decide, so I cannot commit today. Could you tell me what could change the price? For example, if we increase the volume, pay within 14 days or sign a 12-month supply agreement, would you improve the unit price or include delivery? If we can find a package that works for both of us, I would be happy to confirm quickly.",
  "required": false
}
```

Next lesson: purchase orders and contracts.
