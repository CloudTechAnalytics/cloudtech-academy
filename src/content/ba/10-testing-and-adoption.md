---
title: Testing and adoption
minutes: 25
summary: Check the delivered change against the requirements with user acceptance testing and a traceability matrix, then help people actually adopt it and measure whether it worked.
---

## The problem

The new process is ready. Reminders are set up, the invoice template has a due date, and the overdue report runs every Monday. The supplier says it's done. Is it?

"Done" means two different things. **Does it do what was specified?** That's testing. **Do people use it, and is the problem getting smaller?** That's adoption. Plenty of changes pass every test and still fail, because lawyers keep sending time by WhatsApp, or the accounts officer quietly keeps her notebook. The BA's job doesn't end at go-live.

## The concept

**User acceptance testing (UAT)**

Before go-live, the people who'll use the change test it against real scenarios. Each test case says:

| Field | Example |
| :-- | :-- |
| **ID** | UAT-04 |
| **Requirement** | FR-03: reminder 7 days before the due date |
| **Steps** | Create an invoice dated 1 June with 30-day terms; set the system date to 24 June |
| **Expected result** | The client receives a reminder email showing the invoice number, amount and due date of 1 July |
| **Actual result / pass or fail** | filled in during testing |

Your acceptance criteria from lesson 7 are the starting point: most Given/When/Then scenarios become UAT cases almost word for word.

**Traceability**

A **traceability matrix** links every requirement to the user stories, test cases and KPIs that cover it. It answers two questions: "Has every requirement been tested?" and "Why does this feature exist?". A requirement with no test hasn't been checked. A feature with no requirement is scope creep.

**Adoption: the people side**

People adopt a change when they understand **why**, know **how**, and find it easier than the old way. Plan for:

- **Communication**: what's changing, why, when, and what it means for each group.
- **Training**: short and role-specific (lawyers need two minutes on time recording, not the whole billing process).
- **Support**: a named person to ask in the first weeks.
- **Switching off the old way**: the spreadsheet and the notebook are retired on a fixed date, or they never will be.

**Measure the benefits**

After go-live, rerun the baseline measures from lesson 4 with exactly the same definitions, monthly, and report against the business case targets. That's the only way to say "it worked".

## Example

Part of Ashgrove's traceability matrix:

| Requirement | User story | UAT cases | KPI |
| :-- | :-- | :-- | :-- |
| BR-01 Invoices due 30 days after issue | Client sees due date and bank details | UAT-01, UAT-02 | % paid within terms |
| FR-03 Reminder 7 days before due | Automatic reminder before due date | UAT-04, UAT-05, UAT-06 | Average days to pay |
| FR-05 Weekly overdue report | Accounts officer's overdue list | UAT-08 | Overdue value |
| FR-07 No reminders on payment plans | (exception in the reminder story) | UAT-06 | |

FR-07 came from an acceptance criterion, not from the original requirements list, and the matrix makes sure it's tested anyway.

## Walkthrough

1. Turn the acceptance criteria from lesson 7 into UAT test cases, at least one per Must requirement.
2. Build the traceability matrix and look for gaps: requirements with no test, and tests with no requirement.
3. Plan UAT: who tests (the accounts officer and a partner), with what data, and when. Agree in advance what happens to failed tests.
4. Write the adoption plan: communication by group, role-specific training, support, and a date for retiring the spreadsheet.
5. Set up the benefits report: the baseline measures, recalculated monthly, against the targets.

## Practice

