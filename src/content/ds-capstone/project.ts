import type { ProjectDef } from "../types";

export const DSC_PROJECT: ProjectDef = {
  id: "dsc-kasuwa-failed-deliveries",
  courseId: "data-scientist-capstone",
  title: "Kasuwa: who to call before dispatch",
  required: true,
  summary: "An end-to-end data science project on an online shop's failed pay-on-delivery orders: framing, a leakage audit, point-in-time features, time-based validation, calibration, a randomised trial turned into a calling policy, fairness checks, a model card and a monitoring plan.",
  brief: `Kasuwa's leadership wants to cut failed pay-on-delivery deliveries without wasting money on calls. Build the model, use the April trial to decide whom to call, check it's fair, and plan how to keep it working.

Work in Google Colab with the deliveries dataset (https://academy.cloudtechanalytics.com/datasets/deliveries/: orders.csv and customers.csv). Submit a link to your notebook (shared so anyone with the link can view it), and paste your **executive summary** and **model card** below, followed by a short note on where each part of the analysis is.`,
  tasks: [
    "Framing: the decision, target, prediction moment and a metric in naira.",
    "Leakage audit: every column classed as known at checkout or later, with the leaks you excluded and why.",
    "Features: point-in-time customer history built with the failure time, with a check against the shortcut and the lifetime totals.",
    "Models: a time-based split, a baseline rule, logistic regression and gradient boosting compared on validation, and one test on the No-call group.",
    "Calibration and capacity: a calibration table and Brier score, and how many failures the riskiest orders contain.",
    "The trial: the call's overall effect with an interval, the effect by risk band, and a threshold chosen from net value per month.",
    "Fairness and monitoring: performance by city, the Kaduna problem, a decision on the city feature, a model card, and a monitoring plan with alert levels.",
  ],
  datasets: ["deliveries"],
  rubric: [
    "The problem is framed as a decision with a naira metric, not just a prediction.",
    "No feature uses information from after checkout; leaks are found and explained.",
    "Validation follows time, and the test set is untouched by the trial's calls.",
    "Model choice is justified by validation results, not complexity.",
    "The threshold comes from the trial's measured effect and costs, with its uncertainty stated.",
    "Performance is checked by group, and the use of location is justified or removed.",
    "Monitoring covers calibration by segment, score drift, new markets and a continuing holdout.",
  ],
};
