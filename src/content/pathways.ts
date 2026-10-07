/**
 * Suggested routes through the catalogue: what to learn, in order. A pathway never locks anything: every course is open on
 * its own terms (free ones to everyone, paid ones when enrolled). It only shows people what to learn next.
 */
export type Pathway = {
  id: string;
  title: string;
  /** The division it belongs to (see DIVISIONS in catalog.ts). */
  divisionId: "business" | "trade";
  blurb: string;
  courseIds: string[];
};

export const PATHWAYS: Pathway[] = [
  {
    id: "trade-logistics",
    title: "Trade & Logistics Pathway",
    divisionId: "trade",
    blurb: "From buying goods to moving them to managing the whole chain.",
    courseIds: ["import-export-mini-importation", "procurement-sourcing", "logistics-freight-forwarding", "supply-chain-management"],
  },
  {
    id: "business",
    title: "Business Pathway",
    divisionId: "business",
    blurb: "From a business idea to customers, sales and an online store.",
    courseIds: ["entrepreneurship-business-management", "digital-marketing-sales", "business-development-sales", "ecommerce-online-business"],
  },
];

export const pathwaysFor = (courseId: string) => PATHWAYS.filter((p) => p.courseIds.includes(courseId));
