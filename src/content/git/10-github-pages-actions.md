---
title: "GitHub Pages and GitHub Actions: Publish and Automate"
minutes: 25
summary: Publish a website straight from a repository with GitHub Pages, and meet GitHub Actions, the automation that runs checks and deployments every time you push. Write and read a real workflow file.
---

## Your repository can do work for you

A repository is more than a folder of files. GitHub can **host** a website straight from it, and it can **run commands automatically** whenever something happens, such as a push or a pull request. This lesson covers both.

## GitHub Pages: a free website from a repository

**GitHub Pages** takes the files in a repository (HTML, CSS, JavaScript, images) and serves them as a website, free, with HTTPS, at an address on `github.io`. There are two kinds:

| Kind | Repository name | Address |
| :-- | :-- | :-- |
| **User site** | `your-username.github.io` | `https://your-username.github.io` |
| **Project site** | any name, such as `kitchen-site` | `https://your-username.github.io/kitchen-site` |

To publish:

1. Make sure your site's main file is called **`index.html`** at the top of the repository.
2. On GitHub, open the repository, then **Settings, then Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose **main** and **/ (root)**, and **Save**.
4. Wait a minute or two. GitHub shows the live address at the top of the Pages settings.

From then on, **every push to `main` updates the site**. Edit, commit, push, and your website is updated. Combine this with the pull request workflow and you have a real, professional process: changes are reviewed first, and merging publishes them.

> [!TIP]
> The Web Development course in this academy walks through building a complete website, and its last lesson publishes it with GitHub Pages. Pages is also a perfect home for a portfolio or a project demo.

## GitHub Actions: automation that reacts

**GitHub Actions** runs **workflows**: small programs that start when an **event** happens in your repository. Teams use them to:

- **Test** the code on every push and pull request, so broken code is caught at once.
- **Check style** and formatting.
- **Build and deploy** a website or app when `main` changes.
- **Do chores**, like labelling issues or sending a message.

This is called **CI/CD** (continuous integration and continuous delivery): checking and shipping your work automatically, all the time. It is why companies can release many times a day.

## Anatomy of a workflow

A workflow is a **YAML** file in a special folder: **`.github/workflows/`**. (YAML is a simple format of keys and values, where **indentation matters**: use spaces, never tabs.) Here is a small, complete one:

```yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Get the code
        uses: actions/checkout@v4

      - name: Say hello
        run: echo "The workflow is running"

      - name: List the files
        run: ls
```

Read it from the top:

| Part | Meaning |
| :-- | :-- |
| `name: CI` | A label that shows in the Actions tab |
| `on:` | The **events** that start it: here a push to `main`, and any pull request |
| `jobs:` | The work to do. Each job runs on its own fresh machine |
| `test:` | A job's name (you choose it) |
| `runs-on: ubuntu-latest` | The kind of machine (a Linux virtual computer) |
| `steps:` | The commands, run in order |
| `uses: actions/checkout@v4` | Runs a **ready-made action**, here one that downloads your repository's code onto the machine |
| `run: ...` | Runs a shell command, like the ones you type in the terminal |

Almost every workflow starts the same way: **check out the code**, then run your tests or build commands. A real Python project might add `- run: pip install -r requirements.txt` and `- run: pytest`. A website might build and deploy.

## What you see on GitHub

After you push a workflow:

- The **Actions** tab lists every run, with a green tick (success) or red cross (failure).
- Click a run, then a job, to read the **logs**: exactly what each step printed. When something fails, the log tells you why. Reading logs is a core skill.
- On a pull request, the checks appear at the bottom, and a failing check can **block** the merge.

You can even show the status in your README with a **badge**, a small image that shows "passing" or "failing".

## Secrets in Actions

Sometimes a workflow needs a password or key, for example to deploy. Never write it in the YAML file, because that is in your repository (lesson 9). Instead, store it in **Settings, then Secrets and variables, then Actions**, and use it in the workflow as `${{ secrets.MY_KEY }}`. GitHub keeps the value hidden, even in the logs.

