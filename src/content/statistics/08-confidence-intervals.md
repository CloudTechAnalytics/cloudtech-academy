---
title: Confidence intervals
minutes: 25
summary: Turn a sample's answer into an honest range with a 95% confidence interval for a mean (CONFIDENCE.T) or a percentage, interpret it correctly, and use it to say when a difference might just be noise.
---

## The problem

Ashgrove Chambers is negotiating an overdraft with its bank, sized to cover the gap between issuing invoices and getting paid. The finance partner asks:

> "How long do clients take to pay? The bank wants a number we can stand behind."

The average across the 327 paid invoices so far is 45.4 days. But those invoices are a sample of the firm's billing, and next year's clients won't behave identically. "45.4 days" sounds more precise than it is. A **confidence interval** says how precise it really is: "between about 43 and 48 days, with 95% confidence". That's a number the firm can stand behind, and it tells the bank how much buffer to allow.

## The concept

### What a confidence interval is

A **95% confidence interval** is a range built from a sample so that, if you repeated the sampling many times, 95% of the ranges built this way would contain the true value. In practice: it's the range of values the true number plausibly lies in, given the sample.

It's built from the standard error (lesson 7):

**estimate ± margin of error**, where for a mean the **margin ≈ 1.96 × SE**

The 1.96 comes from the normal distribution: 95% of values lie within 1.96 SDs of the mean.

![Twenty horizontal lines, each a 95% confidence interval from a random sample of 50 Kolanut order lines, drawn against a vertical line at the true mean of all 4,266 lines, ₦194,689. The sample means scatter between about ₦164,000 and ₦231,000; every interval crosses the true mean.](/images/courses/statistics/confidence-intervals.svg "Twenty real samples, twenty intervals. Each sample's average is off, but its interval usually contains the truth.")

The picture shows what "95% confidence" means. Each sample of 50 lines gives a different average, some well away from the true ₦194,689. But each interval reaches far enough that, in this run, all 20 contain the true mean. Over many more samples, about 1 in 20 would miss. You never know whether **your** interval is one of the misses, which is why 95% is a level of confidence, not a guarantee.

### For a mean, in Excel

```excel
=CONFIDENCE.T(0.05, STDEV.S(range), COUNT(range))
```

returns the **margin of error** for a 95% interval (0.05 = 5% left over). The interval is `AVERAGE(range) ± margin`. `CONFIDENCE.T` uses the t-distribution, which makes the interval slightly wider for small samples. With more than about 30 values it's almost the same as 1.96 × SE.

### For a percentage (a proportion)

For a share *p* (as a decimal) from *n* observations:

**margin = 1.96 × √( p × (1 − p) ÷ n )**

In Excel: `=1.96 * SQRT(p * (1 - p) / n)`. This works well when there are at least 10 "yes" and 10 "no" answers; for rarer events, use a bigger sample.

### Reading intervals correctly

- **Wider interval = less certain.** Smaller samples and noisier data give wider intervals.
- **Overlapping intervals** for two groups mean the difference **might** be chance; the formal check is a test (next lesson). Intervals that don't overlap at all mean the difference is very unlikely to be chance.
- An interval only covers **sampling** error. It says nothing about a biased sample, bad data, or a change in the future.
- Don't say "there's a 95% chance the true value is in this interval". Say "we're 95% confident the true value is between X and Y". (The true value is fixed; it's the interval that varies.)

### Choosing the confidence level

95% is the convention. 90% gives a narrower interval with less confidence; 99% a wider one with more. Use `CONFIDENCE.T(0.10, …)` for 90% or `CONFIDENCE.T(0.01, …)` for 99%. Pick one before you look at the results, and say which you used.

## Example

Ashgrove's days to pay, for the 327 paid invoices:

```excel
=AVERAGE(days)                              45.4
=STDEV.S(days)                              25.6
=CONFIDENCE.T(0.05, STDEV.S(days), COUNT(days))   2.8
```

The 95% confidence interval is **45.4 ± 2.8: about 42.6 to 48.2 days.**

For the bank: *"Clients pay in 45 days on average; we're 95% confident the true average is between 43 and 48 days. Individual invoices vary much more (some take 90 days), so the overdraft should cover the slow payers, not just the average."* The last sentence matters: the interval is about the **average**, not about any one invoice.

A percentage, from the HR data: 103 of 1,518 June attendance records were **Late**, 6.8%.

```excel
=1.96 * SQRT(0.0679 * (1 - 0.0679) / 1518)     0.0127, or 1.3 percentage points
```

So the lateness rate is **6.8% ± 1.3 pp: between about 5.5% and 8.1%**. One month of data pins it down fairly well.

## Walkthrough

