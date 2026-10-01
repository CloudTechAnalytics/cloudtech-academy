import type { ProjectDef } from "../types";

export const PYAN_PROJECT: ProjectDef = {
  id: "pyan-customer-health",
  courseId: "python-for-data-analytics",
  title: "Kolanut customer health review",
  required: true,
  summary: "Analyse Kolanut Distribution's customers in a Python notebook: who is growing, who is slipping, and what is really behind the North West's fall.",
  brief: `Kolanut Distribution's managing director has asked for a customer health review, built in Python from the sales data (orders, customers and products).

Submit a link to your **Google Colab notebook** (Share → Anyone with the link can view) and paste your **findings** below. The notebook must run from top to bottom with Runtime → Run all, and each analysis section must end with a sentence saying what the result shows.

Write the findings for the managing director: no code, numbers in every point, and a recommendation the sales team can act on this week. State any definitions you choose, for example the date you measure recency from and what counts as "at risk".`,
  tasks: [
    "Load and check the data: merge orders with customers and products using validate, and report row counts before and after and any missing values.",
    "Build a recency, frequency and value table for every customer, measured up to 30 June 2026.",
    "Compare each customer's revenue in H1 2025 and H1 2026, and list the ten biggest fallers and the ten biggest growers with their region and channel.",
    "Explain the North West's fall: how much of it comes from its biggest fallers, and who they are.",
    "Identify at-risk customers (define it, for example high value but no order for more than 30 days) and say which the sales team should call first.",
    "Include at least two charts with action titles, and finish with three to five findings, a recommendation and an honest caveat.",
  ],
  datasets: ["sales"],
  rubric: [
    "The notebook runs from top to bottom with Runtime → Run all, with no errors.",
    "Data checks are shown: merges use validate, row counts before and after, and missing values reported.",
    "Each analysis section ends with a sentence saying what the result shows.",
    "At least two charts with action titles, of the right type for their question.",
    "The North West's fall is explained with the customers behind it, by name and with numbers.",
    "Findings are written for a manager, with a recommendation the sales team can act on and an honest caveat.",
  ],
};
