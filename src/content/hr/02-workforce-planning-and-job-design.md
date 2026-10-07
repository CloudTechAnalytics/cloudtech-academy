---
title: Workforce Planning and Job Design
minutes: 25
summary: Plan how many people you need, analyse jobs and write job descriptions, choose organisation structures and budget for people.
---

## Planning how many people you need

**Workforce planning** means making sure the business has the **right number of people with the right skills in the right places at the right time**, now and in the future. Too few people means overwork, poor service and burnout; too many means wasted money.

A simple process:

1. **Look ahead:** what is the business planning? New branches, longer hours, more customers, new products?
2. **Work out the work:** how many hours or tasks must be covered?
3. **Count what you have:** current staff, skills, expected leavers, retirements, leave.
4. **Find the gap:** what is missing, now and later?
5. **Decide how to fill it:** hire, train, reorganise, outsource, use part-time or temporary staff, or use technology.
6. **Plan the timing and cost.**

**A simple staffing calculation.** A shop is open 12 hours a day, 7 days a week, and needs 2 staff on the floor at all times.

- Hours to cover = 12 × 7 = **84 hours** a week.
- Staff-hours needed = 84 × 2 = **168 hours** a week.
- A full-time employee works 40 hours: 168 ÷ 40 = **4.2 people.**
- But people take leave, are sick or are in training. If you allow **10% of time for absence**, effective availability is 90%: 4.2 ÷ 0.9 = **4.67**, so you need about **5 people.**

Also consider **peaks:** busy days and seasons may need extra, with part-time or seasonal workers. And think about **skills,** not just numbers: a cashier, a stock keeper and a supervisor are different jobs.

## Job analysis and job descriptions

**Job analysis** is the study of a job: what the work is, how it is done, what skills and conditions are needed. Methods: observe the work, interview the person doing it and their manager, review documents and ask staff to keep a short log of tasks.

Out of this you write:

**A job description:** what the job is. It usually includes:

- **Job title** and **department,** and who it reports to.
- **Purpose** of the job in one or two sentences.
- **Main duties and responsibilities,** in order of importance, starting with action verbs.
- **Key relationships** (who they work with).
- **Working conditions:** location, hours, travel, physical demands.
- **Level of authority:** decisions they may make, budget or staff they manage.

**A person specification:** the kind of person needed.

- **Qualifications and training.**
- **Experience.**
- **Skills and knowledge.**
- **Personal qualities** (reliable, organised, friendly).
- Separate **essential** from **desirable.**

Write requirements that are **really needed for the job** and are not discriminatory. Asking for a degree when the job does not need one, or for a "young, single" candidate, excludes good people unfairly and can be illegal. Keep job descriptions **accurate and up to date,** since they are used in recruitment, training, appraisals and disputes.

## Organisation structures

An **organisation structure** shows who reports to whom and how work is divided.

- **Functional:** grouped by specialism (sales, operations, finance, HR). Clear expertise; can create silos.
- **Divisional (product or region):** groups for each product line or area (Lagos, Abuja). Good for growth; duplicates some functions.
- **Flat:** few levels; quick decisions; managers have many direct reports.
- **Tall (hierarchical):** many levels; clear control; slower decisions.
- **Matrix:** people report to a functional manager and a project or product manager; flexible but can confuse.

Key ideas:

- **Span of control:** how many people one manager supervises. Typically 5 to 10, depending on how complex the work is.
- **Unity of command:** each person should have one main boss.
- **Clear roles and responsibilities:** everyone knows what they own.
- **Chain of communication:** how information flows up and down.

A small business can start with a simple chart: the owner, a manager or supervisor, and a few staff in clearly defined roles. As you grow, add layers only when needed. Draw the chart, review it each year, and make sure it matches how work really happens.

## Budgeting for people

People cost more than the salary. The **total employment cost** includes:

