---
title: Writing requirements
minutes: 25
summary: Write requirements that can be built and tested, separate functional and non-functional requirements from business rules, and prioritise with MoSCoW.
---

## The problem

The first requirements list for Ashgrove's billing change came back from a workshop looking like this:

- The system should be user-friendly.
- Invoices should be sent quickly.
- It should integrate with everything.
- Reports should be good.

Every line sounds reasonable, and none of them can be built or tested. How quick is "quickly"? What's "everything"? A supplier could deliver almost anything and claim to meet them, and the firm would have no way to object. Vague requirements are how projects end in arguments.

## The concept

**Types of requirement**

| Type | Says | Example for Ashgrove |
| :-- | :-- | :-- |
| **Business requirement** | the goal, in business terms | Reduce average days to pay from 45 to 30 within 12 months. |
| **Functional requirement** | what the solution must **do** | The system shall show a due date on every invoice. |
| **Non-functional requirement** | how **well** it must do it: speed, security, availability, usability | The overdue report shall load in under 5 seconds. |
| **Business rule** | a policy that applies whatever the solution | Invoices are due 30 days after issue. Reminders are not sent to clients on a payment plan. |

**Good requirements are testable**

A requirement is good when someone could write a test that it passes or fails. Check each one against these questions:

- **Specific**: one requirement per statement, with no "and/or" bundles.
- **Measurable**: numbers instead of "quickly", "easily" or "good".
- **Unambiguous**: two readers would build the same thing.
- **Solution-free** where possible: say *what* is needed, not *how* to build it.
- **Traceable**: linked to the business requirement it serves.

Use **"shall"** (or "must") for requirements, and keep each one short.

**MoSCoW prioritisation**

Not everything can be in the first release. MoSCoW sorts requirements into:

- **Must have**: without it, the solution fails its purpose.
- **Should have**: important, but there's a workaround for now.
- **Could have**: nice if time allows.
- **Won't have (this time)**: agreed to be out of scope, for now.

The test for a Must: "If this isn't delivered, would we still go live?" If the answer is yes, it isn't a Must. A list where everything is a Must hasn't been prioritised.

## Example

The workshop's vague lines, rewritten:

| Vague | Testable |
| :-- | :-- |
| Invoices should be sent quickly. | Invoices shall be issued within 5 working days of the end of each month. |
| It should be user-friendly. | The accounts officer shall be able to produce a month's invoices in under 2 hours after one training session. |
| It should integrate with everything. | The system shall import payments from the bank's CSV statement. |
| Reports should be good. | A report shall list every unpaid invoice past its due date, with client, amount and days overdue, sortable by each column. |

Each rewrite can be tested: time it, count it, or check the report against the data.

## Walkthrough

1. Sort Ashgrove's needs from your interviews into business requirements, functional, non-functional and business rules.
2. Rewrite every vague statement until it passes the testability questions.
3. Give each requirement an ID (FR-01, NFR-01, BR-01) and link each to the business requirement it serves.
4. Run a MoSCoW session with the managing partner and the accounts officer. Challenge every Must with "would we still go live without it?".
5. Record the Won't haves too, with the reason. It stops them reappearing as surprise demands later.

## Practice

```task
{
  "id": "ba-06-t1",
  "prompt": "Rewrite these four vague requirements as **testable** ones, one per line, each using **shall** and including a **number** or a precise condition:\n\n1. Reminders should go out in good time.\n2. The overdue report should be fast.\n3. Only the right people should see client billing.\n4. It should be easy to record time.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "1. The system shall ...",
  "rules": [
    { "label": "Four requirements, each on its own line using 'shall' or 'must'", "pattern": "\\b(shall|must)\\b", "min": 4 },
    { "label": "At least three include a number (a time, a count or a limit)", "pattern": "^\\s*\\d+[.)][^\\n]*\\b(shall|must)\\b[^\\n]*\\d", "min": 3 },
    { "label": "No vague words left (good time, fast, easy, user-friendly, quickly, right people)", "pattern": "good time|\\bfast\\b|\\beasy\\b|easily|user[- ]friendly|quickly|right people", "absent": true },
    { "label": "The access requirement names roles", "pattern": "partner|accounts|lawyer|role" }
  ],
  "sample": "1. The system shall send a payment reminder by email 7 days before each invoice's due date, and another on the due date.\n2. The overdue report shall load in under 5 seconds for up to 2,000 invoices.\n3. Only partners and the accounts officer shall be able to view client billing amounts; lawyers shall see only their own matters.\n4. A lawyer shall be able to record a time entry in under 1 minute, from a phone or a computer.",
  "note": "Each one now has a test: check the reminder dates, time the report, log in as a lawyer and try to open another lawyer's billing, time a time entry. If you can't describe the test, the requirement isn't finished.",
  "required": true
}
```

```task
{
  "id": "ba-06-t2",
  "prompt": "Prioritise these Ashgrove requirements with **MoSCoW**. Write one per line in the form **Requirement | Must, Should, Could or Won't | reason**: due dates on invoices; automatic email reminders; a client payment portal with card payments; an overdue report; importing bank payments automatically; a mobile app for lawyers.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "Due dates on invoices | Must | ...",
  "rules": [
    { "label": "Six lines in the form Requirement | priority | reason", "pattern": "^[^|\\n]+\\|\\s*(must|should|could|won['’]?t)[^|\\n]*\\|[^|\\n]+$", "min": 6 },
    { "label": "At least one Won't (have this time)", "pattern": "\\|\\s*won['’]?t" },
    { "label": "Not everything is a Must: at most three Musts", "pattern": "(?:\\|\\s*must\\b(?:(?!\\|\\s*must\\b)[\\s\\S])*){4}", "absent": true },
    { "label": "Due dates are a Must (nothing can be overdue without them)", "pattern": "due date[^\\n]*\\|\\s*must" }
  ],
  "sample": "Due dates on invoices | Must | without them nothing is ever overdue, so nothing else works\nAn overdue report | Must | accounts and partners need to see what to chase each week\nAutomatic email reminders | Should | the biggest time saver, but a weekly manual reminder works at first\nImporting bank payments automatically | Should | saves time, but payments can be recorded by hand for now\nA client payment portal with card payments | Could | convenient, but most clients pay by transfer\nA mobile app for lawyers | Won't | doesn't address late payment; revisit for time recording later",
  "note": "Two Musts is a sign of a healthy list. The Won't has a reason, so when someone asks for the app in three months, the answer is already agreed.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which requirement is testable?",
    "options": ["The system should be fast", "The overdue report shall load in under 5 seconds for 2,000 invoices", "Reports should be good", "It should be user-friendly"],
    "answer": 1,
    "explanation": "You can time it and pass or fail it."
  },
  {
    "prompt": "'Invoices are due 30 days after issue' is best described as:",
    "options": ["A non-functional requirement", "A business rule", "A user story", "A test case"],
    "answer": 1,
    "explanation": "It's a policy that applies whatever the solution."
  },
  {
    "prompt": "Every requirement on the list is a Must. What's wrong?",
    "options": ["Nothing", "It hasn't really been prioritised; test each Must with 'would we still go live without it?'", "Musts should be Coulds", "MoSCoW doesn't allow Musts"],
    "answer": 1,
    "explanation": "Prioritising means choosing."
  }
]
```
