import type { ProjectDef } from "../types";

export const TSF_PROJECT: ProjectDef = {
  id: "tsf-depot-ordering",
  courseId: "time-series-forecasting",
  title: "Kolanut Lagos depot: forecasting and ordering",
  required: true,
  summary: "A tested forecasting and ordering system for six products at a distributor's depot, with backtests, intervals, safety stock and an override guide.",
  brief: `Kolanut's Lagos depot orders stock weekly with a two-week delivery time. Replace ordering by feel with a forecasting system for all six products.

Work in Google Colab with the demand dataset. Submit a link to your notebook (shared so anyone with the link can view it), and paste your **backtest summary**, your **ordering rule** and your **override guide** below, followed by a short note on where each task is answered.`,
  tasks: [
    "Framing: the decision, horizon, granularity and cost of errors.",
    "Patterns: weekday, month, payday, pre-Eid and promotion effects measured for each product.",
    "Baselines and a model: the best baseline per product and a calendar regression using only features known in advance, on a time-based test.",
    "Effects and breaks: promotion lift and post-promotion dip, and the January 2026 price rise handled, with bias checked.",
    "Backtesting: rolling-origin results for every product, including a December and a post-price-rise origin.",
    "Ordering: prediction intervals with checked coverage, safety stock for a recommended service level, and the ordering rule.",
    "An override guide: when people should adjust the forecast, and the signals that tell them.",
  ],
  datasets: ["demand"],
  rubric: [
    "The forecast is framed around the ordering decision, with the right horizon and granularity.",
    "Every test is time-based, and no feature uses information unavailable when the forecast is made.",
    "Methods are compared with sensible baselines using WAPE and bias.",
    "Promotions, events and the price rise are handled explicitly, with evidence.",
    "Backtests cover several origins, and conclusions consider the worst case as well as the average.",
    "Intervals are checked for coverage and turned into safety stock for a justified service level.",
    "The override guide names clear situations and measurable triggers.",
  ],
};
