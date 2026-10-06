---
title: The critical path
minutes: 30
summary: Build the baseline schedule with the critical path method, find the 11 tasks that decide the opening date and the ones with room to slip, and see how little cushion the promised date really had.
---

## The problem

Twenty-three tasks, each owner pushing to finish theirs. But they don't all matter equally for the opening date. Hiring staff can slip by weeks without delaying anything; one day lost importing the analysers delays the opening by one day. A project manager who treats every task alike spends effort in the wrong places, and a sponsor who hears "everything is a priority" learns nothing.

The managing director promised **Monday 8 March 2027**. Before you ask how late the project is, you need to know where the plan itself put the finish. Was the promised date ever safe?

## The concept

### The critical path method

1. **Forward pass.** A task's **earliest start** is the latest earliest-finish of everything it depends on. Earliest finish = earliest start + duration. The project's length is the last earliest finish.
2. **Backward pass.** Working back from the end, a task's **latest finish** is the earliest latest-start of the tasks that depend on it.
3. **Float** (slack) = latest start − earliest start: how long a task can slip without delaying the end.
4. The **critical path** is the chain of tasks with zero float. Any delay on it delays the project.

Durations are in working days. Convert to dates with a working calendar (Monday to Friday here; a real plan would also remove public holidays).

![A small invented network of seven tasks showing the critical chain with zero float and a side chain whose three tasks share six days of float](/images/courses/pm-capstone/critical-chain.svg "The longest chain is critical; the rest has float.")

### Float is not free time

A task with float can slip, but it uses up the float, and other tasks may share the same float. Two tasks with 8 days of float each, in the same chain, don't give you 16.

> [!TIP]
> The critical path isn't fixed. A delay on a task with float doesn't change the path until it uses all its float; a delay or an acceleration on the critical path can make another path critical. Recompute whenever something changes.

## Example

A scheduling function you'll reuse in later lessons:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/lab/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""})
START = np.datetime64("2026-11-02")     # a Monday
PROMISE = np.datetime64("2027-03-08")   # the date promised to the commissioner

def schedule(tasks, durations):
    preds = {t: [p for p in ps.split(";") if p] for t, ps in zip(tasks["task_id"], tasks["predecessors"])}
    es, ef = {}, {}
    for t in tasks["task_id"]:                       # tasks are listed after their predecessors
        es[t] = max((ef[p] for p in preds[t]), default=0)
        ef[t] = es[t] + durations[t]
    end = max(ef.values())
    ls, lf = {}, {}
    for t in reversed(list(tasks["task_id"])):
        successors = [s for s in tasks["task_id"] if t in preds[s]]
        lf[t] = min((ls[s] for s in successors), default=end)
        ls[t] = lf[t] - durations[t]
    out = pd.DataFrame({"es": es, "ef": ef, "ls": ls, "lf": lf})
    out["float"] = out["ls"] - out["es"]
    return out, end

def finish_date(days):
    return np.busday_offset(START, int(np.ceil(days)) - 1, roll="forward")

likely = dict(zip(tasks["task_id"], tasks["likely_days"]))
plan, end = schedule(tasks, likely)
print("Project length:", end, "working days, opening on", finish_date(end))
print("Critical path:", " -> ".join(plan.index[plan["float"] == 0]))
```

```text
Project length: 90 working days, opening on 2027-03-05
Critical path: A1 -> A2 -> B1 -> B3 -> B4 -> B5 -> E2 -> F1 -> F2 -> F3 -> F4
```

The baseline finishes on **Friday 5 March 2027**: day 90. The promise is for Monday 8 March, day 91. The plan left **one working day** of cushion, and that was before anything went wrong.

```python
promise_day = int(np.busday_count(START, PROMISE)) + 1
print("Promised date is working day", promise_day, "- cushion:", promise_day - end, "working day(s)")

view = plan[["es", "ef", "float"]].copy()
view["name"] = tasks.set_index("task_id")["name"]
print(view.sort_values("float").head(14).to_string())
```

```text
Promised date is working day 91 - cushion: 1 working day(s)
    es  ef  float                                         name
