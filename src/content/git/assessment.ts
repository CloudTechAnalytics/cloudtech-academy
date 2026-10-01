import type { AssessmentDef } from "../types";

const C = "git-and-github-for-beginners";

/**
 * Git & GitHub for Beginners: a check for each module (it awards the module badge, and
 * unlocks only after the module's tasks are done) and a final assessment. Questions are
 * scenarios with plausible wrong answers.
 */
export const GIT_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "git-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "git-m01",
    title: "What Git and GitHub Are: module check",
    passingScore: 60,
    questions: [
      { id: "git-m01-q1", prompt: "Your folder has project.py, project_final.py and project_final_v2.py. What problem does Git solve here?", options: ["It makes the files smaller", "It keeps one copy and records each saved change as a commit, so you can see and go back to any version", "It renames the files automatically", "It deletes old versions"], answer: 1, explanation: "Version control replaces copies with a history of commits." },
      { id: "git-m01-q2", prompt: "Which statement about Git and GitHub is correct?", options: ["They're the same thing", "Git tracks changes on your computer; GitHub stores repositories online for backup and sharing", "GitHub runs on your computer; Git is a website", "You need GitHub to use Git"], answer: 1, explanation: "Git is the tool; GitHub is a hosting website for Git repositories." },
      { id: "git-m01-q3", prompt: "Which GitHub username is most professional?", options: ["cooldude2005", "adaeze-okafor", "babygirl_xx", "user8892731"], answer: 1, explanation: "It appears in every link you share with employers." },
      { id: "git-m01-q4", prompt: "What does 'push' do?", options: ["Deletes your last commit", "Sends your commits from your computer to GitHub", "Downloads changes from GitHub", "Creates a new repository"], answer: 1, explanation: "Push sends; pull brings changes down." },
      { id: "git-m01-q5", prompt: "Why turn on two-factor authentication?", options: ["It's required to make repositories", "It protects your account even if someone gets your password", "It makes GitHub faster", "It gives you free features"], answer: 1, explanation: "Your code and profile are worth protecting." },
    ],
  },
  {
    id: "git-m02-check",
    courseId: C,
    kind: "module",
    moduleId: "git-m02",
    title: "Your First Repository: module check",
    passingScore: 60,
    questions: [
      { id: "git-m02-q1", prompt: "Which commit message is best?", options: ["update", "final", "Fix date format in orders data", "changes made to the file today because it needed fixing"], answer: 2, explanation: "Starts with a verb, says what changed, short." },
      { id: "git-m02-q2", prompt: "Where can you see every change to a repository, who made it and when?", options: ["The README", "The commit history", "Settings", "Your profile photo"], answer: 1, explanation: "Commits are the repository's history." },
      { id: "git-m02-q3", prompt: "You committed a file with an API key to a public repo and then deleted the file. Is the key safe?", options: ["Yes, it's deleted", "No: it's still in the history and may already be copied, so revoke or change it", "Only if the repo has few stars", "Yes, GitHub hides deleted files"], answer: 1, explanation: "Treat any committed secret as leaked." },
      { id: "git-m02-q4", prompt: "Which repository name follows the advice in this course?", options: ["My Project FINAL", "sales-analysis", "project1", "asdfgh"], answer: 1, explanation: "Short, clear, with hyphens." },
      { id: "git-m02-q5", prompt: "You want your work to be visible to recruiters. Which repository setting?", options: ["Private", "Public", "Archived", "Template"], answer: 1, explanation: "Public repos act as a portfolio; keep secrets out of them." },
    ],
  },
  {
    id: "git-m03-check",
    courseId: C,
    kind: "module",
    moduleId: "git-m03",
    title: "Show Your Projects on GitHub: module check",
    passingScore: 60,
    questions: [
      { id: "git-m03-q1", prompt: "In GitHub Desktop, you've committed changes. What sends them to GitHub?", options: ["Fetch origin", "Push origin", "Discard changes", "New branch"], answer: 1, explanation: "Commit saves locally; push sends to GitHub." },
      { id: "git-m03-q2", prompt: "A teammate pushed changes. What should you do before you start working?", options: ["Push your old version over theirs", "Pull (fetch, then pull origin) to get the latest changes", "Delete the repository", "Nothing"], answer: 1, explanation: "Pull first to avoid conflicts." },
      { id: "git-m03-q3", prompt: "What should a project README include?", options: ["Only the title", "What it is, what you did, key findings or results, tools, and how to see it", "Your phone number", "Your full CV"], answer: 1, explanation: "It's the project's front page." },
      { id: "git-m03-q4", prompt: "Your username is ada-okon. Which repository becomes your profile README?", options: ["profile", "README", "ada-okon", "about-me"], answer: 2, explanation: "A public repo named exactly like your username." },
      { id: "git-m03-q5", prompt: "Which git command shows what has changed since your last commit?", options: ["git push", "git status", "git clone", "git pull"], answer: 1, explanation: "git status lists changed and new files." },
    ],
  },
  {
    id: "git-and-github-for-beginners-final",
    courseId: C,
    kind: "final",
    title: "Git & GitHub for Beginners: final assessment",
    passingScore: 60,
    questions: [
      { id: "git-f01", prompt: "What is a commit?", options: ["A saved snapshot of your changes, with a message", "A GitHub account", "A type of file", "A deleted version"], answer: 0, explanation: "Commits build the project's history." },
      { id: "git-f02", prompt: "What is a repository?", options: ["A project folder tracked by Git", "A GitHub password", "A commit message", "A browser extension"], answer: 0, explanation: "Often called a repo." },
      { id: "git-f03", prompt: "Which pair is correct?", options: ["Push sends commits to GitHub; pull brings changes from GitHub", "Push downloads; pull uploads", "Both delete files", "Both create repositories"], answer: 0, explanation: "Push up, pull down." },
      { id: "git-f04", prompt: "Which commit message is clearest?", options: ["stuff", "Add revenue by region chart", "final2", "asdf"], answer: 1, explanation: "Verb plus what changed." },
      { id: "git-f05", prompt: "What should never go in a repository?", options: ["A README", "Your code", "Passwords, API keys and other people's personal data", "Images of your charts"], answer: 2, explanation: "Even private repos can leak." },
      { id: "git-f06", prompt: "How do you show your best work at the top of your GitHub profile?", options: ["Rename your account", "Pin up to six repositories and add a profile README", "Make everything private", "Star other people's repositories"], answer: 1, explanation: "Pins and a profile README turn your profile into a portfolio." },
      { id: "git-f07", prompt: "Which command copies a repository from GitHub to your computer?", options: ["git clone", "git commit", "git status", "git add"], answer: 0, explanation: "Clone downloads the whole repository with its history." },
      { id: "git-f08", prompt: "What makes a README effective for a recruiter?", options: ["A long story about your life", "A one-line description, what you did, results, tools and how to see it", "Only code", "Lots of emojis"], answer: 1, explanation: "They should understand the project in a minute." },
    ],
  },
];
