---
title: Comparing releases
minutes: 25
summary: Compare candidate releases with the live one on the same cases, count what each fixed and broke, test whether the difference is real, and find the regressions an overall score hides.
---

## The problem

Two candidate releases are ready:

- **r2** changes the prompt, to give more complete answers;
- **r3** moves to a smaller model, which is faster and cheaper.

Both ran on the same 400 cases as the live release, r1. r2's overall score is higher. The product manager wants to ship it this week. Before anyone does, the question is: higher by enough to be real, and higher **everywhere that matters**?

## The concept

### Paired comparison

Because every release runs on the same cases, compare them case by case:

| | r2 passes | r2 fails |
| :-- | :-- | :-- |
| **r1 passes** | both fine | **broke** |
| **r1 fails** | **fixed** | both fail |

Only the **fixed** and **broke** cases tell you anything about the difference.

![A two-by-two grid of release 1 against release 2, pass or fail. Both pass and both fail are greyed out; release 2 broke and release 2 fixed are highlighted.](/images/courses/llmops/paired.svg "Compare releases case by case. Only fixes and breaks carry information.")

### Is the difference real?

If the two releases were equally good, each changed case would be equally likely to be a fix or a break, like a coin toss. **McNemar's test** checks that: an exact binomial test on the fixed and broke counts. A small p-value (below 0.05) suggests a real difference.

### Look inside the total

An overall improvement can hide a regression in one category. For a high-stakes category, even a few broken cases matter, and with only 50 cases, you should look at exactly which ones broke.

## Example

```python
import pandas as pd
from scipy import stats

base = "https://academy.cloudtechanalytics.com/datasets/llmops/"
cases = pd.read_csv(base + "eval_cases.csv")
results = pd.read_csv(base + "eval_results.csv").merge(cases, on="case_id")
wide = results.pivot(index="case_id", columns="release", values="passed")

print(results.groupby("release")["passed"].mean().round(3))
for candidate in ["r2-new-prompt", "r3-small-model"]:
    fixed = int(((wide["r1-live"] == 0) & (wide[candidate] == 1)).sum())
    broke = int(((wide["r1-live"] == 1) & (wide[candidate] == 0)).sum())
    p = stats.binomtest(fixed, fixed + broke, 0.5).pvalue
    print(f"{candidate}: fixed {fixed}, broke {broke}, McNemar p = {p:.3f}")
```

```text
release
r1-live           0.918
r2-new-prompt     0.932
r3-small-model    0.885
Name: passed, dtype: float64
r2-new-prompt: fixed 12, broke 6, McNemar p = 0.238
r3-small-model: fixed 1, broke 14, McNemar p = 0.001
```

r2's overall gain is a handful of cases, and the test can't rule out chance. r3's loss is clearer. Now by category:

```python
by_cat = results.pivot_table(index="category", columns="release", values="passed").round(2)
by_cat["r2 change"] = by_cat["r2-new-prompt"] - by_cat["r1-live"]
by_cat.sort_values("r2 change")
```

```text
release         r1-live  r2-new-prompt  r3-small-model  r2 change
category
Fraud              0.90           0.78            0.86      -0.12
Cards              0.93           0.93            0.93       0.00
Fees               1.00           1.00            0.95       0.00
Account access     0.90           0.92            0.90       0.02
Out of scope       0.93           0.97            0.87       0.04
Safety             0.93           0.97            0.83       0.04
Transfers          0.92           0.98            0.90       0.06
Savings            0.87           0.93            0.90       0.06
Verification       0.87           0.93            0.80       0.06
```

r2 improves most categories a little, and makes fraud clearly worse. Look at the fraud cases it broke:

```python
fraud_broken = wide[(wide["r1-live"] == 1) & (wide["r2-new-prompt"] == 0)].index
cases[cases["case_id"].isin(fraud_broken) & (cases["category"] == "Fraud")][["case_id", "difficulty", "input"]]
```

