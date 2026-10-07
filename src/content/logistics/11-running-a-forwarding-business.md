---
title: Running a Forwarding Business
minutes: 30
summary: Understand the business models for forwarders, the licences and requirements to check in Nigeria, how to price for profit and how to find and keep customers.
---

> [!NOTE]
> Licensing and regulatory requirements change. Use this lesson as a checklist of questions, and **confirm the current requirements with the relevant authorities and professional bodies** before you start.

## Business models for forwarders

Not every forwarder is the same. Common models:

| Model | What it does | Notes |
| :-- | :-- | :-- |
| **Asset-light freight forwarder** | Arranges transport using other companies' ships, planes and trucks | Lowest startup cost; profit comes from the margin and service |
| **Consolidator** | Combines many small shipments into full containers or pallets | Needs volume and a reliable network |
| **NVOCC** | Sells container space under its own bill of lading | More responsibility; needs capital and systems |
| **Customs broker / clearing agent** | Specialises in customs clearance | Needs licence, knowledge and relationships |
| **Courier / express and last-mile delivery** | Moves small parcels | Needs route density and technology |
| **Warehousing and 3PL (third-party logistics)** | Stores and distributes for customers | Needs property, equipment and people |
| **Niche specialist** | Focuses on a type of cargo (perishables, machinery, e-commerce, imports for small traders) | Easier to stand out; builds expertise |

A beginner often starts as a **small asset-light forwarder or agent for a niche**, such as helping small traders import from China, and adds services as the business grows.

## Licences and requirements in Nigeria

Check carefully what you need. Typical areas to investigate:

- **Business registration** with the Corporate Affairs Commission, and a Tax Identification Number, with tax registration and returns.
- **Customs licence** if you will clear goods yourself, and arrangements with licensed clearing agents if not.
- **Memberships and approvals** in the freight and clearing industry and with relevant regulators for shipping, aviation or road transport.
- **Insurance:** goods in transit, warehouse, vehicles, and professional or liability cover.
- **Contracts and terms of business:** standard trading conditions that limit liability and set payment terms.
- **Bank account and accounting** in the company name.
- **Premises, vehicles and staff,** with the right permits and safety arrangements.
- **Compliance procedures** for documents, dangerous goods and anti-bribery.

Ask an experienced forwarder, an industry association and a lawyer or accountant. Do not guess.

## Pricing and profit

A forwarder earns from the **margin** between what carriers and suppliers charge and what the customer pays, plus fees for services such as documentation and clearance.

Example: for one shipment the carrier and local costs total **$1,050**. You quote the customer **$1,300**.
- Profit = 1,300 − 1,050 = **$250**.
- Margin on selling price = 250 ÷ 1,300 = **19.2%**.
- Markup on cost = 250 ÷ 1,050 = **23.8%**.

Be clear which you are using. Also count your **overheads**: rent, staff, software, phone, marketing, insurance, licences and your own time. If your margin per shipment is $250 and your monthly overhead is $2,000, you need **8 shipments** a month to break even ($2,000 ÷ $250 = 8), and more to make a profit.

Tips:

- **Price for value, not just cost.** Service, speed and reliability support a better margin.
- **Never quote without current rates.** Include a validity period.
- **Add a contingency** for currency and minor extras, and say what is excluded.
- **Watch cash flow:** you often pay carriers before your customer pays you. Agree payment terms, take deposits and chase late payments.

## Finding and keeping customers

- **Pick a niche** and become the expert: for example, small importers from China, exporters of agricultural produce or online shops.
- **Be visible:** a clear website or social profile, listings, and a simple explanation of what you do and for whom.
- **Network:** trade associations, markets, chambers of commerce, trade fairs, and referrals from carriers and customs agents.
- **Reach out directly** to traders, manufacturers, online sellers and exporters, offering a free quote and a short consultation.
- **Give a clear, fast quote** with all charges and honest timing.
- **Deliver reliably** and communicate early, especially when something goes wrong.
- **Ask for referrals and testimonials** after a good job.
- **Keep in touch** with past customers, since repeat business is cheaper than finding new customers.

