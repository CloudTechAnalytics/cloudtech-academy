---
title: Process mapping
minutes: 30
summary: Draw how work really flows today with swimlanes, find the delays, handoffs and rework that cause the problem, and design a better future process.
---

## The problem

Ask five people at Ashgrove how a bill gets from finished work to money in the bank and you'll get five different descriptions, each covering the part that person sees. Nobody sees the whole journey, which is exactly why nobody can fix it.

A **process map** puts the whole journey on one page: every step, who does it, and where it waits. It's one of the most powerful tools a BA has, because the moment people see their own process drawn out, the problems become obvious to everyone, usually in the gaps **between** people, not in anyone's own work.

## A story from the field: the clinic that drew a map

A community clinic in Kano was proud of its doctors but ashamed of its waiting room. Patients regularly waited three hours. The manager, Hajiya Amina, hired an analyst, Sani, who did not start with a diagnosis. He started with a roll of paper.

For two days he followed individual patients through the clinic, marking every step and every wait. When he hung the finished map on the wall, the staff gathered around it in silence.

The patient had to **queue at five different desks**: registration, payment, the nurse, the doctor, and then the pharmacy. At two of those desks, the only thing that happened was a clerk copying details from one form onto another. Between the payment desk and the nurse, patients waited 50 minutes for a folder to be carried across the building. The doctors were busy only about half the time, waiting for patients who were waiting for paper.

Nobody on the staff had seen the whole journey before. Each person saw only their own desk, and each believed the delay was somewhere else. The map made the invisible visible.

The fix was practical: merge registration and payment, give each patient a single card with a number instead of a folder to be carried, and put the nurse and doctor in adjacent rooms. Average time in the clinic fell from about three hours to just under ninety minutes.

A process map does not solve problems. It lets everyone finally *see* them, which is the step that comes before every solution.

## The concept

### Swimlane diagrams

A swimlane diagram has a horizontal lane for each role, and the steps flow from left to right across the lanes:

| Symbol | Meaning |
| :-- | :-- |
| rounded rectangle | start or end |
| rectangle | a step (activity) |
| diamond | a decision, with a labelled path for each answer |
| arrow | the flow from one step to the next |
| arrow crossing lanes | a **handoff**: work passing between people |

This is a simplified version of **BPMN** (Business Process Model and Notation), the international standard. Draw it in draw.io (free), Microsoft Visio, Lucidchart or on paper. The thinking matters more than the tool.

### Map the "as is" before the "to be"

Map what really happens today, including the workarounds, not what the procedures manual says. Walk it with the people who do it, and check it against the data.

### Where to look for problems

| Problem | Sign on the map |
| :-- | :-- |
| **Waiting** | long gaps between steps, often at handoffs |
| **Handoffs** | many arrows crossing lanes: each one is a chance for delay or loss |
| **Rework** | loops back to an earlier step (invoices corrected and re-sent) |
| **Manual re-entry** | the same data typed twice, in two places |
| **No trigger** | a step that only happens "when someone remembers" |

## Example

Ashgrove's billing process **as is**, written lane by lane:

1. **Lawyer**: finishes a piece of work.
2. **Lawyer**: sends time worked to accounts by WhatsApp or paper, *when they remember* (usually 1–3 weeks later).
3. **Accounts**: types the time into the billing spreadsheet.
4. **Accounts**: drafts the invoice in Word.
5. **Partner**: reviews the draft. *Wrong rate?* → back to step 4.
6. **Accounts**: emails the PDF invoice to the client. No due date is shown.
7. **Client**: pays when they choose, or when chased.
8. **Accounts**: chases by phone, *only when a partner asks*.
9. **Accounts**: marks the invoice paid when the bank statement arrives.

Three problems jump out: steps 2 and 8 have **no trigger**, so they happen late or not at all; step 5 has a **rework loop**; and step 6 sends an invoice with **no due date**, so step 7 has no deadline. The data agrees: the first invoice on a matter goes out an average of 18 days after the matter opens, and two-thirds of payments arrive after 30 days.

![A swimlane diagram with lanes Lawyer, Accounts, Partner and Client and nine numbered steps. Step 2 (lawyer sends time when they remember) and step 8 (accounts chases when a partner asks) are marked T for no trigger; step 5 (partner review) is marked R with a dashed loop back to step 4; step 6 (invoice with no due date) is marked with an exclamation mark; step 7 (client pays when they choose) is marked W for waiting.](/images/courses/ba/billing-as-is.svg "The as-is process as a swimlane diagram. Every problem sits at a handoff between lanes.")

## A real-world scenario: a loan application, as-is and to-be

A microfinance bank takes **six days** to approve a small loan. The analyst maps the **as-is** process first, step by step, and notes who does each step and how long it waits.

| Step | Who | Time | Problem |
| :-- | :-- | :-- | :-- |
| 1. Customer fills a paper form | Customer | 30 min | Forms often incomplete |
| 2. Officer checks the form | Loan officer | 1 day waiting | Waits in a pile |
| 3. Officer visits the customer's business | Loan officer | 1 day | Needs a trip |
| 4. Officer writes a report | Loan officer | 1 day | Handwritten |
| 5. Manager reviews | Branch manager | 2 days waiting | Only reviews on Thursdays |
| 6. Cash is released | Cashier | 1 day | Waits for cash allocation |

