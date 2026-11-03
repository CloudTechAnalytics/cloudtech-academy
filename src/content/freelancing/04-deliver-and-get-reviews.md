---
title: Deliver Work and Get Great Reviews
minutes: 20
summary: Communicate well, deliver on time, handle changes and difficult clients, and turn happy clients into reviews and repeat work.
---

## Communication wins repeat clients

Most clients care as much about **how** you work as the result:

- **Reply within a day**, even if it's "Got it, I'll send the first draft on Wednesday."
- **Ask questions early.** It's better than guessing and redoing the work.
- **Give updates** before they have to ask.
- **Warn early** if you'll be late, with a new date. Never go silent.

## Deliver professionally

1. **Check your work** against the agreed scope before sending.
2. **Deliver in the right format:** PNG and PDF, editable Canva link, `.xlsx` and so on.
3. **Name files clearly:** `Bola-Kitchen-weekend-promo-square.png`.
4. **Write a short delivery note:** what's included, how to use it, and how to request changes.

## Handle changes and difficult clients

- Changes **within scope** (the agreed rounds): do them promptly and cheerfully.
- Changes **outside scope**: politely explain and offer a price. "Happy to add a fourth flyer. That would be ₦5,000 extra."
- If a client is rude or unreasonable, stay calm and professional, and keep everything in writing. On platforms, contact **support** early rather than arguing.
- It's fine to turn down work that doesn't feel right.

## Ask for reviews and repeat work

Reviews and referrals are how freelancers grow.

- On platforms, politely ask for a review once they're happy: *"I'm glad you like it! If you have a moment, a review would really help my business."*
- For direct clients, ask for a **short testimonial** you can put on your portfolio.
- Offer a small discount on their **next** job, or check in a month later: *"Do you need flyers for next month's promo?"*

![What to do while you work, when you deliver and after the job to earn reviews and repeat clients](/images/courses/freelancing/deliver-reviews.svg "Communicate, deliver cleanly, then ask for the review.")

## Balance it with school

- Set **fixed hours** for freelance work, and protect exam periods.
- Don't take on more than you can deliver well. One bad review costs more than one missed job.
- Keep a simple record of **income and expenses**. As your earnings grow, learn about tax obligations for self-employed income.

> [!TIP]
> Add every finished project (with permission) to your portfolio. After ten jobs you'll have a strong body of work and your prices can rise.

## Try it

Kunle approved your three designs, then wrote: *"Can you also do 3 more posts for next week? Same price is fine abi?"* Your agreed scope was a price list and two posts.

```task
{
  "id": "freel-m04-t1",
  "prompt": "Write a **polite reply** that thanks him, explains the extra posts are outside the agreed scope, and offers a price and a delivery date for them.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Hi Kunle, ...",
  "rules": [
    { "label": "Friendly and thanks him", "pattern": "thank|glad|happy|pleased" },
    { "label": "Explains it's outside the agreed scope (agreed, original, included…)", "pattern": "agreed|original|included|scope|we discussed|the brief" },
    { "label": "Offers a price for the extra work", "pattern": "₦\\s*\\d|\\d+\\s*k\\b|naira" },
    { "label": "Gives a delivery date or time", "pattern": "monday|tuesday|wednesday|thursday|friday|saturday|sunday|\\d+\\s*days?|tomorrow|next week|by \\d" },
    { "label": "No rudeness or refusal without an offer (\"no way\", \"not my problem\")", "pattern": "no way|not my problem|are you mad|stop asking", "absent": true }
  ],
  "sample": "Hi Kunle, I'm really glad you like the designs! The three extra posts weren't part of our original agreement (the price list and two posts), but I'd be happy to do them. Three more posts would be ₦12,000, and I can deliver them by Wednesday. Shall I go ahead?",
  "required": true
}
```

```task
{
  "id": "freel-m04-t2",
  "prompt": "Write your **delivery note**: what's included (with clear file names and formats), how to use them, and how to ask for changes.",
  "minutes": 5,
  "rows": 7,
  "placeholder": "Hi ..., here are ...",
  "rules": [
    { "label": "Lists the files with formats (.png, .pdf, Canva link…)", "pattern": "\\.(png|pdf|jpg|xlsx|docx|mp4)|canva link|editable" },
    { "label": "Clear file names (with hyphens, not 'final final')", "pattern": "[a-z0-9]+-[a-z0-9-]+\\.(png|pdf|jpg|xlsx|docx|mp4)" },
    { "label": "Says how to request changes", "pattern": "change|revision|edit|tweak|adjust" },
    { "label": "At least 30 words", "minWords": 30 }
  ],
  "sample": "Hi Kunle, here are your designs:\n- Kunle-Accessories-price-list.pdf (A4, ready to print)\n- Kunle-Accessories-price-list-whatsapp.png\n- Kunle-Accessories-promo-1.png and Kunle-Accessories-promo-2.png (square, for Instagram)\n- An editable Canva link, so you can update prices yourself.\nYou have two rounds of changes included: just reply with what you'd like adjusted.",
  "required": true
}
```

```task
{
  "id": "freel-m04-t3",
  "prompt": "Write the short message you'll send to **ask for a review or testimonial** once a client is happy.",
  "minutes": 3,
  "rows": 4,
  "placeholder": "...",
  "rules": [
    { "label": "Asks for a review or testimonial", "pattern": "review|testimonial|recommend|feedback|a few words" },
    { "label": "Polite and low-pressure (if you have a moment, would you mind…)", "pattern": "if you have|would you mind|when you get a chance|if you're happy|could you|would you" },
    { "label": "Short: under 60 words", "minWords": 10, "maxWords": 60 }
  ],
  "sample": "I'm so glad the price list is working well for you! If you have a moment, would you mind leaving a short review on my profile? It really helps a small business like mine.",
  "required": true
}
```

Then block out your weekly freelance hours in Google Calendar, around your lectures and exam periods.
