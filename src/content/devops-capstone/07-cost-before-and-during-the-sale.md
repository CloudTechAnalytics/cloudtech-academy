---
title: Cost before and during the sale
minutes: 25
summary: Find the spend that buys nothing (idle machines and an always-on staging copy of production), price the readiness changes and the sale's extra capacity, and keep the savings away from resilience.
---

## The problem

The finance director has noticed the cloud bill creeping up and worries the sale preparations will push it higher. The readiness work does add cost: a bigger database and a pooler. But the inventory from lesson 1 showed spend that buys nothing. Find it, and price the sale honestly.

## The concept

**Waste first**

- **Idle resources**: machines that do nearly nothing, especially with no owner. Confirm with the team, snapshot if in doubt, then delete.
- **Always-on non-production**: staging used during working hours but paid for around the clock. Schedule it to run only when needed.

**Don't cut resilience**

A standby replica at 12% CPU isn't waste. It's there for the bad day. Low use isn't the same as no value.

**Price the change, and the peak**

Compare the monthly cost of the readiness changes with the savings. Price the sale's extra capacity per hour: autoscaling means you pay for 30 instances only while you need them.

## Example

Idle development resources:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/platform/"
resources = pd.read_csv(base + "resources.csv")
idle = resources[(resources["environment"] == "development") & (resources["avg_cpu_pct"] <= 2)]
print(idle[["name", "managed_by", "monthly_cost_usd", "avg_cpu_pct", "owner"]].to_string(index=False))
print(f"\nIdle: {len(idle)} machines, ${idle['monthly_cost_usd'].sum():,} a month")
```

```text
name managed_by  monthly_cost_usd  avg_cpu_pct owner
 temp-test-9     manual               280          2.0   NaN
temp-test-10     manual               280          2.0   NaN
temp-test-11     manual                70          2.0   NaN
temp-test-12  terraform               140          2.0   NaN
temp-test-13     manual               140          1.0   NaN
temp-test-14  terraform               280          2.0   NaN

Idle: 6 machines, $1,190 a month
```

Staging runs around the clock. The team uses it about 12 hours a day on weekdays:

```python
HOURS_IN_MONTH = 730
staging = resources[resources["environment"] == "staging"]
hours_needed = 12 * 5 * 52 / 12  # 12 hours a day, 5 days a week, averaged per month
schedule_saving = staging["monthly_cost_usd"].sum() * (1 - hours_needed / HOURS_IN_MONTH)
print(f"Staging: ${staging['monthly_cost_usd'].sum():,} a month; needed {hours_needed:.0f} of {HOURS_IN_MONTH} hours")
print(f"Scheduling it saves about ${schedule_saving:,.0f} a month")
```

```text
Staging: $2,700 a month; needed 260 of 730 hours
Scheduling it saves about $1,738 a month
```

Now the readiness changes and the sale itself:

```python
db_upgrade = 1150            # the 2xlarge costs about twice the current database
pooler = 30                  # a small PgBouncer machine
per_instance_hour = resources.loc[resources["name"] == "checkout-api", "monthly_cost_usd"].iloc[0] / 6 / HOURS_IN_MONTH
sale_extra = (30 - 6) * 12 * per_instance_hour
savings = idle["monthly_cost_usd"].sum() + schedule_saving
print(f"Readiness changes: +${db_upgrade + pooler:,} a month")
print(f"Savings: -${savings:,.0f} a month")
net = db_upgrade + pooler - savings
print(f"Net change: {'-' if net < 0 else '+'}${abs(net):,.0f} a month")
print(f"Running 30 checkout instances instead of 6 for 12 hours on sale day: about ${sale_extra:,.0f}")
```

```text
Readiness changes: +$1,180 a month
Savings: -$2,928 a month
Net change: -$1,748 a month
Running 30 checkout instances instead of 6 for 12 hours on sale day: about $55
```

The savings more than pay for the readiness changes, so the bill goes **down**. The sale's extra capacity costs less than a few minutes of lost checkout. Notice what isn't on the list: the orders-db replica, at 12% CPU, stays. It's the failover target.

## Walkthrough

1. Run the cells.
2. Check the idle machines with their teams. Which have no owner at all? What's your process before deleting (tag, warn, snapshot, delete)?
3. Should staging be scaled down to a smaller copy rather than scheduled? What would a load test in staging then need?
4. After the sale, should the database go back to the smaller size? What does lesson 5 say?
5. Write the cost note (the task below).

## Practice

```answer
{
  "id": "cdc-07-p1",
  "prompt": "How much do the **idle** development machines cost a month, in dollars?",
  "answer": 1190,
  "format": "number",
  "dataset": "platform",
  "files": ["resources"],
  "verify": "SELECT SUM(monthly_cost_usd) FROM resources WHERE environment = 'development' AND avg_cpu_pct <= 2",
  "hint": "The last line of the first cell.",
  "required": true
}
```

```answer
{
  "id": "cdc-07-p2",
  "prompt": "What is the estimated **net** monthly change in the bill (readiness changes minus savings), in dollars? (It's negative; a rounded figure is fine.)",
  "answer": -1748,
  "format": "number",
  "dataset": "platform",
  "files": ["resources"],
  "pyVerify": "round(net)",
  "tolerance": 5,
  "hint": "The Net change line.",
  "required": true
}
```

```task
{
  "id": "cdc-07-t1",
  "prompt": "Write the **cost note** for the finance director (50 to 130 words): the **savings** and where they come from, the **cost** of the readiness changes, the **net** effect, the sale's extra **capacity** cost, and what you're **not** cutting and why.",
  "minutes": 7,
  "rows": 6,
  "placeholder": "We'll save ...",
  "rules": [
    { "label": "Dollar figures", "pattern": "\\$\\s*[\\d,]+", "min": 3 },
    { "label": "Idle machines", "pattern": "idle|unused|temp" },
    { "label": "Staging schedule", "pattern": "staging" },
    { "label": "Net effect", "pattern": "net|overall|goes down|lower" },
    { "label": "Something not cut (replica, resilience)", "pattern": "replica|resilien|failover|not cut|keep" },
    { "label": "Between 50 and 130 words", "minWords": 50, "maxWords": 130 }
  ],
  "sample": "We'll save about $2,930 a month: $1,190 by deleting six idle test machines (nobody owns them and they use 2% CPU or less), and about $1,740 by running staging only in working hours. The readiness changes add $1,180 a month, mainly the larger database, so the bill goes down by about $1,750 a month overall. On sale day, running 30 checkout instances instead of 6 for 12 hours costs about $55, far less than a few minutes of failed checkouts. We're not cutting the orders-db replica: it looks underused at 12% CPU, but it's our failover target.",
  "note": "Lead with what finance asked about, and protect what keeps the sale up.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A standby database replica runs at 12% CPU. Should you delete it to save money?",
    "options": ["Yes", "No: it's there for failover, so low use is expected", "Only before the sale", "Only if it's manual"],
    "answer": 1,
    "explanation": "Resilience looks idle until it's needed."
  },
  {
    "prompt": "Why schedule staging rather than run it all the time?",
    "options": ["It breaks at night", "It's only used in working hours, so paying for the other hours buys nothing", "Security", "Terraform requires it"],
    "answer": 1,
    "explanation": "Pay for what you use."
  },
  {
    "prompt": "Why is autoscaling to 30 instances on sale day cheap?",
    "options": ["Instances are free on sale days", "You pay for the extra instances only for the hours they run", "The provider gives discounts", "It isn't"],
    "answer": 1,
    "explanation": "Elastic capacity is billed by the hour."
  }
]
```
