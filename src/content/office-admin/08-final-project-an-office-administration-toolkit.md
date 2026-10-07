---
title: "Final Project: An Office Administration Toolkit"
minutes: 55
summary: Choose an office, build a toolkit of templates and procedures, present it and review it.
---

## What you are building

You have learned the professional skills of an administrator: conduct and confidentiality, clear communication, time and diary management, records, office software, meetings, events and travel, and managing supplies and the office. Now you assemble them into **an office administration toolkit:** the set of templates, checklists and procedures that helps an office run smoothly, and that a new administrator could pick up and use on the first day.

Choose an **office** you know: a small company, a clinic, a school, a church or NGO office, a shop's back office, or a realistic office you invent with **5 to 30 staff.** Describe it briefly: what it does, the people (a managing director, managers, staff), and the main administrative challenges (missed messages, disorganised files, double-booked rooms, running out of supplies).

Use realistic figures and details, and keep everything professional and confidential (do not use real people's private information).

## Your toolkit has seven parts

1. **Office profile and priorities:** a short description and the top three administrative problems your toolkit will fix.
2. **Communication templates:** a professional email (with a subject line), a formal letter outline, a phone message form, a memo and a set of meeting minutes.
3. **Time and diary system:** a daily to-do format, a weekly diary routine for a manager, and a follow-up (reminder) system, with the key rules you will follow.
4. **Filing and records:** a folder structure, a file naming convention with five examples, confidentiality rules and a short retention schedule.
5. **Software and spreadsheets:** a simple budget or tracker (with formulas written out) for supplies, expenses or visitors, and a three-slide outline for a presentation.
6. **Meetings, events and travel:** a standard agenda, an event checklist with a budget and a travel booking checklist.
7. **Office management:** a supplies list with reorder levels, a vendor comparison method, a petty cash procedure and a safety checklist.

## Presenting the toolkit

Write for the manager or owner who will approve using it. Open with a **one-page summary:** the problems, the toolkit's contents, how it saves time and money and how you would introduce it. Make the templates **usable on their own:** someone should be able to copy and use them without your help. Keep each part short and practical, use tables where they help and check every figure and formula.

Prepare for questions such as: *How will staff learn to use it? How do we keep it up to date? Is the confidential information safe? What does it save us?*

> [!TIP]
> Test one template with a friend. Ask them to fill in the phone message form or follow the petty cash procedure without any help from you. Wherever they hesitate, simplify.

## Try it

```task
{
  "id": "poa-m08-t1",
  "prompt": "Write the **office profile and top three priorities** in 60 to 130 words: what the office does, the number of staff and roles, and the three administrative problems your toolkit will fix.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "The office is ...",
  "rules": [
    { "label": "Says what the office does", "pattern": "office|company|clinic|school|church|ngo|business|firm" },
    { "label": "States the staff numbers", "pattern": "\\d+\\s*(staff|employees|people|workers)" },
    { "label": "Names roles", "pattern": "manager|director|administrator|secretary|receptionist|accountant|owner" },
    { "label": "Lists problems", "pattern": "missed|lost|disorganis|double-?book|running out|late|messages|filing|supplies|clutter|problem" },
    { "label": "Between 60 and 130 words", "minWords": 60, "maxWords": 135 }
  ],
  "sample": "The office is the head office of Brightway Logistics in Ikeja, with 18 staff: a managing director, four managers, an accountant, drivers' coordinators, a receptionist and one office administrator. The three biggest administrative problems are messages and calls that are not passed on, files that are hard to find because there is no naming system, and supplies that run out without warning, causing rush purchases. The toolkit will give the administrator templates for communication, a filing and naming system, a diary routine and a simple supplies and petty cash procedure.",
  "required": true
}
```

```task
{
  "id": "poa-m08-t2",
  "prompt": "Write your **communication templates**: an **email** to a manager requesting approval of a ₦100,000 purchase (with subject, greeting, reason, action and deadline, closing), and a **phone message form** with at least six fields. Label each.",
  "minutes": 15,
  "rows": 13,
  "placeholder": "Email subject: ...\nDear ...,\nPhone message form: Caller name: ...",
  "rules": [
    { "label": "Has an email subject line", "pattern": "subject" },
    { "label": "Has a greeting and closing", "pattern": "dear[\\s\\S]*(regards|sincerely|thank you)" },
    { "label": "States the amount ₦100,000", "pattern": "100,?000" },
    { "label": "States an action and deadline", "pattern": "approve|approval[\\s\\S]*(by|before|on)|by (monday|tuesday|wednesday|thursday|friday|\\d)" },
    { "label": "Phone message form with fields", "pattern": "phone message[\\s\\S]*(caller|name)[\\s\\S]*(number|phone)[\\s\\S]*(message)[\\s\\S]*(date|time)[\\s\\S]*(taken by|received by|who)" },
    { "label": "At least 70 words in total", "minWords": 70, "maxWords": 220 }
  ],
  "sample": "Email subject: Approval requested: ₦100,000 for printer toner and paper\nDear Mr Bello,\nI would like your approval to purchase printer toner and paper for ₦100,000, because current stock will run out on Friday and the lowest quotation is attached. Please could you approve it by Wednesday so that we receive delivery before the month-end reports are printed? Thank you.\nKind regards, Ada Okoro, Office Administrator\nPhone message form: Caller name: ____; Company: ____; Phone number: ____; Message: ____; Date and time: ____; Action needed: ____; Taken by: ____",
  "required": true
}
```

```task
{
  "id": "poa-m08-t3",
  "prompt": "Write your **filing and records plan**: a folder structure (at least eight folders with numbering), **five file-name examples** in the convention, **four confidentiality rules** and a **retention schedule** with three record types and a note to confirm current law. At least eighteen lines.",
  "minutes": 15,
  "rows": 20,
  "placeholder": "01 Finance\n...\nFile name: ...",
  "rules": [
    { "label": "At least eighteen lines", "minLines": 18 },
    { "label": "Numbered folders", "pattern": "0[1-9] [a-z]", "min": 5 },
    { "label": "Five file names with extensions", "pattern": "\\.(pdf|docx|xlsx)", "min": 5 },
    { "label": "Confidentiality rules", "pattern": "confidential|lock|password|shred", "min": 3 },
    { "label": "Retention schedule items", "pattern": "retention|keep for|years", "min": 3 },
    { "label": "Notes to confirm current law", "pattern": "confirm|check|current law|advice" }
  ],
  "sample": "01 Finance\n02 HR\n03 Clients\n04 Projects\n05 Suppliers\n06 Templates\n07 Policies\n99 Archive\nFile name: 2026-03-12_BrightSchools_Invoice_0147.pdf\nFile name: 2026-03-05_BoardMeeting_Minutes_v2.docx\nFile name: 2026-02_Budget_Marketing_FINAL.xlsx\nFile name: 2026-01-10_ABC_Contract_Signed.pdf\nFile name: 2026-03_Visitor_Log.xlsx\nConfidentiality rule: keep personnel files in a locked cabinet\nConfidentiality rule: lock screens and use strong passwords\nConfidentiality rule: shred confidential paper\nConfidentiality rule: check recipients before sending sensitive files\nRetention: tax and accounting records - keep for the period required by law, often several years\nRetention: employee records - keep during employment and for a set period afterwards\nRetention: routine correspondence - keep for one year\nNote: confirm all retention periods with current law and take advice before disposing of records",
  "required": true
}
```

```task
{
  "id": "poa-m08-t4",
  "prompt": "Write your **office management procedures** in at least ten lines: three supply items with reorder levels (show one calculation), how you compare vendor quotes, a petty cash procedure with a float and limit, and five items for a safety checklist.",
  "minutes": 15,
  "rows": 14,
  "placeholder": "Printer paper: use 10 reams a week ...",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Reorder levels", "pattern": "reorder", "min": 2 },
    { "label": "A calculation for reorder", "pattern": "\\d+\\s*[x×*]\\s*\\d+\\s*\\+\\s*\\d+|=\\s*\\d+" },
    { "label": "Compare at least three quotes", "pattern": "three quotes|three quotations|compare" },
    { "label": "Petty cash float and limit", "pattern": "float[\\s\\S]*(limit|voucher)|petty cash" },
    { "label": "Safety checklist items", "pattern": "fire|first aid|electric|floor|security", "min": 3 }
  ],
  "sample": "Printer paper: use 10 reams a week, lead time 2 weeks, safety 1 week; reorder level = 10 x 2 + 10 = 30 reams\nToner: use 1 cartridge a month, lead time 1 month, safety 1; reorder level = 1 x 1 + 1 = 2 cartridges\nCleaning supplies: reorder when fewer than 4 refills remain\nVendors: get at least three quotes for purchases above ₦50,000 and compare price, delivery, warranty and time, using the total cost\nPetty cash: float of ₦50,000 kept in a locked box by one named person\nPetty cash: every payment needs a voucher and a receipt, with a limit of ₦5,000 per payment\nPetty cash: count the cash weekly and top up with the vouchers\nSafety: check fire exits and extinguishers monthly\nSafety: check first-aid kit and named first aiders\nSafety: check electrical sockets and cables, clear floors and lock up at night",
  "required": true
}
```

When you are done, submit your complete office administration toolkit as your final project.
