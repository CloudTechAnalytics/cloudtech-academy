---
title: HR Fundamentals
minutes: 25
summary: Understand the role of HR, the employee lifecycle, how HR and line managers share the work and why ethics and confidentiality matter.
---

## The role of HR

**Human resources (HR)** is the part of a business that helps it **find, develop, reward and keep the people** it needs, and treats them fairly and legally. People are usually a business's biggest cost and its biggest asset, so how they are managed decides how well the business performs.

HR is not only paperwork. Its main contributions:

- **Getting the right people:** workforce planning, recruitment and selection.
- **Making them effective:** onboarding, training, performance management and coaching.
- **Rewarding fairly:** pay, benefits and recognition.
- **Keeping good people:** engagement, development, culture and wellbeing.
- **Managing relationships:** handling grievances, discipline and exits fairly.
- **Staying legal:** contracts, employment law, pension and other statutory obligations, records and safety.
- **Advising leaders:** with data and good practice.

In a small business there may be no HR department. The owner, an office manager or an accountant does these jobs, often without training. This course gives you the tools to do them well, in an organised and fair way, whether you are an HR officer, a manager or a business owner.

## The employee lifecycle

The **employee lifecycle** is the journey a person takes with an organisation. Each stage is an HR responsibility:

1. **Attract:** employer reputation, job adverts, careers presence.
2. **Recruit and select:** screening, interviews, assessments, references, offer.
3. **Onboard:** contract, induction, first 90 days, probation.
4. **Develop:** training, coaching, career growth.
5. **Manage performance:** goals, feedback, appraisal.
6. **Reward and recognise:** pay, benefits and appreciation.
7. **Engage and retain:** culture, wellbeing, communication.
8. **Handle problems:** grievance, discipline, conflict.
9. **Exit:** resignation, retirement, redundancy or dismissal, handover and exit interview.

Each stage affects the next. A rushed hire leads to poor performance and early exits. Poor onboarding wastes the first months. Treating leavers badly harms your reputation with future candidates. Thinking in terms of the whole lifecycle helps you spot where problems start.

## HR and line managers

HR does not manage every employee. **Line managers** (the people who supervise others day to day) do most of the people management, and HR supports them.

| Activity | Line manager | HR |
| :-- | :-- | :-- |
| Defining the job and needs | Describes the work and skills needed | Helps write the job description and grade |
| Recruiting | Interviews and chooses | Advertises, screens, advises on fairness and law, prepares the contract |
| Day-to-day work and goals | Sets tasks and goals, gives feedback | Designs the process and forms |
| Performance reviews | Conducts the conversation | Provides the framework, checks consistency |
| Discipline and grievances | Handles the first stage | Advises, ensures fair process and records |
| Pay and benefits | Recommends within the budget | Designs structures, runs payroll |
| Policies | Applies them consistently | Writes and maintains them |
| Legal compliance | Follows procedures | Monitors the law, keeps records |

Good practice is a **partnership:** HR gives clear policies, tools and advice; managers use them consistently and ask for help early. Many HR problems begin when a manager acts alone without a fair process, or when HR makes rules managers cannot use.

## Ethics and confidentiality

HR handles sensitive information: pay, health, family matters, performance problems, complaints. People must trust HR to behave properly.

**Ethical principles:**

- **Fairness:** treat people consistently and without discrimination.
- **Honesty:** be truthful in recruitment, appraisals and communication.
- **Respect and dignity** for every person.
- **Confidentiality:** share personal information only with those who need it, for a legitimate reason.
- **Integrity:** avoid conflicts of interest (hiring relatives without a fair process, favouritism) and never accept bribes or "payments for jobs."
- **Compliance:** follow the law and company policy.
- **Protecting people:** report harassment, safety risks and abuse.

**Data protection:** employee records are personal data. In Nigeria the Nigeria Data Protection Act 2023 sets rules on collecting, using, storing and sharing personal data. In practice: collect only what you need, tell people how it will be used, keep it secure (locked files, password protection, limited access), do not share it without a proper reason, and delete it when it is no longer needed. Check the current rules and take advice for your situation.

