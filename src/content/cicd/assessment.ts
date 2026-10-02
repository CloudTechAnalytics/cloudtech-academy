import type { AssessmentDef } from "../types";

/**
 * Final assessment for CI/CD and Containers. Scenario questions on DORA, images, Dockerfiles,
 * scanning, workflows, pipeline security, caching, release strategies and recovery.
 */
export const CICD_ASSESSMENT: AssessmentDef = {
  id: "cicd-and-containers-final",
  courseId: "cicd-and-containers",
  title: "CI/CD and Containers: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "cicdq01",
      prompt: "A team releases monthly, with 40 changes per release. What usually happens when they move to small daily releases?",
      options: ["More incidents", "Fewer and smaller incidents, fixed faster", "No change", "Releases stop"],
      answer: 1,
      explanation: "Small batches are easier to test and undo.",
    },
    {
      id: "cicdq02",
      prompt: "Which measures stability in the DORA framework?",
      options: ["Deployment frequency and lead time", "Change failure rate and time to restore", "Lines of code", "Number of tests"],
      answer: 1,
      explanation: "The other two measure speed.",
    },
    {
      id: "cicdq03",
      prompt: "Every code change makes `npm install` run again during the image build. What's the likely cause?",
      options: ["A slow network", "COPY . . comes before installing dependencies", "Too many layers", "Running as root"],
      answer: 1,
      explanation: "Copy the package files and install first.",
    },
    {
      id: "cicdq04",
      prompt: "A Dockerfile sets ENV DATABASE_URL with a password. What's the risk?",
      options: ["None", "Anyone with the image can read the password, even if a later line removes it", "Slower builds", "The app can't connect"],
      answer: 1,
      explanation: "Secrets belong at runtime, not in images.",
    },
    {
      id: "cicdq05",
      prompt: "A scan shows hundreds of findings, almost all in OS packages. What's the most effective fix?",
      options: ["Fix each one", "A smaller, newer base image, rebuilt regularly", "Disable the scanner", "Run as root"],
      answer: 1,
      explanation: "Fewer packages, fewer findings.",
    },
    {
      id: "cicdq06",
      prompt: "Which scanning rule is enforceable without blocking every release?",
      options: ["Block on any finding", "Block on CRITICAL and HIGH findings that have a fix; warn on the rest", "Never block", "Block only on LOW"],
      answer: 1,
      explanation: "Block only on what the team can act on.",
    },
    {
      id: "cicdq07",
      prompt: "A deploy job has no `needs`. What happens when tests fail?",
      options: ["The deploy waits", "The deploy runs anyway, in parallel with the tests", "Nothing deploys", "Tests rerun"],
      answer: 1,
      explanation: "needs: test enforces the order.",
    },
    {
      id: "cicdq08",
      prompt: "Why is `uses: some-dev/deploy-action@main` risky?",
      options: ["It's slow", "Its author can change the code that runs with your secrets at any time", "main is deprecated", "It isn't"],
      answer: 1,
      explanation: "Pin third-party actions to a commit SHA.",
    },
    {
      id: "cicdq09",
      prompt: "After caching, the biggest pipeline step is the canary watching the new version. What should you do?",
      options: ["Remove the canary", "Leave it: it's deliberate safety time; speed up the tests instead", "Shorten it to 10 seconds", "Run it after release"],
      answer: 1,
      explanation: "Don't optimise away safety.",
    },
    {
      id: "cicdq10",
      prompt: "A canary served only 1,400 requests and its error rate looks normal. What's the concern?",
      options: ["None", "Too few requests to detect a real difference, so a bad release can slip through", "Too many requests", "The baseline is wrong"],
      answer: 1,
      explanation: "Require enough evidence before promoting.",
    },
    {
      id: "cicdq11",
      prompt: "A release breaks payments. What's the first move?",
      options: ["Find the bug", "Roll back to the last good image, then investigate", "Wait for more errors", "Restart all servers"],
      answer: 1,
      explanation: "Restore first.",
    },
    {
      id: "cicdq12",
      prompt: "What keeps rollbacks possible after a database change?",
      options: ["Bigger databases", "Backwards-compatible changes, so the previous version still works", "Feature flags only", "Skipping canaries"],
      answer: 1,
      explanation: "Expand first, contract later.",
    },
  ],
};
