---
title: "A Day on a Team: Putting It All Together"
minutes: 30
summary: Practise the real workflow end to end. Handle an urgent bug while mid-task, resolve a conflict with a teammate's change, tag a release, and build the habits and checklists that make a Git user professional.
---

## One day, many situations

You now know the pieces: commits, branches, merges, conflicts, undoing, remotes and pull requests. A real day on a team mixes them, and the work is rarely tidy. This lesson walks through a realistic day, and you practise each situation in the terminal.

The project is a small restaurant website. Your team is you and a teammate called Tunde.

## 9:00: Start the day

Always begin the same way: **get the latest work**.

```bash
git switch main
git pull
git switch -c feature/opening-hours
```

You pull so you start from what the team has done. Then you make a branch for your task, never working directly on `main`. Describe the branch by the work: `feature/opening-hours`.

## 11:00: An urgent interruption

You are halfway through the opening-hours page, with files edited and **not ready to commit**. Your manager says there is a **typo on the live menu** that must be fixed now.

You cannot commit half-finished work, and Git will not let you switch branches if it would overwrite your changes. The answer is the **stash** (lesson 4):

```bash
git stash                       # put your half-done work in the drawer
git switch main                 # go to the stable branch
git switch -c fix/menu-typo     # a branch for the urgent fix
# ...fix the typo...
git add menu.txt
git commit -m "Fix typo in the jollof rice name"
git switch main
git merge fix/menu-typo         # (or a pull request on a team)
git switch feature/opening-hours
git stash pop                   # get your work back
```

Practise this exact sequence in the first task below.

## 14:00: Tunde's change collides with yours

You finish the opening-hours page and merge `main` into your branch to check it still works, and Git says:

```text
CONFLICT (content): Merge conflict in hours.txt
```

Tunde also edited the Saturday hours. It is routine. You open the file, read the markers (lesson 6), decide together what is right (**talk to Tunde!**), edit the file, `git add`, and `git commit`. In the second task you do exactly this.

## 16:00: Release

When the work is merged into `main` and ready, teams mark the moment with a **tag**: a permanent, named label on a commit, usually a version number.

```bash
git tag v1.0
git tag                    # list tags
git push origin v1.0       # send the tag to GitHub
```

Tags make it easy to say "this is what we shipped on Friday", and to go back to it. On GitHub, you can turn a tag into a **Release** with notes for users. Version numbers like `v1.2.3` usually mean: **major** changes that break things, **minor** new features, **patch** small fixes.

## 17:00: End of day habits

Before you close your laptop:

- `git status`: is anything uncommitted that should not be lost?
- Push your branch, even if the work is unfinished. It is a **backup**, and your team can see your progress.
- Update the issue or leave a note about where you stopped.

## The professional's checklist

Print this and stick it beside your desk:

1. **Start with `git pull`** on `main`, then branch.
2. **Never work directly on `main`.** One branch per task.
3. **Small commits**, each one idea, each with a clear message.
4. **`git status` and `git diff --staged`** before every commit.
5. **Never commit secrets.** `.gitignore` from day one.
6. **Pull before you push**, and resolve conflicts calmly.
7. **Rewrite history only on private work.** Use `revert` on shared work.
8. **Open small pull requests** with a good description, and review others kindly.
9. **Delete merged branches**, and tag releases.
10. **Ask for help early.** Nobody remembers every command, and everybody searches for them.

## Try it

First, the urgent interruption. You have half-finished work. Stash it, fix the urgent bug on its own branch, merge it, and come back.

