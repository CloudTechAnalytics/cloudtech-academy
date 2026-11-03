---
title: What machine learning is
minutes: 25
summary: What machine learning can and can't do, the difference between regression and classification, the workflow every project follows, and your first look at the two datasets this course uses.
---

## The problem

A property company in Lagos wants to tell landlords what rent to ask for a flat, instantly, from a few details. A microfinance bank wants to know, before it lends, which small-business borrowers are likely to default. Both have years of records. Neither can write down the rules: rent depends on area, size, power, finishing and a dozen other things at once, and nobody can say exactly how much each one adds.

That's the kind of problem **machine learning** (ML) is for: when you have many examples with known answers, but the rule connecting the inputs to the answer is too complicated to write by hand. This course teaches you to build, test and explain such models in Python with scikit-learn, the library most data scientists start with, and to recognise when a model isn't the answer at all.

## The concept

### What a model learns

A machine learning model learns a function from **features** (the inputs, such as area, bedrooms, size) to a **target** (the answer, such as rent), from examples where both are known. It then predicts the target for new cases where only the features are known.

### Two kinds of supervised learning

| Type | Target | Examples |
| :-- | :-- | :-- |
| **Regression** | a number | rent, delivery time, monthly sales |
| **Classification** | a category | default or not, fraud or not, will the customer leave? |

Both are **supervised**: the training data includes the right answers. **Unsupervised** learning (such as grouping customers into segments) has no target; this course focuses on supervised learning, which is where most business value is.

### The workflow

1. **Frame** the question: what will be predicted, for whom, and what decision will it change?
2. **Prepare** the data: clean it, handle gaps, turn categories into numbers.
3. **Split** it: train on some data, test on data the model hasn't seen.
4. **Start with a baseline**: the simplest possible prediction, to beat.
5. **Train and compare** models.
6. **Evaluate** honestly, with the right measure for the decision.
7. **Explain and deploy** responsibly, and keep monitoring.

![Seven numbered steps: frame, prepare, split, baseline, train, evaluate, deploy, with a dashed loop from deploy back to frame. Baseline and evaluate are highlighted.](/images/courses/ml/workflow.svg "The workflow. The highlighted steps are the ones most often skipped.")

### When not to use machine learning

- When a simple rule works ("loans over ₦5m need a manager's approval").
- When you have too few examples, or none with known answers.
- When nobody will act differently because of the prediction.
- When mistakes would be harmful and you can't explain the model's decisions.

## Example

The two datasets for this course. First, 2,400 rental listings in Lagos and Abuja:

```python
import pandas as pd

rentals = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/rentals/listings.csv")
print(rentals.shape)
rentals.head(3)
```

```text
(2400, 14)
  listing_id   city      area property_type  bedrooms  bathrooms  size_sqm serviced furnished                        power  parking_spaces  year_built listed_date  annual_rent_ngn
0   RL-00001  Lagos      Yaba     Mini flat         1          1       NaN       No       Yes                24-hour power               0        1995  2025-08-08          1550000
1   RL-00002  Lagos      Ajah          Flat         1          1      69.0       No        No  Prepaid meter and generator               1        2014  2026-05-17          1550000
2   RL-00003  Lagos  Surulere          Flat         1          1      90.0       No        No  Prepaid meter and generator               0        1990  2025-09-02          1600000
```

And 5,000 microfinance loans, with whether each one defaulted:

```python
loans = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/loans/loans.csv")
print(loans.shape)
loans["defaulted"].value_counts()
```

```text
(5000, 16)
defaulted
0    4407
1     593
Name: count, dtype: int64
```

The rentals are a **regression** problem (predict `annual_rent_ngn`). The loans are a **classification** problem (predict `defaulted`, 1 or 0). Notice that only about 1 loan in 8 defaulted. That imbalance will matter a great deal in lesson 7.

## Walkthrough

1. Open a new notebook in Google Colab (colab.research.google.com). scikit-learn is already installed.
2. Load both datasets with the code above.
3. Look at the rentals with `rentals.describe()` and `rentals["area"].value_counts()`. Which areas are most listed?
4. Look at the loans with `loans.describe()`. What's the range of loan amounts and monthly revenue?
5. For each dataset, write down the target, three features you'd expect to matter, and the decision a prediction would change.

## Practice

```dataset
{"dataset": "rentals", "files": ["listings"]}
```

```answer
{
  "id": "ml-01-p1",
  "prompt": "What is the **median** annual rent across all listings?",
  "answer": 3300000,
  "format": "naira",
  "dataset": "rentals",
  "files": ["listings"],
  "pyVerify": "rentals['annual_rent_ngn'].median()",
  "hint": "rentals['annual_rent_ngn'].median()",
  "required": true
}
```

```answer
{
  "id": "ml-01-p2",
  "prompt": "What percentage of loans **defaulted**? One decimal place.",
  "answer": 11.9,
  "format": "percent",
  "dataset": "loans",
  "files": ["loans"],
  "pyVerify": "round(loans['defaulted'].mean() * 100, 1)",
  "hint": "The mean of a 0/1 column is the share of 1s: loans['defaulted'].mean().",
  "required": true
}
```

```task
{
  "id": "ml-01-t1",
  "prompt": "For each of these four problems, say whether it's **regression**, **classification** or **not a machine learning problem**, with a one-line reason. One per line in the form **Problem | answer | reason**.\n\n1. Estimating how many days a shipment will take\n2. Deciding whether an insurance claim looks fraudulent\n3. Applying a 10% discount to orders over ₦1m\n4. Predicting whether a customer will cancel their subscription next month",
  "minutes": 5,
  "rows": 6,
  "placeholder": "Shipment days | regression | ...",
  "rules": [
    { "label": "Four lines in the form Problem | answer | reason", "pattern": "^[^|\\n]+\\|\\s*(regression|classification|not (a )?(machine learning|ml)[^|\\n]*)\\s*\\|[^|\\n]+$", "min": 4 },
    { "label": "Shipment days is regression", "pattern": "(shipment|days)[^|\\n]*\\|\\s*regression" },
    { "label": "The discount rule is not machine learning", "pattern": "discount[^|\\n]*\\|\\s*not" },
    { "label": "Fraud and cancellation are classification", "pattern": "\\|\\s*classification", "min": 2 }
  ],
  "sample": "Shipment days | regression | the target is a number of days\nInsurance fraud | classification | the target is a category: fraudulent or not\n10% discount over ₦1m | not machine learning | it's a fixed rule that can be written down exactly\nSubscription cancellation | classification | the target is yes or no: cancels or stays",
  "note": "The discount is the important one. If the rule can be written down, write it down: a model would only learn it imperfectly.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is the target in a model that predicts rent from area, size and bedrooms?",
    "options": ["Area", "Rent", "Bedrooms", "All of them"],
    "answer": 1,
    "explanation": "The target is what you predict; the rest are features."
  },
  {
    "prompt": "Predicting whether a borrower will default is:",
    "options": ["Regression", "Classification", "Unsupervised learning", "Not machine learning"],
    "answer": 1,
    "explanation": "The target is a category: default or not."
  },
  {
    "prompt": "When is machine learning usually the wrong tool?",
    "options": ["When there are many examples with known answers", "When a simple, exact rule already does the job", "When the relationship is complicated", "When predictions change decisions"],
    "answer": 1,
    "explanation": "Write down rules that can be written down."
  }
]
```
