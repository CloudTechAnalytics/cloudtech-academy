---
title: Nigerian Import Procedures
minutes: 25
summary: Know who regulates imports into Nigeria, what registration and permits you need, how clearance through ports and airports works, how to work with licensed clearing agents and how to keep records.
---

> [!NOTE]
> Nigerian import rules, rates, fees and procedures change from time to time, and some of the systems named here are updated or replaced. This lesson teaches you the structure and the right questions. **Always confirm the current requirement with the Nigeria Customs Service, the relevant agency or a licensed clearing agent before you ship.**

## Who regulates imports into Nigeria

Several bodies have a say over what comes in:

| Body | Role |
| :-- | :-- |
| **Nigeria Customs Service** | Assesses and collects duty and taxes, enforces the import prohibitions, examines and releases goods |
| **Standards Organisation of Nigeria (SON)** | Product standards and conformity for many manufactured and imported goods |
| **NAFDAC** | Food, drinks, drugs, cosmetics, medical devices and chemicals: registration and approval before sale |
| **Nigerian Agricultural Quarantine Service (NAQS)** | Plant and animal products: inspection and permits |
| **Nigerian Communications Commission (NCC)** | Type approval for telecom and some electronic equipment |
| **Central Bank of Nigeria and authorised dealer banks** | Foreign exchange, and handling the Form M and payment |
| **Corporate Affairs Commission (CAC)** | Registers your business or company |
| **The federal tax authority and your state tax office** | Tax registration and tax on your profits |

Each agency cares about its own area. A single shipment of cosmetics, for example, can involve Customs, NAFDAC and SON requirements.

## Registration and permits

Before importing commercially you usually need:

- **A registered business.** A registered business name or company with the CAC, with a Tax Identification Number (TIN). Operating as a registered business makes banking, clearing and trust much easier.
- **A bank account** in the business's name with a bank that handles foreign transactions.
- **Form M.** The import declaration is raised before the goods ship, through an authorised bank on the national trade platform. It lists the goods, HS code, value, supplier, terms and port of entry. Errors on it are costly, so give your bank accurate details from the supplier's proforma invoice.
- **A Pre-Arrival Assessment Report (PAAR).** After the Form M and documents are submitted, Customs issues a PAAR, which is a Customs assessment of the shipment that your clearing agent needs to clear the goods.
- **Product approvals** such as SON conformity or NAFDAC registration where your product needs them.

**Mini importation does not exempt you.** Small commercial quantities for resale still need correct declarations. Ask your agent or forwarder what applies to your shipment size and goods.

## Restricted and prohibited items

Nigeria has a list of goods that cannot be imported at all, and others that need special permission. The lists change, so check the current Customs notices. Types of goods that commonly face restrictions include certain used goods, some food and animal products, narcotics, counterfeit and unsafe goods, and weapons. Do not rely on a supplier or a friend who says "it's fine": a seized shipment is a total loss and can have legal consequences.

## Clearing through ports and airports

Goods arrive at a **seaport** (such as Apapa, Tin Can Island, Lekki Deep Sea Port or Onne) or an **airport**. At each, clearance follows the same general path from the last lesson, with local costs on top:

