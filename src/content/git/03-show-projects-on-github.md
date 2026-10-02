---
title: Show Your Projects on GitHub
minutes: 25
summary: Push a project from your computer with GitHub Desktop, write a README that sells it, and set up a profile that works as a portfolio.
---

## Work from your computer with GitHub Desktop

Browser uploads are fine for small things. For real projects, **GitHub Desktop** (free, Windows and Mac) keeps a folder on your computer in sync with GitHub.

1. Download it from **desktop.github.com** and sign in with your GitHub account.
2. **File → Add local repository** and choose your project folder. If it isn't a repository yet, click **create a repository** when prompted.
3. Make changes to your files as usual. GitHub Desktop lists what changed.
4. Type a **summary** (your commit message) at the bottom left and click **Commit to main**.
5. Click **Publish repository** the first time, then **Push origin** after each new commit.

To get changes made on GitHub (or by a teammate), click **Fetch origin**, then **Pull origin**.

## The command-line version

You'll see these commands in tutorials. They do the same thing:

```bash norun
git clone https://github.com/your-username/learning-log.git   # copy a repo to your computer
git status                                                     # see what changed
git add .                                                      # stage all changes
git commit -m "Add sales chart"                                # save a snapshot
git push                                                       # send it to GitHub
git pull                                                       # get the latest changes
```

## Write a README that sells the project

The README is the first thing people see. Use this structure:

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

## Make your profile a portfolio

- **Pin your best repos:** on your profile, click **Customize your pins** and choose up to six.
- **Profile README:** create a public repository with **exactly your username** as its name and a README. Its content shows at the top of your profile. Say who you are, what you're learning and how to reach you.
- **Keep it tidy:** make unfinished experiments private, and give every public repo a description.

## Collaborating in one paragraph

For group projects, the owner adds teammates under **Settings → Collaborators**. Everyone clones the repo, **pulls before they start work**, and pushes when they finish. Working in different files at the same time avoids most conflicts.

## Try it

```answer
{
  "id": "git-m03-a1",
  "prompt": "Your GitHub username is `tolu-adeyemi`. What must you name the repository whose README appears at the top of your profile?",
  "answer": "tolu-adeyemi",
  "format": "text",
  "accept": ["tolu-adeyemi/tolu-adeyemi"],
  "explanation": "A public repository with exactly your username as its name becomes your profile README.",
  "required": true
}
```

```task
{
  "id": "git-m03-t1",
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

```task
{
  "id": "git-m03-t2",
  "prompt": "Publish the project with GitHub Desktop (or the browser), add your README, pin the repository on your profile and create your profile README. Paste the **project repository link** on the first line and your **profile link** on the second.",
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

Finally, add your GitHub profile link to your CV and your portfolio page.
