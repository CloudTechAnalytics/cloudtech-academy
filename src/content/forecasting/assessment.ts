import type { AssessmentDef } from "../types";

/**
 * Final assessment for Time Series Forecasting. Scenario questions on framing, testing,
 * features, breaks, uncertainty and ordering.
 */
export const TSF_ASSESSMENT: AssessmentDef = {
  id: "time-series-forecasting-final",
  courseId: "time-series-forecasting",
  title: "Time Series Forecasting: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "tsfq01",
      prompt: "Orders take two weeks to arrive. Which period should this week's forecast focus on?",
      options: ["Tomorrow", "The weeks the order will have to cover, starting two weeks from now", "Next year", "Last month"],
      answer: 1,
      explanation: "The decision sets the horizon.",
    },
    {
      id: "tsfq02",
      prompt: "A Saturday seasonal index of 1.28 means:",
      options: ["Saturday sells 1.28 units", "Saturdays sell about 28% more than an average day", "28% of sales are on Saturday", "Saturday sales grow 28% a year"],
      answer: 1,
      explanation: "An index is relative to the average day.",
    },
    {
      id: "tsfq03",
      prompt: "A consultant's forecast fits past sales almost perfectly on the months it was built from. What does that show?",
      options: ["It will forecast well", "Nothing about future accuracy: test it on a later period it never saw", "It's biased", "It's perfect"],
      answer: 1,
      explanation: "Only a time-based hold-out mimics real use.",
    },
    {
      id: "tsfq04",
      prompt: "Why prefer WAPE to an average of daily percentage errors?",
      options: ["It's always smaller", "Daily percentage errors break on zero-sales days and over-weight quiet days", "It ignores bias", "It's newer"],
      answer: 1,
      explanation: "WAPE is total error as a share of total sales.",
    },
    {
      id: "tsfq05",
      prompt: "Forecasting 3 to 4 weeks ahead, which feature is not allowed?",
      options: ["Payday flag", "A promotion planned for that day", "Sales the day before", "Sales the same day last year"],
      answer: 2,
      explanation: "Lags shorter than the horizon aren't known when the forecast is made.",
    },
    {
      id: "tsfq06",
      prompt: "A promotion lifts sales 45% in its week, and sales fall 13% the week after. What's the two-week net gain, in normal weeks?",
      options: ["0.45", "About 0.32", "0.58", "0.13"],
      answer: 1,
      explanation: "0.45 − 0.13 = 0.32.",
    },
    {
      id: "tsfq07",
      prompt: "After a price rise, a forecast is 7% too high every week. What's the most direct fix?",
      options: ["Use more history", "Add a feature for the period after the rise, or weight recent data more, and recheck the bias", "Remove seasonality", "Ignore it"],
      answer: 1,
      explanation: "Tell the model the world changed.",
    },
    {
      id: "tsfq08",
      prompt: "Why backtest over several origins?",
      options: ["It's faster", "One test period can be lucky or unlucky; several show typical and worst-case accuracy", "To use more features", "It's required"],
      answer: 1,
      explanation: "Choose methods that win consistently.",
    },
    {
      id: "tsfq09",
      prompt: "A 90% prediction interval contains actual sales on 85% of days. What does that mean?",
      options: ["It's well calibrated", "It's too narrow: widen it or find out what changed", "It's too wide", "Intervals don't matter"],
      answer: 1,
      explanation: "Check coverage before using intervals for stock.",
    },
    {
      id: "tsfq10",
      prompt: "Ordering exactly the forecast means running out roughly how often?",
      options: ["Never", "About half the time", "5% of the time", "Always"],
      answer: 1,
      explanation: "Add safety stock for the service level you want.",
    },
    {
      id: "tsfq11",
      prompt: "How should you choose which products' forecasts to review by hand?",
      options: ["Highest WAPE", "Largest WAPE × sales value", "Newest products", "Alphabetical"],
      answer: 1,
      explanation: "Review where errors cost the most.",
    },
    {
      id: "tsfq12",
      prompt: "A competitor opens next door. What should happen to the statistical forecast?",
      options: ["Nothing: trust the model", "A person adjusts it, because the data has never seen this, and watches the errors closely", "Delete the model", "Double the safety stock permanently"],
      answer: 1,
      explanation: "Overrides are for events outside the data.",
    },
  ],
};
