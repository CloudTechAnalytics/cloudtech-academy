---
title: How Online Business Works
minutes: 25
summary: Understand the main e-commerce models (own store, marketplace, social selling and dropshipping), the costs and margins of each and how to choose a model that fits you.
---

## What e-commerce is

**E-commerce** is buying and selling goods or services online. Customers browse, choose, pay and receive their order, with much of the process handled through websites, apps and messaging. For a seller, the internet removes some barriers (no shop rent, a customer base far beyond your street) and adds others (more competition, trust to be earned, delivery to be solved).

In Nigeria, online selling spans huge marketplaces, brands with their own websites and an enormous amount of selling on **Instagram, Facebook and WhatsApp.** Many successful sellers start very small, with one product and a phone.

Whatever the model, the basics of the business are the same: **a product people want, at a price that makes a profit, a way to get paid safely, a way to deliver reliably and a way to be found.** This course goes through each, in order.

## E-commerce models

| Model | How it works | Strengths | Weaknesses |
| :-- | :-- | :-- | :-- |
| **Own online store** | You build a website (with a store platform) and sell directly | You own the brand, customer data and experience; no commission on each sale | You must bring all the traffic; setup and upkeep |
| **Marketplace** (such as Jumia, Jiji, Konga-type platforms, Amazon, Etsy) | You list products on a large platform that brings buyers | Existing traffic and trust; quick start | Commissions and fees; competition; the platform controls the rules |
| **Social selling** (Instagram, Facebook, WhatsApp, TikTok) | You show products on social media and take orders by message or link | Almost free to start; personal; strong for visual products | Manual work; hard to scale; depends on platform rules |
| **Dropshipping** | You sell products that a supplier stores and ships directly to your customer | No stock to buy; low start-up money | Lower margins; less control over quality and delivery; heavy competition |
| **Own products or made-to-order** | You make or source your own stock | Higher margins; unique brand | Money tied up in stock; production or sourcing effort |
| **Digital products and services** | You sell downloads, courses, bookings or services online | No shipping; high margins | Needs expertise; piracy and trust issues |

Many businesses **combine** them: sell on Instagram and WhatsApp, list on a marketplace for reach and later add an own store for repeat customers and better margins.

## Costs and margins

Know exactly what an order costs you. **Costs of selling online** include:

- **Product cost** (what you pay the supplier or the cost of making it).
- **Packaging** (boxes, bags, labels, inserts).
- **Delivery** (courier cost, if you pay it).
- **Payment fees** (gateway or bank charges).
- **Marketplace commission or platform fees,** if any.
- **Marketing cost per order** (ads, creators, discounts).
- **Returns and refunds,** and damaged or lost goods.
- **Fixed costs:** store subscription, tools, internet, storage space, your own time.

Example for a tote bag on a marketplace. Selling price **₦12,000**, product cost **₦6,500**, packaging **₦500**, marketplace commission **10%** (₦1,200).

- Profit per order before marketing and delivery = 12,000 − 6,500 − 500 − 1,200 = **₦3,800.**
- Margin = 3,800 ÷ 12,000 = **31.7%.**

If you add ₦1,500 of delivery you pay, the profit falls to ₦2,300. And if marketing costs ₦1,500 per order, you keep **₦800.** Small items can disappear into costs, so **calculate before you launch.**

Dropshipping often looks attractive because there is no stock, but the supplier's price is higher than wholesale and the selling price is limited by competition, so margins are thin and there is little room for ads, returns or mistakes.

## Choosing a model that fits you

Ask yourself:

1. **What am I selling,** and to whom? Visual, personal items sell well on social media; commodities and comparison-shopped goods do well on marketplaces; strong brands build their own stores.
2. **How much money and time do I have?** Social selling and marketplaces need the least to start.
3. **Do I want a brand or just sales?** An own store builds a brand and customer list.
4. **Who has the customers?** Selling where your customers already are beats building a new place.
5. **How will I deliver and handle payments?** Some models make this easier.
6. **What are my margins?** A model with high fees needs a higher price or lower costs.

