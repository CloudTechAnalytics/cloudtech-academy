---
title: Logistics Fundamentals
minutes: 20
summary: Understand what logistics covers, who is involved in moving a shipment, how trade terms divide the work, and how cost and service level pull against each other.
---

## What logistics covers

**Logistics** is planning and managing the movement and storage of goods, and the information that goes with them, from where they are made to where they are needed. When a customer in Kano receives a carton of goods ordered from a supplier in Guangzhou, logistics is everything in between: packing, transport, documents, customs, storage and delivery.

Logistics is wider than transport. It includes:

- **Transport:** moving goods by road, rail, sea or air.
- **Warehousing and storage:** holding goods safely until needed.
- **Inventory management:** having the right amount in the right place.
- **Packaging and handling:** protecting goods and making them easy to move.
- **Documentation and customs:** the paperwork that lets goods cross borders legally.
- **Information and tracking:** knowing where goods are and when they will arrive.
- **Last-mile delivery:** the final trip to the customer.

Good logistics is invisible: goods arrive on time, undamaged, at a fair cost. Bad logistics is expensive and noisy: late deliveries, lost cargo, disputes and unhappy customers.

## The players in a shipment

| Player | Role |
| :-- | :-- |
| **Shipper (exporter / consignor)** | The party sending the goods |
| **Consignee (importer / receiver)** | The party receiving them |
| **Freight forwarder** | Organises the movement on behalf of the shipper or consignee |
| **Carrier** | The shipping line, airline, trucking or rail company that moves the cargo |
| **Customs broker / clearing agent** | Handles customs declarations and clearance |
| **Port, terminal and airport operators** | Handle goods at the transfer points |
| **Warehouse and haulage operators** | Store goods and move them over land |
| **Insurers and banks** | Cover risk and move the money |
| **Customs and regulators** | Control what crosses the border and collect duty |

One company can play several roles. A large forwarder may also run warehouses and clear goods. A good logistics professional knows which role each party has, because that decides who is responsible when something goes wrong.

## Logistics and trade terms

**Incoterms** are standard trade terms that say who arranges and pays for each stage and who carries the risk. They split a journey between seller and buyer:

- **EXW:** the buyer takes the goods at the seller's door and does everything from there.
- **FOB:** the seller delivers the goods on board the ship at the port of loading. After that the buyer pays and carries the risk. (Sea freight.)
- **CIF:** the seller pays freight and insurance to the destination port, but risk passes when the goods are on board. (Sea freight.)
- **DAP:** the seller delivers to the named place; the buyer clears import.
- **DDP:** the seller delivers with import duty and taxes paid.

A forwarder must read the term on the sales contract to know **what they must arrange**. If a customer buys FOB, the forwarder's job starts at the origin port and includes the ocean freight and destination handling. If the customer sells DAP, the forwarder may need to deliver to the customer's door with import clearance still to be done.

## Costs and service levels

Every logistics decision trades **cost** against **service**:

- **Faster** (air instead of sea) costs more.
- **More stock close to customers** gives quicker delivery but ties up money and space.
- **More tracking and handling** improves visibility and costs more.
- **Cheaper, slower** options save money but risk delays and stockouts.

**Service levels** are what you promise: delivery within 48 hours, 98% of orders complete, damage below 0.5%. Set them according to what the customer needs and will pay for, and measure them. A customer who needs medicines the same day will pay for air. A customer shipping furniture will accept six weeks by sea.

Logistics cost is often measured as a share of sales. If a business spends ₦4,500,000 on logistics and sells ₦60,000,000 of goods, logistics is 4,500,000 ÷ 60,000,000 = **7.5%** of sales. Tracking this share, and the parts of it, shows where savings are possible.

## Try it

```task
{
  "id": "lff-m01-t1",
  "prompt": "A shop in Kano buys 200 cartons of goods from a supplier in Guangzhou and sells them across northern Nigeria. Write **one line for each of six parties** involved (shipper, consignee, forwarder, carrier, clearing agent, customs), saying what each does for this shipment.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Shipper: ...\nConsignee: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Names the shipper and what they do", "pattern": "shipper|exporter|supplier" },
    { "label": "Names the consignee", "pattern": "consignee|importer|shop|receiver" },
    { "label": "Names the forwarder", "pattern": "forwarder" },
    { "label": "Names the carrier", "pattern": "carrier|shipping line|airline|truck" },
    { "label": "Names the clearing agent", "pattern": "clearing|broker" },
    { "label": "Names customs and its role", "pattern": "customs[^\\n]*(duty|tax|check|release|inspect|declar)" }
  ],
  "sample": "Shipper: the supplier in Guangzhou who packs the goods and sends the invoice and packing list.\nConsignee: the shop in Kano that receives and pays for the goods.\nFreight forwarder: books space, arranges the transport and prepares the shipping documents.\nCarrier: the shipping line that carries the container from China to Lagos.\nClearing agent: handles the customs declaration and gets the goods released at the port.\nCustoms: checks the declaration, collects duty and taxes and releases the goods.",
  "required": true
}
```

```task
{
  "id": "lff-m01-t2",
  "prompt": "A customer buys goods on **FOB Shenzhen** terms and asks you, a forwarder, to handle the shipment to Lagos. In 40 to 90 words, say what your job covers and what the seller has already done.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Under FOB the seller ...",
  "rules": [
    { "label": "Says the seller loads the goods on board at the port of origin", "pattern": "seller[^.]*(on board|load|deliver|export clear)" },
    { "label": "Says the buyer or forwarder takes over from there", "pattern": "buyer|forwarder|we|i (book|arrange|handle)|from there|after that" },
    { "label": "Mentions freight, destination handling or clearing", "pattern": "freight|destination|clear|handling|insur" },
    { "label": "Mentions risk or cost passing", "pattern": "risk|cost|pay" },
    { "label": "Between 40 and 90 words", "minWords": 40, "maxWords": 95 }
  ],
  "sample": "Under FOB Shenzhen the seller delivers the goods on board the ship at Shenzhen and clears them for export. From that point the cost and risk are the buyer's, so my job as forwarder covers booking the ocean freight to Lagos, arranging cargo insurance, handling the documents and destination charges, and arranging customs clearance and delivery to the customer. I must make sure the seller's documents match the order before the ship sails.",
  "required": true
}
```

```task
{
  "id": "lff-m01-t3",
  "prompt": "A trader spent **₦4,500,000** on logistics last year and sold **₦60,000,000** of goods. Work out logistics cost as a percentage of sales. Then say in one or two sentences what this figure helps the trader to do.",
  "minutes": 6,
  "rows": 5,
  "placeholder": "Logistics cost % = ...",
  "rules": [
    { "label": "Result of 7.5%", "pattern": "7\\.5\\s?%|7\\.5 percent" },
    { "label": "Shows the division", "pattern": "4,?500,?000\\s*[/÷]\\s*60,?000,?000" },
    { "label": "Says it helps track, compare or find savings", "pattern": "track|compare|saving|reduce|improve|monitor|target|benchmark" }
  ],
  "sample": "Logistics cost % = 4,500,000 / 60,000,000 = 7.5% of sales.\nThis figure helps the trader to track logistics cost over time, compare it with other businesses and see where savings are possible.",
  "required": false
}
```

Next lesson: the modes of transport and when to use each.
