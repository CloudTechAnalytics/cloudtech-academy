---
title: Sampling and the normal distribution
minutes: 25
summary: Understand why samples give different answers, measure that uncertainty with the standard error, use the 68–95–99.7 rule, and see why averages of samples behave predictably even when the data is skewed.
---

## The problem

Kolanut's finance manager wants to know the average revenue per order line, but the full order system is being migrated and only a random sample of **50** order lines can be pulled this week. A colleague pulls a sample and gets ₦181,000. Another pulls a different 50 and gets ₦214,000.

Which one is right? Neither, exactly, and both are reasonable. Every sample gives a slightly different answer. That's **sampling variability**, and it's the reason inference exists. The useful questions are how far a sample's answer is likely to be from the truth, and how big a sample you need to be precise enough.

## The concept

**Samples vary; bigger samples vary less**

If you took many random samples and calculated each one's mean, the means would scatter around the true population mean. The **standard error (SE)** measures how much:

**SE of the mean = s ÷ √n**

where *s* is the standard deviation of the data and *n* the sample size. In Excel: `=STDEV.S(range) / SQRT(COUNT(range))`.

Two things follow:

- More spread in the data means a larger SE: noisy data needs bigger samples.
- The SE shrinks with the **square root** of the sample size. Four times the sample halves the SE; a hundred times the sample divides it by ten. Precision gets expensive.

**A random sample, properly**

A sample only tells you about the population if it's **random**: every row has the same chance of being picked. The first 50 rows (all from January), the 50 biggest customers, or whoever answered a survey are **biased** samples, and a bigger biased sample is just more confidently wrong.

To draw a random sample in Excel: add a column `=RAND()`, copy it and paste as values, sort by it, and take the first 50 rows. In Google Sheets, `=SORTN(range, 50, 0, RANDARRAY(ROWS(range)), TRUE)` does it in one step.

**The normal distribution and the 68–95–99.7 rule**

Many measurements follow a symmetric bell shape called the **normal distribution**. For normal data:

- about **68%** of values are within **1 SD** of the mean;
- about **95%** within **2 SDs** (more precisely, 1.96);
- about **99.7%** within **3 SDs**.

Excel calculates exact normal probabilities: `=NORM.DIST(x, mean, sd, TRUE)` is the share of values below *x*.

**Why it matters even for skewed data: the central limit theorem**

Order-line revenue is right-skewed, not normal. But the **means of samples** are close to normal, as long as the samples aren't tiny (30 or more is a common rule of thumb). That's the **central limit theorem**, and it's why the SE and the 68–95 rule work for averages almost regardless of the data's shape. It's the foundation for the confidence intervals and tests in the next two lessons.

## Example

All 4,266 Kolanut order lines are available here, so we can see sampling at work. The full population:

- mean revenue per line **₦194,689**, SD **₦140,241**.

For a sample of 50, the standard error is:

```excel
=140241 / SQRT(50)     ≈ 19,833
```

So a sample mean will usually be within about ₦20,000 of the truth, and about 95% of the time within 2 × ₦19,833 ≈ ₦40,000. The two colleagues' answers (₦181,000 and ₦214,000) are both comfortably within that range. Neither did anything wrong.

We can check the theory by brute force. Drawing 1,000 different random samples of 50 lines and calculating each one's mean, the means spread out with a standard deviation of **₦19,790**, almost exactly the ₦19,833 the formula predicts. And a histogram of those 1,000 means is a near-perfect bell shape, even though the revenue data itself is skewed.

To halve the uncertainty to about ₦10,000, the finance manager needs four times the sample: 200 lines.

## Walkthrough

