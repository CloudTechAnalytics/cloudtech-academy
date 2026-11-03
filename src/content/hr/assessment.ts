import type { AssessmentDef } from "../types";

const C = "human-resources-people-management";

type Q = AssessmentDef["questions"][number];
const q = (id: string, prompt: string, options: string[], answer: number, explanation: string): Q => ({ id, prompt, options, answer, explanation });

const check = (n: number, title: string, questions: Q[]): AssessmentDef => ({
  id: `hrpm-m${String(n).padStart(2, "0")}-check`,
  courseId: C,
  kind: "module",
  moduleId: `hrpm-m${String(n).padStart(2, "0")}`,
  title: `${title}: module check`,
  passingScore: 60,
  questions,
});

/** Human Resources & People Management: a check for each module (it awards the module badge) and a final assessment. */
export const HRPM_ASSESSMENTS: AssessmentDef[] = [
  check(1, "HR Fundamentals", [
    q("hrpm-m01-q1", "Which best describes HR?", ["Only payroll", "Helping the business find, develop, reward and keep people, fairly and legally", "Only hiring", "Only discipline"], 1, "HR covers the whole employee lifecycle."),
    q("hrpm-m01-q2", "Who does most day-to-day people management?", ["HR alone", "Line managers, supported by HR", "The owner only", "Payroll"], 1, "Managers lead; HR supports."),
    q("hrpm-m01-q3", "Which is a stage of the employee lifecycle?", ["Onboarding", "Invoicing", "Marketing", "Budgeting stock"], 0, "Onboarding is a lifecycle stage."),
    q("hrpm-m01-q4", "A friend asks how much a colleague earns. What should HR do?", ["Tell them", "Politely decline: pay is confidential", "Post it online", "Guess"], 1, "Confidentiality and trust."),
    q("hrpm-m01-q5", "Employee records are:", ["Public", "Personal data that must be protected", "Not important", "For friends"], 1, "Data protection rules apply."),
  ]),
  check(2, "Workforce Planning and Job Design", [
    q("hrpm-m02-q1", "A shop is open 12 hours, 7 days, with 2 staff always. How many staff-hours a week?", ["84", "126", "168", "336"], 2, "84 × 2 = 168."),
    q("hrpm-m02-q2", "168 staff-hours ÷ 40 hours is:", ["3.2", "4.2", "5.2", "6.2"], 1, "168 ÷ 40 = 4.2."),
    q("hrpm-m02-q3", "What is a person specification?", ["A pay slip", "The qualifications, skills and qualities needed", "A contract", "A policy"], 1, "It describes the person needed."),
    q("hrpm-m02-q4", "A cashier earns ₦120,000; add 10% pension and 5% other costs. What is the cost per month?", ["₦126,000", "₦132,000", "₦138,000", "₦150,000"], 2, "120,000 × 1.15."),
    q("hrpm-m02-q5", "Why should job requirements be genuinely necessary?", ["To look good", "Unnecessary or discriminatory requirements exclude good people and may be illegal", "Requirements do not matter", "To lengthen the advert"], 1, "Keep requirements job-related."),
  ]),
  check(3, "Recruitment and Selection", [
    q("hrpm-m03-q1", "Which is a scam warning sign in recruitment?", ["A clear job description", "Asking candidates to pay a fee for the job", "A closing date", "Contact details"], 1, "Never charge candidates."),
    q("hrpm-m03-q2", "Weights 40/30/20/10 and scores 4, 3, 5, 3 give a total of:", ["3.4", "3.6", "3.8", "4.0"], 2, "1.6 + 0.9 + 1.0 + 0.3."),
    q("hrpm-m03-q3", "What does STAR stand for?", ["Situation, Task, Action, Result", "Skill, Time, Ability, Result", "Start, Test, Assess, Review", "Self, Team, Attitude, Role"], 0, "STAR structures behavioural answers."),
    q("hrpm-m03-q4", "Why use structured interviews?", ["To be quicker only", "Same questions for all candidates make it fairer and more reliable", "To avoid notes", "To impress"], 1, "Consistency improves fairness."),
    q("hrpm-m03-q5", "Which question is inappropriate?", ["Tell me about a time you handled a complaint", "Are you planning to get pregnant?", "What is your availability?", "What are your strengths?"], 1, "Questions on pregnancy plans are discriminatory."),
  ]),
  check(4, "Onboarding and Induction", [
    q("hrpm-m04-q1", "5 of 20 hires leave within 90 days. What is the early attrition?", ["5%", "20%", "25%", "40%"], 2, "5 ÷ 20 = 25%."),
    q("hrpm-m04-q2", "What is a buddy for?", ["To supervise discipline", "To answer everyday questions and help the new hire settle in", "To do the work", "To report faults"], 1, "A friendly experienced guide."),
    q("hrpm-m04-q3", "What should be agreed at the start of probation?", ["Nothing", "Clear objectives, in writing", "Only the pay", "A dismissal date"], 1, "Objectives make review fair."),
    q("hrpm-m04-q4", "When should the probation review be held?", ["Never", "In good time before probation ends", "After a year", "On the last day only"], 1, "Do not let probation pass without a review."),
    q("hrpm-m04-q5", "Which helps a new hire become productive fastest?", ["No feedback", "Clear expectations, early wins and regular check-ins", "Hiding the standards", "Long silence"], 1, "Clarity and support."),
  ]),
  check(5, "Training and Development", [
    q("hrpm-m05-q1", "Training costs ₦300,000 and saves ₦80,000 a month. What is the payback?", ["3 months", "3.75 months", "4 months", "5 months"], 1, "300,000 ÷ 80,000."),
    q("hrpm-m05-q2", "Annual saving ₦960,000 and cost ₦300,000. What is the ROI?", ["120%", "220%", "320%", "960%"], 1, "(960 − 300) ÷ 300 = 220%."),
    q("hrpm-m05-q3", "Not every performance problem is:", ["A real problem", "A training problem", "Worth fixing", "Measurable"], 1, "Check other causes first."),
    q("hrpm-m05-q4", "In Kirkpatrick's levels, 'Behaviour' means:", ["Participants liked it", "They apply it at work", "They passed a test", "Costs fell"], 1, "Level 3 is applied behaviour."),
    q("hrpm-m05-q5", "What is an individual development plan?", ["A pay slip", "A short written plan with goals, actions, support and dates", "A warning", "A contract"], 1, "It guides growth."),
  ]),
  check(6, "Performance Management", [
    q("hrpm-m06-q1", "Which goal is SMART?", ["Do better at sales", "Achieve ₦2,000,000 monthly sales by 30 June", "Work hard", "Be good"], 1, "Specific, measurable and time-bound."),
    q("hrpm-m06-q2", "In SBI feedback, what does 'I' stand for?", ["Idea", "Impact", "Interest", "Instruction"], 1, "Situation, Behaviour, Impact."),
    q("hrpm-m06-q3", "In GROW, what does 'W' mean?", ["Work", "Will (way forward)", "Wage", "Warning"], 1, "The agreed next actions."),
    q("hrpm-m06-q4", "A salesperson makes ₦1,400,000 against a ₦2,000,000 target. What is attainment?", ["60%", "65%", "70%", "75%"], 2, "1.4 ÷ 2 = 70%."),
    q("hrpm-m06-q5", "What is the first step with poor performance?", ["Dismiss", "Check the facts and causes and talk informally", "Ignore", "Warn publicly"], 1, "Understand before acting."),
  ]),
  check(7, "Pay, Benefits and Recognition", [
    q("hrpm-m07-q1", "Salary ₦180,000 and midpoint ₦200,000. What is the compa-ratio?", ["0.8", "0.9", "1.0", "1.1"], 1, "180 ÷ 200."),
    q("hrpm-m07-q2", "With gross pay ₦200,000 all pensionable, employee pension at 8% is:", ["₦8,000", "₦16,000", "₦20,000", "₦24,000"], 1, "0.08 × 200,000."),
    q("hrpm-m07-q3", "Employer cost with 10% employer pension on ₦200,000 gross is:", ["₦200,000", "₦210,000", "₦220,000", "₦240,000"], 2, "200,000 + 20,000."),
    q("hrpm-m07-q4", "Which is true of recognition?", ["It costs a lot", "Specific, timely thanks costs little and has a big effect", "It is not needed", "It must be cash"], 1, "Recognition motivates."),
    q("hrpm-m07-q5", "Who should be able to prepare, approve and pay payroll alone?", ["One person", "No one: duties should be separated", "The owner's friend", "Anyone"], 1, "Separate duties."),
  ]),
  check(8, "Employee Relations and Discipline", [
    q("hrpm-m08-q1", "What should you do first with a formal grievance?", ["Ignore it", "Acknowledge it promptly", "Dismiss the employee", "Discuss with everyone"], 1, "Prompt acknowledgement."),
    q("hrpm-m08-q2", "A fair disciplinary process includes:", ["No investigation", "Investigation, a hearing, a fair decision and an appeal", "Immediate dismissal always", "Public warnings"], 1, "Fair process protects both sides."),
    q("hrpm-m08-q3", "What is mediation?", ["A court", "A neutral person helps both sides reach their own agreement", "A punishment", "A warning"], 1, "Voluntary and confidential."),
    q("hrpm-m08-q4", "Which is a common mistake in discipline?", ["Keeping records", "Acting in anger with no evidence", "Offering an appeal", "Being consistent"], 1, "Evidence and calm matter."),
    q("hrpm-m08-q5", "What is an exit interview for?", ["Punishing leavers", "Learning why people leave and how to improve", "Closing accounts", "Paying salary"], 1, "It gives retention insight."),
  ]),
  check(9, "Labour Law and Compliance in Nigeria", [
    q("hrpm-m09-q1", "Employer pension (10%) on ₦2,000,000 payroll is:", ["₦100,000", "₦160,000", "₦200,000", "₦360,000"], 2, "0.10 × 2,000,000."),
    q("hrpm-m09-q2", "Employer plus employee pension (10% + 8%) on ₦2,000,000 is:", ["₦200,000", "₦320,000", "₦360,000", "₦400,000"], 2, "200,000 + 160,000."),
    q("hrpm-m09-q3", "Why should you get a written contract?", ["It is a fashion", "It protects both sides by recording the terms", "It avoids pay", "It is optional decoration"], 1, "Written terms prevent disputes."),
    q("hrpm-m09-q4", "Before dismissals or redundancies you should:", ["Act fast", "Get advice from a labour lawyer or relevant authority", "Ignore the law", "Ask a friend"], 1, "Advice is cheaper than a dispute."),
    q("hrpm-m09-q5", "Why are laws and rates in this lesson only illustrative?", ["They never change", "They change and apply differently, so you must confirm current rules", "They are invented", "Rates are fixed forever"], 1, "Always confirm the current position."),
  ]),
  check(10, "Culture, Engagement and Wellbeing", [
    q("hrpm-m10-q1", "6 leavers and an average headcount of 40 give turnover of:", ["10%", "15%", "20%", "25%"], 1, "6 ÷ 40."),
    q("hrpm-m10-q2", "Culture is shaped most by:", ["Posters", "What leaders do", "Pay slips", "The building"], 1, "Leaders' behaviour sets the tone."),
    q("hrpm-m10-q3", "What does inclusion mean?", ["Treating all the same without thought", "Making sure everyone is respected and can contribute", "Hiring only one group", "Ignoring differences"], 1, "Inclusion is respect and access."),
    q("hrpm-m10-q4", "A risk assessment:", ["Is optional", "Identifies hazards, assesses risk and sets controls", "Replaces training", "Is only for factories"], 1, "It is the basis of safety."),
    q("hrpm-m10-q5", "People often leave:", ["Because of the building", "Their manager", "Tuesdays", "The colour of the logo"], 1, "Manager quality drives retention."),
  ]),
  check(11, "HR Data, Tools and Policies", [
    q("hrpm-m11-q1", "50 employees, 22 days, 40 absent days. What is the absenteeism rate?", ["2.7%", "3.6%", "4.0%", "5.0%"], 1, "40 ÷ 1,100."),
    q("hrpm-m11-q2", "Which belongs in a policy?", ["Gossip", "Purpose, scope, rules, responsibilities, procedure and consequences", "Jokes", "Nothing"], 1, "Clear structure."),
    q("hrpm-m11-q3", "Which formula counts employees in Sales?", ["=SUM(A:A)", "=COUNTIF(D:D,\"Sales\")", "=TODAY()", "=IF(A1,B1)"], 1, "COUNTIF counts matches."),
    q("hrpm-m11-q4", "Why report HR metrics in groups?", ["To save space", "To protect individuals' privacy", "To hide results", "It is a law of maths"], 1, "Privacy matters."),
    q("hrpm-m11-q5", "Why get employees to sign that they have received policies?", ["To waste time", "It shows they were told, so rules can be enforced", "Because it is fashionable", "Nobody reads them"], 1, "Communication is the basis of enforcement."),
  ]),
  check(12, "Final Project: An HR Starter Pack", [
    q("hrpm-m12-q1", "How should the pack open for the owner?", ["With every policy", "With a one-page summary and the first three actions", "With the law", "With the budget only"], 1, "Start with the summary."),
    q("hrpm-m12-q2", "Which shows the parts fit together?", ["The job description matches the grade and the budget matches headcount", "Many colours", "Many pages", "A logo"], 0, "Consistency."),
    q("hrpm-m12-q3", "Monthly gross payroll ₦3,030,000 plus 10% employer pension is:", ["₦3,303,000", "₦3,333,000", "₦3,363,000", "₦3,500,000"], 1, "3,030,000 × 1.1."),
    q("hrpm-m12-q4", "Why recommend professional legal and tax advice in the pack?", ["To avoid work", "Laws and rates change and apply differently", "It is required in every sentence", "To lengthen it"], 1, "Honest about limits."),
    q("hrpm-m12-q5", "How can you test a tool in the pack?", ["Never test", "Ask someone to use it without your help and see where they get stuck", "Print it", "Email it"], 1, "User testing finds problems."),
  ]),
  {
    id: `${C}-final`,
    courseId: C,
    kind: "final",
    title: "Human Resources & People Management: final assessment",
    passingScore: 60,
    questions: [
      q("hrpm-f01", "Who shares responsibility for people management?", ["HR only", "Line managers and HR together", "The owner only", "Finance"], 1, "Partnership between managers and HR."),
      q("hrpm-f02", "A shop open 12 hours, 7 days, 2 staff always, needs how many staff-hours a week?", ["84", "126", "168", "336"], 2, "84 × 2."),
      q("hrpm-f03", "What makes interviews fairer and more reliable?", ["Different questions for each", "Structured questions scored against criteria", "No notes", "Gut feeling"], 1, "Structure."),
      q("hrpm-f04", "5 of 20 hires leave within 90 days. Early attrition is:", ["5%", "15%", "25%", "50%"], 2, "5 ÷ 20."),
      q("hrpm-f05", "Training costs ₦300,000 and saves ₦960,000 a year. ROI is:", ["120%", "220%", "320%", "420%"], 1, "(960 − 300) ÷ 300."),
      q("hrpm-f06", "Which feedback follows SBI?", ["You are careless", "In Tuesday's opening the till was 15 minutes late, so two customers left", "Do better", "Good job"], 1, "Situation, behaviour and impact."),
      q("hrpm-f07", "Salary ₦180,000, midpoint ₦200,000. Compa-ratio is:", ["0.8", "0.9", "1.0", "1.1"], 1, "180 ÷ 200."),
      q("hrpm-f08", "A fair disciplinary process includes:", ["Dismissal at once always", "Investigation, a hearing, a decision with reasons and an appeal", "Public shaming", "No records"], 1, "Fair process."),
      q("hrpm-f09", "Employer 10% and employee 8% pension on ₦2,000,000 total:", ["₦200,000", "₦320,000", "₦360,000", "₦400,000"], 2, "200,000 + 160,000."),
      q("hrpm-f10", "Before a dismissal you should:", ["Act quickly", "Follow a fair process and get advice", "Ignore the contract", "Tell everyone"], 1, "Process and advice."),
      q("hrpm-f11", "6 leavers, average headcount 40. Turnover is:", ["10%", "15%", "20%", "25%"], 1, "6 ÷ 40."),
      q("hrpm-f12", "50 employees, 22 working days, 40 days absent. Absenteeism is:", ["2.7%", "3.6%", "4.4%", "5.5%"], 1, "40 ÷ 1,100."),
      q("hrpm-f13", "What should a policy include?", ["Only the rules", "Purpose, scope, rules, responsibilities, procedure, consequences and review date", "Only consequences", "Only the owner's name"], 1, "Complete structure."),
      q("hrpm-f14", "Why are statutory rates in HR courses illustrative?", ["They never change", "They change, so current rules must be confirmed", "They are secret", "They are the same everywhere"], 1, "Always confirm."),
      q("hrpm-f15", "Which action best reduces early attrition?", ["Skipping induction", "A good induction, a buddy and clear expectations", "No feedback", "Hiding the job's challenges"], 1, "Support new hires."),
    ],
  },
];
