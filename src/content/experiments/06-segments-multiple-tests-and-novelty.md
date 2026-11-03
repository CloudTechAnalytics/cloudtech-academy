---
title: Segments, multiple tests and novelty
minutes: 25
summary: Look inside a result by segment without fooling yourself, correct for running many tests at once, and spot novelty effects that fade once users get used to a change.
---

## The problem

The onboarding result is in, and everyone wants to slice it. Marketing asks for it by acquisition channel, the regional managers by state, the mobile team by platform. Ten regions later, four show a "significant" effect and six don't. The Kano manager wants credit; the Delta manager wants to know what went wrong.

Meanwhile, the banner test (setting aside its broken split) showed a click rate far above control in its first week, which the marketing team is already quoting. By week three, the gap had gone.

Both are classic ways to over-read an experiment. Segment results are noisy, and every extra comparison is another chance of a false alarm. And people often react to something **new** in ways that don't last.

## The concept

### Segments: look, but carefully

- Each segment has fewer users, so its estimate is much noisier than the overall one.
- "Significant here, not there" doesn't mean the effect **differs** between segments. Compare the segments' effects directly, or look at whether their confidence intervals overlap.
- Trust a segment difference when it was **planned in advance**, is large, and has a **mechanism** (a reason it should differ).

### Multiple comparisons

Test 10 segments at α = 5% and, even with no real differences, you'd expect about one false alarm by chance. The simplest correction is **Bonferroni**: with m tests, use α ÷ m (here 0.05 ÷ 10 = 0.005) for each.

### Novelty effects

Existing users often click on something just because it's new. The effect fades as they get used to it. Plot the effect **by week**: if it shrinks towards zero, judge the change on the later weeks, or run the test longer.

