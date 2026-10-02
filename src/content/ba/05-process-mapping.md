---
title: Process mapping
minutes: 25
summary: Draw how work really flows today with swimlanes, find the delays, handoffs and rework that cause the problem, and design a better future process.
---

## The problem

Ask five people at Ashgrove how a bill gets from finished work to money in the bank and you'll get five different descriptions, each covering the part that person sees. Nobody sees the whole journey, which is exactly why nobody can fix it.

A **process map** puts the whole journey on one page: every step, who does it, and where it waits. It's one of the most powerful tools a BA has, because the moment people see their own process drawn out, the problems become obvious to everyone, usually in the gaps **between** people, not in anyone's own work.

## The concept

**Swimlane diagrams**

A swimlane diagram has a horizontal lane for each role, and the steps flow from left to right across the lanes:

| Symbol | Meaning |
| :-- | :-- |
| rounded rectangle | start or end |
| rectangle | a step (activity) |
| diamond | a decision, with a labelled path for each answer |
| arrow | the flow from one step to the next |
| arrow crossing lanes | a **handoff**: work passing between people |

This is a simplified version of **BPMN** (Business Process Model and Notation), the international standard. Draw it in draw.io (free), Microsoft Visio, Lucidchart or on paper. The thinking matters more than the tool.

**Map the "as is" before the "to be"**

Map what really happens today, including the workarounds, not what the procedures manual says. Walk it with the people who do it, and check it against the data.

**Where to look for problems**

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
