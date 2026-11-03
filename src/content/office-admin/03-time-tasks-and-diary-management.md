---
title: Time, Tasks and Diary Management
minutes: 25
summary: Prioritise work, manage a manager's diary, use reminders and follow-up and handle interruptions.
---

## Prioritising

Administrators often have many requests at once from several people. **Prioritising** means deciding what to do first so that the most important and urgent work gets done, and nothing is forgotten.

A simple tool is the **urgent and important matrix:**

| | Urgent | Not urgent |
| :-- | :-- | :-- |
| **Important** | **Do now:** deadlines today, a crisis, the manager's priority | **Plan:** preparation, filing systems, training, improvements |
| **Not important** | **Delegate or do quickly:** some interruptions and requests | **Drop or delay:** time wasters |

Most people spend too much time on "urgent" and neglect "important, not urgent" tasks, which then become urgent later. Block time for planning and preparation.

Practical habits:

- **Make a to-do list every day,** ideally the night before or first thing. List tasks, deadlines and estimated times.
- **Choose your top three** for the day.
- **Do the hardest or most important tasks when you are fresh,** and routine ones when you are tired.
- **Break big tasks into steps.**
- **Group similar tasks** (all calls together, all filing together).
- **Ask when priorities clash:** *"Mr Bello needs the letter at 2 pm and Mrs Eze needs the schedule by 3 pm. Which should I do first?"* Never guess silently.
- **Say no or negotiate politely** when you cannot take on more: "I can do that after 4 pm. Would that be all right?"
- **Review at the end of the day:** what is done, what moves to tomorrow.

**A time audit** shows where your time goes. Example for a 40-hour week: email **10 hours** (25%), meetings and minutes **8 hours** (20%), phone and visitors **6 hours** (15%), filing and records **4 hours** (10%), and other tasks **12 hours** (30%). Looking at it, you might see that email takes a quarter of your time and decide to check it at set times instead of constantly.

## Managing a manager's diary

Managing a manager's **diary (calendar)** is a trusted job. A well-managed diary protects their time and prevents embarrassment.

**Principles:**

- **Know their priorities:** which meetings and people come first, and what time they must protect (thinking time, family commitments, travel).
- **Know their preferences:** best times for meetings, how long they like, what they dislike.
- **Keep one master diary,** updated immediately, and shared with the people who need it.
- **Never double-book,** unless you have agreed it.
- **Allow travel and buffer time** between meetings. Example: a manager has five meetings of **1 hour** each in an 8-hour day (9 am to 5 pm). With a **15-minute** buffer after each meeting: total meeting time = 5 hours; buffers = 5 × 0.25 = 1.25 hours; time used = 6.25 hours, which leaves **1.75 hours** for lunch, calls and thinking. A schedule with no buffers will run late.
- **Include all details:** date, time, location or link, attendees, phone numbers, purpose and papers needed.
- **Confirm appointments** by email or message the day before.
- **Prepare papers and briefings** in advance.
- **Check time zones** for international calls.
- **Handle requests:** say "Let me check the diary and get back to you," and offer two or three options.
- **Protect important blocks** (such as board meetings and deadlines) and ask before moving anything.
- **Manage cancellations and changes** politely and quickly, informing everyone.
- **Review the next day and week** with the manager at a fixed time.

Use a shared digital calendar (Outlook, Google Calendar or similar) with reminders and colour categories, and keep a back-up of key dates.

## Reminders and follow-up

Much of an administrator's value is making sure **things actually happen.**

- **Write everything down:** requests, deadlines, promises, "call me back."
- **Use reminders:** calendar alerts, task apps, sticky notes, a follow-up file or "tickler" system (a set of folders for each day or month).
- **Set reminders earlier than the deadline** (for example two days before) so there is time to act.
- **Keep an action log:** task, who, date asked, due date, status. Review it daily.
- **Follow up politely and persistently:** "I am following up on the signed form for the 3 pm courier. Could you let me have it by noon, please?"
- **Confirm completion** and update your log.
- **Remind your manager** of important deadlines, commitments and renewals (insurance, licences, contracts, anniversaries).
- **Close the loop:** tell the person who asked when it is done.

## Handling interruptions

Interruptions are part of the job, but they can destroy focus and cause errors.

