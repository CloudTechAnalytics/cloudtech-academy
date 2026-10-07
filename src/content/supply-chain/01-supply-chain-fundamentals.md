---
title: Supply Chain Fundamentals
minutes: 25
summary: Understand what a supply chain is, the flows of goods, information and money through it, how strategy shapes it, and the careers it offers.
---

## What a supply chain is

A **supply chain** is the network of organisations, people and activities that turns raw materials into a product and gets it to the customer. Think of a bottle of water on a shop shelf in Ibadan: the water source and treatment plant, the plastic maker, the bottler, the label printer, the distributor, the truck, the shop, and finally you. Each is a link, and the chain is only as strong as its weakest one.

**Supply chain management (SCM)** is planning and coordinating all of these links so that the right product reaches the right customer, at the right time, in good condition, at a cost that leaves a profit. It is wider than logistics: logistics moves and stores goods, while SCM also covers planning, sourcing, making and the relationships between companies.

## The main stages

| Stage | Question it answers | Example |
| :-- | :-- | :-- |
| **Plan** | How much will we need, and how will we meet it? | Forecast demand, plan production and stock |
| **Source** | Where do we get materials and services? | Choose and manage suppliers |
| **Make** | How do we turn inputs into products? | Production, packing, quality control |
| **Deliver** | How does the product reach the customer? | Warehousing, transport, last-mile |
| **Return** | What happens to returns and waste? | Returns, repair, recycling |

Most supply chain models, including the well-known SCOR model, use these same stages.

## Flows of goods, information and money

Three flows run through every chain, and problems in any one can hurt the others.

1. **Goods flow forward:** materials to factories, products to warehouses, shops and customers.
2. **Information flows both ways:** orders and forecasts go **backward**, from the customer toward suppliers; shipping notices and stock levels go **forward**. Poor or late information is behind most supply chain trouble.
3. **Money flows backward:** customers pay the shop, the shop pays the distributor, the distributor pays the manufacturer, who pays suppliers. Payment terms decide who carries the cash burden.

A shop that pays its supplier in 30 days but sells stock in 60 days must find the cash for 30 days. A chain with good information and fair terms keeps all three flows smooth.

## Supply chain strategy

A supply chain should fit what customers value. Two classic strategies:

| | **Efficient** chain | **Responsive** chain |
| :-- | :-- | :-- |
| **Goal** | Lowest cost | Speed and flexibility |
| **Best for** | Stable, predictable products (cooking oil, cement, rice) | Uncertain, fast-changing products (fashion, gadgets, fresh produce) |
| **Typical features** | Large batches, low stock, cheapest suppliers | Spare capacity, more stock, faster suppliers and transport |
| **Risk** | Cannot react quickly | Higher cost |

Using the wrong strategy hurts. A fast, costly chain for a cheap, steady product wastes money. A lean, cheap chain for a trendy product leaves you with unsold stock or stockouts. Many companies run **different chains for different products** or segments.

## Careers and roles

Supply chain work is in demand across manufacturing, retail, oil and gas, FMCG, healthcare, agriculture and e-commerce. Typical roles: demand planner, procurement officer, logistics coordinator, warehouse manager, inventory controller, transport planner, supply chain analyst and supply chain manager. Useful skills: analysis and spreadsheet skills, communication, negotiation, problem solving and basic knowledge of trade and regulation.

## Try it

```task
{
  "id": "scm-m01-t1",
  "prompt": "Map the supply chain of **one product you buy** (for example bottled water, garri, a phone, bread). List **six links** in order from raw material to you, one per line, with a few words on what each does.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "1. Farmer - grows the cassava\n2. ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Includes a raw material or farm or source", "pattern": "farm|raw|source|grow|mine|plant|supplier|harvest" },
    { "label": "Includes a maker (factory, processor, producer)", "pattern": "factory|process|produc|manufactur|bottl|bak|mill|assembl" },
    { "label": "Includes transport or a distributor", "pattern": "transport|truck|distribut|haul|deliver|ship" },
    { "label": "Includes a retailer or shop", "pattern": "retail|shop|market|store|vendor|supermarket" },
    { "label": "Ends with the customer", "pattern": "customer|consumer|you\\b|buyer" }
  ],
  "sample": "1. Cassava farmer - grows and harvests the cassava\n2. Aggregator - buys from many farmers and trucks it to the mill\n3. Garri processor - peels, grates, ferments and fries the garri\n4. Packaging supplier - provides the bags and labels\n5. Distributor - buys in bulk and delivers by truck to markets\n6. Market retailer - sells it by the cup or bag\n7. Customer - buys and eats it",
  "required": true
}
```

```task
{
  "id": "scm-m01-t2",
  "prompt": "For the same product, describe the **three flows**: what moves as goods, what moves as information and what moves as money, and in which direction. Write 50 to 110 words.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Goods flow ...",
  "rules": [
    { "label": "Describes the flow of goods", "pattern": "goods|product|cassava|materials?" },
    { "label": "Describes information (orders, forecasts, stock levels)", "pattern": "information|order|forecast|demand|stock level|data" },
    { "label": "Describes money (payment, terms, cash)", "pattern": "money|pay|payment|cash|terms|invoice" },
    { "label": "States directions (forward, backward, towards the customer, upstream)", "pattern": "forward|backward|towards|toward|upstream|downstream|back to|to the customer" },
    { "label": "Between 50 and 110 words", "minWords": 50, "maxWords": 115 }
  ],
  "sample": "The goods flow forward: cassava goes from the farmer to the processor, then bags of garri go by truck to the distributor, the market trader and finally the customer. Information flows both ways: the customer's demand shows up as orders from the trader to the distributor and on to the processor, while delivery notices and stock levels travel forward. Money flows backward: the customer pays the trader, the trader pays the distributor, the distributor pays the processor and the processor pays the farmers, often on different payment terms.",
  "required": true
}
```

```task
{
  "id": "scm-m01-t3",
  "prompt": "A company sells **fashionable sneakers** whose demand changes every month. Should it run an **efficient** or a **responsive** supply chain? In 40 to 90 words, give your choice and two features of that chain.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "It should run ...",
  "rules": [
    { "label": "Chooses a responsive chain", "pattern": "responsive" },
    { "label": "Gives a reason (uncertain, fast-changing, trends)", "pattern": "uncertain|unpredictable|changes|trend|fast-?changing|volatile|fashion" },
    { "label": "Names two features (spare capacity, faster suppliers, more stock, flexible, quick transport)", "pattern": "(capacity|faster|flexib|stock|quick|speed|air)[\\s\\S]*(capacity|faster|flexib|stock|quick|speed|air)" },
    { "label": "Between 40 and 90 words", "minWords": 40, "maxWords": 95 }
  ],
  "sample": "It should run a responsive supply chain, because fashionable sneakers have uncertain, fast-changing demand, and a cheap but slow chain would leave it with unsold styles or empty shelves. A responsive chain would use suppliers that can deliver quickly in small batches, keep some spare production capacity and use faster transport when needed. It costs more per unit, but it protects sales and avoids heavy markdowns.",
  "required": false
}
```

Next lesson: demand planning and forecasting.
