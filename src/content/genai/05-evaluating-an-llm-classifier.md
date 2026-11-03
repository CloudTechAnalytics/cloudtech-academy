---
title: Evaluating an LLM classifier
minutes: 25
summary: Measure an LLM's classifications against human labels, compare a small model, a large model and a classic machine learning baseline, and find where each one fails.
---

## The problem

Paystream's team ran its triage prompt on 900 past tickets with two models: a small, cheap one and a large one. A support lead had already labelled every ticket with its true category. Now the question is: which approach should run in production? The large model? The small one? Or, as one analyst suggests, a simple classifier trained on the labelled tickets, with no LLM at all?

That last suggestion often surprises people, and it's exactly why you measure. An LLM is one tool among several. When you have labelled examples and stable categories, a classic model can be cheaper, faster and almost as accurate.

## The concept

### A labelled test set is non-negotiable

You can't judge an LLM feature without examples where the right answer is known. Build one early: a few hundred real inputs, labelled by people who know the business. Use it for every prompt and model change.

### Measures

- **Accuracy**: share of tickets classified correctly.
- **Per-category recall**: of the tickets that really are fraud, how many did the model call fraud? For high-stakes categories, this matters more than overall accuracy.
- **Confusion**: which categories get mixed up with which.

### The baseline: TF-IDF and logistic regression

**TF-IDF** turns each text into numbers by weighting the words it contains (common words like "the" count little; distinctive words like "reversal" count a lot). A logistic regression trained on those numbers is a fast, cheap text classifier. Train it on part of the labelled tickets and test it on the rest, alongside the LLMs on the same tickets.

### When each wins

| Approach | Strengths | Weaknesses |
| :-- | :-- | :-- |
| Classic classifier | cheap, fast, consistent, runs anywhere | needs labelled examples; struggles with new phrasings and new categories |
| LLM | works with few or no examples; handles unusual wording; easy to add categories | costs per call; slower; outputs need validation; can be manipulated |

## Example

```python
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

tickets = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/genai/tickets.csv")
print("Small model accuracy (all 900):", round((tickets["small_model_category"] == tickets["true_category"]).mean(), 3))
print("Large model accuracy (all 900):", round((tickets["large_model_category"] == tickets["true_category"]).mean(), 3))

train, test = train_test_split(tickets, test_size=0.3, random_state=42, stratify=tickets["true_category"])
vectoriser = TfidfVectorizer(ngram_range=(1, 2))
baseline = LogisticRegression(max_iter=2000).fit(vectoriser.fit_transform(train["text"]), train["true_category"])
test = test.assign(baseline_category=baseline.predict(vectoriser.transform(test["text"])))

for col in ["baseline_category", "small_model_category", "large_model_category"]:
    print(f"{col} on the same {len(test)} test tickets:", round((test[col] == test["true_category"]).mean(), 3))
```

```text
Small model accuracy (all 900): 0.798
Large model accuracy (all 900): 0.893
baseline_category on the same 270 test tickets: 0.867
small_model_category on the same 270 test tickets: 0.789
large_model_category on the same 270 test tickets: 0.885
```

On these tickets, a classic classifier trained on 630 labelled examples lands close to the large model and ahead of the small one. Now look at the category that matters most:

```python
recall = test.groupby("true_category").apply(
    lambda g: pd.Series({col: (g[col] == g.name).mean() for col in ["baseline_category", "small_model_category", "large_model_category"]}),
    include_groups=False,
)
recall.round(2)
```

```text
baseline_category  small_model_category  large_model_category
true_category
Account access                           0.96                  0.86                  0.88
Cards                                    0.84                  0.90                  0.87
Cash-out agent                           0.78                  0.78                  0.83
Failed or pending transfer               0.98                  0.78                  0.92
Fees and charges                         0.70                  0.85                  0.89
Fraud or scam                            0.84                  0.64                  0.96
Savings                                  0.60                  0.60                  0.75
Verification and limits                  0.91                  0.77                  0.91
```

Overall accuracy hides differences by category. Which model misses the most fraud reports is the number the head of support will ask about first.

## Walkthrough

1. Run the cells. Build a confusion table for the large model: `pd.crosstab(test["true_category"], test["large_model_category"])`.
2. Read ten tickets the large model got wrong. Are they mistakes, or genuinely ambiguous tickets (two issues, or too vague)?
3. Train the baseline on only 100 tickets. How does it compare with the LLMs now?
4. Decide which approach you'd recommend, and what would change your mind.

## Practice

```answer
{
  "id": "gen-05-p1",
  "prompt": "What is the **large model's** accuracy across all 900 tickets? As a percentage, one decimal place.",
  "answer": 89.3,
  "format": "percent",
  "dataset": "genai",
  "files": ["tickets"],
  "pyVerify": "round((tickets['large_model_category'] == tickets['true_category']).mean() * 100, 1)",
  "hint": "The second line printed.",
  "required": true
}
```

```answer
{
  "id": "gen-05-p2",
  "prompt": "What is the **TF-IDF baseline's** accuracy on the 270 test tickets? As a percentage, one decimal place.",
  "answer": 86.7,
  "format": "percent",
  "dataset": "genai",
  "files": ["tickets"],
  "pyVerify": "round((test['baseline_category'] == test['true_category']).mean() * 100, 1)",
  "hint": "The baseline line in the first output.",
  "required": true
}
```

```task
{
  "id": "gen-05-t1",
  "prompt": "Write a recommendation (50 to 130 words) on which approach should sort Paystream's tickets: the **accuracies** you compared, **fraud recall**, and at least **two** factors beyond accuracy (cost, speed, new categories, labelled data, manipulation).",
  "minutes": 6,
  "rows": 6,
  "placeholder": "I recommend ...",
  "rules": [
    { "label": "Recommends an approach", "pattern": "recommend" },
    { "label": "Gives at least two accuracy figures", "pattern": "\\d+(\\.\\d+)?\\s*%", "min": 2 },
    { "label": "Mentions fraud", "pattern": "fraud" },
    { "label": "Names at least two other factors", "pattern": "cost|cheap|speed|fast|latency|new categor|label|manipulat|inject|maintain", "min": 2 },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "I recommend starting with the large model, checked by validation, with the classic classifier as a cheap fallback. On the same 270 test tickets, the large model was right about 89% of the time, the classifier about 87% and the small model about 79%. The large model also missed the fewest fraud reports, which matters most. The classifier is much cheaper and faster but needs re-training whenever categories change, while the LLM only needs a prompt update. Whichever runs, fraud keywords should always send a ticket to a person, because no model should be the only check on a fraud report.",
  "note": "The final sentence is the important design choice: a rule-based safety net for the highest-stakes category, independent of the model.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What must you have before you can evaluate an LLM classifier?",
    "options": ["A larger model", "A labelled test set of real examples", "A longer prompt", "A GPU"],
    "answer": 1,
    "explanation": "Without known answers, there's nothing to measure against."
  },
  {
    "prompt": "A model is 90% accurate overall but catches only 70% of fraud reports. What matters for the business?",
    "options": ["The 90%", "The fraud recall, because missed fraud costs most", "Neither", "The average of both"],
    "answer": 1,
    "explanation": "Look at the categories with the highest stakes."
  },
  {
    "prompt": "When can a classic text classifier be a better choice than an LLM?",
    "options": ["Never", "When there are plenty of labelled examples and stable categories, and cost or speed matter", "Only for images", "When there's no labelled data"],
    "answer": 1,
    "explanation": "Measure both; don't assume the LLM wins."
  }
]
```
