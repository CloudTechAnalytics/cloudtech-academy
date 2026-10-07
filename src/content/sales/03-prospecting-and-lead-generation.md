---
title: Prospecting and Lead Generation
minutes: 25
summary: Find leads from the right sources, reach out by call, message and email, use referrals, networking and social selling, and qualify leads so your time goes where it counts.
---

## Where leads come from

A steady flow of good leads is the lifeblood of selling. Sources:

| Source | Examples | Quality |
| :-- | :-- | :-- |
| **Referrals** | Happy customers, partners, friends | Highest: trust is built in |
| **Inbound** | Website, social media, search, adverts, walk-ins, events | Good: they came to you |
| **Outbound** | Cold calls, messages, emails, visits | Variable: you start the conversation |
| **Networking** | Business associations, trade fairs, chambers of commerce, community groups | Good: relationships build over time |
| **Partners** | Banks, suppliers, other businesses that serve your customers | Good: borrowed trust |
| **Existing customers** | Repeat and new needs | Highest |

Do not rely on only one source. A good mix keeps your **pipeline** (the leads moving toward a sale) full even when one source slows.

## Cold outreach by call, message and email

**Cold outreach** means contacting someone who does not yet know you. It works when you are **relevant, brief and respectful.**

Principles:

- **Research first.** Spend two minutes learning about the person and their business.
- **Lead with them, not you.** Open with something that shows you understand their situation.
- **Be brief and specific.** One idea, one question, one next step.
- **Make it easy to answer:** a simple yes/no or a time slot.
- **Follow up** politely two or three times, a few days apart. Many sales come after the third or fourth contact.
- **Respect "no"** and do not spam. Follow privacy rules and honour opt-out requests.

A structure for a first message (WhatsApp, LinkedIn or email):

1. **Personal opening:** why you are contacting them.
2. **A short value statement:** the problem you help with and a result.
3. **Proof:** one similar customer or result, if you have it.
4. **A small ask:** a quick call or a visit, with a suggested time.

Example: *"Good morning Mr Ade. I noticed your pharmacy in Ikeja stays open late. We help shops like yours cut generator fuel costs by up to half with solar backup, and we recently did the same for a pharmacy in Yaba. Could I visit for 15 minutes on Thursday to see if it could work for you?"*

**Phone calls** work best with a short script, a warm tone, a clear reason for calling and a request for a small next step. **Visits** can be powerful in local markets: bring a card, a short leaflet and something useful.

## Referrals and networking

**Referrals** are the best leads, and they come from asking.

- **Ask at the right time:** after a good result or compliment.
- **Be specific:** "Do you know another shop owner who runs a generator all day?"
- **Make it easy:** offer to write the introduction or send a message they can forward.
- **Thank them** and tell them what happened.
- **Reward** where appropriate, openly and within the rules.

**Networking** is building relationships before you need them. Join associations and events, be helpful (introduce people, share useful information), listen more than you talk, follow up after meeting someone and keep in touch. Networking pays slowly but steadily.

## Social selling on LinkedIn and WhatsApp

**Social selling** means using social platforms to build credibility and relationships.

- **LinkedIn:** keep a clear profile (who you help and how), share useful posts, comment thoughtfully, connect with a short personal note and message people when you can help, not as a spam blast.
- **WhatsApp:** good for customers who prefer it. Use a business profile with a catalogue, quick replies and labels. **Always have permission** before messaging or adding people to groups. Keep messages short and useful, and use status posts to show your work and results.
- **Instagram, Facebook and TikTok:** show the product in use, customer stories and behind the scenes.

Be a **helpful expert**, not a constant advertiser. A mix of useful content and occasional offers works better than endless promotion.

## Qualifying leads

Time is limited. **Qualifying** checks whether a lead is worth pursuing. A classic checklist is **BANT:**

- **Budget:** can they afford it, or can they find the money?
- **Authority:** are they, or are you speaking to, the decision maker?
- **Need:** do they have a real, important problem you solve?
- **Timeline:** will they act soon, or only "someday"?

