---
title: Supplier Sourcing
minutes: 30
summary: Know where to find suppliers, read a supplier profile on Alibaba and other platforms, compare suppliers fairly and use trade shows and sourcing agents.
---

## Where suppliers are

You can find suppliers in several places. Each suits a different situation:

| Source | What it is | Good for | Watch out for |
| :-- | :-- | :-- | :-- |
| **Alibaba.com** | Large B2B marketplace, mainly Chinese suppliers | Wholesale orders, customisation, many categories | Many middlemen posing as factories |
| **1688.com** | Chinese domestic wholesale site | Lowest factory prices | Chinese language, needs an agent |
| **AliExpress** | Retail platform from the same group | Very small test orders | Higher unit prices |
| **Made-in-China, Global Sources** | Other B2B platforms | Verified exporters, electronics | Smaller catalogues |
| **Local wholesale markets abroad** | Physical markets in Guangzhou, Yiwu, Istanbul, Dubai | Seeing and touching goods | Travel cost, language |
| **Trade fairs** | The Canton Fair in Guangzhou and similar events | Meeting many factories at once | Travel and time |
| **Sourcing agents** | A person or company who finds and checks suppliers for a fee | Beginners, language gap, checking factories | Agents' own commission and honesty |

For a first mini import, **Alibaba plus a small sample order** is the usual starting point. Treat it as a directory, not a guarantee: the platform lists suppliers, but it does not make every one honest or good.

## Reading a supplier profile

Open the supplier's company profile, not just the product page. Look for:

- **Business type.** "Manufacturer" or "Trading company"? A factory usually offers lower prices and customisation. A trading company can still be a good choice for mixed small orders, but price it knowing there is a margin inside.
- **Years on the platform and verification badges.** Longer history and independently checked status are good signs, not proof.
- **Products listed.** A true factory focuses on a line of goods. A profile selling electronics, shoes and furniture is probably a trader.
- **Response rate and time.** Fast, clear replies are a good sign.
- **Transaction history and reviews.** Look for repeat buyers, and for sellers who have shipped to countries like Nigeria.
- **Photos.** Real factory and production photos, not only polished studio pictures.
- **Minimum order quantity (MOQ).** Can you afford it? Is it open to negotiation?

> [!TIP]
> Message three to five suppliers for every product. One supplier's price means little. Several tell you what the real market price and quality range is.

## Contacting suppliers

Send a short, specific first message. Vague messages get vague answers.

*"Hello, I am planning to import 300 units of [product, model number]. Please send: the unit price at 300, 500 and 1,000 units; MOQ; the price for a sample; production time; your packaging and carton size and weight; and a quote on FOB Shenzhen terms. We will ship to Lagos, Nigeria. Thank you."*

Notice what this does: it states a quantity, asks for price tiers, asks about samples and time, names the shipping terms and the destination. A serious supplier will answer the questions; one who ignores them and just says "pls order" is a warning sign.

## Comparing suppliers fairly

Compare like with like, in a table:

| Supplier | Unit price | Terms | MOQ | Sample cost | Lead time | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| A | $2.80 | FOB | 200 | $15 | 12 days | Factory, 8 years, good replies |
| B | $2.40 | EXW | 500 | $20 | 20 days | Trader, unclear photos |
| C | $3.10 | FOB | 100 | $10 | 10 days | Factory, ships to Nigeria often |

The lowest price (B) is not the best deal once you add that it is EXW (you pay more for transport inside China), needs a bigger order and is slower. **Adjust every quote to the same terms before ranking.**

## Trade shows and agents

A trade fair lets you meet factories, touch products and negotiate in person. It is costly, so for a beginner a **sourcing agent** may be cheaper: they visit factories, collect samples, check quality and consolidate orders. Agree their fee (commonly a percentage of the order or a fixed fee) in writing, and verify the agent as carefully as you verify a supplier.

## Try it

