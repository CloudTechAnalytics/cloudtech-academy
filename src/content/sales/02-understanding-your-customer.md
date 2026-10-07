---
title: Understanding Your Customer
minutes: 25
summary: Define your ideal customer profile, map customer needs, pains and gains, identify buyers, users and decision makers and understand your competitors.
---

## Ideal customer profile

You cannot sell to everyone. An **ideal customer profile (ICP)** describes the type of customer that gets the most value from you and brings the most value back: they buy readily, pay on time, stay and refer others.

For a business customer (B2B), describe:

- **Industry or type of business:** shops, schools, clinics, factories, restaurants.
- **Size:** number of staff, branches or turnover.
- **Location:** the areas you can serve.
- **Situation or trigger:** what makes them need you now (power cuts, growth, a new rule, an expansion).
- **Budget range** and how they usually buy.
- **Who decides.**

For an individual customer (B2C), describe age range, occupation, income, location, habits and motivation.

Build the ICP from **your best existing customers**: who bought fastest, paid on time, stayed longest, referred others? Look for the shared traits. Then aim your effort at more people like them, and avoid spending time on poor fits.

Example ICP for Sunbright Solar: *Retail shops and small clinics in Lagos with 3 to 20 staff, running a generator for more than six hours a day, spending at least ₦80,000 a month on fuel, with an owner who decides on purchases.*

## Customer needs, pains and gains

People buy to fix a **pain** or reach a **gain**.

- **Pains:** problems, frustrations, risks and costs. *Fuel costs are rising, the generator is noisy and breaks down, customers leave when the power goes.*
- **Gains:** results and benefits they want. *Lower monthly costs, reliable power for the freezer and lights, a quieter shop, a better image.*
- **Needs** can be **stated** (what they say) and **underlying** (what really drives them). A shop owner may say "I want a cheaper generator," when the underlying need is "stop losing money to power cuts."

A simple map for each customer type has three columns: **Pains**, **Gains** and **What they do now.** Fill it with real language from conversations, and use their words in your messages. The stronger the pain, the more urgent the sale.

Rank pains by **how often they happen, how much they cost and how badly the customer wants them solved.** Lead with the biggest.

## Buyers, users and decision makers

In many sales there is more than one person involved. Identify each role:

| Role | What they do |
| :-- | :-- |
| **Economic buyer** | Controls the budget and gives the final yes |
| **User** | Uses the product day to day |
| **Influencer / advisor** | Recommends or advises (an engineer, an accountant) |
| **Gatekeeper** | Controls access to the decision maker (a receptionist, an assistant) |
| **Champion** | Supports you inside the customer and helps you win |
| **Blocker** | Opposes the change, or a competitor's friend |

Example: selling a system to a clinic. The doctor-owner is the economic buyer, the nurse who uses the freezer is the user, the technician is the influencer and the receptionist is the gatekeeper. If you talk only to the receptionist, you may never reach the person who can say yes.

Ask early: *"Besides you, who else will be involved in this decision?"* and *"How are decisions like this usually made here?"* Treat every person with respect, since any of them can support or block the sale.

## Competitor awareness

You are always competing, with other suppliers, with cheaper alternatives, with the customer's own workaround (like the generator) and with **doing nothing.**

Know your competitors:

- Who they are and who they serve.
- Their prices, offers and terms.
- Their strengths and weaknesses, as customers describe them.
- How they sell and where they advertise.
- How you are **different and better** for your ICP.

Gather information honestly: public websites, social pages, reviews, price lists and what customers tell you. Do not obtain secrets by deceit.

In conversations, **never attack** competitors. Ask what the customer values and show how you meet it. If a customer prefers a rival's strength, accept it and focus on where you win. Keep a simple **battlecard** for each main competitor: their strengths, weaknesses, common claims and your best response.

## Try it

```task
{
  "id": "bds-m02-t1",
  "prompt": "Write the **ideal customer profile** for a business or product of your choice (or Sunbright Solar). One item per line: type of business or person, size, location, trigger (why they need it now), budget and who decides. At least six lines.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Type: ...\nSize: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "States the type of customer", "pattern": "type|industry|business|customer" },
    { "label": "States the size", "pattern": "size|staff|employees|\\d+\\s*(to|-)\\s*\\d+|turnover" },
    { "label": "States the location", "pattern": "location|lagos|abuja|area|city|state|ikeja|lekki" },
    { "label": "States the trigger", "pattern": "trigger|because|when|need now|reason|power cuts|growth" },
    { "label": "States the budget", "pattern": "budget|₦\\s?\\d|spend" },
    { "label": "States who decides", "pattern": "decid|owner|manager|buyer" }
  ],
  "sample": "Type: retail shops and small clinics that depend on refrigeration and lighting\nSize: 3 to 20 staff\nLocation: Lagos, mainly Ikeja, Yaba and Lekki\nTrigger: they run a generator more than six hours a day and fuel costs keep rising\nBudget: spending at least ₦80,000 a month on fuel and able to invest ₦800,000 to ₦1,500,000\nWho decides: the owner or general manager, with the shop's accountant advising",
  "required": true
}
```

```task
{
  "id": "bds-m02-t2",
  "prompt": "Build a **pains and gains map** for your ideal customer: three pains, three gains and what they do now. One item per line, labelled.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Pain 1: ...\nGain 1: ...",
  "rules": [
    { "label": "Three pains", "pattern": "pain 1[\\s\\S]*pain 2[\\s\\S]*pain 3" },
    { "label": "Three gains", "pattern": "gain 1[\\s\\S]*gain 2[\\s\\S]*gain 3" },
    { "label": "What they do now", "pattern": "do now|currently|at the moment|workaround|today" },
    { "label": "At least seven lines", "minLines": 7 }
  ],
  "sample": "Pain 1: fuel for the generator costs ₦80,000 to ₦150,000 a month\nPain 2: the generator breaks down and the shop loses sales during outages\nPain 3: noise and fumes upset customers and neighbours\nGain 1: lower and predictable monthly energy costs\nGain 2: reliable power for the freezer, lights and card machine\nGain 3: a quieter, cleaner shop\nWhat they do now: run a petrol generator and pay for repairs and fuel every week",
  "required": true
}
```

```task
{
  "id": "bds-m02-t3",
  "prompt": "You are selling a system to a clinic. Name **four people** who may be involved in the decision, give their role (economic buyer, user, influencer, gatekeeper or champion) and say what each cares about. One per line.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Doctor-owner - economic buyer - cares about ...",
  "rules": [
    { "label": "Four lines", "minLines": 4 },
    { "label": "Names the economic buyer", "pattern": "economic buyer|decision maker|owner|pays|budget" },
    { "label": "Names a user", "pattern": "user|nurse|staff|pharmacist" },
    { "label": "Names an influencer or gatekeeper", "pattern": "influencer|gatekeeper|technician|accountant|receptionist|advisor" },
    { "label": "Says what each cares about", "pattern": "cares|wants|concerned|worried|focus|needs", "perLine": true }
  ],
  "sample": "Doctor-owner - economic buyer - cares about cost, payback and keeping the clinic running\nNurse in charge - user - cares about reliable power for the vaccine fridge\nBiomedical technician - influencer - cares about technical fit and safety\nReceptionist - gatekeeper - cares about her boss's time and not being embarrassed by interruptions",
  "required": false
}
```

Next lesson: prospecting and lead generation.
