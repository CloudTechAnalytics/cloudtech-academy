import type { ProjectDef } from "../types";

export const IEMI_PROJECT: ProjectDef = {
  id: "iemi-business-plan",
  courseId: "import-export-mini-importation",
  title: "Your import or export business plan",
  required: true,
  summary: "A complete plan for one product and one route: product, suppliers, shipping, compliance, landed cost and price, and how you will sell.",
  brief: `Choose one product and one route, either an import into Nigeria or an export from Nigeria, and write the business plan you would use to place the first order.

Use real prices from real suppliers, forwarders and marketplaces, and say where you have had to assume a number. Submit a link to your plan (a shared document, PDF or folder) and paste your **landed cost (or export price) per unit** and your **selling price and margin** below, followed by a short note on where to find each part.

Write for a reader who knows nothing about your product, such as a partner, a bank or a mentor: clear, specific and backed by numbers.`,
  tasks: [
    "Product and market: the product, who buys it and why, the price range you found and at least two competitors, with evidence of demand.",
    "Suppliers (or buyers): a shortlist of at least three, compared on the same terms, and the checks you made to verify them.",
    "Order and shipping: quantity, MOQ, sample plan, payment terms, shipping method, forwarder and the documents you will need.",
    "Compliance and clearance: the agencies, permits and registrations your product needs, its HS code and how you will clear it (or the export documents and rules).",
    "Costs and price: a full landed cost (or export price) per unit, the selling price and margin, and the effect of the naira weakening by 10%.",
    "Selling plan: channels, how many units you expect to sell and when, and your reorder rule.",
    "Cash flow for the first 90 days: money in and out, and how much you need to start.",
    "Risks: your three biggest risks, each with a fix.",
  ],
  datasets: [],
  rubric: [
    "The product is specific, and demand and competition are supported by evidence, not opinion.",
    "Suppliers (or buyers) are compared fairly on the same terms and verified with concrete checks.",
    "The order, payment terms and shipping method are realistic and protect the buyer from fraud and loss.",
    "Compliance is specific to the product: the right agencies, permits, HS code and documents.",
    "The landed cost (or export price) includes every cost, with the calculations shown, and the price and margin follow from it.",
    "The plan is tested against a weaker naira and higher freight, and still works or is changed.",
    "The selling plan, cash flow and risks are practical, with clear numbers and fixes.",
  ],
};
