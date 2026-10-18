---
title: "GitHub and Remotes: Push, Pull and Clone"
minutes: 45
summary: Connect the repository on your computer to GitHub. Learn what a remote is, how to sign in safely, and the everyday rhythm of clone, pull, commit and push, with the commands practised in the terminal and the real thing on GitHub.
---

## One repository, many copies

So far everything has lived on your own computer. **GitHub** gives your repository a second home on the internet. Your project then exists in (at least) two places:

- **Local:** the repository on your computer, where you work.
- **Remote:** a copy on GitHub (a **remote** is any other copy of the repository).

Git moves commits between them with a few simple commands. The remote you will use most is called **`origin`**, which is just the standard nickname for the repository you cloned from or pushed to first.

```text
  Your computer                          GitHub
  (local repo)   --- git push --->      (origin)
                 <--- git pull ---
```

## Create a repository on GitHub

1. On GitHub, click **+**, then **New repository**.
2. Choose a short name with hyphens, for example `recipe-notebook`.
3. Add a description. Choose **Public** (for a portfolio) or **Private**.
4. If you already have a project on your computer, **leave "Add a README" unticked**, so GitHub does not create a first commit that clashes with yours.
5. Click **Create repository**. GitHub shows you the address, like `https://github.com/ada-okafor/recipe-notebook.git`.

## Connect and push

On a repository you already have, you connect the remote and push your commits:

```bash
git remote add origin https://github.com/ada-okafor/recipe-notebook.git
git remote -v                       # check it: shows the address for fetch and push
git push -u origin main
```

- `git remote add origin <url>` gives the remote a name. You do this once.
- `git push -u origin main` sends your `main` branch to `origin`. The `-u` makes Git **remember** the link, so later you can just type `git push`.

Refresh the GitHub page and your files and commit history are there.

> [!NOTE]
> In the practice terminal, push and pull are **simulated**: there is no real GitHub server behind it. You practise the commands and see realistic output, and you do the real thing in the tasks at the end, on your own computer.

Try it. This project has a commit. Connect it to a pretend remote and push.

```gitterm
=== file recipes.md
# My Recipe Notebook
=== setup
git init
git add .
git commit -m "Add recipe notebook"
```

Run `git remote add origin https://github.com/ada-okafor/recipe-notebook.git`, then `git remote -v`, then `git push -u origin main`, and look at the log: `git log --oneline` now shows `origin/main` beside your commit, showing the remote is up to date.

## Signing in: passwords do not work

When Git talks to GitHub, it needs to know it is really you. GitHub **does not accept your account password** for Git operations. You have three good options:

| Option | How it works | Best for |
| :-- | :-- | :-- |
| **GitHub Desktop or VS Code sign-in** | Click sign in. A browser window confirms it. The tool remembers you | Beginners: easiest |
| **HTTPS with a personal access token** | You create a token (like a long password) in GitHub **Settings, then Developer settings, then Personal access tokens**, and paste it when Git asks | Quick command-line use |
| **SSH keys** | You create a key pair, give GitHub the public half, and never type a password again | Daily professional use |

Whichever you use, remember: **a token or a private key is a secret.** Do not put it in a file you commit, and do not share it. If it leaks, delete it on GitHub right away.

## The four commands you will use every day

| Command | What it does |
| :-- | :-- |
| `git clone <url>` | **Download** a whole repository (all its history) to your computer for the first time |
| `git pull` | **Get** the latest commits from the remote and merge them into your branch |
| `git push` | **Send** your new commits to the remote |
| `git fetch` | Get the remote's commits to look at, **without** merging them yet |

```bash
git clone https://github.com/ada-okafor/recipe-notebook.git
cd recipe-notebook
```

`clone` creates a folder, copies everything, and automatically sets up `origin` for you. You clone a repository **once**.

## The daily rhythm

Once you work with a remote, your day follows a pattern:

1. **`git pull`** to start with the latest work.
2. Do your work, and commit it in small pieces.
3. **`git pull`** again, in case teammates pushed while you worked.
4. **`git push`** to share your commits.

The most common error teaches why step 3 matters:

```text
! [rejected]  main -> main (fetch first)
error: failed to push some refs
```

It means the remote has commits you do not have yet. The fix is simple: `git pull` (resolve any conflict as in lesson 6), then `git push` again.

## Seeing remote branches

