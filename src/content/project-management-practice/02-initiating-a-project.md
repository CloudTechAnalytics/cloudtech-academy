---
title: Initiating a Project
minutes: 25
summary: Build a business case and clear objectives, identify stakeholders, write a project charter and decide whether to go ahead.
---

## Business case and objectives

Every project should answer **"Why are we doing this?"** The **business case** explains the problem or opportunity, the options, the expected benefits and costs, and the risks. It helps decide whether the project is worth doing, and later whether it is still worth doing.

A business case usually covers:

- **The problem or opportunity.**
- **Options,** including **doing nothing.**
- **Benefits:** money saved or earned, better service, safety, compliance, reputation.
- **Costs:** one-time and ongoing.
- **Risks and assumptions.**
- **A recommendation.**

A simple financial view uses **payback** and **return on investment (ROI).** Example: a project costs **₦6,000,000** and is expected to save **₦2,400,000 a year.**

- Payback = 6,000,000 ÷ 2,400,000 = **2.5 years.**
- Over 3 years the benefit is 3 × 2,400,000 = ₦7,200,000. ROI = (7,200,000 − 6,000,000) ÷ 6,000,000 = **20%.**

Not every benefit is financial, but the case must be honest about the numbers and assumptions.

**Objectives** state what the project will achieve. Make them **SMART:** specific, measurable, achievable, relevant, time-bound. "Improve customer service" is vague. "Cut average response time from 24 hours to 4 hours by 30 June, within a ₦3 million budget" is clear.

## Stakeholder identification

A **stakeholder** is anyone who is affected by the project or can affect it: sponsor, customers, users, team members, suppliers, managers, regulators, the community.

To identify them:

1. **Brainstorm** with the team and sponsor: who pays, who uses, who decides, who is affected, who could stop it?
2. **List them** with their role, interests and concerns.
3. **Assess them,** commonly on a **power and interest grid:**

| | Low interest | High interest |
| :-- | :-- | :-- |
| **High power** | Keep satisfied | Manage closely |
| **Low power** | Monitor | Keep informed |

4. **Plan how to engage** each group (see module 8).

Missing a stakeholder is a classic cause of project trouble: the person you forgot becomes the one who objects at the end. Revisit the list throughout the project.

## The project charter

The **project charter** is a short document that formally **authorises** the project and gives the project manager the authority to use resources. It is usually issued by the sponsor.

A typical charter includes:

- **Project name and purpose / business case summary.**
- **Objectives and success criteria** (how we will know it worked).
- **High-level scope** (what is in and what is out).
- **Key deliverables.**
- **Summary schedule and milestones.**
- **Budget summary.**
- **Key stakeholders.**
- **Assumptions and constraints.**
- **Major risks.**
- **Project manager and authority level.**
- **Sponsor approval and date.**

Keep it short (one to three pages), clear and agreed. A signed charter prevents later arguments about "what we agreed."

## Feasibility and go or no-go

Before committing, check **feasibility:**

- **Technical:** can it be done with available technology and skills?
- **Financial:** do the benefits justify the cost?
- **Schedule:** can it be completed in the time needed?
- **Operational:** will the organisation be able to use and support the result?
- **Legal and regulatory:** is it allowed, and what approvals are needed?
- **Risk:** are the risks acceptable?

Then a **go or no-go decision:** go ahead, change the plan, delay or stop. Stopping a project that does not make sense is a success, because it saves money and effort. Set clear **criteria** in advance (for example "go if payback is under 3 years and risk is acceptable"), and record the decision.

## Try it

```task
{
  "id": "pmgt-m02-t1",
  "prompt": "A project costs **₦6,000,000** and saves **₦2,400,000 a year**. Work out the **payback period** and the **3-year ROI**, and say whether it meets a rule of \"payback under 3 years\".",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Payback = ...",
  "rules": [
    { "label": "Payback of 2.5 years", "pattern": "2\\.5" },
    { "label": "3-year benefit of ₦7,200,000", "pattern": "7,?200,?000" },
    { "label": "ROI of 20%", "pattern": "\\b20\\s?%" },
    { "label": "Says yes it meets the rule", "pattern": "meets|yes|under 3|less than 3|passes|satisf" }
  ],
  "sample": "Payback = 6,000,000 / 2,400,000 = 2.5 years.\n3-year benefit = 3 x 2,400,000 = ₦7,200,000, so ROI = (7,200,000 - 6,000,000) / 6,000,000 = 20%.\nYes, 2.5 years is under 3, so it meets the rule.",
  "required": true
}
```

```task
{
  "id": "pmgt-m02-t2",
  "prompt": "Write a **project charter** for a project of your choice, one item per line: name, purpose, SMART objective, success criteria, scope (in and out), key deliverables, milestones, budget, key stakeholders, major risks and sponsor. At least ten lines.",
  "minutes": 15,
  "rows": 12,
  "placeholder": "Project name: ...\nPurpose: ...",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Project name and purpose", "pattern": "name[\\s\\S]*purpose|purpose[\\s\\S]*name" },
    { "label": "Objective with a number and date", "pattern": "objective[^\\n]*\\d" },
    { "label": "Scope in and out", "pattern": "scope|in scope|out of scope|excluded" },
    { "label": "Deliverables and milestones", "pattern": "deliverables?[\\s\\S]*milestones?|milestones?[\\s\\S]*deliverables?" },
    { "label": "Budget in naira", "pattern": "budget[^\\n]*₦\\s?\\d" },
    { "label": "Stakeholders and risks", "pattern": "stakeholders?[\\s\\S]*risks?|risks?[\\s\\S]*stakeholders?" },
    { "label": "Sponsor", "pattern": "sponsor" }
  ],
  "sample": "Project name: School Solar Power\nPurpose: cut the school's diesel bills and give reliable power for classes\nObjective: install a 10 kW solar system and cut diesel spend by 60% by 30 September\nSuccess criteria: system running, diesel use down 60% over three months, no safety incidents\nScope: in - design, supply, installation, staff training; out - rewiring of old classrooms\nKey deliverables: approved design, installed system, training, handover manual\nMilestones: design approved 15 June; equipment delivered 15 July; commissioning 31 August\nBudget: ₦6,000,000\nKey stakeholders: principal, bursar, teachers, installer, parents' association\nMajor risks: late equipment delivery, budget overrun, roof not strong enough\nSponsor: the school proprietor",
  "required": true
}
```

```task
{
  "id": "pmgt-m02-t3",
  "prompt": "List **six stakeholders** for your project and place each on the **power and interest grid** (manage closely, keep satisfied, keep informed or monitor), with a reason. One per line.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Principal - manage closely - ...",
  "rules": [
    { "label": "Six lines", "minLines": 6 },
    { "label": "Uses grid categories", "pattern": "manage closely|keep satisfied|keep informed|monitor", "min": 5 },
    { "label": "Gives reasons", "pattern": "because|since|power|interest|decides|pays|affected|uses", "perLine": true }
  ],
  "sample": "Proprietor (sponsor) - manage closely - high power and high interest because he funds and approves it\nPrincipal - manage closely - high power and interest because she runs the school\nBursar - keep satisfied - high power over payments but less interested in the details\nTeachers - keep informed - low power but affected daily by the work\nInstaller - manage closely - delivers the work and has high interest\nParents' association - monitor - low power and interest unless costs rise",
  "required": false
}
```

Next lesson: scope and planning.
