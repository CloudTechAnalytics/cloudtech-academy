import type { AssessmentDef } from "../types";

/**
 * Final assessment for Machine Learning Fundamentals. Scenario questions: each tests
 * judgement about evaluation, leakage, thresholds and responsible use, not syntax.
 */
export const ML_ASSESSMENT: AssessmentDef = {
  id: "machine-learning-fundamentals-final",
  courseId: "machine-learning-fundamentals",
  title: "Machine Learning Fundamentals: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "mlq01",
      prompt: "Which of these is best solved with a fixed rule rather than machine learning?",
      options: ["Predicting next month's sales", "Flagging transactions over ₦5m for a manager's approval", "Estimating rent from a flat's features", "Predicting which customers will leave"],
      answer: 1,
      explanation: "If the rule can be written down exactly, write it down.",
    },
    {
      id: "mlq02",
      prompt: "A churn model scores 99% in testing using 'cancellation date' as a feature. What's wrong?",
      options: ["Nothing", "Leakage: the cancellation date only exists after the customer has left", "Too few features", "The test set is too large"],
      answer: 1,
      explanation: "Ask of every feature: would I know this when I need the prediction?",
    },
    {
      id: "mlq03",
      prompt: "A model's test MAE is ₦2.6m; predicting each area's median rent gives ₦2.9m. What should you conclude?",
      options: ["The model is excellent", "It only modestly beats a simple rule; check whether its complexity is worth it", "The baseline is wrong", "MAE is the wrong measure"],
      answer: 1,
      explanation: "Always compare with a baseline.",
    },
    {
      id: "mlq04",
      prompt: "Rents are driven by percentage effects (serviced adds about 30% everywhere). What helps a linear model most?",
      options: ["More rows", "Modelling the log of rent and converting predictions back", "Removing area", "Using accuracy"],
      answer: 1,
      explanation: "Percentage effects become additive on the log scale.",
    },
    {
      id: "mlq05",
      prompt: "Training MAE ₦200, test MAE ₦1.4m. What's happening?",
      options: ["Underfitting", "Overfitting", "A perfect model", "Data leakage in the test set"],
      answer: 1,
      explanation: "A big gap between training and test error means memorisation.",
    },
    {
      id: "mlq06",
      prompt: "How should you choose a tree's max_depth?",
      options: ["By the test-set error", "By cross-validation on the training data, then score the test set once", "Always use the deepest tree", "By training error"],
      answer: 1,
      explanation: "Tuning on the test set makes its score optimistic.",
    },
    {
      id: "mlq07",
      prompt: "12% of loans default. A model is 88.6% accurate. What should you check first?",
      options: ["Nothing, it's good", "How many defaults it actually catches: always predicting 'no default' is 88% accurate", "Its training time", "The number of trees"],
      answer: 1,
      explanation: "Accuracy misleads when one class is rare.",
    },
    {
      id: "mlq08",
      prompt: "Lowering the threshold from 0.5 to 0.2 usually:",
      options: ["Raises precision, lowers recall", "Raises recall, lowers precision", "Changes nothing", "Raises both"],
      answer: 1,
      explanation: "You catch more defaults but flag more good borrowers.",
    },
    {
      id: "mlq09",
      prompt: "What should decide a lending model's threshold?",
      options: ["Always 0.5", "The business cost of each kind of mistake", "Whatever maximises accuracy", "The AUC"],
      answer: 1,
      explanation: "Put naira on false positives and false negatives.",
    },
    {
      id: "mlq10",
      prompt: "Removing 'region' from a credit model barely changes its AUC. What should you do?",
      options: ["Keep it", "Drop it: it adds little and may act as a proxy for protected groups", "Add more regions", "Use only region"],
      answer: 1,
      explanation: "Little value plus fairness risk.",
    },
    {
      id: "mlq11",
      prompt: "Why put preprocessing inside a scikit-learn Pipeline?",
      options: ["It's faster to type", "So raw new rows are prepared exactly as in training, every time", "Pipelines are more accurate", "It's required"],
      answer: 1,
      explanation: "Consistent preparation prevents silent errors in production.",
    },
    {
      id: "mlq12",
      prompt: "A deployed model's predicted default rate is 10%, but loans are now defaulting at 15%. What should happen?",
      options: ["Nothing", "Investigate drift and review or retrain the model", "Lower the threshold to 0", "Delete the model"],
      answer: 1,
      explanation: "Monitoring triggers exist for exactly this.",
    },
    {
      id: "mlq13",
      prompt: "Impurity-based feature importance in a random forest ranks 'borrower_age' highly, but permutation importance shows almost nothing. Which is more trustworthy?",
      options: ["Impurity-based", "Permutation importance, which measures how much performance actually drops", "Neither", "Both equally"],
      answer: 1,
      explanation: "Impurity importance favours features with many distinct values.",
    },
  ],
};
