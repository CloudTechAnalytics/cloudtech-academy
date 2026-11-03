---
title: Agile and the business analyst
minutes: 20
summary: How agile teams work, the Scrum roles and events, and where a business analyst adds value when there's no big requirements document to write.
---

## The problem

Kolanut Distribution sells drinks, snacks and household goods to 90 retail customers across Nigeria. Its 39 kiosk customers are a headache: they order small amounts, about once every three weeks, and only when a sales rep visits or phones. Since the January price rise they've been buying fewer packs. The commercial director has approved a mobile ordering app for kiosk owners, to be built by a small in-house team working in **Scrum**.

You've been hired as the team's business analyst. On your first day the developer asks, "So, are you writing the requirements document?" The honest answer is no. Agile teams don't work from a 60-page specification signed off before anything is built. But they need a BA more than ever, just doing different things.

## The concept

### What agile means

Agile is a way of building things in small, usable increments, getting feedback early, and changing the plan as you learn. The Agile Manifesto (2001) values:

- individuals and interactions over processes and tools;
- working software over comprehensive documentation;
- customer collaboration over contract negotiation;
- responding to change over following a plan.

The things on the right still matter; the things on the left matter more.

### Scrum in one table

Scrum is the most widely used agile framework. Work happens in **sprints** of usually two weeks, each producing a usable increment.

| Element | What it is |
| :-- | :-- |
| **Product owner** | owns the product backlog and decides what's built next, for maximum value |
| **Scrum master** | helps the team work well and removes obstacles |
| **Developers** | everyone who builds and tests the increment |
| **Product backlog** | the ordered list of everything that might be built |
| **Sprint planning** | the team chooses a sprint goal and the backlog items to deliver it |
| **Daily scrum** | 15 minutes each day to plan the next 24 hours |
| **Refinement** | ongoing work to make upcoming backlog items clear, small and estimated |
| **Sprint review** | the team shows what it built; stakeholders give feedback |
| **Retrospective** | the team improves how it works |

![The Scrum cycle: product backlog, sprint planning, a two-week sprint with a daily scrum, then sprint review and retrospective, with feedback looping back into the backlog. Green labels mark the BA's touchpoints: refinement, explaining stories, answering questions and checking work, and recording feedback.](/images/courses/agile-ba/scrum-cycle.svg "One sprint, and where the business analyst spends time in it.")

Scrum has no "business analyst" role. A BA is usually one of the developers in the broad sense, or works closely with the product owner, and sometimes is the product owner.

### What the BA does in an agile team

- **Understands the problem and the users** before and during delivery.
- **Shapes the backlog**: story maps, user stories, splitting, acceptance criteria.
- **Runs refinement**, so items are ready before sprint planning.
- **Answers questions** during the sprint and checks work against the criteria.
- **Measures outcomes**: is the product changing behaviour, not just shipping features?

## Example

The BA's week during a sprint on the kiosk app:

| Day | Activity |
| :-- | :-- |
| Monday | Sprint planning: explains the top stories and their acceptance criteria |
| Daily | Daily scrum: answers questions on "Minimum order value rule" |
| Tuesday | Calls three kiosk owners about how they'd want to pay |
| Wednesday | Refinement: splits "Pay by card" into smaller stories with the team |
| Thursday | Checks finished stories against their acceptance criteria |
| Friday (end of sprint) | Sprint review: shows a sales rep the "kiosks that haven't ordered" list and records feedback |

Notice how much of the week is spent with users and the team, and how little writing long documents.

## Walkthrough

1. Download the sales dataset and look at how often kiosks order compared with wholesalers. It's the business problem the app is meant to solve.
2. Download the agile dataset (`backlog.csv` and `sprints.csv`): the team's board, exported after six sprints. You'll use it throughout the course.
3. Read `sprints.csv`. Each sprint has a goal, committed points and a status.
4. For each Scrum event, write what the BA contributes (the task below).

## Practice

```dataset
{"dataset": "agile", "files": ["backlog", "sprints"]}
```

```answer
{
  "id": "aba-01-p1",
  "prompt": "Sales data: on average, how many days pass between one order day and the next for **Kiosk** customers? (Use the gap between each customer's consecutive order dates, ignoring same-day lines.) One decimal place.",
  "answer": 22.4,
  "format": "number",
  "dataset": "sales",
  "files": ["orders", "customers"],
  "verify": "SELECT ROUND(AVG(gap), 1) FROM (SELECT o.customer_id, julianday(o.order_date) - julianday(LAG(o.order_date) OVER (PARTITION BY o.customer_id ORDER BY o.order_date, o.order_id)) AS gap FROM orders o JOIN customers c ON c.customer_id = o.customer_id WHERE c.channel = 'Kiosk') WHERE gap > 0",
  "hint": "Sort each kiosk's orders by date, take the gap to the previous order date, ignore gaps of 0 (same day), and average.",
  "explanation": "About 22 days, against about 5 for wholesalers. Kiosks order rarely, mostly when a rep visits. The app is meant to make ordering easy enough that they order more often.",
  "required": true
}
```

```task
{
  "id": "aba-01-t1",
  "prompt": "For each of the five Scrum events, write **what the BA contributes** on the kiosk app team. One line per event in the form **Event: contribution**: sprint planning, daily scrum, refinement, sprint review and retrospective.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Sprint planning: ...",
  "rules": [
    { "label": "Sprint planning line", "pattern": "^\\s*[-*]?\\s*sprint planning\\s*:" },
    { "label": "Daily scrum line", "pattern": "^\\s*[-*]?\\s*daily (scrum|stand-?up)\\s*:" },
    { "label": "Refinement line", "pattern": "^\\s*[-*]?\\s*(backlog )?refinement\\s*:" },
    { "label": "Sprint review line", "pattern": "^\\s*[-*]?\\s*sprint review\\s*:" },
    { "label": "Retrospective line", "pattern": "^\\s*[-*]?\\s*retro(spective)?\\s*:" },
    { "label": "Mentions users or stakeholders at least once", "pattern": "user|kiosk|stakeholder|rep|customer" }
  ],
  "sample": "Sprint planning: explains the top stories and their acceptance criteria, and helps the team agree a sprint goal.\nDaily scrum: listens for questions and blockers about requirements, and answers them the same day.\nRefinement: brings the next stories split, with acceptance criteria and open questions, and agrees them with the team.\nSprint review: invites a sales rep and a kiosk owner, demonstrates against the goal, and records their feedback as new backlog items.\nRetrospective: raises what slowed the team down on requirements, such as stories that weren't ready, and agrees one change.",
  "note": "None of this is writing a big document. The BA's value in Scrum comes from keeping the team connected to users and making sure every item is understood before it's built.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Who decides the order of the product backlog in Scrum?",
    "options": ["The business analyst", "The product owner", "The scrum master", "The most senior developer"],
    "answer": 1,
    "explanation": "The BA advises and shapes items; the product owner orders the backlog."
  },
  {
    "prompt": "What does 'working software over comprehensive documentation' mean for a BA?",
    "options": ["Write no documentation", "Write the documentation that helps people build and use the product, and no more", "Only developers write documents", "Documentation is written after release"],
    "answer": 1,
    "explanation": "The right side still has value; it just matters less than working results."
  },
  {
    "prompt": "When does refinement happen?",
    "options": ["Only before the project starts", "Continuously, so upcoming items are ready before sprint planning", "Only in the retrospective", "Never in Scrum"],
    "answer": 1,
    "explanation": "Refinement keeps the next sprint or two of work ready."
  }
]
```
