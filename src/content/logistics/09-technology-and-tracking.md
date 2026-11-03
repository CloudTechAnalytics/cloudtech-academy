---
title: Technology and Tracking
minutes: 20
summary: Track shipments, use logistics software and spreadsheets, turn data into better decisions and keep customers informed.
---

## Why visibility matters

Customers want to know where their goods are. Forwarders also need to know, to catch delays early and act. **Visibility** means being able to see a shipment's status and location at any time. It reduces anxiety, phone calls and surprises, and it lets you move from reacting to problems to preventing them.

## Tracking shipments

Each mode gives you a reference to track:

| Mode | Reference | What you can see |
| :-- | :-- | :-- |
| **Sea** | Booking number, bill of lading number, container number | Vessel, port calls, estimated arrival, discharge, gate-out |
| **Air** | Air waybill number, flight number | Flight status, arrival, availability for collection |
| **Courier** | Tracking number | Pickup, in transit, out for delivery, delivered |
| **Road** | Truck registration, trip reference, GPS tracker | Location, stops, delivery status |

Shipping lines, airlines and couriers provide tracking on their websites or apps. Forwarders may add **milestone updates**: cargo received at origin, loaded on vessel, vessel departed, arrived, customs cleared, out for delivery, delivered.

Good tracking practice:

- **Share the reference** with the customer at booking.
- **Check at set points,** not only when asked.
- **Compare actual with planned dates** and act on slippage.
- **Record each milestone** with date and time, as evidence if there is a dispute.
- **Know what each status means.** "Vessel arrived" does not mean "ready to collect".

## Logistics software and spreadsheets

You do not need expensive software to start. A well-organised spreadsheet with clear columns, consistent entries and a person responsible will beat a poorly used system.

A simple **shipment tracker** has one row per shipment and columns such as: shipment reference, customer, origin, destination, mode, supplier, goods, quantity, weight or CBM, booking date, departure date, estimated arrival, actual arrival, customs status, delivery date, status, cost, price and notes.

As volumes grow, software helps with:

- **Transport management systems (TMS):** quoting, booking, tracking and invoicing.
- **Warehouse management systems (WMS):** stock and order flow.
- **Customer portals** where customers see their own shipments.
- **Document management** and electronic documents.
- **Accounting integration** to link jobs to invoices and costs.

Choose tools that fit your size and process, and make sure staff are trained and data is backed up and access-controlled.

## Data for better decisions

Data turns experience into improvement. Track a few measures regularly:

- **On-time delivery rate:** shipments delivered by the promised date ÷ total shipments. If 34 of 40 shipments arrive on time, the rate is 34 ÷ 40 = **85%**.
- **Average transit time** by route and carrier.
- **Cost per kilogram, CBM or container** by route.
- **Damage and loss rate:** damaged or lost shipments ÷ total shipments.
- **Customs delay days** and their causes.
- **Quote-to-booking conversion:** bookings ÷ quotes sent.
- **Profit per shipment and per customer.**

Use these to compare carriers, find problem routes, improve quotes and focus on the most profitable customers. Review monthly. Data is only useful if someone looks at it and acts.

## Communicating with customers

Technology helps, but communication wins loyalty:

- **Confirm every booking** in writing with the key details and dates.
- **Send proactive updates** at milestones, and immediately when something changes.
- **Be honest about delays,** with the cause and a new date.
- **Use clear, simple language** and one named contact.
- **Respond quickly,** even if only to say you are checking.
- **Keep a written record** of important messages.

A short, early message about a delay keeps more customers than a perfect delivery that nobody was told about.

## Try it

```task
{
  "id": "lff-m09-t1",
  "prompt": "Of **40 shipments** last month, **34** arrived on time and **2** were damaged. Work out the **on-time rate** and the **damage rate**, and say which you would act on first and why.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "On-time rate = ...",
  "rules": [
    { "label": "On-time rate of 85%", "pattern": "\\b85\\s?%|85 percent" },
    { "label": "Damage rate of 5%", "pattern": "\\b5\\s?%|5 percent" },
    { "label": "Chooses one to act on with a reason", "pattern": "because|since|first|bigger|larger|more|priority|customer" }
  ],
  "sample": "On-time rate = 34 / 40 = 85%.\nDamage rate = 2 / 40 = 5%.\nI would act on the on-time rate first because 6 late shipments (15%) affect more customers than 2 damaged ones, though I would also look at the damage cause since each damaged shipment is costly.",
  "required": true
}
```

```task
{
  "id": "lff-m09-t2",
  "prompt": "Design a **shipment tracker spreadsheet**. List at least **ten column headings**, one per line, that you would include.",
  "minutes": 8,
  "rows": 12,
  "placeholder": "Shipment reference\nCustomer",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Includes a shipment reference", "pattern": "reference|ref|job|booking" },
    { "label": "Includes customer", "pattern": "customer|consignee" },
    { "label": "Includes origin and destination", "pattern": "origin[\\s\\S]*destination|destination[\\s\\S]*origin" },
    { "label": "Includes dates (departure, ETA, arrival, delivery)", "pattern": "eta|arrival|departure|date|delivery" },
    { "label": "Includes status", "pattern": "status" },
    { "label": "Includes cost or price", "pattern": "cost|price|charge|profit" }
  ],
  "sample": "Shipment reference\nCustomer\nOrigin\nDestination\nMode\nGoods description\nQuantity and weight or CBM\nBooking date\nDeparture date\nEstimated arrival date (ETA)\nActual arrival date\nCustoms status\nDelivery date\nStatus\nCost\nPrice\nNotes",
  "required": true
}
```

```task
{
  "id": "lff-m09-t3",
  "prompt": "Write a **customer update message** (50 to 100 words) telling a customer that their sea shipment will arrive **five days later** than planned because the vessel was delayed at the previous port. Give the new date, the cause, what you are doing and offer a contact.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Dear ...,",
  "rules": [
    { "label": "Greets the customer", "pattern": "dear|hello|hi |good (morning|afternoon)" },
    { "label": "States the delay of five days or a new date", "pattern": "five days|5 days|new (date|eta)|now expected|revised" },
    { "label": "Gives the cause", "pattern": "vessel|port|delayed|congestion|weather|because" },
    { "label": "Says what you are doing or will do", "pattern": "we are|i am|we will|i will|monitor|update|arrange|track" },
    { "label": "Offers a contact", "pattern": "contact|call|phone|reach|email|whatsapp" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "Dear Mrs Okafor, I am writing to let you know that your shipment on the vessel MV Ocean Star is now expected on 22 March, five days later than planned. The vessel was delayed at the previous port by congestion. We are tracking it daily and have asked our agent to prepare your customs clearance so that your goods can be released as soon as it arrives. I will update you the moment it docks. If you have any questions, please call or message me directly on 0803 000 0000.",
  "required": false
}
```

Next lesson: compliance, risk and problem solving.
