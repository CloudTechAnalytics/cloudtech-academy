import type { ProjectDef } from "../types";

export const CSCM_PROJECT: ProjectDef = {
  id: "cscm-service-improvement-plan",
  courseId: "customer-service-client-management",
  title: "A service improvement plan",
  required: true,
  summary: "Review a real or realistic service, find its problems with evidence and write a plan with standards, scripts, systems, metrics and a rollout.",
  brief: `Choose a service you can examine, such as the front desk of a business you know, a shop's WhatsApp customer care, a reception, a delivery support line or a service you use as a customer. If you cannot get real data, create a realistic scenario with sensible numbers and say so.

Submit a link to your plan (a shared document, PDF or folder) and paste your **diagnosis** (the top three problems with root causes) and your **new service standards** below, with a short note on where to find each part.

Write for the owner or manager who must approve the plan: lead with a one-page summary, show the evidence and be honest about what you assumed.`,
  tasks: [
    "The service and its customers, channels, current standards and expectations.",
    "Evidence of the problems from at least four sources, with figures.",
    "Diagnosis: the top three problems ranked, with root causes and the cost of leaving them.",
    "Improvements: new service standards, scripts or templates, a ticket and records system and an escalation matrix.",
    "Measurement: metrics and targets, a feedback method and a review schedule.",
    "Rollout: owners, timeline, training, cost and the expected benefit in naira.",
  ],
  datasets: [],
  rubric: [
    "The service, customers and channels are described clearly and specifically.",
    "Evidence comes from several sources and includes figures; assumptions are stated honestly.",
    "Problems are ranked sensibly and root causes are identified, not just symptoms.",
    "Standards are measurable, scripts are natural and customer-focused and the ticket system and escalation matrix are workable.",
    "Metrics and targets are tied to the problems and can actually be collected.",
    "The rollout is realistic, with owners, dates, a cost and a credible benefit.",
  ],
};
