---
title: How large language models work
minutes: 15
summary: What a large language model actually does (predict the next token), what tokens and context windows are, why models sound confident when they're wrong, and what that means for anyone building with them.
---

## The problem

Paystream's head of customer support wants an AI assistant that answers customers' questions and sorts the 900 support tickets that arrive each month. A vendor demo looked impressive: the assistant answered every question fluently. Then someone asked it about Paystream's transfer fees, and it confidently quoted fees Paystream has never charged.

That isn't a bug in one product. It follows from how large language models (LLMs) work. To build AI features that are useful and safe, you need an accurate picture of what these models do, what they're good at, and where they fail. This course is about building with them as an engineer: measuring, constraining and checking them, rather than hoping.

## The concept

**Next-token prediction**

An LLM is trained on enormous amounts of text to do one thing: given the text so far, predict a likely next **token** (a word or part of a word). Generating an answer means repeating that step: predict a token, add it, predict the next. Everything else (following instructions, writing code, summarising) emerges from doing that very well, followed by extra training to make the model helpful and safe.

**Tokens**

Models read and write tokens, not words. In English, a token is roughly **4 characters** or **three-quarters of a word** on average. Tokens matter because:

- models are **priced per token** (input and output separately);
- every model has a **context window**: the maximum number of tokens it can consider at once (your instructions, any documents, the conversation and its answer);
- longer inputs are slower and cost more.

**Why confident mistakes happen**

The model produces a **plausible** continuation, not a **checked** one. If it doesn't know Paystream's fees, the most plausible text is still a confident sentence about fees. This is called **hallucination**, and the main defences are:

- give the model the facts in its input (retrieval, lesson 7);
- tell it to say when it doesn't know;
- check its outputs (lessons 5 and 8).

**Temperature**

A setting that controls how random the token choices are. Low temperature (near 0) gives more consistent, predictable outputs, which is what you want for classification and factual answers. Higher temperature gives more varied text.

## Example

The help centre the assistant will use: 25 articles.

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/genai/"
articles = pd.read_csv(base + "articles.csv")
articles["words"] = articles["body"].str.split().str.len()
articles["approx_tokens"] = (articles["title"].str.len() + articles["body"].str.len()) // 4
print(articles[["article_id", "title", "words", "approx_tokens"]].head())
print("Whole help centre: about", articles["approx_tokens"].sum(), "tokens")
```

```text
article_id                        title  words  approx_tokens
0      KB001  Opening a Paystream account     57             80
1      KB002     Account tiers and limits     67             87
2      KB003       How to verify your BVN     52             79
3      KB004          Upgrading to Tier 3     58             86
4      KB005                Transfer fees     49             73
Whole help centre: about 1953 tokens
```

The whole help centre is a few thousand tokens. Modern models have context windows of hundreds of thousands of tokens, so at this size you could put every article into every request. But each request would then cost more and take longer, and with thousands of articles it stops being possible. That's why lesson 6 teaches retrieval: sending only the few articles that matter.

## Walkthrough

1. Load the articles and read three of them. Note the specific facts (fees, limits, times) a model couldn't know without them.
2. Estimate the tokens in the longest article. Then estimate a typical request: about 250 tokens of instructions, 3 articles and a customer's question.
3. Look at `questions.csv`: real customer questions, each linked to the article that answers it, and some with no answer in the help centre at all.
4. Write down three things you'd check before trusting an AI assistant's answer to a customer.

## Practice

```dataset
{"dataset": "genai", "files": ["articles", "questions", "tickets", "answer_evals"]}
```

```answer
{
  "id": "gen-01-p1",
  "prompt": "Using the 4-characters-per-token estimate (title plus body), about how many tokens is the **whole help centre**?",
  "answer": 1953,
  "tolerance": 1,
  "format": "number",
  "dataset": "genai",
  "files": ["articles"],
  "pyVerify": "int(articles['approx_tokens'].sum())",
  "hint": "The last line printed.",
  "required": true
}
```

```answer
{
  "id": "gen-01-p2",
  "prompt": "How many questions in questions.csv have **no** answer in the help centre (no relevant_article_id)?",
  "answer": 8,
  "format": "number",
  "dataset": "genai",
  "files": ["questions"],
  "pyVerify": "int(pd.read_csv(base + 'questions.csv')['relevant_article_id'].isna().sum())",
  "hint": "Count the rows where relevant_article_id is empty.",
  "explanation": "8 questions about things Paystream doesn't offer. A good assistant must say it can't help with these, not invent an answer.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does a large language model fundamentally do?",
    "options": ["Look up answers in a database", "Predict a likely next token, repeatedly", "Search the internet", "Run rules written by programmers"],
    "answer": 1,
    "explanation": "Everything it does is built on next-token prediction."
  },
  {
    "prompt": "Why does a model state wrong fees confidently?",
    "options": ["It's lying on purpose", "It generates plausible text, not checked facts; without the real fees in its input, a confident guess is the most plausible text", "Its temperature is zero", "Fees are too long"],
    "answer": 1,
    "explanation": "Give it the facts, let it say 'I don't know', and check its outputs."
  },
  {
    "prompt": "About how many tokens is a 2,000-character text?",
    "options": ["50", "About 500", "2,000", "8,000"],
    "answer": 1,
    "explanation": "Roughly 4 characters per token in English."
  }
]
```