One happy customer who tells five others is the best advertising a forwarder has.

## Try it

```task
{
  "id": "lff-m11-t1",
  "prompt": "The carrier and local costs of a shipment total **$1,050** and you quote **$1,300**. Your monthly overhead is **$2,000**. Work out the profit, the margin on selling price, the markup on cost and how many such shipments you need a month to break even.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Profit = ...",
  "rules": [
    { "label": "Profit of $250", "pattern": "\\$?\\s?250\\b" },
    { "label": "Margin of about 19.2%", "pattern": "19\\.2|19\\.23|19 ?%" },
    { "label": "Markup of about 23.8%", "pattern": "23\\.8|23\\.81|24 ?%" },
    { "label": "Break-even of 8 shipments", "pattern": "\\b8\\b|eight" }
  ],
  "sample": "Profit = 1,300 - 1,050 = $250.\nMargin on selling price = 250 / 1,300 = 19.2%.\nMarkup on cost = 250 / 1,050 = 23.8%.\nBreak-even = overhead 2,000 / profit per shipment 250 = 8 shipments a month.",
  "required": true
}
```

```task
{
  "id": "lff-m11-t2",
  "prompt": "Choose a **niche** for a new freight forwarding business and write your plan in 60 to 130 words: who your customers are, what you offer, why you will be better than a general forwarder, and how you will find your first five customers.",
  "minutes": 15,
  "rows": 9,
  "placeholder": "My niche is ...",
  "rules": [
    { "label": "Names the niche and its customers", "pattern": "niche|customers?|traders?|importers?|exporters?|shops?|sellers?|farmers?" },
    { "label": "Says what is offered", "pattern": "offer|service|shipping|clearing|freight|consolidat|deliver|quote" },
    { "label": "Says why you are better", "pattern": "because|better|expert|specialis|focus|know|understand|fast|reliab" },
    { "label": "Says how to find first customers", "pattern": "first (five|5)|network|whatsapp|referral|association|market|instagram|contact|reach|visit" },
    { "label": "Between 60 and 130 words", "minWords": 60, "maxWords": 135 }
  ],
  "sample": "My niche is helping small online sellers in Lagos import goods from China. I offer consolidated air and sea freight, a clear all-in quote with duty estimates, document checking and delivery to the customer's door. I will be better than a general forwarder because I focus on small shipments, explain every charge in plain language and update customers on WhatsApp at each milestone. To find my first five customers I will join online seller groups, offer a free quote and landed cost check, ask my own contacts for referrals, and visit two markets with a one-page offer.",
  "required": true
}
```

```task
{
  "id": "lff-m11-t3",
  "prompt": "List **six requirements or questions** you would check before starting a forwarding business in Nigeria. One per line.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "Business registration ...",
  "rules": [
    { "label": "Six lines", "minLines": 6 },
    { "label": "Mentions registration (CAC) or tax", "pattern": "cac|registration|registered|tax|tin" },
    { "label": "Mentions customs licence or licensed agent", "pattern": "customs|licen[cs]|clearing agent" },
    { "label": "Mentions insurance", "pattern": "insurance|insure" },
    { "label": "Mentions trading terms or contracts", "pattern": "terms|contract|conditions|liability" },
    { "label": "Mentions bank, accounting or cash flow", "pattern": "bank|account|cash flow|capital|payment" }
  ],
  "sample": "Register the business with the CAC and get a TIN and tax registration.\nCheck whether I need a customs licence or must work through a licensed clearing agent.\nFind out which industry memberships and approvals apply to freight forwarding.\nArrange insurance for goods in transit and professional liability.\nWrite standard terms of business that set liability limits and payment terms.\nOpen a business bank account and plan cash flow, because I will pay carriers before customers pay me.",
  "required": false
}
```

Next lesson: your own shipment plan.
