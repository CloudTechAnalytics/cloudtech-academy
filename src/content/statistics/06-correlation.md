---
title: Correlation
minutes: 25
summary: Measure how strongly two numbers move together with a scatter chart and CORREL, interpret r and r², and avoid the classic traps, above all treating correlation as cause.
---

## The problem

Kolanut's sales director has noticed that order lines with a discount are much bigger than those without: about 17 packs against 11. Her proposal:

> "Discounts make customers buy more. Let's give a 10% discount on everything."

It sounds like the data supports her. But is the discount causing the bigger orders, or are bigger orders getting the discount? The answer decides whether the new policy grows sales or just gives away margin on orders that would have happened anyway.

This lesson measures how strongly two things move together, and then, more importantly, how to think about what that relationship does and doesn't mean.

## The concept

### Look first: the scatter chart

Put one variable on each axis and plot a dot for each row: **Insert → Scatter** in Excel or Google Sheets. In a few seconds you see whether the dots rise together, fall, or show no pattern; whether the relationship is a straight line or a curve; and whether a few outliers are doing all the work.

### Measure: the correlation coefficient, r

`=CORREL(range1, range2)` gives **Pearson's r**, a number from −1 to +1:

| r | Meaning |
| :-- | :-- |
| +1 | Perfect positive straight line: as one rises, the other rises exactly |
| about +0.7 to +1 | Strong positive |
| about +0.3 to +0.7 | Moderate positive |
| about −0.3 to +0.3 | Weak or none |
| negative values | The same, but one falls as the other rises |
| −1 | Perfect negative straight line |

These bands are rough guides, not rules. And r only measures **straight-line** relationships: a strong curve (sales rising then falling with price) can give an r near 0.

![Three scatter charts from the course data. Containers against freight charge: dots climb in tight columns, r = 0.93. Quantity against discount percent: three horizontal bands with a slight upward tilt, r = 0.34. Years of service against salary: a shapeless cloud, r = −0.05.](/images/courses/statistics/correlation-panels.svg "What r looks like: very strong, moderate and none, all from real data.")

Notice the middle chart. Discounts are only ever 0, 5 or 10%, so the dots form three bands (spread slightly so they don't sit on top of each other). An r of 0.34 here means "lines with more packs are somewhat more likely to be in the higher bands", not a neat sloping line. Always look at the chart before trusting the number.

### r²: how much is explained

Square r to get **r²** (`=RSQ(range1, range2)`): the share of the variation in one variable that's explained by a straight-line relationship with the other. r = 0.93 gives r² ≈ 0.87: containers explain about 87% of the variation in freight charges.

### The traps

1. **Correlation is not causation.** Two things can move together because:
   - A causes B (more containers cause a higher charge);
   - B causes A (a supermarket opens more tills because it is busy, not the other way round);
   - something else causes both (hot weather raises both ice-cream sales and drowning numbers);
   - pure coincidence, especially when you test many pairs.
2. **Outliers** can create or hide a correlation. Check the scatter chart.
3. **Mixing groups.** Two groups with different levels can create a correlation that doesn't exist within either group (the same lesson as Simpson's paradox).
4. **No correlation isn't "no relationship".** It means no straight-line relationship.

### Getting closer to cause

Data like Kolanut's is **observational**: nobody decided at random who gets a discount. The strongest way to establish cause is an **experiment**: give the discount to a random half of customers for a month and compare (lesson 9 shows how to test the difference). Without one, ask how the data was produced: who decided the discount, and why?

## Example

Three correlations from the practice data, with what each one means:

| Pair | r | Reading |
| :-- | --: | :-- |
| Harbourline: containers vs freight charge | 0.93 | Very strong. And here it **is** causal: Harbourline prices by container. |
| Kolanut: quantity vs discount % | 0.34 | Moderate. Bigger lines tend to have bigger discounts. But see below. |
| Kolanut HR: years of service vs monthly salary | −0.05 | None. Pay isn't related to how long people have been there. |

Back to the director. The 0.34 is real, but look at **who** gets discounts. Kolanut's discounts depend mostly on the customer's **channel**: 62% of wholesale lines are discounted, 27% of supermarket lines and 5% of kiosk lines. And wholesalers also order far more per line (19 packs, against 11 for supermarkets and under 4 for kiosks). Channel drives **both** the discount and the quantity: it's a third factor, called a **confounder**.

Check it by looking **within** one channel, so channel can't be the explanation. Among wholesale lines, discounted lines average 19.2 packs and undiscounted ones 18.7: almost no difference, and the correlation is about 0.02. The same holds inside the other two channels. Once you compare like with like, the "discount effect" disappears.

So a discount on everything would cost margin on every order, with no evidence it would grow volume. The honest recommendation: *"Discounted lines are larger overall (r = 0.34), but only because wholesalers get most of the discounts and also place the biggest orders. Within each channel, discounted and full-price lines are the same size. To test whether a discount changes behaviour, offer it to a random half of comparable customers for a month and compare."*

And the HR result deserves a sentence too: pay that doesn't rise with service is something HR would want to know about, especially alongside lesson 1's finding about who leaves.

## Walkthrough

