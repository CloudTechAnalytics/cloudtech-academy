---
title: Pilot, measure and sustain
minutes: 25
summary: Run a change as a PDCA pilot, judge it with a run chart and a fair before-and-after comparison, and put controls in place so the improvement doesn't quietly slip back.
---

## The problem

From 1 May 2026, Harbourline checked every customer's documents **before** the vessel arrived, using a checklist for each importer type. Two months later, the operations director asks: "Did it work? Should we keep it?"

The tempting answer is to compare the average before and after and declare victory. But averages can mislead. Was May just a quieter month? Did the pilot happen to get fewer Red-channel inspections? Did something else change at the same time? And even if it worked, how do you stop the team drifting back to the old way once the attention moves elsewhere? Most improvements fade within a year, not because they didn't work, but because nobody made them stick.

## The concept

### PDCA

**Plan** the change and its measures. **Do** it on a small scale. **Check** the results against the target. **Act**: adopt it, adapt it or drop it, then plan the next cycle. PDCA is the small-scale version of DMAIC, repeated.

### Judging a pilot fairly

- **Plot a run chart**: the measure week by week, with the change date marked. A real improvement shows as a sustained shift, not one good week.
- **Compare like with like**: check that the mix is similar before and after (here, the share of Red-channel clearances and importer types). If the pilot period happened to get easier cases, the averages flatter it.
- **Check measures the change shouldn't affect**: if they also improved, something else is going on (a quieter port, a new customs procedure).
- **Compare with a group not in the pilot** if you can. Harbourline put every customer in the pilot, which makes the run chart and the mix checks more important.

### Sustain: the control plan

| Control | Harbourline example |
| :-- | :-- |
| **Standard work** | the pre-arrival checklist written down, by importer type, in the booking procedure |
| **Ownership** | the documentation lead owns "documents complete on arrival" |
| **Visual management** | a weekly board: clearances at port, days at port, files still incomplete |
| **Control limits** | if weekly days at port goes above an agreed limit, investigate that week |
| **Review** | a monthly 30-minute review of the measures, with actions |

## Example

Average days at port by arrival week, before and after the pilot started on 1 May:

| Weeks | Range of weekly averages |
| :-- | :-- |
| January to April (16 full weeks) | 7.8 to 9.6 days |
| May and June (8 full weeks) | 5.6 to 7.0 days |

Every pilot week is below every pre-pilot week. That's a sustained shift, not luck. The mix checks pass too: Red-channel clearances were 44% before and 43% during the pilot, and every channel improved by about two days. And the wait for **duty payment confirmation**, which the checklist doesn't touch, stayed the same: about 46 hours before and during. That's good evidence that the improvement came from the documents, not from something else changing at the port.

## Walkthrough

1. Plot days at port by arrival week, and mark 1 May.
2. Compare the before and after averages for days at port, documents complete on arrival and demurrage per container.
3. Check the mix: Red-channel share and importer types, before and after.
4. Check a measure the pilot shouldn't affect: the wait before *Confirm duty payment*.
5. Write the control plan (the task below), and agree the next PDCA cycle (duty payment reference, from lesson 8).

## Practice

```answer
{
  "id": "pil-09-p1",
  "prompt": "During the pilot (checklist_pilot = Yes), what was the average number of **days at port**? Two decimal places.",
  "answer": 6.38,
  "tolerance": 0.06,
  "format": "number",
  "dataset": "process",
  "files": ["cases"],
  "verify": "SELECT ROUND(AVG(julianday(released_datetime) - julianday(arrival_datetime)), 2) FROM cases WHERE checklist_pilot = 'Yes'",
  "hint": "Average released − arrival for pilot cases.",
  "explanation": "6.38 days, down from 8.63: about 2.25 days less at port per clearance.",
  "required": true
}
```

