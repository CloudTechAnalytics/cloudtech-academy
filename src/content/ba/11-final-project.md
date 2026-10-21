---
title: "Final project: Harbourline's tracking request"
minutes: 25
summary: Plan your final project, a complete business analysis pack for a freight company whose operations director wants a customer tracking app, and start with the data.
---

## The problem

Your final project moves to a new organisation. Harbourline Freight moves containers and air cargo into West Africa. Its operations director, Mr Emeka Nwosu, sends this:

> "Customers keep complaining that they don't know where their shipments are. We need a tracking app with GPS, like the courier companies have. Can you write the requirements so we can get quotes?"

You've seen this shape of request before: a solution, arriving first. Your job is to produce the business analysis pack that should come before any quotes: the real problem and its size, who's involved, how the process works now, what should change, what the solution must do, how you'll know it worked, and whether it's worth the money.

## A story from the field: the ten-minute presentation

Eight weeks into her project at a Lagos hospital, an analyst named Ngozi had pages and pages of notes: interviews, process maps, baselines, options and a business case. The chief executive gave her ten minutes at the board meeting.

She nearly panicked. Her first instinct was to show everything she had done. A colleague stopped her: "The board does not want to know how hard you worked. They want to know what to decide."

So Ngozi rebuilt the presentation around one question: *what do we want the board to do?* She opened with the problem in one sentence and one number: patients waited an average of 74 minutes for a discharge letter, causing about 11 bed-days lost each week. Then she showed the three options in one table with cost, benefit and payback, her recommendation, the main risk and how she would measure success after three months.

The whole pack, with maps, requirements and test plans, went into an appendix for anyone who wanted detail. The board asked four questions, all of which she could answer from the appendix, and approved the recommendation in under fifteen minutes.

Everything you have learned in this course comes together here. An analyst earns trust by understanding the real problem, listening to everyone affected, measuring before changing, being specific, and presenting a clear choice. The final project is your chance to show you can do all of it.

## The concept

### The pack, and where each part comes from

| Part | What it contains | Lesson |
| :-- | :-- | :-- |
| Problem statement | who, what, the cost, the measure, with no solution named | 1 |
| Stakeholder register and RACI | power, interest, approach | 2 |
| Elicitation plan | techniques, interviewees, key questions | 3 |
| Baseline | on-time rate and lateness from the data, by mode and route | 4 |
| As-is and to-be process | swimlanes, with the problems marked | 5 |
| Requirements | functional, non-functional and business rules, prioritised with MoSCoW | 6 |
| User stories | with Given/When/Then acceptance criteria | 7 |
| KPI cards | definition, baseline, target, owner | 8 |
| Business case | options including do nothing, payback, risks, a recommendation | 9 |
| UAT and adoption | test cases, traceability, adoption plan | 10 |

### Start from the data, then ask why

Customers complain about not knowing where shipments are, but **why** do they need to know? Usually because a shipment is late and nobody told them. If deliveries were reliable, or customers were told in advance when one would be late, would they still want GPS? That's the question your analysis has to answer before anyone gets a quote.

## Example

A first look at Harbourline's delivery data, for delivered shipments:

| Route target | Delivered | On time |
| :-- | --: | --: |
| 1 day | 200 | 70.5% |
| 2–7 days | 755 | 77.2% |
| 16 days or more | 1,456 | 77.2% |

About a quarter of deliveries are late on every kind of route, and the one-day routes are the worst. A tracking app would show customers their shipment is late; it wouldn't make it on time. The pack you write may well recommend something different from what Mr Nwosu asked for, such as proactive delay notifications, realistic targets or fixing the causes of lateness, and that's exactly what a BA is for.

## A real-world scenario: structuring your final pack

Imagine you have been asked to improve how a small clinic books appointments. Here is how a strong final pack is organised, and what each part must achieve.

| Part | What it contains | The question it answers |
| :-- | :-- | :-- |
| 1. Problem statement | One paragraph and one number | What is wrong, and how much does it matter? |
| 2. Stakeholders | The power and interest grid, who you spoke to | Who is affected and who decides? |
| 3. Current state | Baseline measures and the as-is map | How bad is it today, and where does it go wrong? |
| 4. Requirements | Testable requirements and user stories with acceptance criteria | What must the solution do? |
| 5. Options and case | Two or three options with costs, benefits and payback | What should we do and why? |
| 6. Plan | Testing, training, rollout and how success will be measured | How will we make it work? |

**A ten-minute presentation outline:**

1. **Minute 1:** the problem and the number.
2. **Minutes 2 to 3:** what you found (the map and the baseline in one picture each).
3. **Minutes 4 to 6:** the options in one table, and your recommendation.
4. **Minutes 7 to 8:** the main risks and how you will measure success.
5. **Minutes 9 to 10:** the decision you need, and questions.

**Practical advice:**

