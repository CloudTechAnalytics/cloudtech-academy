---
title: How AI Assistants Work (and Why They Get Things Wrong)
minutes: 20
summary: Learn, without any maths, how a chat assistant is trained and what it does when you press Enter, so you can predict when it will be brilliant, when it will make things up, and what to do about it.
---

## A story to start: the confident wrong answer

Ngozi manages a small logistics office in Port Harcourt. She asked an AI assistant, "What is the maximum weight a motorcycle courier can legally carry in Nigeria?" It answered instantly, in a calm and professional tone, with a specific figure and even a regulation number.

She almost put it in a client contract. Something made her pause, and she searched for the regulation. It did not exist.

The assistant had not lied on purpose. It had done exactly what it was built to do, and that is the key to using AI safely. This lesson explains what that is, in plain language, so that you are never caught out the way Ngozi nearly was.

## Step 1: it learned from a huge amount of writing

A chat assistant is powered by a **large language model (LLM)**. "Large" means it was trained on an enormous amount of text: books, websites, articles, forum discussions, computer code. "Language model" means its whole skill is **working with words**.

Training is like this: the model is shown a piece of text with the next word hidden, and it guesses. When it guesses wrong, it is adjusted slightly. This happens billions of times. Over time it becomes extremely good at one thing: **given some words, what word is likely to come next?**

You can feel this yourself. Finish these:

- "Happy birthday to ..."
- "Good morning, how are ..."
- "The capital of Nigeria is ..."

You did not look anything up. You completed a pattern you have seen many times. An LLM does the same, at a scale no person could match, across every subject in its training text.

## Step 2: it plays one game, over and over

When you press Enter, the assistant does not "think about" your question the way you would. It plays one game: **what word should come next?** It picks a likely word, adds it to the reply, then asks the same question again with the new word included, and repeats until the answer is complete.

![A bar chart of the likely next words after "Lagos traffic is very", with bad at the top, and an explanation that the model picks a likely word and repeats](/images/courses/ai-productivity/llm-next-word.svg "One word at a time, from likely options.")

Two important consequences follow:

1. **It writes fluently.** Fluency is the thing it practised the most. Its sentences usually sound natural and confident.
2. **It does not look things up while it writes.** By default it is not searching a database of true facts. It is producing the most plausible continuation. Plausible and true are often the same, but not always.

This is why Ngozi's assistant produced a regulation number. A real-sounding regulation number is the kind of thing that *tends to come next* in a sentence like that. Nothing in the process asked "does this exist?"

> [!WARNING]
> The more confident and specific an AI answer sounds, the more tempting it is to trust it. Specific numbers, names, dates, laws, quotes and links are exactly the things it can invent. Always check them.

## Step 3: the words that matter, in plain English

You will see these terms in every AI tool. Here is what they mean without the jargon.

| Term | Plain meaning | Why you care |
| :-- | :-- | :-- |
| **Model** | The trained system itself (for example GPT or Claude) | Different models have different strengths; newer ones are usually better |
| **Prompt** | The message you give it | Better prompts, better answers: the next lesson is all about this |
| **Token** | A small chunk of text, roughly three-quarters of a word | Limits and prices are counted in tokens |
| **Context window** | How much text the model can hold in mind at once: your prompt, the chat so far, files you added | If a chat gets very long, the model can lose track of early details |
| **Training data** | The text the model learned from | It stops at a **cutoff date**, so it may not know recent events |
| **Hallucination** | A confident answer that is false or invented | The main risk to manage |
| **Temperature** | How adventurous the word choice is | The same prompt can give a different answer each time |

Two of these deserve a closer look.

**The knowledge cutoff.** The model learned from text up to a certain date. It may not know about last month's price change, a new law or this week's news, unless the tool has a search feature switched on. When recent facts matter, say so and check.

**The context window.** Think of it as the model's desk. Everything on the desk it can use: your instructions, the document you pasted, the earlier conversation. Things that are not on the desk, it does not know. That includes *your* business, *your* customers and *your* deadline. This is why giving context in a prompt makes such a difference.

## Step 4: what this means in practice

Put the pieces together and the rules for using AI follow naturally.

