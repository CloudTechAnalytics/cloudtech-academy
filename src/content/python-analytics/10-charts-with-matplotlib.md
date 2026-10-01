---
title: Charts with pandas and matplotlib
minutes: 25
summary: Turn results into clear charts: line charts for trends, sorted bar charts for comparisons, readable axes in millions, titles that state the finding, and saving charts for reports.
---

## The problem

Bisi's analysis is right, but the managing director won't read a table of 18 monthly totals. He will look at one good chart for five seconds. In those five seconds he should see the answer, not work it out.

A chart earns its place when it makes one point obvious. This lesson covers the two charts that do most of an analyst's work, the **line chart** (how something changed over time) and the **sorted bar chart** (how things compare), and the small details that make them readable: the right scale, labels in millions, and a title that **says what the chart shows**.

## The concept

**pandas draws with matplotlib**

Every Series and DataFrame has a `.plot()` method that uses **matplotlib**, Python's main charting library, underneath. You import its plotting part as `plt` to adjust the chart:

```python
import matplotlib.pyplot as plt
```

**Pick the chart for the question**

| Question | Chart | pandas |
| :-- | :-- | :-- |
| How did it change over time? | Line | `series.plot()` |
| Which is biggest? How do they compare? | Bar, sorted | `series.sort_values().plot.barh()` |
| How does a whole split into parts? | Stacked bar (or a short sorted bar) | `df.plot.bar(stacked=True)` |
| How are values spread? | Histogram | `series.plot.hist(bins=20)` |

Horizontal bars (`barh`) are easier to read when the labels are long, like region or product names. Sort them so the eye goes straight from biggest to smallest.

Avoid pie charts for more than three or four slices, and avoid 3D charts entirely. People can't compare angles or perspective accurately; they can compare bar lengths.

**Make it readable**

- `ax = series.plot(...)` returns the chart's **axes**. You use it to set the title and labels: `ax.set_title(...)`, `ax.set_xlabel(...)`, `ax.set_ylabel(...)`.
- Large naira values: divide by 1,000,000 before plotting and label the axis "₦ millions". `1e6` is Python's shorthand for 1,000,000.
- Bar charts start at zero. A bar axis that starts at ₦15m makes a small difference look huge.
- `figsize=(8, 4)` sets the size in inches; wide and short suits time series.

**Titles that state the finding**

"Revenue by region" describes the chart. "North West revenue fell 47% while South West grew 79%" tells the reader what to take away. That second kind, an **action title**, is the most useful habit in this lesson.

**Saving**

`plt.savefig("revenue_trend.png", dpi=200, bbox_inches="tight")` saves the current chart. Call it **before** `plt.show()`. `bbox_inches="tight"` stops the labels being cut off.

## Example

A monthly trend with its 3-month rolling average:

```python
import pandas as pd
import matplotlib.pyplot as plt

base = "https://academy.cloudtechanalytics.com/datasets/sales/"
orders = pd.read_csv(base + "orders.csv", parse_dates=["order_date"])
customers = pd.read_csv(base + "customers.csv")
orders["revenue"] = orders["quantity"] * orders["unit_price"] * (1 - orders["discount_pct"] / 100)

monthly = orders.groupby(orders["order_date"].dt.to_period("M"))["revenue"].sum() / 1e6

ax = monthly.plot(figsize=(9, 4), marker="o", label="Monthly revenue")
monthly.rolling(3).mean().plot(ax=ax, linewidth=3, label="3-month average")
ax.set_title("Revenue is growing: H1 2026 is 19% above H1 2025, with a December peak")
ax.set_xlabel("")
ax.set_ylabel("₦ millions")
ax.legend()
plt.savefig("revenue_trend.png", dpi=200, bbox_inches="tight")
plt.show()
```

Passing `ax=ax` draws the second line on the same chart.

And a sorted bar chart of H1 growth by region:

```python
full = orders.merge(customers, on="customer_id", how="left", validate="many_to_one")
full["year"] = full["order_date"].dt.year
h1 = full[full["order_date"].dt.month <= 6]
by_region = h1.pivot_table(index="region", columns="year", values="revenue", aggfunc="sum")
growth_pct = ((by_region[2026] / by_region[2025] - 1) * 100).sort_values()

colours = ["#b4442c" if g < 0 else "#4d6b57" for g in growth_pct]
ax = growth_pct.plot.barh(figsize=(8, 4), color=colours)
ax.axvline(0, color="black", linewidth=0.8)
ax.set_title("North West revenue fell 47% in H1 2026; South West grew 79%")
ax.set_xlabel("Change from H1 2025 (%)")
ax.set_ylabel("")
plt.show()
```

Colouring the falls differently makes the point before anyone reads a number.

## Walkthrough

1. Run the trend chart. Then remove `/ 1e6` and run it again: the axis fills with numbers like `6e7`. Put it back.
2. Change the title to "Monthly revenue" and compare. Which one would the managing director remember?
3. Run the region bar chart. Try `.plot.bar()` instead of `.plot.barh()` and see how the region names squeeze together. Horizontal wins.
4. Draw a histogram of order-line revenue: `orders["revenue"].plot.hist(bins=30)`. Most lines are small, with a long tail of big ones: the "skew" you met with credit limits in lesson 3.
5. Category mix by year as a stacked bar:

