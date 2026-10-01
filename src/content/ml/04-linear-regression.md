---
title: Linear regression
minutes: 30
summary: Fit your first model, measure it against the baseline, discover why predicting the log of the target works far better for prices, and read the model's coefficients as business facts.
---

## The problem

The property company wants more than a number. Landlords ask: "How much more could I charge if I made the flat serviced? Is 24-hour power worth it?" A model that predicts rent well is useful; a model that also explains **what drives rent** is far more useful, because it answers those questions too.

**Linear regression** does both. It's the oldest and simplest machine learning model, and still one of the most used, precisely because you can read it. This lesson fits one, finds an important flaw, and fixes it with one line of code.

## The concept

**What linear regression learns**

It predicts the target as a weighted sum of the features:

> rent ≈ intercept + w₁ × bedrooms + w₂ × size + w₃ × serviced + w₄ × (is it in Ikoyi?) + …

Training finds the weights (the **coefficients**) that make the predictions as close as possible to the real rents in the training data.

**The flaw: prices multiply, they don't add**

A linear model says being serviced adds a fixed amount, say ₦1.5m, everywhere. But in reality it adds a **percentage**: about the same proportion in Kubwa as in Ikoyi, so many more naira in Ikoyi. Prices, salaries and sales usually behave like this.

**The fix: model the log of the target**

Train on `np.log(rent)` and convert predictions back with `np.exp`. On the log scale, percentage effects become additive, which is exactly what a linear model can learn. A coefficient `c` then means: this feature multiplies rent by `exp(c)`, a change of `(exp(c) − 1) × 100` percent.

**Reading the error**

Use the same test set and the same measure (MAE) as the baselines, so the comparison is fair. Add R² to see how much of the variation the model explains.

## Example

The setup, then a plain linear regression:

```python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
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

plain = LinearRegression().fit(X_train, y_train)
pred = plain.predict(X_test)
print("Plain linear MAE:", round(mean_absolute_error(y_test, pred)), " R²:", round(r2_score(y_test, pred), 3))
```

```text
Plain linear MAE: 2216317  R²: 0.759
```

Better than the area baseline (₦2.87m), but only a little. Now the same model on the log of rent:

```python
log_model = LinearRegression().fit(X_train, np.log(y_train))
pred_log = np.exp(log_model.predict(X_test))
print("Log-rent linear MAE:", round(mean_absolute_error(y_test, pred_log)), " R²:", round(r2_score(y_test, pred_log), 3))
```

```text
Log-rent linear MAE: 827735  R²: 0.934
```

The error falls by almost two-thirds. Same features, same model, one transformation. And now the coefficients answer the landlords' questions:

```python
effect = (np.exp(pd.Series(log_model.coef_, index=X.columns)) - 1) * 100
effect[["serviced_Yes", "furnished_Yes", "power_Prepaid meter", "bedrooms"]].round(1)
```

```text
serviced_Yes           29.4
furnished_Yes          19.3
power_Prepaid meter    -8.9
bedrooms               24.3
dtype: float64
```

Read them as: a serviced flat rents for about 29% more than a similar unserviced one; furnished adds about 19%; a flat with only a prepaid meter rents for about 9% less than one with 24-hour power (the reference category); each extra bedroom adds about 24%, holding the other features constant.

## Walkthrough

1. Run the cells. Compare both models' MAE with your baselines from lesson 3.
2. Plot predicted against actual rent for the log model (`plt.scatter(y_test, pred_log)`), with log scales on both axes. The points should lie close to a diagonal line.
3. Look at the area coefficients: `effect.filter(like="area_").sort_values()`. They're relative to Ajah, the reference area.
4. Find a listing in the test set with a large error. Can you see why the model got it wrong?
5. Write down the log model's MAE: it's the number to beat in lesson 5.

## Practice

```answer
{
  "id": "ml-04-p1",
  "prompt": "What is the test **MAE** of the **log-rent** linear model? (A rounded figure is fine.)",
  "answer": 827735,
  "format": "naira",
  "dataset": "rentals",
  "files": ["listings"],
  "pyVerify": "round(mean_absolute_error(y_test, pred_log))",
  "hint": "The cell that fits LinearRegression on np.log(y_train).",
  "required": true
}
```

```answer
{
  "id": "ml-04-p2",
  "prompt": "According to the log model, by what percentage does being **serviced** increase rent, all else equal? One decimal place.",
  "answer": 29.4,
  "format": "percent",
  "dataset": "rentals",
  "files": ["listings"],
  "pyVerify": "round(effect['serviced_Yes'], 1)",
  "hint": "(exp(coefficient) − 1) × 100 for serviced_Yes.",
  "required": true
}
```

```task
{
  "id": "ml-04-t1",
  "prompt": "A landlord in Gwarinpa asks: *\"If I make my 3-bedroom flat serviced and furnished, how much more could I charge?\"* Write a short answer (40 to 120 words) using the model's coefficients, with the **percentages**, a sensible **caveat** about what the model can't tell you, and **no** promise of an exact figure.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Similar flats that are serviced rent for about ...",
  "rules": [
    { "label": "Uses the serviced and furnished percentages", "pattern": "(29|30)\\s*%[\\s\\S]*(19|18|20)\\s*%|(19|18|20)\\s*%[\\s\\S]*(29|30)\\s*%" },
    { "label": "Includes a caveat (on average, similar flats, doesn't account for, cost, depends)", "pattern": "on average|similar|doesn'?t (account|include|know)|depends|cost|estimate|not guaranteed" },
    { "label": "No exact promise (guarantee, definitely, will get)", "pattern": "guarantee|definitely|you will get|certainly", "absent": true },
    { "label": "Between 40 and 120 words", "minWords": 40, "maxWords": 120 }
  ],
  "sample": "Across similar listings, serviced flats rent for about 29% more and furnished ones about 19% more, so together roughly 50% more than an otherwise similar unserviced, unfurnished flat (the effects multiply: 1.29 × 1.19 ≈ 1.54). That's an average across listings, not a promise for your flat: it doesn't account for the cost of providing the service and furniture, the quality of the finish, or how quickly a higher-priced flat will let in Gwarinpa. Treat it as a starting point for setting the asking rent.",
  "note": "The multiplication point (29% and 19% together make about 54%, not 48%) follows straight from the log model, and it's the kind of detail that shows you understand what the model says.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why does modelling log(rent) work better than modelling rent directly?",
    "options": ["Logs are smaller numbers", "Features change rent by a percentage, which becomes additive on the log scale, matching what a linear model can learn", "It removes outliers", "It's required by scikit-learn"],
    "answer": 1,
    "explanation": "Multiplicative effects become additive after a log."
  },
  {
    "prompt": "In a log model, a coefficient of 0.26 for serviced means:",
    "options": ["Serviced adds ₦0.26m", "Serviced multiplies rent by exp(0.26) ≈ 1.30, about 30% more", "Serviced explains 26% of rent", "Nothing useful"],
    "answer": 1,
    "explanation": "exp(c) − 1 gives the percentage effect."
  },
  {
    "prompt": "Coefficients in a model with 'all else equal' mean:",
    "options": ["Causal effects you can rely on", "The average difference between listings that differ only in that feature, in this data", "Exact prices", "Nothing"],
    "answer": 1,
    "explanation": "They're associations in the data, useful but not guaranteed causes."
  }
]
```