A1   0   3      0            Approve business case and charter
A2   3  11      0                  Sign lease for the premises
B1  11  19      0        Design the lab layout and clean areas
B3  19  25      0                          Order the analysers
B5  50  57      0          Install and calibrate the analysers
B4  25  50      0               Import and clear the analysers
E2  57  63      0               Stock reagents and consumables
F1  63  75      0  Validate the methods and run quality checks
F2  75  83      0   Pass the external accreditation inspection
F3  83  89      0              Trial run with sample specimens
F4  89  90      0                                  Opening day
B2  19  47      3      Fit-out: floors, power and air handling
B6  47  55      8        Install backup power and cold storage
C5  57  63     12           Test the system with the analysers
```

Eleven tasks have zero float. Look at what they are: the premises, the layout, ordering and importing the analysers, installing them, stocking reagents, validating the methods, the inspection, the trial run and the opening. The long-lead imported equipment runs the whole project, not the fit-out, which has 3 days of float, and not hiring, which has 30.

## Walkthrough

1. Define `schedule()` and `finish_date()`.
2. Build the baseline from likely durations. Note the length and the finish date.
3. Compare the finish with the promised date, in working days.
4. List the zero-float tasks, and read each one's owner.
5. Look at the tasks with the most float. Which owners are working hardest on things that don't matter this month?
6. Write the baseline schedule note (the task below).

## Practice

```answer
{
  "id": "pmc-03-p1",
  "prompt": "On what date does the **baseline** schedule finish? Type it as YYYY-MM-DD.",
  "answer": "2027-03-05",
  "format": "text",
  "accept": ["5 march 2027", "2027-03-05", "05/03/2027", "5/3/2027"],
  "dataset": "lab",
  "files": ["tasks"],
  "pyVerify": "str(finish_date(end))",
  "hint": "The example's first output.",
  "required": true
}
```

```answer
{
  "id": "pmc-03-p2",
  "prompt": "How many tasks are on the **critical path** (zero float)?",
  "answer": 11,
  "format": "number",
  "dataset": "lab",
  "files": ["tasks"],
  "pyVerify": "int((plan['float'] == 0).sum())",
  "hint": "Count the tasks with float equal to zero.",
  "required": true
}
```

```answer
{
  "id": "pmc-03-p3",
  "prompt": "How many days of **float** does task **D1** (hire the laboratory director) have?",
  "answer": 30,
  "format": "number",
  "dataset": "lab",
  "files": ["tasks"],
  "pyVerify": "int(plan.loc['D1', 'float'])",
  "hint": "Look at the row for D1 in the schedule.",
  "required": true
}
```

```task
{
  "id": "pmc-03-t1",
  "prompt": "Write the **baseline schedule note** for the sponsor (60 to 150 words): the **baseline finish date**, how it compares with the **promised date**, which kind of tasks are **critical** and which have the **most float**, and what that means for where you'll spend your attention.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "On likely durations the project finishes on ...",
  "rules": [
    { "label": "Gives the baseline finish (5 March)", "pattern": "5 March|2027-03-05|05/03|day 90|90 (working )?days" },
    { "label": "Compares with the promised date (8 March)", "pattern": "8 March|2027-03-08|promised|promise|commissioner" },
    { "label": "Says the cushion is tiny (one day)", "pattern": "one (working )?day|single (working )?day|1 (working )?day|no (real )?(cushion|buffer|slack)|barely|tiny" },
    { "label": "Names critical activities (analysers, installation, inspection...)", "pattern": "analyser|import|install|inspection|accreditation|valid" },
    { "label": "Names a high-float activity (hiring, systems)", "pattern": "hir|director|system|float" },
    { "label": "Says where attention goes (critical path)", "pattern": "critical path|attention|focus|watch|prioriti" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "On the likely durations the project finishes on Friday 5 March 2027, working day 90. The promised opening is Monday 8 March, working day 91, so the plan had a single working day of cushion before anything went wrong. Eleven tasks are on the critical path, and they are the long-lead chain that starts with the premises and the analyser order and runs through importing and installing the analysers, stocking reagents, validating methods, the accreditation inspection and the trial run. Hiring the laboratory director has 30 days of float, and most of the systems work has 40 or more. So I'll focus on the analyser import and the regulator-controlled steps, and I won't spend management time chasing tasks that can slip safely.",
  "note": "\"Eleven tasks decide the date\" is a more useful message than \"23 tasks, all important\". It tells people where to look, and where not to worry.",
  "hint": "Baseline, promise, cushion, critical tasks, high float, focus.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A task has 12 days of float. It slips by 10 days. What happens to the project's finish date?",
    "options": ["It slips 10 days", "It doesn't change, but the task now has only 2 days of float", "It slips 2 days", "The task becomes critical"],
    "answer": 1,
    "explanation": "Float absorbs the delay, but it's used up."
  },
  {
    "prompt": "The plan finishes one working day before the promised date. What's the most honest description?",
    "options": ["Safe: we're ahead of the promise", "Almost no cushion: any slip on the critical path misses the date", "Impossible to say", "Comfortable, because durations are estimates"],
    "answer": 1,
    "explanation": "On likely durations there's a one-day buffer, which is within the noise of any estimate."
  },
  {
    "prompt": "Why isn't the fit-out (B2) on the critical path, even though it's the longest and costliest construction task?",
    "options": ["It's cheap", "The analysers' import takes longer, so the fit-out has float", "It's outsourced", "It starts early"],
    "answer": 1,
    "explanation": "Criticality depends on the longest chain, not on a task's size or cost."
  }
]
```
