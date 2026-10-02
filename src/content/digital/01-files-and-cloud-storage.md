---
title: Files and Cloud Storage
minutes: 20
summary: Organise your files so you can always find them, back them up to the cloud, and share them safely.
---

## Why it matters

Losing an assignment the night before it's due, or searching for "that PDF" for twenty minutes, costs you time and marks. A simple system fixes both.

## A folder structure that works

Make one main folder for school, then one folder per session and course:

```text
School/
  2025-2026/
    ECO 201 - Microeconomics/
      Lecture notes/
      Assignments/
      Past questions/
    STA 211 - Statistics/
  Personal/
    CV and applications/
    Certificates/
```

Keep it shallow: three or four levels is enough.

## Name files well

A good file name tells you what it is without opening it:

| Weak | Strong |
| :-- | :-- |
| `Document1.docx` | `ECO201-assignment-2-demand-curves.docx` |
| `final final.pdf` | `CV-Amaka-Obi-2026-03.pdf` |
| `IMG_2045.jpg` | `STA211-lecture-5-board.jpg` |

Tips: put the course code first so files sort together, use dates as `YYYY-MM-DD` so they sort in order, and avoid spaces and symbols in files you'll upload.

## Back up to the cloud

If your laptop is stolen or your phone falls in water, anything that's only on the device is gone. Cloud storage keeps a copy online:

| Service | Free storage | Good for |
| :-- | :-- | :-- |
| **Google Drive** | 15 GB (shared with Gmail and Photos) | Google Docs, Sheets and Slides, sharing |
| **OneDrive** | 5 GB (more with a school Microsoft account) | Word, Excel and PowerPoint |
| **Dropbox** | 2 GB | Simple syncing |

Install the desktop app (**Google Drive for desktop** or **OneDrive**) and keep your `School` folder inside it. It then backs up automatically.

> [!TIP]
> Many universities give students a Microsoft 365 or Google Workspace account with much more storage. Check with your ICT unit.

## Share safely

- Share with **specific people** when you can, rather than "anyone with the link".
- Give **Viewer** access unless someone needs to edit.
- To send a big file, share a link instead of attaching it.
- Remove access when a group project is finished.

## Try it

```task
{
  "id": "digi-m01-t1",
  "prompt": "Rename these five files using the rules in this lesson (course code first, hyphens instead of spaces, dates as YYYY-MM-DD, says what it is). One per line, in the same order, keeping each file's extension.\n\n1. `Document1.docx`: your ECO 201 Assignment 3 on price elasticity\n2. `scan 0003.pdf`: STA 211 past questions from 2024\n3. `IMG_2045.jpg`: a photo of the board in CSC 201, lecture 7\n4. `final final CV.pdf`: your CV, updated in March 2026\n5. `New Microsoft Excel Worksheet.xlsx`: your semester budget",
  "minutes": 6,
  "rows": 6,
  "placeholder": "ECO201-assignment-3-...docx\n...",
  "rules": [
    { "label": "Five file names, one per line", "minLines": 5 },
    { "label": "No spaces in any file name", "pattern": "^\\s*(\\d+[.)]\\s*)?\\S+\\s*$", "perLine": true },
    { "label": "Every name keeps its extension (.docx, .pdf, .jpg, .xlsx)", "pattern": "\\.(docx|pdf|jpg|xlsx)\\s*$", "min": 5 },
    { "label": "Course codes first for the course files (ECO201, STA211, CSC201)", "pattern": "^\\s*(\\d+[.)]\\s*)?(eco|sta|csc)[ -_]?\\d{3}", "min": 3 },
    { "label": "The CV's date written as 2026-03", "pattern": "2026-03" },
    { "label": "No \"final\", \"document\", \"scan\" or \"new\" left in the names", "pattern": "final|document1|scan|new-?microsoft|img_", "absent": true }
  ],
  "sample": "ECO201-assignment-3-price-elasticity.docx\nSTA211-past-questions-2024.pdf\nCSC201-lecture-7-board.jpg\nCV-Amaka-Obi-2026-03.pdf\nbudget-semester-1-2025-2026.xlsx",
  "required": true
}
```

```task
{
  "id": "digi-m01-t2",
  "prompt": "Create your `School` folder structure for **this** session's courses, inside Google Drive or OneDrive so it backs up. Type the structure here, one folder per line, indenting sub-folders with spaces.",
  "minutes": 8,
  "rows": 10,
  "placeholder": "School/\n  2025-2026/\n    ECO 201 - Microeconomics/\n      ...",
  "rules": [
    { "label": "A top-level School folder", "pattern": "^\\s*school/?\\s*$" },
    { "label": "A session folder (e.g. 2025-2026)", "pattern": "20\\d\\d[-/]20\\d\\d" },
    { "label": "At least two course folders with course codes", "pattern": "[a-z]{3}\\s?\\d{3}", "min": 2 },
    { "label": "Sub-folders are indented", "pattern": "^[ \\t]{2,}\\S", "min": 3 },
    { "label": "At least six folders", "minLines": 6 }
  ],
  "sample": "School/\n  2025-2026/\n    ECO 201 - Microeconomics/\n      Lecture notes/\n      Assignments/\n      Past questions/\n    STA 211 - Statistics/\n      Lecture notes/\n      Assignments/",
  "required": true
}
```

Then share one file with a friend as **Viewer** and ask them what they can see.
