---
title: The brief and the design
minutes: 25
summary: Meet Shieldline's WhatsApp claims assistant, decide what the model does and what code decides, define what it must never do, and get to know the recorded test data.
---

## The problem

This is the capstone of the AI Engineer track. You'll take one LLM feature all the way from design to production monitoring, using the habits from the track: validated outputs, rules in code, retrieval, evaluation, red-teaming, release gates and alerts.

The company is **Shieldline Insurance**, the motor insurer from the Business Analyst Capstone. Its claims were slow partly because customers sent incomplete information and then heard nothing. Most customers already message Shieldline on WhatsApp, so the head of claims has asked for an assistant that:

1. reads a customer's first message about an incident and turns it into a **structured claim** (type, date, plate number, injuries, police report);
2. tells the customer exactly which **documents** are still needed;
3. answers **policy questions** from the policy wording;
4. hands anything serious to a **person**.

The team has already run three configurations over 600 real messages and recorded every output, so you can evaluate them without an API key.

## The concept

### The model reads; code decides

An LLM is good at reading messy text, including Pidgin, and at writing a clear reply from a source. It is not reliable at enforcing rules. So split the work:

| The model does | Code does |
| :-- | :-- |
| Extract fields from the message | Validate every field, and reject or repair what's wrong |
| Answer questions **from retrieved policy text** | Decide which documents are needed, from the policy table |
| Suggest whether a person is needed | Escalate by rule: injuries, theft, large amounts, anger, or any output that fails validation |

![The model reads and extracts while code validates and decides; a four-step flow from message to reply or person, and the things the assistant must never do](/images/courses/ai-capstone/model-reads-code-decides.svg "The model reads; code decides.")

### What it must never do

Approve, reject or promise payment for a claim; quote an amount Shieldline will pay; reveal anything about another customer; or answer from memory when the policy doesn't say.

### The test data

`messages.csv` holds 600 messages with **gold** labels (what a claims officer extracted) and the recorded outputs of three configurations:

| Configuration | What it is |
| :-- | :-- |
| `small_v1` | A small, cheap model with a short prompt |
| `large_v1` | A large model with the same prompt |
| `large_v2` | The large model with a JSON schema, three worked examples and today's date in the prompt |

## Example

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/assistant/"
messages = pd.read_csv(base + "messages.csv", keep_default_na=False)
print(f"{len(messages)} messages")
print(messages["language"].value_counts().to_string(), "\n")
print(messages["gold_claim_type"].value_counts().to_string(), "\n")
print(f"Need a person (gold): {messages['gold_needs_human'].mean():.1%}")
```

```text
600 messages
language
English    482
Pidgin     118

gold_claim_type
Accident damage    250
Windscreen         180
Third party         90
Theft               80

Need a person (gold): 36.0%
```

One message, and what each configuration made of it:

```python
example = messages[messages["message_id"] == "MSG-0001"].iloc[0]
print(example["text"], "\n")
for config in ["small_v1", "large_v1", "large_v2"]:
    print(f"{config}: {example[config + '_output']}")
```

```text
Good morning o, stone break my windscreen on 26/06/2026 for Wuse 2. Na Lexus RX 350, number na FKJ 471 KT. Mechanic talk say e go cost like ₦275k. Which document una need?

