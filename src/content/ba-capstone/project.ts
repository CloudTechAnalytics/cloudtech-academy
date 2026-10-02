import type { ProjectDef } from "../types";

export const BAC_PROJECT: ProjectDef = {
  id: "bac-shieldline-claims",
  courseId: "business-analyst-capstone",
  title: "Shieldline Insurance: fixing slow motor claims",
  required: true,
  summary: "An end-to-end business analysis of a motor insurer's slow claims: the problem in numbers, the real process from the event log, root causes, a fair evaluation of a pilot, a business case, requirements with controls, a go/no-go call and a decision paper for the board.",
  brief: `Shieldline Insurance's board must decide what to do about slow motor claims: roll out the Lagos pilot, buy a new claims system, or do nothing. Give them the analysis and a recommendation, in the tools of your choice (SQL, Excel or Power BI).

Submit one link to your work: a folder or repository (Google Drive, OneDrive or GitHub) containing your queries or workbook, your process map, your business case spreadsheet, your user stories and your decision paper.

In the text box, paste your **decision paper's executive summary**, then a short note for each task below saying where to find it and the key number.`,
  tasks: [
    "Plan: problem statement, scope, definitions and a stakeholder map with each stakeholder's concern.",
    "Current state: days to settle by channel, region and type, outcomes, and complaints by reason.",
    "Process: a BPMN map of the real process from the event log, with variants, the document loop and the waits.",
    "Root causes: at least four causes, each with evidence, five whys and an owner.",
    "Pilot: a difference-in-differences evaluation of the Lagos pilot, the other measures that moved, what to watch and the pilot's limits.",
    "Business case: renewals by claim experience, benefits with stated assumptions, NPV and payback for each option, and a sensitivity check.",
    "Requirements and readiness: user stories with acceptance criteria, approval rules, KPI definitions with baselines and targets, and a go/no-go note from the UAT results.",
    "Decision paper: two pages at most, answer first, with one chart that carries the argument and answers to each stakeholder's hard questions.",
  ],
  datasets: ["claims"],
  rubric: [
    "The problem is framed before any solution, with clear definitions and scope.",
    "The current state and process come from the data, including the rework loop and waits.",
    "Root causes are specific, evidenced and owned, and the new-system theory is tested rather than assumed.",
    "The pilot is evaluated against a comparison group, with its limits stated.",
    "The business case traces each benefit to evidence, counts contribution rather than premium, and tests its assumptions.",
    "Requirements trace to causes and include the controls finance needs; the go/no-go call follows the agreed criteria.",
    "The decision paper leads with the decision, is honest about risks, and anticipates stakeholders' objections.",
  ],
};
