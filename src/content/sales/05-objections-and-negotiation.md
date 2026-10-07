---
title: Objections and Negotiation
minutes: 25
summary: Understand why people object, handle price, trust and timing objections, apply negotiation principles, give discounts without losing value and walk away well.
---

## Why people object

An **objection** is a customer's concern or hesitation. It is not a "no." It is a **request for more information or reassurance.** In fact, a customer who raises objections is engaged. The ones who say nothing and disappear are the real problem.

Common reasons:

- **They do not yet see enough value.**
- **They do not trust** you, the product or the company yet.
- **Fear of risk or change:** "What if it doesn't work?"
- **Price or budget** concerns.
- **Bad timing:** other priorities or cash constraints.
- **They need to consult others.**
- **Past bad experience** with similar products.

Treat every objection with respect. Argue and you lose; **understand and answer** and you move forward.

## Handling price, trust and timing objections

A simple, reliable pattern is **Listen, Clarify, Respond, Check:**

1. **Listen** fully, without interrupting.
2. **Acknowledge:** "I understand, that's a fair concern."
3. **Clarify** the real issue: "When you say it's expensive, is that compared with something, or is it more than you budgeted?"
4. **Respond** with facts, proof or a solution.
5. **Check:** "Does that answer your concern?"

**Price objections** ("It's too expensive"). Often mean the customer does not yet see the value, or compares unlike things. Respond by moving from price to **value and total cost**:

- Show what the problem costs them now.
- Show the **payback**: Example: a system costs ₦900,000 and saves ₦60,000 a month in fuel. Payback = 900,000 ÷ 60,000 = **15 months.** After that, the saving is profit, and the system lasts for years.
- Compare **total cost of ownership,** not just the purchase price.
- Offer options: a smaller package, a phased installation, or payment in instalments.

**Trust objections** ("I don't know your company"). Respond with **proof**: references, case studies, a visit to a similar customer, a warranty, a trial or a small first order, certificates and a clear contract.

**Timing objections** ("Not now," "Call me next year"). Find out why: *"What would need to be true for this to become a priority?"* Show the **cost of waiting** (each month of delay costs ₦120,000 in fuel). Agree a specific follow-up date and a small next step. Some are genuine; respect that, and stay in touch usefully.

**"I need to think about it."** Ask kindly: *"Of course. What parts would you like to think about?"* The real concern is often one you can answer now.

## Negotiation principles

Negotiation begins when the customer wants to buy but wants better terms. Principles:

- **Prepare:** know your target, your lowest acceptable terms (walk-away point) and what else you can offer besides price.
- **Know the customer's priorities,** and the alternatives they have.
- **Do not negotiate against yourself.** After you state a price, wait. Do not offer a discount no one asked for.
- **Trade, don't just give.** Every concession should get something back: a larger order, faster payment, a longer contract, a reference.
- **Negotiate the whole package:** price, quantity, delivery, payment terms, warranty, installation, support.
- **Stay calm and respectful.**
- **Aim for a fair deal both sides can live with,** since a customer who feels cheated will not return.

## Discounts without losing value

Discounts cost more than they appear. Example: a product costs you ₦650,000 and sells at ₦900,000, a profit of ₦250,000 (27.8% margin). A 10% discount gives a price of ₦810,000 and a profit of ₦160,000 (19.8% margin). That is 36% less profit per sale. To earn the same total profit, you would need to sell **250,000 ÷ 160,000 = 1.5625 times as many**, 56% more units, just to stand still.

So protect value:

- **Hold your price when you can,** and justify it with value.
- **Give small, conditional discounts** for something in return: "I can do ₦870,000 if you confirm today and pay the deposit now."
- **Offer value-adds instead of cuts:** extra warranty, free installation, training, a service visit, faster delivery.
- **Use volume or term discounts** with clear rules.
- **Never discount to everyone.** Set rules for who can approve what.
- **Avoid training customers to wait for discounts.**

