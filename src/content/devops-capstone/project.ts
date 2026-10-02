import type { ProjectDef } from "../types";

export const CDC_PROJECT: ProjectDef = {
  id: "cdc-kasuwa-sale-readiness",
  courseId: "cloud-devops-capstone",
  title: "Kasuwa: sale readiness review",
  required: true,
  summary: "A full readiness review of an online shop's platform before its biggest sale: inventory, an outage postmortem, a Terraform plan review with policy checks, delivery measures, capacity planning, SLOs and alerts, cost, and a game-day-based go/no-go.",
  brief: `Kasuwa's head of engineering wants to know whether the platform is ready for this year's sale, after last year's outage. Review it, fix what matters, and give an honest go/no-go.

Work in Google Colab with the platform dataset (https://academy.cloudtechanalytics.com/datasets/platform/: resources.csv, sale_metrics.csv, sale_logs.jsonl, plan-sale-readiness.json, deployments.csv, loadtest.csv, alerts.csv and gameday.csv). Submit a link to your notebook (shared so anyone with the link can view it), and paste your **postmortem summary** and **executive summary** below, followed by a short note on where each part is.`,
  tasks: [
    "Inventory: cost by environment, what's managed by hand, and the riskiest resources, with what to fix first.",
    "Postmortem: impact, trigger, cause and mitigation of the 2025 outage from metrics and logs, and what wasn't the cause.",
    "Plan review: the actions in PR 214, policy checks in code, and a review comment with fixes.",
    "Delivery: the four DORA measures, what makes deploys fail, and the deployment policy for the sale.",
    "Capacity: a target with growth and headroom, the configuration that meets it, and why the pooler works.",
    "Reliability: the SLO and error budget, burn-rate alerts replayed against last year, and the alert clean-up.",
    "Cost and readiness: savings and costs, game-day results, the readiness checklist and a go/no-go with conditions and dates.",
  ],
  datasets: ["platform"],
  rubric: [
    "The inventory ranks risks by impact on customers, not just cost.",
    "The postmortem separates trigger from cause and rules out the popular explanations with evidence.",
    "Dangerous infrastructure changes are caught by checks in code before they're applied.",
    "Delivery rules follow from the deployment data, with small samples treated honestly.",
    "Capacity is planned on the real bottleneck, with headroom and stated assumptions.",
    "Alerts are tested against a real incident and cleaned up by their history.",
    "The go/no-go is honest, with open items owned, dated and re-tested.",
  ],
};
