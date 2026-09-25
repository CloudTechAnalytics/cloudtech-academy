/**
 * The course catalogue. This is the source content: it is bundled into the site
 * (so public pages are prerendered for search engines) and, in Supabase mode, it
 * is also loaded into the database by `npm run seed` so it can be managed from /admin.
 */

export type Difficulty = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "available" | "coming_soon";

export type Category = { id: string; name: string; description: string; future?: boolean };

export const CATEGORIES: Category[] = [
  { id: "data-analytics", name: "Data Analytics", description: "Turning raw data into answers a business can act on." },
  { id: "business-intelligence", name: "Business Intelligence", description: "Dashboards, reporting and data models." },
  { id: "data-science", name: "Data Science", description: "Statistics and predictive modelling.", future: true },
  { id: "ai-ml", name: "AI & Machine Learning", description: "Building and applying machine learning models.", future: true },
  { id: "python", name: "Python", description: "Python for analysis and automation.", future: true },
  { id: "databases", name: "Databases & Data Modelling", description: "Designing databases and data models that answer business questions." },
  { id: "automation", name: "Automation", description: "Automating repetitive work.", future: true },
  { id: "business-analysis", name: "Business Analysis", description: "Requirements, processes and decisions.", future: true },
  { id: "cloud", name: "Cloud & Technology", description: "Cloud platforms and core technology skills.", future: true },
];

export type CertificateRules = {
  enabled: boolean;
  requireAllLessons: boolean;
  requireExercises: boolean;
  requireProject: boolean;
  passingScore: number;
};

export type ModuleDef = { id: string; title: string; lessons: string[] };

export type CourseDef = {
  id: string;
  slug: string;
  /** Short code used in credential IDs, e.g. CTA-SQL-2026-004821 */
  code: string;
  title: string;
  summary: string;
  description: string;
  categoryId: string;
  difficulty: Difficulty;
  levelLabel: string;
  /** Rough total study time, shown on cards. Undefined while a course is in preparation. */
  estimatedHours?: number;
  isFree: boolean;
  status: CourseStatus;
  skills: string[];
  prerequisites: string[];
  projectTitle?: string;
  certificate: CertificateRules;
  /** Module titles in order; `lessons` lists lesson slugs (files in src/content/<course>/). */
  modules: ModuleDef[];
};

const rules = (requireProject: boolean): CertificateRules => ({
  enabled: true,
  requireAllLessons: true,
  requireExercises: true,
  requireProject,
  passingScore: 70,
});

