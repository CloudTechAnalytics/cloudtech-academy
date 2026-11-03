---
title: Show Your Work
minutes: 20
summary: Turn projects into something people can open and understand in a minute, with good screenshots, clean files and a short write-up.
---

## Make it easy to see

A reviewer will spend a minute or two on each project. Help them:

- **Lead with a picture.** A clear screenshot of the dashboard, poster or website, not a photo of your laptop screen.
- **Link, don't attach.** Put files somewhere with a shareable link: Google Drive, GitHub or a portfolio page.
- **Name things clearly.** `Kolanut-sales-dashboard.pdf`, not `final final 2.pdf`.

## Where to host each kind of work

| Work | Good place | How to share |
| :-- | :-- | :-- |
| Documents, spreadsheets, slides | Google Drive or OneDrive | Share → "Anyone with the link can view" |
| Designs and posters | Canva, or images on your portfolio page | Canva share link set to view-only, or an exported PNG/PDF |
| Code, websites, data analysis | GitHub | A repository with a README (see the Git & GitHub course) |
| Videos | YouTube (unlisted is fine) or Drive | A link, plus a thumbnail image |

![Four kinds of work matched to where they live and how to share them, then three checks to make before sharing any link](/images/courses/portfolio/hosting.svg "Put each kind of work somewhere linkable, then test the link.")

> [!WARNING]
> Before sharing a link, open it in a private browser window. If it asks you to sign in, your settings are wrong. Also check you haven't shared **edit** access by mistake.

## Write a short project summary

Use the structure from the last module, kept short. Here's an example:

```text
Sales dashboard for a drinks distributor (Power BI)

Problem: The sales team tracked orders in a spreadsheet and couldn't see
which regions were slowing down.
What I did: Cleaned 4,000 order lines, built a data model, and designed
a two-page dashboard with revenue by region, product and month.
Result: Showed North West revenue fell by almost half year on year,
which became the focus of the sales review.
See it: [link to PDF] · [link to .pbix on Drive]
```

## Protect privacy

- Remove other people's **personal details**: names, phone numbers, grades.
- Don't publish **confidential** work from an internship or employer. Recreate it with made-up data instead, and say so.
- Blur or crop anything personal in screenshots.

## Try it

A recruiter receives four files from four applicants. Which name is best?

- **A.** `final final 2.pdf`
- **B.** `Document1.pdf`
- **C.** `Tolu-Adeyemi-Sales-Dashboard.pdf`
- **D.** `IMG_20260611_142233.jpg`

```answer
{
  "id": "portf-m02-a1",
  "prompt": "Type the letter of the best file name.",
  "answer": "C",
  "format": "text",
  "accept": ["c.", "(c)"],
  "explanation": "It says whose it is and what it is, so it's easy to find again in a folder of fifty downloads.",
  "required": true
}
```

```task
{
  "id": "portf-m02-t1",
  "prompt": "Write the **project summary** for one of your three projects, in the format from the example: a title line with the tool in brackets, then `Problem:`, `What I did:`, `Result:` and `See it:`. Under 100 words.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "Project title (Tool)\nProblem: ...\nWhat I did: ...\nResult: ...\nSee it: ...",
  "rules": [
    { "label": "A title line naming the tool in brackets", "pattern": "(?<![\\s\\S])\\s*[^\\n]+\\([^)\\n]+\\)" },
    { "label": "Problem:", "pattern": "^\\s*problem\\s*:\\s*\\S" },
    { "label": "What I did:", "pattern": "^\\s*what i did\\s*:\\s*\\S" },
    { "label": "Result: with a number or concrete outcome", "pattern": "^\\s*result\\s*:[^\\n]*(\\d|half|double|twice|all |every|became|led to)" },
    { "label": "See it:", "pattern": "^\\s*see it\\s*:\\s*\\S" },
    { "label": "Under 100 words", "minWords": 30, "maxWords": 100 }
  ],
  "sample": "Class dues tracker (Excel)\nProblem: Our treasurer tracked dues for 120 students on paper, and reconciling took two hours a week.\nWhat I did: Built a payments table, flagged unpaid students with COUNTIF, and added a monthly summary and chart.\nResult: Reconciliation now takes ten minutes; unpaid dues fell from 40 students to 12 in one semester.\nSee it: Google Drive (sample data, names removed)",
  "required": true
}
```

```task
{
  "id": "portf-m02-t2",
  "prompt": "Put that project somewhere shareable (Google Drive, OneDrive, GitHub, Canva or YouTube), set it to **view only**, and test the link in a **private browser window**. Paste the link and one line saying what you checked.",
  "minutes": 6,
  "rows": 3,
  "placeholder": "https://...\nChecked: ...",
  "rules": [
    { "label": "A share link from Drive, OneDrive, GitHub, Canva or YouTube", "pattern": "https?://(drive\\.google\\.com|docs\\.google\\.com|1drv\\.ms|onedrive\\.live\\.com|[\\w-]+\\.sharepoint\\.com|github\\.com|[\\w-]+\\.github\\.io|(www\\.)?canva\\.com|(www\\.)?youtube\\.com|youtu\\.be)/?\\S*" },
    { "label": "Says you tested it in a private or incognito window", "pattern": "private|incognito|signed out|logged out|another (browser|device|phone)" },
    { "label": "Mentions view-only access", "pattern": "view|read-only|can't edit|cannot edit|no edit" }
  ],
  "sample": "https://drive.google.com/file/d/1AbCdEfGhIjK/view\nChecked: opened it in a private window without signing in; it loads, and it's view-only.",
  "required": true
}
```
