---
title: Feedback and sampled grading
minutes: 25
summary: Learn why thumbs-up and thumbs-down feedback is a weak quality signal, how a small daily sample graded by people measures accuracy properly, and how pooling days turns a noisy sample into an early warning.
---

## The problem

From 4 August 2026, the assistant started getting more answers wrong. A rebuild of the search index had left out six help articles, so questions on those topics were answered without the right article, or from the wrong one. It took twelve days and a customer's angry social media post before anyone noticed.

The team had been watching thumbs-down feedback, which barely moved. But they also had a better signal they weren't using: every day, a support lead graded a random sample of 30 conversations. This lesson is about using it properly.

## The concept

### Why feedback is weak

- Only a few per cent of customers click thumbs up or down.
- Those who do aren't typical: people click when they're annoyed, often about things the assistant can't change (fees, limits, policies).
- A wrong answer that sounds confident often gets a thumbs up.

Feedback is useful for finding examples to read, but it isn't a measure of accuracy.

### Sampled grading

A random sample of conversations, graded by trained people against the same standard as the regression suite. It's an unbiased estimate of live accuracy.

### Small samples are noisy, so pool them

With 30 graded conversations a day, one day's accuracy jumps around by many points. Pool several days: 7 days give 210 graded conversations and a much more stable estimate. Use the same control-limit idea as lesson 7, with the limit based on the sample size:

> lower limit = baseline accuracy − 3 × √(p(1 − p) / n)

## Example

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/llmops/"
daily = pd.read_csv(base + "daily_metrics.csv", parse_dates=["date"])
daily["feedback_rate"] = (daily["thumbs_up"] + daily["thumbs_down"]) / daily["conversations"]
daily["thumbs_down_share"] = daily["thumbs_down"] / (daily["thumbs_up"] + daily["thumbs_down"])
daily["graded_accuracy"] = daily["graded_correct"] / daily["graded_sample"]

print("Average share of conversations with feedback:", round(daily["feedback_rate"].mean(), 3))
period = np.where(daily["date"] < "2026-08-04", "before", np.where(daily["date"] <= "2026-08-17", "incident", "after"))
daily.groupby(period)[["thumbs_down_share", "graded_accuracy"]].mean().round(3)
```

```text
Average share of conversations with feedback: 0.04
          thumbs_down_share  graded_accuracy
after                 0.332            0.886
before                0.334            0.903
incident              0.369            0.788
```

Graded accuracy fell by around ten points during the incident; the thumbs-down share rose only a few points, within its normal wobble. Now pool the graded sample over a rolling 7 days and set a lower limit from the baseline (May to July, excluding the July incident):

```python
base_days = daily[(daily["date"] < "2026-08-01") & ~daily["date"].between("2026-07-14", "2026-07-19")]
p = base_days["graded_correct"].sum() / base_days["graded_sample"].sum()

roll = daily.set_index("date")[["graded_correct", "graded_sample"]].rolling(7).sum()
roll["accuracy_7d"] = roll["graded_correct"] / roll["graded_sample"]
roll["lower"] = p - 3 * np.sqrt(p * (1 - p) / roll["graded_sample"])
roll["alert"] = roll["accuracy_7d"] < roll["lower"]

print("Baseline accuracy:", round(p, 3))
print("First 7-day alert:", roll.index[roll["alert"]].min().date())
roll.loc["2026-08-02":"2026-08-12", ["accuracy_7d", "lower", "alert"]].round(3)
```

```text
Baseline accuracy: 0.903
First 7-day alert: 2026-08-08
            accuracy_7d  lower  alert
date
2026-08-02        0.910  0.842  False
2026-08-03        0.933  0.842  False
2026-08-04        0.924  0.842  False
2026-08-05        0.895  0.842  False
2026-08-06        0.862  0.842  False
2026-08-07        0.843  0.842  False
2026-08-08        0.838  0.842   True
2026-08-09        0.810  0.842   True
2026-08-10        0.786  0.842   True
2026-08-11        0.781  0.842   True
2026-08-12        0.790  0.842   True
```

The pooled sample raises the alarm within days of the index rebuild, against the twelve days it actually took. The daily sample was there all along; it needed pooling and a limit.

## Walkthrough

1. Run the cells. Try a 3-day and a 14-day window. Which detects the incident first? Which gives more false alarms in May and June?
2. Plot daily graded accuracy alone. Could you have spotted the incident by eye from single days?
3. Work out how many graded conversations a day you'd need to detect a 5-point drop within 3 days.
4. Write a short note on what feedback is still good for (the task below).

## Practice

```answer
{
  "id": "ops-08-p1",
  "prompt": "On what date does the rolling 7-day graded accuracy **first** fall below its lower limit? Give the day of the month in August.",
  "answer": 8,
  "format": "number",
  "dataset": "llmops",
  "files": ["daily_metrics"],
  "pyVerify": "int(roll.index[roll['alert']].min().day)",
  "hint": "The 'First 7-day alert' line.",
  "required": true
}
```

```task
{
  "id": "ops-08-t1",
  "prompt": "Write a short note for the support team (40 to 110 words) on **what thumbs feedback is and isn't good for**, and what they should rely on instead to **measure accuracy**.",
  "minutes": 5,
  "rows": 5,
  "placeholder": "Thumbs feedback is useful for ...",
  "rules": [
    { "label": "Says what feedback is good for (examples, reading, complaints)", "pattern": "example|read|complain|find|spot" },
    { "label": "Says why it isn't a measure (few, not typical, biased)", "pattern": "few|small share|not typical|biased|unrepresentative|annoyed|per cent|%" },
    { "label": "Names graded samples as the measure", "pattern": "grad|sample" },
    { "label": "Between 40 and 110 words", "minWords": 40, "maxWords": 110 }
  ],
  "sample": "Thumbs feedback is useful for finding conversations to read: a thumbs down often points to a confusing answer or a policy customers dislike. But only about 4% of customers leave feedback, and they aren't typical, so it can't tell us how accurate the assistant is. During the August incident, accuracy fell by around ten points while the thumbs-down share barely moved. To measure accuracy, rely on the 30 conversations graded every day, pooled over seven days, with an alert when they fall below the limit.",
  "note": "The note keeps feedback in its proper role, a source of examples, instead of dismissing it.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why is thumbs-down feedback a poor measure of accuracy?",
    "options": ["Customers lie", "Few customers give it, those who do aren't typical, and confident wrong answers often get thumbs up", "It's too expensive", "It's always positive"],
    "answer": 1,
    "explanation": "Use it for examples, not for measurement."
  },
  {
    "prompt": "Why pool graded samples over several days?",
    "options": ["To make the numbers bigger", "One day's 30 grades are too noisy; pooling gives a stable estimate that can detect real drops", "To save money", "Graders prefer it"],
    "answer": 1,
    "explanation": "Bigger samples mean tighter limits."
  },
  {
    "prompt": "What makes a graded sample unbiased?",
    "options": ["Choosing interesting conversations", "Choosing conversations at random and grading them against a fixed standard", "Letting customers choose", "Grading only complaints"],
    "answer": 1,
    "explanation": "Random selection is what makes the estimate fair."
  }
]
```
