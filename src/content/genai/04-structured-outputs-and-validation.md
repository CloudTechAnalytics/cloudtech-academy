---
title: Structured outputs and validation
minutes: 25
summary: Get model outputs your code can use, by asking for JSON, validating every response against a schema, and handling the ones that fail instead of trusting them blindly.
---

## The problem

Paystream's triage prompt asks for `{"category": "..."}`. Most of the time that's what comes back. But across thousands of calls, some responses arrive wrapped in a sentence ("Sure! Here's the category: ..."), some use a category that isn't on the list ("Login problem"), and occasionally one is cut off halfway. If the code that routes tickets assumes every response is perfect, a single odd reply can crash the job or send a fraud report to the wrong team.

Any system built on an LLM needs a layer that **checks every output** before it's used. In software, that's validation, and it's one of the most important habits in AI engineering.

## The concept

### Ask for structure

Ask for JSON with a fixed shape, and show the shape in the prompt. Many APIs also support **tool use** or **structured output** modes that make the model fill in a defined schema, which reduces (but doesn't eliminate) malformed responses.

### Validate everything

A schema library such as **pydantic** describes what a valid output looks like, then checks each response:

- Is it valid JSON?
- Does it have the required fields?
- Is each value allowed (for example, one of the defined categories)?

### Handle failures deliberately

| Failure | Typical handling |
| :-- | :-- |
| Extra text around the JSON | extract the `{...}` part and validate again |
| Invalid value | retry once with a reminder of the allowed values |
| Still invalid | send to a person (a "needs review" queue), never guess |

Log every failure: a rising failure rate is an early sign that a prompt change or a model update has broken something.

![A flow: model output, parse JSON, validate, use it. Invalid outputs go to a single retry; if still invalid, a person reviews them.](/images/courses/genai/validation.svg "Parse, validate, retry once, then a person: never guess.")

## Example

Define the schema, then validate a batch of raw responses like the ones a real triage job produces:

```python
import json
import re
from typing import Literal
from pydantic import BaseModel, ValidationError

Category = Literal["Failed or pending transfer", "Fees and charges", "Account access", "Verification and limits",
                   "Cards", "Fraud or scam", "Cash-out agent", "Savings", "Unclear"]

class Triage(BaseModel):
    category: Category

raw_responses = [
    '{"category": "Cards"}',
    'Sure! Here is the category: {"category": "Fraud or scam"}',
    '{"category": "Login problem"}',
    '{"category": "Savings"',
    '{"category": "Fees and charges"}',
    '{"Category": "Cards"}',
]

def parse(raw):
    """Return a valid Triage, or None if the response can't be trusted."""
    match = re.search(r"\{.*\}", raw, re.S)
    if not match:
        return None
    try:
        return Triage.model_validate(json.loads(match.group()))
    except (json.JSONDecodeError, ValidationError):
        return None

results = [parse(r) for r in raw_responses]
for raw, result in zip(raw_responses, results):
    print(f"{'OK    ' if result else 'REVIEW'} {raw}")
print("Valid:", sum(r is not None for r in results), "of", len(results))
```

```text
OK     {"category": "Cards"}
OK     Sure! Here is the category: {"category": "Fraud or scam"}
REVIEW {"category": "Login problem"}
REVIEW {"category": "Savings"
OK     {"category": "Fees and charges"}
REVIEW {"Category": "Cards"}
Valid: 3 of 6
```

The extra sentence around the second response is stripped and the JSON inside is accepted. The invented category, the cut-off response and the wrongly capitalised field name are all rejected. In production, each rejected response would be retried once, then sent to a person.

## Walkthrough

1. Run the cell. Add another bad response of your own and check it's rejected.
2. Add a `confidence` field (a number from 0 to 1) to the schema, and check that a value of 1.5 fails validation.
3. Write a `triage_with_retry` function outline (in comments) for what happens after a failure.
4. Decide what "needs review" means at Paystream: who reviews, and how fast?

## Practice

```answer
{
  "id": "gen-04-p1",
  "prompt": "How many of the six raw responses pass validation?",
  "answer": 3,
  "format": "number",
  "dataset": "genai",
  "files": ["tickets"],
  "pyVerify": "sum(r is not None for r in results)",
  "hint": "The last line printed.",
  "required": true
}
```

```task
{
  "id": "gen-04-t1",
  "prompt": "Write the **failure-handling policy** for Paystream's triage job, one line each starting **Invalid JSON:**, **Unknown category:**, **After one retry:**, **Monitoring:**, with what happens in each case.",
  "minutes": 6,
  "rows": 5,
  "placeholder": "Invalid JSON: ...",
  "rules": [
    { "label": "An Invalid JSON line", "pattern": "^\\s*[-*]?\\s*invalid json\\s*:" },
    { "label": "An Unknown category line", "pattern": "^\\s*[-*]?\\s*unknown category\\s*:" },
    { "label": "An After one retry line that sends to a person", "pattern": "^\\s*[-*]?\\s*after one retry\\s*:[^\\n]*(person|human|agent|review|queue|manual)" },
    { "label": "A Monitoring line with a rate or threshold", "pattern": "^\\s*[-*]?\\s*monitoring\\s*:[^\\n]*(\\d|rate|%|threshold)" }
  ],
  "sample": "Invalid JSON: extract the {...} part and validate again; if there isn't one, retry the request once.\nUnknown category: retry once, adding a reminder of the allowed categories to the prompt.\nAfter one retry: if the response is still invalid, put the ticket in the needs-review queue for a support agent; never guess a category.\nMonitoring: log every failure with the prompt version; alert the team if more than 2% of tickets in a day need review.",
  "note": "The monitoring line catches the silent failures: a model update that changes the output style shows up as a jump in review volume.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A model returns a category that isn't on your list. What should your code do?",
    "options": ["Use it anyway", "Reject it, retry once with the allowed values, then send to a person if still invalid", "Pick the nearest category", "Crash"],
    "answer": 1,
    "explanation": "Never guess silently; route uncertainty to people."
  },
  {
    "prompt": "What does a schema library like pydantic do here?",
    "options": ["Calls the model", "Checks that each response has the right fields and allowed values", "Writes prompts", "Stores API keys"],
    "answer": 1,
    "explanation": "Validation is the guard between the model and the rest of your system."
  },
  {
    "prompt": "Why log validation failures?",
    "options": ["Regulators require it", "A rising failure rate is an early sign that a prompt or model change broke something", "To slow the system", "It's free"],
    "answer": 1,
    "explanation": "Failures are monitoring data."
  }
]
```
