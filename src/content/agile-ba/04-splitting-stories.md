---
title: Splitting stories
minutes: 20
summary: Break big stories into small, valuable slices with proven splitting patterns, so work finishes inside a sprint and feedback comes sooner.
---

## The problem

"Yoruba, Hausa and Igbo language options" sits in the kiosk app's backlog at 8 points. In refinement, the developer says it will take most of a sprint, the tester can't see how to test "language options", and the product owner isn't sure all three languages are needed for the Surulere pilot anyway.

Big stories are where agile teams get into trouble. They're hard to estimate, they don't finish inside a sprint, they hide risk until late, and they delay feedback. In the team's own data, 8-point stories took longer to get through, from start to done, than small ones. **Splitting** large stories into small, still-valuable slices is one of the most practical skills a BA brings to refinement.

## The concept

### What a good split looks like

Each slice must still be a **user story**: valuable to a user on its own, and testable. Splitting by technical layer ("build the database", "build the screen") produces tasks, not stories, and nothing usable until all of them are done.

![Left: three horizontal layers, build the screen, logic and data for card payments, none usable alone. Right: three vertical slices through all layers: pay by debit card, clear message when payment fails, save card for next time.](/images/courses/agile-ba/vertical-slices.svg "Split vertically through every layer, so each slice is a story a user can try.")

### Splitting patterns

| Pattern | Split by | Kiosk app example |
| :-- | :-- | :-- |
| **Workflow steps** | the steps in the user's process | "Place an order" → choose items / choose delivery day / confirm |
| **Business rules** | the rules, one at a time | "Apply discounts" → volume discount / promotional price / minimum order value |
| **Data variations** | different kinds of data | "Language options" → Yoruba first, then Hausa, then Igbo |
| **Happy and unhappy paths** | the normal case first, errors later | "Pay by transfer" → successful payment / payment not received / wrong amount |
| **Interfaces** | one device or channel first | "Pay by card" → on Android first, then web |
| **Simple then complex** | the simplest version first | "Search products" → by name / by brand and category / with spelling mistakes |
| **Spike** | a short time-boxed investigation, when the unknowns are too big to split | "Choose SMS provider" |

### How small?

Small enough that several fit in one sprint, typically 1 to 3 days of work each. If a story is more than about a quarter of the team's sprint, split it.

## Example

"Pay by card" (5 points), split in refinement:

1. As a kiosk owner, I want to pay for an order with a debit card, so that I don't need cash on delivery. *(happy path, one card type)*
2. As a kiosk owner, I want to be told clearly when my card payment fails, so that I can try again or choose another way. *(unhappy path)*
3. As a kiosk owner, I want to save my card for next time, so that reordering is faster. *(simple then complex)*

Story 1 alone is useful in the pilot. Stories 2 and 3 can follow, and story 3 might never be needed if most kiosks keep paying on delivery.

## Walkthrough

1. Find the stories of 8 points or more in `backlog.csv`.
2. Compare the average cycle time (start to done) of stories of 8 points or more with stories of 3 points or less (the first task below).
3. Choose a pattern for each large story and split it. Check that every slice is still valuable and testable.
4. Re-estimate the slices. They often add up to more than the original, because splitting reveals work that was hidden.
5. Ask the product owner which slices are needed for the pilot. Often the answer is "only the first one".

## Practice

```answer
{
  "id": "aba-04-p1",
  "prompt": "Agile data: for **Done stories of 8 points or more**, what is the average cycle time in days (done_date − started_date)? One decimal place.",
  "answer": 4.2,
  "format": "number",
  "dataset": "agile",
  "files": ["backlog"],
  "verify": "SELECT ROUND(AVG(julianday(done_date) - julianday(started_date)), 1) FROM backlog WHERE status = 'Done' AND type = 'Story' AND points >= 8",
  "hint": "Filter to type = Story, status = Done, points ≥ 8; average done_date − started_date.",
  "explanation": "4.2 days, against 3.0 for stories of 3 points or less. Big stories also tie up more of the team while they're in progress.",
  "required": true
}
```

```task
{
  "id": "aba-04-t1",
  "prompt": "Split the 8-point story **\"As a kiosk owner, I want the app in Yoruba, Hausa and Igbo, so that I can use it in my own language\"** into **at least three** smaller user stories. Write each in **As a … I want … so that …** form, and name the splitting pattern you used for each in brackets at the end of the line.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "As a kiosk owner, I want ..., so that ... (data variations)",
  "rules": [
    { "label": "At least three stories in As a … I want … so that … form", "pattern": "as an? [^\\n]+?I want [^\\n]+?so that [^\\n]+", "min": 3 },
    { "label": "Each names a pattern in brackets", "pattern": "\\((workflow|business rule|data|happy|unhappy|interface|simple|complex|spike)[^)]*\\)\\s*$", "min": 3 },
    { "label": "Splits by language (data variations) for at least one story", "pattern": "yoruba|hausa|igbo" },
    { "label": "No technical-layer split (database, API, back end, front end)", "pattern": "\\b(database|api|back[- ]?end|front[- ]?end|schema)\\b", "absent": true }
  ],
  "sample": "As a kiosk owner in Surulere, I want the main ordering screens in Yoruba, so that I can order without struggling with English. (data variations)\nAs a kiosk owner, I want to switch language from the menu at any time, so that I can change it if someone else uses my phone. (simple then complex)\nAs a kiosk owner in the north, I want the ordering screens in Hausa, so that the app works for me when it reaches Kano. (data variations)\nAs a kiosk owner, I want SMS messages in my chosen language, so that confirmations and reminders make sense to me. (workflow steps)",
  "note": "The first slice alone covers the Surulere pilot, which is mostly Yoruba-speaking. Hausa and Igbo can wait until the app expands, and the product owner may decide they're not needed for months.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why is 'build the database' a poor slice of a user story?",
    "options": ["Databases aren't needed", "It isn't valuable or testable by a user on its own; it's a technical task", "It's too small", "It's too easy"],
    "answer": 1,
    "explanation": "Each slice should still deliver something a user can use."
  },
  {
    "prompt": "A payment story handles success, failure and refunds. Which split is usually best first?",
    "options": ["Refunds first", "The happy path (successful payment) first, then failures and refunds", "All three together", "The database first"],
    "answer": 1,
    "explanation": "Deliver the normal case, then handle the exceptions."
  },
  {
    "prompt": "When is a spike appropriate?",
    "options": ["For every story", "When unknowns are too big to split or estimate, as a short time-boxed investigation", "Instead of testing", "For bugs only"],
    "answer": 1,
    "explanation": "A spike buys knowledge, so the real stories can be split and estimated."
  }
]
```
