import type { AssessmentDef } from "../types";

/**
 * Final assessment for Experimentation and A/B Testing. Scenario questions on design,
 * running, analysis and decisions, each with a tempting wrong answer.
 */
export const ABT_ASSESSMENT: AssessmentDef = {
  id: "experimentation-ab-testing-final",
  courseId: "experimentation-ab-testing",
  title: "Experimentation and A/B Testing: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "abtq01",
      prompt: "Users who turned on a savings feature saved 40% more. What can you conclude about the feature's effect?",
      options: ["It increases savings by 40%", "Nothing causal: users who chose it may differ in ways that explain the gap", "It reduces savings", "It works only for some users"],
      answer: 1,
      explanation: "Self-selection creates confounders; randomise to measure the effect.",
    },
    {
      id: "abtq02",
      prompt: "Baseline conversion is 20%. You halve the minimum detectable effect from 4 points to 2. Roughly what happens to the sample size?",
      options: ["It halves", "It roughly quadruples", "It doubles", "No change"],
      answer: 1,
      explanation: "Sample size scales with 1 ÷ effect².",
    },
    {
      id: "abtq03",
      prompt: "A 50/50 test has 52,000 users in A and 48,000 in B. The SRM p-value is far below 0.001. What do you do?",
      options: ["Analyse as normal", "Investigate and fix the cause before trusting any result", "Drop 4,000 A users", "Report B's lift only"],
      answer: 1,
      explanation: "A broken split can bias every metric.",
    },
    {
      id: "abtq04",
      prompt: "Checking a test daily and stopping at the first p < 0.05 does what to false alarms?",
      options: ["Keeps them at 5%", "Raises them well above 5%", "Lowers them", "Nothing"],
      answer: 1,
      explanation: "Every look is another chance for noise to cross the line.",
    },
    {
      id: "abtq05",
      prompt: "An effect is +1.0 points with a 95% CI of −0.6 to +2.6. What should you report?",
      options: ["B wins", "Inconclusive: the data are consistent with no effect", "B loses", "The test proves no effect"],
      answer: 1,
      explanation: "An interval including zero means the test couldn't tell.",
    },
    {
      id: "abtq06",
      prompt: "A money metric's mean rises in B, but its median and capped mean don't. What's likely?",
      options: ["A broad effect", "A few large users drive the mean; the typical user hasn't changed", "A broken split", "Novelty"],
      answer: 1,
      explanation: "Check skewed metrics more than one way.",
    },
    {
      id: "abtq07",
      prompt: "You test 10 regions at 5% each. With no real differences, how many false alarms would you expect?",
      options: ["None", "About 0.5", "About 5", "10"],
      answer: 1,
      explanation: "10 × 5% = 0.5 on average; use a correction such as Bonferroni.",
    },
    {
      id: "abtq08",
      prompt: "A redesigned button's click rate is high in week 1 and normal by week 3. How should you judge it?",
      options: ["On week 1", "On the later weeks, after the novelty has worn off", "On the average of week 1", "Ship it now"],
      answer: 1,
      explanation: "Novelty effects fade.",
    },
    {
      id: "abtq09",
      prompt: "A price rise doubles revenue per user in a 4-week test but lowers retention. Why be cautious?",
      options: ["The test is invalid", "Churn may keep accumulating after the test, which a short test can't see", "Revenue can't double", "Retention doesn't matter"],
      answer: 1,
      explanation: "Value guardrails over a realistic horizon.",
    },
    {
      id: "abtq10",
      prompt: "Treated states grew 6% after a launch; other states fell 2% in the same weeks. What's the DiD estimate?",
      options: ["6%", "8%", "4%", "−2%"],
      answer: 1,
      explanation: "6 − (−2) = 8 points.",
    },
    {
      id: "abtq11",
      prompt: "What must hold for difference-in-differences to be credible?",
      options: ["Random assignment", "The groups would have moved in parallel without the change, as they did beforehand", "Equal sizes", "Normal data"],
      answer: 1,
      explanation: "Check parallel pre-trends and run a placebo test.",
    },
    {
      id: "abtq12",
      prompt: "Why write the primary metric and MDE down before a test starts?",
      options: ["It's a formality", "So nobody can choose the metric or stopping point after seeing the data", "Tools need it", "To make the report longer"],
      answer: 1,
      explanation: "Pre-registration protects against cherry-picking.",
    },
  ],
};
