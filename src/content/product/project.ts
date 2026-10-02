import type { ProjectDef } from "../types";

export const PDM_PROJECT: ProjectDef = {
  id: "pdm-paystream-next-quarter",
  courseId: "product-management-fundamentals",
  title: "Paystream's next quarter",
  required: true,
  summary: "A product review and quarter plan for a mobile wallet: user evidence, the onboarding funnel and retention, a RICE-scored backlog, an outcome-based roadmap, an honest launch review and a spec for the top priority.",
  brief: `Paystream's leadership is agreeing next quarter's product plan. Give them the evidence and the plan.

Work in Google Colab with the product dataset (https://academy.cloudtechanalytics.com/datasets/product/: users.csv, activity.csv, feedback.csv, interviews.csv, backlog.csv and rollout.csv). Submit a link to your notebook (shared so anyone with the link can view it), and paste your **roadmap**, your **launch review** and your **summary for leadership** below, followed by a short note on where each part of the analysis is.`,
  tasks: [
    "Outcomes: a north star metric and three measurable outcomes for the quarter.",
    "Users: patterns from the interviews and from feedback by theme, source and segment, with the sales team's requests in context.",
    "Funnel: conversion at each onboarding step by segment and channel, with the size of the biggest opportunity.",
    "Retention: cohort retention, and how activation and segment affect week 4 activity.",
    "Prioritisation: RICE scores, a comparison with the feedback ranking, and a sensitivity check.",
    "Roadmap: now, next and later within capacity, each item with an outcome and baseline, and a 'not this quarter' list.",
    "Launch review and spec: an honest savings goals review using the holdout, and a spec for the top priority with metrics, guardrails and a launch plan.",
  ],
  datasets: ["product"],
  rubric: [
    "Outcomes describe changed user behaviour, with numbers.",
    "Feedback is weighed by source and segment, not just counted.",
    "Funnel and retention analysis finds where and for whom the product fails.",
    "Prioritisation is transparent, with inputs that can be challenged and tested.",
    "The roadmap fits capacity and states outcomes with baselines.",
    "The launch review avoids self-selection and reports uncertainty honestly.",
    "The spec gives the team a clear problem, scope, non-goals, metrics and a holdout.",
  ],
};
