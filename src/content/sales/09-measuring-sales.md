---
title: Measuring Sales
minutes: 20
summary: Track the sales metrics that matter, understand conversion rates and cycle length, write reports for managers and improve what you measure.
---

## Sales metrics that matter

You cannot improve what you do not measure, but too many numbers confuse. Choose a handful that connect effort to results.

**Activity metrics** (what you do): calls and messages made, meetings held, proposals sent.

**Pipeline metrics:** number and value of opportunities in each stage, new leads per week, pipeline coverage.

**Results metrics:** revenue, number of deals won, average deal size, profit or margin on sales, repeat sales.

**Efficiency metrics:** conversion rates, win rate, sales cycle length, cost to acquire a customer.

**Quota attainment** compares actual sales with target. If your target is ₦5,000,000 and you sold ₦4,200,000, attainment is 4,200,000 ÷ 5,000,000 = **84%.**

Metrics should be **defined clearly** (what counts as a lead, a qualified lead, a won deal?) and measured **the same way every time.**

## Conversion rates and cycle length

**Conversion rate** is the share of opportunities that move from one stage to the next. Looking at each stage shows where deals are lost.

Example funnel for a month:

| Stage | Number | Conversion from previous |
| :-- | :-- | :-- |
| Leads | 400 | |
| Qualified | 120 | 30% |
| Proposals sent | 48 | 40% |
| Won | 12 | 25% |

Overall conversion from lead to win = 12 ÷ 400 = **3%.**

**Win rate** is deals won ÷ deals closed (won plus lost). If you closed 40 deals and won 12, win rate = 12 ÷ 40 = **30%.**

**Average deal size** = total revenue ÷ number of deals. **Sales cycle length** is the average time from first contact to signed deal. A shorter cycle means faster cash and more sales per year. If one month of leads takes an average of 45 days to close, your cash from today's leads arrives in about six weeks.

Where to focus: find the **weakest stage** and the **biggest improvement per effort.** In the example, improving the proposal-to-win rate from 25% to 30% turns 48 proposals into 48 × 0.30 = 14.4 wins instead of 12, about **2 or 3 more deals** a month with no more leads.

## Reports for managers

Managers want to know **what happened, why and what to do.** A good sales report is short, clear and honest.

Include:

1. **Headline:** results against target in one or two lines.
2. **Key numbers:** revenue, pipeline, conversion, win rate, with last month and trend.
3. **A simple chart or table.**

4. **What is working and what is not,** with reasons.
5. **Risks and big opportunities:** large deals and what could stop them.
6. **Actions:** what you will do next and what help you need.

Example headline: *"October sales were ₦4.2m against a ₦5m target (84%). Pipeline coverage is 3.2 times next month's target. Proposal-to-win conversion fell to 25%, so we will review pricing and follow-up on the 12 open proposals."*

Keep the same format every month so trends are easy to see. Do not hide bad news; explain it and show your plan.

## Improving what you measure

Measurement only matters if it leads to action.

1. **Pick one metric** to improve (for example proposal-to-win rate).
2. **Find the cause.** Review lost deals and talk to customers. Is it price, timing, trust, follow-up or poor targeting?
3. **Try a change** (better qualification, faster follow-up, clearer proposals, a case study).
4. **Measure the effect** for a set time.
5. **Keep what works,** drop what does not, and pick the next metric.

Beware of **bad incentives.** If you reward only calls made, people make many pointless calls. If you reward only revenue, people may discount heavily or oversell. Balance activity, quality and results, and keep ethics central.

Also compare your numbers with your own history, not with unrealistic targets from elsewhere. Steady improvement beats sudden jumps.

## Try it

```task
{
  "id": "bds-m09-t1",
  "prompt": "A month's funnel: **400 leads**, **120 qualified**, **48 proposals**, **12 won**. Work out the conversion at each stage, the overall conversion and which stage is the **weakest**. Closed deals were 40; calculate the **win rate**.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Qualified = ...",
  "rules": [
    { "label": "Qualification rate of 30%", "pattern": "\\b30\\s?%" },
    { "label": "Proposal rate of 40%", "pattern": "\\b40\\s?%" },
    { "label": "Win conversion of 25%", "pattern": "\\b25\\s?%" },
    { "label": "Overall of 3%", "pattern": "\\b3\\s?%" },
    { "label": "Win rate of 30%", "pattern": "win rate[^\\n]*30|12\\s*/\\s*40" }
  ],
  "sample": "Qualified = 120 / 400 = 30%. Proposals = 48 / 120 = 40%. Won = 12 / 48 = 25%.\nOverall = 12 / 400 = 3%.\nThe weakest stage is proposal to win at 25%, which has the most to gain.\nWin rate = 12 won / 40 closed = 30%.",
  "required": true
}
```

```task
{
  "id": "bds-m09-t2",
  "prompt": "If you improve the proposal-to-win rate from **25% to 30%** with **48 proposals**, how many wins would you get, and how many more than now? Then name **two actions** that could raise the rate.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Wins at 30% = ...",
  "rules": [
    { "label": "14.4 wins (about 14)", "pattern": "14\\.4|\\b14\\b" },
    { "label": "About 2 more wins", "pattern": "2\\.4|\\b2\\b|\\b3\\b|two|three" },
    { "label": "Names actions (faster follow-up, better proposals, better qualification, case studies)", "pattern": "follow-?up|proposal|qualif|case stud|pricing|reference|call" }
  ],
  "sample": "Wins at 30% = 48 x 0.30 = 14.4, about 14, compared with 12 now, so about 2 more wins.\nI would follow up faster after sending each proposal and add a case study and clearer options to every proposal.",
  "required": true
}
```

```task
{
  "id": "bds-m09-t3",
  "prompt": "Write a **monthly sales report summary** (60 to 120 words): the headline against target, two key numbers, what is working, one risk and the actions you will take. Sales were ₦4.2m against a ₦5m target.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "October sales were ...",
  "rules": [
    { "label": "States the result against target (84%)", "pattern": "84\\s?%|4\\.2|5m|5,000,000" },
    { "label": "Gives key numbers (pipeline, conversion, win rate)", "pattern": "pipeline|conversion|win rate|deals|average" },
    { "label": "Says what is working", "pattern": "working|improv|strong|good|grew|up" },
    { "label": "Names a risk", "pattern": "risk|concern|slow|fell|drop|delay|stuck" },
    { "label": "States actions", "pattern": "action|will|next|plan|review|follow" },
    { "label": "Between 60 and 120 words", "minWords": 60, "maxWords": 125 }
  ],
  "sample": "October sales were ₦4.2m against a ₦5m target, which is 84% attainment. The pipeline now covers 3.2 times next month's target, and our win rate rose to 30%. What is working is referral leads, which closed at twice the rate of cold outreach. The main risk is that proposal-to-win conversion fell to 25% and three large deals have been stuck in negotiation for over a month. Next month we will follow up all 12 open proposals within 48 hours and review our pricing on the three stuck deals.",
  "required": false
}
```

Next lesson: your sales plan and pitch.
