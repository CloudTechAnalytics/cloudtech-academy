---
title: Grounded answers and judging
minutes: 25
summary: Compare answers with and without retrieval, see how answer quality depends on retrieval hits, and test whether an LLM judge can replace human grading, including the one kind of error it misses.
---

## The problem

A wrong answer about insurance is costly. A customer told "yes, you can use your own mechanic" may lose part of their claim. So the assistant must answer **from the policy**, and Shieldline needs a way to check answer quality every time the prompt or model changes. People graded the answers this time. Next time, the team wants an LLM judge to do it automatically. Can it be trusted?

## The concept

**Grades**

| Grade | Meaning |
| :-- | :-- |
| Correct | Right, and supported by the policy |
| Partly correct | Right but incomplete |
| Wrong | Contradicts the policy |
| Unsupported | States something the policy doesn't say: made up, even if it sounds plausible |

Unsupported answers are the most dangerous kind. They sound confident and can't be traced to anything.

**Answer quality depends on retrieval**

Split the graded answers by whether retrieval found the right section. If most bad answers come from retrieval misses, fix retrieval first.

**Judging the judge**

Before an LLM judge replaces people, compare its grades with human grades on the same answers. Look at overall agreement, but especially at agreement on the grades that matter most. A judge that calls unsupported answers "Correct" is worse than useless for safety.

## Example

Answers with and without retrieval:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/assistant/"
questions = pd.read_csv(base + "questions.csv")
questions["hit"] = [gold in ids.split(";") for gold, ids in zip(questions["gold_section_id"], questions["retrieved_ids"])]
ORDER = ["Correct", "Partly correct", "Wrong", "Unsupported"]
pd.DataFrame({
    "without retrieval": questions["answer_no_rag_grade"].value_counts(),
    "with retrieval": questions["answer_rag_grade"].value_counts(),
}).reindex(ORDER).fillna(0).astype(int)
```

```text
without retrieval  with retrieval
Correct                        38              57
Partly correct                 12              12
Wrong                           7               6
Unsupported                    23               5
```

Retrieval raises correct answers substantially and cuts unsupported ones sharply. Where do the remaining bad answers come from?

```python
pd.crosstab(questions["hit"], questions["answer_rag_grade"]).reindex(columns=ORDER, fill_value=0)
```

```text
answer_rag_grade  Correct  Partly correct  Wrong  Unsupported
hit
False                   2               1      4            4
True                   55              11      2            1
```

When retrieval finds the right section, the answer is almost always right. Most wrong and unsupported answers (8 of 11) follow a retrieval **miss**, although misses are only 11 of the 80 questions. So the retrieval fixes from lesson 4 are also the best answer fixes. In the meantime, instruct the model to say it will pass the question to a colleague when the retrieved sections don't contain the answer, and test that instruction.

Now the judge:

```python
agree = (questions["judge_grade"] == questions["answer_rag_grade"]).mean()
print(f"The judge agrees with people on {agree:.1%} of answers")
pd.crosstab(questions["answer_rag_grade"], questions["judge_grade"], rownames=["people"], colnames=["judge"]).reindex(index=ORDER, columns=ORDER, fill_value=0)
```

```text
The judge agrees with people on 90.0% of answers
judge           Correct  Partly correct  Wrong  Unsupported
people
Correct              53               0      2            2
Partly correct        0              12      0            0
Wrong                 0               0      5            1
Unsupported           3               0      0            2
```

The overall agreement looks good. But read the Unsupported row: of the answers people marked unsupported, the judge called most of them **Correct**. It's fooled by exactly the confident, made-up answers that matter most. So the judge can't run alone. Use it to grade at scale, and add a code check that every sentence of an answer can be matched to a retrieved section, plus a monthly human sample focused on answers the judge passed.

## Walkthrough

1. Run the cells.
2. Read the unsupported answers' questions. Which policy sections were they about, and were they retrieval misses?
3. Write the instruction that tells the model what to do when the retrieved sections don't contain the answer.
4. Design the ongoing check: how many answers people grade each month, and which ones.
5. Write the answer-quality note (the task below).

## Practice

```answer
{
  "id": "aic-05-p1",
  "prompt": "How many of the 80 answers **with retrieval** did people grade **Correct**?",
  "answer": 57,
  "format": "number",
  "dataset": "assistant",
  "files": ["questions"],
  "pyVerify": "int((questions['answer_rag_grade'] == 'Correct').sum())",
  "hint": "The Correct row, with retrieval.",
  "required": true
}
```

```answer
{
  "id": "aic-05-p2",
  "prompt": "Of the answers people graded **Unsupported**, how many did the judge grade **Correct**?",
  "answer": 3,
  "format": "number",
  "dataset": "assistant",
  "files": ["questions"],
  "pyVerify": "int(((questions['answer_rag_grade'] == 'Unsupported') & (questions['judge_grade'] == 'Correct')).sum())",
  "hint": "The Unsupported row, Correct column, of the judge table.",
  "required": true
}
```

```task
{
  "id": "aic-05-t1",
  "prompt": "Write the **answer-quality note** (60 to 140 words): what retrieval does for answer quality, where the remaining bad answers **come from**, whether the LLM **judge** can be trusted, and the **safeguard** you'd add.",
  "minutes": 7,
  "rows": 7,
  "placeholder": "With retrieval, ...",
  "rules": [
    { "label": "Uses numbers", "pattern": "\\d+", "min": 3 },
    { "label": "Links bad answers to retrieval misses", "pattern": "miss|retriev" },
    { "label": "Covers the judge", "pattern": "judge" },
    { "label": "Names the judge's weakness (unsupported)", "pattern": "unsupported|made.up|invent" },
    { "label": "A safeguard (human sample, check, pass to a colleague)", "pattern": "sample|human|check|colleague|person" },
    { "label": "Between 60 and 140 words", "minWords": 60, "maxWords": 140 }
  ],
  "sample": "With retrieval, 57 of 80 answers were correct, against 38 without, and unsupported answers fell from 23 to 5. Most of the remaining wrong or unsupported answers (8 of 11) came after a retrieval miss, so improving retrieval, especially for Pidgin, is the best way to improve answers. The LLM judge agrees with people on 90% of answers, but it graded 3 of the 5 unsupported answers as Correct: it misses the most dangerous error. So the judge can grade at scale, but not alone. We'll add a code check that each answer quotes a retrieved section, tell the model to pass questions to a colleague when the sections don't answer them, and have people grade a monthly sample of answers the judge passed.",
  "note": "The judge is measured like any other model: against people, on the errors that matter.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why are unsupported answers more dangerous than wrong ones?",
    "options": ["They're longer", "They sound confident and can't be traced to the policy, so nobody notices", "They're rarer", "They cost more tokens"],
    "answer": 1,
    "explanation": "Plausible fabrications slip through."
  },
  {
    "prompt": "Most bad answers follow a retrieval miss. What should you fix first?",
    "options": ["The answer prompt", "Retrieval", "The judge", "The model size"],
    "answer": 1,
    "explanation": "Fix the failure where it starts."
  },
  {
    "prompt": "A judge agrees with people 90% of the time but passes most unsupported answers. Should it replace human grading?",
    "options": ["Yes: 90% is high", "No: it fails on the most important error, so keep a human check focused there", "Only on Fridays", "Yes, with a bigger model"],
    "answer": 1,
    "explanation": "Agreement overall isn't agreement where it matters."
  }
]
```
