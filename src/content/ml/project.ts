import type { ProjectDef } from "../types";

export const ML_PROJECT: ProjectDef = {
  id: "ml-ladder-credit-model",
  courseId: "machine-learning-fundamentals",
  title: "Ladder Microfinance: a responsible credit model",
  required: true,
  summary: "Build, evaluate and document a loan default model for a microfinance bank, with a profit-based threshold, explanations, fairness checks and a monitoring plan.",
  brief: `Ladder Microfinance will pilot a credit model for six months: applications scored above a threshold will be referred for review instead of approved automatically. Deliver the model and everything the head of credit risk needs to trust it.

Work in Google Colab with the loans dataset. Submit a link to your notebook (shared so anyone with the link can view it) and paste your **model card** below, followed by a short note on where each task is answered in the notebook.`,
  tasks: [
    "Framing: what's predicted, the decision it changes, the users and how the pilot's success will be measured.",
    "Data preparation: the features you used, an engineered feature, and a leakage check of every column.",
    "Modelling: a stratified split, the 'no default' baseline, logistic regression and at least one tree-based model, compared with cross-validation; the test set used once.",
    "Evaluation: AUC, a confusion matrix, and precision and recall at your chosen threshold.",
    "Threshold: a profit table with the bank's assumptions, the threshold you recommend, and how it changes if a default costs 80% of the loan.",
    "Explanation and fairness: permutation importance, reasons for one declined application, and your decision on region with evidence.",
    "Deployment: a pipeline that scores a raw application, and a model card with a monitoring plan and review triggers.",
  ],
  datasets: ["loans"],
  rubric: [
    "The problem is framed around a decision, with success measured on both defaults and lending volume.",
    "Features are available at application time; leakage and protected or proxy features are checked and handled.",
    "Models are compared fairly against a baseline, with cross-validation for choices and one final test score.",
    "Evaluation uses measures suited to imbalanced data, not accuracy alone.",
    "The threshold is chosen from business costs, with sensitivity shown.",
    "Predictions are explained in terms a credit officer and a borrower could understand.",
    "The pipeline works on raw input, and the model card states limitations and concrete monitoring triggers.",
  ],
};
