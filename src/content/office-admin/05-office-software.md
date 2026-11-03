---
title: Office Software
minutes: 25
summary: Use word processing, spreadsheets, presentations, email, calendars and cloud storage to produce professional work quickly.
---

## Word processing for professional documents

Word processors (Microsoft Word, Google Docs and others) create letters, reports, memos, minutes, forms and policies. Most people use only a fraction of their features, and so spend too long on formatting. A few skills make documents look professional and save time.

**Core skills:**

- **Use styles** (Heading 1, Heading 2, Normal) instead of formatting each line by hand. Styles make documents consistent and let you generate a **table of contents** automatically.
- **Set the page:** margins, orientation, paper size (A4), line spacing.
- **Use a consistent font** (one or two fonts, readable size such as 11 or 12 points) and spacing.
- **Lists and tables:** bullets and numbering for lists; tables for data and layouts. Do not use the space bar for alignment: use tabs, tables or indents.
- **Headers, footers and page numbers** for longer documents (title, date, "Page X of Y").
- **Templates:** save your letterhead, memo and minutes layouts as templates, so everyone starts from the same professional layout.
- **Track changes and comments** for review: others can suggest edits that you accept or reject.
- **Mail merge:** produce many personalised letters or labels from a list (names and addresses in a spreadsheet). It saves hours when sending invitations, notices or reminders.
- **Spell check and proofreading:** use the tool, then read the document yourself, especially names, numbers and dates.
- **Save and export:** use clear file names; **save as PDF** for documents you send out and do not want edited.

Good document habits: put the main point first, use headings and short paragraphs, keep formatting simple and check the final result in print preview.

## Spreadsheets for lists and simple budgets

Spreadsheets (Microsoft Excel, Google Sheets) organise data in rows and columns and **calculate automatically.** Administrators use them for lists (contacts, stock, attendance), schedules, budgets, expense tracking and simple reports.

**Basics:**

- **Cells, rows, columns,** and cell references such as B2.
- **Enter data in a clean table:** one row per item, one column per type of information, a header row, no blank rows or merged cells inside the data.
- **Formulas start with =.** Examples:
  - `=SUM(B2:B10)` adds a range.
  - `=AVERAGE(B2:B10)` finds the average.
  - `=B2*C2` multiplies (for example quantity times price).
  - `=B2-C2` subtracts (for example budget minus spent).
  - `=B2/C2` divides.
  - `=MAX(B2:B10)` and `=MIN(B2:B10)` find the largest and smallest values.
  - `=IF(D2>0,"Over","OK")` makes a decision.
  - `=COUNTIF(A2:A50,"Paid")` counts matching items.
- **Absolute references** (`$B$2`) keep a cell fixed when you copy a formula.
- **Format:** number formats (currency, percentages, dates), column widths, borders and alignment.
- **Sort and filter** to find and arrange data.
- **Charts** to show data visually.
- **Freeze the header row,** and protect cells that should not be changed.

**Simple budget example.** Items: Chairs (quantity 6, unit price ₦25,000), Desks (quantity 3, unit price ₦40,000), Printer paper (quantity 20 reams, unit price ₦4,800).

- Line totals: `=B2*C2` gives ₦150,000, ₦120,000 and ₦96,000.
- Grand total: `=SUM(D2:D4)` gives **₦366,000.**
- Add VAT at 7.5%: `=D5*0.075` gives **₦27,450;** total with VAT = ₦393,450.

Always **check your formulas** by testing with simple numbers, and keep inputs (prices, rates) in clearly labelled cells so they can be changed.

## Presentations

Presentation software (PowerPoint, Google Slides) helps you communicate ideas to a group. As an administrator you may prepare slides for managers, meetings and training.

Design rules:

- **One message per slide,** with a clear title that states the point.
- **Less text:** a few short bullets (about six words each), not paragraphs. The slide supports the speaker; it is not the speech.
- **Readable:** large fonts (at least 24 points for body), strong contrast between text and background.
- **Consistent design:** use the company template, colours and logo; avoid clutter and too many effects.
- **Use visuals:** charts, photos, diagrams and icons instead of long text. Label charts clearly.
- **Order logically:** title, purpose or agenda, main points, summary or recommendation, next steps.
- **Keep it short:** about one slide per minute of talking.
- **Check spelling, numbers and links.** Test on the projector or screen you will use.
- **Notes and handouts:** add speaker notes, and save as PDF to share.

Rehearse, and always have a backup copy (USB, email or cloud) in case of technical problems.

## Email, calendars and cloud storage

**Email tools** (Outlook, Gmail) have features that save time:

- **Folders and labels** to organise messages.
- **Rules and filters** to sort incoming mail automatically.
- **Signatures** with your name, role and contact details.
- **Templates and quick replies** for common messages.
- **Out-of-office** messages with dates and who to contact.
- **Scheduling** emails to send later.
- **Search** to find messages quickly.
- **Cc/Bcc** used correctly, and attachments within sensible size limits (share large files by link).

**Calendars:**

