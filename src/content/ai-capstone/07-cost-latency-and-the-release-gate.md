---
title: Cost, latency and the release gate
minutes: 30
summary: Price each configuration per message and per month, measure its 95th-percentile latency, and put every quality, safety, speed and cost requirement into one release gate that a configuration must pass in full.
---

## The problem

The head of claims needs a yes or no: which configuration goes live? Each team member argues for a different one. Finance likes the small model's price, and the claims team likes the large model's accuracy. A **release gate** settles it. Agree the requirements before looking at the results, check every configuration against all of them, and ship only one that passes everything.

## The concept

**Cost per message**

Cost = input tokens × input price + output tokens × output price. The `large_v2` prompt is longer (schema and examples), so it costs more per message than `large_v1` with the same model. For this course, use these illustrative prices in US dollars per million tokens, at ₦1,550 to the dollar, and a volume of 14,000 messages a month:

| Model | Input | Output |
| :-- | --: | --: |
| Small | $0.15 | $0.60 |
| Large | $2.50 | $10.00 |

**Latency: the 95th percentile**

Averages hide the slow replies customers notice. The **p95** is the time within which 95% of replies arrive.

**The release gate**

| Requirement | Threshold |
| :-- | :-- |
| Valid JSON | at least 99% |
| Claim type accuracy | at least 95% overall and 90% in Pidgin |
| Invented plate numbers | at most 1% |
| Escalation recall (rules, flag and fail-safe) | at least 99% |
| p95 latency | at most 4 seconds |
| Monthly cost | at most ₦150,000 |

The guardrail requirements (attack success at most 2%, false positives at most 5% in every language) were checked in lesson 6, and v2 passes them.

## Example

Every metric for every configuration:

```python
import json
import re

import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/assistant/"
messages = pd.read_csv(base + "messages.csv", keep_default_na=False)
PRICES = {"small": (0.15, 0.60), "large": (2.50, 10.00)}  # US$ per million input and output tokens
NGN_PER_USD = 1550
MONTHLY_MESSAGES = 14_000
ANGRY = re.compile(r"angry|unacceptable|NAICOM|vex|no good|nobody has replied|disappear", re.I)

def parse(raw):
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None

def amount_ngn(text):
    m = re.search(r"₦(\d+(?:\.\d+)?)(k|m)", text)
    return None if m is None else float(m.group(1)) * (1_000 if m.group(2) == "k" else 1_000_000)

def escalate(rec, text):
    if rec is None or rec.get("needs_human") or rec.get("injuries") or rec.get("claim_type") == "Theft":
        return True
    amount = amount_ngn(text)
    return (amount is not None and amount >= 5_000_000) or bool(ANGRY.search(text))

rows = []
for config in ["small_v1", "large_v1", "large_v2"]:
    size, prompt = config.split("_")
    recs = messages[config + "_output"].map(parse)
    field = lambda name: recs.map(lambda r: r.get(name) if r else None)
    type_ok = field("claim_type") == messages["gold_claim_type"]
    pidgin = messages["language"] == "Pidgin"
    escalated = pd.Series([escalate(r, t) for r, t in zip(recs, messages["text"])])
    tokens_in = messages["input_tokens_" + prompt]
    cost_usd = (tokens_in * PRICES[size][0] + messages["output_tokens"] * PRICES[size][1]) / 1e6
    rows.append({
        "config": config,
        "valid_json": recs.notna().mean(),
        "claim_type": type_ok.mean(),
        "claim_type_pidgin": type_ok[pidgin].mean(),
        "invented_plates": ((messages["gold_vehicle_reg"] == "") & field("vehicle_reg").notna()).mean(),
        "escalation_recall": escalated[messages["gold_needs_human"] == 1].mean(),
        "p95_latency_ms": np.percentile(messages[f"latency_{size}_ms"], 95),
        "monthly_cost_ngn": cost_usd.mean() * MONTHLY_MESSAGES * NGN_PER_USD,
    })
metrics = pd.DataFrame(rows).set_index("config")
metrics.round(3)
```

```text
valid_json  claim_type  claim_type_pidgin  invented_plates  escalation_recall  p95_latency_ms  monthly_cost_ngn
config
small_v1       0.932       0.812              0.703            0.042              0.981         1093.05          2391.280
large_v1       0.955       0.887              0.822            0.007              0.995         3387.15         39854.672
large_v2       0.997       0.962              0.932            0.003              1.000         3387.15         79457.172
```

The small model is by far the cheapest and fastest. All three are well inside the cost budget, which matters: price isn't the deciding factor here, so quality is. Now apply the gate:

