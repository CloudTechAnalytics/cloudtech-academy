---
title: Training and Development
minutes: 25
summary: Find training needs, choose training methods, support career development and measure whether training worked.
---

## Finding training needs

**Training** gives people the skills and knowledge for their current job. **Development** prepares them for the future (bigger roles, new skills). Both improve performance, motivation and retention. But training is only worth the money if it fixes a **real need.**

A **training needs analysis (TNA)** looks at three levels:

1. **Organisation:** where is the business going? New services, systems, rules or customers create needs.
2. **Job:** what skills does each role require?
3. **Individual:** what is each person's gap between required and actual skills?

Ways to find gaps:

- **Performance reviews** and manager feedback.
- **Errors, complaints and incidents:** patterns point to skill gaps.
- **Observation** and **skills tests.**
- **Surveys and interviews** with staff.
- **Changes** in technology, law or products.
- **Career aspirations** discussed in one-to-ones.

Then **prioritise:** which needs affect the business the most, and which can be solved by training (rather than by a better process, tool, clearer instructions or a different person). Not every performance problem is a training problem.

## Training methods

Choose the method to suit the content, the people, the budget and the time.

| Method | Good for | Notes |
| :-- | :-- | :-- |
| **On-the-job training** | Practical skills | Learn by doing with a skilled coach; low cost; depends on the coach |
| **Shadowing and mentoring** | Learning the culture and role | Needs a willing, capable mentor |
| **Classroom or workshop** | Knowledge, new procedures, groups | Interaction and discussion; scheduling and cost |
| **E-learning and online courses** | Flexible learning, compliance, theory | Self-paced; needs motivation and a way to apply it |
| **Coaching** | Individual skills and behaviour | One-to-one, tailored |
| **Job rotation and stretch assignments** | Broadening experience | Plan carefully and support |
| **External courses and certifications** | Specialist skills | Higher cost; check quality and relevance |
| **Learning groups and communities** | Sharing practice | Informal and cheap |

Good training principles: **link it to real work,** let people **practise and get feedback,** use **short sessions with follow-up,** and make sure **managers support** the learning afterwards. Many people forget most of what they learn unless they use it quickly.

Mandatory training: safety, first aid, data protection, anti-bribery, anti-harassment and sector-specific requirements are regular, recorded training topics.

## Career development

Development is how people grow in the organisation. Offer a mix:

- **Clear career paths:** show how one can move from cashier to supervisor to manager, and what is needed.
- **Regular career conversations** in one-to-ones, asking what the person wants.
- **Individual development plans (IDPs):** a short written plan with goals, actions, support and timelines.
- **Stretch tasks and acting-up opportunities.**
- **Mentoring and coaching.**
- **Support for study:** time off, fees support or an agreement to pay back if the person leaves soon after (a **training bond**; use it carefully, fairly and legally, and in writing).
- **Internal promotion** where possible, which motivates others.

Small businesses may not have many levels, but they can still offer **new skills, responsibility and recognition.** People often stay where they see a future.

## Measuring training

A common model is **Kirkpatrick's four levels:**

1. **Reaction:** did participants find it useful? (feedback forms)
2. **Learning:** did they gain knowledge or skill? (tests, practical checks)
3. **Behaviour:** do they apply it at work? (observation, manager feedback, after weeks)
4. **Results:** did it improve business outcomes? (fewer errors, higher sales, better satisfaction)

Calculate the **return on investment (ROI)** where you can. Example: training costs **₦300,000.** Errors were costing the business **₦200,000 a month**, and training cut them by **40%**, saving ₦80,000 a month.

- Annual saving = 80,000 × 12 = **₦960,000.**
- ROI = (960,000 − 300,000) ÷ 300,000 = **220%.**
- Payback = 300,000 ÷ 80,000 = **3.75 months.**

Record training given (who, what, when, cost), review it each year against the plan, and ask: *Did it change anything? What next?* Training without follow-up is only a cost.

## Try it

```task
{
  "id": "hrpm-m05-t1",
  "prompt": "Training costs **₦300,000**. Errors cost **₦200,000** a month and training cuts them by **40%**. Work out the monthly saving, the annual saving, the **ROI** and the **payback period**.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Monthly saving = ...",
  "rules": [
    { "label": "Monthly saving of ₦80,000", "pattern": "80,?000" },
    { "label": "Annual saving of ₦960,000", "pattern": "960,?000" },
    { "label": "ROI of 220%", "pattern": "\\b220\\s?%" },
    { "label": "Payback of 3.75 months", "pattern": "3\\.75" }
  ],
  "sample": "Monthly saving = 40% of 200,000 = ₦80,000.\nAnnual saving = 80,000 x 12 = ₦960,000.\nROI = (960,000 - 300,000) / 300,000 = 220%.\nPayback = 300,000 / 80,000 = 3.75 months.",
  "required": true
}
```

```task
{
  "id": "hrpm-m05-t2",
  "prompt": "Staff keep making **till errors**. Do a mini **training needs analysis** in at least six lines: what evidence you would check, whether training is the right fix, two other possible causes, the training method you would use and how you would measure the result.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Evidence: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Evidence (error records, observation, complaints)", "pattern": "evidence|records?|observ|complaint|data|error log" },
    { "label": "Other causes (system, process, instructions, workload, equipment)", "pattern": "system|process|instruction|workload|equipment|other cause|not a training" },
    { "label": "Training method", "pattern": "on-the-job|coach|workshop|shadow|e-learning|practice|training session" },
    { "label": "Measurement (errors, before and after)", "pattern": "measure|before and after|error (rate|count)|reduce|track|compare" }
  ],
  "sample": "Evidence: count the till errors by cashier and by type for the past three months and observe a few shifts.\nIs it training? Only if the errors come from not knowing the procedure.\nOther cause 1: the till software is confusing, so a system fix may be needed.\nOther cause 2: queues and workload at peak times cause rushing.\nMethod: on-the-job coaching and a short practical session on the correct procedure, with a checklist.\nMeasurement: compare the error rate before and after for three months and check that till differences fall below ₦500 a shift.",
  "required": true
}
```

```task
{
  "id": "hrpm-m05-t3",
  "prompt": "Write an **individual development plan** for an employee of your choice with at least **three goals**. For each: the goal, the action or training, the support needed and the date. One goal per line.",
  "minutes": 10,
  "rows": 7,
  "placeholder": "Goal: ... - Action: ... - Support: ... - By: ...",
  "rules": [
    { "label": "Three lines", "minLines": 3 },
    { "label": "Each line has goal, action, support and date", "pattern": "goal[^\\n]*action[^\\n]*support[^\\n]*by", "perLine": true },
    { "label": "Dates or time frames", "pattern": "\\d{1,2}\\s*(january|february|march|april|may|june|july|august|september|october|november|december)|month|q[1-4]|by \\d", "min": 3 }
  ],
  "sample": "Goal: become a shift supervisor - Action: complete a supervisor skills course - Support: paid time and a mentor - By: 30 September\nGoal: improve stock control skills - Action: shadow the stock manager one day a week - Support: stock manager's time - By: 31 July\nGoal: build confidence in handling complaints - Action: role-play practice and coaching sessions - Support: the manager gives monthly feedback - By: 30 June",
  "required": false
}
```

Next lesson: performance management.
