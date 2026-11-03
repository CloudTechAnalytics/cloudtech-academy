---
title: "Money: Pricing, Budgeting, Cash Flow and Funding"
minutes: 30
summary: Price for profit, work out costs, margins and break-even, build a budget and cash flow forecast, separate business and personal money and choose sensible funding.
---

## Pricing for profit

Price is the most powerful number in your business. Too low and you work hard for nothing; too high and nobody buys. A sound price covers **costs**, delivers a **profit**, and matches the **value** customers see.

**Cost-plus pricing** adds a margin to your cost. If a meal costs **₦2,800** (ingredients, packaging, delivery share) and you add a **40% markup**, the price is 2,800 × 1.40 = **₦3,920**. Profit = ₦1,120. Be careful: a 40% **markup** on cost is a **margin** of 1,120 ÷ 3,920 = **28.6%** of the price. Markup is on cost; margin is on price.

**Value-based pricing** starts from what customers will pay and what competitors charge. If office canteens charge ₦1,800 a plate and customers will pay ₦2,500 for desk delivery, your price can be near ₦2,500 if your costs allow.

Check both: your cost-plus price shows your **minimum**; the market shows your **maximum**. If the market price is below your cost, change the offer or the costs, not just the price.

## Costs, margins and break-even

- **Fixed costs** stay the same however much you sell this month (rent, salaries, subscriptions, loan repayments).
- **Variable costs** rise with each sale (ingredients, packaging, delivery, fees).
- **Contribution per unit** = price − variable cost per unit. It is what each sale contributes toward fixed costs and profit.
- **Gross margin** = (price − direct cost) ÷ price.

**Break-even** is the sales volume where you make no profit and no loss:

*Break-even units = fixed costs ÷ contribution per unit*

Example: fixed costs ₦150,000 a month; price ₦3,500; variable cost ₦2,000 per unit. Contribution = 3,500 − 2,000 = ₦1,500. Break-even = 150,000 ÷ 1,500 = **100 units** a month. Selling 160 units earns (160 − 100) × 1,500 = **₦90,000** profit.

Break-even tells you if your plan is realistic: can you honestly sell 100 units a month?

## Budgets and cash flow forecasts

A **budget** is a plan for income and spending. A **cash flow forecast** shows the **timing** of money in and out, month by month. Profit and cash are **not the same**: you can be profitable and still run out of cash, because you pay suppliers before customers pay you, or you buy stock that has not sold.

A simple monthly cash flow:

| | Month 1 | Month 2 |
| :-- | :-- | :-- |
| Opening cash | ₦100,000 | ₦60,000 |
| Cash received from sales | ₦300,000 | ₦380,000 |
| Cash paid out (stock, rent, wages, other) | ₦340,000 | ₦350,000 |
| **Closing cash** | **₦60,000** | **₦90,000** |

Month 1 closing = 100,000 + 300,000 − 340,000 = ₦60,000, which becomes the opening cash for Month 2. If a month's closing cash goes below zero, you need to act in advance: delay a purchase, collect faster, cut spending or arrange funding.

Update your forecast with real figures each month, and keep a **cash reserve** that covers at least a month or two of fixed costs.

## Separating business and personal money

Mixing the two is one of the biggest causes of small business failure.

- **Open a separate business bank account.**
- **Pay yourself a set amount** (a salary or drawing) at regular times; do not take cash from the till at random.
- **Keep all business income and expenses in the business account.**
- **Record every transaction** and keep receipts.
- **Do not pay personal bills from business money** or vice versa.

You will then know your true profit, and banks, investors and tax officials will take you seriously.

## Funding options

Think about how much you need and when, and choose the cheapest, safest source that fits.

| Source | Notes |
| :-- | :-- |
| **Your own savings** | No interest or outside pressure, but your own risk |
| **Family and friends** | Agree amount and terms in writing |
| **Reinvested profit** | Slow, but cheap and under your control |
| **Pre-sales and customer deposits** | Customers fund the start |
| **Cooperatives and thrift groups (esusu / ajo)** | Community saving and lending |
| **Microfinance banks and commercial banks** | Loans need repayment with interest; need records and sometimes collateral |
| **Development finance institutions and government schemes** | For example the Bank of Industry and various SME programmes; check current eligibility |
| **Grants and business competitions** | Free money, but competitive, with conditions |
| **Angel investors and venture capital** | Give up part of the ownership; suited to businesses that can grow fast |

Before borrowing, test whether the loan is **affordable**: can the business repay it from cash flow even if sales are 20% lower than planned? Never borrow for things that do not produce income, and read every term, including interest and penalties. Beware of "too good to be true" offers and advance fees.

## Try it

```task
{
  "id": "ent-m08-t1",
  "prompt": "A meal costs **₦2,800**. (a) Add a **40% markup** to get the price. (b) Calculate the profit per meal. (c) Calculate the **margin as a percentage of the price**.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Price = ...",
  "rules": [
    { "label": "Price of ₦3,920", "pattern": "3,?920" },
    { "label": "Profit of ₦1,120", "pattern": "1,?120" },
    { "label": "Margin of about 28.6%", "pattern": "28\\.6|28\\.57|29 ?%" }
  ],
  "sample": "(a) Price = 2,800 x 1.40 = ₦3,920.\n(b) Profit = 3,920 - 2,800 = ₦1,120 per meal.\n(c) Margin = 1,120 / 3,920 = 28.6% of the price.",
  "required": true
}
```

```task
{
  "id": "ent-m08-t2",
  "prompt": "Fixed costs are **₦150,000** a month, the price is **₦3,500** and the variable cost is **₦2,000** a unit. Work out the **contribution per unit**, the **break-even units** and the **profit if you sell 160 units**.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Contribution = ...",
  "rules": [
    { "label": "Contribution of ₦1,500", "pattern": "1,?500" },
    { "label": "Break-even of 100 units", "pattern": "\\b100\\b" },
    { "label": "Profit of ₦90,000", "pattern": "90,?000" }
  ],
  "sample": "Contribution per unit = 3,500 - 2,000 = ₦1,500.\nBreak-even = 150,000 / 1,500 = 100 units a month.\nProfit at 160 units = (160 - 100) x 1,500 = ₦90,000.",
  "required": true
}
```

```task
{
  "id": "ent-m08-t3",
  "prompt": "Complete a **two-month cash flow forecast**. Month 1: opening ₦100,000, cash in ₦300,000, cash out ₦340,000. Month 2: cash in ₦380,000, cash out ₦350,000. Work out each closing balance, then say what you would do if Month 1 closing cash had been **negative**.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Month 1 closing = ...",
  "rules": [
    { "label": "Month 1 closing of ₦60,000", "pattern": "60,?000" },
    { "label": "Month 2 closing of ₦90,000", "pattern": "90,?000" },
    { "label": "Month 2 opening equals Month 1 closing", "pattern": "opening[^\\n]*60,?000|60,?000 (becomes|carr|is the opening)" },
    { "label": "Suggests an action for negative cash (delay, collect, cut, borrow, reserve)", "pattern": "delay|collect|cut|reduce|borrow|fund|reserve|defer|negotiate|sell" }
  ],
  "sample": "Month 1 closing = 100,000 + 300,000 - 340,000 = ₦60,000.\nMonth 2 opening = ₦60,000, so closing = 60,000 + 380,000 - 350,000 = ₦90,000.\nIf Month 1 closing had been negative, I would act in advance: delay or reduce purchases, collect payments faster, negotiate longer supplier terms or arrange a small short-term funding before the shortfall happened.",
  "required": true
}
```

Next lesson: leadership, people and growth.
