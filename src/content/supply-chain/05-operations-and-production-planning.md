---
title: Operations and Production Planning
minutes: 25
summary: Plan capacity and schedules, apply lean thinking to remove waste, manage quality and find and manage bottlenecks.
---

## Capacity and scheduling

**Capacity** is the most a process can produce in a given time. **Demand** is what customers want. Planning matches the two.

*Utilisation = actual output ÷ capacity × 100%*

Example: a bakery can make 1,000 loaves a week and plans 900. Utilisation is 900 ÷ 1,000 = **90%**. Running near 100% leaves no room for breakdowns, rush orders or growth; running at 40% wastes money on idle equipment and staff. Many operations aim for a high but not total utilisation, often 80% to 90%.

When demand exceeds capacity you can:

- Add shifts, overtime or temporary staff.
- Outsource some work.
- Build stock ahead in quiet periods.
- Add equipment or space.
- Smooth demand through booking, pricing or promotions.

**Scheduling** decides **what is made, when and on which resource.** A good schedule respects capacity, due dates, material availability and set-up times. Group similar jobs to reduce changeovers, but do not make so much that you create unwanted stock. Update the schedule when plans change and tell everyone affected.

## Lean basics and waste

**Lean** is a way of working that focuses on **value** (what the customer will pay for) and removes **waste** (everything else). It began with Toyota and now applies in factories, warehouses, hospitals and offices.

The eight common wastes (remembered as TIMWOODS):

| Waste | Example |
| :-- | :-- |
| **T**ransport | Moving goods further or more often than needed |
| **I**nventory | Too much stock sitting idle |
| **M**otion | Workers walking and reaching unnecessarily |
| **W**aiting | Staff or machines idle waiting for materials or approvals |
| **O**verproduction | Making more than is ordered |
| **O**ver-processing | Doing more work than the customer needs |
| **D**efects | Rework, scrap and returns |
| **S**kills (unused) | Not using people's knowledge and ideas |

Basic lean tools: **5S** (sort, set in order, shine, standardise, sustain) for a tidy, safe workplace; **visual management** (boards and signs showing status); **standard work** (the best-known way, written down); **continuous improvement** (small regular improvements by everyone); and **pull** systems, where you make what has been used or ordered instead of what you guess.

## Quality management

Quality means meeting what the customer needs, consistently. Poor quality costs: scrap, rework, returns, warranty claims, lost customers and lost reputation.

- **Prevent, don't just inspect.** Fix the cause in the process instead of catching defects at the end.
- **Measure:** defect rate, first-pass yield, returns and complaints.
- **Find the root cause** with simple tools: the 5 Whys, a cause-and-effect (fishbone) diagram and Pareto charts showing the few causes behind most defects.
- **Use standards and checks** at critical points, and train staff.
- **Involve suppliers:** many defects start with bad inputs.

Example: a plant makes 2,000 units a week and **3%** are defective, each costing ₦1,500 to rework. Defects = 0.03 × 2,000 = 60 units; cost = 60 × 1,500 = **₦90,000 a week**, about ₦4.7 million a year. Halving the defect rate saves over ₦2 million a year, which pays for the improvement work.

## Bottlenecks

A **bottleneck** is the step with the least capacity. It limits the output of the whole process, no matter how fast the other steps are.

Example: a three-step process makes 120 units an hour at step A, 80 at step B and 100 at step C. The bottleneck is step B, so **the whole line produces 80 units an hour**. Speeding up A or C only builds a queue in front of B. An hour lost at B is an hour lost for the whole system.

The approach (from the Theory of Constraints):

1. **Identify** the bottleneck.
2. **Exploit** it: keep it busy, never starve it, avoid breakdowns and set-up delays.
3. **Subordinate** everything else to it: other steps match its pace.
4. **Elevate** it: add capacity at the bottleneck.
5. **Repeat:** a new bottleneck will appear elsewhere.

## Try it

