---
title: From question to insight
minutes: 30
summary: Run a complete analysis in a notebook: turn a vague question into answerable ones, check the data, analyse, test the obvious explanation, and write findings a manager can act on, with honest caveats.
---

## The problem

Kolanut's HR director sends Bisi one line:

> "We keep losing people. Why, and what should we do about it?"

That's a real business question, and like most, it isn't one you can answer with a single line of pandas. Analysts who jump straight to code produce a pile of tables. Analysts who are valued produce **three sentences the director can act on**. This lesson walks through the whole process on Kolanut's HR data, using everything from the course so far.

## The concept

**1. Turn the question into answerable questions**

"Why are we losing people?" becomes:

- How many people have left, and what share of everyone we've employed is that?
- **Who** leaves: which levels, which departments?
- **When** do they leave: how long after joining?
- Is it **pay**? Do leavers earn less than colleagues at the same level who stayed?

Each of these maps to a filter, a groupby or a comparison you already know.

**2. Check the data before trusting it**

Before analysing, confirm the data means what you think it means. Does every `Resigned` employee have an `exit_date`, and does nobody `Active` have one? Are the dates real dates? Any duplicates? Five minutes of checks protects every number that follows.

**3. Analyse: rates, not counts**

Use rates to compare groups of different sizes, compare like with like, and keep a note of how many people are behind each figure.

**4. Test the obvious explanation**

Everyone will assume pay. Check it directly. An analysis that rules out the obvious explanation is often more valuable than one that confirms it.

**5. Write the finding, with the caveat**

A finding has three parts: **what** you found (with a number), **so what** it means, and **now what** you recommend. Then the honest limit: here, only 11 people have left in seven years. Patterns in 11 people are worth acting on, but not worth over-claiming.

> [!BUSINESS]
> Small numbers deserve careful words. "All 11 leavers were junior or mid-level" is a fact. "Seniors never leave" is a claim the data can't support.

## Example

Load, check and set up:

```python
import pandas as pd

hr = "https://academy.cloudtechanalytics.com/datasets/hr/"
employees = pd.read_csv(hr + "employees.csv", parse_dates=["hire_date", "exit_date"])

# Check: Resigned <=> has an exit date
mismatches = ((employees["status"] == "Resigned") != employees["exit_date"].notna()).sum()
print(f"{len(employees)} employees, {employees['employee_id'].duplicated().sum()} duplicate IDs, {mismatches} status/exit mismatches")

employees["left"] = employees["status"] == "Resigned"
as_of = pd.Timestamp("2026-06-30")
employees["tenure_years"] = (employees["exit_date"].fillna(as_of) - employees["hire_date"]).dt.days / 365.25
print(f"{employees['left'].sum()} have left ({employees['left'].mean():.1%} of everyone employed)")
```

```text
80 employees, 0 duplicate IDs, 0 status/exit mismatches
11 have left (13.8% of everyone employed)
```

The data is consistent, so the analysis can proceed. `fillna(as_of)` gives people who are still here their tenure **so far**, up to the end of the data.

Who leaves, and when:

```python
by_level = employees.groupby("job_level").agg(staff=("employee_id", "size"), left=("left", "sum"))
by_level["rate"] = (by_level["left"] / by_level["staff"]).round(2)
print(by_level)

print("\nMedian years in the job:")
print(employees.groupby("left")["tenure_years"].median().round(1).rename({True: "leavers", False: "stayers"}))
```

```text
           staff  left  rate
job_level
Junior        31     7  0.23
Manager       10     0  0.00
Mid           24     4  0.17
Senior        15     0  0.00

Median years in the job:
left
stayers    4.2
leavers    1.5
Name: tenure_years, dtype: float64
```

Is it pay? Compare leavers with stayers **at the same level**:

```python
pay = employees[employees["job_level"].isin(["Junior", "Mid"])].pivot_table(
    index="job_level", columns="left", values="monthly_salary", aggfunc="median"
)
pay.columns = ["stayed", "left"]
pay
```

```text
             stayed      left
job_level
Junior     277500.0  275000.0
Mid        517500.0  582500.0
```

Leavers weren't paid less than people at their level who stayed; at Mid level they were paid slightly more. Pay doesn't explain it.

## Walkthrough

1. Run the Example's first cell and read the check line **before** the result line. If the checks had failed, you'd stop and fix the data first.
2. Run the level and tenure cell. Write down in plain words what each table says.
3. Run the pay comparison. Note how comparing within a level matters: overall, leavers earn less than stayers simply because juniors leave and juniors earn less. That comparison would wrongly "prove" it's about pay.
4. Departments: `employees.groupby("department")["left"].agg(["size", "sum", "mean"]).round(2)`. Customer Service and Operations account for 8 of the 11 leavers.
5. Look at the leavers themselves: `employees[employees["left"]].sort_values("exit_date")[["department", "job_level", "tenure_years", "exit_date"]]`. Three left in 2026 alone: worth flagging as a possible acceleration, though three is a small number.
6. Add a text cell headed **Findings** and write your summary (the task below).
7. Re-run the notebook from the top (**Runtime → Run all**) to prove it works start to finish. An analysis that only works when cells are run in a special order isn't finished.

## Practice

