---
title: Dashboard and story
minutes: 30
summary: Turn findings into a report a chief executive can read in five minutes, with chart titles that state the finding, an honest view of the targets and a one-page executive summary.
---

## The problem

You now have a dozen solid findings. Put all of them on one page with equal weight and the chief executive will remember none of them. A board has perhaps ten minutes for your work. What they need is the **three things that matter most**, the evidence for each, and what to do about it.

There's one more question in the brief you haven't answered yet: "Do our targets make sense?" The answer turns out to change how the board should read the whole report.

## The concept

**Structure the report like an argument**

| Page | Purpose | Contents |
| :-- | :-- | :-- |
| 1. Overview | the answer, at a glance | net sales, like-for-like growth, gross margin, target attainment; a trend line; the three key messages in text |
| 2. Stores | where it's going well and badly | like-for-like growth by store, target attainment, Port Harcourt's trend |
| 3. Products | where the profit is | sales and gross profit by category, return rates |
| 4. Opportunities | money left on the table | attach rate by store, stock-out estimates |

**Titles that say the finding**

A chart titled "Net sales by store" makes the reader work out the message. "Port Harcourt is the only store to shrink, down 27% in transactions since February" tells them, and the chart becomes the proof. Write every title as a sentence with the finding in it.

**Targets: is the measuring stick fair?**

Before you judge a store against its target, judge the target. Lekki's target was set at ₦52m a month **from its first month**, the level of a mature store. Of course it "failed" for its first six months: no new store starts at full speed. Judged on its trajectory, Lekki is a success: it beat ₦52m in April, May and June 2026. A report that just says "Lekki: 55% of target" in 2025 would be accurate and badly misleading.

**The executive summary**

One page, in this order:

1. **The answer first**: one or two sentences answering the chief executive's main question.
2. **Three key findings**, each with its number.
3. **Three recommendations**, each linked to a finding, specific enough to act on.
4. **Caveats**: what the data can't tell you, and any estimate's assumptions.

## Example

An executive summary opening that works:

> **Growth is real but narrower than it looks.** Net sales rose 37.5% in January to June 2026, but 18 points of that is January's price rise and most of the rest is the new Lekki store. Like for like, our existing stores sold almost exactly the same volume as a year ago.

It gives the answer in the first line, puts a number on each claim, and doesn't hide the uncomfortable part. Compare it with "This report presents an analysis of Voltline's sales performance across eight stores", which tells the reader nothing.

## Walkthrough

1. Sketch the four pages on paper first: which visual goes where, and what each title will say.
2. Build page 1. Put the KPI cards along the top, the monthly trend (with a like-for-like line) in the middle, and a text box with your three messages.
3. Build pages 2 to 4. Give every visual a finding as its title, and remove anything that doesn't support a message.
4. Add a target view that's fair to Lekki: attainment by month, so the climb is visible, not a single six-month figure.
5. Write the executive summary (the task below).
6. Read the summary aloud. Cut every sentence that doesn't contain a fact or a recommendation.

## Practice

```answer
{
  "id": "cap-06-p1",
  "prompt": "What was Lekki's **Target Attainment %** for **June 2026**? One decimal place.",
  "answer": 110.1,
  "format": "percent",
  "dataset": "retail",
  "files": ["sales_raw", "targets"],
  "verify": "SELECT ROUND(100.0 * (SELECT SUM(qty * unit_price - discount) FROM (SELECT DISTINCT * FROM sales_raw WHERE product_code <> 'TEST') WHERE substr(txn_id, 1, 3) = 'LKI' AND txn_date LIKE '2026-06-%') / (SELECT net_sales_target FROM targets WHERE store_id = 2 AND month = '2026-06'), 1)",
  "hint": "Lekki's June 2026 net sales ÷ its June 2026 target.",
  "explanation": "110%: a store that 'missed target' every month of 2025 is now beating a target set for a mature store.",
  "required": true
}
```

