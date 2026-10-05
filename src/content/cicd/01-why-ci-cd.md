---
title: Why CI/CD
minutes: 15
summary: What continuous integration and continuous delivery are, the four DORA measures of software delivery, and how they changed when Tallybook replaced manual deployments with a pipeline.
---

## The problem

Until May 2026, Tallybook deployed its app like this: an engineer pushed code, waited for the tests (if anyone looked), then the pipeline logged in to the servers and ran `git pull` and a restart on all of them at once. Releases were scary, so they happened about once a week per service and bundled weeks of work. When one broke, finding which of 20 changes was to blame took hours.

On 1 June, the platform team switched to a new pipeline: every change tested, built into a container image, scanned, and released to a small share of traffic first. This course teaches how that pipeline works, piece by piece, and starts by measuring whether it was worth it.

## The concept

### Continuous integration (CI)

Every change is merged often (at least daily) and automatically built and tested, so problems are found while they're small and fresh.

### Continuous delivery and deployment (CD)

Every change that passes the pipeline can be released at any time (delivery), or is released automatically (deployment), by a repeatable process, not by hand.

### The four DORA measures

Years of research by the DORA team found four measures that separate high-performing software teams:

| Measure | Question | Better is |
| :-- | :-- | :-- |
| **Deployment frequency** | How often do we release? | more often |
| **Lead time for changes** | How long from first commit to production? | shorter |
| **Change failure rate** | What share of releases cause a failure in production? | lower |
| **Time to restore** | When one does, how long until service is restored? | shorter |

Speed and stability aren't a trade-off: teams that release small changes often are usually **more** stable, because each change is easier to test, understand and undo.

![A pipeline from commit through build, test, scan and staging to production, with CI covering every change and CD meaning any passing change can ship; below it, the four DORA measures and which way each should move](/images/courses/cicd/pipeline-dora.svg "A CI/CD pipeline, and the four DORA measures of how well it works.")

## Example

Tallybook's deployments from March to August 2026, with the pipeline each used:

```python
import pandas as pd

deploys = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/cicd/deployments.csv",
                      parse_dates=["first_commit_at", "deployed_at"])
deploys["lead_time_hours"] = (deploys["deployed_at"] - deploys["first_commit_at"]).dt.total_seconds() / 3600

WEEKS = 13   # each period (March to May, June to August) is about 13 weeks
dora = deploys.groupby("pipeline").agg(
    deployments=("deploy_id", "size"),
    commits_per_deploy=("commits", "mean"),
    median_lead_time_hours=("lead_time_hours", "median"),
    change_failure_rate=("caused_incident", "mean"),
    median_minutes_to_restore=("minutes_to_restore", "median"),
)
dora["deploys_per_week"] = dora["deployments"] / WEEKS
dora.round(3)
```

```text
deployments  commits_per_deploy  median_lead_time_hours  change_failure_rate  median_minutes_to_restore  deploys_per_week
pipeline
new               265               3.000                  16.350                0.008                       21.5            20.385
old                40              21.675                 159.058                0.200                      205.0             3.077
```

Read across the rows. With the new pipeline, Tallybook releases several times as often, each release is a few commits instead of twenty, changes reach customers in hours instead of a week, a far smaller share of releases cause incidents, and those that do are fixed in minutes. Every measure improved together.

Change failure rate depends on what you count. Here's every release that didn't simply succeed:

```python
pd.crosstab(deploys["pipeline"], deploys["result"])
```

```text
result    fixed_forward  rolled_back  success
pipeline
new                   0           19      246
old                   3            5       32
```

Under the new pipeline, most bad releases were rolled back automatically by the canary check (lesson 8) before most customers saw them, so they didn't count as incidents. Under the old process, every bad release reached every customer.

## Walkthrough

1. Run the cells. Compute the four measures separately for each service.
2. Plot deployments per week across the six months. Can you see the switch on 1 June?
3. Why might the old process's few, large releases have caused more incidents, even with the same engineers?
4. Decide which measure the CEO should see each month, and why.

## Practice

```dataset
{"dataset": "cicd", "files": ["deployments", "pipeline_runs", "canary_checks", "images"]}
```

```answer
{
  "id": "cicd-01-p1",
  "prompt": "What was the **median lead time** under the **old** process, in hours? One decimal place.",
  "answer": 159.1,
  "format": "number",
  "dataset": "cicd",
  "files": ["deployments"],
  "pyVerify": "round(dora.loc['old', 'median_lead_time_hours'], 1)",
  "hint": "The old row, median_lead_time_hours.",
  "required": true
}
```

```answer
{
  "id": "cicd-01-p2",
  "prompt": "What was the **change failure rate** under the **old** process? As a percentage, one decimal place.",
  "answer": 20.0,
  "format": "percent",
  "dataset": "cicd",
  "files": ["deployments"],
  "pyVerify": "round(dora.loc['old', 'change_failure_rate'] * 100, 1)",
  "hint": "The old row, change_failure_rate.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which is NOT one of the four DORA measures?",
    "options": ["Deployment frequency", "Lines of code written", "Change failure rate", "Time to restore service"],
    "answer": 1,
    "explanation": "DORA measures delivery outcomes, not activity."
  },
  {
    "prompt": "Why do small, frequent releases tend to be more stable?",
    "options": ["They're tested less", "Each is easier to test, understand and roll back", "They're released at night", "They use better servers"],
    "answer": 1,
    "explanation": "Small batches reduce risk."
  },
  {
    "prompt": "What does continuous integration mean?",
    "options": ["Deploying once a month", "Merging changes often and building and testing each automatically", "Writing documentation", "Manual testing"],
    "answer": 1,
    "explanation": "Find problems while they're small."
  }
]
```
