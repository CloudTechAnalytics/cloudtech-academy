---
title: Extraction and validation
minutes: 30
summary: Parse and validate the model's JSON in code, repair what can safely be repaired, catch invented plate numbers without gold labels, and measure each configuration field by field and by language.
---

## The problem

The model's output goes straight into Shieldline's claims system. A missing bracket crashes the pipeline. A plate number in the wrong format doesn't match any policy. And an **invented** plate number is worse than none: it attaches the claim to someone else's car. Before comparing models, write the code that stands between the model and the system.

## The concept

### Validate everything

| Field | Check |
| :-- | :-- |
| The whole output | Parses as JSON |
| `claim_type` | One of the four allowed types |
| `incident_date` | A real date, not after the message was sent |
| `vehicle_reg` | Standard Nigerian format, `ABC 123 DE`, or null |
| `injuries`, `police_report`, `needs_human` | True or false |

### Repair only what's safe

A plate written `FKJ471KT` can be safely rewritten as `FKJ 471 KT`. A claim type the model made up can't be repaired; the message goes to a person.

### Grounding checks in code

If the model returns a plate number, it should appear in the customer's message. You can check that with no gold labels at all, so the check works in production too.

### Measure by field and by group

Overall accuracy hides which fields fail and for whom. Measure each field, and compare English with Pidgin.

