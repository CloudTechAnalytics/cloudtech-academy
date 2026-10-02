---
title: Scaling with demand
minutes: 25
summary: Use hourly traffic to see why a fixed number of servers is both too many most of the time and too few at month-end, and design autoscaling rules that fix both.
---

## The problem

Tallybook runs exactly six web servers, all day, every day. At 3am on a Sunday, they're almost idle. On 28 and 31 August, when businesses rushed to send their month-end invoices, traffic nearly doubled, six servers weren't enough, and the app slowed until pages took several seconds to load. Customers couldn't send invoices on the most important days of their month.

The same fixed fleet is wasteful and too small. **Autoscaling** adjusts the number of servers to the traffic.

## The concept

**Capacity**

Each web server can handle about 9,000 requests an hour at full load. Running servers at 100% makes responses slow, so you aim for a **target utilisation**, such as 60%, leaving headroom for sudden rises.

**Servers needed** = requests per hour ÷ (9,000 × target utilisation), rounded up, never below a **minimum** (for resilience, at least 2, in different zones).

**Autoscaling rules**

- **Target tracking**: keep average CPU near a target by adding or removing servers.
- **Scheduled scaling**: add capacity before known peaks (month-end mornings), because new servers take a few minutes to start.
- **Limits**: a minimum for resilience, a maximum to cap cost if something goes wrong.

**Latency and load**

Response time rises slowly as utilisation grows, then sharply as servers approach full load. Watching p95 latency against utilisation shows where the danger zone starts.

## Example

```python
import numpy as np
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/cloud/"
traffic = pd.read_csv(base + "web_traffic.csv", parse_dates=["hour"])
CAPACITY = 9_000

traffic["utilisation"] = traffic["requests"] / (traffic["web_servers"] * CAPACITY)
bands = pd.cut(traffic["utilisation"], [0, 0.25, 0.5, 0.75, 0.9, 2])
print(traffic.groupby(bands, observed=True)["p95_latency_ms"].agg(["count", "median", "max"]).round(0))

slow = traffic[traffic["p95_latency_ms"] > 1000]
print("Hours with p95 above 1 second:", len(slow), "on", sorted(slow["hour"].dt.strftime("%d %b").unique()))
```

```text
count  median   max
utilisation
(0.0, 0.25]    464   197.0   246
(0.25, 0.5]    132   262.0   334
(0.5, 0.75]    130   346.0   531
(0.75, 0.9]      3  1042.0  1187
(0.9, 2.0]      15  3361.0  3377
Hours with p95 above 1 second: 17 on ['28 Aug', '31 Aug']
```

Below about 75% utilisation, latency stays low. Above it, responses slow sharply, and every slow hour was on the two month-end days. Now simulate autoscaling with a 60% target and a minimum of 2 servers:

```python
TARGET, MINIMUM = 0.6, 2
traffic["servers_needed"] = np.maximum(MINIMUM, np.ceil(traffic["requests"] / (CAPACITY * TARGET))).astype(int)

fixed_hours = traffic["web_servers"].sum()
auto_hours = traffic["servers_needed"].sum()
print("Server-hours in August: fixed", fixed_hours, " autoscaled", auto_hours)
print("Most servers needed in one hour:", traffic["servers_needed"].max())
print("Monthly web compute at $0.10 an hour: fixed $", round(fixed_hours * 0.10, 2), " autoscaled $", round(auto_hours * 0.10, 2))
```

```text
Server-hours in August: fixed 4464  autoscaled 2529
Most servers needed in one hour: 12
Monthly web compute at $0.10 an hour: fixed $ 446.4  autoscaled $ 252.9
```

Autoscaling uses far fewer server-hours over the month, and at month-end it runs about twice the fixed fleet, keeping utilisation near the target when it matters most. It's cheaper and more reliable at the same time.

## Walkthrough

1. Run the cells. Plot requests and servers needed for the last week of August.
2. Change the target to 75%. How many server-hours does it save, and what does it risk?
3. New servers take about 5 minutes to start. Which hours would need scheduled scaling ahead of time?
4. Write the autoscaling rules (the task below).

## Practice

```answer
{
  "id": "cld-06-p1",
  "prompt": "How many **web server-hours** would autoscaling have used in August?",
  "answer": 2529,
  "format": "number",
  "dataset": "cloud",
  "files": ["web_traffic"],
  "pyVerify": "int(traffic['servers_needed'].sum())",
  "hint": "The autoscaled figure on the first line.",
  "required": true
}
```

```answer
{
  "id": "cld-06-p2",
  "prompt": "What is the **most** web servers needed in any hour?",
  "answer": 12,
  "format": "number",
  "dataset": "cloud",
  "files": ["web_traffic"],
  "pyVerify": "int(traffic['servers_needed'].max())",
  "hint": "The second line.",
  "required": true
}
```

```task
{
  "id": "cld-06-t1",
  "prompt": "Write Tallybook's **autoscaling rules** for the web servers, one per line starting with a dash: a **target** utilisation, a **minimum** (and why), a **maximum**, a **scheduled** rule for month-end, and an **alert**.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "- Target: ...",
  "rules": [
    { "label": "At least five rules, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 5 },
    { "label": "A target utilisation as a percentage", "pattern": "target[^\\n]*\\d+\\s*%" },
    { "label": "A minimum with a reason (zones, resilience)", "pattern": "minimum[^\\n]*(zone|resilien|fail|redundan)" },
    { "label": "A maximum", "pattern": "maximum|max\\b|cap" },
    { "label": "A scheduled month-end rule", "pattern": "schedul[^\\n]*(month[- ]end|end of the month|last)|month[- ]end[^\\n]*schedul" },
    { "label": "An alert", "pattern": "alert|notify|page" }
  ],
  "sample": "- Target: keep average CPU across web servers near 60%, adding servers above it and removing them below it.\n- Minimum: 2 servers at all times, in different zones, so one zone failing doesn't take the app down.\n- Maximum: 16 servers, so a bug or an attack can't run up an unlimited bill.\n- Scheduled: from 7am on the last two working days of each month, start with at least 10 servers, before traffic arrives.\n- Alert: notify the on-call engineer if the fleet stays at the maximum for 15 minutes or p95 latency passes 1 second.",
  "note": "The scheduled rule matters because scaling reacts after traffic arrives, and new servers take minutes to start.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why aim for 60% utilisation rather than 100%?",
    "options": ["To waste money", "Response times rise sharply near full load, and headroom absorbs sudden rises", "Providers require it", "Servers break at 100%"],
    "answer": 1,
    "explanation": "Headroom keeps the app fast."
  },
  {
    "prompt": "Why keep a minimum of 2 servers in different zones?",
    "options": ["It's cheaper", "So one server or zone failing doesn't take the app down", "Autoscaling needs an even number", "For backups"],
    "answer": 1,
    "explanation": "Minimums are about resilience."
  },
  {
    "prompt": "Why add scheduled scaling before month-end?",
    "options": ["It's free", "New servers take minutes to start, so capacity should be ready before the known peak", "Autoscaling doesn't work at month-end", "To test the servers"],
    "answer": 1,
    "explanation": "React to the unknown; schedule for the known."
  }
]
```
