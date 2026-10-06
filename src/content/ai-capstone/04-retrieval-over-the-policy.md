---
title: Retrieval over the policy
minutes: 25
summary: Measure whether the right policy section reaches the model for each customer question, compare the production retriever with a keyword baseline, and find the questions retrieval fails.
---

## The problem

Customers ask policy questions all the time: "Can I use my own mechanic?", "Am I covered if I drive for Bolt?", "How I go know where my claim reach?" The assistant answers from Shieldline's policy wording (`policy.csv`, 20 sections), retrieving the most relevant sections for each question and asking the model to answer **only** from them.

If retrieval brings back the wrong sections, even a perfect model can only guess. So measure retrieval on its own, before judging the answers.

## The concept

### A labelled question set

`questions.csv` holds 80 real customer questions, 20 of them in Pidgin. A claims officer marked the policy section that answers each one (`gold_section_id`). The production retriever's top three sections are recorded in `retrieved_ids`.

### Hit at 3

The share of questions where the gold section is among the three retrieved. The model sees those three sections, so a hit means it at least has the answer in front of it.

### A keyword baseline

TF-IDF with cosine similarity needs no model and no API. If the production retriever, which uses embeddings, can't beat it clearly, it isn't earning its cost.

### Find the failures

Read the questions retrieval misses. Patterns in the misses, such as a language, a topic or a way of asking, tell you what to fix.

![A question goes to a retriever, the top three sections go to the model; hit at three on an invented example; beating a keyword baseline and reading the misses](/images/courses/ai-capstone/retrieval.svg "Measure retrieval on its own, before judging the answers.")

## Example

The production retriever:

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/assistant/"
policy = pd.read_csv(base + "policy.csv")
questions = pd.read_csv(base + "questions.csv")
questions["hit"] = [gold in ids.split(";") for gold, ids in zip(questions["gold_section_id"], questions["retrieved_ids"])]
print(f"Hit at 3: {questions['hit'].sum()} of {len(questions)} questions ({questions['hit'].mean():.1%})")
questions.groupby("language")["hit"].agg(questions="size", hit_at_3="mean").round(3)
```

```text
Hit at 3: 69 of 80 questions (86.2%)
          questions  hit_at_3
language
English          60      0.90
Pidgin           20      0.75
```

The keyword baseline, on the same questions:

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

docs = policy["title"] + ". " + policy["text"]
vectoriser = TfidfVectorizer(stop_words="english").fit(pd.concat([docs, questions["question"]]))
similarity = cosine_similarity(vectoriser.transform(questions["question"]), vectoriser.transform(docs))
top3 = np.argsort(-similarity, axis=1)[:, :3]
questions["tfidf_hit"] = [gold in set(policy["section_id"].iloc[t]) for gold, t in zip(questions["gold_section_id"], top3)]
print(f"TF-IDF hit at 3: {questions['tfidf_hit'].sum()} of {len(questions)}")
questions.groupby("language")[["hit", "tfidf_hit"]].mean().round(3)
```

```text
TF-IDF hit at 3: 60 of 80
           hit  tfidf_hit
language
English   0.90      0.783
Pidgin    0.75      0.650
```

The production retriever beats keywords clearly in English. In Pidgin, both struggle: "motor" for car, "wound" for injured and "jam" for crash share few words with the policy's formal English. The questions the production retriever misses:

```python
questions.loc[~questions["hit"], ["language", "question", "gold_section_id", "retrieved_ids"]]
```

```text
language                                          question gold_section_id retrieved_ids
10  English                   What is the minimum deductible?             S03   S11;S14;S01
23   Pidgin     Person jam my motor, which document una need?             S06   S02;S17;S13
24  English  My car was stolen, what documents should I send?             S07   S08;S10;S19
47   Pidgin       My driver no get licence, una go still pay?             S12   S17;S07;S18
49  English       Should I start my car after it was flooded?             S13   S17;S19;S15
55   Pidgin     Person wound for the accident, wetin I go do?             S14   S01;S16;S19
57  English                   When will my claim be approved?             S15   S20;S07;S09
70  English                Can I report you to the regulator?             S18   S01;S17;S09
71   Pidgin                   I wan complain, how I go do am?             S18   S17;S11;S08
75   Pidgin               How I go know where my claim reach?             S19   S15;S03;S11
76  English                 Am I covered if I drive to Ghana?             S20   S05;S01;S13
```

