---
title: What business analysts do
minutes: 20
summary: The business analyst's job, how it differs from a data analyst's or project manager's, and the first and most important skill, separating the problem from the requested solution.
---

## The problem

Ashgrove Chambers, a Lagos law firm with eight lawyers and 50 clients, has a request from its managing partner, Mrs Folake Adeyemi-Cole:

> "We need a new practice-management system. Ours is a mess of spreadsheets. Find us one by the end of the quarter."

A junior analyst starts comparing software. An experienced business analyst asks a different question first: **what problem is the system meant to solve?** Spreadsheets aren't a problem in themselves. Somewhere there's a cost: money arriving late, lawyers wasting hours, clients complaining. Until you know which, you can't say whether a new system will fix it, or whether something cheaper would do.

That question is the heart of business analysis, and this course teaches you to answer it properly, using Ashgrove as the case throughout.

## The concept

**What a business analyst does**

A business analyst (BA) helps an organisation change for the better, by understanding how it works now, working out what needs to change and why, and specifying the change clearly enough that it can be built, bought or adopted. The BA sits between the people with the problem (the "business") and the people who'll deliver the solution (developers, suppliers, the operations team).

| Role | Main question | Typical outputs |
| :-- | :-- | :-- |
| **Business analyst** | What should change, and why? | problem statements, process maps, requirements, user stories, business cases |
| Data analyst | What does the data say? | analyses, dashboards, findings |
| Project manager | How do we deliver it on time and budget? | plans, schedules, risk logs |
| Product owner | What do we build next? | a prioritised backlog |

The roles overlap, especially in small companies, where one person may do all four. A BA who can query data is far more effective, which is why this track includes Excel, SQL and Power BI.

**The business analysis cycle**

1. **Understand the problem**: stakeholders, goals and the current situation, measured with data where possible.
2. **Analyse the current state**: how the work flows today and where it breaks.
3. **Define the future state**: what should be different.
4. **Specify requirements**: what the solution must do, in a form people can build and test.
5. **Justify it**: a business case comparing the options.
6. **Support delivery**: answer questions, test the solution and help people adopt it.

**Problem, not solution**

Requests usually arrive as solutions: "we need a system", "build a dashboard", "hire another clerk". Your first job is to work backwards to the problem with questions like "What would be different if we had it?", "What does it cost us not to have it?" and "How would we know it worked?".

A good **problem statement** says who's affected, what's happening, what it costs, and how you'll measure success, without naming a solution.

## Example

The managing partner's request, turned into a problem statement after a few conversations:

> "Ashgrove's clients take an average of 45 days to pay their invoices, and ₦188m is currently overdue, much of it for more than six months. Partners spend hours each month chasing payments by phone, and nobody can see at a glance what's owed or by whom. We want to collect faster and know where we stand, measured by average days to pay and the value of overdue invoices."

Notice what's missing: the word "system". A new system might be the answer. So might automatic email reminders, a weekly overdue report, or clearer payment terms on the invoice. The problem statement leaves those options open, and gives you a way to measure whichever one is chosen.

## Walkthrough

1. Read the managing partner's request again and list the questions you'd ask her before doing anything else.
2. Download the legal dataset and open `invoices.csv`. Filter `status` to Overdue. That list is the problem in the problem statement.
3. Write Ashgrove's request as a problem statement in your own words (the task below).
4. Note who else you'd need to talk to: the people who issue invoices, chase them, pay them and use the reports.

## Practice

```dataset
{"dataset": "legal", "files": ["invoices", "matters", "clients"]}
```

```answer
{
  "id": "ba-01-p1",
  "prompt": "How many of Ashgrove's invoices are **Overdue**?",
  "answer": 70,
  "format": "number",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT COUNT(*) FROM invoices WHERE status = 'Overdue'",
  "hint": "Filter invoices.csv to status = Overdue and count the rows.",
  "required": true
}
```

```task
{
  "id": "ba-01-t1",
  "prompt": "A hospital's operations director says: **\"We need an app for booking appointments.\"** After a conversation, you learn that patients wait about 3 hours in the clinic, about 1 in 5 booked patients don't turn up, and nobody knows how many slots are wasted each week. Write a **problem statement** in 2 to 4 sentences: who's affected, what's happening, what it costs, and how success would be measured. **Don't** name a solution (no app, system or software).",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Patients at the clinic ...",
  "rules": [
    { "label": "Says who's affected (patients, doctors or staff)", "pattern": "patient|doctor|staff|nurse|clinic" },
    { "label": "Includes at least one number from the situation", "pattern": "\\d" },
    { "label": "Says how success would be measured", "pattern": "measur|success|target|reduc|fewer|less than|track" },
    { "label": "Doesn't name a solution: no app, system, software or platform", "pattern": "\\b(app|apps|application|system|software|platform|portal)\\b", "absent": true },
    { "label": "Between 30 and 110 words", "minWords": 30, "maxWords": 110 }
  ],
  "sample": "Patients at the outpatient clinic wait about 3 hours to be seen, and around 1 in 5 booked patients don't turn up, so doctors' time is wasted while others wait. Nobody can currently say how many slots are lost each week. Success would mean shorter waiting times and fewer wasted slots, measured weekly by average wait and the no-show rate.",
  "note": "Leaving the app out isn't pedantry. Once the problem is clear, cheaper options appear: SMS reminders the day before might cut no-shows on their own, and staggered booking times might cut waiting. The app may still be right, but now it has to earn its place.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A manager says 'we need a dashboard'. What should a business analyst do first?",
    "options": ["Start building the dashboard", "Find out what decision or problem the dashboard is for, and how success would be measured", "Choose a tool", "Write user stories"],
    "answer": 1,
    "explanation": "Requests usually arrive as solutions. Work back to the problem first."
  },
  {
    "prompt": "Which is the best problem statement?",
    "options": ["We need a new CRM", "Sales staff are unhappy", "Sales staff spend about 6 hours a week re-entering orders, causing errors in 4% of invoices; we'll measure success by time spent and the error rate", "Improve efficiency"],
    "answer": 2,
    "explanation": "Who, what, the cost and a measure, with no solution named."
  },
  {
    "prompt": "What's the main difference between a business analyst and a data analyst?",
    "options": ["BAs don't use data", "A BA works out what should change and why, and specifies it; a data analyst finds out what the data says", "Data analysts write requirements", "There is none"],
    "answer": 1,
    "explanation": "The roles overlap, and a BA who can analyse data is more effective."
  }
]
```
