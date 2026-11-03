import type { ProjectDef } from "../types";

export const GIT_PROJECT: ProjectDef = {
  id: "git-portfolio-repository",
  courseId: "git-and-github-for-beginners",
  title: "A professional GitHub repository with a real workflow",
  required: true,
  summary: "Publish a real project on GitHub with a clear README, a clean commit history, a branch and a pull request, and a profile that works as a portfolio.",
  brief: `Choose a real project of yours: a data analysis, a small website, a spreadsheet model or a program. Put it on GitHub the way a professional would.

Create the repository on your computer with \`git init\` (or clone one you made on GitHub). Write the README, a \`.gitignore\` and, if you like, a licence. Make **at least six commits**, each one a single idea with a clear message. Then do your next change **on a branch** (for example \`feature/add-charts\`), push the branch, open a **pull request** with a proper description, and merge it. Keep secrets out of the repository.

Submit the link to your repository and the link to the merged pull request, and paste a short note saying what the project is and which Git skills you used (branches, a conflict you resolved, a revert and so on). Use only real work: do not invent contributions or commit history.`,
  tasks: [
    "A public repository for a real project, with a description and topics.",
    "A README with a title, a one-line summary, what you did, key findings or features, tools and how to see it.",
    "A .gitignore that is committed before any secrets or junk, and no secrets in the history.",
    "At least six commits, each with a single idea and a clear message starting with a verb.",
    "A feature branch pushed to GitHub, and a pull request with a title, what, why and how to test sections.",
    "The pull request merged into main (squash or merge commit), and the branch deleted.",
    "A pinned repository and a profile README that links to the project.",
    "A short reflection: one problem you hit with Git, and how you solved it.",
  ],
  datasets: [],
  rubric: [
    "The repository is public, easy to understand in thirty seconds, and the README is clear and honest.",
    "The commit history is clean: small commits, clear messages, and no secrets or junk files.",
    "A feature branch and a merged pull request show the real workflow, with a good pull request description.",
    "The .gitignore is sensible and was set up properly.",
    "The profile presents the project well: pinned repository, profile README and working links.",
    "The reflection shows real understanding of at least one Git problem and its solution.",
  ],
};
