---
title: Data and reporting requirements
minutes: 25
summary: Specify the KPIs, reports and data a change needs, so that "how will we know it worked?" has an exact, agreed answer before anything is built.
---

## The problem

Three months after go-live, Ashgrove's managing partner asks: "Is it working?" The supplier's dashboard says the collection rate is 94%. The accounts officer's spreadsheet says 81%. Both are "right": the supplier counts only invoices issued since go-live, and the accounts officer counts every invoice since 2024.

Nobody ever wrote down what "collection rate" meant. Reporting is the part of a change that's most often left vague, and it's the part that decides whether anyone can prove the change worked. A BA specifies it as carefully as any other requirement.

## The concept

### A KPI definition card

For every key measure, agree and write down:

| Field | Example: Average days to pay |
| :-- | :-- |
| **Name** | Average days to pay |
| **Purpose** | Shows how quickly clients pay; the main measure of the billing change |
| **Definition** | For invoices paid in the period: the average number of calendar days from issue date to paid date |
| **Formula** | AVERAGE(paid_date − issued_date), paid invoices only |
| **Source** | invoices table: issued_date, paid_date, status |
| **Baseline** | 45.4 days (all paid invoices, January 2024 to August 2026) |
| **Target** | 30 days within 12 months of go-live |
| **Owner** | Accounts officer |
| **Frequency** | Monthly, in the first week of the month |

The definition and the baseline are the parts that prevent arguments. Calculate the baseline with **exactly** the same formula you'll use afterwards.

### Report specifications

For each report: who uses it, what decision it supports, the measures and breakdowns, filters, how often it's refreshed, and who can see it. A one-line description ("an overdue report") isn't a specification.

### Data requirements

List the data each report needs, where it comes from, and the **quality rules** it must meet: every invoice has a due date; every paid invoice has a paid date; amounts are positive. Ashgrove's current data has no due date at all, so "days overdue" can't be calculated today. That's a data requirement the new process must create.

## Example

Two collection-rate definitions on Ashgrove's data:

| Definition | Value |
| :-- | --: |
| Value paid ÷ value invoiced, **all invoices** since 2024 | you'll calculate it below |
| Value paid ÷ value invoiced, **invoices more than 90 days old** (so clients have had time to pay) | you'll calculate it below |

Neither is wrong. They answer different questions. The KPI card must say which one Ashgrove will track, and why. A sensible choice is to measure invoices once they're at least 90 days old, so recent invoices don't drag the rate down just because they're recent.

## Walkthrough

1. List the measures that would show whether Ashgrove's change worked: days to pay, % paid within terms, overdue value, overdue age, collection rate.
2. Write a KPI card for each, including the baseline from your lesson 4 calculations.
3. Calculate the collection rate on the data (the first task below) and decide which definition to recommend.
4. Specify the weekly overdue report: users, decision supported, columns, sort order, filters, refresh and access.
5. List the data requirements, including the new fields the process must capture (due date, payment plan flag).

## Practice

```answer
{
  "id": "ba-08-p1",
  "prompt": "What is Ashgrove's **collection rate**, defined as the value of **Paid** invoices ÷ the value of **all** invoices? One decimal place.",
  "answer": 81.5,
  "format": "percent",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT ROUND(100.0 * SUM(CASE WHEN status = 'Paid' THEN amount_ngn END) / SUM(amount_ngn), 1) FROM invoices",
  "hint": "Sum of amount_ngn for Paid invoices ÷ sum of amount_ngn for all invoices.",
  "required": true
}
```

```answer
{
  "id": "ba-08-p2",
  "prompt": "Using the second definition, value paid ÷ value invoiced for invoices issued **more than 90 days** before 31 August 2026, what is the collection rate? One decimal place.",
  "answer": 84.7,
  "format": "percent",
  "dataset": "legal",
  "files": ["invoices"],
  "verify": "SELECT ROUND(100.0 * SUM(CASE WHEN status = 'Paid' THEN amount_ngn END) / SUM(amount_ngn), 1) FROM invoices WHERE julianday('2026-08-31') - julianday(issued_date) > 90",
  "hint": "The same formula, filtered to invoices issued before 2 June 2026.",
  "explanation": "A few points higher. Agree one definition before go-live, or the supplier and the accounts officer will report different numbers for the same thing.",
  "required": true
}
```

```task
{
  "id": "ba-08-t1",
  "prompt": "Write a **KPI definition card** for **% paid within terms**. Put each field on its own line as **Field: value**, with at least these fields: Name, Purpose, Definition, Formula, Source, Baseline, Target, Owner, Frequency. Assume 30-day terms.",
  "minutes": 8,
  "rows": 10,
  "placeholder": "Name: % paid within terms\nPurpose: ...",
  "rules": [
    { "label": "Has Name, Purpose and Definition lines", "pattern": "^\\s*(name|purpose|definition)\\s*:", "min": 3 },
    { "label": "Has Formula and Source lines", "pattern": "^\\s*(formula|source)\\s*:", "min": 2 },
    { "label": "Has Baseline and Target lines, each with a number", "pattern": "^\\s*(baseline|target)\\s*:[^\\n]*\\d", "min": 2 },
    { "label": "Has Owner and Frequency lines", "pattern": "^\\s*(owner|frequency)\\s*:", "min": 2 },
    { "label": "The definition says which invoices count (paid invoices, or all invoices due in the period)", "pattern": "paid invoices|invoices (paid|due|issued)|due in the period" }
  ],
  "sample": "Name: % paid within terms\nPurpose: Shows how many clients pay on time; a key measure of the billing change.\nDefinition: Of invoices paid in the period, the percentage paid on or before their due date (issue date + 30 days).\nFormula: COUNT(paid invoices where paid_date ≤ issued_date + 30) ÷ COUNT(paid invoices) × 100\nSource: invoices table: issued_date, paid_date, status (due_date once captured)\nBaseline: 33.6% (all paid invoices, January 2024 to August 2026)\nTarget: 70% within 12 months of go-live\nOwner: Accounts officer\nFrequency: Monthly, first week of the month",
  "note": "The baseline, 33.6%, is simply 100% minus the 66.4% paid after 30 days that you calculated in lesson 4. Reusing your own earlier calculation, with the same definition, is exactly what makes before-and-after comparisons trustworthy.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "The supplier reports a 94% collection rate; the accounts officer reports 81%. What's the most likely cause?",
    "options": ["One of them made an error", "They're using different definitions of the measure", "The data changed", "Rounding"],
    "answer": 1,
    "explanation": "Agree and write down each KPI's definition before go-live."
  },
  {
    "prompt": "Why must the baseline use exactly the same formula as later measurements?",
    "options": ["It's tidier", "Otherwise a change in the number might come from the formula, not the business", "Formulas can't change", "It doesn't matter"],
    "answer": 1,
    "explanation": "Before and after must be measured the same way."
  },
  {
    "prompt": "The current data has no due date. What does that mean for the requirements?",
    "options": ["Nothing", "Capturing a due date is a data requirement; without it, 'days overdue' can't be reported", "Use the issue date instead and say nothing", "Remove the overdue report"],
    "answer": 1,
    "explanation": "Reports can only show data that's captured."
  }
]
```
