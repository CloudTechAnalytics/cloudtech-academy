---
title: Game day and the go/no-go
minutes: 25
summary: Test the platform by breaking it on purpose, read the game-day results against their targets, turn the whole review into a readiness checklist, and give leadership an honest go/no-go for the sale.
---

## The problem

Three weeks before the sale, the team ran a **game day**: a planned morning of breaking things in a controlled way, to see whether the system and the people respond as the plans say. Plans that have never been tested are hopes. Now the head of engineering wants the answer to the question in the brief: **are we ready?**

## The concept

**A game day**

Each drill has a scenario, a success criterion and, where it matters, a target time, such as a **recovery time objective** (RTO) for restoring the database. Record what actually happened, including the surprises.

**Pass, fail and what it teaches**

A failed drill is a success for the game day: you found the problem before the sale did. Each failure becomes an action with an owner and a date, then a re-test.

**Go, no-go, or go with conditions**

A readiness decision lists what's done, what's open, and the conditions that must be met by a date. "Go if the backup restore passes a re-test by 20 November" is more useful than a vague "mostly ready".

## Example

The game-day results:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/platform/"
gameday = pd.read_csv(base + "gameday.csv")
gameday["overrun_minutes"] = (gameday["actual_minutes"] - gameday["target_minutes"]).clip(lower=0)
print(gameday[["drill_id", "scenario", "target_minutes", "actual_minutes", "passed"]].to_string(index=False))
print(f"\nPassed {gameday['passed'].sum()} of {len(gameday)}")
```

```text
drill_id                                      scenario  target_minutes  actual_minutes  passed
     G-1    Kill two checkout-api instances under load             5.0             3.0       1
     G-2            Fail over orders-db to the replica             5.0             4.0       1
     G-3    Restore orders-db from last night's backup            60.0           155.0       0
     G-4           Roll back a bad checkout-api deploy            10.0             7.0       1
     G-5 Payment gateway returns errors for 10 minutes             2.0            18.0       0
     G-6     Burn-rate alert fires and reaches on-call             5.0             9.0       0
     G-7   Traffic at 1.6x last year's peak in staging             NaN             NaN       1

Passed 4 of 7
```

The failures, with what happened:

```python
for _, d in gameday[gameday["passed"] == 0].iterrows():
    print(f"{d['drill_id']} {d['scenario']} ({d['actual_minutes']:.0f} min against {d['target_minutes']:.0f}):\n   {d['notes']}\n")
```

```text
G-3 Restore orders-db from last night's backup (155 min against 60):
   Backup bucket unencrypted and unlabelled; restore steps were not written down; took 2.5 hours.

G-5 Payment gateway returns errors for 10 minutes (18 min against 2):
   No fallback: checkout showed a blank error page until the gateway recovered.

G-6 Burn-rate alert fires and reaches on-call (9 min against 5):
   Alert went to an email list; on-call saw it 9 minutes later.
```

The capacity work held: the platform took 1.6 times last year's peak, and losing instances or failing over the database caused little harm. But three things failed, and each is serious on sale day. Restoring the database took over two and a half hours against a one-hour target. The bucket was the unencrypted, unowned one from lesson 1, and nobody had written the steps down. A payment gateway outage showed customers a blank page. And the page went to an email list, so on-call saw it after nine minutes, against a five-minute target.

The readiness checklist, from the whole review:

```python
checklist = pd.DataFrame([
    ("Pooler, larger database, autoscaling to 30 (PR 214 fixed)", "Done", "Capacity drill passed at 1.6x"),
    ("Policy checks block dangerous plans in the pipeline", "Done", "Caught the database replacement"),
    ("Manual production resources imported into Terraform", "Open", "Replica, worker, backups bucket, bastion"),
    ("Backups encrypted, owned, and restore runbook written", "Open", "Restore drill failed: 155 min against 60"),
    ("Payment gateway fallback: retry message and queued orders", "Open", "Drill failed: blank page for 18 min"),
    ("Fast burn-rate page routed to on-call phones", "Open", "Alert reached on-call after 9 min by email"),
    ("Noisy alerts removed (CPU, heartbeat)", "Done", "On-call load cut by most of the volume"),
    ("Deploy rules and sale-week freeze agreed", "Done", "Tests required; no late-Friday deploys"),
    ("Idle machines deleted and staging scheduled", "Done", "Saves about $2,930 a month"),
], columns=["item", "status", "evidence"])
print(checklist.to_string(index=False))
print(f"\n{(checklist['status'] == 'Done').sum()} done, {(checklist['status'] == 'Open').sum()} open")
```

```text
item status                                   evidence
Pooler, larger database, autoscaling to 30 (PR 214 fixed)   Done              Capacity drill passed at 1.6x
      Policy checks block dangerous plans in the pipeline   Done            Caught the database replacement
      Manual production resources imported into Terraform   Open   Replica, worker, backups bucket, bastion
    Backups encrypted, owned, and restore runbook written   Open   Restore drill failed: 155 min against 60
