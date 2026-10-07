---
title: "Final Project: A Complete Project Plan"
minutes: 60
summary: Choose a project, build the plan, present it and review it.
---

## What you are building

You have learned to start, plan, run and close a project. In this final module you produce **a complete project plan** for a real or realistic project and present it as a project manager would to a sponsor.

Choose a project you understand well: an event (a wedding, conference or school fair), a business project (opening a branch, launching a product, moving premises), a community or church project, an IT or marketing project, or a construction or installation job. Make it realistic in size: something that could take between a few weeks and a few months, and cost between a few hundred thousand and several million naira.

Use real prices and durations where you can, and state your assumptions.

## Your plan has eight parts

1. **Charter:** purpose and business case, SMART objectives, success criteria, high-level scope, sponsor and key stakeholders.
2. **Scope:** requirements prioritised with MoSCoW, a scope statement with exclusions and acceptance criteria, and a work breakdown structure.
3. **Schedule:** activities, durations, dependencies, milestones and the critical path.
4. **Budget:** cost estimates by work package, contingency and the total, with a cash flow view.
5. **Risk:** a risk register with at least five scored risks and responses.
6. **People and communication:** roles (RACI), stakeholder engagement and a communication plan.
7. **Quality and change:** acceptance criteria and checks, procurement needs and the change control process.
8. **Control and closing:** how you will track progress (including a sample status report), and how you will close the project.

## Presenting the plan

Write for the sponsor who must approve it. Open with a **one-page summary:** the goal, what will be delivered, when, for how much, the main risks and the decision you need. Use tables for the schedule, budget and risks. Check that the parts agree with each other: the budget matches the WBS, the schedule matches the milestones, and the risks are reflected in the contingency.

Prepare to answer questions such as: *What if the cost goes up 20%? What happens if the key supplier is late? How will we know early if we are in trouble? What are you not including?* Have honest answers.

> [!TIP]
> Ask someone who was not involved to read your summary and tell you what they think the project is, what it costs and when it ends. If they cannot say, the summary needs work.

## Try it

```task
{
  "id": "pmgt-m12-t1",
  "prompt": "Write your **project charter summary**, one item per line: project name, purpose and business case, a SMART objective, success criteria, scope (in and out), sponsor, key stakeholders, budget and end date. At least nine lines.",
  "minutes": 12,
  "rows": 11,
  "placeholder": "Project name: ...",
  "rules": [
    { "label": "At least nine lines", "minLines": 9 },
    { "label": "Name and purpose", "pattern": "name[\\s\\S]*purpose|purpose[\\s\\S]*name" },
    { "label": "SMART objective with a number and date", "pattern": "objective[^\\n]*\\d" },
    { "label": "Success criteria", "pattern": "success criteria|success" },
    { "label": "Scope in and out", "pattern": "in scope|out of scope|scope" },
    { "label": "Sponsor and stakeholders", "pattern": "sponsor[\\s\\S]*stakeholders?|stakeholders?[\\s\\S]*sponsor" },
    { "label": "Budget in naira and an end date", "pattern": "budget[^\\n]*₦\\s?\\d[\\s\\S]*(end|finish|complete|by )" }
  ],
  "sample": "Project name: School Fair 2026\nPurpose and business case: raise ₦2,000,000 for the library fund through a one-day fair; costs ₦500,000\nObjective: raise ₦2 million net of costs and attract 800 visitors on 14 November\nSuccess criteria: ₦2 million raised, 800 visitors, no safety incidents and 90% positive feedback\nScope: in - stalls, entertainment, tickets, publicity and clean-up; out - permanent building work and televised coverage\nSponsor: the principal\nKey stakeholders: parents, teachers, pupils, vendors, the PTA and neighbours\nBudget: ₦500,000 including 10% contingency\nEnd date: closure report by 5 December",
  "required": true
}
```

