---
title: Evaluating agents
minutes: 25
summary: Measure an agent on outcomes (did it take the right final action?) and on trajectories (did it get there safely?), break the results down by request type, and read the failures behind the numbers.
---

## The problem

"v2 is better" isn't a decision a head of support can sign off. They need to know: how often is it right? On which kinds of request does it fail? When it's wrong, is it wrong safely (handing over to a person) or dangerously (acting when it shouldn't)? And did it reach the right answer the right way, or by luck?

Agents need evaluation on two levels: the **outcome** and the **path**.

## The concept

### Outcome evaluation

Compare the agent's final action with the expected action on a labelled set of real requests. Report it:

- overall, and **by expected action** (fraud and refunds matter more than limit questions);
- with a **confusion table**: what the agent did instead, when it was wrong.

### Trajectory evaluation

Check the steps, not just the end:

- Did it **look before acting** (read the transfer before opening a case)?
- Did it call any **forbidden** tools?
- Did it touch data it shouldn't have?
- How many steps did it take?

A run can reach the right outcome by a dangerous path (opening a case without checking, which happened to be correct). Trajectory checks catch that.

### Safe and unsafe errors

An over-cautious hand-over to a person costs a little staff time. A wrong action (a refund, a case for someone else's transfer) can cost money or trust. Count them separately.

## Example

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/agents/"
requests = pd.read_csv(base + "requests.csv")
runs = pd.read_csv(base + "runs.csv")
steps = pd.read_csv(base + "steps.csv")

r = runs.merge(requests[["request_id", "expected_action"]], on="request_id")
r["correct"] = r["final_action"] == r["expected_action"]
print(r.groupby("version")["correct"].mean().round(3))
r.pivot_table(index="expected_action", columns="version", values="correct", aggfunc="mean").round(2)
```

```text
version
v1    0.693
v2    0.933
Name: correct, dtype: float64
version               v1    v2
expected_action
answer              0.54  0.96
ask_for_details     0.25  0.83
escalate_fraud      0.78  1.00
escalate_human      0.80  1.00
freeze_card         0.88  0.82
open_transfer_case  0.94  0.90
```

Now the confusion: when each version was wrong, what did it do instead?

```python
wrong = r[~r["correct"]]
pd.crosstab([wrong["version"], wrong["expected_action"]], wrong["final_action"])
```

```text
final_action                answer  escalate_human  freeze_card  issue_refund  none  open_transfer_case
version expected_action
v1      answer                   0               0            3             1     0                  22
        ask_for_details          2               0            0             0     3                   4
        escalate_fraud           0               0            0             0     0                   4
        escalate_human           0               0            0             3     0                   0
        freeze_card              2               0            0             0     0                   0
        open_transfer_case       0               0            0             2     0                   0
v2      answer                   0               2            0             0     0                   0
        ask_for_details          0               2            0             0     0                   0
        freeze_card              0               3            0             0     0                   0
        open_transfer_case       0               3            0             0     0                   0
```

v2's errors are all hand-overs to a person: over-cautious, but safe. v1's errors include refunds, cases opened for transfers that needed none, and cases opened for other customers' transfers. Finally, a trajectory check: did the agent look at the transfer before opening a case?

```python
def looked_first(run_steps):
    tools = run_steps["tool"].tolist()
    if "open_transfer_case" not in tools:
        return None
    return "get_transfer" in tools[: tools.index("open_transfer_case")]

check = steps.groupby("run_id").apply(looked_first, include_groups=False).dropna().rename("looked_first").reset_index()
check["version"] = check["run_id"].str[-2:]
check.groupby("version")["looked_first"].agg(["mean", "size"]).round(3)
```

```text
mean  size
version
v1       0.694915    59
v2            1.0    31
```

v1 opened 18 cases without ever looking at the transfer, and 9 of those happened to be correct: right by luck, and the kind of behaviour that goes wrong on the next request.

## Walkthrough

1. Run the cells. Read v2's ten wrong runs in full. What would you change to fix them?
2. Count each version's errors as safe (a hand-over or asking for details) or unsafe (any other wrong action).
3. Add a trajectory check: did v2 always call `check_reversal_eligibility` before `open_transfer_case`?
4. Write the evaluation summary for the head of support (the task below).

## Practice

```answer
{
  "id": "agt-06-p1",
  "prompt": "What share of **v2** runs ended with the correct action? As a percentage, one decimal place.",
  "answer": 93.3,
  "format": "percent",
  "dataset": "agents",
  "files": ["requests", "runs"],
  "pyVerify": "round(r.loc[r['version'] == 'v2', 'correct'].mean() * 100, 1)",
  "hint": "The first output.",
  "required": true
}
```

```answer
{
  "id": "agt-06-p2",
  "prompt": "What share of v1's case openings came **after** a get_transfer call? As a percentage, one decimal place.",
  "answer": 69.5,
  "format": "percent",
  "dataset": "agents",
  "files": ["steps"],
  "pyVerify": "round(check.loc[check['version'] == 'v1', 'looked_first'].mean() * 100, 1)",
  "hint": "The v1 row of the last output.",
  "required": true
}
```

```task
{
  "id": "agt-06-t1",
  "prompt": "Write the **evaluation summary** for the head of support (60 to 150 words): each version's **accuracy**, how their **errors differ** (safe or unsafe), at least one **trajectory** finding, and your **recommendation**.",
  "minutes": 6,
  "rows": 7,
  "placeholder": "On 150 labelled requests ...",
  "rules": [
    { "label": "At least two percentages", "pattern": "\\d+(\\.\\d+)?\\s*%", "min": 2 },
    { "label": "Distinguishes safe and unsafe errors", "pattern": "safe|cautious|hand(ed)?[- ]over|refund" },
    { "label": "A trajectory finding (looked, checked, before, steps)", "pattern": "look|check\\w* (the|first|before)|before (acting|opening)|without (checking|looking)" },
    { "label": "A recommendation", "pattern": "recommend" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "On 150 labelled requests, v2 chose the right action 93% of the time, against 69% for v1. More important is how they failed. All of v2's errors were cautious hand-overs to a person, which cost staff time but no money. v1's errors included 6 refunds that should never have been paid, cases opened for transfers that were already reversed or too recent, and cases opened on other customers' transfers. v1 also opened some cases without looking at the transfer first, so even some of its correct answers were luck. I recommend piloting v2 on live requests with a person reviewing every action for the first month, and reviewing its hand-overs to reduce them.",
  "note": "Leading with how each version fails, not just how often, is what makes the recommendation trustworthy.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "An agent reached the right final action without checking the transfer first. How should the evaluation treat it?",
    "options": ["As fully correct", "Correct outcome, but a trajectory failure: right by luck", "As wrong", "Ignore it"],
    "answer": 1,
    "explanation": "Check the path as well as the outcome."
  },
  {
    "prompt": "Which error is safer?",
    "options": ["Issuing a refund that wasn't due", "Handing a request to a person when the agent could have handled it", "Opening a case on another customer's transfer", "They're equal"],
    "answer": 1,
    "explanation": "Over-caution costs time; wrong actions cost money and trust."
  },
  {
    "prompt": "Why break accuracy down by expected action?",
    "options": ["For longer reports", "Overall accuracy hides failures on the rare, high-stakes request types", "It's required by law", "To make numbers bigger"],
    "answer": 1,
    "explanation": "Look where mistakes cost most."
  }
]
```
