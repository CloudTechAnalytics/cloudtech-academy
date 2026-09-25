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
    name: "FMCG distributor (sales)",
    description: "Orders from shops and supermarkets across Nigerian regions, with products and prices.",
    files: ["customers", "orders", "products"],
  },
  {
    id: "hr",
    name: "Company workforce (HR)",
    description: "Employees, a month of daily attendance, and leave records.",
    files: ["employees", "attendance", "leave"],
  },
  {
    id: "legal",
    name: "Law firm operations (legal)",
    description: "A firm's clients, matters, court hearings and invoices.",
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
  /** Set when the project is part of a course and counts towards its certificate. */
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
    summary: "Find out which products, regions and customer channels drive a distributor's sales, and where discounts are eating margin.",
    questions: [
      "What are monthly sales, and how do they trend?",
      "Which product categories and regions sell the most?",
      "How do wholesale, supermarket and kiosk customers differ?",
      "How much revenue is given away in discounts?",
    ],
  },
  {
    id: "law-firm-operations",
    title: "Law Firm Operations Analysis",
    skills: ["SQL", "Power BI"],
    dataset: "legal",
    summary: "Look at a law firm's workload and cash: open matters by practice area, how often hearings are adjourned, and overdue invoices.",
    questions: [
      "How many matters are open per practice area and lawyer?",
      "What share of hearings end in an adjournment?",
      "Which clients have the most outstanding or overdue invoices?",
      "How long do matters take to close?",
    ],
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
  },
];

export const datasetUrl = (dataset: string, file: string) => `/datasets/${dataset}/${file}.csv`;
