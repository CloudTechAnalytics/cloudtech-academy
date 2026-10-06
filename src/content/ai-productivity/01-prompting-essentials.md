---
title: Prompting Essentials
minutes: 30
summary: Write prompts that get useful answers from any AI assistant (ChatGPT, Claude, Gemini or Copilot), improve a draft in a few follow-ups, and catch the mistakes AI makes before they reach anyone else.
---

## Why the same tool gives different results

A **prompt** is the message you type to an AI assistant. The assistant can't see your screen, your files, your customers or your situation. It only knows what's in the conversation. When the prompt is vague, it fills the gaps with the most average guess it can make, and you get an average answer.

Here's the same job asked two ways, with the kind of reply each one gets.

**Vague prompt:**

```text
Write a message to a customer about a date change.
```

**Typical reply:**

```text
Dear Valued Customer,

We hope this message finds you well. We would like to inform you that
there has been a change in the date of your scheduled service. Please
contact us at your earliest convenience to discuss the new arrangements.

Best regards,
[Your Name]
```

It's polite and useless: no names, no dates, nothing the customer can act on, and a tone nobody uses on WhatsApp.

**Specific prompt:**

```text
I run a small catering business in Ibadan. A customer, Mrs Adeyemi, paid
a ₦150,000 deposit for 80 guests on 12 July. She has asked to move the
event to 19 July and we can do that. Write a short, warm WhatsApp message
confirming the new date and that her deposit still stands. Under 60 words.
No "valued customer".
```

**Typical reply:**

```text
Good afternoon Mrs Adeyemi! Just confirming your event has moved to
Saturday 19 July, still for 80 guests. Your ₦150,000 deposit stays on
your booking, so nothing changes there. We'll call you the week before
to finalise the menu. Thank you for choosing us!
```

You could send that almost as it is. The only difference was the prompt.

## The four parts of a good prompt

Most weak answers are fixed by checking that your prompt has these four parts:

| Part | What it tells the AI | Example |
| :-- | :-- | :-- |
| **Context** | Who you are and what's going on | "I run a small catering business in Ibadan. A customer paid a deposit…" |
| **Task** | Exactly what you want produced | "Write a WhatsApp message confirming the new date…" |
| **Details** | The facts it can't know, and any limits | "₦150,000 deposit, 80 guests, 12 → 19 July, deposit still stands" |
| **Format** | Length, layout, tone | "Short, warm, under 60 words, no 'valued customer'" |

![The four parts of a prompt: context, task, details and format, with an example for a laundry business](/images/courses/ai-productivity/prompt-parts.svg "Context, task, details, format.")

A quick test: **if you gave this job to a new assistant on their first day, what would they need to know?** Tell the AI the same things.

> [!TIP]
> When you're not sure what to include, ask the AI to ask **you**: "Before you write it, ask me up to 5 questions about anything you need to know." Then answer them. This works especially well for longer pieces like proposals and reports.

## Show it an example

To get a particular **style**, show the AI one example instead of describing the style.

```text
Here is a product description I like, from our menu:

"Zobo, brewed fresh every morning with hibiscus, ginger and a hint of
pineapple. No preservatives. Chilled and ready in 50cl bottles."

Write descriptions in exactly the same style and length for: kunu,
chapman and fresh orange juice.
```

```text
Kunu, made fresh daily from millet, ginger and cloves. Lightly sweet,
naturally thick, no preservatives. Chilled and ready in 50cl bottles.

Chapman, our house blend of fruity soda, bitters and a slice of cucumber.
Mixed to order. Served ice-cold in 50cl bottles.

Fresh orange juice, squeezed every morning from sweet local oranges.
Nothing added. Chilled and ready in 50cl bottles.
```

The AI copied the length, the rhythm ("made fresh daily… no preservatives… chilled and ready") and the ending. This "show, don't describe" approach works for emails, captions, reports and almost anything with a house style.

## Improve the draft, don't start again

The first answer is a **draft**. Instead of opening a new chat and retyping everything, **reply with what to change**. The assistant remembers the whole conversation.

A real exchange looks like this:

```text
You:  Write a short email to my manager asking for Friday off.
AI:   Dear Mr Bello, I am writing to formally request a day of leave on
      Friday, 14 March, for personal reasons. I have ensured that my
      responsibilities will be covered in my absence...
You:  Less formal, we usually just message each other. And mention
      Kemi has agreed to cover the 10am client call.
AI:   Hi Mr Bello, could I take this Friday off? Kemi has kindly agreed
      to cover the 10am client call, and everything else is up to date.
      Thanks!
You:  Perfect. One more version that's even shorter, for WhatsApp.
```

Useful follow-ups to keep in your pocket:

- "Shorter: three sentences at most."
- "Less formal. It's for a colleague."
- "That's wrong: we close at 6pm, not 8pm. Fix it."
- "Give me three different versions to choose from."
- "Explain it as if I'm new to the topic."

![A chat where the first draft is improved with a follow-up, a list of useful follow-ups, and how showing one example gets a particular style](/images/courses/ai-productivity/iterate.svg "Treat the first answer as a draft and reply with changes.")

## Check before you use it

AI assistants write fluently even when they're wrong, so mistakes don't look like mistakes. Three kinds of error to watch for:

1. **Wrong numbers.** Language models predict text; they don't always calculate. Ask "what's a 15% deposit on ₦240,000?" and you might be told ₦32,000. The right answer is ₦36,000. Check any figure that matters with a calculator.
2. **Invented facts and sources.** Ask for "three studies that show…" and you may get three convincing titles, authors and years, some of which don't exist. Never use a fact, quote or reference you haven't found in a real source yourself.
3. **Out-of-date information.** Prices, laws, fees and requirements change. For anything official, check the organisation's own website.

