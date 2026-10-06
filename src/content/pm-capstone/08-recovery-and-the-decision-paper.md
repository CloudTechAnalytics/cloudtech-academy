---
title: Recovery and the decision paper
minutes: 65
summary: Test six recovery options against the forecast, find the combinations that bring the opening back, choose with the sponsor's priorities in mind, and write the one-page paper that asks for the decisions you need.
---

## The problem

You now have a status (behind and over budget), a forecast (19 to 26 March, over by ₦17m to ₦30m), a priced risk register and a view of six change requests. The sponsor has one more question: **what should we do?** Six recovery options are on the table, and they interact. Some save days on the critical chain; some save none; some can be combined; one needs the medical director's agreement and changes what the laboratory opens with.

A recovery plan isn't "work harder". It's a short list of actions, each with a cost and a measured effect on the date, plus a clear account of what the sponsor must decide and by when.

## The concept

### Three ways to recover time

| Technique | What it means | Here |
| :-- | :-- | :-- |
| **Crashing** | Pay more to shorten a task | Air freight for the analysers; weekend shifts |
| **Fast-tracking** | Do things in parallel that were planned in sequence | Stock reagents while the analysers are installed |
| **Reducing scope** | Do less, or defer part of it | Open with the most-requested tests; validate the rest after opening |

All of them cost something: money, risk, or quality. And all of them only help on the **critical chain**.

### Choosing

Compare options on:

1. **Days saved** on the forecast, measured by re-running the schedule, not read from the proposal.
2. **Extra cost.**
3. **What it puts at risk:** quality, safety, the full test menu, the regulator's trust.
4. **Whether the sponsor's priorities allow it.** Here the managing director wants the date; the medical director won't open without the full menu; the CFO won't be surprised again.

![Three ways to recover time, invented options compared by claimed and really saved days, and a trigger agreed in advance](/images/courses/pm-capstone/recovery-options.svg "Test each option; combine; hold one back behind a trigger.")

Where no combination is safe, say so, and say what you'd do if the next problem arrives. A **trigger** ("if clearance isn't complete by 20 January, we use the reduced menu") turns a worry into a plan.

### The decision paper

One page for the sponsor, in this order:

1. **The answer:** status, forecast and what you recommend, in two sentences.
2. **What you need decided, and by when.**
3. **Evidence:** the three numbers that matter (forecast date, cost, risk).
4. **Options considered**, with cost and days saved, and why the others were rejected.
5. **Risks and triggers.**
6. **What you'll report next, and when.**

![The six parts of a one-page decision paper for a sponsor](/images/courses/pm-capstone/decision-paper.svg "Recommendation first; decisions with dates; three numbers; options; trigger.")

> [!NOTE]
> A good decision paper leads with the decision, and makes the unpopular parts impossible to miss: the date is gone, the budget is higher, and one of the sponsor's own requests should wait.

## Example

Set up the forecast as in lesson 6, then apply each recovery option to the remaining-work schedule:

```python
import itertools
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/lab/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""})
status = pd.read_csv(base + "weekly_status.csv")
options = pd.read_csv(base + "options.csv")
START = np.datetime64("2026-11-02")
PROMISE_DAY = 91

def schedule(tasks, durations):
    preds = {t: [p for p in ps.split(";") if p] for t, ps in zip(tasks["task_id"], tasks["predecessors"])}
    ef = {}
    for t in tasks["task_id"]:
        ef[t] = max((ef[p] for p in preds[t]), default=0) + durations[t]
    return max(ef.values())

def finish_date(days):
    return np.busday_offset(START, int(np.ceil(days)) - 1, roll="forward")

tasks["budget"] = tasks["likely_days"] * tasks["daily_cost_ngn"]
now = status[status["week"] == 10].set_index("task_id")
first_week = status.groupby("task_id")["week"].min()
BAC = tasks["budget"].sum()
EV = (now["percent_complete"] / 100 * tasks.set_index("task_id").loc[now.index, "budget"]).sum()
AC = now["actual_cost_ngn"].sum()
typical = BAC / (EV / AC)

rem = {}
for t, likely in zip(tasks["task_id"], tasks["likely_days"]):
    if t not in now.index:
        rem[t] = likely
        continue
    pc = now.loc[t, "percent_complete"] / 100
    elapsed = 5 * (10 - first_week[t] + 1)
    rem[t] = 0 if pc >= 1 else elapsed * (1 - pc) / pc        # the pace achieved so far

forecast = 50 + schedule(tasks, rem)
print(f"Forecast with no action: day {forecast:.1f}, {finish_date(forecast)}")
print(options[["option_id", "option", "extra_cost_ngn", "days_saved"]].to_string(index=False))
```

