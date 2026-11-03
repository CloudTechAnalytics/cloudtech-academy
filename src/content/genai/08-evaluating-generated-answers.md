---
title: Evaluating generated answers
minutes: 25
summary: Build an evaluation for free-text answers from human grades, automatic checks and an LLM judge, and find out how far the automated judge can be trusted before relying on it.
---

## The problem

Grading 166 answers by hand took Paystream's support lead most of a day. Every prompt change, model update or new article could change the answers, and nobody can spend a day re-grading each time. The team wants to automate evaluation, and the popular approach is an **LLM-as-judge**: a second model that grades each answer.

That can work, but only if the judge agrees with people often enough, on the grades that matter. An unchecked judge that's too lenient will report that a broken assistant is fine.

## The concept

### Three layers of evaluation

| Layer | What it checks | Cost |
| :-- | :-- | :-- |
| **Automatic checks** | format and rules: is there a citation? Is it a supplied article? Does a refusal happen when retrieval found nothing? | free, instant |
| **LLM judge** | answer quality against the source article, with a rubric | a model call per answer |
| **Human grades** | the ground truth, on a sample | people's time |

Use the cheap layers on everything and humans on a sample. Check the judge against the human sample regularly.

### Checking a judge

- **Agreement**: share of answers where the judge's grade matches the human grade.
- **Agreement on what matters**: does the judge catch the answers people graded Incorrect, or as wrongly answering? A judge that's 90% in agreement but misses most bad answers is useless.
- **Direction of errors**: is it too lenient (grading partly correct answers as correct) or too harsh?

### Improving a judge

Give it the source article and a clear rubric with examples of each grade; ask for the reason before the grade; use a strong model; and keep re-checking it against fresh human grades.

## Example

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/genai/"
evals = pd.read_csv(base + "answer_evals.csv")
questions = pd.read_csv(base + "questions.csv")
evals = evals.merge(questions[["question_id", "relevant_article_id"]], on="question_id")

