import type { AssessmentDef } from "../types";

/**
 * Final assessment for Product Management Fundamentals. Scenario questions on outcomes,
 * research, feedback, funnels, retention, RICE, roadmaps, launches and specs.
 */
export const PDM_ASSESSMENT: AssessmentDef = {
  id: "product-management-fundamentals-final",
  courseId: "product-management-fundamentals",
  title: "Product Management Fundamentals: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "pdmq01",
      prompt: "Which is an outcome?",
      options: ["Launch split bills", "More students settle shared costs through the app each week", "Redesign onboarding", "Hire two engineers"],
      answer: 1,
      explanation: "Outcomes are changes in what users do.",
    },
    {
      id: "pdmq02",
      prompt: "Which interview question gives the best evidence?",
      options: ["Would you use a savings feature?", "Tell me about the last time you saved for something", "Do you like our app?", "What features do you want?"],
      answer: 1,
      explanation: "Ask about past behaviour.",
    },
    {
      id: "pdmq03",
      prompt: "74% of the sales team's feedback is about one feature. What should you check?",
      options: ["Nothing: build it", "Whether it's common across other sources and who it affects", "Whether sales are honest", "The feature's price"],
      answer: 1,
      explanation: "Know where feedback comes from.",
    },
    {
      id: "pdmq04",
      prompt: "In a funnel, which step should you investigate first?",
      options: ["The first one", "The one that loses the most users", "The cheapest to change", "The last one"],
      answer: 1,
      explanation: "Biggest loss, biggest opportunity.",
    },
    {
      id: "pdmq05",
      prompt: "Users who make a first transfer are much more likely to be active in week 4. What is the first transfer?",
      options: ["A guardrail", "The activation moment", "A cohort", "A non-goal"],
      answer: 1,
      explanation: "The moment users first get value.",
    },
    {
      id: "pdmq06",
      prompt: "A retention curve flattens at 40% after week 6. What does that suggest?",
      options: ["The product is failing", "A core of users has made it a habit", "Data is missing", "Users are leaving faster"],
      answer: 1,
      explanation: "The flat level is what lasts.",
    },
    {
      id: "pdmq07",
      prompt: "Reach 3,000, impact 1, confidence 0.8, effort 5. What's the RICE score?",
      options: ["480", "2,400", "600", "12,000"],
      answer: 0,
      explanation: "3,000 × 1 × 0.8 ÷ 5.",
    },
    {
      id: "pdmq08",
      prompt: "A feature's RICE confidence is low and its effort high. What's often the best next step?",
      options: ["Build it to find out", "A cheap test or research to raise confidence", "Delete it forever", "Double its impact"],
      answer: 1,
      explanation: "Buy evidence before building.",
    },
    {
      id: "pdmq09",
      prompt: "Why leave unplanned capacity on a roadmap?",
      options: ["Engineers prefer it", "Support work and surprises always happen", "To look modest", "It's required"],
      answer: 1,
      explanation: "Full plans always slip.",
    },
    {
      id: "pdmq10",
      prompt: "Feature adopters are 18 points more retained than non-adopters. Why isn't that the feature's effect?",
      options: ["The sample is small", "Adopters chose themselves and were already more engaged", "Retention is measured wrongly", "It is the effect"],
      answer: 1,
      explanation: "Use a randomised holdout.",
    },
    {
      id: "pdmq11",
      prompt: "A holdout comparison shows +1.9 points with an interval of −0.6 to +4.4. What should you report?",
      options: ["It works", "A possible small benefit, not yet proven", "It harms retention", "The test failed"],
      answer: 1,
      explanation: "Report uncertainty honestly.",
    },
    {
      id: "pdmq12",
      prompt: "What must a success metric in a spec include?",
      options: ["A feature name", "A baseline and a target", "An engineer's name", "A launch date"],
      answer: 1,
      explanation: "Measure first, then aim.",
    },
  ],
};
