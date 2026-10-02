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
          { kind: "course", courseId: "business-analyst-capstone", why: "From a vague complaint about slow claims to a board-ready decision paper, with every step evidenced." },
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
          { kind: "course", courseId: "time-series-forecasting", why: "Forecast demand with seasonality, events and honest backtests, and turn it into orders." },
          { kind: "course", courseId: "experimentation-ab-testing", why: "Design tests, size samples, catch broken splits and read results without fooling yourself." },
        ],
      },
      {
        title: "Projects",
        summary: "Portfolio work that shows you can take a model from data to decision.",
        items: [
          { kind: "project", projectId: "employee-analytics", why: "Who leaves, when, and why: a natural first prediction problem." },
          { kind: "project", projectId: "sales-performance", why: "Explore drivers of revenue before modelling them." },
          { kind: "course", courseId: "data-scientist-capstone", why: "From a vague request to a trial-tested calling policy, with fairness checks and a monitoring plan." },
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
    id: "ai-engineer",
    slug: "ai-engineer",
    title: "Become an AI Engineer",
    outcome: "Build AI features a business can trust",
    summary:
      "The route to building with generative AI professionally, not just using chatbots. Learn the Python and machine learning foundations, then build LLM features properly: prompts as specifications, validated outputs, retrieval with citations, evaluation against human labels, and the privacy, safety and cost controls that decide whether a feature can launch.",
    badge: "CloudTech AI Engineer",
    badgeCode: "AIENGINEER",
    skills: [
      "Python and pandas for AI work",
      "Machine learning evaluation: splits, recall and baselines",
      "Prompt design, structured outputs and validation",
      "Retrieval-augmented generation",
      "Evaluating LLM outputs with people and judges",
      "Privacy, prompt injection and cost control",
    ],
    stages: [
      {
        title: "Foundation",
        summary: "The Python and machine learning every AI engineer relies on.",
        items: [
          { kind: "course", courseId: "python-for-data-analytics", why: "pandas for loading, cleaning and exploring the data AI features run on." },
          { kind: "course", courseId: "statistics-for-data-analysis", why: "Sampling and uncertainty, for reading evaluation results honestly.", required: false },
          { kind: "course", courseId: "machine-learning-fundamentals", why: "Train and test splits, baselines, recall and cost-based decisions." },
        ],
      },
      {
        title: "Core",
        summary: "Build LLM features properly.",
        items: [
          { kind: "course", courseId: "generative-ai-engineering", why: "Prompts, validation, retrieval, evaluation, safety and cost, on a mobile wallet's support assistant." },
          { kind: "course", courseId: "feature-engineering-model-evaluation", why: "Calibration, drift and monitoring: the habits that keep models working after launch.", required: false },
        ],
      },
      {
        title: "Specialist",
        summary: "Go further into AI systems.",
        items: [
          { kind: "course", courseId: "ai-agents-tool-use", why: "Scoped tools, rules in code, guarded loops, approvals and injection defences, on a support agent's recorded runs." },
          { kind: "course", courseId: "llm-evaluation-safety-production", why: "Release gates, red-teaming, fair guardrails, alerts and incident response for a live assistant." },
        ],
      },
      {
        title: "Capstone",
        summary: "One LLM feature from design to production, as a portfolio piece.",
        items: [
          { kind: "course", courseId: "ai-engineer-capstone", why: "Build, evaluate, gate and monitor an insurer's WhatsApp claims assistant, in English and Pidgin." },
        ],
      },
      {
        title: "Career",
        summary: "Turn your skills into applications that get interviews.",
        items: [
          { kind: "course", courseId: "career-essentials", why: "An ATS-friendly CV and a LinkedIn profile recruiters can find." },
          { kind: "course", courseId: "build-your-student-portfolio", why: "One link that shows your notebooks and evaluation reports.", required: false },
        ],
      },
    ],
  },
  {
    id: "cloud-devops-engineer",
    slug: "cloud-devops-engineer",
    title: "Become a Cloud & DevOps Engineer",
    outcome: "Run cloud systems that are affordable, reliable and secure",
    summary:
      "The route to cloud and DevOps roles. Start by understanding what a cloud estate costs, how reliable it is and who can access it, using a real company's account data, then learn to build and ship infrastructure as code, automate testing and deployment, and keep systems running. Employers hire cloud engineers who can explain a bill and prevent an outage, not just launch servers.",
    badge: "CloudTech Cloud & DevOps Engineer",
    badgeCode: "CLOUDDEVOPS",
    skills: [
      "Cloud services, regions and shared responsibility",
      "Cost analysis, rightsizing and pricing models",
      "Autoscaling and availability design",
      "Access management and security reviews",
      "Infrastructure as code and CI/CD",
      "Monitoring, alerts and incident response",
    ],
    stages: [
      {
        title: "Foundation",
        summary: "The cloud itself, and enough code to analyse it.",
        items: [
          { kind: "course", courseId: "python-for-data-analytics", why: "pandas for analysing bills, utilisation and logs." },
          { kind: "course", courseId: "linux-networking-basics", why: "The command line, permissions, processes, SSH, ports, DNS and HTTP, learned by investigating a real-looking server." },
        ],
      },
      {
        title: "Core",
        summary: "Understand, build and ship cloud systems.",
        items: [
          { kind: "course", courseId: "cloud-fundamentals-cost-reliability", why: "Cost, rightsizing, scaling, availability and access, on a real-looking company's cloud account." },
          { kind: "course", courseId: "terraform-infrastructure-as-code", why: "Write and review infrastructure as code: plans, dangerous changes, policy checks, drift and the pipeline." },
          { kind: "course", courseId: "cicd-and-containers", why: "Dockerfiles, image scanning, secure pipelines, canary releases and the DORA measures, on six months of delivery data." },
        ],
      },
      {
        title: "Specialist",
        summary: "Keep systems running in production.",
        items: [
          { kind: "course", courseId: "llm-evaluation-safety-production", why: "Release gates, control-limit alerts and blameless postmortems, applied to a live service.", required: false },
          { kind: "course", courseId: "observability-site-reliability", why: "Metrics, logs and traces to find a real cause; SLOs, burn-rate alerts, capacity and toil to prevent the next outage." },
        ],
      },
      {
        title: "Capstone",
        summary: "One platform, made ready for its biggest day, as a portfolio piece.",
        items: [
          { kind: "course", courseId: "cloud-devops-capstone", why: "Postmortem, plan review, capacity, alerts, cost and a game day, for an online shop's sale." },
        ],
      },
      {
        title: "Career",
        summary: "Turn your skills into applications that get interviews.",
        items: [
          { kind: "course", courseId: "career-essentials", why: "An ATS-friendly CV and a LinkedIn profile recruiters can find." },
          { kind: "course", courseId: "build-your-student-portfolio", why: "One link that shows your cloud reviews and infrastructure code.", required: false },
        ],
      },
    ],
  },
  {
    id: "software-developer",
    slug: "software-developer",
    title: "Become a Software Developer",
    outcome: "Write software that's correct, tested and safe to change",
    summary:
      "The route to junior developer roles. Start with Python and Git, then learn what turns code into software: tests, debugging, validation, version control, code review and APIs, by rebuilding a real company's invoicing code. Then go further into the web, databases and delivery. Employers hire developers who can show tested, well-reviewed code, and that's what this track builds.",
    badge: "CloudTech Software Developer",
    badgeCode: "SOFTWAREDEV",
    skills: [
      "Python functions, modules and packages",
      "Automated testing with pytest",
      "Debugging and input validation",
      "Git workflow and code review",
      "Building and testing web APIs",
      "Shipping code through CI/CD",
    ],
    stages: [
      {
        title: "Foundation",
        summary: "The language and the tools every developer uses.",
        items: [
          { kind: "course", courseId: "python-for-beginners", why: "Python from the first line: variables, lists, loops and functions." },
          { kind: "course", courseId: "git-and-github-for-beginners", why: "Version control and GitHub, so your work is saved, shared and visible." },
          { kind: "course", courseId: "web-development-for-beginners", why: "HTML, CSS and a first website published with GitHub Pages.", required: false },
          { kind: "course", courseId: "linux-networking-basics", why: "The command line, files, processes and HTTP that every server runs on.", required: false },
        ],
      },
      {
        title: "Core",
        summary: "From code that works once to software a team can trust.",
        items: [
          { kind: "course", courseId: "software-engineering-with-python", why: "Tests, debugging, validation, Git, code review and an API, on a company's invoicing code." },
          { kind: "course", courseId: "sql-for-data-analysis", why: "Query the databases your applications store data in.", required: false },
        ],
      },
      {
        title: "Specialist",
        summary: "Build for the web and ship safely.",
        items: [
          { kind: "course", courseId: "web-development-with-javascript", why: "An accessible, responsive payment page with exact money, validation, fetch and tests." },
          { kind: "course", courseId: "databases-and-apis-for-developers", why: "Schemas, constraints, transactions, migrations and a tested REST API, on a real company's invoicing data." },
          { kind: "course", courseId: "cicd-and-containers", why: "Containers, pipelines and safe releases for the code you write.", required: false },
        ],
      },
      {
        title: "Career",
        summary: "Turn your skills into applications that get interviews.",
        items: [
          { kind: "course", courseId: "career-essentials", why: "An ATS-friendly CV and a LinkedIn profile recruiters can find." },
          { kind: "course", courseId: "build-your-student-portfolio", why: "One link that shows your repositories, tests and projects.", required: false },
        ],
      },
    ],
  },
  {
    id: "project-manager",
    slug: "project-manager",
    title: "Become a Project Manager",
    outcome: "Plan, deliver and steer projects with evidence, not hope",
    summary:
      "The route to project coordinator and junior project manager roles. Learn to plan a project properly, give honest dates and budgets, measure progress with earned value, manage risks and changes, and report to sponsors so they can decide. Add business analysis and Agile delivery, and the data skills to back every status report with numbers.",
    badge: "CloudTech Project Manager",
    badgeCode: "PROJECTMGR",
    skills: [
      "Charters, scope and work breakdown",
      "Estimating, scheduling and the critical path",
      "Schedule risk and honest dates",
      "Earned value and forecasting",
      "Risk and change management",
      "Status reporting to sponsors",
    ],
    stages: [
      {
        title: "Foundation",
        summary: "The tools every project manager uses daily.",
        items: [
          { kind: "course", courseId: "excel-for-data-analysis", why: "Budgets, trackers and status data in spreadsheets." },
          { kind: "course", courseId: "python-for-data-analytics", why: "pandas for schedules, earned value and simulations at any size.", required: false },
        ],
      },
      {
        title: "Core",
        summary: "Plan, deliver and steer a project.",
        items: [
          { kind: "course", courseId: "project-management-fundamentals", why: "Scope, estimates, the critical path, simulation, earned value, risk and change control on a depot launch." },
          { kind: "course", courseId: "business-analysis-fundamentals", why: "Requirements and stakeholders: what the project must deliver and for whom." },
          { kind: "course", courseId: "agile-business-analysis", why: "Backlogs, user stories and sprints for projects delivered iteratively." },
        ],
      },
      {
        title: "Specialist",
        summary: "Go further into delivery and products.",
        items: [
          { kind: "course", courseId: "process-improvement-bpmn-lean", why: "Map and improve the processes projects change.", required: false },
          { kind: "course", courseId: "product-management-fundamentals", why: "Outcomes, user evidence, funnels, RICE, roadmaps and honest launch measurement for a mobile wallet." },
        ],
      },
      {
        title: "Career",
        summary: "Turn your skills into applications that get interviews.",
        items: [
          { kind: "course", courseId: "career-essentials", why: "An ATS-friendly CV and a LinkedIn profile recruiters can find." },
          { kind: "course", courseId: "build-your-student-portfolio", why: "One link that shows your project reviews and plans.", required: false },
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
