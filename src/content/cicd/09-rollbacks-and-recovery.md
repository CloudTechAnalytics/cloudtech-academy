---
title: Rollbacks and recovery
minutes: 20
summary: Compare rolling back with fixing forward, measure time to restore under the old and new processes, and design releases (feature flags, backwards-compatible changes) that make recovery fast.
---

## The problem

Even with good tests and canaries, some bad releases reach customers. What matters then is how fast service is restored. Under the old process, Tallybook's engineers usually tried to fix the problem and push a new release ("fix forward"), which meant working out the cause first, under pressure. Under the new one, the first move is always to go back to the last good image.

## The concept

**Roll back or fix forward?**

| | Roll back | Fix forward |
| :-- | :-- | :-- |
| How | redeploy the previous image | write, test and release a fix |
| Speed | minutes, without understanding the cause | as long as diagnosis and the fix take |
| When | the default | when rolling back isn't possible (for example, data was already changed) |

Restore service first; understand the cause afterwards.

**Making rollbacks possible**

- Keep previous images in the registry, tagged by version.
- Make **database changes backwards-compatible** (add a column first, start using it in a later release, remove the old one later still), so the previous app version still works.
- Use **feature flags**: ship new code switched off, turn it on separately, and switch it off instantly if it misbehaves, with no deployment at all.

## Example

Incidents and their restore times under each process:

```python
import pandas as pd

deploys = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/cicd/deployments.csv")
incidents = deploys[deploys["caused_incident"] == 1]
print(incidents.groupby(["pipeline", "result"])["minutes_to_restore"].agg(["count", "median", "max"]))
print()
print("Total customer-facing minutes of failed releases:")
print(incidents.groupby("pipeline")["minutes_to_restore"].sum())
```

```text
count  median    max
pipeline result
new      rolled_back        2    21.5   25.0
old      fixed_forward      3   216.0  278.0
         rolled_back        5   194.0  306.0

Total customer-facing minutes of failed releases:
pipeline
new      43.0
old    1600.0
Name: minutes_to_restore, dtype: float64
```

Under the old process, fixing forward took much longer than rolling back, and even the rollbacks took about three hours at the median, because rolling back meant reverting the code and re-running the whole manual process. Under the new pipeline, the two releases that slipped past the canary were rolled back in minutes.

## Walkthrough

1. Run the cells. How many hours of failed-release time did the old process cause in three months, and the new one?
2. Design a backwards-compatible change for renaming a database column used by the app.
3. Which kinds of Tallybook features would you put behind a feature flag?
4. Write the recovery runbook (the task below).

## Practice

```answer
{
  "id": "cicd-09-p1",
  "prompt": "What was the **total** number of minutes to restore across **old-process** incidents?",
  "answer": 1600,
  "format": "number",
  "pyVerify": "float(incidents.loc[incidents['pipeline'] == 'old', 'minutes_to_restore'].sum())",
  "hint": "The old line of the second output.",
  "required": true
}
```

```task
{
  "id": "cicd-09-t1",
  "prompt": "Write the **recovery runbook** for a bad release that got past the canary, one numbered step per line: at least **five** steps covering **detection**, the **rollback** (how, and who decides), **communication**, **finding the cause**, and **preventing** a repeat.",
  "minutes": 6,
  "rows": 7,
  "placeholder": "1. An alert fires ...",
  "rules": [
    { "label": "At least five numbered steps", "pattern": "^\\s*\\d+[.)]\\s+\\S", "min": 5 },
    { "label": "Detection (alert, monitor)", "pattern": "alert|monitor|detect" },
    { "label": "Rollback to the previous image or version", "pattern": "roll(s|ed)? ?back[^\\n]*(previous|last good|image|version)" },
    { "label": "Communication (status page, customers, channel)", "pattern": "status page|customer|channel|support|announce" },
    { "label": "Finding the cause after restoring", "pattern": "cause|investigat|postmortem|post-mortem" },
    { "label": "Prevention (test, canary rule, check)", "pattern": "test|canary|check|prevent" }
  ],
  "sample": "1. An alert fires on error rate or latency, or support reports a problem; the on-call engineer checks whether a release went out in the last hour.\n2. If one did, the on-call engineer rolls back to the previous image straight away, without waiting to find the cause.\n3. They post in the incident channel and update the status page; support is told what customers may have seen.\n4. Once service is restored, the release's author and the on-call engineer find the cause, using the canary figures and logs.\n5. The fix ships as a new release through the normal pipeline, with a test that would have caught the problem.\n6. A blameless postmortem asks why the canary didn't catch it, and changes the canary rule or tests if needed.",
  "note": "Step 2 comes before understanding the cause: restoring service is the first priority.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A release breaks checkout. What's usually the first move?",
    "options": ["Find the bug and fix it", "Roll back to the last good version, then investigate", "Wait and watch", "Restart the servers"],
    "answer": 1,
    "explanation": "Restore first, understand second."
  },
  {
    "prompt": "What makes rolling back impossible?",
    "options": ["Using containers", "A release that changed the database in a way the old version can't handle", "Feature flags", "Canaries"],
    "answer": 1,
    "explanation": "Keep database changes backwards-compatible."
  },
  {
    "prompt": "What does a feature flag allow?",
    "options": ["Faster builds", "Turning a feature on or off without a deployment", "Skipping tests", "Bigger images"],
    "answer": 1,
    "explanation": "Release code separately from releasing features."
  }
]
```
