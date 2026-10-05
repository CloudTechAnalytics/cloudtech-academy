---
title: "Final project: Tallybook's delivery review"
minutes: 20
summary: Plan your final project, a review of how Tallybook builds, secures and releases software, with DORA measures, fixed Dockerfile and workflow, scanning and canary policies, and the next improvements.
---

## The problem

Three months after switching to the new pipeline, Tallybook's CTO wants a review for the board: was it worth it, what's still risky, and what comes next? Your final project is that review, built from the files and data in this course, with fixed versions of the Dockerfile and workflow attached.

## The concept

### The parts of the review

| Part | Built in |
| :-- | :-- |
| DORA measures, before and after | lesson 1 |
| The image: size, build time, Dockerfile fixes | lessons 2 and 3 |
| Vulnerabilities and the scanning policy | lesson 4 |
| The workflow: problems found and the fixed version | lessons 5 and 6 |
| Pipeline speed and caching | lesson 7 |
| Canary performance and policy | lesson 8 |
| Recovery | lesson 9 |

### Show the trade-offs

The board will ask whether faster releases mean more risk. The data answers it; make sure your review shows it plainly.

## Example

The headline table for the board:

```python
import pandas as pd

deploys = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/cicd/deployments.csv",
                      parse_dates=["first_commit_at", "deployed_at"])
deploys["lead_time_hours"] = (deploys["deployed_at"] - deploys["first_commit_at"]).dt.total_seconds() / 3600

headline = deploys.groupby("pipeline").agg(
    deploys_per_week=("deploy_id", lambda s: round(len(s) / 13, 1)),
    median_lead_time_hours=("lead_time_hours", lambda s: round(s.median(), 1)),
    change_failure_rate_pct=("caused_incident", lambda s: round(s.mean() * 100, 1)),
    median_minutes_to_restore=("minutes_to_restore", "median"),
).T[["old", "new"]]
headline
```

```text
pipeline                     old   new
deploys_per_week             3.1  20.4
median_lead_time_hours     159.1  16.4
change_failure_rate_pct     20.0   0.8
median_minutes_to_restore  205.0  21.5
```

## Walkthrough

1. Complete the review with every part in the table above.
2. Attach your fixed Dockerfile and workflow, with your checkers' output showing they pass.
3. List the three biggest remaining risks, with evidence.
4. Open the project brief on the course page and plan the write-up.

## Practice

```answer
{
  "id": "cicd-10-p1",
  "prompt": "Under the **new** pipeline, how many deployments per week did Tallybook make? One decimal place.",
  "answer": 20.4,
  "format": "number",
  "dataset": "cicd",
  "files": ["deployments"],
  "pyVerify": "float(headline.loc['deploys_per_week', 'new'])",
  "hint": "The deploys_per_week row, new column.",
  "required": true
}
```

```task
{
  "id": "cicd-10-t1",
  "prompt": "Write the **executive summary** for the board (100 to 200 words): the **DORA** results with numbers, what was **fixed** (Dockerfile, secrets, workflow), what's still **risky**, and the **next three** improvements.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Since June, Tallybook releases ...",
  "rules": [
    { "label": "At least three numbers", "pattern": "\\d+(\\.\\d+)?", "min": 3 },
    { "label": "Names DORA measures (frequency, lead time, failure, restore)", "pattern": "lead time|change failure|restor|(release|deploy)\\w*[^\\n]*(a week|per week|a day)|incident", "min": 2 },
    { "label": "Mentions the secret in the image or workflow problems", "pattern": "secret|password|workflow|pipeline" },
    { "label": "Remaining risks", "pattern": "risk|still|remain" },
    { "label": "Next improvements", "pattern": "next|plan|will" },
    { "label": "Between 100 and 200 words", "minWords": 100, "maxWords": 200 }
  ],
  "sample": "Since the new pipeline started in June, Tallybook releases about 20 times a week instead of 3, each change reaches customers in about 16 hours instead of nearly a week, and the share of releases causing incidents fell from 20% to under 1%. When something does go wrong, service is restored in minutes rather than hours. Faster releases have made Tallybook more stable, not less. Along the way we removed the production database password from the container image, cut the image from 1.2 GB to under 200 MB with far fewer known vulnerabilities, and closed six security gaps in the old deployment workflow, including deployments from any branch. Risks remain: the canary misses bad releases whose effect is small at low traffic, our own npm packages have three serious known vulnerabilities, and the test suite is now the biggest part of the pipeline we can speed up. Next, we will upgrade those three packages, require a minimum number of canary requests before promotion, and split tests across machines to keep releases under ten minutes.",
  "note": "The fourth sentence answers the board's real question directly: speed didn't cost stability.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The board asks whether faster releases increased risk. What answers it?",
    "options": ["Opinions", "Change failure rate and time to restore, before and after", "The number of engineers", "Image size"],
    "answer": 1,
    "explanation": "The stability measures show it directly."
  },
  {
    "prompt": "Which is a remaining risk worth reporting?",
    "options": ["The pipeline uses YAML", "Known critical vulnerabilities in the app's own dependencies", "Images are tagged", "Tests exist"],
    "answer": 1,
    "explanation": "Report risks with evidence and a plan."
  },
  {
    "prompt": "Why attach the fixed Dockerfile and workflow with checker output?",
    "options": ["To look thorough", "So the fixes can be verified, not just claimed", "Boards like code", "It's required"],
    "answer": 1,
    "explanation": "Evidence, not promises."
  }
]
```