```python
products = pd.read_csv(base + "products.csv")
with_category = orders.merge(products, on="product_id", how="left", validate="many_to_one")
with_category["year"] = with_category["order_date"].dt.year
mix = with_category.pivot_table(index="year", columns="category", values="revenue", aggfunc="sum") / 1e6
ax = mix.plot.bar(stacked=True, figsize=(6, 4))
ax.set_title("Household and Personal care lead in both years")
ax.set_ylabel("₦ millions")
plt.show()
```

6. Note that 2026 is a shorter bar because it's half a year. If you show this chart, say so in the title or a note, or chart H1 against H1 instead.
7. Save one chart with `plt.savefig` and download it from Colab's Files panel.

## Practice

```answer
{
  "id": "pyan-10-p1",
  "prompt": "Draw the monthly revenue line. In which month of **2025** is the **lowest** point? Answer as YYYY-MM.",
  "answer": "2025-02",
  "format": "text",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT strftime('%Y-%m', order_date) FROM orders WHERE order_date < '2026-01-01' GROUP BY 1 ORDER BY SUM(quantity * unit_price * (1 - discount_pct / 100.0)) LIMIT 1",
  "pyVerify": "str(monthly[monthly.index.year == 2025].idxmin())",
  "required": true
}
```

```answer
{
  "id": "pyan-10-p2",
  "prompt": "In the stacked bar chart of category mix, what was **Personal care** revenue in **2025**, in **millions** of naira? One decimal place.",
  "answer": 150.5,
  "format": "number",
  "dataset": "sales",
  "files": [
    "orders",
    "products"
  ],
  "verify": "SELECT ROUND(SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)) / 1e6, 1) FROM orders o JOIN products p ON p.product_id = o.product_id WHERE p.category = 'Personal care' AND o.order_date < '2026-01-01'",
  "pyVerify": "round(mix.loc[2025, 'Personal care'], 1)",
  "hint": "Look at the mix table itself: mix.round(1).",
  "required": true
}
```

```task
{
  "id": "pyan-10-t1",
  "prompt": "Write an **action title** for the region growth bar chart, for the managing director. It should say what happened, to whom, with a number. Keep it to one line.",
  "minutes": 4,
  "rows": 3,
  "placeholder": "e.g. Revenue by region",
  "rules": [
    { "label": "Names at least one region", "pattern": "north west|south west|lagos|south east|south south|north central" },
    { "label": "Includes a number or percentage", "pattern": "\\d" },
    { "label": "Says what happened (grew, fell, rose, dropped…)", "pattern": "grew|grow|fell|fall|rose|rise|drop|declin|increas|decreas|up |down |doubl|halv" },
    { "label": "Short enough to read in a glance (6 to 16 words)", "minWords": 6, "maxWords": 16 }
  ],
  "sample": "North West revenue fell 47% in H1 2026 while South West grew 79%",
  "note": "Other good titles pick one message, for example: *Four of six regions grew in H1 2026; North West fell by almost half.* A title like *Revenue growth by region* describes the chart but leaves the reader to find the point.",
  "hint": "Start with the most important region and what happened to it, then the number.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "pyan-10-c1",
  "prompt": "Plot a histogram of order-line revenue. What is the **median** order-line revenue, to the nearest naira? (It's the middle of that skewed shape, well below the mean.)",
  "answer": 166680,
  "format": "naira",
  "dataset": "sales",
  "files": [
    "orders"
  ],
  "verify": "SELECT AVG(r) FROM (SELECT quantity * unit_price * (1 - discount_pct / 100.0) AS r FROM orders ORDER BY r LIMIT 2 OFFSET 2132)",
  "pyVerify": "orders['revenue'].median()",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which chart best shows how monthly revenue changed over 18 months?",
    "options": ["A pie chart", "A line chart", "A 3D bar chart", "A table"],
    "answer": 1,
    "explanation": "Lines show change over time."
  },
  {
    "prompt": "Why use a horizontal, sorted bar chart for revenue by region?",
    "options": ["It looks modern", "Long labels fit, and sorting puts the biggest and smallest where the eye expects them", "Vertical bars can't be sorted", "matplotlib requires it"],
    "answer": 1,
    "explanation": "Readable labels and order make the comparison instant."
  },
  {
    "prompt": "Which is the better title for a chart of regional growth?",
    "options": ["Regional growth chart", "Revenue by region, H1", "North West revenue fell 47% while South West grew 79%", "Figure 3"],
    "answer": 2,
    "explanation": "An action title states the finding."
  },
  {
    "prompt": "Your saved PNG has its axis labels cut off. What fixes it?",
    "options": ["dpi=50", "plt.savefig(..., bbox_inches=\"tight\")", "Calling savefig after plt.show()", "Using a pie chart"],
    "answer": 1,
    "explanation": "bbox_inches=\"tight\" fits the saved image around everything on the chart."
  }
]
```
