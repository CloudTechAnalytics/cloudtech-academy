---
title: Analysing feedback
minutes: 25
summary: Turn 1,500 pieces of feedback from four sources into evidence, count themes properly, spot when one channel's loudness distorts the picture, and weigh feedback against who your users actually are.
---

## The problem

Paystream's sales team brings up bulk payroll at every meeting: "every business customer is asking for it". The support lead says verification problems are drowning her team. App reviews complain about fees and crashes. Everyone has a list, and each list is honest. They can't all be the top priority.

Feedback is evidence, but only if you count it carefully and know where it came from.

## The concept

### Count by theme and source

Tag every item with a theme (the dataset is already tagged), then count by theme **and** by source. A theme that dominates one source but not the others is a sign of that channel's audience, not of all users.

### Weigh against your users

Compare who gives feedback with who your users are. If one segment is 15% of users but gives most of the feedback on a theme, that theme matters to them, not necessarily to everyone.

### Severity

App store ratings show how much an issue hurts. One-star reviews about crashes cost downloads.

### Requests are not solutions

"Add USSD" is one user's idea of a solution; the problem is "I can't pay when the network is bad". Keep problems and requested solutions apart.

![Feedback themes counted by source with illustrative shares: crashes dominate app store reviews, slow support dominates support tickets, and missing USSD dominates sales team notes](/images/courses/product/feedback-sources.svg "Count themes by source: each channel speaks for its own audience.")

## Example

Themes by source:

```python
import pandas as pd

base = "https://academy.cloudtechanalytics.com/datasets/product/"
feedback = pd.read_csv(base + "feedback.csv")
users = pd.read_csv(base + "users.csv")

by_source = pd.crosstab(feedback["theme"], feedback["source"], margins=True).sort_values("All", ascending=False)
by_source
```

```text
source                     App review  Sales team  Support ticket  Survey   All
theme
All                               686         150             530     134  1500
Transfer fees                     116          10             102      21   249
BVN verification problems         131           9              91      18   249
Bulk payroll payments              46         111              38      10   205
App crashes                        98           6              77      19   200
Savings goals                      97           1              75      19   192
Split bills                        74           9              52      19   154
No USSD or offline access          69           1              53      19   142
Card delivery delays               55           3              42       9   109
```

Most of bulk payroll's feedback comes from one source: the sales team. Who is it coming from, compared with Paystream's users?

```python
payroll = feedback[feedback["theme"] == "Bulk payroll payments"]
print("Bulk payroll feedback by segment:", (payroll["segment"].value_counts(normalize=True) * 100).round(0).to_dict())
print("New users by segment:", (users["segment"].value_counts(normalize=True) * 100).round(0).to_dict())
print("Sales team items that are about payroll:", f"{(feedback[feedback['source'] == 'Sales team']['theme'] == 'Bulk payroll payments').mean():.0%}")
```

```text
Bulk payroll feedback by segment: {'Small business': 77.0, 'Salary earner': 13.0, 'Market trader': 6.0, 'Student': 4.0}
New users by segment: {'Market trader': 35.0, 'Salary earner': 30.0, 'Student': 20.0, 'Small business': 15.0}
Sales team items that are about payroll: 74%
```

Payroll is a real need for small businesses, about one in seven new users, and the sales team hears about it constantly because small businesses are who they talk to. That doesn't make it the biggest problem for Paystream's users overall. Now severity, from app store ratings:

```python
reviews = feedback[feedback["source"] == "App review"]
reviews.groupby("theme")["rating"].agg(reviews="size", average_rating="mean").round(2).sort_values("average_rating")
```

```text
reviews  average_rating
theme
App crashes                     98            1.72
BVN verification problems      131            1.86
Card delivery delays            55            2.84
Transfer fees                  116            2.84
Bulk payroll payments           46            3.22
No USSD or offline access       69            3.25
Savings goals                   97            3.25
Split bills                     74            3.34
```

Crashes and verification problems get the lowest ratings, and they're also the themes users can't work around: if verification fails, they can't use Paystream at all.

## Walkthrough

1. Run the cells. Excluding the sales team, what are the top three themes?
2. Which segment gives most of the feedback about USSD and offline access?
3. Split one theme into the problem and the requested solution.
4. Write a reply to the sales team (the task below).

## Practice

```answer
{
  "id": "pdm-03-p1",
  "prompt": "What share of the **sales team's** feedback is about **bulk payroll**? As a percentage, whole number.",
  "answer": 74,
  "format": "percent",
  "dataset": "product",
  "files": ["feedback"],
  "pyVerify": "round((feedback[feedback['source'] == 'Sales team']['theme'] == 'Bulk payroll payments').mean() * 100)",
  "hint": "The last line printed.",
  "required": true
}
```

```task
{
  "id": "pdm-03-t1",
  "prompt": "Reply to the sales team's \"every business customer is asking for payroll\" in 50 to 120 words: acknowledge the **need**, show what the **wider feedback** says (with **numbers**), and explain **how** payroll will be considered.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "Thank you for ...",
  "rules": [
    { "label": "Acknowledges the need", "pattern": "real|need|important|hear|understand" },
    { "label": "Uses numbers", "pattern": "\\d", "min": 2 },
    { "label": "Mentions other themes (verification, fees, crashes)", "pattern": "verification|bvn|fees|crash" },
    { "label": "Explains the process (prioritis, RICE, compare, evidence)", "pattern": "prioriti|rice|compare|evidence|score|weigh" },
    { "label": "Between 50 and 120 words", "minWords": 50, "maxWords": 120 }
  ],
  "sample": "Thank you: payroll is a real need, and you hear it from almost every small business you visit. Across all 1,500 pieces of feedback, it's one of the most common themes, but most of it comes from your team's conversations, and small businesses are about one in seven of our new users. Verification problems and fees come up more often across app reviews, support and surveys, and verification failures stop people using Paystream at all. We'll score payroll alongside the other ideas using reach, impact, confidence and effort, and share the result with you before the roadmap is set.",
  "note": "The reply respects the request and explains the decision process, so sales can see payroll was weighed, not ignored.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "One theme dominates feedback from one source but is rare elsewhere. What does that suggest?",
    "options": ["It's the top priority", "It reflects that source's audience; weigh it against all users", "It's fake", "Ignore the source"],
    "answer": 1,
    "explanation": "Know where feedback comes from."
  },
  {
    "prompt": "A user writes 'Add USSD'. What's the underlying problem?",
    "options": ["They like USSD", "They can't pay when network or data is unavailable", "They dislike the app", "Nothing"],
    "answer": 1,
    "explanation": "Separate problems from requested solutions."
  },
  {
    "prompt": "Why look at app store ratings by theme?",
    "options": ["To find happy users", "To see which problems hurt most", "Ratings are random", "To count downloads"],
    "answer": 1,
    "explanation": "Severity, not just volume."
  }
]
```