- Put the recommendation early. Do not make the audience wait for it.
- Use one picture per idea. Keep the detail in an appendix.
- Rehearse out loud with a timer. Cutting a slide is easier than apologising for running over.
- Expect the question "what if we do nothing?" and have a number ready.

## Walkthrough

1. Download the logistics dataset and calculate the on-time rate overall, by mode and by route.
2. Write the problem statement without naming a solution.
3. List the stakeholders: operations, customer service, account managers, customers, drivers and shipping lines, IT.
4. Map the as-is process from booking to delivery, including how (and whether) customers are told about delays today.
5. Open the project brief on the course page and plan which part of the pack you'll write each day.

## Practice

```dataset
{"dataset": "logistics", "files": ["shipments", "routes", "customers"]}
```

```answer
{
  "id": "ba-11-p1",
  "prompt": "How many **delivered** shipments arrived **late** (transit days greater than the route's target) with a delivery date in **2026**?",
  "answer": 223,
  "format": "number",
  "dataset": "logistics",
  "files": ["shipments", "routes"],
  "verify": "SELECT COUNT(*) FROM shipments s JOIN routes r ON r.route_id = s.route_id WHERE s.status = 'Delivered' AND julianday(s.delivery_date) - julianday(s.ship_date) > r.target_transit_days AND s.delivery_date >= '2026-01-01'",
  "hint": "Join shipments to routes; transit days = delivery_date − ship_date; count those over target_transit_days, delivered in 2026.",
  "explanation": "223 late deliveries in eight months: about 28 a month, each one a customer who may not have been told.",
  "required": true
}
```

```answer
{
  "id": "ba-11-p2",
  "prompt": "What is the on-time rate for **delivered Air** shipments? One decimal place.",
  "answer": 75.3,
  "format": "percent",
  "dataset": "logistics",
  "files": ["shipments", "routes"],
  "verify": "SELECT ROUND(100.0 * SUM(julianday(s.delivery_date) - julianday(s.ship_date) <= r.target_transit_days) / COUNT(*), 1) FROM shipments s JOIN routes r ON r.route_id = s.route_id WHERE s.status = 'Delivered' AND r.mode = 'Air'",
  "hint": "Filter routes to mode = Air.",
  "explanation": "75.3%: air freight, the premium service customers pay most for, is no more reliable than sea. A customer paying for speed and still waiting is the complaint behind the tracking request.",
  "required": true
}
```

```task
{
  "id": "ba-11-t1",
  "prompt": "Write the **problem statement** for Harbourline in 2 to 4 sentences: who's affected, what's happening, what it costs or risks, and how success would be measured. Use at least **two numbers** from the data, and **don't** name a solution (no app, tracking system, GPS or platform).",
  "minutes": 6,
  "rows": 6,
  "placeholder": "About a quarter of Harbourline's deliveries ...",
  "rules": [
    { "label": "Says who's affected (customers)", "pattern": "customer|client" },
    { "label": "At least two numbers from the data", "pattern": "\\d+(\\.\\d+)?\\s*(%|deliver|shipment|late)", "min": 2 },
    { "label": "Says how success would be measured", "pattern": "measur|success|target|reduc|fewer|track(ed)? by|on-time rate" },
    { "label": "Doesn't name a solution: no app, GPS, tracking system, software or platform", "pattern": "\\b(app|apps|gps|tracking system|software|platform|portal)\\b", "absent": true },
    { "label": "Between 30 and 110 words", "minWords": 30, "maxWords": 110 }
  ],
  "sample": "About a quarter of Harbourline's deliveries arrive later than promised (223 late deliveries so far in 2026), and on one-day routes only 70.5% arrive on time. Customers usually find out a shipment is late only when it doesn't arrive, which damages trust and generates complaints to account managers. Success would mean fewer late deliveries and customers being told about delays before the promised date, measured by the on-time rate and the share of late shipments notified in advance.",
  "note": "The statement now has two parts, lateness and not being told, and they need different fixes. That distinction is what will shape your whole pack.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Customers ask for a tracking app. The data shows a quarter of deliveries are late on every type of route. What should the analysis consider?",
    "options": ["Only which tracking app to buy", "Whether customers mainly need to be told about delays, and whether the causes of lateness can be fixed", "Nothing: give customers what they ask for", "Cancelling late shipments"],
    "answer": 1,
    "explanation": "Requests describe solutions; the BA finds the need behind them."
  },
  {
    "prompt": "Which part of the pack should come first?",
    "options": ["User stories", "The problem statement and baseline", "UAT test cases", "Vendor quotes"],
    "answer": 1,
    "explanation": "Everything else depends on understanding and measuring the problem."
  },
  {
    "prompt": "Your analysis recommends delay notifications instead of the app the director asked for. Is that a failure?",
    "options": ["Yes: you didn't deliver what was asked", "No: recommending the right solution to the real problem is the BA's job, if the evidence supports it", "Only if it's cheaper", "Only if the director agrees immediately"],
    "answer": 1,
    "explanation": "Back the recommendation with data and a business case."
  }
]
```