- **Plan for them:** do not schedule your whole day; leave buffer time.
- **Decide what is truly urgent:** emergencies and your manager's urgent needs come first; a casual question can wait or be scheduled.
- **Use polite phrases:** "I am finishing something. Can I come to you in 15 minutes?" or "Let me note that down and come back to you at 2 pm."
- **Return to your task:** write a quick note of where you stopped.
- **Batch email and messages:** check at set times instead of every minute. Turn off non-essential notifications.
- **Create quiet time** for tasks that need concentration, and tell colleagues.
- **Handle visitors and calls efficiently:** be warm but keep them on track.
- **Record repeated interruptions** and fix their causes (a common question might need an FAQ sheet).

Keep calm and flexible. Good administrators protect their focus without being unhelpful.

## Try it

```task
{
  "id": "poa-m03-t1",
  "prompt": "A manager has **five 1-hour meetings** in an 8-hour day (9 am to 5 pm) and you add a **15-minute buffer** after each. Work out the total meeting time, total buffer time, time used and the time left. Then say whether you would also fit in a sixth meeting and why.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Meetings = ...",
  "rules": [
    { "label": "5 hours of meetings", "pattern": "\\b5\\s*hours" },
    { "label": "1.25 hours of buffer", "pattern": "1\\.25|75 minutes" },
    { "label": "6.25 hours used", "pattern": "6\\.25" },
    { "label": "1.75 hours left", "pattern": "1\\.75" },
    { "label": "Says not to add a sixth (little time left, lunch, thinking time)", "pattern": "not|would not|wouldn't|avoid|lunch|thinking|calls|too tight|no" }
  ],
  "sample": "Meetings = 5 x 1 hour = 5 hours.\nBuffers = 5 x 15 minutes = 1.25 hours.\nTime used = 5 + 1.25 = 6.25 hours, which leaves 8 - 6.25 = 1.75 hours.\nI would not add a sixth meeting, because the remaining time is needed for lunch, calls and thinking time, and the schedule would have no room for delays.",
  "required": true
}
```

```task
{
  "id": "poa-m03-t2",
  "prompt": "Write your **to-do list for one busy day** with at least eight tasks. For each, give a priority (do now, plan, delegate or delay) and an estimated time. One per line, with your top three marked.",
  "minutes": 12,
  "rows": 11,
  "placeholder": "1. Letter to Mr Ade - do now - 30 min",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Each line has a priority category", "pattern": "do now|plan|delegate|delay|urgent|high|medium|low", "min": 8 },
    { "label": "Each line has a time estimate", "pattern": "\\d+\\s*(min|minutes|hour|hours|hr)", "min": 8 },
    { "label": "Marks the top three", "pattern": "top (three|3)|\\*|priority 1|first|#1|#2|#3" }
  ],
  "sample": "1. Prepare the board papers - do now - 90 min *\n2. Confirm Mr Bello's 2 pm meeting room - do now - 10 min *\n3. Reply to urgent vendor email - do now - 15 min *\n4. Book next week's flight - plan - 20 min\n5. File yesterday's invoices - plan - 30 min\n6. Collect courier parcel - delegate to the messenger - 10 min\n7. Order printer paper - plan - 15 min\n8. Tidy the stationery cupboard - delay to Friday - 30 min\nTop three are marked with *",
  "required": true
}
```

```task
{
  "id": "poa-m03-t3",
  "prompt": "A colleague interrupts you while you are finishing an urgent report. Write the **polite words** you would use in two different cases: (a) it is not urgent, (b) it is genuinely urgent. 40 to 90 words in total.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "(a) ...\n(b) ...",
  "rules": [
    { "label": "Has both cases (a) and (b)", "pattern": "\\(a\\)[\\s\\S]*\\(b\\)|case a[\\s\\S]*case b" },
    { "label": "Case (a) postpones politely with a time", "pattern": "after|in \\d+ minutes|at \\d|come back|finish|when i" },
    { "label": "Case (b) shows willingness to help now", "pattern": "now|straight away|of course|right away|let me" },
    { "label": "Between 40 and 90 words", "minWords": 40, "maxWords": 95 }
  ],
  "sample": "(a) \"I am finishing an urgent report for Mr Bello. Can I come to you at 3 pm so I can give you my full attention?\"\n(b) \"Of course, if it is urgent let me help you now. Let me save this and note where I stopped, so I can come straight back to the report afterwards.\"",
  "required": false
}
```

Next lesson: records, filing and documents.
