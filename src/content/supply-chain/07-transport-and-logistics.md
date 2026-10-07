---
title: Transport and Logistics
minutes: 25
summary: Choose transport modes for a supply chain, plan routes and loads, measure transport cost and service, and manage carriers.
---

## Transport in the supply chain

Transport is usually the largest single logistics cost, and it shapes both **cost** and **service**: how fast, how reliably and in what condition goods reach the customer. The Logistics & Freight Forwarding course covers shipping documents and forwarding in detail; here the focus is how a supply chain planner **decides and controls** transport.

## Choosing transport modes

Choose by comparing **cost, speed, reliability, capacity and risk** for the cargo:

| Factor | Questions to ask |
| :-- | :-- |
| **Value and urgency** | Is the product costly or urgent enough to justify faster transport? |
| **Volume and weight** | Does it fill a truck or container, or travel in small lots? |
| **Distance and route** | Is the road, rail, port or airport available and reliable? |
| **Product type** | Fragile, perishable, hazardous or oversize? |
| **Customer promise** | What delivery time did you promise? |

A useful comparison is the **total cost including inventory**. Faster transport costs more per trip but reduces the stock in transit and the safety stock you need. For a high-value product the saving in stock and the benefit of speed can outweigh the freight premium. For cheap bulk goods, slow and cheap wins.

## Route and load planning

Two ideas save money in transport: **fill the vehicle** and **shorten the route.**

**Load utilisation** = weight (or volume) carried ÷ vehicle capacity. A 10-tonne truck carrying 7.5 tonnes is **75%** utilised. Empty space is paid for anyway, so higher utilisation lowers cost per tonne.

**Consolidation** combines small loads into fuller vehicles. **Milk runs** collect from or deliver to several points on one trip. Example: three separate trips would cost 3 × ₦120,000 = ₦360,000, while one planned route covering all three stops costs ₦210,000, a saving of **₦150,000 (41.7%)**.

Route planning tips:

- **Group deliveries by area** and sequence stops so the vehicle does not backtrack.
- **Allow for traffic, loading time and delivery windows,** not just distance.
- **Avoid empty return trips** by arranging back-loads.
- **Use simple tools:** maps, spreadsheets, and route-planning apps as volume grows.
- **Keep drivers informed** and ask them for feedback, since they know the roads.

## Transport cost and service

Measure transport so you can manage it:

- **Cost per trip, per tonne and per tonne-kilometre.** A trip of 500 km carrying 8 tonnes costs ₦400,000. Cost per tonne = 400,000 ÷ 8 = **₦50,000**. Cost per tonne-km = 400,000 ÷ (8 × 500) = **₦100**.
- **Load utilisation** and **empty running** (distance travelled without cargo).
- **On-time delivery** and **delivery in full.**
- **Damage and claims rate.**
- **Fuel use per 100 km** and maintenance cost.
- **Cost as a share of sales** for each customer or route.

Balance cost and service. The cheapest transport that misses delivery promises costs you customers; the fastest transport on every order wastes money. Decide the **service level per customer or product** and plan to it.

## Working with carriers

Whether you run your own fleet or hire carriers, manage them as partners:

- **Select** carriers on cost, reliability, safety record, insurance, capacity, coverage and communication.
- **Contract clearly:** rates, service levels, liability, insurance, claims, payment terms and penalties.
- **Share forecasts** so they can plan capacity.
- **Track performance** on a carrier scorecard: on-time %, damage rate, cost per tonne-km, responsiveness.
- **Use more than one carrier** on important routes, to protect against failure and keep prices competitive.
- **Review regularly** and give feedback.

Example: you must move 20 tonnes over 500 km (10,000 tonne-km). **Carrier A** charges ₦95 per tonne-km with 90% on-time delivery. **Carrier B** charges ₦85 with 78% on time. A costs ₦950,000 and B costs ₦850,000. B is ₦100,000 cheaper but late 22% of the time; if late deliveries cost you more than that in lost sales, penalties or extra handling, A is the better choice.

## Try it

```task
{
  "id": "scm-m07-t1",
  "prompt": "A trip of **500 km** carries **8 tonnes** and costs **₦400,000**. A 10-tonne truck usually carries 7.5 tonnes. Calculate the **cost per tonne**, the **cost per tonne-km** and the **load utilisation** of the usual load.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Cost per tonne = ...",
  "rules": [
    { "label": "Cost per tonne of ₦50,000", "pattern": "50,?000" },
    { "label": "Cost per tonne-km of ₦100", "pattern": "₦?\\s?100\\b" },
    { "label": "Load utilisation of 75%", "pattern": "\\b75\\s?%|75 percent" }
  ],
  "sample": "Cost per tonne = 400,000 / 8 = ₦50,000.\nCost per tonne-km = 400,000 / (8 x 500) = ₦100.\nLoad utilisation = 7.5 / 10 = 75%.",
  "required": true
}
```

```task
{
  "id": "scm-m07-t2",
  "prompt": "Compare carriers for **20 tonnes over 500 km** (10,000 tonne-km). **A:** ₦95 per tonne-km, 90% on time. **B:** ₦85 per tonne-km, 78% on time. Work out each cost, the difference, and say which you would choose for **urgent medical supplies** and which for **bulk cement**, with reasons.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "A = ...",
  "rules": [
    { "label": "A costs ₦950,000", "pattern": "950,?000" },
    { "label": "B costs ₦850,000", "pattern": "850,?000" },
    { "label": "Difference of ₦100,000", "pattern": "100,?000" },
    { "label": "Chooses A for urgent medical supplies", "pattern": "a[^.]*(medical|urgent)|(medical|urgent)[^.]*\\ba\\b" },
    { "label": "Gives a reason (reliability, on-time, cost, lateness)", "pattern": "reliab|on-?time|late|cheaper|cost|deadline" }
  ],
  "sample": "A = 10,000 x 95 = ₦950,000. B = 10,000 x 85 = ₦850,000. B is ₦100,000 cheaper.\nFor urgent medical supplies I would choose A, because 90% on-time reliability matters far more than the ₦100,000 saving.\nFor bulk cement I would choose B, because the cargo is not urgent, a late delivery costs little and the lower cost adds up over many trips.",
  "required": true
}
```

```task
{
  "id": "scm-m07-t3",
  "prompt": "Three separate trips cost **₦120,000** each. One planned route that serves all three stops costs **₦210,000**. Work out the **saving** and the **percentage saving**, and give two things to check before switching to the combined route.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Separate trips = ...",
  "rules": [
    { "label": "Separate trips total ₦360,000", "pattern": "360,?000" },
    { "label": "Saving of ₦150,000", "pattern": "150,?000" },
    { "label": "Percentage of about 41.7%", "pattern": "41\\.7|41\\.67|42 ?%" },
    { "label": "Names a check (delivery windows, vehicle capacity, time, customer agreement)", "pattern": "window|capacity|time|agree|load|customers?|schedule|driver" }
  ],
  "sample": "Separate trips = 3 x 120,000 = ₦360,000.\nSaving = 360,000 - 210,000 = ₦150,000, which is 150,000 / 360,000 = 41.7%.\nBefore switching I would check that the delivery windows for all three customers can be met and that the combined load fits within the vehicle's capacity.",
  "required": false
}
```

Next lesson: supply chain technology and data.
