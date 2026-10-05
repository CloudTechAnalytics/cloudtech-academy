---
title: Story mapping
minutes: 20
summary: Lay out a product's whole user journey as a story map, find the walking skeleton, and slice releases that each deliver something usable end to end.
---

## The problem

The kiosk app's backlog is a flat list, ordered by priority. Look at the top 20 items and you'll find five ways to log in and no way to pay. Each item made sense on its own, but nobody could see the whole journey, so the "top priorities" didn't add up to anything a kiosk owner could actually use.

A flat backlog hides gaps. A **story map** shows the user's whole journey left to right, with the detail underneath, so you can see at a glance whether the first release lets someone do the job from start to finish.

## The concept

### The parts of a story map

1. **The backbone**: the big steps a user goes through, left to right, in the order they happen. For a kiosk owner: *Sign up → Find products → Build an order → Pay → Track delivery → Reorder*.
2. **The stories**: under each step, the user stories that support it, most essential at the top.
3. **Release slices**: horizontal lines across the map. Everything above the first line is the first release.

### The walking skeleton

The thinnest possible version of the whole journey: the one most basic story under **every** step of the backbone. It's ugly, but someone can use it from start to finish. Building it first proves the journey works and gives you something real to test with users.

### Slice by outcome, not by component

A good first slice lets a real user complete the job. A bad slice is "all of sign-up, perfectly", which leaves nobody able to order. Slicing the map horizontally, across every step, is what keeps each release usable.

![A story map: six backbone steps across the top, stories stacked under each, with a dashed line for the walking skeleton under the first row and another for the pilot release.](/images/courses/agile-ba/story-map.svg "Read across, not down: each slice is a complete journey.")

## Example

Part of the kiosk app's story map, with the first two slices:

| Sign up | Find products | Build an order | Pay | Track delivery | Reorder |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Register with phone number | List products by category | Add and remove items | Pay on delivery | Order status list | Reorder last basket |
| *— walking skeleton —* | | | | | |
| Verify phone by SMS | Show current price | Minimum order value rule | Pay by transfer | Delivery day reminder | Favourite products |
| Log in with PIN | Search products | Delivery day selection | Confirm transfer payments | Cancel before dispatch | |
| *— pilot release —* | | | | | |
| Language options | Promotions banner | Save basket for later | Pay by card | Delivery photo proof | |

Above the first line, a kiosk owner can register, see products, order, pay on delivery, see the order's status and reorder: a complete, if basic, journey. The pilot slice adds what makes it practical. Everything below the second line can wait for feedback from the pilot.

## Walkthrough

1. List the backbone of the kiosk owner's journey on sticky notes or in a spreadsheet, left to right.
2. Use `backlog.csv` to place each story under its step. (The `epic` column is a good starting point: most epics match one backbone step.)
3. Draw the walking skeleton line: one story per step, the most basic.
4. Draw the pilot release line. Check every step has enough above the line for a real kiosk to use it.
5. Compare your map with the team's original plan: how many MVP stories did it contain (the first task below)?

## Practice

```answer
{
  "id": "aba-03-p1",
  "prompt": "Agile data: how many **stories** were in the **MVP** release when the team started (created before sprint 1 began on 2 March 2026)?",
  "answer": 31,
  "format": "number",
  "dataset": "agile",
  "files": ["backlog"],
  "verify": "SELECT COUNT(*) FROM backlog WHERE release = 'MVP' AND type = 'Story' AND created_date < '2026-03-02'",
  "hint": "Filter backlog.csv to release = MVP, type = Story and created_date before 2026-03-02.",
  "required": true
}
```

```task
{
  "id": "aba-03-t1",
  "prompt": "Write a **story map** for a different product: a school fees payment app for parents. First write the **backbone** on one line (at least five steps separated by →). Then, for each step, write a line in the form **Step: walking-skeleton story | later story**, with one essential story and one that can wait.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Backbone: Sign up → ... \n\nSign up: ... | ...",
  "rules": [
    { "label": "A backbone with at least five steps separated by → (or ->)", "pattern": "(?:→|->)(?:(?!→|->)[^\\n])*(?:→|->)(?:(?!→|->)[^\\n])*(?:→|->)(?:(?!→|->)[^\\n])*(?:→|->)" },
    { "label": "At least five step lines in the form Step: story | story", "pattern": "^\\s*[^:\\n|]+:[^|\\n]+\\|[^|\\n]+$", "min": 5 },
    { "label": "Includes a payment step", "pattern": "pay" }
  ],
  "sample": "Backbone: Sign up → Find my child → See fees due → Pay → Get receipt → Track balance\n\nSign up: register with phone number | sign in with email\nFind my child: enter the school's student ID | add several children to one account\nSee fees due: show this term's total | show a breakdown by item\nPay: pay by bank transfer with a reference | pay by card or instalments\nGet receipt: SMS receipt with amount and date | PDF receipt by email\nTrack balance: show amount paid and owed this term | full payment history",
  "note": "The left side of each line, read across, is the walking skeleton: a parent can already find their child, see what's due, pay and get proof. Everything on the right improves it, after you've seen how parents use the basic version.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is the backbone of a story map?",
    "options": ["The most important story", "The user's main steps, in order, left to right", "The list of developers", "The release plan"],
    "answer": 1,
    "explanation": "The backbone shows the whole journey, so gaps are visible."
  },
  {
    "prompt": "What is a walking skeleton?",
    "options": ["The finished product", "The thinnest version of the whole journey: one basic story under every step", "A list of bugs", "The first sprint's goal"],
    "answer": 1,
    "explanation": "It proves the journey works end to end before anything is polished."
  },
  {
    "prompt": "Which first release is better?",
    "options": ["Perfect sign-up and catalogue, no ordering", "Basic sign-up, catalogue, ordering, payment and tracking", "Every feature for one user type", "Only the features users asked for most"],
    "answer": 1,
    "explanation": "Slice across the whole journey so a real user can complete the job."
  }
]
```
