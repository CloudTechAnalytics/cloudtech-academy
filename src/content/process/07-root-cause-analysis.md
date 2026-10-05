---
title: Root cause analysis
minutes: 20
summary: Get from a symptom to the causes you can actually fix with a fishbone diagram, five whys and Pareto analysis, and avoid the classic trap of confusing a high rate with a big total.
---

## The problem

Incomplete documents cause Harbourline's most expensive wait. Before the pilot, clearances with incomplete documents spent **11.1 days** at port on average, against **7.4** for complete ones, and paid almost twice as much demurrage per container. So why are documents incomplete?

The clearing team's answer is "customers are careless". That's a symptom with a label on it, not a cause, and you can't fix "careless". Root cause analysis keeps asking until it reaches something specific that can be changed: a missing form, an unclear instruction, a permit nobody mentions until it's too late.

## The concept

### The fishbone (Ishikawa) diagram

Write the problem at the "head" and brainstorm causes along six "bones":

| Category | Questions for incomplete documents |
| :-- | :-- |
| **People** | Do customers know what's needed? Does Harbourline's team? |
| **Process** | When does Harbourline ask for documents? Is there a checklist? |
| **Policy** | Which goods need extra permits (NAFDAC, SONCAP)? Do the rules change? |
| **Materials** (inputs) | Which documents are most often missing or wrong? |
| **Systems** | How are documents sent and stored? Can versions get mixed up? |
| **Measurement** | Does anyone track incompleteness by customer or document? |

The fishbone generates candidate causes. Data and five whys test them.

![A fishbone diagram with the problem, documents incomplete on arrival, at the head, and six bones: People (customers don't know what's needed), Process (checked only on arrival; no checklist), Policy (NAFDAC and SONCAP permits; rules change), Materials (permits most often missing), Systems (sent by email; versions mixed up), Measurement (nobody tracks it by customer).](/images/courses/process/fishbone.svg "Harbourline's fishbone: candidate causes, before the data tests them.")

**Five whys**, applied:

1. Why are documents incomplete? *The permit is missing.*
2. Why? *The customer didn't know it was needed.*
3. Why? *Harbourline only lists the required documents after the vessel arrives.*
4. Why? *The documentation team checks files on arrival, not before.*
5. Why? *That's how the process was set up when shipments were simpler.*

Root cause: **documents are checked too late for problems to be fixed before arrival.** That's something Harbourline controls.

### Pareto analysis: rate versus count

Sort the causes (or customer groups) by how many problems they cause, and look at the cumulative share. Usually a few account for most. But compare two measures:

- the **rate**: which group is most likely to have the problem?
- the **count**: which group causes the most problems in total?

A small group with a very high rate needs a targeted fix. A large group with a moderate rate may cause more problems overall.

## Example

Incomplete documents before the pilot, by importer type:

| Importer type | Clearances | Incomplete | Rate |
| :-- | --: | --: | --: |
| Pharmaceutical | 33 | 23 | 70% |
| Manufacturer | 95 | 30 | 32% |
| Retailer | 89 | 26 | 29% |
| Electronics | 63 | 17 | 27% |
| Construction | 47 | 15 | 32% |

