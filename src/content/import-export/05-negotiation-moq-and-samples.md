---
title: Negotiation, MOQ and Samples
minutes: 25
summary: Negotiate prices and terms with suppliers, handle minimum order quantities, order and judge samples, agree payment terms and deposits, and write a clear purchase order.
---

## Negotiation starts before you ask for a discount

Good negotiation is not haggling. It is showing a supplier that you are serious, prepared and worth keeping, then asking for terms that work for both sides. Suppliers receive hundreds of vague enquiries. The buyer who is specific, polite and quick to reply gets the better offer.

Before you negotiate, know:

- **Your target price**, worked backwards from the selling price you found in module 2.
- **Your walk-away price** above which the deal no longer makes sense.
- **Two or three other quotes**, so you know what is normal.
- **What matters besides price**: quality, lead time, packaging, payment terms and the supplier's willingness to grow with you.

## Negotiation tactics that work

- **Ask for tier pricing.** "What is your price at 300, 500 and 1,000 units?" The drop between tiers shows how much room there is.
- **Show your plan to reorder.** "If this first order goes well we plan to order every month." A repeat buyer is worth a lower price.
- **Be specific about what you want.** Quote the exact model, material and packaging. Vague specs lead to vague prices and later disputes.
- **Bundle.** Combine models, colours or sizes in one order to meet a higher volume tier.
- **Trade, don't just push.** Offer a faster deposit or a larger quantity in exchange for a better price or free packaging.
- **Negotiate other things.** Free or discounted samples, free custom packing, a better payment schedule, a longer warranty, shorter lead time.
- **Be polite and patient.** Pressure often makes suppliers cut quality instead of price.
- **Never accept the first price.** A reasonable counter-offer, usually a modest reduction, is normal and expected.

> [!NOTE]
> Be careful with very low final prices. A supplier who drops a price a long way too easily may be cutting corners elsewhere: thinner material, cheaper parts, fewer checks.

## Minimum order quantity (MOQ)

The **MOQ** is the smallest order a supplier will accept. It exists because setting up production costs the same whether they make 50 or 5,000.

If the MOQ is higher than you want:

- Ask whether a **smaller trial order** is possible at a slightly higher price.
- Ask whether you can **mix models or colours** to reach it.
- Look for a supplier with a lower MOQ, even at a higher price. For a first test, a higher unit price is usually cheaper than money tied up in unsold stock.
- Buy from a **trading company or stock supplier**, who sells from stock in small quantities.
- Share an order with another buyer, only if you trust them and settle the money clearly.

Never buy more than you can sell just to get a bigger discount. A 10% discount on stock you cannot sell is a 100% loss.

## Ordering and evaluating samples

A sample is the cheapest insurance in importing. Order one before any bulk purchase.

1. **Ask what the sample costs** and whether it is refunded against the bulk order. Many suppliers charge for the sample and the courier.
2. **Specify exactly what you want**, so the sample matches the order you will place.
3. **Test it as a customer would.** Use it, drop it, wash it, charge it, whatever real use involves.
4. **Check against your list:** material, size, finish, packaging, labelling, smell, safety, any certificates.
5. **Photograph and weigh it** so you can compare the bulk delivery against the sample.
6. **Keep the sample.** If the bulk goods are worse, it is your evidence.

Remember that a sample can be better than the bulk goods. Agree in writing that the bulk will match the sample, and inspect before the final payment.

## Payment terms and deposits

Most suppliers want a **deposit to begin production**, often around 30%, with the balance paid before shipping or against the shipping documents. Common arrangements:

| Terms | What it means | Protection for you |
| :-- | :-- | :-- |
| **30% deposit, 70% before shipment** | The usual split for manufactured goods | You can inspect before paying the balance |
| **30% deposit, 70% against copy of the bill of lading** | You pay after goods are loaded | You get proof of shipment |
| **100% in advance** | Common for small orders and samples | Little: use Trade Assurance or escrow |
| **Letter of credit** | Bank pays on correct documents | Strong, but costly |

Never agree to pay the **whole** amount to an unverified supplier. Agree the payment schedule in writing, along with what happens if the goods are late or faulty.

## Writing a clear purchase order

A **purchase order (PO)** is your written instruction to buy. It prevents the arguments that come from "I thought you meant...". Include:

- Your company name and address, and the supplier's.
- PO number and date.
- Product description, model number, colour, size and a photo or specification.
- Quantity and unit price, and the total, with currency.
- Shipping terms (for example FOB Shenzhen) and the destination.
- Packaging and labelling requirements.
- Production lead time and delivery date.
- Payment terms and bank details (confirmed separately).
- Quality requirements, and what happens if the goods do not match the sample.
- Signatures or written confirmation from the supplier.

