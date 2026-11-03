---
title: Handling Complaints and Difficult People
minutes: 30
summary: Understand why customers complain, follow a step-by-step complaint process, stay calm with angry customers, say no well and recover the relationship.
---

## Why customers complain

A complaint is a customer telling you **something went wrong** and **they still care enough to tell you.** Many unhappy customers never complain: they just leave and tell others. So a complaint is a gift: a chance to fix a problem and keep the customer.

Common causes:

- **The product or service did not work or was not as described.**
- **Delays and waiting.**
- **Staff behaviour:** rudeness, ignoring, poor knowledge.
- **Mistakes:** wrong items, billing errors, lost orders.
- **Broken promises.**
- **Poor communication:** nobody told them what was happening.
- **Unfair or unclear policies.**
- **Value:** they feel they paid too much for what they got.

Behind the complaint are **feelings:** frustration, embarrassment, worry about money, a sense of not being respected. Often the emotion matters more than the item. People want **acknowledgement, an explanation, a fix and assurance it will not happen again.**

## A step-by-step complaint process

A clear process makes you calmer and more effective. A simple one is **L.A.S.T.**: **L**isten, **A**pologise, **S**olve, **T**hank. Expand it into steps:

1. **Listen fully.** Let the customer finish without interrupting or defending. Take notes.
2. **Show you understand:** "I understand why you are upset. You waited an hour and nobody told you why." Reflect their words.
3. **Apologise sincerely** for the experience, even if you are not sure who was at fault. "I am sorry that happened." Do not blame colleagues, the customer or "the system."
4. **Take ownership:** "I will sort this out for you."
5. **Get the facts:** ask questions, check records and confirm the details.
6. **Offer a solution,** or options, within your authority: fix, replace, refund, discount, redo. Ask what would be fair: *"What would you like us to do?"*
7. **Act quickly,** and tell them what will happen and by when.
8. **Escalate** if you cannot solve it, handing over the whole story so the customer does not repeat it.
9. **Follow up** to confirm it was resolved.
10. **Thank the customer** for telling you, and **record it** and the cause so you can fix the root problem.

**Resolve at first contact** where possible. If **28 of 40** complaints are solved at the first contact, the **first-contact resolution rate** is 28 ÷ 40 = **70%.** Higher is better for the customer and cheaper for you.

## Staying calm with angry customers

Angry customers are often not angry at you personally; you are the person in front of them. Your calm is a skill.

- **Breathe and slow down.** Keep your voice lower and slower than theirs.
- **Do not take it personally.**
- **Let them vent** for a moment; interruption increases anger.
- **Use the customer's name** and stay respectful.
- **Show empathy,** not argument: "I can see how frustrating that is."
- **Avoid phrases that inflame:** "Calm down," "That's our policy," "You should have...," "It's not my fault."
- **Focus on the solution** and on what you **can** do.
- **Move to a private place** if the customer is shouting in public, politely.
- **Set boundaries** if abuse, threats or discrimination appear: "I want to help you, but I cannot continue if I am spoken to like this." Involve a manager. **Your safety comes first.**
- **Look after yourself afterwards:** take a short break, talk to a colleague, and learn from the experience.

## Saying no well

Sometimes you must say no: refunds outside policy, requests you cannot meet, unreasonable demands. A good no keeps the relationship.

**Method:**

1. **Acknowledge** the request: "I understand you would like a full refund."
2. **Explain the reason briefly and honestly,** without hiding behind "policy": "Because the item has been used, we cannot refund it, as we cannot resell it."
3. **Offer what you can do:** an alternative, a partial solution, a different route. "I can offer you a repair, a replacement or store credit."
4. **Be warm and firm.** Do not give in to pressure when the answer is genuinely no, and do not promise what you cannot deliver.
5. **Offer to escalate** where appropriate: "I can ask my manager to review it."
6. **Follow through** on what you offered.

Avoid starting with "No" or "We can't." Start with what you can do. **Never lie** to avoid saying no.

## Service recovery

**Service recovery** is how you put things right and rebuild trust. Done well, customers can end up more loyal than if nothing had gone wrong.

Elements:

- **Fast response** to the problem.
- **Genuine apology and empathy.**
- **A fair, appropriate remedy:** fix the problem first, then add a goodwill gesture if suitable (a discount, a free item, priority treatment).
- **Follow-up** to check the customer is satisfied.
- **Learning:** fix the cause.

