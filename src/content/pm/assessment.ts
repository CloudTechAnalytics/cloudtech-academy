import type { AssessmentDef } from "../types";

/**
 * Final assessment for Project Management Fundamentals. Scenario questions on scope,
 * estimating, scheduling, simulation, earned value, forecasting, risk and change control.
 */
export const PMF_ASSESSMENT: AssessmentDef = {
  id: "project-management-fundamentals-final",
  courseId: "project-management-fundamentals",
  title: "Project Management Fundamentals: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "pmfq01",
      prompt: "The sponsor adds a cold room to the depot. Under the scope, time and cost balance, what usually happens?",
      options: ["Nothing", "Time, cost or both increase", "The project gets cheaper", "Quality rises for free"],
      answer: 1,
      explanation: "More scope moves the other constraints.",
    },
    {
      id: "pmfq02",
      prompt: "What does the 100% rule say about a work breakdown structure?",
      options: ["Every task is fully funded", "The pieces at each level add up to all the work above, no more, no less", "Tasks take 100 days", "All tasks are critical"],
      answer: 1,
      explanation: "Nothing missing, nothing extra.",
    },
    {
      id: "pmfq03",
      prompt: "A task's estimates are O = 4, M = 6, P = 14 days. What's the PERT expected duration?",
      options: ["6", "7", "8", "14"],
      answer: 1,
      explanation: "(4 + 24 + 14) ÷ 6 = 7.",
    },
    {
      id: "pmfq04",
      prompt: "A task has zero float. What happens if it slips by 3 days?",
      options: ["Nothing", "The project end moves 3 days", "Another task speeds up", "The budget falls"],
      answer: 1,
      explanation: "It's on the critical path.",
    },
    {
      id: "pmfq05",
      prompt: "A simulation gives a 64% chance of meeting the deadline. What's the most honest statement to the sponsor?",
      options: ["We will definitely make it", "About two in three; here's the date we're 80% confident in and what would improve the odds", "We won't make it", "The plan says we will"],
      answer: 1,
      explanation: "Dates with confidence levels.",
    },
    {
      id: "pmfq06",
      prompt: "EV is ₦45m and PV is ₦56m. What's the SPI, and what does it mean?",
      options: ["1.24, ahead", "About 0.80, behind schedule", "0.80, under budget", "1.0, on track"],
      answer: 1,
      explanation: "SPI = EV ÷ PV.",
    },
    {
      id: "pmfq07",
      prompt: "EV is ₦45m and AC is ₦58m. What's the CPI?",
      options: ["1.29", "About 0.78", "0.45", "13"],
      answer: 1,
      explanation: "CPI = EV ÷ AC: under 1 means overspending.",
    },
    {
      id: "pmfq08",
      prompt: "BAC is ₦80m and CPI is 0.8. What's the estimate at completion if efficiency doesn't change?",
      options: ["₦64m", "₦100m", "₦80m", "₦96m"],
      answer: 1,
      explanation: "BAC ÷ CPI.",
    },
    {
      id: "pmfq09",
      prompt: "A risk has a 30% chance of costing ₦5 million. What's its EMV?",
      options: ["₦5m", "₦1.5m", "₦0.3m", "₦15m"],
      answer: 1,
      explanation: "Probability × impact.",
    },
    {
      id: "pmfq10",
      prompt: "A response costs ₦0.4m and cuts a risk's EMV from ₦3m to ₦0.6m. Is it worth it on money alone?",
      options: ["No", "Yes: it saves ₦2.4m of expected cost for ₦0.4m", "Only if the risk happens", "Can't tell"],
      answer: 1,
      explanation: "Compare cost with EMV saved.",
    },
    {
      id: "pmfq11",
      prompt: "Paying for weekend working to shorten a critical task is called...",
      options: ["Fast-tracking", "Crashing", "Descoping", "Baselining"],
      answer: 1,
      explanation: "Spending money to save time on the critical path.",
    },
    {
      id: "pmfq12",
      prompt: "A change request adds 3 days to a task that's already finished. What's its schedule impact?",
      options: ["3 days", "None: the task is complete, but there's still a cost", "6 days", "The project restarts"],
      answer: 1,
      explanation: "Assess changes against the current forecast, not the original plan.",
    },
  ],
};
