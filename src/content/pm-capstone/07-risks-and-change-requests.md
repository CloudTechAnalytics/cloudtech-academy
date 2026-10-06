---
title: Risks and change requests
minutes: 35
summary: Put a price and a delay on the risk register, find which risks actually sit on the critical chain, and judge six change requests by what they do to the forecast, not by what the request says.
---

## The problem

Two piles of paper have landed on the sponsor's desk. One is the **risk register**: thirteen things that might go wrong, each with a probability and an impact. The other is **six change requests** raised in weeks 9 and 10, each with a number of "extra days" and an extra cost. The sponsor wants to know how much reserve to hold, and which requests to approve.

Both are easy to get wrong. A risk register is often read as a list of worries; it should be read as a **budget** and a **schedule allowance**. And the extra days on a change request are rarely the days it adds to the project: that depends on where in the plan the change lands.

## The concept

### Risk: expected monetary value and expected delay

For each open risk:

- **EMV** (expected monetary value) = probability × cost impact.
- **Expected delay** = probability × delay in working days.

Add the EMVs for the **cost contingency** the project should hold. The expected delay of risks that sit on the **critical chain** is the **schedule contingency**. A risk on a task with float costs money if it happens but may not delay the opening at all.

Contingency isn't padding. It's an honest figure, held by the sponsor and released against named risks.

### Responses

For each risk the owner chooses a response: **avoid** it, **reduce** it (cheaper insurance, a second supplier), **transfer** it (insurance, a contract), or **accept** it knowingly. A response is worth buying when it costs less than the EMV it removes.

### Change requests

A change request is a proposal to alter scope, time or cost. Every change goes through the same check:

1. **Does it serve the charter's objective?** If not, it needs its own business case.
2. **What does it do to the date?** Re-run the forecast schedule with the change applied. The days on the request are not the days added: if the affected task has float, it may add nothing; if it's on the critical chain, it adds all of it.
3. **What does it cost, and who pays?**
4. **Decide:** approve, reject, or defer with a condition, and record it.

![Two requests each claiming five days: one on the critical chain moves the finish, one on a task with float does not; and the four steps for handling a change request](/images/courses/pm-capstone/change-effect.svg "Days on the form are not days added: float decides.")

> [!NOTE]
> A change that *saves* time only helps if it's applied to the **critical** chain. Paying the contractor for weekend shifts on a task that isn't critical saves nothing, however many days the request claims.

## Example

Set up the schedule function and the remaining-work durations from lesson 6. The `float` is rounded before testing for zero, because fractional remaining durations leave tiny floating-point crumbs:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/lab/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""})
status = pd.read_csv(base + "weekly_status.csv")
risks = pd.read_csv(base + "risks.csv")
changes = pd.read_csv(base + "changes.csv").fillna({"affects_task": ""})

def schedule(tasks, durations):
    preds = {t: [p for p in ps.split(";") if p] for t, ps in zip(tasks["task_id"], tasks["predecessors"])}
    es, ef = {}, {}
    for t in tasks["task_id"]:
        es[t] = max((ef[p] for p in preds[t]), default=0)
        ef[t] = es[t] + durations[t]
    end = max(ef.values())
    ls, lf = {}, {}
    for t in reversed(list(tasks["task_id"])):
        successors = [s for s in tasks["task_id"] if t in preds[s]]
        lf[t] = min((ls[s] for s in successors), default=end)
        ls[t] = lf[t] - durations[t]
    out = pd.DataFrame({"es": es, "ef": ef, "ls": ls, "lf": lf})
    out["float"] = (out["ls"] - out["es"]).round(6)
    return out, end

now = status[status["week"] == 10].set_index("task_id")
first_week = status.groupby("task_id")["week"].min()

def remaining():
    rem = {}
    for t, likely in zip(tasks["task_id"], tasks["likely_days"]):
        if t not in now.index:
            rem[t] = likely
            continue
        pc = now.loc[t, "percent_complete"] / 100
        elapsed = 5 * (10 - first_week[t] + 1)
        rem[t] = 0 if pc >= 1 else elapsed * (1 - pc) / pc      # the pace achieved so far
    return rem

