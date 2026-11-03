---
title: Review, present and publish
minutes: 25
summary: Check your own work the way a reviewer will, prepare for the board's hardest questions, and turn the capstone into a portfolio piece employers will read.
---

## The problem

Your report is built. Three things still stand between it and being useful.

First, **it hasn't been checked**. Every analyst makes mistakes; good ones catch them before anyone else does. Second, **it hasn't been presented**. The board will ask questions, and "I'll get back to you" on an obvious one undoes a month of work. Third, **nobody outside Voltline will ever see it**. As a job seeker, the capstone is your strongest proof that you can do the job, but only if you publish it in a form a recruiter can take in within two minutes.

## The concept

### Review your own work like a stranger

Leave it for a day, then check:

| Check | How |
| :-- | :-- |
| Totals reconcile | net sales matches the cleaning reconciliation; store totals add up to the chain |
| Definitions are visible | net sales, gross profit, like for like and the period are stated on the report |
| Every number is explained | each chart title states a finding; every KPI has a comparison |
| Caveats are honest | estimates have assumptions; Lekki's targets are explained |
| Someone else could rerun it | your cleaning steps, queries and measures are saved and labelled |

Then ask someone else to read the executive summary and tell you, in their own words, the three main messages. If they can't, the summary isn't finished.

### Prepare for the questions you'll be asked

Boards ask predictable questions: "How do you know?", "Compared with what?", "What would you do?" and "What could make this wrong?" Write down the three hardest questions you expect and your answer to each, with the number you'll point to.

### Publish it for your portfolio

A portfolio entry is a short case study, not the full report:

1. **The problem**, in one or two sentences.
2. **The data**: what it was and what was wrong with it.
3. **What you did**: the tools and the main steps.
4. **What you found**: two or three findings with numbers.
5. **Links**: the report (PDF or Power BI link), and your code or workbook.

![A review checklist, a ten-minute talk split into one, six and three minutes, four hard board questions, and the five parts of a portfolio case study](/images/courses/capstone/review-present-publish.svg "Review, rehearse, then publish a short case study.")

Publish it on GitHub (a README with screenshots), a portfolio site, or a LinkedIn post linking to them. The Build Your Student Portfolio course covers the details.

> [!NOTE]
> Voltline is fictional, so you can publish everything. With a real employer's data you'd need permission first, and you'd often have to anonymise or recreate the data.

## Example

A portfolio summary that a recruiter can read in a minute:

> **Voltline Electronics: what's really driving 37% growth?** A capstone project for an 8-store electronics chain. I cleaned a raw till export of 27,978 lines (a duplicated upload, three date and naming problems, and test transactions), built a star-schema model in Power BI with date-based cost lookups, and analysed 18 months of sales. Like-for-like growth was 18.3%, matching the 18% price rise, so the existing stores' volume was flat. Solar now earns twice the gross profit of phones, and one store's transactions fell 27% after a competitor opened. Tools: Power Query, DAX, SQL. [Report] [Code]

## Walkthrough

1. Run through the review checklist and fix what you find. Note what you changed.
2. Ask a friend or classmate to read your executive summary and repeat the three messages back to you.
3. Write your three hardest board questions and answers (the first task below).
4. Rehearse a 10-minute presentation: 1 minute on the question, 6 on the three findings, 3 on the recommendations. Leave the remaining time for questions.
5. Export the report to PDF, take two or three screenshots, and write your portfolio summary (the second task).
6. Publish: a GitHub repository with a README, or a page on your portfolio site, then share the link.

## Practice

