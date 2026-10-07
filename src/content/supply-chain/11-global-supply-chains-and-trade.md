---
title: Global Supply Chains and Trade
minutes: 20
summary: Weigh global against local sourcing, allow for tariffs, trade rules and long lead times, account for currency and total cost, and manage supply across countries.
---

## Global sourcing

A **global supply chain** buys, makes or sells across borders. Companies go global to reach lower costs, special skills or materials, larger markets and more suppliers. A Nigerian retailer may buy electronics from China, packaging from Turkey and sell in Ghana.

Global chains offer opportunity and add distance, so more things can go wrong. Before sourcing abroad, compare it honestly with **local sourcing** (or **nearshoring**, sourcing from nearby countries) on **total cost, lead time, risk, quality and flexibility.**

## Trade, tariffs and lead times

International trade adds layers:

- **Tariffs and duty:** taxes on imports, set by the tariff for each product.
- **Non-tariff rules:** product standards, permits, quotas, bans and documentation.
- **Trade agreements:** such as regional blocs and the African Continental Free Trade Area, which can reduce duty and paperwork between members if rules of origin are met.
- **Customs clearance** at both ends, with time and cost.
- **Longer, more variable lead times:** production, inland transport, port handling, ocean voyage, clearing and delivery. Forty to sixty days from order to shelf is common for sea freight from Asia.

Long lead times have a hidden cost: **pipeline inventory.** If you sell 25 units a day and lead time is 40 days, about 25 × 40 = **1,000 units** are always somewhere between supplier and shelf. At ₦9,750 landed each, that is **₦9,750,000** of money tied up in transit, before any safety stock.

## Currency and total cost

Most imports are paid in foreign currency, so the **exchange rate** is part of your cost. A change between order and payment changes the naira cost. Manage it by:

- **Pricing with a buffer** for currency movement.
- **Paying promptly** once terms are agreed.
- **Ordering smaller and more often** when rates are volatile.
- **Using forward contracts or other tools** through your bank, where available and affordable.
- **Reviewing prices frequently.**

Compare sources on **total landed cost per unit**, not just the supplier's price:

Example: an imported item costs $5.00 at ₦1,500 to the dollar = ₦7,500. Freight, insurance, duty, VAT, clearing and transport add about 30%, so the landed cost is 7,500 × 1.30 = **₦9,750**. A local supplier sells at ₦9,200. The local option is ₦550 cheaper per unit, so on 12,000 units it saves **₦6,600,000**, and it delivers faster and needs less stock. If the naira weakens by 10% to ₦1,650, the import becomes $5.00 × 1,650 × 1.30 = **₦10,725**, widening the gap.

Always also weigh quality, minimum order size, flexibility and risk. Sometimes the imported item is still the right answer: when it is not available locally, quality is better or volumes are large.

## Managing across countries

Running a chain across several countries needs extra discipline:

- **Clear contracts** with agreed terms (Incoterms), currency, quality, dispute resolution and the governing law.
- **Reliable partners:** a good freight forwarder, clearing agent, inspection company and bank.
- **Quality control at source:** pre-shipment inspection, certificates and samples.
- **Compliance:** customs rules, product standards, sanctions, anti-bribery and labour laws in each country.
- **Time zones, language and culture:** agree communication routines, use clear written specifications and confirm in writing.
- **Visibility:** track shipments and supplier performance.
- **Contingency:** alternative routes, ports and suppliers.

A global chain should be **designed deliberately**, not drift into being a patchwork of cheapest options.

## Try it

```task
{
  "id": "scm-m11-t1",
  "prompt": "An imported item costs **$5.00** at **₦1,500 to $1**. Freight, insurance, duty, VAT, clearing and transport add **30%** to the naira cost. A local supplier sells the same item at **₦9,200**. Work out the **landed cost**, which is cheaper and by how much per unit, and the saving on **12,000 units**.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Product cost in naira = ...",
  "rules": [
    { "label": "Product cost of ₦7,500", "pattern": "7,?500" },
    { "label": "Landed cost of ₦9,750", "pattern": "9,?750" },
    { "label": "Local is cheaper by ₦550", "pattern": "550" },
    { "label": "Saving of ₦6,600,000", "pattern": "6,?600,?000" }
  ],
  "sample": "Product cost = 5.00 x 1,500 = ₦7,500.\nLanded cost = 7,500 x 1.30 = ₦9,750.\nThe local supplier at ₦9,200 is cheaper by 9,750 - 9,200 = ₦550 per unit.\nOn 12,000 units the saving is 12,000 x 550 = ₦6,600,000.",
  "required": true
}
```

```task
{
  "id": "scm-m11-t2",
  "prompt": "Lead time from the overseas supplier is **40 days** and you sell **25 units a day**. Landed cost is **₦9,750** a unit. Work out the **pipeline inventory** in units and in naira, and say in one or two sentences why it matters.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Pipeline units = ...",
  "rules": [
    { "label": "1,000 units in the pipeline", "pattern": "1,?000" },
    { "label": "₦9,750,000 tied up", "pattern": "9,?750,?000" },
    { "label": "Explains the cash tied up or cost of holding", "pattern": "cash|tied|money|capital|financ|cost|interest|working capital" }
  ],
  "sample": "Pipeline inventory = 40 x 25 = 1,000 units.\nIn naira = 1,000 x 9,750 = ₦9,750,000.\nThat money is tied up in goods in transit and cannot be used elsewhere, so long lead times add a hidden financing cost.",
  "required": true
}
```

```task
{
  "id": "scm-m11-t3",
  "prompt": "The naira weakens by **10%** to **₦1,650 to $1**. Work out the new **landed cost** of the $5.00 item (with the same 30% added) and the new gap with the local price of ₦9,200. Then say in 30 to 70 words how you would respond.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "New product cost = ...",
  "rules": [
    { "label": "New product cost of ₦8,250", "pattern": "8,?250" },
    { "label": "New landed cost of ₦10,725", "pattern": "10,?725" },
    { "label": "New gap of ₦1,525", "pattern": "1,?525" },
    { "label": "Suggests a response (shift to local, renegotiate, reprice, order smaller, buffer)", "pattern": "local|renegotiat|reprice|price|smaller|buffer|supplier|alternative|hedg|forward" }
  ],
  "sample": "New product cost = 5.00 x 1,650 = ₦8,250. New landed cost = 8,250 x 1.30 = ₦10,725. The local price of ₦9,200 is now ₦1,525 cheaper per unit.\nI would move more volume to the local supplier, renegotiate the import price, reprice where I can, and order smaller batches more often so I can adjust quickly.",
  "required": false
}
```

Next lesson: your own supply chain analysis.
