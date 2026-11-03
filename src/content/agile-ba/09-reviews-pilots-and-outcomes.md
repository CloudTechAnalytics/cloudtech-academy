---
title: Reviews, pilots and outcomes
minutes: 20
summary: Run sprint reviews that produce real feedback, design a pilot with success criteria agreed in advance, and decide what to do next from the evidence.
---

## The problem

The kiosk app goes to 15 kiosks in Surulere for a six-week pilot. Afterwards there will be a meeting to decide whether to roll it out to all 39 kiosks, change it, or stop. Without preparation, that meeting goes one of two ways: the people who championed the app call it a success because "the kiosks liked it", or the people who doubted it call it a failure because "only 9 kiosks used it every week". Both will have a point, and neither will have evidence.

A pilot is an experiment. It needs a question, success criteria agreed **before** it starts, and a plan for measuring them. Otherwise the result is decided by whoever argues best afterwards.

## The concept

### Sprint reviews that produce feedback

A sprint review isn't a presentation; it's a working session to inspect the increment and adapt the backlog. To make it useful:

- Invite **real users** (a kiosk owner, a sales rep), not just managers.
- Demonstrate against the **sprint goal**, with real-looking data.
- Ask **specific questions**: "Would you use reorder instead of calling your rep? What would stop you?"
- Turn feedback into **backlog items** before people leave the room.

### Designing a pilot

| Part | Kiosk app pilot |
| :-- | :-- |
| **Question** | Does the app make kiosks order more often? |
| **Who and how long** | 15 Surulere kiosks, six weeks |
| **Comparison** | the same kiosks' ordering in the six weeks before, and similar kiosks elsewhere over the same weeks |
| **Success criteria** (agreed in advance) | average days between orders falls from about 22 to 14 or fewer; at least 60% of pilot kiosks' orders placed in the app; no fall in average order value |
| **Decision rule** | all three met: roll out; adoption high but frequency unchanged: rethink; adoption low: find out why before spending more |

The **comparison group** matters. If kiosks everywhere order more in the pilot weeks (say, before a holiday), a rise in the pilot group proves nothing about the app.

### Validated learning

Treat every release as a test of an assumption: "kiosk owners will reorder in the app if it takes under a minute". Measure, learn, and adjust the backlog. Sometimes the right outcome of a pilot is to stop, and that's a success if it saves the money a full rollout would have cost.

## Example

The BA's plan for the sprint 7 review, where reorder is demonstrated:

1. **Goal reminder** (2 minutes): "Kiosks can reorder last week's basket in two taps."
2. **Demonstration** by a developer, using a real kiosk's last basket (5 minutes).
3. **Hands-on**: the kiosk owner tries it on her own phone while everyone watches in silence (5 minutes).
4. **Questions** (10 minutes): "What did you expect to happen when you tapped reorder? Would you change anything before confirming? When would you use this instead of waiting for the rep?"
5. **Backlog** (5 minutes): new items agreed and added; priorities checked against the product goal.

Step 3 usually teaches the team more than the rest of the review put together.

## Walkthrough

1. Write the pilot's question, groups, duration and comparison.
2. Agree the success criteria and the decision rule with the product owner and the commercial director **before** the pilot starts (the task below).
3. Check you can measure every criterion: frequency from the sales data, adoption from the app, order value from both.
4. Plan the next sprint review with a real kiosk owner and specific questions.
5. Plan the pilot-end meeting: the numbers, what they mean, and the decision the rule points to.

## Practice

