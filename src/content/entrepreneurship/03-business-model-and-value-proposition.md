---
title: Business Model and Value Proposition
minutes: 30
summary: Use the Business Model Canvas, write a clear value proposition, choose revenue models, understand costs and key resources and position yourself against competitors.
---

## What a business model is

A **business model** explains how a business creates value for customers and captures some of it as profit. It answers: who do we serve, what do we offer, how do we reach them, how do we earn, and what does it cost to run?

You can test and change a business model on one page, long before you write a full plan.

## The Business Model Canvas

The **Business Model Canvas** is a one-page tool with nine blocks. Fill it in with short, specific notes and keep it updated as you learn.

| Block | Question |
| :-- | :-- |
| **Customer segments** | Who are we serving? |
| **Value proposition** | What problem do we solve, and what do we offer? |
| **Channels** | How do we reach customers and deliver? |
| **Customer relationships** | How do we win, keep and grow customers? |
| **Revenue streams** | How and what do customers pay? |
| **Key resources** | What do we need to deliver (people, equipment, stock, money)? |
| **Key activities** | What must we do well (making, selling, delivering)? |
| **Key partners** | Who helps us (suppliers, delivery partners)? |
| **Cost structure** | What are our main costs? |

Work from the **customer side first** (segments, value, channels, relationships, revenue), then the **business side** (resources, activities, partners, costs). Check that the revenue is more than the costs.

## Value proposition

A **value proposition** is the clear promise of why a customer should choose you. It is about **their** benefit, not your features.

A simple format:

*For [target customer] who [has this problem], our [product or service] is a [category] that [main benefit]. Unlike [alternative], we [key difference].*

Example: *For busy office workers who have little time for lunch, our pre-ordered lunch boxes are a delivery service that brings fresh, hot meals to their desk by 12:30. Unlike queuing at the canteen, we save them 30 minutes and they never have to skip a meal.*

A strong proposition is:
- **Specific:** clear who and what.
- **Focused on a real problem** you validated.
- **Different** from alternatives, in a way customers care about.
- **Believable:** you can deliver it.

## Revenue models

Decide **how you earn.** Common models:

- **Sell a product:** one-time sale, profit per item.
- **Charge for a service:** per job, per hour or per project.
- **Subscription:** regular payment for continued access (a weekly meal plan, a monthly cleaning service).
- **Commission:** a percentage of a sale you help make.
- **Rental or leasing:** customers pay to use something.
- **Advertising or sponsorship:** others pay to reach your audience.
- **Freemium or tiered packages:** a basic level and paid upgrades.

Choose a model that fits how customers like to pay and gives you **predictable income** where possible. Test different prices and packages.

## Costs and key resources

List what you must spend to deliver:

- **Fixed costs** do not change with sales in the short term: rent, salaries, subscriptions, insurance, loan repayments.
- **Variable costs** rise with each sale: ingredients, packaging, delivery, transaction fees, commission.
- **Start-up costs** are one-off: equipment, registration, initial stock, branding, deposits.

Then list **key resources**: people, skills, equipment, premises, stock, technology and cash. Find out what you can start without (borrow, rent, outsource), so you keep costs low while you learn.

## Competitors and positioning

You always have competitors, even if only the customer's current way of solving the problem (doing it themselves, or doing nothing).

- **Direct competitors** offer the same thing to the same people.
- **Indirect competitors** solve the same problem differently.
- **Substitutes** are other things customers might spend on instead.

Study them: who they serve, what they charge, what customers like and dislike, how they reach customers. Then **position** yourself: choose a clear place in customers' minds. Positioning is often explained with two axes, such as **price (low to high)** and **quality or convenience (low to high)**. You can be the cheapest, the most convenient, the best quality, or the best for one specific group. You cannot be all of them.

> [!NOTE]
> Customers read **reviews and complaints** about your competitors. These are free market research. Look for the same complaint repeated: that is your opening.

## Try it

