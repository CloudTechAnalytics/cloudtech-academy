---
title: "Pull Requests and Code Review"
minutes: 30
summary: Learn the workflow almost every software team uses. Work on a branch, push it, open a pull request, get a review, and merge. Practise the branch-and-push part in the terminal, and write a pull request description a reviewer will thank you for.
---

## Why teams do not push straight to main

On a real team, nobody commits directly to `main`. `main` is the version that is live, or about to be, so every change to it is **proposed first**, **read by another person**, and **checked automatically** before it goes in. The tool for that is the **pull request**, or **PR**.

A pull request is a page on GitHub that says: *"I made these changes on my branch. Please review them and merge them into main."* Despite the name, it is a **request** to pull your work in. It is also a **conversation**: reviewers comment on specific lines, you reply or change the code, and when everyone is happy the work is merged.

## The whole workflow

```text
1. Start from an up-to-date main
2. git switch -c fix/menu-typo        make a branch
3. edit, git add, git commit          small commits with good messages
4. git push -u origin fix/menu-typo   send the branch to GitHub
5. Open a pull request on GitHub      describe the change
6. Teammates review, you answer       comments, changes, approval
7. Merge the pull request             the work joins main
8. Delete the branch, git pull main   tidy up and start again
```

You already know steps 1 to 4 from the last lessons. Steps 5 to 8 happen on GitHub. This is the same loop on every company's team, from small startups to the biggest names.

## Step 1 to 4: branch, commit and push

The first four steps in the terminal. Notice that a **new branch** needs `-u` the first time you push it:

```bash
git switch -c fix/menu-typo
# ...edit menu.txt...
git add menu.txt
git commit -m "Fix typo in the jollof rice name"
git push -u origin fix/menu-typo
```

Try it. The project below is already connected to a remote.

```gitterm
=== file menu.txt
Jolof rice - 3000
Fried rice - 2800
=== setup
git init
git add .
git commit -m "Add menu"
git remote add origin https://github.com/ada-okafor/kitchen-site.git
git push -u origin main
```

## Step 5: open the pull request

After you push a branch, GitHub shows a yellow banner: **Compare & pull request**. Click it. (Or use **Pull requests, then New pull request**.) You will see:

- **base:** the branch you want to merge **into** (usually `main`).
- **compare:** your branch.
- A **title** and a **description** box. Writing these well is a real skill.
- The list of commits and the exact changes (the **diff**).

### A good pull request

| Part | What a good one looks like |
| :-- | :-- |
| **Title** | Short and specific: "Fix typo in the jollof rice name". Not "Update" or "My changes" |
| **What** | One or two sentences on what changed |
| **Why** | The reason, or a link to the issue |
| **How to test** | Steps for the reviewer to check it works |
| **Screenshots** | For visual changes, a before and after |
| **Size** | Small. A reviewer can read 50 lines carefully, but not 2,000 |

A template many teams use:

```markdown
## What
Corrects the spelling of "Jollof rice" on the menu.

## Why
Customers noticed the typo. Fixes #12.

## How to test
1. Open menu.txt.
2. Check that the first line says "Jollof rice".
```

Writing `Fixes #12` (or `Closes #12`) links the pull request to **issue number 12**, and GitHub closes that issue automatically when the PR is merged.

## Step 6: review

A reviewer reads your diff on GitHub. They can:

- **Comment** on any line, ask a question, or suggest a change.
- Click **Add a suggestion**, which proposes exact replacement text that you can accept with one click.
- Finish with **Approve**, **Comment** or **Request changes**.

If they ask for changes, you do not open a new pull request. You commit more changes **on the same branch** and push, and the pull request updates itself.

Meanwhile, **automatic checks** (tests, linters and so on, run by a tool called GitHub Actions, which you meet in lesson 10) show green ticks or red crosses on the pull request. Many teams will not allow a merge until the checks pass and someone has approved it. This is called **branch protection**.

### Being a good reviewer and author

- **Be kind and specific.** Comment on the code, not the person. "This could be simpler if we..." beats "This is wrong."
- **Ask questions** when you do not understand, because a confusing line is worth fixing.
- **Say thank you** and mark what you liked.
- **As the author, do not take it personally.** Review is how everyone gets better, including senior engineers.

## Step 7: merging

When approved, you press **Merge pull request**. GitHub offers three ways:

| Option | Result | Good for |
| :-- | :-- | :-- |
| **Create a merge commit** | Keeps every commit, and adds a merge commit | Keeping full history |
| **Squash and merge** | Combines all your commits into **one** commit on main | Tidy history, many small "fix typo" commits |
| **Rebase and merge** | Replays your commits on top of main, with no merge commit | A straight, linear history |

