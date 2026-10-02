---
title: Delivery and the change freeze
minutes: 25
summary: Measure Kasuwa's delivery with the four DORA measures, find which deploys fail most often, and set evidence-based rules for deploying before and during the sale.
---

## The problem

"Every deploy feels like a gamble," says the head of engineering, and the product team wants to ship new sale features up to the last minute. Some engineers want a total freeze for a month; others say freezes just pile up risk for afterwards. Six months of deployment records (`deployments.csv`) can settle it.

## The concept

**The four DORA measures**

| Measure | Question |
| :-- | :-- |
| Deployment frequency | How often do we ship? |
| Lead time for changes | How long from a change being ready to it being live? |
| Change failure rate | What share of deploys cause a failure (rolled back or hotfixed)? |
| Time to restore | When a deploy fails, how long until service is restored? |

**What makes a deploy risky?**

Compare failure rates by the deploy's features: whether the change had automated tests, how big it was, when it was deployed. Small groups give noisy rates, so count the deploys behind each one.

**A freeze with evidence**

A freeze is a trade-off. It removes deploy risk during the sale, but changes pile up and land together afterwards. A short freeze around the sale, with rules that cut risk in the weeks before, usually beats a long one.

## Example

The four measures:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/platform/"
deploys = pd.read_csv(base + "deployments.csv", parse_dates=["deployed_at"])
deploys["failed"] = deploys["result"] != "Success"
weeks = (deploys["deployed_at"].max() - deploys["deployed_at"].min()).days / 7
print(f"Deploys: {len(deploys)} in {weeks:.0f} weeks ({len(deploys) / weeks:.1f} a week)")
print(f"Median lead time: {deploys['lead_time_hours'].median():.0f} hours")
print(f"Change failure rate: {deploys['failed'].mean():.1%}")
print(f"Median time to restore: {deploys['minutes_to_restore'].median():.0f} minutes")
```

```text
Deploys: 167 in 25 weeks (6.6 a week)
Median lead time: 29 hours
Change failure rate: 14.4%
Median time to restore: 36 minutes
```

Kasuwa deploys often and restores quickly, but about one deploy in seven fails. Which ones?

```python
deploys["late_friday"] = (deploys["deployed_at"].dt.dayofweek == 4) & (deploys["deployed_at"].dt.hour >= 15)
deploys["size"] = pd.cut(deploys["lines_changed"], [0, 100, 400, 100_000], labels=["under 100 lines", "100 to 400", "over 400"])
for col in ["has_tests", "late_friday", "size"]:
    print(deploys.groupby(col, observed=True)["failed"].agg(deploys="size", failure_rate="mean").round(3), "\n")
```

```text
deploys  failure_rate
has_tests
0               48         0.208
1              119         0.118

             deploys  failure_rate
late_friday
False            150         0.120
True              17         0.353

                 deploys  failure_rate
size
under 100 lines       63         0.095
100 to 400            84         0.179
over 400              20         0.150
```

Deploys without automated tests fail far more often than those with them. Late-Friday deploys fail most of all, though there are few of them, so treat that rate as a warning rather than a precise figure. Small changes (under 100 lines) fail least, at under 10%. Larger ones fail at 15 to 18%, so keep sale-period changes small.

The rules that follow from the evidence:

1. **From now on**: every checkout change needs automated tests to deploy, changes should be small, and no deploys after 15:00 on Fridays.
2. **Two weeks before the sale**: only changes with tests, with a named reviewer from the payments team.
3. **Sale week**: freeze, except fixes approved by the incident lead, each with a tested rollback.
4. **After the sale**: release the queued changes in small batches, not all at once.

## Walkthrough

1. Run the cells.
2. Calculate the four measures for each service. Is checkout better or worse than the others?
3. Estimate the change failure rate if every deploy had tests. How many failures would that have avoided in six months?
4. Look at the deploys that took longest to restore. Were they rolled back or hotfixed?
5. Write the deployment policy for the sale (the task below).

## Practice

```answer
{
  "id": "cdc-04-p1",
  "prompt": "What is the **change failure rate** over the six months? One decimal place.",
  "answer": 14.4,
  "format": "percent",
  "dataset": "platform",
  "files": ["deployments"],
  "verify": "SELECT ROUND(100.0 * AVG(result <> 'Success'), 1) FROM deployments",
  "hint": "Failed (rolled back or hotfixed) ÷ all deploys.",
  "required": true
}
```

```answer
{
  "id": "cdc-04-p2",
  "prompt": "What is the change failure rate for deploys **without** automated tests? One decimal place.",
  "answer": 20.8,
  "format": "percent",
  "dataset": "platform",
  "files": ["deployments"],
  "verify": "SELECT ROUND(100.0 * AVG(result <> 'Success'), 1) FROM deployments WHERE has_tests = 0",
  "hint": "The has_tests = 0 row.",
  "required": true
}
```

```task
{
  "id": "cdc-04-t1",
  "prompt": "Write the **deployment policy** for the sale (60 to 150 words): the **DORA** figures today, the **evidence** behind each rule, the **freeze** window and its exceptions, and what happens **after** the sale.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Today we deploy ...",
  "rules": [
    { "label": "Gives DORA figures", "pattern": "\\d+(\\.\\d+)?\\s*%|\\d+ (a|per) week|\\d+ minutes", "min": 2 },
    { "label": "Covers tests", "pattern": "test" },
    { "label": "Covers Friday deploys", "pattern": "friday" },
    { "label": "Defines the freeze and exceptions", "pattern": "freeze" },
    { "label": "Covers exceptions (fixes, incident lead, approved)", "pattern": "except|approv|fix" },
    { "label": "Says what happens after (small batches)", "pattern": "after|batch" },
    { "label": "Between 60 and 150 words", "minWords": 60, "maxWords": 150 }
  ],
  "sample": "Today we deploy about 6.6 times a week, restore in a median of 36 minutes, and 14.4% of deploys fail. Deploys without automated tests fail 20.8% of the time against 11.8% with them, and late-Friday deploys failed 35% of the time (on only 17 deploys). So, from now on, checkout changes need tests to deploy, and nothing ships after 15:00 on a Friday. In the two weeks before the sale, only tested changes with a payments-team reviewer go out. In sale week we freeze, except fixes approved by the incident lead, each with a tested rollback. After the sale, queued changes go out in small batches over several days, not all at once.",
  "note": "Every rule points at a number, and the small sample is called out honestly.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does the change failure rate measure?",
    "options": ["How often you deploy", "The share of deploys that cause a failure needing a rollback or fix", "Time to restore", "Lines of code changed"],
    "answer": 1,
    "explanation": "One of the four DORA measures."
  },
  {
    "prompt": "Late-Friday deploys fail 35% of the time, from 17 deploys. How should you treat that figure?",
    "options": ["As exact", "As a warning: the direction is clear but the sample is small", "Ignore it", "As proof that Fridays are cursed"],
    "answer": 1,
    "explanation": "Count what's behind a rate."
  },
  {
    "prompt": "Why release queued changes in small batches after a freeze?",
    "options": ["To keep busy", "So a failure can be traced to one change and rolled back quickly", "It's cheaper", "To avoid tests"],
    "answer": 1,
    "explanation": "Big batches multiply risk."
  }
]
```
