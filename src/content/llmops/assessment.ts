import type { AssessmentDef } from "../types";

/**
 * Final assessment for LLM Evaluation and Safety in Production. Scenario questions on suites,
 * release comparison, gates, red-teaming, guardrails, monitoring, feedback and incidents.
 */
export const OPS_ASSESSMENT: AssessmentDef = {
  id: "llm-evaluation-safety-production-final",
  courseId: "llm-evaluation-safety-production",
  title: "LLM Evaluation and Safety in Production: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "opsq01",
      prompt: "Your provider updates the model behind the name you call. What can detect the effect?",
      options: ["The suite you ran at launch", "Online monitoring, and re-running the suite regularly", "Nothing", "Your release gate, automatically"],
      answer: 1,
      explanation: "Changes you don't make don't trigger your release process.",
    },
    {
      id: "opsq02",
      prompt: "A category in your suite has 30 cases. Its pass rate moves from 90% to 87%. What can you conclude?",
      options: ["It got worse", "Very little: with 30 cases, that's one case and well within the noise", "It got better", "The suite is broken"],
      answer: 1,
      explanation: "Small categories have wide intervals.",
    },
    {
      id: "opsq03",
      prompt: "A candidate fixes 12 cases and breaks 6 compared with live. What's the right next step?",
      options: ["Ship it: it's better", "Test whether the difference is real, and look at which cases broke and in which categories", "Reject it", "Run it on a different suite"],
      answer: 1,
      explanation: "Paired comparison: significance and where the breaks are.",
    },
    {
      id: "opsq04",
      prompt: "All six cases a release broke are fraud reports. Its overall score went up. What does the gate do?",
      options: ["Pass it", "Block it, because a critical category got worse", "Pass it with a warning", "Average the categories"],
      answer: 1,
      explanation: "Critical-category rules override the average.",
    },
    {
      id: "opsq05",
      prompt: "Why agree gate rules before seeing results?",
      options: ["Speed", "So the rules don't bend to fit the release people want", "It's required by providers", "To make releases slower"],
      answer: 1,
      explanation: "Set the bar first.",
    },
    {
      id: "opsq06",
      prompt: "A guardrail stops all blunt override attacks but only a fifth of obfuscated ones. What should you do?",
      options: ["Nothing: average performance is fine", "Normalise text before the guardrail, add obfuscated examples, and add those attacks to the suite", "Remove the guardrail", "Block all long messages"],
      answer: 1,
      explanation: "Fix where defences are weak, and keep a test.",
    },
    {
      id: "opsq07",
      prompt: "At your chosen threshold, harmless Pidgin messages are blocked ten times as often as English ones. What's the best response?",
      options: ["Accept it", "Retrain the classifier with harmless Pidgin examples, and route blocked messages to a person in the meantime", "Lower the threshold for everyone", "Stop supporting Pidgin"],
      answer: 1,
      explanation: "The bias is in the scores; a threshold alone can't fix it.",
    },
    {
      id: "opsq08",
      prompt: "How should you choose a guardrail threshold?",
      options: ["Always 0.5", "By the costs of missed attacks and wrongly blocked customers, agreed with the business", "The highest possible", "Whatever the vendor says"],
      answer: 1,
      explanation: "Every threshold is a trade-off; price it.",
    },
    {
      id: "opsq09",
      prompt: "The refusal rate jumps from 3% to 8%. A fixed alert at 10% stays silent. What's better?",
      options: ["A fixed alert at 5%", "Control limits from the metric's own recent variation", "Checking weekly", "No alerts"],
      answer: 1,
      explanation: "Limits learned from the data fit each metric.",
    },
    {
      id: "opsq10",
      prompt: "Accuracy falls ten points, but the thumbs-down share barely moves. Why?",
      options: ["Accuracy was measured wrongly", "Few customers give feedback, they aren't typical, and confident wrong answers often get thumbs up", "Thumbs are broken", "Customers didn't notice"],
      answer: 1,
      explanation: "Feedback is a source of examples, not a measure.",
    },
    {
      id: "opsq11",
      prompt: "You grade 30 random conversations a day. How do you detect a drop in accuracy sooner and more reliably?",
      options: ["React to each day's score", "Pool several days and alert when the pooled rate falls below a limit based on the sample size", "Stop grading", "Grade only complaints"],
      answer: 1,
      explanation: "Pooling turns a noisy sample into an early warning.",
    },
    {
      id: "opsq12",
      prompt: "In a blameless postmortem, what does 'why it wasn't caught' lead to?",
      options: ["Naming who made the mistake", "Fixes for a whole class of problems: new checks, alerts and tests", "A longer report", "Nothing"],
      answer: 1,
      explanation: "Fix systems, not people.",
    },
  ],
};
