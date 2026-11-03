---
title: Selling Imported Products
minutes: 25
summary: Choose where and how to sell, compare wholesale and retail, manage stock and cash flow, market imported goods and grow from one product to many.
---

## Selling is half the business

An import is only profit once the goods are sold and the money is in your account. Many importers put all their effort into sourcing and shipping, then sit on stock. Plan how you will sell **before** the goods arrive.

## Where and how to sell

| Channel | Strengths | Watch out for |
| :-- | :-- | :-- |
| **Instagram, Facebook, WhatsApp and TikTok** | Cheap to start, direct customer contact, strong for visual products | You must post consistently and answer fast |
| **Online marketplaces (Jumia, Jiji and others)** | Existing traffic and trust | Commission, competition, listing rules |
| **Your own shop or stall** | Customers see and touch the product | Rent, time, location |
| **Market traders and retailers (wholesale)** | Large, repeat orders | Lower price per unit, credit risk |
| **Corporate and bulk buyers** | Big orders, invoices | Slow payment, formal requirements |
| **Your own website** | Control and brand | Needs traffic and setup |

Start with the channels you can reach this week, usually social media and people you know, and add more as you learn what works.

## Wholesale versus retail

- **Retail** sells one or a few units to the end customer at a higher price. Margins are higher but selling takes more effort and volume is lower.
- **Wholesale** sells many units to a shop or trader at a lower price. The margin per unit is smaller, but you move stock quickly and free your money to reorder.

Example: landed cost ₦7,420. Retail at ₦12,000 gives ₦4,580 profit a unit. Wholesale at ₦9,500 for 10 or more gives ₦2,080 a unit. If you sell 10 units to one wholesaler you make ₦20,800 in a day. To make the same at retail you need to sell about five units, which may take a week of messages. Most importers use both: retail to earn well, wholesale to turn stock into cash.

## Stock, cash flow and reordering

Cash flow is where small importers fail. You pay the supplier first, wait weeks for the goods and then wait again to sell them. Your money is tied up all that time.

- **Know your sales rate.** Units sold per week or month.
- **Know your lead time.** From the day you order to the day stock is ready to sell.
- **Set a reorder point.** *Reorder point = monthly sales × (lead time in months + safety months).* If you sell 60 a month, lead time is 2 months and you want a 1-month safety buffer, reorder when stock falls to 60 × 3 = **180 units**.
- **Don't spend all your cash on one order.** Keep money for freight, duty and emergencies.
- **Track what has not sold.** Slow stock ties up money; discount it and move on.
- **Reinvest profit in what sells.** Don't spend profit on the next order until you have counted it.

A simple monthly record of money in, money out and stock in hand tells you more than guessing.

## Marketing imported goods

- **Show the product clearly.** Good photos and short videos, in use, are your best salespeople.
- **Say what the customer gets,** not only what the product is: "A power bank that charges your phone four times, lasts a week."
- **Be honest about quality and delivery time.** Complaints travel faster than praise.
- **Make it easy to buy.** A clear price, a WhatsApp link and a fast reply.
- **Use proof.** Customer photos, reviews and short testimonials.
- **Offer something for repeat buyers:** a small discount, a bundle or a referral reward.
- **Handle after-sales properly.** A replacement or refund policy builds trust that lets you charge more.

## Growing from one product to many

Once a product sells steadily:

1. **Reorder and test a better price,** a better supplier or better packaging.
2. **Add related products** your customers ask for, such as cases and cables with power banks.
3. **Build your brand:** a name, logo and consistent look, and eventually your own label with the supplier.
4. **Negotiate better terms** as your volume grows: lower unit prices, longer payment terms, priority production.
5. **Improve logistics:** move more volume to sea, buy from several suppliers, keep a small warehouse.
6. **Add channels,** and staff to answer messages and pack orders.

Add one new thing at a time and keep the winners funded.

## Try it

```task
{
  "id": "iemi-m10-t1",
  "prompt": "You sell about **60 units a month**. Your lead time from order to stock is **2 months** and you want a **1-month safety buffer**. Work out your **reorder point**. Then say in one sentence what happens if you wait until stock reaches zero.",
  "minutes": 8,
  "rows": 5,
  "placeholder": "Reorder point = ...",
  "rules": [
    { "label": "Reorder point of 180 units", "pattern": "\\b180\\b" },
    { "label": "Shows the calculation (60 x 3 or 60 x (2 + 1))", "pattern": "60\\s?[x×*]\\s?(3|\\(2\\s?\\+\\s?1\\))" },
    { "label": "Says what happens at zero (stock-out, lost sales, waiting)", "pattern": "stock-?out|run out|lost sales|no stock|miss|wait|empty|zero" }
  ],
  "sample": "Reorder point = monthly sales x (lead time + safety months) = 60 x (2 + 1) = 60 x 3 = 180 units.\nIf I wait until stock reaches zero, I will run out for about two months while the new order arrives and lose sales and customers.",
  "required": true
}
```

```task
{
  "id": "iemi-m10-t2",
  "prompt": "Write a **product listing** (a post or marketplace description) for the product you chose, in 50 to 110 words. Include what the customer gets, the price in naira, how delivery works and a clear call to action.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "20,000mAh power bank ...",
  "rules": [
    { "label": "States a price in naira", "pattern": "₦\\s?\\d|\\bngn\\b|naira" },
    { "label": "Says what the customer gets (benefit or feature)", "pattern": "charge|lasts?|fast|strong|durable|save|get|enjoy|never|keeps?" },
    { "label": "Explains delivery", "pattern": "deliver|dispatch|shipping|pickup|pick-up|within lagos|nationwide" },
    { "label": "Has a call to action", "pattern": "order|dm|whatsapp|message|call|buy|click|contact" },
    { "label": "Between 50 and 110 words", "minWords": 50, "maxWords": 115 }
  ],
  "sample": "Never run out of battery again. This 20,000mAh power bank charges a phone up to four times, with fast charging and two USB ports, in a strong black case. It is tested before sale and comes with a 3-month replacement guarantee. Price: ₦12,000 each, or ₦9,500 each when you buy 10 or more for your shop. Delivery within Lagos in 24 to 48 hours and to other states by courier in 3 to 5 days. To order, send us a WhatsApp message with your name, address and quantity, and we will confirm your order the same day.",
  "required": true
}
```

```task
{
  "id": "iemi-m10-t3",
  "prompt": "Choose **two sales channels** for your first 100 units and say for each why you chose it, what it costs you and how many units you expect to sell there. One channel per line.",
  "minutes": 8,
  "rows": 5,
  "placeholder": "Channel: ... - Why: ... - Units: ...",
  "rules": [
    { "label": "Two lines", "minLines": 2 },
    { "label": "Names real channels", "pattern": "instagram|whatsapp|facebook|tiktok|jumia|jiji|shop|market|wholesale|retail|website" },
    { "label": "Gives a reason in each line", "pattern": "why|because|since|cheap|reach|existing|customers|fast", "perLine": true },
    { "label": "Gives a number of units in each line", "pattern": "\\b\\d+\\s*(units?|pieces?|pcs)?", "perLine": true }
  ],
  "sample": "Channel: Instagram and WhatsApp retail - Why: it costs almost nothing and I already have customers who ask for it - Units: 40 at ₦12,000\nChannel: wholesale to three phone accessory shops - Why: they buy in bulk and turn my stock into cash fast - Units: 60 at ₦9,500",
  "required": false
}
```

Next lesson: exporting from Nigeria and finding buyers abroad.