```task
{
  "id": "ba-10-t1",
  "prompt": "Write **four UAT test cases** for Ashgrove's billing change. Put each on its own line in the form **ID | Requirement | Steps | Expected result**, and include at least one test of an **exception** (something that should **not** happen).",
  "minutes": 10,
  "rows": 8,
  "placeholder": "UAT-01 | ... | ... | ...",
  "rules": [
    { "label": "Four test cases, each a line with four parts separated by |", "pattern": "^[^|\\n]+\\|[^|\\n]+\\|[^|\\n]+\\|[^|\\n]+$", "min": 4 },
    { "label": "Each has an ID such as UAT-01", "pattern": "^\\s*UAT-?\\d+", "min": 4 },
    { "label": "Expected results are specific: at least two include a number or date", "pattern": "\\|[^|\\n]*\\d[^|\\n]*$", "min": 2 },
    { "label": "At least one exception test (no, not, isn't, doesn't)", "pattern": "\\|[^|\\n]*\\b(no|not|isn'?t|doesn'?t|never)\\b[^|\\n]*$" }
  ],
  "sample": "UAT-01 | Due date on invoices | Create an invoice dated 1 June 2026 | The invoice shows 'Due: 1 July 2026' and the bank details\nUAT-04 | Reminder before due date | Unpaid invoice due 1 July; set the date to 24 June | Client receives a reminder showing the invoice number, amount and due date of 1 July\nUAT-05 | No reminder once paid | Invoice due 1 July, recorded as paid on 20 June; set the date to 24 June | No reminder is sent\nUAT-08 | Weekly overdue report | Three invoices overdue by 5, 40 and 200 days | Report lists all 3, sorted 200, 40, 5 days, with client and amount",
  "note": "UAT-05 is the test that saves embarrassment: reminding a client who has already paid damages the relationship the change is meant to protect.",
  "required": true
}
```

```task
{
  "id": "ba-10-t2",
  "prompt": "Write a short **adoption plan** for Ashgrove's new billing process, with at least one line for each of: **communication**, **training**, **support**, **switching off** the old spreadsheet, and **measuring** the benefits. Put each on its own line starting with its heading, for example `Training: ...`.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "Communication: ...\nTraining: ...",
  "rules": [
    { "label": "Communication line", "pattern": "^\\s*[-*]?\\s*communicat\\w*\\s*:" },
    { "label": "Training line", "pattern": "^\\s*[-*]?\\s*training\\s*:" },
    { "label": "Support line", "pattern": "^\\s*[-*]?\\s*support\\s*:" },
    { "label": "Switching-off line with a date or deadline", "pattern": "^\\s*[-*]?\\s*(switch(ing)? off|retire\\w*|decommission\\w*)[^:\\n]*:[^\\n]*(\\d|week|month|date)" },
    { "label": "Measuring line that mentions a KPI", "pattern": "^\\s*[-*]?\\s*measur\\w*\\s*:[^\\n]*(days to pay|overdue|collection|within terms|kpi)" }
  ],
  "sample": "Communication: managing partner announces the change at the October partners' meeting; one-page note to all staff explaining why (₦188m overdue) and what changes for each role.\nTraining: 10-minute session for lawyers on weekly time recording; 2-hour session for the accounts officer on invoices, reminders and the overdue report.\nSupport: the BA sits with accounts for the first two invoice runs; questions to one named person for the first month.\nSwitching off: the old billing spreadsheet becomes read-only on 1 December, four weeks after go-live.\nMeasuring: average days to pay, % paid within terms and overdue value, recalculated monthly with the baseline definitions and reported to the managing partner against the targets.",
  "note": "The switch-off date is the line most plans leave out, and the reason most old spreadsheets live for ever.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Who should carry out user acceptance testing?",
    "options": ["Only the developers", "The people who'll use the change, against realistic scenarios", "The supplier's sales team", "Nobody: it's optional"],
    "answer": 1,
    "explanation": "UAT checks the change works for its users, in their real situations."
  },
  {
    "prompt": "A traceability matrix shows a requirement with no test case. What does that mean?",
    "options": ["Nothing", "That requirement hasn't been checked; write a test before go-live", "The requirement should be deleted", "It passed"],
    "answer": 1,
    "explanation": "Traceability finds gaps in testing and scope creep."
  },
  {
    "prompt": "Why set a date to switch off the old spreadsheet?",
    "options": ["To save disk space", "Otherwise people keep using the old way alongside the new one, and adoption never completes", "It's a legal requirement", "It isn't necessary"],
    "answer": 1,
    "explanation": "A fixed retirement date is part of adoption."
  }
]
```
