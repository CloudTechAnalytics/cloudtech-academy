---
title: Pivot tables and trends over time
minutes: 20
summary: Build pivot tables and crosstabs in pandas, summarise by month, and measure change properly with growth rates, year-on-year comparisons and rolling averages.
---

## The problem

The board meets next week. The managing director wants one slide on how Kolanut is doing, and the questions behind it are all about **change over time**:

> "Are we growing? Which regions are growing and which are falling? Is the dip in May a real problem or just noise?"

Raw monthly totals don't answer that well: months have different numbers of trading days, December always spikes, and the data stops at June 2026. Answering honestly takes three tools: a **pivot table** to lay the numbers out, **growth rates** to compare like with like, and a **rolling average** to see the trend under the noise.

## The concept

### `pivot_table`: rows × columns × a value

```python
pd.pivot_table(full, index="region", columns="year", values="revenue", aggfunc="sum")
```

```text
year                  2025         2026
region
Lagos          258393705.0  152768595.0
North Central   50374935.0   27165785.0
North West      64934505.0   16646820.0
South East      40948980.0   19367705.0
South South     45314580.0   23088650.0
South West      79844085.0   51692900.0
```

One row per region, one column per year, revenue summed in each cell. It's a `groupby` on two columns followed by `unstack()`, written in one readable call. Add `margins=True` for totals, and `fill_value=0` where a combination has no rows.

### `pd.crosstab`: counts of two categories

`pd.crosstab(full["region"], full["channel"])` counts rows for each region and channel. `normalize="index"` turns each row into shares that add up to 1.

### Time series: one row per period

Turn dates into periods, then group:

```python
monthly = orders.groupby(orders["order_date"].dt.to_period("M"))["revenue"].sum()
monthly.head(3)
```

```text
order_date
2025-01    37088460.0
2025-02    36138690.0
2025-03    46282170.0
Freq: M, Name: revenue, dtype: float64
```

### Measuring change

- `.pct_change()` gives each period's change from the one before: `0.05` means 5% up.
- `.pct_change(12)` on monthly data compares each month with the **same month a year earlier**, which removes seasonal effects like December's spike. That's **year-on-year (YoY)**.
- `.diff()` gives the change in naira rather than in percent.
- `.rolling(3).mean()` averages each month with the two before it: a **3-month rolling average**. It smooths out one-off spikes so you can see the direction.

### Compare like with like

The data covers January 2025 to June 2026. Comparing 2026 with 2025 as whole years compares 6 months with 12. Compare **H1 2025** (January–June) with **H1 2026** instead.

> [!WARNING]
> Growth from a small base looks dramatic. A region going from ₦1m to ₦2m has "grown 100%", while one going from ₦100m to ₦110m has "only" grown 10% and added ten times as much money. Report the naira change alongside the percentage.

## Example

Set up the merged table from lesson 8, then compare the two half-years by region:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/sales/"
orders = pd.read_csv(base + "orders.csv", parse_dates=["order_date"])
customers = pd.read_csv(base + "customers.csv")
orders["revenue"] = orders["quantity"] * orders["unit_price"] * (1 - orders["discount_pct"] / 100)
full = orders.merge(customers, on="customer_id", how="left", validate="many_to_one")
full["year"] = full["order_date"].dt.year