Many teams use **squash and merge** so `main` has one clean commit per pull request. Follow your team's rule.

## Step 8: tidy up

After merging, click **Delete branch** on GitHub. Then, on your computer:

```bash
git switch main
git pull
git branch -d fix/menu-typo
```

You are back on an up-to-date `main`, ready for the next task.

## Contributing to other people's projects

For a repository you do not own, the workflow has one extra step at the start: **fork** it (your own copy on GitHub), **clone your fork**, work on a branch, push to your fork, and open a pull request **from your fork to the original**. This is how people contribute to open-source projects, and it is a great way to build a track record. Look for issues labelled **good first issue**.

## Try it

First, do the branch, commit and push part of the workflow. The project is connected to GitHub.

```gittask
{
  "id": "git-m08-t1",
  "minutes": 10,
  "required": true,
  "rules": [
    { "label": "You worked on a branch called fix/menu-typo", "ran": "^git (switch -c|checkout -b) fix/menu-typo" },
    { "label": "The typo is fixed: the menu says Jollof rice", "file": "menu.txt", "contains": "Jollof rice" },
    { "label": "The old spelling Jolof is gone", "file": "menu.txt", "notContains": "Jolof " },
    { "label": "The branch is pushed to origin, ready for a pull request", "pushed": "fix/menu-typo" },
    { "label": "Your commit message mentions the typo", "log": "typo" },
    { "label": "main was not changed directly: you finished with a clean tree", "clean": true }
  ],
  "hint": "git switch -c fix/menu-typo, change the first line to Jollof rice - 3000 (editor or echo), git add menu.txt, git commit -m \"Fix typo in the jollof rice name\", git push -u origin fix/menu-typo.",
  "height": 300
}
=== prompt
The menu has a typo: `Jolof rice`. Fix it **on a new branch** called `fix/menu-typo`, commit it with a message that mentions the typo, and push the branch to `origin`, so it is ready for a pull request.
=== file menu.txt
Jolof rice - 3000
Fried rice - 2800
=== setup
git init
git add .
git commit -m "Add menu"
git remote add origin https://github.com/ada-okafor/kitchen-site.git
git push -u origin main
=== sample
git switch -c fix/menu-typo
echo "Jollof rice - 3000\nFried rice - 2800" > menu.txt
git add menu.txt
git commit -m "Fix typo in the jollof rice name"
git push -u origin fix/menu-typo
=== note
On GitHub you would now see the yellow **Compare & pull request** banner. Opening the pull request is the next task.
```

Now write the pull request itself. This is the thing reviewers read first.

```task
{
  "id": "git-m08-t2",
  "prompt": "Write the **title and description** of a pull request for a change you made (or imagine one): the title on the first line, then the description with the sections **## What**, **## Why** and **## How to test**, with at least two numbered steps to test, and a line that links an issue with `Fixes #` and a number.",
  "minutes": 10,
  "rows": 14,
  "placeholder": "Fix typo in the jollof rice name\n\n## What\n...\n\n## Why\n... Fixes #12\n\n## How to test\n1. ...\n2. ...",
  "rules": [
    { "label": "A specific title on the first line (at least 5 words, not just Update)", "pattern": "(?<![\\s\\S])\\s*[^#\\n]+( [^\\n ]+){3,}" },
    { "label": "A ## What section", "pattern": "^##\\s+what" },
    { "label": "A ## Why section", "pattern": "^##\\s+why" },
    { "label": "A ## How to test section", "pattern": "^##\\s+how to test" },
    { "label": "At least two numbered test steps", "pattern": "^\\s*\\d+\\.\\s+\\S", "min": 2 },
    { "label": "It links an issue with Fixes #<number> (or Closes #)", "pattern": "(fixes|closes|resolves)\\s+#\\d+" }
  ],
  "sample": "Fix typo in the jollof rice name\n\n## What\nCorrects the spelling of \"Jollof rice\" on the menu page.\n\n## Why\nCustomers pointed out the typo, and it looks careless on our main page. Fixes #12.\n\n## How to test\n1. Open menu.txt.\n2. Check that the first line says \"Jollof rice - 3000\".\n3. Check that nothing else changed.",
  "required": true
}
```

```answer
{
  "id": "git-m08-a1",
  "prompt": "A reviewer asks you to change something in your pull request. Do you open a new pull request, or push more commits to the **same branch**? Type: **same branch** or **new pull request**.",
  "answer": "same branch",
  "format": "text",
  "accept": ["push more commits to the same branch", "the same branch", "same"],
  "explanation": "The pull request follows the branch, so new commits you push to it appear in the same pull request, and reviewers see the update.",
  "required": true
}
```
