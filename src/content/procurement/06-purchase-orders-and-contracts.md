---
title: Purchase Orders and Contracts
minutes: 25
summary: Run a purchase requisition and approval, write a clear purchase order, understand basic contract terms and manage delivery, inspection and payment.
---

## From requisition to order

Buying starts inside the business with a **purchase requisition**: a written request from a department saying what it needs, how much, by when, why and which budget pays. The requisition is checked, and **approved** by someone with the authority to spend that amount. Only then does the buyer raise the **purchase order (PO)**.

This matters because a PO is a commitment. Without approval you can commit the business to spending money it has not agreed, or to buying something nobody needs.

A typical flow:

1. The requester completes a requisition with specification, quantity, date and budget code.
2. The manager checks the need and the budget, and approves.
3. Procurement runs quotes or uses an existing agreement, and selects the supplier.
4. The buyer raises the PO and gets it approved at the right level.
5. The PO is sent to the supplier, who confirms it.

## Writing a purchase order

A PO is a legal instruction to supply. Make it clear and complete:

- **PO number** (unique) and **date**.
- **Buyer and supplier** names, addresses and contacts.
- **Description of each item**: specification, model or part number.
- **Quantity**, **unit price**, line totals and the **overall total**, with currency.
- **Tax** (VAT) shown separately.
- **Delivery** address, date and method, and who pays for transport.
- **Payment terms** (for example, 30 days after receipt of a correct invoice).
- **Quality and inspection terms**, and what happens to faulty goods.
- **Reference to the quote or contract** the price is based on.
- **Approval**: name and signature of the authorised person.

State the supplier must quote the **PO number** on delivery notes and invoices. This lets you match them later.

## Contract basics

For larger or ongoing purchases, a written **contract** sets out the agreement. Common terms:

| Term | What it covers |
| :-- | :-- |
| **Scope** | Exactly what will be supplied, to what specification |
| **Price and payment** | Prices, what is included, when and how to pay, price changes |
| **Delivery** | Dates, place, risk and ownership |
| **Quality and acceptance** | Standards, inspection, rejection of faulty goods |
| **Warranty** | How long, what is covered, who fixes problems |
| **Penalties** | Charges for late delivery (liquidated damages) |
| **Termination** | When either side may end it, and notice |
| **Disputes** | How they will be resolved (discussion, mediation, arbitration, courts) |
| **Confidentiality and compliance** | Protection of information, laws, ethics |

For high-value or complex contracts, have a lawyer review the terms. A vague contract favours whoever argues best, and a poor one can leave you without a remedy when things go wrong.

## Delivery, inspection and payment

When goods arrive:

1. **Check the delivery note** against the PO: items, quantities, condition.
2. **Count and inspect** the goods. Note shortages and damage on the delivery note before signing.
3. **Record the receipt** in a goods received note (GRN).
4. **Reject or query** anything wrong, and tell the supplier at once, in writing.
5. **Pay only for what was properly received** and matches the invoice.

Example: you ordered 200 units at ₦3,500. The supplier delivers 190, and 12 are damaged. You accept 178 good units and pay for those: 178 × ₦3,500 = **₦623,000**. You record 10 short and 12 damaged, and ask the supplier to replace or credit them.

## Try it

```task
{
  "id": "proc-m06-t1",
  "prompt": "You ordered **200 units at ₦3,500**. The supplier delivers **190** and **12 are damaged**. Work out the number of good units you will accept, the amount you will pay for them and the number the supplier still owes. Then say what you do on the day of delivery.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Good units accepted = ...",
  "rules": [
    { "label": "178 good units", "pattern": "178" },
    { "label": "Payment of ₦623,000", "pattern": "623,?000" },
    { "label": "10 short (or 22 outstanding in total)", "pattern": "\\b10\\b|\\b22\\b" },
    { "label": "Says to record or note it on the delivery note or GRN", "pattern": "delivery note|grn|goods received|record|note" },
    { "label": "Says to tell the supplier or ask for a replacement or credit", "pattern": "supplier|replace|credit|report|inform|tell" }
  ],
  "sample": "Good units accepted = 190 - 12 = 178.\nPayment = 178 x 3,500 = ₦623,000.\nThe supplier still owes 10 units not delivered, plus replacement or credit for the 12 damaged (22 units in all).\nOn the day, I count and inspect the goods, note the shortage and damage on the delivery note, record it on the GRN and tell the supplier in writing so they replace or credit the units.",
  "required": true
}
```

```task
{
  "id": "proc-m06-t2",
  "prompt": "Write a **purchase order** for 300 reams of A4 paper at ₦4,800 a ream. Put one detail per line: PO number, date, buyer, supplier, item, quantity, unit price, total, delivery place and date, payment terms and approval.",
  "minutes": 12,
  "rows": 12,
  "placeholder": "PO number: ...\nDate: ...",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Has a PO number and date", "pattern": "po (number|no)[\\s\\S]*date|date[\\s\\S]*po (number|no)" },
    { "label": "Names buyer and supplier", "pattern": "buyer[\\s\\S]*supplier|supplier[\\s\\S]*buyer" },
    { "label": "States quantity 300 and unit price 4,800", "pattern": "300[\\s\\S]*4,?800|4,?800[\\s\\S]*300" },
    { "label": "States the total of ₦1,440,000", "pattern": "1,?440,?000" },
    { "label": "States delivery and payment terms", "pattern": "deliver[\\s\\S]*payment|payment[\\s\\S]*deliver" },
    { "label": "States who approved it", "pattern": "approv|authoris|authoriz|signed" }
  ],
  "sample": "PO number: GTC-2026-0142\nDate: 12 March 2026\nBuyer: Greenfield Training Centre, 14 Allen Avenue, Ikeja, Lagos\nSupplier: Bright Office Supplies Ltd, Yaba, Lagos\nItem: A4 copier paper, 80gsm, white, 500 sheets per ream\nQuantity: 300 reams\nUnit price: ₦4,800\nTotal: ₦1,440,000 plus VAT\nDelivery: to the Ikeja store within 5 working days of this order\nPayment terms: 30 days after receipt of goods and a correct invoice quoting the PO number\nApproved by: Ngozi Okoro, purchasing officer, and the finance manager",
  "required": true
}
```

```task
{
  "id": "proc-m06-t3",
  "prompt": "List **six clauses** you would want in a supply contract for a year of regular deliveries, with a few words on what each covers. One per line.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Scope: ...",
  "rules": [
    { "label": "Six lines", "minLines": 6 },
    { "label": "Includes price or payment", "pattern": "price|payment" },
    { "label": "Includes delivery", "pattern": "deliver" },
    { "label": "Includes quality, acceptance or warranty", "pattern": "quality|accept|warrant|inspect|reject" },
    { "label": "Includes termination or disputes", "pattern": "terminat|dispute|arbitrat|mediat" },
    { "label": "Includes penalties or late delivery", "pattern": "penalt|late|liquidated|damages" }
  ],
  "sample": "Scope: exactly what is supplied and to what specification.\nPrice and payment: the unit prices, how long they are held and payment within 30 days of a correct invoice.\nDelivery: dates, place and who carries the risk in transit.\nQuality and acceptance: standards, inspection on delivery and replacement of faulty goods.\nPenalties: a charge for each day of late delivery.\nTermination and disputes: notice periods, and how disagreements are resolved, first by discussion and then by arbitration.",
  "required": false
}
```

Next lesson: the processes and controls that keep buying honest.
