---
title: Partnerships and Key Accounts
minutes: 25
summary: Find and approach partners, manage accounts, upsell and cross-sell sensibly and handle large customers well.
---

## Finding and approaching partners

A **partner** is another organisation that helps you reach customers or deliver value, and that you help in return. Good partners multiply your reach without multiplying your costs.

Types of partners:

- **Referral partners:** businesses that serve the same customers but sell something different (a bank that finances equipment, an estate agent, an electrician).
- **Resellers and agents:** sell your product for a commission or margin.
- **Suppliers and manufacturers:** may promote or co-sell.
- **Technology or service partners:** whose products work with yours.
- **Associations and community groups:** whose members need what you offer.

**Choosing partners:** look for a **shared customer**, a **fit of reputation and values**, **complementary** (not competing) offers and a partner who is **reliable and active.**

**Approaching them:**

1. **Research** who they serve and what they need.
2. **Start with value for them,** not a request: *"Your customers buying new shops often struggle with power costs. We could offer them a free power audit, and you'd earn a referral fee for each install."*

3. **Propose a small, clear pilot** with defined roles.
4. **Agree the terms in writing:** who does what, commission or margin, how leads are shared, branding, support, confidentiality and how to end the arrangement.
5. **Support the partner:** training, materials, quick responses.
6. **Review results** regularly and fix problems early.

A partnership works when **both sides win** and each knows what they must do.

## Account management

An **account** is an existing customer, and **account management** means looking after and growing that relationship. It is cheaper and more profitable to grow existing customers than to win new ones.

Activities:

- **Know the account:** their business, people, goals, projects, how they buy and what else they might need.
- **Stay in regular contact,** with useful updates and scheduled check-ins, not only when you want to sell.
- **Solve problems quickly,** and be the customer's champion inside your own company.
- **Review the account** regularly: what they bought, what worked and what could improve.
- **Map the relationships:** have contacts at more than one level, so the account does not depend on one person.
- **Write an account plan** for important customers: goals, opportunities, risks, key contacts and next actions.

Segment your customers: **key accounts** (the largest or most strategic) get the most attention; others get lighter, regular contact.

## Upselling and cross-selling

- **Upselling** means offering a higher-value version of what they are buying: a larger system, the premium package, a longer warranty.
- **Cross-selling** means offering something related: a maintenance plan, accessories, a second product.

Do it only when it **genuinely helps the customer,** and offer it at the right moment, such as when they are happy or when their needs change. A bad upsell damages trust; a good one is a service.

Example: Sunbright Solar has 100 customers who bought systems averaging ₦200,000 each in accessories and service. A maintenance plan costs ₦50,000 and 20% of customers take it. Extra revenue = 100 × 0.20 × 50,000 = **₦1,000,000**, with no new customers to find.

Tips:

- **Understand their needs first.**
- **Show the benefit and the return,** not just the price.
- **Offer one clear option,** not a long list.
- **Bundle** related items at a fair price.
- **Check satisfaction** before asking for more.

## Handling large customers

Large customers bring big orders and big demands: formal procurement, several decision makers, long approval cycles, strict contracts, price pressure and payment terms of 30, 60 or 90 days.

How to handle them:

- **Understand their process:** who approves, what documents they need, how vendors are registered, and how long it takes.
- **Be patient and organised.** Respond fast, keep records and meet every deadline.
- **Meet requirements precisely:** compliance, certificates, insurance, references and formats.
- **Protect your cash flow.** Large customers often pay late. Negotiate terms, get a purchase order before you start and invoice promptly.
- **Watch dependence.** If one customer is **40%** of your sales, losing them would be a crisis. Keep growing other customers so no single account is more than about 20% to 30% of revenue, where possible.
- **Deliver excellently,** because a large, satisfied customer is a powerful reference.
- **Build several relationships** within the customer.
- **Write contracts carefully,** and have a lawyer review large ones.

## Try it

```task
{
  "id": "bds-m08-t1",
  "prompt": "Write a **message to a potential partner** (such as a bank, a property agent or an electrician) in 60 to 120 words: lead with value for them, propose a small pilot and say what you need.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Good morning ...",
  "rules": [
    { "label": "Opens politely", "pattern": "good (morning|afternoon)|hello|dear|hi " },
    { "label": "Leads with value for them or their customers", "pattern": "your customers|your clients|your members|you could|benefit|earn|help your" },
    { "label": "Proposes a small pilot or trial", "pattern": "pilot|trial|start with|first (five|10|ten|3|three)|small" },
    { "label": "Says what each side does or what terms", "pattern": "commission|referral fee|we (will|would)|you (will|would)|in return|share" },
    { "label": "Asks for a next step", "pattern": "meet|call|could we|can we|would you|chat" },
    { "label": "Between 60 and 120 words", "minWords": 60, "maxWords": 125 }
  ],
  "sample": "Good morning Mrs Okoro. Many of your customers who buy new shop premises struggle with high power costs in their first year. We could offer each of them a free power audit, and you would earn a 3% referral fee on every system they install. I would suggest we start with a small pilot: your team refers the first five shop owners, we handle the audit, quote and installation, and I send you a report on results. Could we meet for 20 minutes this week to agree how it would work?",
  "required": true
}
```

```task
{
  "id": "bds-m08-t2",
  "prompt": "You have **100 customers**. A maintenance plan costs **₦50,000** and **20%** of customers would take it. Work out the **extra revenue**. Then give two things you would do **before** offering it so that it helps and does not annoy customers.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Extra revenue = ...",
  "rules": [
    { "label": "20 customers", "pattern": "\\b20\\b" },
    { "label": "Extra revenue of ₦1,000,000", "pattern": "1,?000,?000" },
    { "label": "Mentions understanding needs or satisfaction first", "pattern": "needs|satisf|happy|check|understand|ask|first" },
    { "label": "Mentions showing benefit or value", "pattern": "benefit|value|return|saving|show|explain|downtime" }
  ],
  "sample": "Customers taking it = 100 x 0.20 = 20. Extra revenue = 20 x 50,000 = ₦1,000,000.\nBefore offering it I would check that each customer is satisfied with their system and understand how they use it, and I would show the benefit, for example fewer breakdowns and longer system life, not just the price.",
  "required": true
}
```

```task
{
  "id": "bds-m08-t3",
  "prompt": "One customer makes up **40%** of your sales. In 50 to 100 words, explain the **risk** and give **three actions** to reduce it.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "The risk is ...",
  "rules": [
    { "label": "Explains the risk of dependence", "pattern": "risk|depend|lose|losing|crisis|vulnerab|if they" },
    { "label": "Suggests finding new customers or diversifying", "pattern": "new customers|diversif|other customers|more customers|grow others|spread" },
    { "label": "Suggests securing the large account (contract, relationships, service)", "pattern": "contract|relationship|service|deliver|multiple contacts|retain|renew" },
    { "label": "Suggests managing cash or setting a limit", "pattern": "cash|limit|payment|deposit|20|30|percent|%" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "The risk is that if this customer leaves or pays late, I lose 40% of my sales and may face a cash crisis. I would reduce it by actively winning new customers to spread my sales, aiming for no single account above 30%. I would secure the large account with a longer contract and relationships with several people there, and deliver excellent service. I would also watch cash carefully, insisting on a purchase order and prompt invoicing.",
  "required": false
}
```

Next lesson: measuring sales.
