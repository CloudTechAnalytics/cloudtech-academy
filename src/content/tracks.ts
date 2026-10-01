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
      "Querying databases with SQL",
      "Data modelling and star schemas",
      "Dashboards in Power BI",
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
          { kind: "upcoming", title: "Power BI DAX", why: "Measures, filter context, CALCULATE and time intelligence in depth.", level: 3 },
        ],
      },
      {
        title: "Advanced",
        summary: "Automate and scale your analysis, and handle harder questions.",
        items: [
          { kind: "course", courseId: "python-for-data-analytics", why: "Write an analysis once and run it again in seconds, with every step on record." },
          { kind: "upcoming", title: "Advanced SQL", why: "Window functions in depth, query performance, date logic and data cleaning in SQL.", level: 3 },
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
          { kind: "upcoming", title: "Capstone: End-to-End Business Intelligence Project", why: "From raw data to a reviewed dashboard and written recommendations.", level: 4 },
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
