---
title: Prioritising with RICE
minutes: 25
summary: Score a backlog with RICE (reach, impact, confidence and effort), compare it with prioritising by whoever asks loudest, test how sensitive the ranking is to uncertain inputs, and explain the result.
---

## The problem

Ten ideas, one team, one quarter. Ranked by how often they come up in feedback, the top of the list is fees, verification and payroll. Ranked by who shouts loudest, payroll wins. Ranked by the CEO's favourite, it's spending insights. Each ranking leaves out something important: how many users an idea would reach, how much it would change things for them, how sure the team is, and how much it costs to build.

## The concept

**RICE**

> score = Reach × Impact × Confidence ÷ Effort

| Input | Meaning | Paystream's scale |
| :-- | :-- | :-- |
| **Reach** | users affected per quarter | a number of users |
| **Impact** | how much it changes things for each of them | 3 massive, 2 high, 1 medium, 0.5 low, 0.25 minimal |
| **Confidence** | how sure we are of the reach and impact | 1 high, 0.8 medium, 0.5 low |
| **Effort** | how much work | person-weeks |

**Scores are for discussion, not autopilot**

RICE makes assumptions visible so people can challenge them. Check how sensitive the ranking is to the uncertain inputs, and record why you overrode it when you do.

**Where the inputs come from**

Reach from funnels and feedback (lessons 3 to 5), impact from interviews and past launches, confidence from the strength of that evidence, effort from the engineers.

## Example

The backlog, scored:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/product/"
backlog = pd.read_csv(base + "backlog.csv").fillna({"theme": ""})
feedback = pd.read_csv(base + "feedback.csv")

backlog["rice"] = backlog["reach_per_quarter"] * backlog["impact"] * backlog["confidence"] / backlog["effort_person_weeks"]
backlog["feedback_items"] = backlog["theme"].map(feedback["theme"].value_counts()).fillna(0).astype(int)
backlog["rice_rank"] = backlog["rice"].rank(ascending=False).astype(int)
backlog["feedback_rank"] = backlog["feedback_items"].rank(ascending=False, method="min").astype(int)
backlog.sort_values("rice", ascending=False)[["item_id", "feature", "reach_per_quarter", "impact", "confidence", "effort_person_weeks", "rice", "rice_rank", "feedback_rank"]].round({"rice": 0})
```

```text
item_id                               feature  reach_per_quarter  impact  confidence  effort_person_weeks    rice  rice_rank  feedback_rank
9     B10   Fix crashes on older Android phones               1500    2.00         1.0                    3  1000.0          1              4
0     B01  Help with BVN verification at agents               2400    2.00         0.8                    4   960.0          2              1
5     B06           Free transfers under ₦5,000               5000    0.50         0.5                    2   625.0          3              1
7     B08                             Dark mode               2000    0.25         1.0                    1   500.0          4              9
2     B03               Automatic payday saving               3000    1.00         0.8                    5   480.0          5              5
6     B07          Faster card delivery partner                800    1.00         1.0                    2   400.0          6              8
1     B02     USSD transfers for feature phones               1800    2.00         0.5                   10   180.0          7              7
3     B04              Split bills with friends               1200    0.50         0.8                    3   160.0          8              6
8     B09                     Spending insights               2500    0.50         0.5                    4   156.0          9              9
4     B05                 Bulk payroll payments                150    3.00         0.8                    8    45.0         10              3
```

The two rankings agree at the top and disagree in instructive places. Free small transfers score well on RICE (huge reach, little effort), and fees are also tied for the most common theme in feedback. Dark mode scores surprisingly high: tiny effort and wide reach make up for minimal impact. Bulk payroll, high in feedback, falls to the bottom: it would change a lot for each business, but only about 150 businesses a quarter, and it's a lot of work. The crash fix and verification help are near the top on both. Now test the most uncertain input: USSD's confidence is low (0.5) because nobody has measured how many traders lack data at the moment of payment.

```python
for confidence in [0.5, 0.8, 1.0]:
    scores = backlog.set_index("item_id")["rice"].copy()
    ussd = backlog.set_index("item_id").loc["B02"]
    scores["B02"] = ussd["reach_per_quarter"] * ussd["impact"] * confidence / ussd["effort_person_weeks"]
    print(f"USSD confidence {confidence}: rank {int(scores.rank(ascending=False)['B02'])} of {len(scores)}")
