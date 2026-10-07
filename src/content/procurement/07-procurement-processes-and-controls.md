---
title: Procurement Processes and Controls
minutes: 25
summary: Set approval limits, separate duties, match purchase orders, receipts and invoices, keep an audit trail and write a procurement policy people can follow.
---

## Why controls exist

Buying involves money and trust, so it attracts mistakes and fraud: paying twice, paying for goods never received, favouring a friend's company, inflated invoices, split orders to avoid approval. **Controls** are the simple rules and checks that make these hard and easy to spot. They are not there because people are assumed to be dishonest. They protect honest staff from suspicion and the business from loss.

## Approval limits

An **approval limit** says who may authorise spending up to what amount. For example:

| Value of purchase | Who approves | Quotes needed |
| :-- | :-- | :-- |
| Up to ₦100,000 | Department head | One |
| ₦100,001 to ₦1,000,000 | Finance manager | Three written |
| ₦1,000,001 to ₦10,000,000 | Managing director | Three written, formal evaluation |
| Over ₦10,000,000 | Board | Formal tender |

These numbers are only an example; each organisation sets its own. Two rules go with limits:

- **No splitting.** Dividing one purchase into smaller orders to stay under a limit is a breach of the policy and a warning sign of fraud.
- **Approval before commitment.** Approve the order before the goods are ordered, not after they arrive.

## Segregation of duties

No single person should control a purchase from start to finish. Keep these functions with different people:

- **Requesting** the purchase
- **Approving** it
- **Ordering** from the supplier
- **Receiving** the goods
- **Approving the invoice** and **paying** it
- **Recording** it in the books

If a small team cannot split everything, split the riskiest steps (ordering, receiving and paying) and add a review by a manager.

## Three-way matching

Before paying an invoice, match three documents:

1. The **purchase order** (what we ordered and at what price)
2. The **goods received note** (what actually arrived)
3. The **supplier invoice** (what they ask us to pay)

They must agree on item, quantity and price. If they do, pay. If not, investigate before paying.

Example: PO for 100 units at ₦2,000. GRN shows 95 received. The invoice charges for 100 units at ₦2,000 (₦200,000). The match fails. Pay for 95 × ₦2,000 = ₦190,000 only after the supplier corrects the invoice, or deliver the missing 5 units. Do not pay the full amount "because it is nearly right".

## Documentation and audit trails

An **audit trail** lets someone who was not there follow a purchase from request to payment. Keep, for every purchase:

- the requisition and approval
- the quotes received, the evaluation and the reason for the choice
- the PO and any contract
- the delivery note and GRN
- the invoice and the payment record
- correspondence about problems and how they were resolved

File these together, on paper or electronically, with controlled access. Keep them for the period your policy and the law require. When an auditor or manager asks "why did we buy this from them?", the file should answer.

## Procurement policies

A **procurement policy** is a short document that tells everyone how buying works. A good one:

- states its purpose and who it applies to
- sets approval limits and quote requirements
- explains how suppliers are selected and approved
- bans conflicts of interest, gifts beyond a small value and split orders
- sets how emergencies are handled, and what must be documented afterwards
- names who is responsible and how to report concerns
- is simple enough that staff actually read it

A policy nobody follows is worse than none, because it gives false comfort. Train staff and review it regularly.

## Try it

```task
{
  "id": "proc-m07-t1",
  "prompt": "Do a **three-way match**. PO: 100 units at ₦2,000. GRN: 95 units received. Invoice: 100 units at ₦2,000 (₦200,000). Say whether they match, what you would pay and what you would do about the difference.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "They do not match because ...",
  "rules": [
    { "label": "Says they do not match", "pattern": "not match|do not match|don't match|mismatch|does not agree|differ" },
    { "label": "Pays ₦190,000 for 95 units", "pattern": "190,?000" },
    { "label": "Notes the 5 missing units", "pattern": "\\b5\\b|five" },
    { "label": "Asks for a corrected invoice, credit note or the missing units", "pattern": "corrected|credit note|missing units|deliver the|correct the|query|investigate" }
  ],
  "sample": "The documents do not match: the PO and invoice say 100 units but the GRN shows only 95 received. I would not pay the invoice as it stands. I would pay for 95 x 2,000 = ₦190,000 once the supplier issues a corrected invoice or a credit note for the 5 missing units, or they deliver the missing 5 units.",
  "required": true
}
```

```task
{
  "id": "proc-m07-t2",
  "prompt": "Read this: *\"Chinedu, the store officer, asks for new tyres, chooses the supplier, signs the order, receives the tyres and signs the payment voucher. Last month three separate orders of ₦95,000 went to the same supplier, a relative of his.\"* List **four control failures** and the fix for each. One per line, in the form \"Failure - Fix\".",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Failure: ... - Fix: ...",
  "rules": [
    { "label": "Four lines", "minLines": 4 },
    { "label": "Every line has a failure and a fix", "pattern": "fail[^\\n]*fix|-\\s*fix|fix", "perLine": true },
    { "label": "Spots the lack of separated duties", "pattern": "separat|segregat|one person|same person|different people" },
    { "label": "Spots the split orders", "pattern": "split|three (separate )?orders|95,?000|limit" },
    { "label": "Spots the conflict of interest (relative)", "pattern": "relative|conflict|declare" },
    { "label": "Spots the missing quotes or approval", "pattern": "quote|approv|compet" }
  ],
  "sample": "Failure: one person does every step of the purchase - Fix: separate requesting, approving, receiving and paying between different people.\nFailure: three orders of ₦95,000 look like split orders to stay under the approval limit - Fix: ban splitting and review repeat orders to the same supplier.\nFailure: the supplier is Chinedu's relative and no conflict was declared - Fix: require a declaration of interests and exclude him from choosing that supplier.\nFailure: no competing quotes or manager approval - Fix: require written quotes and approval at the right level before ordering.",
  "required": true
}
```

```task
{
  "id": "proc-m07-t3",
  "prompt": "Write the **main points of a one-page procurement policy** for a small company: at least six bullet points covering approval limits, quotes, conflicts of interest, receiving goods, paying invoices and records.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "- Approval limits: ...",
  "rules": [
    { "label": "At least six points", "minLines": 6 },
    { "label": "Covers approval limits", "pattern": "approval|limit|authori" },
    { "label": "Covers quotes or competition", "pattern": "quote|compet|tender|bid" },
    { "label": "Covers conflicts of interest or gifts", "pattern": "conflict|interest|gift" },
    { "label": "Covers receiving goods", "pattern": "receiv|inspect|grn|delivery" },
    { "label": "Covers paying invoices (matching)", "pattern": "invoice|match|pay" },
    { "label": "Covers records", "pattern": "record|file|document|audit" }
  ],
  "sample": "- Approval limits: every purchase needs approval at the right level before the order is placed, and orders must not be split to avoid limits.\n- Quotes: three written quotes above ₦100,000 and a formal tender above ₦10,000,000.\n- Conflicts of interest: staff must declare any interest in a supplier and must not accept gifts above a small value.\n- Receiving goods: goods are counted and inspected by stores and recorded on a goods received note.\n- Paying invoices: finance pays only after matching the PO, the GRN and the invoice.\n- Records: the full file for each purchase is kept for audit.",
  "required": false
}
```

Next lesson: working with stores and keeping stock right.
