---
title: Evaluating classifiers and choosing thresholds
minutes: 30
summary: Read a confusion matrix, measure precision, recall and AUC, and choose the decision threshold from what each kind of mistake costs the business.
---

## The problem

Ladder's model gives every application a probability of default. The credit manager now has a decision to make: above what probability should an application be declined (or sent for extra checks)?

Set the line low and the bank declines many borrowers who would have repaid, losing their interest. Set it high and it lends to borrowers who default, losing the principal. Neither mistake is free, and they don't cost the same. The right threshold isn't a statistics question; it's a business one, and the BA or data scientist's job is to put naira on both kinds of mistake so the bank can choose.

## The concept

**The confusion matrix**

| | Predicted: repays | Predicted: defaults |
| :-- | :-- | :-- |
| **Actually repays** | true negative (TN) | false positive (FP): a good borrower turned away |
| **Actually defaults** | false negative (FN): a default we lent to | true positive (TP): a default caught |

**Measures from it**

- **Recall** (sensitivity) = TP ÷ (TP + FN): of all the defaults, how many did we catch?
- **Precision** = TP ÷ (TP + FP): of the loans we flagged, how many really defaulted?
- Lowering the threshold raises recall and lowers precision. There's always a trade-off.

**AUC: ranking quality, independent of threshold**

The **ROC AUC** measures how well the model ranks risky loans above safe ones, across all thresholds: 0.5 is random guessing, 1.0 is perfect. Credit scoring models typically score 0.70 to 0.85. Use it to compare models; use the threshold analysis to make the decision.

**Choosing the threshold from costs**

For each possible threshold, simulate the decision on the test set:

- each **approved loan that repays** earns the bank its interest margin;
- each **approved loan that defaults** loses the bank part of the principal;
- each **declined loan** earns and loses nothing.

Add it up, and pick the threshold with the highest total. The assumptions (what a default really loses, what a good loan really earns) must come from the finance team, and you should show how the answer changes if they're different.

## Example

The setup from lesson 7, in one cell:

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import confusion_matrix, precision_score, recall_score, roc_auc_score

loans = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/loans/loans.csv")
loans["amount_to_revenue"] = loans["loan_amount_ngn"] / loans["monthly_revenue_ngn"]
features = ["region", "business_type", "borrower_age", "years_in_business", "monthly_revenue_ngn",
            "loan_amount_ngn", "amount_to_revenue", "term_months", "interest_rate_monthly_pct",
            "previous_loans", "previous_late_payments", "group_loan", "has_guarantor",
            "mobile_money_txns_per_month"]
X = pd.get_dummies(loans[features], drop_first=True, dtype=int)
y = loans["defaulted"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X_train, y_train)
prob = model.predict_proba(X_test)[:, 1]
print("AUC:", round(roc_auc_score(y_test, prob), 3))
```

```text
AUC: 0.76
```

Precision and recall at several thresholds:

```python
for t in [0.10, 0.15, 0.20, 0.25, 0.30, 0.50]:
    flag = prob >= t
    print(f"threshold {t:.2f}: recall {recall_score(y_test, flag):.2f}  precision {precision_score(y_test, flag):.2f}  declined {flag.mean():.0%}")
```

```text
threshold 0.10: recall 0.78  precision 0.22  declined 41%
threshold 0.15: recall 0.58  precision 0.27  declined 25%
threshold 0.20: recall 0.47  precision 0.34  declined 16%
threshold 0.25: recall 0.37  precision 0.41  declined 11%
threshold 0.30: recall 0.27  precision 0.43  declined 7%
threshold 0.50: recall 0.07  precision 0.65  declined 1%
```

Now put naira on it. Finance's assumptions: a loan that repays earns half its total interest as margin (after funding and operating costs); a default loses 60% of the amount lent.

```python
test = loans.loc[X_test.index]
margin = test["loan_amount_ngn"] * test["interest_rate_monthly_pct"] / 100 * test["term_months"] * 0.5
loss = test["loan_amount_ngn"] * 0.6
outcome = np.where(y_test == 1, -loss, margin)   # what each loan earns or loses if approved

profit = {}
for t in [0.10, 0.15, 0.20, 0.25, 0.30, 0.40, 0.50, 1.01]:
    approve = prob < t
    profit[t] = outcome[approve].sum() / 1e6
