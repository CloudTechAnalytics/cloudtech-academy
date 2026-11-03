---
title: Using Claude
minutes: 30
handsOn: 8
summary: Use Claude, Anthropic's AI assistant, on a real document: summarise it, question it, check what it tells you, rewrite text for a different reader, and set up a project so it always knows your context.
---

## What Claude is good at

**Claude** is an AI assistant made by **Anthropic**. You use it at **claude.ai** in a browser, or in the Claude apps for computer and phone. Sign up with your email or a Google account; there's a free plan, and paid plans give more use and features.

People use Claude for all kinds of things, but three everyday jobs stand out:

1. **Reading for you:** summarising a long document, finding what matters in it, and answering questions about it.
2. **Rewriting:** turning rough or technical text into something clear for a particular reader.
3. **Working with context:** keeping your business's background, files and preferences in a **project**, so every new chat starts informed.

![Three everyday jobs for an AI assistant (read, rewrite, work with context), and what a project holds: knowledge files and instructions](/images/courses/ai-productivity/claude-jobs.svg "Read, rewrite, and keep your context in a project.")

This module practises all three on realistic material. Features and button names change over time; if something on your screen looks slightly different, look for the nearest match.

## Read a document with Claude

Below is part of a real-style supply agreement between a restaurant and a farm. You're the restaurant manager. You need to know what you've agreed to, without reading every line twice.

```text
SUPPLY AGREEMENT

This agreement is between Mama Put Kitchens Ltd ("the Buyer") of 14 Allen
Avenue, Ikeja, and Greenfield Farms ("the Supplier") of Km 12, Lagos-Ibadan
Expressway. It starts on 1 March 2026.

1. Deliveries. The Supplier will deliver fresh vegetables every Tuesday and
Friday, no later than 9:00am, to the Buyer's kitchen. The Buyer may reject any
produce that is damaged or below the agreed quality when it is delivered.
Rejected produce will not be invoiced.

2. Prices. Prices in Schedule A are fixed for six months from the start date.
After that, the Supplier may change prices once every six months, by no more
than 10% each time, with 21 days' written notice.

3. Payment. The Supplier will invoice weekly. The Buyer will pay each invoice
within 14 days. Late payments will attract interest of 2% of the unpaid amount
for each month or part of a month they are late.

4. Minimum order. The Buyer will order at least ₦200,000 of produce each month.
If it orders less, it will pay the difference at the end of the month.

5. Ending the agreement. Either party may end this agreement with 30 days'
written notice. The Supplier may end it immediately if any invoice is unpaid
for more than 60 days.
```

Copy it, open a new chat in Claude, paste it in, and try prompts like these. (For a PDF or Word file, use the **attach** button, a paperclip or **+**, instead of pasting.)

```text
I'm the manager of Mama Put Kitchens. Summarise this agreement in 5 bullet
points: what we must do, what the supplier must do, and anything that could
cost us money.
```

```text
List every deadline and amount of money in this agreement, with the clause
number each comes from, in a table.
```

```text
What are the risks for us in this agreement? What would you ask the supplier
to change before we sign?
```

A good summary looks something like this:

```text
- Greenfield delivers vegetables every Tuesday and Friday by 9am; you can
  reject damaged produce on delivery and won't be charged for it (cl. 1).
- Prices are fixed until 31 August 2026; after that they can rise by up to
  10% every six months, with 21 days' notice (cl. 2).
- You must pay each weekly invoice within 14 days, or pay 2% interest per
  month late (cl. 3).
- You must buy at least ₦200,000 a month, or pay the shortfall (cl. 4).
- Either side can end it with 30 days' notice; the supplier can end it at
  once if an invoice is over 60 days unpaid (cl. 5).
```

**Then check it.** Claude is a strong reader, but it can misread, round, or slip a detail in from what's "usual" rather than what's written. For anything you'll act on, especially numbers, dates and obligations, find the clause and read it yourself. Asking for clause numbers, as the second prompt does, makes this quick.

![Five steps for using an assistant on a long document: paste, summarise, extract, ask for risks, and always check against the original](/images/courses/ai-productivity/read-document.svg "Summarise, extract, question, and then check against the source.")

> [!WARNING]
> Don't upload confidential documents (customer data, payslips, contracts under a confidentiality clause) unless your organisation has approved the tool for that kind of information. For practice, use public documents or ones like this.

## Rewrite for a different reader

Claude is very good at keeping the meaning while changing the reader. Tell it **who will read it** and **what they need to do**.

