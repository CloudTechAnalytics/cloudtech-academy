---
title: Shipping Documents
minutes: 25
summary: Know the main shipping documents, what the bill of lading and air waybill do, which certificates may be needed and how to check documents and avoid common errors.
---

## Why documents matter

Goods cannot move, clear customs or be paid for without the right documents. They are also the main source of avoidable delay: a wrong name, weight or description can hold a container at the port for days, with storage and demurrage charges adding up. A forwarder's value lies partly in getting documents right **the first time**.

## The core documents

| Document | Purpose | Who prepares it |
| :-- | :-- | :-- |
| **Commercial invoice** | The bill for the goods: parties, description, quantity, unit price, total, currency, terms of sale. Used for customs value | Seller |
| **Packing list** | What is in each package: counts, weights, dimensions, marks | Seller |
| **Bill of lading (B/L)** | Sea transport document | Shipping line or forwarder |
| **Air waybill (AWB)** | Air transport document | Airline or forwarder |
| **Certificate of origin** | Where the goods were made; may affect duty | Chamber of commerce or authority |
| **Insurance certificate** | Proof of cargo insurance | Insurer |
| **Customs declaration** | The formal declaration to customs (in Nigeria, with Form M and a PAAR for imports) | Customs broker / importer |
| **Delivery order / release** | Authorises the terminal to release goods | Shipping line or agent |

## The bill of lading and the air waybill

A **bill of lading** does three jobs:

1. It is a **receipt** from the carrier that the goods were received in the stated condition.
2. It is evidence of the **contract of carriage**.
3. It can be a **document of title**: the holder of an original B/L can claim the goods. This is why original B/Ls are valuable and are sometimes used in payment arrangements.

Common types and terms:

- **Master B/L:** issued by the shipping line to the forwarder or shipper.
- **House B/L:** issued by the forwarder to its customer.
- **Original B/L** (full set) versus **telex release** or **sea waybill:** the goods are released without surrendering the paper original, which is faster and suits trusted trading.
- **Clean B/L:** no remarks about damage. A **claused** B/L notes problems and may be refused by a buyer or bank.

An **air waybill** is the contract and receipt for air cargo. It is **not** a document of title, so the goods are released to the named consignee. It shows shipper, consignee, flight details, number of pieces, weights, goods description and charges.

## Certificates and other documents

Depending on the goods and the countries, you may also need:

- **Certificate of origin** to prove the goods' origin and claim any trade preferences.
- **Phytosanitary and veterinary certificates** for plants and animal products.
- **Health, quality or conformity certificates** (for example SON or NAFDAC requirements in Nigeria).
- **Dangerous goods declaration** for hazardous cargo.
- **Import permits or licences** for controlled items.
- **Inspection certificates** when the buyer or authorities require pre-shipment inspection.

Check the requirements of **both** the exporting and the importing country early. A missing certificate found at the port is expensive.

## Document checks and common errors

Before goods ship, compare every document against the others:

| Check | Typical error |
| :-- | :-- |
| **Names and addresses** | Shipper or consignee spelled differently on the invoice and B/L |
| **Description of goods** | Vague ("electronics") or different on each document |
| **Quantities** | Packing list says 14 cartons, invoice implies 15 |
| **Weights and dimensions** | Gross and net weight reversed, or totals that do not add up |
| **Values and currency** | Invoice value differs from the declaration, or the wrong currency |
| **Terms of sale** | Invoice says FOB but the freight was paid like CIF |
| **Container and seal numbers** | Wrong or missing |
| **Dates** | Certificate dated after shipment, or expired |

Fix errors **before** the vessel sails. Amending a B/L after departure costs money and time. Keep a checklist for every shipment and a copy of every final document.

> [!WARNING]
> Never alter or invent documents to make a shipment "work". False documents are an offence, and they can lead to seized cargo, penalties and loss of your licence.

## Try it

