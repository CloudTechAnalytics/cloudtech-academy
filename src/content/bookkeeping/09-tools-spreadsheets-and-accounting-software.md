---
title: "Tools: Spreadsheets and Accounting Software"
minutes: 25
summary: Set up books in a spreadsheet, understand accounting software, protect your data with backups and security and build good habits.
---

## Setting up books in a spreadsheet

A well-designed spreadsheet can run the books of a very small business, and teaches you how bookkeeping works. As the business grows, you may move to accounting software (next section), but the same principles apply.

**A simple structure (one workbook, several sheets):**

1. **Chart of accounts:** account code, name, type.
2. **Journal (or transactions):** one row per entry: date, reference, account debited, account credited, amount, narration.
3. **Cashbook:** date, details, receipts, payments, balance.
4. **Sales and purchases lists:** invoices, customers or suppliers, amounts, dates paid.
5. **Ledger summary or trial balance:** each account's total debits, credits and balance.
6. **Reports:** profit and loss, balance sheet.
7. **Settings:** the business name, the period, tax rates.

**Good spreadsheet practice:**

- **One row per transaction, one column per type of information,** with a header row. No blank rows or merged cells in data tables.
- **Consistent formats:** dates as dates, amounts as numbers.
- **Use drop-down lists** (data validation) for account names, to avoid spelling differences.
- **Keep inputs separate from calculations,** and use formulas rather than typing totals.
- **Colour and label** input cells, and protect formula cells.
- **Add checks** (for example, a cell that shows "OK" when debits equal credits).

**Useful formulas:**

- `=SUM(E2:E100)` adds a column.
- `=SUMIF(C:C,"Sales",E:E)` totals amounts where column C says "Sales."
- `=SUMIFS(E:E,C:C,"Sales",A:A,">="&DATE(2026,3,1),A:A,"<="&DATE(2026,3,31))` totals sales for March.
- `=B2-C2` gives a balance (receipts minus payments).
- `=IF(ROUND(SUM(D:D)-SUM(E:E),2)=0,"Balanced","Check")` tests a trial balance.
- `=XLOOKUP(A2,Accounts!A:A,Accounts!B:B)` looks up an account name from its code.
- **Pivot tables** summarise transactions by account and month.
- `=ROUND(x,2)` avoids rounding noise.

Example: if the journal lists **Dr Cash 500,000** and **Cr Capital 500,000** on row 2, the trial balance sheet can use `=SUMIF(DebitAccount,"Cash",Amount)-SUMIF(CreditAccount,"Cash",Amount)` to get the balance of Cash. For Kunle's March transactions this gives **₦410,000.**

**Limits of spreadsheets:** they depend on discipline; errors in formulas are easy to make and hard to spot; they are weak at **audit trails** (who changed what), multi-user work, automatic bank feeds, invoicing and VAT returns. When transactions grow beyond a few dozen a day, or several people need access, move to software.

## Accounting software overview

**Accounting software** (many cloud-based packages exist, with free or paid plans) automates much of bookkeeping. Typical features:

- **Chart of accounts and double-entry** handled for you: you enter an invoice or payment and the software posts the debits and credits.
- **Invoicing and quotes,** with your branding, tax, and online payment options.
- **Customer and supplier accounts,** statements and reminders.
- **Bank feeds or statement import,** with matching and **reconciliation** tools.
- **Expense capture** (photographing receipts).
- **Stock and inventory tracking** (in some packages).
- **Payroll** (in some packages, and often as add-ons).
- **VAT and tax reports.**
- **Financial statements and dashboards** at the click of a button.
- **Multi-user access** with roles and permissions.
- **An audit trail** of who did what and when.
- **Integration** with payment providers, online stores and other tools.

**Choosing:** consider your size and needs, **cost** (subscription, add-ons, per-user fees), **ease of use,** support and training, whether it **suits Nigerian requirements** (naira, VAT, local banks, payment methods), whether it works well on slow connections, data export and the reputation of the provider. Try a free trial with your real data.

**Moving from spreadsheets:** set up the chart of accounts, enter **opening balances** from your last trial balance, import or enter recent transactions, reconcile the bank, and run the old and new systems in parallel for a month if you can.

**Software does not replace understanding.** If you enter wrong data, you get wrong reports ("garbage in, garbage out"). You still need to know why a transaction is a debit or credit, check reconciliations and review the reports.

## Backups and security

Your books are valuable, sensitive records. Protect them.

**Backups:**

- **Back up regularly** (daily or weekly, depending on activity).
- Follow **3-2-1:** three copies, on two different types of storage, with one copy off-site or in the cloud.
- **Test restores:** a backup that cannot be restored is useless.
- **Save before and after** big changes, and keep monthly closing copies.
- For cloud software, check how the provider backs up and how you can export your data.

**Security:**

- **Strong, unique passwords** and a password manager; **two-step verification.**
- **Limit access:** only people who need it, with the right permission level. Separate duties: the person who records payments should not be the only one who approves and reconciles them.
- **Log out and lock screens.**
- **Keep devices updated** and protected with security software.
- **Beware of phishing:** fake emails or messages asking for logins or payments. Verify before you click or pay.
- **Protect bank details** and online banking tokens.
- **Encrypt or password-protect** sensitive files you email.
- **Control paper records** (locked cabinet, shredding).
- **Follow data protection law:** customer and employee records are personal data.
- **Have a plan** for lost devices, staff leaving (remove access promptly) and suspected fraud.

