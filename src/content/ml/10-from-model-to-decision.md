---
title: From model to decision
minutes: 30
summary: Package a model as a pipeline that takes raw applications, score new cases with reasons, save it for others to use, and document it with a model card.
---

## The problem

Your notebook contains a good default model, but nobody at Ladder can use a notebook. The credit officers need to enter an application (business type, revenue, loan amount, and so on) and get back a probability, a recommendation and the main reasons, in a form they trust. The data team needs to run the same model next month without redoing your cleaning steps by hand.

Getting from "a model in a notebook" to "a model the business uses" is where many data science projects stall. The two tools that bridge the gap are a **pipeline** that does every step from raw data to prediction, and a **model card** that tells everyone what the model is for and where it shouldn't be trusted.

## The concept

**A full pipeline**

Until now, you've one-hot encoded with `pd.get_dummies` before training. That's fragile: a new application has one row, so `get_dummies` can't create the same columns. A scikit-learn **ColumnTransformer** does the preparation inside the model:

- `OneHotEncoder(handle_unknown="ignore")` for text columns, remembering the categories it saw in training;
- `StandardScaler()` for numbers;
- then the model.

Fit the whole pipeline on the training data, and it takes **raw** rows, exactly like the CSV, from then on.

**Scoring and reasons**

For each new application, return the probability, the decision at the agreed threshold, and the top reasons. Reasons matter as much as the score: they're what a credit officer can act on and explain.

**Saving and loading**

`joblib.dump(pipeline, "default_model.joblib")` saves the fitted pipeline to a file; `joblib.load` brings it back, ready to score. Record the date, the data used and the scikit-learn version alongside it.

**A model card**

A one-page description of the model: purpose, intended users, data, features (and those deliberately excluded), performance, threshold and its business basis, known limitations, fairness checks, monitoring plan, owner and review date.

## Example

The production pipeline, trained on raw columns without region:

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_auc_score

loans = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/loans/loans.csv")
loans["amount_to_revenue"] = loans["loan_amount_ngn"] / loans["monthly_revenue_ngn"]
categorical = ["business_type", "group_loan", "has_guarantor"]
numeric = ["borrower_age", "years_in_business", "monthly_revenue_ngn", "loan_amount_ngn",
           "amount_to_revenue", "term_months", "interest_rate_monthly_pct", "previous_loans",
           "previous_late_payments", "mobile_money_txns_per_month"]
