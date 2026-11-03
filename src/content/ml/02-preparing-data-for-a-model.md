---
title: Preparing data for a model
minutes: 30
summary: Separate features from the target, deal with missing values and outliers without fooling yourself, turn categories into numbers, and spot leakage before it ruins a model.
---

## The problem

A model learns whatever is in the data, including its mistakes. Six of the rental listings have a rent typed with an extra zero: a one-bedroom flat in Ajah at ₦20.5m a year. Leave them in and the model learns that some one-bedroom flats in Ajah cost ten times the others. 154 listings have no floor size, and scikit-learn models refuse to train on missing values. And `area`, the most important feature, is text, which a model can't use at all until it's converted.

Data preparation usually takes more time than modelling, and it decides most of the result. This lesson prepares the rental data properly, step by step, so every later lesson can build on it.

## The concept

### Features and target

Put the features in a table called `X` and the target in a column called `y`. Leave out anything that identifies a row (`listing_id`) or that you wouldn't know at the moment of prediction.

### Missing values

| Option | When |
| :-- | :-- |
| Drop the rows | very few are missing, and they're missing at random |
| Fill (impute) with a typical value | the column matters; use a group median (for size: the median for that property type and number of bedrooms) |
| Add a "was missing" flag | the fact that it's missing may itself be informative |

### Outliers: errors or real?

Compare each value with similar rows, not with the whole column. A ₦54m flat is normal in Ikoyi and impossible in Kubwa. Here, a listing whose rent is more than **4 times** the median for its area, type and bedrooms is a likely typo. Check a few by eye, remove the confirmed errors, and **write down the rule**.

### Categories to numbers: one-hot encoding

`pd.get_dummies` turns a text column into one 0/1 column per category (`area_Yaba`, `area_Ikoyi`, and so on). With `drop_first=True`, one category is left out as the reference, since it's implied when all the others are 0.

### Leakage: the silent killer

