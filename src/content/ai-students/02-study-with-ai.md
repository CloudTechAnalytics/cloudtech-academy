---
title: Study Smarter with AI
minutes: 30
summary: Use AI to explain topics at your level, test yourself instead of re-reading, turn your own notes into flashcards and practice questions, and build a revision plan you'll actually follow.
---

## Why testing beats re-reading

Reading your notes again feels productive, but it mostly builds **familiarity**: the page looks familiar, so you feel you know it. What actually makes knowledge stick is **retrieval**: pulling it out of your memory, for example by answering questions without looking. Spacing that practice over several days helps even more.

AI assistants are very good at the parts of studying that are tedious to do alone: explaining a topic another way, writing practice questions, quizzing you, and turning notes into flashcards. Used well, AI makes you do **more** thinking, not less.

## Ask for explanations that test you

Tell the assistant your level, what confuses you, and ask it to **check your understanding before moving on**:

```text
I'm a 100-level Economics student. I don't understand the difference
between demand-pull and cost-push inflation. Explain it in simple English
with a Nigerian example of each. Then ask me two questions to check I
understood. Wait for my answers before telling me if I'm right.
```

That last line matters. Without it, the AI explains and then answers its own questions, and you're back to reading. With it, the chat becomes a tutor that waits for you.

Some assistants have a **study or learning mode** that guides you with questions instead of giving the answer straight away. If yours has one, try it for topics you find hard.

## Turn your own notes into study tools

Working from **your own notes** keeps the AI close to what your lecturer actually taught, instead of what's "usual" elsewhere. Here's a short page of lecture notes. You'll use it in the tasks below.

```text
ECO 102 - Week 6: Inflation

Inflation is a sustained rise in the general price level over time. It
reduces the purchasing power of money: the same ₦1,000 buys less.

Measuring inflation: the Consumer Price Index (CPI) tracks the price of a
fixed basket of goods and services households buy. In Nigeria it's published
monthly by the National Bureau of Statistics (NBS).
Inflation rate = (CPI this year - CPI last year) / CPI last year x 100

Causes:
1. Demand-pull: total demand grows faster than the economy can produce,
   e.g. a big rise in government spending or credit.
2. Cost-push: production costs rise and firms pass them on, e.g. higher
   fuel, transport or imported input costs after a currency depreciation.
3. Built-in (wage-price spiral): workers expect prices to rise, ask for
   higher wages, and firms raise prices to cover them.

Effects: hurts people on fixed incomes and savers; creates uncertainty for
businesses; can help borrowers, because debts are repaid in money worth less.
```

Paste notes like these into an AI assistant and ask:

- "Make 10 flashcards from these notes: a question on one side, a short answer on the other."
- "Write 5 multiple-choice questions on these notes, with an explanation for each wrong option."
- "Ask me 5 questions on these notes one at a time. Wait for each answer and tell me what I missed."
- "Which parts are most likely to come up in an exam, and why?" (Treat this as a guess, not a promise.)

> [!WARNING]
> AI makes mistakes in calculations and science working. Use it to understand the **method**, then check the steps yourself or against a worked example from your course.

## Plan your revision

A revision plan works when it fits your real week. Give the AI your real constraints:

```text
I have exams in 3 weeks: MTH101 (hardest for me) on 10 June, CHM101 on
12 June, PHY101 on 14 June and GST111 on 16 June. I can study 3 hours on
weekdays and 5 on Saturdays; Sundays are for church and rest. Make a
revision timetable that spreads each course over several days, gives
MTH101 the most time, includes past questions, and leaves the day before
each exam for practice only.
```

Then edit it to match real life. A plan you follow beats a perfect plan you don't.

## Try it

Use an AI assistant with the inflation notes above for these.

```answer
{
  "id": "aistu-m02-a1",
  "prompt": "Using the formula in the notes: the CPI was **200** last year and is **230** this year. What is the inflation rate, in percent?",
  "answer": 15,
  "format": "percent",
  "hint": "(230 − 200) ÷ 200 × 100",
  "explanation": "15%. If an AI gives you a different figure for a question like this, the formula in your notes wins.",
  "required": true
}
```

