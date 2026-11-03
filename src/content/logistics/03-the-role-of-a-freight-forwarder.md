---
title: The Role of a Freight Forwarder
minutes: 20
summary: Understand what forwarders do and how they differ from carriers, agents and brokers, how to choose and work with one, and where liability and insurance fit.
---

## What a freight forwarder does

A **freight forwarder** is a specialist who arranges the movement of goods for shippers and receivers. They usually do not own the ships or planes. They know the routes, the carriers, the rules and the paperwork, and they put the whole journey together.

Typical services:

- **Advice** on the best mode, route and trade terms.
- **Rate quotations** and **booking space** with carriers.
- **Collection** from the supplier and delivery to the customer.
- **Consolidation:** combining small shipments from several customers into one container or air pallet to get a better rate.
- **Documentation:** preparing and checking bills of lading, air waybills and customs documents.
- **Customs clearance**, directly or through a licensed agent.
- **Cargo insurance** arrangements.
- **Warehousing** and distribution.
- **Tracking** and updates.
- **Handling problems:** delays, damage, claims and disputes.

A forwarder takes the complexity so the customer does not have to deal with five different companies.

## Forwarder, carrier, agent and broker

These terms are often confused. They are different roles:

| Role | What they do | Owns the transport? |
| :-- | :-- | :-- |
| **Carrier** | Moves the goods: shipping line, airline, trucking company, railway | Yes |
| **Freight forwarder** | Arranges the transport and related services for the customer | Usually no |
| **NVOCC** (non-vessel operating common carrier) | A forwarder-like company that issues its own bill of lading and sells container space it buys from shipping lines | No ships, but acts as a carrier |
| **Agent** | Acts on behalf of a principal (for example, a forwarder's partner at the destination) | No |
| **Customs broker / clearing agent** | Handles the customs declaration and clearance | No |

When a forwarder issues its own **house bill of lading** to its customer, and the shipping line issues a **master bill of lading** to the forwarder, the forwarder is taking responsibility as a carrier for the customer. That changes who is liable if goods are lost or damaged, which is why the paperwork matters.

## Choosing and working with a forwarder

For a good result, pick the right partner and manage the relationship.

**Choosing:**

- **Experience on your route and with your cargo** (general goods, perishables, machinery, hazardous items).
- **Licences, registration and memberships** appropriate to the work. Ask for proof and verify it.
- **Network:** reliable agents at both ends.
- **Transparent pricing:** a full quote listing every charge and what is not included.
- **Communication and tracking:** will they tell you early when something goes wrong?
- **References** from other customers, and how they handle problems.
- **Financial stability:** you may pay in advance, so check they will still be around.
- **Insurance** they hold for their own liability.

**Working with them:**

- Give **complete, accurate information** early: goods, quantities, weights, dimensions, values, dates and contacts.
- **Confirm in writing** the terms, price, transit time and who does what.
- Ask for **document drafts** and check them before the goods ship.
- **Stay in touch** and ask for tracking updates.
- Review their performance and give feedback.

## Liability and insurance

A forwarder is not automatically responsible for every loss. Their liability depends on their role, the contract and the law, and it is often **limited** to a small amount per kilogram or per package. Carrier liability under the international rules is also limited: for sea and air carriage, the carrier's payment for lost or damaged cargo is usually far below the value of the goods.

This is why **cargo insurance** matters. A common basis is to insure for **110% of the CIF value** of the goods, which covers the goods, freight and insurance plus a margin for the importer's expected profit and costs.

Example: goods are worth $8,000 and freight and insurance bring the CIF to $9,000. Insured at 110%, the cover is **$9,900**. If the cargo is lost, the insurer pays up to $9,900 depending on the terms. If it relied on carrier liability limited to, say, $2 a kilogram for 400 kg, it would recover about $800.

Insurance policies differ in what they cover. The Institute Cargo Clauses (A), (B) and (C) range from wide "all risks" cover to narrower named-risk cover. Read what is covered and excluded, and arrange cover **before** the goods move.

## Try it

```task
{
  "id": "lff-m03-t1",
  "prompt": "In 50 to 100 words, explain to a small business owner the difference between a **freight forwarder** and a **carrier**, and why they might use a forwarder instead of booking directly with a shipping line.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "A carrier is ...",
  "rules": [
    { "label": "Explains a carrier owns or operates the transport", "pattern": "carrier[^.]*(own|operate|move|ship|airline|truck)" },
    { "label": "Explains a forwarder arranges the transport and services", "pattern": "forwarder[^.]*(arrange|organis|book|document|customs|services?)" },
    { "label": "Gives a reason to use a forwarder (rates, expertise, paperwork, consolidation, one contact)", "pattern": "expertise|knowledge|paperwork|document|consolidat|rate|one (contact|company)|small|simpler|save" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "A carrier owns or operates the transport: the shipping line, airline or trucking company that actually moves the goods. A freight forwarder usually owns no ships or planes but arranges the whole journey for you, including booking space, preparing documents, customs, insurance and delivery. A small business may use a forwarder because it has the expertise and paperwork knowledge, can consolidate small shipments to get better rates and gives one point of contact instead of dealing with several companies.",
  "required": true
}
```

```task
{
  "id": "lff-m03-t2",
  "prompt": "Write **six questions** you would ask before choosing a forwarder. One per line, each ending with a question mark.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "Do you have experience on the ...?",
  "rules": [
    { "label": "Six questions", "minLines": 6 },
    { "label": "Every line is a question", "pattern": "\\?\\s*$", "perLine": true },
    { "label": "Asks about experience on the route or with the cargo", "pattern": "experience|route|cargo|goods" },
    { "label": "Asks about charges or the quote", "pattern": "charge|quote|price|cost|fee" },
    { "label": "Asks about licences, insurance or liability", "pattern": "licen[cs]|insur|liab|registered|member" },
    { "label": "Asks about tracking or communication", "pattern": "track|update|communicat" },
    { "label": "Asks about references", "pattern": "reference|other customers|clients" }
  ],
  "sample": "Do you have experience shipping this type of cargo on the China to Lagos route?\nCan you give me a full quote that lists every charge and what is not included?\nAre you licensed and registered, and can I see the proof?\nWhat insurance do you hold, and how far does your liability go if goods are lost or damaged?\nHow will you track my shipment and how often will you update me?\nCan you give me references from two other customers who ship similar goods?",
  "required": true
}
```

```task
{
  "id": "lff-m03-t3",
  "prompt": "Goods worth **$8,000** have freight and insurance of **$1,000**, giving a CIF value of **$9,000**. (a) What is the cargo insurance cover at **110% of CIF**? (b) The carrier's liability is limited to **$2 per kg** and the cargo weighs **400 kg**: what could you recover from the carrier? (c) Say in one sentence why insurance matters.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "(a) ...",
  "rules": [
    { "label": "Insurance cover of $9,900", "pattern": "9,?900" },
    { "label": "Carrier recovery of $800", "pattern": "\\$?\\s?800\\b" },
    { "label": "Says insurance covers far more than carrier liability", "pattern": "more|far|much|full|value|limited|low|covers" }
  ],
  "sample": "(a) 110% of 9,000 = $9,900 cover.\n(b) 400 kg x $2 = $800 from the carrier.\n(c) Insurance matters because carrier liability is limited and would repay only a small part of the goods' value, while insurance covers the full insured value.",
  "required": false
}
```

Next lesson: the shipping documents.
