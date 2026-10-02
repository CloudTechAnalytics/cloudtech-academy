---
title: BPMN in depth
minutes: 25
summary: Model a real process in BPMN with events, gateways, pools, lanes and message flows, so anyone, from a clerk to a developer, reads it the same way.
---

## The problem

Harbourline's clearing team has three diagrams of the import clearance process: a flowchart in a 2019 procedures manual, a whiteboard photo, and a slide the operations director drew for a customer. They disagree. One shows customs inspection on every container; another doesn't show inspection at all; none shows what happens when a customer's documents are wrong, which, it turns out, happens to about a third of clearances.

In Business Analysis Fundamentals you drew simple swimlane diagrams. When a process has branches, loops, waiting and several organisations, you need a notation precise enough that everyone reads it the same way. That's **BPMN** (Business Process Model and Notation), the international standard (ISO 19510) used by BAs, process teams and workflow software alike.

## The concept

**The core BPMN elements**

| Element | Symbol | Use |
| :-- | :-- | :-- |
| **Start event** | thin circle | what triggers the process (vessel arrives) |
| **Intermediate event** | double circle | something that happens during it: a **timer** (clock: "wait 3 days") or a **message** (envelope: "corrected documents received") |
| **End event** | thick circle | how it finishes (container delivered) |
| **Task** | rounded rectangle | one piece of work |
| **Sub-process** | rounded rectangle with [+] | a group of tasks shown in detail elsewhere |
| **Exclusive gateway** (XOR) | diamond with ✕ | exactly one path is taken, based on a condition |
| **Parallel gateway** (AND) | diamond with + | all paths happen at the same time; a second one waits for all to finish |
| **Inclusive gateway** (OR) | diamond with ○ | one or more paths, depending on conditions |
| **Sequence flow** | solid arrow | order within one organisation |
| **Message flow** | dashed arrow | communication **between** organisations |
| **Pool** | large box | one organisation (Harbourline, the customer, customs) |
| **Lane** | strip inside a pool | a role or team within it |

**Rules that keep models readable**

- Label every gateway as a question ("Documents complete?") and every outgoing path with an answer ("Yes", "No").
- Use **message flows** between pools, never sequence flows: one organisation can't control another's steps.
- Show waiting explicitly with **intermediate events**, because in improvement work the waits matter most.
- Model what happens, including the rework loops, not the ideal.
- One diagram per level: hide detail in sub-processes.

## Example

The clearance process, as a BA would describe the BPMN model in words:

1. **Start event**: vessel arrives (Harbourline pool, Documentation lane).
2. **Task**: check documents.
3. **Exclusive gateway**: documents complete?
   - **No** → task: request corrected documents → *message flow* to the Customer pool → **intermediate message event**: corrected documents received → task: re-check documents → back to the gateway.
   - **Yes** → continue.
4. **Task** (Customs broker lane): submit customs declaration → *message flow* to the Customs pool.
5. **Intermediate message event**: duty assessment received → *message flow* to the customer → **intermediate message event**: duty payment confirmed.
6. **Exclusive gateway**: customs channel?
   - **Green** → no inspection.
   - **Yellow** → document review by customs.
   - **Red** → physical inspection.
7. **Task** (Terminal): release and gate-out.
8. **Task** (Haulage lane): deliver to customer → **end event**: container delivered.

The loop at step 3 is the part none of the three old diagrams showed. It's also where much of the delay turns out to be.

## Walkthrough

1. In `events.csv`, list the distinct activities. Each becomes a task in your model.
2. Decide the pools: Harbourline, the customer, and Nigeria Customs (plus the terminal operator if you want to show it). Then the lanes inside Harbourline.
3. Find the branches in the data: how many cases go through physical inspection (the first task below)? How many have a re-check?
4. Draw the model in draw.io (search its shapes for "BPMN"), Camunda Modeler (free) or on paper.
5. Write the model in words (the second task below), so it can be checked without the diagram.

## Practice

```answer
{
  "id": "pil-02-p1",
  "prompt": "What percentage of clearances go through **Physical inspection** (the Red channel)? One decimal place.",
  "answer": 43.6,
  "format": "percent",
  "dataset": "process",
  "files": ["cases"],
  "verify": "SELECT ROUND(100.0 * SUM(customs_channel = 'Red') / COUNT(*), 1) FROM cases",
  "hint": "Count the cases with customs_channel = Red ÷ all cases. Or count the cases with a Physical inspection event in events.csv.",
  "explanation": "43.6%: physical inspection isn't an exception, it's a main path, and the model must show it as one branch of the channel gateway.",
  "required": true
}
```

```task
{
  "id": "pil-02-t1",
  "prompt": "Describe a **BPMN model** of this process in numbered lines: *A customer emails a quote request. Sales checks whether the goods can be shipped. If not, sales emails a refusal. If yes, sales prepares a quote and, at the same time, operations checks vessel space; when both are done, sales emails the quote. If the customer doesn't reply within 7 days, sales follows up by phone.* Name the **element type** at the start of each line (Start event, Task, Exclusive gateway, Parallel gateway, Intermediate timer event, Message flow, End event).",
  "minutes": 12,
  "rows": 12,
  "placeholder": "1. Start event (message): quote request received from customer\n2. Task (Sales): ...",
  "rules": [
    { "label": "Starts with a start event", "pattern": "start event" },
    { "label": "Has at least one end event", "pattern": "end event" },
    { "label": "An exclusive gateway for 'can it be shipped?'", "pattern": "exclusive gateway" },
    { "label": "A parallel gateway for the quote and the space check", "pattern": "parallel gateway", "min": 1 },
    { "label": "A timer event for the 7 days", "pattern": "timer" },
    { "label": "A message flow to or from the customer", "pattern": "message" },
    { "label": "At least eight numbered lines", "pattern": "^\\s*\\d+[.)]\\s+\\S", "min": 8 }
  ],
  "sample": "1. Start event (message): quote request received from customer by email.\n2. Task (Sales): check whether the goods can be shipped.\n3. Exclusive gateway: can it be shipped? No → 4; Yes → 6.\n4. Task (Sales): email refusal to customer (message flow to Customer pool).\n5. End event: request refused.\n6. Parallel gateway (split): both 7 and 8 start.\n7. Task (Sales): prepare quote.\n8. Task (Operations): check vessel space.\n9. Parallel gateway (join): wait until 7 and 8 are both done.\n10. Task (Sales): email quote to customer (message flow to Customer pool).\n11. Event-based choice: customer reply received (message event) → 13; Intermediate timer event: 7 days pass with no reply → 12.\n12. Task (Sales): follow up by phone.\n13. End event: quote sent and followed up.",
  "note": "The parallel join (line 9) is the detail most people miss: without it, the quote could be emailed before operations has confirmed the space.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "How should communication between Harbourline and Nigeria Customs be shown?",
    "options": ["A sequence flow (solid arrow) between lanes", "A message flow (dashed arrow) between pools", "A gateway", "It shouldn't be shown"],
    "answer": 1,
    "explanation": "Separate organisations get separate pools, connected by message flows."
  },
  {
    "prompt": "Which gateway means 'all paths happen at the same time'?",
    "options": ["Exclusive (✕)", "Parallel (+)", "Inclusive (○)", "None"],
    "answer": 1,
    "explanation": "A matching parallel gateway later waits for all of them to finish."
  },
  {
    "prompt": "Why model the waits with intermediate events?",
    "options": ["They look nice", "In improvement work, waiting is usually where most of the time goes, so it must be visible", "BPMN requires one per diagram", "To replace tasks"],
    "answer": 1,
    "explanation": "A model without the waits hides the problem."
  }
]
```
