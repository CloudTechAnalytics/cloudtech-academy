---
title: Execution, Monitoring and Reporting
minutes: 30
summary: Run the plan, track progress, write status reports and dashboards and take corrective action.
---

## Running the plan

**Execution** is where the plan becomes results. The manager's job is to get the right work done, by the right people, to the right standard.

Start well with a **kick-off meeting:** introduce the team, state the goal, scope, schedule and roles, review the plan and risks, agree how you will communicate and answer questions. A good start builds commitment.

During execution:

- **Direct and coordinate** the work. Make sure each person knows their tasks, deadlines and standards.
- **Remove obstacles** quickly: missing information, equipment, approvals, conflicts.
- **Manage the team:** motivate, coach, give feedback, resolve conflict.
- **Manage suppliers and contracts.**
- **Perform quality assurance** and acceptance tests.
- **Communicate** as planned.
- **Handle issues, risks and changes** through the agreed processes.
- **Keep records:** decisions, changes, risks, issues, time and cost.

Be visible, ask questions and listen. Many problems appear first as small remarks. Trust your team, but verify progress with facts, not only assurances.

## Tracking progress

**Monitoring** compares what is actually happening with the plan, on schedule, cost, scope, quality and risk. Do it regularly, weekly for most projects.

Ways to measure progress:

- **Milestones achieved** against plan.
- **Tasks completed** (done or not done is more reliable than "80% finished").
- **Percentage complete** for work packages, using clear rules (for example 0%, 50% when started and 100% only when accepted).
- **Earned value** (CPI and SPI, module 5).
- **Time and cost spent versus planned.**
- **Quality measures:** defects, test results.
- **Issues and risks** open or closed.
- **Burndown or velocity** in agile projects.

Beware the **"90% done" syndrome,** where a task is reported nearly finished for weeks. Break work into small tasks with clear completion rules, and ask: *"What remains, and how long will that take?"*

Watch **trends,** not only snapshots: slipping a day a week for four weeks is a month's delay waiting to happen.

## Status reports and dashboards

A **status report** tells stakeholders where the project stands. Keep it short, consistent and honest. A good one-page report includes:

1. **Overall status** with a **RAG** colour: **Green** (on track), **Amber** (at risk, with a plan), **Red** (off track, help needed).
2. **Progress since last report:** milestones and key tasks completed.
3. **Planned next period.**
4. **Schedule status** (and key dates).
5. **Budget status:** spent, forecast final cost, variance.
6. **Top risks and issues,** with actions and owners.
7. **Changes** approved or pending.
8. **Decisions or help needed** from the sponsor.

Example: *Overall: Amber. Schedule: 5 days behind because equipment arrived late; recovery plan: second installation team from 12 June. Budget: ₦2.1m spent of ₦4.95m; forecast ₦4.95m (no variance). Top risk: roof strength, survey due Friday. Decision needed: approve ₦150,000 for the second team.*

A **dashboard** shows the same key numbers visually: a progress bar, a milestone timeline, budget versus actual, a risk summary and RAG indicators. Keep to a few meaningful measures. Update it regularly, and make sure the colours mean what they say. Reporting everything as green until it suddenly turns red destroys trust. **Report bad news early,** with a proposed solution.

## Corrective action

When monitoring shows a gap, act.

1. **Understand the cause,** not just the symptom. Ask "why?" several times.
2. **Assess impact** on schedule, cost, scope, quality and risk.
3. **Generate options.** Common ones:
   - **Schedule:** add resources to critical activities (**crashing**), run tasks in parallel (**fast-tracking**), reduce scope, work overtime, or accept a later date.
   - **Cost:** reduce scope, renegotiate prices, use cheaper alternatives, improve productivity, use contingency.
   - **Quality:** extra checks, retraining, fix the process.
   - **Risk or issue:** apply the response plan; escalate if needed.
4. **Choose and get approval** if the action changes baselines, using change control.
5. **Implement,** assign an owner and a date.
6. **Check the result** and learn.

