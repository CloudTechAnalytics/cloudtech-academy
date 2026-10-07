---
title: HR Data, Tools and Policies
minutes: 30
summary: Keep HR records and systems, track key HR metrics, write clear HR policies and use spreadsheets for HR work.
---

## HR records and systems

HR depends on accurate, organised, confidential information. Whether you use paper files, spreadsheets or HR software, aim for the same things: **accuracy, security, accessibility to those who need it and compliance** with data protection law.

**What to record:**

- **Employee master data:** name, contact, emergency contact, job title, department, manager, start date, contract type, pay, bank details, pension and tax details.
- **Documents:** contract, ID, certificates, signed policies, appraisals, warnings, training records.
- **Time and attendance, leave and absence.**
- **Recruitment records:** adverts, applications, scores, interview notes, offers.
- **Payroll data** and statutory remittances.
- **Health and safety records.**

**Choosing a system.** For a small business, a well-organised spreadsheet and a locked filing cabinet or secured cloud folder can be enough. As you grow, consider **HR information systems (HRIS)** that handle employee records, leave, payroll, recruitment and reporting. Choose by need, cost, ease of use, security and local support. Whatever you choose:

- **One source of truth:** avoid conflicting copies.
- **Access controls:** only people who need information can see it, and sensitive data (pay, health, discipline) is protected.
- **Back up regularly,** and store backups safely.
- **Update promptly** when something changes.
- **Retain and delete** according to policy and the law.
- **Follow data protection rules:** tell employees how data is used, keep it secure and respect their rights.

## Key HR metrics

Metrics turn HR from opinion into evidence. Choose a few that match your questions.

| Metric | Formula | What it shows |
| :-- | :-- | :-- |
| **Headcount** | Number of employees | Size and changes |
| **Turnover rate** | Leavers ÷ average headcount | How many leave |
| **Early attrition** | Leavers within 90 days ÷ new hires | Hiring and onboarding quality |
| **Absenteeism rate** | Days absent ÷ (headcount × working days) | Attendance and wellbeing |
| **Time to hire** | Days from advert to accepted offer | Recruitment speed |
| **Cost per hire** | (Advert + agency + staff time) ÷ hires | Recruitment cost |
| **Training hours per employee** | Total hours ÷ headcount | Investment in development |
| **Payroll as % of revenue** | Payroll cost ÷ revenue | Affordability |
| **Engagement score** | Average survey rating | Morale |
| **Promotion or internal fill rate** | Internal hires ÷ all hires | Career opportunity |

Example for absenteeism: **50 employees,** **22 working days** in the month, **40 days** of absence. Possible working days = 50 × 22 = **1,100.** Absenteeism = 40 ÷ 1,100 = **3.6%.**

Use metrics well:

- **Define each clearly,** and calculate it the same way every time.
- **Track trends** over time and compare with targets or similar businesses.
- **Look at the story behind numbers,** by department, manager or reason.
- **Take action:** a high absence rate in one team may point to a management or workload issue.
- **Protect privacy:** report in groups so that individuals cannot be identified.

## Writing HR policies

An **HR policy** is a clear statement of what the organisation expects and how it will act. Good policies **give consistency, protect people and the business, and save time** because managers know what to do.

Common policies: **recruitment and equal opportunities, attendance and leave, working hours and overtime, code of conduct, disciplinary and grievance, anti-harassment and anti-bullying, health and safety, data protection and confidentiality, anti-bribery and conflict of interest, social media and technology use, expenses, performance management, training and development.**

**How to write one:**

1. **Purpose:** why the policy exists.
2. **Scope:** who and what it applies to.
3. **The rules and principles,** in plain, short sentences.
4. **Responsibilities:** who does what (employees, managers, HR).
5. **Procedure:** the steps, with timelines.
6. **Consequences** of breaching it.
7. **Related policies and laws.**
8. **Owner, version and review date.**

Writing tips: use plain language, short sentences, examples, and avoid unnecessary jargon. Make sure the policy is **lawful, realistic, fair and enforceable.** Ask managers and staff to review a draft. Have important policies checked by a lawyer.

**Communicating policies:** put them in a handbook, explain them at induction, have employees sign that they have received them, and refresh them with reminders and training. A policy nobody has read cannot be enforced.

**Review** policies each year and when the law or business changes.

## Using spreadsheets for HR

A spreadsheet can run a surprising amount of HR. Useful setups:

- **Employee register:** one row per employee, with columns for ID, name, job title, department, manager, start date, contract type, salary, probation end date and status.
- **Leave tracker:** entitlement, days taken, days remaining, planned leave.
- **Recruitment tracker:** vacancy, candidates, stage, scores, dates.
- **Training log:** employee, course, date, hours, cost, result.
- **Payroll worksheet:** basic, allowances, gross, deductions, net, employer costs.
- **HR dashboard:** headcount, turnover, absence, hiring.

