import type { ProjectDef } from "../types";

export const CICD_PROJECT: ProjectDef = {
  id: "cicd-tallybook-delivery-review",
  courseId: "cicd-and-containers",
  title: "Tallybook's delivery review",
  required: true,
  summary: "A review of how a company builds, secures and releases software: DORA measures before and after a new pipeline, a fixed Dockerfile and workflow, scanning and canary policies, and the next improvements.",
  brief: `Three months after switching to a new delivery pipeline, Tallybook's CTO wants a review for the board: was it worth it, what's still risky, and what comes next?

Work in Google Colab with the cicd dataset (https://academy.cloudtechanalytics.com/datasets/cicd/: deployments.csv, pipeline_runs.csv, canary_checks.csv, images.csv, the scan JSON files, Dockerfile and deploy.yml). Submit a link to your notebook (shared so anyone with the link can view it), and paste your **headline table**, your **fixed Dockerfile and workflow** and your **executive summary** below, followed by a short note on where each task is answered.`,
  tasks: [
    "DORA: deployment frequency, lead time, change failure rate and time to restore, before and after the new pipeline, overall and by service.",
    "Images: the base image choice, with size, build time and vulnerability evidence.",
    "Dockerfile: the problems found by your checker, and a fixed Dockerfile that passes it.",
    "Workflow: the problems found by your checker, and a fixed workflow that passes it.",
    "Speed: where pipeline time goes, what caching saved, and the next speed-up.",
    "Releases: how well the canary rule performs, the trade-off at other limits, and the canary policy.",
    "An executive summary for the board, with remaining risks and the next three improvements.",
  ],
  datasets: ["cicd"],
  rubric: [
    "The DORA measures are calculated correctly and compared fairly.",
    "Dockerfile and workflow fixes are correct, and shown to pass automated checks.",
    "Vulnerability findings are separated by source, with an enforceable policy.",
    "Pipeline speed is analysed by step, with deliberate safety time distinguished from waste.",
    "Canary analysis shows both caught and missed releases, and the policy addresses the misses.",
    "Remaining risks are stated with evidence.",
    "The summary answers whether speed cost stability, with numbers.",
  ],
};
