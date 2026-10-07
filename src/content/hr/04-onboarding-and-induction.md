---
title: Onboarding and Induction
minutes: 25
summary: Plan the first 90 days, build an induction, manage probation fairly and make new hires productive quickly.
---

## The first 90 days

**Onboarding** is the whole process of helping a new employee become a settled, productive member of the team. **Induction** is the structured introduction at the start. The first days and weeks shape how long the person stays and how well they perform.

The risks of poor onboarding are real: confusion, mistakes, loneliness and early resignation. A common finding is that many new hires who leave do so within the first few months. Example: of **20 hires** in a year, if **5** leave within 90 days, early attrition is 5 ÷ 20 = **25%.** Each early leaver costs the recruitment spend and lost time again.

Good onboarding aims to make a new hire **welcome, informed, equipped and clear.** A useful pattern:

- **Before day 1:** send the contract, a welcome message, the start time, location, dress code, documents to bring and who to ask for. Prepare their workspace, tools, access and a buddy.
- **Day 1:** a warm welcome, tour, introductions, key safety information, and a simple first task so they can contribute.
- **Week 1:** induction sessions, shadowing, training on essential systems, and a clear outline of expectations.
- **Month 1:** regular check-ins, early goals, feedback and answers to questions.
- **Month 3:** probation review and a conversation about the future.

## Induction plans

Write an **induction plan** for each role, so it is consistent and nothing is forgotten. It usually covers:

**About the organisation:** history, mission, values, products and customers, structure and key people.

**About the job:** the job description, duties, standards, hours, how performance is judged, and who to go to for help.

**Practical matters:** tools, systems and logins, uniform, access cards, breaks, how and when pay is made, how to report sickness or lateness.

**Policies and rules:** attendance, conduct, dress code, data protection, anti-bribery, anti-harassment, social media and confidentiality.

**Health and safety:** fire exits, first aid, safe lifting, emergency procedures and reporting accidents.

**Training:** job-specific training, shadowing a colleague, and a plan for the first weeks.

**People:** introductions to the team, key contacts and a **buddy** (a friendly, experienced colleague who answers everyday questions).

**Paperwork:** signed contract, employee details, bank and pension details, emergency contact, copies of required documents, and acknowledgement of key policies.

A simple **induction checklist** with tick boxes and dates, signed by both the employee and manager, ensures it is done and provides evidence.

## Probation

A **probation period** is an agreed early period (commonly three to six months) when both sides assess whether the job is right. It must be stated in the contract, including its length, the notice during probation and how confirmation works.

Use it properly:

- **Set clear objectives** for the probation period at the start, in writing.
- **Check in regularly:** weekly in the first month, then every two to four weeks. Give honest, specific feedback.
- **Offer support:** training, coaching and clear examples of the standard.
- **Document** discussions and examples, good and bad.
- **Hold a formal review** at the end (and at mid-point for longer periods): are the objectives met? Confirm the employee, extend probation (once, for a clear reason, with agreement), or end the employment with proper notice and a fair process.
- **Tell them in good time.** Do not leave the decision until the last day, and do not let probation pass without a review: employees may be treated as confirmed.
- **Act fairly and consistently,** and follow the law and the contract, even during probation.

Probation is not a licence to treat people badly. It is a structured chance to learn together.

## Making new hires productive

Beyond the checklist, the biggest drivers of early success are:

- **Clear expectations:** what good looks like, by when.
- **A buddy or mentor** to ask questions without fear.
- **A manager who spends time** with them regularly in the early weeks.
- **Early wins:** small tasks they can complete successfully.
- **Training in the right order,** starting with what they need first.
- **Feedback early and often,** not only at the end.
- **Connection:** introducing them to people across the business, including lunch or a team welcome.
- **Asking for their feedback** on the onboarding experience, and improving it.

Measure it: **time to productivity** (how long before they perform at a normal level), **early attrition** (leavers in the first 90 days), probation pass rate and the new hire's own rating of their first month.

## Try it

```task
{
  "id": "hrpm-m04-t1",
  "prompt": "Of **20 hires** in a year, **5** leave within **90 days**. Work out the **early attrition rate**. If each early leaver costs **₦150,000** in recruitment and lost productivity, what is the annual cost? Then give **two ways** to reduce it.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Early attrition = ...",
  "rules": [
    { "label": "Early attrition of 25%", "pattern": "\\b25\\s?%" },
    { "label": "Cost of ₦750,000", "pattern": "750,?000" },
    { "label": "Suggests ways (better onboarding, buddy, clearer expectations, better selection)", "pattern": "onboard|buddy|expectation|selection|induction|check-?in|realistic|probation" }
  ],
  "sample": "Early attrition = 5 / 20 = 25%.\nCost = 5 x 150,000 = ₦750,000 a year.\nI would reduce it with a better induction and a buddy for every new hire, and by giving candidates a realistic picture of the job during selection.",
  "required": true
}
```

```task
{
  "id": "hrpm-m04-t2",
  "prompt": "Write an **induction checklist** for a new employee of your choice, with at least **ten items**, one per line, covering the organisation, the job, practical matters, policies, health and safety, training, people and paperwork.",
  "minutes": 12,
  "rows": 12,
  "placeholder": "Welcome and tour of the premises",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "About the organisation (mission, values, history)", "pattern": "mission|values|history|organisation|company|business" },
    { "label": "About the job (duties, expectations)", "pattern": "job description|duties|expectations|role" },
    { "label": "Policies", "pattern": "polic|conduct|attendance|data protection" },
    { "label": "Health and safety", "pattern": "safety|fire|first aid|emergency" },
    { "label": "Training or buddy", "pattern": "training|buddy|shadow|mentor" },
    { "label": "Paperwork (contract, bank, pension)", "pattern": "contract|bank|pension|paperwork|details|documents" }
  ],
  "sample": "Welcome, tour of the premises and introductions to the team\nExplain our mission, values and customers\nGo through the job description, duties and what good performance looks like\nAssign a buddy for the first month\nSet up tools, system logins, uniform and access card\nExplain working hours, breaks and how to report lateness or sickness\nReview key policies: conduct, attendance, data protection and anti-bribery\nHealth and safety briefing: fire exits, first aid and emergency procedures\nJob-specific training and shadowing in week one\nComplete paperwork: signed contract, bank and pension details, emergency contact\nSet probation objectives and book the check-in dates",
  "required": true
}
```

```task
{
  "id": "hrpm-m04-t3",
  "prompt": "Write a **30-60-90 day plan** for a new hire in your chosen role: two or three goals for each period. At least six lines, each with a measurable target.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "First 30 days: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Covers 30, 60 and 90 days", "pattern": "30[\\s\\S]*60[\\s\\S]*90" },
    { "label": "Includes measurable targets with numbers", "pattern": "\\d+\\s?%|\\d+\\s*(customers|errors|orders|days|hours|sales|tasks)|within \\d+", "min": 4 },
    { "label": "Includes learning and performance goals", "pattern": "learn|train|complete|achieve|reach|reduce|handle" }
  ],
  "sample": "First 30 days: complete induction and system training and shadow three experienced cashiers.\nFirst 30 days: process transactions with supervision and keep errors under 5%.\nDays 31 to 60: work a till independently and keep till differences under ₦500 a shift.\nDays 31 to 60: handle at least 20 customer questions a shift using the standard answers.\nDays 61 to 90: reach full speed of 40 customers an hour and complete the safety and stock training.\nDays 61 to 90: pass the probation review with all objectives met.",
  "required": false
}
```

Next lesson: training and development.
