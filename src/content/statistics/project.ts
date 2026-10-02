import type { ProjectDef } from "../types";

export const STAT_PROJECT: ProjectDef = {
  id: "stat-delivery-review",
  courseId: "statistics-for-data-analysis",
  title: "Harbourline delivery performance review",
  required: true,
  summary: "A statistical review of Harbourline Freight's delivery performance for its operations director and sales team.",
  brief: `Harbourline Freight's operations director wants a statistical review of delivery performance to take to the board, built in Excel or Google Sheets from the logistics dataset (shipments and routes).

Submit a link to your **workbook** (shared as view-only) and paste your **findings** below. For every task, give the number, the formula or method you used, and one or two sentences saying what it means, written for a director who isn't a statistician.

Start with your definitions: transit days, on time, and which shipments you included.`,
  tasks: [
    "Transit times by mode: the median, interquartile range and 90th percentile for Air, Road and Sea, and what a customer of each mode should plan for.",
    "On-time rate by mode and for the five largest routes, each with its count and a 95% confidence interval.",
    "Outliers: a histogram of days late, the shipments flagged by the IQR rule or a z-score above 2, and what you found when you looked at them.",
    "Change over time: test whether the on-time rate for each mode changed between 2025 and 2026, and say which changes are real and which could be chance.",
    "A quoting formula: for one route, regress freight_charge on containers and give the cost per container, r², an example quote and the range of loads it applies to.",
    "Three recommendations for the board, each linked to a number, with an honest caveat about the data.",
  ],
  datasets: ["logistics"],
  rubric: [
    "Definitions are stated, and only delivered shipments are used for transit and on-time figures.",
    "Skewed measures are summarised with medians and percentiles, not just means.",
    "Every rate is shown with its count and a 95% confidence interval, and small groups are treated with caution.",
    "Outliers are investigated, not deleted, and what they show is explained.",
    "Tests are used correctly: the p-value is reported with the size of the change, and 'not significant' isn't read as 'no change'.",
    "The quoting formula is fitted on one route, reports r², and isn't used outside the range of the data.",
    "Findings are written for a director, and each recommendation is linked to a number.",
  ],
};
