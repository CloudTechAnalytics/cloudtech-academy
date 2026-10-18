begin;
-- Course: Git & GitHub: From First Commit to Pull Request
insert into public.courses (id, format, completion_badge, slug, code, title, summary, description, category_id, difficulty, level, level_label, estimated_hours, is_free, status, published, skills, prerequisites, project_title, certificate_enabled, require_all_lessons, require_exercises, require_project, require_module_badges, passing_score, position)
values ('git-and-github-for-beginners', 'short', 'Git & GitHub', 'git-and-github-for-beginners', 'GIT', 'Git & GitHub: From First Commit to Pull Request', 'Learn Git the way professionals use it: commits, branches, merging, conflicts, undoing mistakes, GitHub, pull requests and automation, practising real commands in a terminal built into the lesson, and finish with a portfolio employers can check.', 'Version control is a skill every developer, data analyst and web professional is expected to have. This course teaches Git properly, with no experience needed. Twelve lessons take you from what Git is and how it thinks (the working folder, the staging area and the repository) through the everyday loop of status, add, commit and log; diffs, good commit messages and .gitignore; undoing mistakes with restore, amend, reset, revert and stash; branches, merging and resolving conflicts; connecting to GitHub with push, pull and clone; pull requests and code review; issues, project files and keeping secrets safe; GitHub Pages and GitHub Actions; and turning your profile into a portfolio. In every lesson you type real Git commands in a practice terminal inside the page, edit files beside it, and your repository is checked when you finish. You also practise a full day on a team: an urgent bug, a conflict with a teammate and a tagged release. Each module has a check and a badge.', 'coding', 'beginner', 1, 'Beginner to intermediate', 6, true, 'available', true, array['The Git workflow: add, commit, log and diff', 'Branching, merging and resolving conflicts', 'Undoing mistakes safely', 'GitHub: push, pull, clone and pull requests', 'Keeping secrets out of repositories', 'GitHub Pages and Actions', 'A GitHub profile that works as a portfolio']::text[], array['No experience needed', 'A free GitHub account', 'A computer where you can install Git (optional: the practice terminal runs in the lesson)']::text[], 'A professional GitHub repository with a real workflow', true, false, false, false, true, 60, 6)
on conflict (id) do update set format = excluded.format, completion_badge = excluded.completion_badge, slug = excluded.slug, code = excluded.code, title = excluded.title, summary = excluded.summary, description = excluded.description, category_id = excluded.category_id, difficulty = excluded.difficulty, level = excluded.level, level_label = excluded.level_label, estimated_hours = excluded.estimated_hours, is_free = excluded.is_free, status = excluded.status, published = excluded.published, skills = excluded.skills, prerequisites = excluded.prerequisites, project_title = excluded.project_title, certificate_enabled = excluded.certificate_enabled, require_all_lessons = excluded.require_all_lessons, require_exercises = excluded.require_exercises, require_project = excluded.require_project, require_module_badges = excluded.require_module_badges, passing_score = excluded.passing_score, position = excluded.position;