1. Open the logistics `shipments.csv`. Insert a scatter chart of `containers` (x) against `freight_charge` (y). Describe what you see.
2. Calculate `=CORREL(containers, freight_charge)` and `=RSQ(…)`.
3. Open Kolanut's `orders.csv`. Calculate `CORREL(quantity, discount_pct)`. Compare the average quantity of discounted and undiscounted lines with `AVERAGEIFS`.
4. Open the HR `employees.csv`. Add `years` = (`exit_date` if there is one, otherwise 30 June 2026, minus `hire_date`) ÷ 365.25. Scatter `years` against `monthly_salary`, and calculate `CORREL`.
5. Add each order line's `channel` from `customers.csv` with XLOOKUP. Filter to **Wholesale** and calculate `CORREL(quantity, discount_pct)` again. What happened to the relationship?
6. Write the director a two-sentence reply about the discount proposal.

## Practice

```answer
{
  "id": "stat-06-p1",
  "prompt": "What is the correlation (`CORREL`) between `containers` and `freight_charge` across all shipments in `shipments.csv`? Two decimal places.",
  "answer": 0.93,
  "format": "number",
  "tolerance": 0.011,
  "dataset": "logistics",
  "files": ["shipments"],
  "pyVerify": "round(data('logistics', 'shipments')[['containers', 'freight_charge']].corr().iloc[0, 1], 2)",
  "required": true
}
```

```answer
{
  "id": "stat-06-p2",
  "prompt": "What is the correlation between `quantity` and `discount_pct` in Kolanut's `orders.csv`? Two decimal places.",
  "answer": 0.34,
  "format": "number",
  "tolerance": 0.011,
  "dataset": "sales",
  "files": ["orders"],
  "pyVerify": "round(data('sales', 'orders')[['quantity', 'discount_pct']].corr().iloc[0, 1], 2)",
  "required": true
}
```

```answer
{
  "id": "stat-06-p3",
  "prompt": "What is the **average quantity** on order lines **with** a discount (discount_pct > 0)? One decimal place.",
  "answer": 17.2,
  "format": "number",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT ROUND(AVG(quantity), 1) FROM orders WHERE discount_pct > 0",
  "pyVerify": "round(data('sales', 'orders').query('discount_pct > 0')['quantity'].mean(), 1)",
  "hint": "=AVERAGEIFS(quantity, discount_pct, \">0\")",
  "explanation": "17.2 packs, against 11.4 without a discount. The next task shows why that comparison misleads.",
  "required": true
}
```

```answer
{
  "id": "stat-06-p4",
  "prompt": "Now look **within one channel**. Among **Wholesale** customers' order lines only, what is the correlation between `quantity` and `discount_pct`? Two decimal places.",
  "answer": 0.02,
  "format": "number",
  "tolerance": 0.011,
  "dataset": "sales",
  "files": ["orders", "customers"],
  "pyVerify": "round(data('sales', 'orders').merge(data('sales', 'customers'), on='customer_id').query('channel == \"Wholesale\"')[['quantity', 'discount_pct']].corr().iloc[0, 1], 2)",
  "hint": "XLOOKUP each line's channel from customers.csv, filter to Wholesale, then CORREL on the visible rows (or use the filtered columns).",
  "explanation": "About 0.02: no relationship at all. The overall 0.34 came from mixing channels, where wholesalers both buy more and get more discounts. Channel is the confounder.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "stat-06-c1",
  "prompt": "Total each Kolanut customer's revenue across all orders, then calculate the correlation between that total and the customer's `credit_limit`. Two decimal places.",
  "answer": 0.78,
  "format": "number",
  "tolerance": 0.011,
  "dataset": "sales",
  "files": ["orders", "customers"],
  "pyVerify": "round((lambda o, c: c.merge((o['quantity'] * o['unit_price'] * (1 - o['discount_pct'] / 100)).groupby(o['customer_id']).sum().rename('rev'), left_on='customer_id', right_index=True)[['credit_limit', 'rev']].corr().iloc[0, 1])(data('sales', 'orders'), data('sales', 'customers')), 2)",
  "hint": "A pivot table of revenue by customer_id, then XLOOKUP each customer's credit_limit next to it, then CORREL.",
  "explanation": "0.78: strong. But it's channel again: wholesalers get the highest credit limits and also buy the most. That doesn't show a higher limit would make any one customer buy more. Check it within one channel, as in the last practice task.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "r = −0.82 between price and units sold. What does that mean?",
    "options": ["A weak relationship", "A strong relationship where units sold tend to fall as price rises", "Price causes 82% of sales", "No relationship"],
    "answer": 1,
    "explanation": "Strong and negative. Whether price causes it is a separate question."
  },
  {
    "prompt": "r = 0.6. What's r², and what does it mean?",
    "options": ["0.36: about 36% of the variation is explained by a straight-line relationship", "0.6: 60% explained", "1.2", "0.36: the effect is 36% as big"],
    "answer": 0,
    "explanation": "r² is r squared, the share of variation explained."
  },
  {
    "prompt": "Shops with more staff have higher sales (r = 0.7). Which conclusion is safest?",
    "options": ["Hiring staff will raise sales", "Bigger, busier shops tend to have both more staff and more sales; this alone doesn't show staff cause sales", "Sales cause hiring, definitely", "The correlation is wrong"],
    "answer": 1,
    "explanation": "A third factor (shop size) could drive both."
  },
  {
    "prompt": "A scatter chart shows a clear U-shaped curve, and CORREL gives 0.02. What's true?",
    "options": ["There's no relationship", "There's a strong relationship, but not a straight line, which r can't measure", "The data is random", "CORREL is broken"],
    "answer": 1,
    "explanation": "r only measures straight-line relationships. Always look at the chart."
  }
]
```
