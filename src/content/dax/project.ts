import type { ProjectDef } from "../types";

export const DAX_PROJECT: ProjectDef = {
  id: "dax-kolanut-dashboard",
  courseId: "power-bi-dax",
  title: "Kolanut commercial dashboard",
  required: true,
  summary: "A DAX-driven Power BI report for Kolanut's leadership: like-for-like growth, price and volume, channels and customers, and customer health.",
  brief: `Kolanut Distribution's managing director wants one Power BI report for the monthly leadership meeting, built on the sales dataset with a tested library of DAX measures.

Share your work so a reviewer can see it: a Power BI Service link if you have a work account, or a folder (Google Drive, OneDrive or GitHub) with the .pbix file, a PDF export and screenshots.

In the text box, for each task give the **DAX** of the key measures, the **numbers** they show, and **what they mean** for Kolanut, written for a managing director who doesn't read DAX.`,
  tasks: [
    "Measure library: list your base measures and display folders, with a description for each base measure.",
    "Growth: Revenue, like-for-like Revenue LY and YoY %, Revenue YTD and a rolling 3-month trend. Explain how you stopped the part year from misleading.",
    "Price and volume: Price Effect and Volume Effect for 2026, overall and by channel, and show that they add up to the growth.",
    "Channels and customers: share of revenue by channel, a customer league table with rank this year and last year, and Top 5 Share.",
    "Customer health: active, lapsed and new customers for June 2026 by channel, with the window you chose and why, and the class A customers from a Pareto analysis.",
    "Testing: at least three checks you ran (reconciliations with the source, totals, edge cases) and their results.",
    "Three recommendations for the managing director, each linked to a number in your report.",
  ],
  datasets: ["sales"],
  rubric: [
    "Every number comes from an explicit measure; base measures are defined once and reused, formatted and organised in display folders.",
    "Time comparisons are like for like, and the part year never produces a misleading comparison.",
    "CALCULATE filters are correct: shares, ranks and windows respond to slicers the way a reader would expect.",
    "Price and volume effects are calculated correctly and reconcile with total growth.",
    "Measures are readable: variables for steps, DIVIDE for ratios, no FILTER over whole fact tables where a column filter would do.",
    "Testing is shown: key totals are reconciled with the source data.",
    "Findings are written for the managing director, and each recommendation is linked to a number.",
  ],
};
