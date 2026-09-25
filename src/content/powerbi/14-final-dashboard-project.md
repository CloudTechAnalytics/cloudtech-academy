---
title: Final dashboard project
minutes: 45
summary: Plan and start a practice-management dashboard for a law firm, checking your model against known numbers before you build.
---

## The problem

Ashgrove Chambers, a Lagos law firm, runs its practice from spreadsheets: matters, court hearings and invoices. The managing partner wants one report answering: *How much work is open, and whose? How often are our hearings adjourned? How much money is outstanding, and who owes it?*

That's your final project. This lesson sets it up and checks your model against numbers you know are right, so you start the design work on solid ground.

```dataset
{ "dataset": "legal" }
```

## The concept

**The data**

| Table | One row is | Key columns |
| :-- | :-- | :-- |
| `clients` | a client | client_id, client_name, client_type (Company/Individual) |
| `matters` | a case or piece of work | matter_id, client_id, matter_title, practice_area, responsible_lawyer, opened_date, closed_date, status (Open/Closed/On hold) |
| `hearings` | a court date | hearing_id, matter_id, hearing_date, court, outcome (Heard, Adjourned, Struck out, Judgment delivered, Scheduled) |
| `invoices` | a bill | invoice_id, matter_id, issued_date, amount_ngn, status (Paid/Outstanding/Overdue), paid_date |

**The model** is a snowflake-ish star: `clients` (1) → `matters` (*); `matters` (1) → `hearings` (*) and `matters` (1) → `invoices` (*). Add a `Date` table and relate it to the date you'll analyse most (e.g. `invoices[issued_date]`), with inactive relationships to the others, used with `USERELATIONSHIP` in measures where needed.

**Measures you'll need** (suggestions; name and format them well):

```dax
Open Matters = CALCULATE ( COUNTROWS ( matters ), matters[status] = "Open" )

Hearings Held = CALCULATE ( COUNTROWS ( hearings ), hearings[outcome] <> "Scheduled" )

Adjournment Rate =
DIVIDE (
    CALCULATE ( COUNTROWS ( hearings ), hearings[outcome] = "Adjourned" ),
    [Hearings Held]
)

Billed = SUM ( invoices[amount_ngn] )

Overdue Amount = CALCULATE ( [Billed], invoices[status] = "Overdue" )

Collection Rate = DIVIDE ( CALCULATE ( [Billed], invoices[status] = "Paid" ), [Billed] )
```

## Example

A three-page structure that works:

1. **Overview**: cards (open matters, adjournment rate, overdue amount, collection rate); open matters by practice area; billed vs collected by month.
2. **Litigation**: hearings by court and outcome; adjournment rate by court and practice area; upcoming (scheduled) hearings list.
3. **Billing**: overdue invoices by client (top 10); ageing of unpaid invoices; collection rate trend.

## Walkthrough

1. Load the four CSVs; check the row counts and types (dates as Date).
2. Build the relationships in Model view; check each is one-to-many and single direction.
3. Add a date table and mark it.
4. Write the measures above in a `_Measures` table.
5. **Check before you design.** Put each measure in a card and compare it with the answers below. If one disagrees, fix the model or measure first.
6. Then design the pages, applying the dashboard design and storytelling lessons.

## Practice

```answer
{
  "id": "pbi-14-p1",
  "prompt": "What is Ashgrove Chambers' **adjournment rate**: adjourned hearings ÷ hearings that have taken place (all outcomes except Scheduled)? One decimal place.",
  "answer": 52.4,
  "format": "percent",
  "dataset": "legal",
  "files": ["hearings"],
  "verify": "SELECT ROUND(100.0 * SUM(outcome = 'Adjourned') / SUM(outcome <> 'Scheduled'), 1) FROM hearings",
  "hint": "Adjournment Rate measure in a card, formatted as a percentage.",
  "explanation": "52.4%: more than half of hearings that took place were adjourned, a familiar problem in Nigerian courts and a strong story for the dashboard.",
  "required": true
}
```

```answer
{
  "id": "pbi-14-p2",
  "prompt": "What is the total **Overdue Amount**, in naira?",
  "answer": 188070000,
  "format": "naira",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT SUM(amount_ngn) FROM invoices WHERE status = 'Overdue'",
  "required": true
}
```

```answer
{
  "id": "pbi-14-p3",
  "prompt": "How many matters are currently **Open**?",
  "answer": 34,
  "format": "number",
  "dataset": "legal",
  "files": ["matters"],
  "verify": "SELECT COUNT(*) FROM matters WHERE status = 'Open'",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why exclude Scheduled hearings from the adjournment rate's denominator?",
    "options": ["They're errors", "They haven't happened yet, so they can't have been adjourned", "They're in a different court", "DAX can't count them"],
    "answer": 1,
    "explanation": "Only hearings that took place can have an outcome."
  },
  {
    "prompt": "Invoices, hearings and matters all have dates. How can one Date table serve them all?",
    "options": ["It can't", "One active relationship plus inactive ones, activated in measures with USERELATIONSHIP", "Merge all tables into one", "Use three separate date tables always"],
    "answer": 1,
    "explanation": "USERELATIONSHIP turns on an inactive relationship for a single calculation."
  },
  {
    "prompt": "Why check measures against known values before designing pages?",
    "options": ["It's required to publish", "Design built on a wrong measure has to be redone, and trust is lost", "It makes visuals faster", "To choose colours"],
    "answer": 1,
    "explanation": "Verify the numbers first; polish second."
  }
]
```

When you've finished, take the final assessment, then submit your dashboard through the final project page.
