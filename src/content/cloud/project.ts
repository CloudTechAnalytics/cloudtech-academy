import type { ProjectDef } from "../types";

export const CLD_PROJECT: ProjectDef = {
  id: "cld-tallybook-review",
  courseId: "cloud-fundamentals-cost-reliability",
  title: "Tallybook's cloud review",
  required: true,
  summary: "A cost, reliability and security review of a SaaS company's cloud estate, with measured savings applied in order, a reliability plan against its SLO, prioritised security fixes and a 90-day plan.",
  brief: `Tallybook's CTO and finance director want to know what to change in their cloud, in what order, what it will save and what it will fix, in a form they can share with investors.

Work in Google Colab with the cloud dataset. Submit a link to your notebook (shared so anyone with the link can view it), and paste your **savings table**, your **reliability plan** and your **executive summary** below, followed by a short note on where each task is answered.`,
  tasks: [
    "The bill: spend by service, environment and team, the untagged share, the naira cost at a stated exchange rate, and why it grew.",
    "Savings: idle and forgotten resources, rightsizing, schedules, autoscaling and commitments, applied in order without double-counting.",
    "Scaling: autoscaling rules for the web servers, tested on August's traffic, including month-end.",
    "Reliability: availability against the 99.9% SLO for each month, the design arithmetic, and the changes that remove the most downtime.",
    "Security: access and storage findings ranked by risk, with fixes and dates.",
    "Governance: tags, budgets, alerts, unit costs and a review cycle, with owners.",
    "An executive summary with a 90-day plan.",
  ],
  datasets: ["cloud"],
  rubric: [
    "The bill is explained in business terms, with ownership and currency made explicit.",
    "Every saving is calculated from the account's own data, in a sensible order, with risks stated.",
    "Scaling and rightsizing decisions use peaks, not averages, and keep headroom.",
    "Reliability is measured against the SLO, and design changes are justified by the arithmetic and the outage log.",
    "Security findings are prioritised by the damage they could do now.",
    "Governance rules are specific, measurable and owned.",
    "The summary leads with decisions and a dated plan.",
  ],
};
