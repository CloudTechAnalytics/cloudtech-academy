---
title: Quality, Procurement and Change
minutes: 25
summary: Plan and control quality, buy for a project, run change control and manage scope creep.
---

## Quality planning and control

**Quality** means the project's deliverables meet the requirements and are fit for purpose. It is planned in, not inspected in at the end.

**Quality planning:**

- **Define quality standards** and acceptance criteria for each deliverable (what "done" and "good" mean, with measurable tests).
- **Identify relevant standards and regulations** (safety, building codes, product standards).
- **Plan quality activities:** reviews, inspections, tests and audits, and who does each.
- **Set metrics:** defects found, rework hours, test pass rate, customer satisfaction.
- **Define roles** for quality checking, independent from those who did the work where possible.

**Quality assurance** checks that the **process** is being followed and is capable of producing quality. **Quality control** checks the **results** (the deliverables) against the standard. Use simple tools: checklists, inspections, sampling, test plans, trend charts and a log of defects.

The **cost of quality** has two parts: the cost of getting it right (planning, training, testing) and the cost of getting it wrong (rework, scrap, warranty claims, delays, lost reputation). Preventing defects costs far less than fixing them late, so invest in early reviews and clear requirements.

Keep a **defect log:** what was found, where, severity, who fixes it, and status. Review the causes and fix the process, not only the defect.

## Buying for a project

Many projects buy equipment, materials and services. **Project procurement** needs planning:

1. **Decide what to make and what to buy.** (Make-or-buy, covered in the Procurement & Sourcing course.)
2. **Define the requirement** in a clear specification or statement of work.
3. **Choose the procurement method:** quotations, tender or negotiation, by value and policy.
4. **Select suppliers** using agreed criteria (cost, quality, delivery, experience, references, risk).
5. **Choose the contract type.**
6. **Manage the contract:** deliveries, inspection, payment on acceptance, changes and claims.
7. **Close the contract:** final acceptance, payment, lessons.

Common contract types:

| Type | How it works | Suits |
| :-- | :-- | :-- |
| **Fixed-price (lump sum)** | A set price for a defined scope | Clear, stable scope; the buyer has certainty, the seller carries cost risk |
| **Time and materials** | Pay for hours and materials used | Unclear scope or small work; the buyer carries cost risk, so set a cap |
| **Cost-plus** | Pay costs plus a fee | Uncertain, complex work; needs strong cost control |
| **Unit price** | A price per unit of work | Work where quantities vary |

Plan **lead times** (add them to the schedule), **payment milestones** tied to acceptance, and **warranties.** Check a supplier's capacity and references before relying on them for critical items.

## Change control

Almost every project faces change requests: the client wants something new, a problem forces a different approach, a rule changes. **Change control** is the formal process that ensures changes are **considered, approved and recorded**, instead of creeping in.

A typical process:

1. **Request:** someone submits a change request describing the change and the reason.
2. **Log it** with an ID, date, requester and status.
3. **Assess the impact:** on scope, schedule, cost, quality, risk and resources. Involve the people who know.
4. **Decide:** approve, reject or defer, by the person or board with authority (the sponsor or a change control board).
5. **Communicate** the decision.
6. **Update the plans and baselines** if approved, and implement.
7. **Track** to completion.

Example: a client requests an extra feature. The impact assessment says it adds **10 days** and **₦300,000.** The sponsor approves a **₦300,000** increase and a 10-day extension. The budget (₦4,950,000) rises to **₦5,250,000**, the finish date moves by 10 days, and both baselines are updated. If the sponsor refuses extra money, the team might swap the feature for a lower-priority one, or defer it to phase two.

Do not agree to changes informally, even small ones. **Many small, unlogged changes** add up to a big overrun.

## Managing scope creep

**Scope creep** is the uncontrolled growth of scope after the project has begun. It happens through well-meaning "while you are there" requests, vague requirements and weak change control.

How to prevent it:

