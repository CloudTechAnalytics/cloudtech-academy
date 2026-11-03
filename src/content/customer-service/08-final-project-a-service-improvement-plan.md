---
title: "Final Project: A Service Improvement Plan"
minutes: 55
summary: Choose a service to review, find the problems, write the plan and scripts and present it.
---

## What you are building

You have covered what great service is, how to communicate, serve through every channel, handle complaints, manage client relationships, set standards and systems, and measure and improve. Now you apply it by creating **a service improvement plan** for a real or realistic service.

Choose a **service you can examine:** the front desk of a business you know, a shop's customer care on WhatsApp, a school or clinic reception, a bank branch queue, a delivery company's support, a restaurant or a service you use as a customer. If you cannot get real data, create a **realistic scenario** with sensible numbers and say so.

## Your plan has six parts

1. **The service and its customers:** what the service is, who uses it, the channels, the current standards (if any) and what customers expect.
2. **Evidence of the problems:** at least four sources: your own observation (a mystery visit or a test message), customer comments, complaint data, response times and a few figures (CSAT, response compliance, first-contact resolution, complaint categories).
3. **Diagnosis:** the top three problems, ranked, with root causes (use the five whys) and the cost of leaving them (lost customers or lifetime profit).
4. **The improvements:** specific actions for each problem, including **new service standards,** **scripts or templates** (greeting, a difficult message, a complaint reply), a **ticket and records** system and an **escalation matrix.**
5. **Measurement:** the metrics and targets you will track (response time, FCR, CSAT, complaints, retention), how you will collect feedback and how often you will review.
6. **Rollout and ownership:** who does what by when, any training needed, the cost and the expected benefit in naira.

## Presenting the plan

Write for the owner or manager who will approve it. Open with a **one-page summary:** the problems found, the main improvements, what it costs and what you expect to gain. Use tables for the metrics and the action plan. Show the evidence behind each claim and be honest about what you assumed. Prepare for questions: *How do you know this is the real problem? What does it cost? How will we know it worked? What if staff resist?*

> [!TIP]
> Try your scripts and standards on a colleague or friend before you submit. If they sound unnatural or are hard to follow, simplify them.

## Try it

```task
{
  "id": "cscm-m08-t1",
  "prompt": "Describe **the service you chose** and its **customers and channels** in 60 to 130 words, including the current standards (or that there are none) and what customers expect.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "The service is ...",
  "rules": [
    { "label": "Describes the service", "pattern": "service|shop|desk|reception|support|branch|restaurant|clinic|school" },
    { "label": "Describes the customers", "pattern": "customers?|clients?|patients|parents|students|users" },
    { "label": "Lists channels", "pattern": "whatsapp|phone|in person|email|social|chat|walk-?in|instagram" },
    { "label": "Mentions current standards or none", "pattern": "standards?|no (written )?standards|targets?|no targets" },
    { "label": "States expectations", "pattern": "expect|want|need|quick|fast|polite|reply" },
    { "label": "Between 60 and 130 words", "minWords": 60, "maxWords": 135 }
  ],
  "sample": "The service is the customer care desk and WhatsApp line of a busy supermarket in Ikeja. Customers are shoppers and online buyers who ask about prices, stock, delivery and refunds. They reach us in person at the desk, by phone and on WhatsApp. At present there are no written service standards, and replies depend on who is on duty. Customers expect quick, polite answers, accurate information and for problems to be fixed the first time they raise them. The plan aims to give staff clear standards, scripts and a simple way to track requests.",
  "required": true
}
```

