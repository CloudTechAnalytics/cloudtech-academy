---
title: Supplier Relationship Management
minutes: 25
summary: Review supplier performance with a scorecard, develop key suppliers, handle disputes and delays and manage supply risk with backup suppliers.
---

## Why manage suppliers after the order

Choosing a good supplier is only the start. Performance drifts if nobody watches it: deliveries slip, quality dips, prices creep up. **Supplier relationship management (SRM)** means tracking how suppliers perform, working with them to improve and dealing early with problems. The aim is steady, reliable supply at a fair total cost.

## Performance reviews and scorecards

A **supplier scorecard** measures a few things that matter, regularly, using facts.

Common measures:

| Measure | How to calculate it |
| :-- | :-- |
| **On time** | Deliveries received by the promised date ÷ total deliveries |
| **In full** | Deliveries with the complete quantity ÷ total deliveries |
| **OTIF (on time, in full)** | Orders both on time and complete ÷ total orders |
| **Quality / defect rate** | Faulty items ÷ items received |
| **Invoice accuracy** | Invoices correct first time ÷ total invoices |
| **Responsiveness** | How fast they answer queries and fix problems |
| **Price** | Compared with the market and with the agreed price |

Example: of 50 orders last quarter, 46 arrived on time and complete. OTIF = 46 ÷ 50 = **92%**.

Set targets (for example, OTIF of at least 95% and defects under 1%), review quarterly, and share the results with the supplier. A scorecard is most useful when it leads to a conversation: *here is what we saw; what will you change?*

## Developing key suppliers

Not all suppliers deserve the same attention. A common way to sort them uses two questions: **how much do we spend** and **how risky or hard is it to replace them?**

| Type | Spend / risk | Approach |
| :-- | :-- | :-- |
| **Strategic** | High spend, high risk | Close partnership, joint planning, regular senior contact |
| **Leverage** | High spend, low risk | Compete them, negotiate hard, use volume |
| **Bottleneck** | Low spend, high risk | Secure supply, hold stock, find alternatives |
| **Routine** | Low spend, low risk | Keep the process simple, automate |

For strategic suppliers, invest in the relationship: share forecasts, visit, agree improvement goals, resolve problems together and give them a fair return. Suppliers give their best service to customers they trust, pay on time and treat fairly.

## Handling disputes and delays

Problems will happen. Handle them in a way that fixes the issue and keeps the relationship:

1. **Get the facts.** Check the PO, delivery note and communications. What exactly was agreed? What exactly went wrong?
2. **Tell the supplier promptly, in writing,** with the evidence.
3. **Agree a remedy:** replacement, repair, credit, a revised date or price adjustment.
4. **Follow the contract** if it sets penalties or procedures.
5. **Escalate** if needed: to a senior contact, then to the formal dispute process.
6. **Record it** and use it in the next review.
7. **Learn:** if it keeps happening, address the cause or move volume to another supplier.

Stay professional. Blame and anger rarely fix a late delivery; clear facts and a firm date usually do.

## Risk and backup suppliers

Depending on one supplier is risky. A fire, a strike, a price shock, a port delay or a closure can stop your business. Reduce the risk:

- **Qualify a second supplier** for important items, even if you only buy small amounts from them.
- **Hold safety stock** of critical items.
- **Watch the supplier's health:** news, late payments to others, staff turnover.
- **Spread by location** so one event does not stop everything.
- **Include continuity terms** in contracts, such as notice of problems and priority supply.
- **Have a plan:** who to call, what to substitute, how to tell customers.

The cost of a backup is usually far smaller than the cost of an emergency.

## Try it

```task
{
  "id": "proc-m10-t1",
  "prompt": "Last quarter a supplier delivered **50 orders**. **46** were on time and complete; of the other 4, **2** were late and **2** were short. They sent **1,200 items** of which **18** were faulty. Calculate the **OTIF %** and the **defect rate**, and say whether you would meet targets of OTIF 95% and defects under 1%.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "OTIF = ...",
  "rules": [
    { "label": "OTIF of 92%", "pattern": "\\b92\\s?%|92 percent" },
    { "label": "Defect rate of 1.5%", "pattern": "1\\.5\\s?%|1\\.5 percent" },
    { "label": "Says both targets are missed", "pattern": "miss|not met|below|fail|neither|not meet|short of|worse" }
  ],
  "sample": "OTIF = 46 / 50 = 92%.\nDefect rate = 18 / 1,200 = 1.5%.\nThe supplier misses both targets: 92% is below the 95% OTIF target and 1.5% is above the 1% defect limit, so I would share the scorecard and agree an improvement plan.",
  "required": true
}
```

```task
{
  "id": "proc-m10-t2",
  "prompt": "A key supplier of packaging will deliver **a week late**, which will stop your packing line. Write the **email** you send them (60 to 130 words): state the facts, the impact, what you need (a firm date and options such as part delivery) and when you expect a reply.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Dear ...,",
  "rules": [
    { "label": "Greets and is professional", "pattern": "dear|hello|hi |regards|thank" },
    { "label": "States the facts (order number, date, delay)", "pattern": "order|po|due|promised|late|delay" },
    { "label": "States the impact", "pattern": "stop|impact|affect|line|customers|production|packing" },
    { "label": "Asks for a firm date or part delivery", "pattern": "firm date|confirm|part delivery|partial|split|expedite|earliest" },
    { "label": "Sets a deadline for a reply", "pattern": "by \\d|today|tomorrow|within|before|end of|\\d+ (hours|pm|am)" },
    { "label": "Between 60 and 130 words", "minWords": 60, "maxWords": 135 }
  ],
  "sample": "Dear Mr Bello, our order PO-2026-0187 for 20,000 cartons was promised for Monday 10 March, and we have just been told it will arrive a week late. This will stop our packing line and affect deliveries to our customers. Please confirm today the earliest firm delivery date, and whether you can send a part delivery of 8,000 cartons by Wednesday so the line can keep running. Please also tell us what has caused the delay and what you are doing to prevent it recurring. I would appreciate your reply by 4 pm today. Kind regards, Ngozi Okoro, Purchasing Officer.",
  "required": true
}
```

```task
{
  "id": "proc-m10-t3",
  "prompt": "Classify these suppliers as **strategic, leverage, bottleneck or routine**, with a short reason: (1) the only maker of a machine part you cannot easily replace, cost small; (2) the main supplier of your raw material, large spend, many alternatives; (3) the supplier of pens and notebooks. One per line.",
  "minutes": 8,
  "rows": 5,
  "placeholder": "1. bottleneck - ...",
  "rules": [
    { "label": "Three lines", "minLines": 3 },
    { "label": "Classifies the machine part supplier as bottleneck", "pattern": "bottleneck" },
    { "label": "Classifies the raw material supplier as leverage (or strategic)", "pattern": "leverage|strategic" },
    { "label": "Classifies the stationery supplier as routine", "pattern": "routine" },
    { "label": "Gives reasons", "pattern": "because|since|only|alternatives|small|low|simple|volume" }
  ],
  "sample": "1. Bottleneck - low spend but it is the only maker, so a failure would stop the machine.\n2. Leverage - high spend with many alternatives, so I can negotiate hard and compete the suppliers.\n3. Routine - low spend, many alternatives and low risk, so I keep the process simple.",
  "required": false
}
```

Next lesson: local and international sourcing, and doing it ethically.