```task
{
  "id": "pmgt-m12-t2",
  "prompt": "Write your **schedule and critical path**: at least **eight activities** with durations and predecessors, then the **critical path** with its total length and the **float** of one non-critical activity. Show the sums.",
  "minutes": 15,
  "rows": 12,
  "placeholder": "A - ... - 3 days - none\n...\nCritical path: ...",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Activities with durations", "pattern": "\\d+\\s*days?", "min": 8 },
    { "label": "States the critical path", "pattern": "critical path" },
    { "label": "States float", "pattern": "float|slack" },
    { "label": "Shows a sum", "pattern": "=|\\+" }
  ],
  "sample": "A - Agree date and venue - 3 days - none\nB - Recruit volunteers - 7 days - after A\nC - Book vendors and entertainment - 10 days - after A\nD - Design and print posters and tickets - 5 days - after A\nE - Publicity and ticket sales - 14 days - after D\nF - Set up stalls and stage - 2 days - after B and C\nG - Run the fair - 1 day - after E and F\nH - Clean up and count the money - 2 days - after G\nPaths: A-C-F-G-H = 3 + 10 + 2 + 1 + 2 = 18 days; A-D-E-G-H = 3 + 5 + 14 + 1 + 2 = 25 days; A-B-F-G-H = 3 + 7 + 2 + 1 + 2 = 15 days\nCritical path: A-D-E-G-H, 25 days in total\nFloat: C has float, since path A-C-F-G-H takes 18 days, so it can slip 25 - 18 = 7 days",
  "required": true
}
```

```task
{
  "id": "pmgt-m12-t3",
  "prompt": "Write your **budget and risk summary**: at least six cost lines in naira, the base cost, contingency (with the percentage) and the total; then **three risks** each with a score (probability × impact) and a response.",
  "minutes": 15,
  "rows": 14,
  "placeholder": "Venue and equipment - ₦...\n...\nRisk: ... - 3 x 4 = 12 - Mitigate - ...",
  "rules": [
    { "label": "At least twelve lines", "minLines": 12 },
    { "label": "At least six naira amounts", "pattern": "₦\\s?\\d", "min": 6 },
    { "label": "Base cost and contingency percentage", "pattern": "contingency[^\\n]*\\d+\\s?%|\\d+\\s?%[^\\n]*contingency" },
    { "label": "Total budget", "pattern": "total" },
    { "label": "Three scored risks", "pattern": "\\d\\s?[x×*]\\s?\\d\\s?=\\s?\\d+", "min": 3 },
    { "label": "Responses", "pattern": "avoid|mitigate|transfer|accept", "min": 3 }
  ],
  "sample": "Venue and equipment hire - ₦120,000\nPublicity and printing - ₦60,000\nEntertainment and sound - ₦100,000\nRefreshments for volunteers - ₦50,000\nSecurity and first aid - ₦60,000\nMiscellaneous and admin - ₦55,000\nBase cost - ₦445,000\nContingency at 10% - ₦44,500\nTotal budget - ₦489,500\nRisk: rain on the day - 3 x 4 = 12 - Mitigate - hire canopies and set a wet-weather plan\nRisk: low ticket sales - 3 x 5 = 15 - Mitigate - pre-sell tickets and publicise early\nRisk: a vendor cancels - 2 x 3 = 6 - Accept - keep a reserve list of vendors",
  "required": true
}
```

```task
{
  "id": "pmgt-m12-t4",
  "prompt": "Write your **people, communication and control plan** in at least seven lines: roles with RACI for three tasks, three audiences with frequency and method, the change control steps, how you track progress and how you close the project.",
  "minutes": 15,
  "rows": 12,
  "placeholder": "RACI - ...\nCommunication - ...",
  "rules": [
    { "label": "At least seven lines", "minLines": 7 },
    { "label": "RACI or roles", "pattern": "raci|responsible|accountable|roles?" },
    { "label": "Audiences with frequency and method", "pattern": "weekly|daily|monthly[\\s\\S]*(email|meeting|call|whatsapp|report)|(email|meeting|call|whatsapp|report)[\\s\\S]*(weekly|daily|monthly)" },
    { "label": "Change control", "pattern": "change (request|control)" },
    { "label": "Tracking progress", "pattern": "track|status report|milestone|rag|dashboard" },
    { "label": "Closing", "pattern": "clos|handover|lessons|sign-?off" }
  ],
  "sample": "RACI for publicity: volunteer lead is responsible, the project manager is accountable, the principal is consulted and parents are informed\nRACI for finance: bursar responsible, project manager accountable, principal consulted\nRACI for set-up: facilities head responsible, project manager accountable, volunteers informed\nCommunication: sponsor weekly by short report and call; team twice weekly in a 15-minute meeting; parents monthly by WhatsApp update\nChange control: submit a change request, assess the impact on cost and time, the principal approves or rejects, and I update the plan\nTracking: weekly RAG status report, milestone checks and a budget versus actual comparison\nClosing: sign-off by the principal, thank the volunteers, hold a lessons-learned meeting and write the closure report",
  "required": true
}
```

When you are done, submit your complete project plan as your final project.
