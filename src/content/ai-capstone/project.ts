import type { ProjectDef } from "../types";

export const AIC_PROJECT: ProjectDef = {
  id: "aic-shieldline-claims-assistant",
  courseId: "ai-engineer-capstone",
  title: "Shieldline's WhatsApp claims assistant",
  required: true,
  summary: "An end-to-end LLM feature for an insurer: validated extraction, rules in code, retrieval and grounded answers, a judged evaluation, red-teaming with fairness checks, a release gate with cost and latency, and production monitoring with an incident.",
  brief: `Shieldline's head of claims needs to decide whether the WhatsApp claims assistant can go live everywhere, and how it will be kept safe. Give them the evaluation and the plan.

Work in Google Colab with the assistant dataset (https://academy.cloudtechanalytics.com/datasets/assistant/: messages.csv, policy.csv, questions.csv, redteam.csv and daily.csv). Live model calls are optional: everything can be done from the recorded outputs. Submit a link to your notebook (shared so anyone with the link can view it), and paste your **release decision** and **executive summary** below, followed by a short note on where each part is.`,
  tasks: [
    "Design: what the model does, what code decides, when a person takes over, and what the assistant must never do.",
    "Extraction: a validator with safe repairs and a grounding check, and field accuracy for each configuration overall and in Pidgin.",
    "Rules: escalation rules with a fail-safe, their recall and cost, and the document checklist built from the policy.",
    "Retrieval and answers: hit at 3 against a keyword baseline, answer grades with and without retrieval, and how far the LLM judge can be trusted.",
    "Safety: red-team results for both guardrails by category, and false positives by language and for angry customers.",
    "Release gate: cost, p95 latency and every requirement for each configuration, and the release decision.",
    "Monitoring: control limits, the voice-note incident and its cause, and the executive summary.",
  ],
  datasets: ["assistant"],
  rubric: [
    "The design keeps decisions and rules in code, with a fail-safe and clear limits on what the model may do.",
    "Model outputs are validated and grounded before use, and accuracy is reported by field and by language.",
    "Escalation is measured by recall first, with its cost stated.",
    "Retrieval and answers are evaluated separately, and the LLM judge is checked against people on the errors that matter.",
    "Guardrails are judged on both attacks let through and genuine customers blocked, by group.",
    "The release decision follows a gate agreed in advance, covering quality, safety, latency and cost.",
    "Monitoring would catch problems, and the incident response contains, measures, fixes and prevents.",
  ],
};
