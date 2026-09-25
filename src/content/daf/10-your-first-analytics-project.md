---
title: Your first analytics project
minutes: 40
summary: Run the whole cycle on Kolanut's staff data, from question to recommendation, and prepare for the final project.
---

## The problem

Kolanut's HR manager is worried: "It feels like we keep losing people, especially in customer service. Is that true, and what should we do?"

This lesson walks through a small but complete analysis of that question. The course's final project then asks you to take it further on your own.

```dataset
{ "dataset": "hr", "files": ["employees", "attendance", "leave"] }
```

## The concept

A complete analysis, even a small one, has five parts. You'll produce them for the final project:

1. **The question**, in measurable form.
2. **The data** you used and anything you cleaned or excluded.
3. **The analysis**: the calculations and a chart or table.
4. **The finding**, in one or two sentences.
5. **The recommendation** and its limits: what the data can't tell you.

**A note on small numbers.** Kolanut has 80 employees. When you split them by department, some groups have only 6 or 8 people. One resignation in a group of 8 moves the rate by 12.5 percentage points. Report the counts next to the rates, and be careful about strong conclusions from small groups.

## Example

**Question.** Of everyone Kolanut has employed since 2018, what share has resigned, and does it differ by department?

**Data.** `employees.csv`: one row per employee, with `department`, `job_level` and `status` (Active or Resigned).

**Analysis.**

| Department | Staff | Resigned | Resigned % |
| :-- | --: | --: | --: |
| Customer Service | 8 | 3 | 37.5% |
| Finance | 10 | 2 | 20.0% |
| Operations | 27 | 5 | 18.5% |
| IT | 12 | 1 | 8.3% |
| Sales | 17 | 0 | 0.0% |
| Human Resources | 6 | 0 | 0.0% |
| **All** | **80** | **11** | **13.8%** |

**Finding.** Customer Service has the highest share of resignations (3 of 8 people, 37.5%), about three times the company-wide rate. By job level, all 11 people who left were Junior or Mid level; no Senior staff or Managers resigned.

**Recommendation.** Hold short exit and "stay" conversations with Customer Service staff to understand why people leave, and review junior pay and workload there. **Limit:** these are small numbers, and the data has no reasons for leaving, so treat this as a signal to investigate, not proof.

## Walkthrough

How to produce the table above in a spreadsheet:

1. Open `employees.csv` in Google Sheets or Excel.
2. Insert a **pivot table** (Sheets: Insert → Pivot table; Excel: Insert → PivotTable).
3. Put `department` in **Rows**.
4. Put `employee_id` in **Values**, summarised by **COUNTA** (Sheets) or **Count** (Excel). That's the Staff column.
5. Put `status` in **Columns**. You now have Active and Resigned counts per department.
6. Next to the pivot, calculate Resigned ÷ Staff × 100 for each department.
7. Sort by the percentage, largest first.

> [!TIP]
> If pivot tables are new to you, a formula works too: `=COUNTIFS(C:C,"Customer Service",H:H,"Resigned")` counts resigned Customer Service staff, if department is in column C and status in column H. The Excel course covers both methods properly.

## Practice

```answer
{
  "id": "daf-10-p1",
  "prompt": "Across **all** 80 employees, what percentage have resigned? Give one decimal place.",
  "answer": 13.8,
  "tolerance": 0.06,
  "format": "percent",
  "dataset": "hr",
  "files": ["employees"],
  "verify": "SELECT ROUND(100.0 * SUM(status = 'Resigned') / COUNT(*), 2) FROM employees",
  "hint": "Count the Resigned rows, divide by the total number of rows, multiply by 100.",
  "explanation": "11 of 80, which is 13.75%, shown as 13.8% to one decimal place.",
  "required": true
}
```

```answer
{
  "id": "daf-10-p2",
  "prompt": "Now attendance. In `attendance.csv` (June 2026, active staff only), how many records have the status **Late**?",
  "answer": 103,
  "format": "number",
  "dataset": "hr",
  "files": ["attendance"],
  "verify": "SELECT COUNT(*) FROM attendance WHERE status = 'Late'",
  "hint": "Filter the status column to Late and count, or use COUNTIF on the status column.",
  "explanation": "The final project asks you to break this down by department. One department stands out.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "A department of 6 people had 1 resignation. Why should you be careful calling its rate (16.7%) 'high'?",
    "options": ["Rates can't be calculated for small groups", "With so few people, one person changes the rate a lot, so it may be chance", "6 is an even number", "Resignations are always normal"],
    "answer": 1,
    "explanation": "Small groups produce jumpy percentages. Show the counts and treat the rate as a signal."
  },
  {
    "prompt": "Which part of an analysis says what the data can't tell you?",
    "options": ["The question", "The limits stated with the recommendation", "The chart title", "The data source"],
    "answer": 1,
    "explanation": "Stating limits is part of honest analysis: here, the data has no reasons for leaving."
  },
  {
    "prompt": "In the pivot table, why put status in Columns?",
    "options": ["To sort alphabetically", "To split each department's count into Active and Resigned side by side", "To remove resigned staff", "Columns are required"],
    "answer": 1,
    "explanation": "It gives the two counts you need to calculate a rate for each department."
  }
]
```

When you've finished this lesson, take the final assessment, then open the final project from the course page.
