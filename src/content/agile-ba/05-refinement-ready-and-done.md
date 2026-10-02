---
title: Refinement, ready and done
minutes: 20
summary: Run backlog refinement that gets stories ready before sprint planning, use the three amigos to catch misunderstandings early, and agree a definition of ready and done.
---

## The problem

The kiosk app team's first three sprints went smoothly: 3 bugs in total. In sprints 4 to 6 they found 13. Sprint 5 finished 3 points short of its commitment. In the retrospective, the developers say the same thing in different ways: "We started stories before we understood them," "Nobody told us transfers can arrive the next day," and "We called things done when they weren't tested on a real phone."

None of that is a coding problem. It's what happens when stories reach a sprint before they're **ready**, and leave it before they're really **done**. Both are things a BA can fix.

## The concept

**Backlog refinement**

A regular session (often an hour or two a week) where the product owner, BA and developers look at the next items in the backlog and make them ready: clarify, split, add acceptance criteria and estimate. Aim to keep about **two sprints' worth** of work refined ahead.

**The three amigos**

Before a story is ready, three perspectives look at it together for 15 minutes:

- **Business** (BA or product owner): what's needed and why.
- **Development**: how it could be built, and what's hard.
- **Testing**: how it could break, and how to prove it works.

Most misunderstandings ("transfers can arrive the next day") surface in that conversation, when they cost nothing to fix.

**Definition of ready (DoR)**

The checklist a story must pass before the team takes it into a sprint, for example:

- written as a user story, with a clear user and benefit;
- acceptance criteria agreed, including at least one unhappy path;
- small enough to finish in a few days;
- estimated by the team;
- dependencies known (data, other teams, decisions);
- open questions answered.

**Definition of done (DoD)**

The checklist every item must pass before it counts as done, for example:

- meets all its acceptance criteria;
- tested on the oldest phone the pilot kiosks use;
- reviewed by a second developer;
- no known bugs of high severity;
- included in the build that will go to the pilot.

Points only count towards velocity when an item meets the definition of done. "Done except testing" is not done.

## Example

A story before and after a three-amigos conversation:

> **Before:** As a kiosk owner, I want to pay by bank transfer, so that I don't need cash on delivery.
>
> **After:** the same story, plus:
>
> - Given a transfer with the correct reference, when the bank confirms it, then the order shows "Paid" within 1 hour.
> - Given a transfer that arrives the next working day, when the delivery is due, then the driver sees "Payment pending" and can still deliver for customers marked as trusted.
> - Given a transfer for the wrong amount, when it's received, then accounts are alerted and the kiosk owner gets an SMS.
> - **Question answered:** who marks a customer as trusted? *The sales rep, approved by the area manager.*

The second and third criteria came from the tester asking "what if the money is late or wrong?". Each one would have been a bug in sprint 5.

## Walkthrough

1. In `backlog.csv`, count the bugs by sprint. When did quality start to slip?
2. Write the team's definition of ready and definition of done (the task below).
3. Take one remaining MVP story, such as "Part-payment on delivery", and run a three-amigos conversation on paper: what would the developer and tester ask?
4. Plan the refinement rhythm: when, who attends, and how far ahead the backlog should be ready.

## Practice

```answer
{
  "id": "aba-05-p1",
  "prompt": "Agile data: how many **bugs** were logged against **sprints 4 to 6**?",
  "answer": 13,
  "format": "number",
  "dataset": "agile",
  "files": ["backlog"],
  "verify": "SELECT COUNT(*) FROM backlog WHERE type = 'Bug' AND sprint BETWEEN 4 AND 6",
  "hint": "Filter type = Bug and sprint 4, 5 or 6.",
  "explanation": "13, against 3 in sprints 1 to 3. As the team sped up and took on payments, the hardest part of the product, quality slipped. A stronger definition of ready and done is the usual fix.",
  "required": true
}
```

```task
{
  "id": "aba-05-t1",
  "prompt": "Write the kiosk app team's **Definition of ready** and **Definition of done**. Put each heading on its own line, followed by at least **four** checklist items as bullets.",
  "minutes": 8,
  "rows": 12,
  "placeholder": "Definition of ready\n- ...\n\nDefinition of done\n- ...",
  "rules": [
    { "label": "A Definition of ready heading", "pattern": "^\\W*definition of ready\\W*$" },
    { "label": "A Definition of done heading", "pattern": "^\\W*definition of done\\W*$" },
    { "label": "At least eight bullets in total", "pattern": "^\\s*[-*]\\s+\\S", "min": 8 },
    { "label": "Ready includes acceptance criteria", "pattern": "acceptance criteria" },
    { "label": "Ready includes an estimate or size", "pattern": "estimat|small|size|points" },
    { "label": "Done includes testing", "pattern": "test" }
  ],
  "sample": "**Definition of ready**\n- Written as a user story with a named user and a clear benefit\n- Acceptance criteria agreed in a three-amigos session, including at least one unhappy path\n- Small enough to finish in 3 days or less\n- Estimated by the team\n- Dependencies and open questions resolved (data, decisions, other teams)\n\n**Definition of done**\n- Meets every acceptance criterion\n- Tested on the oldest Android phone used in the pilot kiosks\n- Code reviewed by a second developer\n- No open bugs of high severity\n- Shown to the product owner and included in the pilot build",
  "note": "Write these with the team, not for it: a definition the developers didn't agree to won't be followed. And review both after a few sprints. If bugs keep escaping, the definition of done isn't strong enough yet.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Who should be in a three-amigos conversation?",
    "options": ["Three developers", "Business (BA or product owner), development and testing", "The three most senior managers", "The scrum master alone"],
    "answer": 1,
    "explanation": "Three perspectives catch misunderstandings before any code is written."
  },
  {
    "prompt": "A story is 'done except testing on a phone'. Do its points count towards velocity?",
    "options": ["Yes", "No: only items that meet the definition of done count", "Half of them", "Only if the sprint is over"],
    "answer": 1,
    "explanation": "Counting unfinished work hides problems and inflates velocity."
  },
  {
    "prompt": "How far ahead should the backlog usually be refined?",
    "options": ["The whole product", "About one or two sprints' worth", "Nothing: refine during the sprint", "Exactly one story"],
    "answer": 1,
    "explanation": "Enough to plan the next sprint well, not so much that the work goes stale."
  }
]
```
