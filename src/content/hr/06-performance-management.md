---
title: Performance Management
minutes: 25
summary: Set goals, run appraisals and give feedback, hold coaching conversations and handle poor performance fairly.
---

## Setting goals

**Performance management** is the continuous process of agreeing what is expected, supporting people to do it, reviewing results and improving. It is not a once-a-year form. It works best as a regular conversation between manager and employee.

Start with **clear goals.** People do better when they know what success looks like. Good goals:

- Link to the **business's objectives** (so people see why their work matters).
- Are **SMART:** specific, measurable, achievable, relevant, time-bound.
- Are **few and focused:** three to five main goals.
- Are **agreed together,** not simply imposed.
- Cover **what** is achieved (results) and **how** (behaviours and values).

Weak: "Do better at sales." Strong: "Achieve monthly sales of ₦2,000,000 by 30 June, with a customer satisfaction score of at least 4.5 out of 5."

Some organisations use **OKRs** (Objectives and Key Results): an inspiring objective and measurable key results. Example: *Objective: delight our customers. Key results: reduce average waiting time from 10 to 5 minutes; reach a 4.5 satisfaction score; cut complaints by 30%.*

Write goals down, give a copy to each person, and review them as the business changes.

## Appraisals and feedback

An **appraisal** (or performance review) is a structured conversation, usually once or twice a year, about how someone is doing, what they have achieved, how they are developing and what comes next. It should combine **regular feedback** with a **formal review.**

**Preparing:** gather evidence (results, examples, customer feedback), ask the employee to prepare a self-assessment, choose a quiet time, and plan the key messages.

**During:**

- Start positively and explain the purpose.
- Discuss **achievements** against goals, with examples.
- Discuss **areas to improve,** with specific examples and the impact.
- Listen to the employee's view and any obstacles.
- Agree **development actions** and **goals** for the next period.
- Agree a **rating** (if you use one) based on evidence.
- Summarise and agree next steps.

**After:** write it up, both sign, and follow through on actions.

**Giving good feedback:** be **specific, timely and balanced,** and focus on **behaviour and impact,** not personality. A useful model is **SBI:** the **S**ituation, the **B**ehaviour you saw, and the **I**mpact. *"In yesterday's lunch rush (situation), you opened a second till and called the next customers forward (behaviour), which cut the queue from 12 minutes to 5 (impact). Thank you."* For a problem: *"On Tuesday morning (situation) the till was 15 minutes late opening (behaviour), so customers queued outside and two left (impact). What happened, and what can we do?"*

Avoid vague praise or criticism ("good job," "you are careless"), surprises (raise issues when they happen, not months later), and bias (recency, favouritism, comparing people unfairly).

Receiving feedback: encourage managers to ask for feedback too. Two-way conversations build trust.

## Coaching conversations

**Coaching** helps people find their own solutions and grow, by asking questions instead of giving all the answers. It fits well in regular one-to-ones.

A simple model is **GROW:**

- **G**oal: "What do you want to achieve?"
- **R**eality: "Where are you now? What have you tried?"
- **O**ptions: "What could you do? What else?"
- **W**ill (way forward): "What will you do, and by when? What might get in the way? How can I help?"

Tips: listen more than you talk, ask open questions, do not rush to solve, summarise, agree actions and follow up. Coaching is not the same as telling people what to do, but sometimes people simply need clear instruction. Use judgement.

Hold **regular one-to-ones** (for example 30 minutes every one or two weeks): progress on goals, obstacles, feedback both ways, wellbeing and development.

## Handling poor performance

Sometimes performance falls short. Act early and fairly.

1. **Check your facts.** What exactly is the gap, against what standard, for how long? Gather evidence.
2. **Check the causes:** unclear expectations, lack of training or tools, workload, a personal or health problem, a poor fit, or lack of effort. Many problems are solved by clarity or support.
3. **Talk informally first.** Describe the gap using SBI, listen, agree what will improve and by when, and offer support.
4. **If no improvement, use a formal process** such as a **performance improvement plan (PIP):** write the problem, the standards required, the support offered, the timeline (for example 4 to 8 weeks), and how progress will be reviewed. Meet regularly and record outcomes.
5. **If there is still no improvement,** follow the disciplinary or capability procedure in the contract and policy (module 8): a fair hearing, the right to be accompanied if the policy provides, a written decision and the right to appeal.
6. **Keep records** at every stage and be consistent with how others have been treated.

