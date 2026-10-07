---
title: Funnels, Landing Pages and Conversion
minutes: 30
summary: Map the customer journey, build landing pages that convert, craft offers and calls to action and test and improve results step by step.
---

## The customer journey

Customers rarely buy at first sight. They move through stages, and marketing should **help at each one.** A **funnel** is a way to picture this journey, wide at the top (many people who know you a little) and narrow at the bottom (the few who buy).

A common model:

| Stage | The customer thinks | What you offer | Example measures |
| :-- | :-- | :-- | :-- |
| **Awareness** | "I have a problem" or "I've seen this brand" | Helpful content, videos, ads | Reach, visits |
| **Interest / consideration** | "Which options solve it?" | Guides, comparisons, reviews, demos | Sign-ups, engagement |
| **Decision** | "Is this right, and can I trust you?" | Offers, proof, a free trial, clear pricing, talking to you | Enquiries, add-to-cart |
| **Action** | "I'll buy" | An easy checkout, booking or order | Sales, bookings |
| **Loyalty and referral** | "Was it good? Would I tell others?" | Great service, follow-up, rewards | Repeat purchases, reviews |

**Map the journey for your own customer.** At each stage, ask: What questions do they have? Where are they? What stops them moving on? Then fill the gaps. Many businesses are strong at the top (posting daily) and weak in the middle (no proof, no easy next step) so they lose people they have already attracted.

Funnel maths shows where you leak. Example: 10,000 visitors → 500 sign-ups (5%) → 50 enquiries (10% of sign-ups) → 15 customers (30% of enquiries). Overall, 15 ÷ 10,000 = **0.15%.** Improving any step lifts the whole funnel, and the step with the lowest rate is usually the best place to start.

## Landing pages that convert

A **landing page** is a page created for **one purpose** and one audience, usually linked from an ad, email or post. It is not your whole website. Its job is to persuade the visitor to take **one action.**

Elements of a strong landing page:

1. **A headline that matches the ad or link they clicked.** If the ad says "Free sofa-cleaning quote," the page must say so immediately.
2. **A sub-headline** that explains the benefit.
3. **A clear, relevant image or short video** that shows the product or result.
4. **The key benefits,** in short bullets, in the customer's language.
5. **Social proof:** reviews, testimonials, ratings, logos, numbers, before and after.
6. **A simple offer,** with clear price or what they get.
7. **One prominent call-to-action button,** repeated further down.
8. **A short form:** ask only for what you need (name and phone is often enough).
9. **Trust signals:** guarantee, secure payment, real contact details, privacy note.
10. **Fast, mobile-friendly design,** with little clutter and no distracting links.

Remove anything that does not help the visitor take the action. Use plain language, and answer likely questions (price, time, delivery, refunds).

## Offers and calls to action

An **offer** is what you give in return for their action. It must be **clear, valuable and low-risk** from the customer's side. Strong offers include a free quote, a free trial or sample, a first-order discount, a free guide, a bonus, a guarantee, or a bundle.

Make the offer **specific:** "Free quote within 2 hours" is stronger than "Contact us." Add **honest urgency** where it is real (a limited number of slots, a date the price changes). **Reduce risk:** money-back guarantee, clear refund rules, free delivery or free returns.

A **call to action (CTA)** tells people exactly what to do next. Good CTAs:

- **Start with a verb:** "Get my free quote," "Book my slot," "Download the guide."
- **Say what happens** and the benefit: "Get my quote in 2 hours."
- **Stand out** in colour and position, and are large enough to tap on a phone.
- **Focus on one main action** per page.
- Match the stage: a "Learn more" for early visitors, "Buy now" for ready ones.

## Testing and improving

Do not guess; **test.** An **A/B test** shows two versions (A and B) to similar visitors at the same time and compares results.

Example: version A of a landing page converts **40** of **1,000** visitors (4%). Version B, with a shorter form, converts **55** of **1,000** (5.5%). The relative improvement is (5.5 − 4) ÷ 4 = **37.5%.** If each conversion is worth ₦20,000 profit, then over 10,000 visitors, B brings (550 − 400) × 20,000 = **₦3,000,000** more.

