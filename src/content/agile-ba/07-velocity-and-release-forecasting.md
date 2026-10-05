---
title: Velocity and release forecasting
minutes: 25
summary: Use the team's real velocity to forecast a release as a range, show scope growth on a burn-up chart, and give stakeholders honest options when the date is at risk.
---

## The problem

The Surulere pilot is planned for the end of sprint 8, on 19 June 2026. The commercial director asks the BA a direct question on 22 May: "Will the app be ready?"

The team has finished six sprints. A quick glance at the board suggests yes: most of the original plan is done. But the board also shows a stream of stories added since March: card payments, part-payments, delivery photos, three languages. Nobody has added them up. Answering "will it be ready?" honestly means using the team's actual delivery rate and the actual remaining scope, not hope.

## The concept

### Velocity

**Velocity** is the number of story points a team completes per sprint, counting only items that meet the definition of done. Use the **average of recent sprints**, and look at the range too: velocity varies from sprint to sprint.

### Forecasting a release

> Sprints needed = remaining points ÷ average velocity

Give it as a **range**, using the team's lowest and highest recent velocities, not a single date: "between 2.2 and 3 sprints". Remember that bugs and unplanned work also use capacity even when they carry no points.

### The burn-up chart

A burn-up chart has two lines over the sprints:

- **Work done** (cumulative points completed), which rises with each sprint.
- **Total scope** (all points in the release), which rises whenever stories are added.

The release is finished where the two lines meet. If scope keeps rising as fast as work is done, the lines never meet. A burn-down chart hides that; a burn-up chart makes it obvious, which is why BAs prefer it for conversations with stakeholders.

![A burn-up chart over eight sprints: done rises to 116 points by sprint 6; scope rises from 128 to 167; a shaded forecast range ends between 148 and 164 at sprint 8, below the scope line. A dotted line marks the original 128-point plan.](/images/courses/agile-ba/burn-up.svg "The kiosk app's burn-up: the team is on pace for the original plan, not for the grown scope.")

### Options when the date is at risk

There are only three levers, and the product owner chooses between them with stakeholders:

1. **Reduce scope**: move lower-value stories out of the release (using WSJF from lesson 6).
2. **Move the date**: release a sprint later.
3. **Change capacity**: rarely works quickly (adding people to a late project usually slows it down at first).

"Work harder" is not an option. It produces bugs, as sprints 4 to 6 already showed.

## Example

The kiosk app's MVP, from `backlog.csv` and `sprints.csv`:

| | Points |
| :-- | --: |
| Original MVP plan (stories and the spike, created before 2 March) | 128 |
| Added since sprint 1 began | 39 |
| **Total MVP scope now** | **167** |
| Completed in sprints 1–6 | 116 |
| **Remaining** | **51** |

Two sprints remain before the pilot. At the team's average velocity, they'll complete roughly 39 more points, leaving about 12 points undone. And that's before allowing for bugs. Without the stories added since March, the original MVP would already be nearly finished. The date isn't at risk because the team is slow; it's at risk because scope grew by 30%.

## Walkthrough

1. Calculate velocity for each closed sprint: total points of Done items by sprint. Then the average and the range.
2. Calculate the remaining MVP points (stories not Done).
3. Draw a burn-up chart: cumulative points done by sprint, and total MVP scope by sprint (from the created dates).
4. Forecast the sprints needed as a range.
5. Write a recommendation for the commercial director with options (the task below).

## Practice

```answer
{
  "id": "aba-07-p1",
  "prompt": "What is the team's **average velocity** over sprints 1–6 (points of Done items per sprint)? One decimal place.",
  "answer": 19.3,
  "format": "number",
  "dataset": "agile",
  "files": ["backlog"],
  "verify": "SELECT ROUND(AVG(p), 1) FROM (SELECT sprint, SUM(points) AS p FROM backlog WHERE status = 'Done' GROUP BY sprint)",
  "hint": "Sum the points of Done items for each sprint, then average the six totals. Bugs have no points.",
  "required": true
}
```

