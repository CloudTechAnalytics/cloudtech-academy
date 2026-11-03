---
title: Marketing Fundamentals and Strategy
minutes: 25
summary: See how marketing and sales fit together, understand customers and segments, set goals and choose channels and a budget.
---

## How marketing and sales fit together

**Marketing** creates interest and trust: it helps the right people know you exist, understand what you offer and want to talk to you. **Sales** turns that interest into a purchase. They are two halves of one job, which is **winning and keeping customers profitably.**

Marketing answers: *Who needs this, what do they care about, how do we reach them and what do we say?* Sales answers: *How do we help this person decide and buy?* When they are disconnected, marketing brings leads that sales cannot close, or sales complains about lead quality while marketing complains about slow follow-up. Good businesses agree **one definition of a good lead**, share data and review results together.

**Digital marketing** uses online channels such as search engines, social media, email, messaging apps, websites and online ads. Its great strength is that you can **measure** almost everything: who saw a message, who clicked and who bought. This allows small businesses to test cheaply and improve quickly. Its great weakness is that it is easy to waste money on activity (likes, views) that does not bring customers.

## Customers and segments

You cannot market well to "everyone." A **segment** is a group of customers with similar needs, behaviour or characteristics. Common ways to segment:

- **Who they are:** age, gender, income, occupation, location, business type and size.
- **What they need or want:** the problem, the benefit they care about most.
- **How they behave:** how they buy, how often, how they find products, which channels they use.
- **Where they are in the journey:** unaware, researching, ready to buy, existing customer.

Choose one or two **target segments** where you can serve people well and profitably. For each, create a short **customer profile (persona):** a realistic description such as *"Chioma, 32, runs a small salon in Lekki, uses Instagram daily, worries about slow weeks and cannot afford an agency."* Include her goals, frustrations, where she gets information, what makes her trust a brand and what stops her buying.

The persona should come from **real conversations and data**, not imagination: talk to customers, read reviews and comments, look at your sales records and website analytics.

## Setting goals

Marketing goals should connect to **business results** and be **SMART** (specific, measurable, achievable, relevant, time-bound).

Weak goal: *"Get more followers."* Strong goal: *"Generate 60 qualified leads and 15 sales from digital channels in the next three months, at no more than ₦3,000 per sale."*

Different goals suit different stages:

| Goal type | Example measures |
| :-- | :-- |
| **Awareness** | Reach, impressions, video views, website visitors |
| **Consideration** | Clicks, sign-ups, enquiries, email subscribers |
| **Conversion** | Leads, orders, sales, bookings |
| **Retention** | Repeat purchases, reviews, referrals |

Work **backwards from revenue.** If you need 30 new customers and your target cost to acquire a customer is ₦3,000, your marketing budget for that goal is 30 × 3,000 = **₦90,000.** If your conversion rate from lead to customer is 25%, you need 120 leads to win 30 customers.

## Choosing channels and a budget

Match channels to where your **target customers already spend time** and what you are trying to achieve.

| Channel | Strength | Cost and effort |
| :-- | :-- | :-- |
| **Search (SEO)** | People actively looking for what you offer | Slow to build, cheap in the long run |
| **Google Ads** | Reach people searching now | Pay per click; fast |
| **Social media (organic)** | Build awareness and community | Time-heavy; low cost |
| **Social media ads** | Targeted reach and quick tests | Pay per result |
| **Email** | Nurture and sell to people who know you | Cheap; needs a list |
| **WhatsApp** | Personal, high-response in Nigeria | Cheap; needs permission |
| **Content (blog, video)** | Builds trust and search traffic | Time and skill |
| **Referrals and partnerships** | Highest trust | Low cost |

Start with **two or three channels** and do them well. Spreading thin on ten channels usually fails.

**Budget:** decide how much you can spend and split it. A common approach for a new business is to spend a modest share of revenue, often **5% to 15%**, more when launching. Divide it between **testing** (most), **proven channels** and a small **reserve.** Track results weekly, and move money to what works.

> [!TIP]
> Test small before you scale. Spend ₦10,000 to learn which message and audience work, before spending ₦100,000.

## Try it

```task
{
  "id": "dms-m01-t1",
  "prompt": "Create a **customer persona** for your business or a business you know, in 60 to 130 words: name and basic details, goals, frustrations, where they get information and what would make them trust a brand.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Meet Chioma, 32 ...",
  "rules": [
    { "label": "Gives a name and basic details (age, job, place)", "pattern": "\\b\\d{2}\\b|aged|runs|works|lives|based|owner|student" },
    { "label": "States goals", "pattern": "goal|wants|hopes|aims|needs to|wishes" },
    { "label": "States frustrations or worries", "pattern": "frustrat|worr|struggl|problem|cannot|can't|afraid|pain|stress" },
    { "label": "Says where they get information", "pattern": "instagram|whatsapp|facebook|tiktok|google|youtube|friends|linkedin|radio|search|online" },
    { "label": "Says what builds trust", "pattern": "trust|reviews?|recommend|proof|referral|testimonial|reliable" },
    { "label": "Between 60 and 130 words", "minWords": 60, "maxWords": 135 }
  ],
  "sample": "Meet Chioma, 32, who runs a small hair salon in Lekki with three staff. Her goal is to fill her quiet midweek slots and attract customers who pay for premium styles. Her frustrations are slow weeks, unreliable walk-ins and the fact that agencies cost more than she can afford, so she worries about wasting money on marketing she cannot measure. She finds ideas on Instagram, WhatsApp groups and Google. She trusts brands that show real customer photos, honest reviews and recommendations from other business owners she knows.",
  "required": true
}
```

```task
{
  "id": "dms-m01-t2",
  "prompt": "Write **one SMART marketing goal** and work backwards to the numbers. You want **30 new customers** at a target cost of **₦3,000** each, and **25%** of leads become customers. Work out the budget and the number of leads needed.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Goal: ...\nBudget = ...",
  "rules": [
    { "label": "States a goal with a number and a time frame", "pattern": "goal[^\\n]*\\d[^\\n]*(month|week|quarter|year|by )" },
    { "label": "Budget of ₦90,000", "pattern": "90,?000" },
    { "label": "120 leads needed", "pattern": "\\b120\\b" },
    { "label": "Shows the calculation", "pattern": "=|/|÷|[x×*]" }
  ],
  "sample": "Goal: win 30 new customers from digital channels in the next three months at no more than ₦3,000 per customer.\nBudget = 30 x 3,000 = ₦90,000.\nLeads needed = 30 / 0.25 = 120 leads.",
  "required": true
}
```

```task
{
  "id": "dms-m01-t3",
  "prompt": "Choose **three channels** for your business, say **why** each fits your customer and how you will **split a ₦90,000 budget** between them (percentages adding to 100%). One channel per line.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Instagram ads - 50% - because ...",
  "rules": [
    { "label": "Three lines", "minLines": 3 },
    { "label": "Every line has a percentage", "pattern": "\\d+\\s?%", "perLine": true },
    { "label": "Names real channels", "pattern": "instagram|facebook|tiktok|whatsapp|google|email|seo|youtube|linkedin|referral" },
    { "label": "Gives reasons", "pattern": "because|since|so|where|fits|customers", "perLine": true }
  ],
  "sample": "Instagram and Facebook ads - 50% (₦45,000) - because my customers are on Instagram daily and ads let me test quickly\nWhatsApp broadcasts and status - 20% (₦18,000) - because customers prefer messaging and it is where bookings happen\nGoogle Business Profile and local search - 30% (₦27,000) - because people search 'hair salon near me' when ready to book",
  "required": false
}
```

Next lesson: brand and positioning.
