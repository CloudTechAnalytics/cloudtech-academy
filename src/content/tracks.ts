/**
 * Career tracks: ordered routes through the catalogue towards a job. A track groups courses
 * into stages, recommends practice projects, and awards a track badge once every required
 * course is complete (checked again by issue_track_credential() on the server).
 *
 * Courses not built yet are listed as `upcoming`: they show on the track page as
 * "in preparation" and become required only when they're added as real course items.
 * Learners who already hold a track badge keep it when a track grows.
 */

export type Level = 1 | 2 | 3 | 4;

/** The four levels every course sits at. */
export const LEVELS: Record<Level, { name: string; description: string }> = {
  1: { name: "Foundations", description: "No experience needed." },
  2: { name: "Practical Skills", description: "Real tools on realistic datasets." },
  3: { name: "Professional", description: "Advanced concepts and business scenarios." },
  4: { name: "Career Projects", description: "Portfolio projects that show what you can do." },
};

export type TrackItem =
  | { kind: "course"; courseId: string; why: string; required?: boolean }
  | { kind: "project"; projectId: string; why: string }
  | { kind: "upcoming"; title: string; why: string; level: Level };

export type TrackStage = { title: string; summary: string; items: TrackItem[] };

export type Track = {
  id: string;
  slug: string;
  title: string;
  /** The job or goal, as the learner would say it. */
  outcome: string;
  summary: string;
  /** Name of the badge earned for completing the track. */
  badge: string;
  /** Short code used in the track badge's credential ID. */
  badgeCode: string;
  skills: string[];
  stages: TrackStage[];
};

