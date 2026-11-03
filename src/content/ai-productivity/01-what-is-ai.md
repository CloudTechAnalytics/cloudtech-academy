---
title: What Is AI? A Plain-English Start
minutes: 15
summary: Understand what artificial intelligence really is, where it came from, how it differs from machine learning and generative AI, and the six kinds of jobs it does, so the rest of the course makes sense even if you have never used it.
---

## A story to start: two shops, one morning

Tolu runs a small phone-accessories shop in Ikeja. Every Monday she spends two hours going through last week's WhatsApp orders, working out what to restock, and writing a message to her suppliers. Her friend Chidi runs a similar shop two streets away. On the same Monday, Chidi pastes his week's orders into an AI assistant, types one paragraph describing what he needs, and has a restock list and a supplier message in four minutes. He spends the other hour and fifty-six minutes talking to customers.

Chidi is not cleverer than Tolu. He did not study computer science. He learned a few simple habits about **what AI is, what it is good at, and how to ask it for things**. That is exactly what this course teaches, starting here.

Before you can use any tool well, it helps to know what it actually is. Most people only ever hear AI described in headlines, either as a miracle or as a threat. Neither helps you do your job. By the end of this lesson you will be able to explain AI in your own words, name its main types, and know which of them you will use at work.

## The definition, in plain words

**Artificial intelligence (AI)** is computer software that does tasks which normally need human intelligence: recognising a face, understanding a sentence, translating a language, spotting a fraudulent payment, writing a paragraph.

Notice what that definition does **not** say. It does not say the software is alive, that it understands like you do, or that it is always right. It says it can do a *task* that we used to think only a person could do.

Here is a useful way to feel the difference. A normal program follows **rules a person wrote**:

```text
IF the customer's order is over ₦50,000 THEN offer free delivery.
```

Every decision is written out by a programmer. If a situation was not thought of, the program does nothing sensible. AI, in the way we use the word today, is different: nobody writes the rules. The software is shown a very large number of examples, finds the patterns itself, and then uses those patterns on things it has never seen. Nobody wrote a rule for what a cat looks like; the software was shown millions of pictures labelled "cat" and learned it.

> [!NOTE]
> You will hear "AI" used for everything from a calculator app to a robot in a film. In this course, AI means software that **learned patterns from examples** and uses them to produce a prediction, a decision or a piece of content.

## AI, machine learning, deep learning and generative AI

These four terms are used as if they were the same. They are not. Think of four circles, each inside the one before.

![Four nested circles: artificial intelligence contains machine learning, which contains deep learning, which contains generative AI, with a plain-English meaning and example for each](/images/courses/ai-productivity/ai-nested.svg "Each circle sits inside the one before it.")

- **Artificial intelligence** is the biggest circle: any software that does a task needing human-like intelligence. Even a chess program from the 1990s counts.
- **Machine learning** is the part of AI where the software **learns from examples** instead of following only fixed rules. Your bank's fraud alerts and the "recommended for you" rows in a shopping app are machine learning.
- **Deep learning** is machine learning that uses **neural networks with many layers**, loosely inspired by how brain cells connect. It is what made face unlock, voice typing and phone translation work so well.
- **Generative AI** is deep learning that **creates new things**: text, images, audio, video, code. ChatGPT, Claude, Gemini and image makers are generative AI. This is the kind that suddenly became everyone's business in 2022, and it is the main focus of this course.

So when someone says "I use AI at work", they almost always mean generative AI: an assistant you talk to in plain language.

## A short history: why now?

AI is not new. The idea is about seventy years old. What changed recently is that it became **good enough and easy enough** for anyone to use.

