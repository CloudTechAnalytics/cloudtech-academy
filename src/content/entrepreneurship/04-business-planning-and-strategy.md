---
title: Business Planning and Strategy
minutes: 40
summary: Set vision, mission and goals, turn objectives into milestones, write a one-page and a full plan, use basic strategy tools and plan for risk.
---

## Vision, mission and goals

Planning gives direction. Three levels:

- **Vision:** the future you want to help create. It inspires. *"Every office worker in Lagos eats a good lunch every day."*
- **Mission:** what the business does, for whom and how, today. *"We deliver fresh, affordable lunch boxes to office workers, on time, every working day."*
- **Goals:** what you want to achieve in a set time, in numbers.

Keep vision and mission short and honest. They help you decide what to do and what to refuse.

## Objectives and milestones

A good goal is **SMART**:

- **Specific:** clear about what.
- **Measurable:** you can count it.
- **Achievable:** realistic with your resources.
- **Relevant:** it matters to the business.
- **Time-bound:** it has a deadline.

Weak: "Grow the business." SMART: "Reach ₦600,000 monthly sales by the end of month 6."

**Milestones** break a goal into steps, with dates. Example: current monthly sales ₦200,000; target ₦600,000 in six months. The increase needed is ₦400,000, or about ₦400,000 ÷ 6 = **₦66,667 more each month** on average. A plan might be: month 1 ₦267,000, month 2 ₦333,000, month 3 ₦400,000 and so on. Each milestone then tells you whether you are on track.

Set **three to five** goals at a time. More than that and nothing gets done. Review monthly.

## A one-page plan and a full plan

A **one-page plan** forces clarity and is often enough to start. Include:

1. The problem and your solution.
2. Target customer.
3. How you reach and sell to them.
4. How you earn: price and main costs.
5. Start-up needs: money and resources.
6. Goals for the first year.
7. Biggest risks and your plan for them.
8. The next 90 days.

A **full business plan** adds detail and evidence, and is useful when you need to raise money, apply for a grant, or guide a team. Typical sections:

- **Executive summary:** the whole plan in one page, written last.
- **Business description and mission.**
- **Market analysis:** customers, size, trends, competitors.
- **Products and services.**
- **Marketing and sales plan.**
- **Operations plan:** how you make and deliver; location, suppliers, equipment.
- **Management and organisation:** who runs it, and their strengths.
- **Financial plan:** start-up costs, budget, break-even, cash flow forecast and funding needed.
- **Risks.**
- **Appendices:** evidence, quotes, interview findings.

A plan is a **working document.** It is a way to think, not a school essay. Update it as you learn.

## Strategy basics

**Strategy** is the set of choices about where to compete and how to win. A simple way to think about it is a **SWOT analysis**:

| | Helpful | Harmful |
| :-- | :-- | :-- |
| **Internal** | **Strengths:** what you do well | **Weaknesses:** where you are limited |
| **External** | **Opportunities:** trends and gaps you can use | **Threats:** competitors, rules, price rises |

Use the result to choose actions: build on strengths, fix or work around weaknesses, grab opportunities and prepare for threats.

Three basic strategies from competition theory:

1. **Low cost:** be the cheapest, with efficient operations. Needs volume.
2. **Differentiation:** offer something distinctive customers value and will pay more for.
3. **Focus (niche):** serve one segment extremely well.

A small business usually does best by **focusing** on a niche it can serve better than larger competitors. Strategy also means **saying no** to things that do not fit.

## Risks and how to plan for them

Every plan has risks: customers do not come, costs rise, a supplier fails, a key person leaves, rules change, money runs out. For each major risk, score how **likely** it is and how **bad** it would be, from 1 (low) to 5 (high); multiply to get a score out of 25.

| Risk | Likelihood | Impact | Score | Response |
| :-- | :-- | :-- | :-- | :-- |
| Sales slower than planned | 4 | 4 | 16 | Test before spending; keep costs flexible |
| Main supplier fails | 2 | 4 | 8 | Qualify a second supplier |
| Running out of cash | 3 | 5 | 15 | Weekly cash check; keep a reserve |

Focus on the highest scores. Respond by avoiding, reducing, transferring (insurance, contracts) or accepting the risk. Write the response down, name an owner and review it.