```text
Forecast with no action: day 104.7, 2027-03-26
option_id                             option  extra_cost_ngn  days_saved
       O1                Carry on as planned               0           0
       O2               Fly the analysers in         5500000           9
       O3     Weekend working on the fit-out         3200000           5
       O4       Start reagent stocking early          450000           4
       O5      Open with a reduced test menu         1200000           6
       O6 Add a molecular testing room first        16000000         -14
```

An option's "days saved" is what the proposer claims, and it only counts if it lands on the critical chain. Link each option to the task it changes, apply it, and **measure**:

```python
applies_to = {"O2": "B4", "O3": "B2", "O4": "E2", "O5": "F1"}      # O1 changes nothing; O6 adds scope

def finish_with(chosen):
    r = dict(rem)
    for o in chosen:
        days = int(options.loc[options["option_id"] == o, "days_saved"].iloc[0])
        t = applies_to[o]
        r[t] = max(0, r[t] - days)
    return 50 + schedule(tasks, r)

for o in applies_to:
    gain = forecast - finish_with([o])
    print(f"{o}: claims {int(options.loc[options['option_id'] == o, 'days_saved'].iloc[0])} days, really saves {gain:.1f}")
```

```text
O2: claims 9 days, really saves 9.0
O3: claims 5 days, really saves 0.0
O4: claims 4 days, really saves 4.0
O5: claims 6 days, really saves 6.0
```

**O3**, weekend shifts on the fit-out, claims 5 days and saves none, as in lesson 7. The other three are real. Now try every combination of the four recovery options:

```python
cost = dict(zip(options["option_id"], options["extra_cost_ngn"]))
rows = []
for n in range(0, 5):
    for combo in itertools.combinations(applies_to, n):
        end = finish_with(combo)
        rows.append((" + ".join(combo) or "none", round(end, 1), str(finish_date(end)), sum(cost[o] for o in combo)))
table = pd.DataFrame(rows, columns=["options", "finish_day", "date", "extra_cost_ngn"]).sort_values(["finish_day", "extra_cost_ngn"])
print(table.drop_duplicates("finish_day").head(6).to_string(index=False))   # the cheapest way to each finish day
```

```text
options  finish_day       date  extra_cost_ngn
O2 + O4 + O5        85.7 2027-03-01         7150000
     O2 + O5        89.7 2027-03-05         6700000
     O2 + O4        91.7 2027-03-09         5950000
     O4 + O5        94.7 2027-03-12         1650000
          O2        95.7 2027-03-15         5500000
          O5        98.7 2027-03-18         1200000
```

The cheapest way to meet the promised day (91) is **O2 + O5**: air freight and a reduced opening menu, for ₦6.7m, opening on 5 March. Adding **O4** takes it back to 1 March, for ₦0.45m more. **O2 + O4** alone, with the full test menu, opens on **Tuesday 9 March**, one working day after the promise, for ₦5.95m.

That's the real decision. Meeting the promise to the day needs the reduced menu, which the medical director has said he won't accept without a clinical case; the full menu costs one day, and the sponsor has to decide whether to take that to the commissioner.

And none of those dates includes the risk register. The expected delay on the critical chain is 13.9 days (lesson 7), so a plan that opens on 9 March with no allowance is a plan with perhaps a 20% chance of doing so. The honest recommendation has three parts:

1. **Approve O2 and O4 now.** They keep the full menu, cost ₦5.95m, and bring the forecast to 9 March.
2. **Keep O5 as a trigger, not a plan.** If the analysers have not cleared customs by a named date, use the reduced menu to protect the opening, with the medical director's agreement settled in advance.
3. **Tell the commissioner now** that the opening will be in the week of 8 March, with a realistic range, instead of letting the date go quietly wrong.

The cost position follows:

```python
chosen = ["O2", "O4"]
extra = sum(cost[o] for o in chosen)
atypical = AC + (BAC - EV)
print(f"Approved budget:           ₦{BAC:,.0f}")
print(f"Forecast with recovery:    ₦{atypical + extra:,.0f} to ₦{typical + extra:,.0f}")
print(f"Opening with recovery:     {finish_date(finish_with(chosen))}")
```

