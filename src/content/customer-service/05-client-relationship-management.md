---
title: Client Relationship Management
minutes: 25
summary: Understand client needs, set and manage expectations, keep regular contact and follow up and look after key clients.
---

## Understanding client needs

A **client relationship** is built over time. Beyond solving single requests, you aim to understand your clients' **goals, problems and way of working,** so you can help them succeed. A client who feels understood stays, buys more and recommends you.

How to understand a client:

- **Ask good questions** at the start and regularly: *"What are you trying to achieve this year? What worries you most? How do you prefer to communicate?"*
- **Learn their business:** products, customers, competitors, seasons, challenges.
- **Know the people:** who decides, who uses your service, who influences, and their preferences and personalities.
- **Keep records** in a simple client file or CRM: contact details, history, preferences, agreements, important dates and notes from conversations.
- **Listen for unstated needs:** often the client asks for X when what they need is Y.
- **Review regularly:** needs change.

**Client profile example:** *Bright Schools Ltd: three schools, 600 pupils. Decision maker: the proprietor, Mrs Eze. Main contact: the bursar. Goal: reduce fees collection time. Prefers WhatsApp for quick things and email for invoices. Busy at term start. Pays in 30 days.*

## Setting and managing expectations

Many client problems come from **mismatched expectations.** Prevent them from the start.

- **Be clear about what you will deliver, when and for how much.** Put it in writing (a proposal, contract or confirmation email).
- **Be honest about limits, risks and what is not included.**
- **Under-promise and over-deliver:** give a realistic date, not the fastest possible one. Delivering early delights; delivering late damages trust.
- **Explain the process and what you need from them** (information, approvals, payment), and by when.
- **Agree how you will communicate:** channels, frequency, who the contacts are and response times.
- **Check understanding:** "Let me confirm what we agreed..."
- **Tell them early when something changes,** with the reason and a new plan. Never let clients discover problems by themselves.
- **Handle scope changes openly:** if a client asks for extra, explain the impact on time and cost and agree before proceeding.

Example: a client asks for a report in two days. You know it needs four. Say: *"To do it properly, we need four working days, so I can deliver on Friday. If it is urgent, I can give you a one-page summary by Wednesday and the full report on Friday. Which would help most?"*

## Regular contact and follow-up

Out of sight, out of mind. Stay in touch **before** the client needs to chase you.

- **Plan contact:** a schedule for each client (weekly for active projects, monthly or quarterly for others).
- **Make each contact useful:** progress, results, ideas, relevant news, a helpful tip, not only "just checking in."
- **Follow up after meetings** within a day with a short summary of what was agreed and the next steps.
- **Follow up after delivery:** *"Has everything gone as you expected? Is there anything we should improve?"*
- **Remember important dates:** contract renewals, birthdays of key contacts, festive seasons (a short message), anniversaries of working together.
- **Respond quickly** to client messages, and keep promises about call-backs.
- **Ask for feedback** regularly, and act on it.
- **Reactivate quiet clients:** a friendly message, an update or a check on their needs.

**Keep a contact log** (date, who, what was said, next step). It prevents things being dropped and helps colleagues cover for you.

## Handling key clients

Not all clients are equal in value. Often a small share of clients produce most of the revenue (the **Pareto principle**). Example: you have **50 clients** and **₦20,000,000** in annual revenue. Your top **10 clients** (20%) produce **₦16,000,000** (80%). Losing one of them would hurt far more than losing one of the smaller ones.

For **key clients:**

- **Know them deeply** and appoint a named **account manager.**
- **Build several relationships** within the client's organisation (not only one contact).
- **Meet regularly,** including periodic **reviews** (for example quarterly): what has been delivered, results, issues, upcoming needs, and how to improve.
- **Write an account plan:** goals, opportunities, risks, key contacts and actions.
- **Anticipate needs** and bring ideas before they ask.
- **Respond first and fastest** to their problems.
- **Protect the relationship:** act quickly on any sign of dissatisfaction.
- **Do not take them for granted,** and do not become over-dependent: aim to keep any single client below a safe share of revenue.
- **Reward loyalty** fairly, with recognition, priority service or special terms.

Segment the rest: **mid-level clients** get regular, lighter attention; **small clients** get efficient, standard service and, where sensible, self-service options.

