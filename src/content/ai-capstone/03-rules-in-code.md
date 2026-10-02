---
title: Rules in code
minutes: 25
summary: Decide escalation by rule as well as by the model's judgement, measure what each catches, and build the document checklist in code from the policy, so the assistant asks for exactly what's missing.
---

## The problem

The model's JSON includes `needs_human`: its own judgement of whether a person should take over. It's a useful signal, but the cases that **must** reach a person are not a matter of judgement. An injured passenger, a stolen car, a ₦9m claim or a furious customer must reach a person every time. Missing one is far worse than escalating a message that didn't need it.

The same goes for documents. The policy says exactly what each claim type needs, so a model shouldn't be inventing the list.

## The concept

**Two signals, combined**

- **Rules in code**: escalate if the extraction says injuries, the claim is theft, the message mentions ₦5m or more, or the wording is angry. Rules are predictable and testable.
- **The model's flag**: catches cases the rules don't describe.
- **Fail safe**: if the output failed validation, escalate.

Escalate if **any** of them fires. Measure **recall** (of messages that needed a person, the share escalated) first. Then check the cost: the share of all messages escalated.

**Record the reason**

Every escalation should carry its reasons ("injuries", "theft"). The person who picks it up knows why, and you can later see which rule fires most.

**The checklist from the policy**

Sections S05 to S07 of the policy list the documents for each claim type. Put them in a table in code. The only thing the message itself proves is whether photos were attached. Mentioning a police report isn't the same as sending it.

## Example

The escalation rules, applied to `large_v2`'s outputs:

```python
import json
import re

import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/assistant/"
messages = pd.read_csv(base + "messages.csv", keep_default_na=False)

def parse(raw):
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None

ANGRY = re.compile(r"angry|unacceptable|NAICOM|vex|no good|nobody has replied|disappear", re.I)

def amount_ngn(text):
    m = re.search(r"₦(\d+(?:\.\d+)?)(k|m)", text)
    return None if m is None else float(m.group(1)) * (1_000 if m.group(2) == "k" else 1_000_000)

def escalation_reasons(rec, text):
    if rec is None:
        return ["output failed validation"]
    reasons = []
    if rec.get("injuries"):
        reasons.append("injuries")
    if rec.get("claim_type") == "Theft":
        reasons.append("theft")
    amount = amount_ngn(text)
    if amount is not None and amount >= 5_000_000:
        reasons.append("₦5m or more")
    if ANGRY.search(text):
        reasons.append("angry customer")
    return reasons

records = messages["large_v2_output"].map(parse)
messages["reasons"] = [escalation_reasons(r, t) for r, t in zip(records, messages["text"])]
messages["rule_flag"] = messages["reasons"].map(bool)
messages["model_flag"] = [r is None or bool(r.get("needs_human")) for r in records]
messages["escalate"] = messages["rule_flag"] | messages["model_flag"]

needed = messages["gold_needs_human"] == 1
for col in ["model_flag", "rule_flag", "escalate"]:
    print(f"{col:10}  recall {messages.loc[needed, col].mean():6.1%}   escalated {messages[col].mean():5.1%}   "
          f"precision {messages.loc[messages[col], 'gold_needs_human'].mean():5.1%}")
```

```text
model_flag  recall  87.5%   escalated 36.0%   precision 87.5%
rule_flag   recall  96.3%   escalated 37.0%   precision 93.7%
escalate    recall 100.0%   escalated 42.7%   precision 84.4%
```

The model alone misses about one in eight messages that needed a person. The rules miss fewer, and together they miss none. The price is escalating more messages than strictly needed, which the claims team can absorb far more easily than a missed injury. Which rules fire most:

```python
messages["reasons"].explode().value_counts()
```

```text
reasons
angry customer              96
theft                       79
injuries                    66
₦5m or more                 25
output failed validation     2
Name: count, dtype: int64
```

Now the document checklist, built from the policy:

```python
REQUIRED = {
    "Windscreen": ["photos of the damage"],
    "Accident damage": ["photos of the damage", "your driver's licence", "a repair estimate from an approved garage"],
    "Third party": ["photos of the damage", "your driver's licence", "the police report", "the other party's name, phone number and plate number"],
    "Theft": ["the police report", "both sets of keys", "the registration papers and proof of ownership"],
}

def still_needed(rec, photos_attached):
    needed = list(REQUIRED[rec["claim_type"]])
    if photos_attached > 0 and "photos of the damage" in needed:
        needed.remove("photos of the damage")
    return needed

for _, m in messages.head(3).iterrows():
    rec = parse(m["large_v2_output"])
    missing = still_needed(rec, m["photos_attached"])
    reply = f"please send {'; '.join(missing)}" if missing else "nothing more is needed; we'll be in touch"
    print(f"{m['message_id']} ({rec['claim_type']}, {m['photos_attached']} photos): {reply}")
```

