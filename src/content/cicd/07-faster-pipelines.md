---
title: Faster pipelines
minutes: 15
summary: Measure where a pipeline's time goes, step by step, see what dependency and image-layer caching saved, and find what to speed up next.
---

## The problem

In June, a change took about 20 minutes to get through Tallybook's new pipeline. Developers started batching changes to avoid waiting, which is exactly the habit the pipeline was meant to break. On 1 July the team switched on caching. Did it work, and where is the time going now?

## The concept

### Measure by step

Total pipeline time is the sum of its steps (plus time queued waiting for a machine). Speed up the biggest step first.

### Caching

- **Dependency cache**: save the downloaded packages between runs, keyed on the lock file, so `npm ci` only downloads when dependencies change.
- **Image layer cache**: reuse unchanged layers from previous builds (lesson 2), which only helps if the Dockerfile is ordered well (lesson 3).

### Other levers

Run independent steps in parallel, split slow test suites across machines, and avoid doing work twice (for example, building the image in one job and rebuilding it in another).

## Example

Median seconds per step, before and after caching:

```python
import pandas as pd

runs = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/cicd/pipeline_runs.csv")
steps = [c for c in runs.columns if c.endswith("_s")]
runs["total_s"] = runs[steps].sum(axis=1)

by_caching = runs.groupby("caching")[steps + ["total_s"]].median().T
by_caching.columns = ["before caching", "after caching"]
by_caching["saved"] = by_caching["before caching"] - by_caching["after caching"]
by_caching
```

```text
before caching  after caching  saved
queue_s                  25.0           24.5    0.5
checkout_s                7.0            6.0    1.0
install_s               186.0           24.0  162.0
test_s                  197.0          201.5   -4.5
build_image_s           235.0           60.0  175.0
scan_s                   34.0           35.0   -1.0
push_s                   55.0           14.0   41.0
deploy_s                475.0          474.0    1.0
total_s                1216.0          843.0  373.0
```

Caching cut the dependency install and the image build dramatically, saving several minutes per run. Look at what's biggest now:

```python
after = runs[runs["caching"] == 1]
share = (after[steps].median() / after[steps].median().sum()).sort_values(ascending=False)
print((share * 100).round(1).astype(str) + "%")
print("90th percentile total, after caching:", round(after["total_s"].quantile(0.9) / 60, 1), "minutes")
```

```text
deploy_s         56.5%
test_s           24.0%
build_image_s     7.2%
scan_s            4.2%
queue_s           2.9%
install_s         2.9%
push_s            1.7%
checkout_s        0.7%
dtype: object
90th percentile total, after caching: 15.8 minutes
```

More than half of each run is now the deploy step, most of it the canary watching the new version before promoting it (lesson 8). That's deliberate safety time, not waste. The next real target is the test suite, which could be split across machines.

## Walkthrough

1. Run the cells. Find the runs where queueing took more than two minutes. What might cause that?
2. If tests were split across 3 machines, roughly what would the median total become?
3. Why should the deploy step's waiting time not be "optimised" away?
4. Calculate developer hours saved per month by caching, assuming one developer waits for every run.

## Practice

```answer
{
  "id": "cicd-07-p1",
  "prompt": "How many seconds did caching save on the **median total** run time?",
  "answer": 373,
  "format": "number",
  "pyVerify": "float(by_caching.loc['total_s', 'saved'])",
  "hint": "The saved value in the total_s row.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What should a dependency cache be keyed on?",
    "options": ["The date", "The lock file, so it's reused until dependencies change", "The branch name", "Nothing"],
    "answer": 1,
    "explanation": "Same lock file, same packages."
  },
  {
    "prompt": "Why do slow pipelines hurt beyond wasted minutes?",
    "options": ["They cost more electricity", "Developers batch changes to avoid waiting, making each release bigger and riskier", "They break tests", "They don't"],
    "answer": 1,
    "explanation": "Slow pipelines undo the small-batch habit."
  },
  {
    "prompt": "Which step should you speed up first?",
    "options": ["The smallest", "The one taking the most time that isn't deliberate safety time", "Checkout", "None"],
    "answer": 1,
    "explanation": "Measure, then target the biggest."
  }
]
```
