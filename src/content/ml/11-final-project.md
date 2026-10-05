---
title: "Final project: Ladder's credit model"
minutes: 25
summary: Plan your final project, a complete, responsible default model and lending recommendation for a microfinance bank, and start with the questions every credit model must answer.
---

## The problem

Ladder Microfinance's board has approved a pilot: for six months, new applications will be scored by a model, and those above the threshold will be referred for review rather than approved automatically. The head of credit risk asks you to deliver the model and everything around it: the analysis behind it, the evidence it works, the threshold and what it's worth, the explanation for declined borrowers, the fairness checks, and the plan for monitoring it.

This is what a junior data scientist's first real project looks like. The modelling is perhaps a third of the work. The rest is making sure the model is honest, explainable, fair and useful, which is what this course has been about.

## The concept

### The project, step by step

| Step | Deliverable | Lesson |
| :-- | :-- | :-- |
| Frame | the prediction, the decision it changes, the measure of success | 1 |
| Prepare | features, leakage checks, engineered features such as amount ÷ revenue | 2 |
| Split and baseline | a stratified split and the "no default" baseline | 3, 7 |
| Model | logistic regression and at least one tree-based model, compared fairly | 4, 5, 7 |
| Tune | cross-validated settings, test set used once | 6 |
| Evaluate | AUC, precision and recall, and the profit-based threshold | 8 |
| Explain and check | permutation importance, reasons for declines, fairness checks | 9 |
| Deploy | a pipeline, a scored example, a model card, a monitoring plan | 10 |

### What makes it responsible

- No leakage: every feature exists on the day of the application.
- No protected characteristics, and proxies tested and removed if they add nothing.
- A threshold chosen from business costs, with sensitivity shown.
- Reasons a borrower can understand.
- Monitoring with concrete triggers for review.

## Example

Two warm-up questions that belong in your exploratory analysis. Group loans (where borrowers guarantee each other) and the loan's size relative to revenue are two of the strongest signals in the data:

```python
import pandas as pd

loans = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/loans/loans.csv")
loans["amount_to_revenue"] = loans["loan_amount_ngn"] / loans["monthly_revenue_ngn"]
print(loans.groupby("group_loan")["defaulted"].mean().round(3))
loans.groupby("defaulted")["amount_to_revenue"].median().round(2)
```

```text
group_loan
No     0.140
Yes    0.086
Name: defaulted, dtype: float64
defaulted
0    1.51
1    1.86
Name: amount_to_revenue, dtype: float64
```

Group loans default less often, and borrowers who defaulted had typically borrowed a larger multiple of their monthly revenue. Both make business sense, which is reassuring: a model built on them will be easier to explain and to trust.

## Walkthrough

1. Frame the project in a short paragraph: what's predicted, the decision, and how success will be measured in the pilot.
2. Build the features, check each one for leakage, and decide about region before you start modelling.
3. Compare at least two models with cross-validation, choose one, and score the test set once.
4. Build the profit table, choose the threshold, and show how it changes if a default costs 80% of the loan.
5. Open the project brief on the course page and plan the rest: explanations, fairness, pipeline and model card.

## Practice

```dataset
{"dataset": "loans", "files": ["loans"]}
```

```answer
{
  "id": "ml-11-p1",
  "prompt": "What is the default rate of **group loans**? As a percentage, one decimal place.",
  "answer": 8.6,
  "format": "percent",
  "dataset": "loans",
  "files": ["loans"],
  "pyVerify": "round(loans.loc[loans['group_loan'] == 'Yes', 'defaulted'].mean() * 100, 1)",
  "hint": "The 'Yes' row of the first output.",
  "required": true
}
```

```answer
{
  "id": "ml-11-p2",
  "prompt": "What is the **median amount-to-revenue ratio** for loans that **defaulted**? Two decimal places.",
  "answer": 1.86,
  "format": "number",
  "dataset": "loans",
  "files": ["loans"],
  "pyVerify": "round(loans.loc[loans['defaulted'] == 1, 'amount_to_revenue'].median(), 2)",
  "hint": "The row for defaulted = 1 in the second output.",
  "required": true
}
```

```task
{
  "id": "ml-11-t1",
  "prompt": "Write the **project framing** for Ladder's pilot in 60 to 150 words: what the model **predicts**, the **decision** it changes, who **uses** it, and how **success** will be measured after six months (with at least one number).",
  "minutes": 8,
  "rows": 8,
  "placeholder": "The model predicts ...",
  "rules": [
    { "label": "Says what is predicted (probability of default)", "pattern": "probabilit\\w* (of|that)[^.]*default|default (probability|risk)|predict\\w*[^.]*default" },
    { "label": "Says the decision it changes (approve, refer, decline, review)", "pattern": "approv|refer|declin|review" },
    { "label": "Names the users", "pattern": "credit officer|credit team|credit committee|loan officer|underwriter" },
    { "label": "Success measure with a number", "pattern": "(success|measur|target|compar|judge)[^\\n]*\\d" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "The model predicts the probability that a new small-business loan will default, using only information available on the application form and from the borrower's previous loans. Credit officers will use it to decide whether to approve an application directly or refer it for review: applications at or above the agreed threshold will be referred. After six months, we'll judge the pilot by comparing scored applications with the same months last year: the default rate of approved loans should fall from about 12% to under 9%, without reducing the number of loans approved by more than 10%, and the model's AUC on matured pilot loans should stay above 0.72.",
  "note": "The success measure has two sides: fewer defaults and not too many good borrowers turned away. A model that cuts defaults by refusing everyone would \"succeed\" on the first measure alone.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which part of a credit-model project usually takes most of the effort?",
    "options": ["Choosing the algorithm", "Everything around the model: data, leakage checks, evaluation, thresholds, explanation, fairness and monitoring", "Writing the code", "Tuning hyperparameters"],
    "answer": 1,
    "explanation": "The model itself is often the smallest part."
  },
  {
    "prompt": "Why measure the pilot on both default rate and approval volume?",
    "options": ["Regulators require two numbers", "A model could cut defaults simply by refusing almost everyone, which would hurt the business", "Approval volume doesn't matter", "To make the report longer"],
    "answer": 1,
    "explanation": "Success has to balance risk against lending."
  },
  {
    "prompt": "A feature makes good business sense and the model relies on it. Why is that reassuring?",
    "options": ["It isn't", "Predictions are easier to explain and less likely to be built on a quirk of the data", "It guarantees accuracy", "It removes the need to test"],
    "answer": 1,
    "explanation": "Sensible drivers are a good sign, though you still test everything."
  }
]
```
