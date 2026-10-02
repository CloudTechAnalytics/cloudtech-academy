---
title: The current state in numbers
minutes: 25
summary: Measure how things work today before changing them, set the baseline every improvement will be judged against, and find out whether a problem is everywhere or concentrated.
---

## The problem

Everyone at Ashgrove agrees that "clients pay late". But how late? Is it getting worse? Is it a few difficult clients, or everyone? Without numbers, a new process could be launched, declared a success at the Christmas party, and nobody would ever know whether it worked.

Before you change anything, measure it. The **baseline** you set now is the yardstick for every claim made about the change later. It also stops the project solving the wrong problem: if late payment turned out to be three clients, the answer would be three phone calls, not a new system.

## The concept

**Baseline measures**

Choose a few measures that capture the problem, and calculate them from the data you have:

| Measure | Definition | Why it matters |
| :-- | :-- | :-- |
| **Average days to pay** | paid date − issued date, for paid invoices | how long cash takes to arrive |
| **% paid within 30 days** | paid invoices paid in 30 days or less ÷ all paid invoices | how many clients pay on time |
| **Overdue value** | total of unpaid invoices past due | money at risk now |
| **Overdue age** | overdue value by how long it's been outstanding | how much might never be paid |

**Three questions to ask of every measure**

1. **Is it getting worse, better or staying the same?** Compare by year or quarter.
2. **Is it everywhere, or concentrated?** Break it down by client type, practice area or lawyer.
3. **How big is it?** Put a naira figure on it, so it can be compared with the cost of fixing it.

**A note on definitions**

Ashgrove marks an invoice "Overdue" when it's unpaid more than 30 days after issue, but there are no written payment terms. Note any definition like that in your analysis: if the firm later introduces 14-day terms, "overdue" will suddenly jump, without any change in client behaviour.

## Example

Average days to pay, by the year the invoice was issued:

| Year issued | Paid invoices | Average days to pay |
| :-- | --: | --: |
| 2024 | 59 | 42.4 |
| 2025 | 169 | 45.5 |
| 2026 (to August) | 99 | 47.1 |

It's getting slowly worse, by about 2 to 3 days a year. And the overdue money isn't concentrated in a few bad payers: it's spread across 32 of Ashgrove's 50 clients, companies and individuals alike. That points to a **process** problem (no terms, no reminders, no routine chasing), not a problem with particular clients.

## Walkthrough

1. Open `invoices.csv` in Excel, Power BI, SQL or Python. Add a column for days to pay (paid date − issued date) on paid invoices.
2. Calculate the four baseline measures for the whole period.
3. Break days to pay down by year issued, as in the example. Then by client type, after joining invoices to matters and clients.
4. Age the overdue invoices as of 31 August 2026: 31–60 days, 61–90, 91–180 and over 180 days since issue.
5. Write your baseline summary (the task below).

> [!TIP]
> Keep the queries or workbook you used. When the change goes live, you'll rerun exactly the same calculations to show whether it worked, and a baseline calculated differently from the "after" figures proves nothing.

## Practice

```answer
{
  "id": "ba-04-p1",
  "prompt": "For **paid** invoices, what is the **average number of days** from issue to payment? One decimal place.",
  "answer": 45.4,
  "format": "number",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT ROUND(AVG(julianday(paid_date) - julianday(issued_date)), 1) FROM invoices WHERE status = 'Paid'",
  "hint": "paid_date − issued_date for each paid invoice, then the average.",
  "required": true
}
```

```answer
{
  "id": "ba-04-p2",
  "prompt": "What percentage of **paid** invoices were paid **more than 30 days** after issue? One decimal place.",
  "answer": 66.4,
  "format": "percent",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT ROUND(100.0 * SUM(julianday(paid_date) - julianday(issued_date) > 30) / COUNT(*), 1) FROM invoices WHERE status = 'Paid'",
  "hint": "Count the paid invoices with days to pay over 30, divided by all paid invoices.",
  "explanation": "Two-thirds of clients who do pay take more than a month. Late payment is the norm, not the exception.",
  "required": true
}
```

```answer
{
  "id": "ba-04-p3",
  "prompt": "As of **31 August 2026**, how much of the overdue value is from invoices issued **more than 180 days** earlier? (A rounded figure is fine.)",
  "answer": 149180000,
  "format": "naira",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT SUM(amount_ngn) FROM invoices WHERE status = 'Overdue' AND julianday('2026-08-31') - julianday(issued_date) > 180",
  "hint": "Overdue invoices whose issue date is before 2026-03-04.",
  "explanation": "₦149.2m of the ₦188.1m overdue (79%) is more than six months old. Much of it may never be collected, which is the strongest argument for acting now.",
  "required": true
}
```

```task
{
  "id": "ba-04-t1",
  "prompt": "Write a **baseline summary** of Ashgrove's current billing performance for the managing partner, in 3 to 5 bullets. Use at least **four** numbers, say whether things are getting **better or worse**, and say whether the problem is **concentrated or widespread**.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "- Clients take an average of ...",
  "rules": [
    { "label": "Three to five bullets", "pattern": "^\\s*[-*]\\s+\\S", "min": 3 },
    { "label": "At least four numbers", "pattern": "\\d+(\\.\\d+)?", "min": 4 },
    { "label": "Says whether it's getting better or worse", "pattern": "worse|better|improv|deteriorat|rising|increas|grow|slower|faster" },
    { "label": "Says whether it's concentrated or widespread", "pattern": "concentrat|widespread|spread|across|most clients|few clients|32" },
    { "label": "No more than 150 words", "maxWords": 150 }
  ],
  "sample": "- Clients take an average of 45.4 days to pay, and 66.4% of paid invoices arrive after 30 days.\n- It's getting slowly worse: from 42.4 days for 2024 invoices to 47.1 days for 2026 invoices.\n- ₦188.1m is overdue across 70 invoices, and ₦149.2m of it is more than six months old.\n- The problem is widespread, not a few bad payers: overdue invoices are spread across 32 of 50 clients, companies and individuals alike.\n- That points to the process (no payment terms, no reminders, chasing only when a partner asks) rather than to particular clients.",
  "note": "This becomes the \"before\" picture in your business case and the yardstick after go-live. Keep the exact definitions with it.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why set a baseline before changing a process?",
    "options": ["It's a formality", "So you can show afterwards whether the change actually worked, measured the same way", "To delay the project", "Baselines are only for finance"],
    "answer": 1,
    "explanation": "Without a baseline, any claim of improvement is a guess."
  },
  {
    "prompt": "Overdue invoices are spread across 32 of 50 clients. What does that suggest?",
    "options": ["A few bad clients", "A process problem that affects most clients", "The data is wrong", "Nothing"],
    "answer": 1,
    "explanation": "Widespread problems point to the process; concentrated ones point to particular cases."
  },
  {
    "prompt": "The firm plans to introduce 14-day payment terms. What will happen to the 'overdue' figure?",
    "options": ["Nothing", "It may jump immediately, because the definition changed, not client behaviour", "It will fall", "It can't be calculated"],
    "answer": 1,
    "explanation": "Note definition changes so nobody mistakes them for real changes."
  }
]
```