```task
{
  "id": "lff-m04-t1",
  "prompt": "Check this document set. **Invoice:** 300 power banks, 20 per carton, consignee Tunde Trading Ltd, FOB Shenzhen. **Packing list:** 14 cartons, consignee Tunde Trading Limited. **Bill of lading:** 15 cartons, goods described as \"electronics\", consignee Tunde Trade Ltd. List **every problem** you can find and the fix. One per line.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Problem: ... - Fix: ...",
  "rules": [
    { "label": "At least three lines", "minLines": 3 },
    { "label": "Spots the carton count mismatch (300 / 20 = 15, packing list says 14)", "pattern": "14|15|carton" },
    { "label": "Spots the vague description", "pattern": "electronics|description|vague|specific" },
    { "label": "Spots the consignee name differences", "pattern": "consignee|name|trading|limited|trade" },
    { "label": "Gives fixes", "pattern": "correct|amend|fix|match|update|reissue|ask the" }
  ],
  "sample": "Problem: 300 power banks at 20 per carton is 15 cartons, but the packing list says 14 - Fix: recount and correct the packing list so it matches the invoice and B/L.\nProblem: the B/L describes the goods as \"electronics\", which is too vague - Fix: amend it to a specific description such as rechargeable power banks, matching the invoice.\nProblem: the consignee is spelled three different ways (Tunde Trading Ltd, Limited, Tunde Trade Ltd) - Fix: use the exact registered name on every document.",
  "required": true
}
```

```task
{
  "id": "lff-m04-t2",
  "prompt": "In 40 to 90 words, explain the **three functions of a bill of lading**, and say how an air waybill differs from it.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "A bill of lading is ...",
  "rules": [
    { "label": "Mentions it is a receipt for the goods", "pattern": "receipt" },
    { "label": "Mentions the contract of carriage", "pattern": "contract" },
    { "label": "Mentions document of title", "pattern": "title|claim the goods|ownership" },
    { "label": "Says the air waybill is not a document of title", "pattern": "air ?waybill[^.]*(not|non|isn't)|not a document of title|no title" },
    { "label": "Between 40 and 90 words", "minWords": 40, "maxWords": 95 }
  ],
  "sample": "A bill of lading is a receipt from the carrier that the goods were received, evidence of the contract of carriage, and a document of title, so whoever holds the original can claim the goods. An air waybill is the contract and receipt for air cargo, but it is not a document of title: the goods are released to the consignee named on it, so it cannot be traded or used to claim the cargo in the same way.",
  "required": true
}
```

```task
{
  "id": "lff-m04-t3",
  "prompt": "Write a **document checklist** for a sea shipment of food products from Turkey to Lagos: at least eight documents or certificates, one per line, with a few words on why each is needed.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Commercial invoice - ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Includes invoice and packing list", "pattern": "invoice[\\s\\S]*packing|packing[\\s\\S]*invoice" },
    { "label": "Includes the bill of lading", "pattern": "bill of lading|b/l" },
    { "label": "Includes the certificate of origin", "pattern": "origin" },
    { "label": "Includes a food-related certificate (health, phytosanitary, NAFDAC, quality)", "pattern": "health|phytosanitary|nafdac|quality|sanitary|halal|analysis" },
    { "label": "Includes insurance", "pattern": "insurance" },
    { "label": "Includes Form M or PAAR", "pattern": "form m|paar" }
  ],
  "sample": "Commercial invoice - customs value and the terms of sale\nPacking list - what is in each carton, with weights\nBill of lading - receipt, contract of carriage and title to the goods\nCertificate of origin - shows where the goods were made\nHealth or phytosanitary certificate - proof the food is safe and free of pests\nCertificate of analysis or quality certificate - proves the product meets the standard\nNAFDAC approval - needed to sell regulated food in Nigeria\nInsurance certificate - proof of cargo cover\nForm M and PAAR - the import declaration and customs assessment",
  "required": false
}
```

Next lesson: customs and clearing.
