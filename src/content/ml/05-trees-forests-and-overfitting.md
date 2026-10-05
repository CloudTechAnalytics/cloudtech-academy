---
title: Trees, forests and overfitting
minutes: 30
summary: Fit decision trees and random forests, watch a model memorise its training data, control overfitting, and learn why the most complex model isn't always the best one.
---

## The problem

Linear regression assumes every feature adds (or, on the log scale, multiplies) its effect in the same way everywhere. Real life has interactions: 24-hour power may matter more in a Lekki duplex than in an Ikorodu self-contain. **Decision trees** and **random forests** learn such interactions on their own, and in many competitions they beat linear models easily.

But they bring a new danger. A tree can grow until it has a rule for every single training listing, memorising the data instead of learning from it. That's **overfitting**, and it's the most important idea in machine learning.

## The concept

### Decision trees

A decision tree asks a sequence of yes/no questions ("Is it in Ikoyi?", "Is the size over 120 m²?") and predicts the average rent of the training listings that end up in each final group (**leaf**). It handles interactions and doesn't need log transforms or scaling.

### Overfitting and underfitting

| | Training error | Test error | Cause |
| :-- | :-- | :-- | :-- |
| **Underfitting** | high | high | model too simple to capture the pattern |
| **Good fit** | low | low, close to training | model captures the pattern, not the noise |
| **Overfitting** | very low | much higher | model memorised the training data, noise included |

The tell-tale sign of overfitting is a big **gap** between training and test error. Control it by limiting the tree: `max_depth` (how many questions deep), or `min_samples_leaf` (smallest group allowed).

![Two curves against model complexity: training error falls steadily; test error falls to a minimum, then rises. The gap between them at high complexity is marked as overfitting.](/images/courses/ml/overfitting.svg "Underfitting on the left, overfitting on the right. The gap between the lines is the warning sign.")

### Random forests

A random forest grows hundreds of trees, each on a random sample of the rows and features, and averages their predictions. Individual trees overfit in different ways; averaging cancels much of it out. Forests are among the most reliable general-purpose models.

### Feature importance

Forests report how much each feature contributed to their splits. It's a useful first look at what matters, but it favours features with many distinct values (like size). Lesson 9 shows a more reliable method.

## Example

The setup is the same as in lesson 4. First, a tree with no limits:

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

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

for depth in [None, 4, 8, 12]:
    tree = DecisionTreeRegressor(max_depth=depth, random_state=42).fit(X_train, y_train)
    train_mae = mean_absolute_error(y_train, tree.predict(X_train))
    test_mae = mean_absolute_error(y_test, tree.predict(X_test))
    print(f"max_depth={depth}: train MAE {train_mae:,.0f}   test MAE {test_mae:,.0f}")
