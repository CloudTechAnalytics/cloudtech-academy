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

```bash
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

1. Install GitHub Desktop and publish one real project folder (a class project, notebook or website).
2. Write a README using the structure above.
3. Pin it on your profile.
4. Create your profile README repository and write three lines about yourself.
5. Add your GitHub profile link to your CV or portfolio page.