update public.courses set access_type = 'free', price = null, currency = 'NGN', discount_price = null, discount_active = false, payment_status = 'active', delivery_type = 'self_paced', enrollment_status = 'open', enrollment_start = null, enrollment_end = null, community_access = false, instructor_support = false, duration_label = null, overview = null, audience = '{}'::text[], included = '{}'::text[], project_previews = '[]'::jsonb, instructor_name = null, instructor_title = null, instructor_bio = null, professional_outcome = null, commerce_seeded = true, course_type = 'free', outcomes = '{}'::text[], difficulty_max = null, duration_weeks = null, thumbnail = null, faqs = '[]'::jsonb, discount_label = null, discount_start = null, discount_end = null where id = 'git-and-github-for-beginners' and not commerce_seeded;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('git-m01', 'git-and-github-for-beginners', 'What Git and GitHub Are, and Getting Set Up', 1, 'Git Basics', 'GITBASIC', array['Explain version control and how Git thinks', 'Tell Git and GitHub apart', 'Use the key words: repo, commit, push, pull', 'Set up Git and a secure GitHub account']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('git-and-github-for-beginners:what-git-and-github-are', 'git-and-github-for-beginners', 'git-m01', 'what-git-and-github-are', 'What Git and GitHub Are, and Getting Set Up', 'Understand version control and how Git thinks, tell Git and GitHub apart, meet the terminal, set up Git and a professional GitHub account, and run your first Git commands in a practice terminal built into the page.', 30, $md$
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
$md$, true, true, 1, array['git-m01-a1', 'git-m01-a2', 'git-m01-t2', 'git-m01-t1']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('git-m02', 'git-and-github-for-beginners', 'Your First Repository', 2, 'First Repository', 'FIRSTREP', array['Create a repository with git init', 'Use status, add and commit', 'Read the history with git log', 'Write clear commit messages']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('git-and-github-for-beginners:your-first-repository', 'git-and-github-for-beginners', 'git-m02', 'your-first-repository', 'Your First Repository: init, add and commit', 'Turn a folder into a Git repository, then use the core loop every developer repeats all day: edit, check the status, stage, commit and read the history. Practise each command in the terminal built into the page.', 30, $md$
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
$md$, true, true, 2, array['git-m02-a1', 'git-m02-a2', 'git-m02-t1', 'git-m02-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('git-m03', 'git-and-github-for-beginners', 'Staging, Diffs, History and .gitignore', 3, 'Clean Commits', 'CLEANCMT', array['Compare changes with git diff', 'Commit one idea at a time', 'Explore history with log and show', 'Keep secrets and junk out with .gitignore']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('git-and-github-for-beginners:staging-history-gitignore', 'git-and-github-for-beginners', 'git-m03', 'staging-history-gitignore', 'Staging, Diffs, History and .gitignore', 'Go beyond the basics. Compare changes with git diff, commit in clean logical pieces, write messages teams will thank you for, explore history with log and show, and keep secrets and junk out of your repository with .gitignore.', 30, $md$
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
$md$, true, true, 3, array['git-m03-a1', 'git-m03-a2', 'git-m03-t1', 'git-m03-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('git-m04', 'git-and-github-for-beginners', 'Undoing Mistakes Safely', 4, 'Git Undo', 'GITUNDO', array['Restore files and unstage changes', 'Amend and reset your own commits', 'Revert shared commits safely', 'Park work with git stash']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('git-and-github-for-beginners:undoing-mistakes', 'git-and-github-for-beginners', 'git-m04', 'undoing-mistakes', 'Undoing Mistakes Safely: restore, amend, reset, revert and stash', 'Everyone makes mistakes, and Git is built so you can fix them. Learn which command undoes which mistake, from a bad edit to a bad commit, and which ones are safe on shared work.', 25, $md$
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
$md$, true, true, 4, array['git-m04-a1', 'git-m04-t1', 'git-m04-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('git-m05', 'git-and-github-for-beginners', 'Branches', 5, 'Git Branching', 'BRANCHES', array['Understand what a branch is', 'Create, switch, merge and delete branches', 'Name branches well', 'Keep main always working']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('git-and-github-for-beginners:branches', 'git-and-github-for-beginners', 'git-m05', 'branches', 'Branches: Work Without Fear', 'Learn the idea that makes Git powerful, the branch. Create a separate line of work, switch between branches, merge finished work back, and tidy up, with a workflow every team uses.', 30, $md$
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
$md$, true, true, 5, array['git-m05-a1', 'git-m05-t1', 'git-m05-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('git-m06', 'git-and-github-for-beginners', 'Merge Conflicts', 6, 'Conflict Resolver', 'CONFLICT', array['Explain why conflicts happen', 'Read conflict markers', 'Resolve a conflict and finish the merge', 'Abort a merge and avoid conflicts']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('git-and-github-for-beginners:merge-conflicts', 'git-and-github-for-beginners', 'git-m06', 'merge-conflicts', 'Merge Conflicts: Don''t Panic', 'Merge conflicts scare every beginner and are routine for every professional. Learn why they happen, how to read the markers Git writes, how to resolve one step by step, how to abort, and how teams avoid most of them.', 25, $md$
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
$md$, true, true, 6, array['git-m06-a1', 'git-m06-t1', 'git-m06-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('git-m07', 'git-and-github-for-beginners', 'GitHub and Remotes', 7, 'GitHub Remotes', 'REMOTES', array['Connect a local repository to GitHub', 'Push, pull, fetch and clone', 'Sign in safely with tokens or SSH', 'Fork a repository']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('git-and-github-for-beginners:github-remotes', 'git-and-github-for-beginners', 'git-m07', 'github-remotes', 'GitHub and Remotes: Push, Pull and Clone', 'Connect the repository on your computer to GitHub. Learn what a remote is, how to sign in safely, and the everyday rhythm of clone, pull, commit and push, with the commands practised in the terminal and the real thing on GitHub.', 45, $md$
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
$md$, true, true, 7, array['git-m07-a1', 'git-m07-t3', 'git-m07-t1', 'git-m07-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('git-m08', 'git-and-github-for-beginners', 'Pull Requests and Code Review', 8, 'Pull Requests', 'PULLREQ', array['Follow the branch, push and pull request workflow', 'Write a clear pull request description', 'Review code kindly and respond to reviews', 'Choose a merge strategy']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('git-and-github-for-beginners:pull-requests', 'git-and-github-for-beginners', 'git-m08', 'pull-requests', 'Pull Requests and Code Review', 'Learn the workflow almost every software team uses. Work on a branch, push it, open a pull request, get a review, and merge. Practise the branch-and-push part in the terminal, and write a pull request description a reviewer will thank you for.', 30, $md$
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
$md$, true, true, 8, array['git-m08-a1', 'git-m08-t2', 'git-m08-t1']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('git-m09', 'git-and-github-for-beginners', 'Teamwork and Keeping Secrets Safe', 9, 'Safe Collaboration', 'GITSAFE', array['Write useful issues and bug reports', 'Add README, licence and contributing files', 'Protect branches and manage access', 'Handle a leaked secret correctly']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('git-and-github-for-beginners:collaboration-security', 'git-and-github-for-beginners', 'git-m09', 'collaboration-security', 'Working With a Team: Issues, Project Files and Keeping Secrets Safe', 'Use the rest of GitHub like a professional. Track work with issues, give a repository the files that make it look and feel professional, manage who can do what, and keep passwords and keys out of your history, including what to do when one gets in.', 25, $md$
## Repositories are also workplaces

GitHub is more than storage. Teams use it to plan work, discuss it, review it and release it. This lesson covers the tools around the code that make a repository **professional**.

## Issues: tracking work and bugs

An **issue** is a page for one task, bug, question or idea. Every project, from a student's notebook to a company's product, uses them.

A good issue has:

- A **clear title**: "Contact form accepts an empty email", not "Bug".
- **What happened** and **what you expected**.
- **Steps to reproduce**, so someone else can see the problem themselves.
- **Context**: browser, device, screenshots, error messages.

You can organise issues with **labels** (`bug`, `enhancement`, `good first issue`, `documentation`), **assignees** (who is working on it) and **milestones** (a group of issues for one release). Each issue has a number, such as `#12`. In a commit message or pull request, `Fixes #12` links the work to the issue and closes it when merged, as you saw in the last lesson.

**GitHub Projects** adds a board of cards in columns (To do, In progress, Done), a simple way to see who is doing what.

## The files that make a repository professional

Open any well-run project, and you find the same few files near the top. Adding them takes minutes and makes the repository look cared for.

| File | What it is for |
| :-- | :-- |
| **`README.md`** | The front page. What the project is, how to use it, how to run it |
| **`LICENSE`** | Says what others may do with your code. Without one, nobody is legally allowed to reuse it. **MIT** is a popular, permissive choice |
| **`.gitignore`** | Files to leave out (lesson 3) |
| **`CONTRIBUTING.md`** | How to help: how to report bugs, how to submit a pull request |
| **`CODE_OF_CONDUCT.md`** | How people are expected to behave |
| **`.github/`** folder | Templates for issues and pull requests, and automations (lesson 10) |

GitHub helps: when you create a repository, you can tick **Add a README**, choose a **.gitignore** template for your language, and pick a **licence**.

### A README a newcomer can use

A great README answers, in order: *What is this? Why should I care? How do I run it? How can I help?*

```markdown
# Kitchen Orders

A small web page where customers choose a meal and send an order on WhatsApp.

## Features
- Menu with prices in naira
- One-tap order message

## Run it
1. Download the project
2. Open `index.html` in your browser

## Contributing
Found a bug? Open an issue. Pull requests are welcome.

## Licence
MIT
```

## Who can do what

For a repository on your account, you decide who may change it. Under **Settings, then Collaborators**, you can invite teammates. For organisations, there are roles: **Read** (view and comment), **Triage**, **Write** (push branches), **Maintain** and **Admin**. Give people the **least access** they need.

You can also protect `main` with **branch protection rules**: require a pull request, require approvals, require checks to pass, and block force pushes. This makes it impossible to push untested work straight to `main`, even by accident.

## Keeping secrets out of Git

This is the most important security lesson in this course. **A secret committed to Git is a secret you should consider leaked**, even in a private repository, even if you delete the file later.

Secrets include passwords, API keys, tokens, database connection strings, private keys and `.env` files. Why it is so dangerous:

- Git **remembers everything.** Deleting the file in a new commit leaves it in the history, which anyone with access (or anyone, if public) can read.
- **Bots scan GitHub constantly** for keys. A leaked cloud key can be found and abused within minutes, and the bill lands on you.

### Prevention

1. **Never** write a secret directly into code. Keep them in a `.env` file (or environment variables) and **ignore** it in `.gitignore` from the very first commit.
2. Share an **example** file, `.env.example`, with fake values, so teammates know what to fill in.
3. Check `git status` and `git diff --staged` before every commit. Make it a habit.

### If a secret was committed: the steps, in order

1. **Revoke or rotate the secret immediately.** Go to the service (GitHub, your cloud provider, your payment provider) and delete that key or password and create a new one. This is the step that actually protects you. **Do it first.**
2. **Stop tracking the file**, so it stops appearing in future commits:

```bash
git rm --cached .env          # remove it from Git, but keep the file on your computer
echo ".env" >> .gitignore     # make sure it is ignored from now on
git add .gitignore
git commit -m "Stop tracking .env"
```

3. **Understand that the old key is still in the history.** If the repository is public, or others have cloned it, assume the key is known, and rely on step 1. Specialist tools such as `git filter-repo` can rewrite history to remove a file, but that is advanced, and it never replaces rotating the key.

Try step 2 in the task below.

## Keeping your account safe

- Turn on **two-factor authentication** (you did this in lesson 1).
- Use **tokens or SSH keys**, never your password, and give tokens the smallest permissions and a short expiry.
- GitHub has **secret scanning** and **Dependabot alerts** (warnings about outdated, vulnerable libraries). Turn them on for your repositories, in **Settings, then Code security**.

## Try it

First, fix a classic mistake: a secret file was committed. Stop tracking it safely.

```gittask
{
  "id": "git-m09-t1",
  "minutes": 8,
  "required": true,
  "rules": [
    { "label": "You removed .env from Git with git rm --cached (so the file stays on your computer)", "ran": "^git rm --cached \\.env" },
    { "label": ".env is no longer tracked in the latest commit", "notTracked": ".env" },
    { "label": ".env still exists in your folder", "file": ".env" },
    { "label": "A .gitignore that lists .env is committed", "tracked": ".gitignore" },
    { "label": ".gitignore contains .env", "file": ".gitignore", "contains": "^\\.env" },
    { "label": "Everything is committed (clean)", "clean": true },
    { "label": "There are at least two commits", "commits": 2 }
  ],
  "hint": "git rm --cached .env, then echo \".env\" > .gitignore, git add .gitignore, and git commit -m \"Stop tracking .env\". Do not use plain git rm, which would delete the file from your folder.",
  "height": 300
}
=== prompt
Someone committed `.env` by mistake (it holds a secret key). In real life you would **first rotate the key**. Then make Git stop tracking `.env` **without deleting the file**, add it to `.gitignore`, and commit the fix.
=== file app.py
print("Running")
=== file .env
API_KEY=super-secret-key
=== setup
git init
git add .
git commit -m "Add app and settings"
=== sample
git rm --cached .env
echo ".env" > .gitignore
git add .gitignore
git commit -m "Stop tracking .env"
git status
=== note
This stops the leak from growing, but the old key is still in the earlier commit. That is why rotating the key comes first.
```

Now write a bug report as a good issue. The goal is that a developer could reproduce the problem without asking you a single question.

```task
{
  "id": "git-m09-t2",
  "prompt": "Write a **GitHub issue** for a bug in an app you know (or invent one: for example, a cart that shows the wrong total). Put the title on the first line, then the sections **## What happened**, **## What I expected**, **## Steps to reproduce** (at least three numbered steps) and **## Environment** (device, browser or version).",
  "minutes": 10,
  "rows": 14,
  "placeholder": "Cart total shows zero when a discount code is applied\n\n## What happened\n...\n\n## What I expected\n...\n\n## Steps to reproduce\n1. ...\n2. ...\n3. ...\n\n## Environment\n...",
  "rules": [
    { "label": "A specific title on the first line (at least 5 words)", "pattern": "(?<![\\s\\S])\\s*[^#\\n]+( [^\\n ]+){3,}" },
    { "label": "A ## What happened section", "pattern": "^##\\s+what happened" },
    { "label": "A ## What I expected section", "pattern": "^##\\s+what i expected" },
    { "label": "A ## Steps to reproduce section with at least three numbered steps", "pattern": "^\\s*\\d+\\.\\s+\\S", "min": 3 },
    { "label": "The steps heading is present", "pattern": "^##\\s+steps to reproduce" },
    { "label": "An ## Environment section", "pattern": "^##\\s+environment" }
  ],
  "sample": "Cart total shows zero when a discount code is applied\n\n## What happened\nAfter I enter the code WELCOME10, the cart total changes to ₦0 instead of showing 10% off.\n\n## What I expected\nThe total should drop by 10%: ₦18,000 should become ₦16,200.\n\n## Steps to reproduce\n1. Add the Ankara tote bag (₦18,000) to the cart.\n2. Open the cart.\n3. Type WELCOME10 in the discount box and press Apply.\n\n## Environment\nAndroid 14, Chrome 126, mobile data.",
  "required": true
}
```

```answer
{
  "id": "git-m09-a1",
  "prompt": "You pushed an API key to a public repository by mistake. What is the **very first** thing you should do: **rotate the key** or **delete the file**? Type one.",
  "answer": "rotate the key",
  "format": "text",
  "accept": ["rotate", "revoke the key", "rotate it", "revoke", "rotate and revoke the key", "rotate/revoke the key"],
  "explanation": "The key is already in the history and may already have been copied. Only revoking it and creating a new one actually protects you. Deleting the file does not remove it from history.",
  "required": true
}
```
$md$, true, true, 9, array['git-m09-a1', 'git-m09-t2', 'git-m09-t1']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('git-m10', 'git-and-github-for-beginners', 'GitHub Pages and Actions', 10, 'Pages and Actions', 'ACTIONS', array['Publish a site with GitHub Pages', 'Read and write a GitHub Actions workflow', 'Understand CI and CD', 'Keep secrets in Actions safely']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('git-and-github-for-beginners:github-pages-actions', 'git-and-github-for-beginners', 'git-m10', 'github-pages-actions', 'GitHub Pages and GitHub Actions: Publish and Automate', 'Publish a website straight from a repository with GitHub Pages, and meet GitHub Actions, the automation that runs checks and deployments every time you push. Write and read a real workflow file.', 25, $md$
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
$md$, true, true, 10, array['git-m10-a1', 'git-m10-t2', 'git-m10-t1']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('git-m11', 'git-and-github-for-beginners', 'Show Your Projects on GitHub', 11, 'GitHub Portfolio', 'GITHUB', array['Work from VS Code, Desktop or the command line', 'Write a README that sells a project', 'Pin repositories and write a profile README', 'Present your work to recruiters']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('git-and-github-for-beginners:show-projects-on-github', 'git-and-github-for-beginners', 'git-m11', 'show-projects-on-github', 'Show Your Projects on GitHub: README, Profile and Portfolio', 'Turn your GitHub account into a portfolio employers can check. Write a README that sells a project, set up your profile README and pinned repositories, keep your repositories tidy, and link them from your CV and LinkedIn.', 35, $md$
## Your GitHub is a portfolio

Recruiters and hiring managers for data, software and web roles open your GitHub profile. In a few seconds they decide: **does this person build real things, and can they explain them?** You cannot control the first look, but you can design it.

A strong profile has: a clear bio, a handful of **pinned** projects that are worth showing, a README on each that explains the work, and a history of steady commits. This lesson shows you how.

## Work from your computer: three ways

Browser uploads are fine for tiny things. For real projects you will use one of these, and they all do the same thing underneath:

| Way | Good for | How you commit |
| :-- | :-- | :-- |
| **Command line** (Git Bash or Terminal) | What you have practised in this course | `git add`, `git commit`, `git push` |
| **VS Code** (built-in Git panel) | Editing and committing in one place | Source Control icon, type a message, click the tick, then Sync |
| **GitHub Desktop** (desktop.github.com) | A friendly, visual start | Type a summary, click **Commit to main**, then **Push origin** |

Whichever you choose, the habits are the same: small commits, clear messages, and a push when you finish. Use **Fetch** and **Pull** to bring in changes made elsewhere.

## Write a README that sells the project

The README is the first thing people read. It should let a visitor understand the project in thirty seconds. This structure works for most student and junior projects:

```markdown
# Sales Analysis: Kolanut Drinks

Analysis of 4,000 orders to find which regions and products drive revenue.

## What I did
- Cleaned the data in Python (pandas)
- Calculated revenue by region, category and month
- Built charts to show the trends

## Key findings
- Lagos brings in about half of all revenue
- Household products are the top category

## Tools
Python, pandas, Google Colab

## See it
Open `analysis.ipynb` or view the charts in `/images`.
```

Tips that separate a good README from a forgettable one:

- **Lead with the point.** One sentence on what it is and why it matters.
- **Show results with numbers** ("revenue fell 47%"), not only activity ("I did analysis").
- **Add a picture.** A screenshot or chart makes a README far more engaging. Save it in an `images` folder in the repository, and show it with Markdown's image line, which starts with an exclamation mark, then the description in square brackets, then the file path in round brackets.
- **Say how to run or view it**, so a visitor can try it.
- **Be honest** about what you built yourself and what you followed from a tutorial.

## Make your profile a portfolio

- **Pin your best repositories.** On your profile, click **Customize your pins** and choose up to six. Put the strongest first.
- **Profile README.** Create a **public repository named exactly your username**, with a `README.md`. Its content appears at the top of your profile. Say who you are, what you are learning, your best projects and how to reach you.
- **Describe every repository.** Add a one-line description and **topics** (tags such as `python`, `data-analysis`) in the repository's About box.
- **Keep it tidy.** Make unfinished experiments private, or archive them. Give every public repository a README.
- **Add a licence** to projects you want others to reuse (MIT is a common choice).

A profile README can be as simple as:

```markdown
# Hi, I'm Ada 👋
Economics student at UNN, learning Python, SQL and data analysis.

## Projects
- [Sales analysis](https://github.com/ada/sales-analysis): which regions drive revenue
- [Recipe site](https://github.com/ada/recipe-site): a small website, built with HTML and CSS

## Reach me
LinkedIn: linkedin.com/in/ada-okafor
```

## Commit history and the green squares

Your profile shows a grid of green squares for your commits. Do not obsess over it, and **never fake it**: recruiters read the commits, and a wall of empty "update" commits looks worse than a quiet graph. Steady, real work, with clear messages, speaks for itself.

## Share it

- Put your **profile link** on your CV and LinkedIn. Link to the **specific repository** next to each project you describe.
- In a job application, point to the one or two projects most relevant to the role.
- Make sure the pinned projects work: click your own links from a private window to see what a visitor sees.

## Try it

Write the README for a real project of yours.

```task
{
  "id": "git-m11-t1",
  "prompt": "Write the **README** for a real project of yours (a class project, notebook, website or spreadsheet), in Markdown, using the structure from the lesson: a `#` title, a one-line description, then `##` sections for **What I did**, **Key findings** (or **Results**), **Tools** and **See it**.",
  "minutes": 12,
  "rows": 14,
  "placeholder": "# Project title\nOne line on what it is.\n\n## What I did\n- ...\n\n## Key findings\n- ...\n\n## Tools\n...\n\n## See it\n...",
  "rules": [
    { "label": "A # title on the first line", "pattern": "(?<![\\s\\S])\\s*#\\s+\\S" },
    { "label": "A ## What I did section", "pattern": "^##\\s+what i did" },
    { "label": "A ## Key findings or ## Results section", "pattern": "^##\\s+(key findings|findings|results?)" },
    { "label": "A ## Tools section", "pattern": "^##\\s+tools" },
    { "label": "A ## See it section", "pattern": "^##\\s+(see it|how to (run|view|see)|demo|links?)" },
    { "label": "At least three bullet points", "pattern": "^\\s*[-*]\\s+\\S", "min": 3 },
    { "label": "A finding or result with a number", "pattern": "^\\s*[-*][^\\n]*\\d" }
  ],
  "sample": "# Sales Analysis: Kolanut Drinks\nAnalysis of 4,266 orders to find which regions and products drive revenue.\n\n## What I did\n- Cleaned the data in Python (pandas)\n- Calculated revenue by region, category and month\n- Built charts to show the trends\n\n## Key findings\n- Lagos brings in about half of all revenue\n- North West revenue fell 47% from H1 2025 to H1 2026\n\n## Tools\nPython, pandas, matplotlib, Google Colab\n\n## See it\nOpen `analysis.ipynb`, or view the charts in `/images`.",
  "required": true
}
```

Now publish it, and make your profile work as a portfolio.

```task
{
  "id": "git-m11-t2",
  "prompt": "Publish the project to GitHub (with the command line, VS Code or GitHub Desktop), add your README, **pin** the repository on your profile and create your **profile README**. Paste the **project repository link** on the first line and your **profile link** on the second.",
  "minutes": 15,
  "rows": 3,
  "placeholder": "https://github.com/your-username/your-project\nhttps://github.com/your-username",
  "rules": [
    { "label": "A link to a project repository", "pattern": "https?://(www\\.)?github\\.com/[A-Za-z0-9-]+/[A-Za-z0-9._-]+" },
    { "label": "Your profile link on its own line", "pattern": "^\\s*https?://(www\\.)?github\\.com/[A-Za-z0-9-]+/?\\s*$" }
  ],
  "sample": "https://github.com/adaeze-okafor/kolanut-sales-analysis\nhttps://github.com/adaeze-okafor",
  "required": true
}
```

```answer
{
  "id": "git-m11-a1",
  "prompt": "Your GitHub username is `tolu-adeyemi`. What must you name the repository whose README appears at the top of your profile?",
  "answer": "tolu-adeyemi",
  "format": "text",
  "accept": ["tolu-adeyemi/tolu-adeyemi"],
  "explanation": "A public repository with exactly your username as its name becomes your profile README.",
  "required": true
}
```

Finally, add your GitHub profile link to your CV and your LinkedIn profile.
$md$, true, true, 11, array['git-m11-a1', 'git-m11-t1', 'git-m11-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;

insert into public.course_modules (id, course_id, title, position, badge_name, badge_code, skills, topics)
values ('git-m12', 'git-and-github-for-beginners', 'A Day on a Team', 12, 'Git Workflow', 'GITFLOW', array['Handle an urgent bug with stash and a fix branch', 'Resolve a conflict with a teammate''s change', 'Tag a release', 'Follow a professional Git checklist']::text[], '{}'::text[])
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, position = excluded.position, badge_name = excluded.badge_name, badge_code = excluded.badge_code, skills = excluded.skills, topics = excluded.topics;

insert into public.lessons (id, course_id, module_id, slug, title, summary, minutes, body_md, required, published, position, required_exercises)
values ('git-and-github-for-beginners:team-workflow-capstone', 'git-and-github-for-beginners', 'git-m12', 'team-workflow-capstone', 'A Day on a Team: Putting It All Together', 'Practise the real workflow end to end. Handle an urgent bug while mid-task, resolve a conflict with a teammate''s change, tag a release, and build the habits and checklists that make a Git user professional.', 30, $md$
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
$md$, true, true, 12, array['git-m12-a1', 'git-m12-t1', 'git-m12-t2']::text[])
on conflict (id) do update set course_id = excluded.course_id, module_id = excluded.module_id, slug = excluded.slug, title = excluded.title, summary = excluded.summary, minutes = excluded.minutes, body_md = excluded.body_md, required = excluded.required, published = excluded.published, position = excluded.position, required_exercises = excluded.required_exercises;


-- Assessment: What Git and GitHub Are, and Getting Set Up: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('git-m01-check', 'git-and-github-for-beginners', 'module', 'git-m01', 'What Git and GitHub Are, and Getting Set Up: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m01-q1', 'git-m01-check', 1, 'Your laptop is stolen, but you pushed your project to GitHub last night. What does that show about Git and GitHub?', '["GitHub is just another name for Git","GitHub stores a copy of your Git repository online, so your work survives","Git works only online","Nothing, the work is lost"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m01-q1', 1, 'Git tracks history on your computer. GitHub keeps an online copy for backup, sharing and teamwork.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m01-q2', 'git-m01-check', 2, 'In Git''s three places, where do you choose exactly what goes into the next commit?', '["The working folder","The staging area","The remote","The README"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m01-q2', 1, 'git add puts changes in the staging area, and git commit saves what is staged.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m01-q3', 'git-m01-check', 3, 'Git refuses to commit and says: Author identity unknown. What do you do?', '["Reinstall Git","Set your name and email with git config","Create a new repository","Switch branches"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m01-q3', 1, 'git config --global user.name and user.email tell Git who made the commits.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m01-q4', 'git-m01-check', 4, 'Which is the best GitHub username for a student''s professional portfolio?', '["cooldude2005","adaeze-okafor","xXgamerXx","ada123456789"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m01-q4', 1, 'A name-based username looks professional and appears in every link you share.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m01-q5', 'git-m01-check', 5, 'What is a commit?', '["A copy of GitHub","A saved snapshot of the project with a message, an author and a link to its parent","A kind of branch","A password for GitHub"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m01-q5', 1, 'Commits are the links in the chain that make up the history.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Your First Repository: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('git-m02-check', 'git-and-github-for-beginners', 'module', 'git-m02', 'Your First Repository: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m02-q1', 'git-m02-check', 1, 'You created a new folder with two files. What does git init do?', '["Uploads the files to GitHub","Turns the folder into a Git repository by creating the hidden .git folder","Commits the files","Deletes the files"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m02-q1', 1, 'git init starts tracking. It does not commit or upload anything.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m02-q2', 'git-m02-check', 2, 'git status lists a file under "Untracked files". What does it mean?', '["The file is broken","Git can see the file but is not tracking it yet","The file was deleted","The file is already committed"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m02-q2', 1, 'You need git add before the file can be committed.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m02-q3', 'git-m02-check', 3, 'You staged one file but git commit -m made a commit that did not include the other changed file. Why?', '["Git has a bug","Only staged changes go into a commit","Commits can only hold one file","The message was too short"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m02-q3', 1, 'The staging area decides what is in the commit.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m02-q4', 'git-m02-check', 4, 'Which commit message is best?', '["update","stuff","Add revenue by region chart","final"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m02-q4', 2, 'A good message says what changed, starting with a verb.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m02-q5', 'git-m02-check', 5, 'Which command shows the history in a compact one-line-per-commit view?', '["git status","git log --oneline","git add .","git init --short"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m02-q5', 1, 'git log --oneline is the quick way to scan history.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Staging, Diffs, History and .gitignore: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('git-m03-check', 'git-and-github-for-beginners', 'module', 'git-m03', 'Staging, Diffs, History and .gitignore: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m03-q1', 'git-m03-check', 1, 'You ran git add on a file, and now git diff shows nothing. Where can you see the staged change?', '["git diff --staged","git log","git init","You cannot"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m03-q1', 0, 'git diff shows unstaged changes. --staged compares the staging area with the last commit.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m03-q2', 'git-m03-check', 2, 'You changed a typo in one file and added a new page in another. What is the best way to commit?', '["One commit with the message \"changes\"","Two commits, one for each idea, each with its own message","Wait a week and commit everything","Do not commit the typo"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m03-q2', 1, 'One commit, one idea, makes history easy to read and to undo.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m03-q3', 'git-m03-check', 3, 'Which commit message follows good practice?', '["Fixed stuff.","Fix crash when the cart is empty","BUG!!!","changed some files today"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m03-q3', 1, 'Start with a verb, be specific, and keep the first line short.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m03-q4', 'git-m03-check', 4, 'You want Git to ignore every file ending in .log. What goes in .gitignore?', '["log","*.log","/log","ignore .log"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m03-q4', 1, 'The * is a wildcard, so *.log matches debug.log, error.log and more.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m03-q5', 'git-m03-check', 5, 'Which should never be committed to a repository?', '["README.md","A .env file with an API key","A .gitignore file","Your source code"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m03-q5', 1, 'Secrets in Git stay in the history, so keep them out from the start.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Undoing Mistakes Safely: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('git-m04-check', 'git-and-github-for-beginners', 'module', 'git-m04', 'Undoing Mistakes Safely: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m04-q1', 'git-m04-check', 1, 'You edited a file badly and want the last committed version back. Which command does that?', '["git restore <file>","git revert","git stash pop","git init"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m04-q1', 0, 'git restore discards uncommitted changes to the file.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m04-q2', 'git-m04-check', 2, 'You ran git add . and staged a file with a password. What is the safe fix before committing?', '["Commit anyway","git restore --staged <file>","Delete the repository","git push"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m04-q2', 1, 'It unstages the file without deleting it.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m04-q3', 'git-m04-check', 3, 'A bad commit was already pushed, and teammates have pulled it. Which is the safe way to undo it?', '["git reset --hard","git revert <commit>","git commit --amend","Delete the branch"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m04-q3', 1, 'revert adds a new commit that undoes the old one without rewriting shared history.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m04-q4', 'git-m04-check', 4, 'Which command undoes your last commit but keeps all its changes staged, so you can recommit?', '["git reset --hard HEAD~1","git reset --soft HEAD~1","git restore .","git revert HEAD"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m04-q4', 1, '--soft moves the branch back and leaves your work staged.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m04-q5', 'git-m04-check', 5, 'You are halfway through a change when an urgent bug arrives. What lets you set your work aside and get a clean folder?', '["git stash","git reset --hard","git init","git merge"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m04-q5', 0, 'git stash saves uncommitted changes in a drawer. git stash pop brings them back.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Branches: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('git-m05-check', 'git-and-github-for-beginners', 'module', 'git-m05', 'Branches: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m05-q1', 'git-m05-check', 1, 'What is a Git branch, really?', '["A full copy of all your files","A movable label that points to a commit","A kind of remote","A backup on GitHub"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m05-q1', 1, 'That is why branches are instant and cheap.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m05-q2', 'git-m05-check', 2, 'Which single command creates a branch called fix/typo and switches to it?', '["git branch fix/typo","git switch -c fix/typo","git merge fix/typo","git new fix/typo"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m05-q2', 1, '-c means create. git checkout -b does the same in the older syntax.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m05-q3', 'git-m05-check', 3, 'You switch from your feature branch to main, and the new file you made has disappeared from your folder. What happened?', '["Git deleted it for good","It is not part of main, and it is safe on the feature branch","A bug in Git","You must run git init again"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m05-q3', 1, 'Switching branches changes your files to match the branch you move to.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m05-q4', 'git-m05-check', 4, 'You are on feature/contact. Which commands bring that work into main?', '["git switch main, then git merge feature/contact","git merge main, then git switch feature/contact","git branch -d main","git push main"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m05-q4', 0, 'Go to the branch that should receive the work, and merge the other one in.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m05-q5', 'git-m05-check', 5, 'Why is it good practice to keep main always working?', '["Because Git requires it","So you can publish or release from it at any time","Because it saves disk space","Because branches are expensive"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m05-q5', 1, 'Professional teams keep main stable and do risky work on branches.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Merge Conflicts: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('git-m06-check', 'git-and-github-for-beginners', 'module', 'git-m06', 'Merge Conflicts: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m06-q1', 'git-m06-check', 1, 'When does a merge conflict happen?', '["Whenever you merge","When both branches changed the same lines in different ways","When a branch is deleted","When the internet is down"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m06-q1', 1, 'Git merges automatically unless it cannot tell which change to keep.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m06-q2', 'git-m06-check', 2, 'In a conflicted file, the text between <<<<<<< HEAD and ======= is which version?', '["The incoming branch","The version on the branch you are on","The oldest version","A backup"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m06-q2', 1, 'HEAD is where you are. The part after ======= is the branch you are merging in.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m06-q3', 'git-m06-check', 3, 'You have edited a conflicted file to the version you want. What next?', '["git add the file, then git commit","git init","git branch -d","Delete the file"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m06-q3', 0, 'Staging marks the file as resolved, and the commit completes the merge.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m06-q4', 'git-m06-check', 4, 'You start a merge, panic, and want everything back as it was. Which command helps?', '["git merge --abort","git reset --hard origin","git clone","git stash pop"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m06-q4', 0, '--abort undoes the merge attempt cleanly.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m06-q5', 'git-m06-check', 5, 'Which habit prevents the most conflicts on a team?', '["Never talking to teammates","Pull often, keep branches short-lived and communicate","Working on one huge branch for months","Reformatting entire files in every commit"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m06-q5', 1, 'Small, frequent integration means less drift.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: GitHub and Remotes: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('git-m07-check', 'git-and-github-for-beginners', 'module', 'git-m07', 'GitHub and Remotes: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m07-q1', 'git-m07-check', 1, 'What does git push -u origin main do the first time?', '["Deletes main","Sends main to origin and remembers the link so later you can just git push","Downloads main","Creates a pull request"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m07-q1', 1, '-u sets the upstream, linking your branch with origin/main.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m07-q2', 'git-m07-check', 2, 'When you try to push for the first time, Git asks for a password and your GitHub password is rejected. What should you use?', '["The same password again, slowly","A personal access token, SSH key or a sign-in through GitHub Desktop or VS Code","Your email password","Nothing, push cannot work"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m07-q2', 1, 'GitHub does not accept account passwords for Git operations.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m07-q3', 'git-m07-check', 3, 'Your push is rejected with "fetch first". What does it mean and what do you do?', '["The remote has commits you do not have. Run git pull, then push again","Your repo is corrupt","Delete your branch","Make a new repository"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m07-q3', 0, 'Integrate the remote''s new work first, resolving any conflicts.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m07-q4', 'git-m07-check', 4, 'Which command downloads a whole repository from GitHub to your computer for the first time?', '["git pull","git push","git clone","git fetch"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m07-q4', 2, 'clone copies the repository and sets up origin for you.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m07-q5', 'git-m07-check', 5, 'You want to contribute to a project you do not own. What is your first step?', '["Push straight to the project","Fork it to your own account","Delete it","Email the owner a zip"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m07-q5', 1, 'A fork is your own copy, which you can push to and offer back through a pull request.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Pull Requests and Code Review: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('git-m08-check', 'git-and-github-for-beginners', 'module', 'git-m08', 'Pull Requests and Code Review: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m08-q1', 'git-m08-check', 1, 'What is a pull request?', '["A command that downloads code","A proposal to merge your branch into another, with a space to review and discuss it","A way to delete branches","A type of commit"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m08-q1', 1, 'A pull request is a conversation and a quality gate before merging.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m08-q2', 'git-m08-check', 2, 'Which pull request title is best?', '["Update","Fix typo in the jollof rice name","My changes","Please merge"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m08-q2', 1, 'A specific title tells reviewers what to expect.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m08-q3', 'git-m08-check', 3, 'A reviewer asks you to change a line. What do you do?', '["Open a new pull request","Commit the change to the same branch and push; the pull request updates","Delete the pull request","Ignore it"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m08-q3', 1, 'The pull request follows the branch.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m08-q4', 'git-m08-check', 4, 'Your pull request description says Fixes #12. What happens when it is merged?', '["Nothing","Issue number 12 is closed automatically","A new branch #12 is made","The pull request is deleted"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m08-q4', 1, 'Keywords like Fixes link the work to the issue.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m08-q5', 'git-m08-check', 5, 'Which merge option combines all the pull request''s commits into one commit on main?', '["Create a merge commit","Squash and merge","Rebase and merge","Delete the branch"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m08-q5', 1, 'Squash gives main one tidy commit per pull request.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Teamwork and Keeping Secrets Safe: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('git-m09-check', 'git-and-github-for-beginners', 'module', 'git-m09', 'Teamwork and Keeping Secrets Safe: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m09-q1', 'git-m09-check', 1, 'Which file tells others what they may legally do with your code?', '["README.md",".gitignore","LICENSE","CONTRIBUTING.md"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m09-q1', 2, 'Without a licence, nobody is allowed to reuse your code.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m09-q2', 'git-m09-check', 2, 'You committed an API key and pushed it to a public repository. What is the first thing to do?', '["Delete the file and carry on","Revoke or rotate the key immediately","Make the repository private and forget it","Tell nobody"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m09-q2', 1, 'The key is in the history and may be copied already. Only rotating it protects you.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m09-q3', 'git-m09-check', 3, 'Which command stops Git tracking .env but keeps the file on your computer?', '["git rm .env","git rm --cached .env","git delete .env","git restore .env"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m09-q3', 1, '--cached removes it from the index only.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m09-q4', 'git-m09-check', 4, 'Which makes the best bug report?', '["It does not work","A title, what happened, what you expected, numbered steps to reproduce and your environment","A screenshot with no text","A long complaint"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m09-q4', 1, 'Someone else must be able to reproduce the problem.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m09-q5', 'git-m09-check', 5, 'What does branch protection on main let a team require?', '["Nothing","Pull requests, approvals and passing checks before merging","That everyone commits at night","A larger repository"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m09-q5', 1, 'It makes it impossible to push untested work straight to main.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: GitHub Pages and Actions: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('git-m10-check', 'git-and-github-for-beginners', 'module', 'git-m10', 'GitHub Pages and Actions: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m10-q1', 'git-m10-check', 1, 'Where do GitHub Actions workflow files live?', '[".github/workflows","workflows/ in the root","src/actions","docs/ci"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m10-q1', 0, 'Anywhere else, GitHub does not run them.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m10-q2', 'git-m10-check', 2, 'In a workflow, what does uses: actions/checkout@v4 do?', '["Deletes the repository","Downloads your repository''s code onto the machine running the job","Checks your spelling","Publishes the site"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m10-q2', 1, 'Almost every workflow starts by checking out the code.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m10-q3', 'git-m10-check', 3, 'A workflow needs a deployment password. Where should it be kept?', '["Written in the YAML file","In the repository''s Actions secrets","In the README","In a commit message"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m10-q3', 1, 'Secrets are stored in Settings and used as ${{ secrets.NAME }}.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m10-q4', 'git-m10-check', 4, 'You publish a project site from a repository called kitchen-site on the account ada-okafor. What is the address?', '["https://github.com/kitchen-site","https://ada-okafor.github.io/kitchen-site","https://kitchen-site.com","https://ada-okafor.github.io"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m10-q4', 1, 'Project sites live under your username''s github.io address with the repository name.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m10-q5', 'git-m10-check', 5, 'YAML is fussy about which thing?', '["Colours","Indentation, which must use spaces and not tabs","File size","Capital letters in comments"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m10-q5', 1, 'Wrong indentation changes the meaning or breaks the file.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Show Your Projects on GitHub: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('git-m11-check', 'git-and-github-for-beginners', 'module', 'git-m11', 'Show Your Projects on GitHub: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m11-q1', 'git-m11-check', 1, 'Your GitHub username is tolu-adeyemi. Which repository makes a README appear at the top of your profile?', '["profile","tolu-adeyemi","readme","tolu-adeyemi.github.io"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m11-q1', 1, 'A public repository named exactly your username becomes your profile README.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m11-q2', 'git-m11-check', 2, 'Which README opening is strongest for a recruiter?', '["A blank file","One sentence on what the project is and why it matters, then what you did and the results with numbers","A copy of a tutorial","Only a title"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m11-q2', 1, 'Lead with the point and show results.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m11-q3', 'git-m11-check', 3, 'You can pin how many repositories to your profile?', '["One","Up to six","Twenty","As many as you like"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m11-q3', 1, 'Choose your best six, strongest first.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m11-q4', 'git-m11-check', 4, 'Which is a good habit for your commit history as a portfolio?', '["Make hundreds of empty commits to fill the green squares","Steady, real work with clear messages","Only commit once a year","Use the same message every time"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m11-q4', 1, 'Recruiters read commits. Honest, steady work speaks for itself.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m11-q5', 'git-m11-check', 5, 'What should you add to each public repository so visitors understand it quickly?', '["A README and a description","Nothing","Only a licence","A larger file"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m11-q5', 0, 'The README is the front page, and the description and topics help people find it.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: A Day on a Team: module check
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('git-m12-check', 'git-and-github-for-beginners', 'module', 'git-m12', 'A Day on a Team: module check', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m12-q1', 'git-m12-check', 1, 'What should you do first when you start your working day on a shared project?', '["Push everything","git switch main and git pull, then branch for your task","Delete old branches","Rewrite history"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m12-q1', 1, 'Start from the latest work, and never work directly on main.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m12-q2', 'git-m12-check', 2, 'You are mid-task with uncommitted changes and must fix an urgent bug on main. What is the cleanest sequence?', '["git stash, switch to main and fix on a branch, merge, then switch back and git stash pop","Commit half-finished work with the message wip","Copy the folder and start again","git reset --hard"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m12-q2', 0, 'Stash keeps your work safe and gives you a clean folder.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m12-q3', 'git-m12-check', 3, 'What does git tag v1.0 do?', '["Deletes version 1","Puts a permanent named label on a commit, marking a release","Creates a branch","Pushes to GitHub"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m12-q3', 1, 'Tags mark moments like releases that you may want to return to.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m12-q4', 'git-m12-check', 4, 'Before you commit, which two checks do professionals make?', '["git status and git diff --staged","git init and git clone","git reset and git push","None, they just commit"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m12-q4', 0, 'They check what is about to be saved.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-m12-q5', 'git-m12-check', 5, 'Two teammates changed the same line. What is the best way to resolve the conflict?', '["Whoever merges last wins","Talk to each other, decide what is right, edit the file, add and commit","Delete the file","Force push"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-m12-q5', 1, 'A conflict is a signal that people should talk.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Assessment: Git and GitHub: final assessment
insert into public.assessments (id, course_id, kind, module_id, title, passing_score, published)
values ('git-and-github-for-beginners-final', 'git-and-github-for-beginners', 'final', null, 'Git and GitHub: final assessment', 60, true)
on conflict (id) do update set course_id = excluded.course_id, kind = excluded.kind, module_id = excluded.module_id, title = excluded.title, passing_score = excluded.passing_score, published = excluded.published;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f01', 'git-and-github-for-beginners-final', 1, 'Which one is a tool that runs on your computer and records the history of your files?', '["Git","GitHub","Both","Neither"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f01', 0, 'Git tracks changes locally. GitHub hosts repositories online.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f02', 'git-and-github-for-beginners-final', 2, 'What are the three places Git moves changes between, in order?', '["Working folder, staging area, repository","Repository, working folder, remote","Branch, tag, commit","Clone, push, pull"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f02', 0, 'Edit, git add, git commit.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f03', 'git-and-github-for-beginners-final', 3, 'You committed, then noticed a typo in the message. The commit is not pushed. What is the neat fix?', '["git commit --amend -m \"corrected message\"","git revert HEAD","Delete the repository","git push --force"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f03', 0, 'Amend replaces your own recent, unshared commit.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f04', 'git-and-github-for-beginners-final', 4, 'Which is the safest way to undo a commit that others have already pulled?', '["git reset --hard","git revert","git commit --amend","git stash"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f04', 1, 'revert adds a new undoing commit without rewriting shared history.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f05', 'git-and-github-for-beginners-final', 5, 'Which is true about branches?', '["Creating one copies every file","A branch is a label pointing at a commit, so creating one is instant","They can only be made on GitHub","You can have only one"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f05', 1, 'Branches are cheap, so use them for every task.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f06', 'git-and-github-for-beginners-final', 6, 'A merge stops with CONFLICT in a file. What are the steps to finish?', '["Edit the file to the final text with no markers, git add it, then git commit","git push --force","git clone again","Delete the branch"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f06', 0, 'Resolve, stage, commit.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f07', 'git-and-github-for-beginners-final', 7, 'What does a .gitignore file do?', '["Stops Git tracking the files that match its patterns","Deletes files","Hides the repository from GitHub","Encrypts files"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f07', 0, 'It keeps secrets, generated files and junk out of the repository.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f08', 'git-and-github-for-beginners-final', 8, 'A password was committed to a public repository. In what order should you act?', '["Rotate the secret, stop tracking the file, then clean up","Delete the file only","Do nothing","Make a new repository and hope"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f08', 0, 'Revoking the secret is the step that protects you.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f09', 'git-and-github-for-beginners-final', 9, 'A push is rejected because the remote has new commits. What should you do?', '["git pull, resolve any conflict, then push again","git push --force","Delete your commits","Start a new repo"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f09', 0, 'Integrate the remote''s work first.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f10', 'git-and-github-for-beginners-final', 10, 'What is a fork?', '["A kind of branch","Your own copy of someone else''s repository on GitHub","A deleted repository","A tag"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f10', 1, 'You work in your fork and offer changes back with a pull request.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f11', 'git-and-github-for-beginners-final', 11, 'Which is the best pull request description?', '["Here you go","What changed, why, how to test it, and a link to the issue","Please review ASAP","Fixed it"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f11', 1, 'Reviewers need context to review well.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f12', 'git-and-github-for-beginners-final', 12, 'What does a GitHub Actions workflow do?', '["Runs commands automatically when an event like a push happens","Draws diagrams","Stores passwords in the YAML file","Replaces Git"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f12', 0, 'It runs tests, builds and deployments automatically.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f13', 'git-and-github-for-beginners-final', 13, 'Why should main always be in a working state?', '["It is a rule of the internet","It is what you publish or release, and what everyone branches from","Git needs it","It saves space"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f13', 1, 'A broken main blocks the whole team.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f14', 'git-and-github-for-beginners-final', 14, 'Which makes the most useful commit history?', '["One giant commit a week called changes","Small commits, each one idea, with clear messages","No commits until the end","Commits with only emojis"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f14', 1, 'History is documentation.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f15', 'git-and-github-for-beginners-final', 15, 'How should a student present Git work to a recruiter?', '["Pinned repositories with READMEs that explain the work and results, linked from the CV","A private repository only","Fifty empty repositories","A zip file by email"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f15', 0, 'Make it easy to see what you built and what it did.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;

insert into public.assessment_questions (id, assessment_id, position, prompt, options)
values ('git-f16', 'git-and-github-for-beginners-final', 16, 'Which command should you run before and after almost everything, to see what is going on?', '["git status","git init","git rm","git gc"]'::jsonb)
on conflict (id) do update set assessment_id = excluded.assessment_id, position = excluded.position, prompt = excluded.prompt, options = excluded.options;

insert into public.assessment_answer_keys (question_id, correct_index, explanation)
values ('git-f16', 0, 'git status keeps you oriented.')
on conflict (question_id) do update set correct_index = excluded.correct_index, explanation = excluded.explanation;


-- Project: A professional GitHub repository with a real workflow
insert into public.projects (id, course_id, title, summary, brief_md, tasks, datasets, rubric, required)
values ('git-portfolio-repository', 'git-and-github-for-beginners', 'A professional GitHub repository with a real workflow', 'Publish a real project on GitHub with a clear README, a clean commit history, a branch and a pull request, and a profile that works as a portfolio.', $md$Choose a real project of yours: a data analysis, a small website, a spreadsheet model or a program. Put it on GitHub the way a professional would.

Create the repository on your computer with `git init` (or clone one you made on GitHub). Write the README, a `.gitignore` and, if you like, a licence. Make **at least six commits**, each one a single idea with a clear message. Then do your next change **on a branch** (for example `feature/add-charts`), push the branch, open a **pull request** with a proper description, and merge it. Keep secrets out of the repository.

Submit the link to your repository and the link to the merged pull request, and paste a short note saying what the project is and which Git skills you used (branches, a conflict you resolved, a revert and so on). Use only real work: do not invent contributions or commit history.$md$, array['A public repository for a real project, with a description and topics.', 'A README with a title, a one-line summary, what you did, key findings or features, tools and how to see it.', 'A .gitignore that is committed before any secrets or junk, and no secrets in the history.', 'At least six commits, each with a single idea and a clear message starting with a verb.', 'A feature branch pushed to GitHub, and a pull request with a title, what, why and how to test sections.', 'The pull request merged into main (squash or merge commit), and the branch deleted.', 'A pinned repository and a profile README that links to the project.', 'A short reflection: one problem you hit with Git, and how you solved it.']::text[], '{}'::text[], array['The repository is public, easy to understand in thirty seconds, and the README is clear and honest.', 'The commit history is clean: small commits, clear messages, and no secrets or junk files.', 'A feature branch and a merged pull request show the real workflow, with a good pull request description.', 'The .gitignore is sensible and was set up properly.', 'The profile presents the project well: pinned repository, profile README and working links.', 'The reflection shows real understanding of at least one Git problem and its solution.']::text[], true)
on conflict (id) do update set course_id = excluded.course_id, title = excluded.title, summary = excluded.summary, brief_md = excluded.brief_md, tasks = excluded.tasks, datasets = excluded.datasets, rubric = excluded.rubric, required = excluded.required;


commit;