- **Get clear requirements and a signed scope statement** with exclusions.
- **Involve stakeholders early,** so changes are not discovered late.
- **Use change control** for every change, and say "yes, we can, here is what it costs" instead of a flat "no" or a silent "yes".
- **Prioritise** (MoSCoW) so trade-offs are quick.
- **Educate the client** on the triple constraint.
- **Watch for gold-plating:** the team adding extras nobody asked for.
- **Keep a log** of requests and decisions.
- **Review scope** with the sponsor at milestones.

Some change is healthy: it keeps the project relevant. The aim is **managed** change, with the cost and impact visible and approved.

## Try it

```task
{
  "id": "pmgt-m07-t1",
  "prompt": "A change request adds **10 days** and **₦300,000** to a project with a budget of **₦4,950,000**. Work out the **new budget**, and write **three options** for the sponsor (approve, trade off, defer) in one line each.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "New budget = ...",
  "rules": [
    { "label": "New budget of ₦5,250,000", "pattern": "5,?250,?000" },
    { "label": "Option to approve with extra time and money", "pattern": "approve" },
    { "label": "Option to trade off or swap for something else", "pattern": "trade|swap|replace|drop|remove|lower-priority" },
    { "label": "Option to defer or phase two", "pattern": "defer|later|phase" }
  ],
  "sample": "New budget = 4,950,000 + 300,000 = ₦5,250,000, with the finish date moved 10 days.\nApprove: accept the extra ₦300,000 and 10 days and update the baselines.\nTrade off: swap the new feature for a lower-priority one so cost and time do not change.\nDefer: leave the feature for a second phase after the current project is delivered.",
  "required": true
}
```

```task
{
  "id": "pmgt-m07-t2",
  "prompt": "Write **acceptance criteria and quality checks** for two deliverables of your project. For each deliverable give at least two measurable acceptance criteria, how you will check them and who checks. At least six lines.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Deliverable 1: ...\nCriterion: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Two deliverables", "pattern": "deliverable 1[\\s\\S]*deliverable 2" },
    { "label": "Measurable criteria with numbers", "pattern": "criteri[a-z]*[^\\n]*\\d", "min": 3 },
    { "label": "States how it is checked", "pattern": "test|inspect|check|review|measure" },
    { "label": "States who checks", "pattern": "by the|inspector|sponsor|tester|reviewer|customer|engineer|who checks|checked by" }
  ],
  "sample": "Deliverable 1: installed solar system\nCriterion: produces at least 40 kWh a day in a three-day test - checked by measuring output - checked by the installer's engineer and the school's technician\nCriterion: passes the electrical safety inspection with zero critical findings - inspector's report - checked by the independent inspector\nDeliverable 2: staff training\nCriterion: at least 5 staff complete the session and score 80% on a short practical check - observation and a short test - checked by the project manager\nCriterion: a handover manual of at most 20 pages is delivered - review - checked by the principal",
  "required": true
}
```

```task
{
  "id": "pmgt-m07-t3",
  "prompt": "The client keeps asking for small extras: *\"While you are there, can you also...?\"* In 50 to 100 words, say how you handle it without damaging the relationship.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "I would respond ...",
  "rules": [
    { "label": "Mentions change control or a change request", "pattern": "change (request|control)|formal|process|log" },
    { "label": "Mentions assessing impact on cost, time or scope", "pattern": "impact|cost|time|schedule|price|effect" },
    { "label": "Positive, offers options (yes, but, trade-off, phase two)", "pattern": "happy to|glad to|we can|option|trade|phase|priorit|decide" },
    { "label": "Mentions the sponsor or decision maker", "pattern": "sponsor|decision|approve|client decides|approval" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "I would say we are happy to look at it, and ask them to submit it through the change request process. I would then assess the impact on cost, time and scope and show the client the options: approve it with extra time and money, swap it for a lower-priority item, or leave it for phase two. The sponsor decides, and I record the decision. This keeps the relationship positive and the project under control.",
  "required": false
}
```

Next lesson: people, teams and stakeholders.
