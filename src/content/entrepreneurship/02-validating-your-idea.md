---
title: Validating Your Idea
minutes: 35
summary: Identify your real customer, interview and survey them well, test demand cheaply, build a minimum viable product and decide to go, change or stop.
---

## Who your customer really is

"Everyone" is not a customer. The more clearly you describe **one** type of customer, the easier it is to find them, understand them and sell to them.

Describe your **target customer** with:

- **Who they are:** age range, job, location, income, life stage.
- **What they need or struggle with** that your product addresses.
- **What they do now** to solve the problem, and what it costs them.
- **Where to find them:** which places, groups and platforms.
- **What would make them buy:** price, convenience, trust, quality.

It helps to distinguish the **user** (who uses the product), the **buyer** (who pays) and the **influencer** (who recommends). A school lunch service has pupils as users and parents as buyers; selling only to pupils would not work.

## Customer interviews and surveys

**Interviews** teach you the most, because you hear the story behind the answers. Aim for 10 to 20 short conversations with people who match your target customer.

Rules for good interviews:

- **Ask about the past and the present, not the future.** "Tell me about the last time you ordered lunch at work" is better than "Would you use a lunch delivery service?" People are polite and guess badly about what they will do.
- **Ask open questions:** how, what, tell me about.
- **Listen more than you talk,** and do not pitch your idea.
- **Dig into the problem:** "What was hard about that? What did you try? What did it cost?"
- **Look for real behaviour:** money or time they already spend.
- **Take notes** and look for patterns across interviews.

A **survey** reaches more people and gives numbers. Keep it short, with simple questions, and ask only what you need. Use it **after** interviews, so you know what to ask. Be careful: a friendly crowd will say "yes, great idea." Ask for **commitments** instead of opinions.

## Testing demand cheaply

Before you spend on stock, equipment or premises, test if people will pay:

- **Pre-sell.** Offer the product and take orders or deposits before you make it.
- **Landing page or a simple advert** describing the offer, with a way to sign up or order.
- **Social media post or WhatsApp broadcast** to your target group.
- **A pilot:** serve a few customers by hand.
- **Smoke test:** show the product (with photos or a sample) and see who asks for the price.

Measure behaviour, not compliments. Example: you survey 50 people and 18 say they would buy. That is 18 ÷ 50 = **36%**, but only if they actually pay. You then ask for a ₦5,000 deposit: **10** pay. Now you have a real signal: 10 deposits of ₦5,000 = **₦50,000**, and 10 ÷ 50 = **20%** conversion from your audience to paying customers.

## Minimum viable product

A **minimum viable product (MVP)** is the simplest version that lets you learn from real customers. It is not a bad product. It is a **focused** one: only the features that matter for the first test.

Examples:

- A restaurant concept starts as a pre-order lunch box service from a home kitchen.
- An app idea starts as a WhatsApp group and a spreadsheet, run by hand.
- A clothing line starts with ten pieces and one fabric.

Build the MVP in days or weeks, not months. Decide in advance **what you want to learn** and **how you will know**.

## Go, change or stop

Set your decision rule **before** the test, so you are honest afterwards.

Example: *"If at least 15 of 50 people pay a deposit in two weeks, we go. If 5 to 14, we change something (price, offer or audience) and test again. If fewer than 5, we stop or pick a new idea."*

After the test:

- **Go:** the evidence is strong. Move to the next stage (business model, planning, set up).
- **Change (pivot):** customers show interest but not in the form you offered. Adjust the customer, the problem, the price or the solution, then test again.
- **Stop:** the evidence says no. This is a success, not a failure: you saved money and time. Take what you learned to a better idea.

## Try it

```task
{
  "id": "ent-m02-t1",
  "prompt": "Describe your **target customer** in 50 to 110 words: who they are, what they struggle with, what they do now and what it costs them, and where you can find them.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "My target customer is ...",
  "rules": [
    { "label": "Says who they are (age, job, place)", "pattern": "aged|age|work|student|owner|parent|live|based|in lagos|in abuja|trader|professional|years" },
    { "label": "Says what they struggle with", "pattern": "struggle|problem|cannot|can't|difficult|hard|waste|lose" },
    { "label": "Says what they do now or what it costs", "pattern": "now|currently|at the moment|spend|cost|pay|₦" },
    { "label": "Says where to find them", "pattern": "find|reach|whatsapp|instagram|facebook|market|office|campus|group|church|street|online" },
    { "label": "Between 50 and 110 words", "minWords": 50, "maxWords": 115 }
  ],
  "sample": "My target customer is an office worker aged 25 to 40 who works on Allen Avenue in Ikeja and has only about 30 minutes for lunch. They struggle with a 15-minute queue at the one canteen nearby, so they skip lunch or eat snacks, and they currently spend ₦1,500 to ₦2,500 a day on a mixed bag of food. I can find them in their office WhatsApp groups, through office receptionists and by visiting offices at lunchtime with sample boxes.",
  "required": true
}
```

```task
{
  "id": "ent-m02-t2",
  "prompt": "Write **six interview questions** for your target customer that ask about **past behaviour** and the **problem**, not about your idea. One per line, each ending in a question mark.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Tell me about the last time you ...?",
  "rules": [
    { "label": "Six questions", "minLines": 6 },
    { "label": "Every line is a question", "pattern": "\\?\\s*$", "perLine": true },
    { "label": "At least one asks about the last time or what happened", "pattern": "last time|what happened|tell me about|walk me through" },
    { "label": "Asks about what they do now or have tried", "pattern": "do now|currently|tried|usually|how do you|what do you do" },
    { "label": "Asks about cost, time or money", "pattern": "cost|spend|pay|time|money|how much|how long" },
    { "label": "Does not ask 'would you buy / would you use'", "pattern": "would you (buy|use|pay)", "absent": true }
  ],
  "sample": "Tell me about the last time you bought lunch at work. What happened?\nHow do you usually get lunch on a working day?\nWhat is the hardest part of getting lunch?\nWhat have you tried to fix that, and how did it go?\nHow much do you spend on lunch in a week?\nHow long does it take you from leaving your desk to eating?",
  "required": true
}
```

```task
{
  "id": "ent-m02-t3",
  "prompt": "Design a **test of demand** for your idea. In 60 to 130 words, say what you will do, how many people you will reach, what you will count and your **go, change and stop rules** with numbers.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "I will test demand by ...",
  "rules": [
    { "label": "Describes the test (pre-sell, deposit, landing page, pilot)", "pattern": "pre-?sell|deposit|pilot|landing page|test|order|sign" },
    { "label": "Gives the number of people to reach", "pattern": "\\d+\\s*(people|customers|workers|students|contacts)|\\b\\d{2,}\\b" },
    { "label": "States a go rule", "pattern": "go|proceed|continue" },
    { "label": "States a stop or change rule", "pattern": "stop|change|pivot|drop|rethink" },
    { "label": "Uses numbers for the decision", "pattern": "at least \\d+|fewer than \\d+|\\d+ (or more|to \\d+)|if \\d+" },
    { "label": "Between 60 and 130 words", "minWords": 60, "maxWords": 135 }
  ],
  "sample": "I will pre-sell lunch boxes to 50 office workers in three WhatsApp groups for two weeks, asking each interested person for a ₦5,000 deposit toward a week of meals. I will count deposits paid, not likes. If at least 15 people pay, I will go and start the pilot. If 5 to 14 pay, I will change something, such as the price or the menu, and test again. If fewer than 5 pay, I will stop and choose a different idea or customer.",
  "required": true
}
```

Next lesson: the business model and value proposition.
