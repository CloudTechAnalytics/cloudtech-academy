---
title: The brief and the charter
minutes: 40
summary: Meet Medlink Diagnostics, whose laboratory opening is in trouble, turn a sponsor's worry into a charter with scope, success criteria and constraints, and map the stakeholders you'll have to bring along.
---

## The problem

This is the capstone of the Project Manager track. There are no new techniques here. You'll do what a project manager is hired to do when a project is in trouble: find out where it really stands, say how late and how dear it will be, weigh the changes and recovery options on the table, and give the sponsor a decision they can act on.

The company is **Medlink Diagnostics**, a private laboratory group. It is opening a diagnostic laboratory in Port Harcourt, and its managing director has made a public promise. You've been brought in as project manager at the end of week 10. This is the email you find:

> "We told the state commissioner that the laboratory would open on **Monday 8 March 2027**. We are in week 10. The analysers are stuck in customs, the naira has moved against us, and I keep being asked for extras: a molecular room, a patient portal, a home-collection van. I don't know whether the date is safe, what it will cost, or which of these requests I should say yes to. I need a plan I can take to the board."

Notice what the email contains: a promised date, a feeling that something is wrong, and a pile of requests. It doesn't contain a status, a forecast or a decision. Your job is to produce all three, with evidence.

You have the project's own records: the task plan, ten weeks of progress and spending, the risk register, six change requests, eight stakeholders' views and six recovery options. All of it is fictional.

## The concept

### The arc of the project

| Stage | Output | Lesson |
| :-- | :-- | :-- |
| Brief and charter | Objective, scope, constraints, stakeholders | 1 |
| Scope, WBS and estimates | A checked plan with honest durations and cost | 2 |
| The critical path | The baseline schedule and what decides the date | 3 |
| Schedule risk | The probability of the promised date | 4 |
| Where are we now | Earned value at week 10 | 5 |
| The forecast | Likely finish date and cost | 6 |
| Risks and change requests | Reserves, and which changes to accept | 7 |
| Recovery and the decision paper | A recommended recovery, reported to the sponsor | 8 |

Use Python, Excel or a mix. The lessons show Python because it handles the schedule and the simulation cleanly; every number can be reproduced in a spreadsheet.

### A charter says what the project is for

A project charter is short, and it's agreed by the sponsor. It answers:

- **Objective:** what the project will deliver, in one sentence a stakeholder could repeat.
- **Success criteria:** how anyone will know it worked, with numbers and a date.
- **Scope:** what is in, and, just as important, what is out.
- **Constraints:** the date, the budget, the rules that can't bend.
- **Key stakeholders and the sponsor's authority:** who decides what.

Without it, every request sounds reasonable, and nobody can say no.

> [!NOTE]
> A charter isn't a promise that everything will go to plan. It's the agreed definition of "done" that you measure change against. When a request arrives, you ask: does it serve the objective, and what does it do to the date and the budget?

### Stakeholders: who can help, who can block

Plot each stakeholder by **influence** and **interest**. Manage closely those high on both, keep satisfied those with high influence but less interest, keep informed those with high interest but less influence, and watch the rest. Then record what each one **cares about**, because it tells you how to talk to them. The licensing office cares about complete paperwork, not about your date.

![An invented charter in five lines for a school science lab and an influence and interest grid with how to engage each stakeholder](/images/courses/pm-capstone/charter-stakeholders.svg "Charter and stakeholder grid (invented example: a school science lab).")

## Example

Open the project's tasks and stakeholders:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/lab/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""})
stakeholders = pd.read_csv(base + "stakeholders.csv")

print(len(tasks), "tasks in", tasks["phase"].nunique(), "phases")
print(tasks.groupby("phase")["task_id"].count().to_string())
```

```text
23 tasks in 7 phases
phase
Equipment     3
Facilities    3
Initiation    3
Launch        4
Operations    2
People        3
Systems       5
```

The plan has **23 tasks in 7 phases**. Each task has an owner, three duration estimates (optimistic, likely and pessimistic), its predecessors and a daily cost. The approved budget is the likely duration times the daily cost, added up:

```python
tasks["budget_ngn"] = tasks["likely_days"] * tasks["daily_cost_ngn"]
print(f"Approved budget (BAC): ₦{tasks['budget_ngn'].sum():,.0f}")
```

```text
Approved budget (BAC): ₦90,750,000
```

Now the stakeholders, by influence and interest:

```python
print(stakeholders.groupby(["influence", "interest"])["stakeholder"].apply(lambda s: "; ".join(s)).to_string())
```

```text
influence  interest
High       High                              Managing director (sponsor)
           Low                                          Licensing office
           Medium      State commissioner for health; Chief financial...
