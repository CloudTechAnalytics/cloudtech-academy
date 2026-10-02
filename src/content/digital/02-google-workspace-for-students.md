---
title: Google Workspace for Students
minutes: 25
summary: Use Google Docs, Sheets, Forms and Calendar to write, collaborate on group work, collect responses and plan your semester.
---

## One account, many tools

A free Google account gives you **Docs** (writing), **Sheets** (spreadsheets), **Slides** (presentations), **Forms** (surveys), **Calendar** and **Drive**. They work in any browser, save automatically and are built for working together.

## Google Docs: write together

- **Share** (top right) → add your group members as **Editors**.
- Use **Suggesting** mode (the pencil icon at top right) so changes show as suggestions the owner can accept or reject.
- Add **comments** with Ctrl + Alt + M. Type `@name` in a comment to assign a task to someone.
- **Version history** (File → Version history) shows who wrote what and lets you restore earlier versions.
- Use **Heading 1** and **Heading 2** styles, then **Insert → Table of contents** for long reports.

> [!TIP]
> Version history is also proof of who did the work in a group project.

## Google Sheets: track anything

Sheets works much like Excel. Useful student uses:

- A **course tracker** with each course, lecturer, test dates and scores.
- A **budget**: `=SUM(B2:B10)` adds up a column.
- A **group task list** with columns for task, owner, due date and status.

Use **Data → Data validation** to add a dropdown (for example To do, Doing, Done) to a status column.

## Google Forms: collect responses

Great for class surveys, event registration and research questionnaires:

1. Go to **forms.google.com** → **Blank form**.
2. Add questions: multiple choice, short answer, linear scale and more.
3. Click **Send** to get a link.
4. Open **Responses → Link to Sheets** to see every answer in a spreadsheet.

## Google Calendar: plan your semester

- Add your **timetable** as recurring events (set **Repeat weekly**).
- Add **tests and deadlines** with reminders a few days before.
- Use different **colours** for lectures, study time and personal activities.

## Try it

```task
{
  "id": "digi-m02-t1",
  "prompt": "Build a **group task list** in Google Sheets with columns Task, Owner, Due date and Status (a dropdown: To do, Doing, Done), with tasks in rows 2 to 20. Write the formula that **counts how many tasks are Done**, if Status is column D.",
  "minutes": 8,
  "rows": 2,
  "placeholder": "=...",
  "rules": [
    { "label": "Starts with =", "pattern": "^\\s*=" },
    { "label": "Uses COUNTIF", "pattern": "countif\\(" },
    { "label": "Looks in column D, rows 2 to 20", "pattern": "d2\\s*:\\s*d20" },
    { "label": "Counts \"Done\"", "pattern": "[\"“]done[\"”]" }
  ],
  "sample": "=COUNTIF(D2:D20, \"Done\")",
  "note": "Put it under the table with a label like \"Tasks done:\". It updates every time someone changes a status.",
  "required": true
}
```

```task
{
  "id": "digi-m02-t2",
  "prompt": "Make a **three-question Google Form** for something real (a class survey, an event sign-up, a study group poll) and link it to a Sheet. Paste the form's **send link** on the first line, then your three questions, one per line.",
  "minutes": 10,
  "rows": 5,
  "placeholder": "https://forms.gle/...\n1. ...\n2. ...\n3. ...",
  "rules": [
    { "label": "A Google Form link", "pattern": "https?://(forms\\.gle/\\S+|docs\\.google\\.com/forms/\\S+)" },
    { "label": "Not the editing link (it should end in viewform, or be a forms.gle link)", "pattern": "docs\\.google\\.com/forms/[^\\s]*/edit", "absent": true },
    { "label": "Three questions listed", "pattern": "\\?", "min": 3 }
  ],
  "sample": "https://forms.gle/AbCdEfGh1234\n1. Which day suits you for the ECO 201 study group?\n2. How many hours a week can you commit?\n3. Which topic do you most want to revise first?",
  "required": true
}
```

Then put this week's lectures in Google Calendar as weekly events, and add your next test with a reminder three days before.