```text
MSG-0001 (Windscreen, 0 photos): please send photos of the damage
MSG-0002 (Accident damage, 2 photos): please send your driver's licence; a repair estimate from an approved garage
MSG-0003 (Windscreen, 4 photos): nothing more is needed; we'll be in touch
```

Each reply is exact, comes straight from the policy, and can't be talked out of a document.

## Walkthrough

1. Run the cells.
2. Look at the messages escalated only by the model's flag, and those escalated only by a rule. Do the rules need a new condition?
3. Test the `ANGRY` pattern on a few polite messages and a few angry Pidgin ones. What does it miss, and what does it catch wrongly?
4. Write the reply template for a customer whose claim is escalated: what they're told, and when a person will contact them.
5. Write the escalation specification (the task below).

## Practice

```answer
{
  "id": "aic-03-p1",
  "prompt": "What is the **recall** of the model's own `needs_human` flag (with failed outputs escalated) on messages that needed a person? One decimal place.",
  "answer": 87.5,
  "format": "percent",
  "dataset": "assistant",
  "files": ["messages"],
  "pyVerify": "round(100 * messages.loc[needed, 'model_flag'].mean(), 1)",
  "hint": "The model_flag line.",
  "required": true
}
```

```answer
{
  "id": "aic-03-p2",
  "prompt": "With rules and the model's flag combined, what percentage of **all** messages are escalated? One decimal place.",
  "answer": 42.7,
  "format": "percent",
  "dataset": "assistant",
  "files": ["messages"],
  "pyVerify": "round(100 * messages['escalate'].mean(), 1)",
  "hint": "The escalated figure on the escalate line.",
  "required": true
}
```

```task
{
  "id": "aic-03-t1",
  "prompt": "Write the **escalation specification** (60 to 150 words): each **rule**, the **fail-safe**, how the model's flag is used, and the **recall and cost** you measured.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Escalate to a person if any of these is true: ...",
  "rules": [
    { "label": "Covers injuries", "pattern": "injur" },
    { "label": "Covers theft", "pattern": "theft|stolen" },
    { "label": "Covers large amounts", "pattern": "5\\s*m|5,000,000|5 million|large amount" },
    { "label": "Covers anger or complaints", "pattern": "angry|anger|complain|threat" },
    { "label": "A fail-safe for invalid output", "pattern": "fail|invalid|validation" },
    { "label": "Recall and escalation rate with numbers", "pattern": "\\d+(\\.\\d+)?\\s*%", "min": 2 },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "Escalate to a person if any of these is true:\n1. The extraction says someone was injured.\n2. The claim type is theft.\n3. The message mentions an amount of ₦5m or more.\n4. The wording is angry or threatens a complaint (matched by pattern, reviewed monthly).\n5. The model's output failed validation (fail-safe).\n6. The model's own needs_human flag is true.\nEach escalation records its reasons. On the 600 test messages, the model's flag alone caught 87.5% of messages that needed a person; rules and flag together caught 100%, escalating 42.7% of all messages against the 36% that strictly needed it. We accept those extra escalations: a missed injury costs far more than a short human review.",
  "note": "The specification is testable: each rule can have its own test case.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why escalate injuries by a rule in code instead of trusting the model's flag?",
    "options": ["Rules are cheaper", "The case must reach a person every time, and a rule applies it predictably", "The model can't read injuries", "To reduce escalations"],
    "answer": 1,
    "explanation": "Must-have behaviour belongs in code."
  },
  {
    "prompt": "What should happen when the model's output fails validation?",
    "options": ["Guess the fields", "Escalate to a person (fail safe)", "Drop the message", "Retry forever"],
    "answer": 1,
    "explanation": "Fail towards the safe outcome."
  },
  {
    "prompt": "Combining rules with the model's flag raises escalations from 36% to 43%. Is that acceptable?",
    "options": ["No, never", "Usually yes: extra reviews cost little compared with missing a case that needed a person", "Only if the model is small", "Only at night"],
    "answer": 1,
    "explanation": "Weigh the costs of each kind of error."
  }
]
```
