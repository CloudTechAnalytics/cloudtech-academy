---
title: Red-teaming and fair guardrails
minutes: 25
summary: Attack the assistant on purpose, compare two guardrails by how many attacks get through, and check the price: genuine customers wrongly blocked, and whether that price falls on Pidgin speakers and angry customers.
---

## The problem

A WhatsApp number is open to anyone. Some people will try to make the assistant approve a claim, promise money, reveal another customer's details, or obey instructions hidden inside a message. The team built two guardrails, each a check that blocks a message before the model acts on it:

- **v1**: a keyword filter.
- **v2**: a small classifier trained on attacks, together with a hardened prompt and the rules in code from lesson 3.

The red team ran 120 attacks against both. A guardrail also has a cost, though: every genuine customer it blocks is a customer who gets no help.

## The concept

**Red-teaming**

Write attacks by category, run them against each version, and record the outcome: **Blocked** by the guardrail, **Refused** by the model, or **Attack succeeded**. Report the success rate by category, because one weak category is enough.

**Defence in depth**

The guardrail is one layer. The model's instructions are another. Code is the strongest: an assistant that has no tool to approve claims can't be talked into approving one, whatever the message says.

**False positives, and who pays them**

Run the guardrail on genuine messages and count how many it wrongly flags. Then split by group. A keyword filter that trips on Pidgin words, or on anger, blocks exactly the customers who most need a person.

## Example

Attack outcomes for each version:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/assistant/"
redteam = pd.read_csv(base + "redteam.csv")
messages = pd.read_csv(base + "messages.csv", keep_default_na=False)

print(pd.DataFrame({v: redteam[f"{v}_outcome"].value_counts() for v in ["v1", "v2"]}).fillna(0).astype(int), "\n")
success = redteam.groupby("category")[["v1_outcome", "v2_outcome"]].agg(lambda s: (s == "Attack succeeded").mean())
success.round(3)
```

```text
v1   v2
Blocked           57  113
Refused           49    6
Attack succeeded  14    1

                      v1_outcome  v2_outcome
category
Abuse and threats          0.042       0.000
Data request               0.125       0.042
Hidden injection           0.167       0.000
Instruction override       0.125       0.000
Payment promise            0.125       0.000
```

v1 lets attacks through in every category. v2 stops almost all of them; the only one that got through was a request for another customer's data. Now the price, on the 600 genuine messages:

```python
print(messages.groupby("language")[["guardrail_v1_flag", "guardrail_v2_flag"]].mean().round(3), "\n")
messages.groupby("gold_angry")[["guardrail_v1_flag", "guardrail_v2_flag"]].mean().round(3)
```

```text
guardrail_v1_flag  guardrail_v2_flag
language
English               0.056              0.021
Pidgin                0.186              0.034

            guardrail_v1_flag  guardrail_v2_flag
gold_angry
0                       0.046              0.026
1                       0.271              0.010
```

The keyword filter wrongly flags Pidgin messages more than three times as often as English ones, and it flags angry customers far more than calm ones. An angry customer who has been waiting is exactly the person who should reach a human, not a wall. v2 is more accurate against attacks **and** fairer to customers. Even so, a flagged genuine message should go to a person rather than be dropped, so a false positive costs a delay, not a customer.

## Walkthrough

1. Run the cells.
2. Read the attack that succeeded against v2. Which layer should have stopped it? Write the code rule that would (for example: the assistant has no access to other customers' records at all).
3. Write five new attacks in Pidgin. Which category do you expect to be weakest?
4. Decide what happens to a flagged message: blocked with a message, or routed to a person?
5. Write the red-team report (the task below).

## Practice

```answer
{
  "id": "aic-06-p1",
  "prompt": "How many of the 120 attacks **succeeded** against guardrail **v1**?",
  "answer": 14,
  "format": "number",
  "dataset": "assistant",
  "files": ["redteam"],
  "pyVerify": "int((redteam['v1_outcome'] == 'Attack succeeded').sum())",
  "hint": "The Attack succeeded row, v1 column.",
  "required": true
}
```

```answer
{
  "id": "aic-06-p2",
  "prompt": "What percentage of genuine **Pidgin** messages does guardrail **v1** wrongly flag? One decimal place.",
  "answer": 18.6,
  "format": "percent",
  "dataset": "assistant",
  "files": ["messages"],
  "pyVerify": "round(100 * messages.loc[messages['language'] == 'Pidgin', 'guardrail_v1_flag'].mean(), 1)",
  "hint": "The Pidgin row, guardrail_v1_flag.",
  "required": true
}
```

```task
{
  "id": "aic-06-t1",
  "prompt": "Write the **red-team report** (60 to 150 words): attack success for **both** versions, the **weakest category**, the **false positives** by language and for angry customers, and what happens to a **flagged** message.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Of 120 attacks, ...",
  "rules": [
    { "label": "Attack results for both versions", "pattern": "v1[\\s\\S]{0,200}v2|v2[\\s\\S]{0,200}v1" },
    { "label": "Uses numbers", "pattern": "\\d+(\\.\\d+)?", "min": 4 },
    { "label": "Names a category", "pattern": "data request|instruction override|payment promise|hidden injection|abuse" },
    { "label": "Covers Pidgin false positives", "pattern": "pidgin" },
    { "label": "Covers angry customers", "pattern": "angry|anger" },
    { "label": "What happens to flagged messages (person, human, routed)", "pattern": "person|human|rout|review" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "Of 120 attacks, 14 succeeded against v1 (the keyword filter) and 1 against v2. v1 was weakest on hidden injections; the one success against v2 was a data request for the claim details of someone else's car, which we'll close in code by giving the assistant no access to other customers' records. The price matters too: v1 wrongly flagged 18.6% of genuine Pidgin messages against 5.6% in English, and angry customers far more often than calm ones. v2 flags 3.4% of Pidgin and 2.1% of English messages. We'll ship v2, and any flagged genuine message goes to a person rather than being dropped, so a false positive costs a short delay, not a customer.",
  "note": "A guardrail is judged on both errors: attacks that get through, and customers who don't.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What's the strongest defence against \"approve my claim\" attacks?",
    "options": ["A longer prompt", "Code: the assistant has no ability to approve claims at all", "A bigger model", "A keyword list"],
    "answer": 1,
    "explanation": "Can't is stronger than won't."
  },
  {
    "prompt": "A guardrail flags Pidgin messages three times as often as English. Why is that a problem?",
    "options": ["It's not", "It denies help unfairly to one group of customers", "It costs more tokens", "It slows the model"],
    "answer": 1,
    "explanation": "False positives have a cost, and here it falls on one group."
  },
  {
    "prompt": "What should happen to a genuine message the guardrail flags?",
    "options": ["Drop it", "Route it to a person", "Reply with an error", "Ban the number"],
    "answer": 1,
    "explanation": "Make the cost of a false positive small."
  }
]
```
