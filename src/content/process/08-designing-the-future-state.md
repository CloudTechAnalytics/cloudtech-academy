---
title: Designing the future state
minutes: 20
summary: Design a better process with Lean patterns (do it earlier, error-proof it, standardise it, level the flow), set targets, and estimate the benefit before you change anything.
---

## The problem

You know where the time goes and why. Now the operations director asks for the fix. There's a temptation to jump to the most visible idea, a new clearance system, or to list twenty small tweaks. Neither helps. The first is expensive and slow; the second spreads effort thin.

A good future state attacks the **root causes** at the **constraints**, with a small number of changes, each with a clear expected effect. And before anything changes, you estimate the benefit, so that the pilot has a target to beat.

## The concept

### Lean design patterns

| Pattern | Idea | For Harbourline's clearance |
| :-- | :-- | :-- |
| **Do it earlier (front-load)** | move checks before the point where errors become expensive | check documents before the vessel arrives, not after |
| **Error-proofing (poka-yoke)** | make the mistake impossible, or obvious at once | a checklist per importer type, so a pharmaceutical shipment can't be booked without its NAFDAC permit |
| **Standard work** | one agreed best way, written down, for repeatable steps | the same document check, in the same order, for every file |
| **Remove a handoff** | fewer passes between people and teams | one named clerk owns a file from booking to release |
| **Level the flow** | avoid peaks that overload the bottleneck | ask customs for inspection slots as soon as the channel is known |
| **Pull, not push** | start the next step when it can actually proceed | send the duty notice the moment assessment arrives, with a payment reference |

### Future-state targets

For each change, state the measure it should move and by how much, for example: "documents complete on arrival rises from 66% to 85%". Targets should be ambitious but grounded in your analysis: you know how long complete files take, so you can estimate what more complete files would save.

### Estimating the benefit

Convert time into money with the cost the customer feels:

> annual saving ≈ (current cost per unit − target cost per unit) × units per year

State the assumptions, and test what happens if you only get half the improvement.

## Example

Harbourline's future state, as three changes:

1. **Pre-arrival document check**, with an importer-specific checklist (front-load and error-proof). *Target:* documents complete on arrival from 66% to at least 85%.
2. **Duty notice with a payment reference**, sent the same day as assessment (pull, and the fix from lesson 7's five whys). *Target:* wait for payment confirmation from about 46 hours to under 24.
3. **Early inspection booking** for Red channel files, once all documents are complete and duty is paid (exploit the constraint). *Target:* wait for inspection from about 42 hours to under 30.

Change 1 is the one Harbourline piloted from 1 May. Changes 2 and 3 are the next candidates.

## Walkthrough

1. List your root causes and constraints from lessons 4 to 7.
2. Choose at most three changes, each tied to a root cause, using the patterns above.
3. Redraw the BPMN model for the future state: where do the checks move? Which loops disappear?
4. Set a target for each change.
5. Estimate the benefit: calculate demurrage per container before the pilot (the first task below), then the saving if it fell to a target.

## Practice

```answer
{
  "id": "pil-08-p1",
  "prompt": "Before the pilot, what was the average **demurrage per container** across **all** clearances (total demurrage ÷ total containers)? (A rounded figure is fine.)",
  "answer": 277116,
  "format": "naira",
  "dataset": "process",
  "files": ["cases"],
  "verify": "SELECT ROUND(SUM(demurrage_ngn) * 1.0 / SUM(containers)) FROM cases WHERE checklist_pilot = 'No'",
  "hint": "Sum of demurrage_ngn ÷ sum of containers, where checklist_pilot = No.",
  "required": true
}
```

```answer
{
  "id": "pil-08-p2",
  "prompt": "If demurrage per container fell from your previous answer to a target of **₦150,000**, what would the annual saving be on **2,000 containers** a year? (A rounded figure is fine.)",
  "answer": 254232000,
  "format": "naira",
  "hint": "(277,116 − 150,000) × 2,000.",
  "explanation": "About ₦254m a year, and that's customers' money, which Harbourline can use to keep and win business. Even half the improvement would be worth well over ₦100m.",
  "required": true
}
```

```task
{
  "id": "pil-08-t1",
  "prompt": "Propose a **future state** for a different process: *A Lagos hospital's discharge process, where patients wait about 4 hours for their medicines after the doctor says they can go home.* Write **three changes**, one per line, each in the form **Change | Lean pattern | measure and target**.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Prescribe discharge medicines the day before | do it earlier | ...",
  "rules": [
    { "label": "Three lines in the form Change | pattern | measure and target", "pattern": "^[^|\\n]+\\|[^|\\n]+\\|[^|\\n]+$", "min": 3 },
    { "label": "Names Lean patterns (earlier, error-proof, standard work, handoff, level, pull)", "pattern": "earlier|front-?load|error-?proof|poka|standard|handoff|hand-off|level|pull", "min": 2 },
    { "label": "Each target includes a number", "pattern": "\\|[^|\\n]*\\d[^|\\n]*$", "min": 3 }
  ],
  "sample": "Write discharge prescriptions the evening before expected discharge | do it earlier | share of discharge medicines ready by 10am, from about 20% to 70%\nA discharge checklist the pharmacy can't skip (allergies, doses, follow-up) | error-proofing | prescriptions returned to the ward for correction, from 15% to under 5%\nOne pharmacy technician owns ward discharges each morning | remove a handoff | average wait for medicines from 4 hours to under 1.5 hours",
  "note": "Each change has a pattern, a measure and a target, so the pilot can test them one by one. Without targets, a pilot can only report that \"things improved\".",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is poka-yoke?",
    "options": ["A Japanese meeting", "Error-proofing: making a mistake impossible or immediately obvious", "A type of bottleneck", "A BPMN symbol"],
    "answer": 1,
    "explanation": "A checklist that blocks booking without the permit is a poka-yoke."
  },
  {
    "prompt": "Why limit the future state to a few changes tied to root causes?",
    "options": ["Fewer changes are always better", "Focused changes at the constraints can be piloted and measured; twenty small tweaks spread effort and can't be evaluated", "Management prefers three", "It's a Lean rule"],
    "answer": 1,
    "explanation": "Fix the causes that matter most, and measure each."
  },
  {
    "prompt": "Why estimate the benefit before piloting?",
    "options": ["To impress the sponsor", "So the pilot has a target to beat, and the decision to scale is based on evidence", "It's optional", "To set the budget"],
    "answer": 1,
    "explanation": "A target makes the pilot a test, not a demonstration."
  }
]
```
