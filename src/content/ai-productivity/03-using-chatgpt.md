---
title: Using ChatGPT
minutes: 30
handsOn: 8
summary: Use ChatGPT, OpenAI's assistant, for real work: focused questions, quick analysis of your own numbers (checked), research with sources you verify, and personalisation so every chat starts knowing how you work.
---

## Getting set up

**ChatGPT** is an AI assistant made by **OpenAI**. Open **chatgpt.com** in a browser, or install the app on your phone or computer, and sign up with your email or a Google account. There's a free plan, and paid plans with more usage and features.

Everything starts in the message box. Three habits make most answers better straight away:

- **Say who it's for.** "Explain it for a 15-year-old" or "for my boss, who has two minutes."
- **Say what shape you want.** A list, a table, a short email, three options to choose from.
- **Give it the facts it can't know.** Your prices, your location, your deadline, your numbers.

Compare:

```text
Tell me about marketing.
```

```text
I sell handmade leather sandals on Instagram from Kano, ₦12,000-₦18,000 a
pair, mostly to women aged 20-35. Give me five low-cost ways to get more
customers this month, each with one concrete action I can do this week.
Put it in a table: idea, action, rough cost.
```

The first gets a textbook overview. The second gets a plan.

The layout of ChatGPT changes from time to time. If a button in this module looks different on your screen, look for the nearest match.

## Analyse your own numbers, then check

You can paste a small table, or attach a spreadsheet with the **attach** button (a paperclip or **+**), and ask questions in plain English. Here's six months of sales from a small cosmetics shop. Paste it into ChatGPT:

```text
Month,Sales (NGN)
January,820000
February,760000
March,905000
April,990000
May,930000
June,1150000
```

```text
These are my shop's monthly sales. Which month had the biggest percentage
increase on the month before? Show the month-on-month change for every month
in a table, then tell me in two sentences what the trend is.
```

For data like this, ChatGPT often writes and runs a little code behind the scenes to do the maths, and you can usually open a "view analysis" link to see it. That makes it much more reliable than mental arithmetic, but **not infallible**: it can misread a column, skip a row, or answer a slightly different question from the one you meant.

So check the one number you'll act on, in a calculator or spreadsheet. For month-on-month change: **(this month ÷ last month − 1) × 100**.

> [!TIP]
> Ask ChatGPT to **show its working**: "Show the calculation for each month." A wrong step is much easier to spot than a wrong final answer.

## Research with sources you check

For anything current (prices, rules, news, requirements), ask ChatGPT to **search the web**. When it searches, it shows its **sources as links**. Your job is to open them.

```text
Search the web: what are the current requirements and fees to register a
business name in Nigeria? Use the official Corporate Affairs Commission
(CAC) website as the main source, and tell me the date of the page you used.
```

When you check a source, ask three questions:

1. **Does the page exist and is it the organisation it claims to be?** An official fee should come from the official site, not a blog quoting it.
2. **Does it actually say what the answer says?** AI sometimes cites a real page for a claim the page doesn't make.
3. **Is it current?** A 2019 page about fees may be out of date.

Here's what a check looks like in practice. Suppose ChatGPT answered:

```text
Registering a business name costs ₦10,000 and takes about 48 hours,
according to the CAC [1]. You'll also need a valid means of ID [2].

[1] smallbiztips-ng.blogspot.com/2021/cac-guide
[2] cac.gov.ng - Business Name Registration
```

Source 1 is a blog from 2021 quoting a fee: not good enough for a fee. Source 2 is the official site, so you'd open it and check both the fee and the ID requirement there, and trust the official page if they disagree.

![How to check a number (ask for the working, recheck the key figure) and a source (is it real, does it say that, is it current)](/images/courses/ai-productivity/verify.svg "Check the number; check the source.")

## Make it yours: personalisation

In ChatGPT's settings, under **Personalisation** (or **Customise ChatGPT**), you can tell it about yourself and how you want answers written. These **custom instructions** apply to new chats, so you don't repeat them.

