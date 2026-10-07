---
title: Service Standards and Systems
minutes: 25
summary: Set service standards and scripts, keep tickets and records with simple tools, work well in a team and escalate properly.
---

## Service standards and scripts

A **service standard** is a clear, measurable promise about how customers will be served. Without standards, service depends on who is on duty and what kind of day they are having. Standards make quality **consistent,** and they give staff clear targets and customers clear expectations.

Good standards are **specific, measurable, realistic and communicated.** Examples:

- Greet every customer within **10 seconds.**
- Answer calls within **three rings.**
- Reply to WhatsApp messages within **15 minutes** during opening hours.
- Reply to emails within **4 working hours.**
- Resolve **80%** of queries at first contact.
- Deliver orders on the day promised **95%** of the time.
- Return calls within **2 hours.**
- Issue refunds within **3 working days** of approval.

Write them down, explain **why** they matter, train staff, display them where useful, and measure performance (module 7).

**Scripts and templates** save time and prevent mistakes, but should sound human. Use them for:

- **Greetings and closings** (phone, chat, in person).
- **Common questions** (opening hours, prices, delivery, returns).
- **Difficult messages** (delays, declined requests, apologies).
- **Complaint handling steps.**

Guidelines for scripts: keep them **short and flexible** (a guide, not a robot recording), **personalise** with the customer's name and situation, **review and update** them, and let staff improve them. Do not read word for word in a flat voice.

## Tickets, records and tools

When many requests come in, you need a system so that **nothing is lost, everything is tracked and customers do not repeat themselves.**

A **ticket** (or case) is a record of a customer request or problem. A good ticket records:

- **Ticket number** (unique).
- **Date and time received,** and channel.
- **Customer name and contact details.**
- **Description of the issue** or request.
- **Category** (billing, delivery, product fault, general question).
- **Priority** (urgent, normal, low).
- **Owner:** who is responsible.
- **Status:** new, in progress, waiting for customer, resolved, closed.
- **Actions taken** and dates.
- **Resolution** and the date.
- **Customer feedback.**

Tools range from simple to advanced:

- **A shared spreadsheet or notebook:** enough for a small business, if it is updated consistently.
- **WhatsApp Business** labels, notes and quick replies.
- **A free or low-cost helpdesk or CRM:** ticketing, shared inboxes, templates, reporting.
- **Call logs and shared email inboxes.**

Principles: **record every contact,** use **consistent categories,** update promptly, **protect customer data** (limited access, no sharing, secure storage, in line with data protection law) and **review the records** to find patterns.

Example of a simple ticket log row: *#0147 | 12 March 10:15 | WhatsApp | Mrs Ade | Wrong item delivered | Delivery | High | Chidi | In progress | Replacement ordered, rider assigned | Resolve by 14 March.*

## Working in a team

Good service is a team effort. A customer deals with the business, not an individual, so what one person does affects everyone.

- **Share information:** log issues and handovers so the next person knows what happened.
- **Support colleagues:** cover breaks and peaks, help with difficult customers and share knowledge.
- **Communicate clearly:** brief handovers at shift change; team huddles at the start of the day.
- **Know who does what:** roles, specialties and who to ask.
- **Be consistent:** the customer should get the same answer from anyone.
- **Do not blame colleagues or other departments in front of customers.** Say, "I will make sure this is fixed."
- **Learn together:** share good examples and mistakes without blame.
- **Give and receive feedback** respectfully.
- **Recognise good service,** from customers and colleagues.

Managers set the tone: they listen, equip and support their teams, and they model the behaviour they expect.

## Escalation

**Escalation** means passing a problem to someone with more authority, knowledge or time. It is **not a failure;** it is the right step when you cannot solve something.

When to escalate:

- The customer asks for a manager (and the issue is serious).
- The solution is outside your authority (large refunds, exceptions).
- The issue is complex, technical or legal.
- Safety, security or serious complaints are involved (abuse, threats, injury).
- A deadline or service level is about to be missed.
- A problem keeps recurring.

**Set up levels and time limits:**

| Level | Who | Handles | Time limit |
| :-- | :-- | :-- | :-- |
| 1 | Front-line staff | Most queries and complaints | Try to resolve at first contact |
| 2 | Supervisor / senior agent | Complex issues, small exceptions | 4 hours |
| 3 | Manager | Serious complaints, larger refunds, policy exceptions | 1 working day |
| 4 | Director / owner | Major incidents, legal and reputation risks | Same day |

**How to escalate well:**