```task
{
  "id": "cscm-m08-t2",
  "prompt": "Present your **evidence and diagnosis**: at least **six lines** with figures (for example response compliance, first-contact resolution, CSAT, complaint categories), then your **top three problems** ranked, each with a root cause and the cost of leaving it. At least eight lines.",
  "minutes": 15,
  "rows": 13,
  "placeholder": "Evidence: ...\nProblem 1: ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Figures with percentages", "pattern": "\\d+\\s?%", "min": 4 },
    { "label": "Metrics named (response, resolution, CSAT, complaints)", "pattern": "response|first-contact|csat|complaint|nps|retention" },
    { "label": "Three problems", "pattern": "problem 1[\\s\\S]*problem 2[\\s\\S]*problem 3" },
    { "label": "Root cause", "pattern": "root cause|because|why" },
    { "label": "Cost in naira", "pattern": "₦\\s?\\d" }
  ],
  "sample": "Evidence: a week of WhatsApp messages: 200 received, 130 answered within 15 minutes, which is 65%\nEvidence: first-contact resolution is 55%, so 45% of queries need repeat contact\nEvidence: CSAT on a short survey of 80 customers is 72%\nEvidence: 40 complaints last month: late delivery 18 (45%), wrong item 10 (25%), rude staff 8 (20%), billing 4 (10%)\nEvidence: a mystery visit found no greeting for 40 seconds at the desk\nProblem 1: slow WhatsApp replies at peak times - root cause: one person covers the phone and chat - cost: about 20 lost customers a year x ₦54,000 = ₦1,080,000\nProblem 2: late deliveries - root cause: orders packed late because stock is not checked - cost: 18 complaints a month and refunds of about ₦90,000\nProblem 3: inconsistent answers - root cause: no standards or scripts - cost: repeat contacts and a CSAT of 72%",
  "required": true
}
```

```task
{
  "id": "cscm-m08-t3",
  "prompt": "Write your **new service standards and scripts**: at least **five standards** with numbers, then **two short scripts** (a greeting or phone opening, and a reply to an angry customer). Label each.",
  "minutes": 15,
  "rows": 13,
  "placeholder": "Standard 1: ...\nScript - greeting: ...",
  "rules": [
    { "label": "At least five standards with numbers", "pattern": "standard[^\\n]*\\d", "min": 5 },
    { "label": "Has a greeting script", "pattern": "script[^\\n]*(greeting|opening)|greeting script" },
    { "label": "Has an angry customer reply script", "pattern": "script[^\\n]*(angry|complaint)|angry customer" },
    { "label": "Script apologises and offers a solution", "pattern": "sorry|apolog[\\s\\S]*(will|solution|sort|fix|replace)" },
    { "label": "At least seven lines", "minLines": 7 }
  ],
  "sample": "Standard 1: greet every customer within 10 seconds\nStandard 2: answer phone calls within 3 rings\nStandard 3: reply to WhatsApp within 15 minutes during opening hours, 95% of the time\nStandard 4: resolve 80% of queries at first contact\nStandard 5: issue approved refunds within 3 working days\nScript - greeting: Good morning, welcome to Fresh Mart. My name is Ada. How may I help you today?\nScript - angry customer: I am very sorry about this, Sir. I understand how frustrating it is. I will sort it out for you now: I will check your order, and within 10 minutes I will tell you exactly what we can do. What would you like us to do?",
  "required": true
}
```

```task
{
  "id": "cscm-m08-t4",
  "prompt": "Write your **measurement and rollout plan** in at least eight lines: five metrics with targets, how you collect feedback, how often you review, who owns each action, the timeline, the cost and the expected benefit in naira.",
  "minutes": 15,
  "rows": 12,
  "placeholder": "Metric: ... target ...",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Metrics with targets", "pattern": "target|\\d+\\s?%", "min": 5 },
    { "label": "Feedback collection", "pattern": "survey|feedback|review|ask" },
    { "label": "Review frequency", "pattern": "weekly|monthly|quarterly|every" },
    { "label": "Owner and timeline", "pattern": "owner|manager|supervisor|by (end|week|month|\\d)|within \\d+" },
    { "label": "Cost and benefit in naira", "pattern": "cost[\\s\\S]*₦|₦[\\s\\S]*cost|benefit[\\s\\S]*₦" }
  ],
  "sample": "Metric: WhatsApp response within 15 minutes - target 95% (now 65%)\nMetric: first-contact resolution - target 80% (now 55%)\nMetric: CSAT - target 85% (now 72%)\nMetric: complaints per month - target below 20 (now 40)\nMetric: retention - target 88% (now 85%)\nFeedback: a five-question WhatsApp survey after each order and a monthly mystery visit\nReview: supervisor checks the figures weekly, and the manager reviews the plan monthly\nOwner and timeline: the supervisor introduces standards and scripts in week 1, training in week 2, ticket log in week 3 and the first review at the end of month 1\nCost: about ₦150,000 for training, a second phone and printing\nBenefit: keeping 10 more customers a year worth ₦54,000 each = ₦540,000, plus fewer refunds of about ₦90,000 a month",
  "required": true
}
```

When you are done, submit your complete service improvement plan as your final project.
