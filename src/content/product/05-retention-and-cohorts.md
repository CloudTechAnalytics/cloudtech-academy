---
title: Retention and cohorts
minutes: 15
summary: Measure whether users keep coming back with cohort retention tables, compare segments and activation, and recognise the difference between a product people try and one they keep using.
---

## The problem

Getting users to a first transfer is only half the job. A wallet that people use once and abandon is a leaky bucket: every naira spent on ads drains away. The CEO's "more users" only matters if users stay.

## The concept

### Cohorts

Group users by when they started (their **cohort**), then track what share are active in each week after they started. Comparing cohorts shows whether the product is improving over time; comparing segments shows who it works for.

### Reading a retention curve

- A curve that keeps falling towards zero: people try it and leave.
- A curve that **flattens**: a core of users has made it a habit. That flat level matters more than the first week.

### Right-censoring

Recent cohorts haven't had time to reach week 8. Only compare weeks every cohort has reached.

![A retention curve that flattens at a habit level next to one that keeps falling to zero, and a cohort table where recent cohorts have not yet reached later weeks](/images/courses/product/retention.svg "A curve that flattens means a habit; recent cohorts haven't reached later weeks yet.")

## Example

Weekly activity for users who made a deposit, by signup week:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/product/"
users = pd.read_csv(base + "users.csv")
activity = pd.read_csv(base + "activity.csv")

depositors = users[users["first_deposit"] == 1]
active = activity.merge(depositors[["user_id", "signup_week"]], on="user_id")
cohort_sizes = depositors.groupby("signup_week").size()
counts = active.pivot_table(index="signup_week", columns="week_since_signup", values="user_id", aggfunc="count")
retention = (counts.div(cohort_sizes, axis=0) * 100).round(0)
retention
```

```text
week_since_signup     1     2     3     4     5     6     7     8
signup_week
1                  68.0  64.0  64.0  56.0  52.0  50.0  46.0  38.0
2                  70.0  63.0  60.0  55.0  53.0  43.0  45.0  41.0
3                  68.0  64.0  60.0  52.0  53.0  46.0  39.0  41.0
4                  73.0  65.0  64.0  58.0  51.0  47.0  45.0  46.0
5                  71.0  64.0  62.0  55.0  52.0  45.0  41.0  44.0
6                  68.0  65.0  59.0  56.0  52.0  48.0  44.0   NaN
7                  71.0  65.0  59.0  56.0  56.0  47.0   NaN   NaN
8                  67.0  65.0  58.0  52.0  51.0   NaN   NaN   NaN
```

Each row is a cohort; each column a week since signup. The missing values bottom right are cohorts that haven't had time to reach that week yet. The rows look alike, so the product isn't getting better or worse for new users week by week. Now compare who stays:

```python
first_transfer = depositors.set_index("user_id")["first_transfer"]
week4 = set(activity.loc[activity["week_since_signup"] == 4, "user_id"])
eligible = depositors[depositors["signup_week"] <= 8]
eligible = eligible.assign(active_week_4=eligible["user_id"].isin(week4))
summary = eligible.groupby(["segment", "first_transfer"])["active_week_4"].mean().unstack() * 100
summary.columns = ["no first transfer", "made a first transfer"]
summary.round(1)
```

```text
no first transfer  made a first transfer
segment
Market trader                40.8                   68.5
Salary earner                32.4                   59.8
Small business               22.2                   61.0
Student                      13.3                   43.2
```

In every segment, users who made a first transfer are far more likely to be active in week 4: that's why it's the activation moment. Market traders who get that far are the most loyal of all; students drift away even when they activate. So fixing traders' verification (lesson 4) would bring in users who stay.

## Walkthrough

1. Run the cells. Plot the average retention curve. Does it flatten?
2. Which cohorts can you fairly compare at week 6?
3. Why might students drift away even after activating? What would you ask them?
4. Compute week-4 retention by channel. Do agent sign-ups stay longer?

## Practice

```answer
{
  "id": "pdm-05-p1",
  "prompt": "For **market traders** who **made a first transfer**, what share were active in **week 4**? As a percentage, one decimal place.",
  "answer": 68.5,
  "format": "percent",
  "dataset": "product",
  "files": ["users", "activity"],
  "pyVerify": "round(summary.loc['Market trader', 'made a first transfer'], 1)",
  "hint": "The Market trader row, made a first transfer column.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is a cohort?",
    "options": ["A segment", "A group of users who started in the same period", "A feature", "A survey"],
    "answer": 1,
    "explanation": "Cohorts let you compare like with like over time."
  },
  {
    "prompt": "Why is a flattening retention curve good news?",
    "options": ["It isn't", "It shows a core of users has made the product a habit", "It means growth", "It means fewer complaints"],
    "answer": 1,
    "explanation": "Products with no flat level leak everyone eventually."
  },
  {
    "prompt": "Why can't you compare the newest cohort's week 8 with older cohorts?",
    "options": ["It's too small", "It hasn't reached week 8 yet", "It's biased upwards", "You can"],
    "answer": 1,
    "explanation": "Right-censoring."
  }
]
```
