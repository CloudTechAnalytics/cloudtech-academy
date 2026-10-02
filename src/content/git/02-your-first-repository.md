---
title: Your First Repository
minutes: 25
summary: Create a repository on GitHub, add and edit files, and write good commit messages, all in your browser with nothing to install.
---

## Start in the browser

You don't need to install anything to start. GitHub lets you create repositories and commit changes on the website. (Later you can install **GitHub Desktop** or use Git on the command line.)

## Create a repository

1. On GitHub, click **+** (top right) → **New repository**.
2. **Repository name:** short and clear, with hyphens, such as `sales-analysis` or `my-first-website`.
3. **Description:** one sentence on what it is.
4. Choose **Public** (anyone can see it, which is good for a portfolio) or **Private**.
5. Tick **Add a README file**.
6. Click **Create repository**.

## Add and edit files

- **Add a file:** click **Add file → Create new file**, type a name such as `notes.md`, write something, then scroll down.
- **Upload files:** click **Add file → Upload files** and drag in your work, for example a spreadsheet, a notebook or images.
- **Edit a file:** open it and click the pencil icon.

Each time, GitHub asks you to **commit changes**. That's your save point.

## Write good commit messages

A commit message says **what changed**. Future you (and anyone reviewing your work) will read these.

| Weak | Strong |
| :-- | :-- |
| update | Add revenue by region chart |
| stuff | Fix date format in orders data |
| final | Write README with project summary |

Start with a verb (Add, Fix, Update, Remove) and keep it under about 60 characters.

## See the history

Click **Commits** (near the top of the file list, with a clock icon) to see every change, who made it and when. Click any commit to see exactly what changed: removed lines in red, added lines in green.

> [!NOTE]
> Never upload passwords, API keys or other people's personal data to a repository, even a private one. If you do by mistake, deleting the file isn't enough, because it stays in the history. Change the password or key straight away.

## Try it

```task
{
  "id": "git-m02-t1",
  "prompt": "Rewrite these four weak commit messages as strong ones, one per line, in the same order. Each should start with a verb (Add, Fix, Update, Remove, Write…) and say what changed in under 60 characters.\n\n1. `update` (you added a chart of revenue by month)\n2. `stuff` (you fixed dates that were in the wrong format)\n3. `final` (you wrote the project summary in the README)\n4. `changes` (you deleted an old test file you don't need)",
  "minutes": 5,
  "rows": 5,
  "placeholder": "Add ...\nFix ...\nWrite ...\nRemove ...",
  "rules": [
    { "label": "Four messages, one per line", "minLines": 4 },
    { "label": "Every line starts with a verb (Add, Fix, Update, Remove, Write, Delete, Create…)", "pattern": "^\\s*(\\d+[.)]\\s*)?(add|fix|update|remove|write|delete|create|rename|improve|correct|clean|change|move|replace|format|convert)\\b", "perLine": true },
    { "label": "Every message is under 60 characters", "pattern": "^[^\\n]{61,}$", "absent": true },
    { "label": "None of the weak words on their own", "pattern": "^\\s*(\\d+[.)]\\s*)?(update|stuff|final|changes)\\s*$", "absent": true },
    { "label": "Mentions what changed (chart, date, README, file…)", "pattern": "chart|date|readme|file|test|summary", "min": 3 }
  ],
  "sample": "Add revenue by month chart\nFix date format in orders data\nWrite project summary in README\nRemove unused test file",
  "required": true
}
```

```task
{
  "id": "git-m02-t2",
  "prompt": "Create the public `learning-log` repository with a README, add `week-1.md` with three things you learned this week, and commit with a clear message. Then edit the README and commit again. Paste the **repository link** on the first line and your **two commit messages** on the next lines.",
  "minutes": 12,
  "rows": 4,
  "placeholder": "https://github.com/your-username/learning-log\nAdd week 1 learning notes\nUpdate README with ...",
  "rules": [
    { "label": "A link to your learning-log repository", "pattern": "https?://(www\\.)?github\\.com/[A-Za-z0-9-]+/learning-log\\b" },
    { "label": "Two commit messages, one per line, starting with verbs", "pattern": "^\\s*(add|fix|update|remove|write|create|edit|describe|explain)\\b[^\\n]*$", "min": 2 }
  ],
  "sample": "https://github.com/adaeze-okafor/learning-log\nAdd week 1 learning notes\nUpdate README to explain what this log is for",
  "required": true
}
```

You realise you committed a file containing a password to a **public** repository an hour ago. What's the most important thing to do?

- **A.** Delete the file and commit; that removes it.
- **B.** Change the password (or revoke the key) straight away, then remove the file.
- **C.** Make the repository private and leave the file.
- **D.** Nothing; nobody will have seen it.

```answer
{
  "id": "git-m02-a1",
  "prompt": "Type the letter.",
  "answer": "B",
  "format": "text",
  "accept": ["b.", "(b)"],
  "explanation": "The password stays in the repository's history even after you delete the file, and public repos are scanned by bots within minutes. Treat it as leaked: change it first, then clean up.",
  "required": true
}
```
