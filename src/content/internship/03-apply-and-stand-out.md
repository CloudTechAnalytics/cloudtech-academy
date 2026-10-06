---
title: Apply and Stand Out
minutes: 20
summary: Write a short cover letter that gets read, tailor your CV to each role, and track your applications so none slip through.
---

## Quality beats quantity

Sending the same CV to 100 places rarely works. Ten **tailored** applications usually do better than 100 generic ones.

## Tailor your CV in five minutes

For each application:

1. Read the advert and highlight the **skills and tools** it mentions.
2. Make sure those words appear in your CV, where they're true.
3. Move your **most relevant** project or experience to the top.
4. Update your one-line summary to match the role: "Economics student with Excel and Power BI skills, seeking a data analyst internship."

## A short cover letter

Keep it under 200 words, in three paragraphs:

```text
Dear Hiring Manager,

I'm applying for the Data Analyst Intern role at Kolanut Foods. I'm a
300 level Statistics student at UNIBEN, and I'm available from
January to June 2027.

In my coursework and personal projects I've cleaned and analysed sales
data in Excel and Python, and built a Power BI dashboard showing revenue
by region (portfolio: [link]). I'd enjoy helping your team turn data
into clear reports.

Thank you for considering my application. I'd welcome the chance to
discuss how I can help.

Kind regards,
Efosa Igbinedion
```

1. **Why this role**, who you are and when you're available.
2. **One or two examples** that match what they need.
3. **Thanks** and a clear close.

![Tailor a CV in four steps, and write a cover letter in three paragraphs: why this role, proof, and thanks with a clear close](/images/courses/internship/tailor-cover.svg "Tailor the CV in four steps; keep the cover letter to three paragraphs.")

> [!TIP]
> AI tools can help you draft and polish, but always rewrite in your own voice and check every claim is true. Recruiters notice generic, AI-sounding letters.

## Track your applications

Use a simple Google Sheet:

| Company | Role | Link | Date applied | Status | Follow-up date | Notes |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Kolanut Foods | Data Analyst Intern | … | 2026-10-02 | Applied | 2026-10-16 | Referred by Tolu |

![A status for each application from saved to applied, interview and offer or rejected, one example row in the tracking sheet, and a follow-up after about two weeks](/images/courses/internship/tracker.svg "A status for every application, and a follow-up date.")

Add a **Status** dropdown: Saved, Applied, Interview, Offer, Rejected.

## Follow up

If you haven't heard back in about two weeks, send one short, polite follow-up email. Then move on. Don't take silence personally; it's normal.

## Try it

Use a real internship advert you'd like to apply for, or this one:

```text
MARKETING INTERN (6 months) - Ibadan
We're a growing skincare brand looking for a marketing intern to help run our
Instagram and WhatsApp channels, create simple designs in Canva, and track
weekly results in Google Sheets. Final-year students or recent graduates.
Start date: January 2027.
```

```task
{
  "id": "intern-m03-t1",
  "prompt": "Write a **three-paragraph cover letter** for the role, under 200 words: why this role (with who you are and when you're available), one or two examples that match what they need, then thanks and a clear close.",
  "minutes": 15,
  "rows": 14,
  "placeholder": "Dear Hiring Manager,\n\nI'm applying for ...\n\n...\n\nThank you ...\n\nKind regards,\n...",
  "rules": [
    { "label": "A greeting", "pattern": "^\\s*(dear|good (morning|afternoon))\\b" },
    { "label": "Names the role", "pattern": "intern" },
    { "label": "Says when you're available", "pattern": "available|start|from (january|february|march|april|may|june|july|august|september|october|november|december)|20\\d\\d" },
    { "label": "Gives an example matching the advert (Instagram, Canva, Sheets, WhatsApp, a project…)", "pattern": "instagram|canva|sheets|whatsapp|excel|project|campaign|posts|designed|managed|built|grew" },
    { "label": "At least three paragraphs (blank lines between them)", "pattern": "\\n[ \\t]*\\n", "min": 3 },
    { "label": "Thanks them", "pattern": "thank" },
    { "label": "Under 200 words", "minWords": 80, "maxWords": 200 },
    { "label": "No generic AI phrases (passionate, dynamic, synergy, leverage)", "pattern": "passionate|dynamic|synerg|leverag|esteemed organi[sz]ation", "absent": true }
  ],
  "sample": "Dear Hiring Manager,\n\nI'm applying for the Marketing Intern role. I'm a final-year Mass Communication student at the University of Ibadan, available from January to June 2027.\n\nFor my department's careers week, I ran our Instagram page for six weeks, designing posts in Canva and tracking reach in Google Sheets; followers grew from 300 to 1,100. I also manage a WhatsApp broadcast list of 250 students for my faculty, so I'm used to writing short, clear messages that people act on.\n\nThank you for considering my application. I'd welcome the chance to discuss how I could help your team.\n\nKind regards,\nTemitope Adebayo",
  "required": true
}
```

```task
{
  "id": "intern-m03-t2",
  "prompt": "Set up your **application tracker** in Google Sheets. Write its header row, then one real or example row, with values separated by `|`.",
  "minutes": 5,
  "rows": 3,
  "placeholder": "Company | Role | Link | Date applied | Status | Follow-up date | Notes\n...",
  "rules": [
    { "label": "A header row with Company, Role, Status and a date column", "pattern": "company[^\\n]*role[^\\n]*(date|applied)[^\\n]*status|company[^\\n]*role[^\\n]*status[^\\n]*(date|follow)" },
    { "label": "A follow-up date column", "pattern": "follow" },
    { "label": "A data row with a date in YYYY-MM-DD form", "pattern": "20\\d\\d-\\d\\d-\\d\\d" },
    { "label": "A status from the list (Saved, Applied, Interview, Offer, Rejected)", "pattern": "\\|\\s*(saved|applied|interview|offer|rejected)\\s*\\|" }
  ],
  "sample": "Company | Role | Link | Date applied | Status | Follow-up date | Notes\nGlowSkin Naturals | Marketing Intern | linkedin.com/jobs/view/… | 2026-10-02 | Applied | 2026-10-16 | Tailored CV around Canva and Instagram",
  "required": true
}
```

Then apply to at least one role this week, and set a reminder for your follow-up date.
