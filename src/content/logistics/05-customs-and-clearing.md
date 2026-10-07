---
title: Customs and Clearing
minutes: 20
summary: Understand how customs works, HS codes, duty and valuation, clearing at ports and airports, and how bonded, transit and temporary import arrangements work.
---

> [!NOTE]
> Customs rates, procedures and systems change. This lesson teaches the principles and the right questions. **Always confirm current rules and rates with the Nigeria Customs Service or a licensed clearing agent before you quote or ship.**

## How customs works

**Customs** is the government authority that controls the movement of goods across a border. It has three main jobs:

1. **Protect** the country by enforcing import and export bans and restrictions.
2. **Collect revenue:** duty and taxes on imports (and in some cases exports).
3. **Collect trade data** to measure trade and manage the economy.

For every shipment that crosses a border, someone must make a **declaration** to customs that describes the goods, their value and classification, and shows the documents. Customs checks it, assesses what is owed, may examine the goods and then **releases** them.

Forwarders and clearing agents deal with customs every day. They need to know the procedures and also the people, systems and timelines at each port.

## HS codes, duty and valuation

**HS codes.** The Harmonized System classifies goods. The first six digits are the same worldwide; countries add digits for their own tariff. The code decides the duty rate and any restrictions. Correct classification is the clearing agent's skill: mistakes lead to paying too much, being fined or having goods held.

**Duty.** Import duty is normally a percentage of the customs value, set by the tariff for the HS code. In Nigeria, standard rates follow the ECOWAS Common External Tariff bands, commonly 0%, 5%, 10%, 20% and 35%, with some goods subject to other charges or restrictions.

**VAT.** Charged on import, currently at 7.5% in Nigeria, on the customs value plus duty and certain charges.

**Valuation.** The customs value is normally the **CIF value**: the price of the goods, plus insurance and freight to the port of entry. Customs expects the declared value to reflect what was truly paid.

Worked example (ignoring small levies):

- CIF value: ₦5,000,000
- Duty at 5%: ₦250,000
- VAT at 7.5% on (₦5,000,000 + ₦250,000 = ₦5,250,000): ₦393,750
- **Total duty and VAT: ₦643,750**

> [!WARNING]
> Under-declaring value or misdescribing goods to reduce duty is an offence. It risks seizure, penalties and loss of your licence. Always declare truthfully.

## Clearing at ports and airports

A typical import clearance, step by step:

1. **Before shipment:** the importer obtains the required import declaration (Form M in Nigeria) and approvals.
2. **Arrival:** the vessel or aircraft arrives and the cargo is discharged to the terminal or cargo area.
3. **Documents:** the clearing agent receives the shipping documents and prepares the declaration.
4. **Assessment:** customs reviews the declaration, classification and value, and assesses duty and taxes.
5. **Payment:** duty and port charges are paid through the official channels, with receipts.
6. **Examination:** customs may inspect the goods, fully or in part.
7. **Release:** customs and the terminal or shipping line release the goods.
8. **Exit and delivery:** the goods are collected and transported to the customer.

Time is money: after the free days the terminal charges storage and the shipping line charges container **demurrage**. Fast, accurate paperwork is the best way to control cost.

## Bonded goods, transit and temporary import

Not all goods are cleared for home use immediately. Several customs regimes help trade:

- **Bonded warehouse:** goods are stored under customs control without paying duty until they are released for sale or exported. Useful for goods that may be re-exported or sold later.
- **Transit:** goods pass **through** a country to another destination, with duty suspended while they remain under customs control, for example goods moving by road to a landlocked neighbouring country.
- **Temporary import:** goods enter for a limited time (equipment for an exhibition or a project) and must leave again, with duty suspended or guaranteed.
- **Re-export and drawback:** goods imported and later exported again may qualify for relief from duty, if the rules are met.

Each regime has conditions: guarantees, time limits, seals and documents. Failing to meet them means duty becomes due, often with penalties.

## Try it

```task
{
  "id": "lff-m05-t1",
  "prompt": "The CIF value of a shipment is **₦5,000,000**, duty is **5%** and VAT is **7.5% on CIF plus duty**. Work out the duty, the VAT and the total, ignoring other levies.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Duty = ...",
  "rules": [
    { "label": "Duty of ₦250,000", "pattern": "250,?000" },
    { "label": "VAT base of ₦5,250,000", "pattern": "5,?250,?000" },
    { "label": "VAT of ₦393,750", "pattern": "393,?750" },
    { "label": "Total of ₦643,750", "pattern": "643,?750" }
  ],
  "sample": "Duty = 5% of 5,000,000 = ₦250,000.\nVAT base = 5,000,000 + 250,000 = ₦5,250,000.\nVAT = 7.5% of 5,250,000 = ₦393,750.\nTotal duty and VAT = 250,000 + 393,750 = ₦643,750.",
  "required": true
}
```

```task
{
  "id": "lff-m05-t2",
  "prompt": "Put the clearance steps for an import in order. Write **eight steps**, one per line, covering the import declaration before shipment, arrival, documents, assessment, payment, examination, release and delivery.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "1. ...",
  "rules": [
    { "label": "Eight lines", "minLines": 8 },
    { "label": "Includes the declaration or Form M before shipment", "pattern": "form m|declaration|before ship" },
    { "label": "Includes arrival or discharge", "pattern": "arriv|discharge|land" },
    { "label": "Includes documents", "pattern": "document" },
    { "label": "Includes assessment", "pattern": "assess" },
    { "label": "Includes payment of duty", "pattern": "pay|duty" },
    { "label": "Includes examination", "pattern": "examin|inspect" },
    { "label": "Includes release and delivery", "pattern": "releas[\\s\\S]*deliver|deliver[\\s\\S]*releas|releas|deliver" }
  ],
  "sample": "1. The importer raises the import declaration (Form M) before the goods ship.\n2. The vessel arrives and the cargo is discharged at the port.\n3. The clearing agent receives the shipping documents and prepares the declaration.\n4. Customs assesses the declaration, classification and value.\n5. Duty, taxes and port charges are paid through official channels.\n6. Customs may examine the goods.\n7. Customs and the terminal release the goods.\n8. The goods are collected and delivered to the customer.",
  "required": true
}
```

```task
{
  "id": "lff-m05-t3",
  "prompt": "In 40 to 90 words, explain the difference between a **bonded warehouse** and **transit**, and give one example of when each is useful.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "A bonded warehouse ...",
  "rules": [
    { "label": "Explains bonded warehouse (stored, duty suspended until release)", "pattern": "bonded[^.]*(stor|duty|warehouse|suspend|until)" },
    { "label": "Explains transit (passing through to another destination)", "pattern": "transit[^.]*(through|another|destination|pass|suspend|move)" },
    { "label": "Gives an example", "pattern": "example|for instance|such as|e\\.g\\.|when" },
    { "label": "Between 40 and 90 words", "minWords": 40, "maxWords": 95 }
  ],
  "sample": "A bonded warehouse stores imported goods under customs control without paying duty until they are released for sale or exported, which is useful for goods that may be re-exported later. Transit lets goods pass through a country on the way to another destination, with duty suspended while they stay under customs control, for example cargo landed at Lagos and moved by road to a neighbouring country. Both regimes have conditions such as guarantees and time limits.",
  "required": false
}
```

Next lesson: how freight is priced and quoted.