X = loans[categorical + numeric]
y = loans["defaulted"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

pipeline = Pipeline([
    ("prepare", ColumnTransformer([
        ("categories", OneHotEncoder(handle_unknown="ignore", drop="first"), categorical),
        ("numbers", StandardScaler(), numeric),
    ])),
    ("model", LogisticRegression(max_iter=1000)),
])
pipeline.fit(X_train, y_train)
print("Test AUC:", round(roc_auc_score(y_test, pipeline.predict_proba(X_test)[:, 1]), 3))
```

```text
Test AUC: 0.765
```

Now score a new application, exactly as a credit officer would enter it:

```python
application = pd.DataFrame([{
    "business_type": "Food vendor", "group_loan": "No", "has_guarantor": "No",
    "borrower_age": 31, "years_in_business": 1, "monthly_revenue_ngn": 250000,
    "loan_amount_ngn": 600000, "term_months": 6, "interest_rate_monthly_pct": 4.5,
    "previous_loans": 1, "previous_late_payments": 2, "mobile_money_txns_per_month": 8,
}])
application["amount_to_revenue"] = application["loan_amount_ngn"] / application["monthly_revenue_ngn"]

p = pipeline.predict_proba(application[categorical + numeric])[0, 1]
print(f"Probability of default: {p:.0%}")
print("Recommendation:", "refer for review" if p >= 0.25 else "approve")
```

```text
Probability of default: 59%
Recommendation: refer for review
```

And the reasons, from each feature's contribution to the score:

```python
prepare, model = pipeline.named_steps["prepare"], pipeline.named_steps["model"]
contrib = pd.Series(prepare.transform(application[categorical + numeric])[0] * model.coef_[0],
                    index=prepare.get_feature_names_out())
contrib.sort_values(ascending=False).head(3).round(2)
```

```text
numbers__amount_to_revenue         0.85
numbers__previous_late_payments    0.52
numbers__years_in_business         0.38
dtype: float64
```

The biggest pushes towards default are the loan's size relative to revenue (2.4 times monthly revenue), two late payments on the previous loan and little time in business: three reasons a credit officer can explain, and that a guarantor or a smaller loan could address.

## Walkthrough

1. Run the cells, then save the pipeline: `import joblib; joblib.dump(pipeline, "default_model.joblib")`, and load it back in a new cell to check it scores the same.
2. Change the application: add a guarantor, or halve the loan amount. How much does the probability fall?
3. Score five real applications from the test set and compare the recommendations with what actually happened.
4. Write the model card (the task below).

## Practice

```answer
{
  "id": "ml-10-p1",
  "prompt": "What probability of default does the pipeline give the **example application**? As a percentage, rounded to the nearest whole number.",
  "answer": 59,
  "format": "percent",
  "dataset": "loans",
  "files": ["loans"],
  "pyVerify": "round(p * 100)",
  "hint": "The first line printed by the scoring cell.",
  "required": true
}
```

```task
{
  "id": "ml-10-t1",
  "prompt": "Write a **model card** for Ladder's default model, with one line each starting: **Purpose:**, **Users:**, **Data:**, **Features excluded:**, **Performance:**, **Threshold:**, **Limitations:**, **Monitoring:** and **Owner:**.",
  "minutes": 10,
  "rows": 12,
  "placeholder": "Purpose: ...\nUsers: ...",
  "rules": [
    { "label": "Purpose, Users and Data lines", "pattern": "^\\s*[-*]?\\s*(purpose|users|data)\\s*:", "min": 3 },
    { "label": "Features excluded line, mentioning region", "pattern": "^\\s*[-*]?\\s*features excluded\\s*:[^\\n]*region" },
    { "label": "Performance line with a number", "pattern": "^\\s*[-*]?\\s*performance\\s*:[^\\n]*\\d" },
    { "label": "Threshold line with a number and its basis", "pattern": "^\\s*[-*]?\\s*threshold\\s*:[^\\n]*\\d[^\\n]*(profit|cost|loss|margin)" },
    { "label": "Limitations, Monitoring and Owner lines", "pattern": "^\\s*[-*]?\\s*(limitations|monitoring|owner)\\s*:", "min": 3 }
  ],
  "sample": "Purpose: estimate the probability that a new small-business loan application will default, to decide whether to approve it or refer it for review.\nUsers: Ladder's credit officers and credit committee.\nData: 5,000 loans disbursed January 2024 to December 2025, with their outcomes.\nFeatures excluded: region (a possible proxy for ethnicity; removing it didn't reduce accuracy) and anything recorded after disbursement, such as arrears.\nPerformance: test AUC about 0.76; at the 0.25 threshold it catches about 37% of defaults while referring about 11% of applicants.\nThreshold: 0.25, chosen to maximise profit with a default costing 60% of the loan and a good loan earning half its interest.\nLimitations: trained on two years of data; some 2025 loans hadn't matured; not tested on loans above ₦5m or new business types.\nMonitoring: monthly predicted vs actual default rate; quarterly AUC; review if the gap exceeds 2 points or AUC falls below 0.70.\nOwner: head of credit risk; next review March 2027.",
  "note": "The limitations line protects the bank: it says where the model shouldn't be trusted, before anyone uses it there.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why put the one-hot encoding inside a ColumnTransformer instead of using pd.get_dummies?",
    "options": ["It's faster", "The pipeline remembers the training categories, so a single new row gets exactly the same columns", "get_dummies is deprecated", "It removes missing values"],
    "answer": 1,
    "explanation": "A pipeline takes raw rows and prepares them consistently every time."
  },
  {
    "prompt": "What does handle_unknown='ignore' do?",
    "options": ["Deletes rows", "Lets the encoder accept a category it didn't see in training, instead of failing", "Ignores the target", "Skips scaling"],
    "answer": 1,
    "explanation": "A new business type won't crash the model; it just gets zeros for that feature."
  },
  {
    "prompt": "What belongs in a model card?",
    "options": ["Only the accuracy", "Purpose, data, excluded features, performance, threshold, limitations, monitoring and owner", "The source code", "Marketing claims"],
    "answer": 1,
    "explanation": "It tells everyone what the model is for and where not to trust it."
  }
]
```
