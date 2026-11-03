---
title: Marketing and Selling
minutes: 25
summary: Apply marketing basics to a new business, choose channels, build a brand on a small budget, sell and serve customers well and win referrals and repeat business.
---

## Marketing basics for a new business

**Marketing** is everything you do to understand customers, tell them about your offer and make buying easy. **Selling** is the conversation that turns interest into a purchase. A new business needs both, and both start with a clear customer and a clear promise (modules 2 and 3).

The classic **4 Ps** give a checklist:

| P | Question |
| :-- | :-- |
| **Product** | What exactly are we selling, and what makes it good? |
| **Price** | What do we charge, and why? |
| **Place** | Where and how do customers buy and receive it? |
| **Promotion** | How do customers hear about us and decide to try us? |

Start small and focused. A new business does not need a big campaign; it needs **its first 10, then 50 customers**, and a way to learn from each.

## Choosing channels

A **channel** is how you reach customers. Pick the few where **your customers already are** and you can show up consistently.

| Channel | Good for | Notes |
| :-- | :-- | :-- |
| **WhatsApp (status, groups, broadcasts)** | Local and repeat customers | Free; personal; ask permission before adding people |
| **Instagram, Facebook, TikTok** | Visual products, building a brand | Needs regular posts and quick replies |
| **Word of mouth and referrals** | Trust-based services | Cheapest and strongest |
| **Marketplaces (Jumia, Jiji and others)** | People ready to buy now | Fees and competition |
| **Flyers, posters, signs, events** | Local, physical businesses | Low cost, targeted places |
| **Partnerships** | Reaching someone else's audience | A shop, school or office that recommends you |
| **Google search and maps** | People searching for a service nearby | Set up a free business profile |
| **Paid adverts** | Testing offers quickly | Start with a small budget and measure |

Test two or three channels for a few weeks, **measure what each brings** (enquiries, sales, cost) and put more effort where results are best.

## Branding on a small budget

A **brand** is how customers see and feel about your business. It includes your name, logo, colours, voice and, above all, **how you treat people.**

On a small budget:

- **Choose a clear, easy-to-remember name** and check it is free to use.
- **Keep the look simple and consistent:** one logo, two or three colours, one or two fonts, used the same way everywhere.
- **Take good photos** of your product and work, with a phone and natural light.
- **Write in a consistent, friendly voice.**
- **Show proof:** customer photos, reviews and short testimonials.
- **Be reliable.** Reliability is the brand. A beautiful logo cannot rescue late, poor delivery.

## Selling and customer service

Selling well is mostly **listening and being helpful**.

1. **Understand the need:** ask what they want and why.
2. **Explain the benefit,** not just the features.
3. **Handle questions and doubts** honestly.
4. **State the price clearly** and make it easy to say yes.
5. **Ask for the order.** Many sales are lost because nobody asked.
6. **Deliver what you promised,** on time.
7. **Follow up** to make sure the customer is happy.

**Customer service** keeps customers. Reply quickly, be polite, admit mistakes and fix them. A complaint handled well often creates a more loyal customer than no problem at all.

## Referrals and repeat customers

It costs much less to keep a customer than to win a new one.

- **Ask happy customers for referrals** and make it easy: a link, a code or a card.
- **Reward referrals** with a small discount or free item, for both sides.
- **Stay in touch:** a message on their birthday, a reminder when they usually reorder, news of new items.
- **Offer a loyalty reward:** the tenth meal free.
- **Collect reviews and testimonials** and share them.

Know your numbers. **Customer acquisition cost (CAC)** is what you spend to win a customer: if you spend ₦50,000 on advertising and win 25 customers, CAC = 50,000 ÷ 25 = **₦2,000** per customer. **Customer lifetime value (CLV)** is the profit a customer brings over time. If each customer gives ₦3,500 profit per order and orders about three times, CLV = 3,500 × 3 = **₦10,500.** CLV (₦10,500) is well above CAC (₦2,000), so the marketing is paying for itself. If CAC were higher than CLV, you would lose money on every new customer.

## Try it

```task
{
  "id": "ent-m06-t1",
  "prompt": "You spend **₦50,000** on adverts and win **25 customers**. Each brings **₦3,500 profit** per order and orders **three times**. Calculate the **cost to acquire a customer (CAC)** and the **customer lifetime value (CLV)**, and say whether the marketing is worth it.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "CAC = ...",
  "rules": [
    { "label": "CAC of ₦2,000", "pattern": "2,?000" },
    { "label": "CLV of ₦10,500", "pattern": "10,?500" },
    { "label": "Says it is worth it because CLV is higher than CAC", "pattern": "worth|profitable|pays|higher than|greater|more than|good" }
  ],
  "sample": "CAC = 50,000 / 25 = ₦2,000 per customer.\nCLV = 3,500 x 3 = ₦10,500 profit per customer.\nIt is worth it, because the lifetime value of ₦10,500 is much higher than the ₦2,000 it costs to win each customer.",
  "required": true
}
```

```task
{
  "id": "ent-m06-t2",
  "prompt": "Write a **WhatsApp or Instagram message** (50 to 110 words) introducing your product to your first customers: say who it is for, the benefit, the price, how to order and a small first-order offer.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Hello! ...",
  "rules": [
    { "label": "Says who it is for", "pattern": "for (busy|office|students|parents|anyone|you|workers|families)|if you" },
    { "label": "Says the benefit", "pattern": "save|fresh|fast|never|no more|enjoy|easy|healthy|convenient|delivered" },
    { "label": "States a price in naira", "pattern": "₦\\s?\\d" },
    { "label": "Says how to order", "pattern": "order|reply|message|whatsapp|call|dm|send" },
    { "label": "Offers something to start (discount, free, first order)", "pattern": "first|free|discount|off|bonus|try" },
    { "label": "Between 50 and 110 words", "minWords": 50, "maxWords": 115 }
  ],
  "sample": "Hello! Are you tired of queuing for lunch or skipping it? Our fresh lunch boxes are made for busy office workers and delivered hot to your desk by 12:30, so you save your break and enjoy a proper meal. Each box is ₦2,500, with jollof rice, chicken and plantain. To order, reply to this message by 10 am with your name, office address and meal choice. For your first order this week, you get a free drink on us. Try us once and see the difference!",
  "required": true
}
```

```task
{
  "id": "ent-m06-t3",
  "prompt": "A customer messages: **\"My order came 40 minutes late and the food was cold.\"** Write your reply in 50 to 100 words: apologise, take responsibility, fix it and say how you will prevent it.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "I am sorry ...",
  "rules": [
    { "label": "Apologises", "pattern": "sorry|apolog" },
    { "label": "Takes responsibility", "pattern": "our (mistake|fault|error)|we (made|should have)|my (mistake|fault)|responsib|that is not (the|our)" },
    { "label": "Offers a fix (refund, replacement, discount, free)", "pattern": "refund|replace|discount|free|credit|make it right|redeliver" },
    { "label": "Says how it will be prevented", "pattern": "prevent|again|from now|going forward|change|will (leave|start|check|assign)" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "I am so sorry. Your order should have reached you by 12:30 with hot food, and that was our mistake. I have refunded today's meal and will send you a free lunch tomorrow to make it right. The delay happened because we had too many orders for one rider, so from now on we will assign a second rider on busy days and call you if anything runs late. Thank you for telling us, and I hope you will give us another chance.",
  "required": false
}
```

Next lesson: operations and management.
