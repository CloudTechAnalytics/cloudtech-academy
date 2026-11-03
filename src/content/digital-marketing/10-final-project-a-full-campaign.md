---
title: "Final Project: A Full Campaign"
minutes: 45
summary: Plan a full marketing campaign, build the assets, set up tracking and present the plan to decision makers.
---

## What you are building

You now have the pieces: strategy, brand, content, social, ads, search, email and WhatsApp, funnels and analytics. In this project you use them in **one complete campaign** for a real or realistic business, and present it as a marketer would to an owner or client.

Choose a business you know (your own, a friend's or a realistic one) and a **specific goal**, such as launching a product, filling a service's quiet days, promoting an event or gaining new customers in a month. Use real prices and real information, and state your assumptions.

## Your campaign has six parts

1. **Goal, audience and strategy.** A SMART goal worked back to numbers (leads, customers, budget), your target persona and the core message.
2. **Channels and budget.** Two or three channels, the reason for each and a budget split with expected results.
3. **Creative and content.** The key assets: an ad (headline, text, call to action), a landing page plan, an email or WhatsApp message and a four-week content calendar.
4. **Funnel and conversion.** The customer journey from first contact to sale, the offer and how you will test one improvement.
5. **Tracking and measurement.** Your metrics, UTM links, pixels or codes, and how leads and sales will be recorded.
6. **Timeline, risks and report.** A schedule, the main risks, and what your final report will show.

## Presenting the plan

Write for the owner or client who will approve the budget. Open with a one-page **summary:** the goal, the plan, the budget and the expected result. Use tables for the budget, calendar and metrics. Show the maths. Anticipate questions: *Why these channels? What if results are half? How will we know it worked?* Have honest answers.

> [!TIP]
> A modest, well-tracked campaign you can learn from is better than a large one you cannot measure. Plan to test, learn and adjust.

## Try it

```task
{
  "id": "dms-m10-t1",
  "prompt": "State your **campaign goal and the numbers behind it**, one item per line: the business, a SMART goal, target customers, cost per customer you can afford, total budget, leads needed and your assumed lead-to-customer rate. At least six lines.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Business: ...\nGoal: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "States the business", "pattern": "business" },
    { "label": "States a goal with a number and a date", "pattern": "goal[^\\n]*\\d[^\\n]*(day|week|month|by )" },
    { "label": "States the audience", "pattern": "audience|customers?|persona" },
    { "label": "States the budget in naira", "pattern": "budget[^\\n]*₦\\s?\\d" },
    { "label": "Works out leads needed", "pattern": "leads?[^\\n]*(=|/|÷|\\d)" }
  ],
  "sample": "Business: FreshBox, a healthy lunch delivery service in Ikeja\nGoal: win 60 new customers in the next 8 weeks\nAudience: office workers aged 25 to 40 in Ikeja with little time for lunch\nAffordable cost per customer: ₦3,000\nBudget: ₦180,000 (60 x 3,000)\nLeads needed: 60 / 0.25 = 240 leads, assuming 25% of leads become customers",
  "required": true
}
```

```task
{
  "id": "dms-m10-t2",
  "prompt": "Write your **channels and budget split**: three channels, each with the percentage and naira amount, the reason and the result you expect (for example leads). One channel per line. The percentages must add to 100.",
  "minutes": 12,
  "rows": 6,
  "placeholder": "Instagram and Facebook ads - 50% (₦90,000) - because ... - expect 120 leads",
  "rules": [
    { "label": "Three lines", "minLines": 3 },
    { "label": "Each line has a percentage and a naira amount", "pattern": "\\d+\\s?%[^\\n]*₦\\s?\\d", "perLine": true },
    { "label": "Each line has a reason", "pattern": "because|since|so|where|fits", "perLine": true },
    { "label": "Each line has an expected result", "pattern": "expect|leads|customers|enquiries|bookings", "perLine": true }
  ],
  "sample": "Instagram and Facebook ads - 50% (₦90,000) - because our customers are on Instagram daily and ads let us test quickly - expect 120 leads\nWhatsApp broadcasts and status - 20% (₦36,000) - because bookings and replies happen on WhatsApp - expect 60 leads\nGoogle Business Profile and local search - 30% (₦54,000) - because workers search for lunch near their office - expect 60 leads",
  "required": true
}
```

```task
{
  "id": "dms-m10-t3",
  "prompt": "Write your **campaign assets**: the **ad** (headline and 30 to 60 words of primary text), the **landing page headline and button**, and a **short WhatsApp or email message**. Label each part.",
  "minutes": 15,
  "rows": 12,
  "placeholder": "Ad headline: ...\nAd text: ...\nLanding page headline: ...\nButton: ...\nMessage: ...",
  "rules": [
    { "label": "Has an ad headline", "pattern": "ad headline|headline:" },
    { "label": "Has ad text", "pattern": "ad text|primary text" },
    { "label": "Has a landing page headline", "pattern": "landing page" },
    { "label": "Has a button or CTA", "pattern": "button|cta|call to action" },
    { "label": "Has a message (WhatsApp or email)", "pattern": "message|whatsapp|email" },
    { "label": "Includes a benefit and an offer", "pattern": "free|off|discount|save|fresh|never|on time" },
    { "label": "At least 70 words in total", "minWords": 70, "maxWords": 220 }
  ],
  "sample": "Ad headline: Lunch at your desk by 12:30\nAd text: Tired of queuing for lunch or skipping it? FreshBox delivers a fresh, balanced meal to your office every working day, so you keep your whole break. Over 200 professionals rate us 4.8 out of 5, and your first week is 10% off.\nLanding page headline: Fresh lunch at your desk, on time or free\nButton: Get my first week 10% off\nMessage: Hi Tola, it is Ada from FreshBox. Your first week of lunches is 10% off until Friday. Reply YES and I will set up your first delivery. Reply STOP to opt out.",
  "required": true
}
```

```task
{
  "id": "dms-m10-t4",
  "prompt": "Write your **tracking and measurement plan** in at least six lines: the metrics, one UTM link, how leads and sales are recorded, the review dates and what result would make you scale the campaign or stop it.",
  "minutes": 6,
  "rows": 9,
  "placeholder": "Metrics: ...\nUTM link: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Lists metrics", "pattern": "metrics?|cpl|cpa|roas|conversion|ctr|cost per" },
    { "label": "Includes a UTM link", "pattern": "utm_source=[a-z]+[^\\s]*utm_campaign=" },
    { "label": "Says how leads and sales are recorded", "pattern": "record|spreadsheet|sheet|crm|log|track" },
    { "label": "Gives review dates", "pattern": "weekly|every (monday|friday|week)|week [1-8]|day [0-9]+|review" },
    { "label": "States a scale or stop rule", "pattern": "scale|stop|pause|increase|if .* (below|above|more than|less than|higher|lower)" }
  ],
  "sample": "Metrics: impressions, CTR, cost per lead, lead conversion rate, cost per customer and ROAS\nUTM link: https://www.freshbox.example/offer?utm_source=instagram&utm_medium=social&utm_campaign=launch_week\nRecording: every lead and sale goes into a shared spreadsheet with its source, entered the same day\nPixel and tags: install the Meta Pixel and set up Google Analytics key events for form submissions\nReview: every Friday I check spend, leads and cost per customer\nRule: if cost per customer stays below ₦3,000 for two weeks I will increase that channel's budget by 20%; if it is above ₦5,000 I will pause it and change the creative",
  "required": true
}
```

When you are done, submit your complete campaign plan as your final project.
