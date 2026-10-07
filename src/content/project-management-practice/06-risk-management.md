---
title: Risk Management
minutes: 15
summary: Identify project risks, assess them qualitatively and quantitatively, choose responses and keep a risk register.
---

## Identifying risks

A **risk** is an uncertain event that, if it happens, affects the project's objectives, usually negatively (a threat) but sometimes positively (an opportunity). Do not confuse a risk with an **issue**, which is a problem that is **already happening.**

Risk management is **proactive:** finding and handling threats before they hurt. It is cheaper to prevent a problem than to fix it.

Ways to identify risks:

- **Brainstorming** with the team and stakeholders.
- **Checklists** and lessons learned from similar projects.
- **Interviews** with experts and people who have done similar work.
- **Reviewing the plan:** each work package, assumption, dependency and constraint hides risks.
- **SWOT analysis.**
- **Asking "what if?"** about suppliers, weather, people, approvals, prices and technology.

Common sources: unclear requirements, unrealistic estimates, late supplier delivery, key people leaving, technology problems, regulatory delay, funding changes, weather, security and safety, and stakeholder conflict.

Write each risk clearly in **cause, event and effect** form: *"Because the supplier is overseas (cause), delivery may be delayed by customs (event), which would delay installation by 3 weeks (effect)."*

## Qualitative and quantitative assessment

**Qualitative assessment** ranks risks quickly using **probability** (how likely) and **impact** (how bad), usually scored from 1 (low) to 5 (high). **Risk score = probability × impact**, from 1 to 25.

| Risk | Probability | Impact | Score |
| :-- | :-- | :-- | :-- |
| Equipment delayed at customs | 4 | 4 | 16 |
| Roof not strong enough | 2 | 5 | 10 |
| Key technician leaves | 2 | 3 | 6 |

Highest scores are managed first. Many teams use a **probability and impact matrix** with colours: red (high), amber (medium), green (low).

**Quantitative assessment** puts numbers on risk, often as **expected monetary value (EMV)** = probability × impact in money.

Example: a 20% chance of a ₦3,000,000 overrun gives EMV = 0.20 × 3,000,000 = **₦600,000.** If a response costs ₦400,000 and removes the risk, it is worth doing (it costs less than the expected loss). If it costs ₦900,000, it is not worth it on cost alone.

EMV helps size **contingency:** add up the EMV of the main risks. More advanced methods, such as simulation, exist for large projects.

## Risk responses

For each significant risk, choose a response:

**For threats:**

- **Avoid:** change the plan so the risk cannot happen (use a local supplier instead of an overseas one).
- **Mitigate:** reduce the probability or the impact (order early, test the roof, train a backup technician).
- **Transfer:** pass the risk to someone else (insurance, fixed-price contracts, warranties).
- **Accept:** do nothing, or prepare a **contingency plan** to use if it happens. Active acceptance includes setting aside time or money.

**For opportunities:**

- **Exploit:** make sure it happens.
- **Enhance:** increase the probability or benefit.
- **Share:** partner with someone better able to capture it.
- **Accept:** take it if it comes.

Also plan **fallbacks:** what you will do if the response fails. Watch for **secondary risks** created by a response (a faster supplier may cost more).

Choose responses that are **proportionate:** cost less than the risk they address, and that someone has the authority to carry out.

## The risk register

The **risk register** is the living record of risks. A good register has, for each risk:

- **ID and description** (cause, event, effect).
- **Category** and **date raised.**
- **Probability, impact, score.**
- **Response strategy** and specific actions.
- **Owner:** the person responsible for monitoring and acting.
- **Trigger:** the warning sign that the risk is about to happen.
- **Status:** open, closed or occurred.
- **Contingency plan** and cost.

Keep it short and **use it:** review the top risks at every team meeting, add new risks as you learn, close risks that have passed, and report the top risks to the sponsor. A register that is written once and filed is useless.

## Try it

