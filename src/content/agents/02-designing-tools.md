---
title: Designing tools
minutes: 25
summary: Write the tools an agent can call, with clear names, descriptions and input schemas, scoped to the customer being served, and returning errors as data the model can act on.
---

## The problem

v1 of Paystream's agent had a tool called `get_transfer(transfer_id)`. It did what it said: given any transfer ID, it returned the transfer. So when a customer asked about a transfer ID that belonged to **someone else**, the agent looked it up and read another customer's transaction details back to them.

The model didn't "hack" anything. The tool allowed it. Tool design is where most of an agent's safety is won or lost: the model can only do what its tools let it do.

## The concept

### A tool definition has three parts

- a **name** the model uses to call it (`get_transfer`);
- a **description** that tells the model when and how to use it: this is a prompt, and it matters as much as any prompt;
- an **input schema** (JSON Schema) listing the arguments, their types and which are required.

### Principles for good tools

| Principle | Example |
| :-- | :-- |
| **Scope to the user** | `get_transfer(account_id, transfer_id)` returns a transfer only if it belongs to that account; the `account_id` comes from the logged-in session, not from the model |
| **Narrow, single-purpose** | `freeze_card` rather than `update_account(any_field, any_value)` |
| **Errors as data** | return `{"error": "not_found"}` so the model can ask the customer to check the ID, rather than crashing |
| **Return what's needed** | the status and amount, not the full record with other people's details |
| **Validate inputs** | reject a transfer ID that isn't in the right format before touching the database |

![A JSON tool definition for get_transfer with its name, description and input schema, beside a list of good-tool principles. account_id comes from the session, not from the model.](/images/courses/agents/tool-definition.svg "A tool definition has three parts; the description is a prompt in itself.")

## Example

