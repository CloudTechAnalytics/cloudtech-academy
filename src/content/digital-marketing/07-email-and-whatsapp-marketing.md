---
title: Email and WhatsApp Marketing
minutes: 25
summary: Build a permission-based list, run email campaigns and simple automation, use WhatsApp Business and broadcasts properly and write messages that get replies.
---

## Building a list

An **email or contact list** of people who have **agreed** to hear from you is one of your most valuable assets, because **you own it.** Social media algorithms change; your list does not.

Ways to build it honestly:

- **A sign-up form on your website** with a clear promise ("Get our monthly hair-care guide").
- **A lead magnet:** a useful free gift in exchange for contact details, such as a checklist, a discount code, a template, a mini-course or a price guide.
- **At the point of sale or booking,** with permission.
- **On social media and WhatsApp,** with a link in your bio and posts.
- **At events and in the shop,** with a simple sign-up.

**Consent matters, legally and for results.** In Nigeria the Nigeria Data Protection Act (2023) and its regulator, the Nigeria Data Protection Commission, set rules on collecting and using personal data. In outline: tell people what you will use their data for, get clear permission, collect only what you need, keep it safe, and respect requests to stop messages or delete data. **Never buy lists or add people to groups without consent.** A smaller list of willing people beats a large list of annoyed ones. Check the current rules and take advice for your situation.

Always include an easy way to **unsubscribe or stop** messages.

## Email campaigns and automation

**Email marketing** tools (many have free plans) let you design emails, manage lists, send campaigns and see results.

Types of email:

- **Welcome email:** sent immediately after sign-up. Highest open rates; set the tone and deliver the promised gift.
- **Newsletter:** regular helpful content and news.
- **Promotional:** an offer with a deadline.
- **Transactional:** order confirmations, receipts and delivery updates.
- **Re-engagement:** to people who have gone quiet.

**Automation** sends the right email at the right time without you doing it by hand. A simple **welcome series** might be: Day 0, welcome and gift; Day 2, your story and best tip; Day 5, social proof and customer story; Day 8, a gentle offer. Other automations: abandoned cart reminders, birthday offers, post-purchase review requests and "we miss you" messages.

Write good emails:

- **Subject line:** short, specific, interesting; no tricks or false urgency.
- **One clear purpose** and **one main call-to-action** button.
- **Short paragraphs,** scannable, mobile-friendly.
- **Personal tone;** use the reader's name where you can.
- **A recognisable sender name** (a real person or the brand).
- **Test** subject lines and send times.

Measure with these numbers. Example: you send an email to 1,000 addresses; **960 are delivered**, **288 open it** and **48 click.**

| Metric | Formula | Example |
| :-- | :-- | :-- |
| **Delivery rate** | Delivered ÷ sent | 960 ÷ 1,000 = **96%** |
| **Open rate** | Opens ÷ delivered | 288 ÷ 960 = **30%** |
| **Click-through rate** | Clicks ÷ delivered | 48 ÷ 960 = **5%** |
| **Click-to-open rate** | Clicks ÷ opens | 48 ÷ 288 = **16.7%** |

Note that open rates are less exact than they used to be, because some email apps load images automatically, so give more weight to **clicks and replies and sales.**

## WhatsApp Business and broadcasts

WhatsApp is hugely popular in Nigeria and customers reply there quickly. Use it professionally.

**WhatsApp Business** (the free app) offers: a **business profile** (hours, address, website, description), a **catalogue** of products with prices, **labels** to organise chats, **quick replies** for common answers, **greeting and away messages,** and statistics. A larger **business platform and API** exists for bigger companies, with its own rules and fees.

**Broadcasts and status.**

- A **broadcast list** sends one message individually to many contacts, but only to people who **have saved your number and agreed** to receive it.
- **Status updates** let you show offers, new arrivals and behind-the-scenes to your contacts for 24 hours.
- **Groups** suit communities and customers who want to chat, but need clear rules and moderation.

Rules for good behaviour:

- **Get permission** and honour requests to stop.
- **Do not spam,** send too often or send irrelevant messages.
- **Respect WhatsApp's business policies.** Misuse can get a number banned.
- **Reply quickly** during stated hours, and use a friendly human voice.
- **Keep customer data safe** and do not share chats or numbers.

