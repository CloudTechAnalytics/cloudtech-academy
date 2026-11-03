---
title: "Branches: Work Without Fear"
minutes: 30
summary: Learn the idea that makes Git powerful, the branch. Create a separate line of work, switch between branches, merge finished work back, and tidy up, with a workflow every team uses.
---

## The problem branches solve

You are building a website that people use. You want to add a new contact page. It will take three days, and half-finished code will break things in the meantime. Meanwhile, a visitor reports a typo that needs fixing today.

If everything is on one line of work, you are stuck. You cannot publish the typo fix without publishing your half-built contact page.

A **branch** solves this. It is a **separate line of work** that starts from where you are now. You do the risky, unfinished work on your own branch, while the main branch stays stable and ready to publish. When your branch is finished and tested, you **merge** it back in.

## What a branch really is

Here is the secret, and it makes everything easier: **a branch is just a label that points to a commit.** Making a branch is instant and costs nothing, because Git does not copy your files. It only creates a new label.

```text
main:      A --- B --- C
                        \
feature:                 D --- E
```

`main` still points at `C`. The `feature` branch started at `C` and has two more commits, `D` and `E`. Work on `feature` does not touch `main`.

The default branch is called **`main`**. (Older projects call it `master`.) A special pointer called **`HEAD`** says which branch you are on right now, and new commits are added to that branch.

## The commands

| Command | What it does |
| :-- | :-- |
| `git branch` | List branches. The current one has a `*` |
| `git branch name` | Create a branch, but stay where you are |
| `git switch name` | Move to another branch |
| `git switch -c name` | Create a branch **and** switch to it (the one you will use most) |
| `git merge name` | Bring that branch's work into the one you are on |
| `git branch -d name` | Delete a finished branch |

(You will also see `git checkout`, the older command that does the same jobs. `switch` is clearer.)

## Try it: your first branch

The project below is a small website with one commit. Follow along in the terminal:

1. `git branch` shows only `main`.
2. `git switch -c feature/contact-page` creates the branch and moves you onto it.
3. Click **New file** (type `contact.html`, press **Add**), write something in it, and save.
4. `git add contact.html` and `git commit -m "Add contact page"`.
5. `git log --oneline`: your new commit is on top, and `HEAD -> feature/contact-page` shows where you are.
6. `git switch main`. Look at the file list: **`contact.html` has disappeared!** It is safe on your feature branch, but it is not part of main.
7. `git switch feature/contact-page` and the file comes back.

That moment is the whole idea: switching branches changes the files in your folder to match.

```gitterm
=== file index.html
<h1>Mama Ngozi's Kitchen</h1>
=== setup
git init
git add .
git commit -m "Add homepage"
```

## Merging: bringing work back

When the contact page is done, you merge it into `main`. You switch to the branch that **receives** the work, and merge the other one in:

```bash
git switch main
git merge feature/contact-page
```

Git can merge in two ways:

- **Fast-forward.** If `main` has not moved since you branched, Git simply moves the `main` label forward to your latest commit. No new commit is needed. You will see `Fast-forward`.
- **Merge commit.** If both branches have new commits, Git combines the two and makes a special **merge commit** with two parents. Git handles it automatically when the changes are in different places. When the same lines changed on both sides, you get a **conflict**, the subject of the next lesson.

After merging, delete the finished branch. The commits are safe in `main`:

```bash
git branch -d feature/contact-page
```

## Naming branches

Good branch names say what the work is. Teams often use a prefix:

| Name | For |
| :-- | :-- |
| `feature/contact-page` | A new feature |
| `fix/login-typo` | A bug fix |
| `docs/update-readme` | Documentation |
| `experiment/dark-theme` | Something you might throw away |

Use lowercase and hyphens, and no spaces.

## A branching workflow that works

1. Start from an up-to-date `main`.
2. `git switch -c feature/something`.
3. Make small commits, with good messages.
4. When done and tested, merge into `main` (on a team, through a pull request, which is lesson 8).
5. Delete the branch.
6. Repeat.

This keeps `main` always working, which is a rule professional teams care about. **`main` should always be in a state you could publish.**

