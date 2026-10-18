---
title: "What Git and GitHub Are, and Getting Set Up"
minutes: 30
summary: Understand version control and how Git thinks, tell Git and GitHub apart, meet the terminal, set up Git and a professional GitHub account, and run your first Git commands in a practice terminal built into the page.
---

## The problem Git solves

You have probably had a folder like this:

```text
project.py
project_final.py
project_final_v2.py
project_final_v2_REALLY_final.py
```

Which one is the real one? What changed between them? If something broke, which version worked? Now imagine five people working on the same project, each with their own copy.

**Git** fixes this. It is a **version control** system: it keeps one copy of your project, and records every change you choose to save as a **commit**, with a message describing it. You can see the full history, compare any two versions, go back when something breaks, and let many people work on the same project without overwriting each other.

Git is used by almost every software team, data team and web agency in the world. Not knowing it is like not knowing how to use email at work.

## Git vs GitHub

They are related but different, and beginners often mix them up.

| | Git | GitHub |
| :-- | :-- | :-- |
| What it is | A tool that tracks changes | A website that stores Git projects online |
| Where it runs | On **your computer** | In the cloud (github.com) |
| What it is for | History and versions | Backup, sharing, teamwork and showing your work |
| Needs internet? | No | Yes |

A project tracked by Git is called a **repository**, or **repo**. When you put a copy on GitHub, anyone you allow (or everyone, if it is public) can see it. Other websites do the same job as GitHub, such as GitLab and Bitbucket, and they all use Git underneath.

![Without version control a folder fills with project_final_v2_REALLY_final.py; with Git there is one project and a history of commits. Git is a tool on your computer; GitHub is a website that stores Git projects online, with push and pull between them](/images/courses/git/git-vs-github.svg "Git keeps one project and a history of commits; GitHub keeps a copy online.")

## How Git thinks: three places

To use Git well, you need one picture in your head. Your files live in **three places**, and Git moves changes between them on your command.

```text
  Working folder        Staging area         Repository
  (your files)    -->   (the next commit) -->  (the history)

     edit files        git add <file>        git commit -m "message"
```

1. **Working folder.** The normal files you open and edit.
2. **Staging area** (also called the **index**). A waiting room where you choose **exactly which changes go into the next commit**.
3. **Repository.** The saved history: a chain of commits.

The staging area surprises beginners, and it is worth it. It lets you change five files, but commit them as two clean, separate pieces of work, each with its own message.

### What a commit is

A **commit** is a snapshot of your whole project at one moment. Each one has:

- A unique **ID** (a short code like `a3f9c21`).
- A **message** saying what changed.
- An **author** and a **time**.
- A link to its **parent**, the commit before it. These links make the chain, which is the history.

A **branch** is just a movable label pointing at a commit. The default one is called `main`. You will learn branches in lesson 5.

## Key words

| Word | Meaning |
| :-- | :-- |
| **Repository (repo)** | A project folder tracked by Git |
| **Commit** | A saved snapshot, with a message like "Add login page" |
| **Stage** | Choose changes to go into the next commit |
| **Branch** | A separate line of work |
| **Merge** | Combine one branch into another |
| **Remote** | A copy of the repo somewhere else, usually on GitHub |
| **Push / pull** | Send commits to a remote / bring commits from it |
| **Clone** | Download a copy of a repo |
| **README** | The front page of a repo that explains what it is |

## Meet the terminal

Git's real power is in the **terminal** (also called the command line), a window where you type commands instead of clicking. It looks old-fashioned, and it is faster, works the same everywhere, and is what professionals and every tutorial use. A command is a word, then some options:

```text
git status          the command git, with the sub-command status
ls                  list the files here
cat notes.txt       show what is inside a file
```

On your computer you open it with **Git Bash** (Windows, installed with Git), **Terminal** (Mac), or the terminal in VS Code. You do not need to install anything to learn here. The practice terminal below works the same way, with a small project folder to experiment in.

## Try the practice terminal

In this course, you practise real Git commands in a **practice terminal** built into the page. On the left are the files of a small project, and you can click one to read and edit it. On the right is the terminal. Try these, one at a time, and press Enter after each:

1. `ls` to list the files
2. `cat notes.txt` to read one
3. `git --version` to check Git is there
4. `help` to see which commands the practice terminal knows

```gitterm
=== file notes.txt
Ideas for my study group:
- meet on Saturdays
- share notes in one folder
=== file todo.txt
Buy data bundle
Print the timetable
```

Nothing you do here can break anything. If you get lost, press **Reset**.

## Install Git on your computer

When you are ready to use Git for real:

1. Go to **git-scm.com/downloads** and install Git for your system. On Windows, accept the defaults. This also installs **Git Bash**.
2. Open Git Bash (or Terminal) and type `git --version`. You should see something like `git version 2.45.0`.

## Tell Git who you are

Every commit records who made it, so the very first thing to do on a new computer is set your **name** and **email**. This only needs doing once:

```bash norun
git config --global user.name "Ada Okafor"
git config --global user.email "ada@example.com"
```

Use the **same email as your GitHub account**, so GitHub links your commits to your profile. Without a name and email, Git refuses to make a commit. Try it yourself in the task below.

## Set up your GitHub account

1. Go to **github.com** and sign up with an email you will keep after graduation.
2. Choose a **professional username**, such as `adaeze-okafor` or `tundeanalytics`, not `cooldude2005`. It appears in your links.
3. Add a profile photo and a one-line bio ("Economics student · learning Python and SQL").
4. Turn on **two-factor authentication** in Settings, then Password and authentication.

> [!TIP]
> Students can apply for the free **GitHub Student Developer Pack** at education.github.com with a school email or student ID. It includes free tools and extra features.

## Try it

First, tell Git who you are, in the practice terminal. It starts with no name and no email set.

```gittask
{
  "id": "git-m01-t1",
  "minutes": 5,
  "required": true,
  "identity": false,
  "rules": [
    { "label": "Your name is set (git config --global user.name)", "config": { "user.name": "\\S{2,}" } },
    { "label": "Your email is set, and looks like an email address", "config": { "user.email": "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$" } }
  ],
  "hint": "git config --global user.name \"Your Name\" and then git config --global user.email \"you@example.com\". Put quotes around a name with a space.",
  "height": 240
}
=== prompt
Set your Git **name** and **email** with `git config --global`. Use any name and a realistic email address. You can check them afterwards with `git config user.name`.
=== sample
git config --global user.name "Ada Okafor"
git config --global user.email "ada@example.com"
=== note
On your own computer you do this once, and Git remembers it for every project. The `--global` flag means "for every repository on this computer".
```

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
  "prompt": "In Git's three places (working folder, staging area, repository), which one is the \"waiting room\" where you choose exactly what goes into the next commit? Type its name.",
  "answer": "staging area",
  "format": "text",
  "accept": ["the staging area", "staging", "index", "the index", "staging area (index)"],
  "explanation": "git add moves changes from the working folder into the staging area, and git commit saves what is staged into the repository.",
  "required": true
}
```

```task
{
  "id": "git-m01-t2",
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
