---
title: "Final Project: Sales Plan and Pitch"
minutes: 45
summary: Choose your product and market, build a sales plan with targets and routines, prepare and deliver a pitch and review your next steps.
---

## What you are building

You have learned to find, qualify, talk to, propose to, negotiate with, close and keep customers, and to measure and improve the process. Now you bring it together in **a sales plan** and **a pitch** for a real or realistic product.

Pick something you could really sell: a product or service from your own business, a job you are applying for, a freelance service, or a company you know. Be specific about who you sell to and what you offer. Use real prices and real customer information, and state any assumptions.

## Your project has six parts

1. **Product and market.** What you sell, the problem it solves, your price, your ideal customer profile and your main competitors.
2. **Customer understanding.** Pains and gains, decision makers and the main objections you expect, with your answers.
3. **Lead generation plan.** Your sources, the outreach messages you will use, and how you will qualify leads.
4. **Sales process and tools.** Your pipeline stages and probabilities, a CRM sheet design and your weekly routine.
5. **Targets and forecast.** A revenue target, the funnel (contacts, meetings, proposals, wins) needed to reach it, the average deal size and a weighted forecast.
6. **The pitch.** A short pitch (3 to 5 minutes, or one page) with a clear opening, the customer's problem, your solution, proof, a price and a clear next step.

## Writing and delivering the pitch

A strong pitch follows a simple shape:

1. **Hook:** a relevant question or fact about their problem.
2. **Problem:** what it costs them now, in their words and numbers.
3. **Solution:** what you offer and how it works, in plain language.
4. **Proof:** a similar customer, result, demonstration or guarantee.
5. **Offer:** price, what is included and terms.
6. **Ask:** one clear next step with a date.

Keep it short, use stories and numbers, and practise out loud until it sounds natural. Prepare for **three objections** and know your answers. After the pitch, **stop talking and listen.**

> [!TIP]
> Record yourself delivering the pitch, or practise it with a friend, then ask: Was it clear? Did you believe it? What was missing?

## Try it

```task
{
  "id": "bds-m10-t1",
  "prompt": "Describe your **product and ideal customer** in 60 to 130 words: what you sell, the problem it solves, the price, who your ideal customer is and one main competitor.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "I sell ...",
  "rules": [
    { "label": "Says what is sold", "pattern": "sell|offer|product|service|provide" },
    { "label": "Says the problem it solves", "pattern": "problem|solve|struggle|cost|lose|help" },
    { "label": "States a price", "pattern": "₦\\s?\\d|price|per " },
    { "label": "Describes the ideal customer", "pattern": "customer|shops?|clinics?|owners?|businesses|students|families|ideal" },
    { "label": "Names a competitor or alternative", "pattern": "competitor|alternative|instead|currently use|generator|rival" },
    { "label": "Between 60 and 130 words", "minWords": 60, "maxWords": 135 }
  ],
  "sample": "I sell solar inverter systems that replace diesel and petrol generators for small shops and clinics in Lagos. They solve the problem of high fuel costs, noise and breakdowns, saving a typical shop about ₦60,000 to ₦90,000 a month. A standard 5 kVA system costs ₦900,000 including installation, with a two-year warranty. My ideal customer is a shop or clinic with 3 to 20 staff that runs a generator more than six hours a day and where the owner decides. My main competitor is the generator itself, plus two other solar installers who compete mainly on price.",
  "required": true
}
```

```task
{
  "id": "bds-m10-t2",
  "prompt": "Write your **target and funnel**: a monthly revenue target, the average deal size, the number of wins needed, and the contacts, meetings and proposals needed using your conversion rates. Show the maths. At least six lines.",
  "minutes": 15,
  "rows": 9,
  "placeholder": "Target: ₦...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "States a revenue target", "pattern": "target" },
    { "label": "States the average deal size", "pattern": "average deal|deal size" },
    { "label": "States the wins needed", "pattern": "wins?|deals" },
    { "label": "Works back to contacts, meetings or proposals", "pattern": "contacts|meetings|proposals|leads" },
    { "label": "Shows maths (division, equals or conversion %)", "pattern": "=|/|÷|\\d+\\s?%" }
  ],
  "sample": "Target: ₦3,600,000 revenue a month\nAverage deal size: ₦900,000\nWins needed: 3,600,000 / 900,000 = 4 deals a month\nProposal-to-win rate: 25%, so I need 4 / 0.25 = 16 proposals\nMeeting-to-proposal rate: 50%, so I need 16 / 0.5 = 32 meetings\nContact-to-meeting rate: 10%, so I need 32 / 0.1 = 320 contacts a month, about 15 a working day",
  "required": true
}
```

```task
{
  "id": "bds-m10-t3",
  "prompt": "Write your **pitch** in 120 to 220 words: a hook, the customer's problem, your solution, proof, the offer with a price and a clear ask with a date.",
  "minutes": 15,
  "rows": 12,
  "placeholder": "Good morning ...",
  "rules": [
    { "label": "Opens with a hook (a question or a fact)", "pattern": "\\?|did you know|how much|what if|imagine" },
    { "label": "States the problem and its cost", "pattern": "problem|cost|spend|lose|losing|fuel|waste" },
    { "label": "States the solution", "pattern": "solution|system|we (offer|provide|install)|our (product|service)" },
    { "label": "Gives proof", "pattern": "customer|similar|client|guarantee|warranty|result|recently|demo" },
    { "label": "States the price", "pattern": "₦\\s?\\d" },
    { "label": "Ends with an ask and a date", "pattern": "friday|monday|tuesday|wednesday|thursday|tomorrow|next week|by \\d|this week" },
    { "label": "Between 120 and 220 words", "minWords": 120, "maxWords": 225 }
  ],
  "sample": "How much do you spend on generator fuel and repairs each month? Most shops like yours tell me between ₦80,000 and ₦150,000, and that is before the sales you lose when the generator breaks down or the noise drives customers away. That is the problem we solve. Our 5 kVA solar inverter system runs your freezer, lights and card machine all day, so the generator becomes only a backup, and you cut your fuel bill by around ₦60,000 to ₦90,000 a month. Last year we installed the same system for a pharmacy in Yaba. A year later they have had no outages and have saved over ₦900,000. The complete system with installation is ₦900,000, including a two-year warranty, and we can arrange payment in two instalments. If you would like to see it working, I can take you to visit the pharmacy this week. Can I book that for Friday at 11 am?",
  "required": true
}
```

```task
{
  "id": "bds-m10-t4",
  "prompt": "List the **three objections** you expect in your pitch and write your **answer** to each, one per line in the form \"Objection: ... Answer: ...\".",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Objection: ... Answer: ...",
  "rules": [
    { "label": "Three lines", "minLines": 3 },
    { "label": "Each line has an objection and an answer", "pattern": "objection:[^\\n]*answer:", "perLine": true },
    { "label": "Includes a price or value answer", "pattern": "payback|save|saving|value|instalment|months" },
    { "label": "Includes a trust or proof answer", "pattern": "warranty|reference|visit|customer|guarantee|proof|trial" }
  ],
  "sample": "Objection: it is too expensive. Answer: it pays for itself in about 15 months through fuel savings, and we can split payment into two instalments.\nObjection: I do not know your company. Answer: you can visit a pharmacy we installed a year ago, and we give a two-year warranty.\nObjection: not now. Answer: each month of delay costs you about ₦90,000 in fuel, so let us agree a date to review it next month.",
  "required": false
}
```

When you are done, submit your complete sales plan and pitch as your final project.
