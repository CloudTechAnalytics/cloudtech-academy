---
title: Cargo Handling, Packing and Container Loading
minutes: 25
summary: Pack and mark cargo properly, choose and load containers, handle dangerous and special cargo, and deal with cargo insurance and claims.
---

## Packing and marking

Cargo is lifted, stacked, shaken and sometimes dropped on its way. Good packing protects it and good marking makes sure it reaches the right place.

**Packing principles:**

- **Match the packing to the journey.** Sea cargo faces humidity, stacking and rough handling. Air cargo faces handling at several terminals. Road cargo faces vibration and braking.
- **Use strong, clean, suitable materials:** double-wall cartons, wooden crates or pallets, strapping, shrink wrap, corner protectors.
- **Fill empty space** with padding so goods cannot move inside the package.
- **Protect from water and moisture** with plastic liners, desiccants or waterproof wrapping.
- **Keep weight within limits** so cartons are safe to lift and do not crush those below.
- **Palletise** where possible, so cargo can be moved quickly with forklifts.
- **Treat wooden packaging** to international standards where required (heat treatment, with an approved mark), as untreated wood can be rejected.

**Marking and labelling:**

- **Shipping marks:** consignee, destination, carton number ("3 of 12") and reference.
- **Handling marks:** "This way up", "Fragile", "Keep dry".
- **Weight and dimensions** on the package.
- **Country of origin** where required.
- **Hazard labels** for dangerous goods.

Clear, consistent marks make it easy to find missing cartons and prevent mix-ups at the destination.

## Container types and loading

Choose the container to suit the cargo:

| Container | Use |
| :-- | :-- |
| **20-foot dry (about 33 CBM)** | Heavy or smaller loads |
| **40-foot dry (about 67 CBM)** | Large volumes of general cargo |
| **40-foot high cube (about 76 CBM)** | Light, bulky cargo |
| **Refrigerated (reefer)** | Temperature-controlled goods such as food and medicine |
| **Open-top / flat-rack** | Oversize cargo that cannot go through the door |
| **Tank container** | Liquids |

**Loading principles:**

- **Check the container** before loading: clean, dry, no holes or damage, doors that seal.
- **Do not exceed the payload.** Respect the maximum gross weight, and distribute weight evenly, with heavier items at the bottom and centre.
- **Block and brace** the cargo so it cannot shift. Use dunnage, airbags, straps and lashing.
- **Use the space** well, but do not overfill or jam the doors.
- **Keep incompatible cargo apart** (for example, food away from chemicals or strong smells).
- **Record the seal number** and photograph loading.

**Planning the load.** Practical capacity is lower than the theoretical volume because of gaps, pallets and door space. A planner often uses about **85%** of the container volume. For a 20-foot container of about 33 CBM, the usable volume is 33 × 0.85 = 28.05 CBM. If each carton is 0.12 CBM, then 28.05 ÷ 0.12 = 233.75, so about **233 cartons** fit. Check weight too: 233 cartons at 15 kg is 3.5 tonnes, well within the container's payload.

## Dangerous and special cargo

**Dangerous goods** are substances that can cause harm to people, property or the environment: flammable liquids, gases, corrosives, batteries, aerosols, some chemicals. They are controlled by international rules: the **IMDG Code** for sea and the **IATA Dangerous Goods Regulations** for air. Each product has a UN number and a hazard class, and shipping it requires correct classification, packaging, marking, labelling and a **dangerous goods declaration**, plus trained staff. Misdeclaring dangerous goods is a serious offence and can cause accidents.

**Special cargo** includes:

- **Perishables:** need a cold chain and fast handling.
- **Valuable cargo:** extra security and insurance.
- **Live animals and plants:** strict rules and welfare requirements.
- **Oversize or heavy-lift cargo:** special equipment, route surveys and permits.

Ask your carrier and forwarder about restrictions **before** you accept the cargo.

## Cargo insurance and claims

**Cargo insurance** covers loss or damage in transit (see module 3). When something goes wrong, follow a clear process:

