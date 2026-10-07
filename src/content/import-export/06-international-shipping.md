---
title: International Shipping
minutes: 25
summary: Compare air and sea freight, understand LCL, FCL and courier options, work with freight forwarders, pack, label and insure goods, and plan for transit times and tracking.
---

## Air or sea?

The two main ways to bring goods to Nigeria are **air freight** and **sea freight**. The right choice depends on weight, size, value, urgency and budget.

| | Air freight | Sea freight |
| :-- | :-- | :-- |
| **Speed** | Roughly a week or two door to door | Often several weeks, commonly over a month from China |
| **Cost** | Higher per kilogram | Much lower per unit of cargo |
| **Best for** | Small, light, high-value or urgent goods and samples | Heavy, bulky or large orders |
| **Charged by** | Weight (kilograms) | Volume (cubic metres) for shared loads, or per container |
| **Risks** | Fewer handling steps, lower damage risk | Longer exposure, more handling, port delays |

For a first mini import of light goods, **air cargo** is often practical. As volumes grow, **sea freight** brings the cost per unit down. Times and prices change often, so always get a current quote.

## How air freight is charged

Airlines charge for the **greater of the actual weight and the volumetric weight**. Large, light boxes take up space, so space is charged too.

*Volumetric weight (kg) = length × width × height (cm) ÷ 6,000*

Example: one carton is 60 × 40 × 50 cm and weighs 15 kg.
- Volumetric weight = 60 × 40 × 50 ÷ 6,000 = 120,000 ÷ 6,000 = **20 kg**.
- Actual weight is 15 kg, so the **chargeable weight is 20 kg**.

Some carriers and forwarders use slightly different divisors, so always confirm how a quote is calculated.

## LCL, FCL and courier

- **FCL (Full Container Load).** You rent a whole container: commonly a 20-foot or a 40-foot. It makes sense when your cargo fills most of it. You pay a flat price per container for the route.
- **LCL (Less than Container Load).** Your cartons share a container with other importers. You pay by cubic metre (CBM) or by weight, whichever the forwarder charges higher. It suits mini importation by sea.
- **Courier / express.** DHL, FedEx, UPS and similar services collect and deliver, with simple tracking and clearance handled for you. It is the fastest and simplest for samples and very small orders, and the most expensive per kilogram.

**CBM** (cubic metre) is length × width × height in **metres**. A carton of 60 × 40 × 50 cm is 0.6 × 0.4 × 0.5 = **0.12 CBM**.

## Working with a freight forwarder

A **freight forwarder** arranges the movement for you: collects from the supplier, books space, prepares the shipping documents and often arranges clearance and delivery. For a beginner, a good forwarder is the most valuable person in the chain.

When choosing one:

- **Ask for a full quote** showing every charge, from pick-up to delivery, and in which currency.
- **Check they have experience on your route** and with your type of goods.
- **Ask for references** or check reviews from other importers. Beware of anyone who quotes far below the rest.
- **Ask about their agent in Nigeria** and who handles clearing.
- **Agree transit time, storage terms and liability** in writing.
- **Check how they communicate**: you need updates and tracking.

Many forwarders in Guangzhou and Yiwu also consolidate goods from several suppliers into one shipment, which helps if you buy from more than one factory.

## Packaging, labelling and insurance

- **Pack for the journey.** Cartons are stacked, dropped and sometimes get wet. Use strong cartons, protect fragile goods and seal them well.
- **Label clearly.** Each carton should show your name or mark, the product, the quantity, the carton number ("3 of 12") and the destination. Clear marks make a shortage easy to spot.
- **Check size and weight limits** for air cargo and courier.
- **Mind restricted goods.** Batteries, liquids, aerosols and powders can have shipping limits, especially by air. Ask your forwarder before you order.
- **Insure it.** Standard carrier liability is low. **Cargo insurance** usually costs a small percentage of the goods' value and covers loss or damage in transit. For anything worth risking, buy it.

