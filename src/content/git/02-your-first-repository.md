---
title: "Your First Repository: init, add and commit"
minutes: 30
summary: Turn a folder into a Git repository, then use the core loop every developer repeats all day: edit, check the status, stage, commit and read the history. Practise each command in the terminal built into the page.
---

## The core loop

Almost everything you do in Git is one loop:

1. **Edit** your files as normal.
2. **Check** what changed: `git status`.
3. **Stage** the changes you want to save: `git add`.
4. **Commit** them with a message: `git commit -m "..."`.
5. **Read** the history: `git log`.

This lesson builds that loop into your fingers. You will work in the practice terminal. On the left are the project's files, and on the right is the terminal. When you see a command, type it and press Enter.

Our project is a small recipe notebook. Start by looking around. Type `ls` to list the files, and `cat recipes.md` to read one.

```gitterm
=== file recipes.md
# My Recipe Notebook

## Jollof rice
Rice, tomatoes, peppers, onions, oil, thyme.
=== file shopping.txt
Rice
Tomatoes
Onions
```

## Step 1: git init

A folder becomes a repository when you run `git init` inside it. Try it in the terminal above:

```bash
git init
```

Git replies `Initialized empty Git repository`. It created a hidden folder called `.git` (try `ls -a` to see it) that holds the whole history. **Never edit or delete `.git`.** Delete it, and you delete the history, and the folder is a normal folder again.

You run `git init` once per project. Everything else happens inside that same folder.

## Step 2: git status, your best friend

`git status` tells you what is going on. Use it constantly, before and after every other command.

```bash
git status
```

Right now it says:

```text
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
    recipes.md
    shopping.txt
```

**Untracked** means Git can see the files but is not tracking them yet. Notice in the file list on the left, too: a `?` badge appears beside untracked files. (`A` means staged, `M` means changed, and `U` means a conflict, which you meet in lesson 6.)

## Step 3: git add, staging a change

`git add` moves changes into the staging area: the waiting room for the next commit.

```bash
git add recipes.md       # stage one file
git add .                # stage everything in this folder
```

Stage only `recipes.md` first, then run `git status` again. It now shows `recipes.md` under **Changes to be committed** (staged) and `shopping.txt` still untracked. You can see the `A` badge appear beside `recipes.md`.

## Step 4: git commit, saving a snapshot

```bash
git commit -m "Add jollof rice recipe"
```

The `-m` flag gives the commit **message**, in quotes. Git replies with the short ID of your new commit. Run `git status` once more: it now says `nothing added to commit` and lists `shopping.txt` as still untracked, because you never staged it.

That is the staging area at work. You chose what went into the commit. Now add and commit the shopping list as a **separate** commit, with its own message:

```bash
git add shopping.txt
git commit -m "Add shopping list"
```

## Step 5: git log, reading the history

```bash
git log
git log --oneline
```

`git log` shows each commit with its ID, author and message, newest first. `git log --oneline` squeezes each to one line, which is easier to scan. Try both. You should see your two commits, with `HEAD -> main` marking where you are now.

## Editing a tracked file

Most of the time you change a file that Git already knows. Click `shopping.txt` in the file list and add a line, such as `Garri`, then **Save file**. (You can also use the terminal: `echo "Garri" >> shopping.txt` adds a line.) Now run:

```bash
git status
git diff
```

`git status` now shows `shopping.txt` as **modified**, and `git diff` shows exactly what changed: lines starting with `-` were removed and lines with `+` were added.

Then stage and commit it, with a message that says what you did.

## A shortcut, and a warning

For files Git already tracks, `git commit -am "message"` stages **and** commits all changed tracked files in one step. It does not include new, untracked files. It is handy, but for beginners, staging explicitly with `git add` keeps you in control and teaches the model. Be careful with `git add .`: it stages everything, including files you did not mean to include. Check `git status` first.

## Good commit messages

A commit message says **what changed** and **why it matters**. Future you, and your team, will read these.

| Weak | Strong |
| :-- | :-- |
| update | Add revenue by region chart |
| stuff | Fix date format in orders data |
| final | Write README with project summary |
| fixed it | Fix crash when the cart is empty |

