import type { ProjectDef } from "../types";

export const HRPM_PROJECT: ProjectDef = {
  id: "hrpm-starter-pack",
  courseId: "human-resources-people-management",
  title: "An HR starter pack",
  required: true,
  summary: "An HR starter pack for a small business: workforce plan, recruitment kit, onboarding, performance and training, pay, procedures and policies, and compliance and metrics.",
  brief: `Choose a small company you know (or invent a realistic one with 10 to 40 employees) and build the HR starter pack a new HR officer or business owner would use in the first weeks.

Use realistic figures, and flag where laws and statutory rates must be confirmed. Submit a link to your pack (a shared document, PDF or folder) and paste your **one-page summary** and your **annual payroll cost** below, with a short note on where to find each part.

Write for the owner or managing director who will approve it: lead with the summary, make the tools easy to use and show that the parts fit together.`,
  tasks: [
    "Company profile and the top three people problems the pack addresses.",
    "Workforce plan: organisation chart, headcount by role and an annual payroll budget with employer pension.",
    "Recruitment kit for one key role: job description, advert, structured interview questions and a scoring sheet.",
    "Onboarding and probation: an induction checklist and a 30-60-90 day plan.",
    "Performance and development: goals and appraisal approach, a feedback model and a costed training plan.",
    "Reward and payroll: a pay grade table, a benefits summary and a payroll worksheet for one employee, with a note to confirm statutory rates.",
    "Employee relations and policies: grievance and disciplinary outlines and two policies written in full.",
    "Compliance, records and metrics: a compliance calendar, an employee register design and five HR metrics with targets.",
  ],
  datasets: [],
  rubric: [
    "The company profile and people priorities are specific and the pack addresses them.",
    "The workforce plan and payroll budget are calculated correctly and include employer costs.",
    "The recruitment kit is fair, structured and based on a clear job description.",
    "Onboarding and probation plans are practical, with measurable objectives.",
    "Performance, training and reward tools are consistent with each other and costed.",
    "Procedures and policies follow fair process and are written clearly.",
    "Compliance and metrics are specific, the legal points are flagged for confirmation, and the whole pack is consistent.",
  ],
};
