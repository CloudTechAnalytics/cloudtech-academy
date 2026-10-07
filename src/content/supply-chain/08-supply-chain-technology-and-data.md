---
title: Supply Chain Technology and Data
minutes: 25
summary: Understand ERP and planning tools, tracking and visibility, how to use spreadsheets for supply chain analysis and why data quality decides whether any of it works.
---

## Tools that run a supply chain

Technology connects the stages of the chain so decisions use the same, current numbers. You do not need every tool, and many small businesses run well on spreadsheets. As the business grows, systems take over repetitive work and give faster, more accurate information.

| Tool | What it does |
| :-- | :-- |
| **ERP (enterprise resource planning)** | One system for orders, inventory, purchasing, production, finance and reporting, so departments share one set of data |
| **Demand planning / forecasting software** | Statistical forecasts, S&OP support |
| **Warehouse management system (WMS)** | Receiving, locations, picking and dispatch |
| **Transport management system (TMS)** | Quoting, booking, routing, tracking and freight costs |
| **Barcode and RFID scanning** | Fast, accurate capture of stock movements |
| **Supplier and customer portals** | Share orders, forecasts and status online |
| **Business intelligence (BI) dashboards** | Charts and KPIs from the data |

When choosing a tool, start with the **process and the problem**, not the product. Fix a broken process before automating it, or you will only make mistakes faster. Plan training, migration of data, and who owns the system.

## Tracking and visibility

**Visibility** means seeing where goods are and what will happen next. It supports earlier action:

- **Order status:** confirmed, in production, shipped.
- **Shipments:** location, expected arrival, delays, customs status (using tracking numbers, GPS or carrier portals).
- **Inventory:** real-time stock by location.
- **Supplier performance:** lead times and delivery status.

Visibility pays only if someone **acts** on the alerts: a late supplier shipment should trigger a plan (expedite, re-allocate stock, tell the customer) rather than a surprise on the day. Share the right information with customers and partners as well, so that they can plan.

## Using spreadsheets for supply chain analysis

A spreadsheet is the planner's everyday tool. A few skills go a long way:

- **Clean, consistent data:** one row per record, one column per field, no merged cells.
- **SUM, AVERAGE, MIN and MAX** for quick summaries.
- **SUMIF / SUMIFS and COUNTIF** to total by product, customer or month, for example `=SUMIF(A:A,"Cement",B:B)` totals column B where column A says Cement.
- **XLOOKUP or VLOOKUP** to pull prices, lead times or supplier names from a master table.
- **Pivot tables** to summarise orders by supplier, product or month in seconds.
- **IF and simple formulas** such as days of stock = stock on hand ÷ average daily sales, `=B2/C2`.
- **Charts** to show trends and compare suppliers.
- **Conditional formatting** to highlight stockouts, late orders and unusual numbers.

Keep inputs separate from calculations, label assumptions, protect formulas and save versions. A spreadsheet with hidden errors is worse than none.

## Data quality

Every analysis and every system is only as good as its data. Common problems:

- **Duplicates:** the same supplier or item with different spellings or codes.
- **Missing or wrong values:** a unit of measure missing, a lead time that is blank, weights in kilograms for some items and pounds for others.
- **Out-of-date master data:** old prices, closed suppliers, wrong addresses.
- **Inconsistent units and dates.**
- **Manual entry mistakes** and delays in recording transactions.

Good habits:

- Give each item and supplier **one unique code** and a clear naming rule.
- Define each field: what it means, unit, who is responsible.
- **Validate on entry** with drop-down lists and required fields.
- **Check regularly** for duplicates and outliers, and correct at the source.
- **Record transactions at once,** at the point of work.
- **Back up** data and control access.

A rule worth repeating: **garbage in, garbage out.**

## Try it

```task
{
  "id": "scm-m08-t1",
  "prompt": "Write the spreadsheet formulas for these tasks. (a) Total the quantities in column B where column A equals \"Cement\". (b) Days of stock for an item, where B2 is stock on hand and C2 is average daily sales. (c) Look up a product's lead time from a table. One formula per line, with a few words of explanation.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "(a) =SUMIF(...)",
  "rules": [
    { "label": "Three lines", "minLines": 3 },
    { "label": "Uses SUMIF for the total", "pattern": "sumif" },
    { "label": "Divides stock by daily sales", "pattern": "b2\\s*/\\s*c2|b2\\/c2" },
    { "label": "Uses XLOOKUP or VLOOKUP", "pattern": "xlookup|vlookup|index\\s*\\(" }
  ],
  "sample": "(a) =SUMIF(A:A,\"Cement\",B:B) adds up column B only where column A says Cement.\n(b) =B2/C2 gives the days of stock left.\n(c) =XLOOKUP(E2,Products!A:A,Products!D:D) pulls the lead time for the product code in E2 from the Products table.",
  "required": true
}
```

```task
{
  "id": "scm-m08-t2",
  "prompt": "A stock list has these problems: the same supplier appears as \"Ade Foods\", \"ADE FOODS Ltd\" and \"Adefoods\"; some weights are in kg and others in lb; the lead time is blank for 12 items. List **three data quality problems** and **a fix for each**. One per line.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Problem: ... - Fix: ...",
  "rules": [
    { "label": "Three lines", "minLines": 3 },
    { "label": "Spots duplicate supplier names", "pattern": "duplicate|spell|different names|same supplier|inconsistent name" },
    { "label": "Spots unit inconsistency", "pattern": "unit|kg|lb|inconsistent" },
    { "label": "Spots missing lead times", "pattern": "missing|blank|lead time|empty" },
    { "label": "Gives fixes (unique code, standard unit, required field, validation)", "pattern": "unique code|standard|one unit|required|validat|drop-?down|fill|rule" }
  ],
  "sample": "Problem: the same supplier is entered under three different names - Fix: give every supplier one unique code and a naming rule, and merge the duplicates.\nProblem: weights are in kg and lb - Fix: choose one standard unit and convert the rest.\nProblem: 12 items have no lead time - Fix: make lead time a required field and fill the gaps with the supplier.",
  "required": true
}
```

```task
{
  "id": "scm-m08-t3",
  "prompt": "A shipment tracker shows your supplier's container will arrive **six days late**. In 50 to 100 words, say what you would do **with that information** over the next two days so that it helps.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "I would ...",
  "rules": [
    { "label": "Checks stock cover and the impact", "pattern": "stock|cover|impact|run out|affect|production" },
    { "label": "Takes an action (expedite, re-allocate, alternative supply, air freight)", "pattern": "expedite|re-?allocate|alternative|backup|air|prioriti|other supplier|split" },
    { "label": "Informs customers or colleagues", "pattern": "inform|tell|notify|update|communicat|customers|sales|planner" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "I would first check how many days of stock we have against the new arrival date, to see which orders and production runs are at risk. Then I would take action: ask the supplier to expedite or split the shipment, check whether part can come by air, re-allocate the available stock to the most important customers and ask another supplier about a small emergency order. I would also tell sales and the affected customers about the new date straight away, and update the plan so everyone works from the same information.",
  "required": false
}
```

Next lesson: risk, resilience and sustainability.
