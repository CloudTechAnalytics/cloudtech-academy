---
title: Guardrails and thresholds
minutes: 25
summary: Choose the threshold for an input guardrail by weighing harmful messages missed against harmless customers blocked, and check whether it blocks some groups of customers far more than others.
---

## The problem

The input guardrail gives every incoming message a score from 0 to 1: how likely it is to be an attack or abuse. Above a threshold, the message is blocked and the customer is asked to rephrase or contact support.

Security wants a low threshold, to catch everything. Support wants a high one, because every blocked genuine customer is someone who can't get help. A support lead also noticed something: customers writing in Pidgin seemed to get blocked more often. Paystream reviewed 3,000 production messages by hand, labelling each harmful or not, to settle it.

## The concept

**Every threshold is a trade-off**

| | Message is harmful | Message is harmless |
| :-- | :-- | :-- |
| **Blocked** | caught (true positive) | **customer wrongly blocked** (false positive) |
| **Allowed** | **attack gets through** (false negative) | fine |

- **Recall**: share of harmful messages blocked.
- **Precision**: share of blocked messages that were really harmful.
- **False positive rate**: share of harmless messages blocked.

**Choose by cost, not by habit.** A 0.5 threshold is not special. Put a cost on each kind of error, or set a minimum recall and then pick the threshold that blocks the fewest genuine customers.

**Check fairness**

Calculate the false positive rate **separately for each group** (language, region, age). A guardrail that blocks one group's harmless messages far more often treats those customers worse, and it's often invisible in the overall numbers.

## Example

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/llmops/"
g = pd.read_csv(base + "guardrail_reviews.csv")
print(g["harmful"].value_counts(), g["language"].value_counts(), sep="\n")

def at_threshold(t):
    blocked = g["guardrail_score"] >= t
    harmful = g["harmful"] == 1
    return pd.Series({
        "recall": round((blocked & harmful).sum() / harmful.sum(), 3),
        "precision": round((blocked & harmful).sum() / blocked.sum(), 3),
        "harmless_blocked": int((blocked & ~harmful).sum()),
        "fpr_english": round(blocked[~harmful & (g["language"] == "English")].mean(), 3),
        "fpr_pidgin": round(blocked[~harmful & (g["language"] == "Pidgin")].mean(), 3),
    })

pd.DataFrame({t: at_threshold(t) for t in [0.3, 0.4, 0.5, 0.6, 0.7]}).T
```

```text
harmful
0    2892
1     108
Name: count, dtype: int64
language
English    2310
Pidgin      690
Name: count, dtype: int64
     recall  precision  harmless_blocked  fpr_english  fpr_pidgin
0.3   1.000      0.252             321.0        0.053       0.304
0.4   0.991      0.431             141.0        0.016       0.158
0.5   0.963      0.717              41.0        0.004       0.049
0.6   0.907      0.899              11.0        0.000       0.016
0.7   0.667      0.935               5.0        0.000       0.007
```

Read across the rows. Raising the threshold blocks far fewer genuine customers, at the cost of missing some harmful messages. And at every threshold, harmless Pidgin messages are blocked many times more often than harmless English ones: the classifier treats Pidgin itself as suspicious.

Now choose a threshold by cost. Suppose (an assumption to agree with the business) that a missed harmful message costs 20 times as much as a wrongly blocked customer:

```python
COST_MISS, COST_BLOCK = 20, 1
costs = {}
for t in [x / 100 for x in range(20, 91, 5)]:
    blocked = g["guardrail_score"] >= t
    misses = ((g["harmful"] == 1) & ~blocked).sum()
    wrong_blocks = ((g["harmful"] == 0) & blocked).sum()
    costs[t] = misses * COST_MISS + wrong_blocks * COST_BLOCK