```text
Approved budget:           ₦90,750,000
Forecast with recovery:    ₦113,874,000 to ₦126,287,860
Opening with recovery:     2027-03-09
```

## Walkthrough

1. Rebuild the forecast with no action and note its day and date.
2. Link each recovery option to the task it changes, and **measure** its real effect.
3. Try every combination, and list finish date and cost.
4. Mark which combinations meet the promised day, and what each one puts at risk.
5. Choose, with reasons, and name a **trigger** for the option you're holding back.
6. Calculate the revised cost range.
7. Write the decision paper (the first task below), and the answers to the sponsor's hardest questions (the second).

## Practice

```answer
{
  "id": "pmc-08-p1",
  "prompt": "If **O2 and O4** are both approved, on what date does the project finish? Type it as YYYY-MM-DD.",
  "answer": "2027-03-09",
  "format": "text",
  "accept": ["9 march 2027", "2027-03-09", "09/03/2027", "9/3/2027"],
  "dataset": "lab",
  "files": ["tasks", "weekly_status", "options"],
  "pyVerify": "str(finish_date(finish_with(['O2', 'O4'])))",
  "hint": "The second row of the combination table, or the last cell.",
  "required": true
}
```

```answer
{
  "id": "pmc-08-p2",
  "prompt": "What is the **cheapest combination** of the four recovery options (O2 to O5) that finishes **by the promised day** (day 91)? Give its **extra cost** in naira.",
  "answer": 6700000,
  "format": "naira",
  "dataset": "lab",
  "files": ["tasks", "weekly_status", "options"],
  "pyVerify": "min(sum(cost[o] for o in combo) for n in range(5) for combo in itertools.combinations(applies_to, n) if finish_with(combo) <= PROMISE_DAY)",
  "hint": "From the table: the cheapest row that finishes on or before day 91.",
  "required": true
}
```

```answer
{
  "id": "pmc-08-p3",
  "prompt": "How many of the four recovery options O2 to O5 **actually shorten the finish** when applied alone?",
  "answer": 3,
  "format": "number",
  "dataset": "lab",
  "files": ["tasks", "weekly_status", "options"],
  "pyVerify": "sum(forecast - finish_with([o]) > 0.5 for o in applies_to)",
  "hint": "One option claims days but saves none.",
  "required": true
}
```

```answer
{
  "id": "pmc-08-p4",
  "prompt": "With **O2 and O4** approved, what is the **upper end of the cost forecast** (typical EAC plus the options' cost), to the nearest naira?",
  "answer": 126287860,
  "format": "naira",
  "dataset": "lab",
  "files": ["tasks", "weekly_status", "options"],
  "pyVerify": "int(round(typical + extra))",
  "hint": "The second figure on the 'Forecast with recovery' line.",
  "required": true
}
```

