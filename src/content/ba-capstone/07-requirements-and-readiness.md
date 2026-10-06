---
title: Requirements and readiness
minutes: 25
summary: Turn the root causes into requirements, business rules and user stories with acceptance criteria. Define the measures that will prove the change worked, then read the acceptance test results and make an honest go or no-go call.
---

## The problem

The Lagos pilot was run with workarounds: a checklist app built quickly, and assessors approving claims under an informal rule. To roll it out to five regions, it needs proper requirements, controls the finance controller will accept, and tested software. User acceptance testing (UAT) has just finished, and the results are in `uat.csv`. The managing director wants to know: **can we roll out next month?**

## The concept

### From cause to requirement

Every requirement should trace back to a root cause, so nobody builds something that doesn't solve a real problem:

| Root cause | Requirement |
| :-- | :-- |
| Incomplete documents from agents and phone staff | A checklist that blocks submission until the documents for that claim type are attached |
| Physical inspection for every claim | Photo assessment for windscreen claims |
| Weekly manager approval | Assessors approve windscreen and accident claims under ₦1m |
| Customers not knowing what's happening | SMS updates at each stage, naming anything missing |
| No way to see if it's working | A daily dashboard of days to settle by region |

### Business rules and controls

The finance controller's worry is fair: if assessors can approve payments, who checks them? Write the controls as rules:

- An assessor may approve only **windscreen or accident damage** claims **under ₦1m**. Theft and third-party claims always go to a manager.
- The approving assessor must be **different** from the one who assessed the claim.
- If a claim's amount changes **after** approval, the approval is cancelled and the claim goes back for approval.
- Finance receives a weekly report of every assessor approval, and audits a sample.

### User stories and acceptance criteria

*As a [role], I want [capability], so that [benefit].* Then acceptance criteria in *Given / When / Then* form, including the cases that **must fail**, which is where the controls live.

### Measures

Define the KPIs before rollout, exactly: days to settle (paid claims, `closed_at − submitted_at`), % of claims with documents requested, % paid within 30 days, withdrawals, complaints per 100 claims, and assessor approvals audited. Each needs a baseline and a target.

### Go or no-go

Agree the exit criteria before testing: for example, **no open critical or major defects**, and minor ones only with a workaround and a fix date.

![Requirements traced to root causes, business rules and a user story with a test that must fail, and go, conditional go and no-go criteria](/images/courses/ba-capstone/requirements-trace.svg "Root cause to requirement to rule to test to go/no-go.")

## Example

Test results by user story:

```sql
SELECT story_id,
       COUNT(*) AS tests,
       SUM(result = 'Pass') AS passed,
       SUM(result = 'Fail') AS failed,
       SUM(status IS 'Open') AS still_open
FROM uat
GROUP BY story_id
ORDER BY story_id;
```

```text
story_id  tests  passed  failed  still_open
US-01         6       4       2           0
US-02         4       3       1           1
US-03         6       4       2           1
US-04         5       3       2           2
US-05         3       3       0           0
```

The defects still open, worst first:

```sql
SELECT test_id, story_id, severity, scenario
FROM uat
WHERE status = 'Open'
ORDER BY CASE severity WHEN 'Critical' THEN 1 WHEN 'Major' THEN 2 ELSE 3 END, test_id;
```

```text
test_id  story_id  severity  scenario
UAT-14   US-03     Critical  Claim amount edited upwards after assessor approval
UAT-20   US-04     Major     SMS not sent to a customer who opted out
UAT-10   US-02     Minor     Large photo upload on a slow connection
UAT-21   US-04     Minor     SMS in Hausa and Yoruba
```

The answer to "can we roll out next month?" is **not yet**. UAT-14 is critical: if a claim's amount can be raised after an assessor approves it, the ₦1m limit can be bypassed, which is exactly the fraud risk the finance controller raised. UAT-20 is major: sending SMS to customers who opted out breaks their data protection choices. Both must be fixed and retested. The two minor defects can follow, with workarounds (staff can send the Hausa and Yoruba messages manually for now).

## Walkthrough

