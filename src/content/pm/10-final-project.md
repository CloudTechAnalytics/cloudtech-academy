---
title: "Final project: the depot's week 10 review"
minutes: 20
summary: Plan your final project, a complete project review for the steering committee, with the schedule, earned value, forecast, risks and change decisions brought together into a status report and recommendations.
---

## The problem

The steering committee meets at the end of week 10. They want one report: where the depot project stands, whether it will open by 30 September, what it will cost, what could still go wrong, and what they need to decide today. Your final project is that report, with the analysis behind it.

## The concept

**The parts of the review**

| Part | Built in |
| :-- | :-- |
| Scope and WBS check | lessons 1 and 2 |
| Estimates and the baseline schedule with its critical path | lessons 3 and 4 |
| The probability of meeting the deadline | lesson 5 |
| Earned value and the cost forecast | lesson 6 |
| The forecast from progress and the RAG status | lesson 7 |
| Risks, responses and contingency | lesson 8 |
| Change decisions | lesson 9 |

**One page first**

Busy sponsors read the first page. Put the status, the forecast date and cost, and the decisions needed at the top; put the analysis behind it.

## Example

The headline figures, recalculated in one place:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/project/"
tasks = pd.read_csv(base + "tasks.csv").fillna({"predecessors": ""}).set_index("task_id")
status = pd.read_csv(base + "weekly_status.csv")
risks = pd.read_csv(base + "risks.csv")
now = status[status["week"] == 10].set_index("task_id")

tasks["budget"] = tasks["likely_days"] * tasks["daily_cost_ngn"]
es, ef = {}, {}
for t, row in tasks.iterrows():
    preds = [p for p in row["predecessors"].split(";") if p]
    es[t] = max((ef[p] for p in preds), default=0)
    ef[t] = es[t] + row["likely_days"]
pv = (tasks["budget"] * ((50 - pd.Series(es)) / tasks["likely_days"]).clip(0, 1)).sum()
ev = (tasks["budget"] * now["percent_complete"].reindex(tasks.index).fillna(0) / 100).sum()
ac = now["actual_cost_ngn"].sum()
bac = tasks["budget"].sum()
contingency = (risks["probability"] * risks["impact_ngn"]).sum()

summary = pd.Series({
    "Tasks finished": f"{int((now['percent_complete'] == 100).sum())} of {len(tasks)}",
    "SPI": f"{ev / pv:.2f}",
    "CPI": f"{ev / ac:.2f}",
    "Budget (BAC)": f"₦{bac:,.0f}",
    "Forecast cost (EAC)": f"₦{bac / (ev / ac):,.0f}",
    "Contingency (risk EMV)": f"₦{contingency:,.0f}",
    "Budget plus contingency": f"₦{bac + contingency:,.0f}",
})
summary
```

```text
Tasks finished                 12 of 23
SPI                                0.80
CPI                                0.77
Budget (BAC)                ₦81,530,000
Forecast cost (EAC)        ₦105,583,319
Contingency (risk EMV)      ₦11,250,000
Budget plus contingency     ₦92,780,000
dtype: object
```

The forecast cost is above the budget and above budget plus contingency, even at the kinder estimate from lesson 6 (about ₦94.7 million). So the committee has two decisions, not one: how to protect the opening date (lesson 9), and whether to approve more money or find savings. The contingency was sized for risks that hadn't happened yet; two of them already have.

## Walkthrough

1. Build the full review: every part in the table above.
2. Write the one-page summary first, then check every number in it against your analysis.
3. List the decisions needed today, with your recommendation for each.
4. Open the project brief on the course page and plan the write-up.

## Practice

```dataset
{"dataset": "project", "files": ["tasks", "weekly_status", "risks", "changes"]}
```

```answer
{
  "id": "pmf-10-p1",
  "prompt": "How many of the 23 tasks are finished at the end of week 10?",
  "answer": 12,
  "format": "number",
  "dataset": "project",
  "files": ["tasks", "weekly_status"],
  "pyVerify": "int((now['percent_complete'] == 100).sum())",
  "hint": "The first line of the summary.",
  "required": true
}
```

```task
{
  "id": "pmf-10-t1",
  "prompt": "Write the **one-page summary** for the steering committee (100 to 200 words): **status** with RAG, the **forecast opening** (with a probability or both forecasts), the **forecast cost** against budget and contingency, the **top risks**, and the **decisions needed today** with your recommendations.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Status: Red on schedule, amber on cost ...",
  "rules": [
    { "label": "A RAG status", "pattern": "red|amber|green" },
    { "label": "A forecast date", "pattern": "(september|october|\\d{1,2} (sep|oct))" },
    { "label": "Cost against budget and contingency", "pattern": "contingency" },
    { "label": "Risks named", "pattern": "risk|naira|permit|december" },
    { "label": "Decisions with recommendations", "pattern": "(decide|decision|approve|recommend)[\\s\\S]*(approve|defer|reject|recommend)" },
    { "label": "Between 100 and 200 words", "minWords": 100, "maxWords": 200 }
  ],
  "sample": "Status: red on schedule and red on cost. Twelve of 23 tasks are finished, but the permits took nine extra days and the fit-out, which is on the critical path, is running slower than planned. If the remaining work goes to plan, we open on 28 September with only two days to spare; at the fit-out's current pace, on 2 October. Costs are running well over: the delays, and dollar-priced racking and IT equipment bought after the naira weakened, put the forecast at ₦95 to ₦106 million against an ₦81.5 million budget, beyond the ₦11.25 million contingency. The top risks now are missing the December peak and further currency moves. Decisions needed today: approve weekend working on the fit-out (CR3, ₦2.5 million, 6 days saved), which brings the forecast to 24 September; defer the cold room and pick-up counter until after opening; buy dollars forward for the remaining imports; and approve up to ₦13 million of extra funding, or agree savings, to cover the forecast.",
  "note": "Every number in the summary can be traced to a lesson's analysis, which is what makes it trustworthy.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What belongs on the first page of a steering committee report?",
    "options": ["The full task list", "Status, forecast date and cost, and the decisions needed", "Team photos", "The methodology"],
    "answer": 1,
    "explanation": "Decision-makers read the first page."
  },
  {
    "prompt": "The forecast cost is over budget but within budget plus contingency. What does that mean?",
    "options": ["The project failed", "Known risks are using the reserve as intended; watch for further overruns", "No action ever needed", "Cut scope immediately"],
    "answer": 1,
    "explanation": "That's what contingency is for."
  },
  {
    "prompt": "Why check every number in the summary against the analysis?",
    "options": ["Habit", "A single wrong number undermines trust in the whole report", "It's required", "To make it longer"],
    "answer": 1,
    "explanation": "Credibility is everything in status reporting."
  }
]
```