```answer
{
  "id": "aba-07-p2",
  "prompt": "How many **story points** of **MVP** work are **not yet Done**?",
  "answer": 51,
  "format": "number",
  "dataset": "agile",
  "files": ["backlog"],
  "verify": "SELECT SUM(points) FROM backlog WHERE release = 'MVP' AND status <> 'Done'",
  "hint": "Filter release = MVP and status To do or In progress, and sum the points.",
  "required": true
}
```

```answer
{
  "id": "aba-07-p3",
  "prompt": "How many story points were **added** to the backlog as stories **after sprint 1 began** (created on or after 2 March 2026)?",
  "answer": 39,
  "format": "number",
  "dataset": "agile",
  "files": ["backlog"],
  "verify": "SELECT SUM(points) FROM backlog WHERE type = 'Story' AND created_date >= '2026-03-02'",
  "hint": "Filter type = Story and created_date ≥ 2026-03-02.",
  "explanation": "39 points, nearly two sprints of work. The remaining MVP is mostly scope that arrived after planning.",
  "required": true
}
```

```task
{
  "id": "aba-07-t1",
  "prompt": "Write your **answer to the commercial director**: will the MVP be ready for the pilot on 19 June? In 80 to 180 words, give the **forecast** (with numbers), explain **why** the date is at risk, and offer at least **two options** with what each means.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Not with the current scope. ...",
  "rules": [
    { "label": "Uses the velocity", "pattern": "\\b(19|20|21)(\\.\\d)?\\b[^\\n]*(points|velocity|per sprint|a sprint)|velocity" },
    { "label": "Uses the remaining points (51)", "pattern": "\\b51\\b" },
    { "label": "Explains the scope growth", "pattern": "scope|added|39" },
    { "label": "At least two options", "pattern": "option|either|alternatively|or we|or move|or cut|or release", "min": 2 },
    { "label": "One option reduces scope", "pattern": "move[^.]*(later|after the pilot|points|stories|out of)|\\bcut\\b|\\bdrop|defer|descope|reduce (the )?scope|split" },
    { "label": "Between 80 and 180 words", "minWords": 80, "maxWords": 180 }
  ],
  "sample": "Not with the current scope. The team completes about 19 points a sprint, and 51 points of MVP work remain, so two sprints will deliver about 39 points and leave roughly 12 undone, before allowing for bug fixes. The date is at risk because 39 points of new stories were added after planning began, not because the team is slow. Option 1: keep 19 June and move about 15 points to after the pilot (part-payment, Hausa and Igbo, and the promotions banner), keeping reorder and the rep tool. Option 2: keep all current scope and start the pilot one sprint later, on 3 July. I recommend option 1: the stories we'd move don't affect how often kiosks order, which is what the pilot is testing.",
  "note": "The recommendation ties the choice back to the product goal. That's what makes \"move these stories\" a decision about value rather than a request to do less.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why forecast a release as a range rather than a single date?",
    "options": ["Ranges look more professional", "Velocity varies from sprint to sprint, so a range is honest about the uncertainty", "Single dates aren't allowed in Scrum", "To avoid commitment"],
    "answer": 1,
    "explanation": "Use the range of recent velocities to show best and worst cases."
  },
  {
    "prompt": "On a burn-up chart, the total-scope line rises as fast as the work-done line. What does that mean?",
    "options": ["The team is fast", "Scope is growing as fast as work is done, so the release will never finish unless something changes", "The chart is wrong", "The release is finished"],
    "answer": 1,
    "explanation": "Burn-up charts make scope growth visible."
  },
  {
    "prompt": "The release is at risk. Which is not a real option?",
    "options": ["Reduce scope", "Move the date", "Ask the team to work harder for the last two sprints", "Agree which stories can wait"],
    "answer": 2,
    "explanation": "Pushing harder usually produces bugs and burnout, not finished software."
  }
]
```
