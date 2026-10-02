import type { ProjectDef } from "../types";

export const PMF_PROJECT: ProjectDef = {
  id: "pmf-depot-week-10-review",
  courseId: "project-management-fundamentals",
  title: "The depot's week 10 review",
  required: true,
  summary: "A complete project review for a steering committee: scope, estimates, critical path, the probability of meeting the deadline, earned value, a forecast from progress, risks with responses, change decisions and a one-page summary.",
  brief: `Kolanut's steering committee meets at the end of week 10 of the Abuja depot launch. Give them the review they need to decide.

Work in Google Colab with the project dataset (https://academy.cloudtechanalytics.com/datasets/project/: tasks.csv, weekly_status.csv, risks.csv and changes.csv). Submit a link to your notebook (shared so anyone with the link can view it), and paste your **one-page summary**, your **change log** and your **risk review** below, followed by a short note on where each part of the analysis is.`,
  tasks: [
    "Charter and WBS: the project's objective, scope boundaries and a checked work breakdown.",
    "Estimates and schedule: PERT durations, the critical path, float, and the baseline opening date.",
    "Schedule risk: a Monte Carlo simulation with the probability of opening by 30 September and P80 date.",
    "Earned value at week 10: PV, EV, AC, SPI, CPI and two estimates at completion.",
    "Forecast from progress: the opening date if the remaining work goes to plan, and at the fit-out's current rate, with a RAG status.",
    "Risks: EMV ranking, contingency, response decisions and a week 10 risk review.",
    "Changes: the impact of each request, options compared, a change log, and the one-page summary with decisions needed.",
  ],
  datasets: ["project"],
  rubric: [
    "Scope is clear, with in- and out-of-scope boundaries and one owner per task.",
    "The schedule is built correctly, and the critical path and float are explained.",
    "Dates are given with probabilities, not as single promises.",
    "Earned value is calculated correctly and the causes of variance are explained.",
    "The forecast starts from actual progress, and the RAG status follows stated rules.",
    "Risk responses are justified by cost against EMV, and changes by their effect on the critical path.",
    "The summary leads with status and decisions, and every number in it is traceable.",
  ],
};