## Messages that get replies

Whether on email or WhatsApp, effective messages are:

- **Relevant:** about something the person cares about, at the right time.
- **Short:** get to the point in the first line.
- **Clear:** one idea and one action.
- **Personal:** use their name, refer to their last purchase or question.
- **Easy to answer:** "Reply YES to book" or a link or button.
- **Valuable:** give something useful, not only ask.
- **Timely:** reminders before an appointment, follow-ups after delivery.

Example WhatsApp broadcast: *"Hi Tola, this is Ada from Luxe Hair. Slots for weekday silk presses are 15% off this week only. Reply YES and I'll hold a time for you. Reply STOP to opt out."*

Always read your message from the customer's side, asking: *Why would I want this? What do I do next?*

## Try it

```task
{
  "id": "dms-m07-t1",
  "prompt": "You send an email to **1,000** addresses. **960** are delivered, **288** open it and **48** click. Work out the **delivery rate**, **open rate**, **click-through rate** and **click-to-open rate**.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Delivery rate = ...",
  "rules": [
    { "label": "Delivery rate of 96%", "pattern": "\\b96\\s?%" },
    { "label": "Open rate of 30%", "pattern": "\\b30\\s?%" },
    { "label": "Click-through rate of 5%", "pattern": "\\b5\\s?%" },
    { "label": "Click-to-open of about 16.7%", "pattern": "16\\.7|16\\.67|17 ?%" }
  ],
  "sample": "Delivery rate = 960 / 1,000 = 96%.\nOpen rate = 288 / 960 = 30%.\nClick-through rate = 48 / 960 = 5%.\nClick-to-open rate = 48 / 288 = 16.7%.",
  "required": true
}
```

```task
{
  "id": "dms-m07-t2",
  "prompt": "Write a **welcome email** for new subscribers: a **subject line** and a **body** of 60 to 120 words that thanks them, delivers the gift you promised, tells them what to expect and has one clear call to action.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Subject: ...\nHi ...",
  "rules": [
    { "label": "Has a subject line", "pattern": "subject" },
    { "label": "Thanks them", "pattern": "thank|welcome" },
    { "label": "Delivers the gift or promise", "pattern": "gift|guide|checklist|code|discount|download|here is|here's|attached|link" },
    { "label": "Says what to expect", "pattern": "expect|each (week|month)|every (week|month)|you will (get|receive)|we will send|you'll (get|receive)" },
    { "label": "Has one call to action", "pattern": "click|book|reply|visit|shop|download|start" },
    { "label": "Between 60 and 125 words", "minWords": 60, "maxWords": 130 }
  ],
  "sample": "Subject: Welcome! Your free hair-care guide is inside\nHi Tola, thank you for joining the Luxe Hair family. As promised, here is your free guide, 10 Ways to Keep Your Braids Fresh, which you can download using the link below. Each month we will send you one practical hair-care tip, news of our open slots and occasional offers, and never more than two emails a month. If you ever want to stop, there is an unsubscribe link at the bottom. To get started, click the button below to download your guide. Warm regards, Ada.",
  "required": true
}
```

```task
{
  "id": "dms-m07-t3",
  "prompt": "Write a **WhatsApp broadcast message** (30 to 70 words) that uses the customer's name, makes one offer with a deadline, is easy to answer and lets them opt out.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Hi ...",
  "rules": [
    { "label": "Uses a name or greeting", "pattern": "hi |hello|dear" },
    { "label": "Makes an offer", "pattern": "off|discount|free|offer|special|slot|%" },
    { "label": "Has a deadline", "pattern": "this week|today|tomorrow|until|by (friday|sunday|monday)|ends|only" },
    { "label": "Easy to answer (reply, click)", "pattern": "reply|click|tap|send" },
    { "label": "Offers an opt-out", "pattern": "stop|opt out|unsubscribe" },
    { "label": "Between 30 and 70 words", "minWords": 30, "maxWords": 75 }
  ],
  "sample": "Hi Tola, this is Ada from Luxe Hair. Weekday silk press slots are 15% off this week only. Reply YES and I will hold a time for you. If you would rather not get these messages, reply STOP and I will remove you straight away. Thank you!",
  "required": false
}
```

Next lesson: funnels, landing pages and conversion.
