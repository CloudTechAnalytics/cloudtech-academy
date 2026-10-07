---
title: Export Fundamentals and Finding Buyers
minutes: 20
summary: Understand export basics and what sells abroad, the main export documents and rules, how to find and check international buyers, how to price and get paid, and how to ship to the buyer.
---

> [!NOTE]
> Export rules, agencies, incentives and restricted goods change. This lesson shows the structure and the right questions. **Confirm the current requirements with the Nigerian Export Promotion Council (NEPC), Customs and the agency for your product before you ship.**

## Export basics

**Exporting** means selling goods outside your country. It can earn foreign currency, reach far bigger markets and allow better prices than you can get at home. It also asks more of you: the product must meet the buyer's standard, the paperwork must be right and getting paid across borders needs care.

Exporting is not only for big companies. A small producer can start with a single buyer and a single product.

## What sells abroad

Nigeria exports many raw and processed goods. Commonly traded categories include:

- **Agricultural products:** sesame seeds, cocoa, cashew, ginger, hibiscus flower (zobo), and other crops.
- **Processed and packaged foods:** such as dried and packaged snacks, spices and sauces, especially for the diaspora.
- **Beauty and personal care:** shea butter, black soap, natural oils.
- **Fashion and crafts:** Ankara and other textiles, beads, leather goods, art.
- **Minerals and other commodities,** which are more regulated.

Buyers pay well for **quality, consistency and reliability**. A smaller volume of well-processed, well-packed goods often sells better than a large amount of untidy ones. Check which of your products are restricted from export in raw form, as some raw materials face export limits to encourage local processing.

## Export documents and rules

The set depends on the goods, but commonly includes:

| Document or step | Purpose |
| :-- | :-- |
| **Registration as an exporter** | With NEPC, so you can access export support and be recognised |
| **Form NXP** | The export declaration, completed through your bank, so the proceeds can be tracked |
| **Commercial invoice and packing list** | The sale and the contents, as in imports |
| **Bill of lading or air waybill** | The transport document |
| **Certificate of origin** | Shows the goods are Nigerian, which can unlock lower duty in the buyer's market |
| **Phytosanitary certificate** | For plant products, from the agricultural quarantine service, saying they are free of pests |
| **NAFDAC and quality certificates** | For food, cosmetics and drugs |
| **Customs examination and clearance** | Goods are inspected and released for export |

The buyer's country has rules too: labelling, residue limits for food and import permits. Ask your buyer early what they need, because a rejected shipment abroad can be a total loss.

## Finding international buyers

- **NEPC and trade support.** Government export agencies publish buyer lists and run trade missions.
- **B2B platforms.** List your products on international marketplaces with clear photos, specifications, MOQ and certificates.
- **Trade fairs and exhibitions,** in person or online.
- **Embassies and trade commissions,** which connect exporters with buyers.
- **Importers and distributors in the target country.** Search for who already buys your product and message them directly with a short, professional offer.
- **The diaspora.** For food, fashion and beauty, Nigerians abroad are an eager first market.
- **Your professional network,** including LinkedIn, to reach buyers and brokers.

A strong first approach is brief: who you are, the product, specification and quality proof, the quantity and price range, your location and how you can send a sample.

**Check the buyer** as carefully as you checked suppliers: company registration, website, references and trading history. Never ship on a promise alone.

## Pricing and payment terms for export

Price your export in the buyer's currency and state the terms. A typical export price covers your product cost, processing, packing, local transport, port and documentation, plus your profit.

*FOB price = total cost to place the goods on the ship + profit.*

Payment terms, from safest to riskiest for you as the seller:

| Term | How it works | Risk for you |
| :-- | :-- | :-- |
| **Payment in advance** | The buyer pays before you ship | Lowest, but few new buyers accept it in full |
| **Letter of credit** | The buyer's bank promises to pay on correct documents | Low, but documents must match exactly |
| **Documents against payment** | The buyer's bank releases the documents when the buyer pays | Medium |
| **Part in advance, balance before release** | A deposit then the balance on shipment | Balanced, the common starting point |
| **Open account / credit** | You ship and the buyer pays later | High: only with a long-trusted buyer |

For a new buyer, ask for a deposit and the balance before the goods or documents are released, or use a letter of credit.

