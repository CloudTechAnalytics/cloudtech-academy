---
title: Procurement Fundamentals
minutes: 20
summary: Understand what procurement is and why it matters, how it differs from purchasing, the steps of the procurement cycle and who does what.
---

## What procurement is

**Procurement** is the whole process of getting the goods and services an organisation needs, from deciding what is needed to paying the supplier and reviewing how it went. A company that buys well spends less, runs smoother and wastes less time on shortages, late deliveries and disputes.

Procurement matters because **buying is usually a business's biggest cost.** A manufacturer or a trader often spends well over half of every naira it earns on bought-in materials, goods and services. A saving of 5% on what you buy often adds more to profit than a 5% rise in sales, because a saving goes straight to the bottom line while extra sales also bring extra costs.

## Procurement versus purchasing

The words are often used as if they mean the same. They do not.

| | Purchasing | Procurement |
| :-- | :-- | :-- |
| **Scope** | The transaction: raising the order and paying | The whole process, from need to review |
| **Focus** | Getting it bought | Getting the best value over time |
| **Includes** | Orders, invoices, payment | Specifying needs, finding and evaluating suppliers, negotiating, contracts, managing suppliers |
| **Time horizon** | Today's order | The relationship and the total cost |

Purchasing is one step inside procurement. A purchasing clerk who raises orders quickly is useful. A procurement professional also asks whether we need the item at all, whether the specification is right and whether this supplier is still the best.

## The procurement cycle

Most procurement follows the same steps, whether you buy printer paper or a generator:

1. **Identify the need.** Someone in the business needs something, and says what, how much and by when.
2. **Specify the requirement.** Describe exactly what is needed: quality, quantity, standard, delivery.
3. **Find suppliers.** Build a long list, then a short list.
4. **Evaluate suppliers.** Check they can deliver and compare them fairly.
5. **Request quotes or bids.** Ask the short list for prices and terms in the same format.
6. **Negotiate and select.** Agree price, terms and total cost, and choose.
7. **Order.** Issue an approved purchase order or contract.
8. **Receive and inspect.** Check the delivery against the order.
9. **Pay.** Match the invoice to the order and delivery, then pay on the agreed terms.
10. **Review.** Record how the supplier performed and learn for next time.

A common failure is to jump from step 1 to step 7: someone asks for something and the buyer orders from the usual supplier. Skipping the middle costs money.

## Roles and departments

| Role | What they do in procurement |
| :-- | :-- |
| **Requester (user department)** | Says what is needed and why; confirms it is received and right |
| **Buyer / procurement officer** | Finds suppliers, runs quotes, negotiates, raises orders |
| **Approver (manager)** | Authorises spending within a limit |
| **Stores / warehouse** | Receives, inspects and records goods, controls stock |
| **Finance / accounts** | Checks invoices, pays suppliers, records the cost |
| **Supplier** | Delivers what was agreed |

Good procurement keeps these roles separate. The person who asks for an item should not also be the only person who chooses the supplier and approves the payment.

## Try it

```task
{
  "id": "proc-m01-t1",
  "prompt": "Put the procurement cycle in order for **Lekki Fresh Foods**, which needs 2,000 plastic crates. Write **eight steps**, one per line, starting with a verb: for example \"Identify ...\", \"Specify ...\". Cover need, specification, suppliers, evaluation, quotes, negotiation, order, receipt and payment.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "1. Identify the need ...\n2. Specify ...",
  "rules": [
    { "label": "At least eight steps", "minLines": 8 },
    { "label": "Includes identifying the need", "pattern": "identif|need|requisition" },
    { "label": "Includes a specification", "pattern": "specif" },
    { "label": "Includes finding or shortlisting suppliers", "pattern": "supplier|shortlist|vendor" },
    { "label": "Includes quotes or bids", "pattern": "quote|rfq|bid|tender" },
    { "label": "Includes negotiating", "pattern": "negotiat" },
    { "label": "Includes a purchase order", "pattern": "purchase order|\\bpo\\b|order" },
    { "label": "Includes receiving or inspecting", "pattern": "receiv|inspect|check the delivery" },
    { "label": "Includes payment", "pattern": "pay" }
  ],
  "sample": "1. Identify the need: the packing team needs 2,000 crates by the end of the month.\n2. Specify the crates: size, strength, colour, food-safe plastic and delivery date.\n3. Find suppliers and build a long list, then a shortlist of three.\n4. Evaluate the suppliers on quality, price, delivery and service.\n5. Request quotes from the shortlist in the same format.\n6. Negotiate price and terms and select the best total value.\n7. Issue an approved purchase order.\n8. Receive and inspect the crates against the order, then match the invoice and pay on the agreed terms.",
  "required": true
}
```

```task
{
  "id": "proc-m01-t2",
  "prompt": "In 40 to 90 words, explain the difference between **purchasing** and **procurement** to a new colleague, and say why it matters to the company's profit.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Purchasing is ...",
  "rules": [
    { "label": "Explains purchasing as the transaction (ordering, paying)", "pattern": "purchasing[^.]*(order|transaction|buy|pay)" },
    { "label": "Explains procurement as the wider process (need to review, suppliers, value)", "pattern": "procurement[^.]*(process|whole|supplier|value|specif|cycle|review)" },
    { "label": "Links to cost or profit", "pattern": "cost|profit|save|saving|spend" },
    { "label": "Between 40 and 90 words", "minWords": 40, "maxWords": 95 }
  ],
  "sample": "Purchasing is the transaction: raising the order and paying the invoice. Procurement is the whole process around it, from working out what we really need, to specifying it, finding and evaluating suppliers, negotiating, ordering, receiving and reviewing how the supplier performed. It matters to profit because buying is our biggest cost, so better value on what we buy, such as a lower total cost or fewer late deliveries, goes straight to the bottom line.",
  "required": true
}
```

```task
{
  "id": "proc-m01-t3",
  "prompt": "A storekeeper at a school says: \"I ask for what we need, choose the supplier, approve the order and sign for the payment.\" In 30 to 80 words, say what is wrong with this and how you would split the roles.",
  "minutes": 8,
  "rows": 5,
  "placeholder": "The risk is ...",
  "rules": [
    { "label": "Names the risk (fraud, error, no check, conflict of interest)", "pattern": "fraud|risk|error|conflict|no check|abuse|misuse|control" },
    { "label": "Says to separate roles or duties", "pattern": "separate|split|different (people|person)|segregat|more than one" },
    { "label": "Names at least two roles (requester, buyer, approver, finance, stores)", "pattern": "(requester|buyer|approver|manager|finance|accounts|stores)[\\s\\S]*(requester|buyer|approver|manager|finance|accounts|stores)" },
    { "label": "Between 30 and 80 words", "minWords": 30, "maxWords": 85 }
  ],
  "sample": "One person doing every step removes all checks, so a mistake or fraud would go unnoticed and there is a conflict of interest. I would separate the roles: the storekeeper requests, a buyer finds suppliers and gets quotes, a manager approves the order, stores records the delivery and finance checks the invoice and pays. No one person should control the whole process.",
  "required": false
}
```

Next lesson: finding the right suppliers.
