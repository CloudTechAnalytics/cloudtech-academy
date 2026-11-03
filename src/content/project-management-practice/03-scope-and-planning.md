---
title: Scope and Planning
minutes: 30
summary: Gather requirements, write a scope statement, build a work breakdown structure and assemble the planning documents.
---

## Requirements gathering

**Requirements** are the needs and conditions the project must meet. Poor requirements are a leading cause of project failure: the team builds the wrong thing, or builds the right thing badly understood.

How to gather them:

- **Interviews** with sponsors, users and other stakeholders.
- **Workshops** where groups discuss and agree needs.
- **Observation:** watch how people work now.
- **Surveys and questionnaires** for large groups.
- **Documents:** existing processes, complaints, reports, regulations.
- **Prototypes or examples** to react to.

Write requirements clearly: each should be **specific, testable and agreed.** *"The system should be fast"* is weak. *"A customer's order confirmation must appear within 3 seconds"* is testable. Record the **source** of each, so you can check it later.

Prioritise with **MoSCoW:**

- **Must have:** essential; the project fails without it.
- **Should have:** important, but there is a workaround.
- **Could have:** nice if time and money allow.
- **Won't have (this time):** agreed out of scope for now.

Prioritising early protects your budget and deadline, because when pressure comes you know what to cut first.

## Scope statement

The **scope statement** describes the project's deliverables and the work needed to produce them, and, just as important, **what is excluded.**

It includes:

- **Project objectives** (briefly).
- **Deliverables:** the specific outputs.
- **Acceptance criteria:** how each deliverable will be judged complete.
- **Exclusions:** what is not included.
- **Assumptions** and **constraints.**

Example: *In scope: design, supply and installation of a 10 kW solar system and staff training. Out of scope: replacing old classroom wiring, ongoing maintenance after the first year. Acceptance: the system produces at least 40 kWh a day in test, and passes the inspection.*

The exclusions are as valuable as the inclusions. They prevent **scope creep:** the slow addition of "just one more thing" without time or money.

## Work breakdown structure

A **work breakdown structure (WBS)** breaks the project into smaller and smaller pieces of work until each is easy to estimate, assign and track. It is organised by **deliverables** (things), not just activities.

The key rule is the **100% rule:** the WBS must include **all** the work in the scope and nothing outside it. The pieces at each level add up to the whole.

Example for a school fair:

1. **School fair**
   1.1 Planning
   1.2 Venue and logistics
   1.3 Stalls and vendors
   1.4 Publicity
   1.5 Programme and entertainment
   1.6 Finance and tickets
   1.7 Closing

Each is broken down further. For example, **1.4 Publicity** becomes: 1.4.1 Design posters, 1.4.2 Print posters, 1.4.3 Social media posts, 1.4.4 Invite parents by message.

The lowest level is a **work package:** a piece of work small enough to estimate time and cost and assign to one person or team. A work package typically takes from a few days to a couple of weeks. Add a **WBS dictionary** that describes each work package, its owner, deliverable and criteria.

Why a WBS: you do not forget work, estimates are better, responsibility is clear, and progress is easy to track.

## Planning documents

Together, your planning documents form the **project management plan.** Typical parts:

| Plan | What it covers |
| :-- | :-- |
| **Scope management plan** | How scope is defined, verified and changed |
| **Schedule plan** | Activities, durations, dependencies, milestones |
| **Cost plan and budget** | Estimates, budget, contingency, tracking |
| **Quality plan** | Standards, checks and acceptance criteria |
| **Resource plan** | People, equipment, and when they are needed |
| **Communication plan** | Who gets what information, when and how |
| **Risk plan and register** | Risks, responses, owners |
| **Procurement plan** | What you buy, from whom, how |
| **Stakeholder plan** | How you engage each stakeholder |
| **Change control process** | How changes are requested and decided |

For a small project these can be a few pages or a single document with sections. The point is to **think through** each area before starting and to agree it with the sponsor. Review and update the plan as things change; it is a living document. Get a **baseline** approved (the agreed scope, schedule and budget), so you can measure progress against it.

