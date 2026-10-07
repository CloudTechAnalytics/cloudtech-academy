---
title: Import Documentation and Customs
minutes: 25
summary: Know the main shipping documents, understand HS codes, calculate duties, taxes and customs value, follow how clearance works and avoid common delays.
---

## The documents behind every shipment

Customs does not clear goods on trust. It clears them on documents that agree with each other and with the goods. The most important are:

| Document | What it is | Who issues it |
| :-- | :-- | :-- |
| **Commercial invoice** | The bill: seller, buyer, description, quantity, unit price, total, currency, shipping terms | The supplier |
| **Packing list** | What is in each carton: counts, weights, dimensions | The supplier |
| **Bill of lading (B/L)** | For sea freight: the receipt for the goods, the contract of carriage and the document of title | The shipping line or forwarder |
| **Air waybill (AWB)** | For air freight: the contract and receipt for the cargo (not a document of title) | The airline or forwarder |
| **Certificate of origin** | Says where the goods were made | A chamber of commerce or authority |
| **Insurance certificate** | Proof of cargo insurance | The insurer |
| **Quality or product certificates** | For example SON, NAFDAC or safety certificates, where they apply | The relevant body |
| **Form M** (Nigeria) | The import declaration made before shipment, through your bank | You, through an authorised bank |

**All the documents must match.** Name, address, quantities, weights, descriptions and values should agree. A mismatch is the most common cause of delay and fines.

> [!WARNING]
> Never agree to understate the value or change the description on an invoice to reduce duty. Under-declaring is an offence. It can bring seizure, penalties and a record that makes every future shipment harder.

## HS codes and why they matter

The **Harmonized System (HS)** is the international way of classifying goods. Every product has a code. The first six digits are the same worldwide, and countries add more digits for their own tariff. Your HS code decides:

- **The duty rate** you pay.
- **Whether the goods are restricted** or need a permit.
- **Statistics and checks** by customs.

Examples of goods and their chapters: mobile phone accessories, kitchen appliances and clothing each fall under different chapters with different rates. Choosing the wrong code can mean paying too much, too little (and being fined) or having the goods held. Ask your forwarder or clearing agent to confirm the HS code against the Nigerian tariff before you order, and quote it on the invoice.

## Duties, taxes and customs value

When goods enter Nigeria you generally pay:

- **Import duty**, set by the tariff for the HS code, as a percentage of the customs value. Under the ECOWAS Common External Tariff, standard ad valorem rates are set in bands, commonly 0%, 5%, 10%, 20% and 35%, depending on the product.
- **Value Added Tax (VAT)**, currently 7.5%, charged on the customs value plus duty and other import charges.
- **Other levies and fees**, small percentage charges and processing fees that apply to many imports. Rates and rules change, so get a current figure from your clearing agent.

**Customs value** is usually the **CIF value**: the cost of the goods plus insurance and freight to the Nigerian port. Customs converts it to naira at its own exchange rate, not necessarily the bank rate you paid at.

Worked example (ignoring small levies):

- CIF value: ₦2,000,000
- Duty at 10%: ₦200,000
- VAT at 7.5% on (₦2,000,000 + ₦200,000 = ₦2,200,000): ₦165,000
- **Total duty and VAT: ₦365,000**

That is 18% of the CIF value in this example: a cost you must include before you price the product.

## How customs clearance works

At a high level, for a typical import:

1. **Before shipment**, you open the import declaration (Form M in Nigeria) with the correct goods, values and supplier details.
2. The supplier ships and sends the documents.
3. **On arrival**, your clearing agent submits the declaration with the documents.
4. Customs **assesses** the declaration: classification, value, duty and taxes.
5. You (through the agent) **pay duty, taxes and port charges**.
6. Customs may **examine** the goods. A physical inspection can be full or partial.
7. Customs **releases** the goods, the terminal releases them, and they are collected by truck or delivered.

Port and terminal charges, plus storage if goods stay beyond the free period, are separate from duty and tax. The next lesson covers the Nigerian specifics.

