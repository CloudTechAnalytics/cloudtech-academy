---
title: From question to insight
minutes: 10
summary: A repeatable method from a vague worry to a recommendation: clarify, make it measurable, break the total down, test and rule out explanations, and tell the story answer-first.
---

## The problem

The sales director at Kolanut says: *"Something's wrong in the North. Can you look into it?"*

That isn't a question you can answer with data yet. This lesson is about the method analysts use to get from a worry like this to a finding someone can act on.

## The concept

Most requests to an analyst start vague: "North West looks bad, can you have a look?" This lesson is a repeatable method for turning that into a clear finding and a recommendation someone can act on.

### The question-to-insight method

1. **Clarify the business question.** Who is asking, what decision are they facing, by when?
2. **Make it measurable.** Name the measure, the comparison and the period.
3. **List the data needed**, and check it exists.
4. **Analyse**: start broad, then break down. Compare with a baseline.
5. **Explain** the pattern: test possible reasons against the data.
6. **Recommend** something specific, and say how you'd know if it worked.

### Step 1: clarify

Before touching data, ask the person three questions:

| Ask | Why |
| :-- | :-- |
| **What decision** will this help you make? | It tells you what "useful" means. "Should we replace the North West approach?" needs a different analysis from "how much stock should we send?" |
| **By when?** | A rough answer on Friday may beat a perfect one next month |
| **What do you already believe?** | You'll know which explanation to test first, and which belief your answer has to address |

### Step 2: make it measurable

A measurable question names four things:

| Part | Vague | Measurable |
| :-- | :-- | :-- |
| **Measure** | "how it's doing" | revenue after discounts |
| **Scope** | "the North" | customers in the North West region |
| **Period** | "lately" | January to June 2026 |
| **Comparison** | (none) | against January to June 2025 |

Put together: *How did North West revenue in January to June 2026 compare with the same months of 2025, and what drove the change?*

### Steps 4 and 5: break it down and test explanations

A total can be broken into parts that multiply together, like the KPI tree in lesson 2. For a fall in revenue, the usual suspects are:

| Possible cause | What you'd see in the data |
| :-- | :-- |
| Fewer customers | Fewer distinct customers ordering |
| Customers ordering less often | Same customers, fewer order lines each |
| Smaller orders | Fewer packs per order line |
| Lower prices or bigger discounts | Lower naira per pack or higher discount % |

Each one is a **hypothesis**: a possible explanation you can check with a number. Work through them all, not just the first one that seems to fit. The ones you **rule out** are as useful as the one you confirm.

> [!TIP]
> **Ask "why?" more than once.** "Revenue fell" → why? "Fewer order lines" → why? "Shops ordered less often" → why? At some point the data runs out and the next "why" needs a conversation with customers or staff. That's the point to stop analysing and start recommending.

### Finding versus insight

A *finding* says what the data shows ("North West revenue fell 47%"). An *insight* adds why it matters and what to do ("North West shops are ordering half as often; if we win back the old order frequency, we recover about ₦14m per half-year").

| | Says | Example |
| :-- | :-- | :-- |
| **Data** | A fact | North West: 91 order lines in H1 2026 |
| **Finding** | What changed | North West revenue fell 46.6% |
| **Insight** | Why, and so what | The same shops are ordering half as often; that's worth about ₦14m a half-year |
| **Recommendation** | What to do, and how to check | Call the five largest accounts this month; target 150 order lines next half-year |

### Correlation is not cause

Two things moving together doesn't mean one causes the other. North West's fall came in the same half-year as the price rise, but prices rose in **every** region, and most regions grew. So the price rise alone can't explain North West. Always ask: did the same thing happen somewhere that didn't fall? If so, it probably isn't the cause.

### Telling the story

Decision-makers are busy. Put the **answer first**, then the reasons, then the detail:

1. **Answer**: "North West revenue nearly halved because shops ordered half as often. We haven't lost customers."
2. **Evidence**: the table, one chart.
3. **What to do**: the recommendation, with a target and a date.
4. **Limits**: what the data can't tell you yet.

This is sometimes called the **pyramid principle**: lead with the conclusion, support it underneath. A report that saves its answer for the last page loses its readers on page one.

## Example

**1. Clarify.** The director is deciding whether to replace the North West sales approach before the next half-year budget.

**2. Measurable question.** *How did North West revenue in January–June 2026 compare with January–June 2025, and what drove the change?*

**3. Data.** `orders.csv` (dates, quantities, prices) joined to `customers.csv` (region).

**4. Analyse.**

| North West, January–June | 2025 | 2026 | Change |
| :-- | --: | --: | --: |
| Revenue (₦m) | 31.1 | 16.6 | −46.6% |
| Customers who ordered | 10 | 11 | +1 |
| Order lines | 176 | 91 | −48% |
| Order lines per customer | 17.6 | 8.3 | −53% |
| Packs per order line | 13.9 | 12.7 | −9% |
| Naira per pack | 12,724 | 14,450 | +14% |

