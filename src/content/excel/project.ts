import type { ProjectDef } from "../types";

export const XLS_PROJECT: ProjectDef = {
  id: "xls-kolanut-sales-review",
  courseId: "excel-for-data-analysis",
  title: "Kolanut sales performance review",
  required: true,
  summary: "Build a complete Excel analysis of a fictional distributor's sales and present the findings to its managing director.",
  brief: `Kolanut Distribution's managing director is preparing for a board meeting and has asked for a sales performance review covering January 2025 to June 2026.

Build it in Excel (or Google Sheets) using the three sales files. Organise the workbook as in the *Building an analysis* lesson: a README, the raw data, a cleaned data sheet, calculations, a one-page summary and a checks sheet.

For each question below, submit **the key numbers or a small table**, **how you calculated them** (the formulas or pivot set-up), and **one or two sentences** on what they mean for the business. Finish with **three recommendations** for the board.

Upload your workbook to OneDrive or Google Drive, set the link so anyone with it can view, and paste it in the link box. It's optional but strongly encouraged: it's the piece of work you can show an employer.`,
  tasks: [
    "Monthly revenue trend, January 2025 to June 2026: describe the pattern, the peak and anything unusual. Include one chart.",
    "First half 2026 vs first half 2025: total growth and growth by region. Which regions drove growth and which fell?",
    "Revenue by product category and by channel, with each as a percentage of the total.",
    "The top 10 customers by revenue. What share of total revenue do they account for?",
    "Discounts: total cost, cost by channel, and whether discounted lines are larger than full-price lines.",
    "Checks: show at least two reconciliation checks that confirm your totals agree.",
    "Three recommendations for the board, each linked to a number in your analysis.",
  ],
  datasets: ["sales"],
  rubric: [
    "Revenue is calculated correctly after discounts, and the totals reconcile in at least two ways.",
    "Comparisons are like for like: H1 2026 against H1 2025, not a half year against a full year.",
    "Growth is reported in both naira and percent, by region, with the regions that drove the change named.",
    "Charts are the right type for each question, readable, and have action titles.",
    "The workbook is organised: a raw data sheet left untouched, clear calculations, and a summary a manager can read.",
    "Each of the three recommendations is linked to a specific number in the analysis.",
  ],
};