Pharmaceutical importers are by far the most likely to have incomplete documents (they need NAFDAC permits that others don't), so they need a specific fix: a permit check weeks before shipping. But manufacturers and retailers together cause more incomplete files (56) than pharmaceuticals (23). A fix aimed only at pharmaceutical importers would miss most of the problem. A general "check before arrival" fix reaches everyone.

## Walkthrough

1. Compare days at port and demurrage per container for complete and incomplete files, before the pilot.
2. Draw a fishbone for "documents incomplete on arrival", with at least two causes per bone.
3. Run five whys on the most likely cause.
4. Build the table in the example and a Pareto chart of incomplete files by importer type.
5. Write the root causes you'll act on, each with its evidence (the task below).

## Practice

```answer
{
  "id": "pil-07-p1",
  "prompt": "Before the pilot, what was the average **demurrage per container** for clearances with **incomplete** documents on arrival? (Total demurrage ÷ total containers, for those cases. A rounded figure is fine.)",
  "answer": 386652,
  "format": "naira",
  "dataset": "process",
  "files": ["cases"],
  "verify": "SELECT ROUND(SUM(demurrage_ngn) * 1.0 / SUM(containers)) FROM cases WHERE checklist_pilot = 'No' AND docs_complete_on_arrival = 'No'",
  "hint": "Sum demurrage_ngn ÷ sum containers, for cases before the pilot with docs_complete_on_arrival = No.",
  "explanation": "About ₦387,000 per container, against about ₦218,000 when documents were complete. Incomplete documents cost customers roughly ₦169,000 more per container.",
  "required": true
}
```

```answer
{
  "id": "pil-07-p2",
  "prompt": "Before the pilot, what share of **all** incomplete files came from **Pharmaceutical** importers? One decimal place.",
  "answer": 20.7,
  "format": "percent",
  "dataset": "process",
  "files": ["cases"],
  "verify": "SELECT ROUND(100.0 * SUM(importer_type = 'Pharmaceutical' AND docs_complete_on_arrival = 'No') / SUM(docs_complete_on_arrival = 'No'), 1) FROM cases WHERE checklist_pilot = 'No'",
  "hint": "Pharmaceutical incomplete files ÷ all incomplete files, before the pilot.",
  "explanation": "About a fifth. The highest rate, but not most of the problem.",
  "required": true
}
```

```task
{
  "id": "pil-07-t1",
  "prompt": "Write **five whys** for a different problem: *Customers wait an average of two days for Harbourline to confirm their duty payment.* Number each why (1. to 5.), give an answer for each, and finish with a line starting **Root cause:** that names something Harbourline can change.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "1. Why ...? ...\n...\nRoot cause: ...",
  "rules": [
    { "label": "Five numbered whys", "pattern": "^\\s*\\d[.)]\\s*why\\b", "min": 5 },
    { "label": "A Root cause line", "pattern": "^\\s*root cause\\s*:" },
    { "label": "The root cause isn't just blaming people (careless, lazy, slow staff)", "pattern": "root cause\\s*:[^\\n]*(careless|lazy|incompetent|slow staff|bad customers)", "absent": true },
    { "label": "Enough detail: at least 60 words", "minWords": 60 }
  ],
  "sample": "1. Why do customers wait two days for payment confirmation? Finance only confirms payments once the bank statement arrives.\n2. Why only then? There's no other way to see that a customer has paid.\n3. Why not? Customers pay by transfer without the clearance reference, so payments can't be matched until someone reads the statement.\n4. Why don't they include the reference? The duty notice we send doesn't ask for one or show it clearly.\n5. Why not? The notice template was written before transfers replaced bank drafts, and nobody updated it.\nRoot cause: the duty notice doesn't give customers a payment reference, so payments can't be matched automatically.",
  "note": "The root cause is a template, which can be fixed in an afternoon. \"Finance is slow\" would have led to hiring someone; the five whys led to a much cheaper fix.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The clearing team says the cause is 'customers are careless'. What's wrong with that as a root cause?",
    "options": ["Nothing", "It's a label for a symptom, not something specific Harbourline can change; keep asking why", "It's too specific", "Root causes must be technical"],
    "answer": 1,
    "explanation": "Root causes should be specific and actionable."
  },
  {
    "prompt": "Group A has a 70% problem rate but small volume; group B has a 30% rate and three times the volume. Which causes more problems in total?",
    "options": ["Group A", "Group B", "They're equal", "You can't tell"],
    "answer": 1,
    "explanation": "Rate and count answer different questions; check both."
  },
  {
    "prompt": "What is a fishbone diagram for?",
    "options": ["Measuring lead time", "Brainstorming possible causes of a problem in categories, before testing them with data", "Prioritising stories", "Drawing BPMN"],
    "answer": 1,
    "explanation": "It generates candidate causes; data and five whys test them."
  }
]
```