export const TRACKS: Track[] = [
  {
    id: "data-analyst",
    slug: "data-analyst",
    title: "Become a Data Analyst",
    outcome: "Get job-ready as a junior data analyst",
    summary:
      "The route we recommend from no experience to a junior data analyst role. Learn how analysis works, then the tools teams use every day (Excel, SQL, Power BI and Python) on realistic company data. Build portfolio projects that answer real business questions, and finish with your CV, LinkedIn and interview preparation.",
    badge: "CloudTech Data Analyst",
    badgeCode: "DATAANALYST",
    skills: [
      "Spreadsheet analysis in Excel",
      "Statistics: averages, spread, confidence intervals and tests",
      "Querying databases with SQL, from first SELECT to cohorts and window functions",
      "Data modelling and star schemas",
      "Dashboards in Power BI, with DAX measures you can trust",
      "Analysis in Python and pandas",
      "Turning data into findings a manager can act on",
    ],
    stages: [
      {
        title: "Foundation",
        summary: "How analysis works, and the spreadsheet skills every analyst uses.",
        items: [
          { kind: "course", courseId: "data-analytics-foundations", why: "How analysis works: questions, data types, cleaning and telling the story." },
          { kind: "course", courseId: "excel-for-data-analysis", why: "The tool almost every business already uses, from formulas to pivot tables." },
          { kind: "course", courseId: "statistics-for-data-analysis", why: "Averages, spread, outliers, confidence intervals and tests: telling a finding from noise." },
        ],
      },
      {
        title: "Core",
        summary: "Get data out of databases, model it properly and turn it into dashboards.",
        items: [
          { kind: "course", courseId: "sql-for-data-analysis", why: "Pull and summarise data straight from a database." },
          { kind: "course", courseId: "data-modelling", why: "Design the tables, keys and star schemas reliable reports are built on." },
          { kind: "course", courseId: "power-bi-fundamentals", why: "Turn the numbers into dashboards people can use." },
          { kind: "course", courseId: "power-bi-dax", why: "Filter context, CALCULATE, time intelligence and customer measures in depth." },
        ],
      },
      {
        title: "Advanced",
        summary: "Automate and scale your analysis, and handle harder questions.",
        items: [
          { kind: "course", courseId: "python-for-data-analytics", why: "Write an analysis once and run it again in seconds, with every step on record." },
          { kind: "course", courseId: "advanced-sql", why: "Window functions in depth, cohorts, date logic, data quality checks and query performance." },
        ],
      },
      {
        title: "Projects",
        summary: "Portfolio projects on realistic data. Each one answers a business question end to end.",
        items: [
          { kind: "project", projectId: "sales-performance", why: "Where is a distributor's revenue coming from, and where is it slipping?" },
          { kind: "project", projectId: "logistics-operations", why: "Find the late routes and the customers who owe money." },
          { kind: "project", projectId: "employee-analytics", why: "Who leaves, when, and why: an HR analysis." },
          { kind: "project", projectId: "customer-data-cleanup", why: "Turn a messy export into a list a business can trust." },
          { kind: "course", courseId: "data-analyst-capstone", why: "From a raw till export to a reviewed dashboard and a board-ready executive summary." },
        ],
      },
      {
        title: "Career",
        summary: "Turn your skills into applications that get interviews.",
        items: [
          { kind: "course", courseId: "career-essentials", why: "An ATS-friendly CV and a LinkedIn profile recruiters can find." },
          { kind: "course", courseId: "build-your-student-portfolio", why: "One link that shows your projects.", required: false },
          { kind: "course", courseId: "get-your-first-internship", why: "Find, apply for and interview for your first role.", required: false },
        ],
      },
    ],
  },
  {
    id: "business-analyst",
    slug: "business-analyst",
    title: "Become a Business Analyst",
    outcome: "Get job-ready as a junior business analyst",
    summary:
      "The route from no experience to a junior business analyst role. Learn to turn requests into the right changes: understand the problem, map the process, write requirements and user stories, and make the business case. Back it up with the data skills employers now expect from BAs (Excel, SQL and Power BI), then present yourself for the job.",
    badge: "CloudTech Business Analyst",
    badgeCode: "BUSANALYST",
    skills: [
      "Problem statements and stakeholder analysis",
      "Process mapping in BPMN, and Lean process improvement",
      "Testable requirements, user stories and acceptance criteria",
      "Business cases, KPIs and acceptance testing",
      "Measuring problems with Excel and SQL",
      "Reporting in Power BI",
    ],
    stages: [
      {
        title: "Foundation",
        summary: "What business analysts do, and the data basics every BA needs.",
        items: [
          { kind: "course", courseId: "business-analysis-fundamentals", why: "Problems, stakeholders, processes, requirements, user stories and business cases, on a real firm's data." },
          { kind: "course", courseId: "data-analytics-foundations", why: "How to ask a good question of data and read the answer critically." },
          { kind: "course", courseId: "excel-for-data-analysis", why: "Measure the current state and build a business case in a spreadsheet." },
        ],
      },
      {
        title: "Core",
        summary: "Get your own numbers from systems, and understand how data is structured.",
        items: [
          { kind: "course", courseId: "sql-for-data-analysis", why: "Answer your own questions from a database instead of waiting for a report." },
          { kind: "course", courseId: "data-modelling", why: "Read and specify the data behind a system: entities, keys and relationships." },
          { kind: "course", courseId: "power-bi-fundamentals", why: "Specify, and build, the reports that prove a change worked." },
        ],
      },
      {
        title: "Specialist",
        summary: "Go deeper into how BAs work in modern teams.",
        items: [
          { kind: "course", courseId: "agile-business-analysis", why: "Story maps, splitting, refinement, WSJF, velocity forecasts and pilots, inside a Scrum team." },
          { kind: "course", courseId: "process-improvement-bpmn-lean", why: "BPMN, event logs, value streams, bottlenecks and root causes, on a real port clearance process." },
        ],
      },
      {
        title: "Projects",
        summary: "Portfolio work that shows you can analyse a real problem end to end.",
        items: [
          { kind: "project", projectId: "law-firm-operations", why: "Measure a law firm's workload, court delays and unpaid bills." },
          { kind: "project", projectId: "logistics-operations", why: "Find the late routes and the customers who owe money." },
        ],
      },
      {
        title: "Career",
        summary: "Turn your skills into applications that get interviews.",
        items: [
          { kind: "course", courseId: "career-essentials", why: "An ATS-friendly CV and a LinkedIn profile recruiters can find." },
          { kind: "course", courseId: "build-your-student-portfolio", why: "One link that shows your analysis packs and projects.", required: false },
          { kind: "course", courseId: "get-your-first-internship", why: "Find, apply for and interview for your first role.", required: false },
        ],
      },
    ],
  },
  {
    id: "data-scientist",
    slug: "data-scientist",
    title: "Become a Data Scientist",
    outcome: "Get job-ready as a junior data scientist",
    summary:
      "The route to a junior data scientist role. Build the analyst's foundations (statistics, SQL and Python), then learn to build, test and explain machine learning models on realistic Nigerian business data, and to use them responsibly. Data science jobs ask for more than models: they ask for clean data, honest evaluation and results a business can act on, which is what this track teaches.",
    badge: "CloudTech Data Scientist",
    badgeCode: "DATASCIENTIST",
    skills: [
      "Statistics: distributions, confidence intervals and tests",
      "Data wrangling in SQL and pandas",
      "Regression and classification with scikit-learn",
      "Cross-validation, tuning and honest evaluation",
      "Cost-based decisions, explanation and fairness",
      "Communicating models to non-technical decision-makers",
    ],
    stages: [
      {
        title: "Foundation",
        summary: "The statistics and Python every data scientist relies on.",
        items: [
          { kind: "course", courseId: "statistics-for-data-analysis", why: "Distributions, sampling, confidence intervals and tests: the language of uncertainty." },
          { kind: "course", courseId: "python-for-data-analytics", why: "pandas for loading, cleaning, reshaping and exploring data." },
          { kind: "course", courseId: "sql-for-data-analysis", why: "Get your own data out of databases." },
        ],
      },
      {
        title: "Core",
        summary: "Build and evaluate models properly.",
        items: [
          { kind: "course", courseId: "machine-learning-fundamentals", why: "Regression and classification with scikit-learn, from baselines to cost-based thresholds and model cards." },
          { kind: "course", courseId: "advanced-sql", why: "Window functions, cohorts and data quality checks for building features.", required: false },
          { kind: "course", courseId: "feature-engineering-model-evaluation", why: "Point-in-time features, time-based validation, calibration, lift and drift, on a mobile wallet's churn." },
        ],
      },
      {
        title: "Specialist",
        summary: "Go further into the methods data science teams use.",
        items: [
          { kind: "upcoming", title: "Time Series Forecasting", why: "Forecast demand and sales with seasonality, trends and honest backtesting.", level: 3 },
          { kind: "course", courseId: "experimentation-ab-testing", why: "Design tests, size samples, catch broken splits and read results without fooling yourself." },
        ],
      },
      {
        title: "Projects",
        summary: "Portfolio work that shows you can take a model from data to decision.",
        items: [
          { kind: "project", projectId: "employee-analytics", why: "Who leaves, when, and why: a natural first prediction problem." },
          { kind: "project", projectId: "sales-performance", why: "Explore drivers of revenue before modelling them." },
        ],
      },
      {
        title: "Career",
        summary: "Turn your skills into applications that get interviews.",
        items: [
          { kind: "course", courseId: "career-essentials", why: "An ATS-friendly CV and a LinkedIn profile recruiters can find." },
          { kind: "course", courseId: "build-your-student-portfolio", why: "One link that shows your notebooks and model cards.", required: false },
        ],
      },
    ],
  },
  {
    id: "career-study-skills",
    slug: "career-study-skills",
    title: "Career & Study Skills",
    outcome: "Study, research and present yourself like a professional",
    summary:
      "The practical skills that sit under every career: using AI honestly and well, researching and citing properly, everyday digital tools, and a CV, LinkedIn profile and portfolio that get you noticed. Short courses you can finish alongside school or work.",
    badge: "CloudTech Career Ready",
    badgeCode: "CAREERREADY",
    skills: ["Using AI assistants well and honestly", "Research and referencing", "Professional email and digital tools", "CV, LinkedIn and portfolio"],
    stages: [
      {
        title: "Study smarter",
        summary: "Learn faster and research properly.",
        items: [
          { kind: "course", courseId: "chatgpt-for-students", why: "Use AI to understand and practise, within your school's rules." },
          { kind: "course", courseId: "research-skills-for-students", why: "Find good sources, judge them and cite them." },
          { kind: "course", courseId: "digital-skills-for-students", why: "Files, Google Workspace, professional email and staying safe online." },
        ],
      },
      {
        title: "Work smarter",
        summary: "The everyday productivity skills employers notice.",
        items: [
          { kind: "course", courseId: "ai-productivity-fundamentals", why: "Prompting, Claude, ChatGPT and presentations, with your judgement in charge." },
          { kind: "course", courseId: "design-content-essentials", why: "Content, Canva and short videos that look professional.", required: false },
        ],
      },
      {
        title: "Get hired",
        summary: "Present yourself well and land your first role.",
        items: [
          { kind: "course", courseId: "career-essentials", why: "An ATS-friendly CV, a LinkedIn profile and quick Excel analysis." },
          { kind: "course", courseId: "build-your-student-portfolio", why: "Show your work in one link." },
          { kind: "course", courseId: "get-your-first-internship", why: "Find opportunities, apply well and ace the interview." },
          { kind: "course", courseId: "freelancing-for-beginners", why: "Earn from a skill you already have.", required: false },
        ],
      },
    ],
  },
];

/** Courses a learner must complete to earn a track's badge. */
export const requiredCourses = (track: Track) =>
  track.stages.flatMap((s) => s.items).filter((i): i is Extract<TrackItem, { kind: "course" }> => i.kind === "course" && i.required !== false).map((i) => i.courseId);
