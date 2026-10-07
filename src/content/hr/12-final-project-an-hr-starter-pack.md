---
title: "Final Project: An HR Starter Pack"
minutes: 55
summary: Choose a company, build an HR starter pack, present it and review it.
---

## What you are building

You have covered the whole HR journey: planning, hiring, onboarding, developing, managing performance, rewarding, handling problems, staying legal, building culture and using data. Now you create **an HR starter pack** for a small business, the set of tools a new HR officer, or an owner starting to take people seriously, would want in their first weeks.

Choose a **company** you know (a shop, restaurant, school, clinic, logistics or services firm) or invent a realistic one with **10 to 40 employees.** Describe it briefly: what it does, how many staff, the main roles, and the main people problems it faces (high turnover, late staff, no contracts, unclear roles, conflict).

Use real or realistic figures for pay and costs, and flag where law or rates must be confirmed.

## Your starter pack has eight parts

1. **The company profile and priorities:** a short description and the top three people problems.
2. **Workforce plan and structure:** a simple organisation chart, headcount by role and an annual payroll budget.
3. **A recruitment kit:** a job description, an advert and a structured interview guide with a scoring sheet for one key role.
4. **An onboarding and probation plan:** an induction checklist and a 30-60-90 day plan.
5. **Performance and development:** goal-setting and appraisal approach, a feedback model and a training plan with a budget.
6. **Reward and payroll:** a pay grade table, a benefits summary and a payroll worksheet for one employee, with a note to confirm statutory rates.
7. **Employee relations and policies:** a grievance and disciplinary procedure outline, and two policies written out in full.
8. **Compliance, records and metrics:** a compliance calendar, an employee register design and five HR metrics with targets.

## Presenting the pack

Write for the owner or managing director who will approve it. Open with a **one-page summary:** the situation, what the pack contains, the costs and the first three actions. Use tables for grades, budgets and calendars, and keep each part short and usable. Show that the parts fit together: the job description matches the grade, the budget matches the headcount and the policies match the procedures.

Prepare for questions such as: *What does this cost? What happens if someone breaks the policy? Is it legal? How will we know it works?* Be honest about limits, and recommend professional legal and tax advice where needed.

> [!TIP]
> Test your pack by asking someone to use one tool, such as the induction checklist or the disciplinary outline, without your help. If they get stuck, simplify it.

## Try it

```task
{
  "id": "hrpm-m12-t1",
  "prompt": "Write the **company profile and people priorities** in 60 to 130 words: what the business does, how many staff, the main roles and the top three people problems the pack will address.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Fresh Mart is ...",
  "rules": [
    { "label": "Says what the business does", "pattern": "supermarket|shop|school|clinic|restaurant|company|business|firm|store" },
    { "label": "States the number of staff", "pattern": "\\d+\\s*(staff|employees|people|workers)" },
    { "label": "Names main roles", "pattern": "cashier|manager|supervisor|driver|cook|teacher|nurse|sales|roles" },
    { "label": "Lists problems", "pattern": "turnover|late|absen|contract|conflict|unclear|training|pay|morale|problem" },
    { "label": "Between 60 and 130 words", "minWords": 60, "maxWords": 135 }
  ],
  "sample": "Fresh Mart is a family-owned supermarket in Ikeja with 28 staff: cashiers, shelf stackers, stock keepers, supervisors and a manager. It has grown quickly but has no HR function. The top three people problems are high staff turnover, with 8 people leaving last year, inconsistent contracts and unclear roles, and frequent lateness and absence without a proper policy. The pack will give the owner tools to hire better, onboard new staff, set clear expectations, handle problems fairly and stay compliant.",
  "required": true
}
```

```task
{
  "id": "hrpm-m12-t2",
  "prompt": "Write your **workforce plan and payroll budget**: headcount by role (at least four roles), the monthly pay for each, employer pension at 10% and the total annual cost. Show the calculation for at least one role. Flag that statutory rates must be confirmed.",
  "minutes": 15,
  "rows": 12,
  "placeholder": "Cashiers - 8 - ₦120,000 ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "At least four roles with numbers and naira", "pattern": "\\d+\\s*[-x×]\\s*₦|₦\\s?\\d[\\d,]+\\s*(x|×)\\s*\\d+", "min": 4 },
    { "label": "Employer pension at 10%", "pattern": "10\\s?%[^\\n]*pension|pension[^\\n]*10\\s?%" },
    { "label": "Annual total in naira", "pattern": "annual|year" },
    { "label": "Shows a calculation", "pattern": "=|x|×" },
    { "label": "Flags that rates must be confirmed", "pattern": "confirm|check|current|illustrat|assum" }
  ],
  "sample": "Cashiers - 8 x ₦120,000 = ₦960,000 a month\nShelf stackers - 6 x ₦100,000 = ₦600,000 a month\nStock keepers - 4 x ₦130,000 = ₦520,000 a month\nSupervisors - 3 x ₦200,000 = ₦600,000 a month\nManager - 1 x ₦350,000 = ₦350,000 a month\nGross payroll = ₦3,030,000 a month; employer pension at 10% = ₦303,000; total = ₦3,333,000 a month\nAnnual cost = 3,333,000 x 12 = ₦39,996,000 (about ₦40 million), before other statutory contributions\nRates and contributions are assumptions and must be confirmed with an accountant before budgeting",
  "required": true
}
```