```task
{
  "id": "cap-07-t1",
  "prompt": "Write the **three hardest questions** you expect from Voltline's board, each with your answer. Start each question on its own line with `Q:` and each answer on its own line with `A:`. Each answer should point to a number.",
  "minutes": 10,
  "rows": 12,
  "placeholder": "Q: ...\nA: ...\n\nQ: ...\nA: ...",
  "rules": [
    { "label": "Three questions, each on a line starting with Q:", "pattern": "^\\s*Q\\s*:", "min": 3 },
    { "label": "Three answers, each on a line starting with A:", "pattern": "^\\s*A\\s*:", "min": 3 },
    { "label": "Each answer includes a number", "pattern": "^\\s*A\\s*:.*\\d", "min": 3 },
    { "label": "Enough detail: at least 80 words", "minWords": 80 }
  ],
  "sample": "Q: If like-for-like volume is flat, why did gross profit grow?\nA: Mix. Solar & power, at an 18.4% margin, rose from ₦60.4m to ₦124.3m of gross profit, while phones, at 9.3%, grew far less. Gross margin rose from 12.9% to 13.8%.\n\nQ: Is Port Harcourt's fall really the competitor, or the store team?\nA: The drop starts in February 2026, the month the competitor opened, and transactions fell 27.3% while the store's average sale held up. Every other existing store held steady. I'd still ask the store manager before concluding.\n\nQ: How sure are you about the ₦6.5m lost on inverters at Wuse?\nA: It's an estimate: 8 sold in the 60 days before the stock-out, times 53 days out, times the ₦932,000 price. A range of ₦5m to ₦8m is fair, depending on the period taken as normal.",
  "note": "Good answers concede what's uncertain (\"I'd still ask the store manager\") while standing by the numbers. That's what makes a board trust the rest of the report.",
  "required": true
}
```

```task
{
  "id": "cap-07-t2",
  "prompt": "Write your **portfolio summary** for the capstone: the problem, the data and its problems, what you did (with your tools), and at least two findings with numbers. Between 80 and 200 words.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Voltline Electronics: ...",
  "rules": [
    { "label": "Names the company or project", "pattern": "voltline" },
    { "label": "Mentions the data problems you fixed (duplicates, dates, test rows or names)", "pattern": "duplicat|date|test|clean" },
    { "label": "Names at least one tool", "pattern": "power bi|power query|dax|sql|excel|python|pandas" },
    { "label": "At least two findings with numbers", "pattern": "\\d+(\\.\\d+)?\\s*(%|m\\b|bn\\b)", "min": 2 },
    { "label": "Between 80 and 200 words", "minWords": 80, "maxWords": 200 }
  ],
  "sample": "**Voltline Electronics: what's really driving 37% growth?** A capstone project for an 8-store electronics chain. I cleaned a raw till export of 27,978 lines (a duplicated upload, mixed date formats, ten spellings of eight store names and test transactions), built a star-schema model in Power BI with date-based cost lookups, and analysed 18 months of sales. Like-for-like growth was 18.3%, matching the 18% price rise, so the existing stores' volume was flat. Solar now earns twice the gross profit of phones (₦124.3m against ₦64.2m), and Port Harcourt's transactions fell 27.3% after a competitor opened next door. I recommended prioritising solar stock, an accessory sales script for three stores and a supplier review of one phone with a 9.5% return rate. Tools: Power Query, DAX and SQL.",
  "note": "A recruiter will spend about a minute on this. Lead with the question, prove you can handle messy data, and finish with numbers and recommendations: the three things a hiring manager is looking for in a junior analyst.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A friend reads your executive summary but can't say what the three main messages are. What should you do?",
    "options": ["Find a different reader", "Rewrite the summary: if a reader can't repeat the messages, they aren't clear yet", "Add more charts", "Make it longer"],
    "answer": 1,
    "explanation": "The test of a summary is what the reader remembers."
  },
  {
    "prompt": "A board member asks a question you can't answer from the data. What's the best response?",
    "options": ["Guess", "Say what the data does and doesn't show, and offer to find out", "Change the subject", "Say the data is wrong"],
    "answer": 1,
    "explanation": "Honesty about the limits of the data builds trust in everything else you said."
  },
  {
    "prompt": "What belongs in a portfolio case study?",
    "options": ["The full report and every query", "A short summary of the problem, the data, what you did and what you found, with links to the full work", "Only screenshots", "Only the tools you used"],
    "answer": 1,
    "explanation": "Make it readable in a minute, with the full detail one click away."
  }
]
```