![Field checks on a model's output, what is safe to repair and what must go to a person, a grounding check, and measuring by field and group](/images/courses/ai-capstone/validation.svg "Validate everything; repair only what is safe; ground what you can.")

## Example

The validator:

```python
import json
import re

import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/assistant/"
messages = pd.read_csv(base + "messages.csv", keep_default_na=False)

CLAIM_TYPES = {"Windscreen", "Accident damage", "Third party", "Theft"}
PLATE = re.compile(r"^([A-Z]{3})\s*(\d{3})\s*([A-Z]{2})$")

def validate(raw, text, sent_at):
    """Parse one model output. Returns (record or None, list of problems)."""
    try:
        rec = json.loads(raw)
    except json.JSONDecodeError:
        return None, ["not valid JSON"]
    problems = []
    if rec.get("claim_type") not in CLAIM_TYPES:
        problems.append("unknown claim type")
    date = rec.get("incident_date")
    if not (isinstance(date, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", date) and date <= sent_at[:10]):
        problems.append("bad or future date")
    reg = rec.get("vehicle_reg")
    if reg is not None:
        match = PLATE.match(reg)
        if not match:
            problems.append("plate not recognised")
        else:
            rec["vehicle_reg"] = " ".join(match.groups())  # safe repair: standard spacing
            if rec["vehicle_reg"].replace(" ", "") not in text.replace(" ", ""):
                problems.append("plate not in the message")
    for field in ["injuries", "police_report", "needs_human"]:
        if not isinstance(rec.get(field), bool):
            problems.append(f"{field} not true or false")
    return rec, problems

rec, problems = validate('{"claim_type": "Theft", "incident_date": "2026-06-02", "vehicle_reg": "KJA482TL", '
                         '"injuries": false, "police_report": true, "needs_human": true}',
                         "My car was stolen yesterday. Plate KJA 482 TL.", "2026-06-03 10:00")
print(rec["vehicle_reg"], problems)
```

```text
KJA 482 TL []
```

The plate was repaired and found in the message. Now run all three configurations through it, and compare each field with the gold labels:

```python
def evaluate(config):
    rows = []
    for _, m in messages.iterrows():
        rec, problems = validate(m[config + "_output"], m["text"], m["sent_at"])
        rec = rec or {}
        rows.append({
            "valid_json": "not valid JSON" not in problems,
            "passes_checks": not problems,
            "claim_type": rec.get("claim_type") == m["gold_claim_type"],
            "incident_date": rec.get("incident_date") == m["gold_incident_date"],
            "vehicle_reg": (rec.get("vehicle_reg") or "") == m["gold_vehicle_reg"],
            "invented_plate": m["gold_vehicle_reg"] == "" and rec.get("vehicle_reg") is not None,
            "caught_by_check": "plate not in the message" in problems,
            "language": m["language"],
        })
    return pd.DataFrame(rows)

results = {config: evaluate(config) for config in ["small_v1", "large_v1", "large_v2"]}
summary = pd.DataFrame({config: r.drop(columns="language").mean() for config, r in results.items()})
summary.round(3)
```

```text
small_v1  large_v1  large_v2
valid_json          0.932     0.955     0.997
passes_checks       0.887     0.947     0.992
claim_type          0.812     0.887     0.962
incident_date       0.873     0.923     0.973
vehicle_reg         0.900     0.953     0.993
invented_plate      0.042     0.007     0.003
caught_by_check     0.042     0.007     0.003
```

`large_v2` is better on every field. The schema and examples almost eliminated invalid JSON, and giving the model today's date fixed most relative dates such as "yesterday". Look at `invented_plate`: the small model invents a plate for a large share of the messages that don't contain one. The `caught_by_check` row shows the grounding check catches those inventions without needing any gold labels. By language:

```python
pd.DataFrame({config: r.groupby("language")["claim_type"].mean() for config, r in results.items()}).round(3)
```

```text
small_v1  large_v1  large_v2
language
English      0.838     0.902     0.969
Pidgin       0.703     0.822     0.932
```

Every configuration does worse on Pidgin, and the small model much worse. Since a fifth of customers write in Pidgin, that gap is part of the decision, not a footnote.

## Walkthrough

1. Run the cells.
2. Print ten messages where `large_v2` got the claim type wrong. Is there a pattern?
3. Look at the outputs that aren't valid JSON. Which could a simple repair fix (such as removing a "Here is the JSON:" prefix), and which should go to a person?
4. Add a check of your own: for example, that a theft claim has `police_report` set.
5. Write the extraction report (the task below).

## Practice

```answer
{
  "id": "aic-02-p1",
  "prompt": "What percentage of `small_v1` outputs **invent** a plate number for a message that doesn't contain one? (As a share of all 600 messages.) One decimal place.",
  "answer": 4.2,
  "format": "percent",
  "dataset": "assistant",
  "files": ["messages"],
  "pyVerify": "round(100 * results['small_v1']['invented_plate'].mean(), 1)",
  "hint": "The invented_plate row, small_v1 column.",
  "required": true
}
```

```answer
{
  "id": "aic-02-p2",
  "prompt": "What is `large_v2`'s claim type accuracy on **Pidgin** messages? One decimal place.",
  "answer": 93.2,
  "format": "percent",
  "dataset": "assistant",
  "files": ["messages"],
  "pyVerify": "round(100 * results['large_v2'].groupby('language')['claim_type'].mean()['Pidgin'], 1)",
  "hint": "The Pidgin row, large_v2 column.",
  "required": true
}
```

```task
{
  "id": "aic-02-t1",
  "prompt": "Write the **extraction report** (60 to 150 words): the configuration you'd use and **why**, its field accuracy with **numbers**, the gap for **Pidgin**, and what the **validator** catches.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Use large_v2 ...",
  "rules": [
    { "label": "Names a configuration", "pattern": "small_v1|large_v1|large_v2" },
    { "label": "Uses numbers", "pattern": "\\d+(\\.\\d+)?\\s*%", "min": 3 },
    { "label": "Covers Pidgin", "pattern": "pidgin" },
    { "label": "Covers the validator or checks", "pattern": "validat|check" },
    { "label": "Covers invented plates", "pattern": "invent|hallucinat|made.up" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "Use large_v2: the schema, examples and today's date cut invalid JSON to almost nothing and lifted every field, with claim type at 96.2% and incident date at 97.3%. It still does worse on Pidgin (93.2% claim type against 96.9% in English), so Pidgin messages need a closer eye in monitoring. The small model invents a plate number for about 4% of messages, which would attach claims to the wrong car; large_v2 does so far less. The validator rejects anything that isn't valid JSON or uses an unknown claim type, repairs plate spacing, and flags any plate that doesn't appear in the message, which catches invented plates without gold labels. Anything that fails goes to a person.",
  "note": "The validator is part of the product, not a test: it runs on every message in production.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The model returns the plate \"FKJ471KT\" and the message says \"FKJ 471 KT\". What should code do?",
    "options": ["Reject the message", "Repair the spacing to the standard format", "Ask the model again", "Ignore the plate"],
    "answer": 1,
    "explanation": "A safe, deterministic repair."
  },
  {
    "prompt": "How can you catch an invented plate number in production, without gold labels?",
    "options": ["You can't", "Check that the plate appears in the customer's message", "Ask the model if it's sure", "Use a bigger model"],
    "answer": 1,
    "explanation": "A grounding check in code."
  },
  {
    "prompt": "Why measure accuracy separately for Pidgin messages?",
    "options": ["For the report's length", "Overall accuracy can hide a group of customers the assistant serves badly", "Pidgin messages are shorter", "It's required"],
    "answer": 1,
    "explanation": "Averages hide groups."
  }
]
```
