---
title: Leadership, People and Growth
minutes: 25
summary: Lead yourself and others, hire your first people, delegate with accountability, measure performance and decide when and how to grow.
---

## Leading yourself and others

Leadership in a small business starts with **self-management**: your time, energy and habits set the pace for everyone.

- **Plan your week.** Decide the most important three things and do them first.
- **Protect your focus:** limit interruptions during key work.
- **Keep learning:** read, ask, join groups, find a mentor.
- **Look after your health,** since you are the business's most valuable asset.
- **Stay honest and consistent.** People copy what you do more than what you say.

Leading others means giving **direction** (where we are going and why), **support** (what they need to do the job) and **feedback** (how they are doing). A good leader is clear, fair, calm under pressure and willing to listen. They admit mistakes and thank people for good work.

## Hiring your first people

Hire when the work **needs** it, and you can afford it, not because it feels like growth. Before you hire:

1. **Define the job.** What exactly will this person do, and what results do you expect?
2. **Work out the cost.** Salary plus other costs (equipment, training, pension and other statutory costs, supervision time). A rule of thumb is to add 10% to 30% to the salary.
3. **Check the benefit.** Will the new person free your time, increase sales or improve quality enough to pay for themselves?
4. **Decide the form:** employee, part-time, contract worker, intern or outsourced service.

Example: a helper costs ₦80,000 a month including extras. They will allow you to make and sell 400 extra items a month, each giving ₦1,500 contribution. Extra contribution = 400 × 1,500 = **₦600,000** a month, far above the ₦80,000 cost. The hire is clearly worthwhile, **if** you can really sell those 400 items.

**Finding and choosing:** write a clear job description, use your network and trusted platforms, interview with the same questions for each candidate, give a short practical test, check references, and look for **attitude and reliability** as well as skill. Hire carefully: a wrong hire is costly.

**Onboarding:** agree the terms in writing (a written employment contract, pay, duties, hours, probation), explain how things are done, introduce them to the team, and give them a first week plan.

Follow the **employment laws** that apply, including pay, deductions, pension and other statutory obligations, and keep proper records.

## Delegation and accountability

You cannot do everything yourself. **Delegation** means giving someone the responsibility and the authority to do a task, while you remain accountable for the result.

How to delegate well:
- **Choose the task** (routine, time-consuming, or something someone else can do better).
- **Explain the outcome you want,** the deadline, the standard and any limits (budget, approval).
- **Make sure they have what they need:** information, tools, training.
- **Agree check-in points** and how they will report.
- **Let them do it their way,** within the standard.
- **Give feedback** and recognise good work.

**Accountability** means each task and result has a **named owner**. Write it down: who does what, by when, and how we will know it is done. Avoid "someone should". Use a simple weekly meeting: what was done, what is planned, what is blocked.

## Measuring performance

What gets measured gets managed. Choose **a few key performance indicators (KPIs)** for the business and for each role.

Business KPIs: sales, gross margin, profit, cash balance, number of customers, repeat rate, on-time delivery, customer satisfaction.

Role KPIs: for a cook, meals made on time and waste; for a rider, on-time deliveries and complaints; for a sales person, calls made, quotes sent and orders won.

Keep them **simple, clear and within the person's control**. Review weekly or monthly with the person, celebrate progress and talk honestly about gaps. Avoid measuring too much, which creates confusion, or only one thing, which can distort behaviour (rushing and cutting quality to hit a speed target).

## When and how to grow

Growth is attractive and dangerous. Growing too fast is a leading cause of failure: costs rise before income, quality slips and cash runs out.

**Ready signs:**
- Demand is steady and **customers are waiting.**
- The process works without constant firefighting, and quality is consistent.
- The business is **profitable** and generates cash.
- You have **systems and people** who can handle more.
- You can fund growth without risking the whole business.

**Ways to grow:**
- **Sell more to existing customers** (new products, bigger orders, subscriptions).
- **Reach new customers** (new areas, channels or segments).
- **Improve prices and margins** (cheaper supply, better pricing).
- **Add locations or partners.**
- **Franchise or license** the model.

Grow in **steps**, test each step, check the numbers (can we still deliver good service and profit?), and keep a cash reserve. A small, profitable, well-run business is better than a large, shaky one.

## Try it

```task
{
  "id": "ent-m09-t1",
  "prompt": "A helper costs **₦80,000** a month all in and would let you make and sell **400 extra items** a month at **₦1,500 contribution** each. Work out the **extra contribution**, the **net gain** and say what must be true for the hire to be worth it.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Extra contribution = ...",
  "rules": [
    { "label": "Extra contribution of ₦600,000", "pattern": "600,?000" },
    { "label": "Net gain of ₦520,000", "pattern": "520,?000" },
    { "label": "States the condition (you can actually sell those items, demand)", "pattern": "sell|demand|customers|orders|if|must" }
  ],
  "sample": "Extra contribution = 400 x 1,500 = ₦600,000 a month.\nNet gain = 600,000 - 80,000 = ₦520,000 a month.\nThe hire is only worth it if I can really sell the extra 400 items, so there must be enough customer demand to use the extra capacity.",
  "required": true
}
```

```task
{
  "id": "ent-m09-t2",
  "prompt": "Write a **delegation brief** (50 to 110 words) for giving a helper the job of handling daily orders: the outcome, the deadline or timing, the standard, any limits, and when you will check in.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Your task is ...",
  "rules": [
    { "label": "States the outcome or task", "pattern": "task|outcome|responsib|you will|your job" },
    { "label": "States timing or deadline", "pattern": "by \\d|every day|daily|deadline|before|each morning|\\d+\\s*(am|pm)" },
    { "label": "States a standard", "pattern": "standard|accurate|correct|within|reply|no mistakes|check" },
    { "label": "States a limit or approval rule", "pattern": "limit|approv|ask me|above ₦|if .* more than|not more than|only" },
    { "label": "States when you will check in", "pattern": "check in|meet|review|friday|end of|weekly|report" },
    { "label": "Between 50 and 110 words", "minWords": 50, "maxWords": 115 }
  ],
  "sample": "Your task is to handle all daily orders from WhatsApp. Every order must be recorded in the order sheet and confirmed to the customer by 10:30 am, with the correct item, address and price, and no mistakes. You can offer the standard first-order discount yourself, but ask me before giving any other discount or refund above ₦3,000. We will check in for ten minutes every Friday at 5 pm to review the week's orders, complaints and any problems you need help with.",
  "required": true
}
```

```task
{
  "id": "ent-m09-t3",
  "prompt": "List **five signs** that your business is ready to grow and **two risks** of growing too fast. One per line.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "Sign: ...\nRisk: ...",
  "rules": [
    { "label": "Seven lines", "minLines": 7 },
    { "label": "Includes signs about demand or customers waiting", "pattern": "demand|waiting|customers" },
    { "label": "Includes profit or cash", "pattern": "profit|cash" },
    { "label": "Includes systems, people or quality", "pattern": "system|people|team|process|quality|consistent" },
    { "label": "Includes risks (costs before income, quality drops, cash runs out)", "pattern": "risk[^\\n]*(cost|quality|cash|debt|overstretch|slip)" }
  ],
  "sample": "Sign: demand is steady and customers are waiting for stock.\nSign: the business is profitable every month.\nSign: we generate positive cash after paying ourselves.\nSign: our processes work without constant firefighting.\nSign: we have trained people who can handle more.\nRisk: costs rise before income, so the business runs out of cash.\nRisk: quality slips and customers leave because we cannot keep up.",
  "required": false
}
```

Next lesson: your business plan.