## Shipping to the buyer

Agree the Incoterm in the contract (FOB, CIF or DAP are common), who books the transport and who insures. Use a forwarder with experience on the route. Pack for the journey and the destination's rules, and keep photographs and records. Follow the shipment, tell the buyer the tracking and arrival date, and keep your documents ready for the buyer's customs.

## Try it

```task
{
  "id": "iemi-m11-t1",
  "prompt": "Calculate the **FOB price** and the **price in dollars** for 1 tonne of dried ginger. Buying cost ₦1,400,000; processing and packing ₦200,000; local transport and port ₦150,000; documents and fees ₦50,000. Add a **20% profit on cost**. Exchange rate: ₦1,500 to $1.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Total cost = ...",
  "rules": [
    { "label": "Total cost of ₦1,800,000", "pattern": "1,?800,?000" },
    { "label": "Profit of ₦360,000", "pattern": "360,?000" },
    { "label": "FOB price of ₦2,160,000", "pattern": "2,?160,?000" },
    { "label": "Price of $1,440", "pattern": "1,?440" }
  ],
  "sample": "Total cost = 1,400,000 + 200,000 + 150,000 + 50,000 = ₦1,800,000.\nProfit at 20% = 0.20 x 1,800,000 = ₦360,000.\nFOB price = 1,800,000 + 360,000 = ₦2,160,000 per tonne.\nIn dollars = 2,160,000 / 1,500 = $1,440 per tonne.",
  "required": true
}
```

```task
{
  "id": "iemi-m11-t2",
  "prompt": "A new buyer abroad asks you to ship 2 tonnes of sesame **on credit**, paying 60 days after arrival. In 40 to 100 words, say what you would propose instead and why.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "I would propose ...",
  "rules": [
    { "label": "Proposes a safer term (deposit, letter of credit, documents against payment, balance before release)", "pattern": "deposit|letter of credit|\\blc\\b|against payment|in advance|balance before|advance" },
    { "label": "Explains the risk of credit with a new buyer", "pattern": "risk|trust|unpaid|not paid|new buyer|unknown|default" },
    { "label": "Mentions checking the buyer", "pattern": "check|verify|reference|history|registered" },
    { "label": "Between 40 and 100 words", "minWords": 40, "maxWords": 105 }
  ],
  "sample": "I would not ship on 60 days' credit to a new buyer because the risk of not being paid is too high and I cannot easily recover money from abroad. I would propose a deposit of about 30% with the balance paid before the goods or documents are released, or a letter of credit confirmed by a bank. I would also check the buyer's company registration, references and trading history before agreeing. After a few successful orders, I could consider giving credit on small amounts.",
  "required": true
}
```

```task
{
  "id": "iemi-m11-t3",
  "prompt": "Write a **short first message to an overseas buyer** (50 to 110 words) offering a Nigerian product: who you are, the product and specification, a quantity and price range, a sample offer and how to reply.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Dear ..., I am ...",
  "rules": [
    { "label": "Greets and says who you are", "pattern": "dear|hello|hi |i am|we are|my name" },
    { "label": "Names a product", "pattern": "ginger|sesame|cocoa|cashew|hibiscus|shea|product|seeds|oil|butter|snack" },
    { "label": "Mentions quantity or price range", "pattern": "\\d+\\s*(tonnes?|tons?|kg|kilograms?|cartons?|units?)|\\$\\s?\\d|price" },
    { "label": "Offers a sample", "pattern": "sample" },
    { "label": "Invites a reply", "pattern": "reply|contact|let me know|get in touch|respond|send us|email" },
    { "label": "Between 50 and 110 words", "minWords": 50, "maxWords": 115 }
  ],
  "sample": "Dear Mr Hassan, I am Chioma Eze, an exporter of dried ginger from Kaduna, Nigeria. We supply split, dried ginger with 8% moisture, cleaned and packed in 25kg bags, with a phytosanitary certificate and laboratory test report. We can supply 1 to 10 tonnes a month at around $1,500 to $1,600 per tonne FOB Lagos. I would be glad to send you a free 1kg sample so you can check the quality. Please reply with your specification and the quantity you need, and I will send a full quotation.",
  "required": false
}
```

Next lesson: pulling the whole course together into your own plan.
