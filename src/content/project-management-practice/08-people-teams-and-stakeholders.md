---
title: People, Teams and Stakeholders
minutes: 30
summary: Build and lead a team, motivate people and handle conflict, engage stakeholders and plan communication and meetings.
---

## Building and leading a team

Projects are done by people. A good team has the **right skills, clear roles and a shared goal.**

Building the team:

- **Define roles and responsibilities** clearly. A simple **RACI** chart shows for each task who is **R**esponsible (does it), **A**ccountable (owns the result; one person), **C**onsulted and **I**nformed.
- **Match skills to tasks.** Identify gaps, and decide whether to train, hire, borrow or outsource.
- **Set team norms:** how we communicate, meet, make decisions and deal with problems.
- **Explain the purpose** and each person's contribution.

Teams usually develop through stages (Tuckman's model):

1. **Forming:** polite and uncertain; people need direction.
2. **Storming:** disagreement over roles and methods; needs leadership and clear rules.
3. **Norming:** agreement on how to work; trust grows.
4. **Performing:** effective and self-driven.
5. **Adjourning:** the project ends; recognise achievements.

A leader adapts: more **directing** at the start, more **coaching** and **delegating** as the team matures. Lead by example, be fair, give clear goals and feedback, remove obstacles and protect the team from unnecessary interference. Treat people with respect, regardless of rank.

## Motivation and conflict

**Motivation:** what moves people to do good work. Money matters, but so do:

- **Purpose:** knowing why the work matters.
- **Autonomy:** some control over how they do it.
- **Mastery:** chances to learn and improve.
- **Recognition:** thanks and credit for good work.
- **Fairness and safety:** reasonable workloads, fair treatment and a safe space to raise problems.
- **Clear goals and feedback.**

Ask people what motivates them; do not assume.

**Conflict** is normal on projects: over priorities, resources, methods and personalities. Handled well, it improves decisions; handled badly, it destroys trust. Approaches:

| Approach | Meaning | Use when |
| :-- | :-- | :-- |
| **Collaborate / problem-solve** | Work together for a solution both accept | Important issues; the best long-term result |
| **Compromise** | Each gives something up | Time is short; partial agreement is enough |
| **Accommodate** | Give way to keep the peace | The issue matters more to the other side |
| **Compete / force** | Use authority to decide | Emergencies or unpopular necessary decisions |
| **Avoid / withdraw** | Postpone | Cooling off, or the issue is trivial |

Steps: **meet privately, listen to each side, focus on the issue and not the person, agree facts, identify common goals, generate options and agree actions.** Escalate to the sponsor or a manager only if needed.

## Stakeholder engagement

Using your stakeholder list and the power and interest grid, plan how to engage each group. Describe the **current** engagement level (unaware, resistant, neutral, supportive or leading) and the **desired** one.

Strategies:

- **High power, high interest (manage closely):** involve them in decisions, meet often, seek their views early.
- **High power, low interest (keep satisfied):** brief, concise updates; consult on key decisions.
- **Low power, high interest (keep informed):** regular updates, listen to feedback, use them as helpers.
- **Low power, low interest (monitor):** minimal effort, but watch for changes.

Build **relationships** before you need them. Understand each person's interests and fears. Be honest, deliver on promises, and deal with resistance by listening to the underlying concern. A resistant stakeholder who feels heard may become an ally.

## Communication planning and meetings

Poor communication causes many project failures. A **communication plan** says **who** needs **what** information, **when**, **how** and from **whom.**

| Audience | Information | Frequency | Method | Owner |
| :-- | :-- | :-- | :-- | :-- |
| Sponsor | Status, risks, decisions needed | Weekly | Short report and call | PM |
| Team | Tasks, progress, issues | Daily or twice weekly | Stand-up meeting, chat | PM |
| Users | What is changing and when | Monthly | Email, demos | PM |
| Suppliers | Orders, schedule changes | As needed | Email, calls | Purchasing |

Tips:

- **Use the right channel:** urgent issues by phone or in person; decisions and records in writing.
- **Keep it short, clear and honest.** Do not hide bad news.
- **Confirm understanding.**
- **Document important decisions.**

**Effective meetings:**

- Have a **clear purpose** (decide, inform, solve a problem) and only the people needed.
- Send an **agenda** in advance, with times.
- **Start and end on time.**
- **Assign a chair and a note-taker.**
- Focus on **decisions and actions:** who does what by when.
- Send **minutes** within a day, listing decisions and actions.
- **Cancel** meetings that are not needed.

## Try it

```task
{
  "id": "pmgt-m08-t1",
  "prompt": "Build a **communication plan** for your project: at least **five audiences**, one per line, each with what they need, how often, the method and the owner.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Sponsor - status and risks - weekly - short report - PM",
  "rules": [
    { "label": "At least five lines", "minLines": 5 },
    { "label": "Includes the sponsor and the team", "pattern": "sponsor[\\s\\S]*team|team[\\s\\S]*sponsor" },
    { "label": "Each line states a frequency", "pattern": "daily|weekly|monthly|twice|as needed|fortnight", "perLine": true },
    { "label": "Each line states a method", "pattern": "email|call|meeting|report|chat|whatsapp|demo|stand-up|in person", "perLine": true },
    { "label": "Each line states an owner", "pattern": "pm|project manager|owner|bursar|lead|purchasing|manager", "perLine": true }
  ],
  "sample": "Sponsor - status, risks and decisions needed - weekly - short report and call - PM\nTeam - tasks, progress and issues - daily - ten-minute stand-up meeting - PM\nPrincipal and teachers - what is changing and when - monthly - email and a short demo - PM\nSupplier and installer - orders and schedule changes - as needed - email and calls - purchasing lead\nParents' association - progress and costs - monthly - WhatsApp update - bursar",
  "required": true
}
```

```task
{
  "id": "pmgt-m08-t2",
  "prompt": "Two team members **disagree** about who should do a task, and it is affecting the team. In 60 to 120 words, describe the steps you would take to resolve it.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "I would first ...",
  "rules": [
    { "label": "Meets privately or listens to each side", "pattern": "privately|listen|each (side|person)|separately|hear" },
    { "label": "Focuses on the issue, facts or goals", "pattern": "facts|issue|goal|common|not the person|objective|project" },
    { "label": "Generates options or collaborates", "pattern": "option|agree|together|collaborat|solution|compromise" },
    { "label": "Agrees actions and follows up", "pattern": "action|follow|check|agree[^\\n]*(who|by when)|document" },
    { "label": "Between 60 and 120 words", "minWords": 60, "maxWords": 125 }
  ],
  "sample": "I would first speak to each person privately and listen to their view without taking sides. Then I would bring them together, focus on the facts and the project goal rather than the people, and ask for options. I would check the RACI chart to see who is responsible and accountable, and we would agree a solution together, such as splitting the task. I would write down who does what by when, and follow up in a few days to check the relationship has improved.",
  "required": true
}
```

```task
{
  "id": "pmgt-m08-t3",
  "prompt": "Write the **agenda for a 30-minute weekly project meeting**: at least five items with times, and the output you expect (decisions and actions).",
  "minutes": 8,
  "rows": 8,
  "placeholder": "0-5 min: ...",
  "rules": [
    { "label": "At least five lines", "minLines": 5 },
    { "label": "Includes times", "pattern": "\\d+\\s*(-|to)\\s*\\d+|\\d+\\s*min", "min": 4 },
    { "label": "Includes progress and risks or issues", "pattern": "progress[\\s\\S]*(risk|issue)|(risk|issue)[\\s\\S]*progress" },
    { "label": "Includes decisions and actions", "pattern": "decision[\\s\\S]*action|action[\\s\\S]*decision" }
  ],
  "sample": "0-5 min: review last week's actions\n5-12 min: progress against the schedule and milestones\n12-18 min: risks and issues needing attention\n18-24 min: decisions needed and change requests\n24-28 min: confirm actions, owners and dates\n28-30 min: any other business and next meeting\nOutput: minutes with decisions and actions sent within a day",
  "required": false
}
```

Next lesson: agile and hybrid delivery.
