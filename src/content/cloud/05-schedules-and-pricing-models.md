---
title: Schedules and pricing models
minutes: 25
summary: Stop paying for servers outside the hours they're used, and compare on-demand, committed and spot pricing for the servers that remain, with the risks of each.
---

## The problem

Tallybook's twelve development servers run 24 hours a day, 7 days a week. The engineers use them roughly from 7am to 6pm on weekdays: about a third of the hours in a week. The rest is paid for and wasted.

Meanwhile, the production servers that genuinely run all the time are paid at the full **on-demand** price. Cloud providers offer large discounts to customers who commit to a year of use, and even bigger ones for spare capacity that can be taken back at short notice. Tallybook uses neither.

## The concept

### Schedules

Stop non-production servers outside working hours and start them again in the morning, automatically. Their disks are kept, so nothing is lost. Engineers who need a server out of hours can start it themselves.

### Pricing models

| Model | Discount (illustrative) | Commitment | Good for |
| :-- | :-- | :-- | :-- |
| **On-demand** | none | none | unpredictable or short-lived use |
| **Committed use** (reservations, savings plans) | around 30 to 40% | pay for 1 or 3 years whether used or not | the steady baseline that always runs |
| **Spot** | around 60 to 70% | none, but the provider can reclaim the server at short notice | work that can be interrupted and retried |

### Commit only to the baseline

Commit to what runs every hour of the year (after rightsizing and clean-up), never to peaks. Over-commitment is paying for servers you no longer use.

![An illustrative day of server demand: a steady baseline in green for committed-use pricing, a daytime rise in blue for on-demand, and short batch jobs in gold for spot.](/images/courses/cloud/pricing-layers.svg "Match the pricing model to each layer of demand.")

## Example

The saving from scheduling the development servers to run 7am to 6pm on weekdays (August 2026 had 21 weekdays):

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/cloud/"
resources = pd.read_csv(base + "resources.csv")
util = pd.read_csv(base + "utilisation.csv", parse_dates=["hour"])

dev = resources[(resources["type"] == "vm") & resources["name"].str.startswith("dev-")]
HOURS_IN_AUGUST = 744
SCHEDULED_HOURS = 11 * 21          # 7am to 6pm, 21 weekdays

dev = dev.assign(current_usd=dev["hourly_usd"] * HOURS_IN_AUGUST, scheduled_usd=dev["hourly_usd"] * SCHEDULED_HOURS)
print("Development servers:", len(dev))
print("August cost now: $", round(dev["current_usd"].sum(), 2), "  with a schedule: $", round(dev["scheduled_usd"].sum(), 2))

u = util[util["resource_id"].isin(dev["resource_id"])]
in_hours = (u["hour"].dt.weekday < 5) & u["hour"].dt.hour.between(7, 17)
print("Average CPU in scheduled hours:", round(u.loc[in_hours, "cpu_pct"].mean(), 1), "  outside them:", round(u.loc[~in_hours, "cpu_pct"].mean(), 1))
```

```text
Development servers: 12
August cost now: $ 595.2   with a schedule: $ 184.8
Average CPU in scheduled hours: 24.5   outside them: 2.0
```

The usage data confirms the servers do almost nothing outside the schedule. Now the production baseline and pricing models, with illustrative discounts:

```python
prod = resources[(resources["type"] == "vm") & (resources["environment"] == "production")].copy()
prod["role"] = prod["name"].str.extract(r"prod-(\w+)-")[0]
monthly = prod.groupby("role")["hourly_usd"].sum() * 730

COMMITTED, SPOT = 0.35, 0.65     # illustrative discounts
options = pd.DataFrame({
    "on_demand": monthly,
    "committed_1yr": monthly * (1 - COMMITTED),
    "spot": monthly * (1 - SPOT),
}).round(2)
options
```

```text
on_demand  committed_1yr    spot
role
api         584.0         379.60  204.40
web         438.0         284.70  153.30
worker      219.0         142.35   76.65
```

Web and API servers must always be available, so they suit a commitment (after rightsizing the API servers, as in lesson 3, so you don't commit to the old size). The invoice workers process jobs from a queue: if a spot server is reclaimed, its job goes back on the queue and another server picks it up. That makes them good spot candidates, with one on-demand server kept as a floor.

## Walkthrough

1. Run the cells. How much would a schedule save over a full year?
2. Redo the commitment calculation using the rightsized API size from lesson 3.
3. Explain why committing for the web servers' month-end peak would be a mistake.
4. Write the recommendation (the task below).

## Practice

```answer
{
  "id": "cld-05-p1",
  "prompt": "How much would the schedule have saved on the development servers in **August**, in dollars? Two decimal places.",
  "answer": 410.4,
  "tolerance": 0.01,
  "format": "number",
  "dataset": "cloud",
  "files": ["resources"],
  "pyVerify": "round(dev['current_usd'].sum() - dev['scheduled_usd'].sum(), 2)",
  "hint": "Current cost minus scheduled cost.",
  "required": true
}
```

```task
{
  "id": "cld-05-t1",
  "prompt": "Recommend a **pricing model for each group** of servers (web, API, invoice workers, development, staging), one line each starting with the group and a colon, with the **reason** and any **risk**.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "Web: ...",
  "rules": [
    { "label": "A line for each of the five groups", "pattern": "^\\s*[-*]?\\s*(web|api|invoice workers|workers|development|dev|staging)\\s*:", "min": 5 },
    { "label": "Uses committed pricing somewhere", "pattern": "commit|reserv|savings plan" },
    { "label": "Uses spot somewhere", "pattern": "spot" },
    { "label": "Uses a schedule somewhere", "pattern": "schedul|stop (at|outside|overnight)|working hours" },
    { "label": "Names a risk (interrupt, reclaim, over-commit, lock-in)", "pattern": "interrupt|reclaim|over-?commit|lock|taken back|unused" }
  ],
  "sample": "Web: commit for 1 year to the 2 servers needed at all hours, and pay on-demand for anything above that, so the month-end peak isn't committed to.\nAPI: rightsize to large first, then commit for 1 year; the risk is committing before the new size has proved itself, so wait a month.\nInvoice workers: run on spot, with one on-demand server as a floor; if a spot server is reclaimed, its job returns to the queue.\nDevelopment: on-demand with a schedule, 7am to 6pm on weekdays; engineers can start a server out of hours.\nStaging: on-demand with a schedule, and rightsized to small, since it's only used when testing releases.",
  "note": "Commitments come last, after rightsizing and schedules, so you never commit to waste.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "What should you commit to on a 1-year plan?",
    "options": ["Your peak usage", "The steady baseline that runs every hour, after rightsizing and clean-up", "Development servers", "Everything"],
    "answer": 1,
    "explanation": "Commit to what you'll certainly use."
  },
  {
    "prompt": "Which work suits spot servers?",
    "options": ["The production database", "Queued jobs that can be retried if a server is taken back", "The load balancer", "The website"],
    "answer": 1,
    "explanation": "Spot capacity can be reclaimed at short notice."
  },
  {
    "prompt": "A schedule stops development servers at night. What happens to their data?",
    "options": ["It's deleted", "It's kept on their disks, and they start again in the morning", "It moves to another region", "It's emailed to the engineer"],
    "answer": 1,
    "explanation": "Stopping keeps the disk; only compute stops."
  }
]
```