Ask naturally during conversation, for example: *"What are you spending on fuel at the moment?"* (need and budget), *"Who else would be involved in a decision like this?"* (authority), *"When would you like it working?"* (timeline). Mark leads as **hot, warm or cold** and give most effort to hot and warm.

**Funnel maths.** Know how many contacts you need. Suppose from 200 contacts, 20 reply (10%), 8 agree to a meeting (40% of replies) and 2 become customers (25% of meetings). Overall, 2 ÷ 200 = **1%.** To win 10 customers you need about 10 ÷ 0.01 = **1,000 contacts.** If you improve any stage, you need fewer.

## Try it

```task
{
  "id": "bds-m03-t1",
  "prompt": "Write a **first outreach message** (50 to 100 words) to a prospect in your ideal customer profile: a personal opening, the problem you solve, a bit of proof and a small ask with a suggested time.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Good morning ...",
  "rules": [
    { "label": "Greets and is personal (uses a name or a specific observation)", "pattern": "good (morning|afternoon)|hello|hi |dear|noticed|saw|i know" },
    { "label": "States the problem or result", "pattern": "help|cut|save|reduce|improve|solve|problem" },
    { "label": "Gives proof (a similar customer or result)", "pattern": "recently|similar|customer|clients?|for a|helped|result" },
    { "label": "Makes a small ask with a time", "pattern": "could|can i|would you|\\d+ minutes|call|visit|meet|thursday|friday|monday|tuesday|wednesday|tomorrow|next week" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "Good morning Mr Ade. I noticed your pharmacy in Ikeja stays open late, which means the generator must run long hours. We help shops like yours cut generator fuel costs by up to half with solar backup, and we recently did the same for a pharmacy in Yaba, saving them about ₦90,000 a month. Could I visit for 15 minutes on Thursday at 11 am to see whether it could work for you? If it is not a fit, I will tell you honestly.",
  "required": true
}
```

```task
{
  "id": "bds-m03-t2",
  "prompt": "From **200 contacts**, **20 reply**, **8 agree to a meeting** and **2 become customers**. Work out the conversion at each stage and overall, and the number of contacts needed to win **10 customers**.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Reply rate = ...",
  "rules": [
    { "label": "Reply rate of 10%", "pattern": "\\b10\\s?%" },
    { "label": "Meeting rate of 40%", "pattern": "\\b40\\s?%" },
    { "label": "Close rate of 25%", "pattern": "\\b25\\s?%" },
    { "label": "Overall of 1%", "pattern": "\\b1\\s?%" },
    { "label": "1,000 contacts needed", "pattern": "1,?000" }
  ],
  "sample": "Reply rate = 20 / 200 = 10%.\nMeeting rate = 8 / 20 = 40%.\nClose rate = 2 / 8 = 25%.\nOverall = 2 / 200 = 1%.\nTo win 10 customers I need 10 / 0.01 = 1,000 contacts.",
  "required": true
}
```

```task
{
  "id": "bds-m03-t3",
  "prompt": "Write **four qualifying questions** (one each for budget, authority, need and timeline) that you can ask naturally in a conversation. One per line, each ending with a question mark.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "What are you spending on ... at the moment?",
  "rules": [
    { "label": "Four questions", "minLines": 4 },
    { "label": "Every line is a question", "pattern": "\\?\\s*$", "perLine": true },
    { "label": "A budget question", "pattern": "spend|budget|invest|afford|cost|pay" },
    { "label": "An authority question", "pattern": "decid|involved|who else|approve|sign" },
    { "label": "A need question", "pattern": "problem|challenge|hardest|issue|need|happens (to|when)" },
    { "label": "A timeline question", "pattern": "when|how soon|by (what|which) date|timeline|deadline" }
  ],
  "sample": "What are you spending on generator fuel and repairs in a typical month?\nWho else would be involved in a decision like this?\nWhat happens to your shop when the power goes out during the day?\nWhen would you like to have a better solution working?",
  "required": false
}
```

Next lesson: the sales conversation.