Handle difficult clients professionally: stay calm, keep records, set boundaries and escalate where needed. Sometimes ending a relationship (politely) is the right decision for a client who is abusive, never pays or costs more than they bring.

## Try it

```task
{
  "id": "cscm-m05-t1",
  "prompt": "A client asks for a report in **two days** that you know needs **four**. Write your reply in 60 to 120 words that sets a realistic expectation and offers an option.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Thank you for ...",
  "rules": [
    { "label": "Thanks or acknowledges", "pattern": "thank|appreciate|understand" },
    { "label": "Explains the real time needed", "pattern": "four|4 (working )?days|friday|properly" },
    { "label": "Offers an option (summary first, prioritise)", "pattern": "option|summary|one-?page|first|if it is urgent|alternatively|which would" },
    { "label": "Asks the client to choose or confirm", "pattern": "\\?|let me know|which|confirm" },
    { "label": "Between 60 and 120 words", "minWords": 60, "maxWords": 125 }
  ],
  "sample": "Thank you for the request, Mrs Eze, I understand it is important. To do the report properly we need four working days, so I can deliver the full version on Friday. If it is urgent, I can give you a one-page summary of the key findings by Wednesday and send the complete report on Friday. Which would help you most? I would rather agree a realistic date now than promise two days and risk giving you something incomplete. Please let me know and I will confirm in writing.",
  "required": true
}
```

```task
{
  "id": "cscm-m05-t2",
  "prompt": "**50 clients** produce **₦20,000,000** a year. The top **10** produce **₦16,000,000**. Work out the top clients' share of clients and of revenue, and the average annual revenue per top client and per other client. What does this tell you about where to focus?",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Share of clients = ...",
  "rules": [
    { "label": "20% of clients", "pattern": "\\b20\\s?%" },
    { "label": "80% of revenue", "pattern": "\\b80\\s?%" },
    { "label": "₦1,600,000 per top client", "pattern": "1,?600,?000" },
    { "label": "₦100,000 per other client", "pattern": "100,?000" },
    { "label": "Says focus on key clients while serving others efficiently", "pattern": "focus|key clients|top|protect|attention|efficient" }
  ],
  "sample": "Top clients are 10 / 50 = 20% of clients and 16m / 20m = 80% of revenue.\nAverage per top client = 16,000,000 / 10 = ₦1,600,000. Average per other client = 4,000,000 / 40 = ₦100,000.\nI would focus the most attention on the key clients and protect those relationships, while serving the other clients efficiently.",
  "required": true
}
```

```task
{
  "id": "cscm-m05-t3",
  "prompt": "Write a **key client account plan** for one client in at least eight lines: the client and their main goal, key contacts and roles, how you will contact them (frequency and method), their likely needs, one risk and your action, and the date of the next review.",
  "minutes": 15,
  "rows": 10,
  "placeholder": "Client: ...\nGoal: ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Client and goal", "pattern": "client[\\s\\S]*goal|goal[\\s\\S]*client" },
    { "label": "Key contacts with roles", "pattern": "contact|decision maker|bursar|manager|owner|director" },
    { "label": "Contact frequency and method", "pattern": "weekly|monthly|quarterly|every[\\s\\S]*(call|email|whatsapp|meeting)" },
    { "label": "Needs or opportunities", "pattern": "need|opportunit|could|upcoming" },
    { "label": "Risk and action", "pattern": "risk[\\s\\S]*(action|will|plan)" },
    { "label": "Next review date", "pattern": "review|next" }
  ],
  "sample": "Client: Bright Schools Ltd, three schools with 600 pupils\nGoal: collect school fees faster and reduce the bursar's workload\nKey contacts: the proprietor Mrs Eze (decision maker), the bursar Mr Ade (day-to-day), the head teacher (user)\nContact plan: weekly WhatsApp update during term start, a monthly call, and a quarterly review meeting\nLikely needs: online fee reminders, term-start reports and training for new staff\nOpportunity: add the fourth school opening next year\nRisk: the bursar leaves and the relationship weakens; action: build a relationship with the head teacher and the proprietor\nNext review: first week of the next term",
  "required": false
}
```

Next lesson: service standards and systems.