Decide how much to offer by comparing the **cost of the gesture** with the **value of keeping the customer.** Example: a customer's order of **₦20,000** was delivered late. A **₦2,000** voucher costs less than the **₦54,000** lifetime profit of that customer (see module 1). Offering it is sensible. But **do not over-compensate** every complaint: set guidelines for what frontline staff may offer without approval, and make sure the gesture matches the problem.

Also give staff the **authority and training** to solve problems on the spot. Customers hate hearing "I have to ask my manager" for small things.

## Try it

```task
{
  "id": "cscm-m04-t1",
  "prompt": "A customer shouts at the till: *\"Your delivery is two hours late and nobody called me! This is useless!\"* Write what you **say** in 60 to 120 words: listen and acknowledge, apologise, take ownership, offer a solution with a time and ask what would help.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "I am so sorry ...",
  "rules": [
    { "label": "Acknowledges the feeling or the problem", "pattern": "understand|frustrat|i can see|upset|two hours|late" },
    { "label": "Apologises", "pattern": "sorry|apolog" },
    { "label": "Takes ownership", "pattern": "i will|let me|i am going to|i'll|sort this out|take care of" },
    { "label": "Offers a solution with a time", "pattern": "within|by \\d|minutes|today|call you|deliver" },
    { "label": "Asks what would help or what they would like", "pattern": "what would|how would you like|what can i|would you like" },
    { "label": "Does not blame or tell to calm down", "pattern": "calm down|your fault|policy|not my", "absent": true },
    { "label": "Between 60 and 120 words", "minWords": 60, "maxWords": 125 }
  ],
  "sample": "Sir, I am very sorry. I understand how frustrating it is to wait two hours without hearing from us, and you should have been called. Let me sort this out for you right now. I will phone the rider immediately and give you an exact arrival time within five minutes. If he cannot reach you within 30 minutes, I will arrange a replacement at no cost. What would you like us to do if the order comes later than that? Thank you for telling me, and I will make sure it does not happen again.",
  "required": true
}
```

```task
{
  "id": "cscm-m04-t2",
  "prompt": "A customer wants a **full refund** on a used item, which your policy does not allow. Write your reply in 50 to 100 words that **says no well**: acknowledge, explain honestly, offer alternatives and offer to escalate.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "I understand ...",
  "rules": [
    { "label": "Acknowledges the request", "pattern": "understand|i can see|thank you for|i appreciate" },
    { "label": "Explains the reason", "pattern": "because|since|as the item|used|cannot resell|not able to" },
    { "label": "Offers alternatives (repair, replacement, credit, exchange)", "pattern": "repair|replace|exchange|credit|voucher|discount|instead" },
    { "label": "Offers to escalate or review", "pattern": "manager|review|escalate|supervisor|look at it" },
    { "label": "Polite and does not start with a flat no", "pattern": "^\\s*no\\b", "absent": true },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "I understand that you would like a full refund, and I am sorry the item has not worked out for you. Because it has been used, we are not able to refund it, as we cannot resell it. What I can offer is a free repair, a replacement of the faulty part, or store credit for the full amount. If you would prefer something different, I will ask my manager to review your case today and call you back by 4 pm.",
  "required": true
}
```

```task
{
  "id": "cscm-m04-t3",
  "prompt": "A customer's **₦20,000** order was delivered late. The customer's lifetime profit is **₦54,000**. A voucher costs **₦2,000**. Work out the voucher as a share of the order and of lifetime profit. Then say in a sentence what limit you would set for staff on goodwill gestures.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Voucher share of order = ...",
  "rules": [
    { "label": "10% of the order", "pattern": "\\b10\\s?%" },
    { "label": "About 3.7% of lifetime profit", "pattern": "3\\.7|3\\.70|4\\s?%" },
    { "label": "Sets a staff limit or guideline", "pattern": "limit|up to|without approval|authority|guideline|manager" }
  ],
  "sample": "Voucher share of the order = 2,000 / 20,000 = 10%.\nShare of lifetime profit = 2,000 / 54,000 = 3.7%.\nI would let frontline staff give goodwill gestures of up to ₦2,000 without approval, and ask a manager for anything higher.",
  "required": false
}
```

Next lesson: client relationship management.
