import type { AssessmentDef } from "../types";

/**
 * Final assessment for the Business Analyst Capstone. Scenario questions across the whole
 * project: framing, measurement, process, causes, pilots, business cases, requirements and readiness.
 */
export const BAC_ASSESSMENT: AssessmentDef = {
  id: "business-analyst-capstone-final",
  courseId: "business-analyst-capstone",
  title: "Business Analyst Capstone: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "bacq01",
      prompt: "A director asks you to \"write requirements for a new claims system\". What should you do first?",
      options: ["Write the requirements", "Understand the problem and its causes before accepting the solution", "Ask IT for a vendor", "Refuse"],
      answer: 1,
      explanation: "Frame the problem before the solution.",
    },
    {
      id: "bacq02",
      prompt: "Which is the best problem statement?",
      options: ["We need a faster system", "Claims are bad", "Paid motor claims take 25 days on average and 23% take over 30, and slow-claim customers renew less", "Staff should work harder"],
      answer: 2,
      explanation: "Who, what, how much and why it matters, without a solution.",
    },
    {
      id: "bacq03",
      prompt: "Windscreen claims take as long as accident claims three times their size. What does that suggest?",
      options: ["Windscreens are complex", "One process route for all claims, whatever their size or risk", "Bad data", "Too many windscreens"],
      answer: 1,
      explanation: "Controls sized for big claims slow small ones.",
    },
    {
      id: "bacq04",
      prompt: "Why use the event log to map the process?",
      options: ["It's quicker to read", "It shows what really happens, including loops and waits", "Staff can't explain the process", "It's required by BPMN"],
      answer: 1,
      explanation: "Data beats the manual.",
    },
    {
      id: "bacq05",
      prompt: "Every manager approval in the log is on a Friday. What kind of cause is that?",
      options: ["A system fault", "A working practice that can be changed cheaply", "Customer behaviour", "A data error"],
      answer: 1,
      explanation: "Batching creates waiting.",
    },
    {
      id: "bacq06",
      prompt: "Lagos got 7.4 days faster during a pilot while other regions got 1 day slower. What's the best estimate of the pilot's effect?",
      options: ["7.4 days", "About 8.4 days", "1 day", "It can't be estimated"],
      answer: 1,
      explanation: "Difference in differences: −7.4 − (+1.0).",
    },
    {
      id: "bacq07",
      prompt: "What must you check before trusting a difference-in-differences result?",
      options: ["That the groups moved together before the change", "That the groups are the same size", "That the effect is large", "Nothing"],
      answer: 0,
      explanation: "Parallel trends before the change.",
    },
    {
      id: "bacq08",
      prompt: "A renewed policy brings ₦430,000 premium and contribution is 35%. What's the benefit of one extra renewal?",
      options: ["₦430,000", "About ₦150,500", "₦35,000", "₦279,500"],
      answer: 1,
      explanation: "430,000 × 35%.",
    },
    {
      id: "bacq09",
      prompt: "An option costs ₦42m and returns ₦27.76m a year net. Roughly when does it pay back?",
      options: ["6 months", "About 1.5 years", "3 years", "Never"],
      answer: 1,
      explanation: "42 ÷ 27.76.",
    },
    {
      id: "bacq10",
      prompt: "Which acceptance criterion protects a financial control?",
      options: ["The screen is blue", "If the amount changes after approval, the approval is cancelled", "The assessor can log in", "The SMS is short"],
      answer: 1,
      explanation: "Controls are acceptance criteria too.",
    },
    {
      id: "bacq11",
      prompt: "UAT ends with one critical defect open and a launch date next week. The agreed criteria say no open critical defects. What do you recommend?",
      options: ["Launch anyway", "No-go until it's fixed and retested", "Lower its severity", "Launch in secret"],
      answer: 1,
      explanation: "Follow the criteria agreed in advance.",
    },
    {
      id: "bacq12",
      prompt: "How should a decision paper begin?",
      options: ["With the background", "With the decision you're asking for", "With the method", "With a chart"],
      answer: 1,
      explanation: "Answer first.",
    },
  ],
};