> [!TIP]
> Take photos of the packed cartons before they leave, and of the cartons when they arrive. If there is damage, those photos are your claim.

## Transit times and tracking

Total time includes more than the flight or voyage:

*Production → pick-up → export clearance → main transport → arrival → clearing → delivery to you.*

Add time for each stage, and a buffer for delays: holidays such as Chinese New Year, port congestion, weather and inspections. Ask your forwarder for the **tracking number** (air waybill or container/bill of lading number) and check it regularly. Plan stock around the longest realistic time, not the shortest quoted one.

## Try it

```task
{
  "id": "iemi-m06-t1",
  "prompt": "You are shipping **10 cartons by air**. Each carton is **60 × 40 × 50 cm** and weighs **15 kg**. Work out the volumetric weight of one carton, the total chargeable weight, and the cost if the forwarder charges **$6 per kg**.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Volumetric weight per carton = ...",
  "rules": [
    { "label": "Volumetric weight of 20 kg per carton", "pattern": "\\b20\\s?kg|=\\s?20\\b" },
    { "label": "Chargeable weight of 200 kg in total", "pattern": "\\b200\\s?kg|=\\s?200\\b" },
    { "label": "Cost of $1,200", "pattern": "1,?200" },
    { "label": "Says the greater of actual or volumetric weight is used", "pattern": "greater|higher|bigger|more than|volumetric" }
  ],
  "sample": "Volumetric weight per carton = 60 x 40 x 50 / 6,000 = 20 kg. The actual weight is 15 kg, so the greater, 20 kg, is chargeable per carton.\nTotal chargeable weight = 10 x 20 = 200 kg.\nCost = 200 kg x $6 = $1,200.",
  "required": true
}
```

```task
{
  "id": "iemi-m06-t2",
  "prompt": "Chioma will import 40 cartons of kitchen items, about 0.12 CBM each. A forwarder quotes LCL sea freight at **$95 per CBM**. Calculate the total CBM and the freight cost, then say in one or two sentences whether LCL sea or air is likely better if the goods are heavy and not urgent.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Total CBM = ...",
  "rules": [
    { "label": "Total of 4.8 CBM", "pattern": "4\\.8" },
    { "label": "Freight cost of $456", "pattern": "456" },
    { "label": "Recommends sea freight for heavy, non-urgent goods", "pattern": "sea|lcl" },
    { "label": "Gives a reason (cheaper, weight, volume, not urgent)", "pattern": "cheaper|lower|cost|heavy|not urgent|volume" }
  ],
  "sample": "Total CBM = 40 x 0.12 = 4.8 CBM.\nFreight cost = 4.8 x $95 = $456.\nSea freight (LCL) is better here because the goods are heavy and not urgent, and sea is much cheaper than air for heavy cargo.",
  "required": true
}
```

```task
{
  "id": "iemi-m06-t3",
  "prompt": "Write **five questions** you would ask a freight forwarder before choosing them. One question per line, each ending in a question mark.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Does your quote include ...?",
  "rules": [
    { "label": "Five questions", "minLines": 5 },
    { "label": "Every line is a question", "pattern": "\\?\\s*$", "perLine": true },
    { "label": "Asks about charges or the full quote", "pattern": "charge|fee|quote|cost|include" },
    { "label": "Asks about transit time or tracking", "pattern": "transit|how long|days|tracking|track" },
    { "label": "Asks about clearing, delivery, insurance or liability", "pattern": "clear|deliver|insur|liab|damage|lost" }
  ],
  "sample": "Does your quote include every charge from the supplier's door to my warehouse?\nWhat is the transit time and how often do delays happen on this route?\nCan I track the shipment, and how often will you update me?\nDo you handle clearing in Nigeria or work with a licensed agent there?\nWhat insurance can you arrange and who pays if goods are lost or damaged?",
  "required": false
}
```

Next lesson: the documents customs expects and how duty is worked out.
