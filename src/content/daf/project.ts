import type { ProjectDef } from "../types";

export const DAF_PROJECT: ProjectDef = {
  id: "daf-kolanut-people-review",
  courseId: "data-analytics-foundations",
  title: "Kolanut people review",
  required: true,
  summary: "Look at who leaves, who is late, and how much leave is taken at a fictional distributor, and recommend what HR should do.",
  brief: `Kolanut Distribution's HR manager wants a short, honest review of the workforce before the next budget. You have three files: every employee since 2018, June 2026 attendance for current staff, and leave records since January 2025.

Answer each question below. For each, give **the number or table you found**, **how you calculated it** (the formula, filter or pivot table you used), and **one or two sentences** on what it means. Write for a manager who is busy and doesn't use spreadsheets.

Finish with a short **recommendation**: two or three things HR should do, and what the data *can't* tell you.

You can use Google Sheets or Excel. A link to your spreadsheet is welcome but optional.`,
  tasks: [
    "What share of all employees have resigned? Break it down by department and by job level, showing counts next to percentages.",
    "In June 2026, what share of attendance records were Late in each department? Which department stands out?",
    "How many leave days were taken in total, by leave type? How many leave requests were not approved?",
    "What is the average monthly salary by job level? Is it higher or lower for the groups that resign most?",
    "Choose one chart that best supports your main finding. Describe it (type, what's highlighted, its title).",
    "Recommendation: what should HR do next, and what are the limits of this data?",
  ],
  datasets: ["hr"],
  rubric: [
    "Every question is answered with numbers from the HR data, with counts shown next to percentages.",
    "Comparisons use rates, not raw counts, when groups differ in size.",
    "The chart chosen fits the finding, and its title states the point.",
    "The obvious explanation is tested rather than assumed (for example pay versus job level).",
    "The recommendation follows from the findings, and the limits of the data are stated honestly.",
  ],
};