```task
{
  "id": "iemi-m03-t1",
  "prompt": "Write your **first message** to a supplier for a product you might import. In 50 to 120 words, state the product, the quantity, ask for price tiers, MOQ, a sample price, lead time and shipping terms, and say it is going to Lagos.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Hello, I am planning to import ...",
  "rules": [
    { "label": "Says the quantity", "pattern": "\\b\\d+\\s*(units?|pieces?|pcs)|\\b\\d{2,}\\b" },
    { "label": "Asks for the price or price tiers", "pattern": "price|tier|quote|cost" },
    { "label": "Asks about MOQ or minimum order", "pattern": "moq|minimum order" },
    { "label": "Asks about a sample", "pattern": "sample" },
    { "label": "Asks about lead time or production time", "pattern": "lead time|production time|how long|days" },
    { "label": "Mentions shipping terms (FOB, EXW, CIF, DAP)", "pattern": "\\b(fob|exw|cif|dap|ddp)\\b" },
    { "label": "Mentions the destination", "pattern": "lagos|nigeria" },
    { "label": "Between 50 and 120 words", "minWords": 50, "maxWords": 125 }
  ],
  "sample": "Hello, I am planning to import 300 units of your 20,000mAh power bank, model PB-20. Please send your unit price at 300, 500 and 1,000 units, your MOQ, the price of a sample and how long a sample takes to arrive. I would also like the production lead time for 300 units, the carton size and weight, and a quote on FOB Shenzhen terms. The goods will be shipped to Lagos, Nigeria. Please also tell me whether the product has a CE or similar certificate and what warranty you give. Thank you, I look forward to your reply.",
  "required": true
}
```

```task
{
  "id": "iemi-m03-t2",
  "prompt": "Three suppliers quote for 500 units. **A**: $2.80 FOB, MOQ 200, sample $15. **B**: $2.40 EXW, MOQ 500, sample $20, a trading company with unclear photos. **C**: $3.10 FOB, MOQ 100, sample $10, a factory that ships often to Nigeria. In 50 to 110 words, rank them and explain your first choice. Mention why B's lower price may mislead.",
  "minutes": 12,
  "rows": 7,
  "placeholder": "My ranking is ...",
  "rules": [
    { "label": "Ranks the three suppliers (mentions A, B and C)", "pattern": "\\bA\\b[\\s\\S]*\\bB\\b[\\s\\S]*\\bC\\b|supplier a[\\s\\S]*supplier b[\\s\\S]*supplier c" },
    { "label": "Explains that EXW costs extra or terms differ", "pattern": "exw[^.]*(extra|more|add|cost|transport|inside|china)|different terms|same terms" },
    { "label": "Mentions factory versus trader or the photos", "pattern": "factory|trading company|trader|photos?" },
    { "label": "Gives a reason", "pattern": "because|since|so that|therefore" },
    { "label": "Between 50 and 110 words", "minWords": 50, "maxWords": 115 }
  ],
  "sample": "My ranking is A first, C second and B last. A and C are both factories quoting FOB, so I can compare them directly, and A is cheaper at $2.80. C is slightly dearer but has the lowest MOQ and already ships to Nigeria, so it is a good back-up. B looks cheapest at $2.40, but it is EXW, so I would pay extra to move the goods inside China, it needs a bigger order, and it is a trading company with unclear photos. Once I add transport and the risk, B is not really cheaper, so I would order samples from A and C because they are the safer choices.",
  "required": true
}
```

```task
{
  "id": "iemi-m03-t3",
  "prompt": "Make a **supplier comparison table** for one product, with at least three suppliers. Use one line each in the form \"Supplier - unit price - terms - MOQ - lead time - notes\".",
  "minutes": 12,
  "rows": 6,
  "placeholder": "Supplier A - $2.80 - FOB - 200 - 12 days - factory, 8 years",
  "rules": [
    { "label": "At least three suppliers", "minLines": 3 },
    { "label": "Every line has a price", "pattern": "[$₦¥]\\s?\\d|\\d+(\\.\\d+)?\\s?(usd|ngn|rmb|dollars)", "perLine": true },
    { "label": "Every line states terms (FOB, EXW, CIF, DAP)", "pattern": "\\b(fob|exw|cif|dap|ddp)\\b", "perLine": true },
    { "label": "Every line has a lead time", "pattern": "days?|weeks?", "perLine": true }
  ],
  "sample": "Supplier A - $2.80 - FOB - MOQ 200 - 12 days - factory, 8 years, good replies\nSupplier B - $2.40 - EXW - MOQ 500 - 20 days - trading company, unclear photos\nSupplier C - $3.10 - FOB - MOQ 100 - 10 days - factory, ships often to Nigeria",
  "required": false
}
```

Next lesson: how to tell a genuine supplier from a scam.