```text
About me: I'm a final-year accounting student in Lagos, preparing for
graduate analyst interviews.
How to respond: British English. Short answers first, then detail only if
I ask. Use Nigerian examples and naira. If you're not sure of a fact, say
so instead of guessing. Never write assignments for me: explain and give
feedback instead.
```

ChatGPT may also remember things you tell it across chats (**memory**), and you can see and delete what it has remembered in the settings. Both are worth checking once, so you know what it knows about you.

> [!WARNING]
> Don't paste passwords, bank details, or other people's private information into any AI chat. And don't submit AI-written work as your own where that isn't allowed, such as exams and most assignments.

## Try it

Use ChatGPT (or another assistant) for the first one, then **check the answer yourself** before typing it.

```answer
{
  "id": "aipf-m03-a1",
  "prompt": "Using the cosmetics shop's sales, which month had the **biggest percentage increase** on the month before?",
  "answer": "June",
  "format": "text",
  "accept": ["jun"],
  "hint": "Work out (this month ÷ last month − 1) × 100 for each month from February to June.",
  "explanation": "June: ₦1,150,000 ÷ ₦930,000 − 1 = 23.7%. March was second at 19.1%. Did ChatGPT get it right first time?",
  "required": true
}
```

```answer
{
  "id": "aipf-m03-a2",
  "prompt": "What was the shop's **average** monthly sales over the six months? Round to the nearest naira.",
  "answer": 925833,
  "format": "naira",
  "hint": "Total ÷ 6. The total is ₦5,555,000.",
  "required": true
}
```

```answer
{
  "id": "aipf-m03-a3",
  "prompt": "In the CAC example above, which source should you open to check the **registration fee**: 1 or 2?",
  "answer": "2",
  "format": "text",
  "accept": ["source 2", "[2]", "two", "cac.gov.ng"],
  "hint": "Which one is the official organisation's own website?",
  "explanation": "Fees come from the official source. A 2021 blog may be out of date, and you can't tell where its figure came from.",
  "required": true
}
```

```task
{
  "id": "aipf-m03-t1",
  "prompt": "Write your own **custom instructions**: a line or two about you, then how you want ChatGPT to respond. Include at least one rule about honesty (what to do when it isn't sure).",
  "minutes": 5,
  "rows": 7,
  "placeholder": "About me: ...\nHow to respond: ...",
  "rules": [
    { "label": "Says something about you (I, I'm, my…)", "pattern": "\\b(I|I'm|my)\\b", "min": 2 },
    { "label": "Says how to respond (short, British English, examples, tone…)", "pattern": "short|brief|british|english|example|tone|simple|formal|friendly|bullet|detail|plain" },
    { "label": "Tells it what to do when it isn't sure", "pattern": "not sure|unsure|don't know|say so|admit|guess|uncertain|if you can't" },
    { "label": "At least 25 words", "minWords": 25 }
  ],
  "sample": "About me: I run a small printing shop in Abeokuta and I'm learning to do my own marketing and bookkeeping.\nHow to respond: plain British English, short answers first. Use naira and Nigerian examples. When I ask about numbers, show the calculation. If you're not sure of a fact, say so instead of guessing.",
  "required": true
}
```

```task
{
  "id": "aipf-m03-t2",
  "prompt": "Write a **research prompt** for something current you genuinely need to know (a fee, a requirement, a deadline, a price). Ask it to search the web, name the kind of source to use, and give the date of the source.",
  "minutes": 4,
  "rows": 4,
  "placeholder": "Search the web: ...",
  "rules": [
    { "label": "Asks it to search the web", "pattern": "search|look up|browse|find online|web" },
    { "label": "Asks for an official or specific source", "pattern": "official|government|\\.gov|source|website|ministry|commission|bank|university|regulator" },
    { "label": "Asks how current the source is (date, year, latest)", "pattern": "date|year|current|latest|updated|recent" },
    { "label": "At least 15 words", "minWords": 15 }
  ],
  "sample": "Search the web: what documents does a Nigerian need to apply for a UK Student visa this year? Use the official UK government website (gov.uk) as the main source, list the documents, and tell me the date the page was last updated.",
  "required": true
}
```

Then open your own research answer's sources and check one claim against the official page.