Pidgin questions are over-represented among the misses. Possible fixes, to test one at a time: add a short Pidgin glossary to the query before retrieval ("motor" → "car, vehicle"), index a few example questions in Pidgin with each section, or let the model rewrite the question in plain English first. Whatever the fix, measure it on this same set.

## Walkthrough

1. Run the cells.
2. Add a simple glossary (motor → car vehicle, wound → injured, jam → hit crash, thief carry → stolen) to the Pidgin questions, rerun TF-IDF and compare.
3. Try `ngram_range=(1, 2)` in the vectoriser. Does the baseline improve?
4. Which sections are most often retrieved wrongly in place of the right one?
5. Write the retrieval report (the task below).

## Practice

```answer
{
  "id": "aic-04-p1",
  "prompt": "For how many of the 80 questions does the **production** retriever return the gold section in its top three?",
  "answer": 69,
  "format": "number",
  "dataset": "assistant",
  "files": ["questions"],
  "pyVerify": "int(questions['hit'].sum())",
  "hint": "The first line printed.",
  "required": true
}
```

```answer
{
  "id": "aic-04-p2",
  "prompt": "And for how many does the **TF-IDF** baseline?",
  "answer": 60,
  "format": "number",
  "dataset": "assistant",
  "files": ["questions", "policy"],
  "pyVerify": "int(questions['tfidf_hit'].sum())",
  "hint": "The first line of the second cell.",
  "required": true
}
```

```task
{
  "id": "aic-04-t1",
  "prompt": "Write the **retrieval report** (50 to 130 words): hit at 3 for the production retriever and the baseline, the gap for **Pidgin**, and **two fixes** you'd test, with how you'd **measure** them.",
  "minutes": 7,
  "rows": 6,
  "placeholder": "The production retriever ...",
  "rules": [
    { "label": "Gives hit-at-3 figures", "pattern": "\\d+(\\.\\d+)?\\s*%|\\d+ of 80", "min": 2 },
    { "label": "Compares with the baseline (TF-IDF, keyword)", "pattern": "tf-?idf|keyword|baseline" },
    { "label": "Covers Pidgin", "pattern": "pidgin" },
    { "label": "Proposes fixes (glossary, rewrite, examples)", "pattern": "glossary|rewrit|example|synonym|translat" },
    { "label": "Says how to measure (same set, hit at 3)", "pattern": "same (question )?set|measure|hit at 3|re-?run" },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "The production retriever puts the right policy section in its top three for 69 of 80 questions (86%), against 60 for a TF-IDF keyword baseline, so it's earning its place. But Pidgin questions are hit only 75% of the time, against 90% in English, and they're over-represented among the misses. I'd test two fixes: a short Pidgin glossary added to the query (motor → car, wound → injured), and letting the model rewrite each question in plain English before retrieval. Each fix gets rerun on the same 80 questions and compared by hit at 3 in each language, before any change reaches customers.",
  "note": "A fix is only a fix once the same test set shows it.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why measure retrieval separately from answer quality?",
    "options": ["It's quicker", "If the right section isn't retrieved, the model can only guess, so you need to know where failures start", "Retrieval is more important than answers", "Answers can't be measured"],
    "answer": 1,
    "explanation": "Locate the failure in the pipeline."
  },
  {
    "prompt": "What does hit at 3 measure?",
    "options": ["Answer accuracy", "The share of questions whose correct section is among the three retrieved", "Speed", "Cost"],
    "answer": 1,
    "explanation": "Did the answer reach the model?"
  },
  {
    "prompt": "Why compare with a TF-IDF baseline?",
    "options": ["TF-IDF is always better", "To check that the more expensive retriever is actually adding value", "It's required", "To train embeddings"],
    "answer": 1,
    "explanation": "Every component should beat a simple alternative."
  }
]
```
