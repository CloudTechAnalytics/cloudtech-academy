---
title: Modes of Transport
minutes: 20
summary: Compare road, rail, sea and air transport, understand containers, bulk and roll-on roll-off shipping, and combine modes in multimodal and intermodal transport.
---

## Choosing a mode

Goods move by four main modes. Each has a different mix of **cost, speed, capacity, reliability and reach**. No mode is best for everything; good logistics matches the mode to the cargo.

| Mode | Strengths | Weaknesses | Typical use |
| :-- | :-- | :-- | :-- |
| **Road** | Door to door, flexible, widely available | Limited load per truck, traffic, road condition, security | Most domestic freight in Nigeria; first and last leg |
| **Rail** | Cheap for heavy loads over distance, safer from traffic | Limited network, fixed routes and timetables | Bulk and containers on connected corridors |
| **Sea** | Lowest cost per tonne, huge capacity | Slow, port delays, weather | Most international trade by volume |
| **Air** | Fastest, secure, global reach | Highest cost, size and weight limits | Urgent, high-value, light or perishable goods |
| **Inland waterways / pipeline** | Cheap for specific cargoes | Limited routes | Bulk liquids, some barge cargo |

## Road and rail

**Road** carries most of the goods moved inside Nigeria. Trucks range from small vans to articulated trailers carrying a 40-foot container. Plan for road condition, weather, security, checkpoints, loading and unloading time, and driver hours. A truck is only profitable when it is full in both directions, so empty return trips are a major cost.

**Rail** suits heavy, regular, long-distance cargo. It can be cheaper than road on routes it serves and removes trucks from congested roads. Its limit is reach: goods usually need road transport at each end, and capacity, schedules and access vary. Check the current services available on your route before building a plan around rail.

## Sea freight: containers, bulk and RoRo

Most international goods move by sea. The main forms:

- **Containerised cargo.** Goods are packed in standard steel containers, which are loaded on ships and moved by truck or train without unpacking. Common sizes are the **20-foot** (about 33 cubic metres inside) and **40-foot** (about 67 cubic metres), plus the taller **40-foot high cube** (about 76). Types include general-purpose (dry), refrigerated ("reefer"), open-top, flat-rack and tank containers.
- **Bulk cargo.** Loose cargo such as grain, coal or fertiliser carried in the hold of a bulk carrier, or liquid bulk in tankers.
- **Breakbulk.** Individual pieces or packages too large or awkward for containers, such as machinery, handled one by one.
- **RoRo (roll-on, roll-off).** Vehicles and wheeled cargo driven on and off the ship. Cars imported into Nigeria commonly arrive this way.

Two terms matter for loads that do not fill a container: **FCL** (full container load, one shipper per container) and **LCL** (less than container load, several shippers share a container, charged by cubic metre or weight).

## Air freight

Air freight is the fastest option and suits urgent, valuable, light or perishable goods: electronics, medical supplies, fresh produce, samples and documents. It is charged on the **greater of actual weight and volumetric weight**:

*Volumetric weight (kg) = length × width × height (cm) ÷ 6,000*

A carton 60 × 50 × 40 cm weighs 18 kg. Volumetric weight is 120,000 ÷ 6,000 = **20 kg**, so the chargeable weight is 20 kg. At $5.50 a kilogram, one carton costs $110; ten cartons cost $1,100 (chargeable 200 kg).

Air cargo also has limits on size, weight and dangerous goods, and it passes through airport cargo terminals with their own handling charges and processes.

## Multimodal and intermodal transport

Few shipments travel on one mode only.

- **Intermodal transport** uses more than one mode with the goods staying in the same container or unit, so they are not repacked between modes. A container might go by truck to the port, by ship overseas, then by rail and truck to the customer.
- **Multimodal transport** is intermodal movement under **one contract and one document**, with one party responsible for the whole journey.

Benefits: the best mode for each leg, less handling and damage, and one point of contact. Challenges: more transfer points, where delays happen, and the need for strong coordination and clear responsibility.

## Try it

```task
{
  "id": "lff-m02-t1",
  "prompt": "Choose the best main mode for each cargo and give a reason: (1) **30 kg of urgent medical samples** from Lagos to London; (2) **22 tonnes of rice** from Lagos port to Kano; (3) **800 cubic metres of furniture** from China to Lagos. One line each.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "1. Air - ...",
  "rules": [
    { "label": "Three lines", "minLines": 3 },
    { "label": "Chooses air for the urgent samples", "pattern": "air" },
    { "label": "Chooses road or rail for the rice", "pattern": "road|rail|truck" },
    { "label": "Chooses sea for the furniture", "pattern": "sea|container|ocean|ship" },
    { "label": "Gives reasons", "pattern": "because|since|urgent|cheap|capacity|volume|fast|heavy", "perLine": true }
  ],
  "sample": "1. Air - the samples are urgent, small and valuable, and the cost per kilogram is acceptable for 30 kg.\n2. Road (or rail where available) - the rice is heavy and going inland, and trucks deliver door to door, while rail may be cheaper over the distance.\n3. Sea in containers - the furniture is bulky and not urgent, and sea freight is far cheaper per cubic metre.",
  "required": true
}
```

```task
{
  "id": "lff-m02-t2",
  "prompt": "You send **10 cartons by air**, each **60 × 50 × 40 cm** and **18 kg**, at **$5.50 per kg**. Work out the volumetric weight per carton, the total chargeable weight and the cost.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Volumetric weight per carton = ...",
  "rules": [
    { "label": "Volumetric weight of 20 kg", "pattern": "\\b20\\s?kg|=\\s?20\\b" },
    { "label": "Chargeable weight of 200 kg", "pattern": "\\b200\\s?kg|=\\s?200\\b" },
    { "label": "Cost of $1,100", "pattern": "1,?100" },
    { "label": "Says the greater of actual and volumetric weight is charged", "pattern": "greater|higher|bigger|more than|volumetric" }
  ],
  "sample": "Volumetric weight per carton = 60 x 50 x 40 / 6,000 = 20 kg, which is greater than the actual 18 kg, so 20 kg is chargeable.\nTotal chargeable weight = 10 x 20 = 200 kg.\nCost = 200 x $5.50 = $1,100.",
  "required": true
}
```

```task
{
  "id": "lff-m02-t3",
  "prompt": "Explain in 40 to 90 words the difference between **intermodal** and **multimodal** transport, and give one benefit of using more than one mode.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Intermodal transport is ...",
  "rules": [
    { "label": "Explains intermodal (more than one mode, same container or unit)", "pattern": "intermodal[^.]*(mode|container|unit|same)" },
    { "label": "Explains multimodal (one contract or one document or one responsible party)", "pattern": "multimodal[^.]*(contract|document|one|single|responsib)" },
    { "label": "Gives a benefit", "pattern": "benefit|cheaper|less handling|damage|best mode|one point|faster|flexib" },
    { "label": "Between 40 and 90 words", "minWords": 40, "maxWords": 95 }
  ],
  "sample": "Intermodal transport uses more than one mode, such as truck, ship and rail, with the goods staying in the same container so they are not repacked. Multimodal transport is intermodal movement under a single contract and one transport document, with one party responsible for the whole journey. A benefit of using more than one mode is that each leg can use the best mode for cost or speed, and there is less handling, so less damage.",
  "required": false
}
```

Next lesson: what a freight forwarder does.