1. **Inspect on delivery.** Note any damage, shortage or broken seals on the delivery note or receipt **before signing**, and take photographs.
2. **Notify the carrier and insurer promptly,** in writing, within the time limits in the contract and policy.
3. **Protect the goods** from further damage and keep the packaging and damaged items for inspection.
4. **Collect documents:** invoice, packing list, B/L or AWB, delivery note, photos, survey report if there is one.
5. **File the claim** with a clear description and the amount.
6. **Follow up** and respond to questions from the insurer.

Late notice or unrecorded damage often means no payment.

## Try it

```task
{
  "id": "lff-m07-t1",
  "prompt": "A 20-foot container has about **33 CBM** of space. You plan to use **85%** of it. Each carton is **0.12 CBM**. Work out the usable volume and the number of cartons that fit (round down). Then say what else you must check besides volume.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Usable volume = ...",
  "rules": [
    { "label": "Usable volume of 28.05 CBM", "pattern": "28\\.05|28\\.1" },
    { "label": "233 cartons", "pattern": "\\b233\\b" },
    { "label": "Says to check weight or payload", "pattern": "weight|payload|kg|tonne" }
  ],
  "sample": "Usable volume = 33 x 0.85 = 28.05 CBM.\nCartons = 28.05 / 0.12 = 233.75, so 233 cartons fit.\nI must also check the total weight against the container's payload limit and that it is evenly distributed.",
  "required": true
}
```

```task
{
  "id": "lff-m07-t2",
  "prompt": "Write a **packing and marking checklist** for a shipment of 120 cartons of glassware going by sea. At least eight points, one per line.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "Use double-wall cartons ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Mentions strong cartons or crates", "pattern": "carton|crate|pallet|box" },
    { "label": "Mentions padding or filling space", "pattern": "pad|fill|cushion|bubble|dividers?" },
    { "label": "Mentions moisture or waterproofing", "pattern": "moisture|water|damp|desiccant|liner" },
    { "label": "Mentions fragile or this-way-up marks", "pattern": "fragile|this way up|handling mark" },
    { "label": "Mentions carton numbers or shipping marks", "pattern": "carton number|\\d of \\d|shipping marks?|consignee|destination" },
    { "label": "Mentions blocking, bracing or securing in the container", "pattern": "block|brace|lash|secure|dunnage|airbag|strap" }
  ],
  "sample": "Use strong double-wall cartons with dividers for each item.\nFill empty space with padding so nothing can move.\nWrap cartons in plastic liners and add desiccant against moisture.\nPalletise and shrink-wrap the cartons for forklift handling.\nMark each carton Fragile and This Way Up.\nPut the consignee, destination and carton number (for example 3 of 120) on every carton.\nPhotograph the packing before loading.\nBlock and brace the cargo in the container with dunnage and straps so it cannot shift.",
  "required": true
}
```

```task
{
  "id": "lff-m07-t3",
  "prompt": "A carton arrives with a crushed corner and the contents damaged. Write the **steps you take** in order, one per line (at least five), starting at the moment of delivery.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "1. Note the damage on the delivery note ...",
  "rules": [
    { "label": "At least five steps", "minLines": 5 },
    { "label": "Notes the damage on the delivery note before signing", "pattern": "delivery note|before sign|note the damage|record the damage" },
    { "label": "Takes photographs", "pattern": "photo" },
    { "label": "Notifies the carrier or insurer in writing", "pattern": "notify|inform|report|tell[\\s\\S]*(carrier|insurer|forwarder)" },
    { "label": "Keeps the goods and packaging", "pattern": "keep|retain|preserve|protect" },
    { "label": "Files a claim with documents", "pattern": "claim|documents|invoice" }
  ],
  "sample": "1. Note the damage on the delivery note before signing.\n2. Take photographs of the carton, the contents and the packaging.\n3. Notify the carrier, forwarder and insurer in writing straight away.\n4. Keep the damaged goods and packaging for inspection and protect the rest from further damage.\n5. Collect the invoice, packing list, bill of lading and delivery note.\n6. File the claim with the insurer within the time limit and follow up.",
  "required": false
}
```

Next lesson: warehousing and distribution.
