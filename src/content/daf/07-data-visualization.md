---
title: Data visualization
minutes: 25
summary: Which chart answers which question, and the design habits that make a chart clear in five seconds.
---

## The problem

You've found that North West revenue nearly halved while the rest of the business grew. You could say it in a sentence, but the sales director will remember a chart. The wrong chart, though, can hide the finding or even suggest the opposite.

## The concept

**Pick the chart from the question.**

| Question | Chart | Example |
| :-- | :-- | :-- |
| How does something change over time? | **Line chart** | Monthly revenue, January 2025 to June 2026 |
| How do categories compare? | **Bar chart** (horizontal bars for long labels) | Revenue by region |
| What is it made of? | **Stacked bar** or, for 2–4 parts, a **pie/donut** | Revenue split by channel |
| Are two measures related? | **Scatter plot** | Credit limit vs amount ordered, per customer |
| What is the one number? | **Big number (card)** with a comparison | "₦290.7m, up 19% on H1 2025" |
| Exact values to look up | **Table** | Revenue by product and month |

**Design habits that make charts clear**

1. **Title with the finding**, not the topic: "North West revenue nearly halved" beats "Revenue by region".
2. **Start bar charts at zero.** Cutting the axis makes small differences look huge.
3. **Sort bars** from largest to smallest unless the categories have a natural order (months, job levels).
4. **Highlight one thing.** Grey for context, one strong colour for the point you're making.
5. **Label directly** instead of using a legend the reader must decode.
6. **Remove clutter:** heavy gridlines, 3D effects, shadows, backgrounds.

**Charts to avoid**

- **3D charts.** Perspective distorts the sizes you're comparing.
- **Pie charts with many slices.** People can't compare angles well; past four slices, use a bar chart.
- **Two different y-axes** on one chart, unless the audience is used to them. They invite false conclusions.

## Example

The same data, two ways.

**Weak:** a pie chart of H1 2026 revenue with six slices, titled "Revenue by region", in six bright colours. Lagos is obviously biggest; nothing else is readable, and the North West fall is invisible because a pie shows only one period.

**Strong:** a bar chart with each region's H1 2025 bar in light grey and its H1 2026 bar next to it, North West's 2026 bar in red, sorted by 2026 revenue, titled *"Every region but two grew; North West nearly halved."* The point is visible in five seconds.

## Walkthrough

To build the strong version in a spreadsheet:

1. Lay out a small table: region, H1 2025, H1 2026 (the table from the previous lesson).
2. Sort it by H1 2026, largest first.
3. Select it and insert a **clustered bar** (or column) chart.
4. Colour the 2025 series light grey and the 2026 series dark.
5. Click North West's 2026 bar alone and colour it red.
6. Replace the default title with the finding.
7. Delete the gridlines you don't need, and check the axis starts at 0.

> [!TIP]
> The five-second test: show the chart to someone for five seconds and ask what it says. If they can't tell you the finding, change the title or the highlighting before changing anything else.

## Practice

```answer
{
  "id": "daf-07-p1",
  "prompt": "The finance manager wants to see how **monthly** revenue moved from January 2025 to June 2026. Which chart type fits best? (One or two words.)",
  "answer": "line chart",
  "accept": ["line", "line graph", "a line chart", "line plot"],
  "format": "text",
  "hint": "The question is about change over time.",
  "explanation": "A line chart shows the trend and the December peak at a glance.",
  "required": true
}
```

```answer
{
  "id": "daf-07-p2",
  "prompt": "A colleague's bar chart of revenue by region has its axis starting at ₦15 million instead of zero. North West (₦16.6m) looks almost empty and Lagos (₦152.8m) enormous. What is the lowest value the axis should start at?",
  "answer": 0,
  "format": "number",
  "hint": "Bar length is read as size. What must the baseline be for lengths to be honest?",
  "explanation": "Bars must start at zero, otherwise their lengths exaggerate differences.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which is the best title for a chart showing regional revenue?",
    "options": ["Chart 3", "Revenue by region", "Lagos brings in more than half of revenue", "Regional data (₦)"],
    "answer": 2,
    "explanation": "A title that states the finding tells the reader what to see."
  },
  {
    "prompt": "You need to show revenue split across 12 products. Which chart?",
    "options": ["Pie chart", "3D pie chart", "Sorted bar chart", "Line chart"],
    "answer": 2,
    "explanation": "Twelve slices is far too many for a pie. A sorted bar chart makes the ranking obvious."
  },
  {
    "prompt": "Why highlight one bar in a strong colour and leave the rest grey?",
    "options": ["It prints better", "It directs attention to the point you're making", "Grey is more accurate", "Charts must have two colours"],
    "answer": 1,
    "explanation": "Colour is the fastest way to say 'look here'. Using it everywhere means it says nothing."
  }
]
```