Payment gateway fallback: retry message and queued orders   Open        Drill failed: blank page for 18 min
             Fast burn-rate page routed to on-call phones   Open Alert reached on-call after 9 min by email
                    Noisy alerts removed (CPU, heartbeat)   Done     On-call load cut by most of the volume
                 Deploy rules and sale-week freeze agreed   Done     Tests required; no late-Friday deploys
              Idle machines deleted and staging scheduled   Done                 Saves about $2,930 a month

5 done, 4 open
```

The honest answer is **go, with conditions**. The capacity problem that caused last year's outage is fixed and tested. But four items are open, and three of them failed a drill. Each needs an owner, a date before the freeze, and a re-test.

## Walkthrough

1. Run the cells.
2. Give each open item an owner and a date, at least a week before the sale.
3. Plan the re-tests: which drills run again, and when?
4. Write the sale-day runbook's first page: who's on call, how to reach them, and the first three things to check.
5. Write the executive summary (the task below), then open the project brief on the course page.

## Practice

```dataset
{"dataset": "platform", "files": ["resources", "sale_metrics", "deployments", "loadtest", "alerts", "gameday"]}
```

```answer
{
  "id": "cdc-08-p1",
  "prompt": "How many game-day drills **failed**?",
  "answer": 3,
  "format": "number",
  "dataset": "platform",
  "files": ["gameday"],
  "verify": "SELECT COUNT(*) FROM gameday WHERE passed = 0",
  "hint": "Total drills minus those passed.",
  "required": true
}
```

```answer
{
  "id": "cdc-08-p2",
  "prompt": "By how many minutes did the database **restore** overrun its target?",
  "answer": 95,
  "format": "number",
  "dataset": "platform",
  "files": ["gameday"],
  "verify": "SELECT actual_minutes - target_minutes FROM gameday WHERE scenario LIKE 'Restore%'",
  "hint": "Actual minus target for the restore drill.",
  "required": true
}
```

```task
{
  "id": "cdc-08-t1",
  "prompt": "Write the **executive summary** for the head of engineering (120 to 230 words): **what went wrong** last year, what you've **fixed** and the **evidence** it works, what's still **open**, the **cost** effect, and your **go/no-go** with conditions and dates.",
  "minutes": 12,
  "rows": 11,
  "placeholder": "Last year ...",
  "rules": [
    { "label": "Last year's cause (connections, pool)", "pattern": "connection|pool" },
    { "label": "Uses numbers", "pattern": "\\d+(\\.\\d+)?", "min": 6 },
    { "label": "Evidence (load test, drill, game day)", "pattern": "load test|drill|game day|tested" },
    { "label": "Open items (restore, backup, payment, paging)", "pattern": "restore|backup|payment|pag" },
    { "label": "Cost effect", "pattern": "\\$\\s*[\\d,]+" },
    { "label": "A go/no-go decision", "pattern": "\\bgo\\b|no-go|ready" },
    { "label": "Conditions with dates or deadlines", "pattern": "by \\d|before|deadline|date|\\d+ november" },
    { "label": "Between 120 and 230 words", "minWords": 120, "maxWords": 230 }
  ],
  "sample": "Last year, checkout failed for 94 minutes at the sale's peak and about 152,000 requests failed, using almost half the month's error budget. The cause was database connections: each checkout instance opened 20, the database allowed 200, and autoscaling kept adding instances.\n\nFixed: a connection pooler, a larger database and autoscaling to 30 instances. The load test and game day handled 1.6 times last year's peak with 0.2% errors. Policy checks now block dangerous Terraform plans; one caught a change that would have deleted the orders database. We've removed the noisy alerts, added a fast burn-rate page that would have fired within 7 minutes last year, and agreed deploy rules and a sale-week freeze. The bill goes down by about $1,750 a month.\n\nOpen: database restore took 155 minutes against a 60-minute target; the payment gateway has no fallback; pages reach on-call by email; and four production resources are still managed by hand.\n\nRecommendation: go, with conditions. By 13 November, the backups must be encrypted with a written restore runbook that passes a re-test in under 60 minutes, the payment fallback must pass its drill, and pages must reach on-call phones. If the restore re-test fails, we'll tell you before the freeze.",
  "note": "\"Go with conditions\" only works if the conditions have owners, dates and a re-test.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is a failed game-day drill?",
    "options": ["A disaster", "A success for the game day: a problem found before the real event", "A reason to cancel the sale", "A testing error"],
    "answer": 1,
    "explanation": "Find failures on your schedule, not the customer's."
  },
  {
    "prompt": "Why does an untested backup count as a risk even if backups run every night?",
    "options": ["It doesn't", "Until you've restored one, you don't know how long it takes or whether it works", "Backups expire", "It's unencrypted"],
    "answer": 1,
    "explanation": "A backup is only as good as its restore."
  },
  {
    "prompt": "What makes \"go with conditions\" a useful decision?",
    "options": ["It sounds positive", "Each condition has an owner, a deadline and a re-test, so readiness is checked, not assumed", "It avoids a decision", "It's shorter"],
    "answer": 1,
    "explanation": "Conditions turn hope into a plan."
  }
]
```
