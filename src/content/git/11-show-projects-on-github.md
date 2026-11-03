---
title: "Show Your Projects on GitHub: README, Profile and Portfolio"
minutes: 35
summary: Turn your GitHub account into a portfolio employers can check. Write a README that sells a project, set up your profile README and pinned repositories, keep your repositories tidy, and link them from your CV and LinkedIn.
---

## Your GitHub is a portfolio

Recruiters and hiring managers for data, software and web roles open your GitHub profile. In a few seconds they decide: **does this person build real things, and can they explain them?** You cannot control the first look, but you can design it.

A strong profile has: a clear bio, a handful of **pinned** projects that are worth showing, a README on each that explains the work, and a history of steady commits. This lesson shows you how.

## Work from your computer: three ways

Browser uploads are fine for tiny things. For real projects you will use one of these, and they all do the same thing underneath:

| Way | Good for | How you commit |
| :-- | :-- | :-- |
| **Command line** (Git Bash or Terminal) | What you have practised in this course | `git add`, `git commit`, `git push` |
| **VS Code** (built-in Git panel) | Editing and committing in one place | Source Control icon, type a message, click the tick, then Sync |
| **GitHub Desktop** (desktop.github.com) | A friendly, visual start | Type a summary, click **Commit to main**, then **Push origin** |

Whichever you choose, the habits are the same: small commits, clear messages, and a push when you finish. Use **Fetch** and **Pull** to bring in changes made elsewhere.

## Write a README that sells the project

The README is the first thing people read. It should let a visitor understand the project in thirty seconds. This structure works for most student and junior projects:

```markdown
# Sales Analysis: Kolanut Drinks

Analysis of 4,000 orders to find which regions and products drive revenue.

## What I did
- Cleaned the data in Python (pandas)
- Calculated revenue by region, category and month
- Built charts to show the trends

## Key findings
- Lagos brings in about half of all revenue
- Household products are the top category

## Tools
Python, pandas, Google Colab

## See it
Open `analysis.ipynb` or view the charts in `/images`.
```

Tips that separate a good README from a forgettable one:

- **Lead with the point.** One sentence on what it is and why it matters.
- **Show results with numbers** ("revenue fell 47%"), not only activity ("I did analysis").
- **Add a picture.** A screenshot or chart makes a README far more engaging. Save it in an `images` folder in the repository, and show it with Markdown's image line, which starts with an exclamation mark, then the description in square brackets, then the file path in round brackets.
- **Say how to run or view it**, so a visitor can try it.
- **Be honest** about what you built yourself and what you followed from a tutorial.

## Make your profile a portfolio

- **Pin your best repositories.** On your profile, click **Customize your pins** and choose up to six. Put the strongest first.
- **Profile README.** Create a **public repository named exactly your username**, with a `README.md`. Its content appears at the top of your profile. Say who you are, what you are learning, your best projects and how to reach you.
- **Describe every repository.** Add a one-line description and **topics** (tags such as `python`, `data-analysis`) in the repository's About box.
- **Keep it tidy.** Make unfinished experiments private, or archive them. Give every public repository a README.
- **Add a licence** to projects you want others to reuse (MIT is a common choice).

A profile README can be as simple as:

```markdown
# Hi, I'm Ada 👋
Economics student at UNN, learning Python, SQL and data analysis.

## Projects
- [Sales analysis](https://github.com/ada/sales-analysis): which regions drive revenue
- [Recipe site](https://github.com/ada/recipe-site): a small website, built with HTML and CSS

## Reach me
LinkedIn: linkedin.com/in/ada-okafor
```

## Commit history and the green squares

Your profile shows a grid of green squares for your commits. Do not obsess over it, and **never fake it**: recruiters read the commits, and a wall of empty "update" commits looks worse than a quiet graph. Steady, real work, with clear messages, speaks for itself.

## Share it

- Put your **profile link** on your CV and LinkedIn. Link to the **specific repository** next to each project you describe.
- In a job application, point to the one or two projects most relevant to the role.
- Make sure the pinned projects work: click your own links from a private window to see what a visitor sees.

## Try it

Write the README for a real project of yours.

```task
{
  "id": "git-m11-t1",
  "prompt": "Write the **README** for a real project of yours (a class project, notebook, website or spreadsheet), in Markdown, using the structure from the lesson: a `#` title, a one-line description, then `##` sections for **What I did**, **Key findings** (or **Results**), **Tools** and **See it**.",
  "minutes": 12,
  "rows": 14,
  "placeholder": "# Project title\nOne line on what it is.\n\n## What I did\n- ...\n\n## Key findings\n- ...\n\n## Tools\n...\n\n## See it\n...",
  "rules": [
    { "label": "A # title on the first line", "pattern": "(?<![\\s\\S])\\s*#\\s+\\S" },
    { "label": "A ## What I did section", "pattern": "^##\\s+what i did" },
    { "label": "A ## Key findings or ## Results section", "pattern": "^##\\s+(key findings|findings|results?)" },
    { "label": "A ## Tools section", "pattern": "^##\\s+tools" },
    { "label": "A ## See it section", "pattern": "^##\\s+(see it|how to (run|view|see)|demo|links?)" },
    { "label": "At least three bullet points", "pattern": "^\\s*[-*]\\s+\\S", "min": 3 },
    { "label": "A finding or result with a number", "pattern": "^\\s*[-*][^\\n]*\\d" }
  ],
  "sample": "# Sales Analysis: Kolanut Drinks\nAnalysis of 4,266 orders to find which regions and products drive revenue.\n\n## What I did\n- Cleaned the data in Python (pandas)\n- Calculated revenue by region, category and month\n- Built charts to show the trends\n\n## Key findings\n- Lagos brings in about half of all revenue\n- North West revenue fell 47% from H1 2025 to H1 2026\n\n## Tools\nPython, pandas, matplotlib, Google Colab\n\n## See it\nOpen `analysis.ipynb`, or view the charts in `/images`.",
  "required": true
}
```

Now publish it, and make your profile work as a portfolio.

```task
{
  "id": "git-m11-t2",
  "prompt": "Publish the project to GitHub (with the command line, VS Code or GitHub Desktop), add your README, **pin** the repository on your profile and create your **profile README**. Paste the **project repository link** on the first line and your **profile link** on the second.",
  "minutes": 15,
  "rows": 3,
  "placeholder": "https://github.com/your-username/your-project\nhttps://github.com/your-username",
  "rules": [
    { "label": "A link to a project repository", "pattern": "https?://(www\\.)?github\\.com/[A-Za-z0-9-]+/[A-Za-z0-9._-]+" },
    { "label": "Your profile link on its own line", "pattern": "^\\s*https?://(www\\.)?github\\.com/[A-Za-z0-9-]+/?\\s*$" }
  ],
  "sample": "https://github.com/adaeze-okafor/kolanut-sales-analysis\nhttps://github.com/adaeze-okafor",
  "required": true
}
```

```answer
{
  "id": "git-m11-a1",
  "prompt": "Your GitHub username is `tolu-adeyemi`. What must you name the repository whose README appears at the top of your profile?",
  "answer": "tolu-adeyemi",
  "format": "text",
  "accept": ["tolu-adeyemi/tolu-adeyemi"],
  "explanation": "A public repository with exactly your username as its name becomes your profile README.",
  "required": true
}
```

Finally, add your GitHub profile link to your CV and your LinkedIn profile.
