---
title: The brief and the plan
minutes: 25
summary: Meet Shieldline Insurance, turn a managing director's frustration into a problem statement, scope and plan, agree the definitions, and map the stakeholders you'll need on side.
---

## The problem

This is the capstone of the Business Analyst track. There's nothing new to learn here. Instead you'll do the whole job a junior business analyst is hired for, from a vague request to a recommendation the board can approve.

The company is **Shieldline Insurance**, a motor insurer with branches in Lagos, Abuja, Port Harcourt, Ibadan and Kano. Its managing director has sent you this:

> "Our motor claims take far too long. Customers are leaving us, complaints are piling up and the regulator has started asking questions. In April, Lagos tried some changes to the claims process. IT wants us to buy a new claims system for ₦280 million instead. I need to know what's really wrong, whether the Lagos changes worked, and what we should do. The board meets in six weeks."

Notice what the brief contains: a symptom ("too long"), two consequences (customers leaving, complaints), one experiment (Lagos) and one solution already on the table (a new system). A BA's first job is to slow down and frame the problem before anyone buys anything.

## The concept

### The arc of a BA project

| Stage | Output | Lesson |
| :-- | :-- | :-- |
| 1. Brief and plan | Problem statement, scope, definitions, stakeholders | 1 |
| 2. Current state | The problem in numbers | 2 |
| 3. Process | The real process, mapped from the event log | 3 |
| 4. Root causes | Why claims are slow, with evidence | 4 |
| 5. The pilot | Whether the Lagos changes worked | 5 |
| 6. Options and business case | Costs, benefits and a recommendation | 6 |
| 7. Requirements and readiness | User stories, acceptance criteria, test results and a go/no-go | 7 |
| 8. Present | A decision paper the board can approve | 8 |

![The eight stages of a business analysis project, and a typical brief taken apart into symptom, consequences, experiment and proposed solution](/images/courses/ba-capstone/ba-arc.svg "Eight stages, and what a typical brief is made of.")

Use the tools you know: SQL, Excel or Power BI. The lessons show SQL, which answers every question here; the same steps work as pivot tables or DAX measures.

### A problem statement, not a solution

A good problem statement says **who** is affected, **what** happens, **how much** (with a number), and **why it matters** to the business. It doesn't name a solution: "We need a new claims system" is a solution, and it closes off the options before you know the cause.

### Scope

Say what's in and what's out. In: motor claims from submission to payment, the five regions, July 2025 to June 2026. Out: underwriting and pricing, non-motor products, and choosing a system vendor.

### Definitions before numbers

| Term | Definition |
| :-- | :-- |
| Days to settle | `closed_at − submitted_at` in days, for **paid** claims |
| Baseline | Claims submitted from 1 July 2025 to 31 March 2026 |
| Pilot | Lagos claims submitted from 1 April 2026 |
| Comparison group | Other regions' claims submitted from 1 April 2026 |

Write these down before you calculate anything. Without them, two analysts get two different "average days" from the same data and the board stops trusting both.

![A four-part problem statement, in and out of scope, definitions written first, and an influence and interest grid for stakeholders](/images/courses/ba-capstone/problem-scope.svg "Problem statement, scope, definitions and stakeholders.")

### Stakeholders

Plot each stakeholder by **influence** and **interest**. Manage closely those high on both, keep satisfied those with high influence but less interest, and keep informed those with high interest but little influence.

## Example

The data has seven files:

| File | What it is |
| :-- | :-- |
| `claims.csv` | One row per motor claim: region, channel, type, amount, outcome, dates |
| `events.csv` | The claims system's event log: every step of every claim, with a timestamp and team |
| `complaints.csv` | Complaints linked to claims, with a reason |
| `renewals.csv` | Policies due for renewal, whether they renewed, and the claim if there was one |
| `interviews.csv` | Notes from ten stakeholder interviews |
| `options.csv` | The options on the table, with costs |
| `uat.csv` | User acceptance test results for the Lagos changes |

A first look at the baseline:

```sql
SELECT COUNT(*) AS claims,
       SUM(outcome = 'Paid') AS paid,
       ROUND(AVG(CASE WHEN outcome = 'Paid' THEN julianday(closed_at) - julianday(submitted_at) END), 1) AS avg_days_to_settle,
       ROUND(100.0 * SUM(outcome = 'Paid' AND julianday(closed_at) - julianday(submitted_at) > 30) / SUM(outcome = 'Paid'), 1) AS pct_paid_over_30_days
FROM claims
WHERE submitted_at < '2026-04-01';
```