## Try it

First, add a workflow to a repository. Create the file in the right folder, with the right content, and commit it.

```gittask
{
  "id": "git-m10-t1",
  "minutes": 10,
  "required": true,
  "rules": [
    { "label": "The workflow file .github/workflows/ci.yml is committed", "tracked": ".github/workflows/ci.yml" },
    { "label": "It has a name and runs on push (on: and push)", "file": ".github/workflows/ci.yml", "contains": "on:[\\s\\S]*push" },
    { "label": "It runs on a machine: runs-on: ubuntu-latest", "file": ".github/workflows/ci.yml", "contains": "runs-on:\\s*ubuntu-latest" },
    { "label": "It checks out the code with actions/checkout", "file": ".github/workflows/ci.yml", "contains": "uses:\\s*actions/checkout" },
    { "label": "It runs at least one command with run:", "file": ".github/workflows/ci.yml", "contains": "run:\\s*\\S" },
    { "label": "Everything is committed (clean)", "clean": true }
  ],
  "hint": "Use New file with the name .github/workflows/ci.yml in the file editor, or echo with \\n for new lines. Then git add .github and git commit -m \"Add CI workflow\". The steps must be indented with spaces.",
  "height": 300
}
=== prompt
Add a GitHub Actions workflow to this repository at `.github/workflows/ci.yml`. It should run `on: push`, on a `ubuntu-latest` machine, check out the code with `actions/checkout`, and run at least one command with `run:`. Commit it.
=== file app.py
print("Hello")
=== setup
git init
git add .
git commit -m "Add app"
=== sample
echo "name: CI\non: push\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: echo Hello from CI" > .github/workflows/ci.yml
git add .github
git commit -m "Add CI workflow"
=== note
The next time you push to GitHub, it will run, and you will see the result in the Actions tab.
```

Now write a workflow for a Python project. This is the shape of what many real repositories have.

```task
{
  "id": "git-m10-t2",
  "prompt": "Write a GitHub Actions workflow in YAML for a Python project that **runs its tests**. Include a `name:`, `on:` push and pull_request, a job with `runs-on: ubuntu-latest`, a step that uses `actions/checkout@v4`, a step that installs requirements with `pip install -r requirements.txt`, and a step that runs `pytest`.",
  "minutes": 10,
  "rows": 16,
  "placeholder": "name: Tests\non:\n  push:\n  pull_request:\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: ...",
  "rules": [
    { "label": "A name: for the workflow", "pattern": "^name:\\s*\\S" },
    { "label": "on: with push and pull_request", "pattern": "^on:[\\s\\S]*push[\\s\\S]*pull_request|^on:[\\s\\S]*pull_request[\\s\\S]*push" },
    { "label": "runs-on: ubuntu-latest", "pattern": "runs-on:\\s*ubuntu-latest" },
    { "label": "It checks out the code (uses: actions/checkout@v4)", "pattern": "uses:\\s*actions/checkout@v\\d" },
    { "label": "It installs the requirements (pip install -r requirements.txt)", "pattern": "run:\\s*pip install -r requirements\\.txt" },
    { "label": "It runs pytest", "pattern": "run:\\s*pytest" },
    { "label": "It is indented with spaces (no tab characters)", "pattern": "\\t", "absent": true }
  ],
  "sample": "name: Tests\non:\n  push:\n    branches: [main]\n  pull_request:\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: \"3.12\"\n      - run: pip install -r requirements.txt\n      - run: pytest",
  "required": true
}
```

```answer
{
  "id": "git-m10-a1",
  "prompt": "In which folder of a repository must GitHub Actions workflow files be saved? Type the path.",
  "answer": ".github/workflows",
  "format": "text",
  "accept": [".github/workflows/", "/.github/workflows", ".github/workflows folder"],
  "explanation": "GitHub looks for YAML files in .github/workflows. Anywhere else, they are ignored.",
  "required": true
}
```
