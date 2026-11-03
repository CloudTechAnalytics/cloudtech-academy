---
title: Final Project - A Complete Shipment Plan
minutes: 45
summary: Bring the course together by planning one shipment end to end: choose the shipment, plan the mode, route and documents, cost and quote it, and present your plan.
---

## What you are building

You have learned how cargo moves, who does what, how to document, clear, price and handle it, and how to run the business. Now you plan **one real or realistic shipment from start to finish** and present it as a forwarder would to a customer and a manager.

Choose a shipment you understand: a small trader importing 200 cartons of goods from China by sea, a 500 kg air shipment of fashion items from Lagos to London, an agricultural export, or the movement of machinery to a site. Use real rates where you can find them (from carriers, forwarders or published rate sheets), and state clearly where you assume a number.

## Your plan has six parts

1. **The shipment.** Goods, quantity, weight and volume, origin and destination, trade terms and the customer's needs (deadline, budget, service).
2. **Mode, route and timing.** The mode or modes you chose, the route, the carriers or options considered, and the transit time with your allowance for delays.
3. **Documents and compliance.** The documents needed, who prepares each, the certificates and permits, the HS code and any regulatory approvals.
4. **Packing, loading and handling.** How the cargo will be packed, marked and loaded, and any special handling or dangerous goods.
5. **Cost and quotation.** Every charge in a quotation, your margin and what is excluded, plus the estimated duty and taxes for the customer.
6. **Risks and communication.** Your three biggest risks with responses, the insurance you recommend and how you will keep the customer informed.

## Writing it up

Write for the customer first, and your manager second. Lead with the recommendation (mode, route, price and date), then show the supporting detail. Use tables for costs and documents. State assumptions and exclusions clearly.

> [!TIP]
> Put yourself in the customer's shoes: would you be able to approve this plan without calling to ask questions? If not, add what is missing.

## Try it

```task
{
  "id": "lff-m12-t1",
  "prompt": "Describe **the shipment and your mode and route choice** in 60 to 140 words: the goods, quantity, weight or volume, origin, destination, trade terms, the mode you chose and why, the route and the transit time including a delay allowance.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "The shipment is ...",
  "rules": [
    { "label": "Says what the goods are and the quantity", "pattern": "cartons?|pallets?|units?|tonnes?|kg|goods|machinery|boxes|container" },
    { "label": "States origin and destination", "pattern": "from[\\s\\S]*to|origin[\\s\\S]*destination" },
    { "label": "States the mode (sea, air, road)", "pattern": "sea|air|road|rail|lcl|fcl" },
    { "label": "States trade terms", "pattern": "\\b(fob|exw|cif|dap|ddp)\\b" },
    { "label": "Gives a reason for the mode", "pattern": "because|since|cheaper|faster|urgent|heavy|bulky" },
    { "label": "Gives transit time", "pattern": "days?|weeks?" },
    { "label": "Between 60 and 140 words", "minWords": 60, "maxWords": 145 }
  ],
  "sample": "The shipment is 200 cartons of phone accessories, about 24 CBM and 3.2 tonnes, from Shenzhen, China to Lagos, Nigeria, on FOB Shenzhen terms for a Lagos importer. I chose sea freight in a 20-foot container, because the goods are not urgent and sea is far cheaper than air for this volume and weight. The route is Shenzhen to Lagos (Apapa or Tin Can) by a shipping line with a transhipment, with an estimated transit of about 35 days. I would allow a further 10 days for port congestion and customs, so the customer should plan on about 45 days from loading to delivery.",
  "required": true
}
```

