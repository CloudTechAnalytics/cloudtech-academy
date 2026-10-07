---
title: Proposals and Closing
minutes: 35
summary: Write a proposal that gets read, prepare quotations and terms, use closing techniques that respect the customer, follow up effectively and look after customers after the sale.
---

## Writing a proposal that gets read

A **proposal** puts your offer in writing so the customer can review it, share it and decide. Many proposals fail because they are long, generic and about the seller. A good one is **short, specific and about the customer.**

A strong structure:

1. **Summary:** the problem, your solution and the key result, in a few lines.
2. **Their situation:** their needs and goals in their own words, from discovery.
3. **Your solution:** what you will do or supply, in plain language, and how it meets each need.
4. **Benefits and proof:** expected results, with numbers, and a similar customer or reference.
5. **Price and what is included:** a clear table, with options if useful.
6. **Timeline:** key dates for delivery or installation.
7. **Terms:** payment, warranty, validity of the offer.
8. **Next steps:** exactly what happens if they say yes, and how to accept.

Tips:

- **Use their name and language.** Do not send a template with someone else's details left in.
- **Lead with the outcome,** not the technical details.
- **Keep it to a few pages;** put long specifications in an appendix.
- **Offer two or three options** (basic, standard, premium) so the question becomes "which one?" instead of "yes or no?"
- **Proofread carefully.** Errors hurt trust.
- **Send it soon after the meeting,** while interest is high, and **walk through it with them** by call or in person.

## Quotations and terms

A **quotation** states exactly what you will supply and for how much. Make it clear, complete and accurate.

Example for Sunbright Solar:

| Item | Amount |
| :-- | :-- |
| 3 inverter systems at ₦900,000 | ₦2,700,000 |
| Installation | ₦150,000 |
| **Subtotal** | **₦2,850,000** |
| VAT at 7.5% | ₦213,750 |
| **Total** | **₦3,063,750** |

Check: 3 × 900,000 = 2,700,000; plus 150,000 = 2,850,000; VAT 7.5% of 2,850,000 = 213,750; total 3,063,750.

State the **terms**:

- **Validity:** how long the price holds (for example 14 days).
- **Payment:** deposit, balance and due dates (for example 50% deposit and 50% on completion).
- **Delivery or installation date.**
- **Warranty and after-sales support.**
- **What is not included,** so there are no surprises.
- **Cancellation and change rules.**

Be accurate: a wrong quote is expensive to correct. Where VAT applies, show it clearly, and make sure your business follows the tax rules.

## Closing techniques that respect the customer

**Closing** means asking for a decision. Many sales are lost because the salesperson never asked. Closing is not a trick; it is the natural last step of a helpful conversation.

Respectful ways to close:

- **The direct ask:** "Would you like to go ahead?"
- **The summary close:** recap the agreed benefits and ask: "So we've agreed it solves the fuel cost and reliability, at ₦900,000 with a 2-year warranty. Shall we start?"
- **The option close:** "Would you prefer the standard package or the premium?"
- **The next-step close:** "Shall I book the installation for the 14th?"
- **The deadline close (only if genuine):** "The current price holds until Friday because of a supplier increase."
- **The trial or small-start close:** "Let's begin with one system and review it after a month."

Avoid pressure tricks, fake scarcity or manipulation. If the customer hesitates, return to the concern: *"What is holding you back?"* Then address it honestly. If the answer is no, accept it graciously.

After "yes," **confirm everything in writing,** get the deposit or signed order and tell them what happens next.

## Follow-up that works

Most deals need several follow-ups, and many salespeople give up too early. Make follow-up **useful**, not annoying.

- **Send a summary within 24 hours** of every meeting.
- **Agree the next step and date** before you leave.
- **Each follow-up should add value:** an answer, a case study, a useful tip, a relevant update, not just "checking in."
- **Use a pattern:** for example, a call or message after 2 days, again after a week, again after two weeks.
- **Use the customer's preferred channel.**
- **Know when to stop:** after several attempts, send a polite closing message: *"I'll assume the timing isn't right. If things change, I'm here."* Many replies come after this.

Example follow-up email: *"Dear Mrs Bello, thank you for meeting me on Tuesday. As discussed, I've attached the quote for two systems at ₦1,800,000 including installation. Your fuel cost of ₦120,000 a month means the system pays for itself in about 15 months. Shall we speak on Friday at 10 am to answer any questions?"*

