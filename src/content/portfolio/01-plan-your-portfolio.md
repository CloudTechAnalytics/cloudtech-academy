---
title: Plan Your Portfolio
minutes: 20
summary: Decide what a portfolio is for, what to put in it, and which three pieces of work best show what you can do.
---

## Why a portfolio beats a list of skills

A CV says "Skilled in Excel and Canva". A portfolio **shows** it: the dashboard you built, the poster you designed, the website you made. For students with little work experience, a portfolio is often the strongest thing you can show an employer, internship coordinator or scholarship panel.

It doesn't need to be fancy. A clear page with three good pieces of work beats a flashy site with nothing in it.

## Who is it for?

Decide before you build. Your audience shapes what you include:

| If you're aiming for… | Show… |
| :-- | :-- |
| Data or analytics roles | Spreadsheets, dashboards, SQL queries, a short analysis write-up |
| Design or content | Posters, social graphics, short videos, a before-and-after redesign |
| Software or web | Websites, small apps, code on GitHub |
| Any internship | Class projects, volunteering, leadership, certificates and badges |

## What counts as work

You have more than you think:

- **Class projects and assignments** you're proud of (check you're allowed to share them, and remove other students' personal details).
- **Personal projects**: a budget tracker for your hostel, a flyer for a church event, a website for a relative's shop.
- **Course projects**, including CloudTech Academy projects and badges.
- **Volunteering and leadership**: a departmental event you organised, a club you run.

## Pick your best three

Start small. For each possible piece, ask:

1. Does it show a skill my audience cares about?
2. Can I explain **what problem it solved** and **what I did**?
3. Is it finished and presentable?

Choose the **three** strongest. You can add more later.

## Structure each piece the same way

For every project, prepare four short parts. This works on a portfolio page, on LinkedIn and in interviews:

- **The problem:** what needed doing, and why.
- **What I did:** the tools and steps.
- **The result:** a number, an outcome or feedback.
- **See it:** a link, image or file.

> [!TIP]
> "Built an Excel tracker that cut our class dues reconciliation from two hours to ten minutes" is far stronger than "Made a spreadsheet".

## Try it

```task
{
  "id": "portf-m01-t1",
  "prompt": "Write **who your portfolio is for** in one sentence on the first line. Then list **at least six** things you could include, one per line, and mark your best three with `*` at the start of the line.",
  "minutes": 8,
  "rows": 9,
  "placeholder": "My portfolio is for ...\n* ...\n* ...\n* ...\n- ...\n- ...\n- ...",
  "rules": [
    { "label": "First line says who it's for (for, aimed at, recruiters, internships…)", "pattern": "(?<![\\s\\S])\\s*[^\\n]*(for |aimed at|recruiter|employer|intern|client|role|job)" },
    { "label": "At least seven lines: the sentence plus six possible pieces", "minLines": 7 },
    { "label": "Exactly three marked with * as your best", "pattern": "^\\s*\\*\\s*\\S", "min": 3 },
    { "label": "No more than three marked with *", "pattern": "(^[ \\t]*\\*[^\\n]*\\n?[^*]*){4}", "absent": true }
  ],
  "sample": "My portfolio is for recruiters hiring data analyst interns in Lagos.\n* Sales dashboard in Power BI from the CloudTech course project\n* Excel tracker for our class dues, used by 120 students\n* SQL analysis of a logistics database (course project)\n- Flyer for our departmental week\n- Group presentation on mobile money in Nigeria\n- Treasurer of the Economics Students' Association",
  "note": "Each starred piece shows a skill data recruiters care about, can be explained in an interview, and is finished. The others are real, just less relevant to this audience.",
  "required": true
}
```

```task
{
  "id": "portf-m01-t2",
  "prompt": "For **one** of your best three, write the four parts, one per line: `Problem:`, `What I did:`, `Result:` (with a number or a concrete outcome) and `See it:` (a link, or where the link will go).",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Problem: ...\nWhat I did: ...\nResult: ...\nSee it: ...",
  "rules": [
    { "label": "Problem:", "pattern": "^\\s*problem\\s*:\\s*\\S" },
    { "label": "What I did: (with tools or steps)", "pattern": "^\\s*what i did\\s*:\\s*\\S" },
    { "label": "Result: with a number or concrete outcome", "pattern": "^\\s*result\\s*:[^\\n]*(\\d|half|double|twice|all |every)" },
    { "label": "See it:", "pattern": "^\\s*see it\\s*:\\s*\\S" }
  ],
  "sample": "Problem: Our class treasurer tracked dues for 120 students on paper, and reconciling them took two hours a week.\nWhat I did: Built an Excel tracker with a table of payments, COUNTIF to flag who hadn't paid, and a summary by month.\nResult: Reconciliation now takes ten minutes, and unpaid dues fell from 40 students to 12 in one semester.\nSee it: Google Drive link (sample data, names removed)",
  "required": true
}
```