## Try it

```task
{
  "id": "ent-m04-t1",
  "prompt": "Write your **vision**, **mission** and **three SMART goals** for your first year. One item per line, labelled. Each goal must have a number and a date.",
  "minutes": 12,
  "rows": 8,
  "placeholder": "Vision: ...\nMission: ...\nGoal 1: ...",
  "rules": [
    { "label": "At least five lines", "minLines": 5 },
    { "label": "Has a vision", "pattern": "vision" },
    { "label": "Has a mission", "pattern": "mission" },
    { "label": "Has three goals", "pattern": "goal 1[\\s\\S]*goal 2[\\s\\S]*goal 3" },
    { "label": "Goals contain numbers", "pattern": "goal[^\\n]*\\d", "min": 3 },
    { "label": "Goals contain a time frame", "pattern": "goal[^\\n]*(month|week|year|by |q[1-4])", "min": 3 }
  ],
  "sample": "Vision: every office worker in Lagos eats a good lunch every working day.\nMission: we deliver fresh, affordable lunch boxes to office workers on time, every working day.\nGoal 1: reach ₦600,000 monthly sales by the end of month 6.\nGoal 2: serve 100 regular subscribers within 9 months.\nGoal 3: keep on-time delivery at 95% or better every month from month 3.",
  "required": true
}
```

```task
{
  "id": "ent-m04-t2",
  "prompt": "Current monthly sales are **₦200,000** and your target is **₦600,000** in **six months**. Work out the total increase needed and the average increase per month, then write a **milestone for months 1, 3 and 6**.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Increase needed = ...",
  "rules": [
    { "label": "Total increase of ₦400,000", "pattern": "400,?000" },
    { "label": "About ₦66,667 per month", "pattern": "66,?66[67]|66,?667|66\\.7" },
    { "label": "Gives milestones for month 1, 3 and 6", "pattern": "month 1[\\s\\S]*month 3[\\s\\S]*month 6" }
  ],
  "sample": "Increase needed = 600,000 - 200,000 = ₦400,000.\nAverage increase = 400,000 / 6 = about ₦66,667 per month.\nMilestones: month 1 ₦267,000; month 3 ₦400,000; month 6 ₦600,000.",
  "required": true
}
```

```task
{
  "id": "ent-m04-t3",
  "prompt": "Write a **SWOT analysis** and a **risk table** for your idea. Give two items for each of strengths, weaknesses, opportunities and threats (labelled), then three risks, each with likelihood, impact, score and response. At least eleven lines.",
  "minutes": 15,
  "rows": 14,
  "placeholder": "Strength 1: ...\nRisk: ... - likelihood 4 x impact 4 = 16 - response ...",
  "rules": [
    { "label": "At least eleven lines", "minLines": 11 },
    { "label": "Has strengths and weaknesses", "pattern": "strength[\\s\\S]*weakness" },
    { "label": "Has opportunities and threats", "pattern": "opportunit[\\s\\S]*threat" },
    { "label": "Has risks with a likelihood x impact score", "pattern": "risk[^\\n]*\\d\\s?[x×*]\\s?(impact\\s?)?\\d\\s?=\\s?\\d+", "min": 3 },
    { "label": "Has responses", "pattern": "response" }
  ],
  "sample": "Strength 1: I cook well and know what office workers like.\nStrength 2: my cousin has a delivery bike, so start-up cost is low.\nWeakness 1: I have no bookkeeping experience.\nWeakness 2: only one kitchen, so capacity is limited.\nOpportunity 1: many offices nearby with no good lunch option.\nOpportunity 2: companies want to offer staff lunch subscriptions.\nThreat 1: the canteen could cut its prices.\nThreat 2: ingredient prices keep rising.\nRisk: sales slower than planned - likelihood 4 x impact 4 = 16 - response: pre-sell, keep costs flexible.\nRisk: running out of cash - likelihood 3 x impact 5 = 15 - response: weekly cash check and a reserve.\nRisk: key supplier fails - likelihood 2 x impact 4 = 8 - response: qualify a second supplier.",
  "required": true
}
```

Next lesson: setting up legally in Nigeria.
