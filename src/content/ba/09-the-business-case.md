---
title: The business case
minutes: 25
summary: Compare options, including doing nothing, on costs, benefits, payback and risk, and recommend one in a way a decision-maker can trust.
---

## The problem

The managing partner has two quotes on her desk: a practice-management system at ₦9m to set up plus ₦3.6m a year, and a proposal from you to fix the process first, with payment terms, reminders and a weekly report, for about ₦1.5m. She asks the question every sponsor asks: **"Which one, and why?"**

"The system is better" isn't an answer. "The system has more features" isn't either. A decision-maker needs to see what each option costs, what it returns, how soon, and what could go wrong, set side by side with the option of doing nothing. That's a **business case**.

## The concept

**The structure of a business case**

1. **The problem and its cost**: from your baseline (lesson 4).
2. **Options**, always including **do nothing** (or "do minimum").
3. **Costs**: one-off (set-up, training) and running (licences, staff time), for each option.
4. **Benefits**: in naira where possible, with the assumptions behind each.
5. **Comparison**: payback, net benefit over a fixed period, and risks.
6. **Recommendation**: the option, why, and what would change your mind.

**Turning faster payment into naira**

Getting paid sooner releases cash once: **annual billing × days saved ÷ 365**. Released cash has a value every year: what it would cost to borrow it, or what it could earn.

**Two simple measures**

- **Payback period** = one-off cost ÷ annual net benefit. How soon the option pays for itself.
- **Net benefit over three years** = 3 × annual net benefit − one-off cost.

Larger organisations also use **net present value (NPV)**, which discounts future benefits because a naira next year is worth less than a naira today. For short, small projects like this one, payback and net benefit are usually enough, as long as you state the assumptions.

**Assumptions and sensitivity**

Every benefit rests on an assumption, such as "days to pay falls from 45 to 30". State each one, and test the important ones: "If days to pay only falls to 38, does the option still pay back within two years?" A case that collapses when one assumption moves a little isn't a strong case.

## Example

Ashgrove's options. Annual billing is about ₦600m; overdue debt written off is assumed to be 2% of billing today; released cash is valued at 20% a year, the firm's overdraft rate.

| | A. Do nothing | B. Fix the process | C. New system |
| :-- | --: | --: | --: |
| One-off cost | 0 | ₦1.5m | ₦9.0m |
| Running cost per year | 0 | ₦0.6m (extra accounts time) | ₦3.6m (licences) |
| Days to pay | 45 | 35 | 30 |
| Write-offs | 2% | 1.5% | 1% |
| Accounts time saved per year | 0 | 0 | ₦1.2m |

For option B: the cash released is ₦600m × 10 ÷ 365 = ₦16.4m, worth ₦3.3m a year at 20%. Write-offs fall by 0.5% of ₦600m, which is ₦3.0m a year. Take off the ₦0.6m running cost and the annual net benefit is **₦5.7m**. Payback is ₦1.5m ÷ ₦5.7m, about **3 months**, and the net benefit over three years is about **₦15.6m**.

You'll work out option C in the practice tasks. The comparison is closer than the sales demo suggested.

## Walkthrough

1. Write the problem and its cost from your lesson 4 baseline.
2. Set out the three options in a table, with costs and the assumptions behind each benefit.
3. Calculate cash released, annual net benefit, payback and three-year net benefit for options B and C in a spreadsheet.
4. Test sensitivity: what if option C's days to pay only falls to 35? What if its licence cost rises 20%?
5. List the risks: lawyers not recording time, data migration, clients ignoring reminders, the supplier going out of business.
6. Write the recommendation (the task below).

## Practice

```answer
{
  "id": "ba-09-p1",
  "prompt": "For **option C**, how much cash is released by cutting days to pay from 45 to **30** on ₦600m of annual billing? (₦600m × 15 ÷ 365. A rounded figure is fine.)",
  "answer": 24657534,
  "format": "naira",
  "hint": "600,000,000 × 15 ÷ 365.",
  "required": true
}
```

```answer
{
  "id": "ba-09-p2",
  "prompt": "What is option C's **annual net benefit**? Add the financing value of the released cash (20% of your previous answer), the write-off saving (1% of ₦600m) and the staff time saved (₦1.2m), then subtract the licences (₦3.6m). (A rounded figure is fine.)",
  "answer": 8531507,
  "format": "naira",
  "hint": "4,931,507 + 6,000,000 + 1,200,000 − 3,600,000.",
  "required": true
}
```

```answer
{
  "id": "ba-09-p3",
  "prompt": "What is option C's **payback period** in months? (₦9m one-off cost ÷ annual net benefit × 12.) One decimal place.",
  "answer": 12.7,
  "format": "number",
  "hint": "9,000,000 ÷ 8,531,507 × 12.",
  "explanation": "About 13 months, against about 3 for option B. Over three years, C's net benefit (about ₦16.6m) only just beats B's (about ₦15.6m), and C carries far more risk.",
  "required": true
}
```

```task
{
  "id": "ba-09-t1",
  "prompt": "Write your **recommendation** to the managing partner in 80 to 180 words: which option, why (using numbers from the comparison), the main **risk**, and what would make you **change your mind**.",
  "minutes": 8,
  "rows": 8,
  "placeholder": "I recommend ...",
  "rules": [
    { "label": "Names an option (A, B or C, or describes it)", "pattern": "option [abc]\\b|fix the process|new system|do nothing" },
    { "label": "Uses at least three numbers", "pattern": "\\d+(\\.\\d+)?", "min": 3 },
    { "label": "Mentions payback or net benefit", "pattern": "payback|pays back|net benefit|return" },
    { "label": "Names a risk", "pattern": "risk" },
    { "label": "Says what would change your mind", "pattern": "change (my|our) mind|reconsider|revisit|if [^.]*(fails?|doesn'?t|don'?t|falls? short|not)|unless" },
    { "label": "Between 80 and 180 words", "minWords": 80, "maxWords": 180 }
  ],
  "sample": "I recommend option B, fixing the process first: 30-day payment terms on every invoice, reminders before and on the due date, and a weekly overdue report. It costs about ₦1.5m, pays back in about 3 months, and should deliver a net benefit of about ₦15.6m over three years. Option C, the new system, would add only about ₦1m more over three years, for six times the up-front cost and a 13-month payback. The main risk to option B is that reminders slip on busy weeks, because they depend on people. I'd revisit option C after six months if days to pay hasn't fallen below 38, or if the manual reminders prove unreliable, by which time we'd also know exactly what we need a system to do.",
  "note": "Phasing (process first, system later if needed) is often the strongest recommendation: it delivers most of the benefit quickly, and it turns the expensive decision into one made with evidence.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why include 'do nothing' as an option?",
    "options": ["It's a formality", "It shows the cost of not acting, the baseline every other option must beat", "It's always the recommendation", "Sponsors require it"],
    "answer": 1,
    "explanation": "Every option is judged against carrying on as now."
  },
  {
    "prompt": "Option X pays back in 3 months; option Y in 13 months but with slightly higher three-year benefit. What else should decide it?",
    "options": ["Always pick the higher benefit", "Risk, confidence in the assumptions, and whether X can be done first with Y later", "Always pick the cheaper one", "Toss a coin"],
    "answer": 1,
    "explanation": "Numbers rest on assumptions; risk and phasing matter."
  },
  {
    "prompt": "What is a sensitivity test?",
    "options": ["Checking spelling", "Changing a key assumption to see whether the recommendation still holds", "Asking stakeholders how they feel", "Testing the software"],
    "answer": 1,
    "explanation": "A strong case survives reasonable changes to its assumptions."
  }
]
```