## Switching with unfinished work

Git will not let you switch branches if your uncommitted changes would be overwritten:

```text
error: Your local changes to the following files would be overwritten by checkout
```

You have three choices: **commit** your work, **stash** it (lesson 4), or **discard** it with `git restore`. Never ignore the message.

## Try it

Do the full branch cycle: create a branch, commit on it, merge it back and delete it.

```gittask
{
  "id": "git-m05-t1",
  "minutes": 10,
  "required": true,
  "rules": [
    { "label": "You created the branch with git switch -c (or checkout -b)", "ran": "^git (switch -c|checkout -b) feature/contact-page" },
    { "label": "contact.html is part of main now (merged)", "file": "contact.html" },
    { "label": "You are back on main", "current": "main" },
    { "label": "contact.html is tracked in the last commit on main", "tracked": "contact.html" },
    { "label": "The finished branch is deleted", "noBranch": "feature/contact-page" },
    { "label": "The history has at least two commits", "commits": 2 },
    { "label": "Everything is committed (clean)", "clean": true }
  ],
  "hint": "git switch -c feature/contact-page, add contact.html (New file, or echo \"<h1>Contact us</h1>\" > contact.html), git add contact.html, git commit -m \"Add contact page\", git switch main, git merge feature/contact-page, git branch -d feature/contact-page.",
  "height": 300
}
=== prompt
Create a branch called `feature/contact-page`. On it, add a file `contact.html` and commit it. Then switch back to `main`, **merge** the branch in, and delete the branch.
=== file index.html
<h1>Mama Ngozi's Kitchen</h1>
=== setup
git init
git add .
git commit -m "Add homepage"
=== sample
git switch -c feature/contact-page
echo "<h1>Contact us</h1>" > contact.html
git add contact.html
git commit -m "Add contact page"
git switch main
git merge feature/contact-page
git branch -d feature/contact-page
=== note
Because `main` did not change while you worked, this was a fast-forward merge. When both branches move, Git makes a merge commit instead.
```

Now keep two pieces of work apart. Create two feature branches, each with its own commit, and finish on `main` **without** merging either.

```gittask
{
  "id": "git-m05-t2",
  "minutes": 10,
  "required": true,
  "rules": [
    { "label": "A branch called dark-mode exists", "branch": "dark-mode" },
    { "label": "A branch called search exists", "branch": "search" },
    { "label": "You finished on main", "current": "main" },
    { "label": "dark.css is NOT in main's folder (it lives only on dark-mode)", "file": "dark.css", "absent": true },
    { "label": "search.js is NOT in main's folder (it lives only on search)", "file": "search.js", "absent": true },
    { "label": "You made each branch with git switch -c or git checkout -b", "ran": "^git (switch -c|checkout -b)", "times": 2 },
    { "label": "Everything is committed (clean)", "clean": true }
  ],
  "hint": "From main: git switch -c dark-mode, create dark.css, add and commit. Then git switch main, git switch -c search, create search.js, add and commit, and git switch main again.",
  "height": 300
}
=== prompt
Two teammates will work in parallel. On a branch `dark-mode`, add and commit a file `dark.css`. Starting again from `main`, on a branch `search`, add and commit `search.js`. When you finish, switch back to `main`. Neither file should be in `main`'s folder.
=== file index.html
<h1>My app</h1>
=== setup
git init
git add .
git commit -m "Add index page"
=== sample
git switch -c dark-mode
echo "body { background: #111; }" > dark.css
git add dark.css
git commit -m "Add dark mode styles"
git switch main
git switch -c search
echo "console.log('search');" > search.js
git add search.js
git commit -m "Add search script"
git switch main
```

```answer
{
  "id": "git-m05-a1",
  "prompt": "Which single command creates a new branch called `fix/typo` **and** switches to it? Type the full command.",
  "answer": "git switch -c fix/typo",
  "format": "text",
  "accept": ["git checkout -b fix/typo"],
  "explanation": "-c means create. git checkout -b does the same thing in the older syntax.",
  "required": true
}
```