| Because the AI... | You should... |
| :-- | :-- |
| predicts likely words, not true ones | **Check** facts, numbers, names, laws and links before you use them |
| only knows what is on its desk | **Give it context**: who you are, who it is for, the facts it needs |
| is trained up to a cutoff date | **Provide current facts yourself**, or use a tool with search and check its sources |
| can answer differently each time | **Ask again, or ask for several options**, and choose the best |
| writes confidently even when unsure | **Ask it to say when it is not sure**, and never treat tone as proof |
| does not know your private data | **Never paste** passwords, bank details or confidential documents unless your organisation has approved the tool |

Notice that none of these rules say "do not use AI". They say "use it like a very fast, very well-read assistant who has never met you and sometimes bluffs". You would not stop using such an assistant. You would brief them well and check their work.

## Things AI is surprisingly good at because of how it works

The same word-by-word skill that creates the risk also creates the strengths:

- **Patterns in language.** Summaries, rewrites, tone changes, translations and structure are all "what words fit here", which it does very well.
- **Following a format.** Ask for a table, a checklist or three bullet points and it can produce the shape instantly.
- **Imitating a style.** Show it one example and it continues in that style.
- **Explaining at any level.** It has seen explanations written for children, experts and everyone in between.

When your task is mostly about **language and structure**, AI is strong. When your task depends on a **fact that must be exactly right**, AI is a starting point, not the final word.

## Try it

```task
{
  "id": "aipf-m01-t6",
  "prompt": "Ngozi's assistant invented a regulation. In your own words, explain **why it happened** (what the AI is actually doing when it answers) and describe **two things you would do** before using a fact like that in a contract.",
  "minutes": 6,
  "rows": 7,
  "placeholder": "It happened because the AI ... Before using a fact like that I would ...",
  "rules": [
    { "label": "Explains that it predicts likely words / patterns rather than looking up truth", "pattern": "predict|likely|pattern|next word|plausible|sounds|guess|does not (know|look)|doesn't (know|look)" },
    { "label": "Mentions checking or verifying", "pattern": "check|verify|confirm|source|official|look it up|search" },
    { "label": "Names two actions (first/second, and, also, then, or a list)", "pattern": "first|second|also|then|\\band\\b|1\\.|2\\.|-" },
    { "label": "Long enough (at least 40 words)", "minWords": 40 }
  ],
  "sample": "It happened because an AI assistant does not look up facts: it predicts the most likely next word, over and over. A real-sounding regulation number is the kind of thing that tends to appear in a sentence like that, so it produced one, with no step that asked whether it exists. Before using a fact like that in a contract I would first search for the regulation on the official government or regulator website, and second ask the AI for its source and open it to check that it really says that. If I cannot find it myself, I would leave it out.",
  "note": "The core idea: fluent and confident does not mean true. Verify anything specific (numbers, laws, names, links) in a source you can open yourself.",
  "required": true
}
```

```answer
{
  "id": "aipf-m01-a2",
  "prompt": "An AI assistant is asked how many tokens are in a text and answers *\"about 1,200 tokens\"* for a document of **900 words**. A token is roughly **three-quarters of a word**. How many tokens is 900 words, to the nearest whole number?",
  "answer": 1200,
  "format": "number",
  "hint": "900 ÷ 0.75",
  "explanation": "900 ÷ 0.75 = 1,200. This time the AI was right, but you can see how a quick check lets you confirm figures instead of trusting them.",
  "required": true
}
```

```task
{
  "id": "aipf-m01-t7",
  "prompt": "Write **three personal rules** you will follow when using AI at work or study, each tied to something you learned in this lesson (for example, about checking facts, giving context or protecting private information). One rule per line.",
  "minutes": 5,
  "rows": 5,
  "placeholder": "1. I will always ...\n2. ...",
  "rules": [
    { "label": "Three separate lines", "minLines": 3 },
    { "label": "Includes a rule about checking facts, numbers or sources", "pattern": "check|verify|confirm|source|double-check|fact" },
    { "label": "Includes a rule about context or private information", "pattern": "context|detail|background|tell it|private|confidential|password|bank|personal|never paste|not paste" },
    { "label": "Written as commitments (I will, always, never, before…)", "pattern": "I will|always|never|before|must|won't|will not" }
  ],
  "sample": "1. I will always check any figure, law, name or link in a real source before I use it.\n2. I will always give the AI context: who I am, who the reader is and the facts it needs.\n3. I will never paste passwords, bank details or confidential documents into an AI tool unless my organisation has approved it.",
  "required": true
}
```