Useful formulas:

- **=COUNTIF(range, "Sales")** counts employees in a department.
- **=SUMIF(range, "Sales", pay_range)** totals pay for a department.
- **=TODAY() − start_date** gives length of service in days, and **=DATEDIF(start, TODAY(), "m")** gives months.
- **=days_absent / (headcount * working_days)** gives the absenteeism rate.
- **=IF(probation_end < TODAY(), "Review due", "")** flags probation reviews.
- **Pivot tables** summarise by department or month.

Good practice: **lock formulas,** password-protect files holding sensitive data, **limit sharing,** keep a **version history** and back up, and do not email sensitive files carelessly.

## Try it

```task
{
  "id": "hrpm-m11-t1",
  "prompt": "**50 employees**, **22 working days**, **40 days** of absence in the month. Work out the **possible working days** and the **absenteeism rate**. Then say what you would look at before acting on the number.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Possible working days = ...",
  "rules": [
    { "label": "1,100 possible working days", "pattern": "1,?100" },
    { "label": "Absenteeism of 3.6%", "pattern": "3\\.6" },
    { "label": "Looks at the story behind it (department, reasons, trend)", "pattern": "department|reason|trend|team|pattern|cause|manager|why" }
  ],
  "sample": "Possible working days = 50 x 22 = 1,100.\nAbsenteeism = 40 / 1,100 = 3.6%.\nBefore acting I would look at the story behind it: whether it is concentrated in one department or team, the reasons given and whether it is rising over several months.",
  "required": true
}
```

```task
{
  "id": "hrpm-m11-t2",
  "prompt": "Write an **attendance and lateness policy** (at least eight lines) using the structure: purpose, scope, rules, responsibilities, procedure for reporting absence, consequences and review date.",
  "minutes": 15,
  "rows": 12,
  "placeholder": "Purpose: ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Purpose and scope", "pattern": "purpose[\\s\\S]*scope|scope[\\s\\S]*purpose" },
    { "label": "Rules (start time, notifying)", "pattern": "rules?|start|on time|notify|inform|report" },
    { "label": "Responsibilities", "pattern": "responsibilit|employees|managers|hr" },
    { "label": "Procedure for reporting absence", "pattern": "procedure|call|message|before|by \\d" },
    { "label": "Consequences", "pattern": "consequence|disciplinary|warning" },
    { "label": "Review date or owner", "pattern": "review|owner|version" }
  ],
  "sample": "Purpose: to make sure the business runs smoothly by setting clear expectations on attendance and punctuality.\nScope: applies to all employees, including part-time and probationary staff.\nRules: employees must be at work and ready to start at their agreed start time.\nRules: employees must tell their manager by phone before the start of their shift if they will be absent or late.\nResponsibilities: employees follow the procedure; managers record attendance and deal with problems fairly; HR keeps records.\nProcedure: a medical certificate is required for sickness absence longer than two days.\nConsequences: repeated lateness or unreported absence may lead to action under the disciplinary procedure.\nReview: owned by the HR officer and reviewed every year, version 1.",
  "required": true
}
```

```task
{
  "id": "hrpm-m11-t3",
  "prompt": "Design an **employee register spreadsheet**: list at least **ten column headings**, one per line, and give **three formulas** you would use (for example to count by department, calculate length of service and flag probation reviews).",
  "minutes": 12,
  "rows": 14,
  "placeholder": "Employee ID\nFull name\n...\nFormula: =COUNTIF(...)",
  "rules": [
    { "label": "At least thirteen lines", "minLines": 13 },
    { "label": "Includes ID, name, job title, department", "pattern": "id[\\s\\S]*name[\\s\\S]*(job title|title)[\\s\\S]*department" },
    { "label": "Includes start date and contract type", "pattern": "start date[\\s\\S]*contract|contract[\\s\\S]*start date" },
    { "label": "Includes probation end date", "pattern": "probation" },
    { "label": "Includes COUNTIF or SUMIF", "pattern": "countif|sumif" },
    { "label": "Includes DATEDIF or TODAY", "pattern": "datedif|today\\(" },
    { "label": "Includes an IF flag", "pattern": "=\\s?if\\(" }
  ],
  "sample": "Employee ID\nFull name\nJob title\nDepartment\nManager\nStart date\nContract type\nSalary\nProbation end date\nStatus\nFormula: =COUNTIF(D:D,\"Sales\") counts employees in Sales\nFormula: =DATEDIF(F2,TODAY(),\"m\") gives months of service\nFormula: =IF(I2<TODAY(),\"Review due\",\"\") flags probation reviews",
  "required": false
}
```

Next lesson: your HR starter pack.
