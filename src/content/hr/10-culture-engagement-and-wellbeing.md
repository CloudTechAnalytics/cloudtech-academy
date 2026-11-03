---
title: Culture, Engagement and Wellbeing
minutes: 20
summary: Build a healthy culture, raise engagement and retention, promote diversity and inclusion and protect health, safety and wellbeing.
---

## Building culture

**Culture** is "how we do things here": the shared values, habits and unwritten rules that shape behaviour. It shows in how people treat customers and each other, how decisions are made, how mistakes are handled and what gets rewarded.

Culture is built mostly by **what leaders do,** not what posters say. If the owner preaches honesty but cuts corners, staff will copy the behaviour.

To shape culture:

1. **Define the values** you want (for example honesty, respect, service, teamwork, excellence). Keep them few, and describe what they look like in action.
2. **Role-model them:** leaders and managers must behave consistently with the values.
3. **Hire and promote for them:** include values in selection and appraisals.
4. **Reward behaviour that fits,** and challenge behaviour that does not, however senior or profitable the person.
5. **Communicate openly:** share the business's direction, results and decisions.
6. **Create rituals:** team meetings, celebrations, recognition, learning sessions.
7. **Listen and act:** take feedback seriously.

A strong culture helps people know what to do without being told, attracts the right candidates and holds staff in hard times. A toxic culture (fear, blame, favouritism, gossip, bribery) drives good people away.

## Engagement and retention

**Engagement** is how committed and motivated people are to their work and the organisation, and willing to give extra effort. Engaged employees are usually more productive, give better service and stay longer.

Drivers of engagement:

- **Meaningful work** and understanding how it matters.
- **A good manager** who is fair, clear and supportive. People often leave managers, not businesses.
- **Fair pay and recognition.**
- **Growth and development.**
- **Autonomy and trust.**
- **Good relationships** with colleagues.
- **Voice:** being heard and involved.
- **Fair treatment** and job security as far as possible.
- **Wellbeing and reasonable workload.**

**Measuring engagement:** short regular **surveys** (for example 10 questions on a 1 to 5 scale), **one-to-ones,** exit interviews, stay interviews (asking current staff why they stay and what would make them leave), and signs such as absence and turnover. Examples of survey statements: *"I know what is expected of me," "My manager listens to me," "I have the chance to learn and grow," "I would recommend this business as a place to work."* Act on the results and tell people what you will change.

**Retention** is keeping your good people. Measure **turnover:** *leavers in the period ÷ average headcount.* Example: **6 leavers** in a year with an average of **40 staff:** turnover = 6 ÷ 40 = **15%.** If each leaver costs about **₦400,000** to replace (recruitment, training, lost productivity), the annual cost is 6 × 400,000 = **₦2,400,000.**

Ways to improve retention: fix the causes found in exit interviews, pay fairly, train managers, offer development, recognise good work, improve flexibility and tackle bullying quickly. Some turnover is healthy; **losing your best people is the concern.**

## Diversity and inclusion

**Diversity** means differences among people: gender, age, ethnic group, religion, disability, background, education, thinking style. **Inclusion** means making sure everyone is respected, can contribute and has a fair chance.

Why it matters: it is **the right thing to do,** it is **required by law** (equal treatment and protection from discrimination), and it **improves decisions and service** by bringing different perspectives.

Practical steps:

- **Fair recruitment:** structured interviews and criteria; wording of adverts; diverse interview panels.
- **Equal pay for equal work,** and check for unexplained gaps.
- **Equal access** to training, promotion and flexible working.
- **A zero-tolerance policy** on harassment and discrimination, with a safe way to report.
- **Reasonable adjustments** for people with disabilities (accessible workplaces, flexible arrangements).
- **Respect for religious and cultural practices** where possible.
- **Support for women** and for staff with caring responsibilities (including maternity and paternity support).
- **Manager training** on unconscious bias and respectful behaviour.
- **Inclusive language** and meetings where everyone can speak.

Do not treat inclusion as a slogan: look at who is hired, promoted and leaves, and ask staff how included they feel.

## Health, safety and wellbeing

Employers have a **duty of care:** to provide a **safe and healthy workplace.**

**Health and safety basics:**

