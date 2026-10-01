---
title: Bottlenecks and flow
minutes: 20
summary: Find the constraint that limits a process, use Little's law to connect work in progress, throughput and lead time, and see why improving anything except the bottleneck changes little.
---

## The problem

Harbourline's operations director has a budget for one improvement this quarter. The documentation team wants a faster scanner. The customs brokers want a second laptop. The haulage team wants another truck. All three would make their own step quicker. Which would get containers out of the port sooner?

Probably none of them. A process can only move as fast as its slowest point, its **bottleneck** or **constraint**, and time saved anywhere else just means items reach the bottleneck sooner and wait there instead. Before spending money on speed, find the constraint.

## The concept

**The theory of constraints in five steps**

1. **Identify** the constraint: where does work pile up? Where are the longest waits?
2. **Exploit** it: make sure the constraint never wastes time (no idle inspection slots, no files arriving incomplete).
3. **Subordinate** everything else to it: schedule the other steps to feed it smoothly, not to look busy.
4. **Elevate** it: if it's still the limit, add capacity there (more inspection slots, earlier booking).
5. **Repeat**: once it's no longer the constraint, something else will be. Find it.

**Signs of a bottleneck in data**

- The longest average **wait** sits just before it.
- Waits before it get longer when more work arrives at once.
- Cases that skip it finish much faster.

**Little's law**

For a stable process, over time:

> **Work in progress (WIP) = throughput × lead time**

If 2.8 clearances arrive a day and each spends 8.6 days at port, about 24 clearances are at the port at any moment. Turn it around: to cut lead time without cutting throughput, you must cut the work in progress, which means removing waiting, not hurrying the work.

## Example

Harbourline's clearances, before the pilot, by customs channel:

| Channel | What happens | Days at port |
| :-- | :-- | --: |
| Green | no inspection | 7.6 |
| Yellow | document review by customs | 8.7 |
| Red | physical inspection | 9.3 |

Red cases spend about 1.7 days longer at port than Green ones, and the wait before physical inspection (42 hours on average) grows when several Red containers arrive in the same few days. The customs inspection queue behaves like a bottleneck for the 4 in 10 containers that go through it. But look back at the value stream: the waits for **corrected documents** and **duty payment** are as long or longer, and they affect every channel. There's more than one constraint, and some of them sit with Harbourline's own customers.

## Walkthrough

1. Calculate days at port by customs channel, before the pilot.
2. Calculate the arrival rate (clearances per day) for January to April, and apply Little's law (the first task below).
3. Look at the wait before physical inspection over time. Is it longer in weeks with more Red arrivals?
4. Rank the constraints: inspection queue (controlled by customs), corrected documents and duty payment (controlled by customers, but influenced by Harbourline).
5. For each, ask what "exploit" would mean: for example, having every Red file complete and paid **before** its inspection slot comes up.

## Practice

```answer
{
  "id": "pil-06-p1",
  "prompt": "Before the pilot, how many more **days at port** did **Red** channel clearances spend than **Green** ones, on average? Two decimal places.",
  "answer": 1.74,
  "tolerance": 0.06,
  "format": "number",
  "dataset": "process",
  "files": ["cases"],
  "verify": "SELECT ROUND(AVG(CASE WHEN customs_channel = 'Red' THEN julianday(released_datetime) - julianday(arrival_datetime) END) - AVG(CASE WHEN customs_channel = 'Green' THEN julianday(released_datetime) - julianday(arrival_datetime) END), 2) FROM cases WHERE checklist_pilot = 'No'",
  "hint": "Average days at port for Red cases minus the average for Green cases, both before the pilot.",
  "required": true
}
```

```answer
{
  "id": "pil-06-p2",
  "prompt": "Using **Little's law**, about how many clearances were at the port at any one time before the pilot? Use 2.82 arrivals a day and the pre-pilot average of 8.63 days at port. One decimal place.",
  "answer": 24.3,
  "format": "number",
  "hint": "WIP = throughput × lead time = 2.82 × 8.63.",
  "explanation": "About 24 clearances (roughly 49 containers) sitting at the port at any moment. Cut the average stay to 6 days at the same arrival rate and that falls to about 17.",
  "required": true
}
```

```task
{
  "id": "pil-06-t1",
  "prompt": "The operations director can fund **one** of: a faster scanner for the documentation team, a second laptop for the customs brokers, or another truck for haulage. Write a short recommendation (60 to 150 words) explaining why **none of them** would shorten days at port much, and what you'd do instead, using the idea of a constraint and at least **two numbers** from the data.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "None of the three would ...",
  "rules": [
    { "label": "Uses the idea of a bottleneck or constraint", "pattern": "bottleneck|constraint" },
    { "label": "At least two numbers", "pattern": "\\d+(\\.\\d+)?", "min": 2 },
    { "label": "Mentions waiting", "pattern": "wait" },
    { "label": "Proposes something aimed at documents, payment or inspection", "pattern": "document|checklist|payment|duty|inspection" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "None of the three would shorten days at port much, because none of them is at a constraint. The documentation, declaration and haulage steps take about 2, 1.5 and 17 hours of work, but a container spends about 207 hours at port, and most of that is waiting: about 72 hours for corrected documents when files are incomplete, 46 hours for duty payment and 42 hours in the inspection queue for Red cases. A faster scanner would just get files to those waits sooner. Instead, I'd spend the budget on getting documents complete and duty paid before the vessel arrives, so that files are ready the moment an inspection slot or release is available.",
  "note": "\"Exploit the constraint\" in practice: make sure nothing the constraint needs is missing when it's the item's turn.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "You halve the time of a step that isn't the bottleneck. What usually happens to lead time?",
    "options": ["It halves", "Very little changes: items just reach the bottleneck sooner and wait there", "It doubles", "It becomes zero"],
    "answer": 1,
    "explanation": "Only improvements at the constraint speed up the whole process."
  },
  {
    "prompt": "Throughput is 5 cases a day and lead time is 4 days. How many cases are in progress, on average?",
    "options": ["1.25", "20", "9", "0.8"],
    "answer": 1,
    "explanation": "WIP = throughput × lead time = 5 × 4."
  },
  {
    "prompt": "What does 'exploit the constraint' mean?",
    "options": ["Overwork the people there", "Make sure the constraint never wastes time, for example by never receiving incomplete work", "Remove the constraint step", "Add more steps"],
    "answer": 1,
    "explanation": "Protect the constraint's time before paying for more capacity."
  }
]
```