```text
case_id difficulty                                      input
263   EV264       easy           Someone called asking for my OTP
264   EV265     medium              I think my account was hacked
273   EV274       easy  There's a debit of ₦120,000 I didn't make
275   EV276       easy           Someone called asking for my OTP
282   EV283       hard              I think my account was hacked
308   EV309       easy                 I gave my code to a caller
```

Every case r2 broke is a fraud case: customers reporting scam calls and missing money. The next step is to read r2's answers to them. A likely cause is the new prompt's push for "more complete answers", if it makes the assistant explain at length instead of telling the customer to freeze their account and handing over. Either way, it's a regression the overall score turned into an improvement.

## Walkthrough

1. Run the cells. Run McNemar's test on the fraud cases alone. With so few cases, what can and can't you conclude?
2. Compare r3 and r1 by category. Where does the smaller model lose most?
3. Compare latency and tokens by release (`results.groupby("release")[["latency_ms", "input_tokens"]].mean()`).
4. Write the release note for the product manager (the task below).

## Practice

```answer
{
  "id": "ops-03-p1",
  "prompt": "How many cases did **r2 break** (passed on r1, failed on r2)?",
  "answer": 6,
  "format": "number",
  "dataset": "llmops",
  "files": ["eval_cases", "eval_results"],
  "pyVerify": "int(((wide['r1-live'] == 1) & (wide['r2-new-prompt'] == 0)).sum())",
  "hint": "The broke count for r2.",
  "required": true
}
```

```answer
{
  "id": "ops-03-p2",
  "prompt": "What is r2's pass rate on **Fraud** cases? As a percentage, rounded to the nearest whole number.",
  "answer": 78,
  "format": "percent",
  "dataset": "llmops",
  "files": ["eval_cases", "eval_results"],
  "pyVerify": "round(by_cat.loc['Fraud', 'r2-new-prompt'] * 100)",
  "hint": "The Fraud row, r2 column.",
  "required": true
}
```

```task
{
  "id": "ops-03-t1",
  "prompt": "Write the **release note** for the product manager (50 to 130 words): whether r2 can ship, the **overall** comparison and whether it's **significant**, the **fraud** regression, and what must change before it ships.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "r2 should not ship yet ...",
  "rules": [
    { "label": "A clear ship or don't-ship decision", "pattern": "ship|release|hold|block" },
    { "label": "At least two figures", "pattern": "\\d+(\\.\\d+)?\\s*%|\\b\\d+ cases|p\\s*=", "min": 2 },
    { "label": "Mentions significance or chance", "pattern": "significan|chance|p\\s*=|mcnemar|noise" },
    { "label": "Mentions the fraud regression", "pattern": "fraud" },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "r2 should not ship yet. Overall it passes 93.2% of the suite against 91.8% for the live release, but that's 12 cases fixed and 6 broken, which McNemar's test can't distinguish from chance (p = 0.24). More importantly, it gets fraud cases wrong far more often: 78% against 90%. All 6 broken cases are fraud reports: customers describing scam calls and missing money. Before r2 ships, the prompt needs a rule that fraud reports always get the freeze instruction and a hand-over, and r2 must match r1 on every fraud case.",
  "note": "The decision comes first, then the evidence, then the condition for shipping. That's the order a product manager needs.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "In a paired comparison, which cases tell you about the difference between releases?",
    "options": ["Cases both pass", "Only the cases one fixed and the other broke", "Cases both fail", "All cases equally"],
    "answer": 1,
    "explanation": "Cases where both agree carry no information about the difference."
  },
  {
    "prompt": "A candidate fixes 12 cases and breaks 6. What does a McNemar p-value of 0.24 mean?",
    "options": ["It's definitely better", "A split this uneven happens fairly often by chance, so the gain isn't established", "It's worse", "The test failed"],
    "answer": 1,
    "explanation": "18 changed cases is a small sample."
  },
  {
    "prompt": "A release improves overall but breaks several fraud cases. What should happen?",
    "options": ["Ship it: the average went up", "Hold it and fix the regression, because fraud mistakes cost most", "Ship it to half the users", "Remove the fraud cases"],
    "answer": 1,
    "explanation": "High-stakes regressions block a release, whatever the average does."
  }
]
```
