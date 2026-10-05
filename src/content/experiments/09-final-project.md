---
title: "Final project: Paystream's experiment review"
minutes: 20
summary: Plan your final project, a full review of Paystream's four experiments and a design for the next one, and start by checking every test before trusting any result.
---

## The problem

Paystream's leadership wants a review of the quarter's experiments before it makes three decisions: whether to roll out the new signup flow, whether to raise the transfer fee, and whether to expand cash-out agents to more states. It also wants to know whether the banner result the marketing team keeps quoting can be trusted.

Your final project is that review, plus a properly designed next experiment. The first step in any review is the one people skip: check that each test is sound before reading its results.

## The concept

### A review checklist for every experiment

| Check | Question |
| :-- | :-- |
| **Design** | Was there one primary metric, an MDE and a planned sample size? |
| **Randomisation** | Does the split match the plan (sample ratio mismatch)? Are the groups balanced? |
| **Duration** | Whole weeks? Long enough for the guardrails? Any novelty? |
| **Analysis** | Effect with a confidence interval, not just a p-value? Skewed metrics handled? |
| **Segments** | Planned, with a mechanism, and corrected for multiple comparisons? |
| **Decision** | Guardrails valued? Next step clear? |

### What each test can support

- **Onboarding**: a clean randomised test with a clear effect. Ready to decide.
- **Banner**: broken split and a novelty effect. Not trustworthy; rerun.
- **Fee**: clean, but a trade-off with an uncertain long-run cost. Needs a follow-up test.
- **Agents**: not randomised; difference-in-differences with a plausible parallel-trends check. Reasonable evidence, to be confirmed by the next rollout.

## Example

The quick health check across the user-level tests:

```python
import pandas as pd
from scipy import stats

base = "https://academy.cloudtechanalytics.com/datasets/experiments/"
onboarding = pd.read_csv(base + "onboarding.csv")
fee = pd.read_csv(base + "fee_test.csv")
banner = pd.read_csv(base + "banner_daily.csv")

checks = {
    "onboarding": onboarding["variant"].value_counts(),
    "fee": fee["variant"].value_counts(),
    "banner": banner.groupby("variant")["users"].sum(),
}
for name, counts in checks.items():
    print(f"{name:11s} split {counts.to_dict()}  SRM p-value {stats.chisquare(counts).pvalue:.3g}")
```

```text
onboarding  split {'B': 6054, 'A': 5946}  SRM p-value 0.324
fee         split {'Control': 4025, 'Higher fee': 3975}  SRM p-value 0.576
banner      split {'A': 110094, 'B': 104210}  SRM p-value 5.18e-37
```

Only the banner test fails. Everything else in your review can build on the other three.

## Walkthrough

1. Run the health check, then work through the checklist for each experiment.
2. Write a one-paragraph verdict per experiment: trustworthy or not, what it shows, and the decision.
3. Design the follow-up fee test: variants, primary metric, guardrails, MDE, sample size and duration.
4. Open the project brief on the course page and plan the write-up.

## Practice

```dataset
{"dataset": "experiments", "files": ["onboarding", "banner_daily", "fee_test", "rollout"]}
```

```answer
{
  "id": "ab-09-p1",
  "prompt": "What is the SRM p-value for the **fee** test? Two decimal places.",
  "answer": 0.58,
  "format": "number",
  "tolerance": 0.006,
  "dataset": "experiments",
  "files": ["fee_test"],
  "pyVerify": "round(stats.chisquare(fee['variant'].value_counts()).pvalue, 2)",
  "hint": "The fee line of the output.",
  "required": true
}
```

```task
{
  "id": "ab-09-t1",
  "prompt": "Write a **verdict** for each of the four experiments, one line each in the form **Experiment | trustworthy? | what it shows | decision**.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Onboarding | yes | ... | roll out",
  "rules": [
    { "label": "Four lines in the form Experiment | trustworthy | shows | decision", "pattern": "^[^|\\n]+\\|[^|\\n]+\\|[^|\\n]+\\|[^|\\n]+$", "min": 4 },
    { "label": "The banner test is marked untrustworthy", "pattern": "banner[^|\\n]*\\|\\s*(no|not)" },
    { "label": "Mentions the sample ratio mismatch or novelty for the banner", "pattern": "mismatch|srm|split|novelty" },
    { "label": "The fee decision is a follow-up test, not a straight rollout", "pattern": "fee[^\\n]*(test|smaller|₦\\s*(15|20)|longer)" }
  ],
  "sample": "Onboarding | yes | KYC completion up 4.5 points (95% CI 2.7 to 6.2), mostly on Android | roll out to all users\nBanner | no | broken split (SRM p near zero) and a first-week novelty effect | fix the randomiser and rerun for four weeks\nFee | yes | revenue per user more than doubled, but transfers fell 14% and day-28 activity 3.4 points | test ₦15 and ₦20 for eight weeks with retention as the guardrail\nAgents | partly (not randomised) | about +8% weekly active users by difference-in-differences, with parallel pre-trends | expand gradually, choosing new states at random so the effect can be confirmed",
  "note": "\"Partly\" for the agents is the honest answer: good evidence, not proof. Saying so is what makes the rest of the review credible.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What should be the first step in reviewing any experiment?",
    "options": ["Read the p-value", "Check the design and randomisation, such as sample ratio mismatch, before trusting results", "Look at segments", "Calculate revenue"],
    "answer": 1,
    "explanation": "A broken test gives confident wrong answers."
  },
  {
    "prompt": "A clean test shows a primary win and a guardrail loss. What's the right verdict?",
    "options": ["Ship it", "A trade-off: value both sides and usually test a smaller change", "Discard it", "Ignore the guardrail"],
    "answer": 1,
    "explanation": "Guardrails turn wins into decisions."
  },
  {
    "prompt": "How strong is evidence from a difference-in-differences with parallel pre-trends?",
    "options": ["As strong as a randomised test", "Reasonable but not proof; confirm with a randomised or staggered rollout", "Worthless", "Stronger than an A/B test"],
    "answer": 1,
    "explanation": "Be honest about the strength of each kind of evidence."
  }
]
```