```answer
{
  "id": "pil-09-p2",
  "prompt": "During the pilot, what was the average **demurrage per container**? (A rounded figure is fine.)",
  "answer": 174164,
  "format": "naira",
  "dataset": "process",
  "files": ["cases"],
  "verify": "SELECT ROUND(SUM(demurrage_ngn) * 1.0 / SUM(containers)) FROM cases WHERE checklist_pilot = 'Yes'",
  "hint": "Sum of demurrage ÷ sum of containers, for pilot cases.",
  "explanation": "About ₦174,000, against ₦277,000 before: a saving of about ₦103,000 per container, from a checklist and a change of timing.",
  "required": true
}
```

```answer
{
  "id": "pil-09-p3",
  "prompt": "What share of pilot clearances had **complete documents on arrival**? One decimal place.",
  "answer": 85.3,
  "format": "percent",
  "dataset": "process",
  "files": ["cases"],
  "verify": "SELECT ROUND(100.0 * SUM(docs_complete_on_arrival = 'Yes') / COUNT(*), 1) FROM cases WHERE checklist_pilot = 'Yes'",
  "hint": "Count docs_complete_on_arrival = Yes ÷ all pilot cases.",
  "explanation": "85.3%, up from 66.1%: the target from lesson 8 was met.",
  "required": true
}
```

```task
{
  "id": "pil-09-t1",
  "prompt": "Write the **control plan** that keeps the pre-arrival checklist working after the pilot. One line each for **standard work**, **owner**, **measure** (with a target), **visual management**, and **review** (with how often), each starting with its heading.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "Standard work: ...\nOwner: ...",
  "rules": [
    { "label": "Standard work line", "pattern": "^\\s*[-*]?\\s*standard work\\s*:" },
    { "label": "Owner line naming a role", "pattern": "^\\s*[-*]?\\s*owner\\s*:[^\\n]*(lead|manager|head|officer|supervisor|director)" },
    { "label": "Measure line with a number", "pattern": "^\\s*[-*]?\\s*measures?\\s*:[^\\n]*\\d" },
    { "label": "Visual management line", "pattern": "^\\s*[-*]?\\s*visual( management)?\\s*:" },
    { "label": "Review line with a frequency", "pattern": "^\\s*[-*]?\\s*review\\s*:[^\\n]*(daily|weekly|monthly|quarterly|every|each)" }
  ],
  "sample": "Standard work: the pre-arrival checklist for each importer type is part of the booking procedure; no shipment is confirmed until the checklist is sent to the customer.\nOwner: the documentation team lead owns documents complete on arrival and days at port.\nMeasure: documents complete on arrival at least 85%, and weekly average days at port under 7, tracked from the clearance log.\nVisual management: a board in the clearing office showing this week's clearances at port, days at port and files still incomplete, updated every morning.\nReview: a 30-minute review every month with the operations director; any week above 7.5 days at port is investigated within a week.",
  "note": "The owner and the review are the parts most often missing. Without them, the checklist quietly becomes optional on busy weeks, and in a year nobody remembers why days at port crept back up.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why plot a run chart instead of only comparing two averages?",
    "options": ["Charts look better", "It shows whether the change is a sustained shift or one good week, and whether something else changed at the same time", "Averages can't be calculated", "It's required by PDCA"],
    "answer": 1,
    "explanation": "A shift that holds week after week is far stronger evidence."
  },
  {
    "prompt": "The wait for duty payment stayed the same during the pilot. Why is that useful?",
    "options": ["It isn't", "The checklist shouldn't affect that wait, so its staying the same suggests the improvement came from the checklist, not from a general change at the port", "It shows the pilot failed", "Duty payment is the bottleneck"],
    "answer": 1,
    "explanation": "A measure that should be unaffected acts as a check."
  },
  {
    "prompt": "What is the most common reason improvements fade?",
    "options": ["They never worked", "Nobody owns the measure, and the new way isn't built into standard work or reviewed", "Customers complain", "The data is wrong"],
    "answer": 1,
    "explanation": "A control plan makes the improvement the normal way of working."
  }
]
```
