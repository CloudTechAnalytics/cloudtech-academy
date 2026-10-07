---
title: Analytics and Reporting
minutes: 20
summary: Know the key marketing metrics, use Google Analytics basics, track campaigns with UTM links and report results clearly to a boss or client.
---

> [!NOTE]
> Analytics tools change their names, screens and settings often. This lesson explains the lasting ideas. **Check the tool's current help pages for exact steps.**

## Key marketing metrics

Measure what connects to goals. Group your metrics:

**Reach and awareness:** impressions, reach, video views, website visitors, followers (the weakest measure on its own).

**Engagement:** clicks, likes, comments, shares, saves, time on site, pages per visit, email opens and clicks.

**Conversion:** leads, sign-ups, enquiries, add-to-carts, orders, bookings and the **conversion rate** (conversions ÷ visitors or clicks).

**Cost and return:**

- **CAC (customer acquisition cost):** marketing spend ÷ new customers.
- **CPL (cost per lead):** spend ÷ leads.
- **ROAS (return on ad spend):** revenue from ads ÷ ad spend.
- **ROI (return on investment):** (revenue − cost) ÷ cost. If a campaign costs ₦150,000 and brings ₦450,000 of revenue, ROI = (450,000 − 150,000) ÷ 150,000 = **200%**, and ROAS = 450,000 ÷ 150,000 = **3.0.** To judge profit, remember that revenue is not profit: subtract the cost of the goods and other costs.

**Retention:** repeat purchase rate, customer lifetime value, reviews and referrals.

Beware **vanity metrics:** numbers that look good but do not lead to money, such as followers or views alone. Always ask: *So what? Did this bring customers or sales?*

## Google Analytics basics

**Google Analytics** (GA4 in its current version) is a free tool that shows how people find and use your website or app. The main ideas:

- **Users and sessions:** how many people visit and how many visits they make.
- **Traffic sources:** where visitors come from: search, social, email, direct, referral and paid.
- **Pages and screens:** which pages are viewed most.
- **Events:** actions such as page views, clicks, scrolls, form submissions and purchases.
- **Conversions (key events):** the events you mark as important (a lead form sent, an order placed).
- **Audience and devices:** location, device type (most Nigerian traffic is on mobile), and new versus returning users.
- **Engagement:** how long people stay and what they do.

Setup in outline: create a property, add the tracking tag or snippet to your website (or connect it through your website platform), check the data appears, **define your key conversions,** and link it with Google Ads and Search Console. Respect privacy rules: tell visitors you use analytics, and follow cookie and consent requirements that apply.

When you read reports, ask three questions: **Where do my best visitors come from? What do they do? Where do they drop off?**

## Tracking campaigns

You need to know **which campaign, channel or link** brought each result. Use **UTM parameters** on links you share. They are labels added to a web address:

- **utm_source:** where the link is placed (instagram, newsletter, facebook)
- **utm_medium:** the type of channel (social, email, cpc)
- **utm_campaign:** the campaign name (april_promo)
- Optional: **utm_content** (which ad or button) and **utm_term** (the keyword).

Example link:
`https://www.example.com/offer?utm_source=instagram&utm_medium=social&utm_campaign=april_promo`

Analytics will then show "instagram / social / april_promo" with visits and conversions.

Other tracking:

- **Platform pixels and tags** (Meta Pixel, Google Ads tag) to measure ad conversions.
- **Unique discount codes** per channel or creator.
- **A "How did you hear about us?"** question in forms and at checkout.
- **Dedicated phone numbers or WhatsApp links** per campaign.
- **A simple spreadsheet** where you record leads and sales by source, especially for offline conversions.

Use a **consistent naming system** (lower case, no spaces) so reports are clean.

## Reporting to a boss or client

A good report shows **results, meaning and next steps** on one or two pages.

Structure:

1. **Summary:** the headline result against the goal.
2. **Key numbers:** 5 to 8 metrics, with last period and the trend.
3. **What worked and what did not,** with reasons.
4. **Insights:** what you learned about customers.
5. **Recommendations:** what to do next and what you need.
6. **Spend and return:** cost, revenue and ROI or ROAS.

