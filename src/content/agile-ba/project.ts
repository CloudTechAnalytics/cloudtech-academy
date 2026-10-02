import type { ProjectDef } from "../types";

export const ABA_PROJECT: ProjectDef = {
  id: "aba-harbourline-delays",
  courseId: "agile-business-analysis",
  title: "Harbourline delay notifications: agile delivery pack",
  required: true,
  summary: "An agile delivery pack for a freight company's customer delay-notification service, from vision and story map to forecast and pilot plan.",
  brief: `Harbourline Freight will build a service that tells customers about delays before they happen, with a small Scrum team in two-week sprints. Before sprint 1, prepare the agile delivery pack the managing director has asked for.

Use the logistics dataset to size the need. Assume the team's velocity will be 18 to 24 points a sprint once it settles, and that sprint 1 starts on 7 September 2026.

Submit a link to your pack (a shared document, spreadsheet, board export or PDF) and paste your **product goal**, **pilot forecast** and **pilot plan** below, followed by a short note on where to find each task.`,
  tasks: [
    "Vision and product goal, with a measurable outcome, a baseline from the data and a date.",
    "A story map of the customer's journey, with the walking skeleton and the pilot release marked.",
    "A backlog of at least 12 user stories, with large stories split and the splitting pattern named, and Given/When/Then acceptance criteria for the top five.",
    "The team's definition of ready and definition of done.",
    "WSJF scores for the top eight stories, and the resulting order with reasons.",
    "A pilot date forecast as a range, using the assumed velocity and your estimates, with the scope you'd cut if the date is at risk.",
    "The flow and quality measures the team will track, and how you'll use them in retrospectives.",
    "A pilot plan: question, comparison, success criteria and decision rule.",
  ],
  datasets: ["logistics"],
  rubric: [
    "The product goal is an outcome with a number, a baseline and a date, and every backlog decision can be traced to it.",
    "The story map covers the whole journey, and the first slice is usable end to end.",
    "Stories are small, valuable and testable; splits use real patterns, not technical layers; acceptance criteria cover unhappy paths.",
    "Definitions of ready and done are specific and would prevent the problems seen in the kiosk app team.",
    "Prioritisation is consistent and explained, and the forecast is a range with an honest scope plan.",
    "Measures are used for learning, not judging individuals.",
    "The pilot plan has a comparison group, success criteria agreed in advance and a decision rule.",
  ],
};
