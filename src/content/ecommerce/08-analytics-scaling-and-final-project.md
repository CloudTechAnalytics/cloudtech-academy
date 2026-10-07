---
title: Analytics, Scaling and Final Project
minutes: 50
summary: Track the store metrics that matter, improve conversion, scale what works and plan the launch of your own online store.
---

## Store metrics that matter

Numbers tell you what is working. Track a few, regularly, from your store platform, payment dashboard and analytics tool.

| Metric | Formula | Meaning |
| :-- | :-- | :-- |
| **Sessions (visits)** | Count | How many visits the store gets |
| **Conversion rate** | Orders ÷ sessions | How many visitors buy |
| **Average order value (AOV)** | Revenue ÷ orders | How much each order is worth |
| **Cart abandonment rate** | (Carts created − orders) ÷ carts created | How many people leave without paying |
| **Customer acquisition cost (CAC)** | Marketing spend ÷ new customers | What it costs to win a customer |
| **Contribution per order** | Price minus product, packaging, delivery and payment costs | What each sale leaves before marketing |
| **ROAS** | Revenue from ads ÷ ad spend | Return on ads |
| **Repeat purchase rate** | Repeat customers ÷ customers | Loyalty |
| **Return rate** | Returns ÷ orders | Product and description quality |
| **On-time delivery rate** | On-time deliveries ÷ deliveries | Fulfilment quality |

Example month: **1,200 sessions** and **36 orders** worth **₦432,000.**

- Conversion rate = 36 ÷ 1,200 = **3%.**
- AOV = 432,000 ÷ 36 = **₦12,000.**
- If 100 people added to cart and 30 completed payment, abandonment = (100 − 30) ÷ 100 = **70%.**

Average e-commerce conversion rates vary by industry and traffic source, so compare yourself with **your own past figures** and improve steadily.

## Improving conversion

Conversion improves when you **remove reasons not to buy** and **add reasons to buy.** Work through the customer's path:

1. **Traffic quality:** are the right people arriving? Better targeting often beats more traffic.
2. **Product pages:** clearer photos and videos, more honest detail, visible price, delivery and returns, reviews.
3. **Trust:** policies, secure payment signs, real contacts, reviews.
4. **Mobile experience:** fast loading, large buttons, simple menus.
5. **Checkout:** fewer fields, guest checkout, payment options customers like, no surprise delivery fees.
6. **Cart recovery:** reminders to people who left items in the cart.
7. **Offers:** a first-order discount, bundle, free delivery above a threshold.
8. **Support:** quick answers by chat or WhatsApp on the product page.

Change **one thing at a time** and measure. For example, if conversion rises from 3% to 3.6% on the same 1,200 sessions, orders rise from 36 to 43.2, about **7 more orders (a 20% increase)**, with no extra ad cost.

Also raise **average order value:** bundles ("buy the tote and pouch together"), minimum-spend free delivery, add-ons at checkout and tiered pricing.

## Scaling what works

Scale only when the **unit economics are proven**: each order makes a profit after all costs, including marketing, delivery and returns.

Steps:

1. **Know your numbers:** contribution per order, CAC, repeat rate, on-time delivery.
2. **Fix weak points first.** Scaling a leaking process just makes more mistakes.
3. **Increase ad spend gradually** (for example 20% at a time) while watching cost per order.
4. **Expand products** that customers already ask for, and drop slow ones.
5. **Expand channels** (marketplace, own store, more social platforms) one at a time.
6. **Build stock and cash carefully.** Growth uses cash: more stock, more ad spend, more delivery costs before the money returns. Keep a reserve.
7. **Automate and delegate:** order management, replies, packing and tracking, with clear procedures.
8. **Strengthen suppliers and couriers,** with backups.
9. **Protect customer service,** since quality often slips during growth.

The warning signs of scaling too fast: late deliveries, rising returns, falling reviews, stockouts, cash running low. Slow down and fix them.

## Launching your store

A launch plan turns your learning into a live business. A simple 30-day approach:

- **Before launch:** niche and products chosen, supplier tested, costs and prices worked out, store or social shop set up, payment and delivery tested with a real order, policies written, product photos taken.
- **Soft launch:** open to friends, family and your first followers; take the first orders; fix problems; gather the first reviews.
- **Public launch:** announce on your channels, with a launch offer, content and a small ad test.
- **After launch:** track the metrics weekly, reply to every message, collect reviews, improve one thing at a time.

Before you launch, **place a test order yourself,** from adding to cart through payment, delivery and a return. You will find problems you did not expect.

## Try it

