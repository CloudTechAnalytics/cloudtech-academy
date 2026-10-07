---
title: Import and Export Fundamentals
minutes: 25
summary: Understand what importing and exporting are, how mini importation differs from full trade, who is involved in a shipment, what the main trade terms mean and which risks to plan for.
---

## What importing and exporting are

**Importing** means buying goods from another country and bringing them in. **Exporting** means selling goods you make or buy locally to a buyer in another country. Every international sale is an import for one side and an export for the other: when a supplier in Guangzhou sells phone cases to a trader in Lagos, it is an export for China and an import for Nigeria.

The reason people trade across borders is simple: a product can cost far less, or be far better, where it is made. Your job as an importer is to turn that gap into profit **after** you have paid for everything that sits between the factory and your customer. That is the thread of this whole course: *the price on the supplier's page is never your real cost.*

## Mini importation versus full trade

**Mini importation** is the small-scale version: you buy small quantities, often a few cartons or a few hundred units, and bring them in by air cargo, sea consolidation (sharing a container with other importers) or a courier. You usually resell to shops, online customers or friends.

**Full trade** means a full container or large shipments, often of one product, with more paperwork, bigger money at risk and usually a registered company.

| | Mini importation | Full trade |
| :-- | :-- | :-- |
| **Order size** | A few cartons to a few hundred units | Whole containers |
| **Shipping** | Air cargo, courier, shared (LCL) sea freight | Full container (FCL) |
| **Money at risk** | Hundreds of thousands of naira | Millions |
| **Paperwork** | Still required, often handled by a forwarder | Fully managed with agents and banks |
| **Best for** | Learning, testing products, building a customer base | Proven products with steady demand |

Mini importation is not a way around the rules. The goods still pass through customs, still carry duty where it applies, and some products are restricted. Doing it properly is what lets you grow.

## Who is involved in a shipment

A single order passes through several hands. Know each one, because each takes a fee or a risk:

- **The supplier or manufacturer** makes or sells the goods.
- **The buyer (you)** orders, pays and sells.
- **The freight forwarder** arranges the transport: books space, collects from the supplier, handles shipping documents.
- **The carrier** (airline or shipping line) physically moves the goods.
- **The clearing agent** (also called a customs broker) deals with customs on arrival and gets the goods released.
- **Customs** checks the declaration, collects duty and taxes, and releases the goods.
- **Your bank** moves the money and, for many imports, helps you register the transaction.
- **Your customer** is where the money finally comes from.

## Trade terms (Incoterms) in plain language

Incoterms are standard terms, published by the International Chamber of Commerce, that say **who pays for what and who carries the risk at each stage**. You will see them on quotes, so you must read them. The current version is Incoterms 2020.

| Term | Plain meaning |
| :-- | :-- |
| **EXW** (Ex Works) | The goods are ready at the seller's door. You arrange and pay for everything from there, including getting them out of the supplier's country. |
| **FOB** (Free On Board) | The seller delivers the goods on to the ship at the named port and clears them for export. From that point the cost and risk are yours. Sea freight only. |
| **CIF** (Cost, Insurance and Freight) | The seller pays the freight and basic insurance to your destination port, but risk passes to you once the goods are on board. Sea freight only. |
| **DAP** (Delivered at Place) | The seller delivers to a named place and carries the transport risk. You handle import clearance, duty and taxes. |
| **DDP** (Delivered Duty Paid) | The seller delivers to you with import duty and taxes paid. Simple for you, but check the price carefully, as duties are built into it. |

The word that matters in each is the **named place**, such as "FOB Shenzhen". Two quotes with different terms cannot be compared until you add the missing costs to the cheaper-looking one.

> [!NOTE]
> Small suppliers quote many ways. When a quote just says "price", ask in writing: "Is this EXW, FOB or delivered, and to where?"

## Risks and how to manage them