rem = remaining()
left, work_left = schedule(tasks, rem)
print(f"Forecast: day {50 + work_left:.1f}")
print("Critical chain:", " -> ".join(left.index[(left["float"] == 0) & (left["ef"] > left["es"])]))
```

```text
Forecast: day 104.7
Critical chain: B4 -> B5 -> E2 -> F1 -> F2 -> F3 -> F4
```

The critical chain now starts at the analyser import. Now price the risk register:

```python
open_risks = risks[risks["status"] == "open"].copy()
open_risks["emv"] = open_risks["probability"] * open_risks["impact_ngn"]
open_risks["expected_days"] = open_risks["probability"] * open_risks["impact_days"]
print(f"Open risks: {len(open_risks)}")
print(f"Cost contingency (total EMV): ₦{open_risks['emv'].sum():,.0f}")
print(open_risks.sort_values("emv", ascending=False)[["risk_id", "description", "emv"]].head(4).to_string(index=False))
```

```text
Open risks: 12
Cost contingency (total EMV): ₦15,030,000
risk_id                                               description       emv
    R02   Naira weakens further, raising imported equipment costs 3500000.0
    R10 Opening misses the ministry's date, with public criticism 3500000.0
    R01          Customs holds the analysers longer than expected 2500000.0
    R06               Grid power too unreliable for the analysers 1750000.0
```

Thirteen risks, but only twelve are open (one has been closed). The total EMV is **₦15m**, which is the cost contingency the project should hold on top of the forecast. The two biggest items are the naira (a cost risk with no delay) and missing the date (a reputational one).

Which of the delay risks are on the critical chain? Link each to the task it threatens:

```python
task_of = {"R01": "B4", "R03": "B5", "R04": "F2", "R05": "D2", "R07": "B2", "R08": "C5", "R09": "E2", "R12": "D1"}
on_chain = set(left.index[(left["float"] == 0) & (left["ef"] > left["es"])])
open_risks["task"] = open_risks["risk_id"].map(task_of)
open_risks["critical"] = open_risks["task"].isin(on_chain)
delay = open_risks[open_risks["critical"]]
print(delay[["risk_id", "task", "expected_days"]].to_string(index=False))
print(f"Expected delay on the critical chain: {delay['expected_days'].sum():.1f} working days")
print(f"Expected delay on tasks with float:  {open_risks[~open_risks['critical']]['expected_days'].sum():.1f} working days (absorbed by float)")
```

```text
risk_id task  expected_days
    R01   B4            6.0
    R03   B5            2.0
    R04   F2            4.5
    R09   E2            1.4
Expected delay on the critical chain: 13.9 working days
Expected delay on tasks with float:  7.5 working days (absorbed by float)
```

Of about 21 days of expected delay in the register, only **13.9** sit on the critical chain. The rest are on tasks with float: they'll cost money if they happen but they mostly won't move the opening. That's the schedule contingency, and it's on top of the forecast.

Now the change requests. Apply each one to the remaining-work schedule and see what it does to the finish:

```python
rows = []
for _, c in changes.iterrows():
    r = dict(rem)
    if c["affects_task"]:
        r[c["affects_task"]] = max(0, r[c["affects_task"]] + c["extra_days"])
    _, w = schedule(tasks, r)
    rows.append((c["change_id"], c["description"][:44], c["extra_days"], round(w - work_left, 2), c["extra_cost_ngn"]))
