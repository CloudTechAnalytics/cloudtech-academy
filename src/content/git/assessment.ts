import type { AssessmentDef } from "../types";

const C = "git-and-github-for-beginners";

/** Git & GitHub for Beginners: a check for each module (it awards the module badge) and a final assessment. */
export const GIT_ASSESSMENTS: AssessmentDef[] = [
  {
    id: "git-m01-check",
    courseId: C,
    kind: "module",
    moduleId: "git-m01",
    title: "What Git and GitHub Are: module check",
    passingScore: 60,
    questions: [
      { id: "git-m01-q1", prompt: "What is Git?", options: ["A tool that tracks changes to files", "A social network", "A programming language", "A cloud spreadsheet"], answer: 0, explanation: "Git is version control: it records the history of your files." },
      { id: "git-m01-q2", prompt: "What is GitHub?", options: ["A website that stores Git repositories online", "The same thing as Git", "A code editor", "An email app"], answer: 0, explanation: "GitHub hosts Git projects in the cloud for backup and sharing." },
      { id: "git-m01-q3", prompt: "What is a commit?", options: ["A saved snapshot of changes with a message", "A deleted file", "A GitHub account", "A folder on your desktop"], answer: 0, explanation: "Commits are the save points in a project's history." },
      { id: "git-m01-q4", prompt: "Which username is most professional?", options: ["adaeze-okafor", "cooldude2005", "xXhackerXx", "asdfgh"], answer: 0, explanation: "Your username appears in every link you share." },
      { id: "git-m01-q5", prompt: "What is a README?", options: ["The front page of a repository that explains it", "A list of passwords", "A type of commit", "A GitHub setting"], answer: 0, explanation: "It tells visitors what the project is." },
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
      { id: "git-m02-q1", prompt: "Which repository name is best?", options: ["sales-analysis", "My Project FINAL (2)", "asdf", "new"], answer: 0, explanation: "Short, clear and hyphenated names work best." },
      { id: "git-m02-q2", prompt: "Which commit message is strongest?", options: ["Add revenue by region chart", "update", "stuff", "final"], answer: 0, explanation: "Start with a verb and say what changed." },
      { id: "git-m02-q3", prompt: "Can you create a repository and commit without installing anything?", options: ["Yes, on the GitHub website", "No, you must install Git first", "Only on a Mac", "Only with a paid plan"], answer: 0, explanation: "GitHub's website lets you add, edit and commit files." },
      { id: "git-m02-q4", prompt: "You accidentally committed a password. What should you do?", options: ["Change the password straight away", "Just delete the file", "Rename the repository", "Nothing, it's private"], answer: 0, explanation: "It stays in the history, so the password must be changed." },
      { id: "git-m02-q5", prompt: "Where can you see every change made to a repository?", options: ["The commit history", "The README", "Your profile photo", "The Settings page"], answer: 0, explanation: "Commits shows who changed what and when." },
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
      { id: "git-m03-q1", prompt: "What does 'push' do?", options: ["Sends your commits to GitHub", "Deletes your repository", "Downloads a file", "Creates an account"], answer: 0, explanation: "Push uploads local commits to GitHub." },
      { id: "git-m03-q2", prompt: "What does 'pull' do?", options: ["Brings the latest changes from GitHub to your computer", "Sends your changes to GitHub", "Removes a file", "Renames a branch"], answer: 0, explanation: "Pull before you start work so you have the latest version." },
      { id: "git-m03-q3", prompt: "What should a good project README include?", options: ["What it is, what you did, findings, tools and how to see it", "Only the project name", "Your home address", "Nothing"], answer: 0, explanation: "A README should sell the project in a minute." },
      { id: "git-m03-q4", prompt: "How do you make a profile README?", options: ["Create a public repo named exactly your username with a README", "Edit your bio only", "Email GitHub support", "Pin six repos"], answer: 0, explanation: "GitHub shows that README at the top of your profile." },
      { id: "git-m03-q5", prompt: "How many repositories can you pin to your profile?", options: ["Up to six", "One", "Unlimited", "None"], answer: 0, explanation: "Pin your best six." },
    ],
  },
  {
    id: "git-and-github-for-beginners-final",
    courseId: C,
    kind: "final",
    title: "Git & GitHub for Beginners: final assessment",
    passingScore: 60,
    questions: [
      { id: "git-f01", prompt: "What problem does version control solve?", options: ["Keeping track of every version of your files", "Making files smaller", "Designing slides", "Sending emails"], answer: 0, explanation: "No more project_final_v2_REALLY_final." },
      { id: "git-f02", prompt: "Which runs on your computer?", options: ["Git", "GitHub", "Both run only in the cloud", "Neither"], answer: 0, explanation: "Git runs locally; GitHub is the website." },
      { id: "git-f03", prompt: "A project folder tracked by Git is called a…", options: ["Repository", "Commit", "Branch", "Pin"], answer: 0, explanation: "Repo for short." },
      { id: "git-f04", prompt: "Which commit message follows good practice?", options: ["Fix date format in orders data", "fixed", "changes", "aaaa"], answer: 0, explanation: "Clear verb plus what changed." },
      { id: "git-f05", prompt: "Which of these should never go in a repository?", options: ["API keys and passwords", "A README", "Python files", "Images of charts"], answer: 0, explanation: "Secrets stay in the history forever." },
      { id: "git-f06", prompt: "In GitHub Desktop, which button sends commits to GitHub?", options: ["Push origin", "Fetch origin", "Clone", "Discard changes"], answer: 0, explanation: "Push origin uploads your commits." },
      { id: "git-f07", prompt: "Why do employers look at GitHub profiles?", options: ["They show real projects and how you work", "They show your grades", "They replace interviews", "They list your salary"], answer: 0, explanation: "A GitHub profile works as a portfolio." },
      { id: "git-f08", prompt: "To avoid conflicts in a group project, you should…", options: ["Pull before you start work", "Never commit", "Share one laptop", "Email files instead"], answer: 0, explanation: "Pulling first means you start from the latest version." },
    ],
  },
];