```gittask
{
  "id": "git-m12-t1",
  "minutes": 12,
  "required": true,
  "rules": [
    { "label": "You stashed your half-done work", "ran": "^git stash" },
    { "label": "The urgent typo is fixed on main: main's menu says Jollof", "onBranch": { "branch": "main", "file": "menu.txt", "contains": "Jollof rice" } },
    { "label": "The fix was made on its own branch and merged into main", "mergedInto": { "branch": "main", "of": "fix/menu-typo" } },
    { "label": "You are back on your feature branch", "current": "feature/opening-hours" },
    { "label": "Your half-finished work is back (stash popped)", "file": "hours.txt", "contains": "Saturday" },
    { "label": "The stash drawer is empty", "stashed": 0 },
    { "label": "The fix commit message mentions the typo", "ran": "^git commit .*typo" }
  ],
  "hint": "git stash, git switch main, git switch -c fix/menu-typo, fix menu.txt (echo \"Jollof rice - 3000\" > menu.txt), git add menu.txt, git commit -m \"Fix typo in the jollof rice name\", git switch main, git merge fix/menu-typo, git switch feature/opening-hours, git stash pop.",
  "height": 320
}
=== prompt
You are on `feature/opening-hours` with unfinished edits in `hours.txt`. A typo on the menu (`Jolof`) must be fixed **now**. Stash your work, fix the typo on a branch `fix/menu-typo`, merge it into `main`, return to your feature branch and restore your work.
=== file menu.txt
Jolof rice - 3000
=== file hours.txt
Weekdays 8 am - 8 pm
=== setup
git init
git add .
git commit -m "Add menu and hours"
git switch -c feature/opening-hours
echo "Saturday 10 am - 6 pm (draft)" >> hours.txt
=== sample
git stash
git switch main
git switch -c fix/menu-typo
echo "Jollof rice - 3000" > menu.txt
git add menu.txt
git commit -m "Fix typo in the jollof rice name"
git switch main
git merge fix/menu-typo
git switch feature/opening-hours
git stash pop
```

Now the collision. Tunde changed the same line as you. Resolve it and finish the merge, keeping **both** pieces of information.

```gittask
{
  "id": "git-m12-t2",
  "minutes": 10,
  "required": true,
  "rules": [
    { "label": "The branch opening-hours is merged into main", "merged": "opening-hours" },
    { "label": "No conflict markers are left", "noMarkers": true },
    { "label": "The final hours.txt mentions Saturday 10 am", "file": "hours.txt", "contains": "Saturday 10 am" },
    { "label": "It also keeps Tunde's note: closed on Sundays", "file": "hours.txt", "contains": "closed on Sundays" },
    { "label": "The merge is committed (clean)", "clean": true },
    { "label": "You tagged the release v1.0", "tag": "v1.0" }
  ],
  "hint": "Open hours.txt, remove the marker lines, keep both lines, save, git add hours.txt, git commit -m \"Merge opening-hours\", then git tag v1.0.",
  "height": 320
}
=== prompt
Merging `opening-hours` into `main` conflicted with Tunde's change in `hours.txt`. Resolve it by **keeping both**: Saturday 10 am to 6 pm, and the note that the restaurant is closed on Sundays. Finish the merge, and tag the release `v1.0`.
=== file hours.txt
Weekdays 8 am - 8 pm
=== setup
git init
git add .
git commit -m "Add hours"
git switch -c opening-hours
echo "Weekdays 8 am - 8 pm\nSaturday 10 am - 6 pm" > hours.txt
git commit -am "Add Saturday opening hours"
git switch main
echo "Weekdays 8 am - 8 pm\nSunday: closed on Sundays" > hours.txt
git commit -am "Note that we are closed on Sundays"
git merge opening-hours
=== sample
git status
echo "Weekdays 8 am - 8 pm\nSaturday 10 am - 6 pm\nSunday: closed on Sundays" > hours.txt
git add hours.txt
git commit -m "Merge opening-hours"
git tag v1.0
=== note
Good teams resolve conflicts by **talking**. A conflict is a signal that two people are working on the same thing, so a quick message saves time and mistakes.
```

```answer
{
  "id": "git-m12-a1",
  "prompt": "You are mid-task with uncommitted changes and an urgent fix comes in. Which command puts your half-done work safely aside so you can switch branches? Type the full command.",
  "answer": "git stash",
  "format": "text",
  "accept": ["git stash push"],
  "explanation": "git stash saves your uncommitted changes in a drawer and gives you a clean folder. git stash pop brings them back.",
  "required": true
}
```