1. **Tell the customer** what you are doing and why: "I am going to ask my manager, who can approve this. I will call you back by 3 pm."
2. **Brief the next person fully:** facts, what has been tried, what the customer wants and the deadline, so the customer does not repeat the story.
3. **Stay in touch** with the customer until it is resolved.
4. **Follow up** and close the loop.
5. **Learn** from why it needed escalating, and fix the process or train staff.

## Try it

```task
{
  "id": "cscm-m06-t1",
  "prompt": "Write **eight service standards** for a business of your choice, one per line. Each must be **specific and measurable** (a time, a percentage or a number).",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Greet every customer within 10 seconds",
  "rules": [
    { "label": "Eight lines", "minLines": 8 },
    { "label": "Every line contains a number", "pattern": "\\d+", "perLine": true },
    { "label": "Includes a greeting or answering standard", "pattern": "greet|answer|welcome|rings" },
    { "label": "Includes a response time", "pattern": "within|reply|respond|return" },
    { "label": "Includes a resolution or delivery standard", "pattern": "resolve|resolution|deliver|refund|issue" }
  ],
  "sample": "Greet every customer within 10 seconds\nAnswer phone calls within 3 rings\nReply to WhatsApp messages within 15 minutes during opening hours\nReply to emails within 4 working hours\nReturn missed calls within 2 hours\nResolve 80% of queries at first contact\nIssue approved refunds within 3 working days\nDeliver 95% of orders on the day promised",
  "required": true
}
```

```task
{
  "id": "cscm-m06-t2",
  "prompt": "Design a **ticket log** for your business: list at least **ten columns**, one per line, and then write **two example rows** as realistic entries.",
  "minutes": 12,
  "rows": 14,
  "placeholder": "Ticket number\nDate and time\n...\nRow 1: ...",
  "rules": [
    { "label": "At least twelve lines", "minLines": 12 },
    { "label": "Includes ticket number, date, customer, issue", "pattern": "ticket[\\s\\S]*date[\\s\\S]*customer[\\s\\S]*(issue|description)" },
    { "label": "Includes priority, owner and status", "pattern": "priority[\\s\\S]*owner[\\s\\S]*status|owner[\\s\\S]*status[\\s\\S]*priority|status[\\s\\S]*priority" },
    { "label": "Includes resolution", "pattern": "resolution|resolved" },
    { "label": "Includes two example rows", "pattern": "row 1[\\s\\S]*row 2|#\\d+[\\s\\S]*#\\d+" }
  ],
  "sample": "Ticket number\nDate and time received\nChannel\nCustomer name\nContact details\nIssue description\nCategory\nPriority\nOwner\nStatus\nResolution and date\nRow 1: #0147 | 12 March 10:15 | WhatsApp | Mrs Ade | Wrong item delivered | Delivery | High | Chidi | In progress | Replacement booked, resolve by 14 March\nRow 2: #0148 | 12 March 11:40 | Phone | Mr Bello | Invoice shows a double charge | Billing | Normal | Ngozi | Resolved | Refunded ₦5,000 on 13 March",
  "required": true
}
```

```task
{
  "id": "cscm-m06-t3",
  "prompt": "Write an **escalation matrix** with four levels (who, what they handle, time limit), one per line, and a short **handover note** (30 to 60 words) you would write when escalating a complaint to a manager.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "Level 1 - ...",
  "rules": [
    { "label": "Four levels", "pattern": "level 1[\\s\\S]*level 2[\\s\\S]*level 3[\\s\\S]*level 4" },
    { "label": "Time limits", "pattern": "\\d+\\s*(hours?|minutes|days?)|same day|working day", "min": 3 },
    { "label": "Handover note with facts and what customer wants", "pattern": "handover|note[\\s\\S]*(customer|wants|asked)|customer wants" },
    { "label": "Mentions what has been tried or the deadline", "pattern": "tried|already|deadline|by \\d|offered" },
    { "label": "At least five lines", "minLines": 5 }
  ],
  "sample": "Level 1 - front-line staff - most queries and complaints - resolve at first contact\nLevel 2 - supervisor - complex issues and small exceptions - 4 hours\nLevel 3 - manager - serious complaints and larger refunds - 1 working day\nLevel 4 - director - major incidents and reputation risks - same day\nHandover note: Mrs Ade (0803 000 0000) received a wrong item on 12 March. We have already offered a replacement, but she wants a full refund and an apology. She needs a reply by 3 pm today. Please call her.",
  "required": false
}
```

Next lesson: measuring and improving service.
