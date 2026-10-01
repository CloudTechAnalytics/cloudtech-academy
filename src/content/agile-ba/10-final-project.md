---
title: "Final project: Harbourline's delay notifications"
minutes: 20
summary: Plan your final project, an agile delivery pack for a freight company's customer delay-notification service, from vision and story map to forecast and pilot plan.
---

## The problem

In Business Analysis Fundamentals, Harbourline Freight's operations director asked for a GPS tracking app. The analysis found something different: about a quarter of deliveries arrive late on every kind of route, and customers usually find out only when a shipment doesn't arrive. The managing director agreed to start smaller, with a service that **tells customers about delays before they happen**, built by a small Scrum team in two-week sprints.

You're the team's BA. Before sprint 1, the managing director wants to see how you'll run it: what you're building first and why, how you'll know it's ready and done, when it could be piloted, and how you'll decide whether it worked.

## The concept

**The agile delivery pack**

| Part | What it contains | Lesson |
| :-- | :-- | :-- |
| Vision and product goal | who it's for, the outcome, a measurable goal | 2 |
| Story map | the customer's journey, the walking skeleton and a pilot slice | 3 |
| Backlog | at least 12 user stories, split small, with acceptance criteria for the top 5 | 4, 5 |
| Ready and done | the team's definition of ready and definition of done | 5 |
| Prioritisation | WSJF scores for the top 8 stories | 6 |
| Forecast | the pilot date as a range, from an assumed velocity | 7 |
| Measures | flow and quality measures the team will track | 8 |
| Pilot plan | question, comparison, success criteria, decision rule | 9 |

**Sizing the need from the data**

The logistics dataset tells you how many notifications the service would send, and to whom. That shapes the stories: a service sending three messages a month can be manual; one sending thirty a month needs automating, and needs to work for the account managers who'll handle the replies.

## Example

A first cut at the product goal:

> For Harbourline customers whose shipments are delayed, the delay-notification service tells them about the delay and the new expected date before the original date passes. **Goal for a three-month pilot:** at least 80% of late shipments notified in advance, and complaints about late deliveries down by half.

Notice that the goal needs two new measures Harbourline doesn't collect today: whether a late shipment was notified in advance, and complaints by reason. Capturing them becomes part of the backlog.

## Walkthrough

1. Use the logistics data to estimate how many late deliveries a month the service would need to notify.
2. Write the vision and the product goal.
3. Build the story map from the customer's point of view (shipment booked → shipment moving → delay detected → customer told → customer replies → delivered).
4. Draft the backlog, split the big stories, and write acceptance criteria for the top five.
5. Open the project brief on the course page and plan the rest of the pack.

## Practice

```dataset
{"dataset": "logistics", "files": ["shipments", "routes", "customers"]}
```

```answer
{
  "id": "aba-10-p1",
  "prompt": "Logistics data: on average, how many delivered shipments **a month** arrived **late** (transit days greater than the route's target) in January to August 2026? One decimal place.",
  "answer": 27.9,
  "format": "number",
  "dataset": "logistics",
  "files": ["shipments", "routes"],
  "verify": "SELECT ROUND(COUNT(*) / 8.0, 1) FROM shipments s JOIN routes r ON r.route_id = s.route_id WHERE s.status = 'Delivered' AND julianday(s.delivery_date) - julianday(s.ship_date) > r.target_transit_days AND s.delivery_date BETWEEN '2026-01-01' AND '2026-08-31'",
  "hint": "Count the late deliveries with a delivery date in 2026 (to 31 August), divided by 8 months.",
  "explanation": "About 28 a month, roughly one every working day: too many to handle well by hand, but few enough that a simple first version (an alert to the account manager, who calls the customer) could work in a pilot.",
  "required": true
}
```

```answer
{
  "id": "aba-10-p2",
  "prompt": "How many different **customers** had at least one late delivery in January to August 2026?",
  "answer": 61,
  "format": "number",
  "dataset": "logistics",
  "files": ["shipments", "routes"],
  "verify": "SELECT COUNT(DISTINCT s.customer_id) FROM shipments s JOIN routes r ON r.route_id = s.route_id WHERE s.status = 'Delivered' AND julianday(s.delivery_date) - julianday(s.ship_date) > r.target_transit_days AND s.delivery_date BETWEEN '2026-01-01' AND '2026-08-31'",
  "hint": "COUNT(DISTINCT customer_id) over the same late deliveries.",
  "required": true
}
```

```task
{
  "id": "aba-10-t1",
  "prompt": "Write the **walking skeleton** for the delay-notification service: one essential user story for each step of the backbone, in **As a … I want … so that …** form. Use at least **four** steps, and include at least one story for an **account manager** as well as for customers.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "As an operations officer, I want ..., so that ...",
  "rules": [
    { "label": "At least four stories in As a … I want … so that … form", "pattern": "as an? [^\\n]+?I want [^\\n]+?so that [^\\n]+", "min": 4 },
    { "label": "At least one story for a customer", "pattern": "as an? (harbourline )?customer" },
    { "label": "At least one story for an account manager", "pattern": "as an? account manager" },
    { "label": "Mentions the new expected date or delay", "pattern": "delay|new (expected )?date|late" }
  ],
  "sample": "As an operations officer, I want shipments flagged when they'll miss their target date, so that we know about a delay before the customer does.\nAs an account manager, I want an alert listing my customers' delayed shipments each morning, so that I can contact them before the original date.\nAs a customer, I want an SMS or email with the new expected delivery date, so that I can plan around the delay.\nAs a customer, I want to reply to the message to reach my account manager, so that I can ask questions without searching for a phone number.\nAs an account manager, I want to record that a customer was told about a delay, so that we can measure how many late shipments were notified in advance.",
  "note": "The last story exists because of the product goal: without it, \"80% notified in advance\" can't be measured. Building the measurement into the walking skeleton is a habit worth keeping.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why size the notification volume from data before writing the backlog?",
    "options": ["It isn't necessary", "Volume decides how much must be automated, and who handles the replies, which shapes the stories", "To estimate story points", "Data replaces user stories"],
    "answer": 1,
    "explanation": "Thirty a month and three thousand a month are different products."
  },
  {
    "prompt": "The product goal needs a measure Harbourline doesn't collect yet. What should you do?",
    "options": ["Change the goal", "Add a backlog item to capture the measure, early, so the pilot can be judged", "Estimate it afterwards", "Ignore it"],
    "answer": 1,
    "explanation": "If you can't measure the outcome, you can't learn from the pilot."
  },
  {
    "prompt": "Which is the best first release for the delay-notification service?",
    "options": ["A full customer portal with GPS maps", "A walking skeleton: detect likely delays, alert the account manager, tell the customer, record that they were told", "Only the delay-detection logic", "Every possible message channel at once"],
    "answer": 1,
    "explanation": "Slice across the whole journey so it can be piloted end to end."
  }
]
```
