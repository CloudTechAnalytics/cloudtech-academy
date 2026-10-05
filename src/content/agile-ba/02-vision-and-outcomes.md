---
title: Product vision and outcomes
minutes: 20
summary: Write a product vision and goal that keep a team pointed at the right problem, and define outcomes you can measure, not just features you can ship.
---

## The problem

Three weeks into the project, the kiosk app's backlog has grown to nearly 50 ideas: loyalty points, offline mode, a promotions banner, three languages, a rep dashboard. Every idea is reasonable, and the team can build perhaps a quarter of them before the pilot. Which quarter?

Without a clear answer to "what is this product **for**?", every request looks equally important and the loudest stakeholder wins. A **product vision** and a measurable **product goal** are how an agile team decides what *not* to build, and how it knows, after launch, whether the app was worth building at all.

## The concept

### A product vision

One or two sentences describing who the product is for, the problem it solves and why it's better than the alternative. A common template:

> **For** [target users] **who** [need or problem], **the** [product] **is a** [type of product] **that** [key benefit]. **Unlike** [current alternative], **our product** [main difference].

### Outputs versus outcomes

- An **output** is something the team ships: "a reorder button".
- An **outcome** is a change in behaviour that matters to the business: "kiosks order every 10 days instead of every 22".

Teams that measure outputs celebrate shipping features nobody uses. Teams that measure outcomes keep asking whether the features work. A good product goal is an outcome, with a number and a date.

### Choosing outcome measures

| Measure | Why it matters for the kiosk app |
| :-- | :-- |
| Days between orders per kiosk | the core behaviour the app is meant to change |
| Share of kiosk orders placed in the app | adoption |
| Average order value | are kiosks buying more each time, or splitting the same order? |
| Rep time spent taking kiosk orders | the cost the app should save |

Always pair a **leading** measure (app orders, which move quickly) with a **lagging** one (kiosk revenue, which moves slowly), and take the baseline from today's data.

## Example

The kiosk app's vision and product goal:

> **Vision:** For kiosk owners who can only order when a sales rep visits, the Kolanut app is a simple phone ordering service that lets them restock in two minutes, any day. Unlike waiting for a rep, they can order the moment stock runs low, and see exactly when it will arrive.
>
> **Product goal (for the Surulere pilot, by September 2026):** pilot kiosks order at least every 14 days on average (today: every 22), with at least 60% of their orders placed in the app.

With that goal, "offline mode" and "loyalty tiers" are easy to postpone: neither helps a kiosk order more often in the pilot. "Reorder last basket" moves to the top: it makes ordering faster.

## Walkthrough

1. Look at the kiosk channel in the sales data: its share of revenue, number of customers and how often they order.
2. Write a vision using the template. Read it to someone outside the project. Could they say who it's for and why it's better?
3. Write a product goal as an outcome, with a number, a baseline and a date.
4. Choose two or three measures, and check that each can actually be measured (from the app, the sales data or a survey).
5. Go through the backlog and ask of each epic: does it help reach the goal? Mark the ones that don't as "Later".

## Practice

```answer
{
  "id": "aba-02-p1",
  "prompt": "Sales data: what share of Kolanut's **2026** revenue comes from the **Kiosk** channel? One decimal place.",
  "answer": 4.5,
  "format": "percent",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT ROUND(100.0 * SUM(CASE WHEN c.channel = 'Kiosk' THEN o.quantity * o.unit_price * (1 - o.discount_pct / 100.0) END) / SUM(o.quantity * o.unit_price * (1 - o.discount_pct / 100.0)), 1) FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE o.order_date >= '2026-01-01'",
  "hint": "Kiosk revenue ÷ all revenue, for orders dated 2026.",
  "explanation": "Only 4.5% of revenue, from 39 of 90 customers. Kiosks are numerous but small, and expensive to serve with rep visits. The app has to make them cheaper to serve as well as more active, which is worth saying in the vision.",
  "required": true
}
```

```task
{
  "id": "aba-02-t1",
  "prompt": "Write a **product vision** for a different product: a mobile app that lets patients at a busy Lagos clinic book and manage appointments. Use the **For … who … the … is a … that … Unlike … our product …** template. Then, on a new line starting **Goal:**, write a measurable **outcome** with a number and a date.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "For patients who ...\n\nGoal: ...",
  "rules": [
    { "label": "Uses For … who …", "pattern": "\\bfor\\b[^.]*\\bwho\\b" },
    { "label": "Says what it is and its benefit (is a … that …)", "pattern": "\\bis an?\\b[^.]*\\bthat\\b" },
    { "label": "Compares with the alternative (Unlike …)", "pattern": "\\bunlike\\b" },
    { "label": "Has a Goal line", "pattern": "^\\s*\\W*goal\\W*\\s*:?" },
    { "label": "The goal is an outcome with a number", "pattern": "goal[^\\n]*\\d" },
    { "label": "The goal has a date or time frame", "pattern": "goal[^\\n]*(by|within|in) [^\\n]*(20\\d\\d|month|week|quarter|january|february|march|april|may|june|july|august|september|october|november|december)" }
  ],
  "sample": "For patients of the Ikoyi outpatient clinic who wait hours to be seen and often miss appointments, ClinicBook is a mobile booking app that lets them choose a time slot, get reminders and cancel easily. Unlike phoning the front desk or queuing from early morning, our product gives every patient a confirmed time and a reminder the day before.\n\nGoal: by December 2026, cut the average wait from 3 hours to under 1 hour and the no-show rate from 20% to 10%, for patients who book in the app.",
  "note": "The goal is about waiting time and no-shows (outcomes), not about the number of bookings made in the app (an output). An app with lots of bookings and the same waiting times would have failed.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which is an outcome rather than an output?",
    "options": ["Release the reorder button", "Kiosks order every 10 days instead of every 22", "Build 20 user stories", "Launch the app on Android"],
    "answer": 1,
    "explanation": "Outcomes are changes in behaviour or results; outputs are things shipped."
  },
  {
    "prompt": "How does a product goal help a team with a 50-item backlog?",
    "options": ["It doesn't", "It gives a test for every item: does this help reach the goal? Items that don't can wait", "It tells developers how to code", "It replaces user stories"],
    "answer": 1,
    "explanation": "A clear goal makes saying 'not now' easier."
  },
  {
    "prompt": "Why pair a leading measure with a lagging one?",
    "options": ["To have more charts", "Leading measures move quickly and show early whether you're on track; lagging ones confirm the result that matters", "They're the same", "Lagging measures are always wrong"],
    "answer": 1,
    "explanation": "App orders show adoption quickly; revenue confirms value later."
  }
]
```
