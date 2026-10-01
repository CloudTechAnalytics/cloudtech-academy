---
title: Rules in code, not prompts
minutes: 25
summary: Move business rules out of the prompt and into deterministic tools the agent must call, check them against labelled decisions, and measure how often an agent that judged the rule itself got it wrong.
---

## The problem

Paystream's rule for failed or pending transfers is simple:

> Open a transfer case only if the money hasn't already been reversed **and** at least 24 hours have passed since the transfer. Otherwise, tell the customer what's happening and when to expect it.

v1's prompt explained this rule, and the model was left to apply it: read the dates, work out the hours, decide. It often didn't. It opened cases for transfers that had already been reversed, or that were only a few hours old, and sometimes opened a case without looking at the transfer at all. Each unnecessary case costs a support agent's time.

A model is not a reliable calculator of business rules. Code is.

## The concept

**Decide in code, explain with the model**

If a decision follows a fixed rule (dates, thresholds, eligibility, limits), write it as a function and give the agent a **tool** that returns the decision and the reason. The model's job becomes understanding the request and explaining the outcome, not doing date arithmetic.

**Make it mandatory**

The tool that acts (`open_transfer_case`) can itself refuse unless the eligibility check passed. Then even if the model skips the check, the action can't happen.

**Test the rule against labels**

The rule function can be tested against decisions people have already made. If it disagrees with them, either the code or the written policy is wrong, and you want to know before the agent goes live.

## Example

The eligibility rule as code, checked against the support lead's labels for every request about a failed or pending transfer:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/agents/"
requests = pd.read_csv(base + "requests.csv", parse_dates=["received_at"])
transfers = pd.read_csv(base + "transfers.csv", parse_dates=["created_at", "reversed_at"])

def check_reversal_eligibility(transfer, at_time):
    if transfer["status"] not in ("failed", "pending"):
        return {"eligible": False, "reason": "The transfer was successful."}
    if pd.notna(transfer["reversed_at"]) and transfer["reversed_at"] <= at_time:
        return {"eligible": False, "reason": f"Already reversed on {transfer['reversed_at']:%d %b at %H:%M}."}
    hours = (at_time - transfer["created_at"]).total_seconds() / 3600
    if hours < 24:
        return {"eligible": False, "reason": f"Only {hours:.0f} hours old; most resolve within 24 hours."}
    return {"eligible": True, "reason": f"{hours:.0f} hours old and not reversed."}

requests["transfer_id"] = requests["message"].str.extract(r"(TRF\d{6})")[0]
cases = requests.merge(transfers, on="transfer_id", suffixes=("", "_owner"))
cases = cases[cases["status"].isin(["failed", "pending"]) & (cases["account_id"] == cases["account_id_owner"])].copy()
cases["rule"] = [check_reversal_eligibility(t, t["received_at"]) for _, t in cases.iterrows()]
cases["rule_action"] = cases["rule"].map(lambda r: "open_transfer_case" if r["eligible"] else "answer")

print(len(cases), "requests about failed or pending transfers")
print("Rule agrees with the support lead:", (cases["rule_action"] == cases["expected_action"]).mean())
print(cases["rule_action"].value_counts())
```

```text
65 requests about failed or pending transfers
Rule agrees with the support lead: 1.0
rule_action
answer                34
open_transfer_case    31
Name: count, dtype: int64
```

The rule matches every human decision. Now compare what each agent version actually did on these requests:

```python
runs = pd.read_csv(base + "runs.csv")
r = runs.merge(cases[["request_id", "expected_action"]], on="request_id")
r["opened_needlessly"] = (r["final_action"] == "open_transfer_case") & (r["expected_action"] == "answer")
r["correct"] = r["final_action"] == r["expected_action"]
r.groupby("version")[["correct", "opened_needlessly"]].agg(["mean", "sum"]).round(3)
```

```text
correct     opened_needlessly
           mean sum              mean sum
version
v1        0.615  40             0.338  22
v2        0.923  60             0.000   0
```

v1, judging the rule itself, opened many cases that didn't need opening. v2 calls `check_reversal_eligibility` on every one of these requests and makes no rule errors. Its few mistakes here come from elsewhere: lesson 6 finds them.

## Walkthrough

1. Run the cells. Print the `reason` for five ineligible requests. Would they make a good reply to the customer?
2. Find the v1 runs that opened a case **without** calling `get_transfer` first. What does that say about acting on the customer's claim alone?
3. Change the rule to 48 hours. How many decisions change?
4. Write the rules for a different decision as code (the task below).

## Practice

```answer
{
  "id": "agt-04-p1",
  "prompt": "On these requests, how many cases did **v1** open **needlessly**?",
  "answer": 22,
  "format": "number",
  "dataset": "agents",
  "files": ["requests", "transfers", "runs"],
  "pyVerify": "int(r.loc[r['version'] == 'v1', 'opened_needlessly'].sum())",
  "hint": "The sum of opened_needlessly for v1.",
  "required": true
}
```

```task
{
  "id": "agt-04-t1",
  "prompt": "Paystream's rule for lost cards: **freeze the card if it's active; if it's already frozen, tell the customer; if they have no card, say so**. Write it as a Python function `card_action(account)` that returns a dict with an **action** and a **reason** for each case.",
  "minutes": 8,
  "rows": 12,
  "placeholder": "def card_action(account):\n    ...",
  "rules": [
    { "label": "Defines card_action", "pattern": "def\\s+card_action\\s*\\(" },
    { "label": "Checks the card status", "pattern": "card_status" },
    { "label": "Handles active, frozen and none", "pattern": "[\"'](active|frozen|none)[\"']", "min": 3 },
    { "label": "Returns an action and a reason", "pattern": "[\"']reason[\"']" },
    { "label": "Freezes only in one branch", "pattern": "freeze_card" }
  ],
  "sample": "def card_action(account):\n    status = account[\"card_status\"]\n    if status == \"active\":\n        return {\"action\": \"freeze_card\", \"reason\": \"Card is active; freezing blocks new payments.\"}\n    if status == \"frozen\":\n        return {\"action\": \"answer\", \"reason\": \"Card is already frozen; no payments can be made with it.\"}\n    if status == \"none\":\n        return {\"action\": \"answer\", \"reason\": \"This account has no card.\"}\n    return {\"action\": \"escalate_human\", \"reason\": f\"Unexpected card status: {status}\"}",
  "note": "The last line handles a value nobody planned for, by handing over to a person instead of guessing.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A decision depends on whether 24 hours have passed. Where should that be calculated?",
    "options": ["In the model's head, from the prompt", "In code, exposed to the agent as a tool that returns the decision and reason", "By the customer", "It doesn't matter"],
    "answer": 1,
    "explanation": "Models are unreliable at rule arithmetic; code isn't."
  },
  {
    "prompt": "How can you make sure a case is never opened without the eligibility check?",
    "options": ["Ask the model nicely", "Make the open_transfer_case tool itself refuse unless the check passed", "Use a bigger model", "Remove the eligibility tool"],
    "answer": 1,
    "explanation": "Enforce rules in the action, not just the prompt."
  },
  {
    "prompt": "Your rule function disagrees with 5% of past human decisions. What next?",
    "options": ["Ship it", "Read the disagreements: either the code or the written policy is wrong", "Delete the labels", "Let the model decide those"],
    "answer": 1,
    "explanation": "Disagreements are the cheapest bugs you'll ever find."
  }
]
```