```task
{
  "id": "hrpm-m12-t3",
  "prompt": "Write the **recruitment and onboarding tools** for one key role: a **job title and five duties**, an **advert headline and application deadline**, **four interview questions** (two behavioural) and a **five-item induction checklist**. At least twelve lines.",
  "minutes": 15,
  "rows": 15,
  "placeholder": "Job title: ...\nDuty 1: ...",
  "rules": [
    { "label": "At least twelve lines", "minLines": 12 },
    { "label": "Job title and duties", "pattern": "job title[\\s\\S]*dut(y|ies)" },
    { "label": "Advert and deadline", "pattern": "advert[\\s\\S]*(deadline|closing|by )" },
    { "label": "Interview questions", "pattern": "question|tell me about a time", "min": 4 },
    { "label": "Induction checklist", "pattern": "induction|checklist" },
    { "label": "Mentions buddy, safety, policies or contract", "pattern": "buddy|safety|polic|contract" }
  ],
  "sample": "Job title: Shop Supervisor\nDuty 1: lead a team of six on each shift\nDuty 2: open and close the shop and balance the cash\nDuty 3: manage stock levels and replenishment\nDuty 4: handle customer complaints and escalate problems\nDuty 5: coach and appraise team members\nAdvert headline: Shop Supervisor wanted, Fresh Mart Ikeja; application deadline Friday 28 March; no fee is charged\nQuestion 1: Tell me about a time you led a team through a busy period.\nQuestion 2: Tell me about a time you handled an unhappy customer.\nQuestion 3: What would you do if two staff refused to work together?\nQuestion 4: Why do you want this role?\nInduction checklist: welcome and tour; sign contract and policies; health and safety briefing; assign a buddy; system training and probation objectives",
  "required": true
}
```

```task
{
  "id": "hrpm-m12-t4",
  "prompt": "Write your **employee relations and compliance outline** in at least ten lines: the grievance steps, the disciplinary steps, one policy title with its purpose, a pay grade table in two lines, three compliance calendar items and **five HR metrics** with a target each.",
  "minutes": 15,
  "rows": 15,
  "placeholder": "Grievance: ...\nDiscipline: ...",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Grievance steps", "pattern": "grievance" },
    { "label": "Disciplinary steps", "pattern": "disciplin|warning" },
    { "label": "A policy with purpose", "pattern": "policy[\\s\\S]*purpose|purpose[\\s\\S]*policy" },
    { "label": "Pay grades", "pattern": "grade" },
    { "label": "Compliance items (pension, PAYE, NSITF, ITF)", "pattern": "pension|paye|nsitf|itf" },
    { "label": "HR metrics with targets", "pattern": "metric|turnover|absenteeism|time to hire|cost per hire|engagement", "min": 4 },
    { "label": "Targets with numbers", "pattern": "target[^\\n]*\\d|below \\d+|under \\d+|\\d+\\s?%", "min": 4 }
  ],
  "sample": "Grievance: informal talk, written complaint, acknowledgement in 2 days, meeting, investigation, written decision and an appeal\nDiscipline: investigate, invite to a hearing, decide fairly, then verbal warning, written warning, final warning, dismissal; gross misconduct heard immediately\nPolicy: Attendance and Lateness - purpose is to set clear expectations on punctuality and reporting absence\nGrade 1 - cashier and shelf stacker: ₦100,000 to ₦130,000\nGrade 2 - supervisor: ₦160,000 to ₦240,000\nCompliance: pension monthly; PAYE monthly; NSITF monthly and ITF yearly\nMetric: turnover, target below 15%\nMetric: absenteeism, target under 3%\nMetric: time to hire, target 30 days\nMetric: cost per hire, target under ₦80,000\nMetric: engagement score, target 4 out of 5",
  "required": true
}
```

When you are done, submit your complete HR starter pack as your final project.
