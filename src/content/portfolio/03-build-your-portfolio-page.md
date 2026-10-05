---
title: Build Your Portfolio Page
minutes: 25
handsOn: 15
summary: Put your projects on one simple page with a link you can add to your CV and LinkedIn, using a free tool you already have.
---

## One link for everything

Your goal is **one link** that you can put on your CV, LinkedIn, email signature and applications. When someone opens it, they should see who you are, what you can do, and your best work, in under a minute.

## Choose a free tool

| Tool | Best for | Link looks like |
| :-- | :-- | :-- |
| **Google Sites** | Anyone. Drag and drop, free, works with Drive files | sites.google.com/view/your-name |
| **Canva websites** | Design-focused students | your-name.my.canva.site |
| **GitHub Pages** | Code and data students (see the Web Development course) | your-username.github.io |
| **Your CloudTech Academy profile** | Showing your badges and credentials | academy.cloudtechanalytics.com/learners/your-name |

If you're not sure, use **Google Sites**. It's free, quick and looks clean.

## What goes on the page

Keep it to **one page** with these sections, in this order:

1. **Header:** your name, one line on what you do ("Accounting student at UNILAG · Excel and Power BI"), and a professional photo.
2. **About:** two or three sentences on your interests and what you're looking for.
3. **Projects:** your three best, each with a picture, the short summary and a link.
4. **Skills and credentials:** tools you use, plus certificates and badges with their verification links.
5. **Contact:** your email and LinkedIn. You don't need your phone number or home address.

![A one-page portfolio with five sections in order: header, about, three projects with pictures, skills and credentials, and contact](/images/courses/portfolio/page-layout.svg "One page, five sections, in this order.")

## Build it with Google Sites

1. Go to **sites.google.com** and click **Blank site** (or pick a template).
2. Type your name in the header and choose a simple theme under **Themes**.
3. Use **Insert → Text box** for your About section.
4. For each project, use **Insert → Image** and a text box for the summary, and add the link with the link button.
5. To show a Drive file directly on the page, use **Insert → Drive** and pick the file.
6. Click **Publish**, choose a web address, and publish.

## Check it before you share it

- Open the published link in a **private window** on your phone. Does everything load?
- Click every link.
- Read it aloud once for typos.
- Ask a friend: "In 30 seconds, what do I do?" If they can't say, simplify the header.

## Try it

```task
{
  "id": "portf-m03-t1",
  "prompt": "Write your page's **header line** (what you do, in one line, like \"Accounting student at UNILAG · Excel and Power BI\") and your **About** section (two or three sentences on your interests and what you're looking for). Header first, then a blank line, then About.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Economics graduate · Excel, SQL and Power BI\n\nI ...",
  "rules": [
    { "label": "A short header line first (under 15 words)", "pattern": "(?<![\\s\\S])\\s*(\\S+[ \\t]+){0,14}\\S+[ \\t]*\\n" },
    { "label": "An About section in the first person", "pattern": "\\b(I|I'm|my)\\b", "min": 2 },
    { "label": "Says what you're looking for (role, internship, clients, opportunities…)", "pattern": "looking for|seeking|open to|interested in|want to|hoping to|available for" },
    { "label": "Short: 25 to 90 words in total", "minWords": 25, "maxWords": 90 }
  ],
  "sample": "Economics graduate · Excel, SQL and Power BI\n\nI turn messy sales data into reports people use. During NYSC I built a weekly dashboard that cut a 3-hour report to 20 minutes. I'm looking for a junior data analyst role in Lagos.",
  "required": true
}
```

```task
{
  "id": "portf-m03-t2",
  "prompt": "Build and publish your page with the five sections (header, about, at least one project, skills and credentials, contact). Test it on your phone in a private window. Paste the **published link**, then one line on what a friend said you do after 30 seconds on the page.",
  "minutes": 4,
  "rows": 3,
  "placeholder": "https://sites.google.com/view/...\nMy friend said: ...",
  "rules": [
    { "label": "A published page link (Google Sites, Canva, GitHub Pages, your CloudTech profile or your own domain)", "pattern": "https?://\\S+\\.\\S+" },
    { "label": "Not a private editing link", "pattern": "/edit\\b|/u/\\d/", "absent": true },
    { "label": "What your friend said you do", "pattern": "said|thought|told me|answered|replied" }
  ],
  "sample": "https://sites.google.com/view/tolu-adeyemi\nMy friend said: \"You analyse sales data in Excel and Power BI and you're looking for an analyst job.\"",
  "note": "If your friend can say what you do in one sentence, the header is working. If they can't, shorten it.",
  "required": true
}
```

Then add the link to your CV and to your LinkedIn **Contact info** or **Featured** section.