```task
{
  "id": "ecom-m08-t1",
  "prompt": "A month's store figures: **1,200 sessions**, **36 orders**, **₦432,000** revenue, **100** carts created, **30** completed. Work out the **conversion rate**, **AOV** and **cart abandonment rate**.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Conversion rate = ...",
  "rules": [
    { "label": "Conversion rate of 3%", "pattern": "\\b3\\s?%" },
    { "label": "AOV of ₦12,000", "pattern": "12,?000" },
    { "label": "Cart abandonment of 70%", "pattern": "\\b70\\s?%" }
  ],
  "sample": "Conversion rate = 36 / 1,200 = 3%.\nAOV = 432,000 / 36 = ₦12,000.\nCart abandonment = (100 - 30) / 100 = 70%.",
  "required": true
}
```

```task
{
  "id": "ecom-m08-t2",
  "prompt": "If conversion rises from **3% to 3.6%** on **1,200 sessions**, how many orders would you get and how many more than now? Then give **three changes** you would test to raise conversion, one per line.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Orders at 3.6% = ...",
  "rules": [
    { "label": "43 orders (43.2)", "pattern": "43\\.2|\\b43\\b" },
    { "label": "About 7 more orders", "pattern": "7\\.2|\\b7\\b" },
    { "label": "Three tests (photos, checkout, trust, delivery, reviews, offer)", "pattern": "photo|checkout|trust|delivery|review|offer|mobile|price|guest|reminder" },
    { "label": "At least four lines", "minLines": 4 }
  ],
  "sample": "Orders at 3.6% = 1,200 x 0.036 = 43.2, about 43, which is about 7 more than 36.\nTest clearer photos and a short video on the best-selling product page.\nTest guest checkout with fewer form fields.\nShow delivery cost and time and the return policy before checkout.",
  "required": true
}
```

```task
{
  "id": "ecom-m08-t3",
  "prompt": "Write your **store plan summary** in at least eight lines: the niche statement, three products with price and cost, the model and platform, payment methods, delivery option and cost, return policy summary, your first marketing channel and your contribution per order.",
  "minutes": 15,
  "rows": 11,
  "placeholder": "Niche: ...\nProducts: ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Niche", "pattern": "niche|we sell" },
    { "label": "Products with price and cost", "pattern": "product[\\s\\S]*price[\\s\\S]*cost|product[\\s\\S]*cost[\\s\\S]*price" },
    { "label": "Model and platform", "pattern": "platform|model|instagram|whatsapp|shopify|marketplace|store" },
    { "label": "Payment methods", "pattern": "payment|transfer|card|gateway" },
    { "label": "Delivery", "pattern": "delivery|courier|rider" },
    { "label": "Returns", "pattern": "return|refund" },
    { "label": "Contribution per order", "pattern": "contribution|profit per order" }
  ],
  "sample": "Niche: we sell durable ankara work totes for women who commute in Lagos.\nProducts: tote - price ₦12,000 - cost ₦6,500; pouch - price ₦4,500 - cost ₦2,000; gift set - price ₦15,500 - cost ₦8,300\nModel and platform: social selling on Instagram and WhatsApp first, then a hosted store\nPayment: card and transfer through a gateway, and pay on delivery only with a deposit\nDelivery: own riders within Lagos for ₦1,500, a nationwide courier for other states\nReturns: 7 days if unused; faulty items replaced at our cost\nFirst marketing channel: Instagram Reels and WhatsApp status, then a small ad test\nContribution per order: ₦3,820 before marketing on the tote",
  "required": true
}
```

```task
{
  "id": "ecom-m08-t4",
  "prompt": "Write your **30-day launch plan**: week 1, week 2, week 3 and week 4, each with two or three actions and a measurable target. At least eight lines.",
  "minutes": 15,
  "rows": 10,
  "placeholder": "Week 1: ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Covers weeks 1 to 4", "pattern": "week 1[\\s\\S]*week 2[\\s\\S]*week 3[\\s\\S]*week 4" },
    { "label": "Includes a test order", "pattern": "test order|place an order|test the" },
    { "label": "Includes first sales or reviews targets with numbers", "pattern": "\\d+\\s*(orders|sales|reviews|customers)" },
    { "label": "Includes marketing actions", "pattern": "post|ad|whatsapp|instagram|announce|launch" },
    { "label": "Includes tracking the metrics", "pattern": "track|metric|conversion|review the numbers|measure" }
  ],
  "sample": "Week 1: finish product photos, write policies and place a test order through payment, delivery and a return.\nWeek 1 target: store and social shop ready, test order delivered.\nWeek 2: soft launch to friends, family and 800 followers; fix any problems.\nWeek 2 target: 10 orders and 5 reviews.\nWeek 3: public launch with an offer, daily posts and a small ad test of ₦20,000.\nWeek 3 target: 25 orders and an ad ROAS above 3.14.\nWeek 4: track conversion, delivery and returns, reply to every review and improve one thing.\nWeek 4 target: 40 orders in total and a repeat purchase from 5 customers.",
  "required": true
}
```

When you are done, submit your complete store plan as your final project.
