import type { ProjectDef } from "../types";

export const ASQL_PROJECT: ProjectDef = {
  id: "asql-health-check",
  courseId: "advanced-sql",
  title: "Harbourline commercial health check",
  required: true,
  summary: "A board-ready commercial health check of Harbourline Freight: growth, customer retention, delivery performance and receivables, all in SQL.",
  brief: `Harbourline Freight's managing director wants a commercial health check for the board, built in SQL on the company database, as of **31 August 2026**.

Submit a link to your **SQL file or notebook** (GitHub, a shared document or a gist) and paste your **findings** below. For every task, give the query, the key result and two or three sentences on what it means, written for a board member who doesn't read SQL.

Start with your definitions: revenue, on time, active customer, and the "as of" date.`,
  tasks: [
    "Data quality: profile the tables, test keys, relationships and status/date rules, and write a short note of what you found and decided.",
    "Growth: compare January to August 2025 with January to August 2026 (shipments and delivered charges, by mode), and show the monthly trend with a 3-month moving average.",
    "Customers: a quarterly cohort table, the customers who booked in 2025 but not in 2026, and RFM scores with a list of valuable customers who have gone quiet.",
    "Delivery: on-time rate by mode and for the five worst routes (with their delivery counts), 2025 against 2026.",
    "Cash: a receivables aging report that reconciles with the outstanding total, and the ten largest over-90-day balances with their account managers.",
    "Three recommendations for the board, each linked to a number from your analysis.",
  ],
  datasets: ["logistics"],
  rubric: [
    "Definitions and the 'as of' date are stated at the start and used consistently.",
    "Data-quality checks are run, and anything they find is investigated and explained, not silently deleted.",
    "Every period comparison is like for like, and incomplete periods are labelled or excluded.",
    "Queries handle NULLs and integer division correctly, and payments are aggregated before joining so nothing is double-counted.",
    "Queries are readable: one CTE per step, named for what it holds, with comments where a definition matters.",
    "Totals are reconciled: the aging buckets add up to the outstanding total.",
    "Findings are written for a board member, and each recommendation is linked to a number.",
  ],
};