```answer
{
  "id": "pyan-11-p1",
  "prompt": "What is the resignation rate among **Junior** staff, as a percentage? One decimal place.",
  "answer": 22.6,
  "format": "percent",
  "dataset": "hr",
  "files": ["employees"],
  "verify": "SELECT ROUND(100.0 * SUM(status = 'Resigned') / COUNT(*), 1) FROM employees WHERE job_level = 'Junior'",
  "pyVerify": "round(employees.loc[employees['job_level'] == 'Junior', 'left'].mean() * 100, 1)",
  "required": true
}
```

```answer
{
  "id": "pyan-11-p2",
  "prompt": "How many of the 11 leavers left **within 18 months** of joining (tenure under 1.5 years)?",
  "answer": 6,
  "format": "number",
  "dataset": "hr",
  "files": ["employees"],
  "verify": "SELECT COUNT(*) FROM employees WHERE status = 'Resigned' AND (julianday(exit_date) - julianday(hire_date)) / 365.25 < 1.5",
  "pyVerify": "(employees['left'] & (employees['tenure_years'] < 1.5)).sum()",
  "required": true
}
```

```task
{
  "id": "pyan-11-t1",
  "prompt": "Write the **Findings** for the HR director: three short bullet points (start each line with `-`), then one line starting `Caveat:`. Use numbers from your analysis. Say what you found, what it means, and what you'd recommend.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "- ...\n- ...\n- ...\nCaveat: ...",
  "rules": [
    { "label": "Three bullet points, each starting with -", "pattern": "^\\s*-\\s+\\S", "min": 3 },
    { "label": "Uses numbers from the analysis", "pattern": "\\d", "min": 3 },
    { "label": "Mentions job level or how long people stay", "pattern": "junior|mid|level|tenure|month|year" },
    { "label": "Deals with pay (the obvious explanation)", "pattern": "pay|salar" },
    { "label": "Makes a recommendation", "pattern": "recommend|suggest|should|propose|next step|we could|consider" },
    { "label": "Includes an honest caveat line", "pattern": "^\\s*caveat:" },
    { "label": "Short enough for a busy director (40 to 160 words)", "minWords": 40, "maxWords": 160 }
  ],
  "sample": "- All 11 people who have left were Junior or Mid level; 23% of juniors who joined have left, against none of our 25 managers and seniors.\n- Leavers go early: a median of 1.5 years in the job, against 4.2 years for those who stay. Pay doesn't explain it: leavers earned about the same as colleagues at their level who stayed.\n- 8 of the 11 left from Customer Service and Operations. I recommend exit interviews and a 12-month check-in for new junior staff in those two teams first.\nCaveat: 11 leavers over seven years is a small number, so treat these as patterns to investigate, not proof.",
  "note": "Notice what the model answer does: every bullet has a number, the obvious explanation (pay) is tested and ruled out, the recommendation follows from the finding, and the caveat is honest without undermining the work.",
  "hint": "Use the three results you found: who leaves (level), when (tenure) and why not (pay). Then one recommendation, then the caveat.",
  "required": true
}
```

## Challenge

```answer
{
  "id": "pyan-11-c1",
  "prompt": "In the June 2026 `attendance.csv`, which **department** has the highest average number of **Late** records per employee? Merge attendance with employees to get each record's department.",
  "answer": "Operations",
  "format": "text",
  "dataset": "hr",
  "files": ["attendance", "employees"],
  "verify": "SELECT e.department FROM employees e JOIN attendance a ON a.employee_id = e.employee_id GROUP BY e.department ORDER BY 1.0 * SUM(a.status = 'Late') / COUNT(DISTINCT e.employee_id) DESC LIMIT 1",
  "pyVerify": "pd.read_csv(hr + 'attendance.csv').merge(employees, on='employee_id', validate='many_to_one').assign(late=lambda d: d['status_x'] == 'Late').groupby('department').apply(lambda g: g['late'].sum() / g['employee_id'].nunique(), include_groups=False).idxmax()",
  "explanation": "Operations, the department with the most leavers, also has the most lateness per person. That doesn't prove one causes the other, but it's a second reason to start with Operations.",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why check that every Resigned employee has an exit_date before analysing?",
    "options": ["pandas requires it", "If the data contradicts itself, every number built on it is suspect", "It makes the code faster", "To remove the leavers"],
    "answer": 1,
    "explanation": "Consistency checks come before analysis."
  },
  {
    "prompt": "Overall, leavers earn less than stayers. Why doesn't that show they left over pay?",
    "options": ["Salaries are private", "Juniors leave more and earn less: you have to compare within the same level", "Medians are unreliable", "It does show that"],
    "answer": 1,
    "explanation": "Comparing within a level removes the effect of level itself. Within levels, leavers weren't paid less."
  },
  {
    "prompt": "Which is the best-written finding?",
    "options": ["Attrition analysis complete, see tables", "Juniors leave", "All 11 leavers were Junior or Mid level, most within 18 months; we recommend a 12-month check-in for new juniors", "Seniors never leave Kolanut"],
    "answer": 2,
    "explanation": "What, with a number, and what to do about it. The last option over-claims from 11 people."
  },
  {
    "prompt": "Why run the whole notebook from the top before sharing it?",
    "options": ["To make the charts bigger", "To prove it works start to finish and doesn't depend on cells run in a special order", "Colab requires it", "To delete old variables"],
    "answer": 1,
    "explanation": "Reproducibility is the point of doing analysis in code."
  }
]
```
