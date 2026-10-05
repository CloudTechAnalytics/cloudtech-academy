---
title: Cross-validation and tuning
minutes: 15
summary: Choose model settings without peeking at the test set, using k-fold cross-validation, and understand why a single train/test split can mislead.
---

## The problem

In lesson 5 you tried tree depths of 4, 8 and 12 and looked at the test error for each. That felt sensible, but it's a trap. If you choose the depth that does best on the test set, the test set is no longer unseen: you've tuned the model to it, and its error is now an optimistic guess of how the model will do on genuinely new data.

The test set must be used **once**, at the end. So how do you choose settings like depth in the meantime? With **cross-validation**: a way to get reliable estimates of performance from the training data alone.

## The concept

### Hyperparameters

Settings you choose before training, rather than ones the model learns: a tree's `max_depth`, a forest's number of trees, `min_samples_leaf`. Choosing them is called **tuning**.

### k-fold cross-validation

1. Split the **training** data into k parts (folds), often 5.
2. Train on 4 folds and measure the error on the 5th.
3. Repeat 5 times, so each fold is used once for measuring.
4. Average the 5 errors.

Every training row is used for both learning and checking, and the average over 5 folds is far more stable than one split. Use it to compare settings, pick the best, then retrain on all the training data and score the **test set once**.

![Five rounds of five folds. In each round a different fold is scored and the other four are used for training; the test set sits apart, unused.](/images/courses/ml/kfold.svg "5-fold cross-validation. The test set stays out of it.")

### Grid search

`GridSearchCV` automates this: give it a model, a list of settings to try and a scoring measure, and it cross-validates every combination and reports the best.

### The three-way discipline

| Data | Used for |
| :-- | :-- |
| Training folds | fitting models |
| Validation folds (inside cross-validation) | choosing settings and models |
| Test set | one final, honest score |

## Example

Cross-validate tree depths on the training data only:

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_absolute_error

rentals = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/rentals/listings.csv")
typical = rentals.groupby(["area", "property_type", "bedrooms"])["annual_rent_ngn"].transform("median")
rentals = rentals[rentals["annual_rent_ngn"] <= 4 * typical].copy()
rentals["size_sqm"] = rentals["size_sqm"].fillna(
    rentals.groupby(["property_type", "bedrooms"])["size_sqm"].transform("median")
)
features = ["area", "property_type", "bedrooms", "bathrooms", "size_sqm", "serviced",
            "furnished", "power", "parking_spaces", "year_built"]
X = pd.get_dummies(rentals[features], drop_first=True, dtype=int)
y = rentals["annual_rent_ngn"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

folds = KFold(n_splits=5, shuffle=True, random_state=42)
cv_mae = {}
for depth in [3, 5, 7, 9, 11, 13, 15]:
    scores = cross_val_score(DecisionTreeRegressor(max_depth=depth, random_state=42),
                             X_train, y_train, cv=folds, scoring="neg_mean_absolute_error")
    cv_mae[depth] = -scores.mean()
pd.Series(cv_mae).round(0)
```

```text
3     3353924.0
5     2477227.0
7     1852143.0
9     1608691.0
11    1495930.0
13    1441609.0
15    1470272.0
dtype: float64
```

scikit-learn's scores are "higher is better", so MAE comes back negative; the minus sign turns it back. The cross-validated error falls as the tree grows, bottoms out, then starts rising again as deeper trees overfit. Choose the depth with the lowest error, retrain on all the training data and score the test set once:

```python
best_depth = min(cv_mae, key=cv_mae.get)
final_tree = DecisionTreeRegressor(max_depth=best_depth, random_state=42).fit(X_train, y_train)
print("Best depth:", best_depth)
print("Test MAE:", round(mean_absolute_error(y_test, final_tree.predict(X_test))))
```

```text
Best depth: 13
Test MAE: 1329910
```

## Walkthrough

1. Run both cells. Plot `cv_mae` as a line chart: the U shape is overfitting made visible.
2. Use `GridSearchCV` to tune `max_depth` and `min_samples_leaf` together:

```python norun
from sklearn.model_selection import GridSearchCV
grid = GridSearchCV(DecisionTreeRegressor(random_state=42),
                    {"max_depth": [9, 11, 13, 15], "min_samples_leaf": [1, 3, 5, 10]},
                    cv=folds, scoring="neg_mean_absolute_error")
grid.fit(X_train, y_train)
grid.best_params_, -grid.best_score_
```

3. Cross-validate the log-rent linear model the same way (on `np.log(y_train)`). Its errors are in log units, so compare models on the test set at the very end, in naira.
4. Record the final test score of your chosen model. That's the number you'd report.

## Practice

```answer
{
  "id": "ml-06-p1",
  "prompt": "Which **max_depth** has the lowest cross-validated MAE?",
  "answer": 13,
  "format": "number",
  "dataset": "rentals",
  "files": ["listings"],
  "pyVerify": "best_depth",
  "hint": "The depth with the smallest value in cv_mae.",
  "required": true
}
```

```answer
{
  "id": "ml-06-p2",
  "prompt": "What is the cross-validated MAE at that depth? (A rounded figure is fine.)",
  "answer": 1441609,
  "format": "naira",
  "dataset": "rentals",
  "files": ["listings"],
  "pyVerify": "round(cv_mae[best_depth])",
  "hint": "cv_mae[best_depth].",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why shouldn't you choose a tree's depth by its test-set error?",
    "options": ["It takes too long", "The test set then influences the model, so its score is no longer an honest estimate for new data", "Depth can't be tuned", "Test sets are too small"],
    "answer": 1,
    "explanation": "Use cross-validation on the training data to tune; use the test set once."
  },
  {
    "prompt": "In 5-fold cross-validation, how many times is each training row used for measuring error?",
    "options": ["Never", "Once", "Five times", "Four times"],
    "answer": 1,
    "explanation": "Each fold is held out exactly once."
  },
  {
    "prompt": "Why is scoring='neg_mean_absolute_error' negative?",
    "options": ["A bug", "scikit-learn treats higher scores as better, so error measures are made negative", "MAE is always negative", "To confuse beginners"],
    "answer": 1,
    "explanation": "Multiply by −1 to read it as an error."
  }
]
```
