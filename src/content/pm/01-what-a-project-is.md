---
title: What a project is
minutes: 20
summary: What makes work a project, the balance between scope, time and cost, the project lifecycle and the charter, and a first look at Kolanut's Abuja depot launch.
---

## The problem

Kolanut, the drinks and snacks distributor from the forecasting course, is opening a depot in Abuja. Sales want it open before the year-end rush. The finance director wants it within budget. Operations want it done properly: permits, racking, power, systems, trained staff, stock and delivery routes, all ready on the same day.

Ten weeks in, the fit-out is behind, imported equipment cost more than planned, and Sales have just asked for a cold room. Is the opening date still realistic? What will it cost? Which requests should be approved? This course gives you the tools to answer, using the project's real plan and progress.

## The concept

**A project** is temporary work with a defined outcome: it has a start, an end, and something specific to deliver. Running the depot afterwards is operations; launching it is a project.

### Scope, time and cost

Every project balances three things: **what** is delivered (scope), **when** (time) and **for how much** (cost), at an agreed quality. Change one and at least one other moves. Adding a cold room (scope) costs money and time; opening sooner (time) needs more money or less scope.

### The lifecycle

| Phase | Key outputs |
| :-- | :-- |
| Initiation | the business case and **charter**: why, what, who, by when, for how much |
| Planning | tasks, estimates, schedule, budget, risks |
| Delivery | doing the work, tracking it, handling changes |
| Closing | handing over, lessons learned |

### The charter

One page that authorises the project: its objective, scope (in and out), deadline, budget, sponsor, project manager, and how success is measured. Without one, people disagree later about what was promised.

![A triangle of scope, time and cost around quality, with an example where adding a cold room raises cost or time; below, the four project phases: initiation, planning, delivery and closing](/images/courses/pm/triple-constraint.svg "Scope, time and cost pull against each other; a project moves through four phases.")

## Example

The depot project's tasks:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/project/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""})
print(len(tasks), "tasks")
tasks["budget_ngn"] = tasks["likely_days"] * tasks["daily_cost_ngn"]
tasks.groupby("phase").agg(tasks=("task_id", "size"), budget_ngn=("budget_ngn", "sum")).sort_values("budget_ngn", ascending=False)
```

```text
23 tasks
            tasks  budget_ngn
phase
Facilities      6    45170000
Systems         5    13400000
Operations      3     7600000
People          3     6520000
Initiation      3     4990000
Launch          3     3850000
```

Each task has three estimates of its length in **working days** (lesson 3), the tasks it depends on, and a daily cost. The budget here uses the most likely length of each task. The biggest spending is in facilities: fit-out, racking, power. Now look at the first few tasks and their dependencies:

```python
tasks[["task_id", "name", "owner", "likely_days", "predecessors"]].head(8)
```

```text
task_id                                      name        owner  likely_days predecessors
0      A1         Approve business case and charter      Finance            3
1      A2                Select site and sign lease   Operations           10           A1
2      A3       Obtain building and trading permits   Operations           15           A2
3      B1                       Design depot layout   Facilities            7           A2
4      B2  Fit-out works: floor, power and security   Contractor           25        A3;B1
5      B3                             Order racking  Procurement            5           B1
6      B4                  Import and clear racking  Procurement           20           B3
7      B5                           Install racking   Contractor            6        B2;B4
```

Nothing can start until the charter is approved (A1); the fit-out (B2) needs both the permits (A3) and the layout design (B1). These dependencies, not the number of tasks, decide how long the project takes, as lesson 4 shows.

## Walkthrough

1. Run the cells. Which phase has the most tasks? Which costs the most?
2. Find every task that depends on B2. What happens to them if the fit-out slips?
3. Name one thing that is in scope and one that is out of scope for this project.
4. Write the charter's key lines (the task below).

## Practice

```dataset
{"dataset": "project", "files": ["tasks", "weekly_status", "risks", "changes"]}
```

```answer
{
  "id": "pmf-01-p1",
  "prompt": "What is the project's total budget based on most likely durations, in naira?",
  "answer": 81530000,
  "format": "naira",
  "dataset": "project",
  "files": ["tasks"],
  "pyVerify": "int(tasks['budget_ngn'].sum())",
  "hint": "Add up the budget column.",
  "required": true
}
```

```task
{
  "id": "pmf-01-t1",
  "prompt": "Write the key lines of the **project charter** for the Abuja depot, one per line starting with **Objective:**, **In scope:**, **Out of scope:**, **Deadline:**, **Budget:**, **Sponsor:** and **Success:**.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "Objective: ...",
  "rules": [
    { "label": "An Objective line", "pattern": "^\\s*objective\\s*:" },
    { "label": "In scope and Out of scope lines", "pattern": "^\\s*(in scope|out of scope)\\s*:", "min": 2 },
    { "label": "A Deadline line with a date", "pattern": "^\\s*deadline\\s*:[^\\n]*\\d" },
    { "label": "A Budget line with an amount", "pattern": "^\\s*budget\\s*:[^\\n]*(₦|naira|\\d)" },
    { "label": "A Sponsor line", "pattern": "^\\s*sponsor\\s*:" },
    { "label": "A Success line that's measurable", "pattern": "^\\s*success\\s*:[^\\n]*\\d" }
  ],
  "sample": "Objective: open a working Kolanut depot in Abuja that serves our Abuja retailers from day one.\nIn scope: lease, permits, fit-out, racking, backup power, warehouse system, hiring and training staff, opening stock and delivery routes.\nOut of scope: new product lines, changes to the Lagos depot, a retail shop.\nDeadline: open for deliveries by Wednesday 30 September 2026, before the Q4 stock build-up.\nBudget: about ₦81.5 million at most likely costs, plus a contingency reserve agreed after the risk review.\nSponsor: the operations director, who approves changes to scope, deadline or budget.\nSuccess: open on time, within budget plus contingency, and deliver 95% of orders on time in the first month.",
  "note": "The out-of-scope line prevents arguments later; the sponsor line says who decides when things change.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which is a project rather than operations?",
    "options": ["Running the depot every day", "Opening the new depot", "Paying monthly salaries", "Weekly deliveries"],
    "answer": 1,
    "explanation": "Temporary, with a defined outcome."
  },
  {
    "prompt": "Sales want a cold room added. Under the scope, time and cost balance, what usually happens?",
    "options": ["Nothing changes", "Time, cost or both increase", "The project gets cheaper", "Quality improves for free"],
    "answer": 1,
    "explanation": "More scope moves the other constraints."
  },
  {
    "prompt": "Why write an 'out of scope' line in the charter?",
    "options": ["To fill space", "So nobody later assumes the project includes things it doesn't", "It's legally required", "To reduce the budget"],
    "answer": 1,
    "explanation": "Clear boundaries prevent disputes."
  }
]
```
