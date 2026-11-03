---
title: Schedule Management
minutes: 20
summary: List activities and dependencies, estimate time, find the critical path, use Gantt charts and level resources.
---

## Activities and dependencies

Once you have a work breakdown structure, turn work packages into **activities** and put them in order. A **dependency** is a relationship between activities. The commonest is **finish-to-start:** Activity B cannot start until Activity A finishes (you cannot paint until the walls are plastered).

Other types: **start-to-start** (B can start when A starts), **finish-to-finish** (B cannot finish until A finishes) and **start-to-finish** (rare). Also consider:

- **Mandatory dependencies:** forced by the nature of the work (foundations before walls).
- **Discretionary dependencies:** chosen by good practice.
- **External dependencies:** relying on things outside the project (a supplier's delivery, a government approval).
- **Lead and lag:** a **lag** is a delay (concrete must cure for 3 days); a **lead** is an overlap.

List each activity with an ID, name, duration estimate, predecessors and who is responsible. Include **milestones** (zero-duration markers for key events, such as "design approved").

## Estimating time

Good estimates come from people who will do the work, with historic data where possible.

- **Analogous:** use durations of similar past projects.
- **Parametric:** use a rate (for example 10 square metres of tiling per person per day).
- **Bottom-up:** estimate each small activity and add up.
- **Three-point (PERT):** account for uncertainty with an optimistic (O), most likely (M) and pessimistic (P) estimate.

*Expected duration = (O + 4M + P) ÷ 6.*

Example: O = 4 days, M = 6 days, P = 14 days. Expected = (4 + 24 + 14) ÷ 6 = 42 ÷ 6 = **7 days.** Notice it is longer than the most likely 6, because the pessimistic case is far from the others.

Estimating tips:

- **Include everyone's time:** reviews, waiting, rework.
- **Account for the real working calendar:** weekends, holidays, rainy seasons, festive periods.
- **Do not pad secretly.** Add **contingency** openly, at project level.
- **Revise** as you learn.
- **Beware optimism.** People tend to underestimate.

## Critical path method

The **critical path** is the **longest sequence** of dependent activities from start to finish. It determines the **shortest possible project duration.** Any delay on a critical-path activity delays the whole project.

Example: Activity A (3 days) must finish first. Then B (4 days) and C (6 days) can run in parallel. Both must finish before D (2 days).

- Path A → B → D = 3 + 4 + 2 = **9 days.**
- Path A → C → D = 3 + 6 + 2 = **11 days.**

The longest path is **A → C → D = 11 days**, so that is the critical path, and the project takes **11 days.** Activity B is not critical: it has **float** (slack) of 11 − 9 = **2 days**, meaning it can slip up to 2 days without delaying the project.

Why it matters:

- **Focus attention** on critical activities.
- **Use float** of non-critical tasks to move resources.
- **To shorten the project,** shorten critical activities (add resources, change method, overlap activities). Shortening a non-critical activity does nothing.
- **Watch for the critical path changing** if non-critical activities are delayed beyond their float.

## Gantt charts and schedule tools

A **Gantt chart** shows activities as horizontal bars on a timeline, with dependencies and milestones. It is the most common schedule view, easy to read and to share. You can build one in a spreadsheet, a free project tool or specialised software.

A good schedule shows:

- Activities with start and finish dates.
- Dependencies (arrows).
- Milestones.
- The critical path (often coloured).
- Who is responsible.
- Progress (shaded part of the bar).

Establish a **schedule baseline** (the approved plan) and compare actual progress against it. Keep the schedule up to date; an out-of-date Gantt chart is worse than none.

## Resource levelling

A schedule that looks right on paper may overload people. If one person is assigned 14 hours of work in a 8-hour day, or a machine is needed in two places at once, the plan will not work.

**Resource levelling** adjusts the schedule so resource demand is realistic. Ways:

- **Delay** non-critical activities (using float) to avoid overload.
- **Reassign** work to others or add resources.
- **Extend** an activity's duration if fewer people work on it.
- **Split** large activities.
- **Reduce scope** or accept a later finish if resources are limited.

Levelling may extend the project end date, so check the effect and tell the sponsor. Plan for **availability:** leave, training, other commitments and the real productive hours of a working day, usually less than a full day.

## Try it

```task
{
  "id": "pmgt-m04-t1",
  "prompt": "Activities: **A** 3 days (first), **B** 4 days and **C** 6 days (both after A), **D** 2 days (after B and C). Work out the length of each path, the **critical path**, the **project duration** and the **float of B**.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "A-B-D = ...",
  "rules": [
    { "label": "Path A-B-D of 9 days", "pattern": "\\b9\\b" },
    { "label": "Path A-C-D of 11 days", "pattern": "\\b11\\b" },
    { "label": "Critical path A-C-D", "pattern": "a\\s?[-→>]+\\s?c\\s?[-→>]+\\s?d|a, c, d|a-c-d" },
    { "label": "Float of B is 2 days", "pattern": "float[^\\n]*\\b2\\b|\\b2 days" }
  ],
  "sample": "A-B-D = 3 + 4 + 2 = 9 days.\nA-C-D = 3 + 6 + 2 = 11 days.\nThe longest path is A-C-D, so that is the critical path and the project takes 11 days.\nB has float of 11 - 9 = 2 days, so it can slip 2 days without delaying the project.",
  "required": true
}
```

```task
{
  "id": "pmgt-m04-t2",
  "prompt": "An activity has an **optimistic** estimate of **4 days**, a **most likely** of **6** and a **pessimistic** of **14**. Calculate the expected duration using (O + 4M + P) ÷ 6, and say why it is longer than the most likely.",
  "minutes": 8,
  "rows": 5,
  "placeholder": "Expected = ...",
  "rules": [
    { "label": "Expected duration of 7 days", "pattern": "\\b7\\b" },
    { "label": "Shows the formula calculation", "pattern": "4\\s?\\+\\s?24\\s?\\+\\s?14|42\\s?/\\s?6|42\\s?÷\\s?6" },
    { "label": "Explains the pessimistic case pulls it up", "pattern": "pessimistic|risk|uncertain|far|longer|skew" }
  ],
  "sample": "Expected = (4 + 4 x 6 + 14) / 6 = (4 + 24 + 14) / 6 = 42 / 6 = 7 days.\nIt is longer than the most likely 6 days because the pessimistic estimate of 14 is much further from the likely value, which pulls the average up.",
  "required": true
}
```

```task
{
  "id": "pmgt-m04-t3",
  "prompt": "Build a **schedule table** for your project with at least **eight activities**. One per line: ID, activity, duration in days, predecessor and owner. Include at least one milestone.",
  "minutes": 15,
  "rows": 11,
  "placeholder": "A - Site survey - 2 days - none - Tunde",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Every line has a duration", "pattern": "\\d+\\s*(days?|d\\b)|milestone|0 days", "min": 8 },
    { "label": "Lines include predecessors", "pattern": "predecessor|after|none|start|depends|[a-h]\\s*,|\\b[a-h]\\b[^\\n]*\\b[a-h]\\b", "min": 6 },
    { "label": "Includes a milestone", "pattern": "milestone" }
  ],
  "sample": "A - Site survey - 2 days - none - Tunde\nB - System design - 4 days - after A - Ngozi\nC - Design approval - milestone - after B - Principal\nD - Order equipment - 3 days - after C - Bursar\nE - Equipment delivery - 14 days - after D - Supplier\nF - Installation - 6 days - after E - Installer\nG - Testing and inspection - 2 days - after F - Installer\nH - Staff training - 2 days - after G - Ngozi\nI - Handover - milestone - after H - Tunde",
  "required": false
}
```

Next lesson: cost and budget management.
