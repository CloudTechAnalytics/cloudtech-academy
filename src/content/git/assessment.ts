import type { AssessmentDef } from "../types";

const C = "git-and-github-for-beginners";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });
const check = (n: string, title: string, questions: Q[]): AssessmentDef => ({
  id: `git-${n}-check`,
  courseId: C,
  kind: "module",
  moduleId: `git-${n}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/**
 * Git and GitHub: a check for each module (it awards the module badge, and unlocks only after the module's
 * tasks are done) and a final assessment. Questions are scenarios with plausible wrong answers.
 */
export const GIT_ASSESSMENTS: AssessmentDef[] = [
  check("m01", "What Git and GitHub Are, and Getting Set Up", [
    q("git-m01-q1", "Your laptop is stolen, but you pushed your project to GitHub last night. What does that show about Git and GitHub?", ["GitHub is just another name for Git", "GitHub stores a copy of your Git repository online, so your work survives", "Git works only online", "Nothing, the work is lost"], 1, "Git tracks history on your computer. GitHub keeps an online copy for backup, sharing and teamwork."),
    q("git-m01-q2", "In Git's three places, where do you choose exactly what goes into the next commit?", ["The working folder", "The staging area", "The remote", "The README"], 1, "git add puts changes in the staging area, and git commit saves what is staged."),
    q("git-m01-q3", "Git refuses to commit and says: Author identity unknown. What do you do?", ["Reinstall Git", "Set your name and email with git config", "Create a new repository", "Switch branches"], 1, "git config --global user.name and user.email tell Git who made the commits."),
    q("git-m01-q4", "Which is the best GitHub username for a student's professional portfolio?", ["cooldude2005", "adaeze-okafor", "xXgamerXx", "ada123456789"], 1, "A name-based username looks professional and appears in every link you share."),
    q("git-m01-q5", "What is a commit?", ["A copy of GitHub", "A saved snapshot of the project with a message, an author and a link to its parent", "A kind of branch", "A password for GitHub"], 1, "Commits are the links in the chain that make up the history."),
  ]),
  check("m02", "Your First Repository", [
    q("git-m02-q1", "You created a new folder with two files. What does git init do?", ["Uploads the files to GitHub", "Turns the folder into a Git repository by creating the hidden .git folder", "Commits the files", "Deletes the files"], 1, "git init starts tracking. It does not commit or upload anything."),
    q("git-m02-q2", "git status lists a file under \"Untracked files\". What does it mean?", ["The file is broken", "Git can see the file but is not tracking it yet", "The file was deleted", "The file is already committed"], 1, "You need git add before the file can be committed."),
    q("git-m02-q3", "You staged one file but git commit -m made a commit that did not include the other changed file. Why?", ["Git has a bug", "Only staged changes go into a commit", "Commits can only hold one file", "The message was too short"], 1, "The staging area decides what is in the commit."),
    q("git-m02-q4", "Which commit message is best?", ["update", "stuff", "Add revenue by region chart", "final"], 2, "A good message says what changed, starting with a verb."),
    q("git-m02-q5", "Which command shows the history in a compact one-line-per-commit view?", ["git status", "git log --oneline", "git add .", "git init --short"], 1, "git log --oneline is the quick way to scan history."),
  ]),
  check("m03", "Staging, Diffs, History and .gitignore", [
    q("git-m03-q1", "You ran git add on a file, and now git diff shows nothing. Where can you see the staged change?", ["git diff --staged", "git log", "git init", "You cannot"], 0, "git diff shows unstaged changes. --staged compares the staging area with the last commit."),
    q("git-m03-q2", "You changed a typo in one file and added a new page in another. What is the best way to commit?", ["One commit with the message \"changes\"", "Two commits, one for each idea, each with its own message", "Wait a week and commit everything", "Do not commit the typo"], 1, "One commit, one idea, makes history easy to read and to undo."),
    q("git-m03-q3", "Which commit message follows good practice?", ["Fixed stuff.", "Fix crash when the cart is empty", "BUG!!!", "changed some files today"], 1, "Start with a verb, be specific, and keep the first line short."),
    q("git-m03-q4", "You want Git to ignore every file ending in .log. What goes in .gitignore?", ["log", "*.log", "/log", "ignore .log"], 1, "The * is a wildcard, so *.log matches debug.log, error.log and more."),
    q("git-m03-q5", "Which should never be committed to a repository?", ["README.md", "A .env file with an API key", "A .gitignore file", "Your source code"], 1, "Secrets in Git stay in the history, so keep them out from the start."),
  ]),
  check("m04", "Undoing Mistakes Safely", [
    q("git-m04-q1", "You edited a file badly and want the last committed version back. Which command does that?", ["git restore <file>", "git revert", "git stash pop", "git init"], 0, "git restore discards uncommitted changes to the file."),
    q("git-m04-q2", "You ran git add . and staged a file with a password. What is the safe fix before committing?", ["Commit anyway", "git restore --staged <file>", "Delete the repository", "git push"], 1, "It unstages the file without deleting it."),
    q("git-m04-q3", "A bad commit was already pushed, and teammates have pulled it. Which is the safe way to undo it?", ["git reset --hard", "git revert <commit>", "git commit --amend", "Delete the branch"], 1, "revert adds a new commit that undoes the old one without rewriting shared history."),
    q("git-m04-q4", "Which command undoes your last commit but keeps all its changes staged, so you can recommit?", ["git reset --hard HEAD~1", "git reset --soft HEAD~1", "git restore .", "git revert HEAD"], 1, "--soft moves the branch back and leaves your work staged."),
    q("git-m04-q5", "You are halfway through a change when an urgent bug arrives. What lets you set your work aside and get a clean folder?", ["git stash", "git reset --hard", "git init", "git merge"], 0, "git stash saves uncommitted changes in a drawer. git stash pop brings them back."),
  ]),
  check("m05", "Branches", [
    q("git-m05-q1", "What is a Git branch, really?", ["A full copy of all your files", "A movable label that points to a commit", "A kind of remote", "A backup on GitHub"], 1, "That is why branches are instant and cheap."),
    q("git-m05-q2", "Which single command creates a branch called fix/typo and switches to it?", ["git branch fix/typo", "git switch -c fix/typo", "git merge fix/typo", "git new fix/typo"], 1, "-c means create. git checkout -b does the same in the older syntax."),
    q("git-m05-q3", "You switch from your feature branch to main, and the new file you made has disappeared from your folder. What happened?", ["Git deleted it for good", "It is not part of main, and it is safe on the feature branch", "A bug in Git", "You must run git init again"], 1, "Switching branches changes your files to match the branch you move to."),
    q("git-m05-q4", "You are on feature/contact. Which commands bring that work into main?", ["git switch main, then git merge feature/contact", "git merge main, then git switch feature/contact", "git branch -d main", "git push main"], 0, "Go to the branch that should receive the work, and merge the other one in."),
    q("git-m05-q5", "Why is it good practice to keep main always working?", ["Because Git requires it", "So you can publish or release from it at any time", "Because it saves disk space", "Because branches are expensive"], 1, "Professional teams keep main stable and do risky work on branches."),
  ]),
  check("m06", "Merge Conflicts", [
    q("git-m06-q1", "When does a merge conflict happen?", ["Whenever you merge", "When both branches changed the same lines in different ways", "When a branch is deleted", "When the internet is down"], 1, "Git merges automatically unless it cannot tell which change to keep."),
    q("git-m06-q2", "In a conflicted file, the text between <<<<<<< HEAD and ======= is which version?", ["The incoming branch", "The version on the branch you are on", "The oldest version", "A backup"], 1, "HEAD is where you are. The part after ======= is the branch you are merging in."),
    q("git-m06-q3", "You have edited a conflicted file to the version you want. What next?", ["git add the file, then git commit", "git init", "git branch -d", "Delete the file"], 0, "Staging marks the file as resolved, and the commit completes the merge."),
    q("git-m06-q4", "You start a merge, panic, and want everything back as it was. Which command helps?", ["git merge --abort", "git reset --hard origin", "git clone", "git stash pop"], 0, "--abort undoes the merge attempt cleanly."),
    q("git-m06-q5", "Which habit prevents the most conflicts on a team?", ["Never talking to teammates", "Pull often, keep branches short-lived and communicate", "Working on one huge branch for months", "Reformatting entire files in every commit"], 1, "Small, frequent integration means less drift."),
  ]),
  check("m07", "GitHub and Remotes", [
    q("git-m07-q1", "What does git push -u origin main do the first time?", ["Deletes main", "Sends main to origin and remembers the link so later you can just git push", "Downloads main", "Creates a pull request"], 1, "-u sets the upstream, linking your branch with origin/main."),
    q("git-m07-q2", "When you try to push for the first time, Git asks for a password and your GitHub password is rejected. What should you use?", ["The same password again, slowly", "A personal access token, SSH key or a sign-in through GitHub Desktop or VS Code", "Your email password", "Nothing, push cannot work"], 1, "GitHub does not accept account passwords for Git operations."),
    q("git-m07-q3", "Your push is rejected with \"fetch first\". What does it mean and what do you do?", ["The remote has commits you do not have. Run git pull, then push again", "Your repo is corrupt", "Delete your branch", "Make a new repository"], 0, "Integrate the remote's new work first, resolving any conflicts."),
    q("git-m07-q4", "Which command downloads a whole repository from GitHub to your computer for the first time?", ["git pull", "git push", "git clone", "git fetch"], 2, "clone copies the repository and sets up origin for you."),
    q("git-m07-q5", "You want to contribute to a project you do not own. What is your first step?", ["Push straight to the project", "Fork it to your own account", "Delete it", "Email the owner a zip"], 1, "A fork is your own copy, which you can push to and offer back through a pull request."),
  ]),
  check("m08", "Pull Requests and Code Review", [
    q("git-m08-q1", "What is a pull request?", ["A command that downloads code", "A proposal to merge your branch into another, with a space to review and discuss it", "A way to delete branches", "A type of commit"], 1, "A pull request is a conversation and a quality gate before merging."),
    q("git-m08-q2", "Which pull request title is best?", ["Update", "Fix typo in the jollof rice name", "My changes", "Please merge"], 1, "A specific title tells reviewers what to expect."),
    q("git-m08-q3", "A reviewer asks you to change a line. What do you do?", ["Open a new pull request", "Commit the change to the same branch and push; the pull request updates", "Delete the pull request", "Ignore it"], 1, "The pull request follows the branch."),
    q("git-m08-q4", "Your pull request description says Fixes #12. What happens when it is merged?", ["Nothing", "Issue number 12 is closed automatically", "A new branch #12 is made", "The pull request is deleted"], 1, "Keywords like Fixes link the work to the issue."),
    q("git-m08-q5", "Which merge option combines all the pull request's commits into one commit on main?", ["Create a merge commit", "Squash and merge", "Rebase and merge", "Delete the branch"], 1, "Squash gives main one tidy commit per pull request."),
  ]),
  check("m09", "Teamwork and Keeping Secrets Safe", [
    q("git-m09-q1", "Which file tells others what they may legally do with your code?", ["README.md", ".gitignore", "LICENSE", "CONTRIBUTING.md"], 2, "Without a licence, nobody is allowed to reuse your code."),
    q("git-m09-q2", "You committed an API key and pushed it to a public repository. What is the first thing to do?", ["Delete the file and carry on", "Revoke or rotate the key immediately", "Make the repository private and forget it", "Tell nobody"], 1, "The key is in the history and may be copied already. Only rotating it protects you."),
    q("git-m09-q3", "Which command stops Git tracking .env but keeps the file on your computer?", ["git rm .env", "git rm --cached .env", "git delete .env", "git restore .env"], 1, "--cached removes it from the index only."),
    q("git-m09-q4", "Which makes the best bug report?", ["It does not work", "A title, what happened, what you expected, numbered steps to reproduce and your environment", "A screenshot with no text", "A long complaint"], 1, "Someone else must be able to reproduce the problem."),
    q("git-m09-q5", "What does branch protection on main let a team require?", ["Nothing", "Pull requests, approvals and passing checks before merging", "That everyone commits at night", "A larger repository"], 1, "It makes it impossible to push untested work straight to main."),
  ]),
  check("m10", "GitHub Pages and Actions", [
    q("git-m10-q1", "Where do GitHub Actions workflow files live?", [".github/workflows", "workflows/ in the root", "src/actions", "docs/ci"], 0, "Anywhere else, GitHub does not run them."),
    q("git-m10-q2", "In a workflow, what does uses: actions/checkout@v4 do?", ["Deletes the repository", "Downloads your repository's code onto the machine running the job", "Checks your spelling", "Publishes the site"], 1, "Almost every workflow starts by checking out the code."),
    q("git-m10-q3", "A workflow needs a deployment password. Where should it be kept?", ["Written in the YAML file", "In the repository's Actions secrets", "In the README", "In a commit message"], 1, "Secrets are stored in Settings and used as ${{ secrets.NAME }}."),
    q("git-m10-q4", "You publish a project site from a repository called kitchen-site on the account ada-okafor. What is the address?", ["https://github.com/kitchen-site", "https://ada-okafor.github.io/kitchen-site", "https://kitchen-site.com", "https://ada-okafor.github.io"], 1, "Project sites live under your username's github.io address with the repository name."),
    q("git-m10-q5", "YAML is fussy about which thing?", ["Colours", "Indentation, which must use spaces and not tabs", "File size", "Capital letters in comments"], 1, "Wrong indentation changes the meaning or breaks the file."),
  ]),
  check("m11", "Show Your Projects on GitHub", [
    q("git-m11-q1", "Your GitHub username is tolu-adeyemi. Which repository makes a README appear at the top of your profile?", ["profile", "tolu-adeyemi", "readme", "tolu-adeyemi.github.io"], 1, "A public repository named exactly your username becomes your profile README."),
    q("git-m11-q2", "Which README opening is strongest for a recruiter?", ["A blank file", "One sentence on what the project is and why it matters, then what you did and the results with numbers", "A copy of a tutorial", "Only a title"], 1, "Lead with the point and show results."),
    q("git-m11-q3", "You can pin how many repositories to your profile?", ["One", "Up to six", "Twenty", "As many as you like"], 1, "Choose your best six, strongest first."),
    q("git-m11-q4", "Which is a good habit for your commit history as a portfolio?", ["Make hundreds of empty commits to fill the green squares", "Steady, real work with clear messages", "Only commit once a year", "Use the same message every time"], 1, "Recruiters read commits. Honest, steady work speaks for itself."),
    q("git-m11-q5", "What should you add to each public repository so visitors understand it quickly?", ["A README and a description", "Nothing", "Only a licence", "A larger file"], 0, "The README is the front page, and the description and topics help people find it."),
  ]),
  check("m12", "A Day on a Team", [
    q("git-m12-q1", "What should you do first when you start your working day on a shared project?", ["Push everything", "git switch main and git pull, then branch for your task", "Delete old branches", "Rewrite history"], 1, "Start from the latest work, and never work directly on main."),
    q("git-m12-q2", "You are mid-task with uncommitted changes and must fix an urgent bug on main. What is the cleanest sequence?", ["git stash, switch to main and fix on a branch, merge, then switch back and git stash pop", "Commit half-finished work with the message wip", "Copy the folder and start again", "git reset --hard"], 0, "Stash keeps your work safe and gives you a clean folder."),
    q("git-m12-q3", "What does git tag v1.0 do?", ["Deletes version 1", "Puts a permanent named label on a commit, marking a release", "Creates a branch", "Pushes to GitHub"], 1, "Tags mark moments like releases that you may want to return to."),
    q("git-m12-q4", "Before you commit, which two checks do professionals make?", ["git status and git diff --staged", "git init and git clone", "git reset and git push", "None, they just commit"], 0, "They check what is about to be saved."),
    q("git-m12-q5", "Two teammates changed the same line. What is the best way to resolve the conflict?", ["Whoever merges last wins", "Talk to each other, decide what is right, edit the file, add and commit", "Delete the file", "Force push"], 1, "A conflict is a signal that people should talk."),
  ]),
  {
    id: "git-and-github-for-beginners-final",
    courseId: C,
    kind: "final",
    title: "Git and GitHub: final assessment",
    passingScore: 60,
    questions: [
      q("git-f01", "Which one is a tool that runs on your computer and records the history of your files?", ["Git", "GitHub", "Both", "Neither"], 0, "Git tracks changes locally. GitHub hosts repositories online."),
      q("git-f02", "What are the three places Git moves changes between, in order?", ["Working folder, staging area, repository", "Repository, working folder, remote", "Branch, tag, commit", "Clone, push, pull"], 0, "Edit, git add, git commit."),
      q("git-f03", "You committed, then noticed a typo in the message. The commit is not pushed. What is the neat fix?", ["git commit --amend -m \"corrected message\"", "git revert HEAD", "Delete the repository", "git push --force"], 0, "Amend replaces your own recent, unshared commit."),
      q("git-f04", "Which is the safest way to undo a commit that others have already pulled?", ["git reset --hard", "git revert", "git commit --amend", "git stash"], 1, "revert adds a new undoing commit without rewriting shared history."),
      q("git-f05", "Which is true about branches?", ["Creating one copies every file", "A branch is a label pointing at a commit, so creating one is instant", "They can only be made on GitHub", "You can have only one"], 1, "Branches are cheap, so use them for every task."),
      q("git-f06", "A merge stops with CONFLICT in a file. What are the steps to finish?", ["Edit the file to the final text with no markers, git add it, then git commit", "git push --force", "git clone again", "Delete the branch"], 0, "Resolve, stage, commit."),
      q("git-f07", "What does a .gitignore file do?", ["Stops Git tracking the files that match its patterns", "Deletes files", "Hides the repository from GitHub", "Encrypts files"], 0, "It keeps secrets, generated files and junk out of the repository."),
      q("git-f08", "A password was committed to a public repository. In what order should you act?", ["Rotate the secret, stop tracking the file, then clean up", "Delete the file only", "Do nothing", "Make a new repository and hope"], 0, "Revoking the secret is the step that protects you."),
      q("git-f09", "A push is rejected because the remote has new commits. What should you do?", ["git pull, resolve any conflict, then push again", "git push --force", "Delete your commits", "Start a new repo"], 0, "Integrate the remote's work first."),
      q("git-f10", "What is a fork?", ["A kind of branch", "Your own copy of someone else's repository on GitHub", "A deleted repository", "A tag"], 1, "You work in your fork and offer changes back with a pull request."),
      q("git-f11", "Which is the best pull request description?", ["Here you go", "What changed, why, how to test it, and a link to the issue", "Please review ASAP", "Fixed it"], 1, "Reviewers need context to review well."),
      q("git-f12", "What does a GitHub Actions workflow do?", ["Runs commands automatically when an event like a push happens", "Draws diagrams", "Stores passwords in the YAML file", "Replaces Git"], 0, "It runs tests, builds and deployments automatically."),
      q("git-f13", "Why should main always be in a working state?", ["It is a rule of the internet", "It is what you publish or release, and what everyone branches from", "Git needs it", "It saves space"], 1, "A broken main blocks the whole team."),
      q("git-f14", "Which makes the most useful commit history?", ["One giant commit a week called changes", "Small commits, each one idea, with clear messages", "No commits until the end", "Commits with only emojis"], 1, "History is documentation."),
      q("git-f15", "How should a student present Git work to a recruiter?", ["Pinned repositories with READMEs that explain the work and results, linked from the CV", "A private repository only", "Fifty empty repositories", "A zip file by email"], 0, "Make it easy to see what you built and what it did."),
      q("git-f16", "Which command should you run before and after almost everything, to see what is going on?", ["git status", "git init", "git rm", "git gc"], 0, "git status keeps you oriented."),
    ],
  },
];