Example: the schedule shows the critical path **5 days behind.** Options: add a second installation team (₦150,000, saves 4 days), or work Saturdays (₦60,000, saves 2 days). The manager recommends both to recover the time, costing ₦210,000, covered from contingency with sponsor approval.

Always be honest with the sponsor about the situation, the options and your recommendation.

## Try it

```task
{
  "id": "pmgt-m10-t1",
  "prompt": "Write a **one-page status report** (at least eight lines) for your project: overall RAG status, progress, next period, schedule, budget (spent and forecast), top two risks and issues, and a decision needed.",
  "minutes": 15,
  "rows": 11,
  "placeholder": "Overall status: Amber ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Overall status with a RAG colour", "pattern": "green|amber|red" },
    { "label": "Progress and next period", "pattern": "progress[\\s\\S]*next|next[\\s\\S]*progress|completed[\\s\\S]*(next|planned)" },
    { "label": "Schedule and budget", "pattern": "schedule[\\s\\S]*budget|budget[\\s\\S]*schedule" },
    { "label": "Naira figures for spend or forecast", "pattern": "₦\\s?\\d" },
    { "label": "Risks or issues with actions", "pattern": "risk|issue" },
    { "label": "A decision needed", "pattern": "decision|approve|approval|need" }
  ],
  "sample": "Overall status: Amber\nProgress: design approved; equipment ordered; roof survey completed\nNext period: equipment delivery and start of installation\nSchedule: 5 days behind because equipment arrived late; recovery plan is a second installation team from 12 June\nBudget: ₦2.1 million spent of ₦4.95 million; forecast ₦4.95 million with no variance\nTop risk: roof strength; survey results due Friday\nTop issue: customs delay on the inverter; agent chasing release\nDecision needed: approve ₦150,000 for the second installation team",
  "required": true
}
```

```task
{
  "id": "pmgt-m10-t2",
  "prompt": "The critical path is **5 days behind**. Option 1: a second team costs **₦150,000** and saves **4 days**. Option 2: Saturday work costs **₦60,000** and saves **2 days**. Work out the cost per day saved for each, the combined cost and time saved and what you would recommend.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Option 1 cost per day = ...",
  "rules": [
    { "label": "₦37,500 per day for option 1", "pattern": "37,?500" },
    { "label": "₦30,000 per day for option 2", "pattern": "30,?000" },
    { "label": "Combined cost of ₦210,000", "pattern": "210,?000" },
    { "label": "Combined saving of 6 days", "pattern": "\\b6\\s*days" },
    { "label": "Makes a recommendation", "pattern": "recommend|both|choose|propose" }
  ],
  "sample": "Option 1: 150,000 / 4 = ₦37,500 per day saved. Option 2: 60,000 / 2 = ₦30,000 per day saved.\nTogether they cost 150,000 + 60,000 = ₦210,000 and save 6 days, more than the 5 needed.\nI recommend both, funded from contingency with the sponsor's approval, or Option 1 plus a day of Saturday work if I want to spend less.",
  "required": true
}
```

```task
{
  "id": "pmgt-m10-t3",
  "prompt": "Explain in 50 to 100 words why you should **report bad news early** to the sponsor, and what you should bring with the bad news.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Reporting early ...",
  "rules": [
    { "label": "Says early reporting gives time to act or more options", "pattern": "time|options|early|sooner|act|help|options" },
    { "label": "Mentions trust or credibility", "pattern": "trust|credib|surpris|honest" },
    { "label": "Says to bring facts, impact, options or a recommendation", "pattern": "options|recommend|plan|solution|impact|facts|cause" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "Reporting bad news early gives the sponsor time and options to help, while a problem reported late is bigger, costlier and harder to fix. It also protects trust, because sponsors dislike surprises and respect honesty. I would bring the facts, the cause, the impact on schedule and cost, two or three options and my recommendation, so the conversation is about solutions and the decision needed, not just the problem.",
  "required": false
}
```

Next lesson: closing and learning.