```task
{
  "id": "pmc-08-t1",
  "prompt": "Write the **decision paper** for the sponsor (150 to 280 words), in this order: the **answer and recommendation** first, the **decisions you need** and when, the **evidence** (forecast date, cost and risk), the **options** considered and why the others were rejected, and the **trigger** for the contingency plan.",
  "minutes": 20,
  "rows": 14,
  "placeholder": "Recommendation: ...",
  "rules": [
    { "label": "Leads with a recommendation", "pattern": "recommend|approve|decision" },
    { "label": "Says the promised date will be missed or at risk", "pattern": "8 March|promised|promise|miss|late|one (working )?day" },
    { "label": "Recommends O2 (air freight)", "pattern": "O2|air freight|by air|fly" },
    { "label": "Recommends O4 (reagents early)", "pattern": "O4|reagent" },
    { "label": "Gives the forecast date (9 March)", "pattern": "9 March|2027-03-09" },
    { "label": "Gives a cost (₦5.95m, 113.9 or 126.3m)", "pattern": "5[.,]95|113[.,]9|126[.,]3|₦\\s?126|₦\\s?113" },
    { "label": "Rejects or holds back an option (weekend working, molecular room, reduced menu)", "pattern": "O3|weekend|O6|molecular|O5|reduced (test )?menu|reject|hold" },
    { "label": "Names a trigger", "pattern": "trigger|if the analysers|by [0-9]+ (January|February)|if .* (not|hasn't|has not)" },
    { "label": "Between 150 and 280 words", "minWords": 150, "maxWords": 280 }
  ],
  "sample": "Recommendation: approve air freight for the analysers (O2) and starting reagent stocking early (O4), for ₦5.95 million. Decisions needed this week: approval of both, an agreed message to the commissioner, and the medical director's position on a reduced menu as a contingency. Evidence: with no action the laboratory opens between 19 and 26 March, 9 to 14 working days after the promise of Monday 8 March. With O2 and O4 the forecast is Tuesday 9 March, one working day late, with the full test menu. The cost forecast is ₦113.9 to ₦126.3 million against an approved ₦90.75 million, because costs are running at a CPI of 0.75. Options considered: weekend working on the fit-out (O3) saves nothing because the fit-out isn't critical; the molecular room (O6) adds 14 days and ₦16 million and belongs in a separate business case; opening with a reduced menu (O5) would meet 5 March but compromises the full menu and needs clinical agreement. Risks: the expected delay on the critical chain is about 14 days. Trigger: if the analysers have not cleared customs by 20 January, we use O5 to protect the opening. Next report: Friday, with the clearance status.",
  "note": "A paper like this can be read in two minutes and still be acted on: the answer, the asks, three numbers, the options and the trigger.",
  "hint": "Recommendation, decisions, evidence, options, trigger.",
  "required": true
}
```

```task
{
  "id": "pmc-08-t2",
  "prompt": "Write the answers to the sponsor's **three hardest questions** (100 to 200 words in all): \"Why can't we just keep 8 March?\", \"Why not approve the weekend working?\" and \"Why shouldn't I add the molecular room now?\"",
  "minutes": 12,
  "rows": 10,
  "placeholder": "Why can't we keep 8 March? ...",
  "rules": [
    { "label": "Answers the 8 March question (critical chain, no cushion, probability)", "pattern": "critical|cushion|probab|chance|analyser|customs" },
    { "label": "Answers the weekend working question (not critical, saves nothing)", "pattern": "weekend|fit-out|not critical|saves? (no|nothing)|float" },
    { "label": "Answers the molecular room question (cost, days, scope, business case)", "pattern": "molecular|16 million|₦16|14 days|business case|charter|scope" },
    { "label": "Uses a number from the analysis", "pattern": "\\d" },
    { "label": "Between 100 and 200 words", "minWords": 100, "maxWords": 200 }
  ],
  "sample": "Why can't we keep 8 March? The chain that decides the date runs through the analysers' import, installation, reagents, validation and the inspection, and the plan had one working day of cushion before the analysers slipped. Even with air freight and early stocking we're a day late, and on the plan's own estimates the chance of 8 March was about 3%. Why not approve weekend working? The fit-out is nearly finished and isn't on the critical chain, so ₦3.2 million would buy no days: the analysers' clearance is what's holding the opening. Why not add the molecular room now? It costs ₦16 million, adds an installation and validation the plan doesn't contain, and isn't part of the charter. It deserves its own business case after we open, not a place on the critical path before it.",
  "note": "Each answer uses a number and the logic of the schedule. That's what makes a firm \"no\" credible rather than stubborn.",
  "hint": "Three questions, three answers, each with a fact.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A recovery option claims to save 5 days on a task that is not on the critical chain. How many days will it really save the project?",
    "options": ["5", "Probably none", "2 or 3", "It depends on the cost"],
    "answer": 1,
    "explanation": "Only changes to the critical chain shorten the finish date."
  },
  {
    "prompt": "Reducing scope to open on time needs the medical director's agreement in advance. Why is a trigger useful?",
    "options": ["It avoids the decision", "It decides in advance what will happen if a named problem arrives, so nobody has to improvise under pressure", "It hides the risk", "It lets you change the date"],
    "answer": 1,
    "explanation": "A trigger turns a worry into an agreed plan."
  },
  {
    "prompt": "Which opening line best starts a decision paper?",
    "options": ["\"This paper summarises the project's history.\"", "\"I recommend approving two recovery actions for ₦5.95m; the laboratory then opens on 9 March, one working day late.\"", "\"The team has worked very hard.\"", "\"There are many risks.\""],
    "answer": 1,
    "explanation": "Lead with the recommendation and the number the sponsor most needs."
  }
]
```