Rules for good tests:

- **Change one thing at a time** (headline, image, button text, form length, price display).
- **Decide in advance** what you are measuring.
- **Run the test long enough** and with enough visitors to be confident, since small numbers mislead.
- **Do not stop early** because one version looks ahead after a day.
- **Record results** and what you learned.
- **Keep what wins,** then test the next idea.

Start testing where the effect is biggest: the headline, the offer and the call to action. Also fix the basics first, such as loading speed, broken links, confusing forms and mobile display, because those lose customers silently.

## Try it

```task
{
  "id": "dms-m08-t1",
  "prompt": "Version A converts **40 of 1,000** visitors. Version B converts **55 of 1,000**. Work out each conversion rate, the **relative improvement** of B, and the extra profit over **10,000 visitors** if each conversion is worth **₦20,000** profit.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "A = ...",
  "rules": [
    { "label": "A rate of 4%", "pattern": "\\b4\\s?%" },
    { "label": "B rate of 5.5%", "pattern": "5\\.5\\s?%" },
    { "label": "Relative improvement of 37.5%", "pattern": "37\\.5" },
    { "label": "Extra profit of ₦3,000,000", "pattern": "3,?000,?000" }
  ],
  "sample": "A = 40 / 1,000 = 4%. B = 55 / 1,000 = 5.5%.\nRelative improvement = (5.5 - 4) / 4 = 37.5%.\nOver 10,000 visitors: A converts 400 and B converts 550, so 150 more x ₦20,000 = ₦3,000,000 extra profit.",
  "required": true
}
```

```task
{
  "id": "dms-m08-t2",
  "prompt": "Plan a **landing page** for an offer of your choice. List at least **eight elements** top to bottom, one per line, with the actual words for the headline, sub-headline and button.",
  "minutes": 15,
  "rows": 11,
  "placeholder": "Headline: ...\nSub-headline: ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Headline", "pattern": "headline" },
    { "label": "Sub-headline or benefits", "pattern": "sub-?headline|benefit" },
    { "label": "Social proof", "pattern": "testimonial|review|rating|proof|customers" },
    { "label": "Call to action button", "pattern": "button|cta|call to action" },
    { "label": "Form", "pattern": "form|name and|phone|fields" },
    { "label": "Guarantee or trust", "pattern": "guarantee|trust|secure|refund|privacy" }
  ],
  "sample": "Headline: Get your sofa cleaned in one visit, or it's free\nSub-headline: Professional stain and odour removal in Lekki, with a free quote in 2 hours\nImage: a short before-and-after photo of a cleaned sofa\nBenefits: removes stains and odours; dries in 3 hours; safe for children and pets\nSocial proof: 4.9 rating from 180 reviews and three customer testimonials\nOffer: free quote and 10% off your first clean\nForm: only name and phone number\nButton: Get my free quote\nGuarantee and trust: free re-clean if you are not happy; real address and phone number shown",
  "required": true
}
```

```task
{
  "id": "dms-m08-t3",
  "prompt": "Design an **A/B test** for your landing page in 50 to 100 words: what you will change, version A and B, what you will measure, how many visitors you need and what result means you adopt B.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "I will test ...",
  "rules": [
    { "label": "States what is changed", "pattern": "change|test|headline|button|form|image|offer" },
    { "label": "Names versions A and B", "pattern": "\\ba\\b[\\s\\S]*\\bb\\b|version a|version b" },
    { "label": "States the measure (conversion rate)", "pattern": "conversion|rate|sign-?ups|leads|sales" },
    { "label": "States visitor numbers or time", "pattern": "\\d+\\s*(visitors|people|days|weeks)|\\d{3,}" },
    { "label": "States the adoption rule", "pattern": "if|adopt|keep|win|higher|better" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "I will test the length of the form, changing only that one thing. Version A has five fields and version B has only name and phone number. I will measure the lead conversion rate, which is leads divided by visitors. I will send 1,000 visitors to each version over two weeks, splitting traffic equally. If B converts at least 20% better than A and the difference holds for the whole period, I will adopt B and then test the headline next.",
  "required": false
}
```

Next lesson: analytics and reporting.
