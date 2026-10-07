---
title: Social Media Marketing
minutes: 20
summary: Choose the right platforms, understand how Instagram, Facebook, TikTok, LinkedIn and X differ, build community and engagement, work with creators and set up a routine you can keep.
---

## Choosing platforms

Social media is not one thing. Each platform has different people, habits and formats. Do not try to be everywhere. Choose **one or two** where your customers already spend time and where your content fits.

Ask:

1. **Where is my customer?** (age, interests, what they use daily)
2. **What do they do there?** (browse, learn, network, shop)
3. **What can I create consistently** for that platform?
4. **What is my goal?** (awareness, leads, sales, community, hiring)

Platform characteristics change over time, so check current features, but general patterns are:

| Platform | Typical strengths | Good for |
| :-- | :-- | :-- |
| **Instagram** | Visual: photos, Reels, Stories, shops | Fashion, beauty, food, lifestyle, services with strong visuals |
| **Facebook** | Broad audience, groups, local pages, events, ads | Local businesses, communities, older audiences, events |
| **TikTok** | Short entertaining video with high discovery | Reaching new, younger audiences; personality-led brands |
| **LinkedIn** | Professional network | B2B, recruitment, consultants, career content |
| **X (Twitter)** | Real-time conversation, news, customer care | Updates, thought leadership, support |
| **YouTube** | Search and longer video | Teaching, product demos, trust |
| **WhatsApp** | Private, personal messaging | Conversations, orders, support and broadcasts |

## Instagram, Facebook, TikTok, LinkedIn and X

A few practical tips for each:

**Instagram.** Keep your profile clear: a recognisable photo, a bio saying who you help and how, a link, and a contact button. Mix feed posts, **Reels** (short video) for reach and **Stories** for daily updates and polls. Use clear visuals and captions with a hook. Use a few relevant hashtags and the location tag.

**Facebook.** Set up a business page with complete details, hours and a messaging button. Join and add value in relevant local and interest **groups** (follow their rules; do not spam). Use Events, and post reviews and photos. Its ad system is shared with Instagram.

**TikTok.** Short, authentic, entertaining or educational video. Hook in the first two seconds, show the point fast, use trends that fit your brand, and use captions. Do not just copy; add your own angle.

**LinkedIn.** Complete your profile as a clear promise of value. Post useful insights, lessons, case results and opinions; comment thoughtfully on others' posts; and connect with a personal note. Good for B2B leads and credibility.

**X.** Short, timely updates. Useful for announcements, quick customer replies and joining conversations in your industry.

Whatever the platform: **respond to messages and comments quickly**, and follow each platform's rules and local law, including advertising and privacy rules.

## Community and engagement

Social media works best as a **conversation**, not a billboard.

- **Reply to comments and messages** promptly and personally.
- **Ask questions,** use polls and invite opinions.
- **Share customer content** (with permission) and thank people publicly.
- **Show the people** behind the business.
- **Handle criticism well:** respond politely, take it to a private message if needed, solve the problem. A public, calm response impresses other viewers.
- **Build a community** around a shared interest, not only your product: a group, a hashtag or a regular event.

**Engagement rate** shows how well content connects. A simple formula: *(likes + comments + shares + saves) ÷ followers × 100.* If a post with 4,000 followers gets 90 likes, 20 comments and 10 shares, that is 120 interactions, so engagement = 120 ÷ 4,000 = **3%.** Compare posts to learn what your audience likes. Remember that followers are not customers. A small, engaged, relevant audience is worth more than a large, silent one.

## Working with creators

**Creators and influencers** are people with an audience who trust them. Working with them can give you reach and credibility.

How to do it well:

- **Choose by fit and trust, not only follower count.** A micro-creator with 5,000 loyal local followers may beat a celebrity with 500,000 mixed ones.
- **Check their audience and engagement:** real comments, relevant followers, past partnerships.
- **Agree the deal in writing:** what they will create, when, where, payment or product, usage rights, whether it must be labelled as an ad, and how results will be measured.
- **Follow the rules:** content that is paid or gifted should be clearly disclosed as such.
- **Give a clear brief but let them use their own voice.**
- **Use tracking:** a unique code or link to measure results.
- **Start small:** test with one or two creators, then scale.

