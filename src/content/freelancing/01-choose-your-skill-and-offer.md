---
title: Choose Your Skill and Offer
minutes: 40
summary: Pick one skill you can sell now, turn it into a clear offer with a fixed scope, and build a few samples to show clients.
---

## What freelancing is

**Freelancing** means doing paid work for clients as your own boss, project by project, rather than as an employee. Many students freelance alongside their studies to earn, build experience and grow a portfolio.

It isn't a get-rich-quick scheme. Most freelancers start small, with a few low-paid jobs, and grow as their reviews and skills grow.

## Pick one skill you can sell now

Start with something you can already do to a good standard, or can learn in a few weeks:

| Skill | Example services |
| :-- | :-- |
| **Design** (Canva, Figma) | Flyers, social media graphics, logos, presentation decks |
| **Video** (CapCut) | Short-form edits for Reels and TikTok, YouTube cuts |
| **Writing** | Blog posts, product descriptions, CV writing, proofreading |
| **Data** (Excel, Power BI) | Cleaning spreadsheets, dashboards, data entry |
| **Web** | Simple websites, landing pages |
| **Admin** | Virtual assistance, research, transcription |

Pick **one** to start. "I design Instagram flyers for small businesses" is easier to sell than "I do design, writing, video and websites".

## Turn it into a clear offer

A good offer answers four questions:

1. **What exactly do they get?** "3 Instagram flyers in square and story sizes."
2. **For whom?** "Restaurants and small food businesses."
3. **How fast?** "Delivered in 3 days."
4. **What's included?** "2 rounds of changes, editable Canva link."

Write it in one sentence: *"I design three Instagram flyers for small food businesses, delivered in 3 days with two rounds of changes."*

## Build samples before your first client

Clients want to see work. If you don't have clients yet:

- Make **3–5 sample pieces** for imaginary or real local businesses (don't use their real logos without permission; say they're concept pieces).
- **Redesign** something you see: a poor flyer, a messy spreadsheet.
- Do **one or two jobs** for someone you know, in exchange for a testimonial.

> [!TIP]
> Put your samples on a simple portfolio page (see the Build Your Student Portfolio course). One link does the selling for you.

## Try it

```task
{
  "id": "freel-m01-t1",
  "prompt": "Write your **offer in one sentence**, answering all four questions: what exactly they get (with a number), for whom, how fast, and what's included (like rounds of changes or file formats).",
  "minutes": 6,
  "rows": 3,
  "placeholder": "I design ... for ..., delivered in ... with ...",
  "rules": [
    { "label": "Says exactly what they get, with a number (3 flyers, 5 posts, 1 dashboard…)", "pattern": "\\b(\\d+|one|two|three|four|five|six|ten)\\s+[a-z-]+" },
    { "label": "Says who it's for (for small businesses, restaurants, students…)", "pattern": "\\bfor\\s+(small|local|food|restaurants?|salons?|shops?|students?|businesses|startups?|churches|schools|brands?|ngos?|clinics?|[a-z]+\\s+(businesses|owners|brands))" },
    { "label": "Says how fast (days, hours, within…)", "pattern": "\\d+\\s*(days?|hours?|working days)|within|same day|next day|48|24" },
    { "label": "Says what's included (changes, revisions, editable file, formats…)", "pattern": "change|revision|edit|source file|canva link|png|pdf|xlsx|format" },
    { "label": "One sentence (under 45 words)", "minWords": 12, "maxWords": 45 }
  ],
  "sample": "I design three Instagram flyers for small food businesses, in square and story sizes, delivered in 3 days with two rounds of changes and an editable Canva link.",
  "required": true
}
```

```task
{
  "id": "freel-m01-t2",
  "prompt": "Create **three sample pieces** for your offer (concept pieces for imaginary or real businesses, clearly labelled as concepts), and put them in one place with a shareable link. Paste the link and list the three samples, one per line.",
  "minutes": 30,
  "rows": 5,
  "placeholder": "https://...\n1. ...\n2. ...\n3. ...",
  "rules": [
    { "label": "A shareable link", "pattern": "https?://\\S+\\.\\S+" },
    { "label": "Three samples listed", "minLines": 4 },
    { "label": "Says they're concept or sample pieces", "pattern": "concept|sample|mock|practice|example|imaginary" }
  ],
  "sample": "https://www.canva.com/design/DAGxxxxxxxx/view\n1. Weekend promo flyer for an imaginary suya spot (concept)\n2. Menu post for a café, square and story sizes (concept)\n3. Grand opening flyer redesign for a real bakery's old flyer (concept, not used by them)",
  "required": true
}
```