| Risk | What it looks like | How to reduce it |
| :-- | :-- | :-- |
| **Supplier fraud or poor quality** | Money paid, nothing arrives, or goods are not as shown | Verify the supplier, order a sample, use protected payment |
| **Delays** | Goods stuck at port, missed selling season | Add buffer time, use a reliable forwarder |
| **Damage or loss** | Broken or missing cartons | Good packaging, insurance |
| **Duties and charges you did not expect** | A bill at the port larger than planned | Work out landed cost before ordering |
| **Exchange rate moves** | The dollar rises between order and payment | Add a margin, pay promptly, order often in smaller amounts |
| **Restricted or banned items** | Goods held or seized | Check the rules before you order |

A safe habit: **start small, test, then grow.** The first order is tuition.

## Try it

```task
{
  "id": "iemi-m01-t1",
  "prompt": "Tunde in Lagos wants to buy 300 phone cases from a supplier in Guangzhou, China, and resell them. Write one line for **each** party involved in the shipment (supplier, freight forwarder, clearing agent, customs, bank), saying what that party does for this order.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Supplier: ...\nFreight forwarder: ...",
  "rules": [
    { "label": "Names the supplier and what they do", "pattern": "supplier|manufacturer|factory" },
    { "label": "Names the freight forwarder and what they do", "pattern": "forwarder|freight" },
    { "label": "Names the clearing agent", "pattern": "clearing agent|customs broker|clearing" },
    { "label": "Names customs and its role (duty, checking, release)", "pattern": "customs[^\\n]*(duty|tax|check|release|inspect|declar)" },
    { "label": "Names the bank or payment route", "pattern": "bank|payment|transfer" },
    { "label": "At least five lines", "minLines": 5 }
  ],
  "sample": "Supplier: the factory in Guangzhou that makes the cases, packs them and prepares the invoice.\nFreight forwarder: books air or sea space, collects the cartons and sends the shipping documents.\nClearing agent: handles the paperwork at the Lagos port or airport and gets the goods released for Tunde.\nCustoms: checks the declaration, collects import duty and taxes and releases the goods.\nBank: moves the payment to the supplier and records the transaction for Tunde.",
  "required": true
}
```

```task
{
  "id": "iemi-m01-t2",
  "prompt": "Tunde's supplier offers three quotes for the same 300 cases: **EXW Guangzhou**, **FOB Shenzhen** and **DAP Lagos**. In 40 to 100 words, say which you would choose for a first small order and why. Mention who pays for transport and who carries the risk.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "I would choose ... because ...",
  "rules": [
    { "label": "Chooses one of EXW, FOB or DAP", "pattern": "\\b(exw|ex works|fob|dap)\\b" },
    { "label": "Says who pays for transport or freight", "pattern": "freight|shipping|transport|pays?" },
    { "label": "Talks about risk", "pattern": "risk" },
    { "label": "Gives a reason", "pattern": "because|since|so that|so i|as it" },
    { "label": "Between 40 and 100 words", "minWords": 40, "maxWords": 105 }
  ],
  "sample": "I would choose DAP Lagos for a first small order because the supplier pays for the transport and carries the risk until the cases reach the named place in Lagos, so a lost carton is their problem and not mine. I would still have to clear the goods and pay duty and taxes, so I would add those to my costs before comparing it with the EXW and FOB quotes. Once I know a good forwarder and trust the supplier, I may move to FOB to save money.",
  "required": true
}
```

```task
{
  "id": "iemi-m01-t3",
  "prompt": "List **three risks** in Tunde's first import and, after each, one concrete way he can reduce it. One risk per line, in the form \"Risk: ... - Fix: ...\".",
  "minutes": 8,
  "rows": 5,
  "placeholder": "Risk: ... - Fix: ...",
  "rules": [
    { "label": "Three lines", "minLines": 3 },
    { "label": "Every line has a risk and a fix", "pattern": "risk[^\\n]*fix", "perLine": true },
    { "label": "Mentions real risks (fraud, delay, damage, duty, exchange rate, quality)", "pattern": "fraud|scam|delay|damage|duty|exchange|quality|lost|restricted" }
  ],
  "sample": "Risk: the supplier takes the money and never ships - Fix: verify the company and pay through a protected method.\nRisk: the cases arrive damaged or poor quality - Fix: order a sample first and pack in strong cartons with insurance.\nRisk: duty and charges at the port are higher than planned - Fix: work out the landed cost before ordering.",
  "required": false
}
```

Next lesson: how to choose a product that will really sell.
