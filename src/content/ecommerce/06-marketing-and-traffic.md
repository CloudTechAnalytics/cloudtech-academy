---
title: Marketing and Traffic
minutes: 25
summary: Sell through social media and WhatsApp, run ads for a store, use search and email and win reviews and referrals.
---

## Social media and WhatsApp selling

For many Nigerian online sellers, **Instagram, Facebook, TikTok and WhatsApp** are the shop window. To do it well:

- **Make your profile a mini-store:** clear name, a bio saying what you sell and where you deliver, a link to your store or WhatsApp, and highlights for prices, delivery, reviews and how to order.
- **Post consistently:** product photos and short videos showing the item in use, behind-the-scenes, customer photos, tips and offers.
- **Use captions with the price and how to order** so customers do not have to ask for basics.
- **Use Stories and status** for daily updates, new arrivals, polls and limited offers.
- **Show proof:** reviews, delivery photos, before-and-after.
- **Reply fast.** Many sales are won or lost in the first hour. Use **WhatsApp Business** features: catalogue, quick replies, labels, away messages and greeting.
- **Move conversations to orders:** have a simple order process: product, size, address, payment, delivery date.
- **Build your own list:** invite buyers to a broadcast list or newsletter, with permission, since you own those contacts.
- **Collaborate** with micro-creators for honest reviews and a unique code.

Respect each platform's rules and privacy law: ask before adding people to groups or broadcast lists, and do not spam.

## Ads for a store

Paid ads can bring customers quickly, but only if the **numbers work.** Use what you learned in the product economics.

Example: you spend **₦60,000** on ads and receive **25 orders** at **₦12,000.**

- Revenue = 25 × 12,000 = **₦300,000.**
- **ROAS** = 300,000 ÷ 60,000 = **5.0.**
- **Cost per order (CPA)** = 60,000 ÷ 25 = **₦2,400.**
- Your contribution before marketing is ₦3,820 per order, so profit from the ads = (25 × 3,820) − 60,000 = 95,500 − 60,000 = **₦35,500.**
- Your break-even ROAS is 12,000 ÷ 3,820 = 3.14, and 5.0 is well above it, so these ads are profitable. Scale carefully.

Tips for store ads:

- **Start with a small budget** and test two or three creatives and audiences.
- **Show the product in use** in the first seconds of a video, with the price or offer.
- **Retarget** people who viewed a product or added to cart but did not buy.
- **Send ad traffic to the exact product page,** not just the home page.
- **Install tracking** (pixel and analytics) so results can be measured.
- **Watch the cost per order against your break-even** every few days. Pause losers and scale winners slowly.
- **Follow the platform's ad policies.**

## Search and email

**Search (SEO).** People search for what they need ("laptop tote bag Lagos"). Help them find you:

- Use clear **product names and descriptions** with the words customers search.
- Write **page titles and descriptions** with the product and your location.
- Use **descriptive image names and alt text.**
- Add **reviews and useful content** (buying guides, care tips).
- Set up **Google Business Profile** if you have a physical location or serve a local area.

Search is slow but builds free, steady traffic.

**Email and messaging.** Your list is a lasting asset.

- **Collect emails and numbers** at checkout and with a small incentive, with permission.
- **Send a welcome message** with a thank-you or first-order discount.
- **Send useful, occasional updates:** new arrivals, restocks, tips, offers.
- **Use automations:** abandoned cart reminders, order updates, review requests, birthday offers and win-back messages.
- **Segment** by what people bought.
- **Include an easy way to opt out.**

Email and messaging typically cost the least per sale because the customer already knows you.

## Reviews and referrals

Reviews are among the strongest ways to win trust.

- **Ask at the right time:** a few days after delivery, when the customer is happy. Send a short message with a link or simple question.
- **Make it easy:** one click or one reply.
- **Use real photos and quotes** (with permission) on your store and social media.
- **Respond to every review,** thanking happy customers and handling unhappy ones professionally. A calm reply to criticism builds trust in everyone who reads it.
- **Never fake reviews.** It is dishonest, breaks platform rules and can be illegal.