- **Risk assessment:** identify hazards (slippery floors, electrical faults, heavy lifting, fire, machinery, violence), assess the risk and put controls in place.
- **Safe equipment, maintenance and clear procedures.**
- **Training:** safe lifting, equipment use, fire drills, first aid.
- **Personal protective equipment** where needed.
- **Fire safety:** clear exits, extinguishers, alarms and regular drills.
- **First aid:** a kit, trained people and a procedure.
- **Report and record** accidents and near misses, and learn from them.
- **Consult employees,** since they know where the hazards are.
- **Comply with the law** and sector rules.

**Wellbeing** is broader: physical, mental and social health.

- **Reasonable workloads and hours,** and rest breaks.
- **Support for stress and mental health:** manager awareness, an open door, signposting to help, and a respectful culture. Burnout is real.
- **Healthy workplace:** clean water, sanitation, rest areas, safe transport where possible.
- **Flexible working** where the job allows.
- **Support during illness and personal difficulty,** with compassion and clear policies.
- **Protection from harassment and bullying.**
- **Health insurance and checks** where affordable.

A safe, supportive workplace reduces accidents, absence and turnover, and it is the right way to treat people.

## Try it

```task
{
  "id": "hrpm-m10-t1",
  "prompt": "**6 leavers** in a year with an average headcount of **40**. Each leaver costs about **₦400,000** to replace. Work out the **turnover rate** and the **annual cost**, and give **two actions** to improve retention.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Turnover = ...",
  "rules": [
    { "label": "Turnover of 15%", "pattern": "\\b15\\s?%" },
    { "label": "Cost of ₦2,400,000", "pattern": "2,?400,?000" },
    { "label": "Two actions (exit interviews, manager training, pay, development, recognition, flexibility)", "pattern": "exit|manager|pay|develop|recogni|flexib|train|survey|career" }
  ],
  "sample": "Turnover = 6 / 40 = 15%.\nCost = 6 x 400,000 = ₦2,400,000 a year.\nI would use exit interviews to find the real reasons people leave, and train managers and offer clearer career development.",
  "required": true
}
```

```task
{
  "id": "hrpm-m10-t2",
  "prompt": "Write **eight statements for a short engagement survey** (rated 1 to 5), one per line, covering clarity of role, manager support, development, recognition, fair treatment, workload and wellbeing, and whether they would recommend the business.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "I know what is expected of me.",
  "rules": [
    { "label": "Eight lines", "minLines": 8 },
    { "label": "Clarity of role or expectations", "pattern": "expect|role|know what" },
    { "label": "Manager support or listening", "pattern": "manager|supervisor|listens" },
    { "label": "Development or learning", "pattern": "learn|grow|develop|career" },
    { "label": "Recognition", "pattern": "recogni|valued|appreciated|thanked" },
    { "label": "Workload or wellbeing", "pattern": "workload|wellbeing|stress|balance|safe" },
    { "label": "Recommend", "pattern": "recommend" }
  ],
  "sample": "I know what is expected of me in my job.\nMy manager listens to me and supports me.\nI have the chance to learn and grow here.\nMy good work is recognised and appreciated.\nI am treated fairly, whoever I am.\nMy workload is reasonable.\nI feel safe and well supported at work.\nI would recommend this business as a place to work.",
  "required": true
}
```

```task
{
  "id": "hrpm-m10-t3",
  "prompt": "Write a **simple health and safety plan** for a small shop in at least six lines: hazards you would check, the control for each, training, fire safety, first aid and how accidents are reported.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Hazard: wet floor - control: ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Hazards and controls", "pattern": "hazard[\\s\\S]*control|control[\\s\\S]*hazard" },
    { "label": "Training", "pattern": "training|train" },
    { "label": "Fire safety", "pattern": "fire|extinguisher|exit|drill" },
    { "label": "First aid", "pattern": "first aid" },
    { "label": "Accident reporting", "pattern": "report|record|accident|near miss|log" }
  ],
  "sample": "Hazard: wet or slippery floor - control: mop promptly, use warning signs and non-slip mats.\nHazard: heavy stock lifting - control: lifting training, trolleys and a two-person rule for heavy items.\nHazard: faulty electrical equipment - control: regular checks by a competent electrician and no overloaded sockets.\nTraining: all new staff get safety training in their induction, repeated each year.\nFire safety: clear exits, working extinguishers and a fire drill twice a year.\nFirst aid: a stocked kit and two trained first aiders on each shift.\nReporting: every accident and near miss is recorded in a log and reviewed monthly.",
  "required": false
}
```

Next lesson: HR data, tools and policies.
