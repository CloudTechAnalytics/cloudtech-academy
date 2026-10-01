import type { AssessmentDef } from "../types";

/**
 * Final assessment for Business Analysis Fundamentals. Scenario questions on judgement:
 * each has a tempting answer that an inexperienced analyst would choose.
 */
export const BA_ASSESSMENT: AssessmentDef = {
  id: "business-analysis-fundamentals-final",
  courseId: "business-analysis-fundamentals",
  title: "Business Analysis Fundamentals: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "baq01",
      prompt: "A director says, 'We need a new CRM.' What should the business analyst do first?",
      options: ["Compare CRM vendors", "Find out what problem the CRM is meant to solve, what it costs today, and how success would be measured", "Write user stories for a CRM", "Ask IT which CRM they prefer"],
      answer: 1,
      explanation: "Requests usually arrive as solutions. Work back to the problem.",
    },
    {
      id: "baq02",
      prompt: "The receptionist will use the new booking process all day but has no say in the budget. Where does she sit on the power and interest grid, and how should you treat her?",
      options: ["Low power, low interest: monitor", "Low power, high interest: keep informed and involve her in design", "High power, high interest: manage closely", "She isn't a stakeholder"],
      answer: 1,
      explanation: "Low power doesn't mean low importance; users can make or break adoption.",
    },
    {
      id: "baq03",
      prompt: "Which interview question is best for understanding how invoices are chased?",
      options: ["Don't you think reminders would help?", "Tell me about the last invoice that was paid late. What happened?", "Is the process good?", "Would you like a new system?"],
      answer: 1,
      explanation: "Ask for a specific recent example; avoid leading questions.",
    },
    {
      id: "baq04",
      prompt: "Overdue invoices are spread across 32 of 50 clients. What does that suggest?",
      options: ["A few problem clients", "A process problem affecting most clients", "A data error", "Nothing useful"],
      answer: 1,
      explanation: "Widespread problems point to the process.",
    },
    {
      id: "baq05",
      prompt: "On a process map, a step happens only 'when a partner remembers to ask'. What's the problem?",
      options: ["Rework", "No trigger", "Too many lanes", "Manual re-entry"],
      answer: 1,
      explanation: "Give each step a trigger: a date, an event or a condition.",
    },
    {
      id: "baq06",
      prompt: "Which requirement is testable?",
      options: ["The system shall be easy to use", "The report shall load in under 5 seconds for 2,000 records", "Invoices should go out quickly", "It should integrate with everything"],
      answer: 1,
      explanation: "It can be timed and passed or failed.",
    },
    {
      id: "baq07",
      prompt: "'Clients on a payment plan don't receive reminders' is best described as a:",
      options: ["Non-functional requirement", "Business rule", "User story", "KPI"],
      answer: 1,
      explanation: "A policy that applies whatever the solution.",
    },
    {
      id: "baq08",
      prompt: "In a MoSCoW session, every requirement is marked Must. What should you do?",
      options: ["Accept it", "Challenge each Must: would we still go live without it?", "Mark them all Should", "Drop the lowest-cost ones"],
      answer: 1,
      explanation: "Prioritising means choosing.",
    },
    {
      id: "baq09",
      prompt: "Which user story is best?",
      options: [
        "As a user, I want a billing system",
        "As an accounts officer, I want a list of invoices past their due date, so that I know who to chase each Monday",
        "The system shall have reports",
        "As a developer, I want a database",
      ],
      answer: 1,
      explanation: "A specific user, something small and valuable, and a clear benefit.",
    },
    {
      id: "baq10",
      prompt: "The supplier reports a 94% collection rate; the accounts officer reports 81%. What most likely went wrong?",
      options: ["One of them can't calculate", "The KPI was never defined, so they're using different definitions", "The data is corrupt", "Rounding"],
      answer: 1,
      explanation: "Write and agree each KPI definition before go-live.",
    },
    {
      id: "baq11",
      prompt: "Option B pays back in 3 months; option C in 13 months with slightly higher three-year benefit and more risk. What's a strong recommendation?",
      options: ["Always choose C", "Choose B now and revisit C with evidence after six months", "Do nothing", "Choose whichever the supplier prefers"],
      answer: 1,
      explanation: "Phasing delivers most of the benefit quickly and makes the bigger decision with evidence.",
    },
    {
      id: "baq12",
      prompt: "A traceability matrix shows a feature with no requirement behind it. What is that?",
      options: ["Good value", "Scope creep: ask why it's there before it's built or tested", "A test case", "A business rule"],
      answer: 1,
      explanation: "Traceability catches untested requirements and unrequested features.",
    },
    {
      id: "baq13",
      prompt: "The new process passed every test, but three months later people still use the old spreadsheet. What was most likely missing?",
      options: ["More testing", "Adoption planning: role-specific training, support and a fixed date to switch off the old way", "A bigger budget", "More requirements"],
      answer: 1,
      explanation: "Passing tests isn't the same as being adopted.",
    },
    {
      id: "baq14",
      prompt: "How should you show that a change worked?",
      options: ["Ask people if they like it", "Recalculate the baseline measures with exactly the same definitions and compare with the targets", "Count the features delivered", "Check the project finished on time"],
      answer: 1,
      explanation: "Before and after, measured the same way.",
    },
    {
      id: "baq15",
      prompt: "Your analysis recommends delay notifications instead of the GPS app the director asked for. When is that the right call?",
      options: ["Never: deliver what was asked", "When the evidence shows the need is being told about delays, and the business case supports it", "Only if it's free", "Only if IT agrees"],
      answer: 1,
      explanation: "Recommending the right solution to the real problem is the BA's job.",
    },
  ],
};