Example: a salesperson with a monthly target of ₦2,000,000 achieves ₦1,400,000. Attainment = 1,400,000 ÷ 2,000,000 = **70%.** The manager looks at three months of data, finds the person is strong on existing customers but makes few new calls, agrees to training on prospecting and weekly check-ins, and sets a target of ₦1,700,000 within eight weeks.

Always treat the person with dignity, even if the outcome is dismissal. Take professional advice before dismissing for performance reasons.

## Try it

```task
{
  "id": "hrpm-m06-t1",
  "prompt": "Write **three SMART goals** for an employee in a role of your choice, each with a number and a date, and **one behavioural goal**. One per line.",
  "minutes": 10,
  "rows": 6,
  "placeholder": "Goal 1: ...",
  "rules": [
    { "label": "Four lines", "minLines": 4 },
    { "label": "Three goals contain numbers", "pattern": "goal[^\\n]*\\d", "min": 3 },
    { "label": "Goals contain dates or time frames", "pattern": "goal[^\\n]*(by |month|week|quarter|june|july|august|september|december|year)", "min": 3 },
    { "label": "Includes a behavioural goal", "pattern": "behaviou?r|teamwork|customer|communicat|attitude|collaborat" }
  ],
  "sample": "Goal 1: achieve monthly sales of ₦2,000,000 by 30 June.\nGoal 2: keep till differences below ₦500 a shift every month.\nGoal 3: reach a customer satisfaction score of 4.5 out of 5 by the end of the third quarter.\nBehavioural goal: show teamwork by helping colleagues at busy times and being rated 4 out of 5 by peers.",
  "required": true
}
```

```task
{
  "id": "hrpm-m06-t2",
  "prompt": "Write **two pieces of feedback using SBI** (Situation, Behaviour, Impact): one **positive** and one about a **problem**. Label each and keep each to two or three sentences.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Positive: In ... (situation), you ... (behaviour), which ... (impact).",
  "rules": [
    { "label": "Has a positive and a problem example", "pattern": "positive[\\s\\S]*(problem|improve|concern)|(problem|improve|concern)[\\s\\S]*positive" },
    { "label": "Mentions a specific situation", "pattern": "in (yesterday|today|last|the)|on (monday|tuesday|wednesday|thursday|friday)|during" },
    { "label": "Describes behaviour", "pattern": "you (opened|called|were|arrived|handled|did|helped|left|forgot|made)" },
    { "label": "States the impact", "pattern": "which (cut|meant|caused|led|saved|made)|so (customers|the|we)|as a result|impact" },
    { "label": "Between 50 and 110 words", "minWords": 50, "maxWords": 115 }
  ],
  "sample": "Positive: In yesterday's lunch rush, you opened a second till and called the next customers forward, which cut the queue from 12 minutes to 5. Thank you, that made a real difference.\nProblem: On Tuesday morning the till was 15 minutes late opening, so customers queued outside and two left without buying. I would like to understand what happened and agree how we make sure it does not happen again.",
  "required": true
}
```

```task
{
  "id": "hrpm-m06-t3",
  "prompt": "An employee has met only **70%** of their sales target for three months (**₦1,400,000** of **₦2,000,000**). Describe in 80 to 150 words the steps you would take, in order, before any formal action.",
  "minutes": 15,
  "rows": 10,
  "placeholder": "First I would ...",
  "rules": [
    { "label": "Checks facts and evidence", "pattern": "facts|evidence|data|records|check" },
    { "label": "Looks for causes", "pattern": "cause|reason|why|obstacle|training|workload|tools|expectation" },
    { "label": "Has an informal conversation with support", "pattern": "informal|conversation|talk|listen|support|coach" },
    { "label": "Agrees a target and timeline", "pattern": "target|within \\d+|weeks|timeline|review|check-?in" },
    { "label": "Mentions records or a formal plan if needed", "pattern": "record|document|pip|improvement plan|formal" },
    { "label": "Between 80 and 150 words", "minWords": 80, "maxWords": 155 }
  ],
  "sample": "First I would check the facts: three months of sales data, the target and how others are doing, so I am sure the gap is real. Then I would look for causes, such as unclear expectations, lack of training, tools, workload or a personal problem. Next I would have an informal, private conversation, describe the gap using specific examples, listen to the employee and agree what support they need, for example training on finding new customers. We would agree a clear target of ₦1,700,000 within eight weeks, with weekly check-ins. I would keep notes of every meeting. If there is still no improvement, I would move to a formal improvement plan and follow the company's procedure fairly.",
  "required": false
}
```

Next lesson: pay, benefits and recognition.