1. Write user stories US-01 to US-05 from the requirements table, each with at least three acceptance criteria.
2. Write the business rules for assessor approval as a decision table: claim type × amount × who assessed it.
3. Write the KPI definitions with baselines from lessons 2 and 5, and a target for each.
4. Run the UAT queries and write the go/no-go note, with what must happen before rollout.
5. Write US-03 in full (the task below).

## Practice

```answer
{
  "id": "bac-07-p1",
  "prompt": "How many **critical or major** defects are still **open**?",
  "answer": 2,
  "format": "number",
  "dataset": "claims",
  "files": ["uat"],
  "verify": "SELECT COUNT(*) FROM uat WHERE status = 'Open' AND severity IN ('Critical', 'Major')",
  "hint": "Filter on status and severity.",
  "required": true
}
```

```answer
{
  "id": "bac-07-p2",
  "prompt": "What percentage of UAT tests **passed**? One decimal place.",
  "answer": 70.8,
  "format": "percent",
  "dataset": "claims",
  "files": ["uat"],
  "verify": "SELECT ROUND(100.0 * AVG(result = 'Pass'), 1) FROM uat",
  "hint": "Passed tests ÷ all tests.",
  "required": true
}
```

```task
{
  "id": "bac-07-t1",
  "prompt": "Write user story **US-03** (assessor approval) with at least **four acceptance criteria** in Given/When/Then form, including the **limit**, the **claim types**, the **different assessor** rule and what happens if the **amount changes** after approval.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "As an assessor, I want ...",
  "rules": [
    { "label": "In user story form (As a ..., I want ..., so that ...)", "pattern": "as an? [^,]+,? i want[\\s\\S]{0,300}so that" },
    { "label": "Given/When/Then criteria", "pattern": "\\bgiven\\b[\\s\\S]{0,300}?\\bwhen\\b[\\s\\S]{0,300}?\\bthen\\b", "min": 4 },
    { "label": "The ₦1m limit", "pattern": "1m|1,000,000|1 million|one million" },
    { "label": "Theft or third-party claims go to a manager", "pattern": "theft|third.party" },
    { "label": "A different assessor approves", "pattern": "different|same assessor|another assessor|own (inspection|assessment)" },
    { "label": "Amount changed after approval", "pattern": "(amount|value)[^.]{0,80}(change|edit|increase|raise)" }
  ],
  "sample": "US-03: As an assessor, I want to approve windscreen and accident damage claims under ₦1m that another assessor has assessed, so that small claims don't wait for the weekly manager sign-off.\n\nAcceptance criteria:\n1. Given an accident damage claim of ₦600,000 assessed by another assessor, when I approve it, then it goes straight to finance for payment.\n2. Given a claim of ₦1m or more, when I try to approve it, then the system blocks me and sends it to a claims manager.\n3. Given a theft or third-party claim of any amount, when I try to approve it, then it is sent to a claims manager.\n4. Given a claim I assessed myself, when I try to approve it, then the system blocks me.\n5. Given a claim I approved, when its amount is changed, then my approval is cancelled and the claim needs approval again.\n6. Given any assessor approval, when the week ends, then it appears on finance's weekly approvals report.",
  "note": "Criteria 2 to 5 are the controls. They're what makes the change acceptable to finance, and UAT-14 shows why criterion 5 had to be written down.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why trace every requirement back to a root cause?",
    "options": ["For neatness", "So every feature solves a real, evidenced problem, and nothing unneeded gets built", "Developers ask for it", "It shortens the document"],
    "answer": 1,
    "explanation": "Traceability keeps scope honest."
  },
  {
    "prompt": "UAT finds that a claim's amount can be raised after assessor approval. What severity is it, and why?",
    "options": ["Minor: it's rare", "Critical: it bypasses the approval limit, a financial control", "Cosmetic", "Not a defect"],
    "answer": 1,
    "explanation": "Control failures on money are critical."
  },
  {
    "prompt": "When should go/no-go criteria be agreed?",
    "options": ["After testing, once you see the results", "Before testing, so the decision isn't bent to fit a deadline", "Never", "At rollout"],
    "answer": 1,
    "explanation": "Criteria set in advance keep the call honest."
  }
]
```
