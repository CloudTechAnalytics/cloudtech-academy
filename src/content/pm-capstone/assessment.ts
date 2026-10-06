import type { AssessmentDef } from "../types";

/**
 * Final assessment for the Project Manager Capstone. Scenario questions across the whole
 * project: the charter, estimates, the critical path, schedule risk, earned value, forecasts,
 * risks, change requests, recovery options and the decision paper.
 */
export const PMC_ASSESSMENT: AssessmentDef = {
  id: "project-manager-capstone-final",
  courseId: "project-manager-capstone",
  title: "Project Manager Capstone: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "pmcq01",
      prompt: "A sponsor emails that a promised date is in danger and lists three extra requests. What should the project manager produce first?",
      options: ["A new plan with all the requests included", "A status, a forecast and a recommendation backed by evidence", "A list of reasons the team is working hard", "A request for more staff"],
      answer: 1,
      explanation: "The sponsor needs to know where the project stands, where it's heading and what to decide.",
    },
    {
      id: "pmcq02",
      prompt: "Which is the best success criterion in a charter?",
      options: ["A successful launch", "Open on a stated date, within the approved budget, with the licence and inspection passed", "As soon as possible", "When everyone is happy"],
      answer: 1,
      explanation: "A date, a budget and a test anyone can check.",
    },
    {
      id: "pmcq03",
      prompt: "A stakeholder has high influence but low interest in the project's details. How should you manage them?",
      options: ["Ignore them", "Keep them satisfied: short, regular, relevant updates and early notice of anything that affects them", "Add them to every meeting", "Ask them to do more work"],
      answer: 1,
      explanation: "High influence means they can stop or help the project; low interest means they don't want the detail.",
    },
    {
      id: "pmcq04",
      prompt: "A task has estimates 6, 9 and 18 days (optimistic, likely, pessimistic). What is its PERT expected duration?",
      options: ["9", "10", "11", "12"],
      answer: 1,
      explanation: "(6 + 4 × 9 + 18) ÷ 6 = 60 ÷ 6 = 10 days.",
    },
    {
      id: "pmcq05",
      prompt: "Why is a budget built from every task's 'likely' duration usually too low?",
      options: ["Daily costs are underestimated", "Overruns are bigger than underruns, so the average is above the most likely value", "Likely values are always wrong", "Projects always add scope"],
      answer: 1,
      explanation: "Skewed estimates mean the expected value exceeds the mode.",
    },
    {
      id: "pmcq06",
      prompt: "A plan finishes one working day before a promised date. What is the honest description?",
      options: ["Safe", "Almost no cushion: any slip on the critical path misses the date", "Comfortable, because estimates are cautious", "Ahead of schedule"],
      answer: 1,
      explanation: "A one-day buffer is well inside the noise of any estimate.",
    },
    {
      id: "pmcq07",
      prompt: "A simulation shows a 4% chance of meeting the promised date and a P80 date three weeks later. What should the sponsor take from it?",
      options: ["The date is safe", "The date was never likely; a date with 80% confidence is three weeks later", "The simulation is broken", "P80 is the date the project will finish"],
      answer: 1,
      explanation: "The probability and the P80 together say how unlikely the date is, and what is safer to promise.",
    },
    {
      id: "pmcq08",
      prompt: "A task with a ₦20m budget is 40% complete and has cost ₦12m. What is its earned value?",
      options: ["₦12m", "₦8m", "₦20m", "₦4m"],
      answer: 1,
      explanation: "EV = 40% × ₦20m = ₦8m, whatever was spent.",
    },
    {
      id: "pmcq09",
      prompt: "SPI is 0.9 and CPI is 0.7. What is the best summary?",
      options: ["Ahead and under budget", "Behind schedule, and costing much more than planned for the work done", "On schedule", "Under budget but late"],
      answer: 1,
      explanation: "Both below 1; the cost index is the worse of the two.",
    },
    {
      id: "pmcq10",
      prompt: "BAC is ₦200m and CPI is 0.8. What is the typical estimate at completion?",
      options: ["₦160m", "₦200m", "₦250m", "₦280m"],
      answer: 2,
      explanation: "BAC ÷ CPI = 200 ÷ 0.8 = 250.",
    },
    {
      id: "pmcq11",
      prompt: "Why should a date forecast come from re-scheduling the remaining work rather than from SPI?",
      options: ["SPI is wrong", "SPI is in money terms; the finish date depends on the critical chain of the remaining tasks", "SPI can't be calculated", "Dates are never forecast"],
      answer: 1,
      explanation: "A late task on the critical chain matters more than average progress.",
    },
    {
      id: "pmcq12",
      prompt: "A risk has a 30% chance of costing ₦8m and a 30% chance of causing 10 days' delay on a task with 25 days of float. Which statement is right?",
      options: ["The EMV is ₦2.4m, and the delay probably doesn't move the finish", "The EMV is ₦8m", "The delay adds 3 days to the finish", "Neither matters"],
      answer: 0,
      explanation: "EMV = 0.3 × ₦8m = ₦2.4m; a delay shorter than the float is absorbed.",
    },
    {
      id: "pmcq13",
      prompt: "A change request claims to save 6 days by paying for weekend work on a task that isn't on the critical chain. What will it do for the finish date?",
      options: ["Save 6 days", "Almost certainly nothing", "Save 3 days", "Delay it"],
      answer: 1,
      explanation: "Only shortening the critical chain shortens the project.",
    },
    {
      id: "pmcq14",
      prompt: "One recovery option meets the promised date but opens the laboratory with a reduced test menu, which the medical director opposes. What is the best approach?",
      options: ["Do it anyway", "Choose the full-menu option, say plainly that it is a day late, and keep the reduced menu as an agreed trigger if the critical task slips again", "Reject all options", "Hide the trade-off"],
      answer: 1,
      explanation: "Recovery options trade money, time and quality. The sponsor and the people affected should choose with open eyes, with a trigger agreed in advance.",
    },
    {
      id: "pmcq15",
      prompt: "Which is the best opening line of a decision paper?",
      options: ["\"This paper reviews the project's history.\"", "\"I recommend approving two actions costing ₦5.95m; the laboratory then opens on 9 March, one working day late.\"", "\"The team has worked hard under difficult conditions.\"", "\"Many risks remain.\""],
      answer: 1,
      explanation: "Lead with the recommendation and the numbers the sponsor needs.",
    },
  ],
};