![A timeline from 1950 to 2022: Turing's question, the name artificial intelligence, Deep Blue beats the chess champion, deep learning takes off, the transformer design, and ChatGPT reaches everyone](/images/courses/ai-productivity/ai-timeline.svg "Seventy years, six steps.")

Three things came together:

1. **Data.** The internet produced an enormous amount of writing, pictures and code to learn from.
2. **Computing power.** Graphics chips, originally built for video games, turned out to be perfect for training these systems.
3. **Better designs.** In 2017 researchers published the *transformer*, a design that reads a whole sentence at once and works out which words matter to which. Modern chat assistants are built on it.

The result: in late 2022, a chat box that anyone could type into and get a useful, fluent answer. For the first time you did not need to be a programmer to use AI.

## The six jobs AI does

Instead of memorising names, ask: **what is the AI actually doing?** Almost every AI product does one or more of six jobs.

![Six kinds of AI job: predicting, recognising, recommending, understanding speech and language, generating, and acting, each with everyday examples](/images/courses/ai-productivity/ai-types.svg "Ask what job the AI is doing.")

| Job | What it means | Where you meet it |
| :-- | :-- | :-- |
| **Predicting** | Uses past data to guess what comes next | Fraud alerts, delivery-time estimates, sales forecasts |
| **Recognising** | Finds things in pictures, sound and video | Face unlock, reading text from a photo, spotting damaged goods |
| **Recommending** | Chooses what to show you next | The videos you see, "customers also bought", music playlists |
| **Understanding language** | Turns speech and text into meaning, and back | Voice typing, translation, subtitles |
| **Generating** | Creates new text, images, audio, video or code | ChatGPT, Claude, Gemini, image generators |
| **Acting** | Plans and carries out steps toward a goal, using tools | AI "agents" that search, fill in forms or book for you |

One product can do several jobs. When you speak to a phone assistant it **recognises** your speech, **understands** the request and **generates** a reply. In this course you will mostly use the **generating** and **understanding language** jobs: you type or paste something, and the assistant writes, summarises, explains or rewrites.

## What AI is good at, and what it is not

Knowing the limits is what separates people who get value from AI from people who get embarrassed by it.

**AI is good at:**

- Producing a **first draft** of almost any text in seconds.
- **Summarising** long documents and pulling out the key points.
- **Rewriting** for a different reader, tone or length.
- **Brainstorming** a list of options when you are stuck.
- **Explaining** a hard idea at the level you ask for.
- **Spotting patterns** in a table you paste in.

**AI is not good at:**

- **Being right about facts you cannot check.** It can state something false with complete confidence.
- **Exact arithmetic**, current prices, laws and fees that change.
- **Knowing your situation.** It does not know your customers, your budget or your deadline unless you tell it.
- **Taking responsibility.** If a wrong figure goes to a client, "the AI said so" is not an answer. You are accountable for anything you send.

The golden rule of the whole course: **AI drafts, you decide.**

## Try it

Do these two short tasks. You do not need an AI account for the first one.

```task
{
  "id": "aipf-m01-t4",
  "prompt": "In your own words, explain to a friend who has never heard of it **what AI is**, and give **two examples** of AI you have already used or seen (for example a phone feature, a shopping app or a chatbot). Write 3-5 sentences.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "AI is software that ... For example, ...",
  "rules": [
    { "label": "Says what AI is (software, computer, program, machine, learns, tasks, humans, intelligence…)", "pattern": "software|computer|program|machine|learn|task|human|intelligen|pattern|example" },
    { "label": "Gives at least two examples (for example, such as, like, e.g.…)", "pattern": "for example|for instance|such as|e\\.g\\.|like |another" },
    { "label": "Mentions something familiar (phone, face, voice, translate, recommend, chatbot, ChatGPT, fraud, maps, Netflix, YouTube…)", "pattern": "phone|face|voice|translat|recommend|chatbot|chatgpt|claude|gemini|fraud|map|netflix|youtube|tiktok|siri|alexa|spam|search" },
    { "label": "Long enough to explain properly (at least 35 words)", "minWords": 35 }
  ],
  "sample": "AI is computer software that does tasks which normally need a human, like understanding speech or spotting a pattern. It does this by learning from lots of examples instead of following only rules a programmer wrote. For example, my phone unlocks when it recognises my face, and YouTube recommends videos it thinks I will like. Another example is ChatGPT, which writes text when I type a request.",
  "note": "A good answer says AI is software that learned patterns from examples, and gives concrete everyday examples. If your examples were a face unlock and a recommendation, you have already met two of the six jobs.",
  "required": true
}
```

```task
{
  "id": "aipf-m01-t5",
  "prompt": "Pick **three** products or features you use (an app, a website, a device). For each one, write which of the **six jobs** the AI does (predicting, recognising, recommending, understanding language, generating, acting). One per line.",
  "minutes": 5,
  "rows": 5,
  "placeholder": "Google Maps: predicting (it estimates how long the trip will take)\n...",
  "rules": [
    { "label": "Three separate lines, one per product", "minLines": 3 },
    { "label": "Uses the names of the jobs (predict, recogni, recommend, understand, generat, act)", "pattern": "predict|recogni|recommend|understand|generat|act", "min": 3 },
    { "label": "Names real products or features", "pattern": "[A-Z][a-z]+|app|phone|camera|search" }
  ],
  "sample": "Google Maps: predicting (it estimates travel time from past traffic)\nPhone face unlock: recognising (it finds my face)\nChatGPT: generating (it writes new text when I ask)",
  "note": "There is no single right answer: many products do more than one job. The skill is asking \"what is the AI actually doing here?\" rather than treating AI as one magic thing.",
  "required": true
}
```