print(pd.DataFrame(rows, columns=["id", "request", "days_on_form", "change_to_finish", "extra_cost_ngn"]).to_string(index=False))
```

```text
id                                      request  days_on_form  change_to_finish  extra_cost_ngn
CR1 Add a molecular testing room with its own ai            14              0.25        16000000
CR2 Hire 3 more phlebotomists for longer collect             0              0.00         2100000
CR3 Pay the contractor for weekend working on th            -5              0.00         3200000
CR4 Upgrade the information system to include a              6              0.00         4800000
CR5     Ship the analysers by air instead of sea            -9             -9.00         5500000
CR6 Add a home-collection van and route software             0              0.00         3600000
```

Look at the column the request forms don't show. **CR5** (ship the analysers by air) really does pull the finish in by 9 days, because it lands on the critical task. **CR3** (weekend working on the fit-out) claims 5 days and delivers none: the fit-out is nearly finished and isn't on the critical chain. **CR1** (the molecular room) claims 14 extra days, but because the fit-out has float it adds a quarter of a day to the forecast. That doesn't make it cheap: it costs ₦16m, and the model doesn't know the new room also needs its own installation and validation. **CR2, CR4 and CR6** don't touch the critical chain at all and are about money and scope, not time.

## Walkthrough

1. Set up the schedule, the remaining durations and the baseline forecast.
2. Calculate EMV and expected delay for every open risk, and the total EMV.
3. Link each delay risk to its task, and find which sit on the critical chain.
4. Calculate the expected delay on the critical chain.
5. Apply each change request to the remaining-work schedule and record its effect on the finish.
6. For each request, decide: approve, reject or defer, with a reason.
7. Write the decision note (the task below).

## Practice

```answer
{
  "id": "pmc-07-p1",
  "prompt": "What is the **total EMV** of the open risks (probability × cost impact, summed), in naira?",
  "answer": 15030000,
  "format": "naira",
  "dataset": "lab",
  "files": ["risks"],
  "pyVerify": "int(round(open_risks['emv'].sum()))",
  "hint": "The cost contingency line.",
  "required": true
}
```

```answer
{
  "id": "pmc-07-p2",
  "prompt": "What is the **expected delay on the critical chain** from the open risks, in working days? One decimal place.",
  "answer": 13.9,
  "format": "number",
  "dataset": "lab",
  "files": ["tasks", "weekly_status", "risks"],
  "pyVerify": "round(delay['expected_days'].sum(), 1)",
  "hint": "The first of the last two lines.",
  "required": true
}
```

```answer
{
  "id": "pmc-07-p3",
  "prompt": "How many working days **earlier** does the project finish if **CR5** (air freight) is approved?",
  "answer": 9,
  "format": "number",
  "dataset": "lab",
  "files": ["tasks", "weekly_status", "changes"],
  "pyVerify": "int(round(-(schedule(tasks, {**rem, 'B4': rem['B4'] - 9})[1] - work_left)))",
  "hint": "The change_to_finish column for CR5, without the minus sign.",
  "required": true
}
```

```answer
{
  "id": "pmc-07-p4",
  "prompt": "How many of the six change requests move the finish date by **at least one working day**, either way?",
  "answer": 1,
  "format": "number",
  "dataset": "lab",
  "files": ["tasks", "weekly_status", "changes"],
  "pyVerify": "sum(abs(schedule(tasks, {**rem, **({c['affects_task']: max(0, rem[c['affects_task']] + c['extra_days'])} if c['affects_task'] else {})})[1] - work_left) >= 1 for _, c in changes.iterrows())",
  "hint": "Look at the change_to_finish column. Count the ones whose absolute value is 1 or more.",
  "required": true
}
```

```task
{
  "id": "pmc-07-t1",
  "prompt": "Write the **decision note on the six change requests** (90 to 200 words). For each (CR1 to CR6) say **approve, reject or defer** with a one-line reason based on its effect on the **date**, its **cost** and the **charter**. State which one you recommend approving.",
  "minutes": 14,
  "rows": 10,
  "placeholder": "CR1 (molecular room): ...",
  "rules": [
    { "label": "Covers CR1", "pattern": "CR1|molecular" },
    { "label": "Covers CR3 and says it doesn't help the date", "pattern": "CR3|weekend" },
    { "label": "Covers CR5 and recommends it", "pattern": "CR5|air freight|by air" },
    { "label": "Covers CR2, CR4 or CR6", "pattern": "CR2|CR4|CR6|phlebotom|portal|van|home.collection" },
    { "label": "Uses approve/reject/defer language", "pattern": "approve|reject|defer|decline|accept" },
    { "label": "Refers to the critical chain or the date", "pattern": "critical|date|float|saves|days" },
    { "label": "Refers to the cost or the charter", "pattern": "cost|₦|charter|scope|business case" },
    { "label": "Between 90 and 200 words", "minWords": 90, "maxWords": 200 }
  ],
  "sample": "CR5 (air freight for the analysers): approve. It lands on the critical task and pulls the forecast in by 9 working days for ₦5.5 million. CR3 (weekend working on the fit-out): reject. The fit-out is nearly done and isn't critical, so it would cost ₦3.2 million and save nothing. CR1 (molecular room): defer. It adds ₦16 million and a new installation and validation the plan doesn't contain; it isn't in the charter and needs its own business case. CR4 (patient portal): defer; it isn't on the critical chain, costs ₦4.8 million and isn't part of the opening objective. CR2 (more phlebotomists) and CR6 (home-collection van): defer to operations and sales; they cost money but don't affect the opening, and should be decided after we know the real cost of recovery.",
  "note": "One request does what it claims, one doesn't, and four don't belong in the opening at all. That's the value of testing each request against the schedule instead of trusting the form.",
  "hint": "Effect on the date, cost, charter: then approve, reject or defer.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A risk has a 20% chance of costing ₦5m. What is its EMV?",
    "options": ["₦5m", "₦1m", "₦0.2m", "₦25m"],
    "answer": 1,
    "explanation": "0.2 × ₦5m = ₦1m."
  },
  {
    "prompt": "A change request claims to add 14 days to a task with 20 days of float. What does it do to the finish date?",
    "options": ["Adds 14 days", "Nothing: the float absorbs it, though it uses most of the float", "Adds 6 days", "Removes 6 days"],
    "answer": 1,
    "explanation": "A delay no longer than the float doesn't move the finish, but it uses up the safety margin."
  },
  {
    "prompt": "Weekend working is proposed for a task that is not on the critical chain. What will it do for the opening date?",
    "options": ["Bring it forward by the days saved", "Nothing, because the critical chain decides the date", "Make the task critical", "Delay it"],
    "answer": 1,
    "explanation": "Speeding up a task with float doesn't shorten the project."
  }
]
```
