---
title: Roadmaps
minutes: 20
summary: Turn priorities into a roadmap the team can deliver (fitting the quarter's capacity, grouping work into now, next and later, and stating each item as the outcome it serves) and explain what's not on it.
---

## The problem

Paystream's last roadmap was a list of features with dates, promised to everyone. Half slipped, two were built and nobody checked whether they helped, and the team spent the quarter explaining delays. A roadmap should say what problems the team will work on, in what order, and how it will know they're solved. And it has to fit the team.

## The concept

### Capacity

A team has a fixed number of person-weeks in a quarter, minus holidays, support and the unexpected (keep about 20% free). The roadmap can't hold more than that.

### Now, next, later

| Column | Meaning | Detail |
| :-- | :-- | :-- |
| **Now** | being built this quarter | committed, specific |
| **Next** | likely next quarter | shaped, may change |
| **Later** | ideas worth keeping | rough |

No exact dates beyond "now": the further out, the less anyone can know.

### Outcome-based items

Each item names the outcome and how it's measured: "Help traders get verified at agents, so trader BVN verification rises from 57% to 70%", not just "Agent BVN feature".

### Saying no

A roadmap is as much about what's left out. Record why, so the decision can be revisited when evidence changes.

![A capacity bar showing 27 of 32 usable person-weeks planned, then Now, Next and Later columns with outcome-based items, and a Won't do list with a reason](/images/courses/product/roadmap.svg "Now, next, later: committed, shaped, rough; and a roadmap can't exceed capacity.")

## Example

Fill the quarter's capacity in RICE order, then fill a second quarter the same way for "Next"; anything left is "Later". The team has 2 engineers for 12 weeks; keep 20% for support and surprises:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/product/"
backlog = pd.read_csv(base + "backlog.csv").fillna({"theme": ""})
backlog["rice"] = backlog["reach_per_quarter"] * backlog["impact"] * backlog["confidence"] / backlog["effort_person_weeks"]

capacity = 2 * 12 * 0.8
used = {"Now": 0, "Next": 0}
column = {}
for item in backlog.sort_values("rice", ascending=False).itertuples():
    for quarter in ["Now", "Next"]:
        if used[quarter] + item.effort_person_weeks <= capacity:
            column[item.item_id] = quarter
            used[quarter] += item.effort_person_weeks
            break
    else:
        column[item.item_id] = "Later"
backlog["column"] = backlog["item_id"].map(column)
print(f"Capacity {capacity:.1f} person-weeks a quarter; planned now {used['Now']}, next {used['Next']}")
for name in ["Now", "Next", "Later"]:
    items = backlog[backlog["column"] == name].sort_values("rice", ascending=False)
    print(f"{name}: " + "; ".join(items["feature"]))
```

```text
Capacity 19.2 person-weeks a quarter; planned now 17, next 17
Now: Fix crashes on older Android phones; Help with BVN verification at agents; Free transfers under ₦5,000; Dark mode; Automatic payday saving; Faster card delivery partner
Next: USSD transfers for feature phones; Split bills with friends; Spending insights
Later: Bulk payroll payments
```

The fill goes down the list while items fit, so small items slip in easily. Dark mode makes "Now" because it's tiny and reaches many users, but its impact is minimal: worth a human look at whether that week is better kept as buffer. Bulk payroll doesn't fit in either quarter after the higher-scoring work, so it's "Later". Now write the "Now" items as outcomes, with baselines from the data:

```python
users = pd.read_csv(base + "users.csv")
traders = users[(users["segment"] == "Market trader") & (users["phone_verified"] == 1)]
baselines = {
    "B01": f"trader BVN verification from {traders['bvn_verified'].mean():.0%} to 70%",
    "B06": f"first transfers from {users['first_transfer'].mean():.0%} of signups to 47%",
    "B10": "crash-related 1- and 2-star reviews halved",
    "B03": "salary earners active in week 8 up 5 points",
    "B07": "card delivery complaints halved",
}
for item in backlog[backlog["column"] == "Now"].itertuples():
    print(f"{item.feature}: {baselines.get(item.item_id, 'outcome to be defined')}")
```

```text
Help with BVN verification at agents: trader BVN verification from 57% to 70%
Automatic payday saving: salary earners active in week 8 up 5 points
Free transfers under ₦5,000: first transfers from 43% of signups to 47%
Faster card delivery partner: card delivery complaints halved
Dark mode: outcome to be defined
Fix crashes on older Android phones: crash-related 1- and 2-star reviews halved
```

Every "Now" item now says what success looks like, using a number the team can measure today.

## Walkthrough

1. Run the cells. Change capacity to 2 engineers. What drops out?
2. Should split bills be in "Now"? Decide with the RICE scores, not the greedy fill.
3. Write the outcome for any "Now" item that lacks one.
4. Write the "not now" list (the task below).

## Practice

```answer
{
  "id": "pdm-07-p1",
  "prompt": "How many person-weeks are planned for **Now**?",
  "answer": 17,
  "format": "number",
  "dataset": "product",
  "files": ["backlog"],
  "pyVerify": "used['Now']",
  "hint": "The first line printed.",
  "required": true
}
```

```task
{
  "id": "pdm-07-t1",
  "prompt": "Write the roadmap's **\"Not this quarter\"** list: at least **three** items, one per line starting with a dash, each with the **reason** and what **evidence** would bring it back.",
  "minutes": 5,
  "rows": 5,
  "placeholder": "- Bulk payroll: ...",
  "rules": [
    { "label": "At least three lines starting with -", "pattern": "^\\s*-\\s+\\S", "min": 3 },
    { "label": "Reasons (reach, effort, confidence, capacity)", "pattern": "reach|effort|confidence|capacity|score", "min": 2 },
    { "label": "What would bring it back (if, when, evidence, unless)", "pattern": "\\bif\\b|when|evidence|unless|once", "min": 3 },
    { "label": "Mentions payroll or USSD", "pattern": "payroll|ussd" }
  ],
  "sample": "- Bulk payroll: reaches about 150 businesses a quarter for 8 person-weeks; we'd reconsider if small businesses grow past a quarter of new users or a partner funds it.\n- USSD transfers: confidence is low and effort high; we'll revisit once we've measured how often traders' payments fail for lack of data.\n- Spending insights: low confidence that it changes behaviour; we'd reconsider if survey or interview evidence shows users would act on it.\n- Dark mode: minimal impact; we'll add it when the design system work makes it nearly free.",
  "note": "Each 'not now' has a condition, which turns 'no' into 'not yet, unless...'.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why leave about 20% of capacity unplanned?",
    "options": ["Laziness", "Support work and surprises always happen; a full plan always slips", "Engineers prefer it", "To finish early"],
    "answer": 1,
    "explanation": "Plan for reality."
  },
  {
    "prompt": "Why avoid exact dates for 'Next' and 'Later'?",
    "options": ["Dates are boring", "The further out, the less anyone can know; dates become broken promises", "Tools can't show them", "Sponsors dislike dates"],
    "answer": 1,
    "explanation": "Commit near, stay flexible far."
  },
  {
    "prompt": "What makes a roadmap item outcome-based?",
    "options": ["A feature name", "It states the user outcome and how success will be measured", "A deadline", "A budget"],
    "answer": 1,
    "explanation": "Outcomes over outputs."
  }
]
```
