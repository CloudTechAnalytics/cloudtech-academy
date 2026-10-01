---
title: Price and Pitch Your Work
minutes: 20
summary: Set fair prices you can explain, write short proposals that win jobs, and agree the scope before you start.
---

## How to price

Three simple ways to set a price:

| Method | How | Good for |
| :-- | :-- | :-- |
| **Per project** | A fixed price for a defined result | Most beginner work: "3 flyers for ₦15,000" |
| **Per hour** | Your hourly rate × hours | Ongoing or unclear work |
| **Packages** | Basic, Standard, Premium | Fiverr gigs and repeat clients |

To find a starting point:

1. Look at what others with similar samples charge on platforms and locally.
2. Estimate your time honestly, including changes and messages.
3. Start slightly lower while you build reviews, then **raise prices** every few jobs.

> [!TIP]
> Packages help clients say yes. For example: **Basic** 1 flyer; **Standard** 3 flyers; **Premium** 3 flyers plus story versions and a 24-hour turnaround. Most people choose the middle option.

## Write a winning proposal

Clients read many proposals. Keep yours short and about **them**:

```text
Hi Bola,

You need 3 flyers for your restaurant's weekend promo that look good on
Instagram. I design for food businesses. Here are two recent samples:
[link] [link]

My plan: one bold design with your menu photos, in square and story
sizes, delivered by Thursday, with two rounds of changes.

Price: ₦15,000. Happy to start today if the details suit you.

Tosin
```

1. **Show you read the brief** in the first line.
2. **Proof:** one or two relevant samples.
3. **Plan:** what you'll deliver and when.
4. **Price and next step.**

## Agree the scope in writing

Before you start, confirm in a message or email:

- What you'll deliver, in what format.
- The deadline.
- How many **rounds of changes** are included.
- The price and payment terms.

This prevents "just one more small change" turning into ten.

## Try it

```answer
{
  "id": "freel-m03-a1",
  "prompt": "A spreadsheet clean-up job will take you about **6 hours**, plus **2 hours** for messages and changes. Your rate is **₦3,000 an hour**. What should you quote as a fixed project price, in naira?",
  "answer": 24000,
  "format": "naira",
  "hint": "(6 + 2) × 3,000",
  "explanation": "₦24,000. Beginners often price only the main work and forget the time spent on messages and changes.",
  "required": true
}
```

```task
{
  "id": "freel-m03-t1",
  "prompt": "Create **three packages** for your offer, one per line, as `Basic`, `Standard` and `Premium`: what each includes, the delivery time, and the price in naira.",
  "minutes": 8,
  "rows": 4,
  "placeholder": "Basic: ... - ₦...\nStandard: ...\nPremium: ...",
  "rules": [
    { "label": "Basic, Standard and Premium packages", "pattern": "^\\s*(basic|standard|premium)\\b", "min": 3 },
    { "label": "A price in naira on each line", "pattern": "^\\s*(basic|standard|premium)\\b[^\\n]*(₦|ngn|naira|n\\d)\\s*\\d", "min": 3 },
    { "label": "Delivery times", "pattern": "\\d+\\s*(days?|hours?)|same day|next day", "min": 2 }
  ],
  "sample": "Basic: 1 Instagram flyer, square size, 1 round of changes, 2 days - ₦6,000\nStandard: 3 flyers in square and story sizes, 2 rounds of changes, 3 days - ₦15,000\nPremium: 3 flyers plus WhatsApp status versions and a 24-hour turnaround, 3 rounds of changes - ₦22,000",
  "note": "Most clients pick the middle option, so make Standard the one you most want to sell.",
  "required": true
}
```

Here's a real-style job post:

```text
Looking for someone to design a price list and 2 promo posts for my
phone accessories shop in Computer Village, Ikeja. Need them by Saturday.
Budget around ₦20k. - Kunle
```

```task
{
  "id": "freel-m03-t2",
  "prompt": "Write a **proposal** to Kunle with the four parts: show you read the brief (first line), proof (a sample link), your plan with what you'll deliver and when, and the price with a next step. Under 120 words.",
  "minutes": 8,
  "rows": 9,
  "placeholder": "Hi Kunle,\n\nYou need ...",
  "rules": [
    { "label": "Greets Kunle by name", "pattern": "^\\s*(hi|hello|good (morning|afternoon)|dear)\\s+kunle" },
    { "label": "Shows you read the brief (price list, promo posts, phone accessories, Saturday…)", "pattern": "price list|promo|accessor|computer village|saturday", "min": 2 },
    { "label": "Includes a sample link", "pattern": "https?://|\\[link\\]|portfolio|sample" },
    { "label": "Gives a price", "pattern": "₦\\s*\\d|\\d+\\s*k\\b|naira|ngn" },
    { "label": "Ends with a next step (start, reply, send me, call…)", "pattern": "start|reply|send me|call|let me know|ready to|can begin|confirm" },
    { "label": "Short: under 120 words, and not about you first (\"I am a passionate…\")", "pattern": "passionate|hardworking|dear sir/madam", "absent": true },
    { "label": "Under 120 words", "minWords": 35, "maxWords": 120 }
  ],
  "sample": "Hi Kunle,\n\nYou need a clear price list and two promo posts for your accessories shop in Computer Village, ready by Saturday. I design for small shops; here are two recent samples: https://www.canva.com/design/DAGxxxxxxxx/view\n\nPlan: one price list (A4 to print, plus a WhatsApp version) and two square promo posts with your product photos, delivered Friday evening, with two rounds of changes.\n\nPrice: ₦18,000. If that suits you, send me your price list and photos and I'll start today.\n\nTosin",
  "required": true
}
```

Then write your **scope message** template: what you'll deliver and in what format, the deadline, the rounds of changes, and the price and payment terms.
