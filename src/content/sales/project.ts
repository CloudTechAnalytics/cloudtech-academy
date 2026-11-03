import type { ProjectDef } from "../types";

export const BDS_PROJECT: ProjectDef = {
  id: "bds-sales-plan-pitch",
  courseId: "business-development-sales",
  title: "Your sales plan and pitch",
  required: true,
  summary: "A complete sales plan for a real or realistic product, with targets, a funnel, a pipeline and a written pitch ready to deliver.",
  brief: `Choose a product or service you could really sell: from your own business, a freelance service, or a company you know. Build the sales plan and write the pitch you would deliver to a real prospect.

Use real prices and real customer information where you can, and state your assumptions. Submit a link to your plan (a shared document, PDF or folder) and paste your **pitch** and your **target and funnel numbers** below, with a short note on where to find each part.

Write for a sales manager or a business owner who must decide whether your plan is realistic.`,
  tasks: [
    "Product and market: what you sell, the problem it solves, the price, your ideal customer profile and main competitors.",
    "Customer understanding: pains and gains, decision makers and the main objections with answers.",
    "Lead generation: sources, at least one outreach message and your qualifying questions.",
    "Sales process and tools: pipeline stages with probabilities, a CRM sheet design and a weekly routine.",
    "Targets and forecast: a revenue target worked back through wins, proposals, meetings and contacts, with a weighted forecast.",
    "A written pitch with a hook, problem, solution, proof, price and a clear ask with a date.",
    "How you will measure and improve: the metrics you will track and your first improvement action.",
  ],
  datasets: [],
  rubric: [
    "The ideal customer and the problem are specific and credible.",
    "Customer understanding reflects real pains, decision makers and likely objections, with honest answers.",
    "Lead generation uses several sources, and messages are personal, brief and relevant.",
    "The pipeline, CRM and routines are practical and used consistently.",
    "The targets and funnel maths are correct and realistic.",
    "The pitch is clear, honest, customer-focused and ends with a specific next step.",
    "Measurement is tied to action, with sensible metrics and an improvement plan.",
  ],
};
