---
title: Cost and Budget Management
minutes: 20
summary: Estimate cost, build a budget with contingency, control spending and use earned value basics to see whether a project is on track.
---

## Estimating cost

A cost estimate predicts what the project's work will cost. Include **all** costs:

- **Labour:** salaries, wages, contractors and consultants, including overheads where relevant.
- **Materials and equipment:** purchase or hire.
- **Services and subcontractors.**
- **Travel, accommodation and logistics.**
- **Permits, licences and fees.**
- **Training and communication.**
- **Software and tools.**
- **Taxes and duties.**
- **Risk and contingency.**
- **Costs after the project:** operation, maintenance and support (often the biggest).

Methods:

- **Analogous:** based on similar past projects (fast, rough).
- **Parametric:** a rate times quantity (₦ per square metre, ₦ per day).
- **Bottom-up:** estimate each work package and add them (most accurate, more work).
- **Three-point:** (O + 4M + P) ÷ 6, as for time.
- **Vendor quotes:** get written quotes for major items.

Estimates improve as the project becomes clearer. An early estimate may be ±30%; a detailed one ±10%. State your **assumptions** and the **accuracy.** Use **current prices** and allow for inflation and exchange rate movement where inputs are imported.

## Building a budget

A **budget** is the approved estimate, spread over time, with an agreed total. Steps:

1. Estimate the cost of each **work package.**
2. Add them up for the **base cost.**
3. Add **contingency** for known risks and uncertainty. A common range is 5% to 15% for simple projects and more for risky ones.
4. Possibly add a **management reserve,** held by the sponsor for unknown unknowns.
5. Spread the cost over the schedule to create the **cost baseline** and a cash-flow view.
6. Get approval.

Example: the base cost is **₦4,500,000.** Contingency at **10%** = ₦450,000. Budget = **₦4,950,000.**

Include a **cash flow forecast:** when money must be paid (deposits, milestones, salaries), because a project can run short of cash even when the total is affordable.

## Cost control and contingency

**Controlling cost** means tracking actual spending against the budget, understanding differences and taking action.

- **Record all commitments and payments** promptly, including purchase orders, not just invoices.
- **Compare** actual versus planned **regularly** (weekly or monthly).
- **Investigate variances:** why are we over or under?
- **Forecast the final cost** based on what has happened, not what you hoped.
- **Manage changes** through change control (module 7); every change has a cost.
- **Use contingency only for approved reasons** and record each use. If contingency is used early, the risks ahead are unprotected.
- **Negotiate and buy well** (see procurement).
- **Stop the leaks:** rework, waiting, and unnecessary meetings.

Report cost problems **early.** A sponsor can help with a 5% problem; at 50% they cannot.

## Earned value basics

**Earned value management (EVM)** combines scope, schedule and cost in one view. It answers: *Are we getting the value we planned for the money and time spent?*

Three numbers:

- **Planned value (PV):** the budgeted cost of the work **planned** to be done by now.
- **Earned value (EV):** the budgeted cost of the work **actually completed** by now.
- **Actual cost (AC):** what we have **actually spent** by now.

Indices:

- **Cost Performance Index (CPI) = EV ÷ AC.** Below 1 means over budget.
- **Schedule Performance Index (SPI) = EV ÷ PV.** Below 1 means behind schedule.
- **Cost variance (CV) = EV − AC** and **Schedule variance (SV) = EV − PV.**
- **Estimate at completion (EAC) = BAC ÷ CPI** (a simple forecast if the current efficiency continues), where **BAC** is the budget at completion.

Example: BAC = **₦1,000,000.** By now, 50% of the work was planned and **40%** is actually done, with **₦500,000** spent.

- PV = 50% × 1,000,000 = **₦500,000.**
- EV = 40% × 1,000,000 = **₦400,000.**
- AC = **₦500,000.**
- CPI = 400,000 ÷ 500,000 = **0.8** (we get ₦0.80 of value for each ₦1 spent).
- SPI = 400,000 ÷ 500,000 = **0.8** (we are 20% behind schedule).
- EAC = 1,000,000 ÷ 0.8 = **₦1,250,000**, a forecast overspend of ₦250,000.