After you push or fetch, Git keeps a read-only bookmark of where the remote's branches are, written `origin/main`. In `git log --oneline` you can see `HEAD -> main, origin/main` when you are level with the remote. If `main` is ahead of `origin/main`, you have commits to push.

## Fork: your own copy of someone else's project

You cannot push to a repository you do not own. To contribute to someone else's project (or to start from it), you make a **fork**: your own copy of it on GitHub, under your account. You clone your fork, make changes, and ask the owner to take them through a **pull request**, which is the next lesson.

## Try it

First, connect a project to GitHub and push it. (The remote is simulated here, and you do the real thing in the last task.)

```gittask
{
  "id": "git-m07-t1",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "You added a remote called origin with a GitHub address", "ran": "^git remote add origin https://github\\.com/[\\w.-]+/[\\w.-]+" },
    { "label": "The remote exists in the repository", "remote": "origin" },
    { "label": "Your main branch is pushed to origin", "pushed": "main" },
    { "label": "You used -u to link main to origin/main", "ran": "^git push -u origin main" },
    { "label": "Everything is committed (clean)", "clean": true }
  ],
  "hint": "git remote add origin https://github.com/your-name/recipe-notebook.git, then git remote -v to check, then git push -u origin main.",
  "height": 280
}
=== prompt
This repository only exists on your computer. Add a remote called `origin` that points to a GitHub address such as `https://github.com/ada-okafor/recipe-notebook.git`, check it, and push `main` with the `-u` option.
=== file recipes.md
# My Recipe Notebook
=== setup
git init
git add .
git commit -m "Add recipe notebook"
=== sample
git remote add origin https://github.com/ada-okafor/recipe-notebook.git
git remote -v
git push -u origin main
```

Now the daily rhythm. The project is already on GitHub. Make a change and push it.

```gittask
{
  "id": "git-m07-t2",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "You pulled before pushing", "ran": "^git pull" },
    { "label": "shopping.txt is committed, with at least three commits in total", "commits": 3 },
    { "label": "shopping.txt includes Garri", "file": "shopping.txt", "contains": "garri" },
    { "label": "Your new commit is pushed (origin/main matches main)", "pushed": "main" },
    { "label": "Everything is committed (clean)", "clean": true }
  ],
  "hint": "Add the line (echo \"Garri\" >> shopping.txt), git add shopping.txt, git commit -m \"Add garri\", then git pull and git push.",
  "height": 280
}
=== prompt
The project is already on GitHub. Add `Garri` to `shopping.txt`, commit it, **pull** to check for new work, and then **push** it.
=== file recipes.md
# My Recipe Notebook
=== file shopping.txt
Rice
Onions
=== setup
git init
git add .
git commit -m "Add recipe notebook and shopping list"
echo "Tomatoes" >> shopping.txt
git commit -am "Add tomatoes"
git remote add origin https://github.com/ada-okafor/recipe-notebook.git
git push -u origin main
=== sample
echo "Garri" >> shopping.txt
git add shopping.txt
git commit -m "Add garri to shopping list"
git pull
git push
```

Finally, do the real thing. Put a project of yours on GitHub, from your own computer.

```task
{
  "id": "git-m07-t3",
  "prompt": "On **your own computer** (or with GitHub Desktop), make a repository for a real project with at least two commits, create a repository on GitHub, connect it with `git remote add origin`, and push it. Paste your **repository link** on the first line, and on the second line the **commands you used to connect and push**.",
  "minutes": 20,
  "rows": 4,
  "placeholder": "https://github.com/your-username/your-project\ngit remote add origin ...; git push -u origin main",
  "rules": [
    { "label": "A link to a GitHub repository", "pattern": "https?://(www\\.)?github\\.com/[A-Za-z0-9-]+/[A-Za-z0-9._-]+" },
    { "label": "The remote add command", "pattern": "git remote add origin" },
    { "label": "The push command", "pattern": "git push" }
  ],
  "sample": "https://github.com/adaeze-okafor/recipe-notebook\ngit remote add origin https://github.com/adaeze-okafor/recipe-notebook.git; git push -u origin main",
  "required": true
}
```

```answer
{
  "id": "git-m07-a1",
  "prompt": "A colleague tells you to `git clone` a project you already have on your computer. Which command should you use instead to get the latest changes from GitHub? Type the full command.",
  "answer": "git pull",
  "format": "text",
  "accept": ["git pull origin main", "git fetch"],
  "explanation": "git clone downloads a repository for the first time. After that, git pull brings in new commits.",
  "required": true
}
```