- **Create meetings with invitations,** so attendees can accept or decline and the room is booked.
- **Share calendars** with permissions (see only free/busy, or full details).
- **Set reminders and recurring events.**
- **Use colours or categories** (meetings, deadlines, travel, personal).
- **Add time zones** for international calls.

**Cloud storage** (OneDrive, Google Drive, Dropbox and similar):

- **Store files online** and access them from any device.
- **Share by link or invitation,** with the right permission: view, comment or edit.
- **Collaborate in real time** on the same document.
- **Version history** lets you restore earlier versions.
- **Back up** important files automatically.
- **Security:** use strong passwords and two-step verification, share only with those who need access, and review who has access regularly. Never put confidential files in publicly accessible links.

Keep skills current: software changes often. Spend a little time each week learning one new feature, using the built-in help, short tutorials or colleagues.

## Try it

```task
{
  "id": "poa-m05-t1",
  "prompt": "A budget sheet has: **Chairs** 6 × ₦25,000, **Desks** 3 × ₦40,000, **Printer paper** 20 × ₦4,800. Write the **formula** for a line total (assuming quantity in B and price in C), the **line totals**, the **grand total**, **7.5% VAT** and the **total with VAT**.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Line total formula: =B2*C2",
  "rules": [
    { "label": "Line total formula =B2*C2", "pattern": "=\\s?b2\\s?\\*\\s?c2" },
    { "label": "Line totals ₦150,000, ₦120,000 and ₦96,000", "pattern": "150,?000[\\s\\S]*120,?000[\\s\\S]*96,?000" },
    { "label": "Grand total ₦366,000 with SUM", "pattern": "366,?000" },
    { "label": "VAT of ₦27,450", "pattern": "27,?450" },
    { "label": "Total with VAT ₦393,450", "pattern": "393,?450" }
  ],
  "sample": "Line total formula: =B2*C2\nChairs = 6 x 25,000 = ₦150,000; Desks = 3 x 40,000 = ₦120,000; Printer paper = 20 x 4,800 = ₦96,000\nGrand total: =SUM(D2:D4) = ₦366,000\nVAT at 7.5%: =D5*0.075 = ₦27,450\nTotal with VAT = 366,000 + 27,450 = ₦393,450",
  "required": true
}
```

```task
{
  "id": "poa-m05-t2",
  "prompt": "Write the **spreadsheet formula** for each need, one per line with a short note: (a) total of cells B2 to B20; (b) average of B2 to B20; (c) quantity in B2 times price in C2; (d) show \"Low\" if stock in D2 is below 10, otherwise \"OK\"; (e) count how many cells in A2 to A50 say \"Paid\".",
  "minutes": 10,
  "rows": 8,
  "placeholder": "(a) =SUM(B2:B20)",
  "rules": [
    { "label": "Five lines", "minLines": 5 },
    { "label": "SUM", "pattern": "=\\s?sum\\(\\s?b2:b20\\s?\\)" },
    { "label": "AVERAGE", "pattern": "=\\s?average\\(\\s?b2:b20\\s?\\)" },
    { "label": "Multiplication", "pattern": "=\\s?b2\\s?\\*\\s?c2" },
    { "label": "IF with Low and OK", "pattern": "=\\s?if\\(\\s?d2\\s?<\\s?10\\s?,\\s?\"low\"\\s?,\\s?\"ok\"\\s?\\)" },
    { "label": "COUNTIF with Paid", "pattern": "=\\s?countif\\(\\s?a2:a50\\s?,\\s?\"paid\"\\s?\\)" }
  ],
  "sample": "(a) =SUM(B2:B20) adds the range\n(b) =AVERAGE(B2:B20) gives the average\n(c) =B2*C2 multiplies quantity by price\n(d) =IF(D2<10,\"Low\",\"OK\") flags low stock\n(e) =COUNTIF(A2:A50,\"Paid\") counts paid items",
  "required": true
}
```

```task
{
  "id": "poa-m05-t3",
  "prompt": "Write a **slide plan** for a 5-minute presentation to management proposing new office chairs: at least six slides, one per line, each with a title that states the point and one or two short bullets.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "Slide 1: Title - ...",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Slide labels", "pattern": "slide\\s?\\d", "min": 6 },
    { "label": "Includes problem and recommendation", "pattern": "problem[\\s\\S]*recommend|recommend[\\s\\S]*problem" },
    { "label": "Includes cost", "pattern": "cost|₦\\s?\\d|budget" },
    { "label": "Includes next steps", "pattern": "next steps?|decision|approval" }
  ],
  "sample": "Slide 1: Our chairs are failing - four of six are broken\nSlide 2: The problem - back pain complaints and lost work time\nSlide 3: Options - repair, buy basic, buy ergonomic\nSlide 4: Cost comparison - ₦150,000 for basic against ₦240,000 for ergonomic with a 5-year warranty\nSlide 5: Recommendation - buy six ergonomic chairs for ₦240,000\nSlide 6: Next steps - approval by Thursday and delivery in two weeks",
  "required": false
}
```

Next lesson: meetings, events and travel.