## Common delays and how to avoid them

- **Mismatched documents.** Check every invoice, packing list and bill of lading before shipment.
- **Wrong HS code or description.** Use a precise description ("rechargeable 20,000mAh lithium power bank") and not just "electronics".
- **Under-declared or unrealistic values.** Customs compares invoices against known prices.
- **Missing permits or certificates.** Check requirements before ordering.
- **Late payment of duties or charges.** Storage and container delay fees add up daily.
- **Slow agent response.** Choose a clearing agent who communicates and has a good record.
- **Holidays and port congestion.** Build time into your plan.

## Try it

```task
{
  "id": "iemi-m07-t1",
  "prompt": "The CIF value of a shipment is **₦3,000,000**. The duty rate is **20%** and VAT is **7.5%** on the CIF value plus duty. Work out the duty, the VAT and the total duty and VAT. Ignore other levies.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Duty = ...",
  "rules": [
    { "label": "Duty of ₦600,000", "pattern": "600,?000" },
    { "label": "VAT base of ₦3,600,000 (CIF plus duty)", "pattern": "3,?600,?000" },
    { "label": "VAT of ₦270,000", "pattern": "270,?000" },
    { "label": "Total of ₦870,000", "pattern": "870,?000" }
  ],
  "sample": "Duty = 20% of 3,000,000 = ₦600,000.\nVAT is charged on CIF plus duty = 3,000,000 + 600,000 = ₦3,600,000.\nVAT = 7.5% of 3,600,000 = ₦270,000.\nTotal duty and VAT = 600,000 + 270,000 = ₦870,000.",
  "required": true
}
```

```task
{
  "id": "iemi-m07-t2",
  "prompt": "Check these documents for a shipment. The **invoice** says 300 power banks, 20 per carton. The **packing list** says 14 cartons. The **bill of lading** says 15 cartons and describes the goods as \"electronics\". List **every problem** you can see and say how you would fix it. One problem per line.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Problem: ... - Fix: ...",
  "rules": [
    { "label": "Spots the carton count mismatch (300 / 20 = 15 cartons, packing list says 14)", "pattern": "14|15|carton" },
    { "label": "Spots the vague description (\"electronics\")", "pattern": "electronics|description|vague|specific" },
    { "label": "Suggests correcting the documents", "pattern": "correct|amend|fix|match|update|reissue|ask the supplier|ask the forwarder" },
    { "label": "At least two lines", "minLines": 2 }
  ],
  "sample": "Problem: 300 power banks at 20 per carton is 15 cartons, but the packing list says 14 cartons - Fix: ask the supplier to check the count and correct the packing list so all documents match.\nProblem: the bill of lading calls the goods \"electronics\", which is too vague and may cause the wrong HS code or an inspection - Fix: ask the forwarder to amend it to a specific description such as rechargeable power banks, matching the invoice.",
  "required": true
}
```

```task
{
  "id": "iemi-m07-t3",
  "prompt": "In 30 to 80 words, explain why you should never ask a supplier to write a lower value on the invoice to reduce duty.",
  "minutes": 6,
  "rows": 5,
  "placeholder": "Under-declaring is ...",
  "rules": [
    { "label": "Says it is illegal or an offence", "pattern": "illegal|offence|offense|crime|fraud|unlawful" },
    { "label": "Mentions penalties, seizure or fines", "pattern": "penalt|fine|seiz|confiscat|prosecut" },
    { "label": "Mentions the effect on future shipments or reputation", "pattern": "future|reputation|record|trust|blacklist|every shipment" },
    { "label": "Between 30 and 80 words", "minWords": 30, "maxWords": 85 }
  ],
  "sample": "Under-declaring the value is an offence. Customs compares invoices with known prices, and if it finds a false value the goods can be seized and I can face fines and penalties. It also damages my record and reputation, so every future shipment is checked more closely and delayed. The saving on duty is small compared with the risk of losing the whole shipment, so I always declare the true value.",
  "required": false
}
```

Next lesson: the Nigerian rules, agencies and agents.
