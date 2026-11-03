---
title: AI Fundamentals for Students
minutes: 20
handsOn: 5
summary: What AI assistants like ChatGPT actually do, why they're brilliant at explaining and unreliable with facts, how to catch their mistakes, and how to stay within your school's rules.
---

## What ChatGPT actually is

ChatGPT, Claude, Gemini and Copilot are **AI assistants** built on **large language models**. A language model learned patterns from an enormous amount of text, and it answers by predicting, piece by piece, what a helpful reply would look like.

That one fact explains most of what you need to know:

- They're excellent at **explaining, rephrasing, summarising, organising and giving examples**, because those are patterns of language they've seen countless times.
- They **don't look facts up** unless they're searching the web. When the pattern says "a date goes here" or "a reference goes here", they can produce one that sounds right but isn't. This is called a **hallucination**, and it's delivered in exactly the same confident tone as everything else.
- They haven't seen **your lecturer's notes, your marking scheme or your department's rules** unless you share them.

Think of an AI assistant as a fast, well-read study partner who is sometimes confidently wrong. Very useful, as long as you stay in charge.

![A question goes to the model, which predicts a helpful reply from patterns in text; so it is strong at explaining, rephrasing, giving examples and quizzing, and risky for exact dates, statistics, quotes and references](/images/courses/ai-students/how-it-answers.svg "An AI assistant predicts helpful words; it does not look facts up.")

## What it looks like when it works, and when it doesn't

**When it works.** Ask for an explanation at your level, with a local example:

```text
I'm a 100-level economics student. Explain opportunity cost in simple
English with an example from student life in Nigeria. Then ask me one
question to check I understood.
```

```text
Opportunity cost is what you give up when you choose one thing over
another: the value of the next best option you didn't take.

Example: you have ₦3,000. You can buy a textbook for MTH101 or go to a
friend's birthday outing. If you buy the textbook, the opportunity cost
is the outing (the fun, the time with friends). If you go out, the
opportunity cost is the textbook and the study time it would have given you.

Check question: you spend Saturday afternoon working a shift for ₦5,000
instead of revising for a test on Monday. What is the opportunity cost?
```

Clear, pitched at the right level, and it tests you. This is AI at its best.

**When it doesn't.** Here's a reply to "what is the derivative of x³ + 2x?" that looks perfectly confident:

```text
To differentiate, bring the power down and reduce it by one.
d/dx (x³) = 3x
d/dx (2x) = 2
So the derivative of x³ + 2x is 3x + 2.
```

The method it describes is right; the working isn't. Bringing the power down and reducing it by one turns x³ into **3x²**, not 3x. If you copied this into an assignment, you'd lose the marks and learn the wrong thing. The fix is simple: **use AI to understand the method, then check each step yourself.**

The other big danger is **invented references**. Ask for "three journal articles that show X" and you may get three realistic titles, authors, journals and page numbers, some of which don't exist. Submitting a fake reference can be treated as academic misconduct, even if the AI made it up, not you.

## What it's good and bad at, for students

| Good for | Risky for |
| :-- | :-- |
| Explaining a topic another way, with examples | Exact dates, statistics and quotes |
| Breaking down a hard paragraph | References and citations |
| Practice questions and quizzes | Maths and science working (check every step) |
| Planning revision | Anything specific to your course or lecturer |
| Feedback on your own draft | Current events, unless it searches and shows sources |

## Academic integrity: the rules come first

Every school, department and lecturer sets their own rules on AI. Some allow it for brainstorming but not writing; some ban it from assessed work entirely; some require you to declare how you used it. Before using AI for anything that's graded:

1. **Check the rules** in your course outline or student handbook, or ask your lecturer.
2. **Never submit AI-written work as your own** where that isn't allowed. It can count as plagiarism or exam malpractice.
3. **Be ready to explain** everything you submit. If you couldn't explain it in a viva, it isn't yours.
4. **Declare how you used AI** whenever you're asked to.

![First check the course's AI rules: if AI isn't allowed for the work, don't use it; if it is, understand rather than outsource, be able to explain everything, and declare how you used it](/images/courses/ai-students/rules-first.svg "Rules first, then use AI to learn rather than to do the assessment.")

> [!TIP]
> A simple test: use AI to help you **understand and practise**, not to **do the assessment for you**.

## Try it

```answer
{
  "id": "aistu-m01-a1",
  "prompt": "In the derivative example above, what is the correct derivative of **x³ + 2x**? Type it using `^` for powers, e.g. `5x^4 + 1`.",
  "answer": "3x^2 + 2",
  "format": "text",
  "accept": ["3x^2+2", "3x² + 2", "3x²+2", "3x**2 + 2", "3x**2+2", "3 x^2 + 2", "2 + 3x^2"],
  "hint": "Bring the power down and reduce it by one: x³ becomes 3x². The 2x becomes 2.",
  "explanation": "3x² + 2. The AI described the rule correctly and then applied it wrongly: a very common pattern. Always check the working, not just the explanation.",
  "required": true
}
```

Your course outline says: *"AI tools may be used to understand topics and to practise. They may not be used to write any part of an assessed essay."* Which of these uses **breaks** that rule?

- **A.** Asking ChatGPT to explain a theory from the reading list in simpler words.
- **B.** Asking ChatGPT for 10 practice questions on the topic before the test.
- **C.** Asking ChatGPT to write your essay's conclusion and pasting it in.
- **D.** Asking ChatGPT to quiz you on your lecture notes.

```answer
{
  "id": "aistu-m01-a2",
  "prompt": "Which use breaks the rule? Type the letter.",
  "answer": "C",
  "format": "text",
  "accept": ["c.", "(c)"],
  "explanation": "C puts AI-written words into assessed work. A, B and D help you understand and practise, which this rule allows.",
  "required": true
}
```

```task
{
  "id": "aistu-m01-t1",
  "prompt": "Write a prompt to understand a topic from **one of your own courses**. Say your level, ask for simple language and a real-life example, and ask the AI to check your understanding with a question. Then use it in an AI assistant.",
  "minutes": 6,
  "rows": 5,
  "placeholder": "I'm a ...-level student in ... Explain ... ",
  "rules": [
    { "label": "Says your level or year (100-level, SS2, first year…)", "pattern": "\\d00[- ]?level|year|ss[1-3]|jss|level|semester|freshman|first-year|second-year|final" },
    { "label": "Names the topic to explain", "pattern": "explain|teach me|help me understand|what is" },
    { "label": "Asks for an example", "pattern": "example|e\\.g\\.|for instance|real[- ]life" },
    { "label": "Asks it to check your understanding (question, quiz, test me…)", "pattern": "question|quiz|test me|check (my|that I)" },
    { "label": "At least 20 words", "minWords": 20 }
  ],
  "sample": "I'm a 200-level biochemistry student. Explain how enzymes speed up reactions, in simple English, with one real-life example from cooking or the body. Then ask me two questions to check I understood, and wait for my answers before telling me if I'm right.",
  "note": "\"Wait for my answers\" turns an explanation into practice. Being tested is one of the most reliable ways to remember.",
  "required": true
}
```

Then run your prompt, answer its question honestly, and check one fact from the explanation against your textbook or notes.
