---
title: Estimation and prioritisation
minutes: 20
summary: Size work relatively with story points and planning poker, and order the backlog by value with cost of delay and WSJF, so the most valuable small things come first.
---

## The problem

With two sprints to go before the Surulere pilot, the kiosk app still has 11 stories in its MVP backlog, and the team can't do them all. The sales director wants card payments. The marketing manager wants a promotions banner. The area manager wants Yoruba, Hausa and Igbo. Each is convinced theirs matters most.

"Everything is a priority" means nothing is. The product owner needs a way to compare items that's more objective than who argues loudest. And to compare value with effort, the team needs estimates it trusts, which aren't the same as promises.

## The concept

**Story points: relative estimates**

Instead of estimating hours, agile teams compare items with each other: "Is this bigger or smaller than 'Log in with PIN'?" Story points (often on a Fibonacci-like scale: 1, 2, 3, 5, 8, 13) capture size, complexity and uncertainty together. They're relative and team-specific: one team's 5 isn't another's.

**Planning poker**

Each developer privately picks a card, everyone shows at once, and the highest and lowest explain their reasoning. The conversation is the point: a 2 and a 13 on the same story means someone knows something the others don't. Then the team estimates again.

**Cost of delay and WSJF**

**Cost of delay** asks: what do we lose for every sprint this item isn't done? A simple version scores three things from 1 to 20 (relative to each other):

- **User or business value**: how much users or the business gain.
- **Time criticality**: does the value fall if it's late (a pilot date, a competitor, a regulation)?
- **Risk reduction or opportunity**: does it reduce a risk, or unlock other work or learning?

**WSJF** (weighted shortest job first) divides the cost of delay by the size:

> **WSJF = (value + time criticality + risk reduction) ÷ job size (story points)**

High-value, small items rise to the top. Big items need a big cost of delay to justify going first.

## Example

The product owner, the BA and two stakeholders scored five remaining MVP stories together:

| Story | Value | Time criticality | Risk reduction | Cost of delay | Points | WSJF |
| :-- | --: | --: | --: | --: | --: | --: |
| Rep sees kiosks that haven't ordered in 14 days | 8 | 5 | 5 | 18 | 3 | ? |
| Reorder last basket | 13 | 8 | 3 | 24 | 8 | ? |
| Pay by card | 5 | 3 | 2 | 10 | 5 | ? |
| Part-payment on delivery | 3 | 2 | 1 | 6 | 5 | ? |
| Yoruba, Hausa and Igbo language options | 5 | 2 | 1 | 8 | 8 | ? |

The scores are judgements, made together and in the open. Their value is that the reasoning is visible and the comparison is consistent.

## Walkthrough

1. Calculate the WSJF column in the table above.
2. Order the five stories by WSJF. Does the order match the product goal of more frequent kiosk ordering?
3. Notice that the rep tool, a small story, beats bigger "headline" features. Small, valuable items go first.
4. Write the order with a one-line reason for each (the task below).
5. Agree with the product owner what happens to the bottom items: split them, move them to "Later", or drop them.

## Practice

```answer
{
  "id": "aba-06-p1",
  "prompt": "What is the **WSJF** score for **Reorder last basket**? One decimal place.",
  "answer": 3.0,
  "format": "number",
  "hint": "(13 + 8 + 3) ÷ 8.",
  "required": true
}
```

```answer
{
  "id": "aba-06-p2",
  "prompt": "Which story in the table has the **highest** WSJF? Type its title.",
  "answer": "Rep sees kiosks that haven't ordered in 14 days",
  "accept": ["Rep sees kiosks that haven’t ordered in 14 days", "Rep sees kiosks that havent ordered in 14 days", "Rep sees kiosks"],
  "format": "text",
  "hint": "18 ÷ 3.",
  "explanation": "6.0, twice Reorder's 3.0. A small rep tool that prompts follow-up calls helps kiosks order more often, straight away, for very little work.",
  "required": true
}
```

```task
{
  "id": "aba-06-t1",
  "prompt": "Write the **priority order** of the five stories in the table, one per line, in the form **Rank. Story | WSJF | reason**. Then add a final line starting **Decision:** saying what should happen to the lowest-ranked story or stories.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "1. Rep sees kiosks ... | 6.0 | ...",
  "rules": [
    { "label": "Five ranked lines in the form Rank. Story | WSJF | reason", "pattern": "^\\s*\\d[.)]\\s*[^|\\n]+\\|\\s*\\d+(\\.\\d+)?\\s*\\|[^|\\n]+$", "min": 5 },
    { "label": "The rep tool is ranked first", "pattern": "^\\s*1[.)]\\s*rep" },
    { "label": "Has a Decision line", "pattern": "^\\s*decision\\s*:" },
    { "label": "The decision moves, splits or drops something", "pattern": "decision\\s*:[^\\n]*(later|split|drop|defer|move|postpone|remove|next release|after the pilot)" }
  ],
  "sample": "1. Rep sees kiosks that haven't ordered in 14 days | 6.0 | small, and directly prompts more frequent orders\n2. Reorder last basket | 3.0 | the core of the product goal: ordering in two taps\n3. Pay by card | 2.0 | useful, but most pilot kiosks pay on delivery or by transfer\n4. Part-payment on delivery | 1.2 | few kiosks need it; reps can handle it by hand in the pilot\n5. Yoruba, Hausa and Igbo language options | 1.0 | large, and only Yoruba matters in Surulere\nDecision: move part-payment to Later, and split the language story so only Yoruba stays in the pilot release.",
  "note": "The decision line is what turns a scoring exercise into a plan. Splitting the language story keeps the valuable part (Yoruba for Surulere) and drops the expensive part that the pilot doesn't need.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Two developers estimate a story at 2 and 13 points. What should happen?",
    "options": ["Average them", "They explain their reasoning, because one of them knows something the other doesn't; then the team re-estimates", "Use the higher number", "Use the lower number"],
    "answer": 1,
    "explanation": "The discussion is the most valuable part of planning poker."
  },
  {
    "prompt": "Why does WSJF divide cost of delay by job size?",
    "options": ["To make the numbers smaller", "So small, valuable items come before large ones of similar value, delivering value sooner", "Because large items are unimportant", "It's a rule of Scrum"],
    "answer": 1,
    "explanation": "Doing short, valuable jobs first reduces the total cost of delay."
  },
  {
    "prompt": "Are story points a promise of how many hours the work will take?",
    "options": ["Yes", "No: they're relative estimates of size and uncertainty, useful for planning across many items", "Only for bugs", "Only for senior developers"],
    "answer": 1,
    "explanation": "Estimates inform plans; they aren't commitments for each item."
  }
]
```