The tool definitions as the model sees them (Anthropic's format):

```python
TOOLS = [
    {
        "name": "get_account",
        "description": "Get the logged-in customer's account: tier, account status and card status.",
        "input_schema": {"type": "object", "properties": {}, "required": []},
    },
    {
        "name": "get_transfer",
        "description": "Look up one of the customer's own transfers by its ID (format TRF followed by 6 digits). "
                       "Returns not_found if the transfer doesn't exist or isn't theirs.",
        "input_schema": {
            "type": "object",
            "properties": {"transfer_id": {"type": "string", "pattern": "^TRF[0-9]{6}$"}},
            "required": ["transfer_id"],
        },
    },
]
print([t["name"] for t in TOOLS])
```

```text
['get_account', 'get_transfer']
```

Notice what's missing: `account_id` isn't an argument. The code that runs the tool fills it in from the logged-in session, so the model can't ask about anyone else. Here are the tools themselves, running on the data:

```python
import re
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/agents/"
accounts = pd.read_csv(base + "accounts.csv").set_index("account_id")
transfers = pd.read_csv(base + "transfers.csv").set_index("transfer_id")
requests = pd.read_csv(base + "requests.csv")

def get_account(session_account):
    a = accounts.loc[session_account]
    return {"tier": int(a["tier"]), "status": a["status"], "card_status": a["card_status"]}

def get_transfer(session_account, transfer_id):
    if not re.fullmatch(r"TRF\d{6}", str(transfer_id)):
        return {"error": "invalid_id", "message": "Transfer IDs look like TRF123456."}
    if transfer_id not in transfers.index or transfers.loc[transfer_id, "account_id"] != session_account:
        return {"error": "not_found", "message": "No transfer with that ID on this account."}
    t = transfers.loc[transfer_id]
    return {"transfer_id": transfer_id, "created_at": t["created_at"], "amount_ngn": int(t["amount_ngn"]),
            "status": t["status"], "reversed_at": None if pd.isna(t["reversed_at"]) else t["reversed_at"]}

requests["transfer_id"] = requests["message"].str.extract(r"(TRF\d{6})")[0]
r = requests.dropna(subset=["transfer_id"]).iloc[0]
print(get_transfer(r["account_id"], r["transfer_id"]))
print(get_transfer(r["account_id"], "TRF400001"))
print(get_transfer(r["account_id"], "12345"))
```

```text
{'transfer_id': 'TRF401805', 'created_at': '2026-09-10 06:31', 'amount_ngn': 34000, 'status': 'failed', 'reversed_at': None}
{'error': 'not_found', 'message': 'No transfer with that ID on this account.'}
{'error': 'invalid_id', 'message': 'Transfer IDs look like TRF123456.'}
```

The second call asks for a real transfer that belongs to another customer, and gets the same `not_found` as a transfer that doesn't exist. That's deliberate: saying "that transfer belongs to someone else" would itself leak information.

## Walkthrough

1. Run the cells. Call `get_transfer` for every request with a transfer ID, and count how many return `not_found`.
2. Find a request where the ID belongs to another customer. What would v1's tool have returned?
3. Change `get_transfer` to return the narration too. Should it? (Lesson 8 returns to this.)
4. Write the definition for a `freeze_card` tool (the task below).

## Practice

```answer
{
  "id": "agt-02-p1",
  "prompt": "Using the scoped `get_transfer`, how many requests that mention a transfer ID get **not_found**?",
  "answer": 12,
  "format": "number",
  "dataset": "agents",
  "files": ["accounts", "transfers", "requests"],
  "pyVerify": "int(sum(get_transfer(a, t).get('error') == 'not_found' for a, t in requests.dropna(subset=['transfer_id'])[['account_id', 'transfer_id']].itertuples(index=False)))",
  "hint": "Loop over the requests with a transfer ID and count the not_found errors.",
  "required": true
}
```

```task
{
  "id": "agt-02-t1",
  "prompt": "Write the **tool definition** for `freeze_card` as JSON with a **name**, a **description** (when to use it, and what it does **not** do) and an **input_schema**. Don't let the model choose whose card is frozen.",
  "minutes": 8,
  "rows": 12,
  "placeholder": "{\n  \"name\": \"freeze_card\",\n  ...",
  "rules": [
    { "label": "Named freeze_card", "pattern": "\"name\"\\s*:\\s*\"freeze_card\"" },
    { "label": "Has a description", "pattern": "\"description\"\\s*:\\s*\"[^\"]{40,}" },
    { "label": "Description says when to use it (lost, stolen)", "pattern": "lost|stolen|missing" },
    { "label": "Description says what it doesn't do", "pattern": "does not|doesn't|never|not (unfreeze|refund|cancel)" },
    { "label": "Has an input_schema", "pattern": "\"input_schema\"" },
    { "label": "No account_id or card number for the model to fill in", "pattern": "\"(account_id|card_number|customer_id)\"\\s*:\\s*\\{", "absent": true }
  ],
  "sample": "{\n  \"name\": \"freeze_card\",\n  \"description\": \"Freeze the logged-in customer's card when they report it lost or stolen. Freezing blocks new card payments straight away and can be undone by the customer in the app. It does not cancel the card, refund any payment or affect transfers.\",\n  \"input_schema\": {\n    \"type\": \"object\",\n    \"properties\": {\n      \"reason\": {\"type\": \"string\", \"enum\": [\"lost\", \"stolen\", \"suspicious_activity\"]}\n    },\n    \"required\": [\"reason\"]\n  }\n}",
  "note": "The only argument is a reason, from a fixed list. Whose card it is comes from the session, so the model can't freeze anyone else's.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "v1's get_transfer returned any transfer by ID. What was the flaw?",
    "options": ["It was too slow", "It wasn't scoped to the customer, so the agent could read other customers' transfers", "It had no description", "It returned errors"],
    "answer": 1,
    "explanation": "Scope tools to the user, with the account taken from the session."
  },
  {
    "prompt": "Why return {\"error\": \"not_found\"} instead of raising an exception?",
    "options": ["Exceptions are slow", "The model can read the error and respond sensibly, such as asking the customer to check the ID", "It hides bugs", "JSON is required"],
    "answer": 1,
    "explanation": "Errors are information for the model."
  },
  {
    "prompt": "Why is a tool's description important?",
    "options": ["It isn't", "The model decides when and how to use the tool from it, so it works like a prompt", "It's shown to customers", "It sets the price"],
    "answer": 1,
    "explanation": "Write descriptions as carefully as prompts."
  }
]
```