## Try it

```task
{
  "id": "pmgt-m03-t1",
  "prompt": "Write **eight requirements** for a project of your choice and prioritise each with **MoSCoW** (Must, Should, Could, Won't). One per line, each testable.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "Must: ...",
  "rules": [
    { "label": "Eight lines", "minLines": 8 },
    { "label": "Uses MoSCoW labels", "pattern": "must|should|could|won't|wont", "min": 8 },
    { "label": "Includes at least one Must and one Won't or Could", "pattern": "must[\\s\\S]*(won't|wont|could)|(won't|wont|could)[\\s\\S]*must" },
    { "label": "Includes numbers or testable measures", "pattern": "\\d+", "min": 3 }
  ],
  "sample": "Must: the system produces at least 40 kWh a day in the test.\nMust: installation is completed by 31 August.\nMust: the installer passes the safety inspection.\nShould: a display screen shows live power output in the principal's office.\nShould: 5 staff are trained on basic operation.\nCould: a small battery for the computer lab.\nCould: a plaque and open day for parents.\nWon't: replace old classroom wiring in this phase.",
  "required": true
}
```

```task
{
  "id": "pmgt-m03-t2",
  "prompt": "Write a **scope statement** in at least five lines: objective, deliverables, acceptance criteria, **exclusions**, and assumptions or constraints.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Objective: ...\nDeliverables: ...",
  "rules": [
    { "label": "At least five lines", "minLines": 5 },
    { "label": "Objective", "pattern": "objective" },
    { "label": "Deliverables", "pattern": "deliverables?" },
    { "label": "Acceptance criteria", "pattern": "acceptance|accepted when|criteria" },
    { "label": "Exclusions", "pattern": "exclu|out of scope|not included|will not" },
    { "label": "Assumptions or constraints", "pattern": "assum|constraint" }
  ],
  "sample": "Objective: install a 10 kW solar system at the school and cut diesel spend by 60%.\nDeliverables: approved design, installed system, staff training and a handover manual.\nAcceptance criteria: the system produces at least 40 kWh a day in the test and passes the inspection.\nExclusions: replacing old classroom wiring and maintenance after the first year are out of scope.\nAssumptions: the roof can carry the panels and equipment arrives within 6 weeks.\nConstraints: the budget is ₦6,000,000 and the work must not disturb exams.",
  "required": true
}
```

```task
{
  "id": "pmgt-m03-t3",
  "prompt": "Build a **work breakdown structure** for your project: at least **six level-one items**, and break **two of them** into at least three work packages each. Use numbering (1.1, 1.2, 1.1.1 ...).",
  "minutes": 15,
  "rows": 14,
  "placeholder": "1.1 Planning\n1.2 Venue ...\n1.4.1 ...",
  "rules": [
    { "label": "At least twelve lines", "minLines": 12 },
    { "label": "Has level-one numbering (1.1, 1.2 ...)", "pattern": "1\\.1[\\s\\S]*1\\.2[\\s\\S]*1\\.3[\\s\\S]*1\\.4[\\s\\S]*1\\.5[\\s\\S]*1\\.6" },
    { "label": "Has level-two numbering (1.x.1)", "pattern": "1\\.\\d\\.1[\\s\\S]*1\\.\\d\\.2[\\s\\S]*1\\.\\d\\.3" },
    { "label": "Includes planning and closing", "pattern": "planning[\\s\\S]*closing|closing[\\s\\S]*planning" }
  ],
  "sample": "1.1 Planning\n1.2 Design\n1.3 Procurement\n1.4 Installation\n1.5 Testing and training\n1.6 Closing\n1.2.1 Site survey\n1.2.2 System design\n1.2.3 Design approval\n1.4.1 Mount panels\n1.4.2 Install inverter and batteries\n1.4.3 Wire and connect\n1.4.4 Safety checks",
  "required": false
}
```

Next lesson: schedule management.