## Walking away well

Sometimes the right answer is no. If terms would cost you money, damage your business or the customer is a poor fit, **walk away politely.** Be clear and professional: *"I'm sorry we couldn't find terms that work for both of us. If your situation changes, I would be glad to help."* Leave the door open. Customers often return, and a respectful exit protects your reputation. Walking away is easier if you have other prospects in your pipeline, which is another reason to keep prospecting.

## Try it

```task
{
  "id": "bds-m05-t1",
  "prompt": "A customer says **\"₦900,000 is too expensive.\"** The system saves **₦60,000 a month** in fuel. Work out the **payback period** in months and write a short reply (40 to 90 words) that moves from price to value.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Payback = ...",
  "rules": [
    { "label": "Payback of 15 months", "pattern": "\\b15\\s*months" },
    { "label": "Acknowledges the concern", "pattern": "understand|fair|appreciate|good question|i hear" },
    { "label": "Moves to value or savings", "pattern": "save|saving|value|payback|pays for itself|after that|profit" },
    { "label": "Checks or asks a question", "pattern": "\\?" },
    { "label": "Between 40 and 100 words in total", "minWords": 40, "maxWords": 105 }
  ],
  "sample": "Payback = 900,000 / 60,000 = 15 months.\nI understand, ₦900,000 is a lot to invest. Compared with your fuel bill, though, the system pays for itself in 15 months, and after that the ₦60,000 a month saved is extra profit for years. Is the concern the total amount, or how to pay for it? If it is the amount, we could look at paying in instalments.",
  "required": true
}
```

```task
{
  "id": "bds-m05-t2",
  "prompt": "A product costs you **₦650,000** and sells at **₦900,000**. The customer asks for **10% off**. Work out the profit and margin at full price and at the discount, and how many times more units you would need to sell to earn the same total profit.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Profit at full price = ...",
  "rules": [
    { "label": "Profit of ₦250,000 at full price", "pattern": "250,?000" },
    { "label": "Discounted price of ₦810,000", "pattern": "810,?000" },
    { "label": "Profit of ₦160,000 at the discount", "pattern": "160,?000" },
    { "label": "Margin of about 19.8% at the discount", "pattern": "19\\.8|19\\.75|20 ?%" },
    { "label": "About 56% more units (1.56 times)", "pattern": "1\\.56|56 ?%|1\\.5625" }
  ],
  "sample": "At full price: profit = 900,000 - 650,000 = ₦250,000, a margin of 27.8%.\nWith 10% off: price = ₦810,000, profit = 810,000 - 650,000 = ₦160,000, a margin of 19.8%.\nTo earn the same total profit I need 250,000 / 160,000 = 1.56 times as many sales, about 56% more units.",
  "required": true
}
```

```task
{
  "id": "bds-m05-t3",
  "prompt": "A customer says: **\"If you give me 10% off I'll buy today.\"** Write your reply (50 to 100 words) that **trades** a smaller concession for something in return instead of just giving the 10%.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Thank you for ...",
  "rules": [
    { "label": "Polite and positive", "pattern": "thank|appreciate|glad|happy|understand" },
    { "label": "Offers a smaller concession or a value-add", "pattern": "\\b[1-5]\\s?%|free|extra|installation|warranty|training|instalment" },
    { "label": "Asks for something in return", "pattern": "if you|in return|provided|when you|on condition|confirm|deposit|today|larger|refer" },
    { "label": "Does not simply agree to 10%", "pattern": "i can give you 10|agree to 10|yes,? 10", "absent": true },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "Thank you, I appreciate that you are ready to buy today. A full 10% would take the price below what I can offer, but I can do 4% off, and add free installation worth ₦50,000, if you confirm the order today with the deposit. That brings your total benefit to around ₦86,000. I also hold the price for your next order if you refer a neighbouring shop. Does that work for you?",
  "required": false
}
```

Next lesson: proposals and closing.
