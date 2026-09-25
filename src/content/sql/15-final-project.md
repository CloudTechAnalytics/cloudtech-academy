---
title: Final project
minutes: 15
summary: The brief for your final project, the Harbourline Freight operations review, and how it's assessed.
---

## The problem

Harbourline's leadership team meets next week to plan 2027. They've asked for an **operations review**: a short, evidence-based report on how the business performed, built from the database you've been working with throughout this course.

This is your final project. It's the closest thing in the course to a real analyst's assignment: a brief, a database, and questions that need several of the techniques you've learned.

## The concept

You'll answer six questions. For each one, you submit **the query you wrote** and **one or two sentences** explaining what the result means for the business.

| # | Question | Techniques you'll likely use |
| :-- | :-- | :-- |
| 1 | Who are our ten highest-volume customers by containers shipped, across the whole period? | JOIN, GROUP BY, ORDER BY, LIMIT |
| 2 | How did shipment volume change month by month? | GROUP BY, date functions, LAG |
| 3 | Which five routes carry the most shipments, and what mode are they? | JOIN, GROUP BY |
| 4 | What is revenue (charges on delivered shipments) by customer, and how much of it has been paid? | CTEs, LEFT JOIN, COALESCE |
| 5 | Which customers have become inactive: shipped before, but nothing since 2026-03-01? | GROUP BY, HAVING |
| 6 | How reliable are our deliveries? On-time rate by mode and for the three worst routes. | CASE, JOIN, aggregates |

Your project page has the full brief, the SQL editor connected to the database, and the submission form.

## Example

A strong answer to question 3 looks like this:

```sql run
SELECT r.origin, r.destination, r.mode, COUNT(*) AS shipments
FROM shipments AS s
JOIN routes AS r ON r.route_id = s.route_id
GROUP BY r.route_id, r.origin, r.destination, r.mode
ORDER BY shipments DESC
LIMIT 5;
```

> Sea imports into Lagos dominate: the busiest routes are all sea lanes from Asia and Europe. That's where delays or capacity problems would affect the most customers.

It gives the query, the number, and what it means. It doesn't need to be longer.

## Walkthrough

How your project is assessed:

- **Correct queries.** Each query should answer the question asked, with sensible definitions, for example excluding cancelled shipments where that matters.
- **Clear explanations.** One or two sentences per question in plain language. A manager should understand them without reading the SQL.
- **Honest limits.** If the data can't fully answer something, say so.

To earn your certificate you need to complete every lesson, complete the practice exercises, pass the final assessment (70% or more) and submit this project.

> [!TIP]
> Start with the questions you find easiest, check each result against numbers you've seen in the lessons, and keep your queries in the notes box as you go. You can come back and edit your submission at any time before you submit.

## Practice

```exercise
{
  "id": "sql-15-p1",
  "prompt": "Warm-up for question 1: show the customer_id and total containers of the single highest-volume customer across all shipments.",
  "starter": "",
  "solution": "SELECT customer_id, SUM(containers) AS containers FROM shipments GROUP BY customer_id ORDER BY containers DESC LIMIT 1;",
  "hint": "GROUP BY customer_id, SUM(containers), sort descending, LIMIT 1.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What do you submit for each project question?",
    "options": ["Just the final number", "The query and a short explanation of what it means", "A screenshot", "A PowerPoint deck"],
    "answer": 1,
    "explanation": "The query shows how you got the answer; the explanation shows you understand what it means for the business."
  },
  {
    "prompt": "What's needed to earn the SQL for Data Analysis certificate?",
    "options": ["Opening the course", "Finishing the lessons only", "Lessons, required exercises, passing the final assessment and submitting the project", "Paying a fee"],
    "answer": 2,
    "explanation": "The certificate shows you've done the work: lessons, practice, assessment and project."
  }
]
```
