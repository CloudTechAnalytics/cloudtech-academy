---
title: Final Project - A Practical Procurement
minutes: 45
summary: Run a real or realistic purchase from need to purchase order: define it, shortlist suppliers, request quotes, evaluate, negotiate and present your recommendation.
---

## What you are building

You have learned every step of procurement. Now you run one purchase end to end and present it as a professional would to a manager: what was needed, how you found and compared suppliers, what you negotiated and what you recommend.

Choose a **real purchase** if you can (for your workplace, a club, a church, a school, a small business or a family event), or a realistic one such as laptops for a training centre, uniforms for staff, or a year's supply of cleaning materials. Use real quotes where possible. Where you must assume a number, say so clearly.

## Your project has six parts

1. **The need and specification.** What is needed, why, how much, when and to what standard, with a budget.
2. **Suppliers.** A long list and a short list of at least three, and how you chose them.
3. **The request.** The RFQ you sent (or would send) and the information given to all suppliers.
4. **Evaluation.** Total cost comparison and a weighted score on agreed criteria.
5. **Negotiation.** Your plan and what you achieved or would aim for, with the saving.
6. **Recommendation and purchase order.** Your choice, the reasons, risks and a draft purchase order.

## Writing it up

Write for a manager who must approve the spending. Lead with the recommendation, then show the evidence. Use tables for quotes and scores, and keep each part short. State the total cost, the saving against the budget or the first price, and the delivery date.

> [!TIP]
> Ask a colleague to read it and say what they would still want to know before approving ₦5 million. Answer that in the document.

## Try it

```task
{
  "id": "proc-m12-t1",
  "prompt": "Describe your **purchase and specification** in 50 to 130 words: what you are buying, why, the quantity, quality standard, delivery date and place, and the budget.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "We need to buy ...",
  "rules": [
    { "label": "Says what is being bought and why", "pattern": "need|buy|purchase|because|so that" },
    { "label": "States the quantity", "pattern": "\\b\\d[\\d,]*\\s*(units?|pieces?|pcs|items?|reams?|laptops?|chairs?|sets?|boxes|crates|[a-z]+s)\\b|\\b\\d{2,}\\b" },
    { "label": "States the quality or standard", "pattern": "standard|quality|specif|grade|model|warrant" },
    { "label": "States delivery date or place", "pattern": "deliver|by |within|date|lagos|site|office" },
    { "label": "States the budget in naira", "pattern": "budget|₦\\s?\\d|naira" },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 135 }
  ],
  "sample": "We need to buy 20 laptops for the new computer lab at Greenfield Training Centre because the current machines are too slow to run the course software and we start a new class in six weeks. Each laptop must have at least 16GB of RAM, a 512GB solid state drive, a modern i5 or equivalent processor, a 14-inch screen and a minimum 12-month warranty, and be supplied by an authorised dealer. Delivery must reach our Ikeja site within 21 days of the order. The approved budget is ₦14,000,000 including VAT and delivery.",
  "required": true
}
```

```task
{
  "id": "proc-m12-t2",
  "prompt": "Write your **supplier shortlist and comparison**: at least three suppliers, one per line, with unit price, total cost including delivery, delivery time, payment terms and warranty. Then give your weighted criteria on a last line, adding to 100%.",
  "minutes": 15,
  "rows": 8,
  "placeholder": "Supplier A - ₦...",
  "rules": [
    { "label": "At least four lines", "minLines": 4 },
    { "label": "Lists suppliers with prices in naira", "pattern": "supplier[\\s\\S]*₦\\s?\\d|₦\\s?\\d[\\s\\S]*supplier" },
    { "label": "Shows total cost", "pattern": "total" },
    { "label": "Shows delivery time", "pattern": "days?|weeks?|deliver" },
    { "label": "Shows payment terms or warranty", "pattern": "payment|warrant" },
    { "label": "Shows weights adding up to percentages", "pattern": "\\d+\\s?%" }
  ],
  "sample": "Supplier A (authorised dealer) - ₦680,000 each, total ₦13,600,000 with delivery, 14 days, payment 30 days, 12-month warranty\nSupplier B (importer) - ₦640,000 each, total ₦12,800,000 plus ₦350,000 delivery = ₦13,150,000, 30 days, payment on delivery, 6-month warranty\nSupplier C (distributor) - ₦660,000 each, total ₦13,200,000 with delivery, 21 days, payment 14 days, 12-month warranty\nWeighted criteria: total cost 40%, quality and specification 25%, delivery 15%, warranty and support 15%, references 5%",
  "required": true
}
```

```task
{
  "id": "proc-m12-t3",
  "prompt": "Write your **negotiation result and recommendation** in 60 to 140 words: which supplier you choose, why, the price you negotiated and the saving against the first quote or the budget, plus one risk and how you will manage it.",
  "minutes": 15,
  "rows": 9,
  "placeholder": "I recommend ...",
  "rules": [
    { "label": "Names the recommended supplier", "pattern": "recommend|choose|select|award|supplier [a-z]" },
    { "label": "Gives reasons", "pattern": "because|since|reason|best|lowest|quality|value" },
    { "label": "States the price and saving in naira", "pattern": "₦\\s?\\d[\\s\\S]*sav|sav[\\s\\S]*₦\\s?\\d" },
    { "label": "Mentions a risk and how to manage it", "pattern": "risk[\\s\\S]*(manage|mitigat|backup|protect|insure|monitor|inspect)" },
    { "label": "Between 60 and 140 words", "minWords": 60, "maxWords": 145 }
  ],
  "sample": "I recommend Supplier C, because it gives the best overall value: the second-lowest total cost, a 12-month warranty, a 21-day delivery that meets our date and good references. After negotiation, C agreed to reduce the price from ₦660,000 to ₦640,000 a laptop and add free delivery, a total of ₦12,800,000, which is a saving of ₦400,000 against its first quote and ₦1,200,000 against our budget. The main risk is a late delivery, which I will manage by putting a penalty for late delivery in the order and inspecting the laptops on arrival before paying.",
  "required": true
}
```

```task
{
  "id": "proc-m12-t4",
  "prompt": "Write the key lines of your **purchase order**, one per line: PO number, buyer, supplier, item and specification, quantity, unit price, total, delivery place and date, payment terms and who approved it. At least ten lines.",
  "minutes": 10,
  "rows": 12,
  "placeholder": "PO number: ...",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Has a PO number", "pattern": "po (number|no)" },
    { "label": "Names buyer and supplier", "pattern": "buyer[\\s\\S]*supplier|supplier[\\s\\S]*buyer" },
    { "label": "States quantity and unit price", "pattern": "quantity[\\s\\S]*unit price|unit price[\\s\\S]*quantity" },
    { "label": "States total, delivery and payment terms", "pattern": "total[\\s\\S]*deliver[\\s\\S]*payment" },
    { "label": "States approval", "pattern": "approv|authoris|authoriz" }
  ],
  "sample": "PO number: GTC-2026-0210\nDate: 3 April 2026\nBuyer: Greenfield Training Centre, Ikeja, Lagos\nSupplier: Compuserve Distributors Ltd\nItem: 14-inch laptop, 16GB RAM, 512GB SSD, Core i5, 12-month warranty\nQuantity: 20\nUnit price: ₦640,000\nTotal: ₦12,800,000 including VAT and delivery\nDelivery: to our Ikeja site within 21 days of this order\nPayment terms: 14 days after delivery, inspection and a correct invoice quoting this PO\nApproved by: the finance manager and managing director",
  "required": false
}
```

When you are done, submit your complete project.
