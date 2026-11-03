---
title: Pipeline, CRM and Sales Operations
minutes: 20
summary: Define pipeline stages, use a CRM or a simple spreadsheet, forecast sales from the pipeline and build daily and weekly routines that keep selling consistent.
---

## Pipeline stages

A **sales pipeline** is a visual list of all your opportunities and where each is in the sales process. It tells you what to do next, what is stuck and how much you are likely to sell.

Choose **clear stages**, each with a **definition** of when a deal enters it. Example:

| Stage | Meaning | Typical chance of winning |
| :-- | :-- | :-- |
| **Lead** | Someone who might be interested | 5% |
| **Qualified** | Has budget, authority, need and timing | 20% |
| **Meeting / discovery done** | We understand their situation | 30% |
| **Proposal sent** | A written offer is with them | 50% |
| **Negotiation** | Discussing terms | 75% |
| **Won** | Order or contract signed | 100% |
| **Lost** | Decided against, or went silent | 0% |

The percentages are estimates. Start with sensible guesses and **replace them with your real conversion rates** as you gather data.

Good pipeline habits:

- **Every deal has a next step and a date.** A deal with no next step is probably dead.
- **Move deals forward or out.** Do not leave stale deals clogging the pipeline.
- **Record why you won or lost.** That teaches you more than any training.
- **Keep it honest.** An inflated pipeline leads to bad decisions.

## Using a CRM or a spreadsheet

A **CRM (customer relationship management)** tool stores contacts, conversations, deals and tasks in one place, so you do not rely on memory or scattered notes. It helps you not to forget a follow-up, shows the whole history of a customer, and lets managers see the pipeline.

You do not need an expensive CRM to start. Many small businesses use a **spreadsheet** with one row per opportunity. Useful columns:

1. Company or customer name
2. Contact person and role
3. Phone and email
4. Source of the lead
5. Product or service
6. Deal value (₦)
7. Stage
8. Probability %
9. Expected close date
10. Next step
11. Next step date
12. Notes and last contact date
13. Owner (who is responsible)

Free or low-cost CRMs, and tools like WhatsApp Business labels, also work. The best system is **the one you will actually use every day.** Whatever you choose:

- **Enter data the same day.**
- **Use consistent names and stages.**
- **Protect customer data:** control access, back it up and follow privacy rules.
- **Review it weekly.**

## Forecasting

A **forecast** estimates the sales you expect in a period. A simple **weighted pipeline** forecast multiplies each deal's value by its probability and adds them up.

Example:

| Deal | Value | Probability | Weighted value |
| :-- | :-- | :-- | :-- |
| A | ₦2,000,000 | 80% | ₦1,600,000 |
| B | ₦5,000,000 | 40% | ₦2,000,000 |
| C | ₦1,000,000 | 20% | ₦200,000 |
| **Total** | ₦8,000,000 | | **₦3,800,000** |

The weighted forecast is **₦3,800,000**, not ₦8,000,000. It is an average over many deals: a single deal will be won or lost entirely, so the forecast is more reliable with many deals.

To improve the forecast:

- **Use real conversion rates** by stage from your own history.
- **Include only deals with a next step and a realistic date.**
- **Compare the forecast to what actually happened** each month and learn.
- **Look at the coverage:** a common rule is to keep a pipeline of about three to four times your target, because only a fraction of deals will close.

## Daily and weekly routines

Selling is a habit. Routines keep the pipeline moving.

**Daily:**

- Review today's meetings, calls and follow-ups.
- Spend protected time on **prospecting** (for example 60 to 90 minutes).
- Update the CRM after each conversation.
- Send follow-up messages.
- Plan tomorrow's top three tasks.

**Weekly:**

- Review the whole pipeline: move, advance or close deals.
- Check numbers: new leads, meetings, proposals, wins.
- Plan next week's prospecting and meetings.
- Reflect on what worked and what to change.

**Monthly:** compare results with targets, review conversion rates, update the forecast and set priorities.

Protect time for selling. Administration and reports are important, but they should not push out the conversations that earn the money.

## Try it

```task
{
  "id": "bds-m07-t1",
  "prompt": "Work out the **weighted forecast**. Deal A ₦2,000,000 at 80%, Deal B ₦5,000,000 at 40%, Deal C ₦1,000,000 at 20%. Give each weighted value and the total, and say why the weighted total is lower than the sum of deal values.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "A = ...",
  "rules": [
    { "label": "A of ₦1,600,000", "pattern": "1,?600,?000" },
    { "label": "B of ₦2,000,000", "pattern": "2,?000,?000" },
    { "label": "C of ₦200,000", "pattern": "200,?000" },
    { "label": "Total of ₦3,800,000", "pattern": "3,?800,?000" },
    { "label": "Explains that not all deals will be won", "pattern": "not all|some (deals )?(will|won't)|probab|chance|lose|lost|won or lost|unlikely" }
  ],
  "sample": "A = 2,000,000 x 0.8 = ₦1,600,000.\nB = 5,000,000 x 0.4 = ₦2,000,000.\nC = 1,000,000 x 0.2 = ₦200,000.\nWeighted total = ₦3,800,000, compared with ₦8,000,000 of deal value.\nIt is lower because not all deals will be won; each has only a probability of closing.",
  "required": true
}
```

```task
{
  "id": "bds-m07-t2",
  "prompt": "Design a **spreadsheet CRM** for your sales. List at least **ten column headings**, one per line, and mark the three that matter most for knowing what to do next.",
  "minutes": 10,
  "rows": 12,
  "placeholder": "Company name\nContact person",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Includes the company and contact", "pattern": "company|customer|contact" },
    { "label": "Includes deal value", "pattern": "value|amount|₦" },
    { "label": "Includes stage", "pattern": "stage" },
    { "label": "Includes next step and date", "pattern": "next step[\\s\\S]*date|date[\\s\\S]*next step|next step" },
    { "label": "Marks the most important columns", "pattern": "most important|key|priority|matter most|\\*" }
  ],
  "sample": "Company name\nContact person and role\nPhone and email\nLead source\nProduct or service\nDeal value (₦)\nStage *\nProbability %\nExpected close date\nNext step *\nNext step date *\nLast contact and notes\nOwner\nThe three that matter most are marked * (stage, next step, next step date): they show what to do next.",
  "required": true
}
```

```task
{
  "id": "bds-m07-t3",
  "prompt": "Write your **weekly sales routine** with at least six items, one per line, each with a day or time and the activity: prospecting, follow-ups, pipeline review, CRM update and planning.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Monday 9 am - ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Includes prospecting", "pattern": "prospect|outreach|new leads|calls" },
    { "label": "Includes follow-ups", "pattern": "follow-?up" },
    { "label": "Includes a pipeline review", "pattern": "pipeline|review" },
    { "label": "Includes CRM or record updating", "pattern": "crm|update|record|spreadsheet" },
    { "label": "Includes planning", "pattern": "plan" },
    { "label": "Gives days or times", "pattern": "monday|tuesday|wednesday|thursday|friday|daily|\\d+\\s?(am|pm)", "min": 4 }
  ],
  "sample": "Monday 9 am - review the pipeline and set the week's targets\nDaily 9 to 10:30 am - prospecting calls and messages\nDaily 4 pm - update the CRM after meetings\nTuesday and Thursday - customer meetings and follow-ups\nWednesday - send proposals and quotes\nFriday 3 pm - review results against targets and plan next week\nFriday 4 pm - move or close stale deals",
  "required": false
}
```

Next lesson: partnerships and key accounts.