1. Open Kolanut's `orders.csv` and add `revenue`. Calculate its mean and `STDEV.S` across all lines.
2. Add a column `=RAND()`, paste it as values, sort by it, and calculate the mean revenue of the first 50 rows. Note it.
3. Re-generate the random column (re-enter `=RAND()` and paste as values again), sort, and take another 50. How far apart are your two sample means?
4. Calculate the SE for samples of 50, 200 and 800 lines. How does the SE change each time the sample quadruples?
5. Check the 68% part of the rule on the full data: `=COUNTIFS(revenue, ">="&(mean - sd), revenue, "<="&(mean + sd)) / COUNT(revenue)`.
6. Write one sentence for the finance manager explaining what a 50-line sample can and can't tell her.

## Practice

```answer
{
  "id": "stat-07-p1",
  "prompt": "Order-line revenue has a standard deviation of about **₦140,241**. What is the **standard error** of the mean for a random sample of **100** lines? Round to the nearest naira.",
  "answer": 14024,
  "format": "naira",
  "pyVerify": "round(140241 / 100 ** 0.5)",
  "hint": "SE = SD ÷ √n = 140,241 ÷ 10",
  "required": true
}
```

```answer
{
  "id": "stat-07-p2",
  "prompt": "On the full `orders.csv`, what **percentage** of order lines have revenue within **one standard deviation** of the mean (inclusive)? One decimal place.",
  "answer": 67.1,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders"],
  "pyVerify": "(lambda r: round(((r - r.mean()).abs() <= r.std()).mean() * 100, 1))((lambda o: o['quantity'] * o['unit_price'] * (1 - o['discount_pct'] / 100))(data('sales', 'orders')))",
  "hint": "COUNTIFS between mean − SD and mean + SD, divided by the number of lines.",
  "explanation": "67.1%, close to the 68% the normal rule predicts, even though revenue is somewhat skewed.",
  "required": true
}
```

```answer
{
  "id": "stat-07-p3",
  "prompt": "A sample of 50 gives a standard error of about ₦20,000. How many lines would you need for a standard error of about **₦5,000**?",
  "answer": 800,
  "format": "number",
  "pyVerify": "50 * (20000 / 5000) ** 2",
  "hint": "The SE shrinks with the square root of n. A quarter of the SE needs 4² = 16 times the sample.",
  "explanation": "800 lines. Four times the precision costs sixteen times the data.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "stat-07-c1",
  "prompt": "Shipments on route 4 (Rotterdam → Lagos Apapa) take a mean of **21.0** days with an SD of **3.0** days. If transit times were normal, what **percentage** would take more than **27** days? Use `=1 - NORM.DIST(27, 21, 3, TRUE)`. One decimal place.",
  "answer": 2.3,
  "format": "percent",
  "pyVerify": "round((1 - stats.norm.cdf(27, 21, 3)) * 100, 1)",
  "explanation": "27 days is 2 SDs above the mean, so about 2.3% (half of the 5% outside ±2 SDs). Check it against the real route 4 data: delays are usually more common than a normal curve predicts, because real delays have a long right tail.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Two random samples of 50 give average order values of ₦181,000 and ₦214,000. What's the most likely explanation?",
    "options": ["One sample was done wrong", "Normal sampling variability", "The data changed between samples", "Averages can't be calculated from samples"],
    "answer": 1,
    "explanation": "Different samples give different answers. The standard error says how different to expect."
  },
  {
    "prompt": "You quadruple the sample size. What happens to the standard error?",
    "options": ["It quarters", "It halves", "It doubles", "It stays the same"],
    "answer": 1,
    "explanation": "SE = s ÷ √n, and √4 = 2."
  },
  {
    "prompt": "A survey of 5,000 customers who chose to reply to an email gives an average satisfaction of 8.9/10. What's the main concern?",
    "options": ["The sample is too small", "It isn't random: people who reply may differ from those who don't", "The SE is too large", "Averages can't be used for ratings"],
    "answer": 1,
    "explanation": "A large biased sample is still biased. Size can't fix who's missing."
  },
  {
    "prompt": "For normally distributed data, about what share of values lie within 2 standard deviations of the mean?",
    "options": ["68%", "95%", "99.7%", "50%"],
    "answer": 1,
    "explanation": "68–95–99.7: within 1, 2 and 3 SDs."
  }
]
```
