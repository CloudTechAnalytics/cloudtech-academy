---
title: Get Ready for an Internship
minutes: 20
summary: Understand what internships and SIWES placements are, what employers look for in students, and get your documents ready before you apply.
---

## What an internship is

An **internship** is a short period of work (usually one to six months) where you learn on the job. Some are paid, some offer a stipend, and some are unpaid. They give you:

- **Experience** to put on your CV.
- **References** from people who've seen you work.
- A clearer idea of what you do (and don't) want to do after school.
- Sometimes, a **job offer** when you graduate.

## SIWES and IT placements

Many Nigerian university and polytechnic programmes require **SIWES** (Students Industrial Work Experience Scheme), run with the Industrial Training Fund (ITF). If your course requires it:

- Your **SIWES coordinator** gives you a placement letter and a **logbook**. Ask early.
- **You** usually have to find the organisation. Start looking at least two to three months before your placement begins.
- Fill in your logbook **every day or week** with what you did. It's assessed.
- Choose a placement where you'll **do real work** in your field, not just run errands.

Even if SIWES isn't required, the same approach works for any internship.

## What employers look for in students

They don't expect experience. They look for:

| Quality | How to show it |
| :-- | :-- |
| **Willingness to learn** | Courses and badges you've completed on your own |
| **Reliability** | Class rep, club roles, volunteering, a part-time job |
| **Communication** | A clear CV, a polite, well-written email |
| **Basic tools** | Excel, Google Workspace, Canva, or whatever your field uses |
| **Evidence** | Projects in a portfolio or on GitHub |

## Get your documents ready

Before you apply anywhere, have these ready in one Drive folder:

1. **CV:** one page, tailored to internships (see the Career Essentials course).
2. **Cover letter template** you can adapt quickly.
3. **LinkedIn profile** with a photo and headline.
4. **Portfolio link**, even with one or two projects.
5. **Documents** schools and employers often ask for: student ID, school letter, transcript or result slip, and passport photo.

> [!TIP]
> Save your CV as a PDF named `CV-Firstname-Lastname.pdf`. Recruiters see hundreds of files called `CV.pdf`.

## Try it

```answer
{
  "id": "intern-m01-a1",
  "prompt": "Which organisation runs SIWES together with universities and polytechnics? Give its short name.",
  "answer": "ITF",
  "format": "text",
  "accept": ["industrial training fund", "the itf", "the industrial training fund"],
  "required": true
}
```

```task
{
  "id": "intern-m01-t1",
  "prompt": "Write your **internship plan**, one item per line: `Dates:` (when it should start and end), `Where:` (three kinds of organisation where you'd learn something useful in your field), `Folder:` (what's in your Internship folder now), and `Skill:` (one skill you'll build before applying, and how).",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Dates: ...\nWhere: ...\nFolder: ...\nSkill: ...",
  "rules": [
    { "label": "Dates: with a month or year", "pattern": "^\\s*dates?\\s*:[^\\n]*(20\\d\\d|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)" },
    { "label": "Where: with at least three kinds of organisation", "pattern": "^\\s*where\\s*:[^\\n]*,[^\\n]*,[^\\n]*" },
    { "label": "Folder: lists your documents (CV, cover letter, ID, letter, transcript…)", "pattern": "^\\s*folder\\s*:[^\\n]*(cv|cover letter|transcript|id|letter|result|photo)" },
    { "label": "Skill: names a skill and how you'll build it (course, practise, project…)", "pattern": "^\\s*skill\\s*:[^\\n]*(course|practi|project|learn|tutorial|class|by )" }
  ],
  "sample": "Dates: February to July 2027 (six months of SIWES)\nWhere: accounting firms, bank operations teams, the finance department of a manufacturing company\nFolder: CV-Chinedu-Okeke.pdf, cover letter draft, student ID, SIWES placement letter, result slip\nSkill: Excel pivot tables and XLOOKUP, by finishing CloudTech's Excel for Data Analysis course by December",
  "required": true
}
```
