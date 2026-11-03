---
title: Launch, monitoring and the presentation
minutes: 30
summary: Watch the assistant's first four weeks in production with control limits set from its first two weeks, catch a change nobody announced, trace it to its cause, and present the project to Shieldline's leadership.
---

## The problem

`large_v2` went live on 3 August 2026. For two weeks everything looked steady. Then the WhatsApp team switched on **voice notes**: customers can now speak their message, and a transcription service turns it into text before the assistant sees it. Nobody told the AI team. The release gate was passed on typed messages, so does the assistant still work?

`daily.csv` has the production metrics for the first 28 days, including the results of a daily **audit**: each day, a claims officer checks 40 random extractions against the original message.

## The concept

### Control limits from a stable period

Use the first two weeks as the baseline. For each metric, set an upper limit at the baseline mean plus three standard deviations. A day above it is very unlikely to be normal variation: investigate.

### Leading and lagging signals

| Signal | Arrives | Shows |
| :-- | :-- | :-- |
| Invalid JSON rate | At once | The model is struggling with the input |
| Audit error rate | Daily | Extractions are wrong, even when valid |
| Thumbs down | Hours to days | Customers are unhappy |
| p95 latency | At once | Replies are slowing |

The audit is the most important, because invalid JSON can stay low while valid-looking extractions are wrong. But it's also the noisiest, because each day's audit is small.

### From alert to cause

When a limit is breached, ask what changed on that day: a release, a new channel, a new kind of customer. Then compare the affected and unaffected messages.

![A metric with a control limit at baseline mean plus three standard deviations, signals that arrive at different speeds, and the steps from alert to cause](/images/courses/ai-capstone/monitoring-control.svg "Control limits from a stable period, and from alert to cause.")

## Example

The metrics, with limits from the first 14 days:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/assistant/"
daily = pd.read_csv(base + "daily.csv", parse_dates=["date"])
daily["invalid_rate"] = daily["invalid_json"] / daily["messages"]
daily["audit_error_rate"] = daily["audit_field_errors"] / daily["audited"]
daily["thumbs_down_rate"] = daily["thumbs_down"] / daily["messages"]

metrics = ["invalid_rate", "audit_error_rate", "thumbs_down_rate", "p95_latency_ms"]
baseline = daily.iloc[:14]
limits = baseline[metrics].mean() + 3 * baseline[metrics].std()
print("Upper limits:", limits.round(4).to_dict(), "\n")
for m in metrics:
    breaches = daily.loc[daily[m] > limits[m], "date"]
    first = breaches.min().date() if len(breaches) else "none"
    print(f"{m:17} days above the limit: {len(breaches):2}   first: {first}")
```

```text
Upper limits: {'invalid_rate': 0.0121, 'audit_error_rate': 0.1732, 'thumbs_down_rate': 0.0463, 'p95_latency_ms': 3726.4217}

