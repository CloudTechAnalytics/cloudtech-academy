---
title: Explaining models and responsible ML
minutes: 30
summary: Explain what drives a model's predictions with coefficients and permutation importance, check it for unfair patterns, and plan how to monitor it once it's making real decisions.
---

## The problem

Ladder's credit committee likes the profit table. Then the head of compliance asks three questions:

1. "When we decline someone, can we tell them why?"
2. "Is the model treating borrowers in some regions unfairly?"
3. "How will we know if it stops working?"

A model that can't answer these shouldn't be making decisions about people's livelihoods, however profitable it looks. Explaining, checking for fairness and monitoring aren't optional extras; in lending they're often legal requirements, and they're always good practice.

## The concept

**Global explanations: what drives the model overall?**

- **Coefficients** (for logistic regression on scaled features): the sign says which way a feature pushes the risk, and the size says how strongly, per standard deviation.
- **Permutation importance**: shuffle one feature's values in the test set and measure how much the model's AUC drops. A big drop means the model relies on that feature. It works for any model and doesn't favour features with many values.

**Local explanations: why this applicant?**

For one application, list the features that pushed its probability up most (for logistic regression, each feature's scaled value × its coefficient). Turn the top two or three into plain reasons: "loan large relative to revenue", "late payments on previous loans".

**Fairness**

- Don't use **protected characteristics** (sex, religion, ethnicity) as features. This dataset doesn't contain them.
- Watch for **proxies**: features that stand in for a protected group. In Nigeria, **region** can be a proxy for ethnicity or religion.
- Ask whether a feature reflects **behaviour** the borrower controls (late payments, the loan's size compared with revenue) or **who they are** (where they live). Prefer behaviour.
- Test it: does dropping the feature lose real predictive power? If not, drop it.

**Monitoring: models age**

The world changes: interest rates, the economy, the bank's own lending policy. Track, monthly:

- the **default rate** of new loans against what the model predicted;
- the **distribution of key features** (are applicants borrowing more relative to revenue than before?);
- the **AUC** on loans that have now matured.

Retrain when they drift.

## Example

The setup, then permutation importance on the test set:

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.metrics import roc_auc_score
from sklearn.inspection import permutation_importance

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

result = permutation_importance(model, X_test, y_test, scoring="roc_auc", n_repeats=10, random_state=42)
importance = pd.Series(result.importances_mean, index=X.columns).sort_values(ascending=False)
importance.head(6).round(3)
```

```text
previous_late_payments           0.080
amount_to_revenue                0.069
years_in_business                0.049
has_guarantor_Yes                0.021
business_type_Hair and beauty    0.020
mobile_money_txns_per_month      0.019
dtype: float64
```

The model relies most on previous late payments, the loan's size relative to revenue and years in business. Those are things a credit officer would recognise and could explain to a borrower. Now the fairness question. Does region add anything?

```python
no_region = [c for c in X.columns if not c.startswith("region_")]
model_nr = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)).fit(X_train[no_region], y_train)
print("AUC with region:   ", round(roc_auc_score(y_test, model.predict_proba(X_test)[:, 1]), 3))
print("AUC without region:", round(roc_auc_score(y_test, model_nr.predict_proba(X_test[no_region])[:, 1]), 3))
```

```text
AUC with region:    0.76
AUC without region: 0.764
```

Dropping region makes almost no difference to the model's ability to rank risk. Region adds little real information and carries a fairness risk, so the responsible choice is clear: drop it. Finally, a first monitoring check, comparing default rates by the year the loan was made:

```python
loans.groupby(loans["disbursed_date"].str[:4])["defaulted"].mean().round(3)
```

```text
disbursed_date
2024    0.129
2025    0.108
Name: defaulted, dtype: float64
```

Loans made in 2025 defaulted less often than those made in 2024. Some 2025 loans may not have finished their terms yet, which flatters the recent rate, and conditions may have changed. Either way, it's the kind of shift that should trigger a review of the model.

## Walkthrough

1. Run the cells. Compare permutation importance with the coefficients: `pd.Series(model[-1].coef_[0], index=X.columns).sort_values()`.
2. Pick the test loan with the highest predicted probability. Multiply its scaled feature values by the coefficients, and list the three biggest contributions as reasons a credit officer could give.
3. Rebuild the model without region and use it from now on.
4. Write a one-paragraph monitoring plan: what you'd check each month, and what would trigger retraining.

## Practice

```answer
{
  "id": "ml-09-p1",
  "prompt": "Which feature has the **highest permutation importance**? Type the column name.",
  "answer": "previous_late_payments",
  "accept": ["previous late payments"],
  "format": "text",
  "dataset": "loans",
  "files": ["loans"],
  "pyVerify": "importance.idxmax()",
  "hint": "The top row of the importance table.",
  "required": true
}
```

```answer
{
  "id": "ml-09-p2",
  "prompt": "What is the default rate of loans disbursed in **2024**? As a percentage, one decimal place.",
  "answer": 12.9,
  "format": "percent",
  "dataset": "loans",
  "files": ["loans"],
  "pyVerify": "round(loans.loc[loans['disbursed_date'].str[:4] == '2024', 'defaulted'].mean() * 100, 1)",
  "hint": "Group by the year of disbursed_date and take the mean of defaulted.",
  "required": true
}
```

```task
{
  "id": "ml-09-t1",
  "prompt": "Answer the head of compliance's three questions in 3 short paragraphs or bullets (80 to 200 words): **explaining** a decline to a borrower, **fairness** (with what you found about region), and **monitoring** (what you'll check and how often).",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Explaining declines: ...\nFairness: ...\nMonitoring: ...",
  "rules": [
    { "label": "Covers explaining a decline with specific reasons", "pattern": "late payment|relative to (revenue|income)|amount to revenue|years in business|reason" },
    { "label": "Covers fairness and region", "pattern": "region" },
    { "label": "Says region was dropped or will be", "pattern": "drop|remov|exclud|without region|not use" },
    { "label": "Covers monitoring with a frequency", "pattern": "monitor[\\s\\S]*(monthly|weekly|quarterly|every)|(monthly|weekly|quarterly|every)[\\s\\S]*monitor" },
    { "label": "Between 80 and 200 words", "minWords": 80, "maxWords": 200 }
  ],
  "sample": "Explaining declines: for each declined application we'll list the two or three factors that raised its risk most, such as late payments on previous loans, a loan that's large relative to monthly revenue, or few years in business. These are things the borrower can understand and, in time, change.\n\nFairness: the model doesn't use sex, religion or ethnicity. We tested region, which can act as a proxy for ethnicity: removing it barely changed the model's accuracy (AUC about 0.76 either way), so we've dropped it.\n\nMonitoring: every month we'll compare the predicted and actual default rates of loans as they mature, check whether applicants' loan-to-revenue ratios are shifting, and recalculate the AUC each quarter. A gap of more than 2 percentage points between predicted and actual defaults, or an AUC below 0.70, triggers a review and retraining.",
  "note": "Concrete triggers (\"more than 2 points\", \"below 0.70\") turn monitoring from a promise into a procedure.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does permutation importance measure?",
    "options": ["How often a feature appears", "How much the model's performance drops when that feature's values are shuffled", "The feature's correlation with the target", "The size of its coefficient"],
    "answer": 1,
    "explanation": "If shuffling a feature hurts the model, the model relies on it."
  },
  {
    "prompt": "Dropping 'region' barely changes AUC. What should you do?",
    "options": ["Keep it, every bit helps", "Drop it: it adds little predictive value and may act as a proxy for protected groups", "Add more regions", "Use only region"],
    "answer": 1,
    "explanation": "Little value plus fairness risk means it shouldn't be used."
  },
  {
    "prompt": "Why monitor a model after deployment?",
    "options": ["It's optional", "Conditions change, so a model that was accurate can drift and quietly make worse decisions", "To retrain every day", "Regulators don't care"],
    "answer": 1,
    "explanation": "Track predicted versus actual outcomes and retrain when they drift."
  }
]
```
