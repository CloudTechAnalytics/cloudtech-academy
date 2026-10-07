import type { ProjectDef } from "../types";

export const LFF_PROJECT: ProjectDef = {
  id: "lff-shipment-plan",
  courseId: "logistics-freight-forwarding",
  title: "A complete shipment plan",
  required: true,
  summary: "Plan one shipment end to end: mode, route, documents, packing, a full quotation, risks and how you will keep the customer informed.",
  brief: `Choose a real or realistic shipment, such as 200 cartons by sea from China to Lagos, an air shipment of goods from Lagos to London, an agricultural export or the movement of machinery, and plan it as a freight forwarder would.

Use real rates where you can find them and state any assumptions. Submit a link to your plan (a shared document, PDF or folder) and paste your **recommended mode and route** and your **total quotation** below, with a short note on where to find each part.

Write for the customer first and your manager second: lead with the recommendation, then show the detail.`,
  tasks: [
    "The shipment: goods, quantity, weight and volume, origin, destination, trade terms and the customer's needs.",
    "Mode, route and timing: options compared, the choice and why, transit time with a delay allowance.",
    "Documents and compliance: every document and certificate, who prepares each, the HS code and any approvals.",
    "Packing, loading and handling: packing and marking, container or load plan with a capacity calculation, and any special or dangerous cargo.",
    "A full quotation: every charge, your margin, total, validity, what is excluded and an estimate of duty and VAT for the customer.",
    "A risk register with scores for the top risks and a response for each, plus the insurance you recommend.",
    "A communication plan: milestones you will update the customer on and how.",
  ],
  datasets: [],
  rubric: [
    "The shipment is specific and the customer's needs are clear.",
    "The mode and route are justified with a comparison of options and a realistic transit time including delays.",
    "Documents and compliance are complete and match the goods and the countries involved.",
    "Packing and loading are practical, with a sensible container or load calculation.",
    "The quotation lists every charge, is calculated correctly and states exclusions and validity.",
    "Risks are scored and have realistic responses, and insurance is recommended with reasons.",
    "The communication plan is clear and the whole document is easy for a customer to approve.",
  ],
};
