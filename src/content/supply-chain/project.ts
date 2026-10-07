import type { ProjectDef } from "../types";

export const SCM_PROJECT: ProjectDef = {
  id: "scm-analyse-improve",
  courseId: "supply-chain-management",
  title: "Analyse and improve a supply chain",
  required: true,
  summary: "Map a real or realistic supply chain, diagnose its problems with data, recommend improvements with numbers and build the business case.",
  brief: `Choose one supply chain: a business you know, a product you buy, a school canteen, a published case study or a realistic business with sensible numbers. Map it, measure how well it performs and recommend improvements.

Use real data where you can and state your assumptions where you cannot. Submit a link to your project (a shared document, PDF or folder) and paste your **summary** (the main problems, your recommendations and the expected benefit in naira) below, with a short note on where to find each part.

Write for the owner or manager who will decide whether to act: open with the summary, show your workings and rank problems by size of benefit.`,
  tasks: [
    "A map of the chain showing links and the flows of goods, information and money, with the strategy (efficient or responsive) and why.",
    "The data you used and where each figure came from, with assumptions labelled.",
    "At least four calculated KPIs (for example fill rate, on-time delivery, inventory turns, days of inventory, cost per delivery, cash-to-cash, forecast error).",
    "The three biggest problems, each with evidence.",
    "A recommendation for each problem, with the calculation behind it (forecast, reorder point or EOQ, supplier, transport, warehouse or risk).",
    "A business case: expected benefit in naira, cost and effort, and the main risks.",
    "An action plan with owners and dates, and the KPIs you will use to measure success.",
  ],
  datasets: [],
  rubric: [
    "The map is clear and shows all three flows, and the strategy fits the product and customers.",
    "Data sources are stated and assumptions are labelled honestly.",
    "KPIs are defined and calculated correctly and show real problems.",
    "The three main problems are supported by evidence and ranked sensibly.",
    "Each recommendation is specific and backed by a correct calculation.",
    "The business case weighs benefit, cost and risk fairly.",
    "The action plan is realistic, with owners, dates and KPIs to check the result.",
  ],
};
