---
title: Classification and logistic regression
minutes: 20
summary: Predict a yes-or-no outcome with logistic regression, work with probabilities rather than labels, and see why accuracy is a dangerous measure when one outcome is rare.
---

## The problem

Ladder Microfinance lends ₦50,000 to ₦5m to small businesses: shops, food vendors, tailors, transporters, farmers. About 12% of its loans default, and each default loses the bank most of the money lent. The credit team wants a model that flags risky applications so they can be reviewed more carefully, lent less, or asked for a guarantor.

A data scientist builds one and reports **88.6% accuracy**. The credit manager is impressed. She shouldn't be: a "model" that simply says *no one will default* is 88.2% accurate on the same loans, and it would never flag a single risky borrower.

## The concept

### Classification

The target is a category: here `defaulted`, 1 or 0. Classifiers usually predict a **probability** ("this loan has a 31% chance of default"), which you then turn into a decision with a **threshold** (flag if the probability is above 0.25).

### Logistic regression

The classification version of linear regression. It combines the features into a score, like linear regression, then squeezes that score into a probability between 0 and 1 with the S-shaped logistic function. It's fast, robust and explainable, and in credit scoring it's still the industry standard.

![An S-shaped curve rising from 0 to 1 as the risk score increases, with a dashed threshold at 0.5: approve below it, flag as likely default above it.](/images/courses/ml/sigmoid.svg "The logistic function turns a score into a probability; the threshold turns it into a decision.")

Logistic regression works best when the numeric features are on similar scales, so put a **StandardScaler** in front of it in a **pipeline**: one object that scales the data and then fits the model, in the right order, every time.

### Imbalanced classes

When one outcome is rare (defaults, fraud, rare diseases):

- **Accuracy misleads**: predicting the common outcome every time scores highly.
- **Split with `stratify=y`**, so the training and test sets have the same share of defaults.
- **Look at the rare class directly**: how many of the defaults did the model catch? That's **recall**, and lesson 8 covers it properly.

## Example

Prepare the features, including a ratio that credit officers already use (loan amount ÷ monthly revenue):

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import accuracy_score

loans = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/loans/loans.csv")
loans["amount_to_revenue"] = loans["loan_amount_ngn"] / loans["monthly_revenue_ngn"]
features = ["region", "business_type", "borrower_age", "years_in_business", "monthly_revenue_ngn",
            "loan_amount_ngn", "amount_to_revenue", "term_months", "interest_rate_monthly_pct",
            "previous_loans", "previous_late_payments", "group_loan", "has_guarantor",
            "mobile_money_txns_per_month"]
X = pd.get_dummies(loans[features], drop_first=True, dtype=int)
y = loans["defaulted"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)
print("Default rate in the test set:", round(y_test.mean(), 3))
```

```text
Default rate in the test set: 0.118
```

Train the model, and compare it with the "nobody defaults" baseline:

```python
model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
model.fit(X_train, y_train)

prob = model.predict_proba(X_test)[:, 1]   # probability of default for each test loan
labels = (prob >= 0.5).astype(int)          # the default threshold

print("Always 'no default' accuracy:", round(accuracy_score(y_test, np.zeros(len(y_test))), 4))
print("Model accuracy at 0.5:       ", round(accuracy_score(y_test, labels), 4))
print("Defaults in test set:", int(y_test.sum()), " caught by the model:", int(((labels == 1) & (y_test == 1)).sum()))
```

```text
Always 'no default' accuracy: 0.8816
Model accuracy at 0.5:        0.8856
Defaults in test set: 148  caught by the model: 11
```

The model is barely more accurate than saying "no" to everything, and at a threshold of 0.5 it catches only a handful of the defaults. That doesn't mean the model is useless. It means 0.5 is the wrong threshold for this problem and accuracy is the wrong measure. The probabilities are where the value is:

```python
pd.Series(prob).describe().round(3)
```

```text
count    1250.000
mean        0.115
std         0.110
min         0.002
25%         0.041
50%         0.081
75%         0.151
max         0.708
dtype: float64
```

Most loans get a low probability, but some get much higher ones. The question for lesson 8 is where to draw the line.

## Walkthrough

1. Run the three cells.
2. Check the stratification: compare `y_train.mean()` with `y_test.mean()`.
3. Look at the 10 loans with the highest predicted probability: `loans.loc[X_test.index].assign(prob=prob).nlargest(10, "prob")`. What do they have in common?
4. Try a threshold of 0.25 instead of 0.5. How many defaults are caught now, and how many good loans are flagged by mistake?

## Practice

```dataset
{"dataset": "loans", "files": ["loans"]}
```

```answer
{
  "id": "ml-07-p1",
  "prompt": "What is the accuracy of the **always 'no default'** baseline on the test set, as a percentage? One decimal place.",
  "answer": 88.2,
  "format": "percent",
  "dataset": "loans",
  "files": ["loans"],
  "pyVerify": "round((1 - y_test.mean()) * 100, 1)",
  "hint": "It's the share of test loans that didn't default.",
  "required": true
}
```

```answer
{
  "id": "ml-07-p2",
  "prompt": "At a threshold of **0.5**, how many of the test set's defaults does the model catch?",
  "answer": 11,
  "format": "number",
  "dataset": "loans",
  "files": ["loans"],
  "pyVerify": "int(((labels == 1) & (y_test == 1)).sum())",
  "hint": "Count the loans where both the label and the actual outcome are 1.",
  "explanation": "11 of 148: about 7%. High accuracy, almost no use to the credit team.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Only 2% of transactions are fraudulent. A model is 98% accurate. What should you check first?",
    "options": ["Nothing, it's excellent", "Whether it catches any fraud at all: predicting 'not fraud' every time is also 98% accurate", "Its training time", "The number of features"],
    "answer": 1,
    "explanation": "With rare outcomes, accuracy can hide a useless model."
  },
  {
    "prompt": "Why use stratify=y when splitting imbalanced data?",
    "options": ["To make the model faster", "So the training and test sets have the same share of the rare outcome", "To remove duplicates", "It's required for logistic regression"],
    "answer": 1,
    "explanation": "Otherwise the test set might have too few defaults to measure anything reliably."
  },
  {
    "prompt": "What does predict_proba give you that predict doesn't?",
    "options": ["Nothing", "The probability of each outcome, so you can choose the threshold that suits the decision", "The features", "The accuracy"],
    "answer": 1,
    "explanation": "Probabilities let the business, not the default 0.5, decide where to draw the line."
  }
]
```
