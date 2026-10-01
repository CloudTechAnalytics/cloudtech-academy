import type { ProjectDef } from "../types";

export const ABT_PROJECT: ProjectDef = {
  id: "abt-paystream-review",
  courseId: "experimentation-ab-testing",
  title: "Paystream: experiment review and next test",
  required: true,
  summary: "Review four product experiments for soundness and results, make three decisions with evidence, and design the next test properly.",
  brief: `Paystream's leadership will decide whether to roll out the new signup flow, raise the transfer fee and expand cash-out agents, and wants to know whether the banner result can be trusted. Review all four experiments and design the follow-up fee test.

Work in Google Colab with the experiments dataset. Submit a link to your notebook (shared so anyone with the link can view it), and paste your **verdicts** and your **follow-up test design** below.`,
  tasks: [
    "Health checks for every experiment: sample ratio mismatch, balance of the groups and duration.",
    "Onboarding: the KYC effect with a confidence interval, the transaction and value effects (handling skew), and the platform result with its mechanism.",
    "Segments: the regional results with a multiple-comparisons correction, and what can and can't be concluded.",
    "Banner: why the result can't be trusted (split and novelty), and how to rerun it.",
    "Fee: every metric with its effect and test, the trade-off valued in naira under at least two churn scenarios, and a decision.",
    "Agents: a difference-in-differences estimate with a parallel-trends check and a placebo test.",
    "The follow-up fee test: hypothesis, variants, primary metric, guardrails, MDE, sample size and duration.",
  ],
  datasets: ["experiments"],
  rubric: [
    "Every experiment is checked for soundness before its results are used.",
    "Effects are reported with confidence intervals and translated into business terms.",
    "Skewed metrics are handled with medians, capping or a bootstrap.",
    "Segment results are corrected for multiple comparisons and only trusted with a mechanism.",
    "Guardrails are valued, uncertainty about longer-term effects is made explicit, and decisions follow from it.",
    "The non-randomised rollout is analysed with difference-in-differences and its assumption is tested.",
    "The follow-up design states its metric, MDE, sample size and duration before any data is seen.",
  ],
};