h1 = full[full["order_date"].dt.month <= 6]
growth = pd.pivot_table(h1, index="region", columns="year", values="revenue", aggfunc="sum")
growth["change"] = growth[2026] - growth[2025]
growth["growth_pct"] = (growth[2026] / growth[2025] - 1) * 100
growth.sort_values("growth_pct", ascending=False).round(1)
```

```text
year                  2025         2026      change  growth_pct
region
South West      28946835.0   51692900.0  22746065.0        78.6
Lagos          118153395.0  152768595.0  34615200.0        29.3
South South     19748010.0   23088650.0   3340640.0        16.9
North Central   25315755.0   27165785.0   1850030.0         7.3
South East      20851155.0   19367705.0  -1483450.0        -7.1
North West      31147920.0   16646820.0 -14501100.0       -46.6
```

`parse_dates=["order_date"]` converts the dates while loading, which saves the separate `pd.to_datetime` step.

The story writes itself: Lagos added the most money (₦34.6m), South West grew fastest (79%), and **North West fell by almost half**, with South East slipping too. That's the line for the board slide, and the question for the next meeting is why.

## Walkthrough

1. Run the Example. Read the table row by row and say each result out loud in words.
2. Overall H1 growth: `h1.groupby("year")["revenue"].sum().pct_change().iloc[-1]` gives the change from H1 2025 to H1 2026 as a fraction.
3. Monthly series: `monthly = full.groupby(full["order_date"].dt.to_period("M"))["revenue"].sum()`.
4. Month-on-month change: `monthly.pct_change().round(3).tail(6)`. Notice how jumpy it is.
5. Year-on-year: `monthly.pct_change(12).dropna().round(3)`. Only January to June 2026 have a month a year earlier to compare with, so the other values are blank and `dropna()` removes them.
6. Smooth it: `monthly.rolling(3).mean()` and compare it with `monthly` for the last six months. The monthly totals swing by several million naira from one month to the next; the rolling average moves far less, so the direction is easier to see.
7. A crosstab of channel mix by region: `pd.crosstab(full["region"], full["channel"], values=full["revenue"], aggfunc="sum", normalize="index").round(2)`. Each row shows how a region's revenue splits across channels.

## Practice

```answer
{
  "id": "pyan-09-p1",
  "prompt": "By what percentage did Kolanut's total revenue grow from **H1 2025** to **H1 2026**? One decimal place.",
  "answer": 19.1,
  "format": "percent",
  "dataset": "sales",
  "files": [
    "orders"
  ],
  "verify": "SELECT ROUND(100.0 * (SUM(CASE WHEN order_date BETWEEN '2026-01-01' AND '2026-06-30' THEN quantity * unit_price * (1 - discount_pct / 100.0) END) / SUM(CASE WHEN order_date BETWEEN '2025-01-01' AND '2025-06-30' THEN quantity * unit_price * (1 - discount_pct / 100.0) END) - 1), 1) FROM orders",
  "pyVerify": "round(h1.groupby('year')['revenue'].sum().pct_change().iloc[-1] * 100, 1)",
  "hint": "Filter to January–June of both years, total by year, then new ÷ old − 1.",
  "required": true
}
```

```answer
{
  "id": "pyan-09-p2",
  "prompt": "Which month of 2026 had the **highest year-on-year growth** (against the same month of 2025)? Answer as YYYY-MM.",
  "answer": "2026-01",
  "format": "text",
  "dataset": "sales",
  "files": [
    "orders"
  ],
  "verify": "WITH m AS (SELECT strftime('%Y-%m', order_date) AS month, SUM(quantity * unit_price * (1 - discount_pct / 100.0)) AS r FROM orders GROUP BY 1) SELECT a.month FROM m a JOIN m b ON b.month = strftime('%Y-%m', date(a.month || '-01', '-1 year')) ORDER BY a.r / b.r DESC LIMIT 1",
  "pyVerify": "str(full.groupby(full['order_date'].dt.to_period('M'))['revenue'].sum().pct_change(12).idxmax())",
  "hint": "monthly.pct_change(12).idxmax()",
  "required": true
}
```

```answer
{
  "id": "pyan-09-p3",
  "prompt": "What is the **3-month rolling average** of monthly revenue for **June 2026** (the average of April, May and June 2026)? Round to the nearest naira.",
  "answer": 49173775,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(SUM(quantity * unit_price * (1 - discount_pct / 100.0)) / 3) FROM orders WHERE order_date BETWEEN '2026-04-01' AND '2026-06-30'",
  "pyVerify": "round(full.groupby(full['order_date'].dt.to_period('M'))['revenue'].sum().rolling(3).mean().iloc[-1])",
  "hint": "monthly.rolling(3).mean().iloc[-1]",
  "required": true
}
```

## Challenge

```answer
{
  "id": "pyan-09-c1",
  "prompt": "In H1 2026, what **share** of **North West** revenue came through the **Wholesale** channel? One decimal place.",
  "answer": 64.4,
  "format": "percent",
  "dataset": "sales",
  "files": [
    "orders",
    "customers"
  ],
  "verify": "SELECT ROUND(100.0 * SUM(CASE WHEN c.channel = 'Wholesale' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) / SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)), 1) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.region = 'North West' AND o.order_date BETWEEN '2026-01-01' AND '2026-06-30'",
  "pyVerify": "round(pd.crosstab(h1['region'], [h1['year'], h1['channel']], values=h1['revenue'], aggfunc='sum')[2026].pipe(lambda t: t.div(t.sum(axis=1), axis=0)).loc['North West', 'Wholesale'] * 100, 1)",
  "hint": "Filter h1 to 2026 first, then pd.crosstab(region, channel, values=revenue, aggfunc=\"sum\", normalize=\"index\").",
  "explanation": "When one channel is most of a region's revenue, a fall there is often a story about a few large customers. That's where to look next.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The data runs from January 2025 to June 2026. Why compare H1 2025 with H1 2026 instead of 2025 with 2026?",
    "options": ["H1 sounds more professional", "2026 only has six months, so a whole-year comparison isn't like for like", "pandas can't group by year", "December is missing"],
    "answer": 1,
    "explanation": "Compare equal periods, ideally the same months, so seasonality cancels out."
  },
  {
    "prompt": "What does monthly.pct_change(12) compare?",
    "options": ["Each month with the month before", "Each month with the same month a year earlier", "The first 12 months with the rest", "Each month with the average"],
    "answer": 1,
    "explanation": "12 periods back on monthly data is one year: year-on-year change."
  },
  {
    "prompt": "Monthly revenue jumps up and down. What helps you see the direction?",
    "options": ["A 3-month rolling average", "Removing the lowest months", "Sorting the months by revenue", "A pie chart"],
    "answer": 0,
    "explanation": "Rolling averages smooth one-off spikes and dips."
  },
  {
    "prompt": "From H1 2025 to H1 2026, South West grew 79% (₦22.7m) and Lagos 29% (₦34.6m). Which statement is fair?",
    "options": ["South West matters more", "South West grew faster, but Lagos added about half as much money again", "Lagos is shrinking", "Percentages can't be compared"],
    "answer": 1,
    "explanation": "Give the naira change next to the percentage: growth from a small base looks bigger than it is."
  }
]
```
