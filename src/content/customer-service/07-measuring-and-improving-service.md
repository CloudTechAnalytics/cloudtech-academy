---
title: Measuring and Improving Service
minutes: 25
summary: Collect satisfaction feedback, use service metrics, learn from complaints and build loyalty.
---

## Satisfaction surveys and feedback

You cannot improve what you do not measure, and you cannot measure what you do not ask. **Feedback** tells you what customers experience, which is often different from what you think.

**Ways to collect feedback:**

- **Short surveys** after a purchase, delivery or support interaction (by WhatsApp, SMS, email, a link or QR code, a paper card or a quick question at the till).
- **Conversations:** ask "How was everything today?"
- **Reviews and ratings** on Google, social media and marketplaces.
- **Complaints and compliments,** logged properly.
- **Suggestion boxes** and online forms.
- **Mystery shopping:** someone pretends to be a customer and reports.
- **Customer interviews or small groups,** for deeper understanding.
- **Staff feedback,** since front-line people hear a lot.

**Designing a good survey:**

- **Keep it short:** 3 to 5 questions are better than 20.
- **Ask at the right time,** soon after the experience.
- **Use simple scales** (1 to 5, or "satisfied / neutral / dissatisfied").
- **Include one open question:** "What could we do better?"
- **Ask one thing per question,** with neutral wording.
- **Make it easy and quick,** and tell people how their feedback is used.
- **Close the loop:** thank them, act on it and tell them what changed.

Two common headline measures:

**CSAT (customer satisfaction score):** the share of customers who gave a satisfied rating (for example 4 or 5 out of 5). If **84 of 100** responses are satisfied, CSAT = 84 ÷ 100 = **84%.**

**NPS (Net Promoter Score):** based on the question *"How likely are you to recommend us to a friend or colleague?"* (0 to 10). Scores of 9 to 10 are **promoters,** 7 to 8 are **passives,** and 0 to 6 are **detractors.** *NPS = % promoters − % detractors.* If **60%** are promoters, **25%** passives and **15%** detractors: NPS = 60 − 15 = **+45.**

Do not chase scores. Their value is in the **comments and the trends,** and the actions they lead to.

## Service metrics

Combine feedback with operational data. Useful measures:

| Metric | Formula | Shows |
| :-- | :-- | :-- |
| **First response time** | Time from contact to first reply | Speed |
| **Response-time compliance** | Responses within target ÷ total | Reliability |
| **First-contact resolution (FCR)** | Resolved at first contact ÷ total | Effectiveness |
| **Average resolution time** | Total resolution time ÷ cases | Efficiency |
| **Complaint rate** | Complaints ÷ transactions or customers | Quality problems |
| **CSAT / NPS** | See above | Satisfaction and advocacy |
| **Repeat purchase / retention rate** | Returning customers ÷ customers | Loyalty |
| **Churn rate** | Customers lost ÷ customers at start | Losses |
| **Abandoned calls / unanswered messages** | Not answered ÷ received | Missed opportunities |
| **Cost per contact** | Service cost ÷ contacts | Efficiency |

Set **targets,** review them monthly, and look at **trends** and **breakdowns** (by channel, product, shift, branch) to find where to act. Do not use metrics to blame individuals unfairly: look at the system first.

Keep metrics **balanced:** speed alone can reduce quality (staff rushing customers off the phone), and satisfaction scores alone can hide cost. Use a small set that together give a fair picture.

## Learning from complaints

Complaints are free consultancy. **Analyse them** to find the root causes.

1. **Log every complaint** with a category and cause.
2. **Count and rank:** use a **Pareto** view to see which causes matter most.
3. **Find root causes** with "five whys": *Late delivery → why? The rider left late → why? Orders were packed late → why? Stock was missing → why? Reordering was not tracked.*
4. **Fix the system,** not only the individual case.
5. **Assign owners and deadlines.**
6. **Check** whether complaints in that category fall.
7. **Share lessons** with the team.

Example: in a month there were **40 complaints:** late delivery **18**, wrong item **10**, rude staff **8**, billing errors **4.** Late delivery = 18 ÷ 40 = **45%.** Late delivery plus wrong item = 28 ÷ 40 = **70%**, so the biggest gains come from fixing delivery and order accuracy. Fixing those two issues does more for customers than a poster about smiling.

Also record and share **compliments;** they show what to keep doing and motivate staff.