## Good habits

Good tools matter less than good habits.

- **Record daily** or at least weekly, never leave it all to the month-end.
- **Keep every document,** and file it where you can find it.
- **Reconcile the bank every month** (and check the cash).
- **Separate business and personal money** completely.
- **Review reports monthly** and ask "why?" about big changes.
- **Follow the month-end routine** and close the month.
- **Be consistent** in how you treat items and name accounts.
- **Pay yourself a set amount** (drawings) and record it.
- **Keep learning:** read your statements, ask your accountant questions, and update your skills as rules and software change.
- **Be honest and accurate:** books are only useful if they are true.

## Try it

```task
{
  "id": "bkp-m09-t1",
  "prompt": "Write the **spreadsheet formulas** for each need, one per line with a short note: (a) total of amounts in E2 to E100; (b) total of amounts in column E where column C says \"Sales\"; (c) receipts in B2 minus payments in C2; (d) show \"Balanced\" if total debits in D equal total credits in E, otherwise \"Check\"; (e) look up an account name in the Accounts sheet from the code in A2.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "(a) =SUM(E2:E100)",
  "rules": [
    { "label": "Five lines", "minLines": 5 },
    { "label": "SUM", "pattern": "=\\s?sum\\(\\s?e2:e100\\s?\\)" },
    { "label": "SUMIF with Sales", "pattern": "=\\s?sumif\\(\\s?c:c\\s?,\\s?\"sales\"\\s?,\\s?e:e\\s?\\)" },
    { "label": "Receipts minus payments", "pattern": "=\\s?b2\\s?-\\s?c2" },
    { "label": "IF with Balanced and Check", "pattern": "=\\s?if\\([^\\n]*\"balanced\"[^\\n]*\"check\"" },
    { "label": "XLOOKUP or VLOOKUP", "pattern": "xlookup|vlookup" }
  ],
  "sample": "(a) =SUM(E2:E100) adds the amounts\n(b) =SUMIF(C:C,\"Sales\",E:E) totals the sales\n(c) =B2-C2 gives receipts minus payments\n(d) =IF(SUM(D:D)=SUM(E:E),\"Balanced\",\"Check\") tests the trial balance\n(e) =XLOOKUP(A2,Accounts!A:A,Accounts!B:B) finds the account name",
  "required": true
}
```

```task
{
  "id": "bkp-m09-t2",
  "prompt": "Design a **workbook layout** for a small shop's books: list at least **six sheets**, one per line, with the main **columns** on each. Include a chart of accounts, journal, cashbook and trial balance.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "Sheet 1: Chart of accounts - code, name, type",
  "rules": [
    { "label": "At least six lines", "minLines": 6 },
    { "label": "Chart of accounts", "pattern": "chart of accounts" },
    { "label": "Journal with debit and credit", "pattern": "journal[^\\n]*(debit|dr)[^\\n]*(credit|cr)" },
    { "label": "Cashbook with receipts and payments", "pattern": "cashbook[^\\n]*receipts[^\\n]*payments" },
    { "label": "Trial balance", "pattern": "trial balance" },
    { "label": "Reports (profit and loss, balance sheet)", "pattern": "profit and loss|balance sheet|reports" }
  ],
  "sample": "Sheet 1: Chart of accounts - code, name, type\nSheet 2: Journal - date, reference, debit account, credit account, amount, narration\nSheet 3: Cashbook - date, details, receipts, payments, balance\nSheet 4: Sales and customers - invoice number, customer, amount, date paid\nSheet 5: Trial balance - account, total debits, total credits, balance, check\nSheet 6: Reports - profit and loss and balance sheet\nSheet 7: Settings - business name, period and tax rate",
  "required": true
}
```

```task
{
  "id": "bkp-m09-t3",
  "prompt": "Write a **data protection plan** for your books with at least eight rules, one per line, covering backups (3-2-1), passwords, access, separation of duties, phishing, paper records, staff leaving and testing a restore.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "Back up daily using 3-2-1",
  "rules": [
    { "label": "At least eight lines", "minLines": 8 },
    { "label": "Backups with 3-2-1", "pattern": "back ?up|3-2-1" },
    { "label": "Passwords and two-step verification", "pattern": "password|two-step|2fa|authenticat" },
    { "label": "Limit access or roles", "pattern": "access|permission|role|limit" },
    { "label": "Separation of duties", "pattern": "separat|different people|approve|reconcile" },
    { "label": "Phishing", "pattern": "phishing|fake email|suspicious" },
    { "label": "Paper records", "pattern": "paper|locked|shred" },
    { "label": "Staff leaving or lost device", "pattern": "leav|lost|remove access" },
    { "label": "Test the restore", "pattern": "restore|test" }
  ],
  "sample": "Back up the books daily using 3-2-1: three copies, two types of storage and one off-site or cloud copy.\nTest a restore every quarter to make sure the backup works.\nUse strong, unique passwords and two-step verification on accounting and bank logins.\nLimit access so that people only see what their job needs.\nSeparate duties: the person who records payments is not the one who approves and reconciles them.\nWatch for phishing emails and verify any payment request by phone before acting.\nKeep paper records in a locked cabinet and shred what is no longer needed.\nRemove access immediately when a staff member leaves or a device is lost.",
  "required": false
}
```

Next lesson: your set of books.
