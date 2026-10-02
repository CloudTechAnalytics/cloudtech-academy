---
title: Canary releases
minutes: 25
summary: Compare deployment strategies (all at once, rolling, blue-green and canary), analyse canary checks that compare a new version's errors with the old one's, and tune the rule that decides whether to promote or roll back.
---

## The problem

Under the old process, every release went to every server at once. A bad release reached every customer immediately, and the team found out from complaints.

The new pipeline releases each version as a **canary** first: 10% of traffic for 5 minutes, while the other 90% stays on the old version. If the canary looks worse than the old version, it's rolled back automatically. The question for this lesson: how good is the rule that decides?

## The concept

**Deployment strategies**

| Strategy | How | Risk if the release is bad |
| :-- | :-- | :-- |
| **All at once** | replace every instance together | everyone affected, until a full rollback |
| **Rolling** | replace instances a few at a time | grows as the rollout continues |
| **Blue-green** | start a full new set, switch traffic, keep the old set to switch back | everyone affected, but switching back is instant |
| **Canary** | send a small share of traffic to the new version, compare, then promote or roll back | limited to the canary's share, for a few minutes |

**Canary analysis**

Compare the canary with the **baseline** (the old version, serving at the same time): error rate, latency. A simple rule:

> roll back if the canary's error rate is more than **2 times** the baseline's, or its p95 latency is more than 1.5 times.

Too strict, and good releases get rolled back for noise. Too loose, and bad ones get through.

## Example

Every canary check since June, with what happened to each release:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/cicd/"
canary = pd.read_csv(base + "canary_checks.csv")
deploys = pd.read_csv(base + "deployments.csv")

canary["baseline_error_rate"] = canary["baseline_errors"] / canary["baseline_requests"]
canary["canary_error_rate"] = canary["canary_errors"] / canary["canary_requests"]
canary["error_ratio"] = canary["canary_error_rate"] / canary["baseline_error_rate"]
canary["latency_ratio"] = canary["canary_p95_ms"] / canary["baseline_p95_ms"]
checks = canary.merge(deploys[["deploy_id", "service", "result", "caused_incident"]], on="deploy_id")
checks["bad_release"] = checks["result"] == "rolled_back"

def rule(df, error_limit=2.0, latency_limit=1.5):
    return (df["error_ratio"] > error_limit) | (df["latency_ratio"] > latency_limit)

checks["flagged"] = rule(checks)
pd.crosstab(checks["bad_release"], checks["flagged"], margins=True)
```

```text
flagged      False  True  All
bad_release
False          246     0  246
True             2    17   19
All            248    17  265
```

The rule flags most bad releases and no good ones. The bad releases it missed went out to everyone and caused the two incidents under the new pipeline. Look at them:

```python
checks.loc[checks["bad_release"] & ~checks["flagged"], ["deploy_id", "service", "error_ratio", "latency_ratio", "canary_requests", "canary_errors"]].round(2)
```

```text
deploy_id service  error_ratio  latency_ratio  canary_requests  canary_errors
92      D0133     web         1.00           1.14             1425              6
233     D0274     api         1.17           1.12             2426              9
```

Their canary error rates were only a little above the baseline: within the noise of a few thousand requests. Tightening the rule to catch them would also flag good releases. Try a range of limits:

```python
for limit in [1.25, 1.5, 2.0, 3.0]:
    flagged = checks["error_ratio"] > limit
    print(f"error limit {limit}: catches {int((flagged & checks['bad_release']).sum())} of {int(checks['bad_release'].sum())} bad releases, "
          f"wrongly rolls back {int((flagged & ~checks['bad_release']).sum())} good ones")
```

```text
error limit 1.25: catches 17 of 19 bad releases, wrongly rolls back 64 good ones
error limit 1.5: catches 17 of 19 bad releases, wrongly rolls back 10 good ones
error limit 2.0: catches 17 of 19 bad releases, wrongly rolls back 0 good ones
error limit 3.0: catches 17 of 19 bad releases, wrongly rolls back 0 good ones
```

Lowering the limit doesn't catch the two missed releases at all, even at 1.25, but it rolls back dozens of good ones. Their error ratios (1.00 and 1.17) are indistinguishable from noise. The answer is more evidence, not a different limit: run the canary longer or on more traffic when the request counts are small, so the comparison is less noisy.

## Walkthrough

1. Run the cells. What were the canary request counts for the two missed releases, compared with the median?
2. Add a rule: require at least 2,000 canary requests before deciding. What happens to quiet-hour releases?
3. Which strategy would you use for a database schema change, where the old and new versions can't run side by side?
4. Write the canary policy (the task below).

## Practice

```answer
{
  "id": "cicd-08-p1",
  "prompt": "How many **bad releases** does the default rule (error ratio over 2 or latency ratio over 1.5) **catch**?",
  "answer": 17,
  "format": "number",
  "pyVerify": "int((checks['bad_release'] & checks['flagged']).sum())",
  "hint": "The True, True cell of the table.",
  "required": true
}
```

```task
{
  "id": "cicd-08-t1",
  "prompt": "Write Tallybook's **canary policy**, one rule per line starting with a dash: at least **four** rules covering the canary's **share and duration**, the **rollback rule** (with numbers), a **minimum** amount of evidence, and what happens **after** an automatic rollback.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "- Canary: ...",
  "rules": [
    { "label": "At least four rules, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 4 },
    { "label": "Share and duration (a % and minutes)", "pattern": "\\d+\\s*%[^\\n]*\\d+\\s*min|\\d+\\s*min[^\\n]*\\d+\\s*%" },
    { "label": "A rollback rule with a ratio or limit", "pattern": "roll[^\\n]*(\\d(\\.\\d+)?\\s*(x|times)|ratio|limit)" },
    { "label": "Minimum evidence (requests)", "pattern": "minimum|at least[^\\n]*request|\\d[\\d,]* requests" },
    { "label": "After a rollback (alert, investigate, owner)", "pattern": "after[^\\n]*(alert|investigat|owner|notif|ticket)|(alert|notif)[^\\n]*roll" }
  ],
  "sample": "- Canary: each release gets 10% of traffic for 5 minutes before promotion.\n- Rollback: roll back automatically if the canary's error rate is more than 2 times the baseline's or its p95 latency more than 1.5 times.\n- Evidence: no decision until the canary has served at least 2,000 requests; in quiet hours, the canary runs longer until it has.\n- After a rollback: the author is notified with the canary's figures, and the release can't be retried until the cause is found.\n- Database changes: schema changes are released separately, made backwards-compatible first, so canaries of the app can always run against them.",
  "note": "The evidence rule targets the weakness behind the misses: small samples hide real differences, and one of the two missed canaries served fewer than 1,500 requests.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What is a canary release?",
    "options": ["Releasing at night", "Sending a small share of traffic to the new version, comparing it with the old, then promoting or rolling back", "Releasing to staging only", "A release with no tests"],
    "answer": 1,
    "explanation": "Limit the blast radius while you check."
  },
  {
    "prompt": "You lower the rollback limit from 2 to 1.25. What's the main cost?",
    "options": ["None", "More good releases are rolled back for noise, slowing everyone down", "The canary gets bigger", "Tests run slower"],
    "answer": 1,
    "explanation": "Every threshold trades misses against false alarms."
  },
  {
    "prompt": "A canary served only 800 requests. Why is its comparison weak?",
    "options": ["800 is too many", "With few requests, error rates are noisy, so real differences can hide", "Canaries need 10,000 users", "It isn't"],
    "answer": 1,
    "explanation": "More evidence beats a different threshold."
  }
]
```