best = min(costs, key=costs.get)
print("Lowest-cost threshold:", best, "cost:", costs[best])
print(at_threshold(best))
```

```text
Lowest-cost threshold: 0.5 cost: 121
recall               0.963
precision            0.717
harmless_blocked    41.000
fpr_english          0.004
fpr_pidgin           0.049
dtype: float64
```

The cheapest threshold still blocks Pidgin speakers more often. A threshold alone can't fix a biased score: the classifier needs retraining with harmless Pidgin examples, and until then, blocked Pidgin messages could go to a person instead of being refused outright.

## Walkthrough

1. Run the cells. Change the cost ratio to 5 and to 50. How does the best threshold move?
2. At the chosen threshold, how many genuine Pidgin-speaking customers out of 1,000 would be blocked?
3. Design a different treatment for scores in a "grey zone" (for example 0.4 to 0.6): warn, ask to rephrase, or route to a person.
4. Write the guardrail recommendation (the task below).

## Practice

```answer
{
  "id": "ops-06-p1",
  "prompt": "At a threshold of **0.5**, what share of harmless **Pidgin** messages are blocked? As a percentage, one decimal place.",
  "answer": 4.9,
  "format": "percent",
  "dataset": "llmops",
  "files": ["guardrail_reviews"],
  "pyVerify": "round(at_threshold(0.5)['fpr_pidgin'] * 100, 1)",
  "hint": "The fpr_pidgin value in the 0.5 row.",
  "required": true
}
```

```answer
{
  "id": "ops-06-p2",
  "prompt": "Which threshold has the **lowest total cost** with a miss costing 20 times a wrong block?",
  "answer": 0.5,
  "tolerance": 0.001,
  "format": "number",
  "dataset": "llmops",
  "files": ["guardrail_reviews"],
  "pyVerify": "best",
  "hint": "The first line of the last output.",
  "required": true
}
```

```task
{
  "id": "ops-06-t1",
  "prompt": "Write the **guardrail recommendation** (50 to 130 words): the **threshold** and why, its **recall** and how many genuine customers it blocks, the **Pidgin** finding, and what you'll do about it.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Set the threshold at ...",
  "rules": [
    { "label": "Names a threshold", "pattern": "0\\.\\d" },
    { "label": "Mentions recall or harmful messages caught", "pattern": "recall|catch|caught" },
    { "label": "Mentions the Pidgin finding", "pattern": "pidgin" },
    { "label": "An action on the bias (retrain, route, review, person)", "pattern": "retrain|route|review|person|human|examples" },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "Set the threshold at 0.5. With a missed attack costing 20 times a wrongly blocked customer, it has the lowest total cost: it catches 96% of harmful messages while blocking 41 genuine customers in 3,000. But at every threshold, harmless Pidgin messages are blocked several times more often than English ones, because the classifier treats Pidgin as suspicious. Until it is retrained with harmless Pidgin examples, blocked messages should go to a support agent rather than being refused, and we should report the Pidgin and English false positive rates every week.",
  "note": "The recommendation fixes the immediate harm (routing to a person) while the real fix (retraining) is done.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does raising a guardrail's threshold usually do?",
    "options": ["Blocks more of everything", "Blocks fewer genuine customers, but lets more harmful messages through", "Nothing", "Improves both recall and false positives"],
    "answer": 1,
    "explanation": "Every threshold trades misses against wrong blocks."
  },
  {
    "prompt": "How do you check a guardrail for unfair treatment?",
    "options": ["Look at overall accuracy", "Compare false positive rates for each group of customers", "Ask the model", "Check the average score"],
    "answer": 1,
    "explanation": "Bias hides in overall numbers."
  },
  {
    "prompt": "Can choosing a different threshold fix a biased score?",
    "options": ["Yes, always", "No: the score itself treats the group differently, so the classifier needs retraining, with a fallback in the meantime", "Only at 0.5", "Bias can't be measured"],
    "answer": 1,
    "explanation": "One threshold applies to everyone; the bias is in the scores."
  }
]
```
