---
title: Paid Advertising
minutes: 30
summary: Understand how online ads work, set up Meta and Google campaigns sensibly, choose audiences, budgets and creative, and read ad results with the right numbers.
---

> [!NOTE]
> Ad platforms change their menus, names, features and rules often. This lesson teaches the lasting ideas and the numbers to watch. **Check each platform's current help pages and advertising policies before you spend.**

## How online ads work

Online advertising lets you pay to put your message in front of chosen people. Most platforms use an **auction:** many advertisers compete to show ads to the same person, and the platform picks based on **how much you bid, how relevant and engaging your ad is to that person** and the expected result. A relevant, well-made ad can cost less than a poor one.

Common ways you are charged:

- **CPM (cost per 1,000 impressions):** you pay for views.
- **CPC (cost per click):** you pay when someone clicks.
- **CPA / CPL (cost per action or lead):** you pay for a result, or the platform optimises toward it.

Every campaign has a clear **objective** (awareness, traffic, leads, messages, sales), a **target audience,** a **budget and schedule,** and the **ad creative** (image or video, text, headline and a call to action). The platform optimises toward the objective you choose, so choose the one that matches your real goal.

## Meta (Facebook and Instagram) ads

Meta ads reach people on Facebook, Instagram and related apps. Strengths: detailed audience options, visual formats, and the ability to drive **messages** (to WhatsApp or Messenger), **leads** and **sales.**

Setup in outline:

1. **Create a business account and page,** and verify your business as required.
2. **Choose the objective** (for example Leads, Sales, or messages).
3. **Define the audience:** location (for example Lagos), age, interests and behaviours; or upload a customer list; or a lookalike of your best customers; or retarget people who visited your website or engaged with your page.
4. **Choose placements** (automatic is a good starting point).
5. **Set the budget and schedule.**

6. **Create the ad:** a strong image or short video, a clear headline, short primary text and a call-to-action button.
7. **Install tracking** (the Meta Pixel and/or conversions setup) so results are measured.
8. **Review before publishing,** to meet the ad policies, then monitor.

## Google and YouTube ads

**Google Ads** shows your ads when people **search** for something, so the intent is strong: someone typing "AC repair Lekki" needs it now.

- **Search ads:** text ads on search results, triggered by **keywords.** Use match types carefully (broad, phrase, exact) and add **negative keywords** (for example "free", "jobs") to avoid wasted clicks.
- **Display and Performance Max:** image and automated ads across Google properties.
- **YouTube ads:** video ads, good for awareness, demonstrations and retargeting.
- **Local campaigns and Google Business Profile** help local services appear on maps.

Your **ad quality** and the **landing page** matter. A relevant ad that sends people to a page matching what they searched earns more clicks at a lower cost and converts better.

## Audiences, budgets and creative

**Audiences.** Start with a narrow but reachable group that matches your persona (for example women aged 25 to 40 in Lekki interested in hair care), and test variations. Use **retargeting** to reach people who already know you, as they convert best.

**Budgets.** Start small, and decide a fixed daily or total budget you can afford. Let each test run long enough to give data (often several days) before judging. Do not change everything at once. Increase spend gradually on what works, and pause what does not.

**Creative.** The ad itself is usually the biggest factor in performance.

- **Hook** attention in the first second or the first line.
- **One clear message** and **one clear call to action.**
- Show the **benefit** and **the product in use,** with real, good-quality photos or video.
- **Test** two or three versions (image vs video, different headlines).
- Use **plain, honest language,** and respect the platform's advertising rules. Do not make false claims.

## Reading ad results

Know these numbers and how to calculate them. Example campaign: you spend **₦50,000**; get **100,000 impressions**, **1,500 clicks**, **60 leads** and **15 sales** worth **₦12,000** each.

| Metric | Formula | Example |
| :-- | :-- | :-- |
| **CPM** | Spend ÷ impressions × 1,000 | 50,000 ÷ 100,000 × 1,000 = **₦500** |
| **CTR** (click-through rate) | Clicks ÷ impressions | 1,500 ÷ 100,000 = **1.5%** |
| **CPC** | Spend ÷ clicks | 50,000 ÷ 1,500 = **₦33.33** |
| **Lead conversion rate** | Leads ÷ clicks | 60 ÷ 1,500 = **4%** |
| **CPL** (cost per lead) | Spend ÷ leads | 50,000 ÷ 60 = **₦833** |
| **CPA** (cost per sale) | Spend ÷ sales | 50,000 ÷ 15 = **₦3,333** |
| **ROAS** (return on ad spend) | Revenue ÷ spend | (15 × 12,000 = 180,000) ÷ 50,000 = **3.6** |

