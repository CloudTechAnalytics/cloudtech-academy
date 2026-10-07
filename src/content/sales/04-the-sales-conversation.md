---
title: The Sales Conversation
minutes: 30
summary: Prepare for a sales meeting, open and build rapport, ask strong discovery questions, listen and take notes and present your solution in terms of the customer's needs.
---

## Preparing for a meeting

Preparation separates confident salespeople from nervous ones. Before any meeting or call:

1. **Know the customer.** Check their website, social media, news and what you already know. Know their business, size, products, customers and recent changes.
2. **Know the person.** Their role, background, and what they are likely to care about.
3. **Set your objective.** What is the outcome you want from this meeting? Usually a **next step**, such as a site visit, a quote request or a decision.
4. **Plan your questions,** more than your talking points.
5. **Prepare materials:** a short presentation, samples, proof (case studies, photos, references), a price guide and a notebook.
6. **Anticipate objections** and prepare honest answers.
7. **Check the logistics:** time, place, directions, link, charged phone, spare materials.

A simple agenda helps: *Introductions, understand your situation, show how we might help, agree next steps.*

## Opening and building rapport

The first minutes set the tone.

- **Be on time,** presentable and warm. Greet properly, with appropriate local courtesies.
- **Be genuinely interested.** A brief, real comment about their business is better than forced small talk.
- **State the purpose and agenda** and check it suits them: *"I'd like to understand how you run your power now, show you what might help, and see if a next step makes sense. Does that work?"*
- **Show you respect their time.** Agree how long you have.
- **Mind your body language and tone:** open posture, eye contact where appropriate, calm voice.

Rapport is not about being everybody's friend. It is about being **trustworthy, interested and clear.**

## Asking good discovery questions

**Discovery** is where you uncover the real situation. Good questions get the customer talking about their problems and their goals, and help them see the value of fixing them.

A useful framework is **SPIN:**

| Type | Purpose | Example |
| :-- | :-- | :-- |
| **Situation** | Understand the current state (use sparingly; research first) | "How do you power the shop at the moment?" |
| **Problem** | Uncover difficulties and dissatisfaction | "What problems do you have with the generator?" |
| **Implication** | Explore the effect and cost of the problem | "How much sales do you lose when the power is out?" |
| **Need-payoff** | Let them describe the value of a solution | "If you could cut fuel costs in half, what would that mean for the business?" |

Tips:

- **Use open questions** (how, what, why, tell me about) for depth, and closed ones to confirm.
- **Dig deeper** with "Can you tell me more about that?" and "What happened then?"
- **Ask about money, time and people** affected.
- **Ask who else is involved** and how decisions are made.
- **Do not interrogate.** Keep it a conversation, and explain why you are asking if needed.
- **Do not jump to solutions** too early.

## Listening and note taking

Most salespeople talk too much. Aim to **listen at least as much as you speak.**

- **Give full attention.** Put the phone away. Do not plan your reply while they talk.
- **Pause** before answering. Silence invites more detail.
- **Reflect and summarise:** "So the fuel costs about ₦120,000 a month, and the generator broke down twice last month. Is that right?"
- **Notice emotion** and what matters most to them.
- **Take notes** of facts, numbers, names, needs, concerns, deadlines and promises. Tell them you are doing it. Review them straight after and send a short summary.
- **Write down the customer's own words;** they are useful in your proposal.

## Presenting your solution

Only after you understand the customer should you present. Then:

1. **Recap their situation and priorities** in their words.
2. **Link each feature to a benefit** that answers a need they described. A **feature** is what it is; a **benefit** is what it does for them. *"The system has a 5 kVA inverter (feature), so it can run your freezer and lights all day without the generator (benefit), cutting your fuel bill by about ₦90,000 a month (result)."*

3. **Show proof:** a similar customer, numbers, a demo, a photo, a guarantee.
4. **Keep it short and visual,** and focus on what matters to them, not everything you can do.
5. **Check understanding:** "Does this match what you need?"
6. **Ask for the next step.**

A strong close to a meeting is a clear next step with a date: *"I'll send you a quote by Wednesday. Can we speak on Friday to go through it?"* Send a **follow-up summary** within a day.

