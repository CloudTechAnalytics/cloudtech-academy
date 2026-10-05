---
title: Monitoring with control limits
minutes: 25
summary: Set alert limits from each metric's own normal variation, so unusual days stand out automatically, and measure how much sooner Paystream would have found its incidents.
---

## The problem

On 14 July 2026, the model provider updated the model behind the name Paystream uses. Overnight, the assistant began refusing ordinary questions ("I'm not able to help with account matters") about three times as often as before. Paystream's dashboard showed it from the first day. Nobody was looking at the right number with a rule for what "unusual" means, so it took four days and a pile of customer complaints for anyone to act.

Dashboards don't detect problems. Alerts with sensible limits do.

## The concept

### Control limits

Every metric varies from day to day. A **control limit** marks the edge of normal variation:

> upper limit = recent average + 3 × recent standard deviation

computed over a **baseline** window, such as the previous 28 days. A day outside the limits is unusual enough to investigate.

![An illustrative daily refusal rate over six weeks with an average line and an upper limit from the first 28 days. From day 36 the rate jumps above the limit.](/images/courses/llmops/control-chart.svg "A control chart, illustrated: day 36 is outside normal variation.")

### Why from the metric's own history

A fixed rule like "alert if refusals pass 10%" is either too loose (a jump from 3% to 8% stays under it) or too tight (noisy days trigger it). Limits learned from the data fit each metric.

### Practical details

- Exclude known incident days from the baseline, so a problem doesn't raise its own limit.
- Weekly patterns (Sundays are quieter) can need separate baselines for each day of the week, or rates rather than counts.
- Use **rates** (refusals ÷ conversations) so busy days don't look alarming.
- Every alert needs an owner and a first step.

## Example

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/llmops/"
daily = pd.read_csv(base + "daily_metrics.csv", parse_dates=["date"])
daily["refusal_rate"] = daily["refusals"] / daily["conversations"]

baseline = daily["refusal_rate"].shift(1).rolling(28, min_periods=14)
daily["upper"] = baseline.mean() + 3 * baseline.std()
daily["alert"] = daily["refusal_rate"] > daily["upper"]

print("Days above the limit:", daily.loc[daily["alert"], "date"].dt.strftime("%d %b").tolist())
daily.set_index("date").loc["2026-07-10":"2026-07-21", ["refusal_rate", "upper", "alert"]].round(4)
```

```text
Days above the limit: ['14 Jul', '15 Jul', '16 Jul']
            refusal_rate   upper  alert
date
2026-07-10        0.0271  0.0367  False
2026-07-11        0.0269  0.0366  False
2026-07-12        0.0283  0.0367  False
2026-07-13        0.0278  0.0366  False
2026-07-14        0.0816  0.0365   True
2026-07-15        0.0885  0.0616   True
2026-07-16        0.0876  0.0778   True
2026-07-17        0.0806  0.0893  False
2026-07-18        0.0852  0.0967  False
2026-07-19        0.0850  0.1044  False
2026-07-20        0.0283  0.1110  False
2026-07-21        0.0281  0.1111  False
```

The alert fires on the very first day of the change. Notice also that the limit itself creeps up after the first bad day, because those days enter the baseline. That's why known incident days should be excluded once they're found. The same method on latency:

```python
daily["latency_upper"] = daily["p95_latency_ms"].shift(1).rolling(28, min_periods=14).mean() + 3 * daily["p95_latency_ms"].shift(1).rolling(28, min_periods=14).std()
print(daily.loc[daily["p95_latency_ms"] > daily["latency_upper"], ["date", "p95_latency_ms", "latency_upper"]].round(0).to_string(index=False))
```

```text
date  p95_latency_ms  latency_upper
2026-06-20           11800         3780.0
```

The outage day stands out clearly, which is why that incident was found the same day: a latency alert already existed. The refusal alert would have found the July incident four days sooner.

## Walkthrough

1. Run the cells. Compute the hand-over rate and set limits on it. Does it flag the July incident too?
2. Rebuild the refusal baseline excluding 14 to 19 July. How do the limits for later days change?
3. Try 2 standard deviations instead of 3. How many false alarms appear in May and June?
4. Write the alert definitions (the task below).

## Practice

```answer
{
  "id": "ops-07-p1",
  "prompt": "How many days are above the refusal rate's upper control limit?",
  "answer": 3,
  "format": "number",
  "dataset": "llmops",
  "files": ["daily_metrics"],
  "pyVerify": "int(daily['alert'].sum())",
  "hint": "Count the dates on the first line.",
  "required": true
}
```

```task
{
  "id": "ops-07-t1",
  "prompt": "Write **three alert definitions** for the assistant, one per line in the form **metric | rule | owner | first step**. Use rates, and base at least two rules on control limits.",
  "minutes": 6,
  "rows": 5,
  "placeholder": "Refusal rate | above 28-day mean + 3 SD | on-call AI engineer | ...",
  "rules": [
    { "label": "Three alerts in the form metric | rule | owner | first step", "pattern": "^[^|\\n]+\\|[^|\\n]+\\|[^|\\n]+\\|[^|\\n]+$", "min": 3 },
    { "label": "At least two control-limit rules (mean, SD, standard deviation, limit)", "pattern": "\\bSD\\b|standard deviation|control limit|mean \\+|sigma", "min": 2 },
    { "label": "Uses rates", "pattern": "rate|share|%|per conversation" },
    { "label": "Names owners", "pattern": "engineer|lead|on-call|owner|manager|team" }
  ],
  "sample": "Refusal rate | above the 28-day mean + 3 SD, excluding incident days | on-call AI engineer | compare today's refusals with last week's and check for a provider model update\nHand-over rate | above the 28-day mean + 3 SD for the day of the week | support operations lead | read 20 of today's hand-overs and look for a common cause\np95 latency | above 2 × the 28-day median for 30 minutes | on-call AI engineer | check the provider status page and switch to the backup model if the provider is down",
  "note": "The first step turns an alert into action. Without it, alerts get acknowledged and ignored.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What does a control limit of mean + 3 standard deviations mark?",
    "options": ["The target", "The edge of the metric's normal day-to-day variation", "The maximum possible value", "The average"],
    "answer": 1,
    "explanation": "Beyond it, a day is unusual enough to investigate."
  },
  {
    "prompt": "Why exclude incident days from the baseline?",
    "options": ["They're boring", "Otherwise the problem raises its own limit and later bad days stop alerting", "To save time", "They're always wrong"],
    "answer": 1,
    "explanation": "Bad days inflate the mean and spread."
  },
  {
    "prompt": "Why monitor the refusal rate rather than the number of refusals?",
    "options": ["Rates are smaller", "Busy days have more refusals simply because there are more conversations", "Counts can't be graphed", "It's cheaper"],
    "answer": 1,
    "explanation": "Rates separate real changes from changes in volume."
  }
]
```
