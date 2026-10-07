import type { ProjectDef } from "../types";

export const POA_PROJECT: ProjectDef = {
  id: "poa-office-admin-toolkit",
  courseId: "professional-office-administration",
  title: "An office administration toolkit",
  required: true,
  summary: "A toolkit of templates, checklists and procedures that helps a real or realistic office run smoothly.",
  brief: `Choose an office you know (or invent a realistic one with 5 to 30 staff) and build the toolkit a new administrator could use on their first day: communication templates, a time and diary system, a filing and records plan, a simple spreadsheet and presentation outline, meeting, event and travel checklists, and office management procedures.

Keep everything professional and confidential, and do not use real people's private information. Submit a link to your toolkit (a shared document, PDF or folder) and paste your **office profile and priorities** and your **filing structure and naming convention** below, with a short note on where to find each part.

Write for the manager or owner who will approve using it: lead with a one-page summary, make the templates usable on their own and check every figure and formula.`,
  tasks: [
    "Office profile and the top three administrative problems the toolkit fixes.",
    "Communication templates: an email, a formal letter outline, a phone message form, a memo and meeting minutes.",
    "Time and diary system: a daily to-do format, a weekly diary routine and a follow-up system.",
    "Filing and records: a folder structure, a naming convention with examples, confidentiality rules and a retention schedule (with a note to confirm current law).",
    "Software: a simple spreadsheet (with formulas written out) and a three-slide presentation outline.",
    "Meetings, events and travel: a standard agenda, an event checklist with a budget and a travel booking checklist.",
    "Office management: a supplies list with reorder levels, a vendor comparison method, a petty cash procedure and a safety checklist.",
  ],
  datasets: [],
  rubric: [
    "The office profile is specific and the toolkit addresses the stated problems.",
    "Communication templates are clear, polite and ready to use.",
    "The time and diary system is practical and includes follow-up.",
    "Filing, naming and confidentiality rules are consistent and secure, with retention flagged for confirmation.",
    "Spreadsheet formulas and calculations are correct, and slides follow good design rules.",
    "Meeting, event and travel tools are complete and the budgets add up.",
    "Supplies, vendor, petty cash and safety procedures are controlled and realistic.",
  ],
};