export const COURSES: CourseDef[] = [
  {
    id: "data-analytics-foundations",
    slug: "data-analytics-foundations",
    code: "DAF",
    title: "Data Analytics Foundations",
    summary: "What data analytics is, how businesses use data to decide, and the core skills you need to start.",
    description:
      "Learn what data analytics is, how businesses use data to make decisions, and the core skills required to begin a career in data analytics. The course ends with your first small analytics project.",
    categoryId: "data-analytics",
    difficulty: "beginner",
    levelLabel: "Beginner",
    estimatedHours: 6,
    isFree: true,
    status: "available",
    skills: ["How organizations use data", "Types of data", "Databases, cleaning and analysis", "Visualization and business intelligence", "Going from a question to an insight"],
    prerequisites: ["No experience needed", "A spreadsheet program: Google Sheets (free with a Google account) or Microsoft Excel"],
    projectTitle: "Kolanut people review",
    certificate: rules(true),
    modules: [
      ["What is Data Analytics?", "what-is-data-analytics"],
      ["How Businesses Use Data", "how-businesses-use-data"],
      ["Types of Data", "types-of-data"],
      ["Understanding Databases", "understanding-databases"],
      ["Data Cleaning", "data-cleaning"],
      ["Data Analysis", "data-analysis"],
      ["Data Visualization", "data-visualization"],
      ["Business Intelligence", "business-intelligence"],
      ["From Question to Insight", "from-question-to-insight"],
      ["Your First Analytics Project", "your-first-analytics-project"],
    ].map(([title, slug], i) => ({ id: `daf-m${String(i + 1).padStart(2, "0")}`, title, lessons: [slug] })),
  },
  {
    id: "excel-for-data-analysis",
    slug: "excel-for-data-analysis",
    code: "XLS",
    title: "Excel for Data Analysis",
    summary: "Clean, analyse and present business data in Excel, from formulas and XLOOKUP to pivot tables and charts.",
    description:
      "Excel is still where most business analysis happens. Learn to work with real datasets: sort and filter, write the formulas analysts use every day, clean messy data, summarise with pivot tables and present results with clear charts.",
    categoryId: "data-analytics",
    difficulty: "beginner",
    levelLabel: "Beginner",
    estimatedHours: 9,
    isFree: true,
    status: "available",
    skills: ["Formulas and functions", "IF, SUMIF and COUNTIF", "XLOOKUP", "Data cleaning", "Pivot tables", "Charts"],
    prerequisites: ["Microsoft Excel 2021 or Microsoft 365 (Google Sheets works for most lessons)", "Comfortable using a computer; no Excel experience needed"],
    projectTitle: "Kolanut sales performance review",
    certificate: rules(true),
    modules: [
      ["Excel for Analysts", "excel-for-analysts"],
      ["Working with Data", "working-with-data"],
      ["Sorting and Filtering", "sorting-and-filtering"],
      ["Formulas and Functions", "formulas-and-functions"],
      ["IF, SUMIF, COUNTIF", "if-sumif-countif"],
      ["XLOOKUP", "xlookup"],
      ["Data Cleaning", "data-cleaning"],
      ["Pivot Tables", "pivot-tables"],
      ["Charts and Visualization", "charts-and-visualization"],
      ["Building an Analysis", "building-an-analysis"],
      ["Mini Project", "mini-project"],
    ].map(([title, slug], i) => ({ id: `xls-m${String(i + 1).padStart(2, "0")}`, title, lessons: [slug] })),
  },
  {
    id: "sql-for-data-analysis",
    slug: "sql-for-data-analysis",
    code: "SQL",
    title: "SQL for Data Analysis",
    summary: "Query real business data with SQL, from your first SELECT to window functions, using a logistics company's database.",
    description:
      "SQL is how analysts get answers out of databases. In this course you work with Harbourline Freight, a fictional logistics company, and answer the questions its managers actually ask: who ships the most, which routes run late, what customers still owe. Every lesson starts with a business problem, explains the idea in plain language, and gives you queries to write in a live SQL editor in your browser.",
    categoryId: "data-analytics",
    difficulty: "beginner",
    levelLabel: "Beginner to intermediate",
    estimatedHours: 12,
    isFree: true,
    status: "available",
    skills: [
      "Reading a database schema",
      "Selecting, filtering and sorting data",
      "Aggregating with GROUP BY and HAVING",
      "Joining tables",
      "CASE expressions, subqueries and CTEs",
      "Window functions for rankings and running totals",
      "Turning a business question into a query",
    ],
    prerequisites: ["No prior SQL needed", "Comfortable using a computer and a web browser"],
    projectTitle: "Harbourline Freight operations review",
    certificate: rules(true),
    modules: [
      ["Introduction to Databases", "introduction-to-databases"],
      ["Relational Databases and SQL Tools", "relational-databases-and-sql-tools"],
      ["SELECT", "select"],
      ["WHERE", "where"],
      ["ORDER BY", "order-by"],
      ["LIMIT", "limit"],
      ["Aggregate Functions", "aggregate-functions"],
      ["GROUP BY", "group-by"],
      ["HAVING", "having"],
      ["JOINs", "joins"],
      ["CASE Statements", "case-statements"],
      ["Subqueries", "subqueries"],
      ["CTEs", "ctes"],
      ["Window Functions", "window-functions"],
      ["Business Analysis with SQL", "business-analysis-with-sql"],
      ["Final Project", "final-project"],
    ].map(([title, slug], i) => ({ id: `sql-m${String(i + 1).padStart(2, "0")}`, title, lessons: [slug] })),
  },
  {
    id: "data-modelling",
    slug: "data-modelling",
    code: "DMO",
    title: "Data Modelling",
    summary: "Design databases and analytics models that stay correct: entities, keys, relationships, ERDs, normalisation and star schemas.",
    description:
      "Every reliable report sits on a well-designed model. Learn to turn business questions into entities and keys, draw entity-relationship diagrams in crow's-foot notation, normalise away repeated data, and design the star schemas that Power BI and data warehouses run on. Every lesson is built around diagrams, and you practise on real databases in your browser.",
    categoryId: "databases",
    difficulty: "intermediate",
    levelLabel: "Beginner to intermediate",
    estimatedHours: 8,
    isFree: true,
    status: "available",
    skills: ["Entities, attributes and grain", "Primary and foreign keys", "Cardinality and bridge tables", "Entity-relationship diagrams", "Normalisation (1NF to 3NF)", "Star schemas and slowly changing dimensions"],
    prerequisites: ["Basic SQL (SELECT, WHERE, JOIN) helps; the SQL for Data Analysis course covers it", "No design experience needed"],
    projectTitle: "Ashgrove Chambers data model",
    certificate: rules(true),
    modules: [
      ["What Is a Data Model?", "what-is-a-data-model"],
      ["Entities, Attributes and Grain", "entities-and-attributes"],
      ["Keys", "keys"],
      ["Relationships and Cardinality", "relationships-and-cardinality"],
      ["Entity-Relationship Diagrams", "entity-relationship-diagrams"],
      ["Normalisation", "normalisation"],
      ["Dimensional Modelling", "dimensional-modelling"],
      ["Stars, Snowflakes, Dates and History", "star-snowflake-and-history"],
      ["Modelling in Practice", "modelling-in-practice"],
    ].map(([title, slug], i) => ({ id: `dmo-m${String(i + 1).padStart(2, "0")}`, title, lessons: [slug] })),
  },
  {
    id: "power-bi-fundamentals",
    slug: "power-bi-fundamentals",
    code: "PBI",
    title: "Power BI Fundamentals",
    summary: "Build a data model, write DAX measures and design a dashboard people can use to run a business.",
    description:
      "Power BI turns data into dashboards. Learn the full workflow: import and clean data with Power Query, relate tables in a model, write DAX measures, and design a dashboard that tells a clear business story.",
    categoryId: "business-intelligence",
    difficulty: "beginner",
    levelLabel: "Beginner to intermediate",
    estimatedHours: 12,
    isFree: true,
    status: "available",
    skills: ["Power Query", "Data modelling and relationships", "DAX measures", "Dashboard design", "Publishing reports"],
    prerequisites: ["Power BI Desktop (free, Windows only)", "Basic Excel is helpful: the Excel course covers it"],
    projectTitle: "Ashgrove Chambers practice dashboard",
    certificate: rules(true),
    modules: [
      ["Introduction to Business Intelligence", "introduction-to-business-intelligence"],
      ["Power BI Interface", "power-bi-interface"],
      ["Importing Data", "importing-data"],
      ["Power Query", "power-query"],
      ["Data Cleaning", "data-cleaning"],
      ["Data Relationships", "data-relationships"],
      ["Data Modelling", "data-modelling"],
      ["DAX Fundamentals", "dax-fundamentals"],
      ["Measures", "measures"],
      ["Visualizations", "visualizations"],
      ["Dashboard Design", "dashboard-design"],
      ["Business Storytelling", "business-storytelling"],
      ["Publishing Reports", "publishing-reports"],
      ["Final Dashboard Project", "final-dashboard-project"],
    ].map(([title, slug], i) => ({ id: `pbi-m${String(i + 1).padStart(2, "0")}`, title, lessons: [slug] })),
  },
];

export const findCourseDef = (slug: string | undefined) => COURSES.find((c) => c.slug === slug);
export const categoryName = (id: string) => CATEGORIES.find((c) => c.id === id)?.name ?? id;