```text
claims  paid  avg_days_to_settle  pct_paid_over_30_days
  2239  1904                25.2                   22.9
```

And the stakeholders, by influence and interest:

```sql
SELECT influence, interest, GROUP_CONCAT(role, '; ') AS stakeholders
FROM interviews
GROUP BY influence, interest
ORDER BY influence, interest;
```

```text
influence  interest  stakeholders
High       High      Managing director; Head of claims
High       Low       Compliance officer
High       Medium    Agency manager; Finance controller; Head of IT
Low        High      Claims officer; Customer (accident damage)
Medium     High      Claims manager, Lagos; Senior assessor
```

The high-influence, high-interest people are the managing director and the head of claims: manage them closely. The finance controller, head of IT, agency manager and compliance officer have high influence but less day-to-day interest: keep them satisfied, and expect objections. The finance controller's fraud worry and the head of IT's preference for a new system will both matter later.

## Walkthrough

1. Download the dataset below and load it into your tool.
2. Run the two queries above, or build the same in Excel or Power BI.
3. Read all ten interviews. For each, write one line: what they care about, and what they'd need to support a change.
4. Write your scope (in and out) and your definitions.
5. Write the problem statement (the task below).

## Practice

```dataset
{"dataset": "claims", "files": ["claims", "events", "complaints", "renewals", "interviews", "options", "uat"]}
```

```answer
{
  "id": "bac-01-p1",
  "prompt": "In the **baseline**, what percentage of **paid** claims took **more than 30 days** to settle? One decimal place.",
  "answer": 22.9,
  "format": "percent",
  "dataset": "claims",
  "files": ["claims"],
  "verify": "SELECT ROUND(100.0 * SUM(julianday(closed_at) - julianday(submitted_at) > 30) / COUNT(*), 1) FROM claims WHERE outcome = 'Paid' AND submitted_at < '2026-04-01'",
  "hint": "Paid claims submitted before 1 April 2026; the share with closed_at − submitted_at over 30 days.",
  "required": true
}
```

```task
{
  "id": "bac-01-t1",
  "prompt": "Write Shieldline's **problem statement** (40 to 100 words): **who** is affected, **what** happens, **how much** (with numbers), and **why it matters**. Don't name a solution.",
  "minutes": 6,
  "rows": 5,
  "placeholder": "Motor claimants ...",
  "rules": [
    { "label": "Names who is affected (customers, claimants, policyholders)", "pattern": "customer|claimant|policyholder" },
    { "label": "Uses at least two numbers", "pattern": "\\d+(\\.\\d+)?", "min": 2 },
    { "label": "Says why it matters (renewals, complaints, regulator, cost)", "pattern": "renew|complain|regulat|cost|leav|lose|lost" },
    { "label": "Doesn't jump to a solution", "pattern": "new (claims )?system|we (need|should)|buy|implement", "absent": true },
    { "label": "Between 40 and 100 words", "minWords": 40, "maxWords": 100 }
  ],
  "sample": "Shieldline's motor claimants wait an average of 25 days for a paid claim to be settled, and almost a quarter (22.9%) wait more than 30 days. Slow claims generate complaints, which have started to concern the regulator, and customers whose claims are slow appear less likely to renew their policies. The problem affects every region and every channel, and it costs Shieldline customers it has already paid to win.",
  "note": "\"Appear less likely to renew\" is careful wording: at this stage you haven't measured it yet. A problem statement can be confident about what you know and cautious about what you suspect.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The brief says IT wants a new claims system. What should the BA do first?",
    "options": ["Write requirements for the system", "Frame the problem and find its causes before choosing a solution", "Get quotes from vendors", "Reject the idea"],
    "answer": 1,
    "explanation": "A solution chosen before the cause is known often fixes the wrong thing."
  },
  {
    "prompt": "Why agree definitions such as \"days to settle\" before analysing?",
    "options": ["It's a formality", "So every number is calculated the same way and can be trusted", "To make the report longer", "Because the board asks"],
    "answer": 1,
    "explanation": "Different definitions give different answers from the same data."
  },
  {
    "prompt": "A stakeholder has high influence but little day-to-day interest. How should you manage them?",
    "options": ["Ignore them", "Keep them satisfied, and find out early what would make them object", "Manage them closely every day", "Just keep them informed"],
    "answer": 1,
    "explanation": "They can stop a change, so learn their concerns early."
  }
]
```