```python
gate = pd.DataFrame({
    "valid JSON ≥ 99%": metrics["valid_json"] >= 0.99,
    "claim type ≥ 95%": metrics["claim_type"] >= 0.95,
    "Pidgin claim type ≥ 90%": metrics["claim_type_pidgin"] >= 0.90,
    "invented plates ≤ 1%": metrics["invented_plates"] <= 0.01,
    "escalation recall ≥ 99%": metrics["escalation_recall"] >= 0.99,
    "p95 latency ≤ 4 s": metrics["p95_latency_ms"] <= 4000,
    "cost ≤ ₦150k a month": metrics["monthly_cost_ngn"] <= 150_000,
})
gate["passes"] = gate.all(axis=1)
gate.T
```

```text
config                   small_v1  large_v1  large_v2
valid JSON ≥ 99%            False     False      True
claim type ≥ 95%            False     False      True
Pidgin claim type ≥ 90%     False     False      True
invented plates ≤ 1%        False      True      True
escalation recall ≥ 99%     False      True      True
p95 latency ≤ 4 s            True      True      True
cost ≤ ₦150k a month         True      True      True
passes                      False     False      True
```

Only `large_v2` passes every requirement. The small model fails on accuracy, especially in Pidgin, on invented plates, and on escalation recall: its weaker extraction means rules miss some injuries. `large_v1` fails on valid JSON and accuracy. The prompt work in `v2`, not the bigger model alone, is what gets the large model over the line.

## Walkthrough

1. Run the cells.
2. What would the small model's accuracy need to be to pass? Is there a cheaper design, such as the small model with the v2 prompt, worth testing?
3. Recalculate the monthly cost at 40,000 messages, and with the question-answering calls added (assume one question per three messages, at 2,500 input and 150 output tokens on the large model).
4. Write down who signs off the gate, and what happens if a later change fails it.
5. Write the release decision (the task below).

## Practice

```answer
{
  "id": "aic-07-p1",
  "prompt": "What's the estimated **monthly cost** of `large_v2` in naira? (A rounded figure is fine.)",
  "answer": 79457,
  "format": "naira",
  "dataset": "assistant",
  "files": ["messages"],
  "pyVerify": "int(round(metrics.loc['large_v2', 'monthly_cost_ngn']))",
  "tolerance": 1000,
  "hint": "The monthly_cost_ngn column, large_v2 row.",
  "required": true
}
```

```answer
{
  "id": "aic-07-p2",
  "prompt": "What is the large model's **p95 latency** in milliseconds? (A rounded figure is fine.)",
  "answer": 3387,
  "format": "number",
  "dataset": "assistant",
  "files": ["messages"],
  "pyVerify": "int(round(metrics.loc['large_v2', 'p95_latency_ms']))",
  "tolerance": 10,
  "hint": "The p95_latency_ms column for a large configuration.",
  "required": true
}
```

```task
{
  "id": "aic-07-t1",
  "prompt": "Write the **release decision** (60 to 150 words): the configuration that ships, the **gate results** with numbers, why each other configuration **fails**, the **cost**, and what would **block** a future release.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Ship large_v2 ...",
  "rules": [
    { "label": "Names the configuration that ships", "pattern": "ship|release|launch|go live" },
    { "label": "Gate results with numbers", "pattern": "\\d+(\\.\\d+)?\\s*%", "min": 3 },
    { "label": "Explains why small_v1 fails", "pattern": "small" },
    { "label": "Explains why large_v1 fails", "pattern": "large_v1|v1" },
    { "label": "States the cost", "pattern": "₦\\s*\\d" },
    { "label": "What blocks a future release", "pattern": "block|fail|any (change|future)|every (change|release)" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "Ship large_v2. It passes every requirement in the gate: 99.7% valid JSON, 96.2% claim type accuracy (93.2% in Pidgin), 0.3% invented plates, 100% escalation recall, p95 latency within 4 seconds, and about ₦79,000 a month at 14,000 messages. small_v1 is cheapest but fails on accuracy (81.2%, and 70.3% in Pidgin) invents plates for 4.2% of messages, and misses escalations (98.1% recall). large_v1 fails on valid JSON (95.5%) and claim type (88.7%). Cost doesn't decide this: all three are under budget. Any future change to the model, prompt or rules must pass the same gate on the same 600 messages and the red-team set before release; a single failed requirement blocks it.",
  "note": "The gate turns an argument into a checklist everyone agreed in advance.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why use the p95 latency rather than the average?",
    "options": ["It's smaller", "It shows how slow the slowest replies are, which customers notice", "Averages can't be computed", "It's cheaper"],
    "answer": 1,
    "explanation": "Tail latency is the experience."
  },
  {
    "prompt": "The small model is over thirty times cheaper but fails the accuracy requirement. What does the gate say?",
    "options": ["Ship it anyway", "It doesn't ship: every requirement must pass", "Average the scores", "Lower the requirement"],
    "answer": 1,
    "explanation": "A gate is all-or-nothing."
  },
  {
    "prompt": "Why agree the gate's thresholds before seeing the results?",
    "options": ["To save time", "So the thresholds aren't bent to fit a favourite configuration", "It's required by law", "It doesn't matter"],
    "answer": 1,
    "explanation": "Decide the rules before the game."
  }
]
```
