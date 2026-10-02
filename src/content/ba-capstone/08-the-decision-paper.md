---
title: "The decision paper"
minutes: 25
summary: Bring the analysis together into a decision paper the board can approve. Lead with the recommendation, back it with evidence, state the conditions and risks, prepare for the hard questions, and plan your final project.
---

## The problem

The board meets in a week. Its members won't read 40 slides. They need one short paper that tells them what to decide, why, what it costs, what could go wrong and how they'll know it worked. Everything you've done in this capstone feeds that paper. This lesson shapes it, and your final project delivers it.

## The concept

**Answer first**

Start with the decision you're asking for, in one sentence, then the reasons. The board can stop reading at any point and still know what you recommend.

**The shape of a decision paper**

| Section | Content | From |
| :-- | :-- | :-- |
| The decision | What you're asking the board to approve | lesson 6 |
| The problem | Days to settle, slow claims, complaints, lost renewals | lessons 1 and 2 |
| Why claims are slow | The four root causes, with evidence | lessons 3 and 4 |
| The evidence it works | The pilot, compared with the other regions | lesson 5 |
| Options | Costs, benefits, NPV and payback, and why not the others | lesson 6 |
| Conditions and risks | UAT fixes, controls, the audit, Port Harcourt's capacity | lesson 7 |
| Measures | KPIs, baselines and targets, and when you'll report | lesson 7 |

**One chart that carries the argument**

Choose the chart that makes the case on its own. Here it's monthly days to settle for Lagos against the other regions: the lines run together for nine months, then Lagos drops when the pilot starts.

**Prepare for the hard questions**

Every stakeholder from lesson 1 will read the paper through their own concern. The head of IT will ask why not the new system, the finance controller about fraud, and the agency manager about agents' workload. Write each likely question with a short, evidenced answer.

## Example

The data behind the chart:

```sql
SELECT substr(submitted_at, 1, 7) AS month,
       ROUND(AVG(CASE WHEN region = 'Lagos' THEN julianday(closed_at) - julianday(submitted_at) END), 1) AS lagos,
       ROUND(AVG(CASE WHEN region <> 'Lagos' THEN julianday(closed_at) - julianday(submitted_at) END), 1) AS other_regions
FROM claims
WHERE outcome = 'Paid'
GROUP BY month
ORDER BY month;
```

```text
month    lagos  other_regions
2025-07   24.4           24.7
2025-08   23.5           24.9
2025-09   23.6           26.5
2025-10   24.9           25.3
2025-11   24.8           25.4
2025-12   26.8           25.7
2026-01   24.5           24.4
2026-02   25.5           27.1
2026-03   26.5           25.2
2026-04   16.7           26.9
2026-05   17.9           26.6
2026-06   18.3           25.8
```

The two lines move together until March, then separate. That's the strongest single piece of evidence you have. Notice too that the Lagos figure creeps up from April to June. It could be noise, or the early enthusiasm wearing off. Say you'll watch it.

Answers to the hard questions:

| Question | Answer |
| :-- | :-- |
| Head of IT: "Why not the new system?" | It costs ₦280m and loses money over three years even at twice the pilot's benefit. The pilot fixed the main causes without it. We'd revisit it when the current system reaches the end of its support life. |
| Finance controller: "Who checks the assessors?" | A ₦1m limit, no theft or third-party claims, a different assessor from the one who assessed, cancellation if the amount changes, and a weekly audit report. Rollout waits for UAT-14 to be fixed. |
| Agency manager: "Won't the checklist slow agents down?" | It takes minutes at submission and saves days later; agent claims needed documents chased 62% of the time. |
| Compliance: "Does the SMS meet data protection rules?" | Not yet: UAT-20 must be fixed so that opted-out customers get no messages. |

## Walkthrough

1. Build the chart, with a title that states the finding.
2. Write the decision paper on two pages at most, in the order above.
3. Write the hard questions and answers for every stakeholder in `interviews.csv`.
4. Read it as the managing director would. Can you find the decision, the cost and the risk in 30 seconds?
5. Open the project brief on the course page and plan your submission.

