---
title: Measuring flow and quality
minutes: 20
summary: Measure how smoothly work moves through the team with cycle time, throughput, commitment reliability and bug trends, and use the numbers to start improvement, not blame.
---

## The problem

Velocity says how much the kiosk app team finishes. It doesn't say how **smoothly**. Two teams with the same velocity can be very different: one finishes stories steadily through the sprint; the other starts everything on day one and finishes it all in a panic on the last afternoon, with bugs to show for it.

The retrospective after sprint 6 is coming up. The scrum master asks the BA to bring some numbers, so the conversation is about evidence rather than feelings. Which numbers help, and which ones do harm?

## The concept

### Flow and quality measures

| Measure | Definition | Tells you |
| :-- | :-- | :-- |
| **Cycle time** | days from started to done, per item | how long work takes once it begins |
| **Throughput** | items finished per sprint or per week | the team's output, without points |
| **Work in progress (WIP)** | items started but not done | how much is juggled at once |
| **Commitment reliability** | points done ÷ points committed, per sprint | how predictable sprint planning is |
| **Escaped and found bugs** | bugs logged per sprint, and how long they take to fix | quality |

### Little's law

For a steady team, **average cycle time = average WIP ÷ throughput**. Starting more work at once doesn't finish more; it makes everything take longer. That's why many teams set a WIP limit, such as "no more than three stories in progress".

![Two teams that each finish one item a day. Team A has 3 items in progress, so each takes about 3 days; Team B has 6, so each takes about 6 days.](/images/courses/agile-ba/littles-law.svg "Little's law: same output, more work in progress, longer waits.")

### Use measures for learning, never for ranking

These measures describe the **system** the team works in, not individuals. Compare a team with its own past, never with another team, and never use velocity or cycle time to judge people. The moment numbers are used to blame, people game them: stories get split to inflate throughput, or estimates creep up to inflate velocity.

## Example

The kiosk app team's commitment reliability:

| Sprint | Committed | Done | Reliability |
| :-- | --: | --: | --: |
| 1 | 16 | 16 | 100% |
| 2 | 19 | 17 | 89% |
| 3 | 20 | 20 | 100% |
| 4 | 23 | 21 | 91% |
| 5 | 21 | 18 | ? |
| 6 | 24 | 24 | 100% |

Reliability around 90% is healthy: a team that always hits 100% is probably committing too little. But read it alongside the bugs. Sprint 6 hit 100% while logging 5 bugs, so the team may be finishing stories by passing problems on.

## Walkthrough

1. Calculate cycle time for every Done story, then the average (the first task below).
2. Calculate commitment reliability for each sprint, using `committed_points` from `sprints.csv`.
3. Count bugs per sprint, and their average cycle time. Are bugs taking longer to fix than stories take to build?
4. Prepare three observations for the retrospective, each with a number, a possible cause and a question for the team (the task below).

## Practice

```answer
{
  "id": "aba-08-p1",
  "prompt": "What is the average **cycle time** in days (done_date − started_date) for **Done stories**? One decimal place.",
  "answer": 3.2,
  "format": "number",
  "dataset": "agile",
  "files": ["backlog"],
  "verify": "SELECT ROUND(AVG(julianday(done_date) - julianday(started_date)), 1) FROM backlog WHERE status = 'Done' AND type = 'Story'",
  "hint": "Filter to type = Story and status = Done.",
  "required": true
}
```

```answer
{
  "id": "aba-08-p2",
  "prompt": "What was **sprint 5**'s commitment reliability (points done ÷ points committed)? One decimal place.",
  "answer": 85.7,
  "format": "percent",
  "dataset": "agile",
  "files": ["backlog", "sprints"],
  "verify": "SELECT ROUND(100.0 * (SELECT SUM(points) FROM backlog WHERE status = 'Done' AND sprint = 5) / (SELECT committed_points FROM sprints WHERE sprint = 5), 1)",
  "hint": "Done points in sprint 5 ÷ committed_points for sprint 5.",
  "required": true
}
```

```answer
{
  "id": "aba-08-p3",
  "prompt": "What is the average cycle time in days for **Done bugs**? One decimal place.",
  "answer": 4.6,
  "format": "number",
  "dataset": "agile",
  "files": ["backlog"],
  "verify": "SELECT ROUND(AVG(julianday(done_date) - julianday(started_date)), 1) FROM backlog WHERE status = 'Done' AND type = 'Bug'",
  "hint": "The same calculation, for type = Bug.",
  "explanation": "Bugs take longer to fix (4.6 days) than stories take to build (3.2), largely because some wait for the next sprint. That's a cost the velocity figure doesn't show.",
  "required": true
}
```

```task
{
  "id": "aba-08-t1",
  "prompt": "Write **three observations** for the sprint 6 retrospective, one per line. Each should give a **number** from the data, a **possible cause**, and end with a **question** for the team. Don't name or blame individuals.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "- Bugs rose from 3 in sprints 1–3 to 13 in sprints 4–6, possibly because ... What ...?",
  "rules": [
    { "label": "Three observations, each a line ending with a question mark", "pattern": "\\?\\s*$", "min": 3 },
    { "label": "Each includes a number", "pattern": "^[^\\n]*\\d[^\\n]*\\?\\s*$", "min": 3 },
    { "label": "Suggests causes (because, possibly, may, might, could)", "pattern": "because|possibly|may |might|could|perhaps|likely", "min": 2 },
    { "label": "No blame words (fault, lazy, blame, careless)", "pattern": "fault|lazy|blame|careless|incompetent", "absent": true }
  ],
  "sample": "- Bugs rose from 3 in sprints 1–3 to 13 in sprints 4–6, possibly because payments are harder to test and stories reached the sprint before edge cases were known. What would help us catch these before the sprint starts?\n- Bugs take 4.6 days on average to fix, against 3.2 for stories, perhaps because several wait for the next sprint. Should we keep some capacity free for bugs each sprint?\n- Sprint 5 delivered 85.7% of its commitment while the others were close to 100%, which may be because a 3-point story (Order status list) carried over into sprint 6. How could we spot a story at risk earlier in the sprint?",
  "note": "Each observation opens a conversation rather than closing one. The team knows the causes better than the numbers do; the numbers just make sure the conversation is about the right things.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A team starts every story on the first day of the sprint. What usually happens to cycle time?",
    "options": ["It falls", "It rises: more work in progress means everything takes longer", "No change", "It becomes zero"],
    "answer": 1,
    "explanation": "Little's law: cycle time = WIP ÷ throughput."
  },
  {
    "prompt": "A manager wants to rank developers by the story points they complete. What's the risk?",
    "options": ["None", "People will game the measure (inflated estimates, split stories) and collaboration suffers", "It's too much work", "Points can't be counted"],
    "answer": 1,
    "explanation": "Team measures describe the system; using them to judge individuals destroys their usefulness."
  },
  {
    "prompt": "A team hits 100% of its commitment every sprint. What might that suggest?",
    "options": ["Perfection", "It may be committing too little, or calling items done before they're really done", "Nothing", "It should commit to less"],
    "answer": 1,
    "explanation": "Read reliability alongside quality measures."
  }
]
```