Reading the table, the analyst sees that of the six days, almost five are **waiting**, not work. The two biggest waits are step 2 (the pile) and step 5 (Thursday-only reviews).

Now she designs the **to-be** process:

1. Customer completes a short form with the officer at the desk, so incomplete forms are caught immediately.
2. The officer visits the business on the same or next day.
3. The report is entered on a template on the same visit.
4. The manager reviews daily, with a rule that loans under ₦200,000 can be approved by the officer.
5. Cash is released the day of approval.

Estimated result: **two to three days** instead of six.

**Practical rules for process maps:**

1. Map what really happens, not what the manual says.
2. For every step, note who does it and how long it takes, including waiting.
3. Mark rework loops, handoffs and steps with no trigger. Those are where problems hide.
4. Design the to-be process by removing waits first, then steps.

## Walkthrough

1. Draw the as-is process above as a swimlane diagram, with lanes for Lawyer, Accounts, Partner and Client.
2. Mark each problem on the map: waiting (W), handoff (H), rework (R) and no trigger (T).
3. Check the map against the data: how long after a matter opens does its first invoice go out (the task below)?
4. Design the **to-be** process: what triggers each step, what's automated, and where the decision points are.
5. Walk the to-be map with the accounts officer and one lawyer. Ask: "What would stop this working on a busy week?"

## Practice

```answer
{
  "id": "ba-05-p1",
  "prompt": "On average, how many days after a matter is **opened** is its **first** invoice issued? One decimal place.",
  "answer": 18.4,
  "format": "number",
  "dataset": "legal",
  "files": ["invoices", "matters"],
  "verify": "SELECT ROUND(AVG(julianday(i.issued_date) - julianday(m.opened_date)), 1) FROM invoices i JOIN matters m ON m.matter_id = i.matter_id WHERE i.invoice_id IN (SELECT MIN(invoice_id) FROM invoices GROUP BY matter_id)",
  "hint": "For each matter, take its earliest invoice (the lowest invoice_id), then average issued_date − opened_date.",
  "required": true
}
```

```task
{
  "id": "ba-05-t1",
  "prompt": "Write Ashgrove's **to-be** billing process as numbered steps, each in the form **Lane: step** (for example `3. Accounts: ...`). Use at least **eight** steps and at least three lanes, include at least one **decision** (write it with \"if\"), and fix the problems found in the as-is map: give each step a trigger, show a **due date** on the invoice, and add **reminders**.",
  "minutes": 12,
  "rows": 12,
  "placeholder": "1. Lawyer: ...\n2. Accounts: ...",
  "rules": [
    { "label": "At least eight numbered steps in the form Lane: step", "pattern": "^\\s*\\d+[.)]\\s*[A-Za-z ]+:\\s*\\S", "min": 8 },
    { "label": "At least three different lanes, including the client", "pattern": "^\\s*\\d+[.)]\\s*client\\s*:" },
    { "label": "Includes a decision written with 'if'", "pattern": "\\bif\\b" },
    { "label": "Shows a due date or payment terms on the invoice", "pattern": "due date|due in|payment terms|\\d+[- ]day terms" },
    { "label": "Adds reminders", "pattern": "remind" },
    { "label": "Gives the time-recording step a trigger or deadline", "pattern": "(daily|weekly|by friday|each week|every week|end of (the )?(day|week|month)|within \\d+)" }
  ],
  "sample": "1. Lawyer: records time in the shared time sheet by the end of each week.\n2. Accounts: on the 1st of each month, produces draft invoices from the time sheet.\n3. Partner: reviews drafts within 3 working days; if a rate is wrong, corrects it in the rate table so it's right next time.\n4. Accounts: sends each invoice by email with a due date (30-day terms) and the bank details.\n5. Client: pays by the due date.\n6. Accounts: if unpaid 7 days before the due date, sends an automatic friendly reminder.\n7. Accounts: if unpaid on the due date, sends a second reminder and phones the client.\n8. Partner: if unpaid 30 days after the due date, calls the client personally.\n9. Accounts: each Monday, records payments from the bank statement and circulates the overdue list.",
  "note": "Every step now has a trigger (a day, a deadline or a condition), the rework loop fixes the cause (the rate table), and chasing no longer depends on someone remembering. Notice none of it *requires* new software, though software could automate steps 2, 6 and 9.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Where do process problems most often hide?",
    "options": ["Inside each person's own task", "In the handoffs and waits between people", "In the software", "In the start and end steps"],
    "answer": 1,
    "explanation": "Nobody owns the gaps between lanes, so that's where work waits."
  },
  {
    "prompt": "A step happens 'when a partner asks'. What kind of problem is that?",
    "options": ["Rework", "No trigger: the step depends on someone remembering", "Manual re-entry", "A decision point"],
    "answer": 1,
    "explanation": "Give each step a trigger: a date, an event or a condition."
  },
  {
    "prompt": "Should you map the process from the procedures manual?",
    "options": ["Yes, it's the official version", "No: map what actually happens, with the people who do the work, and check it against the data", "Only for the to-be process", "It doesn't matter"],
    "answer": 1,
    "explanation": "Workarounds and delays are rarely in the manual."
  }
]
```
