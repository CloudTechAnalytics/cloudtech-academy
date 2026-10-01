import type { AssessmentDef } from "../types";

/**
 * Final assessment for Feature Engineering and Model Evaluation. Scenario questions on
 * point-in-time features, time-based validation, calibration, targeting and drift.
 */
export const FEM_ASSESSMENT: AssessmentDef = {
  id: "feature-engineering-model-evaluation-final",
  courseId: "feature-engineering-model-evaluation",
  title: "Feature Engineering and Model Evaluation: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "femq01",
      prompt: "For a snapshot on 31 March, which data may a feature use?",
      options: ["Anything in the database", "Only data dated on or before 31 March", "Data up to the end of the horizon", "Only data from March"],
      answer: 1,
      explanation: "Features look back; only the target looks forward.",
    },
    {
      id: "femq02",
      prompt: "Which feature best captures a customer fading out?",
      options: ["Total transactions since signup", "Transactions in the last 30 days compared with the 60 days before", "Customer ID", "Signup date"],
      answer: 1,
      explanation: "Trend features compare a recent window with an earlier one.",
    },
    {
      id: "femq03",
      prompt: "A churn model scores AUC 0.98 and includes 'transactions in the next 30 days'. What's wrong?",
      options: ["Nothing", "Leakage: that feature isn't known at the snapshot", "Too few features", "The horizon is too short"],
      answer: 1,
      explanation: "Too-good-to-be-true results usually mean leakage.",
    },
    {
      id: "femq04",
      prompt: "A model will be used on 31 March with a 60-day horizon. Which is the latest training snapshot with complete labels?",
      options: ["31 March", "28 February", "31 January", "31 December"],
      answer: 3,
      explanation: "January's outcomes run into April; December's are known by early March.",
    },
    {
      id: "femq05",
      prompt: "A random split gives AUC 0.90; a time-based test gives 0.87. Which should you report?",
      options: ["0.90", "0.87, because real use always predicts a later period", "The average", "Neither"],
      answer: 1,
      explanation: "The time-based score is the honest one.",
    },
    {
      id: "femq06",
      prompt: "Gradient boosting scores 0.865 and logistic regression 0.871 on the same time-based test. What should you choose?",
      options: ["Boosting, because it's more advanced", "Logistic regression: at least as good, simpler and easier to explain", "Neither", "Average them"],
      answer: 1,
      explanation: "Prefer the simpler model when scores are close.",
    },
    {
      id: "femq07",
      prompt: "A model ranks perfectly but every probability is half the true rate. What's true?",
      options: ["AUC is low", "AUC is high, but the model isn't calibrated", "It's calibrated", "Its Brier score is perfect"],
      answer: 1,
      explanation: "AUC measures order; calibration measures values.",
    },
    {
      id: "femq08",
      prompt: "The top 10% of a list contains 57% of churners. What is the lift there?",
      options: ["0.57", "About 5.7", "10", "57"],
      answer: 1,
      explanation: "57% ÷ 10% ≈ 5.7.",
    },
    {
      id: "femq09",
      prompt: "Calling the second decile reaches 17 churners for 121 calls. A call costs ₦1,500; a save is worth ₦12,000 with a 30% save rate. Is it worth it?",
      options: ["Yes", "No: 17 × 0.3 × ₦12,000 ≈ ₦61,000 is less than 121 × ₦1,500 ≈ ₦182,000", "Only in December", "Impossible to say"],
      answer: 1,
      explanation: "Stop where the marginal value turns negative.",
    },
    {
      id: "femq10",
      prompt: "Churn rises sharply only among customers acquired through social ads. What is this?",
      options: ["Overfitting", "Drift, located in one segment", "Leakage", "Calibration"],
      answer: 1,
      explanation: "Segment monitoring shows where the world changed.",
    },
    {
      id: "femq11",
      prompt: "A competitor launched in March. Why doesn't retraining at the end of April fix the model?",
      options: ["Retraining never helps", "The newest complete labels predate most of the change, so the model can't learn it yet", "April has too few customers", "The model is calibrated"],
      answer: 1,
      explanation: "Models learn only from outcomes that have already happened.",
    },
    {
      id: "femq12",
      prompt: "Why does monitoring a 60-day churn model always lag?",
      options: ["It doesn't", "You only learn whether a month's predictions were right 60 days later", "Dashboards are slow", "Data arrives quarterly"],
      answer: 1,
      explanation: "Plan for the delay, and watch leading signals in the meantime.",
    },
  ],
};
