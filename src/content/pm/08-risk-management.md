---
title: Risk management
minutes: 25
summary: Keep a risk register that drives decisions, rank risks by expected monetary value and schedule impact, size a contingency reserve, and choose responses that change the odds or the impact.
---

## The problem

The depot project's risk register was written in week 1 and never opened again. Two of its risks have already happened: the permits were delayed and the naira weakened. The register had suggested responses for both: hire a permit agent, buy dollars forward. Neither was done.

A risk register isn't paperwork. Used weekly, it's how a project manager spends money **before** problems happen, when it's cheapest.

## The concept

### Risks and issues

A **risk** might happen; an **issue** has happened. When a risk happens it becomes an issue, and its response becomes urgent.

### Expected monetary value (EMV)

> EMV = probability × impact

A 40% chance of a ₦3 million cost has an EMV of ₦1.2 million. Ranking by EMV puts likely-and-costly risks first. Do the same for **days**: probability × delay.

### Responses

| Response | Example |
| :-- | :-- |
| **Avoid** | change the plan so the risk can't happen |
| **Reduce** | lower the probability or impact (a permit agent, a generator) |
| **Transfer** | insurance, fixed-price contracts, forward currency purchase |
| **Accept** | keep money and time in reserve |

### Contingency

A reserve of money (and time) for **identified** risks, roughly their total EMV, held by the project manager and released only when a risk happens.

![A table of four example risks ranked by expected monetary value (probability times impact) with a total EMV of 2.2 million naira as contingency, and the four responses: avoid, reduce, transfer, accept](/images/courses/pm/risk-emv.svg "EMV = probability × impact ranks risks and sizes the contingency; four possible responses.")

## Example

The register, ranked:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/project/"
risks = pd.read_csv(base + "risks.csv")
risks["emv_ngn"] = risks["probability"] * risks["impact_ngn"]
risks["expected_days"] = risks["probability"] * risks["impact_days"]
print(f"Contingency for identified risks (total EMV): ₦{risks['emv_ngn'].sum():,.0f}")
print(f"Expected delay from identified risks: {risks['expected_days'].sum():.1f} working days")
risks.sort_values("emv_ngn", ascending=False)[["risk_id", "description", "probability", "impact_ngn", "emv_ngn", "expected_days"]].head(6)
```

```text
Contingency for identified risks (total EMV): ₦11,250,000
Expected delay from identified risks: 17.1 working days
  risk_id                                        description  probability  impact_ngn    emv_ngn  expected_days
1     R02  Naira weakens further, raising imported equipm...         0.50     6000000  3000000.0            0.0
9     R10  Opening slips into the December peak, losing s...         0.25    12000000  3000000.0            0.0
4     R05           Grid power too unreliable for the system         0.70     2000000  1400000.0            0.0
0     R01  Permits are delayed further by the planning of...         0.40     3000000  1200000.0            6.0
2     R03                         Racking damaged in transit         0.10     9000000   900000.0            2.0
8     R09                 Theft from the site during fit-out         0.15     2500000   375000.0            0.0
```

The biggest cost risks are the weaker naira and missing the December peak; the biggest schedule risk is the permits (already partly happened). Now: was reducing them worth it? Compare a response's cost with how much it lowers the EMV:

```python
responses = pd.DataFrame([
    {"risk_id": "R02", "response": "Buy dollars forward for remaining imports", "cost_ngn": 400_000, "new_probability": 0.1},
    {"risk_id": "R01", "response": "Hire a permit agent", "cost_ngn": 600_000, "new_probability": 0.15},
    {"risk_id": "R09", "response": "Security guards from day one of fit-out", "cost_ngn": 450_000, "new_probability": 0.05},
]).merge(risks[["risk_id", "probability", "impact_ngn", "emv_ngn"]], on="risk_id")
responses["new_emv_ngn"] = responses["new_probability"] * responses["impact_ngn"]
responses["emv_saved_ngn"] = responses["emv_ngn"] - responses["new_emv_ngn"]
responses["worth_it"] = responses["emv_saved_ngn"] > responses["cost_ngn"]
responses[["risk_id", "response", "cost_ngn", "emv_saved_ngn", "worth_it"]]
```

```text
risk_id                                   response  cost_ngn  emv_saved_ngn  worth_it
0     R02  Buy dollars forward for remaining imports    400000      2400000.0      True
1     R01                        Hire a permit agent    600000       750000.0      True
2     R09    Security guards from day one of fit-out    450000       250000.0     False
```

Buying dollars forward would have saved far more than it cost; that's the response that wasn't done, and lesson 6 showed the price. The permit agent pays for itself too, before even counting the days it saves. Guards against theft don't pay on money alone, but might still be worth it for safety and for protecting the schedule.

## Walkthrough

1. Run the cells. Which risks are already issues? Update their probability to 1 and rerun.
2. Add a risk you think is missing, with a probability, impact and response.
3. Is a contingency of the total EMV enough? When would you hold more?
4. Write the risk review notes (the task below).

## Practice

```answer
{
  "id": "pmf-08-p1",
  "prompt": "What is the total **EMV** of the risk register, in naira?",
  "answer": 11250000,
  "format": "naira",
  "dataset": "project",
  "files": ["risks"],
  "pyVerify": "float(risks['emv_ngn'].sum())",
  "hint": "The first line printed.",
  "required": true
}
```

```task
{
  "id": "pmf-08-t1",
  "prompt": "Write the **week 10 risk review**, one line per risk starting with its ID: at least **four** risks, each with its **status** (open, happened, closed), the **response**, its **type** (avoid, reduce, transfer or accept) and an **owner**.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "R01: happened ...",
  "rules": [
    { "label": "At least four risk lines", "pattern": "^\\s*[-*]?\\s*R\\d{2}\\b", "min": 4 },
    { "label": "Statuses (open, happened, closed)", "pattern": "open|happened|closed|issue", "min": 4 },
    { "label": "Response types", "pattern": "avoid|reduce|transfer|accept", "min": 4 },
    { "label": "Owners", "pattern": "owner|operations|finance|procurement|hr|it\\b|facilities", "min": 4 },
    { "label": "R02 handled (naira, forward, dollars)", "pattern": "R02[^\\n]*(forward|dollar|naira|hedg)" }
  ],
  "sample": "R01: happened (permits took 9 extra days); reduce: permit agent hired for the trading permit renewal; owner Operations.\nR02: happened (racking and IT costs rose); transfer: buy dollars forward for the remaining imports this week; owner Finance.\nR05: open; reduce: generator and solar backup (B6) stays in scope; owner Facilities.\nR10: open and rising, because the forecast is near the deadline; reduce: approve weekend fit-out working; owner Operations.\nR03: closed for racking already delivered; accept the remaining 14%; owner Procurement.",
  "note": "Updating statuses weekly is what turns the register from a document into a tool.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A risk has a 25% chance of costing ₦8 million. What's its EMV?",
    "options": ["₦8m", "₦2m", "₦0.25m", "₦32m"],
    "answer": 1,
    "explanation": "0.25 × ₦8m."
  },
  {
    "prompt": "Buying dollars forward to protect against the naira weakening is which response?",
    "options": ["Avoid", "Transfer", "Accept", "Ignore"],
    "answer": 1,
    "explanation": "The currency risk passes to the counterparty."
  },
  {
    "prompt": "When is a risk response worth paying for, on money alone?",
    "options": ["Always", "When it lowers the EMV by more than it costs", "Never", "When the sponsor likes it"],
    "answer": 1,
    "explanation": "Compare the cost with the expected saving."
  }
]
```