```task
{
  "id": "lff-m12-t2",
  "prompt": "List the **documents and compliance items** for your shipment, at least eight, one per line, saying who prepares each.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "Commercial invoice - prepared by the supplier",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Includes commercial invoice and packing list", "pattern": "invoice[\\s\\S]*packing|packing[\\s\\S]*invoice" },
    { "label": "Includes bill of lading or air waybill", "pattern": "bill of lading|air ?waybill|b/l|awb" },
    { "label": "Includes the customs declaration (Form M, PAAR)", "pattern": "form m|paar|declaration" },
    { "label": "Includes insurance", "pattern": "insurance" },
    { "label": "Says who prepares them", "pattern": "supplier|forwarder|agent|importer|shipping line|insurer|customs" },
    { "label": "Includes the HS code or a certificate or approval", "pattern": "hs code|certificate|approval|son|nafdac|origin|permit" }
  ],
  "sample": "Commercial invoice - prepared by the supplier\nPacking list - prepared by the supplier\nBill of lading - issued by the shipping line or forwarder\nCertificate of origin - issued by the chamber of commerce at origin\nHS code classification - confirmed by the clearing agent\nSON conformity certificate if required - importer and agent\nForm M and PAAR - raised by the importer through the bank and agent\nInsurance certificate - issued by the insurer arranged by the forwarder\nDelivery order - issued by the shipping line on payment of charges",
  "required": true
}
```

```task
{
  "id": "lff-m12-t3",
  "prompt": "Write your **quotation**, one line per charge: freight, origin handling, documentation, destination handling, customs clearance, local delivery, insurance, subtotal, your margin and the total, with an estimate of duty and VAT as a separate excluded item. At least ten lines.",
  "minutes": 12,
  "rows": 14,
  "placeholder": "Sea freight: $...",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Includes freight", "pattern": "freight" },
    { "label": "Includes handling and documentation", "pattern": "handling[\\s\\S]*documentation|documentation[\\s\\S]*handling" },
    { "label": "Includes customs clearance and delivery", "pattern": "clearance[\\s\\S]*deliver|deliver[\\s\\S]*clearance" },
    { "label": "Includes insurance", "pattern": "insurance" },
    { "label": "Includes subtotal, margin and total", "pattern": "subtotal[\\s\\S]*margin[\\s\\S]*total" },
    { "label": "Says duty and VAT are excluded or estimated separately", "pattern": "duty[\\s\\S]*(exclud|separate|estimate|not included)|(exclud|separate|estimate|not included)[\\s\\S]*duty" }
  ],
  "sample": "Sea freight 20-foot container Shenzhen to Lagos: $2,800\nOrigin handling and export documentation: $250\nDocumentation fee: $60\nDestination handling: $420\nCustoms clearance agent fee: $300\nLocal delivery to the customer's warehouse: $350\nInsurance at 110% of the CIF value: $90\nSubtotal: $4,270\nMargin at 12% of cost: $512.40\nTotal quotation: $4,782.40\nExcluded: import duty and VAT, estimated separately at about ₦3.2 million, and storage or demurrage beyond free days",
  "required": true
}
```

```task
{
  "id": "lff-m12-t4",
  "prompt": "Write your **top three risks** for this shipment, each with a response, and one line on how you will keep the customer informed. At least four lines.",
  "minutes": 9,
  "rows": 7,
  "placeholder": "Risk: ... - Response: ...",
  "rules": [
    { "label": "At least four lines", "minLines": 4 },
    { "label": "Lists risks with responses", "pattern": "risk[\\s\\S]*(response|fix|mitigat|action)" },
    { "label": "Mentions realistic risks (delay, damage, customs, theft, documents, currency)", "pattern": "delay|damage|customs|theft|document|currency|exchange|demurrage" },
    { "label": "Says how the customer is kept informed", "pattern": "update|inform|track|message|whatsapp|email|milestone" }
  ],
  "sample": "Risk: vessel delay or port congestion - Response: allow 10 extra days in the plan and track the vessel weekly.\nRisk: a document error holds the container at customs - Response: check every document against the others before the vessel sails and prepare clearance early.\nRisk: damage or loss of cargo in transit - Response: pack to sea standard and insure for 110% of the CIF value.\nCommunication: I will message the customer on WhatsApp at every milestone and straight away if anything changes.",
  "required": true
}
```

When you are done, submit your complete plan as your final project.
