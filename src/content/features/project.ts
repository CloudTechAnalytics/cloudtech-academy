import type { ProjectDef } from "../types";

export const FEM_PROJECT: ProjectDef = {
  id: "fem-paystream-retention",
  courseId: "feature-engineering-model-evaluation",
  title: "Paystream: a retention model that stays honest",
  required: true,
  summary: "An end-to-end churn model for a mobile wallet, with point-in-time features, time-based validation, calibration, a costed calling plan and drift monitoring.",
  brief: `Paystream's retention team will call the customers most likely to leave each month from June 2026. Build the model and everything around it, from the raw customers and transactions files.

Work in Google Colab. Submit a link to your notebook (shared so anyone with the link can view it), and paste your **definitions**, your **final test results** and your **calling recommendation** below, followed by a short note on where each task is answered.`,
  tasks: [
    "Definitions: population, snapshot dates, horizon and target, with reasons.",
    "Features: the course's features plus at least two of your own, each built point-in-time and checked against churn.",
    "Validation: training snapshots whose labels were complete by the test date, a later test snapshot, and a demonstration that your features don't leak.",
    "Models: logistic regression and gradient boosting compared on the same time-based test, tuned on a validation snapshot, with your choice and reasons.",
    "Calibration: a reliability table and Brier score for your chosen model.",
    "Targeting: a gains and lift table, and a calling plan with its expected value and the assumption you'd test first.",
    "Monitoring: churn by segment over time, a retraining rule, and triggers for review.",
  ],
  datasets: ["wallet"],
  rubric: [
    "Definitions are explicit, sensible for the business, and used consistently.",
    "Every feature uses only data up to its snapshot, and new features are justified and tested.",
    "Validation is time-based, with training labels complete before the test date; no random splits for the final result.",
    "Model comparison is fair, tuning avoids the test snapshot, and the choice weighs simplicity and explainability.",
    "Probabilities are checked for calibration before being used for planning.",
    "The calling plan is based on lift and costs, with the key assumption identified and a way to test it.",
    "Monitoring explains the delay in labels, tracks segments, and sets concrete triggers.",
  ],
};
