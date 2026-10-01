---
title: Embeddings and search
minutes: 15
summary: Turn text into vectors, find the most relevant documents for a question, measure retrieval with hit rate, and set a threshold for questions the documents can't answer.
---

## The problem

The assistant must answer from Paystream's help articles, not from memory. With 25 articles, you could send them all with every question. With 2,500, you can't: they won't fit, and the cost and delay would be huge. And sending everything isn't even the best option when it fits: the model answers better with the few articles that matter than with a pile of irrelevant ones.

So before the model sees a question, a **search** step must find the most relevant articles. That's **retrieval**, and its quality limits everything after it: if the right article isn't retrieved, the model can't use it.

## The concept

**Vectors for text**

To search by meaning, each text is turned into a vector of numbers so that similar texts get similar vectors. Similarity between two vectors is measured with **cosine similarity** (1 = same direction, 0 = unrelated).

- **TF-IDF** vectors are built from the words themselves. They're fast and need no model, and they work well when questions and articles use the same words.
- **Embeddings** are vectors produced by a neural network trained so that texts with similar **meaning** are close, even with different words ("my money hasn't come back" ≈ "reversal"). In production, they're usually better. You get them from an embeddings model, through a provider's API or an open-source model.

This lesson uses TF-IDF because it runs anywhere without a key. The method (vectorise, compare, rank, measure) is identical with embeddings.

**Measuring retrieval**

With a labelled question set (each question linked to the article that answers it):

- **hit@1**: share of questions where the right article is ranked first;
- **hit@3**: share where it's in the top three (what you'd send to the model).

**Questions with no answer**

Some questions aren't covered by any article. Their best match usually has a **low similarity**. A threshold ("if the best match is below 0.15, don't answer from the articles") lets the assistant say it can't help instead of answering from a weak match.

## Example

```python
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

base = "https://academy.cloudtechanalytics.com/datasets/genai/"
articles = pd.read_csv(base + "articles.csv")
questions = pd.read_csv(base + "questions.csv")

vectoriser = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), sublinear_tf=True)
article_vectors = vectoriser.fit_transform(articles["title"] + " " + articles["body"])

def search(question, k=3):
    scores = (vectoriser.transform([question]) @ article_vectors.T).toarray()[0]
    top = np.argsort(-scores)[:k]
    return [(articles.loc[i, "article_id"], articles.loc[i, "title"], float(round(scores[i], 3))) for i in top]

search("money left my account but the transfer failed")
```

```text
[('KB006', 'My transfer failed but I was debited', 0.284), ('KB008', 'I sent money to the wrong account', 0.138), ('KB007', 'My transfer is pending', 0.113)]
```

Now measure retrieval on every answerable question, and look at the best scores for the unanswerable ones:

```python
answerable = questions[questions["relevant_article_id"].notna()]
ranked = [[a for a, _, _ in search(q, 3)] for q in answerable["question"]]
hit1 = np.mean([r[0] == g for r, g in zip(ranked, answerable["relevant_article_id"])])
hit3 = np.mean([g in r for r, g in zip(ranked, answerable["relevant_article_id"])])
print(f"hit@1 {hit1:.3f}   hit@3 {hit3:.3f}")

best = lambda q: search(q, 1)[0][2]
print("Median best score, answerable questions:  ", round(np.median([best(q) for q in answerable["question"]]), 3))
print("Best scores, unanswerable questions:", [best(q) for q in questions.loc[questions["relevant_article_id"].isna(), "question"]])
```

```text
hit@1 0.787   hit@3 0.920
Median best score, answerable questions:   0.275
Best scores, unanswerable questions: [0.165, 0.13, 0.0, 0.139, 0.0, 0.091, 0.188, 0.13]
```

The right article is in the top three for most questions. TF-IDF can only match shared words, so a question phrased differently from its article is missed, and that's exactly where embeddings help. The unanswerable questions all score below the answerable median, but they overlap with weaker answerable matches: a threshold of 0.15 would catch 6 of the 8, not all of them, and would also wrongly refuse 7 of the 75 answerable questions.

## Walkthrough

1. Run the cells. Search for three questions of your own.
2. Print the questions that missed at hit@3. Rewrite one so that it matches. What does that tell you about TF-IDF?
3. Choose a threshold for "can't answer" from the scores. How many answerable questions would it wrongly refuse?
4. If you have access to an embeddings model, embed the articles and questions and compare hit@3.

## Practice

```answer
{
  "id": "gen-06-p1",
  "prompt": "What is the retrieval **hit@3** on the answerable questions? Three decimal places.",
  "answer": 0.92,
  "tolerance": 0.0011,
  "format": "number",
  "dataset": "genai",
  "files": ["articles", "questions"],
  "pyVerify": "round(hit3, 3)",
  "hint": "The second number on the first line.",
  "required": true
}
```

```answer
{
  "id": "gen-06-p2",
  "prompt": "What is **hit@1**? Three decimal places.",
  "answer": 0.787,
  "tolerance": 0.0011,
  "format": "number",
  "dataset": "genai",
  "files": ["articles", "questions"],
  "pyVerify": "round(hit1, 3)",
  "hint": "The first number on the first line.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why retrieve a few articles instead of sending the whole help centre with every question?",
    "options": ["Models can't read articles", "It costs less, runs faster, scales to large collections and usually gives better answers", "Retrieval is required by the API", "To hide information"],
    "answer": 1,
    "explanation": "Send what matters, not everything."
  },
  {
    "prompt": "What's the main advantage of embeddings over TF-IDF?",
    "options": ["They're free", "They match by meaning, so different words with the same meaning still match", "They're shorter", "They need no model"],
    "answer": 1,
    "explanation": "'Money hasn't come back' can match 'reversal'."
  },
  {
    "prompt": "If the right article isn't in the top 3 retrieved, what happens to the answer?",
    "options": ["The model finds it anyway", "The model can't use it, so the answer will be wrong or a refusal", "Nothing", "The answer improves"],
    "answer": 1,
    "explanation": "Retrieval quality caps answer quality."
  }
]
```
