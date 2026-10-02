import type { ProjectDef } from "../types";

export const CAP_PROJECT: ProjectDef = {
  id: "cap-voltline-review",
  courseId: "data-analyst-capstone",
  title: "Voltline Electronics: commercial review",
  required: true,
  summary: "An end-to-end analysis of a retail chain from its raw till export: cleaning, modelling, analysis, a dashboard and a board-ready executive summary.",
  brief: `Voltline Electronics' chief executive wants to know what's really driving the business, from 18 months of raw till data. Take it from the raw files to a reviewed dashboard and recommendations, in the tools of your choice.

Submit one link to your work: a folder or repository (Google Drive, OneDrive or GitHub) containing your cleaning steps (Power Query, SQL or a notebook), your report (a .pbix, workbook or notebook plus a PDF export), your data quality log and your executive summary.

In the text box, paste your **executive summary**, then a short note for each task below saying where to find it and the key number.`,
  tasks: [
    "Analysis plan: questions, definitions (net sales, gross profit, like for like, the period) and deliverables.",
    "Data quality log and cleaning: every problem found, rows affected and the decision, with a reconciliation from 27,978 raw rows to your clean table.",
    "Model and measures: the tables and their grain, the date-based cost lookup, and the measures for net sales, gross profit, margin and target attainment, with the tests you ran.",
    "Growth: total against like-for-like growth for January to June 2026, and how much is price, the new store and volume.",
    "Stores and targets: like-for-like performance by store, Port Harcourt's decline, and a fair assessment of Lekki against its targets.",
    "Products and leaks: gross profit by category, return rates, accessory attach rates and at least one stock-out estimate with assumptions.",
    "A dashboard of three or four pages with titles that state findings, and a one-page executive summary with three recommendations and caveats.",
  ],
  datasets: ["retail"],
  rubric: [
    "The raw data was profiled and cleaned with repeatable steps; every problem is logged with a decision, and the row counts reconcile.",
    "Grain is handled correctly: costs are looked up by sale date, targets are compared at month level, and no join inflates totals.",
    "Growth is decomposed: like-for-like growth is separated from the new store and the price rise.",
    "Findings are backed by numbers and checked; estimates state their assumptions.",
    "Targets are judged fairly, with Lekki's ramp-up explained rather than reported as failure.",
    "The dashboard leads with the main messages, with finding-led titles and no clutter.",
    "The executive summary gives the answer first, three findings and three specific recommendations, and honest caveats.",
  ],
};
