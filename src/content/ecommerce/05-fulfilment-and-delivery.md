---
title: Fulfilment and Delivery
minutes: 20
summary: Manage stock and inventory, pack orders properly, choose couriers and delivery options and handle tracking and delays.
---

## Stock and inventory

**Fulfilment** is everything between "order placed" and "order received": picking the item, packing it, handing it to a courier and making sure it arrives. It is where many online businesses succeed or fail, because customers judge you by what arrives and when.

**Inventory** is the stock you hold. Keep it organised:

- **Know what you have.** Count regularly and record every item in and out in a simple sheet or your store system.
- **Label and store properly:** a clean, dry, secure place, with each product in its own labelled spot.
- **Track by variant** (size, colour), since each sells differently.
- **Reorder in time.** *Reorder point = daily sales × (lead time + safety days).* If you sell 8 a day, restocking takes 10 days and you want 5 days of safety, reorder when stock falls to 8 × (10 + 5) = **120 units.** With 120 units in hand and 8 sold a day, you have 120 ÷ 8 = **15 days** of cover.
- **Avoid overselling:** keep the website and your records updated so you do not sell what you do not have. Mark items "out of stock" or allow pre-orders clearly.
- **Watch slow stock** and clear it with bundles or discounts, because money sitting on shelves earns nothing.
- **Protect against loss:** controlled access, a record of who takes what and regular checks.

Small sellers can start from home, but plan space as you grow: a corner for stock, a table for packing and a place for returns.

## Packaging

Good packaging protects the product, reduces returns and is part of your brand.

- **Protect:** strong boxes or mailers, padding for fragile items, waterproof bags and tape that holds.
- **Right-size:** boxes that fit the product save on materials and sometimes on courier charges (some charge by size as well as weight).
- **Be consistent and branded:** a sticker, a thank-you card or ribbon makes a good first impression and encourages sharing, without costing much.
- **Include** the packing slip or invoice, care instructions and a return form if needed.
- **Label clearly:** the customer's name, address and phone number, with your return address.
- **Check before sealing:** right item, right size and colour, no defects.
- **Photograph or record** the packed item for important orders, as evidence if there is a dispute.
- **Think of cost and the environment:** avoid excessive plastic, reuse where you can.

Test your packaging by dropping a sample parcel and shaking it. If it would arrive damaged, fix it before customers find out.

## Couriers and delivery options

Customers expect clear delivery choices and fair prices. Ways to deliver:

| Option | Good for | Watch out for |
| :-- | :-- | :-- |
| **Your own rider or driver** | Same-day local deliveries, control | Cost, reliability, handling many orders |
| **Local dispatch riders and courier companies** | Within a city, fast | Quality varies; vet them |
| **Nationwide couriers and logistics companies** | Deliveries across states | Longer times; pickup points and fees |
| **Parks and motor-park carriers** | Cheap long distance | Weak tracking and security |
| **Pickup stations or pickup from you** | Reducing cost; customers who prefer it | Customer convenience |
| **International courier** | Customers abroad | Cost, customs and duties |

Choose couriers by **price, speed, reliability, coverage, tracking, handling of damage and payment remittance** (especially for pay on delivery). Test several with a few orders, and keep a back-up.

Example comparison for Lagos: **Courier A** charges ₦1,500, delivers next day with 95% on-time. **Courier B** charges ₦1,100, takes 2 to 3 days with 80% on-time. B saves ₦400 per order, but if 20% of its deliveries are late and each late delivery causes a complaint or refund costing about ₦2,000, the expected cost of lateness is 0.20 × 2,000 = ₦400, wiping out the saving and harming your reputation. **Reliability often beats the cheapest price.**

**Delivery pricing options:** flat rate, rate by zone or weight, **free delivery above a minimum order** (for example, free over ₦20,000, which encourages bigger baskets), or delivery included in the price. Whatever you choose, show it clearly **before checkout** so customers are not surprised.

## Tracking and delays

Customers hate silence. Keep them informed:

- **Confirm the order** immediately, with the expected delivery date.
- **Send dispatch notice** with the courier's name and tracking number or rider's phone number.
- **Track parcels** yourself and act on delays quickly.
- **Tell the customer early** if something is late, with the cause and a new date, instead of waiting for them to ask.
- **Have a plan for common problems:** unavailable customer, wrong address, damaged parcel, lost parcel, courier strike or weather delay.
- **Record delivery proof:** signature, photo or code.

Measure your delivery performance: **on-time rate, failed delivery rate, damage rate, cost per delivery and delivery complaints.** Review each month, talk to your couriers about problems and fix recurring causes.

## Try it

```task
{
  "id": "ecom-m05-t1",
  "prompt": "You sell **8 units a day**, restocking takes **10 days** and you want **5 days of safety stock**. Work out the **reorder point**. You currently hold **120** units: how many **days of cover** is that, and should you reorder now?",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Reorder point = ...",
  "rules": [
    { "label": "Reorder point of 120 units", "pattern": "\\b120\\b" },
    { "label": "Days of cover of 15", "pattern": "\\b15\\b" },
    { "label": "Says to reorder now (stock is at the reorder point)", "pattern": "reorder now|should reorder|yes|at the reorder point|now" }
  ],
  "sample": "Reorder point = 8 x (10 + 5) = 120 units.\nDays of cover = 120 / 8 = 15 days.\nStock is exactly at the reorder point, so I should reorder now.",
  "required": true
}
```

```task
{
  "id": "ecom-m05-t2",
  "prompt": "Courier A charges **₦1,500**, next day, **95%** on time. Courier B charges **₦1,100**, 2 to 3 days, **80%** on time. Each late delivery costs about **₦2,000** in complaints and refunds. Work out the expected cost of lateness per order for each and say which you would choose, with a reason.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "A lateness cost = ...",
  "rules": [
    { "label": "A lateness cost of ₦100", "pattern": "\\b100\\b" },
    { "label": "B lateness cost of ₦400", "pattern": "\\b400\\b" },
    { "label": "Total cost of A ₦1,600 and B ₦1,500", "pattern": "1,?600[\\s\\S]*1,?500|1,?500[\\s\\S]*1,?600" },
    { "label": "Makes a choice with a reason (reliability, reputation, speed)", "pattern": "choose|pick|prefer|go with|reliab|reputation|faster|next day" }
  ],
  "sample": "A: 5% late x ₦2,000 = ₦100 expected lateness cost, so total = 1,500 + 100 = ₦1,600 per order.\nB: 20% late x ₦2,000 = ₦400, so total = 1,100 + 400 = ₦1,500 per order.\nB looks slightly cheaper, but the difference is only ₦100 and A is faster and more reliable, which protects my reputation, so I would choose A for most orders and use B for non-urgent ones.",
  "required": true
}
```

```task
{
  "id": "ecom-m05-t3",
  "prompt": "Write your **order fulfilment checklist** from order received to delivered: at least eight steps in order, one per line.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "1. Confirm payment ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Confirm payment or order", "pattern": "confirm|payment|order" },
    { "label": "Pick or check the item", "pattern": "pick|check|inspect|quality|right item" },
    { "label": "Pack and label", "pattern": "pack|label|box" },
    { "label": "Hand to courier or dispatch", "pattern": "courier|rider|dispatch|hand" },
    { "label": "Send tracking information", "pattern": "track|notify|message|update" },
    { "label": "Confirm delivery or follow up", "pattern": "deliver|follow|review|proof" }
  ],
  "sample": "1. Confirm the payment in the bank app or gateway.\n2. Print or write the order and the delivery address.\n3. Pick the right item, size and colour from the shelf.\n4. Inspect it for defects.\n5. Pack it in a protective box with the invoice and a thank-you card.\n6. Label the parcel clearly with the customer's details.\n7. Hand it to the courier and record the pickup.\n8. Message the customer with the tracking number and delivery date.\n9. Follow up on delays and confirm delivery with proof.\n10. Ask for a review after delivery.",
  "required": false
}
```

Next lesson: marketing and traffic.