![Bars of a banner's effect on clicks by week, illustrated: +9% in week 1, +5% in week 2, +2.6% in week 3 and +1.6% in week 4.](/images/courses/experiments/novelty.svg "A novelty effect, illustrated: the lift fades as users get used to the change.") (Its mirror image, a **primacy** effect, is when users first resist a change and then adapt.)

## Example

The onboarding effect by platform, where there's a reason to expect a difference (the new flow fixed an Android camera step):

```python
import pandas as pd
import numpy as np
from scipy import stats

base = "https://academy.cloudtechanalytics.com/datasets/experiments/"
onboarding = pd.read_csv(base + "onboarding.csv")

def effect(df):
    a = df.loc[df["variant"] == "A", "completed_kyc_7d"]
    b = df.loc[df["variant"] == "B", "completed_kyc_7d"]
    pooled = (a.sum() + b.sum()) / (len(a) + len(b))
    z = (b.mean() - a.mean()) / np.sqrt(pooled * (1 - pooled) * (1 / len(a) + 1 / len(b)))
    return pd.Series({"users": len(df), "effect_pts": round((b.mean() - a.mean()) * 100, 1), "p_value": round(2 * stats.norm.sf(abs(z)), 4)})

onboarding.groupby("platform").apply(effect, include_groups=False)
```

```text
users  effect_pts  p_value
platform
Android   9288.0         5.2   0.0000
iOS       2712.0         1.7   0.3745
```

The effect is much larger on Android, as the mechanism predicts. Now the regions, with no particular reason to expect differences:

```python
regions = onboarding.groupby("region").apply(effect, include_groups=False).sort_values("p_value")
regions["significant_at_5pct"] = regions["p_value"] < 0.05
regions["significant_bonferroni"] = regions["p_value"] < 0.05 / len(regions)
regions
```

```text
users  effect_pts  p_value  significant_at_5pct  significant_bonferroni
region
Kano     1249.0         9.7   0.0005                 True                    True
Kaduna    853.0         9.6   0.0038                 True                    True
Enugu     862.0         7.2   0.0329                 True                   False
Anambra   826.0         7.3   0.0347                 True                   False
Lagos    3120.0         2.7   0.1240                False                   False
Oyo      1018.0         3.2   0.2851                False                   False
Rivers   1098.0         3.2   0.2872                False                   False
Delta     977.0         3.1   0.3251                False                   False
Ogun      793.0         2.5   0.4748                False                   False
FCT      1204.0         0.7   0.7907                False                   False
```

The new flow works everywhere on average; the regional estimates scatter around the overall effect because each region is small. After the Bonferroni correction fewer regions pass, and nothing here suggests the flow works differently in Kano from Delta. Now the banner's novelty effect, by week:

```python
banner = pd.read_csv(base + "banner_daily.csv")
banner["week"] = (pd.to_datetime(banner["date"]) - pd.Timestamp("2026-06-01")).dt.days // 7 + 1
weekly = banner.groupby(["week", "variant"])[["users", "clicks"]].sum()
(weekly["clicks"] / weekly["users"]).unstack().round(4)
```

```text
variant       A       B
week
1        0.0308  0.0466
2        0.0304  0.0374
3        0.0316  0.0312
4        0.0305  0.0335
```

B's first-week click rate is far above A's, but by weeks three and four the two are close. The first week was novelty. (And remember lesson 3: this test's split is broken anyway.)

## Walkthrough

1. Run the cells. Compare the Android and iOS confidence intervals for the effect.
2. Check the effect by acquisition channel. Is there a mechanism that would make it differ?
3. Count how many regions you'd expect to be "significant" by chance alone if the flow did nothing.
4. Write what you'd tell the Kano and Delta managers (the task below).

## Practice

```answer
{
  "id": "ab-06-p1",
  "prompt": "What is the effect of the new flow on **Android** users, in percentage points? One decimal place.",
  "answer": 5.2,
  "format": "number",
  "dataset": "experiments",
  "files": ["onboarding"],
  "pyVerify": "float(effect(onboarding[onboarding['platform'] == 'Android'])['effect_pts'])",
  "hint": "The Android row of the first table.",
  "required": true
}
```

```answer
{
  "id": "ab-06-p2",
  "prompt": "How many regions are significant **after the Bonferroni correction**?",
  "answer": 2,
  "format": "number",
  "dataset": "experiments",
  "files": ["onboarding"],
  "pyVerify": "int(regions['significant_bonferroni'].sum())",
  "hint": "Count the True values in the significant_bonferroni column.",
  "required": true
}
```

```task
{
  "id": "ab-06-t1",
  "prompt": "The Delta regional manager asks why the new flow \"didn't work\" in Delta. Write a reply (40 to 110 words) explaining **noise in small segments**, **multiple comparisons**, and what the evidence actually says about Delta.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "The flow did work in Delta, as far as we can tell ...",
  "rules": [
    { "label": "Explains that segments are small or noisy", "pattern": "small|noisy|noise|fewer users|uncertain|wide" },
    { "label": "Mentions multiple comparisons (many regions, by chance, false alarm)", "pattern": "by chance|many (regions|tests|comparisons)|ten regions|10 regions|false alarm|multiple" },
    { "label": "Says the overall effect is the best estimate for Delta", "pattern": "overall|on average|across all|best estimate" },
    { "label": "Between 40 and 110 words", "minWords": 40, "maxWords": 110 }
  ],
  "sample": "The flow did work in Delta, as far as we can tell. Delta had fewer than 1,000 users in the test, so its estimate is noisy, and with ten regions some will look stronger or weaker than others purely by chance. Nothing in the data suggests the flow works differently in Delta: its result is consistent with the overall effect of about 4.5 points, which is our best estimate for every region. The difference that is real is between Android and iOS, because the new flow fixed an Android camera step.",
  "note": "Pointing to the real, explained difference (platform) helps the manager see why the regional one isn't.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "You test 20 segments at α = 5%, and the treatment does nothing. How many 'significant' results would you expect?",
    "options": ["0", "About 1", "About 5", "20"],
    "answer": 1,
    "explanation": "20 × 5% = 1 false alarm on average."
  },
  {
    "prompt": "What Bonferroni threshold would you use for 10 tests at an overall 5%?",
    "options": ["0.05", "0.005", "0.5", "0.10"],
    "answer": 1,
    "explanation": "0.05 ÷ 10."
  },
  {
    "prompt": "A new button's click rate is high in week 1 and back to normal by week 3. What is this?",
    "options": ["A primacy effect", "A novelty effect", "Sample ratio mismatch", "Seasonality"],
    "answer": 1,
    "explanation": "Judge the change on the later weeks."
  }
]
```
