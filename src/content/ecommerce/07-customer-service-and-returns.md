---
title: Customer Service and Returns
minutes: 25
summary: Answer customers well, set a fair returns and refunds policy, handle complaints calmly and build loyalty that brings repeat sales.
---

## Answering customers well

Online, customer service **is** the shop assistant. Fast, friendly, accurate answers make the difference between a sale and a lost customer.

**Principles:**

- **Reply quickly.** Set a standard (for example within one hour in working hours) and say so. Use **quick replies** for common questions and an away message after hours.
- **Be clear and polite.** Use the customer's name, short sentences and plain words.
- **Answer the question fully,** and add the next step ("Would you like me to reserve one?").
- **Be honest** about stock, delivery times and product limits. Do not promise what you cannot deliver.
- **Keep records** of conversations and orders.
- **Know your products and policies,** and keep a short FAQ for yourself and customers.
- **Match the channel:** reply where the customer wrote (WhatsApp, Instagram, email).

Most questions repeat: price, sizes, availability, delivery time and cost, payment, returns. Put the answers on your store, in your highlights and in saved replies.

## Returns and refunds

Returns are a normal part of online selling, because customers cannot touch the product first. A clear, fair policy **increases sales** (customers feel safe) and reduces arguments.

A good policy states:

- **What can be returned** (unused, in original packaging, with proof of purchase) and **what cannot** (for hygiene reasons, personalised or perishable items).
- **How long they have** (for example 7 days from delivery).
- **How to start** a return (a message with order number and photos).
- **Who pays return shipping** (you if the item is faulty or wrong; the customer if they changed their mind).
- **What the customer gets:** refund to the original method, exchange or store credit, and how long a refund takes.
- **Faulty, damaged or wrong items:** always fixed at your cost, quickly.

Follow consumer protection rules that apply to you, and never promise what the law or your policy does not allow.

Know the **cost of returns.** Example: 200 orders a month, **5%** returned = 10 returns. If each return costs ₦3,000 in delivery both ways and handling, the monthly cost is 10 × 3,000 = **₦30,000**, before any lost margin on refunded orders. Reduce returns by:

- **Accurate descriptions, sizes and photos.**
- **Quality checks** before dispatch.
- **Good packaging.**
- **Asking customers sensible questions** (size, use) before they buy.
- **Analysing reasons** for returns and fixing the cause.

## Handling complaints

A complaint is a chance to keep a customer. Use a simple method:

1. **Listen** and let them finish. Do not argue or interrupt.
2. **Apologise** sincerely for the problem or the experience.
3. **Take ownership:** "I will sort this out for you."
4. **Find the facts** (order number, photos, dates) and check what happened.
5. **Offer a fair solution:** replacement, repair, refund, discount or another remedy, and a clear timeline.
6. **Do it** and confirm with the customer.
7. **Learn:** record the cause and fix the process.

Stay calm even with angry or rude customers. Do not take it personally and do not reply in anger or in public. If the customer is clearly dishonest, stay polite, stick to your policy and keep your evidence.

Example reply: *"Hello Ngozi, I am very sorry that your tote arrived with a broken zip. That is not the quality we want you to receive. Please send a photo, and I will send a replacement today at no cost. You will have it by Thursday. Thank you for your patience."*

**Respond to public complaints** (reviews, social comments) politely and briefly, offer to resolve it privately and then update once solved. Other readers watch how you behave.

## Building loyalty

Keeping a customer costs far less than finding a new one. Repeat customers spend more and recommend you.

Ways to build loyalty:

- **Deliver well, every time.** Reliability is the best loyalty programme.
- **Thank customers** and include a small personal touch.
- **Follow up** after delivery to ask if all is well.
- **Reward repeat buyers:** points, a discount on the third order, early access to new items.
- **Keep in touch** with useful messages, restock alerts and personalised suggestions.
- **Listen:** ask for feedback and show what you changed.
- **Create community:** a WhatsApp group or page for your best customers.

Measure it: the **repeat purchase rate** is customers who buy again ÷ total customers. If 60 of 200 customers order again, the repeat rate is 60 ÷ 200 = **30%.** Raising it from 30% to 40% means 20 more repeat customers without ad costs. Track it monthly.

## Try it

```task
{
  "id": "ecom-m07-t1",
  "prompt": "Of **200 orders**, **5%** are returned and each return costs **₦3,000**. 60 of **200 customers** order again. Work out the number of returns, the monthly cost of returns and the repeat purchase rate.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Returns = ...",
  "rules": [
    { "label": "10 returns", "pattern": "\\b10\\b" },
    { "label": "Cost of ₦30,000", "pattern": "30,?000" },
    { "label": "Repeat rate of 30%", "pattern": "\\b30\\s?%" }
  ],
  "sample": "Returns = 5% of 200 = 10.\nCost = 10 x 3,000 = ₦30,000.\nRepeat purchase rate = 60 / 200 = 30%.",
  "required": true
}
```

```task
{
  "id": "ecom-m07-t2",
  "prompt": "Write your **returns and refund policy** in at least six lines: what can be returned, the time limit, how to start a return, who pays shipping, what the customer receives and how faulty items are handled.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Returns window: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "States what can be returned", "pattern": "unused|original packaging|can be returned|eligible|proof of purchase" },
    { "label": "States a time limit in days", "pattern": "\\d+\\s*days?" },
    { "label": "States how to start a return", "pattern": "message|contact|whatsapp|email|order number|photos" },
    { "label": "States who pays shipping", "pattern": "shipping|delivery cost|we pay|customer pays|pay for the return" },
    { "label": "States refund or exchange", "pattern": "refund|exchange|credit" },
    { "label": "States faulty items are fixed at our cost", "pattern": "faulty|damaged|wrong item|defect" }
  ],
  "sample": "What can be returned: unused items in their original packaging with proof of purchase.\nTime limit: within 7 days of delivery.\nHow to start: message us on WhatsApp with your order number and photos.\nShipping: if you changed your mind you pay the return shipping; if the item is wrong or faulty, we pay.\nWhat you get: a refund to your original payment method within 5 working days, or an exchange or store credit if you prefer.\nFaulty or damaged items: replaced or refunded at our cost, quickly.\nNot returnable: personalised items and items for hygiene reasons.",
  "required": true
}
```

```task
{
  "id": "ecom-m07-t3",
  "prompt": "A customer writes: **\"My bag arrived with a broken zip. This is rubbish!\"** Write your reply in 50 to 100 words: apologise, take ownership, ask for what you need, offer a clear fix with a date and thank them.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Hello ...",
  "rules": [
    { "label": "Apologises", "pattern": "sorry|apolog" },
    { "label": "Takes ownership", "pattern": "i will|we will|let me|our (mistake|fault)|not the quality|sort this out" },
    { "label": "Asks for what is needed (photo, order number)", "pattern": "photo|picture|order number|send" },
    { "label": "Offers a fix with a timeline", "pattern": "replace|refund|repair|free|today|tomorrow|by (monday|tuesday|wednesday|thursday|friday)|within" },
    { "label": "Thanks them", "pattern": "thank" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "Hello Ngozi, I am very sorry that your tote arrived with a broken zip. That is not the quality we want you to receive, and I will sort it out for you. Please send a photo of the zip and your order number. As soon as I have it, I will send a replacement at no cost today, and you should have it by Thursday. If you prefer a refund, tell me and I will arrange it. Thank you for your patience.",
  "required": false
}
```

Next lesson: analytics, scaling and your final project.