1. Open the legal `invoices.csv` and add `days_to_pay` (blank for unpaid invoices), as in lesson 2.
2. Calculate the mean, `STDEV.S`, `COUNT` and the margin with `CONFIDENCE.T(0.05, …)`. Write the 95% interval.
3. Recalculate with 0.10 and 0.01 to get the 90% and 99% intervals. Which is widest?
4. Open the HR `attendance.csv`. Calculate the share of records that are Late and its 95% margin with the proportion formula.
5. In the logistics data, calculate the on-time rate for delivered **Air** shipments and its 95% interval.
6. Write the sentence you'd give the bank, including what the interval does **not** cover.

## Practice

```dataset
{"dataset": "legal", "files": ["invoices"]}
```

```answer
{
  "id": "stat-08-p1",
  "prompt": "What is the **95% margin of error** (`CONFIDENCE.T(0.05, …)`) for the mean days to pay, across the paid invoices? Two decimal places.",
  "answer": 2.78,
  "format": "number",
  "tolerance": 0.011,
  "dataset": "legal",
  "files": ["invoices"],
  "pyVerify": "(lambda d: round(stats.t.ppf(0.975, len(d) - 1) * d.std() / len(d) ** 0.5, 2))((lambda i: (pd.to_datetime(i['paid_date']) - pd.to_datetime(i['issued_date'])).dt.days.dropna())(data('legal', 'invoices')))",
  "required": true
}
```

```answer
{
  "id": "stat-08-p2",
  "prompt": "What is the **lower end** of the 95% confidence interval for mean days to pay? One decimal place.",
  "answer": 42.6,
  "format": "number",
  "dataset": "legal",
  "files": ["invoices"],
  "pyVerify": "(lambda d: round(d.mean() - stats.t.ppf(0.975, len(d) - 1) * d.std() / len(d) ** 0.5, 1))((lambda i: (pd.to_datetime(i['paid_date']) - pd.to_datetime(i['issued_date'])).dt.days.dropna())(data('legal', 'invoices')))",
  "hint": "The mean minus the margin from the last task.",
  "required": true
}
```

```answer
{
  "id": "stat-08-p3",
  "prompt": "Air freight on-time delivery is **75.3%** across **275** delivered shipments. What is the 95% **margin of error**, in percentage points? One decimal place.",
  "answer": 5.1,
  "format": "number",
  "pyVerify": "round(1.96 * (0.753 * (1 - 0.753) / 275) ** 0.5 * 100, 1)",
  "hint": "=1.96 * SQRT(0.753 * (1 - 0.753) / 275), then × 100 for percentage points.",
  "explanation": "± 5.1 points: the true air on-time rate is plausibly anywhere from about 70% to 80%. Worth remembering before anyone reads too much into a 2-point change.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "stat-08-c1",
  "prompt": "A customer survey finds that **60%** of **50** customers are satisfied. How many customers would you need for a 95% margin of error of about **±5 percentage points** (assuming the share stays near 60%)? Round up to a whole customer.",
  "answer": 369,
  "format": "number",
  "pyVerify": "__import__('math').ceil((1.96 / 0.05) ** 2 * 0.6 * 0.4)",
  "hint": "Rearrange margin = 1.96 × √(p(1 − p)/n) to n = (1.96 / margin)² × p(1 − p).",
  "explanation": "About 369 customers. With 50, the margin is ±13.6 points: '60% satisfied' could easily be 50% or 70%.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A 95% confidence interval for average delivery time is 25 to 29 days. Which statement is right?",
    "options": ["95% of shipments take 25 to 29 days", "We're 95% confident the true average delivery time is between 25 and 29 days", "There's a 95% chance any shipment takes 27 days", "5% of shipments are late"],
    "answer": 1,
    "explanation": "The interval is about the average, not individual shipments."
  },
  {
    "prompt": "What happens to the interval if you collect four times as much data?",
    "options": ["It gets about half as wide", "It gets a quarter as wide", "It gets wider", "No change"],
    "answer": 0,
    "explanation": "The margin is based on the standard error, which halves when n quadruples."
  },
  {
    "prompt": "Store A's satisfaction is 72% ± 6 pp; store B's is 68% ± 7 pp. What can you say?",
    "options": ["A is definitely better", "The intervals overlap a lot, so the difference may well be chance", "B is better", "They're identical"],
    "answer": 1,
    "explanation": "Big overlap: don't claim a difference without more data or a test."
  },
  {
    "prompt": "A survey of 2,000 people who opted in online gives a very narrow interval. What doesn't the interval account for?",
    "options": ["Sampling variability", "Bias from who chose to answer", "The sample size", "The confidence level"],
    "answer": 1,
    "explanation": "Intervals measure random sampling error only, not bias."
  }
]
```
