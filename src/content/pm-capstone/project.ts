import type { ProjectDef } from "../types";

export const PMC_PROJECT: ProjectDef = {
  id: "pmc-medlink-laboratory-recovery",
  courseId: "project-manager-capstone",
  title: "Medlink Diagnostics: recovering a laboratory opening",
  required: true,
  summary: "A complete recovery review for a sponsor whose public opening date is in danger: a charter and stakeholder strategy, honest estimates, the critical path, the real chance of the date, earned value at week 10, a forecast, a priced risk register, a decision on six change requests, a recovery plan and a one-page decision paper.",
  brief: `Medlink Diagnostics is ten weeks into opening a laboratory in Port Harcourt, and its managing director promised the state commissioner an opening on Monday 8 March 2027. The analysers are stuck in customs, costs are running over, and six change requests have arrived. Give the sponsor the review they need to decide.

Work in Google Colab or your own tools with the lab dataset (https://academy.cloudtechanalytics.com/datasets/lab/: tasks.csv, weekly_status.csv, risks.csv, changes.csv, stakeholders.csv and options.csv). Submit a link to your notebook or folder (shared so anyone with the link can view), containing your analysis and your decision paper.

In the text box, paste your **decision paper** (one page), then a short note for each task below saying where to find it and the key number.`,
  tasks: [
    "Charter and stakeholders: the objective, success criteria, scope in and out, constraints, and a strategy for the key stakeholders based on influence, interest and what each cares about.",
    "Estimates: a checked work breakdown, PERT expected durations and costs, and the gap between the approved budget and the expected cost.",
    "Schedule: the baseline critical path and finish, the float on the main non-critical tasks, and the cushion to the promised date.",
    "Schedule risk: a Monte Carlo simulation with the chance of the promised date, the P50 and P80 dates and the reserve the plan needs.",
    "Status at week 10: PV, EV and AC, SPI and CPI, the trend, and the tasks that explain the variances.",
    "Forecast: the opening date range from the remaining work and the cost forecast with its assumptions, with a RAG status.",
    "Risks and changes: EMV and expected delay on the critical chain, the effect of each change request on the forecast, and a decision on each.",
    "Recovery and the decision paper: recovery options tested against the schedule, a recommendation with a trigger, the revised cost range, and a one-page paper that leads with the decision.",
  ],
  datasets: ["lab"],
  rubric: [
    "The charter defines success and scope clearly, and the stakeholder strategy follows what each stakeholder cares about.",
    "The estimates are checked and the budget gap is explained honestly.",
    "The schedule and critical path are correct, and the cushion to the promised date is stated.",
    "Dates are given with probabilities, not as single promises.",
    "Earned value is calculated correctly and the causes of variance are traced to tasks.",
    "The forecast starts from the remaining work, gives a range and states its assumptions.",
    "Risks are priced, change requests are judged by their effect on the critical chain, and recovery options are measured rather than taken from the proposal.",
    "The decision paper leads with the recommendation, names the decisions needed and the trigger, and makes the unwelcome facts impossible to miss.",
  ],
};
