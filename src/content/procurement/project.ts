import type { ProjectDef } from "../types";

export const PROC_PROJECT: ProjectDef = {
  id: "proc-practical-procurement",
  courseId: "procurement-sourcing",
  title: "A practical procurement project",
  required: true,
  summary: "Source a real or realistic purchase end to end: the need, supplier shortlist, RFQ, evaluation, negotiation and purchase order.",
  brief: `Choose a real or realistic purchase, for example equipment for a workplace, uniforms, a year's supplies or an event, and run the whole procurement process on paper.

Use real quotes where you can; where you assume a number, say so. Submit a link to your project (a shared document, PDF or folder) and paste your **recommendation** and the **total cost and saving** below, with a short note on where to find each part.

Write for a manager who must approve the spending: lead with the recommendation, then show the evidence.`,
  tasks: [
    "The need and specification: what, why, how much, quality standard, delivery and budget.",
    "A long list and a short list of at least three suppliers, with how you chose them.",
    "The RFQ (or RFP) you sent, with the information given to every supplier.",
    "A total cost comparison of the bids, on a common basis.",
    "A weighted scoring matrix with criteria and weights agreed before scoring.",
    "Your negotiation plan (target, walk-away, alternative, what you can trade) and the result, with the saving.",
    "Your recommendation, with reasons and one main risk and how you will manage it.",
    "A draft purchase order, and the controls (approval and three-way match) you would apply.",
  ],
  datasets: [],
  rubric: [
    "The need is specific and the specification is clear enough for suppliers to quote on the same basis.",
    "Suppliers are identified from several sources and shortlisted using clear must-have criteria.",
    "The request is complete and every supplier receives the same information.",
    "Bids are compared on total cost and scored against criteria set in advance.",
    "The negotiation plan is prepared and looks beyond price to terms and total cost.",
    "The recommendation is justified with numbers, the saving is calculated with a clear baseline and a risk is managed.",
    "The purchase order is complete and the controls named are appropriate.",
  ],
};