```task
{
  "id": "pmgt-m06-t1",
  "prompt": "Score three risks as probability × impact (1 to 5): (a) **equipment delayed at customs**, probability 4, impact 4; (b) **roof not strong enough**, probability 2, impact 5; (c) **key technician leaves**, probability 2, impact 3. Give each score and say which to manage first.",
  "minutes": 6,
  "rows": 6,
  "placeholder": "(a) 4 x 4 = ...",
  "rules": [
    { "label": "Score of 16 for (a)", "pattern": "4\\s?[x×*]\\s?4\\s?=\\s?16|customs[^\\n]*16" },
    { "label": "Score of 10 for (b)", "pattern": "2\\s?[x×*]\\s?5\\s?=\\s?10|roof[^\\n]*10" },
    { "label": "Score of 6 for (c)", "pattern": "2\\s?[x×*]\\s?3\\s?=\\s?6|technician[^\\n]*\\b6\\b" },
    { "label": "Says manage the customs delay first", "pattern": "first|highest|priority|customs" }
  ],
  "sample": "(a) Customs delay: 4 x 4 = 16.\n(b) Roof: 2 x 5 = 10.\n(c) Technician leaves: 2 x 3 = 6.\nI would manage the customs delay first because it has the highest score, 16.",
  "required": true
}
```

```task
{
  "id": "pmgt-m06-t2",
  "prompt": "There is a **20% chance** of a **₦3,000,000** overrun. Work out the **EMV**. A response that removes the risk costs **₦400,000**. Is it worth doing? What if it cost **₦900,000**?",
  "minutes": 8,
  "rows": 6,
  "placeholder": "EMV = ...",
  "rules": [
    { "label": "EMV of ₦600,000", "pattern": "600,?000" },
    { "label": "Worth doing at ₦400,000", "pattern": "400,?000[^\\n]*(worth|yes|less than)|worth[^\\n]*400,?000|yes" },
    { "label": "Not worth it at ₦900,000", "pattern": "900,?000[^\\n]*(not|more than|exceeds)|not worth[^\\n]*900,?000" }
  ],
  "sample": "EMV = 0.20 x 3,000,000 = ₦600,000.\nA ₦400,000 response is worth doing because it costs less than the expected loss.\nAt ₦900,000 it is not worth it on cost alone, because it costs more than the ₦600,000 expected loss.",
  "required": true
}
```

```task
{
  "id": "pmgt-m06-t3",
  "prompt": "Create a **risk register** with four risks for your project. One per line: risk (cause, event, effect), probability and impact, response type (avoid, mitigate, transfer or accept), action and owner.",
  "minutes": 15,
  "rows": 10,
  "placeholder": "R1: Because ..., ... may ..., which would ... - P4 x I4 = 16 - Mitigate - ... - Owner: ...",
  "rules": [
    { "label": "Four lines", "minLines": 4 },
    { "label": "Each line has a score", "pattern": "\\d\\s?[x×*]\\s?\\d\\s?=\\s?\\d+", "perLine": true },
    { "label": "Uses response types", "pattern": "avoid|mitigate|transfer|accept", "min": 4 },
    { "label": "Each line has an owner", "pattern": "owner", "perLine": true },
    { "label": "Uses cause-event-effect wording", "pattern": "because[^\\n]*(may|might|could)[^\\n]*(which|would|so)", "min": 3 }
  ],
  "sample": "R1: Because the supplier is overseas, delivery may be delayed at customs, which would delay installation by 3 weeks - 4 x 4 = 16 - Mitigate - order 6 weeks early and agree a customs agent - Owner: Bursar\nR2: Because the roof is old, it may not carry the panels, which would add ₦500,000 for reinforcement - 2 x 5 = 10 - Avoid - commission a structural survey first - Owner: Project manager\nR3: Because only one technician knows the system, he may leave, which would delay commissioning - 2 x 3 = 6 - Mitigate - train a second technician - Owner: Installer\nR4: Because prices change, the exchange rate may rise, which would raise costs by 8% - 3 x 3 = 9 - Transfer - fix the price with the supplier in naira - Owner: Bursar",
  "required": false
}
```

Next lesson: quality, procurement and change.
