---
title: "Comparing groups: is the difference real?"
minutes: 25
summary: Test whether a difference between two groups is more than chance, with T.TEST for averages and a two-proportion test for rates, read p-values correctly, and keep statistical significance separate from practical importance.
---

## The problem

In January 2026, Kolanut raised its prices by about 9% across its range. Six months later the commercial director wants to know:

> "Did the price rise make customers buy less? Average quantity per order line dropped from 14.0 packs to 13.7. Should we roll the prices back?"

Meanwhile at Harbourline, air freight's on-time rate has fallen from 80.9% to 67.8%, and the operations director asks whether that's a real problem or a bad run of luck.

In both cases the numbers are different. The question is whether the difference is **bigger than you'd expect from chance alone**. That's what a **hypothesis test** answers, and it's the step between "the numbers moved" and "something changed".

## The concept

**The logic of a test**

1. Start from the **null hypothesis**: there is no real difference; any gap is just sampling variation.
2. Calculate how surprising your data would be **if the null were true**. That's the **p-value**: the probability of seeing a difference at least this big by chance alone.
3. If the p-value is small, chance is an unlikely explanation, so you conclude there's a real difference. The usual threshold is **0.05**: below it, the result is called **statistically significant**.

A p-value of 0.23 means: if there were no real effect, you'd see a gap this big about 23% of the time. That's common, so it's not evidence of an effect. A p-value of 0.01 means you'd see it only 1% of the time by chance, so something real is probably going on.

**Comparing two averages: the t-test**

```excel
=T.TEST(range1, range2, 2, 3)
```

