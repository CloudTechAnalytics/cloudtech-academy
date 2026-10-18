---
title: "Working With a Team: Issues, Project Files and Keeping Secrets Safe"
minutes: 25
summary: Use the rest of GitHub like a professional. Track work with issues, give a repository the files that make it look and feel professional, manage who can do what, and keep passwords and keys out of your history, including what to do when one gets in.
---

## Repositories are also workplaces

GitHub is more than storage. Teams use it to plan work, discuss it, review it and release it. This lesson covers the tools around the code that make a repository **professional**.

## Issues: tracking work and bugs

An **issue** is a page for one task, bug, question or idea. Every project, from a student's notebook to a company's product, uses them.

A good issue has:

- A **clear title**: "Contact form accepts an empty email", not "Bug".
- **What happened** and **what you expected**.
- **Steps to reproduce**, so someone else can see the problem themselves.
- **Context**: browser, device, screenshots, error messages.

You can organise issues with **labels** (`bug`, `enhancement`, `good first issue`, `documentation`), **assignees** (who is working on it) and **milestones** (a group of issues for one release). Each issue has a number, such as `#12`. In a commit message or pull request, `Fixes #12` links the work to the issue and closes it when merged, as you saw in the last lesson.

**GitHub Projects** adds a board of cards in columns (To do, In progress, Done), a simple way to see who is doing what.

## The files that make a repository professional

Open any well-run project, and you find the same few files near the top. Adding them takes minutes and makes the repository look cared for.

| File | What it is for |
| :-- | :-- |
| **`README.md`** | The front page. What the project is, how to use it, how to run it |
| **`LICENSE`** | Says what others may do with your code. Without one, nobody is legally allowed to reuse it. **MIT** is a popular, permissive choice |
| **`.gitignore`** | Files to leave out (lesson 3) |
| **`CONTRIBUTING.md`** | How to help: how to report bugs, how to submit a pull request |
| **`CODE_OF_CONDUCT.md`** | How people are expected to behave |
| **`.github/`** folder | Templates for issues and pull requests, and automations (lesson 10) |

GitHub helps: when you create a repository, you can tick **Add a README**, choose a **.gitignore** template for your language, and pick a **licence**.

### A README a newcomer can use

A great README answers, in order: *What is this? Why should I care? How do I run it? How can I help?*

```markdown
# Kitchen Orders

A small web page where customers choose a meal and send an order on WhatsApp.

## Features
- Menu with prices in naira
- One-tap order message

## Run it
1. Download the project
2. Open `index.html` in your browser

## Contributing
Found a bug? Open an issue. Pull requests are welcome.

## Licence
MIT
```

## Who can do what

For a repository on your account, you decide who may change it. Under **Settings, then Collaborators**, you can invite teammates. For organisations, there are roles: **Read** (view and comment), **Triage**, **Write** (push branches), **Maintain** and **Admin**. Give people the **least access** they need.

You can also protect `main` with **branch protection rules**: require a pull request, require approvals, require checks to pass, and block force pushes. This makes it impossible to push untested work straight to `main`, even by accident.

## Keeping secrets out of Git

This is the most important security lesson in this course. **A secret committed to Git is a secret you should consider leaked**, even in a private repository, even if you delete the file later.

Secrets include passwords, API keys, tokens, database connection strings, private keys and `.env` files. Why it is so dangerous:

- Git **remembers everything.** Deleting the file in a new commit leaves it in the history, which anyone with access (or anyone, if public) can read.
- **Bots scan GitHub constantly** for keys. A leaked cloud key can be found and abused within minutes, and the bill lands on you.

### Prevention

1. **Never** write a secret directly into code. Keep them in a `.env` file (or environment variables) and **ignore** it in `.gitignore` from the very first commit.
2. Share an **example** file, `.env.example`, with fake values, so teammates know what to fill in.
3. Check `git status` and `git diff --staged` before every commit. Make it a habit.

### If a secret was committed: the steps, in order

1. **Revoke or rotate the secret immediately.** Go to the service (GitHub, your cloud provider, your payment provider) and delete that key or password and create a new one. This is the step that actually protects you. **Do it first.**
2. **Stop tracking the file**, so it stops appearing in future commits:

```bash
git rm --cached .env          # remove it from Git, but keep the file on your computer
echo ".env" >> .gitignore     # make sure it is ignored from now on
git add .gitignore
git commit -m "Stop tracking .env"
```

3. **Understand that the old key is still in the history.** If the repository is public, or others have cloned it, assume the key is known, and rely on step 1. Specialist tools such as `git filter-repo` can rewrite history to remove a file, but that is advanced, and it never replaces rotating the key.

