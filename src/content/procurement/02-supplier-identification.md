---
title: Supplier Identification
minutes: 25
summary: Turn a need into a clear specification, find suppliers from the right sources, move from a long list to a short list and weigh local against international options.
---

## Start with the requirement

You cannot find the right supplier until you know exactly what you need. A vague request ("some cleaning supplies") produces vague quotes that cannot be compared. Before you look for anyone, write a **specification**.

A good specification states:

- **What:** the item or service, with model, size, grade or standard.
- **How much:** quantity, and whether it is a one-off or regular.
- **Quality:** the standard it must meet (a Nigerian or international standard, a sample, a brand).
- **When and where:** delivery date, place, and how it will be delivered.
- **Extras:** packaging, installation, training, warranty, after-sales support.
- **Budget:** a range you can share internally, not with suppliers.

Ask the requester: what problem does this solve, and is there a cheaper way to solve it? Sometimes the need changes after that question.

> [!TIP]
> Describe the **result you need**, not just a brand. "Chairs that seat adults for eight hours and cost under ₦25,000" gives you more options than "Model X".

## Where to find suppliers

| Source | Use it for |
| :-- | :-- |
| **Existing suppliers and records** | Who already serves you well |
| **Recommendations from other buyers** | Trusted names with real track records |
| **Trade associations and chambers of commerce** | Directories of members |
| **Manufacturers and authorised distributors** | Direct supply, warranty and genuine goods |
| **Markets and trade fairs** | Seeing goods and meeting several suppliers |
| **Online directories and marketplaces** | Wide choice; verify before trusting |
| **Advertising for suppliers** | A public call for expressions of interest, common for larger or public buying |
| **Search engines and social media** | Quick discovery; verify carefully |

Use several sources. A supplier you find only through one advert or one friend is a risk you cannot judge.

## From a long list to a short list

A **long list** is every supplier that might be able to supply. A **short list** is the few you will ask for a quote.

Narrow the list with simple **must-have** questions, so you do not waste time on suppliers who cannot do the job:

- Do they supply this item or service in the quantity needed?
- Can they deliver to our location in time?
- Are they a registered, legitimate business?
- Do they meet the required standard or have the needed approvals?
- Can they show recent customers who will confirm they deliver?
- Are they financially stable enough to complete the order?

Then keep **three to five** suppliers. Fewer than three gives you no comparison. More than five slows you down with little extra benefit.

## Local and international options

| | Local supplier | International supplier |
| :-- | :-- | :-- |
| **Lead time** | Short | Longer, with shipping and customs |
| **Price** | Often higher per unit | Often lower per unit, with more costs added |
| **Risk** | Easier to visit, inspect and resolve disputes | Distance, currency, delays, documents |
| **Payment** | Naira, flexible terms | Often foreign currency, advance payment |
| **Support** | Easier after-sales and returns | Harder |

The right choice depends on volume, urgency and risk. Compare **total cost** (price plus freight, duty, clearing and risk), not just the quoted unit price. Module 11 covers sourcing across borders in more depth.

## Try it

```task
{
  "id": "proc-m02-t1",
  "prompt": "Lekki Fresh Foods needs **2,000 food-safe plastic crates**. Write a short **specification** with one detail per line: item, quantity, size, material, quality standard, delivery date and place, packaging and warranty or after-sales terms.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "Item: ...\nQuantity: ...",
  "rules": [
    { "label": "At least seven lines", "minLines": 7 },
    { "label": "States the item and quantity", "pattern": "item[\\s\\S]*quantity|quantity[\\s\\S]*item" },
    { "label": "States size or dimensions", "pattern": "size|dimension|litre|cm|mm|capacity" },
    { "label": "States material or standard", "pattern": "material|food-?safe|standard|grade|hdpe|polypropylene|nafdac|son" },
    { "label": "States delivery date and place", "pattern": "deliver[\\s\\S]*(date|by|within|lagos|warehouse|site)" },
    { "label": "States packaging or warranty", "pattern": "packag|warrant|after-?sales|replace" }
  ],
  "sample": "Item: food-safe stackable plastic crates with lids\nQuantity: 2,000 units, one delivery\nSize: 60 x 40 x 30 cm, about 50 litres\nMaterial: food-grade polypropylene, no recycled material\nQuality standard: must meet applicable Nigerian food-contact standards and carry load of 30 kg when stacked\nDelivery: to our Lekki warehouse within 21 days of the order\nPackaging: stacked and shrink-wrapped in lots of 50\nWarranty: free replacement of cracked crates within 6 months",
  "required": true
}
```

```task
{
  "id": "proc-m02-t2",
  "prompt": "You found nine possible crate suppliers. List **five must-have questions** you will use to cut the long list down to a short list of three to five. One per line, each ending with a question mark.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Can they supply 2,000 units ...?",
  "rules": [
    { "label": "Five questions", "minLines": 5 },
    { "label": "Every line is a question", "pattern": "\\?\\s*$", "perLine": true },
    { "label": "Asks about quantity or capacity", "pattern": "quantity|capacity|2,?000|volume|supply" },
    { "label": "Asks about delivery time", "pattern": "deliver|time|date|days|lead" },
    { "label": "Asks about registration, references or track record", "pattern": "registered|register|reference|customers|track record|legitimate|cac" },
    { "label": "Asks about standard or quality", "pattern": "standard|quality|approval|food|certif" }
  ],
  "sample": "Can they supply 2,000 crates in one delivery?\nCan they deliver to our Lekki warehouse within 21 days?\nIs the business registered and legitimate, and can we check it?\nDo the crates meet the food-contact standard we require?\nCan they give two recent customers as references who will confirm they deliver on time?",
  "required": true
}
```

```task
{
  "id": "proc-m02-t3",
  "prompt": "A local supplier quotes ₦3,400 a crate. An overseas supplier quotes ₦2,600 a crate, but freight, duty and clearing would add ₦900,000 for 2,000 crates. Work out the **total cost of each** and say which is cheaper and by how much. Then name one other factor besides price to consider.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Local total = ...",
  "rules": [
    { "label": "Local total of ₦6,800,000", "pattern": "6,?800,?000" },
    { "label": "Overseas goods of ₦5,200,000", "pattern": "5,?200,?000" },
    { "label": "Overseas total of ₦6,100,000", "pattern": "6,?100,?000" },
    { "label": "Overseas is cheaper by ₦700,000", "pattern": "700,?000" },
    { "label": "Names another factor (lead time, risk, quality, payment, support)", "pattern": "lead time|risk|quality|payment|support|delay|currency|exchange|warranty" }
  ],
  "sample": "Local total = 2,000 x 3,400 = ₦6,800,000.\nOverseas goods = 2,000 x 2,600 = ₦5,200,000; plus 900,000 = ₦6,100,000.\nOverseas is cheaper by 6,800,000 - 6,100,000 = ₦700,000.\nBut I would also consider lead time and risk: the overseas order takes longer and exchange rate and delay risks are higher.",
  "required": false
}
```

Next lesson: evaluating suppliers fairly.
