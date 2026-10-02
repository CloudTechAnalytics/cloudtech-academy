---
title: Train, test and baselines
minutes: 15
summary: Hold back data the model never sees so you can measure it honestly, choose a sensible error measure, and set a baseline that any model must beat to be worth using.
---

## The problem

A colleague builds a rent model and reports that its average error is ₦0: it predicts every listing's rent exactly. It sounds perfect, and it's useless. The model was tested on the same listings it learned from, so it had simply memorised them. Ask it about a flat it hasn't seen and it may be badly wrong.

The only honest test of a model is on data it **didn't** learn from. And "₦800,000 average error" means nothing on its own: is that good? It depends on how well you could do **without** a model. That's what a baseline tells you.

## The concept

**Train and test sets**

Split the data before you do anything else with the model:

- The **training set** (usually 70–80%) is what the model learns from.
- The **test set** (the rest) is kept aside and used **once**, at the end, to measure performance.

`train_test_split` from scikit-learn shuffles the rows and splits them. Set `random_state` to a fixed number so the split, and therefore your results, are the same every time.

**Error measures for regression**

| Measure | What it is | Use when |
| :-- | :-- | :-- |
| **MAE** (mean absolute error) | average size of the error, in naira | you want an error people understand: "off by ₦800k on average" |
| **RMSE** (root mean squared error) | like MAE but punishes big errors more | big misses are especially costly |
| **R²** | share of the variation explained, from 0 to 1 | comparing models on the same data |

**Baselines**

A **baseline** is the best you can do without machine learning, using a simple rule:

- predict the **median** rent for every listing;
- or a slightly smarter rule: predict the median rent **for that area**.

A model is only useful if it clearly beats the baseline. If it doesn't, the extra complexity isn't worth it.

## Example

The setup from lesson 2, in one cell, so this notebook stands on its own:

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
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
```

Split, then score two baselines on the test set:

```python
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(len(X_train), "training rows,", len(X_test), "test rows")

median_guess = np.full(len(y_test), y_train.median())
print("Baseline 1 (overall median) MAE:", round(mean_absolute_error(y_test, median_guess)))

area_medians = y_train.groupby(rentals.loc[X_train.index, "area"]).median()
area_guess = rentals.loc[X_test.index, "area"].map(area_medians)
print("Baseline 2 (median for the area) MAE:", round(mean_absolute_error(y_test, area_guess)))
```

```text
1915 training rows, 479 test rows
Baseline 1 (overall median) MAE: 3857724
Baseline 2 (median for the area) MAE: 2871503
```

The area rule alone cuts the error of a single median by about a quarter, from ₦3.86m to ₦2.87m. That's the bar the models in the next lessons have to clear, and it's a high one: location really is most of the story in Lagos and Abuja rents. Notice that both baselines are calculated from the **training** data only. Using the test set to set a baseline would be a small leak.

## Walkthrough

1. Run the two cells above.
2. Change `random_state` to 1 and run the split again. The MAEs change a little. That's the natural variation of a test set; it's why you fix the seed when comparing models.
3. Try a third baseline: the median for the area **and** the number of bedrooms. Does it beat baseline 2?
4. Write down your best baseline MAE. Every model from now on gets compared with it.

## Practice

```answer
{
  "id": "ml-03-p1",
  "prompt": "How many listings are in the **test** set?",
  "answer": 479,
  "format": "number",
  "dataset": "rentals",
  "files": ["listings"],
  "pyVerify": "len(X_test)",
  "hint": "len(X_test) after the split.",
  "required": true
}
```

```answer
{
  "id": "ml-03-p2",
  "prompt": "What is the test-set **MAE** of baseline 2 (the median rent for the listing's area)? (A rounded figure is fine.)",
  "answer": 2871503,
  "format": "naira",
  "dataset": "rentals",
  "files": ["listings"],
  "pyVerify": "round(mean_absolute_error(y_test, area_guess))",
  "hint": "The second number printed by the cell above.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why test a model on data it didn't train on?",
    "options": ["It's faster", "A model can memorise its training data; only unseen data shows how it will perform on new cases", "Training data is always wrong", "To use less memory"],
    "answer": 1,
    "explanation": "The test set stands in for the future."
  },
  {
    "prompt": "A model's MAE is ₦1.2m and the area-median baseline's MAE is ₦1.3m. What should you conclude?",
    "options": ["The model is excellent", "It barely beats a simple rule, so its extra complexity may not be worth it", "The baseline is wrong", "MAE is the wrong measure"],
    "answer": 1,
    "explanation": "Always judge a model against a baseline."
  },
  {
    "prompt": "Why set random_state when splitting?",
    "options": ["To make the model more accurate", "So the split, and the results, are the same every time and models can be compared fairly", "It's required by scikit-learn", "To shuffle better"],
    "answer": 1,
    "explanation": "Reproducibility makes comparisons meaningful."
  }
]
```
