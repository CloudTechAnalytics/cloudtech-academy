---
title: "Undoing Mistakes Safely: restore, amend, reset, revert and stash"
minutes: 25
summary: Everyone makes mistakes, and Git is built so you can fix them. Learn which command undoes which mistake, from a bad edit to a bad commit, and which ones are safe on shared work.
---

## Git is a safety net

The best thing about Git is not saving your work. It is that you can **undo almost anything**. That makes you braver: you can try a risky change, knowing you can get back.

The trick is knowing **which tool fits which mistake**. This lesson is a map. The questions to ask each time are: *Where is the mistake? In my working folder, in the staging area, or in a commit? And has anyone else already got that commit?*

| The mistake | The fix |
| :-- | :-- |
| I edited a file and want the old version back | `git restore <file>` |
| I staged a file by accident | `git restore --staged <file>` |
| My last commit message is wrong, or I forgot a file | `git commit --amend` |
| My last commit was a mistake, and I have **not shared** it | `git reset` |
| A commit was a mistake, and it is **already shared** | `git revert` |
| I am mid-work and need to switch tasks | `git stash` |

## Undo a change to a file: git restore

You changed a file and made a mess. You want it back the way it was at the last commit.

```bash
git restore notes.txt
```

> [!WARNING]
> This **throws away** your uncommitted changes for good. Git cannot bring them back, because they were never saved. Check with `git diff` first.

Try it. The file below has been changed. Look with `git diff`, then restore it and check `git status`.

```gitterm
=== file notes.txt
Meeting on Friday at 10 am.
=== setup
git init
git add .
git commit -m "Add meeting note"
echo "oops, deleted everything important" > notes.txt
```

## Unstage a file: git restore --staged

You ran `git add .` and staged something you did not mean to, perhaps a file with a password in it. Nothing is lost. You only change which things are in the waiting room.

```bash
git restore --staged passwords.txt
```

The file stays exactly as it was in your folder, but it is no longer going into the next commit. You will see this in the task below.

## Fix the last commit: git commit --amend

You just committed, and then spotted a typo in the message, or realised you forgot to add a file. Instead of making a messy extra commit, **replace** the last one:

```bash
git add forgotten-file.txt
git commit --amend -m "Add the contact page with its style file"
```

Amend swaps the last commit for a new one. It is perfect for tidying up your **own recent** work. Do not amend a commit that you have already pushed for others to use, because it rewrites history they depend on.

## Move back in history: git reset

`git reset` moves your branch back to an earlier commit. It has three modes, and the difference is **what happens to your changes**.

| Command | The commit | The staging area | Your files |
| :-- | :-- | :-- | :-- |
| `git reset --soft HEAD~1` | Undone | Keeps the changes **staged** | Kept |
| `git reset HEAD~1` (mixed, the default) | Undone | Changes **unstaged** | Kept |
| `git reset --hard HEAD~1` | Undone | Cleared | **Thrown away** |

`HEAD~1` means "one commit before the current one". The usual story: you committed too early. `git reset --soft HEAD~1` undoes the commit but keeps all your work staged, so you can fix and recommit. Try it, and then look at `git status` and `git log --oneline` after each step.

```gitterm
=== file plan.txt
Step 1: write the report
=== setup
git init
git add .
git commit -m "Add plan"
echo "Step 2: draft the slides" >> plan.txt
git commit -am "Add step two too early"
```

> [!WARNING]
> `git reset --hard` is the dangerous one: it deletes uncommitted work. And **never reset commits that you have pushed** and others have pulled. Rewriting shared history causes confusing problems for your team. For shared commits, use `revert`.

## Undo a shared commit safely: git revert

`git revert` does not erase anything. It makes a **new commit that does the opposite** of an earlier one. The history grows, and nothing is rewritten, which makes it safe even after you have pushed.

```bash
git revert HEAD              # undo the last commit
git revert a3f9c21           # undo a specific older commit
```

Git writes the message for you, such as `Revert "Set all prices to zero"`. In the history, it reads honestly: something went wrong, and here is the commit that fixed it. This is how teams undo mistakes on shared branches.

## Park your work: git stash

Imagine you are halfway through a change, with files half-edited and not ready to commit, and your manager says: "There is an urgent bug on the main branch. Fix it now." You cannot commit half-finished work, and you cannot switch branches with it in the way.

`git stash` puts your uncommitted changes in a **drawer** and gives you back a clean folder:

```bash
git stash              # put the changes away
git switch main        # (do the urgent work here)
git stash pop          # take them back out
git stash list         # see what is in the drawer
```

Try the stash cycle yourself.

```gitterm
=== file report.md
# Weekly report
Section one done.
=== setup
git init
git add .
git commit -m "Add report"
echo "Section two: half written..." >> report.md
```

