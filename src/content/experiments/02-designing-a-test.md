---
title: Designing a test
minutes: 25
summary: Write a hypothesis, choose one primary metric and the guardrails, set the smallest effect worth detecting, and calculate how many users and days the test needs before it starts.
---

## The problem

The product team is keen to test a new KYC reminder message. "Let's run it for a week and see," says the product manager. A week later the reminder group is 1.2 points ahead, with a p-value of 0.31. Did the reminder fail, or was the test just too small to tell? Nobody can say, and the week is gone.

Most failed experiments fail at the design stage: no clear metric, no idea what size of effect matters, and no calculation of how many users are needed to see it. Ten minutes of design saves weeks of inconclusive tests.

## The concept

**The hypothesis**

Write it before the test starts: *"Showing a KYC reminder on day 2 will increase 7-day KYC completion, because many users abandon at the ID-photo step."* It names the change, the metric, the direction and the reason.

**One primary metric, plus guardrails**

Choose **one** primary metric to decide the test. Others are secondary (to understand it) or guardrails (that mustn't get worse). Deciding with several metrics after the fact invites picking whichever one happens to look good.

**Minimum detectable effect (MDE)**

The smallest improvement worth acting on, a business judgement. If a 1-point rise in KYC wouldn't justify the work, there's no point designing a test to detect it.

**Significance, power and sample size**

- **Significance level (α)**, usually 5%: the false-alarm rate you accept (declaring an effect when there's none).
- **Power**, usually 80%: the chance of detecting the effect if it's really the size of your MDE.
- For a conversion metric with baseline rate p₁ and target p₂, users needed **per variant**:

> n = (z₁₋α/₂ + z_power)² × [p₁(1 − p₁) + p₂(1 − p₂)] ÷ (p₂ − p₁)²

with z₁₋α/₂ = 1.96 for α = 5% and z_power = 0.84 for 80% power.

**Duration**

Divide by the users you get per day, and round **up to whole weeks**, so every weekday and weekend is equally represented. Never stop early because results look good (lesson 3 shows why).

## Example

The reminder test: baseline KYC completion 38%, and the team decides a 3-point rise (to 41%) is the smallest worth acting on.

```python
from scipy import stats
import math

def sample_size_per_variant(p1, p2, alpha=0.05, power=0.80):
    z_alpha = stats.norm.ppf(1 - alpha / 2)
    z_power = stats.norm.ppf(power)
    variance = p1 * (1 - p1) + p2 * (1 - p2)
    return math.ceil((z_alpha + z_power) ** 2 * variance / (p2 - p1) ** 2)

n = sample_size_per_variant(0.38, 0.41)
print("Users needed per variant:", n)
```

```text
Users needed per variant: 4165
```

About 430 new users sign up per day, split between the two variants:

```python
users_per_day = 430
days = math.ceil(2 * n / users_per_day)
weeks = math.ceil(days / 7)
print("Days needed:", days, " so run for", weeks, "full weeks")
```

```text
Days needed: 20  so run for 3 full weeks
```

The week the product manager suggested would have had well under half the users needed. Halving the MDE to 1.5 points would need about four times as many users: small effects are expensive to detect.

## Walkthrough

1. Run the cells and check the sample size by hand with the formula.
2. Calculate the sample size for an MDE of 1.5 points and of 5 points. How does it scale?
3. Change power to 90%. How many more users?
4. Write the design for the reminder test (the task below).

## Practice

```answer
{
  "id": "ab-02-p1",
  "prompt": "How many users **per variant** does the reminder test need (baseline 38%, MDE 3 points, α 5%, power 80%)?",
  "answer": 4165,
  "format": "number",
  "dataset": "experiments",
  "files": ["onboarding"],
  "pyVerify": "n",
  "hint": "The first number printed.",
  "required": true
}
```

```answer
{
  "id": "ab-02-p2",
  "prompt": "How many users per variant would it need for an MDE of **1.5 points** (38% to 39.5%)?",
  "answer": 16556,
  "format": "number",
  "dataset": "experiments",
  "files": ["onboarding"],
  "pyVerify": "sample_size_per_variant(0.38, 0.395)",
  "hint": "sample_size_per_variant(0.38, 0.395).",
  "required": true
}
```

```task
{
  "id": "ab-02-t1",
  "prompt": "Write the **test design** for the KYC reminder, one line each starting **Hypothesis:**, **Primary metric:**, **Guardrails:**, **MDE:**, **Sample size:** and **Duration:**.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "Hypothesis: ...\nPrimary metric: ...",
  "rules": [
    { "label": "A Hypothesis line with a reason (because)", "pattern": "^\\s*[-*]?\\s*hypothesis\\s*:[^\\n]*because" },
    { "label": "A Primary metric line", "pattern": "^\\s*[-*]?\\s*primary metric\\s*:" },
    { "label": "A Guardrails line", "pattern": "^\\s*[-*]?\\s*guardrails?\\s*:" },
    { "label": "An MDE line with a number", "pattern": "^\\s*[-*]?\\s*mde\\s*:[^\\n]*\\d" },
    { "label": "A Sample size line with a number", "pattern": "^\\s*[-*]?\\s*sample size\\s*:[^\\n]*\\d" },
    { "label": "A Duration line in weeks", "pattern": "^\\s*[-*]?\\s*duration\\s*:[^\\n]*week" }
  ],
  "sample": "Hypothesis: showing a KYC reminder on day 2 will increase 7-day KYC completion, because many users abandon at the ID-photo step and forget to return.\nPrimary metric: share of new users who complete KYC within 7 days of signup.\nGuardrails: app uninstalls within 7 days, and support tickets about KYC per 1,000 users.\nMDE: 3 percentage points (38% to 41%), the smallest rise that would justify building the reminder properly.\nSample size: about 4,100 users per variant (α 5%, power 80%).\nDuration: 3 full weeks at about 430 signups a day, so every weekday is covered equally.",
  "note": "Writing this before the test starts is what makes the result trustworthy: the metric, the size that matters and the stopping point can't be changed after you've seen the data.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What happens to the required sample size if you halve the MDE?",
    "options": ["It halves", "It roughly quadruples", "It doubles", "No change"],
    "answer": 1,
    "explanation": "Sample size scales with 1 ÷ effect²."
  },
  {
    "prompt": "Why choose one primary metric before the test?",
    "options": ["It's simpler", "So you can't pick whichever of many metrics happens to look good afterwards", "Dashboards only show one", "It doesn't matter"],
    "answer": 1,
    "explanation": "Pre-registering the metric protects against cherry-picking."
  },
  {
    "prompt": "Why run a test for whole weeks?",
    "options": ["Tradition", "Behaviour differs by day of the week, so each day should be equally represented", "Tools require it", "To get more users"],
    "answer": 1,
    "explanation": "A test that runs Monday to Thursday misses weekend users."
  }
]
```