And protect people's information: don't paste customers' phone numbers, passwords, bank details, payslips or confidential company documents into an AI tool unless your organisation has approved that tool for it.

![Three AI errors to check (wrong numbers, invented sources, out-of-date information) and the kinds of information never to paste into an AI tool](/images/courses/ai-productivity/check-before-use.svg "Three errors to catch, and what never to paste.")

## Try it

Do these with any AI assistant open in another tab (ChatGPT, Claude, Gemini or Copilot), then paste your work here.

```task
{
  "id": "aipf-m01-t1",
  "prompt": "Turn this weak prompt into a strong one with all four parts (context, task, details, format). Use a real or realistic situation of your own.\n\n> Write a message to my landlord.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "I rent a two-bedroom flat in ... My landlord, ... Write a ...",
  "rules": [
    { "label": "Gives context about you (I, I'm, my…)", "pattern": "\\b(I|I'm|my|we|our)\\b", "min": 2 },
    { "label": "Says what to write and who it's for (landlord, message, letter, email…)", "pattern": "landlord|message|letter|email|whatsapp|text" },
    { "label": "Includes at least one specific detail (a date, amount, number or name)", "pattern": "\\d" },
    { "label": "Sets the format: length or tone (words, sentences, short, polite, firm, friendly…)", "pattern": "words|sentence|short|brief|polite|firm|friendly|formal|warm|tone|bullet|line" },
    { "label": "Long enough to brief someone properly (at least 35 words)", "minWords": 35 }
  ],
  "sample": "I rent a two-bedroom flat in Yaba from Mr Okonjo. The kitchen sink has been leaking since 3 March, and I reported it by phone on 5 March but nobody has come. Write a polite but firm WhatsApp message asking him to send a plumber by Friday 14 March, and mention that the water is now damaging the cabinet. Under 80 words, no threats.",
  "note": "Context (who, where, what happened), task (a WhatsApp message asking for a plumber), details (dates, the damage, the deadline) and format (polite but firm, under 80 words, no threats). Try your own version in an AI assistant and compare the reply with what \"Write a message to my landlord\" gets.",
  "required": true
}
```

```answer
{
  "id": "aipf-m01-a1",
  "prompt": "An AI assistant tells you: *\"A 15% deposit on a ₦240,000 order is ₦32,000.\"* What is the correct deposit, in naira?",
  "answer": 36000,
  "format": "naira",
  "hint": "240,000 × 15 ÷ 100",
  "explanation": "₦36,000. The AI's figure looked plausible, which is exactly why numbers need checking: a ₦4,000 mistake on an invoice is a real problem.",
  "required": true
}
```

Here's a first draft an AI produced for a bakery's Instagram post. The owner wants it shorter, more casual, and the price is wrong: it should be ₦4,500, not ₦5,400.

```text
We are delighted to announce the launch of our brand-new coconut bread,
lovingly baked fresh every morning using only the finest ingredients.
Each loaf is available at the incredibly affordable price of ₦5,400.
Visit us today to experience this delightful new addition to our menu!
```

```task
{
  "id": "aipf-m01-t2",
  "prompt": "Write the **follow-up messages** you'd send in the same chat to fix this draft: one line per instruction. Cover the length, the tone and the wrong price.",
  "minutes": 4,
  "rows": 4,
  "placeholder": "Make it ...\n...",
  "rules": [
    { "label": "At least two separate instructions, one per line", "minLines": 2 },
    { "label": "Asks for it shorter (shorter, cut, under N words…)", "pattern": "short|cut|trim|under \\d+|fewer|brief|\\d+ words|one sentence|two sentences" },
    { "label": "Asks for a more casual tone", "pattern": "casual|informal|friendl|relaxed|less formal|chatty|fun" },
    { "label": "Corrects the price to ₦4,500", "pattern": "4,?500" }
  ],
  "sample": "Make it much shorter: two sentences at most.\nMore casual and fun, like we're talking to regular customers.\nThe price is wrong: it's ₦4,500, not ₦5,400.",
  "note": "Each instruction fixes one thing, so you can see what changed. Correcting the price explicitly matters: AI won't know it's wrong unless you tell it.",
  "required": true
}
```

```task
{
  "id": "aipf-m01-t3",
  "prompt": "Write a prompt that **shows an example** to get more of the same. Paste one example of a style you like (a caption, a product description, a short announcement) and ask for three more in the same style on new topics.",
  "minutes": 5,
  "rows": 7,
  "placeholder": "Here is a ... I like:\n\n\"...\"\n\nWrite three more in the same style for: ...",
  "rules": [
    { "label": "Includes the example in quotation marks", "pattern": "[\"“][^\"”]{20,}[\"”]" },
    { "label": "Asks for the same style (same style, like this, similar, match…)", "pattern": "same style|same tone|like this|similar|match|in the style|same length" },
    { "label": "Asks for three (3) new ones", "pattern": "\\b(three|3)\\b" }
  ],
  "sample": "Here is a caption I like from our page:\n\n\"New week, fresh bread. Our wholemeal loaf is out of the oven at 7am, still warm by 8. Come early, it goes fast.\"\n\nWrite three more captions in the same style and length for: our Saturday doughnut special, our new delivery service in Lekki, and our closing time changing to 7pm.",
  "required": true
}
```
