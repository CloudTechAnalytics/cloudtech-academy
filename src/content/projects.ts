/** Practice projects built on the fictional datasets in public/datasets. */

export type DatasetInfo = { id: string; name: string; description: string; files: string[] };

export const DATASETS: DatasetInfo[] = [
  {
    id: "logistics",
    name: "Harbourline Freight (logistics)",
    description: "A freight company's customers, shipments, routes, payments and staff, January 2025 to August 2026.",
    files: ["customers", "shipments", "routes", "payments", "employees"],
  },
  {
    id: "sales",
    name: "Kolanut Distribution (sales)",
    description:
      "An FMCG distributor's order lines from January 2025 to June 2026, with its 90 customers (shops, supermarkets and wholesalers across six regions) and 16 products. Prices rose in January 2026.",
    files: ["orders", "customers", "products"],
  },
  {
    id: "cleaning",
    name: "Kolanut customer export (messy)",
    description: "Kolanut's customer list as exported from its old system: duplicates, stray spaces, mixed capitals, three date formats and money stored as text.",
    files: ["customer_list_raw"],
  },
  {
    id: "hr",
    name: "Kolanut Distribution (HR)",
    description: "The distributor's 80 staff, their June 2026 attendance, and leave records since January 2025.",
    files: ["employees", "attendance", "leave"],
  },
  {
    id: "legal",
    name: "Ashgrove Chambers (legal)",
    description: "A Lagos law firm's clients, matters, court hearings and invoices from 2024 to August 2026.",
    files: ["clients", "matters", "hearings", "invoices"],
  },
];

export type PracticeProject = {
  id: string;
  title: string;
  skills: string[];
  dataset: string;
  summary: string;
  questions: string[];
  /** The course whose lessons and final project use this dataset. */
  courseSlug?: string;
};

export const PRACTICE_PROJECTS: PracticeProject[] = [
  {
    id: "logistics-operations",
    title: "Logistics Operations Analysis",
    skills: ["SQL", "Excel", "Power BI"],
    dataset: "logistics",
    summary: "Review a freight company's year: who ships the most, which routes run late, and what customers still owe.",
    questions: [
      "Who are the ten highest-volume customers?",
      "How did monthly shipment volume change?",
      "Which routes are busiest, and how reliable are they?",
      "How much revenue is still unpaid, and by whom?",
    ],
    courseSlug: "sql-for-data-analysis",
  },
  {
    id: "sales-performance",
    title: "Sales Performance Analysis",
    skills: ["Excel", "Power BI"],
    dataset: "sales",
    summary: "Find out which products, regions and customer channels drive a distributor's sales, and what its discounts really cost.",
    questions: [
      "What are monthly sales, and how do they trend?",
      "Which product categories and regions sell the most?",
      "How do wholesale, supermarket and kiosk customers differ?",
      "How much revenue is given away in discounts?",
    ],
    courseSlug: "excel-for-data-analysis",
  },
  {
    id: "law-firm-operations",
    title: "Law Firm Operations Analysis",
    skills: ["SQL", "Power BI"],
    dataset: "legal",
    summary: "Look at a Lagos law firm's workload and cash: open matters by practice area, how often hearings are adjourned, and overdue invoices.",
    questions: [
      "How many matters are open per practice area and lawyer?",
      "What share of hearings end in an adjournment?",
      "Which clients have the most outstanding or overdue invoices?",
      "How long do matters take to close?",
    ],
    courseSlug: "power-bi-fundamentals",
  },
  {
    id: "employee-analytics",
    title: "Employee Analytics",
    skills: ["Excel", "SQL"],
    dataset: "hr",
    summary: "Analyse attendance, lateness and leave across departments, and what staff turnover looks like.",
    questions: [
      "Which departments have the highest lateness and absence rates?",
      "How much leave is taken, by type and department?",
      "What is the resignation rate by department and job level?",
      "How does pay vary by level?",
    ],
    courseSlug: "data-analytics-foundations",
  },
];

export const datasetUrl = (dataset: string, file: string) => `/datasets/${dataset}/${file}.csv`;
