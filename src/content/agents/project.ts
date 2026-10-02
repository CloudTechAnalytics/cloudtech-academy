import type { ProjectDef } from "../types";

export const AGT_PROJECT: ProjectDef = {
  id: "agt-support-agent-v3",
  courseId: "ai-agents-tool-use",
  title: "Paystream support agent: v3 design and evaluation",
  required: true,
  summary: "A safer support agent design with scoped tools, rules in code, a guarded loop, approval for risky actions and injection defences, evaluated against two recorded versions and backed by an operating plan.",
  brief: `Paystream has recorded every step of two support agent versions on 150 labelled requests. Design v3, and show with evidence that it's safer and at least as useful.

Work in Google Colab with the agents dataset. Live model calls are optional: if you use an API, keep your key in Colab's Secrets and never in the notebook. Submit a link to your notebook (shared so anyone with the link can view it), and paste your **scorecard**, your **tool list with risk levels** and your **design summary** below, followed by a short note on where each task is answered.`,
  tasks: [
    "Tools: definitions for every v3 tool, scoped to the logged-in customer, classified by risk, with the data each returns kept to what the task needs.",
    "Rules: the reversal and lost-card rules as tested functions, checked against the support lead's labels, and enforced by the tools that act.",
    "Loop: a guarded loop with a step limit, repeated-call detection, a fallback reply and a trace, tested by replaying recorded runs.",
    "Evaluation: a scorecard for v1 and v2 (accuracy by expected action, safe and unsafe errors, trajectory checks, leaks and loops).",
    "Security: the refund approval flow and the layered defences against injection through tool results, with the injected transfers checked.",
    "Cost: tokens, cost per correct resolution and latency for each version, with labelled price assumptions and the limits v3 will use.",
    "An operating plan and design summary for the head of support: monitoring, alerts, review, rollout and kill switch.",
  ],
  datasets: ["agents"],
  rubric: [
    "Tools follow least privilege: scoped, narrow, risk-classified, and returning only what's needed.",
    "Business rules live in tested code, not in the prompt, and actions enforce them.",
    "The loop has hard limits and handles failure by handing over to a person.",
    "Evaluation covers outcomes and paths, and separates safe from unsafe errors.",
    "Risky actions need a person's approval, and injection defences don't rely on the model alone.",
    "Cost is compared per correct resolution, with assumptions labelled.",
    "The operating plan names measures, thresholds, people and a gradual rollout.",
  ],
};