small_v1: {"claim_type":"Windscreen","incident_date":"2026-06-26","vehicle_reg":"FKJ 471 KT","injuries":false,"police_report":false,"needs_human":false}
large_v1: {"claim_type":"Windscreen","incident_date":"2026-06-26","vehicle_reg":"FKJ 471 KT","injuries":false,"police_report":false,"needs_human":false}
large_v2: {"claim_type":"Windscreen","incident_date":"2026-06-26","vehicle_reg":"FKJ471KT","injuries":false,"police_report":false,"needs_human":false}
```

All three got this one essentially right, but notice `large_v2` wrote the plate without spaces. Small differences like that matter when the plate is matched against Shieldline's policy records. The rest of this course measures them properly.

## Walkthrough

1. Download the dataset below and open `messages.csv` in Colab.
2. Read twenty messages, including some in Pidgin. What makes them hard to extract?
3. Draw the design: message in, model calls, the checks in code, and the three ways out (reply with a checklist, answer a question, hand to a person).
4. List what the assistant must never do, and where in the design each rule is enforced.
5. Write the design note (the task below).

## Practice

```dataset
{"dataset": "assistant", "files": ["messages", "policy", "questions", "redteam", "daily"]}
```

```answer
{
  "id": "aic-01-p1",
  "prompt": "What percentage of the 600 messages need a **person** according to the gold labels? One decimal place.",
  "answer": 36.0,
  "format": "percent",
  "dataset": "assistant",
  "files": ["messages"],
  "pyVerify": "round(100 * messages['gold_needs_human'].mean(), 1)",
  "hint": "The last line of the first cell.",
  "required": true
}
```

```answer
{
  "id": "aic-01-p2",
  "prompt": "How many of the messages are in **Pidgin**?",
  "answer": 118,
  "format": "number",
  "dataset": "assistant",
  "files": ["messages"],
  "pyVerify": "int((messages['language'] == 'Pidgin').sum())",
  "hint": "The language counts.",
  "required": true
}
```

```task
{
  "id": "aic-01-t1",
  "prompt": "Write the **design note** (70 to 160 words): what the **model** does, what **code** decides, when a **person** takes over, and at least **three** things the assistant must **never** do.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "The model ...\nCode ...",
  "rules": [
    { "label": "Says what the model does (extract, read, answer)", "pattern": "extract|read|answer" },
    { "label": "Says what code decides (validate, rules, checklist)", "pattern": "validat|rule|checklist|code" },
    { "label": "Says when a person takes over (escalate, hand over)", "pattern": "escalat|hand (it )?(to|over)|person|human" },
    { "label": "Lists things it must never do", "pattern": "never|must not|mustn't", "min": 1 },
    { "label": "Covers approving or promising payment", "pattern": "approv|promis|pay" },
    { "label": "Covers other customers' data", "pattern": "other customer|another customer|personal data|someone else" },
    { "label": "Between 70 and 160 words", "minWords": 70, "maxWords": 160 }
  ],
  "sample": "The model reads the customer's message and extracts the claim type, incident date, plate number, injuries and police report as JSON. It also answers policy questions, but only from policy sections retrieved for that question.\nCode validates every field and repairs or rejects bad ones, works out the documents still needed from the policy table, and decides escalation by rule.\nA person takes over for injuries, theft, amounts of ₦5m or more, angry customers, and any output that fails validation.\nThe assistant must never approve, reject or promise payment for a claim; never quote what Shieldline will pay; never reveal anything about another customer; and never answer from memory when the policy doesn't cover the question.",
  "note": "Every \"never\" needs a place in the design where it's enforced, ideally in code.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why should code, not the model, decide which documents a customer must send?",
    "options": ["Code is faster", "The rules are fixed and known, and code applies them the same way every time", "The model can't read", "To save tokens only"],
    "answer": 1,
    "explanation": "Deterministic rules belong in code."
  },
  {
    "prompt": "Why record the outputs of each configuration on 600 messages?",
    "options": ["For storage", "So every configuration can be evaluated on the same inputs, repeatedly, without calling the API", "Because it's required by law", "To train the model"],
    "answer": 1,
    "explanation": "A fixed evaluation set makes comparisons fair and repeatable."
  },
  {
    "prompt": "Which of these should the assistant never do?",
    "options": ["Ask for a missing photo", "Promise the customer their claim will be paid", "Answer a question about the excess from the policy", "Hand an injury case to a person"],
    "answer": 1,
    "explanation": "Decisions on claims stay with people."
  }
]
```