When something is confidential, say so clearly and do not gossip. If a manager asks for information they should not have, politely decline and explain. If you learn of serious wrongdoing, follow the proper route and do not ignore it.

## Try it

```task
{
  "id": "hrpm-m01-t1",
  "prompt": "For each activity, say whether the **line manager** or **HR** leads it, with a short reason: (1) setting a cashier's daily targets; (2) writing the grievance procedure; (3) interviewing shortlisted candidates; (4) keeping employee files secure; (5) giving day-to-day feedback; (6) advising on a legal issue in a dismissal. One per line.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "1. Line manager - ...",
  "rules": [
    { "label": "Six lines", "minLines": 6 },
    { "label": "Uses both line manager and HR", "pattern": "line manager[\\s\\S]*hr|hr[\\s\\S]*line manager" },
    { "label": "Gives reasons", "pattern": "because|since|daily|day-to-day|policy|legal|process|team|records|framework|job|work|knows|advises|fairness|responsible", "perLine": true }
  ],
  "sample": "1. Line manager - sets and reviews daily work with the team.\n2. HR - designs and maintains the policy and process.\n3. Line manager (with HR support) - knows the job and chooses, while HR checks fairness.\n4. HR - responsible for records and data protection.\n5. Line manager - gives day-to-day feedback to the team.\n6. HR - advises on the law and the fair process.",
  "required": true
}
```

```task
{
  "id": "hrpm-m01-t2",
  "prompt": "Take a new **shop cashier** through the employee lifecycle. Write **at least seven stages**, one per line, with one thing HR or the manager does at each.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "Attract: ...",
  "rules": [
    { "label": "At least seven lines", "minLines": 7 },
    { "label": "Includes recruitment or selection", "pattern": "recruit|select|interview|attract|advert" },
    { "label": "Includes onboarding or induction", "pattern": "onboard|induction|probation" },
    { "label": "Includes training or development", "pattern": "train|develop" },
    { "label": "Includes performance", "pattern": "performance|appraisal|goals|feedback" },
    { "label": "Includes reward", "pattern": "reward|pay|benefit|recognis" },
    { "label": "Includes exit", "pattern": "exit|resign|leave|termination|handover" }
  ],
  "sample": "Attract: advertise the cashier job on local job pages and in the shop window.\nRecruit and select: screen CVs, interview three candidates and check references.\nOnboard: sign the contract, give an induction on the till and customer service, and start probation.\nDevelop: train on the stock system and handling difficult customers.\nManage performance: set monthly goals on accuracy and speed, with a review each quarter.\nReward and recognise: pay on time, pension contributions and a monthly staff award.\nExit: if she resigns, agree notice, hand over the till, hold an exit conversation and settle final pay.",
  "required": true
}
```

```task
{
  "id": "hrpm-m01-t3",
  "prompt": "A friend of the owner asks you, the HR officer, how much a colleague earns and why she was disciplined last month. In 50 to 100 words, say how you respond and why.",
  "minutes": 8,
  "rows": 6,
  "placeholder": "I would politely decline ...",
  "rules": [
    { "label": "Declines to share (confidential)", "pattern": "decline|cannot share|can't share|confidential|not able to|will not|won't" },
    { "label": "Explains why (privacy, trust, data protection, policy)", "pattern": "privacy|trust|data protection|policy|personal|need to know|law" },
    { "label": "Stays polite or offers a proper route", "pattern": "politely|respect|proper|ask (her|him|the)|appropriate|if (she|he) (wants|chooses)" },
    { "label": "Between 50 and 100 words", "minWords": 50, "maxWords": 105 }
  ],
  "sample": "I would politely decline to share any of it. Pay and disciplinary matters are confidential personal information, and sharing them without a proper reason would break employees' trust and could breach data protection rules and company policy. I would explain that I only share such information with people who need it for their job, and suggest that if my friend has a legitimate reason, they should ask the owner or the colleague directly.",
  "required": false
}
```

Next lesson: workforce planning and job design.
