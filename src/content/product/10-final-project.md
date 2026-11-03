---
title: "Final project: Paystream's next quarter"
minutes: 20
summary: Plan your final project, a product review and quarter plan for Paystream, from user evidence and funnels to a prioritised, outcome-based roadmap, an honest launch review and a spec for the top priority.
---

## The problem

Paystream's leadership meets to agree next quarter's product plan. They want to know what users struggle with most, what the team will build and why, what last quarter's launch really achieved, and how they'll know the next one worked. Your final project is that product review.

## The concept

### The parts of the review

| Part | Built in |
| :-- | :-- |
| Outcomes and the north star | lesson 1 |
| User evidence: interviews and feedback | lessons 2 and 3 |
| The funnel and retention | lessons 4 and 5 |
| Prioritisation and the roadmap | lessons 6 and 7 |
| The savings goals launch review | lesson 8 |
| The spec for the top priority | lesson 9 |

### Evidence chain

Every roadmap item should trace back: a user problem (interviews, feedback), its size (funnel, retention), its score (RICE), and the outcome measure (spec).

## Example

The evidence chain for the top items in one table:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/product/"
backlog = pd.read_csv(base + "backlog.csv").fillna({"theme": ""})
feedback = pd.read_csv(base + "feedback.csv")
interviews = pd.read_csv(base + "interviews.csv")

backlog["rice"] = (backlog["reach_per_quarter"] * backlog["impact"] * backlog["confidence"] / backlog["effort_person_weeks"]).round(0)
backlog["feedback_items"] = backlog["theme"].map(feedback["theme"].value_counts()).fillna(0).astype(int)
backlog["interviews"] = backlog["theme"].map(interviews["biggest_pain"].value_counts()).fillna(0).astype(int)
reviews = feedback[feedback["source"] == "App review"].groupby("theme")["rating"].mean()
backlog["review_stars"] = backlog["theme"].map(reviews).round(2)
backlog.sort_values("rice", ascending=False)[["feature", "rice", "feedback_items", "interviews", "review_stars"]].head(5)
```

```text
feature    rice  feedback_items  interviews  review_stars
9   Fix crashes on older Android phones  1000.0             200           2          1.72
0  Help with BVN verification at agents   960.0             249           4          1.86
5           Free transfers under ₦5,000   625.0             249           6          2.84
7                             Dark mode   500.0               0           0           NaN
2               Automatic payday saving   480.0             192           4          3.25
```

The items with the strongest case are supported on several fronts at once: score, volume of feedback, interviews and low ratings. Where one column is weak, say so in the review.

## Walkthrough

1. Build every part of the review from the lessons.
2. Write the roadmap with outcomes and baselines.
3. Write the honest launch review of savings goals.
4. Open the project brief on the course page and plan the write-up.

## Practice

```dataset
{"dataset": "product", "files": ["users", "activity", "feedback", "interviews", "backlog", "rollout"]}
```

```answer
{
  "id": "pdm-10-p1",
  "prompt": "How many feedback items are about **app crashes**?",
  "answer": 200,
  "format": "number",
  "dataset": "product",
  "files": ["feedback"],
  "pyVerify": "int((feedback['theme'] == 'App crashes').sum())",
  "hint": "Count feedback where theme is App crashes.",
  "required": true
}
```

```task
{
  "id": "pdm-10-t1",
  "prompt": "Write the **summary** for leadership (100 to 200 words): the **biggest user problem** with evidence, the **quarter's priorities** and **why**, what **savings goals** really achieved, and how you'll **measure** this quarter's work.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Our biggest problem is ...",
  "rules": [
    { "label": "Names verification as a major problem", "pattern": "verif|bvn" },
    { "label": "Uses numbers", "pattern": "\\d+(\\.\\d+)?\\s*%|\\b\\d{2,}\\b", "min": 3 },
    { "label": "Priorities with reasons (reach, effort, RICE, score)", "pattern": "rice|reach|effort|score" },
    { "label": "An honest savings goals result (holdout, not clear, interval)", "pattern": "holdout|random|not (yet )?clear|interval|self-select" },
    { "label": "How success is measured (baseline, target, holdout, metric)", "pattern": "baseline|target|measure|metric" },
    { "label": "Between 100 and 200 words", "minWords": 100, "maxWords": 200 }
  ],
  "sample": "Our biggest problem is that new users stall before they can use Paystream. Only 43% of signups make a first transfer, and the largest drop is BVN verification: just 57% of market traders get through it, against 69% of traders who sign up with an agent's help. Verification and crashes also draw the lowest app ratings, under 2 stars. This quarter we'll fix crashes on older Android phones, help traders verify at agents and make small transfers free: each reaches thousands of users for little effort, so they top our RICE scores. Bulk payroll matters to small businesses but reaches few users for a lot of work, so it waits. Last quarter's savings goals are popular, but in a randomised holdout the effect on retention was about 2 points with an interval that includes zero; the 18-point figure came from engaged users choosing it. We'll measure each new feature against a baseline, with a holdout: trader verification from 57% to 70%, first transfers from 43% to 47%.",
  "note": "Each claim points to a lesson's analysis, and the savings goals paragraph shows leadership the team won't overclaim.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What makes a roadmap item well supported?",
    "options": ["The CEO likes it", "Several kinds of evidence agree: user problems, size, score and a measurable outcome", "It's quick to build", "Sales asked for it"],
    "answer": 1,
    "explanation": "An evidence chain."
  },
  {
    "prompt": "Why include an honest launch review in a planning document?",
    "options": ["It's required", "Plans built on overclaimed results repeat mistakes; honesty builds trust in the next claims", "To criticise the team", "To fill space"],
    "answer": 1,
    "explanation": "Learning needs true results."
  },
  {
    "prompt": "How should this quarter's features be measured?",
    "options": ["By whether they shipped", "Against baselines, with holdouts where possible", "By user compliments", "By downloads"],
    "answer": 1,
    "explanation": "Outcomes, measured honestly."
  }
]
```