A ROAS of 3.6 means each ₦1 of ads brought ₦3.60 of revenue. Whether that is profitable depends on your **margin:** if your profit margin is 30%, ₦3.60 of revenue gives about ₦1.08 of gross profit per ₦1 spent, a small profit before other costs.

If **CTR is low,** the ad or audience is weak. If **clicks are high but leads are low,** the landing page or offer is the problem. If **CPA is higher than your profit per sale,** change something or stop.

## Try it

```task
{
  "id": "dms-m05-t1",
  "prompt": "You spend **₦50,000**, get **100,000 impressions**, **1,500 clicks**, **60 leads** and **15 sales** worth **₦12,000** each. Work out **CPM, CTR, CPC, CPL, CPA** and **ROAS**.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "CPM = ...",
  "rules": [
    { "label": "CPM of ₦500", "pattern": "\\b500\\b" },
    { "label": "CTR of 1.5%", "pattern": "1\\.5\\s?%" },
    { "label": "CPC of about ₦33", "pattern": "33\\.3|33\\b" },
    { "label": "CPL of about ₦833", "pattern": "83[34]" },
    { "label": "CPA of about ₦3,333", "pattern": "3,?33[34]" },
    { "label": "ROAS of 3.6", "pattern": "3\\.6" }
  ],
  "sample": "CPM = 50,000 / 100,000 x 1,000 = ₦500.\nCTR = 1,500 / 100,000 = 1.5%.\nCPC = 50,000 / 1,500 = ₦33.33.\nCPL = 50,000 / 60 = ₦833.\nCPA = 50,000 / 15 = ₦3,333.\nROAS = (15 x 12,000) / 50,000 = 180,000 / 50,000 = 3.6.",
  "required": true
}
```

```task
{
  "id": "dms-m05-t2",
  "prompt": "Write a **Meta ad** for your business: a **headline** (under 8 words), **primary text** (30 to 70 words) with a hook, a benefit and proof, and a **call-to-action button**. Label each part.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Headline: ...\nPrimary text: ...\nCall to action: ...",
  "rules": [
    { "label": "Has a headline", "pattern": "headline" },
    { "label": "Has primary text", "pattern": "primary text|text:" },
    { "label": "Has a call to action", "pattern": "call to action|cta|button" },
    { "label": "Mentions a benefit", "pattern": "save|fresh|fast|easy|never|get|enjoy|free|delivered|book" },
    { "label": "Includes proof or a number", "pattern": "\\d+|reviews?|customers|guarantee|rated" },
    { "label": "Between 40 and 100 words", "minWords": 40, "maxWords": 105 }
  ],
  "sample": "Headline: Lunch at your desk by 12:30\nPrimary text: Tired of queuing for lunch or skipping it? FreshBox delivers a fresh, balanced meal to your office every working day, so you keep your whole break. Over 200 professionals in Ikeja rate us 4.8 out of 5, and your first meal is free if we are late. Order today and get 10% off your first week.\nCall to action: Order now",
  "required": true
}
```

```task
{
  "id": "dms-m05-t3",
  "prompt": "An ad has a **high CTR** but **very few leads**. In 40 to 90 words, say what is likely wrong and **two things** you would check or change.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "The problem is probably ...",
  "rules": [
    { "label": "Points to the landing page, offer or form", "pattern": "landing page|offer|form|page|website|checkout|sign-?up" },
    { "label": "Says the ad is working at getting clicks", "pattern": "ad (is )?(working|good|attract|doing)|click|interest|ctr" },
    { "label": "Suggests two checks or changes", "pattern": "check|change|test|simplify|speed|mobile|match|clear" },
    { "label": "Between 40 and 90 words", "minWords": 40, "maxWords": 95 }
  ],
  "sample": "The ad is doing its job because people click, so the problem is probably after the click: the landing page or the offer. I would check that the page matches the ad's promise, loads fast and is easy to use on a phone, and I would simplify the form so there are fewer fields. I would also test a clearer offer and call to action, and measure the lead conversion rate before and after.",
  "required": false
}
```

Next lesson: search engine optimisation.
