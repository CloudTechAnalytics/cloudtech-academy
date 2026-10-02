import type { ProjectDef } from "../types";

export const PBI_PROJECT: ProjectDef = {
  id: "pbi-ashgrove-dashboard",
  courseId: "power-bi-fundamentals",
  title: "Ashgrove Chambers practice dashboard",
  required: true,
  summary: "Build a Power BI report for a fictional Lagos law firm covering open work, court hearings and unpaid invoices.",
  brief: `Ashgrove Chambers' managing partner wants one Power BI report to run the practice: how much work is open and with whom, how court hearings are going, and how much money is outstanding.

Build it in Power BI Desktop from the four legal CSV files. Follow the workflow from the course: load and check, clean in Power Query where needed, build the model with a date table, write measures, then design two or three pages using the dashboard design and storytelling lessons.

In the text box, for each item below, describe **what you built** (tables, relationships, measures with their DAX, visuals), **the key numbers** it shows, and **what they mean** for the firm. Finish with **three recommendations** for the managing partner.

For the link, share your work so a reviewer can see it: a Power BI Service link if you have a work account, or a folder (Google Drive, OneDrive or GitHub) with the .pbix file, a PDF export and screenshots.`,
  tasks: [
    "The model: the tables, relationships (with cardinality and direction) and the date table. Include a description or screenshot of Model view.",
    "Your measures: at least Open Matters, Adjournment Rate, Billed, Overdue Amount and Collection Rate, with their DAX.",
    "Workload: open matters by practice area and by responsible lawyer. Who carries the most open work?",
    "Courts: adjournment rate overall, by court and by practice area. Where are adjournments worst?",
    "Money: overdue amount by client (top 10) and the collection rate over time.",
    "Design: describe your page layout and one design decision you made to make the main message clear.",
    "Three recommendations for the managing partner, each linked to a number in your report.",
  ],
  datasets: ["legal"],
  rubric: [
    "The model has correct one-to-many relationships, a marked date table, and no unnecessary bidirectional filters.",
    "Measures are written in DAX (not implicit sums), are named clearly, and give the right numbers.",
    "The report answers every question, with filters and slicers that behave as expected.",
    "The page has a clear visual hierarchy: the main message is the first thing you see, with no clutter.",
    "Numbers are formatted for a reader (naira, percentages, sensible rounding) and every visual has a meaningful title.",
    "Each recommendation is linked to a number in the report.",
  ],
};