- The **2** means two-tailed: you're testing for a difference in either direction. Use this unless you decided in advance that only one direction matters.
- The **3** means two samples with possibly different spreads (Welch's test). It's the safe default.

It returns the p-value directly.

**Comparing two rates: the two-proportion test**

For rates *p₁* (from *n₁*) and *p₂* (from *n₂*), with the pooled rate *p* = all "yes" ÷ all observations:

**z = (p₁ − p₂) ÷ √( p × (1 − p) × (1/n₁ + 1/n₂) )**

and the two-tailed p-value is `=2 * (1 - NORM.S.DIST(ABS(z), TRUE))`.

**What a test can't tell you**

- **"Not significant" doesn't mean "no difference".** It means you can't tell the difference from noise with this much data. A real but small effect needs a bigger sample.
- **Significant doesn't mean important.** With thousands of rows, a difference of 0.1 packs can be "significant" and still irrelevant. Always report the **size** of the difference, ideally with a confidence interval, not just the p-value.
- **A test doesn't fix a biased comparison.** If the groups differ in other ways (as discounted and full-price lines differ by channel in lesson 6), a significant result still doesn't prove cause.
- **Test many things and some will be significant by luck.** At 0.05, about 1 in 20 tests of differences that don't exist will come out "significant". Decide what you're testing before you look.

## Example

**Did the price rise reduce order size?** Compare the six months before (July–December 2025) with the six months after (January–June 2026):

| | Before (H2 2025) | After (H1 2026) |
| :-- | --: | --: |
| Order lines | 1,509 | 1,434 |
| Average quantity | 14.04 packs | 13.69 packs |

```excel
=T.TEST(before_quantities, after_quantities, 2, 3)     0.23
```

p = 0.23: a gap of this size would turn up by chance about a quarter of the time. **No evidence that the price rise reduced order size.** Comparing like with like makes the point stronger: January–June 2025 averaged 13.56 packs, slightly **below** January–June 2026 (p = 0.66). The answer for the director: *"There's no sign customers are buying less per order since the price rise. Average quantity is within normal variation (p = 0.23), and slightly above the same months last year. Rolling prices back would give away about 9% of revenue for no evidence of lost volume."*

**Is air freight's on-time fall real?** 127 of 157 on time in 2025 (80.9%) against 80 of 118 in 2026 (67.8%). The pooled rate is 207 ÷ 275 = 75.3%, so:

z = (0.809 − 0.678) ÷ √(0.753 × 0.247 × (1/157 + 1/118)) ≈ **2.49**, and p ≈ **0.013**.

That's well below 0.05: the fall is very unlikely to be chance. *"Air on-time delivery has genuinely fallen, by 13 points, and it's worth finding out why: which routes, and since when."*

## Walkthrough

1. In Kolanut's `orders.csv`, filter `order_date` to July–December 2025 and copy the `quantity` values to a new sheet, column A. Do the same for January–June 2026 into column B.
2. Calculate each column's mean, then `=T.TEST(A:A, B:B, 2, 3)`.
3. Repeat with January–June 2025 against January–June 2026.
4. In the logistics data, count on-time and total delivered air shipments by booking year (a pivot table from lesson 5).
5. Calculate the two-proportion z and its p-value with `NORM.S.DIST`.
6. Write one sentence for each director: the size of the difference, the p-value, and what to do.

## Practice

```dataset
{"dataset": "sales", "files": ["orders"]}
```

```answer
{
  "id": "stat-09-p1",
  "prompt": "Using `=T.TEST(…, 2, 3)`, what is the **p-value** comparing order-line quantity in **July–December 2025** with **January–June 2026**? Two decimal places.",
  "answer": 0.23,
  "format": "number",
  "tolerance": 0.011,
  "dataset": "sales",
  "files": ["orders"],
  "pyVerify": "(lambda o: round(stats.ttest_ind(o[(o['order_date'] >= '2025-07-01') & (o['order_date'] < '2026-01-01')]['quantity'], o[o['order_date'] >= '2026-01-01']['quantity'], equal_var=False).pvalue, 2))(data('sales', 'orders'))",
  "required": true
}
```

```answer
{
  "id": "stat-09-p2",
  "prompt": "For the air on-time rates (127 of 157 against 80 of 118), what is the **z** value of the two-proportion test? Two decimal places.",
  "answer": 2.49,
  "format": "number",
  "tolerance": 0.011,
  "pyVerify": "(lambda p1, p2, p: round((p1 - p2) / (p * (1 - p) * (1 / 157 + 1 / 118)) ** 0.5, 2))(127 / 157, 80 / 118, 207 / 275)",
  "hint": "Pooled p = 207 / 275. Then z = (p₁ − p₂) ÷ √(p(1 − p)(1/157 + 1/118)).",
  "required": true
}
```

```answer
{
  "id": "stat-09-p3",
  "prompt": "A test gives p = **0.23**. At the usual 0.05 threshold, is the difference **statistically significant**: yes or no?",
  "answer": "no",
  "format": "text",
  "explanation": "0.23 is above 0.05. That doesn't prove there's no effect; it means this data can't tell it apart from chance.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "stat-09-c1",
  "prompt": "Back to lesson 6's discount question, done properly. Among **Wholesale** order lines only, compare the quantity of discounted and undiscounted lines with `T.TEST(…, 2, 3)`. What is the p-value? Two decimal places.",
  "answer": 0.08,
  "format": "number",
  "tolerance": 0.011,
  "dataset": "sales",
  "files": ["orders", "customers"],
  "pyVerify": "(lambda w: round(stats.ttest_ind(w[w['discount_pct'] > 0]['quantity'], w[w['discount_pct'] == 0]['quantity'], equal_var=False).pvalue, 2))(data('sales', 'orders').merge(data('sales', 'customers'), on='customer_id').query('channel == \"Wholesale\"'))",
  "explanation": "About 0.08: not significant at 0.05, and the difference is only half a pack. Within one channel, there's no convincing evidence that discounts go with bigger orders.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does p = 0.03 mean?",
    "options": ["There's a 3% chance the effect is real", "If there were no real difference, a gap this big would appear only about 3% of the time", "The effect is 3% in size", "97% of customers changed behaviour"],
    "answer": 1,
    "explanation": "A p-value is about how surprising the data would be if the null hypothesis were true."
  },
  {
    "prompt": "A campaign test gives p = 0.40. What's the right conclusion?",
    "options": ["The campaign definitely doesn't work", "This data doesn't show a difference; there could be a small effect a bigger test would find", "The campaign works", "The test is broken"],
    "answer": 1,
    "explanation": "Not significant isn't proof of no effect."
  },
  {
    "prompt": "With 2 million rows, average basket size differs by ₦3 between two groups, p < 0.001. What should you report?",
    "options": ["A major finding", "That it's statistically significant but too small to matter in practice", "That the test is wrong", "Nothing at all"],
    "answer": 1,
    "explanation": "Huge samples make tiny differences significant. Report the size and judge whether it matters."
  },
  {
    "prompt": "You test 40 different product categories for a sales change and 2 come out significant at 0.05. What's the concern?",
    "options": ["None", "With 40 tests, about 2 would be significant by luck alone even if nothing changed", "40 is too few tests", "p-values can't be used for categories"],
    "answer": 1,
    "explanation": "Many tests produce false positives. Decide your questions in advance, or demand stronger evidence."
  }
]
```