## Social media routines

A routine keeps you consistent without taking over your day.

**Daily (15 to 30 minutes):** reply to messages and comments, post or schedule a story, check notifications, engage with a few relevant accounts.

**Weekly:** create and schedule next week's content, review what performed best, plan any ads, check messages that need follow-up.

**Monthly:** review results against goals (reach, engagement, enquiries, sales), update the content calendar, try one new idea.

Use free tools to **schedule posts**, and keep a folder of photos, captions and ideas. Batch your work (for example, film a week of videos in one session). Protect your accounts with strong passwords and two-step verification, and limit who has access.

## Try it

```task
{
  "id": "dms-m04-t1",
  "prompt": "Choose the **best main platform** for each business and give a reason: (1) a consultant selling training to companies; (2) a bakery making custom cakes; (3) a local church or community event; (4) a young fashion brand targeting students. One line each.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "1. LinkedIn - ...",
  "rules": [
    { "label": "Four lines", "minLines": 4 },
    { "label": "Consultant: LinkedIn", "pattern": "linkedin" },
    { "label": "Bakery: Instagram or Facebook", "pattern": "instagram|facebook" },
    { "label": "Fashion brand: TikTok or Instagram", "pattern": "tiktok|instagram" },
    { "label": "Gives reasons", "pattern": "because|since|visual|b2b|professional|local|students|community|video|photos", "perLine": true }
  ],
  "sample": "1. LinkedIn - because the buyers are professionals and companies and it is a B2B network.\n2. Instagram - because custom cakes are visual and customers browse photos and message to order.\n3. Facebook - because it has local groups, pages and events that reach the community.\n4. TikTok (with Instagram) - because students watch short, entertaining video and discover new brands there.",
  "required": true
}
```

```task
{
  "id": "dms-m04-t2",
  "prompt": "A post on an account with **4,000 followers** gets **90 likes**, **20 comments** and **10 shares**. Work out the **engagement rate**. A second post gets **150 interactions**; compare them and say what you would learn.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Engagement rate = ...",
  "rules": [
    { "label": "120 interactions", "pattern": "\\b120\\b" },
    { "label": "Engagement rate of 3%", "pattern": "\\b3\\s?%|3 percent" },
    { "label": "Second post engagement of 3.75%", "pattern": "3\\.75" },
    { "label": "Says what to learn (what worked, topic, format, make more)", "pattern": "learn|worked|format|topic|more of|better|why|compare" }
  ],
  "sample": "Interactions = 90 + 20 + 10 = 120, so engagement = 120 / 4,000 = 3%.\nThe second post: 150 / 4,000 = 3.75%.\nThe second post connected better, so I would look at its topic and format to learn why and make more like it.",
  "required": true
}
```

```task
{
  "id": "dms-m04-t3",
  "prompt": "Write your **social media routine** with at least five items, one per line: what you do daily, weekly and monthly, and roughly how long each takes.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Daily (20 minutes) - reply to messages ...",
  "rules": [
    { "label": "At least five lines", "minLines": 5 },
    { "label": "Includes daily tasks", "pattern": "daily|every day" },
    { "label": "Includes weekly tasks", "pattern": "weekly|every week|each week" },
    { "label": "Includes monthly review", "pattern": "monthly|every month|each month" },
    { "label": "Includes replying to messages or comments", "pattern": "repl|respond|messages|comments" },
    { "label": "Gives time estimates", "pattern": "\\d+\\s*(minutes|mins|hours|hrs)", "min": 3 }
  ],
  "sample": "Daily (20 minutes) - reply to every message and comment and post a story\nDaily (10 minutes) - engage with five relevant accounts\nWeekly (1 hour) - schedule next week's posts from the calendar\nWeekly (30 minutes) - review the top posts and follow up leads\nMonthly (1 hour) - review reach, engagement and sales against goals\nMonthly (30 minutes) - update the content calendar and try one new idea",
  "required": false
}
```

Next lesson: paid advertising.
