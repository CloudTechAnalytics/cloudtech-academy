import type { ProjectDef } from "../types";

export const ENT_PROJECT: ProjectDef = {
  id: "ent-business-plan",
  courseId: "entrepreneurship-business-management",
  title: "Your business plan",
  required: true,
  summary: "A complete business plan for a real business you could start: problem, customers, model, marketing, operations, finances, risks and your first 90 days.",
  brief: `Write the business plan for a business you could start, or one you already run. Use your own customer research and real prices, and state your assumptions where you must guess.

Submit a link to your plan (a shared document, PDF or folder) and paste your **executive summary** and your **break-even point and funding needed** below, with a short note on where to find each part.

Write for a reader who knows nothing about your business, such as a bank, a funder or a business partner: clear, specific and backed by evidence.`,
  tasks: [
    "Executive summary: the problem, solution, customers, model, funding needed and first-year goal.",
    "The problem and opportunity, with evidence from customer interviews or tests.",
    "Product and value proposition, including your minimum viable product.",
    "Market and competition: target customer, at least three competitors and your positioning.",
    "Marketing and sales plan: channels, brand, price and how you will win your first customers, with a CAC and CLV estimate.",
    "Operations, legal set-up and team: process, suppliers, structure, registration and permits, and who does what.",
    "Financial plan: start-up costs, price, variable and fixed costs, break-even, a six-month cash flow forecast and the funding needed.",
    "Risks with responses, and a 90-day action plan with milestones.",
  ],
  datasets: [],
  rubric: [
    "The problem is real and supported by evidence from customers, not assumptions.",
    "The value proposition and target customer are specific, and positioning against competitors is clear.",
    "The marketing plan names realistic channels and shows how the first customers will be won.",
    "Operations, legal set-up and the team are practical and correct for Nigeria, with current requirements flagged for checking.",
    "The financial plan is complete and consistent: price, costs, break-even and cash flow agree with each other.",
    "Risks are realistic and each has a response.",
    "The 90-day plan has specific actions, owners and measurable milestones.",
  ],
};