Try step 2 in the task below.

## Keeping your account safe

- Turn on **two-factor authentication** (you did this in lesson 1).
- Use **tokens or SSH keys**, never your password, and give tokens the smallest permissions and a short expiry.
- GitHub has **secret scanning** and **Dependabot alerts** (warnings about outdated, vulnerable libraries). Turn them on for your repositories, in **Settings, then Code security**.

## Try it

First, fix a classic mistake: a secret file was committed. Stop tracking it safely.

```gittask
{
  "id": "git-m09-t1",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "You removed .env from Git with git rm --cached (so the file stays on your computer)", "ran": "^git rm --cached \\.env" },
    { "label": ".env is no longer tracked in the latest commit", "notTracked": ".env" },
    { "label": ".env still exists in your folder", "file": ".env" },
    { "label": "A .gitignore that lists .env is committed", "tracked": ".gitignore" },
    { "label": ".gitignore contains .env", "file": ".gitignore", "contains": "^\\.env" },
    { "label": "Everything is committed (clean)", "clean": true },
    { "label": "There are at least two commits", "commits": 2 }
  ],
  "hint": "git rm --cached .env, then echo \".env\" > .gitignore, git add .gitignore, and git commit -m \"Stop tracking .env\". Do not use plain git rm, which would delete the file from your folder.",
  "height": 300
}
=== prompt
Someone committed `.env` by mistake (it holds a secret key). In real life you would **first rotate the key**. Then make Git stop tracking `.env` **without deleting the file**, add it to `.gitignore`, and commit the fix.
=== file app.py
print("Running")
=== file .env
API_KEY=super-secret-key
=== setup
git init
git add .
git commit -m "Add app and settings"
=== sample
git rm --cached .env
echo ".env" > .gitignore
git add .gitignore
git commit -m "Stop tracking .env"
git status
=== note
This stops the leak from growing, but the old key is still in the earlier commit. That is why rotating the key comes first.
```

Now write a bug report as a good issue. The goal is that a developer could reproduce the problem without asking you a single question.

```task
{
  "id": "git-m09-t2",
  "prompt": "Write a **GitHub issue** for a bug in an app you know (or invent one: for example, a cart that shows the wrong total). Put the title on the first line, then the sections **## What happened**, **## What I expected**, **## Steps to reproduce** (at least three numbered steps) and **## Environment** (device, browser or version).",
  "minutes": 10,
  "rows": 14,
  "placeholder": "Cart total shows zero when a discount code is applied\n\n## What happened\n...\n\n## What I expected\n...\n\n## Steps to reproduce\n1. ...\n2. ...\n3. ...\n\n## Environment\n...",
  "rules": [
    { "label": "A specific title on the first line (at least 5 words)", "pattern": "(?<![\\s\\S])\\s*[^#\\n]+( [^\\n ]+){3,}" },
    { "label": "A ## What happened section", "pattern": "^##\\s+what happened" },
    { "label": "A ## What I expected section", "pattern": "^##\\s+what i expected" },
    { "label": "A ## Steps to reproduce section with at least three numbered steps", "pattern": "^\\s*\\d+\\.\\s+\\S", "min": 3 },
    { "label": "The steps heading is present", "pattern": "^##\\s+steps to reproduce" },
    { "label": "An ## Environment section", "pattern": "^##\\s+environment" }
  ],
  "sample": "Cart total shows zero when a discount code is applied\n\n## What happened\nAfter I enter the code WELCOME10, the cart total changes to ₦0 instead of showing 10% off.\n\n## What I expected\nThe total should drop by 10%: ₦18,000 should become ₦16,200.\n\n## Steps to reproduce\n1. Add the Ankara tote bag (₦18,000) to the cart.\n2. Open the cart.\n3. Type WELCOME10 in the discount box and press Apply.\n\n## Environment\nAndroid 14, Chrome 126, mobile data.",
  "required": true
}
```

```answer
{
  "id": "git-m09-a1",
  "prompt": "You pushed an API key to a public repository by mistake. What is the **very first** thing you should do: **rotate the key** or **delete the file**? Type one.",
  "answer": "rotate the key",
  "format": "text",
  "accept": ["rotate", "revoke the key", "rotate it", "revoke", "rotate and revoke the key", "rotate/revoke the key"],
  "explanation": "The key is already in the history and may already have been copied. Only revoking it and creating a new one actually protects you. Deleting the file does not remove it from history.",
  "required": true
}
```
