---
title: What Git and GitHub Are
minutes: 15
summary: Understand version control, the difference between Git and GitHub, and set up a free GitHub account the right way.
---

## The problem Git solves

You've probably had a folder like this:

```text
project.py
project_final.py
project_final_v2.py
project_final_v2_REALLY_final.py
```

**Git** fixes this. It's a **version control** tool: it keeps one copy of your files and records every change you save as a **commit**, with a message describing it. You can see the full history, compare versions and go back if something breaks.

## Git vs GitHub

They're related but different:

| | Git | GitHub |
| :-- | :-- | :-- |
| What it is | A tool that tracks changes | A website that stores Git projects online |
| Where it runs | On your computer | In the cloud (github.com) |
| What it's for | History and versions | Backup, sharing, collaboration and showing your work |

A project tracked by Git is called a **repository** (or **repo**). When you put it on GitHub, anyone you allow (or everyone, if it's public) can see it.

## Why students should care

- **Employers look at GitHub.** For data, software and web roles, a GitHub profile with real projects is a portfolio.
- **Backup.** Your work is safe even if your laptop isn't.
- **Teamwork.** Group projects without emailing files back and forth.

## Key words

- **Repository (repo):** a project folder tracked by Git.
- **Commit:** a saved snapshot, with a message like "Add login page".
- **Push:** send your commits to GitHub.
- **Pull:** bring the latest changes from GitHub to your computer.
- **README:** the front page of a repo that explains what it is.

## Set up your account

1. Go to **github.com** and sign up with an email you'll keep after graduation.
2. Choose a **professional username**, such as `adaeze-okafor` or `tundeanalytics`, not `cooldude2005`. It appears in your links.
3. Add a profile photo and a one-line bio ("Economics student · learning Python and SQL").
4. Turn on **two-factor authentication** in Settings → Password and authentication.

> [!TIP]
> Students can apply for the free **GitHub Student Developer Pack** at education.github.com with a school email or student ID. It includes free tools and extra features.

## Try it

```answer
{
  "id": "git-m01-a1",
  "prompt": "Which one is a tool that runs on your computer and records the history of your files: **Git** or **GitHub**?",
  "answer": "Git",
  "format": "text",
  "explanation": "Git tracks changes on your computer. GitHub is the website that stores Git repositories online so you can back them up, share them and work with others.",
  "required": true
}
```

```answer
{
  "id": "git-m01-a2",
  "prompt": "You saved a change with the message \"Add revenue chart\". What is that saved snapshot called in Git? (One word.)",
  "answer": "commit",
  "format": "text",
  "accept": ["a commit"],
  "required": true
}
```

```task
{
  "id": "git-m01-t1",
  "prompt": "Create your GitHub account with a professional username, add a photo and a one-line bio, and turn on two-factor authentication. Paste your **profile link** on the first line and your **bio** on the second.",
  "minutes": 10,
  "rows": 3,
  "placeholder": "https://github.com/your-username\nEconomics student · learning Python and SQL",
  "rules": [
    { "label": "Your GitHub profile link", "pattern": "https?://(www\\.)?github\\.com/[A-Za-z0-9-]+/?\\s*$" },
    { "label": "A professional username (no nicknames or birth years)", "pattern": "github\\.com/[^\\s/]*(cool|boy|girl|baby|babe|king|queen|dude|sexy|(19|20)\\d\\d)", "absent": true },
    { "label": "A bio line saying what you study or do", "pattern": "\\n\\s*\\S+(\\s+\\S+){2,}" }
  ],
  "sample": "https://github.com/adaeze-okafor\nEconomics student at UNN · learning Python and SQL for data analysis",
  "required": true
}
```
