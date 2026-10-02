import type { ProjectDef } from "../types";

export const BA_PROJECT: ProjectDef = {
  id: "ba-harbourline-pack",
  courseId: "business-analysis-fundamentals",
  title: "Harbourline tracking request: business analysis pack",
  required: true,
  summary: "A complete business analysis pack for a freight company whose operations director wants a customer tracking app.",
  brief: `Harbourline Freight's operations director wants "a tracking app with GPS" because customers complain they don't know where their shipments are. Before any quotes are requested, produce the business analysis pack that should come first.

Use the logistics dataset to measure the problem. Submit a link to your pack (a shared document, PDF or folder) and paste your **problem statement** and **recommendation** below, followed by a short note on where to find each task.

Write for the operations director and Harbourline's managing director: clear, specific and backed by numbers.`,
  tasks: [
    "Problem statement and baseline: the real problem, sized with on-time rates by mode and route, with no solution named.",
    "Stakeholder register (power, interest, approach) and a RACI for the main decisions.",
    "Elicitation plan: who you'd interview or observe, and ten key questions.",
    "As-is and to-be process maps from booking to delivery, with the problems marked, including how customers are told about delays.",
    "Requirements: at least ten functional and non-functional requirements and business rules, testable and prioritised with MoSCoW.",
    "At least five user stories with Given/When/Then acceptance criteria, and three KPI definition cards with baselines and targets.",
    "Business case: at least three options including do nothing, with costs, benefits, payback, risks and a recommendation.",
    "UAT test cases for your Must requirements, a traceability matrix and an adoption plan.",
  ],
  datasets: ["logistics"],
  rubric: [
    "The problem statement separates the need from the requested solution, is sized with data, and names no solution.",
    "Stakeholders are complete (up, across, out and around), with a specific approach for each.",
    "Process maps show real handoffs and delays, and the to-be process fixes them with clear triggers.",
    "Requirements are testable, typed correctly, traceable and genuinely prioritised.",
    "User stories follow INVEST, and acceptance criteria cover exceptions as well as the normal case.",
    "KPIs have precise definitions and baselines calculated from the data.",
    "The business case compares options fairly, states its assumptions and makes a clear, justified recommendation.",
  ],
};