```answer
{
  "id": "cap-06-p2",
  "prompt": "What was Lekki's **Target Attainment %** over its first six months, **July to December 2025**? One decimal place.",
  "answer": 55.0,
  "format": "percent",
  "dataset": "retail",
  "files": ["sales_raw", "targets"],
  "verify": "SELECT ROUND(100.0 * (SELECT SUM(qty * unit_price - discount) FROM (SELECT DISTINCT * FROM sales_raw WHERE product_code <> 'TEST') WHERE substr(txn_id, 1, 3) = 'LKI' AND txn_date LIKE '2025-%') / (SELECT SUM(net_sales_target) FROM targets WHERE store_id = 2 AND month BETWEEN '2025-07' AND '2025-12'), 1)",
  "hint": "Lekki's 2025 net sales ÷ the sum of its 2025 targets.",
  "explanation": "55%. Both numbers are true; together they tell the real story of a new store ramping up against an unrealistic target.",
  "required": true
}
```

```task
{
  "id": "cap-06-t1",
  "prompt": "Write the **executive summary** for Voltline's chief executive: the answer first, then **three findings** and **three recommendations**, then a **caveat**. Use the headings **Findings**, **Recommendations** and **Caveats** on their own lines, with bullets under each. Maximum 300 words.",
  "minutes": 20,
  "rows": 18,
  "placeholder": "Growth is real but narrower than it looks. ...\n\nFindings\n- ...\n\nRecommendations\n- ...\n\nCaveats\n- ...",
  "rules": [
    { "label": "Opens with the answer: the first line isn't a heading and mentions growth", "pattern": "(?<![\\s\\S])\\s*[^\\n]*grow" },
    { "label": "Has a Findings heading", "pattern": "^\\W*(key )?findings\\W*$" },
    { "label": "Has a Recommendations heading", "pattern": "^\\W*recommendations\\W*$" },
    { "label": "Has a Caveats heading", "pattern": "^\\W*caveats?\\W*$" },
    { "label": "At least six bullets", "pattern": "^\\s*[-*]\\s+\\S", "min": 6 },
    { "label": "Mentions like-for-like growth", "pattern": "like[- ]for[- ]like" },
    { "label": "At least six numbers as evidence", "pattern": "\\d+(\\.\\d+)?\\s*(%|m\\b|bn\\b|points?)", "min": 6 },
    { "label": "No more than 300 words", "maxWords": 300 }
  ],
  "sample": "Growth is real but narrower than it looks. Net sales rose 37.5% in January to June 2026, but 18 points of that is January's price rise and most of the rest is the new Lekki store. Like for like, existing stores sold the same volume as a year ago.\n\n**Findings**\n- Like-for-like growth was 18.3%, matching the 18% price rise: underlying volume is flat.\n- Solar & power now earns ₦124.3m of gross profit, twice as much as phones (₦64.2m), on similar sales.\n- Port Harcourt's transactions are down 27.3% since a competitor opened in February; every other existing store held steady.\n\n**Recommendations**\n- Prioritise solar: protect stock (Wuse lost about ₦6.5m of 5kVA inverter sales in a 53-day stock-out) and train staff in every store.\n- Lift accessory attach rates to 40% in Garki (26.9%), Ibadan (31.3%) and Port Harcourt (37.1%) with Ikeja's sales script (54.2%).\n- Raise the Zentro Z5's 9.5% return rate with the supplier, and pause promoting it until it's fixed.\n\n**Caveats**\n- Lekki's 2025 targets were set at a mature store's level, so its 55% attainment last year says more about the target than the store; it beat target by 10% in June 2026.\n- Lost-sales figures are estimates based on each store's normal sales rate before the stock-out.",
  "note": "Every bullet has a number, and every recommendation names who should do what. The caveat about Lekki isn't a footnote: it stops the board drawing exactly the wrong conclusion about the newest store.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which chart title is best?",
    "options": ["Net sales by store", "Store performance", "Port Harcourt is the only store to shrink, down 27% in transactions since February", "Chart 3"],
    "answer": 2,
    "explanation": "A title that states the finding tells the reader what to see."
  },
  {
    "prompt": "A new store reached 55% of its target in its first six months, then beat it. What should the report say?",
    "options": ["The store failed in 2025", "The target was set at a mature store's level from day one; judged on its trajectory, the store is succeeding", "Close the store", "Nothing about targets"],
    "answer": 1,
    "explanation": "Judge the measuring stick before you judge the store."
  },
  {
    "prompt": "What should come first in an executive summary?",
    "options": ["The methodology", "The answer to the main question", "A description of the data", "The caveats"],
    "answer": 1,
    "explanation": "Busy readers may read only the first lines. Put the answer there."
  }
]
```