## After the sale

The sale is the start of the relationship.

- **Deliver as promised,** on time, and communicate if anything changes.
- **Check satisfaction** after delivery and a few weeks later.
- **Fix problems quickly and fairly.**
- **Ask for a review or testimonial and a referral** once they are happy.
- **Keep in touch** with useful updates and reminders.
- **Look for the next need:** an extension, an upgrade, maintenance, a related product.

Happy customers buy again and bring others. It costs far less to keep and grow a customer than to win a new one.

## Try it

```task
{
  "id": "bds-m06-t1",
  "prompt": "Prepare a quotation. **3 systems at ₦900,000**, **installation ₦150,000** and **VAT at 7.5%** on the subtotal. Work out the goods total, the subtotal, the VAT and the grand total.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Goods = ...",
  "rules": [
    { "label": "Goods of ₦2,700,000", "pattern": "2,?700,?000" },
    { "label": "Subtotal of ₦2,850,000", "pattern": "2,?850,?000" },
    { "label": "VAT of ₦213,750", "pattern": "213,?750" },
    { "label": "Total of ₦3,063,750", "pattern": "3,?063,?750" }
  ],
  "sample": "Goods = 3 x 900,000 = ₦2,700,000.\nSubtotal = 2,700,000 + 150,000 = ₦2,850,000.\nVAT = 7.5% of 2,850,000 = ₦213,750.\nGrand total = 2,850,000 + 213,750 = ₦3,063,750.",
  "required": true
}
```

```task
{
  "id": "bds-m06-t2",
  "prompt": "Write the **outline of a proposal** for a customer of your choice with at least eight section headings, one per line, each followed by a few words on what it contains.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "1. Summary - ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Includes a summary", "pattern": "summary" },
    { "label": "Includes the customer's situation or needs", "pattern": "situation|needs|requirements" },
    { "label": "Includes the solution", "pattern": "solution|offer|what we" },
    { "label": "Includes price and options", "pattern": "price|pricing|options|investment" },
    { "label": "Includes timeline", "pattern": "timeline|schedule|dates" },
    { "label": "Includes terms", "pattern": "terms|payment|warranty" },
    { "label": "Includes next steps", "pattern": "next steps?" }
  ],
  "sample": "1. Summary - the problem, our solution and the main result in a few lines\n2. Your situation - your needs and goals in your own words\n3. Our solution - what we will supply and how it meets each need\n4. Benefits and proof - expected savings with numbers and a similar customer\n5. Price and options - a table with basic, standard and premium packages\n6. Timeline - key dates for delivery and installation\n7. Terms - payment, warranty and how long the offer is valid\n8. Next steps - what happens when you say yes and how to accept",
  "required": true
}
```

```task
{
  "id": "bds-m06-t3",
  "prompt": "Write a **follow-up email** (60 to 120 words) after a meeting, which thanks the customer, summarises what was agreed, adds a piece of value (a number or a useful point) and asks for a specific next step with a date.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Dear ...,",
  "rules": [
    { "label": "Greets and thanks", "pattern": "dear|hello|hi |thank" },
    { "label": "Summarises what was discussed or agreed", "pattern": "discuss|agreed|as we|you mentioned|summary|as promised|attached" },
    { "label": "Adds value (number, saving, case study, tip)", "pattern": "₦\\s?\\d|\\d+\\s?(%|months|hours)|saving|case study|customer" },
    { "label": "Asks for a specific next step with a time", "pattern": "friday|monday|tuesday|wednesday|thursday|tomorrow|next week|\\d+\\s?(am|pm)|call|meet" },
    { "label": "Between 60 and 120 words", "minWords": 60, "maxWords": 125 }
  ],
  "sample": "Dear Mrs Bello, thank you for meeting me on Tuesday. As we discussed, I have attached the quote for two systems at ₦1,800,000 including installation, with a two-year warranty. At your fuel cost of ₦120,000 a month, the system should pay for itself in about 15 months. I have also attached the case study of a pharmacy in Yaba that has used the same setup for a year. Could we speak on Friday at 10 am to answer any questions and agree a date for installation? Kind regards, Tunde Adebayo.",
  "required": true
}
```

Next lesson: pipeline, CRM and sales operations.
