---
title: Niche and Product Selection
minutes: 25
summary: Find a niche, research product demand, source from suppliers and price for profit after every cost of an online order.
---

## Finding a niche

A **niche** is a focused segment of the market: a specific type of customer with specific needs. "Bags" is a category; "durable, stylish work totes for women who commute in Lagos" is a niche. A focused niche makes everything easier: you know who to talk to, what to stock, how to describe it, where to advertise and why customers should pick you over bigger sellers.

Good niches are:

- **Specific enough** to stand out, but **large enough** to earn from.
- **Close to something you know or care about,** so you can sell with authority and stay motivated.
- **Reachable,** with communities, groups, hashtags or places where those customers gather.
- **Backed by demand:** people already spend money on the problem.
- **Profitable:** the margins work after all costs.

Ways to find one: start with your own interests and skills; notice problems people complain about; follow trends in marketplaces and social media; look at what people ask for in groups and comments; and consider seasonal and event-driven needs (school, weddings, festivals).

Write a **niche statement:** *"We sell [product type] for [customer] who [need/problem], with [difference]."*

## Product research and demand

Before you commit money, **check demand and competition.**

- **Marketplaces:** search your product on Jumia, Jiji and others. How many sellers? What are the prices? How many reviews and sales? Which reviews are negative, and why?
- **Search interest:** Google Trends and search suggestions show whether interest is rising, steady or seasonal.
- **Social media:** look at Instagram and TikTok hashtags, creators and comments. What do people ask?
- **Direct feedback:** ask potential customers, post a test and see if people ask the price.
- **Pre-sell:** take orders or deposits before buying stock.

Good beginner products are often **small, light, durable and easy to ship,** with a **healthy margin** and **repeat or related purchases** (consumables, accessories). Be careful with: fragile or heavy goods, items needing special approval (for example NAFDAC-regulated products), and branded goods you are not authorised to sell, since fake or unauthorised branded goods bring legal trouble.

## Suppliers and sourcing

Where you get products shapes your costs and quality.

- **Local makers and tailors,** for custom or handmade items; easy to check and fast.
- **Wholesale markets and distributors** in Nigeria.
- **Importers and wholesalers** who bring in goods.
- **Direct imports** from overseas suppliers (see the Import, Export & Mini Importation course), for higher margins with more risk.
- **Dropship suppliers,** who ship for you.

For any supplier: **order samples,** check quality and consistency, compare at least three, agree prices, minimum order, lead time and returns in writing, start small and **test with a small order.** Keep a second supplier in mind.

## Pricing and profit per order

Price must cover **every cost** and leave a profit. For one online order, add up:

| Item | Example |
| :-- | :-- |
| Selling price | ₦12,000 |
| Product cost | ₦6,500 |
| Packaging | ₦500 |
| Delivery paid by you | ₦1,000 |
| Payment fee (1.5%) | ₦180 |
| **Contribution before marketing** | **₦3,820** |
| Marketing cost per order | ₦1,500 |
| **Profit per order** | **₦2,320** (19.3% margin) |

Check: 12,000 − 6,500 − 500 − 1,000 − 180 = **3,820.** Then 3,820 − 1,500 = **2,320**, and 2,320 ÷ 12,000 = **19.3%.**

The contribution before marketing (₦3,820) is the **most you can spend on marketing per order and still break even.** If you sell ₦12,000 per order, your **break-even ROAS** (revenue ÷ ad spend) is 12,000 ÷ 3,820 = **3.14.** Ads that return less than ₦3.14 for each ₦1 spent lose money.

**Pricing approaches:**

- **Cost-plus:** add your target margin to your total cost.
- **Competitor-based:** match the market, and justify any difference with value.
- **Value-based:** price on what the product is worth to the customer.
- **Bundles and tiers:** raise the average order value (two items at a small discount).
- **Psychology:** a clear, consistent price; avoid constant discounts that teach customers to wait.

Always test: a small price rise often loses fewer customers than expected.

## Try it

```task
{
  "id": "ecom-m02-t1",
  "prompt": "Selling price **₦12,000**, product cost **₦6,500**, packaging **₦500**, delivery paid by you **₦1,000**, payment fee **1.5%**. Work out the payment fee, the **contribution before marketing**, the **break-even ROAS**, and the **profit per order** if marketing costs **₦1,500** an order.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Payment fee = ...",
  "rules": [
    { "label": "Payment fee of ₦180", "pattern": "\\b180\\b" },
    { "label": "Contribution of ₦3,820", "pattern": "3,?820" },
    { "label": "Break-even ROAS of about 3.14", "pattern": "3\\.1[0-9]?" },
    { "label": "Profit of ₦2,320", "pattern": "2,?320" }
  ],
  "sample": "Payment fee = 1.5% of 12,000 = ₦180.\nContribution before marketing = 12,000 - 6,500 - 500 - 1,000 - 180 = ₦3,820.\nBreak-even ROAS = 12,000 / 3,820 = 3.14.\nProfit per order = 3,820 - 1,500 = ₦2,320.",
  "required": true
}
```

```task
{
  "id": "ecom-m02-t2",
  "prompt": "Write your **niche statement** and a short **product shortlist**: the niche statement in one sentence, then three products with an expected price and unit cost. One item per line.",
  "minutes": 12,
  "rows": 7,
  "placeholder": "Niche: We sell ... for ... who ..., with ...\nProduct 1: ... price ₦... cost ₦...",
  "rules": [
    { "label": "Has a niche statement", "pattern": "niche|we sell" },
    { "label": "Names a customer and a need", "pattern": "for [a-z]|who " },
    { "label": "Lists three products", "pattern": "product 1[\\s\\S]*product 2[\\s\\S]*product 3" },
    { "label": "Gives price and cost in naira", "pattern": "price[^\\n]*₦[^\\n]*cost[^\\n]*₦|cost[^\\n]*₦[^\\n]*price[^\\n]*₦", "min": 3 }
  ],
  "sample": "Niche: We sell durable, stylish work totes for women who commute in Lagos and need to carry a laptop, with local ankara designs.\nProduct 1: ankara laptop tote - price ₦12,000 - cost ₦6,500\nProduct 2: matching clutch pouch - price ₦4,500 - cost ₦2,000\nProduct 3: tote and pouch gift set - price ₦15,500 - cost ₦8,300",
  "required": true
}
```

```task
{
  "id": "ecom-m02-t3",
  "prompt": "Describe how you will **research demand and test a supplier** for your first product in 60 to 120 words: where you will look, what you will count, how you will check the supplier and your first small order.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "First I will check ...",
  "rules": [
    { "label": "Says where to research demand", "pattern": "jumia|jiji|instagram|tiktok|google|marketplace|trends|groups" },
    { "label": "Says what to count or look for", "pattern": "sellers|reviews|prices|price|complain|questions|demand|how many" },
    { "label": "Says how the supplier is checked (sample, references, visit)", "pattern": "sample|reference|visit|compare|three suppliers|quality" },
    { "label": "Describes a small first order or pre-sale", "pattern": "small|first order|\\d+\\s*(units|pieces)|pre-?sell|deposit|test" },
    { "label": "Between 60 and 120 words", "minWords": 60, "maxWords": 125 }
  ],
  "sample": "First I will search tote bags on Jumia and Jiji and count how many sellers there are, their prices and the main complaints in reviews. I will also check Instagram hashtags and Google Trends. Then I will order samples from three local tailors, compare quality, price and lead time, and ask each for references. I will pre-sell 10 bags on Instagram with a small deposit, then place a first order of 20 pieces with the best supplier to test quality before I buy more.",
  "required": false
}
```

Next lesson: building your store.