```task
{
  "id": "ent-m03-t1",
  "prompt": "Fill in a **Business Model Canvas** for your idea, one block per line in the form \"Block: answer\". Cover all nine blocks: customer segments, value proposition, channels, customer relationships, revenue streams, key resources, key activities, key partners and cost structure.",
  "minutes": 18,
  "rows": 12,
  "placeholder": "Customer segments: ...\nValue proposition: ...",
  "rules": [
    { "label": "Nine lines", "minLines": 9 },
    { "label": "Customer segments", "pattern": "customer segments?" },
    { "label": "Value proposition", "pattern": "value proposition" },
    { "label": "Channels", "pattern": "channels?" },
    { "label": "Customer relationships", "pattern": "relationships?" },
    { "label": "Revenue streams", "pattern": "revenue" },
    { "label": "Key resources, activities and partners", "pattern": "resources?[\\s\\S]*activities[\\s\\S]*partners?" },
    { "label": "Cost structure", "pattern": "cost structure|costs?" }
  ],
  "sample": "Customer segments: office workers aged 25 to 40 in Ikeja with a 30-minute lunch break\nValue proposition: fresh hot lunch delivered to the desk by 12:30, saving them the 15-minute queue\nChannels: WhatsApp ordering and delivery by bike to offices\nCustomer relationships: personal WhatsApp service, weekly menu, loyalty discount after 10 meals\nRevenue streams: ₦2,500 per meal and a ₦11,000 weekly subscription\nKey resources: a clean kitchen, two cooks, a delivery rider, insulated food boxes, working capital of ₦300,000\nKey activities: buying ingredients, cooking, packing, delivering, taking orders\nKey partners: a market supplier for ingredients and a dispatch rider\nCost structure: ingredients, packaging, rider pay, gas, phone data, rent share",
  "required": true
}
```

```task
{
  "id": "ent-m03-t2",
  "prompt": "Write your **value proposition** in one or two sentences using the format: *For [customer] who [problem], our [product] is a [category] that [benefit]. Unlike [alternative], we [difference].*",
  "minutes": 8,
  "rows": 5,
  "placeholder": "For ... who ..., our ... is a ... that ... Unlike ..., we ...",
  "rules": [
    { "label": "Starts with 'For' and names a customer", "pattern": "for [a-z]" },
    { "label": "Names the problem with 'who'", "pattern": "who " },
    { "label": "Says 'our ... is a ... that'", "pattern": "our [^.]* is an? [^.]* that" },
    { "label": "Contrasts with an alternative using 'Unlike'", "pattern": "unlike" },
    { "label": "Between 25 and 80 words", "minWords": 25, "maxWords": 85 }
  ],
  "sample": "For busy office workers in Ikeja who have little time for lunch, our pre-ordered lunch box service is a delivery business that brings a fresh, hot meal to their desk by 12:30 every working day. Unlike queuing at the canteen or eating snacks, we save them 30 minutes and make sure they never skip a proper meal.",
  "required": true
}
```

```task
{
  "id": "ent-m03-t3",
  "prompt": "List **three competitors** (direct, indirect or the customer's own workaround). For each, one line: who they are, what they charge and one weakness you could exploit.",
  "minutes": 12,
  "rows": 6,
  "placeholder": "Competitor 1 - ... - ₦... - weakness ...",
  "rules": [
    { "label": "Three lines", "minLines": 3 },
    { "label": "Each line gives a price or cost", "pattern": "₦\\s?\\d|\\d{3,}|free|cost", "perLine": true },
    { "label": "Each line names a weakness", "pattern": "weak|slow|queue|expensive|unreliable|poor|limited|inconsistent|late|cannot|no ", "perLine": true },
    { "label": "Includes a direct competitor and a workaround or indirect competitor", "pattern": "canteen|restaurant|cook|bring|home|snack|street|indirect|workaround|themselves" }
  ],
  "sample": "Office canteen (direct) - ₦1,800 a plate - weakness: 15-minute queue and limited menu\nStreet food vendors (indirect) - ₦1,000 to ₦1,500 - weakness: inconsistent hygiene and quality\nBringing food from home (workaround) - about ₦1,000 in ingredients - weakness: workers lack time to cook and the food goes cold",
  "required": false
}
```

Next lesson: planning and strategy.
