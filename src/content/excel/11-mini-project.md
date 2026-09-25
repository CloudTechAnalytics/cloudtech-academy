---
title: "Mini project: what do discounts cost?"
minutes: 45
summary: A guided analysis of Kolanut's discounts from question to recommendation, using everything in the course.
---

## The problem

Kolanut's finance manager raises a concern: *"We give discounts all the time. How much are they costing us, who gets them, and are we getting anything back?"*

This mini project walks through the full analysis. The course's final project then asks you to produce a complete sales performance review on your own.

## The concept

**Discount cost** for an order line is what Kolanut would have earned at full price minus what it actually earned:

```excel
=[@quantity]*[@unit_price]*[@discount_pct]/100
```

Summed over lines, that's the naira value of discounts given away.

**Questions to answer**

1. How much did discounts cost in total, and as a % of gross sales?
2. Which channel receives most of the discount value?
3. What share of each channel's order lines is discounted?
4. Do discounted lines order more packs than undiscounted ones? (If discounts buy bigger orders, they may pay for themselves.)

## Example

The results, for reference once you've done your own:

| Channel | Order lines | Lines discounted | Discount cost (₦) | Share of discount cost |
| :-- | --: | --: | --: | --: |
| Wholesale | 2,181 | 1,347 (62%) | 25,417,295 | 87.4% |
| Supermarket | 1,308 | 358 (27%) | 3,560,935 | 12.2% |
| Kiosk | 777 | 42 (5%) | 108,825 | 0.4% |
| **Total** | **4,266** | **1,747** | **29,087,055** | **100%** |

Discounts cost ₦29.1m, **3.4% of gross sales**, and nearly nine naira in ten of it went to wholesalers.

## Walkthrough

1. **Set up.** On your Orders table (with `channel` looked up from Customers), add `gross = [@quantity]*[@unit_price]` and `discount_cost = [@gross]*[@discount_pct]/100`.
2. **Total cost.** `=SUM(Orders[discount_cost])`, and as a share of `=SUM(Orders[gross])`.
3. **By channel.** Pivot: `channel` in Rows; `discount_cost` in Values (Sum, then a second copy as % of Grand Total); `order_id` in Values as Count.
4. **Discounted share of lines.** Add `discounted = IF([@discount_pct]>0, "Yes", "No")`, put it in Columns of a count pivot, or use COUNTIFS per channel.
5. **Do discounts buy bigger orders?** Pivot for Wholesale only (slicer): `discounted` in Rows, **Average of quantity** in Values. Compare Yes and No.
6. **Write it up** on a Summary sheet: three numbers, one chart (discount cost by channel), two or three sentences, one recommendation.

> [!TIP]
> Step 5 is where analysis becomes judgement. If discounted wholesale lines are no bigger than full-price ones, the discount isn't buying volume. That's a strong argument for tightening the policy. Look at the numbers before you decide what they mean.

## Practice

```answer
{
  "id": "xls-11-p1",
  "prompt": "What did discounts cost Kolanut in total across all order lines, to the nearest naira?",
  "answer": 29087055,
  "tolerance": 1,
  "format": "naira",
  "dataset": "sales",
  "files": ["orders"],
  "verify": "SELECT SUM(quantity * unit_price * discount_pct / 100.0) FROM orders",
  "hint": "Add discount_cost = quantity × unit_price × discount_pct ÷ 100, then SUM.",
  "required": true
}
```

```answer
{
  "id": "xls-11-p2",
  "prompt": "Among **Wholesale** order lines, what is the **average quantity** on lines **with** a discount, to one decimal place?",
  "answer": 19.2,
  "format": "number",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT ROUND(AVG(o.quantity), 1) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.channel = 'Wholesale' AND o.discount_pct > 0",
  "hint": "AVERAGEIFS(Orders[quantity], Orders[channel], \"Wholesale\", Orders[discount_pct], \">0\"), or a pivot with a Wholesale slicer.",
  "explanation": "Now compare it with Wholesale lines without a discount. Is there a meaningful difference?",
  "required": true
}
```

## Challenge

```answer
{
  "id": "xls-11-c1",
  "prompt": "And the average quantity on **Wholesale** lines **without** a discount, to one decimal place?",
  "answer": 18.7,
  "format": "number",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT ROUND(AVG(o.quantity), 1) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.channel = 'Wholesale' AND o.discount_pct = 0",
  "hint": "Same as before with discount_pct = 0.",
  "explanation": "Discounted and full-price wholesale lines are almost the same size. In this data, discounts don't appear to buy bigger orders, which is worth raising with the finance manager.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A line of 20 packs at ₦10,000 with a 5% discount. What did the discount cost?",
    "options": ["₦500", "₦10,000", "₦190,000", "₦5,000"],
    "answer": 1,
    "explanation": "20 × 10,000 × 5 ÷ 100 = ₦10,000."
  },
  {
    "prompt": "Discounted and full-price wholesale lines have almost the same average quantity. What does that suggest?",
    "options": ["Discounts clearly increase order size", "In this data, discounts aren't buying larger orders", "Wholesale should get bigger discounts", "The data is wrong"],
    "answer": 1,
    "explanation": "If discounts don't change behaviour, they're mostly a cost. Other benefits (loyalty, faster payment) would need other data."
  },
  {
    "prompt": "What should the mini project's summary page contain?",
    "options": ["Every pivot table you built", "A few key numbers, one clear chart, a short explanation and a recommendation", "The raw data", "Only a chart"],
    "answer": 1,
    "explanation": "The summary is for the decision-maker: short, clear and actionable."
  }
]
```

When you've finished, take the final assessment, then start the final project from the course page.
