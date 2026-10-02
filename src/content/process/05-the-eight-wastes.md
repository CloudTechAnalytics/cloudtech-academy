---
title: The eight wastes
minutes: 20
summary: Learn to see waste in any process with the eight Lean wastes, find the evidence for each in data and observation, and size it so the biggest gets fixed first.
---

## The problem

Walk through Harbourline's clearing office and nobody looks idle. The documentation team is checking files, phoning customers about missing permits, re-checking corrected files, re-typing data from emailed PDFs into the customs portal, and printing copies "just in case". Everyone is busy. Much of that busyness adds nothing the customer would pay for.

Lean calls this **waste**: anything that uses time, money or effort without adding value from the customer's point of view. It's hard to see because it looks like work. The eight wastes are a checklist that trains you to spot it.

## The concept

**Value-adding or not?**

A step **adds value** when the customer would willingly pay for it, it changes the item in a way the customer cares about, and it's done right first time. Checking documents is arguably necessary (customs requires it), but **re-checking** them because they were wrong is pure waste. Steps that are needed but add no value (regulatory checks, for example) are "necessary non-value-adding": minimise them, don't pretend they're value.

**The eight wastes (DOWNTIME)**

| Waste | In an office or service process | At Harbourline |
| :-- | :-- | :-- |
| **D**efects | errors, rework, corrections | incomplete documents, correction loops |
| **O**verproduction | doing more, or sooner, than needed | reports nobody reads; printing every file |
| **W**aiting | items or people waiting | waiting for corrected documents, duty payment, inspection |
| **N**on-utilised talent | people's skills and ideas unused | clerks who know which customers always forget permits, but aren't asked |
| **T**ransportation | moving items or information unnecessarily | documents emailed back and forth between teams |
| **I**nventory | work piling up | containers stacked at port; a backlog of files to check |
| **M**otion | unnecessary movement or searching | searching inboxes for the latest version of a document |
| **E**xtra processing | doing more than the customer needs | re-typing data from PDFs into the customs portal |

**Evidence, not opinion**

For each waste, find evidence: a number from the data, an observation, or a quote. Then size it in time or money, so the team fixes the biggest waste first rather than the most annoying one.

## Example

Defects, sized from the event log. Before the pilot, Harbourline's documentation team sent 136 requests for corrected documents, and 25 clearances needed **two** rounds of correction. The correction loop added an average of about three days to every clearance that went through it. At ₦45,000 per container per day once the free days are used up, those days are the most expensive waste in the process.

## Walkthrough

1. Walk through the clearance process (from your BPMN model) and, at each step, ask "would the customer pay for this?"
2. For each of the eight wastes, write down one example at Harbourline.
3. Find evidence for each from the event log, from the cases table, or from what you'd observe in the office.
4. Size the biggest wastes in hours, days or naira.
5. Write your waste list (the task below), biggest first.

## Practice

```answer
{
  "id": "pil-05-p1",
  "prompt": "Before the pilot, how many **Request corrected documents** events were there?",
  "answer": 136,
  "format": "number",
  "dataset": "process",
  "files": ["cases", "events"],
  "verify": "SELECT COUNT(*) FROM events e JOIN cases c ON c.case_id = e.case_id WHERE c.checklist_pilot = 'No' AND e.activity = 'Request corrected documents'",
  "hint": "Count events with that activity, for cases with checklist_pilot = No.",
  "required": true
}
```

```task
{
  "id": "pil-05-t1",
  "prompt": "List **at least five** of the eight wastes in Harbourline's clearance process. One per line, in the form **Waste | example at Harbourline | evidence or size**. Put the biggest first.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Waiting | containers wait ... | ...",
  "rules": [
    { "label": "At least five lines in the form Waste | example | evidence", "pattern": "^[^|\\n]+\\|[^|\\n]+\\|[^|\\n]+$", "min": 5 },
    { "label": "Each line starts with one of the eight wastes", "pattern": "^\\s*[-*]?\\s*(\\d+[.)]\\s*)?(defects?|overproduction|waiting|non-utili[sz]ed talent|talent|transport(ation)?|inventory|motion|extra processing|over-?processing)\\s*\\|", "min": 5 },
    { "label": "At least three lines include a number", "pattern": "^[^\\n]*\\|[^\\n]*\\d[^\\n]*$", "min": 3 },
    { "label": "Includes waiting", "pattern": "^\\s*[-*]?\\s*(\\d+[.)]\\s*)?waiting\\s*\\|" },
    { "label": "Includes defects", "pattern": "^\\s*[-*]?\\s*(\\d+[.)]\\s*)?defects?\\s*\\|" }
  ],
  "sample": "Waiting | containers wait at port for corrections, duty payment and inspection | 4.3% flow efficiency: about 9 hours of work in 207 hours at port\nDefects | incomplete customer documents, corrected and re-checked | 136 correction requests before the pilot; 25 clearances needed two rounds\nInventory | containers stacked at port beyond their free days | ₦184m demurrage in four months\nExtra processing | data re-typed from emailed PDFs into the customs portal | about 30 minutes per declaration (observed)\nMotion | searching email for the latest version of a document | several times a day per clerk (observed)\nNon-utilised talent | clerks know which importers always miss permits, but aren't asked | pharmaceutical files incomplete 70% of the time",
  "note": "Waiting and defects are linked here: the defects (incomplete documents) cause the longest waits. Lesson 7 digs into why the documents are incomplete in the first place.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Documents are checked, found incomplete, corrected and re-checked. Which waste is the re-check?",
    "options": ["Motion", "Defects (rework)", "Overproduction", "Value-adding work"],
    "answer": 1,
    "explanation": "Work done again because it was wrong the first time is rework."
  },
  {
    "prompt": "A customs check is required by law but doesn't change the container. How should you treat it?",
    "options": ["As value-adding", "As necessary non-value-adding: keep it, but make it as quick and smooth as possible", "Remove it", "Ignore it"],
    "answer": 1,
    "explanation": "Some steps can't be removed, but they can still be streamlined."
  },
  {
    "prompt": "Why size each waste in time or money?",
    "options": ["To blame someone", "So the team fixes the biggest waste first, not the most annoying one", "It's required by Lean", "To make a longer report"],
    "answer": 1,
    "explanation": "Evidence and size decide priorities."
  }
]
```
