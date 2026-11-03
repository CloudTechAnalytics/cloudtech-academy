---
title: Local and International Sourcing, and Ethics
minutes: 25
summary: Compare local and international sourcing on real cost and lead time, recognise conflicts of interest and bribery, and buy in a sustainable and ethical way.
---

## Local versus international sourcing

Neither is always better. The right choice depends on the item, the volume, the urgency and the risk.

**Local sourcing** is buying within Nigeria. Its strengths: short lead times, easy visits and inspection, simple payment in naira, quick problem solving, support for local jobs and industry. Its weaknesses: sometimes higher prices, limited choice or capacity, and quality that varies.

**International sourcing** is buying from abroad. Its strengths: often lower unit prices, wider choice, specialist products and new technology. Its weaknesses: longer lead times, shipping and customs, exchange rate risk, advance payment, harder returns and disputes, and more paperwork.

Compare on **total landed cost** and risk, never on the quoted unit price alone.

## Import costs and lead times

For an imported item, add to the supplier's price:

- international freight and insurance
- import duty and VAT
- clearing agent and port charges
- local transport to your store
- bank and payment charges
- the effect of the exchange rate between order and payment
- an allowance for losses and delays

Example: an imported item is quoted at ₦700 a unit for 1,000 units (₦700,000). Freight and insurance are ₦120,000, duty and VAT ₦150,000, clearing and port ₦60,000 and transport ₦20,000. The landed cost is 700,000 + 120,000 + 150,000 + 60,000 + 20,000 = **₦1,050,000**, which is ₦1,050 a unit. A local supplier at ₦950 a unit is cheaper, delivers in days and carries less risk.

Lead time also costs money. A six-week lead time means holding more stock, tying up cash and reacting slowly to demand. Build it into your reorder points (module 8). The Import, Export & Mini Importation course builds a full landed cost calculator.

## Conflicts of interest

A **conflict of interest** exists when a personal interest could influence, or look as if it influences, a business decision. In procurement it includes:

- awarding business to a relative, friend or a company you own or work for
- taking a second job with a supplier
- accepting gifts, hospitality or favours from suppliers
- sharing inside information about one bid with another supplier

The rules are simple:

1. **Declare** the interest to your manager in writing.
2. **Step back** from the decision.
3. **Let someone else** decide.
4. **Record** it.

Even the *appearance* of a conflict damages trust, so declare early.

## Bribery and corruption

**Bribery** is offering, giving, asking for or accepting something of value to influence a decision. It includes cash, gifts, "commissions" and "facilitation payments". In Nigeria it is a criminal offence, and public procurement is governed by the Public Procurement Act and enforced by anti-corruption agencies. Companies can also be liable under the laws of other countries where they do business.

Practical rules:

- Never ask for or accept money or valuable gifts from suppliers. A small corporate gift, openly recorded and within the policy, may be acceptable; when in doubt, decline.
- Never pay a bribe, however small, however "normal" it is said to be.
- Keep records of every gift offered, accepted or declined.
- Report pressure or offers through the proper channel (a manager, compliance or a whistleblowing line).
- Be cautious of agents or "consultants" who say they can "fix" a decision.

The cost of one bribe can be a lost job, a criminal record, a banned company and the loss of every legitimate customer.

## Sustainable and ethical procurement

Buyers also carry responsibility for how goods are made and delivered. Ethical procurement considers:

- **Labour standards:** no child or forced labour, safe conditions, fair pay.
- **Environment:** waste, emissions, packaging, energy use, responsible materials.
- **Local content and inclusion:** opportunities for local and small businesses where they can compete fairly.
- **Fair treatment of suppliers:** paying on time and on the agreed terms.
- **Transparency:** open, competitive processes and honest dealing.

Ask suppliers about their practices, include simple standards in your terms and check them. Cheap goods made in unsafe or unlawful conditions are a risk to your reputation and sometimes to the law.

## Try it

```task
{
  "id": "proc-m11-t1",
  "prompt": "An imported item is quoted at **₦700 a unit for 1,000 units**. Freight and insurance ₦120,000, duty and VAT ₦150,000, clearing and port ₦60,000, local transport ₦20,000. Work out the **landed cost** in total and per unit, and compare it with a local supplier at **₦950 a unit**. Say which you would choose and what other factors matter.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Goods = ...",
  "rules": [
    { "label": "Goods of ₦700,000", "pattern": "700,?000" },
    { "label": "Landed cost of ₦1,050,000", "pattern": "1,?050,?000" },
    { "label": "Per unit of ₦1,050", "pattern": "1,?050\\b" },
    { "label": "Chooses the local supplier", "pattern": "local" },
    { "label": "Mentions lead time, risk or exchange rate", "pattern": "lead time|risk|exchange|delay|time|stock" }
  ],
  "sample": "Goods = 1,000 x 700 = ₦700,000.\nLanded cost = 700,000 + 120,000 + 150,000 + 60,000 + 20,000 = ₦1,050,000, or ₦1,050 a unit.\nThe local supplier at ₦950 a unit (₦950,000) is cheaper, so I would choose local. It also delivers faster, needs less stock and carries no exchange rate or customs delay risk.",
  "required": true
}
```

```task
{
  "id": "proc-m11-t2",
  "prompt": "Your cousin owns a company that has submitted a quote for your department's contract, and a supplier has sent you a gift hamper worth ₦80,000. In 50 to 110 words, say what you will do about each.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "I will declare ...",
  "rules": [
    { "label": "Declares the conflict of interest in writing", "pattern": "declare|disclose|tell|inform|report" },
    { "label": "Steps back from the decision", "pattern": "step back|withdraw|not take part|excuse|recuse|not be involved|let someone else|other person" },
    { "label": "Declines or reports the gift", "pattern": "decline|return|refuse|record|register|report" },
    { "label": "Refers to policy or fairness", "pattern": "policy|fair|compan|trust|appear" },
    { "label": "Between 50 and 110 words", "minWords": 50, "maxWords": 115 }
  ],
  "sample": "I will declare my cousin's interest to my manager in writing, step back from evaluating or deciding on that contract, and let another person handle it so the process stays fair. I will politely return the gift hamper with a note that our policy does not allow gifts of that value, and record that it was offered and declined. Even the appearance of favouring a relative or a supplier damages trust in the company, so I would rather be open early.",
  "required": true
}
```

```task
{
  "id": "proc-m11-t3",
  "prompt": "Write **five questions** you would put to a supplier about their ethical and sustainable practices. One per line, each ending with a question mark.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Do you ...?",
  "rules": [
    { "label": "Five questions", "minLines": 5 },
    { "label": "Every line is a question", "pattern": "\\?\\s*$", "perLine": true },
    { "label": "Asks about labour or working conditions", "pattern": "labou?r|worker|wage|child|safe|conditions" },
    { "label": "Asks about the environment or waste", "pattern": "environment|waste|emission|energy|recycl|packag" },
    { "label": "Asks about gifts, bribery or conflicts", "pattern": "gift|brib|corrupt|conflict|policy" }
  ],
  "sample": "Do you employ any child or forced labour, and how do you check your own suppliers?\nHow do you keep your workers safe and pay fair wages?\nWhat do you do to reduce waste and energy use in your factory?\nCan you use less or recyclable packaging for our orders?\nDo you have a written policy on bribery, gifts and conflicts of interest, and how do you enforce it?",
  "required": false
}
```

Next lesson: your own procurement project.