- **Shipping line or terminal charges** for handling and release.
- **Storage and demurrage.** Free days are limited. After them, storage at the terminal and **demurrage** (charges on the shipping line's container) accrue every day. A few days' delay can add up to a lot.
- **Customs examination** and any agreed examination costs.
- **Transport** from the port to your warehouse.
- **Agency fees** for your clearing agent.

Some goods are examined on arrival. Be present or reachable, and give your agent every document they ask for, promptly.

## Working with licensed clearing agents

A **licensed clearing agent** (customs agent or broker) is authorised to deal with Customs on your behalf. A good one saves money and delays; a bad one costs both.

Choose carefully:

- **Check the licence.** Ask for their Customs licence and confirm it independently.
- **Ask for references** from other importers of similar goods.
- **Get a written fee quote** showing agency fees separately from duty, port charges and other costs.
- **Give accurate documents and descriptions**, and the HS code you agreed. Do not ask the agent to "reduce" anything improperly.
- **Insist on official receipts** for duty and charges paid. Duty is paid to Customs through official channels, never in cash to individuals.
- **Agree who is responsible** if goods are delayed or penalties arise from the agent's error.
- **Stay involved.** Ask for updates at each stage.

> [!WARNING]
> If someone offers to "settle" officials or make a problem disappear for cash, refuse. It is bribery, it exposes you to prosecution, and it makes you a target for more demands.

## Compliance and record keeping

Keep a file for **every** shipment, in paper and digital copies:

- Proforma and commercial invoices, packing list, bill of lading or air waybill
- Form M, PAAR and assessment notices
- Duty and tax receipts, port and agent invoices
- Insurance certificate and any approvals
- Payment proofs and bank advices
- Photos of the goods on arrival, and notes of any damage

Records protect you if Customs or the tax authority asks questions later, let you work out true landed costs and make it easy to repeat what worked. Keep them for several years.

## Try it

```task
{
  "id": "iemi-m08-t1",
  "prompt": "Tunde will import **cosmetic creams** for resale. Name **four** Nigerian bodies or documents he must think about before he ships, and say in a few words why for each. One per line.",
  "minutes": 12,
  "rows": 7,
  "placeholder": "NAFDAC: ...\nCustoms: ...",
  "rules": [
    { "label": "Four lines", "minLines": 4 },
    { "label": "Mentions NAFDAC (cosmetics need registration)", "pattern": "nafdac" },
    { "label": "Mentions Customs", "pattern": "customs" },
    { "label": "Mentions Form M or PAAR or the bank", "pattern": "form m|paar|bank" },
    { "label": "Mentions CAC, business registration or TIN", "pattern": "cac|registration|registered|tin\\b|tax" }
  ],
  "sample": "NAFDAC: cosmetics generally need NAFDAC registration or approval before they can be sold, so I must check this before ordering.\nNigeria Customs Service: assesses the goods, collects duty and taxes and releases them.\nForm M and my bank: the import declaration must be raised through an authorised bank before the goods ship.\nCAC and tax registration: I should import as a registered business with a TIN so my bank, agent and records are in order.",
  "required": true
}
```

```task
{
  "id": "iemi-m08-t2",
  "prompt": "Write a **checklist of six questions** to ask a clearing agent before you hire them. One question per line, each ending with a question mark.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Are you licensed ...?",
  "rules": [
    { "label": "Six questions", "minLines": 6 },
    { "label": "Every line is a question", "pattern": "\\?\\s*$", "perLine": true },
    { "label": "Asks about their licence", "pattern": "licen[cs]" },
    { "label": "Asks about fees or charges in writing", "pattern": "fee|charge|cost|quote|writing" },
    { "label": "Asks about references or experience", "pattern": "reference|experience|other importers|clients?" },
    { "label": "Asks about receipts or documents", "pattern": "receipt|document|official" }
  ],
  "sample": "Are you a licensed customs agent, and can I see your licence?\nHave you cleared goods like mine before, and can I speak to other importers you have served?\nCan you give me a written quote that separates your agency fee from duty and port charges?\nWill you give me official receipts for every payment to Customs and the terminal?\nWhat documents do you need from me, and by when?\nHow will you update me and who is responsible if there is a delay caused by your error?",
  "required": true
}
```

```task
{
  "id": "iemi-m08-t3",
  "prompt": "List **eight documents** you will keep in the file for each shipment. One per line.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "Commercial invoice\nPacking list",
  "rules": [
    { "label": "Eight lines", "minLines": 8 },
    { "label": "Includes invoice and packing list", "pattern": "invoice[\\s\\S]*packing|packing[\\s\\S]*invoice" },
    { "label": "Includes bill of lading or air waybill", "pattern": "bill of lading|air ?waybill|awb|b/l" },
    { "label": "Includes Form M or PAAR", "pattern": "form m|paar" },
    { "label": "Includes receipts for duty or charges", "pattern": "receipt|duty|assessment" }
  ],
  "sample": "Proforma invoice\nCommercial invoice\nPacking list\nBill of lading or air waybill\nForm M\nPAAR and assessment notice\nDuty, tax and port charge receipts\nInsurance certificate and payment proofs",
  "required": false
}
```

Next lesson: pulling every cost together into a landed cost and a price.
