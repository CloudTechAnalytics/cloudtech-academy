---
title: Warehousing and Distribution
minutes: 25
summary: Design warehouse layout and flow, improve picking, packing and dispatch, design a distribution network by comparing total cost and use cross-docking and fulfilment models.
---

## Warehouse layout and flow

A warehouse should be designed around **flow**: goods arrive, are checked, stored, picked, packed and leave, with as little travelling and handling as possible. Poor layout means long walking distances, congestion and errors. Most of a picker's time is spent travelling, so reducing distance is the biggest lever.

Design principles:

- **One-way flow** where possible: receiving at one end, dispatch at the other, or at the same side in a U shape for shared docks and supervision.
- **Slotting by ABC.** Put fast-moving (A) items near dispatch, at waist height and in easy-to-reach locations. Slow movers go further away or higher up.
- **Group items that are often ordered together.**
- **Clear aisles and marked locations.** Every location has an address.
- **Enough space** at receiving and dispatch so goods do not pile up in the aisles.
- **Safety:** separate people and vehicles, fire exits, safe racking and lighting.
- **Use height.** Vertical space is cheaper than floor space, if you have racking and safe equipment.

Review the layout when the product range or volumes change. A layout that worked for 500 orders a day may fail at 2,000.

## Picking, packing and dispatch

**Picking** is usually the biggest labour cost in a warehouse. Common methods:

| Method | How it works | Best for |
| :-- | :-- | :-- |
| **Discrete (single-order)** | One picker collects one order at a time | Low volume, large orders |
| **Batch picking** | One picker collects items for several orders at once, then sorts | Many small orders with common items |
| **Zone picking** | Each picker covers one zone; orders pass between zones | Large warehouses |
| **Wave picking** | Orders released in timed groups to match dispatch times | Fixed courier cut-off times |

Productivity measure: **lines picked per labour hour.** If four pickers pick 480 order lines in 8 hours, that is 480 ÷ (4 × 8) = **15 lines per picker-hour.** Track it, find the reasons for low days and test improvements.

**Packing** should check the order against the picklist, protect the goods and keep packaging cost and weight sensible. **Dispatch** groups orders by route or carrier, checks documents, loads vehicles safely and records departure so you can answer "where is my order?".

Accuracy matters more than speed alone: a wrong or damaged order costs far more than the seconds saved.

## Distribution network design

A **distribution network** is the set of warehouses and routes that deliver goods. The central question: how many warehouses, and where? Compare **total cost** (not any single part):

- **Transport cost** falls as warehouses move closer to customers.
- **Warehousing cost** rises with the number of sites.
- **Inventory cost** rises, because each site needs its own safety stock.
- **Service level** (delivery time) improves with proximity.

Example for one year:

| | One central warehouse | Two regional warehouses |
| :-- | :-- | :-- |
| Transport | ₦8,000,000 | ₦5,000,000 |
| Warehousing | ₦5,000,000 | ₦9,000,000 |
| Extra inventory cost | — | ₦1,000,000 |
| **Total** | **₦13,000,000** | **₦15,000,000** |

The central warehouse is ₦2,000,000 cheaper. The two-warehouse design is faster, so it is justified only if the faster service wins or keeps enough sales. Total cost, service and risk together decide.

Other design choices include a **hub-and-spoke** model (goods consolidated at a hub, then sent out) and whether to run your own fleet or use carriers.

## Cross-docking and fulfilment

- **Cross-docking:** inbound goods are unloaded and moved almost directly to outbound vehicles, with little or no storage. It cuts storage and handling and speeds up flow, but needs accurate timing and information.
- **Fulfilment** is picking, packing and shipping orders to customers. **E-commerce fulfilment** means many small orders, fast delivery promises, returns and tight cut-off times. Businesses either run it themselves or use a **third-party logistics provider (3PL)** who stores and ships on their behalf.
- **Returns handling** (reverse logistics) needs its own process: receive, inspect and decide to restock, repair, sell cheaper or dispose.

## Try it

```task
{
  "id": "scm-m06-t1",
  "prompt": "Compare two network designs. **One warehouse:** transport ₦8,000,000, warehousing ₦5,000,000. **Two warehouses:** transport ₦5,000,000, warehousing ₦9,000,000, extra inventory ₦1,000,000. Work out the **total cost** of each, say which is cheaper and when the other could still be the better choice.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "One warehouse = ...",
  "rules": [
    { "label": "One-warehouse total of ₦13,000,000", "pattern": "13,?000,?000" },
    { "label": "Two-warehouse total of ₦15,000,000", "pattern": "15,?000,?000" },
    { "label": "Says one warehouse is cheaper by ₦2,000,000", "pattern": "2,?000,?000|cheaper" },
    { "label": "Says when two could be better (faster service, sales, customers)", "pattern": "service|faster|speed|sales|customers|delivery|response|win" }
  ],
  "sample": "One warehouse = 8,000,000 + 5,000,000 = ₦13,000,000.\nTwo warehouses = 5,000,000 + 9,000,000 + 1,000,000 = ₦15,000,000.\nOne warehouse is cheaper by ₦2,000,000. Two warehouses could still be better if the faster delivery to customers wins or keeps enough extra sales to cover the higher cost.",
  "required": true
}
```

```task
{
  "id": "scm-m06-t2",
  "prompt": "Four pickers pick **480 order lines** in an **8-hour** shift. Calculate **lines per picker-hour**. Then give **three ways** to improve picking productivity without hurting accuracy. One per line after the calculation.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Lines per picker-hour = ...",
  "rules": [
    { "label": "15 lines per picker-hour", "pattern": "\\b15\\b" },
    { "label": "At least four lines", "minLines": 4 },
    { "label": "Suggests slotting fast movers near dispatch", "pattern": "slot|fast-?mov|near dispatch|abc|closer" },
    { "label": "Suggests a picking method (batch, zone, wave)", "pattern": "batch|zone|wave" },
    { "label": "Suggests layout, labelling, training or technology", "pattern": "layout|label|train|scanner|barcode|signage|route|path" }
  ],
  "sample": "Lines per picker-hour = 480 / (4 x 8) = 15.\nSlot the fastest-moving items near the dispatch area at easy-to-reach heights.\nUse batch or zone picking so pickers travel less.\nLabel every location clearly and use barcode scanners to cut search time and errors.",
  "required": true
}
```

```task
{
  "id": "scm-m06-t3",
  "prompt": "An online shop with 300 orders a day is struggling with late deliveries and returns. In 50 to 100 words, say whether it should use a **3PL** or run fulfilment itself, with two reasons.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "I recommend ...",
  "rules": [
    { "label": "Makes a recommendation (3PL or in-house)", "pattern": "3pl|third-?party|in-?house|ourselves|outsourc" },
    { "label": "Gives reasons (cost, skills, scale, control, capital, focus)", "pattern": "cost|skills?|scale|control|capital|focus|expertise|flexib" },
    { "label": "Mentions returns or delivery performance", "pattern": "return|deliver|cut-?off|speed|late" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "I recommend trying a 3PL, for two reasons. First, a 3PL already has the warehouse space, systems and courier contracts, so the shop avoids heavy capital spending and can scale up on busy days. Second, it can bring expertise in cut-off times and returns handling, which are the current problems. The trade-off is less direct control and a per-order fee, so the shop should agree service levels in writing and review performance monthly before committing long term.",
  "required": false
}
```

Next lesson: transport and logistics planning.