Run `git status` (a change), `git stash` (clean again, and your edit is hidden), `git status`, and finally `git stash pop` to bring the edit back.

## When something feels lost

Git rarely loses committed work. Even after a hard reset, the old commits usually still exist for a while, and `git reflog` lists every place your HEAD has been, so an expert can get them back. If you ever panic, stop, do not run more commands, and ask for help. Committed work is very hard to lose. **Uncommitted** work is the fragile kind, which is another reason to commit often.

## A golden rule

Before any command that **rewrites history** (`amend`, `reset`), ask: *"Has anyone else got these commits?"* If the answer is yes, use `revert`.

## Try it

First, undo a bad commit on a **shared** branch the safe way. The last commit set every price to zero by mistake.

```gittask
{
  "id": "git-m04-t1",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "You used git revert (history is kept, not erased)", "ran": "^git revert" },
    { "label": "The prices are back: Rice 1500 is in prices.txt", "file": "prices.txt", "contains": "Rice 1500" },
    { "label": "The bad commit is still in the history, and a Revert commit sits above it (4 commits)", "commits": 4 },
    { "label": "A commit message starts with Revert", "log": "^Revert" },
    { "label": "Everything is committed (clean)", "clean": true }
  ],
  "hint": "git log --oneline shows the commits. The bad one is the newest, so git revert HEAD undoes it. Accept the default message.",
  "height": 280
}
=== prompt
The newest commit, **Set all prices to zero by mistake**, has already been shared with the team. Undo it **without erasing history**, so the prices come back.
=== file prices.txt
Rice 1500
Beans 1200
=== setup
git init
git add .
git commit -m "Add price list"
echo "Yam 2500" >> prices.txt
git commit -am "Add yam price"
echo "Rice 0\nBeans 0\nYam 0" > prices.txt
git commit -am "Set all prices to zero by mistake"
=== sample
git log --oneline
git revert HEAD
git status
=== note
Compare with `git reset --hard HEAD~1`: the history would look as if the mistake never happened. That is fine on private work, and dangerous on shared work, which is why this task needed `revert`.
```

Now fix a staging mistake. Two files were staged, and one of them has a password in it.

```gittask
{
  "id": "git-m04-t2",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "You unstaged the password file (git restore --staged or git reset)", "ran": "^git (restore --staged|reset)\\b" },
    { "label": "todo.txt is committed", "tracked": "todo.txt" },
    { "label": "passwords.txt is NOT committed", "notTracked": "passwords.txt" },
    { "label": "passwords.txt still exists in your folder (you did not delete it)", "file": "passwords.txt" },
    { "label": "Nothing is left staged", "nothingStaged": true },
    { "label": "There are two commits now", "commits": 2 }
  ],
  "hint": "git status shows both files staged. git restore --staged passwords.txt removes just that one from the staging area. Then commit what is left.",
  "height": 280
}
=== prompt
You ran `git add .` and staged both `todo.txt` and `passwords.txt`. **Do not commit the passwords.** Unstage `passwords.txt`, keep the file in your folder, and commit only `todo.txt`.
=== file readme.txt
Team notes
=== setup
git init
git add .
git commit -m "Add readme"
echo "Buy rice" > todo.txt
echo "ada:12345" > passwords.txt
git add .
=== sample
git status
git restore --staged passwords.txt
git status
git commit -m "Add todo list"
```

Optionally, practise the stash cycle for real.

```gittask
{
  "id": "git-m04-t3",
  "minutes": 6,
  "required": false,
  "rules": [
    { "label": "You used git stash", "ran": "^git stash$|^git stash push" },
    { "label": "You brought the work back with git stash pop", "ran": "^git stash pop" },
    { "label": "The drawer is empty again (no stash entries)", "stashed": 0 },
    { "label": "Your half-finished edit is back in the file", "file": "report.md", "contains": "half written" }
  ],
  "hint": "git stash, then git status (clean), then git stash pop.",
  "height": 260
}
=== prompt
Stash your half-finished work, check that your folder is clean, and then bring it back with `git stash pop`.
=== file report.md
# Weekly report
Section one done.
=== setup
git init
git add .
git commit -m "Add report"
echo "Section two: half written..." >> report.md
=== sample
git stash
git status
git stash pop
```

```answer
{
  "id": "git-m04-a1",
  "prompt": "You pushed a bad commit and teammates have already pulled it. Which command safely undoes it without rewriting history: `reset`, `revert` or `amend`? Type one word.",
  "answer": "revert",
  "format": "text",
  "accept": ["git revert"],
  "explanation": "git revert adds a new commit that undoes the old one, so nobody's history is rewritten. reset and amend rewrite history and are for your own unshared work.",
  "required": true
}
```
