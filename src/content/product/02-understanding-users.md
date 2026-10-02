---
title: Understanding users
minutes: 20
summary: Learn what users are trying to get done with jobs-to-be-done interviews, ask questions that don't lead, code interview notes into patterns, and see why each segment needs something different.
---

## The problem

Paystream's team describes its users as "Nigerians who want to send money". But a market trader collecting payments at a stall, a salary earner paying bills on payday and a student splitting the cost of a night out want very different things. Building for an average user builds for nobody.

The researcher interviewed 24 users, six from each segment. The interviews are coded: each one records the user's main job and their biggest pain.

## The concept

**Jobs to be done**

People don't want a wallet; they want to get something done. "Collect payment quickly at my stall" is a job. Features are judged by how well they help with a job.

**Interviewing well**

| Instead of | Ask |
| :-- | :-- |
| "Would you use savings goals?" (leading, hypothetical) | "Tell me about the last time you saved for something." |
| "Do you like the app?" | "Walk me through the last payment you made. What happened?" |
| "What features do you want?" | "What did you do when that didn't work?" |

Ask about **past behaviour**, not opinions about the future. People are poor at predicting what they'll do.

**Coding notes**

Tag each interview with the job, the pain and anything surprising, then count across interviews. Six interviews per segment won't give percentages you can trust, but they show patterns worth measuring.

## Example

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/product/"
interviews = pd.read_csv(base + "interviews.csv")
pd.crosstab(interviews["biggest_pain"], interviews["segment"])
```

```text
segment                    Market trader  Salary earner  Small business  Student
biggest_pain
App crashes                            2              0               0        0
BVN verification problems              2              0               2        0
Bulk payroll payments                  0              0               2        0
Card delivery delays                   0              2               0        0
No USSD or offline access              2              0               0        0
Savings goals                          0              2               0        2
Split bills                            0              0               0        2
Transfer fees                          0              2               2        2
```

Each segment's pains are different. Traders talk about verification, offline access and crashes; small businesses about payroll, fees and verification. Read a quote for each of the most common pains:

```python
for pain in interviews["biggest_pain"].value_counts().index[:4]:
    row = interviews[interviews["biggest_pain"] == pain].iloc[0]
    print(f"{pain} ({row['segment']}): \"{row['quote']}\"")
```

```text
Transfer fees (Salary earner): "Ten naira here, twenty-five there. For small amounts it adds up."
BVN verification problems (Market trader): "I tried three times. My BVN has my old name. In the end I went back to the bank."
Savings goals (Salary earner): "If I don't put rent money aside, it disappears. I want to lock it."
Split bills (Student): "Every weekend one person pays and then we chase each other for days."
```

Quotes make pains real for the team, but they're anecdotes. Lesson 3 checks whether the patterns show up across 1,500 pieces of feedback, and lesson 4 whether they show up in what new users actually do.

## Walkthrough

1. Run the cells. Which jobs appear for market traders?
2. Rewrite three leading questions as questions about past behaviour (the task below).
3. Which pains appear in more than one segment?
4. What would you want to measure next to check the traders' verification problem?

## Practice

```answer
{
  "id": "pdm-02-p1",
  "prompt": "How many interviews were with **market traders**?",
  "answer": 6,
  "format": "number",
  "dataset": "product",
  "files": ["interviews"],
  "pyVerify": "int((interviews['segment'] == 'Market trader').sum())",
  "hint": "Add up the Market trader column.",
  "required": true
}
```

```task
{
  "id": "pdm-02-t1",
  "prompt": "Rewrite these three leading questions as questions about **past behaviour**, one per numbered line: (1) \"Would you use a USSD option?\" (2) \"Are our fees too high?\" (3) \"Would you split bills in the app?\"",
  "minutes": 5,
  "rows": 4,
  "placeholder": "1. Tell me about the last time ...",
  "rules": [
    { "label": "Three numbered questions", "pattern": "^\\s*\\d[.)]\\s+\\S", "min": 3 },
    { "label": "About past events (last time, tell me about, walk me through, what happened)", "pattern": "last time|tell me about|walk me through|what happened|when did you", "min": 3 },
    { "label": "No 'would you'", "pattern": "would you", "absent": true },
    { "label": "No yes/no 'are our' or 'do you like'", "pattern": "are our|do you like", "absent": true }
  ],
  "sample": "1. Tell me about the last time you needed to send money but had no data or network. What did you do?\n2. Walk me through the last few transfers you made. How did you decide which app or bank to use?\n3. Tell me about the last time you and your friends shared a cost. How did everyone pay their part?",
  "note": "Each question asks what happened, so the answer is evidence, not a guess about the future.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Which is a job to be done?",
    "options": ["A savings feature", "Put rent money aside so it isn't spent", "A mobile app", "A 5-star rating"],
    "answer": 1,
    "explanation": "Jobs are what people are trying to achieve."
  },
  {
    "prompt": "Why ask about past behaviour rather than future intentions?",
    "options": ["It's quicker", "People are poor at predicting what they'll do; what they did is evidence", "It's polite", "Future questions are illegal"],
    "answer": 1,
    "explanation": "Behaviour beats opinion."
  },
  {
    "prompt": "Six interviews per segment show a pattern. What next?",
    "options": ["Build it immediately", "Check whether the pattern holds in larger data, such as feedback and usage", "Ignore it", "Interview the same people again"],
    "answer": 1,
    "explanation": "Interviews suggest; data confirms."
  }
]
```