## Try it

```task
{
  "id": "iemi-m05-t1",
  "prompt": "A supplier quotes **$3.00** a unit for 300 power banks, with an MOQ of 500. Write the **message** you would send to negotiate, in 60 to 130 words. Ask for a lower MOQ or tier pricing, mention reorders, and ask about the sample price.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Thank you for your quote. ...",
  "rules": [
    { "label": "Thanks or greets politely", "pattern": "thank|hello|hi |dear|appreciate" },
    { "label": "Raises the MOQ or a smaller first order", "pattern": "moq|minimum|smaller|trial|first order" },
    { "label": "Asks for tier pricing or a better price", "pattern": "tier|better price|discount|best price|lower price|price at" },
    { "label": "Mentions repeat orders", "pattern": "reorder|re-order|repeat|every month|regular|long-?term|future orders" },
    { "label": "Asks about a sample", "pattern": "sample" },
    { "label": "Between 60 and 130 words", "minWords": 60, "maxWords": 135 }
  ],
  "sample": "Thank you for your quote of $3.00 a unit. We are a new importer in Lagos and would like to start with a trial order of 300 units, which is below your MOQ of 500. Would you accept 300 at a slightly higher price, or can you give me tier pricing for 300, 500 and 1,000 units? If the first order sells well, we plan to reorder every month, so I am looking for a long-term supplier. Please also tell me the price of a sample and whether it is refunded against the bulk order.",
  "required": true
}
```

```task
{
  "id": "iemi-m05-t2",
  "prompt": "Write a **sample evaluation checklist** with at least six things you will check when your power bank sample arrives. One check per line.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Check the real capacity ...",
  "rules": [
    { "label": "At least six checks", "minLines": 6 },
    { "label": "Checks performance (capacity, charge, battery, works)", "pattern": "capacity|charge|battery|power|works?|test" },
    { "label": "Checks build quality (material, finish, weight, size)", "pattern": "material|finish|weight|size|build|quality|strong|durable" },
    { "label": "Checks packaging or labelling", "pattern": "packag|label|box|print" },
    { "label": "Checks safety or certificates", "pattern": "safe|certificate|ce\\b|heat|overheat|standard" },
    { "label": "Keeps or photographs the sample as a record", "pattern": "keep|photograph|photo|record|compare" }
  ],
  "sample": "Test the real capacity by charging a phone fully and counting charges.\nCheck that it charges at the speed claimed and does not overheat.\nCheck the build quality, material, finish and weight against the specification.\nCheck the size matches the listing.\nCheck the packaging and labelling are neat and have the correct information.\nCheck for a safety certificate such as CE and a clear warranty.\nPhotograph and weigh the sample, and keep it to compare with the bulk goods.",
  "required": true
}
```

```task
{
  "id": "iemi-m05-t3",
  "prompt": "Write a short **purchase order** for 300 power banks. Put one detail per line: PO number, buyer, supplier, product and model, quantity, unit price in dollars, total, shipping terms, lead time, payment terms and packaging.",
  "minutes": 12,
  "rows": 12,
  "placeholder": "PO number: ...\nBuyer: ...",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Has a PO number", "pattern": "po\\s*(number|no)|purchase order" },
    { "label": "Names buyer and supplier", "pattern": "buyer[\\s\\S]*supplier|supplier[\\s\\S]*buyer" },
    { "label": "States quantity and a dollar unit price", "pattern": "300[\\s\\S]*\\$\\s?\\d|\\$\\s?\\d[\\s\\S]*300" },
    { "label": "States shipping terms", "pattern": "\\b(fob|exw|cif|dap)\\b" },
    { "label": "States payment terms", "pattern": "deposit|payment|balance|30\\s?%" },
    { "label": "States lead time", "pattern": "lead time|days|delivery" }
  ],
  "sample": "PO number: TUN-2026-001\nBuyer: Tunde Trading, Lagos, Nigeria\nSupplier: Shenzhen Brightcell Electronics Co. Ltd\nProduct: 20,000mAh power bank, model PB-20, black\nQuantity: 300 units\nUnit price: $3.00\nTotal: $900\nShipping terms: FOB Shenzhen, to be shipped to Lagos, Nigeria\nLead time: 12 days after deposit\nPayment terms: 30% deposit, 70% balance after inspection and before shipment\nPackaging: individual colour box, 20 units per carton, labelled with the model and quantity",
  "required": false
}
```

Next lesson: how goods travel and what the options cost.
