---
title: Product Research and Market Validation
minutes: 25
summary: Find product ideas, check real demand and competition, estimate your margin before you buy, test the market with a small order and avoid restricted or risky products.
---

## Start with the customer, not the supplier

Most failed imports start with "I found something cheap". Successful ones start with "people already want this and cannot get it at a good price". The cheapest product on a supplier site is only a good idea if someone will pay more for it in your market.

Ask three questions of every idea:

1. **Is there demand?** Are people already buying this, repeatedly?
2. **Is there a gap?** Is it overpriced, hard to find, low quality or poorly presented locally?
3. **Is there margin?** After every cost, is the profit worth the effort and the risk?

## Finding product ideas

- **Look at what sells now.** Visit markets, shops and online stores such as Jumia, Jiji and Instagram sellers. Note what is always out of stock and what gets many comments asking "price?".
- **Listen to complaints.** "I can never find a good X" is a product idea.
- **Check a marketplace's best sellers** and filter by what Nigerians search for.
- **Use free tools.** Google Trends shows whether interest is rising, steady or seasonal.
- **Think about your own access.** Products you understand, or customers you can reach, give you a head start.

Good beginner products are **small, light, durable and in constant demand**: phone accessories, beauty tools, kitchen items, stationery, baby items. Heavy, fragile or bulky goods eat your margin in freight and breakage.

## Checking demand and competition

For your shortlist, collect evidence, not feelings:

- **Search it** on Jumia, Jiji, Instagram and Google. How many sellers? What are they charging?
- **Read the reviews** of competitors. Repeated complaints are your opportunity.
- **Note the range of prices**: lowest, typical and highest. You will fit in somewhere.
- **Ask ten possible customers** what they would pay and what worries them.

Many sellers at similar prices means the market is proven but crowded. Few sellers and many questions may mean a gap, or may mean nobody wants it. Test, do not guess.

## Estimating margin before you buy

Do a rough sum first. **Margin** is profit as a percentage of the selling price:

*Profit = selling price - total cost per unit*, and *margin % = profit ÷ selling price × 100.*

Example: a power bank costs ₦6,500 to land in Lagos and sells for ₦10,000. Profit is ₦3,500. Margin is 3,500 ÷ 10,000 = **35%**.

Then be honest about what the rough sum leaves out: the supplier's price is only one part of cost. Module 9 builds a full landed cost calculator; for now use a safe shortcut and treat the **real cost as about 1.5 to 2 times the supplier's unit price** until you have the true figures. If it still leaves a healthy margin after that, keep the idea.

> [!TIP]
> Be wary of a margin that only works at the supplier's lowest price. Work it out at a normal price, and again with the dollar 10% higher.

## Testing the market with small orders

You do not need to prove an idea with a large order. Before committing:

- **Pre-sell.** Post the product with photos from the supplier (say they are sample photos) and collect names and deposits from real buyers.
- **Order a sample** (module 5), sell a few and see how people react.
- **Place a small first order**, just enough to learn. A few dozen units tells you a lot.

Decide in advance what success looks like. For example: "If I sell 20 of 30 units in three weeks at ₦9,000, I reorder."

## Avoiding restricted and risky products

Some goods cannot come in freely. Rules change, so **check the current position with the Nigeria Customs Service, the Standards Organisation of Nigeria (SON) or NAFDAC before you order**. As a guide:

- **Banned or restricted items**: some goods are prohibited from import. Others need a permit.
- **Regulated products**: food, drinks, medicines, cosmetics and supplements generally need NAFDAC approval to be sold. Electrical items and many manufactured goods are expected to meet SON standards.
- **Brand protection**: fake branded goods ("replicas") can be seized and bring legal trouble. Sell your own brand or genuinely authorised products.
- **Hard-to-ship goods**: batteries, liquids and aerosols have shipping restrictions, especially by air.

A quick check now is far cheaper than goods stuck at the port.

## Try it