pd.Series(profit).round(1)   # ₦ millions; 1.01 means approve everyone
```

```text
0.10    52.7
0.15    60.1
0.20    66.1
0.25    68.9
0.30    64.0
0.40    59.2
0.50    53.6
1.01    46.7
dtype: float64
```

Approving everyone earns about ₦46.7m on these loans. Declining applications above a probability of 0.25 earns about ₦68.9m: roughly ₦22m more, from the same borrowers, by turning away about 1 in 10 applicants.

## Walkthrough

1. Run the cells. Print the confusion matrix at 0.25: `confusion_matrix(y_test, prob >= 0.25)`.
2. Change the loss on default from 60% to 80% and rerun the profit table. Does the best threshold move?
3. Change the margin from 50% to 30% of interest. What happens now?
4. Write down the threshold you'd recommend, and how sensitive it is to finance's assumptions.

## Practice

```answer
{
  "id": "ml-08-p1",
  "prompt": "What is the model's **ROC AUC** on the test set? Two decimal places.",
  "answer": 0.76,
  "tolerance": 0.011,
  "format": "number",
  "dataset": "loans",
  "files": ["loans"],
  "pyVerify": "round(roc_auc_score(y_test, prob), 2)",
  "hint": "roc_auc_score(y_test, prob).",
  "required": true
}
```

```answer
{
  "id": "ml-08-p2",
  "prompt": "At a threshold of **0.25**, what is the model's **recall** (share of defaults caught)? As a percentage, one decimal place.",
  "answer": 37.2,
  "format": "percent",
  "dataset": "loans",
  "files": ["loans"],
  "pyVerify": "round(recall_score(y_test, prob >= 0.25) * 100, 1)",
  "hint": "recall_score(y_test, prob >= 0.25).",
  "required": true
}
```

```answer
{
  "id": "ml-08-p3",
  "prompt": "Which threshold in the profit table gives the **highest** total profit?",
  "answer": 0.25,
  "format": "number",
  "tolerance": 0.001,
  "dataset": "loans",
  "files": ["loans"],
  "pyVerify": "max(profit, key=profit.get)",
  "hint": "The threshold with the largest value in the profit series.",
  "required": true
}
```

```task
{
  "id": "ml-08-t1",
  "prompt": "Write a recommendation to Ladder's credit committee (60 to 150 words): which **threshold** to use, the **profit** compared with approving everyone, the **trade-off** in plain words (good borrowers turned away, defaults still let through), and how **sensitive** the choice is to finance's assumptions.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "We recommend declining (or reviewing) applications with a default probability above ...",
  "rules": [
    { "label": "Names a threshold", "pattern": "0\\.\\d+|\\d+\\s*%\\s*(probability|chance)" },
    { "label": "Gives the profit comparison in naira", "pattern": "₦\\s*\\d|naira" },
    { "label": "Explains the trade-off (turned away, declined good, let through, missed)", "pattern": "turn(ed)? away|declin\\w+ [^.]*(good|repa)|let through|miss|still lend" },
    { "label": "Mentions sensitivity to assumptions", "pattern": "assum|sensitiv|if the loss|if (the )?margin|depends" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "We recommend reviewing or declining applications with a predicted default probability of 0.25 or more. On the test loans, that would have earned about ₦68.9m, against ₦46.7m for approving everyone: about ₦22m more. The trade-off: we'd decline about 11% of applicants, and some of them (about 6 in 10 of those flagged) would actually have repaid; and we'd still lend to about 63% of the borrowers who default. The best threshold depends on finance's assumptions: if a default costs more than 60% of the loan, a lower threshold such as 0.20 becomes better. We suggest piloting 0.25 on new applications and reviewing the results after three months.",
  "note": "The committee doesn't need to know what AUC is. It needs the decision, what it's worth, who it affects and how confident to be, in that order.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Of 148 defaults, the model flags 55. What is its recall?",
    "options": ["55%", "About 37%", "148%", "Impossible to say"],
    "answer": 1,
    "explanation": "Recall = caught ÷ all defaults = 55 ÷ 148."
  },
  {
    "prompt": "Lowering the threshold from 0.5 to 0.2 usually:",
    "options": ["Raises precision and lowers recall", "Raises recall and lowers precision", "Changes nothing", "Raises both"],
    "answer": 1,
    "explanation": "You catch more of the defaults but flag more good borrowers too."
  },
  {
    "prompt": "What should decide the threshold for a lending model?",
    "options": ["Always 0.5", "The costs of each kind of mistake, from the business", "Whatever gives the highest accuracy", "The AUC"],
    "answer": 1,
    "explanation": "Put naira on the mistakes and choose the threshold that maximises value."
  }
]
```