print("Overall judge agreement with the human grade:", round((evals["judge_grade"] == evals["human_grade"]).mean(), 3))
pd.crosstab(evals["human_grade"], evals["judge_grade"])
```

```text
Overall judge agreement with the human grade: 0.886
judge_grade                     Answered when it should refuse  Correct  Correctly refused  Incorrect  Partly correct
human_grade
Answered when it should refuse                               6        0                  0          0               0
Correct                                                      0       86                  0          0               7
Correctly refused                                            0        0                 10          0               0
Incorrect                                                    0        0                  0         33               1
Partly correct                                               0       11                  0          0              12
```

Read the table by rows: each row is what the human said, each column what the judge said. The diagonal is agreement. The judge is reliable on clear cases, but it upgrades many "Partly correct" answers to "Correct", so on its own it would make the assistant look better than it is. Now an automatic citation check on v2's answers:

```python
v2 = evals[(evals["system"] == "v2 retrieval") & evals["relevant_article_id"].notna()]
cited = v2["cited_article_id"].notna()
correct_source = v2["cited_article_id"] == v2["relevant_article_id"]
print("v2 answers with a citation:", round(cited.mean(), 3))
print("Citations pointing to the right article:", round(correct_source[cited].mean(), 3))
print("Human grade when the citation was wrong:")
print(v2.loc[cited & ~correct_source, "human_grade"].value_counts())
```

```text
v2 answers with a citation: 1.0
Citations pointing to the right article: 0.933
Human grade when the citation was wrong:
human_grade
Correct      4
Incorrect    1
Name: count, dtype: int64
```

Every v2 answer had a citation, and only 5 pointed somewhere other than the question's labelled article. Four of those 5 were still graded Correct: another article can contain the same fact. So a different citation isn't proof of a wrong answer. It's a free flag: a small set of answers worth a person's look, whatever the judge says.

## Walkthrough

1. Run the cells. Calculate the judge's agreement separately for v1 and v2.
2. Of the answers humans graded Incorrect, what share did the judge also grade Incorrect?
3. Design a rubric for the judge (the task below).
4. Decide how many answers a person should grade each week to keep checking the judge.

## Practice

```answer
{
  "id": "gen-08-p1",
  "prompt": "What is the judge's **overall agreement** with the human grades? As a percentage, one decimal place.",
  "answer": 88.6,
  "format": "percent",
  "dataset": "genai",
  "files": ["answer_evals"],
  "pyVerify": "round((evals['judge_grade'] == evals['human_grade']).mean() * 100, 1)",
  "hint": "The first line printed.",
  "required": true
}
```

```answer
{
  "id": "gen-08-p2",
  "prompt": "Of the answers humans graded **Partly correct**, how many did the judge grade **Correct**?",
  "answer": 11,
  "format": "number",
  "dataset": "genai",
  "files": ["answer_evals"],
  "pyVerify": "int(((evals['human_grade'] == 'Partly correct') & (evals['judge_grade'] == 'Correct')).sum())",
  "hint": "The Partly correct row, Correct column of the table.",
  "required": true
}
```

```task
{
  "id": "gen-08-t1",
  "prompt": "Write a **grading rubric** for the LLM judge, with a line for each grade: **Correct**, **Partly correct**, **Incorrect**, **Correctly refused** and **Answered when it should refuse**, each starting with the grade and a colon, saying exactly when it applies. Add a final **Instructions:** line telling the judge what to do before giving a grade.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "Correct: ...\nPartly correct: ...",
  "rules": [
    { "label": "Correct and Partly correct lines", "pattern": "^\\s*[-*]?\\s*(correct|partly correct)\\s*:", "min": 2 },
    { "label": "Incorrect line", "pattern": "^\\s*[-*]?\\s*incorrect\\s*:" },
    { "label": "Correctly refused and Answered when it should refuse lines", "pattern": "^\\s*[-*]?\\s*(correctly refused|answered when it should refuse)\\s*:", "min": 2 },
    { "label": "Partly correct defines what's missing or extra", "pattern": "partly correct\\s*:[^\\n]*(miss|omit|extra|some|incomplete|part)" },
    { "label": "Instructions line asking for a reason or comparison with the article first", "pattern": "^\\s*[-*]?\\s*instructions\\s*:[^\\n]*(reason|explain|compare|check|article|source)" }
  ],
  "sample": "Correct: every fact in the answer is supported by the source article, nothing important from the article is missing, and the right article is cited.\nPartly correct: the answer is supported by the article but misses an important detail (a limit, a fee, a time) or adds a claim the article doesn't support.\nIncorrect: the answer contradicts the article, or its main fact is wrong or missing.\nCorrectly refused: the help centre doesn't answer the question, and the assistant says it can't help and points to support.\nAnswered when it should refuse: the help centre doesn't answer the question, but the assistant gives an answer anyway.\nInstructions: first compare each sentence of the answer with the source article and write one line of reasoning, then give exactly one grade.",
  "note": "The Partly correct definition is where the current judge goes wrong, so it's the definition worth the most care.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A judge agrees with humans 85% of the time but grades most partly correct answers as correct. What's the risk?",
    "options": ["None", "It makes the assistant look better than it is, hiding answers that need fixing", "It's too strict", "It's too slow"],
    "answer": 1,
    "explanation": "Check the direction of the judge's errors, not just overall agreement."
  },
  {
    "prompt": "Which check is free and can run on every answer?",
    "options": ["An LLM judge", "Checking that each answer cites one of the supplied articles, and flagging unexpected citations", "Human grading", "Asking the assistant if it's sure"],
    "answer": 1,
    "explanation": "Automatic rule checks cost nothing and pick out answers for review."
  },
  {
    "prompt": "How often should you check an LLM judge against human grades?",
    "options": ["Once, at launch", "Regularly, on a fresh sample, especially after prompt or model changes", "Never", "Only when customers complain"],
    "answer": 1,
    "explanation": "Judges drift too."
  }
]
```
