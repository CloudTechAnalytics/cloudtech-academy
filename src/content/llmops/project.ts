import type { ProjectDef } from "../types";

export const OPS_PROJECT: ProjectDef = {
  id: "ops-quality-safety-plan",
  courseId: "llm-evaluation-safety-production",
  title: "Paystream's AI quality and safety plan",
  required: true,
  summary: "An evaluation and safety programme for a live AI assistant: a release decision, red-team fixes, a fair guardrail threshold, monitoring backtested on real incidents, and an incident playbook.",
  brief: `Paystream's help assistant has been live for four months, with three incidents. Two candidate releases are waiting, the red team has results, and the input guardrail needs a threshold. Write the programme that keeps the assistant accurate and safe from now on.

Work in Google Colab with the llmops dataset. Submit a link to your notebook (shared so anyone with the link can view it), and paste your **release decision**, your **monitoring backtest** and your **executive summary** below, followed by a short note on where each task is answered.`,
  tasks: [
    "Suite: a review of the regression suite's coverage and precision, with at least ten new cases from the incidents and red-team results.",
    "Releases: a paired comparison of r2 and r3 against the live release, with significance and category regressions, and an automatic gate applied to both.",
    "Red-team: attack success rates by technique, release and guardrail, and a fix list where every fix has a test.",
    "Guardrail: a threshold chosen by stated costs, with recall, precision and genuine customers blocked, and false positive rates by language with a plan for the gap.",
    "Monitoring: alerts with control limits for refusals, latency and pooled graded accuracy, backtested on the three incidents, with false alarms counted.",
    "Incidents: a playbook with severity levels, owners and safe fallbacks, and a blameless postmortem for INC-03.",
    "An executive summary for the head of support and the security lead.",
  ],
  datasets: ["llmops"],
  rubric: [
    "The suite covers categories, difficulty, refusals and safety, and its precision is stated honestly.",
    "Releases are compared case by case, regressions in critical categories are found, and the gate is applied as agreed.",
    "Red-team results are broken down by technique and defence, and turned into fixes with tests.",
    "The guardrail threshold is chosen from explicit costs, and fairness across groups is measured and acted on.",
    "Alerts are based on each metric's normal variation and are backtested against real incidents.",
    "Incident handling is prepared in advance, and the postmortem focuses on systems with owned, dated actions.",
    "The summary leads with decisions, each backed by a measurement.",
  ],
};
