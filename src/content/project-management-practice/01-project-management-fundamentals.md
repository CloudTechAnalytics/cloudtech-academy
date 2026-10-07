---
title: Project Management Fundamentals
minutes: 20
summary: Understand what a project is, the project lifecycle, what a project manager does and how traditional, agile and hybrid approaches differ.
---

## What a project is

A **project** is a temporary effort to create something unique: a product, service, event or result. It has a **start and an end**, a **goal**, and limited **time, money and people.**

Examples: building a house, launching an app, organising a wedding or conference, opening a new shop branch, installing solar panels at a school, running a vaccination campaign, moving an office.

**Operations**, in contrast, are ongoing, repeating work: running the shop every day, processing payroll each month, answering customer calls. Operations keep the business going; projects change it.

| | Project | Operations |
| :-- | :-- | :-- |
| **Duration** | Temporary, with an end date | Ongoing |
| **Output** | Unique result | Repeated products or services |
| **Uncertainty** | Higher (new work) | Lower (known routine) |
| **Goal** | Deliver a result and close | Sustain and improve |

Some work is a mix: opening a restaurant is a project; running it afterwards is operations. Knowing the difference matters because projects need **planning, a team and a manager focused on finishing.**

## The triple constraint and quality

Every project is limited by three linked constraints:

- **Scope:** what the project must deliver.
- **Time (schedule):** when it must be done.
- **Cost (budget):** what it may spend.

**Quality** and **risk** sit alongside them. The three constraints are connected: change one and you usually affect the others. Add features (scope) and you need more time or money. Cut the deadline and you may need extra people (cost) or fewer features (scope). Cut the budget and quality or scope may suffer.

A manager's job is to **balance** them and to know which matters most. For a wedding the date is fixed (time first). For a government building the budget may be fixed. For a safety system quality is fixed. Ask the sponsor at the start: *"If we must choose, which comes first: scope, time or cost?"*

## The project lifecycle

Projects pass through stages, often described as five **process groups:**

1. **Initiating:** define the project, the business case, objectives and stakeholders; get approval.
2. **Planning:** define scope, schedule, budget, risks, quality, communication and resources.
3. **Executing:** do the work, manage the team and deliver.
4. **Monitoring and controlling:** track progress against the plan, manage risks and changes, and correct course. This runs throughout.
5. **Closing:** hand over, get acceptance, release resources and capture lessons.

Effort and spending usually rise through planning, peak in execution and fall at closing. Good planning early is cheap; fixing mistakes late is expensive.

## The project manager's role

A **project manager (PM)** is responsible for leading the project to its goals. Typical responsibilities:

- Defining the goals, scope and plan with the sponsor and team.
- Building and leading the team.
- Managing schedule, budget and quality.
- Identifying and managing risks and issues.
- Communicating with stakeholders.
- Managing changes and suppliers.
- Reporting progress and escalating problems.
- Closing the project properly.

Skills: **leadership, communication, planning, organisation, negotiation, problem solving and integrity.** A PM usually does not do all the technical work; they make sure the right work is done, by the right people, in the right order. They need authority matched to responsibility, and the sponsor's support.

Key people: the **sponsor** (owns the business case, provides funding and authority), the **team**, the **customer or users**, and other **stakeholders.**

## Methodologies: traditional, agile and hybrid

- **Traditional (predictive or "waterfall"):** plan everything up front, then execute in phases (requirements → design → build → test → deliver). Best when requirements are clear and stable and change is costly, such as construction.
- **Agile:** deliver in short cycles (for example two weeks), get feedback and adapt. Best when requirements are uncertain or change quickly, such as software or marketing campaigns.
- **Hybrid:** combine them: plan the overall budget and milestones traditionally and use agile cycles for parts of the work.

No single method is best. Choose by asking: *How clear are the requirements? How often will they change? How risky is it? What does the customer want to see, and when?* Module 9 covers agile in more detail.

## Try it

```task
{
  "id": "pmgt-m01-t1",
  "prompt": "Classify each as a **project** or **operations** and give a short reason: (1) opening a new shop branch; (2) running the shop daily; (3) paying staff each month; (4) building a website for a client; (5) answering customer calls. One per line.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "1. Project - ...",
  "rules": [
    { "label": "Five lines", "minLines": 5 },
    { "label": "Uses both words project and operations", "pattern": "project[\\s\\S]*operations|operations[\\s\\S]*project" },
    { "label": "Gives reasons (temporary, unique, ongoing, repeating)", "pattern": "temporary|unique|ongoing|repeat|end date|routine|one-?off|start and end", "perLine": true }
  ],
  "sample": "1. Project - temporary with an end date and a unique result.\n2. Operations - ongoing daily work that repeats.\n3. Operations - a repeating monthly routine.\n4. Project - a unique one-off result with a start and an end.\n5. Operations - ongoing routine work.",
  "required": true
}
```

```task
{
  "id": "pmgt-m01-t2",
  "prompt": "A client asks you to **add three new features** to a project but keep the **same deadline and budget**. In 50 to 100 words, explain the triple constraint problem and give two options you could offer.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Adding features affects ...",
  "rules": [
    { "label": "Mentions scope, time and cost", "pattern": "scope[\\s\\S]*(time|schedule)[\\s\\S]*cost|cost[\\s\\S]*(time|schedule)[\\s\\S]*scope" },
    { "label": "Explains they are linked", "pattern": "linked|connected|affect|trade-?off|balance|one changes|more (time|money)" },
    { "label": "Offers options (extend time, add budget, drop other features, phase)", "pattern": "extend|more time|add budget|extra budget|more money|drop|remove|phase|later|reduce" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "Scope, time and cost are linked, so adding three features without changing the deadline or budget puts quality at risk. I would explain the trade-off and offer two options. Option one: keep the budget and deadline but drop or postpone other lower-priority features so the scope stays the same size. Option two: add the features and agree extra time and budget through a formal change request. I would ask the client which of scope, time or cost matters most.",
  "required": true
}
```

```task
{
  "id": "pmgt-m01-t3",
  "prompt": "Pick a real project (for example organising a school event, a house move or launching a product) and describe **what happens in each of the five process groups**, one line each.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Initiating: ...",
  "rules": [
    { "label": "Five lines", "minLines": 5 },
    { "label": "Initiating", "pattern": "initiating" },
    { "label": "Planning", "pattern": "planning" },
    { "label": "Executing", "pattern": "executing" },
    { "label": "Monitoring and controlling", "pattern": "monitoring" },
    { "label": "Closing", "pattern": "closing" }
  ],
  "sample": "Initiating: agree with the principal that we will hold a school fair, with a ₦500,000 budget and a goal of raising ₦2 million.\nPlanning: set the date, list tasks, make a budget, assign teams and plan risks like rain.\nExecuting: book vendors, publicise the fair, set up stalls and run the day.\nMonitoring and controlling: check ticket sales and spending weekly and adjust the plan.\nClosing: count the money, thank volunteers, hand over the report and note lessons for next year.",
  "required": false
}
```

Next lesson: initiating a project.
