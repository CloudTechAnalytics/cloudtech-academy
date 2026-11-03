import type { ProjectDef } from "../types";

export const PMGT_PROJECT: ProjectDef = {
  id: "pmgt-complete-project-plan",
  courseId: "project-management",
  title: "A complete project plan",
  required: true,
  summary: "A full project plan for a real or realistic project: charter, scope, schedule, budget, risks, people, quality and change, and control and closing.",
  brief: `Choose a project you understand: an event, a business project, a community project, an IT or marketing project or an installation or construction job. Build the complete project plan and be ready to present it to a sponsor.

Use real prices and durations where you can, and state your assumptions. Submit a link to your plan (a shared document, PDF or folder) and paste your **one-page summary** and your **total budget and critical path** below, with a short note on where to find each part.

Write for the sponsor who must approve the plan: open with the summary, make the parts agree with each other and have honest answers for the questions they will ask.`,
  tasks: [
    "Charter: purpose and business case, SMART objectives, success criteria, high-level scope, sponsor and stakeholders.",
    "Scope: MoSCoW requirements, a scope statement with exclusions and acceptance criteria, and a work breakdown structure.",
    "Schedule: activities, durations, dependencies, milestones, the critical path and float.",
    "Budget: cost by work package, contingency and total, with a cash flow view.",
    "Risk: a register with at least five scored risks, responses and owners.",
    "People and communication: a RACI, stakeholder engagement and a communication plan.",
    "Quality and change: acceptance checks, procurement needs and the change control process.",
    "Control and closing: how progress is tracked (with a sample status report) and how the project will be closed.",
  ],
  datasets: [],
  rubric: [
    "The charter is clear, with a SMART objective, success criteria and defined scope boundaries.",
    "Scope is prioritised, testable and fully broken down in a WBS that covers all the work.",
    "The schedule has correct dependencies, a correctly calculated critical path and realistic durations.",
    "The budget covers all costs, includes contingency and agrees with the WBS.",
    "Risks are scored, have owners and proportionate responses and are reflected in the contingency.",
    "Roles, stakeholder engagement and communication are specific and workable.",
    "Quality, change control, progress tracking and closing are planned, and the whole plan is consistent.",
  ],
};