A practical path for most beginners: **start where your first customers are** (often Instagram and WhatsApp, or a marketplace), prove that people buy, learn your numbers, then add an own store and email list as you grow. Avoid investing heavily in a polished website before you know what sells.

## Try it

```task
{
  "id": "ecom-m01-t1",
  "prompt": "A tote bag sells for **₦12,000**. Product cost is **₦6,500**, packaging **₦500** and the marketplace commission is **10%**. Work out the commission in naira, the profit per order and the margin. Then work out the profit if you also pay **₦1,500** delivery and **₦1,500** marketing per order.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Commission = ...",
  "rules": [
    { "label": "Commission of ₦1,200", "pattern": "1,?200" },
    { "label": "Profit of ₦3,800", "pattern": "3,?800" },
    { "label": "Margin of about 31.7%", "pattern": "31\\.7|31\\.67|32 ?%" },
    { "label": "Profit of ₦800 after delivery and marketing", "pattern": "\\b800\\b" }
  ],
  "sample": "Commission = 10% of 12,000 = ₦1,200.\nProfit = 12,000 - 6,500 - 500 - 1,200 = ₦3,800 per order.\nMargin = 3,800 / 12,000 = 31.7%.\nAfter ₦1,500 delivery and ₦1,500 marketing: 3,800 - 1,500 - 1,500 = ₦800 per order.",
  "required": true
}
```

```task
{
  "id": "ecom-m01-t2",
  "prompt": "Choose the **best starting model** for this seller and explain in 50 to 100 words: *Ada makes handmade soaps. She has ₦100,000, a phone and 800 Instagram followers, and no website.* Give two reasons and one limit of the model.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Ada should start with ...",
  "rules": [
    { "label": "Chooses social selling (Instagram/WhatsApp)", "pattern": "instagram|whatsapp|social" },
    { "label": "Gives reasons (followers, low cost, visual, personal)", "pattern": "because|since|followers|cost|free|cheap|visual|personal|quick|already" },
    { "label": "Gives a limit (manual work, hard to scale, platform rules)", "pattern": "limit|manual|scale|rules|depend|time|drawback|but" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "Ada should start with social selling on Instagram and WhatsApp. She already has 800 followers who can become her first customers, it costs almost nothing to start, and handmade soap is visual and personal, so photos and messages sell it well. She can test demand before spending her ₦100,000 on a website. The limit is that taking orders by message is manual and hard to scale, and she depends on the platforms' rules, so later she should add an own store and a customer list.",
  "required": true
}
```

```task
{
  "id": "ecom-m01-t3",
  "prompt": "List the **costs of selling one order online** that you would count for your own product, at least eight lines, with an estimate in naira for each.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Product cost - ₦...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Product cost", "pattern": "product cost|cost of (the )?(product|goods)|supplier" },
    { "label": "Packaging", "pattern": "packag" },
    { "label": "Delivery", "pattern": "deliver|courier|shipping" },
    { "label": "Payment fees", "pattern": "payment|gateway|fee|bank charge" },
    { "label": "Marketing cost per order", "pattern": "marketing|ads|advert|discount" },
    { "label": "Returns or damages", "pattern": "return|refund|damage|loss" },
    { "label": "Naira amounts", "pattern": "₦\\s?\\d", "min": 6 }
  ],
  "sample": "Product cost - ₦6,500\nPackaging (box, tissue, label) - ₦500\nDelivery paid by me - ₦1,000\nPayment gateway fee - ₦280\nMarketplace commission - ₦1,200\nMarketing cost per order - ₦1,500\nAllowance for returns and damages - ₦250\nShare of fixed costs (tools, data) - ₦200",
  "required": false
}
```

Next lesson: choosing a niche and products.
