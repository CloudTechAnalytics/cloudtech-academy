---
title: Stakeholders
minutes: 20
summary: Find everyone affected by a change, map their power and interest, decide how to involve each one, and agree who does what with a RACI chart.
---

## The problem

Six months ago, a Lagos firm bought a billing system its partners loved in a demo. The accounts officer, who would use it every day, was never asked. It couldn't print the paper invoices two of the firm's largest clients insisted on, so she kept the old spreadsheet running alongside it. Within three months the new system was abandoned.

Projects rarely fail because the analysis was too technical. They fail because someone who mattered was missed: a user who couldn't do their job, a manager who blocked it, a client who refused the new invoice format. **Stakeholder analysis** is how a BA makes sure everyone who matters is found and heard.

## The concept

**Who counts as a stakeholder**

Anyone who **affects** the change or is **affected** by it: the people who'll pay for it, use it, run it, support it, or be on the receiving end of it. Look in four directions:

- **Up**: sponsors and decision-makers (the managing partner).
- **Across**: the people who do the work today (lawyers, paralegals, the accounts officer).
- **Out**: customers and suppliers (clients, the software vendor, the bank).
- **Around**: support and control (IT, the auditor, regulators such as the data protection authority).

**The power and interest grid**

Place each stakeholder on two scales: their **power** over the change and their **interest** in it.

| | Low interest | High interest |
| :-- | :-- | :-- |
| **High power** | **Keep satisfied**: brief updates, involve at key decisions | **Manage closely**: involve throughout, agree decisions with them |
| **Low power** | **Monitor**: occasional information | **Keep informed**: regular updates, ask for their input; they often know the details best |

The people who do the work every day often sit in "keep informed", but their knowledge is essential, and their resistance can sink a project. Don't confuse low power with low importance.

**RACI: who does what**

For each key decision or deliverable, a RACI chart says who is:

- **R**esponsible: does the work.
- **A**ccountable: owns the outcome and signs off. Exactly **one** person per row.
- **C**onsulted: asked for input before (two-way).
- **I**nformed: told after (one-way).

## Example

Part of Ashgrove's stakeholder register:

| Stakeholder | Role in the change | Power | Interest | Approach |
| :-- | :-- | :-- | :-- | :-- |
| Mrs Adeyemi-Cole, managing partner | sponsor, approves the budget | high | high | manage closely: weekly 15-minute update |
| Accounts officer | issues and chases invoices today | low | high | keep informed, and involve in design: she knows the process best |
| Lawyers (8) | record work and approve bills | medium | low | keep satisfied: short demos, minimal extra admin |
| Clients (50) | receive and pay invoices | medium | medium | consult a few major clients on the invoice format |
| IT contractor | supports the current spreadsheets | low | medium | consult on data migration |

And a RACI row: *Approve the new invoice process*: Responsible, BA; Accountable, managing partner; Consulted, accounts officer and two senior lawyers; Informed, all staff.

## Walkthrough

1. List everyone affected by a change to Ashgrove's billing, looking up, across, out and around.
2. Place each one on the power and interest grid. Be honest about the lawyers: their interest in billing admin is probably low, but they can block anything that costs them time.
3. Use the matters data to see who carries the most open work. The busiest lawyers will have the least time for new billing steps.
4. Write an approach for each stakeholder (the task below).
5. Draft a RACI for three decisions: choosing the solution, designing the new invoice, and switching off the spreadsheets.

## Practice

```answer
{
  "id": "ba-02-p1",
  "prompt": "Which lawyer is responsible for the most **Open** matters? Type their name.",
  "answer": "Zainab Abdullahi",
  "format": "text",
  "dataset": "legal",
  "files": ["matters"],
  "verify": "SELECT responsible_lawyer FROM matters WHERE status = 'Open' GROUP BY responsible_lawyer ORDER BY COUNT(*) DESC LIMIT 1",
  "hint": "Filter matters.csv to status = Open and count by responsible_lawyer.",
  "explanation": "Zainab Abdullahi, with 7 open matters. She's also the firm's highest biller, so any new billing step that costs her time will meet resistance. Design with her, not for her.",
  "required": true
}
```

```task
{
  "id": "ba-02-t1",
  "prompt": "Write a **stakeholder register** for Ashgrove's billing change with at least **five** stakeholders. Put each on its own line starting with `-`, in the form **Stakeholder | Power | Interest | Approach**, where power and interest are high, medium or low.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "- Managing partner | high | high | manage closely: ...",
  "rules": [
    { "label": "At least five stakeholders, each a line starting with -", "pattern": "^\\s*-\\s+\\S", "min": 5 },
    { "label": "Each line has four parts separated by |", "pattern": "^\\s*-[^|\\n]+\\|[^|\\n]+\\|[^|\\n]+\\|[^|\\n]+$", "min": 5 },
    { "label": "Power and interest given as high, medium or low", "pattern": "^\\s*-[^|\\n]+\\|\\s*(high|medium|low)\\s*\\|\\s*(high|medium|low)\\s*\\|", "min": 5 },
    { "label": "Includes the people who do the billing work (accounts officer or paralegals)", "pattern": "accounts|paralegal|finance|billing clerk" },
    { "label": "Includes clients", "pattern": "client" }
  ],
  "sample": "- Managing partner | high | high | manage closely: weekly update, agrees every key decision\n- Accounts officer | low | high | keep informed and involve in design workshops: she runs the process today\n- Senior lawyers | medium | low | keep satisfied: short demos, show it won't add admin time\n- Paralegals | low | medium | keep informed: they record time, so ask how they do it now\n- Major clients | medium | medium | consult two or three on the invoice format and payment options\n- IT contractor | low | medium | consult on moving data out of the spreadsheets",
  "note": "The approach column is what makes this useful. A register that only labels people high or low is a chart; one that says what you'll *do* about each person is a plan.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The accounts officer has little power over the decision but will use the new process every day. How should you treat her?",
    "options": ["Monitor only: low power", "Keep informed and involve her in design: she knows the process best and can make or break adoption", "Ignore her until training", "Make her accountable for the project"],
    "answer": 1,
    "explanation": "Low power doesn't mean low importance."
  },
  {
    "prompt": "How many people should be Accountable for one row of a RACI chart?",
    "options": ["As many as needed", "Exactly one", "None", "Everyone involved"],
    "answer": 1,
    "explanation": "One owner per decision; shared accountability means nobody's accountable."
  },
  {
    "prompt": "Which is a stakeholder in a change to a firm's invoicing?",
    "options": ["Only the partners", "Anyone who affects or is affected by it: partners, staff, clients, IT, even auditors", "Only people who use the software", "Only the project team"],
    "answer": 1,
    "explanation": "Look up, across, out and around."
  }
]
```
