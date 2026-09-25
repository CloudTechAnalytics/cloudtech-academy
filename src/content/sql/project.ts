import type { ProjectDef } from "../types";

export const SQL_PROJECT: ProjectDef = {
  id: "sql-harbourline-review",
  courseId: "sql-for-data-analysis",
  title: "Harbourline Freight operations review",
  required: true,
  summary: "Analyse the operations of a fictional logistics company and report what you find to its leadership team.",
  brief: `Harbourline Freight's leadership team is planning 2027 and has asked for an operations review built from the company database.

For each question below, submit **the SQL you wrote** and **one or two sentences** explaining what the result means for the business. Write for a manager who doesn't read SQL.

State any definitions you choose. For example, say whether you counted cancelled shipments, and whether "revenue" means charges on delivered shipments or money received.`,
  tasks: [
    "Identify the ten highest-volume customers by containers shipped across the whole period.",
    "Analyse monthly shipment volume and describe how it changed.",
    "Identify the five busiest routes and their transport mode.",
    "Calculate revenue by customer (charges on delivered shipments) and how much of it has been paid.",
    "Find inactive customers: those who shipped before but have booked nothing since 2026-03-01.",
    "Analyse delivery performance: the on-time rate by mode, and the three routes with the lowest on-time rate.",
  ],
  datasets: ["logistics"],
};