This tells the manager something is wrong **before** the money has run out, so corrective action can start. (The advanced Project Manager course in the data and technology programme goes deeper into earned value and forecasting.)

## Try it

```task
{
  "id": "pmgt-m05-t1",
  "prompt": "The base cost is **₦4,500,000** and you add **10% contingency**. Work out the contingency and the total budget. Then say in one sentence how you would decide when contingency can be used.",
  "minutes": 6,
  "rows": 5,
  "placeholder": "Contingency = ...",
  "rules": [
    { "label": "Contingency of ₦450,000", "pattern": "450,?000" },
    { "label": "Budget of ₦4,950,000", "pattern": "4,?950,?000" },
    { "label": "Contingency used only for approved reasons or risks", "pattern": "approved|approval|risk|sponsor|record|justif|change" }
  ],
  "sample": "Contingency = 10% of 4,500,000 = ₦450,000.\nBudget = 4,500,000 + 450,000 = ₦4,950,000.\nContingency would be used only for approved reasons linked to identified risks, with each use recorded and approved by the sponsor.",
  "required": true
}
```

```task
{
  "id": "pmgt-m05-t2",
  "prompt": "**BAC ₦1,000,000.** The plan says 50% should be done; actually **40%** is done and **₦500,000** is spent. Calculate **PV, EV, AC, CPI, SPI and EAC**, and say what it means.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "PV = ...",
  "rules": [
    { "label": "PV of ₦500,000", "pattern": "pv[^\\n]*500,?000" },
    { "label": "EV of ₦400,000", "pattern": "ev[^\\n]*400,?000" },
    { "label": "CPI of 0.8", "pattern": "cpi[^\\n]*0\\.8" },
    { "label": "SPI of 0.8", "pattern": "spi[^\\n]*0\\.8" },
    { "label": "EAC of ₦1,250,000", "pattern": "1,?250,?000" },
    { "label": "Says over budget and behind schedule", "pattern": "over budget|behind|overspend|late|trouble|problem" }
  ],
  "sample": "PV = 50% x 1,000,000 = ₦500,000. EV = 40% x 1,000,000 = ₦400,000. AC = ₦500,000.\nCPI = 400,000 / 500,000 = 0.8. SPI = 400,000 / 500,000 = 0.8.\nEAC = 1,000,000 / 0.8 = ₦1,250,000.\nThe project is over budget and behind schedule: it earns ₦0.80 for each ₦1 spent and is 20% behind, so I must act now.",
  "required": true
}
```

```task
{
  "id": "pmgt-m05-t3",
  "prompt": "Build a **budget for your project** with at least eight cost lines, each in naira, then the base cost, a contingency percentage and the total. One per line.",
  "minutes": 15,
  "rows": 12,
  "placeholder": "Equipment - ₦...",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "At least eight naira amounts", "pattern": "₦\\s?\\d", "min": 8 },
    { "label": "Base cost total", "pattern": "base cost|subtotal|total (before|base)" },
    { "label": "Contingency with a percentage", "pattern": "contingency[^\\n]*\\d+\\s?%|\\d+\\s?%[^\\n]*contingency" },
    { "label": "Total budget", "pattern": "total budget|budget total|total" }
  ],
  "sample": "Equipment (panels and inverter) - ₦2,400,000\nBatteries - ₦900,000\nInstallation labour - ₦500,000\nDesign and survey - ₦250,000\nPermits and inspection - ₦150,000\nTransport and logistics - ₦100,000\nStaff training - ₦100,000\nProject management and admin - ₦100,000\nBase cost - ₦4,500,000\nContingency at 10% - ₦450,000\nTotal budget - ₦4,950,000",
  "required": false
}
```

Next lesson: risk management.
