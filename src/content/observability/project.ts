import type { ProjectDef } from "../types";

export const SRE_PROJECT: ProjectDef = {
  id: "sre-tallybook-reliability-review",
  courseId: "observability-site-reliability",
  title: "Tallybook's reliability review",
  required: true,
  summary: "A reliability review that proves the cause of a company's month-end outages from metrics, logs and traces, and sets SLOs, burn-rate alerts, a capacity plan and an error budget policy.",
  brief: `Tallybook's board has heard three explanations for the month-end outages. Give them one, proved with telemetry, and the plan that prevents a repeat.

Work in Google Colab with the observability dataset (https://academy.cloudtechanalytics.com/datasets/observability/: metrics.csv, db_pool.csv, daily_sli.csv, spans.csv, alerts.csv, toil.csv and app_logs.jsonl). Submit a link to your notebook (shared so anyone with the link can view it), and paste your **evidence table**, your **SLOs and alert rules** and your **executive summary** below, followed by a short note on where each task is answered.`,
  tasks: [
    "Metrics: the outage's start and end, and the golden signals for each service before and during it.",
    "Logs: the events that started and ended the incident, with timestamps.",
    "Traces: where time went in normal and incident requests, and how many failed.",
    "SLOs: the SLIs and objectives, August's results, and how much error budget each day used.",
    "Alerting: burn-rate rules tested on 31 August, and keep, ticket, dashboard or delete decisions for every existing alert.",
    "Capacity: connection demand from Little's law, the pool size for next month-end, and how the bulk job is isolated.",
    "Toil and policy: toil measured and the first reductions, an error budget policy, and an executive summary.",
  ],
  datasets: ["observability"],
  rubric: [
    "The cause is proved with all three kinds of telemetry, and earlier explanations are reconciled.",
    "Percentiles are used for latency, and saturation is identified correctly.",
    "SLIs measure what users experience, and the error budget arithmetic is right.",
    "Alerts page on symptoms with burn rates, and noisy alerts are removed with evidence.",
    "Capacity is sized with Little's law, headroom and isolation.",
    "Toil is measured and the error budget policy is specific and agreed.",
    "The summary is clear to a non-technical board.",
  ],
};