```task
{
  "id": "aba-09-t1",
  "prompt": "Write the **pilot plan** for the kiosk app as lines starting with these headings: **Question:**, **Who:**, **Comparison:**, **Success criteria:** (at least two criteria, each with a number) and **Decision rule:**.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Question: ...\nWho: ...\nComparison: ...\nSuccess criteria: ...\nDecision rule: ...",
  "rules": [
    { "label": "A Question line", "pattern": "^\\s*[-*]?\\s*question\\s*:" },
    { "label": "A Who line, with a number of kiosks or a duration", "pattern": "^\\s*[-*]?\\s*who\\s*:[^\\n]*\\d" },
    { "label": "A Comparison line", "pattern": "^\\s*[-*]?\\s*comparison\\s*:" },
    { "label": "Success criteria with at least two numbers", "pattern": "success criteria\\s*:[^\\n]*\\d[^\\n]*\\d|success criteria\\s*:\\s*\\n(?:\\s*[-*][^\\n]*\\d[^\\n]*\\n?){2,}" },
    { "label": "A Decision rule line saying what happens if criteria are or aren't met", "pattern": "decision rule\\s*:[^\\n]*(roll|stop|rethink|change|expand|if)" }
  ],
  "sample": "Question: Does the app make kiosk owners order more often, without reducing what they buy?\nWho: 15 kiosks in Surulere, for six weeks from 22 June 2026.\nComparison: the same kiosks in the six weeks before the pilot, and 10 similar kiosks in Yaba over the same six weeks.\nSuccess criteria: average days between orders falls from about 22 to 14 or fewer; at least 60% of pilot kiosks' orders are placed in the app; average order value doesn't fall by more than 5%.\nDecision rule: if all three are met, roll out to all 39 kiosks; if adoption is high but ordering frequency hasn't changed, rethink the reorder and reminder features before rollout; if adoption is below 30%, interview pilot kiosks before spending more.",
  "note": "Agreeing the decision rule in advance is what stops the pilot meeting becoming a debate about opinions. Whatever the numbers show, everyone already knows what they mean.",
  "required": true
}
```

```task
{
  "id": "aba-09-t2",
  "prompt": "Write **five questions** you'd ask a kiosk owner at the sprint review after they try the reorder feature. Each on its own line, ending with a question mark. Make them **open**, and include at least one about **when they'd use it** and one about **what would stop them**.",
  "minutes": 5,
  "rows": 6,
  "placeholder": "What did you expect to happen when ...?",
  "rules": [
    { "label": "Five questions, each ending with ?", "pattern": "\\?\\s*$", "min": 5 },
    { "label": "Mostly open questions (what, how, when, why, tell me, describe)", "pattern": "^\\s*(\\d+[.)]\\s*|[-*]\\s*)?(what|how|when|why|which|tell me|describe|walk me)\\b", "min": 4 },
    { "label": "Asks when they'd use it", "pattern": "when would|when do you|what time|how often" },
    { "label": "Asks what would stop them", "pattern": "stop you|prevent|get in the way|instead|why not|put you off" },
    { "label": "No leading questions (don't you think, wouldn't you, isn't it)", "pattern": "don'?t you think|wouldn'?t you|isn'?t it|surely", "absent": true }
  ],
  "sample": "1. What did you expect to happen when you tapped reorder?\n2. What would you want to change in the basket before confirming?\n3. When would you use this instead of waiting for your rep's visit?\n4. What might stop you using it on a busy day?\n5. How would you check the order had gone through?",
  "note": "Question 4 is the one product teams most often forget to ask, and its answer (\"my phone has no data until evening\", \"I don't trust it without a call\") usually becomes the next backlog item.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why agree a pilot's success criteria before it starts?",
    "options": ["It's a formality", "So the result is judged against agreed evidence, not argued afterwards by whoever cares most", "To make the pilot shorter", "Criteria can't be changed later"],
    "answer": 1,
    "explanation": "Agreed criteria and a decision rule turn opinions into a decision."
  },
  {
    "prompt": "Pilot kiosks ordered 20% more often, but so did kiosks elsewhere in the same weeks. What can you conclude?",
    "options": ["The app works", "The rise may be seasonal; compared with the other kiosks, there's no evidence the app caused it", "The app failed", "Nothing at all"],
    "answer": 1,
    "explanation": "That's why a pilot needs a comparison group."
  },
  {
    "prompt": "Who should attend a sprint review for the kiosk app?",
    "options": ["Only the team", "The team, the product owner and real users such as a kiosk owner and a sales rep", "Only senior managers", "Only the scrum master"],
    "answer": 1,
    "explanation": "Real users give the feedback that changes the backlog."
  }
]
```
