---
title: Content Marketing
minutes: 30
summary: Create content that serves the customer, choose formats, write for the web, plan with a content calendar and repurpose content to get more from each piece.
---

## Content that serves the customer

**Content marketing** means creating and sharing useful, relevant material, such as posts, videos, guides and answers, to attract and keep the right customers. Instead of shouting "buy now," you **help first**, and build trust, so that when people need what you sell, they think of you.

Useful content does at least one of these:

- **Teaches** (how to do something, how to choose, how to avoid a mistake).
- **Solves a problem** (a checklist, a template, a calculator).
- **Inspires** (a story, a result, a transformation).
- **Entertains** in a way that fits your brand.
- **Proves** (a case study, a customer story, behind the scenes).

Start from **customer questions.** What do they ask you every week? What do they search for? What worries them before buying? Every common question is a piece of content. For a salon: *"How often should I wash braids?"* and *"What does a silk press cost?"* For a business tutor: *"How do I write a CV with no experience?"*

Balance your content. A common mix: **mostly helpful and engaging content, some proof, and a smaller share of direct offers.**

Create content pillars: three to five **themes** you will return to, such as *tips, customer stories, behind the scenes, offers and answers to questions.* Pillars keep you consistent and make planning easy.

## Formats: posts, video, blogs

| Format | Best for | Notes |
| :-- | :-- | :-- |
| **Short posts and carousels** | Quick tips, lists, step-by-step ideas | Easy to make and share |
| **Short video (Reels, TikTok, Shorts)** | Reach and personality | A phone is enough; hook in the first 3 seconds |
| **Longer video (YouTube)** | Teaching and trust | Good for search; more effort |
| **Blog articles and guides** | Search traffic, depth, trust | Slow start; long life |
| **Stories and status updates** | Daily presence and behind the scenes | Short-lived; frequent |
| **Email newsletters** | Staying in touch with subscribers | Own your list |
| **Podcasts and live sessions** | Authority and community | More time and consistency |
| **Customer reviews and case studies** | Proof | Ask permission to share |

Choose formats you can **keep up**, and that your customers actually use. One format done well and regularly beats five done once.

## Writing for the web

Most people **scan** online. Make your writing easy to read.

- **Lead with the point.** Put the main message and benefit first.
- **Use a clear headline** that tells the reader what they will get. *"5 Ways to Save on Generator Fuel"* beats *"Fuel Tips."*
- **Short sentences and short paragraphs** (one to three lines on a phone).
- **Plain words.** Write as you would speak to a customer.
- **Use subheadings, bullets and numbers** to organise.
- **Be specific.** Give numbers, examples and names.
- **Speak to "you."**
- **End with one clear call to action:** what should they do next?
- **Edit.** Cut every word that does not help. Check spelling, facts and links.

For video, **hook** the viewer in the first seconds, show the point quickly, use captions (many watch without sound) and end with a clear next step.

## A content calendar

A **content calendar** plans what you will publish, where and when, so you are consistent and not scrambling daily.

A simple monthly calendar has columns for: **date, channel, format, pillar, topic or headline, call to action, who is responsible and status.**

Example for four weeks, three posts a week (12 pieces):

| Week | Mon | Wed | Fri |
| :-- | :-- | :-- | :-- |
| 1 | Tip (pillar: tips) | Customer story | Offer |
| 2 | Behind the scenes | Tip | Answer to a question |
| 3 | Tip | Customer story | Offer |
| 4 | Answer to a question | Behind the scenes | Offer |

Tips:

- **Plan a month ahead,** and batch-create (make several pieces in one session).
- **Mark key dates** such as holidays, festive seasons, school terms and your own promotions.
- **Leave room** for timely or trending posts.
- **Track which pieces perform,** and make more of them.
- **Be realistic.** A calendar you cannot keep is worse than a smaller one you can.

## Repurposing content

Do not start from zero every time. **Repurpose** one idea into several forms:

*One blog article → a carousel of its key tips → three short videos, each on one tip → a newsletter summary → a WhatsApp status with a link → a Q&A answering comments.*

A single 10-minute video can become five clips, a quote graphic, a blog post and an audio clip. Adapt each to the platform (size, length and style), instead of posting the identical file everywhere.

Also **refresh** old content that still performs: update facts, add examples and re-share. And **collect user-generated content** (customer photos, reviews, comments) with permission, which is free proof.

## Try it

```task
{
  "id": "dms-m03-t1",
  "prompt": "Choose **three content pillars** for your business, and for each give **two post ideas** that answer real customer questions. One pillar per line in the form \"Pillar: idea 1; idea 2\".",
  "minutes": 12,
  "rows": 6,
  "placeholder": "Tips: how often to ...; how to choose ...",
  "rules": [
    { "label": "Three lines", "minLines": 3 },
    { "label": "Every line has two ideas separated by a semicolon", "pattern": ":[^;\\n]+;[^;\\n]+", "perLine": true },
    { "label": "Mentions customers' questions or how/what/why", "pattern": "how|what|why|which|when" }
  ],
  "sample": "Tips: how often to wash braids; how to protect your hair at night\nCustomer stories: Tola's before-and-after silk press; how a bride's hair lasted all wedding day\nBehind the scenes: how we sanitise our tools; meet the stylists",
  "required": true
}
```

```task
{
  "id": "dms-m03-t2",
  "prompt": "Build a **two-week content calendar** with at least **six entries**, one per line, each with the day, channel, format, pillar, topic and call to action.",
  "minutes": 15,
  "rows": 9,
  "placeholder": "Mon - Instagram - carousel - tips - ... - CTA: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Includes days", "pattern": "mon|tue|wed|thu|fri|sat|sun|week", "min": 4 },
    { "label": "Includes channels", "pattern": "instagram|facebook|tiktok|whatsapp|youtube|email|linkedin|blog", "min": 4 },
    { "label": "Includes formats", "pattern": "carousel|reel|video|post|story|article|blog|newsletter|status", "min": 4 },
    { "label": "Includes calls to action", "pattern": "cta|call to action|book|order|message|visit|reply|dm|sign up", "min": 4 }
  ],
  "sample": "Mon - Instagram - carousel - tips - 5 ways to protect braids - CTA: book a slot\nWed - Instagram - reel - customer story - Tola's silk press transformation - CTA: DM to book\nFri - WhatsApp status - photo - offer - 10% off weekday bookings - CTA: reply to book\nMon - Facebook - post - behind the scenes - how we sanitise our tools - CTA: visit our page\nWed - Instagram - story - answer to a question - how often to wash braids - CTA: send your question\nFri - Email - newsletter - tips and offer - monthly hair care guide - CTA: book online",
  "required": true
}
```

```task
{
  "id": "dms-m03-t3",
  "prompt": "Show how to **repurpose one blog article** into at least **five other pieces** of content for different channels. One piece per line, with the channel and format.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Instagram carousel of the five tips",
  "rules": [
    { "label": "At least five lines", "minLines": 5 },
    { "label": "Includes different channels or formats", "pattern": "carousel|video|reel|story|status|newsletter|email|quote|clip|thread|post", "min": 4 },
    { "label": "Mentions a channel", "pattern": "instagram|facebook|tiktok|whatsapp|youtube|email|linkedin" }
  ],
  "sample": "Instagram carousel with the five key tips\nThree short Reels, each explaining one tip\nA WhatsApp status with the headline and a link to the article\nA newsletter summary with a link to the full guide\nA quote graphic for Facebook with the most useful tip\nA live Q&A answering questions from the comments",
  "required": false
}
```

Next lesson: social media marketing.