invalid_rate      days above the limit: 13   first: 2026-08-18
audit_error_rate  days above the limit:  4   first: 2026-08-26
thumbs_down_rate  days above the limit: 13   first: 2026-08-17
p95_latency_ms    days above the limit:  0   first: none
```

Thumbs down and invalid JSON break out first, a day or two after 17 August, and stay above their limits. The audit error rate, the most important signal, breaches only from 26 August, nine days later. With just 40 checks a day it's noisy, so its limit is wide and only a large rise crosses it. A bigger daily audit, or a weekly rate pooled from the daily checks, would detect the change sooner. Latency never breaches. What changed?

```python
daily["week"] = (daily.index // 7) + 1
daily.groupby("week")[["voice_note_share", "invalid_rate", "audit_error_rate", "thumbs_down_rate", "p95_latency_ms"]].mean().round(3)
```

```text
voice_note_share  invalid_rate  audit_error_rate  thumbs_down_rate  p95_latency_ms
week
1                0.000         0.009             0.064             0.038        3141.143
2                0.000         0.007             0.064             0.039        3212.857
3                0.155         0.016             0.118             0.050        3181.286
4                0.317         0.023             0.182             0.063        3343.286
```

Voice notes started in week 3, and every quality metric moved with their share. Transcripts have no punctuation, more Pidgin and more spoken fillers. The assistant was never tested on them, so the release gate didn't cover them. The response:

1. **Contain**: route voice-note messages to a person (or ask the customer to confirm the extracted details) until fixed.
2. **Measure**: add a few hundred voice-note transcripts, with gold labels, to the evaluation set.
3. **Fix and gate**: change the prompt (or add a clean-up step) and rerun the full release gate, including the new transcripts.
4. **Prevent**: any new input channel must go through the AI team before launch.

## Walkthrough

1. Run the cells.
2. Plot the audit error rate by day with its limit line and mark day 15.
3. Write the incident note: what happened, when it was detected, the impact, the cause and the actions.
4. Plan the presentation for Shieldline's leadership: five slides at most.
5. Open the project brief on the course page and plan your submission.

## Practice

```dataset
{"dataset": "assistant", "files": ["messages", "policy", "questions", "redteam", "daily"]}
```

```answer
{
  "id": "aic-08-p1",
  "prompt": "On how many of the 28 days was the **audit error rate** above its upper limit?",
  "answer": 4,
  "format": "number",
  "dataset": "assistant",
  "files": ["daily"],
  "pyVerify": "int((daily['audit_error_rate'] > limits['audit_error_rate']).sum())",
  "hint": "The audit_error_rate line.",
  "required": true
}
```

```answer
{
  "id": "aic-08-p2",
  "prompt": "What was the average **audit error rate** in **week 4**? One decimal place, as a percentage.",
  "answer": 18.2,
  "format": "percent",
  "dataset": "assistant",
  "files": ["daily"],
  "pyVerify": "round(100 * daily.loc[daily['week'] == 4, 'audit_error_rate'].mean(), 1)",
  "hint": "The week 4 row, audit_error_rate, times 100.",
  "required": true
}
```

```task
{
  "id": "aic-08-t1",
  "prompt": "Write the **executive summary** for Shieldline's leadership (120 to 230 words): what the assistant **does**, the **evidence** it's ready (the gate), the **safeguards**, the **cost**, the **voice-note incident** and what you did, and the **next steps**.",
  "minutes": 12,
  "rows": 11,
  "placeholder": "Shieldline's WhatsApp assistant ...",
  "rules": [
    { "label": "Says what the assistant does", "pattern": "extract|read|answer|checklist|document" },
    { "label": "Uses numbers", "pattern": "\\d+(\\.\\d+)?", "min": 6 },
    { "label": "Cites the release gate", "pattern": "gate|requirement|tested" },
    { "label": "Safeguards (escalation, guardrail, rules, never)", "pattern": "escalat|guardrail|rule|never|person" },
    { "label": "Gives the cost in naira", "pattern": "₦\\s*\\d" },
    { "label": "Covers the voice-note incident", "pattern": "voice" },
    { "label": "Next steps", "pattern": "next|will|plan" },
    { "label": "Between 120 and 230 words", "minWords": 120, "maxWords": 230 }
  ],
  "sample": "Shieldline's WhatsApp assistant reads a customer's first message about an incident, extracts the claim details, tells them exactly which documents are still needed, answers policy questions from the policy wording, and hands serious cases to a person.\n\nBefore launch, the chosen configuration passed every requirement of our release gate on 600 real messages: 99.7% valid outputs, 96.2% claim type accuracy (93.2% in Pidgin), 100% of cases needing a person escalated, and 1 of 120 red-team attacks succeeding. It costs about ₦79,000 a month at current volumes.\n\nSafeguards: it can never approve, reject or promise payment; injuries, theft, large amounts and angry customers always go to a person by rule; and the guardrail routes flagged messages to people rather than dropping them, with false alarms under 4% in English and Pidgin.\n\nIn week 3, the WhatsApp team switched on voice notes without telling us. Customer thumbs-down and invalid outputs rose above their control limits within two days, and the daily audit showed extraction errors nearly tripling by week 4. We routed voice notes to people and are adding transcripts to the test set.\n\nNext: fix and re-gate voice notes, improve Pidgin retrieval, and require every new channel to pass the gate before launch.",
  "note": "The incident makes the case stronger, not weaker: it shows the monitoring works.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why set control limits from the first two weeks?",
    "options": ["They're the busiest", "They're a stable period that shows normal variation, so later departures stand out", "It's the law", "They have the most errors"],
    "answer": 1,
    "explanation": "Limits describe normal; breaches are what isn't."
  },
  {
    "prompt": "Invalid JSON stays fairly low, but audit errors jump. What does that tell you?",
    "options": ["All is well", "Outputs can be valid in form but wrong in content, so audits of content are essential", "The audit is broken", "JSON doesn't matter"],
    "answer": 1,
    "explanation": "Valid isn't the same as correct."
  },
  {
    "prompt": "The release gate passed, yet quality fell after voice notes launched. Why?",
    "options": ["The gate was wrong", "The input changed to something the gate never tested", "The model degraded by itself", "Customers changed language"],
    "answer": 1,
    "explanation": "A gate only covers what it tests; new inputs need new tests."
  }
]
```