## Try it

```task
{
  "id": "bds-m04-t1",
  "prompt": "Write **eight discovery questions** for a prospect, covering situation, problem, implication and need-payoff (two of each). One per line, labelled with the type, each ending with a question mark.",
  "minutes": 14,
  "rows": 10,
  "placeholder": "Situation: How do you ...?",
  "rules": [
    { "label": "Eight lines", "minLines": 8 },
    { "label": "Every line is a question", "pattern": "\\?\\s*$", "perLine": true },
    { "label": "Situation questions", "pattern": "situation", "min": 2 },
    { "label": "Problem questions", "pattern": "problem", "min": 2 },
    { "label": "Implication questions", "pattern": "implication", "min": 2 },
    { "label": "Need-payoff questions", "pattern": "need-?payoff", "min": 2 }
  ],
  "sample": "Situation: How do you power the shop at the moment?\nSituation: How many hours a day does the generator run?\nProblem: What problems do you have with the generator?\nProblem: What frustrates you most about the cost of fuel?\nImplication: How much sales do you lose when the power goes out?\nImplication: What does that do to your profit each month?\nNeed-payoff: If you could cut fuel costs in half, what would that mean for the business?\nNeed-payoff: How would reliable power change how you serve customers?",
  "required": true
}
```

```task
{
  "id": "bds-m04-t2",
  "prompt": "A customer says their generator costs **₦120,000** a month and broke down **twice** last month, losing sales. Write a short **presentation of your solution** (60 to 120 words) that recaps what they said, links a feature to a benefit and a result, gives a bit of proof and asks for a next step.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "You told me ...",
  "rules": [
    { "label": "Recaps the customer's words", "pattern": "you (told|said|mentioned)|so (your|the)|as you" },
    { "label": "Links a feature to a benefit", "pattern": "so (that )?you|which means|that means|so it can" },
    { "label": "States a result with a number", "pattern": "₦\\s?\\d|\\d+\\s?%|\\d+ hours" },
    { "label": "Gives proof (another customer, demo, guarantee)", "pattern": "customer|similar|clients?|guarantee|warranty|demo|recently" },
    { "label": "Asks for a next step", "pattern": "next step|could we|can we|would you|visit|quote|friday|monday|tuesday|wednesday|thursday|\\bby\\b" },
    { "label": "Between 60 and 120 words", "minWords": 60, "maxWords": 125 }
  ],
  "sample": "You told me the generator costs about ₦120,000 a month and broke down twice last month, costing you sales. A 5 kVA solar inverter system would run your freezer, lights and card machine all day, which means the generator would only be a backup, cutting your fuel bill by around ₦90,000 a month. A similar pharmacy in Yaba has used one for a year with no outages, and we give a two-year warranty. Could I prepare a quote this week and visit on Friday to go through it?",
  "required": true
}
```

```task
{
  "id": "bds-m04-t3",
  "prompt": "Write a **meeting preparation checklist** with at least seven items, one per line, covering the customer, the person, your objective, questions, materials, objections and logistics.",
  "minutes": 8,
  "rows": 9,
  "placeholder": "Research the customer's business ...",
  "rules": [
    { "label": "At least seven lines", "minLines": 7 },
    { "label": "Researching the customer or person", "pattern": "research|website|social|background|know" },
    { "label": "Setting an objective or next step", "pattern": "objective|goal|next step|outcome" },
    { "label": "Preparing questions", "pattern": "question" },
    { "label": "Preparing materials or proof", "pattern": "material|proof|case stud|sample|presentation|brochure|price" },
    { "label": "Preparing for objections", "pattern": "objection" },
    { "label": "Logistics (time, place, directions, link)", "pattern": "time|place|directions|link|travel|phone|charged" }
  ],
  "sample": "Research the customer's business, products and recent news.\nLearn about the person I am meeting and their role.\nSet my objective: agree a site visit or quote request as the next step.\nPlan my discovery questions.\nPrepare a short presentation and a similar customer's results as proof.\nBring a price guide, brochure and samples.\nThink of likely objections and my honest answers.\nCheck the time, place, directions and that my phone is charged.",
  "required": false
}
```

Next lesson: objections and negotiation.