```task
{
  "id": "aistu-m02-t1",
  "prompt": "Write **five flashcards** from the inflation notes, one per line, as `question | answer`. Cover different parts of the notes. (You can ask an AI to draft them, but check every answer against the notes.)",
  "minutes": 8,
  "rows": 7,
  "placeholder": "What is inflation? | A sustained rise in the general price level\n...",
  "rules": [
    { "label": "Five flashcards, each written as question | answer", "pattern": "^[^|\\n]*\\S[^|\\n]*\\|[ \\t]*\\S", "min": 5 },
    { "label": "Covers at least three different ideas from the notes (CPI, demand-pull, cost-push, purchasing power, wage-price…)", "pattern": "cpi|consumer price|demand-pull|demand pull|cost-push|cost push|purchasing power|wage|fixed income|borrower|saver|nbs|basket", "min": 3 }
  ],
  "sample": "What is inflation? | A sustained rise in the general price level over time\nWhat does the CPI measure? | The price of a fixed basket of goods and services households buy\nWhat causes demand-pull inflation? | Total demand growing faster than the economy can produce\nGive an example of cost-push inflation. | Higher fuel or imported input costs passed on to prices\nWho can benefit from inflation? | Borrowers, because debts are repaid in money worth less",
  "note": "Good flashcards ask one thing each and have short answers you can check yourself. Now test yourself: cover the answers and say them aloud.",
  "required": true
}
```

```task
{
  "id": "aistu-m02-t2",
  "prompt": "Write a prompt that makes an AI **quiz you** on a topic from your own course: one question at a time, waiting for your answer before marking it.",
  "minutes": 5,
  "rows": 4,
  "placeholder": "Quiz me on ...",
  "rules": [
    { "label": "Asks to be quizzed or tested", "pattern": "quiz|test me|ask me|question" },
    { "label": "One at a time, or waiting for your answer", "pattern": "one at a time|wait|before (telling|you tell|giving|marking)|don't (show|give)|do not (show|give)" },
    { "label": "Names a topic or course", "pattern": "on |about |topic|course|chapter|week" },
    { "label": "At least 15 words", "minWords": 15 }
  ],
  "sample": "Quiz me on Week 6 of ECO 102 (inflation) using the notes I paste below. Ask me one question at a time and wait for my answer. Then tell me what I got right, what I missed, and ask the next question. Make the last two questions harder.",
  "required": true
}
```

```task
{
  "id": "aistu-m02-t3",
  "prompt": "Write a **revision-plan prompt** for your own upcoming exams or tests: the courses, their dates or how far away they are, which one is hardest, and how much time you really have each day.",
  "minutes": 5,
  "rows": 5,
  "placeholder": "I have exams in ...",
  "rules": [
    { "label": "Lists at least two courses or subjects", "pattern": "[a-z]{3} ?\\d{3}|math|english|biology|chemistry|physics|economics|account|law|history|government|literature|course|subject", "min": 2 },
    { "label": "Says when the exams are (dates, weeks, days)", "pattern": "\\d+ (weeks?|days?)|june|july|may|january|february|march|april|august|september|october|november|december|\\d{1,2}/\\d{1,2}|monday|friday" },
    { "label": "Says how much time you have (hours)", "pattern": "hours?|hrs|minutes" },
    { "label": "Says which is hardest or needs most time", "pattern": "hardest|most time|weakest|difficult|struggle|priority" }
  ],
  "sample": "I have exams in 4 weeks: ACC201 on 2 July (my weakest), ECO203 on 5 July and GST211 on 8 July. I can study 2 hours on weekdays after lectures and 4 hours on Saturdays. Make a timetable that gives ACC201 the most time, mixes the courses through each week, includes past questions, and keeps the day before each exam for practice questions only.",
  "required": true
}
```

Then actually do it: paste the notes, get quizzed, and answer without looking.
