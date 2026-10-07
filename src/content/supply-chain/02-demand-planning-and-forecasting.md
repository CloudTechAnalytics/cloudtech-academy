---
title: Demand Planning and Forecasting
minutes: 25
summary: Understand why demand is hard to predict, use simple forecasting methods, allow for seasonality and trends, measure forecast error and connect forecasts to plans through sales and operations planning.
---

## Why demand is hard to predict

Almost every supply chain decision depends on a forecast: how much to make, buy, stock and ship. Yet demand is never certain. It moves with prices, promotions, competitors, the economy, the weather, festivals and plain customer whim. Forecasts are **always wrong to some degree**. The aim is not a perfect forecast but a **useful, honestly measured** one, and plans that cope with the error.

A helpful rule: forecasts for a group of products or a longer period are more accurate than for one item or one day. Predicting total monthly sales is easier than predicting one colour on one Tuesday.

## Simple forecasting methods

You can forecast well with simple tools.

**1. Naive forecast.** Next period will equal this period. Surprisingly hard to beat for stable items.

**2. Moving average.** Average the last few periods. If the last four months' sales were 120, 135, 150 and 140, the **3-month moving average** of the latest three is (135 + 150 + 140) ÷ 3 = **141.7**, so forecast about **142** for next month. It smooths out random ups and downs but reacts slowly to real change.

**3. Weighted moving average.** Give more weight to recent periods, for example 50% to the latest month, 30% to the one before and 20% to the one before that.

**4. Exponential smoothing.** Next forecast = old forecast + α × (actual − old forecast), where α (between 0 and 1) says how fast to react. A larger α reacts faster to change.

**5. Judgement and market information.** Salespeople know about a big order coming. Marketing knows about a promotion. Add these to the statistical forecast, but record them so you can learn which judgements were right.

Always forecast **in the unit you plan in** (units, cartons or kilograms, not naira) and for the **period that matches your lead time**.

## Seasonality and trends

Demand often has patterns:

- **Trend:** a steady rise or fall over time.
- **Seasonality:** a repeating pattern, such as a December peak, rainy-season dips or beginning-of-term school supplies.
- **Random variation:** unexplained noise.

A **seasonal index** shows how a period compares with the average. If December sales are 300 and the average month is 200, the December index is 300 ÷ 200 = **1.5**. To forecast next December, take the underlying (deseasonalised) level, say 220 a month, and multiply: 220 × 1.5 = **330**. Use at least two years of data to see a season reliably, and watch for events that moved the pattern (for example, a one-off promotion).

## Measuring forecast error

You must know how wrong you are. For each period:

- **Error = actual − forecast.** If you forecast 140 and sold 150, the error is +10.
- **Percentage error = error ÷ actual.** 10 ÷ 150 = 6.7%.
- **MAPE** (mean absolute percentage error): the average of the absolute percentage errors across periods. A lower number is better.
- **Bias:** whether errors lean one way. If you consistently over-forecast, you build excess stock; consistent under-forecasting causes stockouts.

Review errors every month, find the causes and improve. Keep **safety stock** (module 4) to cover the error that remains.

## Sales and operations planning (S&OP)

**S&OP** is a regular (usually monthly) process that brings sales, marketing, operations, purchasing, finance and management together to agree **one plan**:

1. **Review** last month's performance against plan.
2. **Update the demand plan** with new information.
3. **Check supply:** capacity, materials, transport, and what is feasible.
4. **Resolve gaps:** adjust demand (promotions), supply (overtime, extra suppliers) or inventory.
5. **Agree one plan** and the financial impact.
6. **Decide and communicate** it to everyone.

Without S&OP, each department plans on its own numbers: sales promise more than operations can make, or purchasing buys what finance has not funded. With it, the business works from a single set of numbers.

> [!NOTE]
> A famous problem is the **bullwhip effect**: small changes in customer demand grow into bigger swings in orders further up the chain, because each link adds a safety buffer and reacts to the last order it received. Sharing real sales data along the chain reduces it.

## Try it

```task
{
  "id": "scm-m02-t1",
  "prompt": "Monthly sales were **120, 135, 150, 140**. Work out the **3-month moving average forecast** for next month (use the latest three). Then forecast with a **weighted average** of 50% on the latest month, 30% on the one before and 20% on the one before that.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "3-month average = ...",
  "rules": [
    { "label": "Moving average of about 141.7 (or 142)", "pattern": "141\\.7|141\\.67|\\b142\\b" },
    { "label": "Weighted forecast of 142", "pattern": "142\\.0|\\b142\\b" },
    { "label": "Uses the latest three months (135, 150, 140)", "pattern": "135[\\s\\S]*150[\\s\\S]*140" }
  ],
  "sample": "3-month moving average = (135 + 150 + 140) / 3 = 425 / 3 = 141.7, so about 142.\nWeighted average = 0.5 x 140 + 0.3 x 150 + 0.2 x 135 = 70 + 45 + 27 = 142.0.",
  "required": true
}
```

```task
{
  "id": "scm-m02-t2",
  "prompt": "December sales are usually **300**, and the average month is **200**. Work out the **December seasonal index**. Next year's underlying level is **220** a month. Forecast next December, and say what could make the forecast wrong.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Seasonal index = ...",
  "rules": [
    { "label": "Seasonal index of 1.5", "pattern": "1\\.5\\b" },
    { "label": "Forecast of 330", "pattern": "\\b330\\b" },
    { "label": "Names something that could make it wrong (promotion, economy, competitor, price, stockout, one-off)", "pattern": "promotion|economy|competitor|price|stock-?out|one-?off|weather|event|trend|change" }
  ],
  "sample": "Seasonal index = 300 / 200 = 1.5.\nForecast for next December = 220 x 1.5 = 330 units.\nIt could be wrong if a one-off promotion inflated last December's sales, if a competitor changes its prices, or if the economy changes how much customers spend.",
  "required": true
}
```

```task
{
  "id": "scm-m02-t3",
  "prompt": "You forecast **140** units and sold **150**. Calculate the **error** and the **percentage error**. Then say in 30 to 70 words why it matters if you are wrong in the same direction every month.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Error = ...",
  "rules": [
    { "label": "Error of +10 (or 10)", "pattern": "\\+?\\b10\\b" },
    { "label": "Percentage error of 6.7%", "pattern": "6\\.7|6\\.67" },
    { "label": "Explains bias leads to stockouts or excess stock", "pattern": "bias|stock-?out|excess|too much|too little|consistent|over-?forecast|under-?forecast" },
    { "label": "Between 30 and 80 words in total", "minWords": 30, "maxWords": 85 }
  ],
  "sample": "Error = 150 - 140 = +10. Percentage error = 10 / 150 = 6.7%.\nIf I am wrong in the same direction every month, that is bias. Consistent under-forecasting causes stockouts and lost sales, while consistent over-forecasting builds excess stock that ties up cash, so I must correct the method, not just add a buffer.",
  "required": false
}
```

Next lesson: sourcing and supplier management.
