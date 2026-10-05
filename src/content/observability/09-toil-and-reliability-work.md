---
title: Toil and reliability work
minutes: 20
summary: Measure toil (repetitive manual operations work), decide what to automate first, and set the error budget policy and practices that keep reliability work from being crowded out.
---

## The problem

Tallybook's platform team is two engineers. Each month, a large part of their time goes on the same manual jobs: restarting a stuck worker, clearing logs when `/var` fills, dismissing pages they know are noise, answering "is the app down?" messages. That time isn't spent on the fixes that would stop those jobs recurring, so they recur. Site reliability engineering calls this **toil**, and treats it as something to measure and reduce.

## The concept

**Toil** is work that is manual, repetitive, automatable, reactive, and grows with the service, without making it better. Reviewing pull requests or writing postmortems isn't toil: it's engineering.

### Keep toil bounded

A common target: toil at most **half** of an operations team's time, the rest on engineering that removes future toil and improves reliability.

![Toil is manual, repetitive, automatable, reactive and grows with the service; examples of toil versus engineering, and a bar showing toil at most half of operations time](/images/courses/observability/toil.svg "Toil versus engineering, and the 50% limit.")

### Automate by return

Rank toil by hours per month and how automatable it is. Some of the biggest items aren't automation at all: deleting a noisy alert removes a task entirely.

### An error budget policy

Written in advance and agreed with the product side:

- when the budget is exhausted, feature releases pause except for fixes;
- every incident that uses more than a set share of the budget gets a postmortem and an action;
- reliability work is planned in each cycle, not only after incidents.

## Example

August's operations work:

```python
import pandas as pd

toil = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/observability/toil.csv")
toil["hours_per_month"] = toil["minutes_each"] * toil["times_per_month"] / 60
toil["is_toil"] = toil["category"] != "engineering"

total = toil["hours_per_month"].sum()
toil_hours = toil.loc[toil["is_toil"], "hours_per_month"].sum()
print(f"Operations work: {total:.1f} hours a month, of which toil {toil_hours:.1f} hours ({toil_hours / total:.0%})")
toil.sort_values("hours_per_month", ascending=False)[["task", "category", "automatable", "hours_per_month"]].round(1)
```

```text
Operations work: 41.0 hours a month, of which toil 24.2 hours (59%)
                                               task       category automatable  hours_per_month
9           Review pull requests for infrastructure    engineering          no              8.3
0                    Restart a stuck worker by hand       recovery         yes              5.5
6   Answer 'is the app down?' messages from support  communication      partly              5.0
11                    Improve monitoring dashboards    engineering          no              4.5
10                                Write postmortems    engineering          no              4.0
2          Acknowledge and dismiss WebHighCPU pages    alert noise         yes              3.7
3              Check HostDown pages for prod-web-04    alert noise         yes              3.0
1                    Clear old logs when /var fills    maintenance         yes              3.0
4                                Rotate access keys       security         yes              1.5
5                     Create accounts for new staff         access      partly              1.3
7                   Resize servers before month-end       capacity         yes              0.7
8                            Renew TLS certificates    maintenance         yes              0.5
```

Toil is most of the operations work here, well above the 50% target. The biggest items connect to earlier lessons: answering "is the app down?" (a status page and good alerts fix that), dismissing WebHighCPU pages (delete the alert), restarting workers and clearing logs (automate, or fix log rotation). How much would the first fixes remove?

```python
QUICK_WINS = ["Acknowledge and dismiss WebHighCPU pages", "Check HostDown pages for prod-web-04", "Clear old logs when /var fills", "Restart a stuck worker by hand"]
saved = toil.loc[toil["task"].isin(QUICK_WINS), "hours_per_month"].sum()
remaining = toil_hours - saved
print(f"Quick wins remove {saved:.1f} hours a month; toil falls to {remaining / (total - saved):.0%} of operations work")
```

```text
Quick wins remove 15.2 hours a month; toil falls to 35% of operations work
```

## Walkthrough

1. Run the cells. Which "partly" automatable task would you tackle next, and how?
2. Is "Review pull requests for infrastructure" toil? Why not?
3. Estimate the engineering time each quick win needs, and the months until it pays back.
4. Write the error budget policy (the task below).

## Practice

```answer
{
  "id": "obs-09-p1",
  "prompt": "How many **hours of toil** (everything except engineering) did the team do in August? One decimal place.",
  "answer": 24.2,
  "format": "number",
  "dataset": "observability",
  "files": ["toil"],
  "pyVerify": "round(toil_hours, 1)",
  "hint": "The toil figure on the first line.",
  "required": true
}
```

```task
{
  "id": "obs-09-t1",
  "prompt": "Write Tallybook's **error budget policy**, one rule per line starting with a dash: at least **four** rules covering what happens when the budget is **exhausted**, when a **postmortem** is required, how reliability work is **planned**, and who **agreed** the policy.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "- When the 30-day error budget is used up ...",
  "rules": [
    { "label": "At least four rules, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 4 },
    { "label": "Exhausted budget pauses features", "pattern": "(exhaust|used up|run out|spent)[^\\n]*(pause|freeze|stop|halt)" },
    { "label": "Postmortem threshold (a % of budget)", "pattern": "postmortem[^\\n]*\\d+\\s*%|\\d+\\s*%[^\\n]*postmortem" },
    { "label": "Planned reliability work (each cycle, sprint, %)", "pattern": "sprint|cycle|every (week|month)|\\d+\\s*% of (time|capacity)" },
    { "label": "Agreed by product or leadership", "pattern": "agree|sign|cto|product|head of" }
  ],
  "sample": "- When the 30-day availability or latency budget is used up, feature releases pause except for fixes and security updates until the budget recovers.\n- Any incident that uses more than 20% of a month's budget gets a blameless postmortem within five working days, with owned actions.\n- Every two-week cycle reserves at least 20% of the platform team's time for reliability and toil reduction.\n- Toil is measured monthly; if it passes 50% of operations time, the next cycle's top priority is reducing it.\n- This policy is agreed by the CTO and the head of product, and reviewed every quarter.",
  "note": "The last rule makes the policy binding: product leaders agreed to the pause before they needed it.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which is toil?",
    "options": ["Writing a postmortem", "Manually clearing logs every time a disk fills", "Designing a new service", "Reviewing a pull request"],
    "answer": 1,
    "explanation": "Manual, repetitive and automatable."
  },
  {
    "prompt": "What's often the fastest way to remove toil from noisy alerts?",
    "options": ["Automate the acknowledgement", "Delete or demote the alert", "Hire more people", "Silence the phone"],
    "answer": 1,
    "explanation": "Removing the task beats automating it."
  },
  {
    "prompt": "Why agree an error budget policy before you need it?",
    "options": ["It's a formality", "So pausing features is a pre-agreed rule, not an argument during a crisis", "Auditors require it", "To slow the team"],
    "answer": 1,
    "explanation": "Decide calmly, apply consistently."
  }
]
```
