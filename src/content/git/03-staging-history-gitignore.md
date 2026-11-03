---
title: "Staging, Diffs, History and .gitignore"
minutes: 30
summary: Go beyond the basics. Compare changes with git diff, commit in clean logical pieces, write messages teams will thank you for, explore history with log and show, and keep secrets and junk out of your repository with .gitignore.
---

## Looking before you commit

Professionals never commit blindly. Before every commit they check **what exactly is about to be saved**. Git gives you two views, and the difference between them is the staging area.

| Command | Compares | Answers |
| :-- | :-- | :-- |
| `git diff` | Working folder against the staging area | "What have I changed that I have **not** staged yet?" |
| `git diff --staged` | Staging area against the last commit | "What **will** go into my next commit?" |

Try it. This project already has a history and an unstaged change. Run `git status` and then `git diff`, then stage the file with `git add menu.txt` and run `git diff` again. It prints nothing now, because everything is staged. Run `git diff --staged` and the change appears there.

```gitterm
=== file menu.txt
Jollof rice - 3000
Fried rice - 2800
Moi moi - 800
=== file about.txt
Mama Ngozi's Kitchen, Ikeja.
=== setup
git init
git add .
git commit -m "Add menu and about page"
echo "Zobo - 500" >> menu.txt
```

Reading a diff takes a minute to learn: a line starting with `+` was **added**, a line starting with `-` was **removed**, and an unchanged line starts with a space. A changed line shows as a removal followed by an addition.

## One commit, one idea

The staging area exists so you can commit in **logical pieces**. Say you spend an hour and end up with three changes: you fixed a typo in the menu, added a contact page, and updated the opening hours. Those are three ideas, so make **three commits**, each with its own message.

```bash
git add menu.txt
git commit -m "Fix typo in the jollof rice price"

git add contact.txt
git commit -m "Add contact page"

git add hours.txt
git commit -m "Update opening hours for December"
```

Why this matters:

- **Easy to understand.** A reviewer reads one small change at a time.
- **Easy to undo.** If the contact page causes a bug, you undo that one commit and keep the others (lesson 4).
- **A useful history.** In six months, `git log` actually tells you what happened.

A commit that says "lots of changes" and touches twenty files is a warning sign.

## Writing messages a team will thank you for

A commit message is a note to your future self and your teammates. A good one is short and says what the commit does.

1. **Start with a verb, in the imperative:** "Add login page", not "Added login page" or "Adding". Read it as "This commit will... add login page."
2. **Keep the first line under about 60 characters.**
3. **Say what changed and, when it is not obvious, why.**
4. **Do not end with a full stop.** It is a title, not a sentence.

| Weak | Strong |
| :-- | :-- |
| fix | Fix crash when the cart is empty |
| changes | Update delivery fee for Lekki orders |
| stuff i did today | Add monthly revenue chart |
| WIP | Draft the README project summary |

Many teams also use **Conventional Commits**, which add a short type at the start so that history is easy to scan and tools can read it: `feat: add dark mode`, `fix: correct VAT rounding`, `docs: update README`, `chore: tidy file names`. You do not have to use it, but you will see it everywhere.

## Exploring history

Your history is a story. These commands let you read it.

```bash
git log --oneline         # one line per commit
git log -3                # only the last three
git show                  # the last commit, with its changes
git show HEAD~1           # the commit before the last one
git show a3f9c21          # any commit, by its ID
```

`HEAD` means "the commit you are on now". `HEAD~1` is its parent, `HEAD~2` its grandparent. You will use these to compare, undo and restore.

Try them on this project.

```gitterm
=== file report.md
# Monthly report
Revenue: 120,000
=== setup
git init
git add .
git commit -m "Add monthly report"
echo "Costs: 80,000" >> report.md
git commit -am "Add costs to the report"
echo "Profit: 40,000" >> report.md
git commit -am "Add profit line"
```

Run `git log --oneline`, then `git show` (the newest commit), then `git show HEAD~2`. Notice how `git show` prints the message and the exact change.

## .gitignore: files Git should leave alone

Not every file belongs in a repository. These should **never** be committed:

- **Secrets:** passwords, API keys, `.env` files. Anyone who can see the repository can see them, forever.
- **Generated files:** `__pycache__/`, `node_modules/`, build outputs. They can be recreated.
- **Junk:** log files, temporary files, `.DS_Store`, your editor's settings.
- **Huge files:** big datasets and videos slow everything down.

You tell Git to ignore them with a file called **`.gitignore`**, one pattern per line:

```text
# Secrets
.env

# Python
__pycache__/
*.pyc

# Logs and temporary files
*.log
*.tmp

# Operating system
.DS_Store
```

| Pattern | Ignores |
| :-- | :-- |
| `.env` | A file with exactly that name |
| `*.log` | Every file ending in `.log` |
| `build/` | A whole folder called `build` |
| `# text` | A comment, ignored |

Once a file is ignored, `git status` stops listing it, and `git add .` skips it. Commit the `.gitignore` file itself, so everyone on the team ignores the same things.

> [!WARNING]
> `.gitignore` only affects files Git is **not already tracking**. If you committed `.env` by mistake, adding it to `.gitignore` is not enough, and lesson 9 shows how to fix that. Set up `.gitignore` **before** your first commit. GitHub can also create a ready-made one for your language when you start a repository.

## Try it

Set up `.gitignore` for a project that has a secret file and a log file in it.

```gittask
{
  "id": "git-m03-t1",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "app.py is committed", "tracked": "app.py" },
    { "label": "README.md is committed", "tracked": "README.md" },
    { "label": "A .gitignore file is committed", "tracked": ".gitignore" },
    { "label": "The secret .env file is NOT committed", "notTracked": ".env" },
    { "label": "The log file debug.log is NOT committed", "notTracked": "debug.log" },
    { "label": "Both ignored files still exist in your folder", "file": ".env" },
    { "label": "git status is clean, so Git is not asking about the ignored files", "clean": true }
  ],
  "hint": "Create .gitignore first (for example echo \".env\" >> .gitignore, then echo \"*.log\" >> .gitignore), then git add . and commit. Check git status before you commit: .env and debug.log should not appear.",
  "height": 300
}
=== prompt
This folder has code, a README, a secret `.env` file and a `debug.log`. Make a repository whose first commit contains the code and the README plus a `.gitignore`, and **does not** contain `.env` or `debug.log`. Both files must stay in your folder, ignored.
=== file app.py
print("Hello, CloudTech!")
=== file README.md
# My App
=== file .env
SECRET_KEY=do-not-share-this
=== file debug.log
2026-10-18 started
=== setup
git init
=== sample
echo ".env" > .gitignore
echo "*.log" >> .gitignore
git status
git add .
git commit -m "Add app, README and gitignore"
=== note
Notice that `git status` was clean afterwards even though `.env` and `debug.log` are still in the folder. That is `.gitignore` doing its job.
```

Now practise one idea per commit. Two files have changed, and they are unrelated. Commit them separately.

```gittask
{
  "id": "git-m03-t2",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "Two new commits on top of the first (at least 3 in total), so each change is its own commit", "commits": 3 },
    { "label": "You staged header.html on its own", "ran": "^git add header\\.html" },
    { "label": "You staged footer.html on its own", "ran": "^git add footer\\.html" },
    { "label": "Both changes are committed (clean)", "clean": true },
    { "label": "Messages start with a verb: Add, Update, Fix ...", "log": "^(Add|Update|Fix|Change|Remove)\\b[^\\n]*\\n(Add|Update|Fix|Change|Remove)\\b" }
  ],
  "hint": "git add header.html, then git commit -m \"Add contact link to the header\". Then git add footer.html and git commit -m \"Update the footer year\". Check each with git status.",
  "height": 300
}
=== prompt
The header got a new contact link and the footer got a new year. Those are two ideas. Make **two separate commits**, one for each file, each with a message that starts with a verb.
=== file header.html
<header>Mama Ngozi's Kitchen</header>
=== file footer.html
<footer>2025</footer>
=== setup
git init
git add .
git commit -m "Add header and footer"
echo "<a href='contact.html'>Contact</a>" >> header.html
echo "<footer>2026</footer>" >> footer.html
=== sample
git status
git add header.html
git commit -m "Add contact link to the header"
git add footer.html
git commit -m "Update the footer year"
```

```answer
{
  "id": "git-m03-a1",
  "prompt": "You want to see exactly which changes are staged and will go into your next commit. Which command shows that? Type the full command.",
  "answer": "git diff --staged",
  "format": "text",
  "accept": ["git diff --cached"],
  "explanation": "git diff shows unstaged changes. Adding --staged (or --cached) compares the staging area with the last commit.",
  "required": true
}
```

```answer
{
  "id": "git-m03-a2",
  "prompt": "Which line in `.gitignore` stops every file ending in `.log` from being tracked?",
  "answer": "*.log",
  "format": "text",
  "explanation": "The * matches any name, so *.log matches debug.log, error.log and so on.",
  "required": true
}
```
