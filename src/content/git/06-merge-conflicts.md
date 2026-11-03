---
title: "Merge Conflicts: Don't Panic"
minutes: 25
summary: Merge conflicts scare every beginner and are routine for every professional. Learn why they happen, how to read the markers Git writes, how to resolve one step by step, how to abort, and how teams avoid most of them.
---

## Conflicts are normal

You merge a branch and Git says:

```text
Auto-merging menu.txt
CONFLICT (content): Merge conflict in menu.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Many beginners think they broke something. **You did not.** A conflict is Git being honest: "Two people changed the same place in different ways, and I cannot guess which one you want. You decide."

Git merges automatically whenever it can. Changes in **different files**, or different parts of the same file, merge with no fuss. A conflict happens only when **both branches changed the same lines** (or lines right next to each other). In a team, this is routine, and resolving one takes a couple of minutes once you know the steps.

## How a conflict happens

Two branches start from the same commit. Each changes the jollof price on the same line:

```text
        main:     A --- B  (price 3200)
                   \
        price-update:  C  (price 3500)
```

When you merge `price-update` into `main`, Git sees that line changed on both sides to different values, so it stops and asks you.

## Step 1: read the conflict markers

Git edits the conflicted file and marks the problem with three lines:

```text
<<<<<<< HEAD
Jollof rice - 3200
=======
Jollof rice - 3500
>>>>>>> price-update
```

| Marker | Means |
| :-- | :-- |
| `<<<<<<< HEAD` | Start of **your** version: what is on the branch you are on |
| `=======` | The dividing line |
| `>>>>>>> price-update` | End of **their** version: what is on the branch you are merging in |

Everything between `<<<<<<<` and `=======` is yours. Everything between `=======` and `>>>>>>>` is theirs. The rest of the file, outside the markers, merged cleanly.

## Step 2: decide and edit

Your job is to edit the file so it contains **the final version you want**, and to **delete all three marker lines**. You can:

- Keep **yours**, keep **theirs**, or
- **Combine** both, or write something new.

After you edit, the file should be normal text with no `<<<<<<<`, `=======` or `>>>>>>>` in it. VS Code makes this easy with buttons that say **Accept Current Change**, **Accept Incoming Change** and **Accept Both**.

## Step 3: add and commit

Telling Git "I fixed this file" is done with `git add`. When every conflicted file is added, you commit to finish the merge:

```bash
git add menu.txt
git commit -m "Merge price-update, keep the new price"
```

(You can run `git commit` without `-m` and Git proposes a ready-made merge message.) `git status` at any point tells you what is left to do: files listed under **Unmerged paths** still need you.

## Try it: resolve a real conflict

This repository is in the middle of a conflicted merge. On `main`, the jollof price was changed to 3200. On the branch `price-update`, it was changed to 3500. We tried to merge `price-update`, and it conflicted.

1. Run `git status`. See the **Unmerged paths**, and the `U` badge by the file.
2. Click `menu.txt` in the file list and read the markers.
3. Edit it to the final version you want, with no markers. Click **Save file**.
4. `git add menu.txt`, then `git commit -m "Merge price-update"`.
5. `git log --oneline` shows your merge commit with two parents.

```gitterm
=== file menu.txt
Jollof rice - 3000
Fried rice - 2800
=== setup
git init
git add .
git commit -m "Add menu"
git switch -c price-update
echo "Jollof rice - 3500\nFried rice - 2800" > menu.txt
git commit -am "Raise jollof price"
git switch main
echo "Jollof rice - 3200\nFried rice - 2800" > menu.txt
git commit -am "Update jollof price for December"
git merge price-update
```

## Changed your mind? Abort

If you start a merge and feel lost, you can always back out:

```bash
git merge --abort
```

Git puts everything back as it was before the merge. Nothing is lost. You can then talk to your teammate, or try again.

## Avoiding most conflicts

You cannot avoid all of them, but good habits prevent most:

1. **Pull often.** Get your teammates' changes (lesson 7) before you start new work, and before you push.
2. **Keep branches short-lived.** The longer a branch lives, the further it drifts from `main`.
3. **Make small, focused commits and small pull requests.**
4. **Talk to your team.** If two people must edit the same file, tell each other.
5. **Do not reformat whole files** (for example, changing every indent) in a commit with other changes. It makes every line conflict.

> [!TIP]
> When you resolve a conflict, run the project afterwards. A file with no markers can still be wrong. For example, if you kept both versions of a function by mistake. Resolve, then test.

## Try it

First, resolve the price conflict. The merge has already failed and left the markers. Keep the **new, higher price (3500)** from the branch.

```gittask
{
  "id": "git-m06-t1",
  "minutes": 10,
  "required": true,
  "rules": [
    { "label": "The final menu has the price Jollof rice - 3500", "file": "menu.txt", "contains": "Jollof rice - 3500" },
    { "label": "No conflict markers are left in any file", "noMarkers": true },
    { "label": "The branch price-update is merged into main", "merged": "price-update" },
    { "label": "The merge is committed and the working tree is clean", "clean": true },
    { "label": "The history has at least four commits (two branches plus the merge commit)", "commits": 4 }
  ],
  "hint": "Open menu.txt in the editor, delete the three marker lines and keep the 3500 line. Save, then git add menu.txt and git commit -m \"Merge price-update\".",
  "height": 300
}
=== prompt
A merge of `price-update` into `main` has conflicted in `menu.txt`. Resolve it by **keeping the 3500 price**, remove every conflict marker, and finish the merge with a commit.
=== file menu.txt
Jollof rice - 3000
Fried rice - 2800
=== setup
git init
git add .
git commit -m "Add menu"
git switch -c price-update
echo "Jollof rice - 3500\nFried rice - 2800" > menu.txt
git commit -am "Raise jollof price"
git switch main
echo "Jollof rice - 3200\nFried rice - 2800" > menu.txt
git commit -am "Update jollof price for December"
git merge price-update
=== sample
git status
echo "Jollof rice - 3500\nFried rice - 2800" > menu.txt
git add menu.txt
git commit -m "Merge price-update, keep the new price"
git log --oneline
=== note
There is no "right" answer to a conflict. The conflict only told you that two people disagreed. Which price is correct is a decision for people, and in a real team you would ask.
```

Now try the other way out. The same kind of conflict happened, but you decide that the incoming change should wait. **Abort the merge** and keep `main` exactly as it was.

```gittask
{
  "id": "git-m06-t2",
  "minutes": 6,
  "required": true,
  "rules": [
    { "label": "You aborted the merge with git merge --abort", "ran": "^git merge --abort" },
    { "label": "main still has its own price: Jollof rice - 3200", "file": "menu.txt", "contains": "Jollof rice - 3200" },
    { "label": "No conflict markers are left", "noMarkers": true },
    { "label": "The working tree is clean and you are not in the middle of a merge", "clean": true },
    { "label": "You are still on main", "current": "main" }
  ],
  "hint": "git status shows the unmerged paths. git merge --abort puts everything back.",
  "height": 260
}
=== prompt
A merge of `price-update` has conflicted, and you want to stop and talk to your teammate first. Abort the merge so that `main` is back to how it was, with the 3200 price.
=== file menu.txt
Jollof rice - 3000
Fried rice - 2800
=== setup
git init
git add .
git commit -m "Add menu"
git switch -c price-update
echo "Jollof rice - 3500\nFried rice - 2800" > menu.txt
git commit -am "Raise jollof price"
git switch main
echo "Jollof rice - 3200\nFried rice - 2800" > menu.txt
git commit -am "Update jollof price for December"
git merge price-update
=== sample
git status
git merge --abort
git status
```

```answer
{
  "id": "git-m06-a1",
  "prompt": "In a conflicted file, the text between `<<<<<<< HEAD` and `=======` comes from which side: **yours** (the branch you are on) or **theirs** (the branch you are merging in)? Type one word.",
  "answer": "yours",
  "format": "text",
  "accept": ["your", "mine", "ours", "your branch", "the branch you are on", "yours (head)"],
  "explanation": "HEAD is where you are, so the first block is your version. The block after ======= is the incoming branch.",
  "required": true
}
```