```

```text
max_depth=None: train MAE 209   test MAE 1,357,411
max_depth=4: train MAE 2,687,441   test MAE 2,873,049
max_depth=8: train MAE 1,113,828   test MAE 1,642,545
max_depth=12: train MAE 416,389   test MAE 1,332,464
```

The unlimited tree has a training error of a few hundred naira: it has memorised the training listings. Its test error is over ₦1.3m. A depth of 4 underfits (both errors are high); somewhere in between is better. Now a random forest:

```python
forest = RandomForestRegressor(n_estimators=300, random_state=42, n_jobs=-1).fit(X_train, y_train)
forest_pred = forest.predict(X_test)
print("Random forest MAE:", round(mean_absolute_error(y_test, forest_pred)), " R²:", round(r2_score(y_test, forest_pred), 3))
pd.Series(forest.feature_importances_, index=X.columns).sort_values(ascending=False).head(5).round(3)
```

```text
Random forest MAE: 964479  R²: 0.912
size_sqm                0.243
area_Ikoyi              0.176
area_Victoria Island    0.103
serviced_Yes            0.102
area_Lekki Phase 1      0.091
dtype: float64
```

The forest beats every single tree. But compare it with lesson 4: the **log-rent linear model** had an MAE of about ₦0.83m, better than the forest. With the right transformation, the simple, explainable model wins. That isn't always true, which is exactly why you compare.

## Walkthrough

1. Run both cells. Note the gap between training and test error for each tree depth.
2. Try `min_samples_leaf=10` instead of `max_depth`. Does it close the gap?
3. Try the forest on `np.log(y_train)`, converting predictions back with `np.exp`. Does the log trick help the forest too?
4. Make a table of every model so far: baselines, plain linear, log linear, best tree, forest. Which would you recommend, and why?

## Practice

```answer
{
  "id": "ml-05-p1",
  "prompt": "What is the **test MAE** of the decision tree with **no depth limit** (max_depth=None)? (A rounded figure is fine.)",
  "answer": 1357411,
  "format": "naira",
  "dataset": "rentals",
  "files": ["listings"],
  "pyVerify": "round(mean_absolute_error(y_test, DecisionTreeRegressor(random_state=42).fit(X_train, y_train).predict(X_test)))",
  "hint": "The first line of the loop's output.",
  "required": true
}
```

```answer
{
  "id": "ml-05-p2",
  "prompt": "Which feature does the random forest rank as **most important**? Type the column name.",
  "answer": "size_sqm",
  "accept": ["size", "size sqm"],
  "format": "text",
  "dataset": "rentals",
  "files": ["listings"],
  "pyVerify": "pd.Series(forest.feature_importances_, index=X.columns).idxmax()",
  "hint": "The top row of the importance list.",
  "explanation": "Size, but be careful: impurity-based importance favours features with many distinct values. In the log model, location is the dominant driver. Lesson 9 shows a fairer way to measure importance.",
  "required": true
}
```

```task
{
  "id": "ml-05-t1",
  "prompt": "Write a **model comparison** for the property company's head of product: a table or list of at least **four** models with their test MAE, then a **recommendation** with two reasons. Mention **overfitting** at least once.",
  "minutes": 8,
  "rows": 10,
  "placeholder": "- Area-median baseline: MAE ₦2.87m\n- ...\nRecommendation: ...",
  "rules": [
    { "label": "At least four models, each with an MAE", "pattern": "^[^\\n]*(baseline|linear|tree|forest)[^\\n]*\\d", "min": 4 },
    { "label": "A recommendation line", "pattern": "recommend" },
    { "label": "Mentions overfitting", "pattern": "overfit" },
    { "label": "Gives reasons (because, since, easier, explain)", "pattern": "because|since|easier|explain|simpler|faster", "min": 2 }
  ],
  "sample": "- Area-median baseline: MAE ₦2.87m\n- Plain linear regression: MAE ₦2.22m\n- Decision tree, no limit: MAE ₦1.36m (overfits: training error is almost zero)\n- Random forest (300 trees): MAE ₦0.96m\n- Linear regression on log rent: MAE ₦0.83m\nRecommendation: use the log-rent linear model, because it has the lowest test error and because its coefficients can be explained to landlords as percentages (serviced +29%, furnished +19%). It's also simpler to run and check than a forest.",
  "note": "\"The forest is more advanced\" isn't a reason. The best model is the one that predicts best on unseen data and that the business can trust and explain.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A model has a training MAE of ₦1,000 and a test MAE of ₦1.4m. What's happening?",
    "options": ["Underfitting", "Overfitting: it memorised the training data", "A perfect model", "A bug in MAE"],
    "answer": 1,
    "explanation": "A huge gap between training and test error is the sign of overfitting."
  },
  {
    "prompt": "Why does a random forest usually overfit less than one deep tree?",
    "options": ["It uses fewer features", "It averages many trees trained on different samples, so their individual errors partly cancel out", "It's linear", "It ignores the training data"],
    "answer": 1,
    "explanation": "Averaging reduces variance."
  },
  {
    "prompt": "The log-linear model beats the forest. What's the lesson?",
    "options": ["Forests are bad", "More complex isn't automatically better; compare models on the same test data", "Always use linear models", "The test set is wrong"],
    "answer": 1,
    "explanation": "Let the test results decide, and value explainability."
  }
]
```