```task
{
  "id": "iemi-m02-t1",
  "prompt": "Pick a product you might import (for example a power bank, ring light or kitchen blender). Write a **demand check** with at least four lines: where you looked, how many sellers you found, the lowest, typical and highest price in naira, and one complaint you saw in reviews.",
  "minutes": 15,
  "rows": 7,
  "placeholder": "Product: ...\nWhere I looked: ...\nPrices: ...",
  "rules": [
    { "label": "Names the product", "pattern": "product" },
    { "label": "Says where you looked (Jumia, Jiji, Instagram, Google, market)", "pattern": "jumia|jiji|instagram|google|market|shop|konga|facebook" },
    { "label": "Gives prices in naira", "pattern": "₦\\s?\\d|\\bngn\\b|naira|\\d{3,}" },
    { "label": "Mentions sellers or competition", "pattern": "seller|competitor|competition|vendor|shops?" },
    { "label": "Mentions a complaint or review", "pattern": "complain|review|problem|issue|wish|comment" },
    { "label": "At least four lines", "minLines": 4 }
  ],
  "sample": "Product: 20,000mAh power bank\nWhere I looked: Jumia, Jiji and three Instagram sellers\nSellers and competition: about 25 sellers on Jumia, lowest price ₦8,500, typical ₦12,000, highest ₦20,000 for known brands\nReview complaint: many reviews say the cheap ones lose their charge in a month and the stated capacity is not real",
  "required": true
}
```

```task
{
  "id": "iemi-m02-t2",
  "prompt": "A power bank lands in Lagos at **₦6,500** per unit and you can sell it for **₦10,000**. Work out the profit per unit and the margin as a percentage of the selling price. Then say what the margin would be if the real cost turned out to be **₦8,000**.",
  "minutes": 8,
  "rows": 5,
  "placeholder": "Profit = ...\nMargin = ...",
  "rules": [
    { "label": "Profit of ₦3,500", "pattern": "3,?500" },
    { "label": "Margin of 35%", "pattern": "\\b35\\s?%|35 percent|35 per cent" },
    { "label": "Profit of ₦2,000 at the higher cost", "pattern": "2,?000" },
    { "label": "Margin of 20% at the higher cost", "pattern": "\\b20\\s?%|20 percent|20 per cent" }
  ],
  "sample": "Profit = 10,000 - 6,500 = ₦3,500 per unit.\nMargin = 3,500 / 10,000 = 35%.\nIf the cost is ₦8,000: profit = 10,000 - 8,000 = ₦2,000, margin = 2,000 / 10,000 = 20%.",
  "required": true
}
```

```task
{
  "id": "iemi-m02-t3",
  "prompt": "Describe a **small test order** for your product in 40 to 90 words: how many units, how you will sell them, how long you will give it, and what result means you reorder.",
  "minutes": 8,
  "rows": 5,
  "placeholder": "I will order ... units and sell them by ...",
  "rules": [
    { "label": "Says how many units", "pattern": "\\b\\d+\\s*(units?|pieces?|pcs|items?)|\\b\\d+\\b" },
    { "label": "Says how you will sell", "pattern": "instagram|whatsapp|jumia|jiji|shop|friends|market|online|pre-?sell" },
    { "label": "Gives a time window", "pattern": "\\d+\\s*(days?|weeks?|months?)" },
    { "label": "States a success measure for reordering", "pattern": "reorder|re-order|order again|repeat" },
    { "label": "Between 40 and 90 words", "minWords": 40, "maxWords": 95 }
  ],
  "sample": "I will order 30 units of the power bank and sell them on Instagram and WhatsApp, starting with ten pre-sold to people who already asked me for the price. I will give it 3 weeks. If I sell at least 20 units at ₦10,000 or more and hear no major complaints about quality, I will reorder a larger batch. If fewer than 10 sell, I will change the product or price before spending any more money.",
  "required": false
}
```

Next lesson: where suppliers are and how to read what they show you.