```

```text
USSD confidence 0.5: rank 7 of 10
USSD confidence 0.8: rank 7 of 10
USSD confidence 1.0: rank 7 of 10
```

Even if the team were certain about USSD, its large effort keeps it out of the top few. So the right next step for USSD isn't building it: it's a cheap experiment to learn more (for example, measuring failed payments at markets), which could raise both confidence and impact.

## Walkthrough

1. Run the cells. Which item has the highest reach? Why isn't it first?
2. Engineers re-estimate verification help (B01) at 8 person-weeks. Where does it rank now?
3. Should "dark mode" ever be built? Argue with its score.
4. Explain the ranking to the CEO (the task below).

## Practice

```answer
{
  "id": "pdm-06-p1",
  "prompt": "Which **item ID** has the highest RICE score?",
  "answer": "B10",
  "dataset": "product",
  "files": ["backlog"],
  "pyVerify": "backlog.sort_values('rice', ascending=False)['item_id'].iloc[0]",
  "hint": "The first row of the sorted table.",
  "required": true
}
```

```task
{
  "id": "pdm-06-t1",
  "prompt": "Explain the backlog ranking to the CEO in 60 to 140 words: the **top three** items and **why**, why **bulk payroll** ranks low despite being requested often, and one item where you'd **gather more evidence** before deciding.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Our top three for next quarter are ...",
  "rules": [
    { "label": "Names a top three", "pattern": "top three|first|top" },
    { "label": "Uses RICE terms (reach, impact, confidence, effort)", "pattern": "reach|impact|confidence|effort", "min": 2 },
    { "label": "Explains payroll's rank", "pattern": "payroll[^.]*(reach|few|150|effort|businesses)" },
    { "label": "Gathering evidence (experiment, test, measure, research)", "pattern": "experiment|test|measure|research|evidence|learn" },
    { "label": "Between 60 and 140 words", "minWords": 60, "maxWords": 140 }
  ],
  "sample": "Our top three are free transfers under ₦5,000, fixing crashes on older Android phones and helping traders verify their BVN at agents. Each reaches thousands of users a quarter for a small amount of work, and the crash fix and verification help remove problems that stop people using Paystream at all. Bulk payroll is a real need and comes up often, mostly through our sales team, but it would reach about 150 businesses a quarter for 8 person-weeks of work, so its score is the lowest. USSD needs more evidence: before building it, we'll measure how often traders' payments fail for lack of data, which could raise its confidence and impact.",
  "note": "The reply shows the CEO the reasoning, not just the list, so a disagreement can be about inputs rather than opinions.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Reach 2,000, impact 1, confidence 0.8, effort 4. What's the RICE score?",
    "options": ["8,000", "400", "1,600", "500"],
    "answer": 1,
    "explanation": "2,000 × 1 × 0.8 ÷ 4."
  },
  {
    "prompt": "A feature is requested often but by a small group and takes a lot of work. How does RICE treat it?",
    "options": ["It ranks first", "It ranks lower: small reach and high effort", "It's excluded", "RICE ignores requests"],
    "answer": 1,
    "explanation": "Frequency of requests isn't reach."
  },
  {
    "prompt": "An item's confidence is low. What's often the best next step?",
    "options": ["Build it anyway", "Run a cheap test or research to raise confidence before committing", "Delete it", "Raise its impact"],
    "answer": 1,
    "explanation": "Buy evidence before building."
  }
]
```
