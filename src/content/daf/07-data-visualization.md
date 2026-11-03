---
title: Data visualization
minutes: 20
summary: How people read charts, which chart answers which question, the parts of a chart, colour, misleading charts, and the habits that make a chart clear in five seconds.
---

## The problem

You've found that North West revenue nearly halved while the rest of the business grew. You could say it in a sentence, but the sales director will remember a chart. The wrong chart, though, can hide the finding or even suggest the opposite.

## The concept

A chart is a way of making one point quickly. Good charts are chosen for the question, designed so the eye goes straight to the point, and honest about the numbers.

### How people read charts

A chart turns numbers into something the eye can compare: positions, lengths, angles, areas, colours. People judge some of these much more accurately than others:

| Encoding | How accurately people compare it | Used in |
| :-- | :-- | :-- |
| **Position** along a common scale | Very accurately | Line charts, dot plots, scatter plots |
| **Length** from a common baseline | Very accurately | Bar charts |
| **Angle** and **area** | Poorly | Pie and donut charts, bubbles |
| **Colour intensity** | Roughly | Heat maps |

That's the reason behind most chart advice. Bars and lines use position and length, which we read well; pies use angles, which we don't. When the comparison matters, use bars or lines.

### Pick the chart from the question

| Question | Chart | Kolanut example |
| :-- | :-- | :-- |
| How does something change over time? | **Line chart** | Monthly revenue, January 2025 to June 2026 |
| How do categories compare? | **Bar chart** (horizontal bars for long labels) | Revenue by region |
| How do two periods compare, by category? | **Paired bars** | Each region, H1 2025 against H1 2026 |
| What is it made of? | **Stacked bar** or, for 2–4 parts, a **pie/donut** | Revenue split by channel |
| Are two measures related? | **Scatter plot** | Credit limit against amount ordered, per customer |
| How are values spread out? | **Histogram** | Order line values in ₦50,000 bands |
| What is the one number? | **Big number (card)** with a comparison | "₦290.7m, up 19% on H1 2025" |
| Exact values to look up | **Table** | Revenue by product and month |

A **table** is the right choice more often than people think: when the reader needs exact numbers rather than a pattern, give them a table.

### The parts of a chart

| Part | Job | Habit |
| :-- | :-- | :-- |
| **Title** | Tells the reader what to see | Write the finding, not the topic |
| **Subtitle** | Says what's measured | "Revenue, January to June, ₦ million" |
| **Axes** | Give the scale | Start bar charts at zero; label units once |
| **Data labels** | Exact values where they matter | Label the bars or points you discuss, not every one |
| **Legend** | Decodes colours | Prefer labelling series directly |
| **Source note** | Says where the data came from | Small, at the bottom |

### Design habits that make charts clear

1. **Title with the finding**, not the topic: "North West revenue nearly halved" beats "Revenue by region".
2. **Start bar charts at zero.** A bar's length is its value; cutting the axis makes small differences look huge.
3. **Sort bars** from largest to smallest unless the categories have a natural order (months, job levels, size bands).
4. **Highlight one thing.** Grey for context, one strong colour for the point you're making.
5. **Label directly** instead of using a legend the reader must decode.
6. **Remove clutter:** heavy gridlines, 3D effects, shadows, backgrounds, unnecessary decimals.
7. **Round sensibly.** ₦290.7m, not ₦290,730,455.00, on a chart for a director.

### Colour

- **Use colour for meaning, not decoration.** If every bar is a different colour, the reader looks for a meaning that isn't there.
- **Grey is your friend.** It lets the highlighted item stand out.
- **Red and green together** are hard to tell apart for about 1 in 12 men with colour blindness. Pair colour with something else: a label, a position, a shape.
- **Be consistent.** If Lagos is gold on one chart, keep it gold on the next.

### Charts that mislead

Some charts mislead by accident; a careful analyst avoids all of these:

| Problem | Effect | Fix |
| :-- | :-- | :-- |
| **Bar axis that doesn't start at zero** | A 5% difference looks like 50% | Start bars at zero, or use a line or dot chart |
| **3D charts** | Perspective makes near slices or bars look bigger | Always 2D |
| **Pie with many slices** | Angles can't be compared past four slices | Sorted bar chart |
| **Two y-axes** | The scales can be chosen to suggest any relationship | Two separate charts, or use sparingly and label clearly |
| **Cherry-picked period** | Starting the chart at a low point makes any growth look dramatic | Show a fair period and say why you chose it |
| **Unequal time gaps** | Points spaced evenly when the dates aren't | Use a real date axis |

## Example

The same data, two ways:

![Two charts of the same data. Left: a six-slice pie of first-half 2026 revenue in bright colours, titled Revenue by region. Right: paired horizontal bars for each region, 2025 in grey and 2026 in gold, with North West's 2026 bar in red, titled Every region but two grew; North West nearly halved.](/images/courses/daf/weak-strong-chart.svg "The pie shows one period and hides the finding. The paired bars show the change, and the title says what it is.")

**Weak:** a pie chart of H1 2026 revenue with six slices, titled "Revenue by region", in six bright colours. Lagos is obviously biggest; nothing else is readable, and the North West fall is invisible because a pie shows only one period.

**Strong:** a bar chart with each region's H1 2025 bar in light grey and its H1 2026 bar next to it, North West's 2026 bar in red, sorted by 2026 revenue, titled *"Every region but two grew; North West nearly halved."* The point is visible in five seconds.

What changed? The **chart type** now matches the question (a comparison over two periods). The **title** states the finding. **Colour** is used once, for the point. Nothing was added; the strong version is mostly the weak one with the noise removed and the right comparison put in.

## Walkthrough

To build the strong version in a spreadsheet:

1. Lay out a small table: region, H1 2025, H1 2026 (the table from the previous lesson).
2. Sort it by H1 2026, largest first.
3. Select it and insert a **clustered bar** (or column) chart.
4. Colour the 2025 series light grey and the 2026 series dark.
5. Click North West's 2026 bar alone and colour it red.
6. Replace the default title with the finding, and add a subtitle with the units: "Revenue, January to June, ₦ million".
7. Delete the gridlines you don't need, and check the axis starts at 0.
8. Add data labels to the 2026 bars only.

> [!TIP]
> The five-second test: show the chart to someone for five seconds and ask what it says. If they can't tell you the finding, change the title or the highlighting before changing anything else.

### Summary

| Need | Use |
| :-- | :-- |
| Change over time | Line chart |
| Compare categories | Sorted bar chart |
| Two periods by category | Paired bars |
| Parts of a whole | Stacked bar; pie only for 2–4 parts |
| Relationship between two measures | Scatter plot |
| Spread of values | Histogram |
| One headline number | A card, with a comparison |
| Exact values | A table |
| Every chart | Finding as the title, zero baseline for bars, one highlight, no clutter |

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


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "daf-07-d1",
  "prompt": "You're making a bar chart of employees by department from the HR `employees.csv` (all 80, active or not). Which department is the **longest** bar?",
  "answer": "Operations",
  "format": "text",
  "dataset": "hr",
  "files": [
    "employees"
  ],
  "verify": "SELECT department FROM employees GROUP BY department ORDER BY COUNT(*) DESC LIMIT 1",
  "hint": "Count employees per department; the biggest count is the longest bar.",
  "required": false
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
