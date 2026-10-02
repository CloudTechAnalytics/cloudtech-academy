import type { AssessmentDef } from "../types";

/**
 * Final assessment for Agile Business Analysis. Scenario questions about working as a BA in
 * a Scrum team: each has a tempting answer from a more document-driven way of working.
 */
export const ABA_ASSESSMENT: AssessmentDef = {
  id: "agile-business-analysis-final",
  courseId: "agile-business-analysis",
  title: "Agile Business Analysis: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "abaq01",
      prompt: "Who orders the product backlog in Scrum?",
      options: ["The business analyst", "The product owner", "The scrum master", "The stakeholders by vote"],
      answer: 1,
      explanation: "The BA shapes and advises; the product owner decides the order.",
    },
    {
      id: "abaq02",
      prompt: "Which is an outcome?",
      options: ["Ship the reorder feature", "Kiosks order every 14 days instead of every 22", "Write 20 user stories", "Release on Android"],
      answer: 1,
      explanation: "Outcomes are changes in behaviour or results.",
    },
    {
      id: "abaq03",
      prompt: "The first release has perfect sign-up but no way to pay. What went wrong?",
      options: ["Nothing", "The release was sliced by component, not across the whole user journey", "Too few developers", "Payments are always last"],
      answer: 1,
      explanation: "A walking skeleton covers every step of the journey, however basically.",
    },
    {
      id: "abaq04",
      prompt: "Which split of 'Pay by card' is best?",
      options: ["Database, API, screen", "Successful card payment first; failed payment handling next; saved cards later", "Front end and back end", "Design, build, test"],
      answer: 1,
      explanation: "Each slice should still be valuable and testable.",
    },
    {
      id: "abaq05",
      prompt: "A tester asks in refinement, 'What if the transfer arrives the next day?' Nobody knows. What does that tell you?",
      options: ["The tester is slowing things down", "The story isn't ready: answer the question and add the criterion before the sprint", "Start the story and find out", "Remove the story"],
      answer: 1,
      explanation: "That's what the three amigos and a definition of ready are for.",
    },
    {
      id: "abaq06",
      prompt: "A story is coded but not tested on a real phone. Do its points count towards velocity?",
      options: ["Yes", "No: only items meeting the definition of done count", "Half", "Only at the end of the release"],
      answer: 1,
      explanation: "Counting unfinished work hides problems.",
    },
    {
      id: "abaq07",
      prompt: "Item A: cost of delay 18, 3 points. Item B: cost of delay 24, 8 points. Which goes first by WSJF?",
      options: ["B: higher cost of delay", "A: WSJF 6.0 against 3.0", "Either", "Neither"],
      answer: 1,
      explanation: "Short, valuable jobs first.",
    },
    {
      id: "abaq08",
      prompt: "Average velocity is 19 points; 51 points remain; two sprints are left before the pilot. What's the honest answer to 'will it be ready?'",
      options: ["Yes", "Not with the current scope: about 38 points fit, so about 13 must move or the date must change", "The team must work harder", "We can't know"],
      answer: 1,
      explanation: "Forecast from real velocity and offer options.",
    },
    {
      id: "abaq09",
      prompt: "On a burn-up chart, total scope rises as fast as work done. What does it mean?",
      options: ["Good progress", "Scope growth is keeping the release from ever finishing", "The team is idle", "The chart is broken"],
      answer: 1,
      explanation: "Burn-up charts make scope growth visible.",
    },
    {
      id: "abaq10",
      prompt: "A team starts all its stories on day one of each sprint. What usually happens?",
      options: ["Everything finishes faster", "Cycle times rise and more work finishes late, often with bugs", "No change", "Velocity doubles"],
      answer: 1,
      explanation: "More work in progress means longer cycle times.",
    },
    {
      id: "abaq11",
      prompt: "A manager wants to rank developers by story points completed. What's the main risk?",
      options: ["None", "People game the measure and stop helping each other", "Points can't be counted", "It takes too long"],
      answer: 1,
      explanation: "Team measures describe the system, not individuals.",
    },
    {
      id: "abaq12",
      prompt: "Pilot kiosks ordered 20% more often; so did kiosks with no app in the same weeks. What do you conclude?",
      options: ["The app works", "No evidence the app caused it: the rise appears everywhere", "The app failed", "Run the pilot again immediately"],
      answer: 1,
      explanation: "Comparison groups separate the effect of the change from everything else.",
    },
    {
      id: "abaq13",
      prompt: "When should a pilot's success criteria and decision rule be agreed?",
      options: ["After the results come in", "Before the pilot starts", "Only if the results are bad", "They aren't needed"],
      answer: 1,
      explanation: "Agreeing in advance stops the decision being argued from the results.",
    },
  ],
};
