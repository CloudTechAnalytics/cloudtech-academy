---
title: Closing and Learning
minutes: 25
summary: Hand over and gain acceptance, close contracts, capture lessons learned and celebrate and archive the project.
---

## Handover and acceptance

A project is not finished when the work is done. It is finished when the result is **accepted** and **handed over** to the people who will use and support it.

**Acceptance.** Compare each deliverable with the **acceptance criteria** agreed in the scope statement. Do this formally:

- **Test and demonstrate** the deliverables, with the customer present.
- **List any defects** (a "snag list") and fix them, agreeing deadlines for the remaining ones.
- **Get written sign-off** from the customer or sponsor confirming acceptance.

Do not leave acceptance vague: *"it looks fine"* is not sign-off. If the customer will not sign, find out why and resolve it.

**Handover** moves ownership to the operations team or customer. Make it smooth:

- **Documentation:** user guides, manuals, as-built drawings, warranties, passwords and licences, maintenance schedules and contact lists.
- **Training** for the people who will operate and support it.
- **A support arrangement:** who to call, how fast they respond, and warranty or defect period.
- **A transition plan,** and a short period of extra help after go-live.
- **Hand over remaining risks and issues** with owners.

Remember the **total life cost:** the project may be a small part of the cost compared with running and maintaining the result. Make sure the handover includes the information needed for that.

## Closing contracts

Close each **contract** (with suppliers, contractors, consultants) properly:

1. **Confirm delivery and acceptance** of everything contracted.
2. **Resolve open issues,** claims and disputes.
3. **Settle payments:** pay what is owed, hold back retentions until the defect period ends, and confirm that no more charges are due.
4. **Obtain documents:** certificates, warranties, completion certificates and final invoices.
5. **Record supplier performance:** note who delivered well and who did not, for future decisions.
6. **Return or release** any borrowed equipment, access passes and confidential information.
7. **Formally notify** the supplier that the contract is closed.

Also close the **project's finances:** reconcile the budget, confirm all costs are recorded, close the project's accounts and report any underspend or overspend with explanations.

## Lessons learned

A **lessons-learned review** captures what the project taught you, so the next one is better. Do it while memories are fresh, with the team and key stakeholders, in a blame-free setting.

Ask:

- **What went well,** and why? What should we repeat?
- **What did not go well,** and why? What should we change?
- **What surprised us?**
- **What would we do differently next time?**
- **What advice would we give another project manager?**

Use evidence: the plan versus actual schedule and cost, the risk register, the change log, stakeholder feedback. Look at **causes,** not just symptoms: not "we were late" but "we were late because estimates ignored delivery time for imported equipment."

Write **specific, actionable lessons.** For example: *"Order imported equipment at least 8 weeks before installation; include customs time in all estimates."* Store them where future teams will find them, and share the key ones. Lessons that sit in a drawer are lost.

Also do **a review of the benefits:** a few months later, check whether the project achieved the benefits promised in the business case (the diesel savings, for example).

## Celebrating and archiving

- **Recognise people.** Thank the team and key contributors personally and publicly. A celebration, even a simple meal, acknowledges effort and builds morale for the next project.
- **Release the team** properly: give feedback and references, help them move to new work, return staff to their departments.
- **Archive the records:** the charter, plans, baselines, changes, risks, decisions, contracts, reports, lessons learned and final report, in an organised, accessible place, for the period that your organisation and the law require.
- **Write a closure report:** what was delivered, performance against the objectives, schedule, budget, quality, key risks and issues, lessons learned and recommendations.
- **Formally close the project,** with the sponsor's approval, and communicate it to stakeholders.

A well-closed project leaves a satisfied customer, a happy team, a clear record and knowledge that makes the next project easier.

## Try it

```task
{
  "id": "pmgt-m11-t1",
  "prompt": "Write a **closure checklist** for your project with at least ten items, one per line, covering acceptance, handover, training, contracts and payments, documents, lessons learned, recognition, archiving and the closure report.",
  "minutes": 12,
  "rows": 12,
  "placeholder": "Get written sign-off ...",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Acceptance and sign-off", "pattern": "accept|sign-?off" },
    { "label": "Handover and training", "pattern": "handover|hand over|training" },
    { "label": "Contracts and payments", "pattern": "contract|payment|invoice|retention" },
    { "label": "Documents or warranties", "pattern": "document|manual|warrant" },
    { "label": "Lessons learned", "pattern": "lessons" },
    { "label": "Recognition or celebration", "pattern": "thank|celebrat|recogni" },
    { "label": "Archive and closure report", "pattern": "archive|closure report|final report" }
  ],
  "sample": "Test and demonstrate every deliverable against the acceptance criteria\nList and fix all defects on the snag list\nGet written sign-off from the sponsor\nHand over manuals, as-built drawings, warranties and passwords\nTrain the school's technician and the bursar\nAgree the support arrangements and defect period\nConfirm contract delivery, settle payments and hold the retention\nRecord supplier performance\nHold the lessons-learned review\nThank and recognise the team, and release them\nArchive all records and write the closure report",
  "required": true
}
```

```task
{
  "id": "pmgt-m11-t2",
  "prompt": "Write **five specific lessons learned** for a project, one per line, each in the form \"What happened - cause - what to do next time\". Make them actionable, not vague.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Equipment arrived late - customs time was missing from our estimate - order 8 weeks early next time",
  "rules": [
    { "label": "Five lines", "minLines": 5 },
    { "label": "Each line has the three parts (two dashes)", "pattern": "-[^\\n]+-", "perLine": true },
    { "label": "Includes a next-time action", "pattern": "next time|in future|always|make sure|should|must|from now|on every project|only for|as soon as", "min": 4 },
    { "label": "Includes numbers or specifics", "pattern": "\\d+", "min": 3 }
  ],
  "sample": "Equipment arrived late - customs time was missing from our estimate - always add 6 weeks for imported items next time\nThe roof needed reinforcing - we surveyed it late - do the structural survey in week 1 in future\nStaff were not trained in time - training was scheduled after commissioning - train staff before handover on every project\nBudget used 10% contingency early - we used it for avoidable rework - approve contingency use only for identified risks\nThe sponsor was surprised by a delay - status reports were green until too late - report amber as soon as 3 days slip",
  "required": true
}
```

```task
{
  "id": "pmgt-m11-t3",
  "prompt": "A customer says the project is \"basically done\" but will not sign the acceptance. In 50 to 100 words, say how you handle it.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "I would ask ...",
  "rules": [
    { "label": "Asks why or listens to the concern", "pattern": "ask|why|listen|understand|concern|reason" },
    { "label": "Refers to acceptance criteria", "pattern": "acceptance criteria|criteria|agreed|scope" },
    { "label": "Fixes or agrees a snag list with dates", "pattern": "snag|defect|fix|list|date|deadline|resolve" },
    { "label": "Aims at written sign-off", "pattern": "sign-?off|written|sign" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "I would ask the customer why they will not sign, and listen to the concern. Then I would go through the acceptance criteria we agreed in the scope statement and check each deliverable against them together. Any real defects go on a snag list with an agreed date to fix, and anything outside the scope goes through change control. Once the criteria are met or the remaining items are agreed, I would ask for written sign-off, so that closure is clear for both sides.",
  "required": false
}
```

Next lesson: your complete project plan.