**Leakage** is information in the features that wouldn't be available when you make a real prediction, or that's derived from the target. A model with leakage scores brilliantly in testing and fails in use. Examples: "days in arrears" when predicting default (it's only known after default starts); "final sale price" when predicting the asking rent. Always ask of each feature: **would I know this at the moment I need the prediction?**

## Example

Load the data, find the likely typos, and remove them:

```python
import pandas as pd

rentals = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/rentals/listings.csv")

typical = rentals.groupby(["area", "property_type", "bedrooms"])["annual_rent_ngn"].transform("median")
suspect = rentals["annual_rent_ngn"] > 4 * typical
rentals.loc[suspect, ["listing_id", "area", "property_type", "bedrooms", "annual_rent_ngn"]]
```

```text
listing_id           area property_type  bedrooms  annual_rent_ngn
57     RL-00058          Kubwa     Mini flat         1          6500000
412    RL-00413        Gbagada          Flat         1         19000000
903    RL-00904           Ajah          Flat         1         20500000
1388   RL-01389  Lekki Phase 1        Duplex         3        275000000
1940   RL-01941        Ikorodu     Mini flat         1          6500000
2207   RL-02208  Lekki Phase 1          Flat         1         54000000
```

All six look like an extra zero: each is roughly ten times the typical rent for its kind of property. Remove them, then fill the missing sizes with the median for the same property type and number of bedrooms:

```python
rentals = rentals[~suspect].copy()
print("missing sizes before:", rentals["size_sqm"].isna().sum())
rentals["size_sqm"] = rentals["size_sqm"].fillna(
    rentals.groupby(["property_type", "bedrooms"])["size_sqm"].transform("median")
)
print("missing sizes after:", rentals["size_sqm"].isna().sum())
```

```text
missing sizes before: 154
missing sizes after: 0
```

Finally, build `X` and `y`, one-hot encoding the text columns:

```python
features = ["area", "property_type", "bedrooms", "bathrooms", "size_sqm", "serviced",
            "furnished", "power", "parking_spaces", "year_built"]
X = pd.get_dummies(rentals[features], drop_first=True, dtype=int)
y = rentals["annual_rent_ngn"]
print(X.shape)
list(X.columns[:8])
```

```text
(2394, 26)
['bedrooms', 'bathrooms', 'size_sqm', 'parking_spaces', 'year_built', 'area_Gbagada', 'area_Gwarinpa', 'area_Ikeja GRA']
```

## Walkthrough

1. Run the three cells above in a new Colab notebook.
2. Look at the six suspect listings. Would you remove all of them? Write down the rule you used.
3. Check how many sizes were missing and that none are left.
4. Look at `X.columns`: one column per area except the reference one (Ajah, first alphabetically), one per property type except one, and so on.
5. Go through the original columns and ask the leakage question for each. (`listed_date` is fine; a column like "rent agreed after negotiation" would not be.)

## Practice

```answer
{
  "id": "ml-02-p1",
  "prompt": "How many listings have no **size_sqm** in the original data?",
  "answer": 154,
  "format": "number",
  "dataset": "rentals",
  "files": ["listings"],
  "pyVerify": "int(pd.read_csv('https://academy.cloudtechanalytics.com/datasets/rentals/listings.csv')['size_sqm'].isna().sum())",
  "hint": "rentals['size_sqm'].isna().sum(), before removing anything.",
  "required": true
}
```

```answer
{
  "id": "ml-02-p2",
  "prompt": "After one-hot encoding with drop_first=True, how many **columns** does X have?",
  "answer": 26,
  "format": "number",
  "dataset": "rentals",
  "files": ["listings"],
  "pyVerify": "X.shape[1]",
  "hint": "X.shape gives (rows, columns).",
  "required": true
}
```

```task
{
  "id": "ml-02-t1",
  "prompt": "The loans dataset will be used to predict default **at the moment of applying**. For each of these possible features, say **keep** or **leakage** with a reason, one per line in the form **Feature | keep or leakage | reason**: monthly_revenue_ngn; previous_late_payments; months_in_arrears (a column the bank could add); loan_amount_ngn; recovered_amount_ngn (another possible column).",
  "minutes": 6,
  "rows": 6,
  "placeholder": "monthly_revenue_ngn | keep | ...",
  "rules": [
    { "label": "Five lines in the form Feature | keep or leakage | reason", "pattern": "^[^|\\n]+\\|\\s*(keep|leakage)\\s*\\|[^|\\n]+$", "min": 5 },
    { "label": "months_in_arrears is leakage", "pattern": "arrears[^|\\n]*\\|\\s*leakage" },
    { "label": "recovered_amount_ngn is leakage", "pattern": "recovered[^|\\n]*\\|\\s*leakage" },
    { "label": "previous_late_payments is kept (it's about earlier loans)", "pattern": "previous_late[^|\\n]*\\|\\s*keep" }
  ],
  "sample": "monthly_revenue_ngn | keep | collected on the application form\nprevious_late_payments | keep | from the borrower's earlier loans, known before this one\nmonths_in_arrears | leakage | only exists after the borrower has started missing payments on this loan\nloan_amount_ngn | keep | requested on the application\nrecovered_amount_ngn | leakage | only known after a default and recovery",
  "note": "Leakage hides in columns that are recorded later in the loan's life. The test is always about timing: would this value exist on the day of the application?",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A ₦54m one-bedroom flat appears in Lekki. How should you decide whether it's an error?",
    "options": ["Compare it with the whole dataset's average", "Compare it with similar listings (same area, type and bedrooms), check by eye, and write down the rule", "Delete every value over ₦50m", "Keep everything"],
    "answer": 1,
    "explanation": "Outliers are judged against similar rows."
  },
  {
    "prompt": "What does one-hot encoding do?",
    "options": ["Removes text columns", "Turns each category into its own 0/1 column", "Sorts categories alphabetically", "Fills missing values"],
    "answer": 1,
    "explanation": "Models need numbers; one-hot encoding gives one column per category."
  },
  {
    "prompt": "A default model scores 99% in testing using 'days in arrears' as a feature. What's the likely problem?",
    "options": ["Nothing, it's excellent", "Leakage: days in arrears is only known after default begins", "Too few features", "The test set is too big"],
    "answer": 1,
    "explanation": "Suspiciously good results usually mean leakage."
  }
]
```
