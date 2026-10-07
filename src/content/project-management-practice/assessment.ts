import type { AssessmentDef } from "../types";

const C = "project-management";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });

const check = (n: number, title: string, questions: Q[]): AssessmentDef => ({
  id: `pmgt-m${String(n).padStart(2, "0")}-check`,
  courseId: C,
  kind: "module",
  moduleId: `pmgt-m${String(n).padStart(2, "0")}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/** Project Management: a check for each module (it awards the module badge) and a final assessment. */
export const PMGT_ASSESSMENTS: AssessmentDef[] = [
  check(1, "Project Management Fundamentals", [
    q("pmgt-m01-q1", "Which is a project rather than operations?", ["Running the shop every day", "Opening a new shop branch", "Monthly payroll", "Answering customer calls"], 1, "A project is temporary and creates a unique result."),
    q("pmgt-m01-q2", "What are the three constraints of the triple constraint?", ["Scope, time and cost", "People, place and price", "Risk, quality and speed only", "Plan, do and check"], 0, "Scope, time and cost are linked."),
    q("pmgt-m01-q3", "Which process group runs throughout the project?", ["Initiating", "Closing", "Monitoring and controlling", "Planning only"], 2, "Monitoring and controlling continues across the lifecycle."),
    q("pmgt-m01-q4", "A method that suits unclear, changing requirements is usually:", ["Traditional", "Agile", "Neither", "No plan"], 1, "Agile adapts through short cycles."),
    q("pmgt-m01-q5", "A project manager mainly:", ["Does all the technical work", "Leads the project to its goals and balances constraints", "Only reports", "Only buys"], 1, "The PM leads and coordinates delivery."),
  ]),
  check(2, "Initiating a Project", [
    q("pmgt-m02-q1", "A ₦6,000,000 project saves ₦2,400,000 a year. What is the payback?", ["1.5 years", "2 years", "2.5 years", "3 years"], 2, "6 ÷ 2.4 = 2.5."),
    q("pmgt-m02-q2", "What does the project charter do?", ["Lists the tasks", "Formally authorises the project and the project manager's authority", "Closes the project", "Records risks only"], 1, "The sponsor issues it to authorise the project."),
    q("pmgt-m02-q3", "A stakeholder with high power and high interest should be:", ["Monitored", "Kept informed", "Managed closely", "Ignored"], 2, "Manage closely."),
    q("pmgt-m02-q4", "Which objective is SMART?", ["Improve service", "Cut response time from 24 to 4 hours by 30 June within ₦3 million", "Be better", "Work hard"], 1, "It has numbers, a time frame and a limit."),
    q("pmgt-m02-q5", "Is stopping a project that does not make sense a failure?", ["Yes", "No, it can save money and effort", "Only for large projects", "Always"], 1, "A good no-go decision is a success."),
  ]),
  check(3, "Scope and Planning", [
    q("pmgt-m03-q1", "In MoSCoW, 'Won't' means:", ["Never ever", "Agreed to be out of scope this time", "Must do", "Optional"], 1, "Won't have this time protects scope."),
    q("pmgt-m03-q2", "What is the 100% rule of a WBS?", ["It must have 100 items", "It includes all the work in scope and nothing outside it", "It must be 100 pages", "Each task is 100 hours"], 1, "The WBS covers the whole scope."),
    q("pmgt-m03-q3", "Why include exclusions in the scope statement?", ["They are optional decoration", "They prevent scope creep", "They add cost", "They are legal text"], 1, "Exclusions set boundaries."),
    q("pmgt-m03-q4", "A work package is:", ["The whole project", "A piece of work small enough to estimate and assign", "A contract", "A report"], 1, "The lowest level of the WBS."),
    q("pmgt-m03-q5", "Which requirement is testable?", ["The system should be fast", "Order confirmation appears within 3 seconds", "Make it nice", "Users will love it"], 1, "It has a measurable test."),
  ]),
  check(4, "Schedule Management", [
    q("pmgt-m04-q1", "A 3 days; B 4 and C 6 after A; D 2 after B and C. What is the project duration?", ["9 days", "11 days", "13 days", "15 days"], 1, "A-C-D = 3 + 6 + 2 = 11."),
    q("pmgt-m04-q2", "In that network, how much float does B have?", ["0 days", "2 days", "4 days", "6 days"], 1, "11 − 9 = 2."),
    q("pmgt-m04-q3", "O = 4, M = 6, P = 14. What is the PERT expected duration?", ["6", "7", "8", "9"], 1, "(4 + 24 + 14) ÷ 6 = 7."),
    q("pmgt-m04-q4", "To shorten the project you should shorten:", ["Any activity", "Critical-path activities", "Non-critical activities only", "Milestones"], 1, "Only the critical path sets duration."),
    q("pmgt-m04-q5", "What is resource levelling?", ["Making all tasks equal", "Adjusting the schedule so demand on people and equipment is realistic", "Cutting scope only", "Hiring more managers"], 1, "It fixes overloads."),
  ]),
  check(5, "Cost and Budget Management", [
    q("pmgt-m05-q1", "Base cost ₦4,500,000 plus 10% contingency is:", ["₦4,550,000", "₦4,950,000", "₦5,000,000", "₦5,400,000"], 1, "4,500,000 × 1.1."),
    q("pmgt-m05-q2", "BAC ₦1,000,000. 40% is done and ₦500,000 spent. What is the CPI?", ["0.4", "0.8", "1.0", "1.25"], 1, "EV 400,000 ÷ AC 500,000 = 0.8."),
    q("pmgt-m05-q3", "With CPI 0.8 and BAC ₦1,000,000, what is the EAC?", ["₦800,000", "₦1,000,000", "₦1,250,000", "₦1,500,000"], 2, "1,000,000 ÷ 0.8."),
    q("pmgt-m05-q4", "SPI below 1 means:", ["Ahead of schedule", "Behind schedule", "On budget", "Over budget"], 1, "Less value earned than planned."),
    q("pmgt-m05-q5", "Why report cost problems early?", ["To look busy", "Sponsors can help with small problems; large ones are harder to fix", "It is a rule only", "To save paper"], 1, "Early reporting preserves options."),
  ]),
  check(6, "Risk Management", [
    q("pmgt-m06-q1", "What is the difference between a risk and an issue?", ["None", "A risk is uncertain future; an issue is a problem already happening", "An issue is uncertain", "A risk is always positive"], 1, "Issues have already occurred."),
    q("pmgt-m06-q2", "Probability 4 and impact 4 give a score of:", ["8", "12", "16", "20"], 2, "4 × 4."),
    q("pmgt-m06-q3", "A 20% chance of a ₦3,000,000 overrun has an EMV of:", ["₦300,000", "₦600,000", "₦900,000", "₦3,000,000"], 1, "0.2 × 3,000,000."),
    q("pmgt-m06-q4", "Buying insurance for a risk is:", ["Avoid", "Mitigate", "Transfer", "Accept"], 2, "Insurance transfers the risk."),
    q("pmgt-m06-q5", "Why name an owner for each risk?", ["For decoration", "So someone monitors it and acts", "To blame them", "It is optional"], 1, "Ownership drives action."),
  ]),
  check(7, "Quality, Procurement and Change", [
    q("pmgt-m07-q1", "What is quality control?", ["Checking the process only", "Checking the results against the standard", "Writing the plan", "Buying materials"], 1, "QC inspects deliverables."),
    q("pmgt-m07-q2", "Which contract suits a clear, stable scope?", ["Time and materials", "Fixed-price", "Cost-plus", "None"], 1, "Fixed-price suits a defined scope."),
    q("pmgt-m07-q3", "A change adds ₦300,000 to a ₦4,950,000 budget. What is the new budget?", ["₦5,000,000", "₦5,250,000", "₦5,300,000", "₦5,500,000"], 1, "4,950,000 + 300,000."),
    q("pmgt-m07-q4", "What is scope creep?", ["Planned growth", "Uncontrolled growth of scope after the project starts", "A kind of risk response", "A report"], 1, "Unmanaged additions."),
    q("pmgt-m07-q5", "What is the right way to treat small extra requests?", ["Agree informally", "Log them and assess impact through change control", "Refuse all", "Ignore them"], 1, "Small unlogged changes add up."),
  ]),
  check(8, "People, Teams and Stakeholders", [
    q("pmgt-m08-q1", "In a RACI chart, who owns the result?", ["Responsible", "Accountable", "Consulted", "Informed"], 1, "Accountable: one person."),
    q("pmgt-m08-q2", "In which team stage is there disagreement about roles?", ["Forming", "Storming", "Norming", "Performing"], 1, "Storming."),
    q("pmgt-m08-q3", "Which conflict approach works best for important issues?", ["Avoid", "Force", "Collaborate and problem-solve", "Accommodate"], 2, "Collaboration gives the best long-term result."),
    q("pmgt-m08-q4", "A good communication plan states:", ["Only the date", "Who needs what, when, how and from whom", "Only the owner", "Nothing"], 1, "It covers audience, content, frequency, method and owner."),
    q("pmgt-m08-q5", "What should meeting minutes list?", ["Every word said", "Decisions and actions with owners and dates", "Only attendees", "Jokes"], 1, "Minutes record decisions and actions."),
  ]),
  check(9, "Agile and Hybrid Delivery", [
    q("pmgt-m09-q1", "Sprint results 20, 24 and 22 points. What is the velocity?", ["20", "22", "24", "66"], 1, "66 ÷ 3 = 22."),
    q("pmgt-m09-q2", "A 110-point backlog at 22 points a sprint needs:", ["4 sprints", "5 sprints", "6 sprints", "10 sprints"], 1, "110 ÷ 22 = 5."),
    q("pmgt-m09-q3", "Who prioritises the product backlog in Scrum?", ["The Scrum Master", "The Product Owner", "The Development Team", "The sponsor only"], 1, "The Product Owner decides value order."),
    q("pmgt-m09-q4", "What does a Kanban WIP limit do?", ["Adds work", "Limits work in progress to reveal bottlenecks and reduce multitasking", "Sets the price", "Ends the project"], 1, "WIP limits improve flow."),
    q("pmgt-m09-q5", "A hybrid approach:", ["Uses no plan", "Combines traditional and agile where each fits", "Is only for software", "Cannot be used"], 1, "Mix methods by need."),
  ]),
  check(10, "Execution, Monitoring and Reporting", [
    q("pmgt-m10-q1", "What does an Amber RAG status mean?", ["On track", "At risk, with a plan", "Off track and failed", "Finished"], 1, "Amber signals risk with a recovery plan."),
    q("pmgt-m10-q2", "What is 'crashing' the schedule?", ["Cancelling the project", "Adding resources to critical activities to shorten them", "Delaying work", "Cutting quality"], 1, "Crashing adds resources to save time."),
    q("pmgt-m10-q3", "Option: ₦150,000 saves 4 days. What is the cost per day saved?", ["₦30,000", "₦37,500", "₦40,000", "₦150,000"], 1, "150,000 ÷ 4."),
    q("pmgt-m10-q4", "Why report bad news early?", ["To avoid work", "It gives time and options and protects trust", "To worry people", "It is optional"], 1, "Early reporting preserves options."),
    q("pmgt-m10-q5", "The '90% done' syndrome is solved by:", ["Ignoring it", "Small tasks with clear completion rules", "Longer meetings", "More reports"], 1, "Clear completion rules reveal true progress."),
  ]),
  check(11, "Closing and Learning", [
    q("pmgt-m11-q1", "When is a project truly finished?", ["When work is done", "When the result is accepted and handed over", "When money runs out", "When the team is tired"], 1, "Acceptance and handover finish a project."),
    q("pmgt-m11-q2", "What is a snag list?", ["A list of suppliers", "A list of defects to fix before acceptance", "A budget", "A schedule"], 1, "It tracks remaining defects."),
    q("pmgt-m11-q3", "A good lessons-learned entry is:", ["We were late", "Order imported equipment 8 weeks early because customs time was missing from estimates", "Everything was bad", "Nothing to report"], 1, "Specific and actionable."),
    q("pmgt-m11-q4", "Why hold lessons learned in a blame-free setting?", ["To avoid work", "People share honestly and the causes are found", "It is required by law", "To save time"], 1, "Blame hides the truth."),
    q("pmgt-m11-q5", "Where should closure records go?", ["Deleted", "Archived in an organised, accessible place", "Left on a laptop", "Burned"], 1, "Archive for audits and future projects."),
  ]),
  check(12, "Final Project: A Complete Project Plan", [
    q("pmgt-m12-q1", "How should the plan open for the sponsor?", ["With the full WBS", "With a one-page summary of goal, deliverables, time, cost, risks and decision needed", "With the risk register", "With the lessons"], 1, "Sponsors need the summary first."),
    q("pmgt-m12-q2", "Which check shows the plan hangs together?", ["Budget matches WBS, schedule matches milestones, risks reflected in contingency", "It has many pages", "It has colours", "It has a logo"], 0, "Consistency across parts."),
    q("pmgt-m12-q3", "Paths A-C-F-G-H = 18 days and A-D-E-G-H = 25 days. What is the float of path A-C-F-G-H?", ["0 days", "7 days", "18 days", "25 days"], 1, "25 − 18 = 7."),
    q("pmgt-m12-q4", "Base cost ₦445,000 plus 10% contingency is:", ["₦489,500", "₦490,000", "₦500,000", "₦534,000"], 0, "445,000 × 1.1 = 489,500."),
    q("pmgt-m12-q5", "Why prepare for sponsor questions?", ["To avoid work", "To give honest, evidence-based answers", "To argue", "To save time"], 1, "Preparation builds credibility."),
  ]),
  {
    id: `${C}-final`,
    courseId: C,
    kind: "final",
    title: "Project Management: final assessment",
    passingScore: 60,
    questions: [
      q("pmgt-f01", "Which is the best description of a project?", ["Ongoing routine work", "A temporary effort to create a unique result", "A department", "A budget"], 1, "Temporary and unique."),
      q("pmgt-f02", "A project costs ₦6m and saves ₦2.4m a year. What is the 3-year ROI?", ["10%", "20%", "30%", "40%"], 1, "(7.2 − 6) ÷ 6 = 20%."),
      q("pmgt-f03", "What does a scope statement's exclusion list prevent?", ["Cost", "Scope creep", "Risk", "Quality checks"], 1, "It sets boundaries."),
      q("pmgt-f04", "A 3, B 4, C 6 after A, D 2 after B and C: what is the critical path?", ["A-B-D", "A-C-D", "B-C", "A-D"], 1, "A-C-D = 11 days."),
      q("pmgt-f05", "O 4, M 6, P 14 gives a PERT estimate of:", ["6", "7", "8", "10"], 1, "(4 + 24 + 14) ÷ 6 = 7."),
      q("pmgt-f06", "Base cost ₦4.5m plus 10% contingency is:", ["₦4.9m", "₦4.95m", "₦5.0m", "₦5.4m"], 1, "4.5 × 1.1."),
      q("pmgt-f07", "EV ₦400,000 and AC ₦500,000. What is the CPI?", ["0.8", "1.0", "1.25", "0.4"], 0, "400 ÷ 500."),
      q("pmgt-f08", "Which risk response is insurance?", ["Avoid", "Mitigate", "Transfer", "Accept"], 2, "Insurance transfers risk."),
      q("pmgt-f09", "A 20% chance of a ₦3m loss has an EMV of:", ["₦300,000", "₦600,000", "₦900,000", "₦3,000,000"], 1, "0.2 × 3m."),
      q("pmgt-f10", "A change request adds 10 days and ₦300,000. What must happen first?", ["Do it", "Assess impact and get approval through change control", "Ignore it", "Cancel the project"], 1, "Use change control."),
      q("pmgt-f11", "Which meeting practice is best?", ["No agenda", "A clear purpose, an agenda, and minutes with decisions and actions", "A long chat", "No notes"], 1, "Effective meetings are structured."),
      q("pmgt-f12", "Velocity 22 and a backlog of 110 points need how many sprints?", ["4", "5", "6", "10"], 1, "110 ÷ 22."),
      q("pmgt-f13", "A project is Amber. What should the report include?", ["Nothing", "The cause, the recovery plan and any decision needed", "Only good news", "A new logo"], 1, "Amber needs a plan."),
      q("pmgt-f14", "The customer will not sign acceptance. What do you do first?", ["Close anyway", "Find out why and check against the acceptance criteria", "Delete records", "Walk away"], 1, "Understand the concern and review the criteria."),
      q("pmgt-f15", "Which is a good lessons-learned statement?", ["It was hard", "Do the structural survey in week 1 because the roof needed reinforcement late", "Nothing went well", "Blame the supplier"], 1, "Specific and actionable."),
    ],
  },
];