## Practice

```dataset
{"dataset": "claims", "files": ["claims", "events", "complaints", "renewals", "interviews", "options", "uat"]}
```

```answer
{
  "id": "bac-08-p1",
  "prompt": "What was the average days to settle for **Lagos** paid claims submitted in **June 2026**? One decimal place.",
  "answer": 18.3,
  "format": "number",
  "dataset": "claims",
  "files": ["claims"],
  "verify": "SELECT ROUND(AVG(julianday(closed_at) - julianday(submitted_at)), 1) FROM claims WHERE outcome = 'Paid' AND region = 'Lagos' AND submitted_at LIKE '2026-06%'",
  "hint": "The last row of the chart's data.",
  "required": true
}
```

```task
{
  "id": "bac-08-t1",
  "prompt": "Write the **executive summary** of the decision paper (120 to 220 words): the **decision** you're asking for first, the **problem** in numbers, the **causes**, the **pilot evidence** compared with other regions, the **financial case**, and the **conditions** before rollout.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "We ask the board to approve ...",
  "rules": [
    { "label": "Opens with the decision (approve, recommend, ask)", "pattern": "^[^.]{0,200}(approve|recommend|ask)" },
    { "label": "Uses numbers", "pattern": "\\d+(\\.\\d+)?", "min": 6 },
    { "label": "Names causes (documents, inspection, approval)", "pattern": "document|inspect|approv", "min": 2 },
    { "label": "Pilot compared with other regions", "pattern": "other regions|compared with|comparison" },
    { "label": "The financial case (NPV, payback, cost)", "pattern": "npv|payback|₦\\s*\\d" },
    { "label": "Conditions before rollout (UAT, defect, fix, control)", "pattern": "uat|defect|fix|control|condition" },
    { "label": "Between 120 and 220 words", "minWords": 120, "maxWords": 220 }
  ],
  "sample": "We ask the board to approve rolling out the Lagos claims changes to all five regions, at a cost of ₦42m plus ₦12m a year, once two test defects are fixed.\n\nMotor claims take 25.2 days on average to pay, and 22.9% take more than 30 days. Customers whose claims are slow renew at 63.8%, against 78.5% when claims are paid within 30 days, and 80% of complaints are about delay or hearing nothing. The causes are in the process, not the system: incomplete documents (62% of agent claims), a physical inspection for every claim, and managers approving only on Fridays.\n\nIn Lagos, a checklist, photo assessment for windscreens, assessor approval under ₦1m and SMS updates cut days to settle by 8.4 compared with the other regions over the same months, and halved complaints. Rolled out, we estimate ₦39.8m a year in retained renewals and saved work: a three-year NPV of ₦21.4m, with payback in 18 months. A new claims system (₦280m) doesn't pay back in three years.\n\nConditions: fix the approval control (UAT-14) and SMS opt-outs (UAT-20) before rollout, audit assessor approvals weekly, and add assessor capacity in Port Harcourt. We'll report days to settle monthly against the 25.2-day baseline.",
  "note": "The first sentence is the decision; everything after it is the reason to agree.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What should the first sentence of a decision paper be?",
    "options": ["The background", "The decision you're asking the board to make", "The method", "A thank-you"],
    "answer": 1,
    "explanation": "Answer first."
  },
  {
    "prompt": "Why prepare answers to each stakeholder's likely questions?",
    "options": ["To fill the appendix", "Because each reads the paper through their own concern, and an unanswered objection can stop the decision", "It's required", "To avoid the meeting"],
    "answer": 1,
    "explanation": "Anticipate objections with evidence."
  },
  {
    "prompt": "The pilot effect seems to fade slightly month by month. What should the paper do?",
    "options": ["Leave it out", "Mention it and say how it will be monitored", "Stop the rollout", "Average it away"],
    "answer": 1,
    "explanation": "Honest papers earn trust for the next decision."
  }
]
```
