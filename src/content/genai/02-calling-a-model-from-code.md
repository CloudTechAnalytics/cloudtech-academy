---
title: Calling a model from code
minutes: 15
summary: Call an LLM from Python through an API, keep your key safe, control the output with system prompts, temperature and token limits, and estimate what a feature will cost before you build it.
---

## The problem

Chat interfaces are fine for trying ideas. A product feature (sorting 900 tickets a month, answering customers inside the app) needs the model called from code: automatically, consistently, with the same instructions every time, and with its outputs checked and stored.

That means an **API**: your code sends a request to the model provider and gets a response back. It also means two responsibilities chat users never think about: keeping the API key secret, and knowing what each request costs before the bill arrives.

## The concept

### The parts of a request

| Part | What it does |
| :-- | :-- |
| **Model** | which model to use: larger ones are more capable, smaller ones faster and cheaper |
| **System prompt** | standing instructions: the model's role, rules and output format |
| **Messages** | the conversation: the user's input (and earlier turns, if any) |
| **max_tokens** | the most tokens the model may write in its answer |
| **temperature** | randomness: low for consistent, factual tasks |

### Keep keys out of code

An API key is a password that spends money. Never type it into a notebook or commit it to GitHub. In Google Colab, store it under **Secrets** (the key icon) and read it with `userdata.get(...)`. Anyone who gets your key can run up charges on your account.

### Estimating cost

Providers charge per million tokens, with output tokens usually priced several times higher than input. For a feature:

> monthly cost = requests per month × (input tokens × input price + output tokens × output price)

Always use the provider's **current** price list. The prices in this course are illustrative assumptions for practice, not real prices.

![A request box with model, system, messages, max_tokens and temperature, an arrow to a response box with the generated text and token usage, and a warning to keep the API key in Colab Secrets.](/images/courses/genai/request-anatomy.svg "The parts of a request, and what you pay for in the response.")

## Example

This is how a call looks with Anthropic's Python library. It's marked so that it isn't run here; to try it, install `anthropic`, add your own key as a Colab secret called `ANTHROPIC_API_KEY`, and run it in your notebook.

```python norun
# pip install anthropic
import anthropic
from google.colab import userdata

client = anthropic.Anthropic(api_key=userdata.get("ANTHROPIC_API_KEY"))

response = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=200,
    temperature=0,
    system="You are Paystream's support assistant. Answer in two sentences or fewer.",
    messages=[{"role": "user", "content": "How long does a failed transfer take to be reversed?"}],
)
print(response.content[0].text)
print(response.usage.input_tokens, "input tokens,", response.usage.output_tokens, "output tokens")
```

Notice the last line: every response tells you how many tokens it used. Log those numbers; they're your real cost data.

Before building, estimate. Here's a cost model for classifying every ticket, with **illustrative** prices in naira per million tokens:

```python
import pandas as pd

tickets = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/genai/tickets.csv")

PRICES = {  # illustrative only: naira per million tokens (input, output)
    "small model": (1_600, 8_000),
    "large model": (4_800, 24_000),
}
output_tokens = 15  # a category name in JSON

def monthly_cost(model, tickets_per_month=900):
    input_price, output_price = PRICES[model]
    per_ticket = tickets["input_tokens"].mean() * input_price / 1e6 + output_tokens * output_price / 1e6
    return per_ticket * tickets_per_month

for model in PRICES:
    print(f"{model}: about ₦{monthly_cost(model):,.0f} a month for 900 tickets")
```

```text
small model: about ₦506 a month for 900 tickets
large model: about ₦1,519 a month for 900 tickets
```

At this volume, both are cheap: even the large model costs about ₦1,500 a month on these assumed prices. Cost only becomes the deciding factor at much larger volumes, or when each request carries long documents. Lesson 9 weighs cost against accuracy properly.

## Walkthrough

1. If you have an API key, run the call in Colab and change the system prompt. How does the answer change?
2. Run the cost model. Then change the volume to 100,000 tickets a month.
3. Estimate the cost of an answer-generation request: 250 tokens of instructions, 3 articles of about 90 tokens each, a 20-token question, and a 120-token answer.
4. Write down where your team would store API keys, and who could see them.

## Practice

```answer
{
  "id": "gen-02-p1",
  "prompt": "With the illustrative prices, what would the **large model** cost per month to classify **900** tickets? Round to the nearest naira.",
  "answer": 1519,
  "format": "naira",
  "dataset": "genai",
  "files": ["tickets"],
  "pyVerify": "round(monthly_cost('large model'))",
  "hint": "The second line printed.",
  "required": true
}
```

```task
{
  "id": "gen-02-t1",
  "prompt": "A colleague's notebook contains `client = anthropic.Anthropic(api_key=\"sk-ant-...\")` and they plan to share it on GitHub. Write a short message (30 to 100 words) explaining the **risk**, what to do **now**, and how to store the key **properly**.",
  "minutes": 4,
  "rows": 5,
  "placeholder": "Please don't share that notebook yet ...",
  "rules": [
    { "label": "Explains the risk (charges, spend, misuse, anyone)", "pattern": "charge|spend|cost|misuse|anyone|bill" },
    { "label": "Says to revoke or rotate the exposed key", "pattern": "revoke|rotate|delete the key|new key|regenerate" },
    { "label": "Says where to store it (secrets, environment variable)", "pattern": "secret|environment variable|env var|key vault|\\.env" },
    { "label": "Between 30 and 100 words", "minWords": 30, "maxWords": 100 }
  ],
  "sample": "Please don't share that notebook yet: the API key is in the code, and anyone who sees it can make requests that are charged to our account. Because it's already been saved in the notebook, revoke that key in the provider's console now and create a new one. Then store the new key in Colab's Secrets (or an environment variable on a server) and read it with userdata.get, so it never appears in the code or on GitHub.",
  "note": "Revoking matters even if the notebook was never shared: keys leak through version history, screenshots and copies.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Where should an API key live in a Colab notebook?",
    "options": ["In a code cell", "In Colab's Secrets, read with userdata.get", "In a markdown cell", "In the file name"],
    "answer": 1,
    "explanation": "Keys in code end up in shared notebooks and on GitHub."
  },
  {
    "prompt": "Which setting makes outputs more consistent for classification?",
    "options": ["A high temperature", "A low temperature, near 0", "A large max_tokens", "A longer system prompt"],
    "answer": 1,
    "explanation": "Low temperature reduces randomness."
  },
  {
    "prompt": "Why log the token counts every response returns?",
    "options": ["For fun", "They're the real cost data, for checking estimates and spotting runaway usage", "The API requires it", "To train the model"],
    "answer": 1,
    "explanation": "Measure cost, don't guess it."
  }
]
```
