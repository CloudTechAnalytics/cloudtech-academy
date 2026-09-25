---
title: From question to insight
minutes: 30
summary: A repeatable method for turning a vague business worry into a clear finding and a recommendation.
---

## The problem

The sales director at Kolanut says: *"Something's wrong in the North. Can you look into it?"*

That isn't a question you can answer with data yet. This lesson is about the method analysts use to get from a worry like this to a finding someone can act on.

## The concept

**The question-to-insight method**

1. **Clarify the business question.** Who is asking, what decision are they facing, by when?
2. **Make it measurable.** Name the measure, the comparison and the period.
3. **List the data needed**, and check it exists.
4. **Analyse**: start broad, then break down. Compare with a baseline.
5. **Explain** the pattern: test possible reasons against the data.
6. **Recommend** something specific, and say how you'd know if it worked.

**Finding vs insight.** A *finding* says what the data shows ("North West revenue fell 47%"). An *insight* adds why it matters and what to do ("North West shops are ordering half as often; if we win back the old order frequency, we recover about ₦14m per half-year").

**Test more than one explanation.** For a fall in revenue, the usual suspects are:

| Possible cause | What you'd see in the data |
| :-- | :-- |
| Fewer customers | Fewer distinct customers ordering |
| Customers ordering less often | Same customers, fewer order lines each |
| Smaller orders | Fewer packs per order line |
| Lower prices or bigger discounts | Lower price per pack or higher discount % |

## Example

**1. Clarify.** The director is deciding whether to replace the North West sales approach before the next half-year budget.

**2. Measurable question.** *How did North West revenue in January–June 2026 compare with January–June 2025, and what drove the change?*

**3. Data.** `orders.csv` (dates, quantities, prices) joined to `customers.csv` (region).

**4. Analyse.**

| North West | H1 2025 | H1 2026 | Change |
| :-- | --: | --: | --: |
| Revenue (₦m) | 31.1 | 16.6 | −46.6% |
| Customers who ordered | 10 | 11 | +1 |
| Order lines | 176 | 91 | −48% |

**5. Explain.** Customers didn't leave: 11 ordered in 2026, one more than in 2025. Prices *rose* in January 2026, so price cuts aren't the cause either. The fall is almost entirely **order frequency**: the same shops ordered about half as often.

**6. Recommend.** Find out why North West shops are ordering less often. Ask the regional rep and call the five largest accounts this month: are they buying from a competitor, or is delivery unreliable? Set a target of 150 order lines next half-year and track it monthly.

## Walkthrough

Notice what the analysis did *not* do:

- It didn't stop at "revenue fell 47%". That's a finding, not an explanation.
- It didn't guess. Each explanation was checked against a number.
- It didn't claim more than the data shows. The data says *what* changed (frequency); only a conversation with customers can say *why*. A good recommendation names the next question as well as the next action.

> [!BUSINESS]
> The most valuable sentence an analyst can say is often "the data rules out X". Here, ruling out lost customers and price cuts saved the director from two wrong fixes: a customer-acquisition campaign and a discount.

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
    "prompt": "Revenue fell but the number of customers ordering stayed the same. Which explanation does that rule out?",
    "options": ["Customers ordering less often", "Lost customers", "Smaller orders", "Lower prices"],
    "answer": 1,
    "explanation": "If the same number of customers are still ordering, losing customers isn't the cause."
  },
  {
    "prompt": "What turns a finding into an insight?",
    "options": ["A bigger chart", "Adding why it matters and what to do about it", "More decimal places", "Using a different tool"],
    "answer": 1,
    "explanation": "An insight connects the data to a decision."
  }
]
```
