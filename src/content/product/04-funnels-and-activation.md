---
title: Funnels and activation
minutes: 15
summary: Measure where new users drop out with a funnel, compare steps and segments, find the activation moment that predicts staying, and size the opportunity of fixing the worst step.
---

## The problem

Interviews and feedback both pointed at verification. But how much does it really cost Paystream? Is it a problem for everyone, or for a few? And if it were fixed, how many more people would become active users? A funnel answers all three with what users actually did, not what they said.

## The concept

**A funnel**

The steps a new user takes to get value, in order, with the share who reach each one. Paystream's onboarding funnel: phone verified → BVN verified → first deposit → first transfer.

**Step conversion**

The share of users at one step who reach the next. The step with the lowest conversion (and the most users lost) is where to look first.

**Activation**

The moment a new user first gets the product's value. For a wallet, the **first transfer**: users who make one are far more likely to keep using the app (lesson 5).

**Segments and channels**

Break every funnel down. An average can hide a step that works for most users and fails badly for one segment.

## Example

The overall funnel:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/product/"
users = pd.read_csv(base + "users.csv")
steps = ["phone_verified", "bvn_verified", "first_deposit", "first_transfer"]

reached = users[steps].sum()
funnel = pd.DataFrame({"users": [len(users)] + reached.tolist()}, index=["signed up"] + steps)
funnel["share_of_signups"] = (funnel["users"] / len(users) * 100).round(1)
funnel["step_conversion"] = (funnel["users"] / funnel["users"].shift(1) * 100).round(1)
funnel["lost_at_step"] = funnel["users"].shift(1) - funnel["users"]
funnel
```

```text
users  share_of_signups  step_conversion  lost_at_step
signed up        8000             100.0              NaN           NaN
phone_verified   7353              91.9             91.9         647.0
bvn_verified     5021              62.8             68.3        2332.0
first_deposit    4039              50.5             80.4         982.0
first_transfer   3422              42.8             84.7         617.0
```

BVN verification loses the most users by far. Now by segment and by sign-up channel:

```python
verified_phone = users[users["phone_verified"] == 1]
print((verified_phone.groupby("segment")["bvn_verified"].mean() * 100).round(1).sort_values().to_string())
print()
print((verified_phone.groupby("channel")["bvn_verified"].mean() * 100).round(1).sort_values().to_string())
```

```text
segment
Market trader     57.3
Student           62.6
Small business    76.4
Salary earner     80.4

channel
Instagram ad         59.8
Play Store search    64.4
Referral             73.1
Agent sign-up        76.1
```

Market traders fail verification far more often than other segments, and users who signed up with an agent's help pass far more often than those from Instagram ads. That's evidence for backlog item B01, verification help at agents. How big is the prize if traders verified as often as salary earners, and the rest of their funnel stayed the same?

```python
traders = verified_phone[verified_phone["segment"] == "Market trader"]
salary_rate = verified_phone[verified_phone["segment"] == "Salary earner"]["bvn_verified"].mean()
extra_verified = len(traders) * (salary_rate - traders["bvn_verified"].mean())
transfer_given_bvn = traders.loc[traders["bvn_verified"] == 1, "first_transfer"].mean()
print(f"Extra traders verified over 8 weeks: {extra_verified:.0f}")
print(f"Extra traders making a first transfer: {extra_verified * transfer_given_bvn:.0f}")
```

```text
Extra traders verified over 8 weeks: 592
Extra traders making a first transfer: 410
```

Hundreds of extra active traders in eight weeks, from fixing one step for one segment. That's the kind of number a prioritisation needs (lesson 6).

## Walkthrough

1. Run the cells. Which segment converts worst from first deposit to first transfer?
2. Compare the funnel for signup weeks 1 to 4 with weeks 5 to 8. Is anything changing?
3. Why might agent sign-ups verify more often? Name two possible reasons.
4. Calculate the prize of raising Instagram sign-ups to the referral verification rate.

## Practice

```answer
{
  "id": "pdm-04-p1",
  "prompt": "What share of **market traders** who verified their phone also verified their **BVN**? As a percentage, one decimal place.",
  "answer": 57.3,
  "format": "percent",
  "dataset": "product",
  "files": ["users"],
  "pyVerify": "round(verified_phone[verified_phone['segment'] == 'Market trader']['bvn_verified'].mean() * 100, 1)",
  "hint": "The Market trader line of the segment breakdown.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is activation?",
    "options": ["Installing the app", "The moment a new user first gets the product's value, such as a first transfer", "Signing up", "Opening an email"],
    "answer": 1,
    "explanation": "The step that predicts staying."
  },
  {
    "prompt": "Why break a funnel down by segment?",
    "options": ["It looks thorough", "An average can hide a step that fails badly for one group", "To make charts", "Funnels require it"],
    "answer": 1,
    "explanation": "Find who the step fails."
  },
  {
    "prompt": "Which step should usually be investigated first?",
    "options": ["The first", "The one that loses the most users", "The last", "The cheapest"],
    "answer": 1,
    "explanation": "Biggest loss, biggest opportunity."
  }
]
```