- **Basic pay and allowances** (housing, transport, others).
- **Employer pension contributions** (see module 9).
- **Statutory and insurance contributions** (for example employees' compensation and training fund contributions that apply to you, and group life insurance).
- **Bonuses and benefits** (medical, meals, uniform).
- **Recruitment and training costs.**
- **Equipment and workspace.**
- **Management and HR time.**

Example: a cashier earns **₦120,000** a month. Add 10% employer pension and 5% for other costs and benefits: 120,000 × 1.15 = **₦138,000** per month. For five staff = **₦690,000** a month, or **₦8,280,000** a year.

Build a **headcount and payroll budget:** number of people by role, the cost per person, expected pay rises, planned hires and leavers, and recruitment and training costs. Compare it with expected revenue. A common check is **payroll as a percentage of revenue**; if revenue is ₦3,000,000 a month and payroll is ₦690,000, payroll is 23% of revenue. Compare it with your sector and your targets, and raise concerns early if it is rising faster than revenue.

## Try it

```task
{
  "id": "hrpm-m02-t1",
  "prompt": "A shop is open **12 hours a day, 7 days a week** and needs **2 staff** on the floor at all times. Work out the weekly hours to cover, the staff-hours needed, the number of full-time (40-hour) people, and the number needed allowing **10% for absence**.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Hours to cover = ...",
  "rules": [
    { "label": "84 hours to cover", "pattern": "\\b84\\b" },
    { "label": "168 staff-hours", "pattern": "\\b168\\b" },
    { "label": "4.2 people", "pattern": "4\\.2" },
    { "label": "About 4.67 and rounded to 5", "pattern": "4\\.6|4\\.67|\\b5\\b" }
  ],
  "sample": "Hours to cover = 12 x 7 = 84 hours a week.\nStaff-hours needed = 84 x 2 = 168 hours.\nFull-time people = 168 / 40 = 4.2.\nAllowing 10% absence: 4.2 / 0.9 = 4.67, so I need about 5 people.",
  "required": true
}
```

```task
{
  "id": "hrpm-m02-t2",
  "prompt": "Write a **job description and person specification** for a role of your choice. One item per line: title, reports to, purpose, five main duties, working conditions, essential qualifications and skills, and one desirable item. At least eleven lines.",
  "minutes": 15,
  "rows": 13,
  "placeholder": "Job title: ...\nReports to: ...",
  "rules": [
    { "label": "At least eleven lines", "minLines": 11 },
    { "label": "Title and reports to", "pattern": "title[\\s\\S]*reports to|reports to[\\s\\S]*title" },
    { "label": "Purpose", "pattern": "purpose" },
    { "label": "Duties", "pattern": "dut(y|ies)", "min": 3 },
    { "label": "Working conditions", "pattern": "working conditions|hours|location" },
    { "label": "Essential requirements", "pattern": "essential" },
    { "label": "Desirable", "pattern": "desirable" }
  ],
  "sample": "Job title: Shop Cashier\nReports to: Shop Supervisor\nPurpose: serve customers quickly and accurately and handle payments and the till honestly\nDuty 1: scan items and take payments by cash, card and transfer\nDuty 2: balance the till at the end of each shift\nDuty 3: answer customers' questions politely\nDuty 4: tidy the checkout area and restock bags\nDuty 5: report stock problems and shortages to the supervisor\nWorking conditions: shop floor, shifts of 8 hours including weekends, standing for long periods\nEssential: WAEC or equivalent, basic arithmetic, honesty and a friendly manner\nDesirable: previous cash-handling or retail experience",
  "required": true
}
```

```task
{
  "id": "hrpm-m02-t3",
  "prompt": "A cashier earns **₦120,000** a month. Add **10%** employer pension and **5%** for other costs. Work out the **monthly cost per person**, the cost for **5 people** a month and a year. Then work out payroll as a share of revenue if monthly revenue is **₦3,000,000**.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Cost per person = ...",
  "rules": [
    { "label": "₦138,000 per person", "pattern": "138,?000" },
    { "label": "₦690,000 a month", "pattern": "690,?000" },
    { "label": "₦8,280,000 a year", "pattern": "8,?280,?000" },
    { "label": "23% of revenue", "pattern": "\\b23\\s?%" }
  ],
  "sample": "Cost per person = 120,000 x 1.15 = ₦138,000 a month.\nFor 5 people = ₦690,000 a month, or 690,000 x 12 = ₦8,280,000 a year.\nPayroll share of revenue = 690,000 / 3,000,000 = 23%.",
  "required": false
}
```

Next lesson: recruitment and selection.
