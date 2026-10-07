---
title: Agile and Hybrid Delivery
minutes: 25
summary: Understand agile values and Scrum, use backlogs, sprints and reviews, apply Kanban and choose or mix approaches for your project.
---

## Agile values and Scrum

**Agile** is an approach to delivering projects in **short cycles**, getting feedback and adapting, instead of planning everything in detail first. It began in software but is used for marketing, product development, events and many other fields.

The Agile Manifesto values:

- **Individuals and interactions** over processes and tools.
- **Working results** over comprehensive documentation.
- **Customer collaboration** over contract negotiation.
- **Responding to change** over following a plan.

The things on the right still matter, but the left matters more. Principles include delivering value early and often, welcoming changing requirements, close collaboration with the customer, sustainable pace, simplicity and regular reflection.

**Scrum** is the most popular agile framework. Its parts:

**Roles:**

- **Product Owner:** represents the customer; owns and prioritises the backlog; decides what is most valuable.
- **Scrum Master:** helps the team follow Scrum, removes obstacles and protects the team.
- **Development Team:** the people who do the work; self-organising and cross-skilled.

**Events:**

- **Sprint:** a fixed period (commonly one to four weeks) in which a usable piece of work is completed.
- **Sprint planning:** the team selects what it can deliver in the sprint.
- **Daily stand-up:** a 15-minute meeting: what I did, what I will do, what blocks me.
- **Sprint review:** the team shows the finished work to stakeholders and gets feedback.
- **Sprint retrospective:** the team reflects on how to work better.

**Artifacts:** the **product backlog**, the **sprint backlog** and the **increment** (the working result).

## Backlogs, sprints and reviews

The **product backlog** is a prioritised list of everything that might be needed. Items are often written as **user stories:**

*As a [type of user], I want [goal], so that [benefit].*

Example: *As a parent, I want to pay school fees by transfer, so that I do not have to queue at the bursar's office.*

Each item has **acceptance criteria** (how we will know it is done) and an **estimate,** often in **story points** (a relative measure of size and effort, not hours).

**Sprint planning:** the team pulls the top items it can complete into the sprint backlog, based on its **velocity**, the average story points it completes per sprint.

Example: in the last three sprints the team completed **20, 24 and 22** points. Velocity = (20 + 24 + 22) ÷ 3 = **22 points per sprint.** If the backlog holds **110 points**, the project needs 110 ÷ 22 = **5 sprints.** With two-week sprints, that is **10 weeks.** This is a forecast, and it changes as the backlog and velocity change.

During a sprint: the team works, holds daily stand-ups, avoids adding new work (changes go to the backlog for the next sprint) and keeps the **Definition of Done** (an agreed checklist that every item must meet).

At the **sprint review** stakeholders see working results and give feedback; the Product Owner updates the backlog. At the **retrospective** the team picks one or two improvements for the next sprint.

## Kanban

**Kanban** is a flow-based method that visualises work on a board with columns, such as **To do, In progress, Review, Done.** Each task is a card that moves across.

Key practices:

- **Visualise the work.**
- **Limit work in progress (WIP):** only a set number of cards may be in a column at once (for example, no more than 3 in Progress). This reduces multitasking and exposes bottlenecks.
- **Manage flow:** measure **cycle time** (how long a card takes from start to done) and **throughput** (how many finish per week).
- **Make rules explicit** (what "done" means).
- **Improve continuously.**

Kanban suits ongoing, unpredictable work such as support requests, maintenance and content production. It has no fixed sprints, so work can be added at any time, subject to WIP limits.

## Choosing and mixing approaches

Choose by the nature of the project:

| Question | Points to predictive (traditional) | Points to agile |
| :-- | :-- | :-- |
| Are requirements clear and stable? | Yes | No, they will evolve |
| Is change expensive? | Yes (construction, regulated work) | No, easy to adjust |
| Can the customer give frequent feedback? | Rarely | Yes |
| Is the scope fixed by contract? | Yes | Flexible |
| Is the technology or market uncertain? | No | Yes |

A **hybrid** approach combines them. For example, a company building a new shop and a mobile app might use a traditional plan for the building (fixed budget and dates) and agile sprints for the app, tied together at key milestones. Another hybrid: plan the whole project with a charter, budget and milestones, but deliver in short iterations with regular reviews.