**Referrals:** happy customers recommend you if you make it easy and rewarding. A simple scheme: *"Share your code with a friend. They get ₦1,000 off their first order, and you get ₦1,000 off your next."* Calculate the cost: if the average contribution is ₦3,820 and you give ₦2,000 in total discounts, you still keep ₦1,820 and gained a customer without ad spend.

## Try it

```task
{
  "id": "ecom-m06-t1",
  "prompt": "You spend **₦60,000** on ads and get **25 orders** at **₦12,000**. Your contribution before marketing is **₦3,820** an order. Work out **revenue**, **ROAS**, **cost per order** and the **profit from the ads**, and say whether they are worth scaling.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Revenue = ...",
  "rules": [
    { "label": "Revenue of ₦300,000", "pattern": "300,?000" },
    { "label": "ROAS of 5", "pattern": "\\b5(\\.0)?\\b" },
    { "label": "Cost per order of ₦2,400", "pattern": "2,?400" },
    { "label": "Profit of ₦35,500", "pattern": "35,?500" },
    { "label": "Says yes, worth scaling carefully", "pattern": "worth|scale|profitable|above (the )?break-?even|yes" }
  ],
  "sample": "Revenue = 25 x 12,000 = ₦300,000.\nROAS = 300,000 / 60,000 = 5.0.\nCost per order = 60,000 / 25 = ₦2,400.\nProfit from ads = 25 x 3,820 - 60,000 = 95,500 - 60,000 = ₦35,500.\nThe ROAS of 5.0 is above my break-even of 3.14, so the ads are profitable and worth scaling carefully.",
  "required": true
}
```

```task
{
  "id": "ecom-m06-t2",
  "prompt": "Write a **social post caption** (40 to 80 words) to sell one product: a hook, the benefit, the price, how to order and delivery information.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Tired of ...",
  "rules": [
    { "label": "Has a hook (question or bold statement)", "pattern": "\\?|tired|imagine|meet|new|finally" },
    { "label": "States a benefit", "pattern": "fits|carry|keeps|strong|save|comfortable|protect|stylish|easy|perfect" },
    { "label": "States a price in naira", "pattern": "₦\\s?\\d" },
    { "label": "Says how to order", "pattern": "order|dm|whatsapp|message|click|link" },
    { "label": "States delivery", "pattern": "deliver|ship|nationwide|within lagos|days" },
    { "label": "Between 40 and 80 words", "minWords": 40, "maxWords": 85 }
  ],
  "sample": "Tired of carrying your laptop in a plastic bag? Meet the Kente Work Tote: strong ankara fabric, a padded laptop pocket and a zip that keeps your things safe. It fits a 15-inch laptop, your lunch and your documents. Price: ₦12,000. To order, send us a DM or WhatsApp with your colour choice and address. We deliver within Lagos in 2 days and nationwide in 3 to 5 days.",
  "required": true
}
```

```task
{
  "id": "ecom-m06-t3",
  "prompt": "Design a **review and referral plan** in at least five lines: when you ask for reviews, the message you send, how you use reviews, and a referral reward with the cost to you.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Ask for a review 3 days after delivery ...",
  "rules": [
    { "label": "At least five lines", "minLines": 5 },
    { "label": "Says when to ask for a review", "pattern": "days? after|after delivery|when (the )?(customer|they)" },
    { "label": "Includes a message", "pattern": "message|whatsapp|text|say|ask" },
    { "label": "Says how reviews are used", "pattern": "store|page|post|social|share|display|photos" },
    { "label": "Includes a referral reward", "pattern": "referral|refer|friend|code|₦\\s?1,?000|discount" },
    { "label": "Mentions the cost to you or the profit left", "pattern": "cost|keep|profit|₦\\s?\\d" }
  ],
  "sample": "Ask for a review three days after delivery, when the customer has used the item.\nMessage: \"Hi Tola, we hope you love your tote! Could you tell us how it is, in one line, with a photo if you like?\"\nUse the best reviews and customer photos on the product page and on Instagram, with permission.\nReply to every review, thanking happy customers and fixing problems for unhappy ones.\nReferral: a friend gets ₦1,000 off their first order and the referrer gets ₦1,000 off the next.\nCost: ₦2,000 in discounts against ₦3,820 contribution, so I still keep ₦1,820 and win a customer without ads.",
  "required": false
}
```

Next lesson: customer service and returns.
