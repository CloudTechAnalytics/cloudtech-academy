---
title: Release gates
minutes: 20
summary: Turn release decisions into automatic rules (minimum scores, no regressions in critical categories, cost and latency budgets) that run on every candidate before it can ship.
---

## The problem

In lesson 3, a person noticed the fraud regression by reading a table. People get busy, deadlines press, and tables get skimmed. The next regression might ship.

Software teams solve this with **gates**: automatic checks that run on every change and block a release that fails them, whatever the deadline. AI features need the same, written for model behaviour.

## The concept

### A release gate is a set of rules, agreed in advance

| Rule | Example |
| :-- | :-- |
| **Overall floor** | pass rate at least the live release's, minus a small tolerance |
| **Critical categories** | no fall in fraud or safety pass rates; no broken safety case at all |
| **Budgets** | mean latency and cost per request within agreed limits |
| **Red-team** | attack success rate no worse than live (lesson 5) |

**Agree the rules before you see the results.** Otherwise, the rules bend to fit the release people want to ship.

**Run the gate automatically**, in the same pipeline that deploys the change (often called CI), so that a failing release can't be deployed without someone explicitly overriding it, and the override is recorded.

![A change enters a gate with four rules agreed in advance: overall pass rate, critical categories, budgets and red-team. If all pass, deploy; if any fails, it's blocked unless an override is recorded.](/images/courses/llmops/release-gate.svg "A release gate, run automatically before deploy.")

## Example

A gate function, applied to both candidates:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/llmops/"
cases = pd.read_csv(base + "eval_cases.csv")
results = pd.read_csv(base + "eval_results.csv").merge(cases, on="case_id")

CRITICAL = ["Fraud", "Safety"]
TOLERANCE = 0.01          # overall may fall by at most 1 point
LATENCY_BUDGET_MS = 3500

def gate(candidate, live="r1-live"):
    c = results[results["release"] == candidate].set_index("case_id")
    l = results[results["release"] == live].set_index("case_id")
    checks = {
        "overall": c["passed"].mean() >= l["passed"].mean() - TOLERANCE,
        "latency": c["latency_ms"].mean() <= LATENCY_BUDGET_MS,
    }
    for cat in CRITICAL:
        in_cat = c["category"] == cat
        checks[f"{cat} not worse"] = c.loc[in_cat, "passed"].mean() >= l.loc[in_cat, "passed"].mean()
    broken_safety = ((l["passed"] == 1) & (c["passed"] == 0) & (c["category"] == "Safety")).sum()
    checks["no safety case broken"] = broken_safety == 0
    return pd.Series(checks)

pd.DataFrame({cand: gate(cand) for cand in ["r2-new-prompt", "r3-small-model"]})
```

```text
r2-new-prompt  r3-small-model
overall                         True           False
latency                         True            True
Fraud not worse                False           False
Safety not worse                True           False
no safety case broken           True           False
```

Neither candidate passes. r2 fails on fraud alone; r3 fails on overall quality and safety, even though it's far faster. The gate doesn't decide what to do next. It makes sure nobody ships either release by accident.

## Walkthrough

1. Run the cell. Change the tolerance to 5 points. Does that change any result? Should it?
2. Add a cost rule using `input_tokens` and `output_tokens` with illustrative prices.
3. Add a rule that no more than 2% of cases may break in any category. Which categories fail for each candidate?
4. Write your team's gate policy (the task below).

## Practice

```answer
{
  "id": "ops-04-p1",
  "prompt": "How many of the gate's checks does **r3** fail?",
  "answer": 4,
  "format": "number",
  "dataset": "llmops",
  "files": ["eval_cases", "eval_results"],
  "pyVerify": "int((~gate('r3-small-model')).sum())",
  "hint": "Count the False values in the r3 column.",
  "required": true
}
```

```task
{
  "id": "ops-04-t1",
  "prompt": "Write Paystream's **release gate policy**, one rule per line starting with a dash: at least **five** rules, including an **overall** rule, a **critical category** rule, a **budget** rule (latency or cost), a **red-team** rule, and who may **override** the gate and how it's recorded.",
  "minutes": 6,
  "rows": 7,
  "placeholder": "- Overall pass rate ...",
  "rules": [
    { "label": "At least five rules, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 5 },
    { "label": "An overall rule", "pattern": "overall|whole suite" },
    { "label": "A critical category rule (fraud, safety)", "pattern": "fraud|safety" },
    { "label": "A budget rule (latency, cost)", "pattern": "latency|cost|budget|ms\\b|naira|₦" },
    { "label": "A red-team rule", "pattern": "red[- ]?team|attack" },
    { "label": "An override rule with a record", "pattern": "overrid[^\\n]*(record|log|written|sign)" }
  ],
  "sample": "- Overall: the candidate's suite pass rate must be no more than 1 point below the live release's.\n- Critical categories: fraud and safety pass rates must not fall, and no safety case that passes live may fail.\n- Budget: mean latency at most 3.5 seconds, and cost per request no more than 20% above live.\n- Red-team: the attack success rate with the guardrail on must not be higher than live's.\n- Override: only the head of support and the engineering lead together may override a failed gate, with a written reason recorded in the release log.",
  "note": "The override rule matters as much as the checks. A gate anyone can skip quietly isn't a gate.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why agree release rules before seeing a candidate's results?",
    "options": ["It's quicker", "So the rules don't bend to fit the release people want to ship", "Rules don't matter", "Regulators require it"],
    "answer": 1,
    "explanation": "Decide the bar first, then measure."
  },
  {
    "prompt": "A faster, cheaper candidate fails the safety rule. What does the gate do?",
    "options": ["Ships it, because it's cheaper", "Blocks it until it passes, or until an override is explicitly recorded", "Deletes it", "Lowers the bar"],
    "answer": 1,
    "explanation": "The gate prevents accidental releases; it doesn't make trade-offs silently."
  },
  {
    "prompt": "Where should a release gate run?",
    "options": ["On one engineer's laptop, when they remember", "Automatically, in the pipeline that deploys the change", "After release", "Only for big changes"],
    "answer": 1,
    "explanation": "Automatic and unavoidable, except by recorded override."
  }
]
```
