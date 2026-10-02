import type { AssessmentDef } from "../types";

/**
 * Final assessment for Cloud Fundamentals: Cost, Scaling and Reliability. Scenario questions on
 * service models, billing, rightsizing, waste, pricing, scaling, availability, access and governance.
 */
export const CLD_ASSESSMENT: AssessmentDef = {
  id: "cloud-fundamentals-cost-reliability-final",
  courseId: "cloud-fundamentals-cost-reliability",
  title: "Cloud Fundamentals: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "cldq01",
      prompt: "A storage bucket of customer files is left public. Under the shared responsibility model, who is responsible?",
      options: ["The cloud provider", "The customer, who configured the bucket", "Nobody", "The customer's bank"],
      answer: 1,
      explanation: "You secure what you configure.",
    },
    {
      id: "cldq02",
      prompt: "Why must every resource carry a team tag?",
      options: ["Providers charge less for tagged resources", "So costs can be allocated to an owner who is accountable for them", "Tags make servers faster", "For backups"],
      answer: 1,
      explanation: "Untagged spend has no owner.",
    },
    {
      id: "cldq03",
      prompt: "A server averages 12% CPU but reaches 85% every afternoon. Should it be halved in size?",
      options: ["Yes, the average is low", "No: size on peaks such as p95, and its afternoon peak would overload a smaller server", "Yes, peaks don't matter", "Delete it"],
      answer: 1,
      explanation: "Averages hide peaks.",
    },
    {
      id: "cldq04",
      prompt: "A VM was stopped months ago. What is still billed?",
      options: ["Nothing", "Its disk storage", "Its CPU", "Its region"],
      answer: 1,
      explanation: "Stopping ends compute charges, not storage.",
    },
    {
      id: "cldq05",
      prompt: "Development servers are used 7am to 6pm on weekdays. What's the biggest saving?",
      options: ["A 3-year commitment", "A schedule that stops them outside those hours", "Bigger servers", "Spot pricing for production"],
      answer: 1,
      explanation: "They're idle about two-thirds of the week.",
    },
    {
      id: "cldq06",
      prompt: "What should a 1-year commitment cover?",
      options: ["Peak month-end capacity", "The steady baseline that runs every hour, after rightsizing", "Development servers", "All servers"],
      answer: 1,
      explanation: "Never commit to what you might remove.",
    },
    {
      id: "cldq07",
      prompt: "Which work suits spot servers?",
      options: ["The only database", "Queued jobs that can be retried if a server is reclaimed", "The load balancer", "Login service"],
      answer: 1,
      explanation: "Spot capacity can be taken back at short notice.",
    },
    {
      id: "cldq08",
      prompt: "Traffic doubles on the last working days of each month. Which scaling setup fits?",
      options: ["A fixed fleet sized for the average", "Autoscaling with a target utilisation, plus scheduled scaling before month-end", "A fixed fleet sized for the peak all month", "No servers on weekends"],
      answer: 1,
      explanation: "React to the unknown; schedule for the known.",
    },
    {
      id: "cldq09",
      prompt: "An SLO of 99.9% in a 30-day month allows about how much downtime?",
      options: ["4 minutes", "43 minutes", "7 hours", "1 day"],
      answer: 1,
      explanation: "0.1% of 43,200 minutes is 43.2.",
    },
    {
      id: "cldq10",
      prompt: "The app needs a load balancer, web servers and a single-zone database at 99.5%. Adding web servers won't reach 99.9%. Why?",
      options: ["Web servers are unreliable", "Components in series multiply, and the single database alone allows more downtime than the budget", "Load balancers fail often", "It will, with enough servers"],
      answer: 1,
      explanation: "Fix the single point of failure.",
    },
    {
      id: "cldq11",
      prompt: "Which access finding should be fixed first?",
      options: ["A non-admin key 100 days old", "An administrator account of someone who left the company, still active", "A service account used daily", "A person with MFA"],
      answer: 1,
      explanation: "Full power plus nobody watching.",
    },
    {
      id: "cldq12",
      prompt: "The bill rose 25% while cost per 1,000 requests fell. What does this suggest?",
      options: ["Waste is growing", "The business grew and efficiency improved", "A billing error", "Prices rose"],
      answer: 1,
      explanation: "Unit costs separate growth from waste.",
    },
  ],
};