**5. Explain.** Test each suspect:

- **Fewer customers?** No: 11 ordered in 2026, one more than in 2025. Ruled out.
- **Lower prices?** No: naira per pack *rose* 14%, after January's price rise. Ruled out.
- **Smaller orders?** A little: packs per line fell 9%. A minor cause.
- **Ordering less often?** Yes: order lines per customer more than halved, from 17.6 to 8.3. **The main cause.**

The fall is mostly **order frequency**: the same shops ordered about half as often, with slightly smaller orders on top.

**6. Recommend.** Find out why North West shops are ordering less often. Ask the regional rep and call the five largest accounts this month: are they buying from a competitor, or is delivery unreliable? Set a target of 150 order lines next half-year and track it monthly.

## Walkthrough

Notice what the analysis did *not* do:

- It didn't stop at "revenue fell 47%". That's a finding, not an explanation.
- It didn't guess. Each explanation was checked against a number, and two were ruled out.
- It didn't claim more than the data shows. The data says *what* changed (frequency); only a conversation with customers can say *why*. A good recommendation names the next question as well as the next action.

Now practise the method on your own question. Pick one of these and write steps 1 and 2 on paper:

- "Are our supermarkets doing well?"
- "Are discounts worth it?"
- "Is Lagos too important to us?"

For each, write: the decision it supports, the measure, the scope, the period and the comparison. Then list two or three hypotheses and the number that would test each.

> [!BUSINESS]
> The most valuable sentence an analyst can say is often "the data rules out X". Here, ruling out lost customers and price cuts saved the director from two wrong fixes: a customer-acquisition campaign and a discount.

### Summary

| Step | Key question |
| :-- | :-- |
| Clarify | What decision, by when, and what do you already believe? |
| Measurable | Which measure, scope, period and comparison? |
| Data | Does it exist, and is it clean? |
| Analyse | What changed, and which part of the total moved? |
| Explain | Which hypotheses does the data confirm or rule out? |
| Recommend | What should happen, by when, and how will we know it worked? |

## Practice

```answer
{
  "id": "daf-09-p1",
  "prompt": "Check the analysis yourself. How many **order lines** did North West customers place in January–June **2026**? (Look up each order's customer region, then count 2026 order lines for North West.)",
  "answer": 91,
  "format": "number",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT COUNT(*) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.region = 'North West' AND o.order_date >= '2026-01-01'",
  "hint": "Add a region column to orders by looking up each customer_id in customers.csv (in Sheets or Excel: XLOOKUP or VLOOKUP). Then filter region = North West and dates from 2026-01-01, and count.",
  "explanation": "91 order lines in H1 2026, down from 176 in H1 2025.",
  "required": true
}
```

```answer
{
  "id": "daf-09-p2",
  "prompt": "Which region's revenue grew by the **most naira** from H1 2025 to H1 2026? Use the table in lesson 6 (Data analysis).",
  "answer": "Lagos",
  "format": "text",
  "hint": "Subtract H1 2025 from H1 2026 for each region and compare the differences.",
  "explanation": "Lagos grew by ₦34.6m (118.2 → 152.8). South West grew faster in percentage terms (+79%) but by less money (+₦22.8m).",
  "required": true
}
```


## More practice

Optional drills. They don't count towards the certificate, but they're the fastest way to make this lesson stick. Several use a different dataset from the lesson on purpose: if you can do the same thing on unfamiliar data, you've really learned it.

```answer
{
  "id": "daf-09-d1",
  "prompt": "How many **different customers** placed at least one order in **January–June 2026**?",
  "answer": 90,
  "format": "number",
  "dataset": "sales",
  "files": [
    "orders"
  ],
  "verify": "SELECT COUNT(DISTINCT customer_id) FROM orders WHERE order_date BETWEEN '2026-01-01' AND '2026-06-30'",
  "hint": "Filter to H1 2026, then =COUNTA(UNIQUE(filtered customer_id column)), or a pivot's distinct count.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which is a measurable version of \"Is the North doing badly?\"",
    "options": ["Is the North bad?", "How did North West revenue in Jan–Jun 2026 compare with Jan–Jun 2025?", "Tell me about the North", "What is the North's data?"],
    "answer": 1,
    "explanation": "It names the measure (revenue), the segment, the periods and the comparison."
  },
  {
    "prompt": "Revenue fell, but just as many customers are still ordering. Which is the most likely reason?",
    "options": ["The business lost customers", "Customers are ordering less often, or buying less each time", "The office moved", "The data has too many columns"],
    "answer": 1,
    "explanation": "The customers are still there, so the fall must come from how often or how much they buy."
  },
  {
    "prompt": "What turns a finding into an insight?",
    "options": ["A bigger chart", "Adding why it matters and what to do about it", "More decimal places", "Using a different tool"],
    "answer": 1,
    "explanation": "An insight connects the data to a decision."
  }
]
```