Tips:

- **Start with the answer.** Do not make the reader dig.
- **Use charts sparingly and clearly,** with labels.
- **Compare with goals and previous periods.**
- **Explain in plain language;** avoid jargon.
- **Be honest about weak results,** and show how you will improve.
- **Be consistent.** Use the same format monthly, so trends are visible.

Example summary: *"In April, digital marketing brought 112 leads and 28 customers at ₦3,200 each, against a goal of 100 leads and ₦3,500 per customer. WhatsApp ads were the best channel (₦2,400 per customer); Google Ads were the most expensive. In May we will move 20% of the budget from Google to WhatsApp ads and test a shorter form."*

## Try it

```task
{
  "id": "dms-m09-t1",
  "prompt": "A campaign costs **₦150,000** and brings **₦450,000** of revenue. Work out the **ROAS** and the **ROI**. Then say in one or two sentences why revenue is not the same as profit.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "ROAS = ...",
  "rules": [
    { "label": "ROAS of 3.0", "pattern": "\\b3(\\.0)?\\b" },
    { "label": "ROI of 200%", "pattern": "\\b200\\s?%" },
    { "label": "Explains that costs of goods and other costs must be subtracted", "pattern": "cost|margin|expenses|goods|subtract|profit" }
  ],
  "sample": "ROAS = 450,000 / 150,000 = 3.0.\nROI = (450,000 - 150,000) / 150,000 = 200%.\nRevenue is not profit because I still have to subtract the cost of the goods and other expenses before I know what I really earned.",
  "required": true
}
```

```task
{
  "id": "dms-m09-t2",
  "prompt": "Build a **UTM link** for an Instagram post promoting an April promotion to the page `https://www.example.com/offer`. Write the full link, then explain in one line what each of the three UTM parameters means.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "https://www.example.com/offer?utm_source=...",
  "rules": [
    { "label": "Includes the page address", "pattern": "https://www\\.example\\.com/offer\\?" },
    { "label": "Includes utm_source=instagram", "pattern": "utm_source=instagram" },
    { "label": "Includes utm_medium", "pattern": "utm_medium=[a-z_]+" },
    { "label": "Includes utm_campaign with an April name", "pattern": "utm_campaign=[a-z_0-9]*(april|apr)" },
    { "label": "Explains the parameters", "pattern": "source[^\\n]*(where|platform|link)|medium[^\\n]*(type|channel)|campaign[^\\n]*(name|promotion|promo)" }
  ],
  "sample": "https://www.example.com/offer?utm_source=instagram&utm_medium=social&utm_campaign=april_promo\nutm_source says where the link was placed (Instagram).\nutm_medium says the type of channel (social).\nutm_campaign names the campaign (the April promotion).",
  "required": true
}
```

```task
{
  "id": "dms-m09-t3",
  "prompt": "Write a **monthly marketing report summary** (60 to 120 words): the headline against goal, two key numbers, the best and worst channel, and your next action. Use realistic figures.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "In April, ...",
  "rules": [
    { "label": "States results against a goal", "pattern": "goal|target|against|compared" },
    { "label": "Gives numbers (leads, customers, cost)", "pattern": "\\d+\\s*(leads|customers|sales)|₦\\s?\\d" },
    { "label": "Names the best and worst channels", "pattern": "best[\\s\\S]*(worst|expensive|weak)|(worst|expensive|weak)[\\s\\S]*best" },
    { "label": "States a next action", "pattern": "next|will|move|test|shift|plan" },
    { "label": "Between 60 and 120 words", "minWords": 60, "maxWords": 125 }
  ],
  "sample": "In April, digital marketing brought 112 leads and 28 customers at ₦3,200 each, against a goal of 100 leads and ₦3,500 per customer. WhatsApp ads were the best channel at ₦2,400 per customer, while Google Ads were the most expensive at ₦5,100. Our landing page converts 5% of visitors. Next month we will move 20% of the Google budget to WhatsApp ads, test a shorter form to lift the conversion rate and report again on 5 June.",
  "required": false
}
```

Next lesson: your complete campaign.
