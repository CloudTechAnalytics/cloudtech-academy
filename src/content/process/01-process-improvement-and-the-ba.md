---
title: Process improvement and the BA
minutes: 20
summary: What Lean and Six Sigma are for, the improvement cycle every method shares, and how to frame an improvement problem around time, cost and quality that customers feel.
---

## The problem

Harbourline Freight clears its customers' imported containers through Lagos port. Every day a container stays at the port after its three free days, the terminal charges **demurrage**: ₦45,000 per container per day. In the first four months of 2026, Harbourline's customers paid ₦184m in demurrage, and the account managers spent much of their time apologising for it.

The operations director's instinct is to "push the clearing team harder". But the clearing team isn't idle. Most of the time a container sits at the port, nobody is working on it at all: it's waiting for documents, for payment, for an inspection slot. You can't fix waiting by making people work faster.

That's the central insight of **Lean**, and this course teaches you to find where time and money really go in a process, and to change the process rather than push the people.

## The concept

**Lean and Six Sigma in one paragraph each**

**Lean** (from Toyota's production system) is about **flow**: delivering value to the customer with as little waste, waiting and effort as possible. Its tools include value stream maps, the eight wastes and pull systems.

**Six Sigma** (from Motorola and GE) is about **variation and defects**: making a process reliable, so results are predictable. Its improvement cycle is **DMAIC**: Define, Measure, Analyse, Improve, Control.

Most organisations blend the two ("Lean Six Sigma"). You don't need a belt to use them; a BA who can map a process, measure it from data and find root causes is already doing the core work.

**The improvement cycle**

| DMAIC | What you do | Lesson |
| :-- | :-- | :-- |
| **Define** | the problem, the customer, the measures | 1 |
| **Measure** | map the process and measure it from data | 2, 3, 4 |
| **Analyse** | find waste, bottlenecks and root causes | 5, 6, 7 |
| **Improve** | design and pilot a better process | 8, 9 |
| **Control** | make the improvement stick | 9 |

**Measures customers feel**

Frame the problem around what the customer experiences, not internal activity:

- **Lead time**: from the container's arrival to its release from the port (and on to the customer's door).
- **Cost**: demurrage the customer pays.
- **Quality**: how often a clearance goes wrong first time (documents rejected, corrections needed).

"Clearing staff processed 20 files a day" is an activity measure. "Containers spend 8.6 days at port" is something the customer feels.

## Example

The improvement problem statement:

> Harbourline's import containers spend an average of 8.6 days at Lagos port from arrival to release, against 3 free days, so customers paid ₦184m in demurrage in January to April 2026. About a third of clearances need corrected documents from the customer before they can proceed. We'll measure success by average days at port, demurrage per container and the share of clearances with complete documents on arrival.

It names the customer impact, the size and the measures, and like every good problem statement it doesn't name a solution.

## Walkthrough

1. Download the process dataset. Open `cases.csv` (one row per clearance) and `events.csv` (every activity, with start and end times).
2. For each case, calculate days at port: `released_datetime − arrival_datetime`.
3. Calculate the average days at port for the cases **before** the checklist pilot (`checklist_pilot = No`), then the days to the customer's door and the total demurrage for those cases (the tasks below).
4. Look at `docs_complete_on_arrival`. What share of clearances arrive with incomplete documents?
5. Write the problem statement in your own words.

## Practice

```dataset
{"dataset": "process", "files": ["cases", "events"]}
```

```answer
{
  "id": "pil-01-p1",
  "prompt": "For clearances **before** the pilot (checklist_pilot = No), what is the average number of days from **arrival to delivery at the customer's door** (delivered − arrival)? Two decimal places.",
  "answer": 9.65,
  "tolerance": 0.06,
  "format": "number",
  "dataset": "process",
  "files": ["cases"],
  "verify": "SELECT ROUND(AVG(julianday(delivered_datetime) - julianday(arrival_datetime)), 2) FROM cases WHERE checklist_pilot = 'No'",
  "hint": "The datetimes include hours, so the difference is in days with a fraction. In Excel, subtract the two cells; in SQL, julianday(released) − julianday(arrival).",
  "required": true
}
```

```answer
{
  "id": "pil-01-p2",
  "prompt": "What was the **total demurrage** charged on clearances before the pilot? (A rounded figure is fine.)",
  "answer": 184005000,
  "format": "naira",
  "dataset": "process",
  "files": ["cases"],
  "verify": "SELECT SUM(demurrage_ngn) FROM cases WHERE checklist_pilot = 'No'",
  "hint": "Sum demurrage_ngn where checklist_pilot = No.",
  "required": true
}
```

```task
{
  "id": "pil-01-t1",
  "prompt": "A hospital's pharmacy takes a long time to dispense discharge medicines: patients who are ready to go home wait for their prescriptions, and the beds can't be used by new patients. Write an **improvement problem statement** in 2 to 4 sentences, with a **customer-felt measure** (time or cost), a number (make up a realistic one if you need to), and how success will be measured. Don't name a solution.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Patients who are ready to go home wait ...",
  "rules": [
    { "label": "Names the customer (patients) and what they experience", "pattern": "patient" },
    { "label": "Includes a number", "pattern": "\\d" },
    { "label": "Uses a time or cost measure", "pattern": "hour|minute|day|wait|₦|naira|cost" },
    { "label": "Says how success is measured", "pattern": "measur|success|target|reduc" },
    { "label": "Doesn't name a solution (system, software, robot, extra staff, automate)", "pattern": "\\b(system|software|robot|app|automat\\w*|hire|extra staff|more staff)\\b", "absent": true },
    { "label": "Between 30 and 110 words", "minWords": 30, "maxWords": 110 }
  ],
  "sample": "Patients who are medically ready to go home wait an average of 4 hours for their discharge medicines, and during that time their beds can't be given to new admissions waiting in the emergency department. On a typical day that's around 30 bed-hours lost. We'll measure success by the average time from discharge decision to medicines in hand, and the bed-hours lost each day.",
  "note": "The bed-hours measure connects the patient's wait to a cost the hospital feels, which is usually what gets an improvement project funded.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Containers spend 8.6 days at port, but the clearing team is busy all day. What does Lean suggest?",
    "options": ["Make the team work faster", "Most of the time is probably waiting between steps; find and remove the waits", "Hire more staff", "Nothing can be done"],
    "answer": 1,
    "explanation": "In most processes, waiting time dwarfs working time."
  },
  {
    "prompt": "Which is a customer-felt measure?",
    "options": ["Files processed per clerk per day", "Days from arrival to release", "Hours worked by the team", "Number of meetings held"],
    "answer": 1,
    "explanation": "Measure what the customer experiences: time, cost and quality."
  },
  {
    "prompt": "What does DMAIC stand for?",
    "options": ["Design, Make, Assess, Inspect, Close", "Define, Measure, Analyse, Improve, Control", "Document, Map, Automate, Integrate, Check", "Decide, Monitor, Act, Improve, Continue"],
    "answer": 1,
    "explanation": "The Six Sigma improvement cycle."
  }
]
```