Start with a verb (Add, Fix, Update, Remove) and keep it under about 60 characters. Lesson 3 goes deeper.

## The browser way (for later)

You can also create a repository on the GitHub website: **+, New repository**, name it, tick **Add a README file**, and **Create repository**. You can then add and edit files in the browser and commit from there. It is the same idea with buttons instead of commands, and it is how you start a repository that lives on GitHub. In lesson 7 you will connect your own computer to a GitHub repository.

> [!NOTE]
> Never commit passwords, API keys or other people's personal data, even in a private repository. If you do by mistake, deleting the file is not enough, because it stays in the history. Lesson 3 shows how to keep secrets out, and lesson 9 shows what to do if one gets in.

## Try it

First, create your first repository. The folder has two files and no Git yet.

```gittask
{
  "id": "git-m02-t1",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "The folder is a Git repository (git init)", "ran": "^git init" },
    { "label": "Both files are tracked in a commit", "tracked": "recipes.md" },
    { "label": "shopping.txt is committed too", "tracked": "shopping.txt" },
    { "label": "Your commit has a clear message of at least 8 characters", "log": "\\S.{7,}" },
    { "label": "Nothing is left uncommitted (git status is clean)", "clean": true }
  ],
  "hint": "git init, then git add . (or add each file), then git commit -m \"Add recipes and shopping list\". Check with git status and git log --oneline.",
  "height": 280
}
=== prompt
Turn this folder into a repository and make a commit that includes **both** files, with a clear message. Finish with `git status` showing a clean working tree.
=== file recipes.md
# My Recipe Notebook

## Jollof rice
Rice, tomatoes, peppers, onions, oil, thyme.
=== file shopping.txt
Rice
Tomatoes
Onions
=== sample
git init
git add .
git commit -m "Add recipes and shopping list"
=== note
You can do the same with two commits, one per file. Either way, the rule is that every commit has a message that explains it.
```

Now make a second commit. The repository already has one commit. Add a new item to the shopping list and save the change.

```gittask
{
  "id": "git-m02-t2",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "There are now at least two commits", "commits": 2 },
    { "label": "shopping.txt includes Garri", "file": "shopping.txt", "contains": "garri" },
    { "label": "The change is committed (working tree clean)", "clean": true },
    { "label": "You wrote a commit message that starts with a verb (Add, Update, Fix ...)", "log": "^(Add|Update|Fix|Change|Include)\\b" },
    { "label": "You checked what changed with git diff or git status before committing", "ran": "^git (diff|status)" }
  ],
  "hint": "Edit shopping.txt in the file editor and click Save file (or use echo \"Garri\" >> shopping.txt). Then git status, git diff, git add shopping.txt, and git commit -m \"Add garri to shopping list\".",
  "height": 280
}
=== prompt
Add `Garri` as a new line in `shopping.txt`, look at the change with `git diff`, and commit it with a message that starts with a verb.
=== file recipes.md
# My Recipe Notebook

## Jollof rice
Rice, tomatoes, peppers, onions, oil, thyme.
=== file shopping.txt
Rice
Tomatoes
Onions
=== setup
git init
git add .
git commit -m "Add recipes and shopping list"
=== sample
echo "Garri" >> shopping.txt
git status
git diff
git add shopping.txt
git commit -m "Add garri to shopping list"
```

```answer
{
  "id": "git-m02-a1",
  "prompt": "Which command shows you what has changed, what is staged and what is untracked? Type the full command.",
  "answer": "git status",
  "format": "text",
  "accept": ["git status "],
  "explanation": "git status is the command to run before and after almost everything else.",
  "required": true
}
```

```answer
{
  "id": "git-m02-a2",
  "prompt": "You edited `index.html` and `style.css`, but you only want `index.html` in your next commit. Which command stages just that one file? Type the full command.",
  "answer": "git add index.html",
  "format": "text",
  "accept": ["git add ./index.html"],
  "explanation": "Naming the file stages only that file. git add . would stage both.",
  "required": true
}
```