```task
{
  "id": "scm-m05-t1",
  "prompt": "A process has three steps: **A makes 120 units an hour, B 80 and C 100**. Which step is the bottleneck, what is the output of the whole line, and what is the best first action to increase output? Explain in 40 to 90 words.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "The bottleneck is ...",
  "rules": [
    { "label": "Names step B as the bottleneck", "pattern": "\\bstep b\\b|\\bb\\b[^.]*bottleneck|bottleneck[^.]*\\bb\\b" },
    { "label": "States the output of 80 units an hour", "pattern": "\\b80\\b" },
    { "label": "Recommends improving or protecting B (not A or C)", "pattern": "increase|improve|add|protect|keep (it )?busy|exploit|capacity at b|speed up b|reduce (downtime|set-?up)" },
    { "label": "Says speeding up A or C does not help", "pattern": "a or c|a and c|other steps|queue|no benefit|does not help|won't help|waste" },
    { "label": "Between 40 and 90 words", "minWords": 40, "maxWords": 95 }
  ],
  "sample": "The bottleneck is step B, because it has the lowest capacity at 80 units an hour, so the whole line can make only 80 units an hour. The best first action is to increase B's capacity or keep it fully busy, for example by cutting breakdowns and set-up time and making sure it never waits for materials. Speeding up A or C would not help, because the extra output would only build a queue in front of B.",
  "required": true
}
```

```task
{
  "id": "scm-m05-t2",
  "prompt": "Read this: *\"At a printing shop, jobs wait two days for approval. Staff walk across the shop to fetch paper from a far store. They print 500 extra copies 'just in case' and throw many away. Three of every hundred jobs are reprinted because of mistakes.\"* Name **four wastes** from the eight and give one improvement for each. One per line.",
  "minutes": 12,
  "rows": 7,
  "placeholder": "Waiting - ... - Improvement: ...",
  "rules": [
    { "label": "Four lines", "minLines": 4 },
    { "label": "Names waiting", "pattern": "waiting|wait" },
    { "label": "Names motion or transport", "pattern": "motion|transport|walking|fetch" },
    { "label": "Names overproduction", "pattern": "overproduct|extra copies|too many" },
    { "label": "Names defects", "pattern": "defect|reprint|mistake|rework" },
    { "label": "Gives improvements", "pattern": "improve|fix|move|set|approve|check|standard|store|print only|same day|5s|train" }
  ],
  "sample": "Waiting - jobs wait two days for approval - Improvement: approve within a few hours with a clear checklist.\nMotion - staff walk to a far store for paper - Improvement: keep common paper next to the machines.\nOverproduction - printing 500 extra copies - Improvement: print only what is ordered.\nDefects - 3% of jobs are reprinted - Improvement: add a proof check before printing and train staff.",
  "required": true
}
```

```task
{
  "id": "scm-m05-t3",
  "prompt": "A plant makes **2,000 units a week**; **3%** are defective and each costs **₦1,500** to rework. Work out the weekly rework cost and the yearly cost (52 weeks). What would halving the defect rate save per year?",
  "minutes": 8,
  "rows": 6,
  "placeholder": "Defects per week = ...",
  "rules": [
    { "label": "60 defects a week", "pattern": "\\b60\\b" },
    { "label": "Weekly cost of ₦90,000", "pattern": "90,?000" },
    { "label": "Yearly cost of ₦4,680,000", "pattern": "4,?680,?000" },
    { "label": "Saving of ₦2,340,000", "pattern": "2,?340,?000" }
  ],
  "sample": "Defects per week = 0.03 x 2,000 = 60 units.\nWeekly rework cost = 60 x 1,500 = ₦90,000.\nYearly cost = 90,000 x 52 = ₦4,680,000.\nHalving the defect rate saves 4,680,000 / 2 = ₦2,340,000 a year.",
  "required": false
}
```

Next lesson: warehousing and distribution design.
