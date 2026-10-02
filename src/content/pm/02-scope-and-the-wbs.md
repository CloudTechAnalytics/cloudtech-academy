---
title: Scope and the work breakdown structure
minutes: 20
summary: Break a project's scope into deliverables and tasks with a work breakdown structure, check that every task has an owner and every deliverable is covered, and see how the WBS becomes the plan.
---

## The problem

The first version of the depot plan was a list of 60 things people remembered in a meeting. Some were duplicates, some had no owner, and nobody had thought about the opening stock until a week before. A plan built from memory misses things.

A **work breakdown structure** (WBS) starts from the outcome and breaks it down, level by level, until every piece is small enough to estimate, assign and track. Anything not in the WBS isn't in the project.

## The concept

**Breaking down**

1. The project outcome: an open, working Abuja depot.
2. Major **deliverables** (here, the phases): initiation, facilities, systems, people, operations, launch.
3. **Work packages**: tasks small enough to estimate with confidence (here, 1 to 25 working days likely) and owned by one person or team.

**Rules of thumb**

- The **100% rule**: the pieces at each level add up to all of the work of the level above, no more, no less.
- Name tasks by their outcome ("Install racking", not "Racking").
- Every task has exactly **one** owner.
- Split anything too big to estimate or track weekly.

**From WBS to plan**

The WBS says **what**. Estimates (lesson 3) say **how long**, dependencies and the schedule (lesson 4) say **when**, and daily costs say **how much**.

## Example

The depot's WBS, as an outline by phase:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/project/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""})

for phase, group in tasks.groupby("phase", sort=False):
    print(f"{phase}")
    for t in group.itertuples():
        print(f"    {t.task_id}  {t.name}  ({t.owner}, about {t.likely_days} days)")
```

```text
Initiation
    A1  Approve business case and charter  (Finance, about 3 days)
    A2  Select site and sign lease  (Operations, about 10 days)
    A3  Obtain building and trading permits  (Operations, about 15 days)
Facilities
    B1  Design depot layout  (Facilities, about 7 days)
    B2  Fit-out works: floor, power and security  (Contractor, about 25 days)
    B3  Order racking  (Procurement, about 5 days)
    B4  Import and clear racking  (Procurement, about 20 days)
    B5  Install racking  (Contractor, about 6 days)
    B6  Install generator and solar backup  (Contractor, about 8 days)
Systems
    C1  Choose warehouse system  (IT, about 7 days)
    C2  Buy laptops, scanners and printers  (IT, about 10 days)
    C3  Install network and internet  (IT, about 5 days)
    C4  Configure system and load data  (IT, about 10 days)
    C5  Test the system end to end  (IT, about 5 days)
People
    D1  Hire depot manager  (HR, about 20 days)
    D2  Hire 12 depot staff  (HR, about 20 days)
    D3  Train staff  (Operations, about 6 days)
Operations
    E1  Agree supplier delivery schedules  (Procurement, about 8 days)
    E2  Stock opening inventory  (Operations, about 5 days)
    E3  Set up delivery routes and trucks  (Operations, about 10 days)
Launch
    F1  Safety inspection  (Facilities, about 3 days)
    F2  Trial run  (Operations, about 5 days)
    F3  Opening day  (Operations, about 1 days)
```

Now some checks a planner runs on any WBS: tasks that are too big, owners and their load, and tasks nothing depends on (which should only be the final one):

```python
print("Tasks over 20 likely days:", tasks.loc[tasks["likely_days"] > 20, "task_id"].tolist())
print("Tasks per owner:", tasks["owner"].value_counts().to_dict())
needed = {p for preds in tasks["predecessors"] for p in preds.split(";") if p}
print("Tasks nothing depends on:", tasks.loc[~tasks["task_id"].isin(needed), "task_id"].tolist())
```

```text
Tasks over 20 likely days: ['B2']
Tasks per owner: {'Operations': 7, 'IT': 5, 'Contractor': 3, 'Procurement': 3, 'Facilities': 2, 'HR': 2, 'Finance': 1}
Tasks nothing depends on: ['F3']
```

Only the opening (F3) has nothing after it, which means every other task feeds the launch: nothing is orphaned. The fit-out (B2) is the one task over 20 days; it's a contractor's package with its own detailed plan, so it can stay as one line here, tracked by percentage complete.

## Walkthrough

1. Run the cells. Is there a task you'd split? Why?
2. Who owns the most tasks? Is that a risk?
3. The plan has no task for marketing the opening to retailers. Where would it go, and what would it depend on?
4. Break down a work package further (the task below).

## Practice

```answer
{
  "id": "pmf-02-p1",
  "prompt": "How many tasks does **Operations** own?",
  "answer": 7,
  "format": "number",
  "dataset": "project",
  "files": ["tasks"],
  "pyVerify": "int((tasks['owner'] == 'Operations').sum())",
  "hint": "The Operations count on the second line.",
  "required": true
}
```

```task
{
  "id": "pmf-02-t1",
  "prompt": "Break **D3 Train staff** (6 days) into **four to six** smaller work packages, one per line starting with a dash, each with an **owner** in brackets and a **duration** in days.",
  "minutes": 6,
  "rows": 7,
  "placeholder": "- Prepare training materials (Operations, 2 days)",
  "rules": [
    { "label": "Four to six lines starting with -", "pattern": "^\\s*-\\s+\\S", "min": 4 },
    { "label": "Each with an owner in brackets", "pattern": "\\([A-Z][^)\\n]*,", "min": 4 },
    { "label": "Each with a duration in days", "pattern": "\\d+(\\.\\d+)?\\s*days?\\)", "min": 4 },
    { "label": "Covers the warehouse system", "pattern": "system|scanner|software" },
    { "label": "Covers safety", "pattern": "safety|fire|forklift|first aid" }
  ],
  "sample": "- Prepare training materials and schedule (Operations, 1 day)\n- Safety and forklift training (Facilities, 1 day)\n- Warehouse system and scanner training (IT, 2 days)\n- Receiving, picking and loading practice (Operations, 1 day)\n- Assess staff and retrain gaps (Operations, 1 day)",
  "note": "The pieces add up to the original 6 days: the 100% rule.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is the 100% rule in a WBS?",
    "options": ["Every task is 100% done", "The pieces at each level add up to all the work of the level above, no more, no less", "Budgets must be 100% spent", "All tasks start together"],
    "answer": 1,
    "explanation": "Nothing missing, nothing extra."
  },
  {
    "prompt": "How many owners should a work package have?",
    "options": ["None", "Exactly one", "Everyone involved", "Two at least"],
    "answer": 1,
    "explanation": "Shared ownership means nobody owns it."
  },
  {
    "prompt": "Why build the plan from a WBS rather than a brainstormed list?",
    "options": ["It's quicker", "Breaking the outcome down systematically finds work a list misses", "Software requires it", "It's shorter"],
    "answer": 1,
    "explanation": "Start from the outcome."
  }
]
```
