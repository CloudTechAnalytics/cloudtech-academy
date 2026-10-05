---
title: "Final project: Paystream's support assistant"
minutes: 20
summary: Plan your final project, a support assistant prototype with ticket triage and grounded answers, evaluated honestly and made safe, and set up the evaluation harness first.
---

## The problem

Paystream's head of support wants a decision in a month: should the company launch an AI support assistant, and if so, which design? Your final project is the prototype and, more importantly, the evidence: how accurate it is, where it fails, what it costs, and what keeps it safe.

Experienced AI engineers build the **evaluation harness first**, before the feature itself. If you can't measure it, you can't improve it, and you can't tell the head of support whether it's ready.

## The concept

### The prototype has two parts

| Part | What it does | Evaluated with |
| :-- | :-- | :-- |
| **Ticket triage** | classifies each ticket into a category, with validation and a fraud safety net | accuracy and per-category recall on labelled tickets |
| **Help answers** | answers customer questions from retrieved help articles, with citations and refusals | retrieval hit rate, human grades, automatic citation checks, a checked LLM judge |

### The evaluation harness

A single notebook section that, given a version of the system, produces the same table every time: accuracy, fraud recall, retrieval hit@3, correct-answer rate, refusal accuracy, failure rate and cost per 1,000 requests. Run it on every change and keep the history.

### The decision

Launch, launch with limits (for example, triage only, with people answering), or don't launch yet, with the evidence for each.

## Example

The start of an evaluation harness: one function that summarises triage quality for any column of predicted categories.

```python
import pandas as pd

tickets = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/genai/tickets.csv")

def triage_report(df, predicted):
    fraud = df[df["true_category"] == "Fraud or scam"]
    return pd.Series({
        "accuracy": round((df[predicted] == df["true_category"]).mean(), 3),
        "fraud_recall": round((fraud[predicted] == "Fraud or scam").mean(), 3),
        "tickets": len(df),
    })

pd.DataFrame({col: triage_report(tickets, col) for col in ["small_model_category", "large_model_category"]}).T
```

```text
accuracy  fraud_recall  tickets
small_model_category     0.798         0.723    900.0
large_model_category     0.893         0.892    900.0
```

Every later version of the triage system gets a row in this table. Add a column for the classic baseline from lesson 5, and one for your own prompt if you have an API key.

## Walkthrough

1. Build the harness: triage report, retrieval hit rates and answer-grade summaries, in one place.
2. Add the safety layers from lesson 9 and measure them: redaction coverage and injection flags.
3. If you have an API key, run your own prompt version on a sample and add it to the table.
4. Open the project brief on the course page and plan the write-up.

## Practice

```dataset
{"dataset": "genai", "files": ["articles", "questions", "tickets", "answer_evals"]}
```

```answer
{
  "id": "gen-10-p1",
  "prompt": "What is the **small model's fraud recall** across all tickets? As a percentage, one decimal place.",
  "answer": 72.3,
  "format": "percent",
  "dataset": "genai",
  "files": ["tickets"],
  "pyVerify": "round(triage_report(tickets, 'small_model_category')['fraud_recall'] * 100, 1)",
  "hint": "The fraud_recall value in the small model's row.",
  "required": true
}
```

```task
{
  "id": "gen-10-t1",
  "prompt": "Write the **launch recommendation** for the head of support (80 to 180 words): **launch, launch with limits, or not yet**, with the evidence (at least **three** numbers from your evaluations), the main **risk**, and the **safeguards** that would be in place.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "We recommend launching with limits ...",
  "rules": [
    { "label": "Makes a clear choice (launch, with limits, not yet)", "pattern": "launch|not yet|pilot" },
    { "label": "Uses at least three numbers", "pattern": "\\d+(\\.\\d+)?\\s*%|\\b\\d+(\\.\\d+)?\\b", "min": 3 },
    { "label": "Names a risk", "pattern": "risk" },
    { "label": "Lists safeguards (review, fraud, redact, validation, monitor)", "pattern": "review|fraud|redact|validat|monitor|human", "min": 2 },
    { "label": "Between 80 and 180 words", "minWords": 80, "maxWords": 180 }
  ],
  "sample": "We recommend launching with limits. Ticket triage with the large model is ready: it classified about 89% of tickets correctly and caught most fraud reports, against about 80% for the small model. Customer answers are promising but not yet ready to go to customers unsupervised: with retrieval, about 77% of answers were fully correct and most unanswerable questions were refused, but some were still wrong or only partly correct, and our automated judge overrates partly correct answers. So for three months, the assistant drafts answers that agents approve before sending. The main risk is a confident wrong answer about money. Safeguards: personal data redacted before sending, fraud keywords always routed to the fraud team, outputs validated, injection attempts flagged, and a weekly human review of a sample, with launch to customers once correct answers exceed 90% for a month.",
  "note": "The recommendation ends with the condition for the next step. That turns a cautious answer into a plan.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why build the evaluation harness before the feature?",
    "options": ["It's quicker", "So every version can be measured the same way from the start, and progress is evidence, not impressions", "Harnesses are required by providers", "To avoid writing prompts"],
    "answer": 1,
    "explanation": "If you can't measure it, you can't improve it or decide on it."
  },
  {
    "prompt": "Answers are 80% correct and wrong answers involve money. What's a sensible launch?",
    "options": ["Launch to all customers", "Launch with limits: agents approve drafted answers until quality is proven", "Never launch", "Launch with a disclaimer only"],
    "answer": 1,
    "explanation": "Match autonomy to measured reliability and stakes."
  },
  {
    "prompt": "Which belongs in an AI feature's launch decision?",
    "options": ["Only accuracy", "Accuracy on high-stakes cases, failure modes, cost, privacy and safety controls", "Only cost", "The model's name"],
    "answer": 1,
    "explanation": "A launch decision weighs the whole system."
  }
]
```