```text
Rewrite this for our customers, not engineers. Friendly, under 70 words,
say sorry, and tell them what to do if they were charged twice:

"Due to an upstream API outage our payment gateway returned 502 errors
between 14:00 and 15:30 WAT. Some transactions were captured twice. Duplicate
captures will be auto-reversed within 3-5 business days."
```

```text
Between 2pm and 3:30pm today, a problem with our payment provider meant some
customers were charged twice. We're sorry about this. Any double charge will
be refunded to your account automatically within 3 to 5 working days, so
there's nothing you need to do. If it hasn't arrived by then, reply to this
message and we'll sort it out.
```

Other useful rewrites: "half the length, same points", "more formal, for a bank", or **"don't rewrite it, tell me what's unclear"**, which is the best way to improve your own writing rather than handing it over.

![A technical note rewritten for customers, and other useful rewrites such as shorter, more formal or simpler](/images/courses/ai-productivity/rewrite-reader.svg "Same facts, different reader.")

## Keep your context in a project

If you use Claude for the same kind of work again and again (your business, a course, a job search), create a **project**. A project groups related chats and lets you add:

- **Knowledge files** it can always refer to: your price list, menu, policies, a style guide.
- **Instructions** it follows in every chat in that project.

Good project instructions are short and specific:

```text
You're helping me run Ada's Kitchen, a catering business in Lekki, Lagos.
- Write in British English, warm and simple. No corporate words.
- Prices and menu: use the attached price list only. Never invent a price.
- Customer messages: under 80 words unless I ask for more.
- If you're not sure of a fact about the business, ask me.
```

Every new chat in that project starts already knowing all of this, so you stop repeating yourself.

## Try it

Use Claude (or any AI assistant) on the supply agreement above, then check its answers **against the text yourself** before typing them here.

```answer
{
  "id": "aipf-m02-a1",
  "prompt": "How many days' written notice must either side give to end the agreement normally?",
  "answer": 30,
  "format": "number",
  "hint": "Clause 5.",
  "required": true
}
```

```answer
{
  "id": "aipf-m02-a2",
  "prompt": "An invoice for **₦500,000** is paid **one month late**. How much interest does the restaurant owe, in naira?",
  "answer": 10000,
  "format": "naira",
  "hint": "Clause 3: 2% of the unpaid amount for each month or part of a month.",
  "explanation": "2% of ₦500,000 = ₦10,000. And because it's 'each month **or part of a month**', paying even one day into the second month would double it.",
  "required": true
}
```

```answer
{
  "id": "aipf-m02-a3",
  "prompt": "In July the restaurant only orders **₦170,000** of produce. How much extra does it pay at the end of the month?",
  "answer": 30000,
  "format": "naira",
  "hint": "Clause 4: the minimum is ₦200,000 a month.",
  "explanation": "₦200,000 − ₦170,000 = ₦30,000. The kind of clause a quick summary can make sound harmless.",
  "required": true
}
```

```task
{
  "id": "aipf-m02-t1",
  "prompt": "Write **project instructions** for Claude for a business, job or course of your own (or an invented one). Include who you are, how you want it to write, at least one rule it must never break, and what to do when it isn't sure. Use one line per instruction.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "You're helping me ...\n- Write in ...\n- Never ...\n- If you're not sure ...",
  "rules": [
    { "label": "Says who you are or what the project is about", "pattern": "\\b(I|I'm|my|me|we|our)\\b", "min": 2 },
    { "label": "At least four instructions, one per line", "minLines": 4 },
    { "label": "Says how to write (tone, language, length…)", "pattern": "tone|british|english|simple|formal|friendly|warm|short|words|plain|concise" },
    { "label": "Includes a rule it must never break (never, don't, do not, only…)", "pattern": "never|don't|do not|only use|must not" },
    { "label": "Says what to do when it isn't sure (ask me, check…)", "pattern": "not sure|unsure|don't know|ask me|check with me|if unclear|if you're not certain" }
  ],
  "sample": "You're helping me with my final-year project on mobile money use among market traders in Onitsha.\n- Write in British English, clear and simple, like a good textbook.\n- Never invent statistics, studies or quotes. If I ask for sources, tell me what to search for instead.\n- When I paste my writing, give feedback first; only rewrite if I ask.\n- Keep answers under 200 words unless I ask for more.\n- If you're not sure what I mean, ask me before answering.",
  "note": "The \"never invent\" rule matters most for study and research work, where made-up sources are the biggest risk.",
  "required": true
}
```

To finish, set up a real project in Claude with instructions like yours, add one file to it, and start a chat inside it to see the difference.