Low        Medium                                Local community leaders
Medium     High        Medical director; Head of procurement; Laborat...
```

The managing director and the commissioner don't sit in the same box. The sponsor is high on both; the commissioner has high influence but only medium interest in the details, so a short, regular, public-facing update suits them better than a weekly project call.

## Walkthrough

1. Load the six files (`tasks`, `weekly_status`, `risks`, `changes`, `stakeholders` and `options`) and note each one's grain: one row per task, per task per week, per risk, per change request, per stakeholder, per option.
2. Check the task list: every task has an owner, and every predecessor named exists as a task.
3. Calculate the approved budget.
4. Group the stakeholders by influence and interest, and read each one's quote.
5. Write the charter and the stakeholder strategy (the tasks below).

## Practice

```answer
{
  "id": "pmc-01-p1",
  "prompt": "What is the **approved budget** (the sum of likely days × daily cost over all tasks), in naira?",
  "answer": 90750000,
  "format": "naira",
  "dataset": "lab",
  "files": ["tasks"],
  "pyVerify": "int((tasks['likely_days'] * tasks['daily_cost_ngn']).sum())",
  "hint": "Multiply, then add up. The example already printed it.",
  "required": true
}
```

```answer
{
  "id": "pmc-01-p2",
  "prompt": "How many stakeholders are **high on both influence and interest**?",
  "answer": 1,
  "format": "number",
  "dataset": "lab",
  "files": ["stakeholders"],
  "pyVerify": "int(((stakeholders['influence'] == 'High') & (stakeholders['interest'] == 'High')).sum())",
  "hint": "Count the rows where both columns say High.",
  "required": true
}
```

```task
{
  "id": "pmc-01-t1",
  "prompt": "Write the project's **charter** (80 to 180 words): the **objective**, the **success criteria** (a date and the budget), what is **in scope** and **out of scope**, and the main **constraints**. Don't mention any solution to the delay; you haven't earned one yet.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Objective: ...",
  "rules": [
    { "label": "States an objective (open a laboratory)", "pattern": "objective|open(ing)? (the|a) (diagnostic )?lab" },
    { "label": "Gives the date", "pattern": "8 March|March 2027|8/3|2027-03-08" },
    { "label": "Gives the budget", "pattern": "90[.,]?75|₦?\\s?90\\.75|90,750,000|₦90" },
    { "label": "Says what is in scope", "pattern": "in scope|includes?|covers?" },
    { "label": "Says what is out of scope", "pattern": "out of scope|excludes?|not included|not part" },
    { "label": "Names a constraint", "pattern": "constraint|fixed|cannot|must|licen[cs]e|accredit" },
    { "label": "Between 80 and 180 words", "minWords": 80, "maxWords": 180 }
  ],
  "sample": "Objective: open Medlink's diagnostic laboratory in Port Harcourt, ready to run its full test menu to an accredited standard. Success criteria: the laboratory opens on Monday 8 March 2027, within the approved budget of ₦90.75 million, with accreditation passed. In scope: the premises, fit-out, analysers and their installation, the laboratory information system, hiring and training the staff, reagent supply and the trial run. Out of scope: a second site, molecular testing, a patient portal, and home collection; these need their own business cases. Constraints: the date was promised publicly to the state commissioner, the facility licence and accreditation inspection are controlled by the regulator and cannot be hurried, and the analysers are imported. Any change that moves the date or the budget needs the sponsor's decision.",
  "note": "The out-of-scope list matters most here: the requests in the sponsor's email are exactly the things a charter should have kept out, or put through change control. A good charter makes \"no, or not yet\" easy to say.",
  "hint": "Objective, success criteria (date and budget), in, out, constraints.",
  "required": true
}
```

```task
{
  "id": "pmc-01-t2",
  "prompt": "Write a **stakeholder strategy** (60 to 150 words) for three of them: the managing director, the licensing office and the medical director. For each, say how you'll **engage** them and what you'll **give** them, based on what they care about.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Managing director: ...",
  "rules": [
    { "label": "Covers the managing director / sponsor", "pattern": "managing director|sponsor" },
    { "label": "Covers the licensing office", "pattern": "licensing" },
    { "label": "Covers the medical director", "pattern": "medical director" },
    { "label": "Says how often or how to engage", "pattern": "weekly|fortnight|monthly|regular|meeting|update|call|brief" },
    { "label": "Ties it to what they care about", "pattern": "date|paperwork|complete|menu|quality|decision|concern|care" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "Managing director (sponsor): a short weekly update with one page on status, the forecast date and the decisions I need from them, because they need to know whether the promise is safe. Licensing office: I'll keep the paperwork complete and early, send it with a checklist and ask for the earliest inspection slot, because they care about complete paperwork rather than our deadline. Medical director: I'll show them what any recovery option does to the test menu before I propose it, and ask them to approve any reduced-menu opening, because they won't open a lab that can't run the full menu.",
  "note": "Same project, three different conversations. Engagement follows what each person cares about, not how senior they are.",
  "hint": "What does each one care about? Give them that.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The sponsor's email lists a molecular room, a patient portal and a home-collection van. Before saying yes or no, what should you do?",
    "options": ["Accept them all to keep everyone happy", "Check them against the charter and put each through change control, with its effect on date and cost", "Reject them all", "Ask the board to choose"],
    "answer": 1,
    "explanation": "The charter is the yardstick; change control is the process."
  },
  {
    "prompt": "Which is the best success criterion?",
    "options": ["A great laboratory", "Open on 8 March 2027, within ₦90.75m, with accreditation passed", "As soon as possible", "When the staff are ready"],
    "answer": 1,
    "explanation": "A date, a budget and a test anyone can check."
  },
  {
    "prompt": "The licensing office is high influence but low interest in your project. How should you manage them?",
    "options": ["Ignore them", "Keep them satisfied: complete, early paperwork and a clear point of contact", "Invite them to every meeting", "Pressure them to inspect early"],
    "answer": 1,
    "explanation": "High influence means their decisions can stop you; keep them satisfied without burdening them."
  }
]
```