## Building loyalty

**Loyalty** means customers keep coming back and recommend you, because they trust you and value the relationship.

Ways to build it:

- **Deliver reliably,** which is the heart of loyalty.
- **Personalise:** know names, preferences and history.
- **Make it easy:** simple processes, convenient channels, fast help.
- **Reward loyalty:** points, discounts, early access, thank-you gestures, birthday offers. Make rewards **simple and genuine.**
- **Surprise and delight** occasionally with a small unexpected gesture.
- **Keep in touch** with useful, relevant updates, not just promotions.
- **Recover well** from mistakes.
- **Listen and visibly act on feedback.**
- **Ask for referrals** and reward them.
- **Create community:** events, groups, shared stories.

Measure it: **repeat rate** and **retention.** Example: **200 customers** at the start of a year and **170** still buying at the end gives retention of 170 ÷ 200 = **85%** and churn of 15%. If a retained customer is worth ₦54,000 in lifetime profit, each percentage point of retention improvement (2 customers) is worth about ₦108,000, so even small gains matter.

## Try it

```task
{
  "id": "cscm-m07-t1",
  "prompt": "Calculate: (a) **CSAT** when **84 of 100** responses are satisfied; (b) **NPS** when **60%** are promoters, **25%** passives and **15%** detractors; (c) **retention** and **churn** when **170 of 200** customers remain.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "CSAT = ...",
  "rules": [
    { "label": "CSAT of 84%", "pattern": "\\b84\\s?%" },
    { "label": "NPS of +45", "pattern": "\\+?\\s?45" },
    { "label": "Retention of 85%", "pattern": "\\b85\\s?%" },
    { "label": "Churn of 15%", "pattern": "\\b15\\s?%" }
  ],
  "sample": "(a) CSAT = 84 / 100 = 84%.\n(b) NPS = 60 - 15 = +45.\n(c) Retention = 170 / 200 = 85%, so churn = 15%.",
  "required": true
}
```

```task
{
  "id": "cscm-m07-t2",
  "prompt": "In a month there were **40 complaints**: late delivery **18**, wrong item **10**, rude staff **8**, billing errors **4**. Work out each share, the share of the top two, and say what you would fix first and why.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Late delivery = ...",
  "rules": [
    { "label": "Late delivery 45%", "pattern": "\\b45\\s?%" },
    { "label": "Wrong item 25%", "pattern": "\\b25\\s?%" },
    { "label": "Top two 70%", "pattern": "\\b70\\s?%" },
    { "label": "Says to fix delivery and accuracy first", "pattern": "late delivery[\\s\\S]*(first|priority)|first[\\s\\S]*(delivery|accuracy)|biggest" }
  ],
  "sample": "Late delivery = 18 / 40 = 45%. Wrong item = 10 / 40 = 25%. Rude staff = 8 / 40 = 20%. Billing = 4 / 40 = 10%.\nThe top two together are 70%.\nI would fix late delivery and order accuracy first, because they cause most complaints, so the biggest improvement comes from them.",
  "required": true
}
```

```task
{
  "id": "cscm-m07-t3",
  "prompt": "Design a **short customer survey** of five questions: a satisfaction rating, a recommend question (0 to 10), one about speed, one about the staff and one open question. One per line, with the scale where it applies.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "1. How satisfied are you with ... (1 to 5)?",
  "rules": [
    { "label": "Five lines", "minLines": 5 },
    { "label": "Satisfaction rating with a scale", "pattern": "satisfied[\\s\\S]*(1 to 5|1-5|1 \\(|out of 5)" },
    { "label": "Recommend question with 0 to 10", "pattern": "recommend[\\s\\S]*(0 to 10|0-10|out of 10)" },
    { "label": "Speed question", "pattern": "speed|quick|fast|wait" },
    { "label": "Staff question", "pattern": "staff|team|helpful|friendly|service" },
    { "label": "Open question", "pattern": "what could|how can we|any comments|improve|better" }
  ],
  "sample": "1. How satisfied are you with your experience today? (1 to 5, where 5 is very satisfied)\n2. How likely are you to recommend us to a friend or colleague? (0 to 10)\n3. How would you rate the speed of the service? (1 to 5)\n4. How helpful and friendly was our staff? (1 to 5)\n5. What could we do better?",
  "required": false
}
```

Next lesson: your service improvement plan.
