---
title: Find Clients and Get Paid
minutes: 25
summary: Set up profiles on freelance platforms, find local and social media clients, and get paid safely in naira and foreign currency.
---

## Two ways to find clients

**1. Freelance platforms** connect you with clients worldwide:

| Platform | How it works |
| :-- | :-- |
| **Fiverr** | You list fixed-price "gigs"; clients come to you |
| **Upwork** | You send proposals to jobs clients post |
| **Contra**, **Freelancer.com** | Similar marketplaces, some with lower fees |

Platforms take a fee (often around 10–20%), and competition is high. Your first review is the hardest to get.

**2. Direct clients**, often easier at first:

- **Your network:** tell friends, family, church, mosque and school groups exactly what you offer.
- **Local businesses:** shops, restaurants and salons that need flyers, social posts or spreadsheets.
- **Social media:** post your samples on Instagram, X, LinkedIn and your WhatsApp status with a clear call to action.

## A profile that wins work

On any platform:

- **Photo:** clear and friendly, just your face.
- **Title:** your offer, not "freelancer". "Social media flyer designer for small businesses."
- **Description:** who you help, what they get and how fast, in short paragraphs.
- **Samples:** your three best pieces.
- **Price:** start competitive, and raise it after good reviews.

## Get paid safely

- On platforms, **keep all payments on the platform**. It protects both of you. Clients who ask to move to direct payment before the first job are a risk, and it can get your account banned.
- For direct clients, ask for **50% upfront** and 50% on delivery, or 100% upfront for small jobs.
- For foreign payments, use the platform's withdrawal options or services such as Payoneer, then withdraw to your Nigerian bank account. Compare fees and exchange rates.
- Keep a simple **record** in Google Sheets: client, job, amount, date paid.

> [!WARNING]
> Scammers pose as clients too. Never pay to "unlock" a job, never share your bank login or OTP, and be wary of cheques or "overpayments" where you're asked to send money back.

## Try it

```answer
{
  "id": "freel-m02-a1",
  "prompt": "You complete a **₦50,000** job on a platform that takes a **20%** fee. How much do you receive, in naira?",
  "answer": 40000,
  "format": "naira",
  "hint": "50,000 × (1 − 0.20)",
  "explanation": "₦40,000. Remember the fee when you set platform prices: to take home ₦50,000 you'd need to charge ₦62,500.",
  "required": true
}
```

```answer
{
  "id": "freel-m02-a2",
  "prompt": "A new client asks to move off the platform and pay you directly **before** the first job \"to avoid fees\". Is this safe: **yes** or **no**?",
  "answer": "no",
  "format": "text",
  "explanation": "It removes the platform's protection for both of you and usually breaks its rules. Keep the first jobs (at least) on the platform.",
  "required": true
}
```

```task
{
  "id": "freel-m02-t1",
  "prompt": "Write your platform profile's **title** on the first line, then a **description** of 50 to 120 words: who you help, what they get, how fast, and a call to action.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Social media flyer designer for small food businesses\n\nI help ...",
  "rules": [
    { "label": "A title on the first line (2 to 12 words)", "pattern": "(?<![\\s\\S])\\s*(\\S+[ \\t]+){1,11}\\S+[ \\t]*\\n" },
    { "label": "The title names your service, not just \"Freelancer\"", "pattern": "(?<![\\s\\S])\\s*(i am a |i'm a )?freelancer\\s*\\n", "absent": true },
    { "label": "Says who you help", "pattern": "\\bfor\\b|\\bhelp\\b|clients|businesses|owners|brands|students" },
    { "label": "Says how fast you deliver", "pattern": "\\d+\\s*(days?|hours?)|within|same day|next day" },
    { "label": "Ends with a call to action (message, order, get in touch…)", "pattern": "message|order|contact|get in touch|send|book|dm|reach out|let's talk" },
    { "label": "Description of 50 to 120 words", "minWords": 55, "maxWords": 135 }
  ],
  "sample": "Social media flyer designer for small food businesses\n\nI help restaurants, bakeries and food vendors fill their weekends with flyers people stop scrolling for. You get three designs for Instagram and WhatsApp, in square and story sizes, delivered in 3 days with two rounds of changes and an editable Canva link, so you can update prices yourself. I've designed for a suya spot, a café and a home bakery (samples below). Send me your menu and promo details, and I'll reply within a day.",
  "required": true
}
```

Then create your profile on one platform with your photo, title, description and samples, and decide your payment terms for direct clients (for example 50% upfront).
