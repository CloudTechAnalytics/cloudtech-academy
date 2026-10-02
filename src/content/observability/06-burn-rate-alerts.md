---
title: Burn-rate alerts
minutes: 25
summary: Alert on how fast the error budget is being spent rather than on fixed thresholds, compute burn rates over short and long windows, and see when each alert would have fired on 31 August.
---

## The problem

A fixed alert like "error rate above 1%" is either too sensitive (paging for a 2-minute blip at 3am) or too slow (missing a steady 0.5% that quietly eats the month's budget). The SLO already says how much failure is acceptable. Alerts should fire when the budget is being spent **too fast**.

## The concept

**Burn rate**

Burn rate = observed error rate ÷ the error rate the SLO allows. With a 99.9% SLO, the allowed rate is 0.1%:

| Error rate | Burn rate | A 30-day budget lasts |
| :-- | :-- | :-- |
| 0.1% | 1× | 30 days |
| 1% | 10× | 3 days |
| 1.44% | 14.4× | about 2 days: **2% of the budget in one hour** |

**Multi-window alerts**

Page when **both** a long and a short window are burning fast:

- the **1-hour** burn rate is above 14.4 (a serious amount of budget is going), **and**
- the **5-minute** burn rate is above 14.4 (it's still happening now, not a past blip).

The long window prevents paging on blips; the short window lets the alert clear quickly once the problem stops. Slower burns (for example 6× over 6 hours) open a ticket rather than paging.

## Example

Per-minute burn rate on 31 August, then both windows:

```python
import pandas as pd

metrics = pd.read_csv("https://academy.cloudtechanalytics.com/datasets/observability/metrics.csv", parse_dates=["minute"])
web = metrics[metrics["service"] == "web"].set_index("minute")[["requests", "errors"]]

ALLOWED = 0.001   # 99.9% SLO

def burn(window_minutes):
    rolled = web.rolling(window_minutes).sum()
    return (rolled["errors"] / rolled["requests"]) / ALLOWED

web["burn_1h"] = burn(60)
web["burn_5m"] = burn(5)
web["page"] = (web["burn_1h"] > 14.4) & (web["burn_5m"] > 14.4)

fired = web.index[web["page"]]
print("Burn-rate page fires at", fired.min().strftime("%H:%M"), "and clears after", fired.max().strftime("%H:%M"))
web.loc["2026-08-31 09:38":"2026-08-31 09:46", ["burn_5m", "burn_1h", "page"]].round(1)
```

```text
Burn-rate page fires at 09:42 and clears after 10:37
                     burn_5m  burn_1h   page
minute
2026-08-31 09:38:00      0.7      0.6  False
2026-08-31 09:39:00      0.7      0.6  False
2026-08-31 09:40:00     60.7      5.6  False
2026-08-31 09:41:00    113.2     10.0  False
2026-08-31 09:42:00    176.0     15.3   True
2026-08-31 09:43:00    228.6     19.8   True
2026-08-31 09:44:00    277.1     23.8   True
2026-08-31 09:45:00    272.5     28.3   True
2026-08-31 09:46:00    270.8     32.4   True
```

The alert fires within a couple of minutes of the bulk job starting, and stops soon after the fix. Compare a naive alert that pages whenever a single minute's error rate is above 1%, over the quiet early morning:

```python
web["naive"] = (web["errors"] / web["requests"]) > 0.01
print("Naive alert minutes:", int(web["naive"].sum()), " burn-rate alert minutes:", int(web["page"].sum()))
print("Highest 1-hour burn rate before 09:00:", round(web.loc[:"2026-08-31 08:59", "burn_1h"].max(), 2))
```

```text
Naive alert minutes: 54  burn-rate alert minutes: 56
Highest 1-hour burn rate before 09:00: 0.71
```

On this day, both agree on the incident, but look at the morning: before 09:00 the budget burned at well under 1×. A burn-rate rule stays quiet when nothing threatens the SLO, however a single minute looks, and the same rule works for any traffic level.

## Walkthrough

1. Run the cells. Add a ticket-level alert: 6-hour burn rate above 6 and 30-minute above 6. Does it fire on 31 August?
2. What error rate corresponds to a burn rate of 14.4 under a 99.5% SLO?
3. Change the short window to 15 minutes. How much later does the page clear?
4. Write the alert rules (the task below).

## Practice

```answer
{
  "id": "obs-06-p1",
  "prompt": "For how many minutes is the burn-rate page condition true on 31 August?",
  "answer": 56,
  "format": "number",
  "dataset": "observability",
  "files": ["metrics"],
  "pyVerify": "int(web['page'].sum())",
  "hint": "The burn-rate alert minutes in the second output.",
  "required": true
}
```

```task
{
  "id": "obs-06-t1",
  "prompt": "Write Tallybook's **SLO alert rules**, one per line starting with **PAGE:** or **TICKET:**, at least **two** rules with **burn rates** and **two windows** each, plus a line starting **Route:** saying who receives each.",
  "minutes": 6,
  "rows": 5,
  "placeholder": "PAGE: ...",
  "rules": [
    { "label": "A PAGE line", "pattern": "^\\s*PAGE\\s*:" },
    { "label": "A TICKET line", "pattern": "^\\s*TICKET\\s*:" },
    { "label": "Burn-rate numbers", "pattern": "\\d+(\\.\\d+)?\\s*(x|×|times)|burn rate (above|over|>)\\s*\\d", "min": 2 },
    { "label": "Two windows per rule (h and m)", "pattern": "\\d+\\s*(h|hour)[^\\n]*\\d+\\s*(m\\b|min)|\\d+\\s*(m\\b|min)[^\\n]*\\d+\\s*(h|hour)", "min": 2 },
    { "label": "A Route line", "pattern": "^\\s*route\\s*:" }
  ],
  "sample": "PAGE: availability burn rate above 14.4 over 1 hour and above 14.4 over 5 minutes.\nPAGE: latency (requests over 1 s) burn rate above 14.4 over 1 hour and over 5 minutes.\nTICKET: availability burn rate above 6 over 6 hours and above 6 over 30 minutes.\nRoute: pages go to the on-call engineer's phone at any hour; tickets go to the platform team's queue for the next working day.",
  "note": "Two pages, both about what users experience; everything slower becomes a ticket. That's the core of a quiet, useful on-call.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "With a 99.9% SLO, an error rate of 1% is what burn rate?",
    "options": ["1×", "10×", "0.1×", "100×"],
    "answer": 1,
    "explanation": "1% ÷ 0.1%."
  },
  {
    "prompt": "Why combine a long and a short window?",
    "options": ["To page twice", "The long window ignores blips; the short one lets the alert clear soon after the problem stops", "Tools require it", "To save money"],
    "answer": 1,
    "explanation": "Significant and current."
  },
  {
    "prompt": "A slow burn would exhaust the budget in two weeks. Page or ticket?",
    "options": ["Page immediately at night", "Ticket: important, but it can wait for working hours", "Ignore it", "Restart everything"],
    "answer": 1,
    "explanation": "Page only for what needs action now."
  }
]
```