Whatever you choose, keep the **fundamentals:** a clear goal, a prioritised list of work, regular communication, risk and change management, and honest reporting. Do not adopt a method just because it is fashionable, and do not call it agile if nobody gets feedback.

## Try it

```task
{
  "id": "pmgt-m09-t1",
  "prompt": "A team completed **20, 24 and 22** story points in the last three sprints. The backlog has **110** points and sprints last **two weeks**. Work out the **velocity**, the **number of sprints** and the **time** needed, and say why it is only a forecast.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Velocity = ...",
  "rules": [
    { "label": "Velocity of 22", "pattern": "\\b22\\b" },
    { "label": "5 sprints", "pattern": "\\b5\\b" },
    { "label": "10 weeks", "pattern": "\\b10\\s*weeks" },
    { "label": "Explains it can change (backlog, velocity, changes)", "pattern": "change|vary|forecast|estimate|uncertain|backlog|velocity" }
  ],
  "sample": "Velocity = (20 + 24 + 22) / 3 = 22 points a sprint.\nSprints needed = 110 / 22 = 5 sprints.\nTime = 5 x 2 weeks = 10 weeks.\nIt is only a forecast because the backlog will change and the team's velocity will vary from sprint to sprint.",
  "required": true
}
```

```task
{
  "id": "pmgt-m09-t2",
  "prompt": "Write **three user stories** for a project of your choice in the form *As a [user], I want [goal], so that [benefit]*, each with **two acceptance criteria**. At least nine lines.",
  "minutes": 15,
  "rows": 11,
  "placeholder": "Story 1: As a ..., I want ..., so that ...\nAcceptance: ...",
  "rules": [
    { "label": "At least nine lines", "minLines": 9 },
    { "label": "Three stories in the standard form", "pattern": "as (an?|the) [^,\\n]+, i want [^,\\n]+, so that", "min": 3 },
    { "label": "Acceptance criteria", "pattern": "acceptance|criteri", "min": 3 },
    { "label": "Measurable criteria (numbers or clear tests)", "pattern": "\\d+|within|at least|must|when", "min": 4 }
  ],
  "sample": "Story 1: As a parent, I want to pay school fees by transfer, so that I do not have to queue at the bursar's office.\nAcceptance: the parent receives a receipt within 5 minutes of payment.\nAcceptance: the payment shows against the child's account the same day.\nStory 2: As a teacher, I want to see my class list online, so that I can take attendance quickly.\nAcceptance: the list loads in under 3 seconds on a phone.\nAcceptance: attendance can be saved with at most two taps per student.\nStory 3: As the principal, I want a weekly fees report, so that I can follow collections.\nAcceptance: the report is sent every Monday by 8 am.\nAcceptance: it shows total paid, total owing and the ten largest debts.",
  "required": true
}
```

```task
{
  "id": "pmgt-m09-t3",
  "prompt": "Decide whether your project suits **traditional, agile or hybrid** delivery. In 60 to 120 words, answer at least three of the choosing questions (clear requirements, cost of change, customer feedback, uncertainty) and give your choice.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "My project suits ...",
  "rules": [
    { "label": "States a choice (traditional, agile or hybrid)", "pattern": "traditional|predictive|waterfall|agile|hybrid" },
    { "label": "Mentions requirements being clear or changing", "pattern": "requirements" },
    { "label": "Mentions cost of change, customer feedback or uncertainty", "pattern": "cost of change|expensive|feedback|uncertain|stable|changes?" },
    { "label": "Gives a reason", "pattern": "because|since|so|therefore" },
    { "label": "Between 60 and 120 words", "minWords": 60, "maxWords": 125 }
  ],
  "sample": "My project suits a hybrid approach. The installation of the solar system has clear, stable requirements and changing it later would be expensive, so I will plan it traditionally with a fixed budget and milestones. The monitoring dashboard for the school is different, because the users' needs are uncertain and they can give feedback often, so I will build it in two-week agile sprints with reviews. I chose this because it uses each method where it fits and ties them together at the commissioning milestone.",
  "required": false
}
```

Next lesson: execution, monitoring and reporting.
