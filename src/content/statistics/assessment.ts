import type { AssessmentDef } from "../types";

/**
 * Final assessment for Statistics for Data Analysis. Scenario questions with plausible
 * wrong answers: each tests whether the learner can choose and interpret the right tool.
 */
export const STAT_ASSESSMENT: AssessmentDef = {
  id: "statistics-for-data-analysis-final",
  courseId: "statistics-for-data-analysis",
  title: "Statistics for Data Analysis: final assessment",
  passingScore: 60,
  questions: [
    {
      id: "statq01",
      prompt: "Staff salaries: mean ₦610k, median ₦490k. The HR director asks what a typical employee earns. What should you report?",
      options: ["₦610k, the mean", "₦490k, the median, explaining that a few high earners pull the mean up", "₦550k, halfway between", "The highest salary"],
      answer: 1,
      explanation: "Salaries are right-skewed; the median describes a typical employee.",
    },
    {
      id: "statq02",
      prompt: "You need next year's total training budget for 150 people from this year's cost per person. Which average?",
      options: ["Median, because it's typical", "Mean, because mean × 150 gives the total", "Mode", "The lowest cost"],
      answer: 1,
      explanation: "Only the mean multiplies back up to a total.",
    },
    {
      id: "statq03",
      prompt: "Two suppliers both deliver in 12 days on average. A's standard deviation is 1 day, B's is 5 days. Which statement is right?",
      options: ["They're equally reliable", "A is far more predictable; B's customers need more safety stock", "B is faster", "Standard deviation doesn't matter for delivery"],
      answer: 1,
      explanation: "Same average, very different reliability.",
    },
    {
      id: "statq04",
      prompt: "Q1 = 80,000, Q3 = 280,000. Which value is a high outlier by the IQR rule?",
      options: ["400,000", "560,000", "600,000", "280,000"],
      answer: 2,
      explanation: "Upper fence = 280,000 + 1.5 × 200,000 = 580,000. Only 600,000 is above it.",
    },
    {
      id: "statq05",
      prompt: "A histogram of delivery times has two clear peaks, at 2 days and at 30 days. What should you do?",
      options: ["Report the overall average", "Split the data: it's probably two kinds of shipment (such as air and sea) mixed together", "Delete the smaller peak", "Use the mode"],
      answer: 1,
      explanation: "Bimodal data usually means two groups. Summarise each separately.",
    },
    {
      id: "statq06",
      prompt: "On-time delivery fell from 80% to 70%. Which is correct?",
      options: ["It fell 10%", "It fell 10 percentage points, a 12.5% fall", "It fell 12.5 percentage points", "It fell 10 points, a 10% fall"],
      answer: 1,
      explanation: "80 − 70 = 10 pp; 10 ÷ 80 = 12.5%.",
    },
    {
      id: "statq07",
      prompt: "Discount rates are 2% on small lines and 8% on large lines, and large lines are most of the value. The simple average of the rates is 3%. What does finance need?",
      options: ["The 3% simple average", "A value-weighted average, which will be higher than 3%", "The median rate", "The highest rate"],
      answer: 1,
      explanation: "Weight by value with SUMPRODUCT; large lines carry the higher rate.",
    },
    {
      id: "statq08",
      prompt: "Discounted order lines are bigger (r = 0.34). Within each sales channel, the correlation is about 0. What's going on?",
      options: ["Discounts cause bigger orders", "Channel is a confounder: wholesalers both buy more and get more discounts", "The correlation is wrong", "Small orders cause discounts"],
      answer: 1,
      explanation: "A third factor drives both. Comparing within one channel removes it.",
    },
    {
      id: "statq09",
      prompt: "r = 0.6 between advertising spend and sales. What is r², and what does it mean?",
      options: ["0.36: about 36% of the variation in sales is explained by a straight-line relationship with spend", "0.6: spend causes 60% of sales", "1.2", "0.36: each naira of spend returns 36 kobo"],
      answer: 0,
      explanation: "r² is the share of variation explained, not a causal effect.",
    },
    {
      id: "statq10",
      prompt: "Data SD = ₦140,000. What's the standard error of the mean for a random sample of 400?",
      options: ["₦140,000", "₦7,000", "₦350", "₦35,000"],
      answer: 1,
      explanation: "SE = 140,000 ÷ √400 = 140,000 ÷ 20.",
    },
    {
      id: "statq11",
      prompt: "A survey of 3,000 customers who chose to answer an email gives a narrow confidence interval. What doesn't the interval account for?",
      options: ["Random sampling error", "Bias from who chose to answer", "The sample size", "The confidence level"],
      answer: 1,
      explanation: "Intervals cover random sampling error only. A big biased sample is still biased.",
    },
    {
      id: "statq12",
      prompt: "Mean days to pay is 45, with a 95% confidence interval of 43 to 48 days. Which statement is right?",
      options: ["95% of invoices are paid in 43 to 48 days", "We're 95% confident the true average is between 43 and 48 days", "No invoice takes more than 48 days", "The average is exactly 45"],
      answer: 1,
      explanation: "The interval is about the average, not individual invoices.",
    },
    {
      id: "statq13",
      prompt: "After a price rise, average order size fell slightly; T.TEST gives p = 0.23. What's the right conclusion?",
      options: ["The price rise cut order size", "There's no evidence the price rise changed order size; the gap is within normal variation", "The price rise increased order size", "The test proves there's no effect at all"],
      answer: 1,
      explanation: "Not significant: chance can explain it. That isn't proof of zero effect.",
    },
    {
      id: "statq14",
      prompt: "With 2 million rows, a ₦3 difference in average basket gives p < 0.001. What should you say?",
      options: ["A major finding", "Statistically significant, but too small to matter in practice", "The test is broken", "Nothing"],
      answer: 1,
      explanation: "Report the size of the difference, not just the p-value.",
    },
    {
      id: "statq15",
      prompt: "A pricing line fitted on loads of 1 to 8 containers has r² = 0.98. A customer asks for 60 containers. What's the risk?",
      options: ["None: r² is high", "Extrapolation: the relationship may not hold far outside the data", "r² becomes negative", "The slope reverses"],
      answer: 1,
      explanation: "A good fit inside the data says little about far outside it.",
    },
  ],
};
