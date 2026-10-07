---
title: Bank and Account Reconciliation
minutes: 30
summary: Reconcile the bank statement to the cashbook, manage customer and supplier accounts, find and fix errors and follow a month-end routine.
---

## Bank reconciliation

A **bank reconciliation** compares the **cashbook** (your record) with the **bank statement** (the bank's record) and explains any differences. They should agree after allowing for timing differences and items you have not yet recorded. It is one of the most useful controls, because it catches errors, missed charges and fraud.

Why they differ:

- **Unpresented (outstanding) cheques:** you recorded a cheque as paid, but it has not yet cleared the bank.
- **Deposits in transit (uncredited lodgements):** you recorded a deposit, but the bank has not yet credited it.
- **Bank charges, interest and direct debits** that the bank recorded and you have not.
- **Direct transfers in** (customers paying by transfer) that you have not yet recorded.
- **Dishonoured (bounced) cheques.**
- **Errors,** by you or the bank.

**Steps:**

1. **Tick off** each item in the cashbook against the bank statement.
2. **List the unticked items** on each side.
3. **Update the cashbook** for items on the statement that are not in it (bank charges, interest, direct payments), to get the **adjusted cashbook balance.**
4. **Reconcile the statement:** *Statement balance + deposits in transit − unpresented cheques = adjusted bank balance.*
5. **The two adjusted balances must agree.** If not, look for errors.

**Example for Kunle at 31 March.** The cashbook shows **₦410,000.** The bank statement shows **₦421,500.** Differences:

- A **deposit in transit** of **₦12,000** (recorded in the cashbook, not yet credited by the bank).
- An **unpresented cheque** of **₦25,000** (recorded, not yet cleared).
- **Bank charges** of **₦1,500** on the statement, not yet in the cashbook.

*Adjust the cashbook:* 410,000 − 1,500 = **₦408,500.** The journal entry: **Dr Bank charges 1,500, Cr Cash/Bank 1,500.**

*Reconcile the statement:* 421,500 + 12,000 − 25,000 = **₦408,500.** Both agree at **₦408,500,** so the reconciliation is complete, and the true bank balance is ₦408,500.

Do this **at least monthly,** and weekly if there are many transactions. Keep a signed copy, and investigate old unpresented cheques.

## Customer and supplier accounts

**Receivables (customers):** each credit customer has an account showing invoices raised and payments received, so you know who owes what. The total of all customer accounts should equal the **receivables control account** in the ledger.

- **Send statements** regularly.
- **Prepare an ageing list:** group outstanding invoices by how long overdue.

| Customer | Current | 1 to 30 days | 31 to 60 days | Over 60 days | Total |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Ngozi Eze | 0 | 30,000 | 0 | 0 | 30,000 |

- **Chase overdue accounts** politely and firmly; stop credit to persistent late payers.
- **Record bad debts** (module 5) when you decide you will not be paid.

**Payables (suppliers):** each supplier has an account showing invoices received and payments made. **Check supplier statements** against your records at least monthly, to make sure they agree: query missing invoices, duplicates or unrecorded payments. Pay according to terms, and take any early-payment discount if worthwhile. Alpha Traders: invoices ₦200,000, payments ₦100,000, balance ₦100,000.

The **sum of customer balances** and the **sum of supplier balances** should agree to the totals in the ledger. If not, find the difference.

## Finding and fixing errors

Errors happen. The goal is to find them early and correct them properly.

**Common types:**
| Error | Example |
| :-- | :-- |
| **Omission** | A transaction not recorded at all |
| **Transposition** | ₦4,560 recorded as ₦4,650 (digits swapped) |
| **Wrong account** | Rent posted to the wages account |
| **Wrong amount** | ₦5,000 recorded as ₦500 |
| **Reversal** | Debit and credit swapped |
| **Duplicate** | The same invoice entered twice |
| **Compensating** | Two errors that cancel each other |
| **Principle** | Equipment cost treated as an expense |

**Tips for finding a trial balance difference:**

1. **Check the arithmetic** of the totals.
2. **Find the difference:** if it is exactly divisible by **9,** a transposition is likely. Example: 4,650 − 4,560 = **90,** and 90 ÷ 9 = 10, which points to swapped digits.
3. **If the difference is double a figure,** look for an entry posted on the wrong side (a reversal): half the difference is the amount.
4. **If it equals a single figure,** look for a missing entry on one side.
5. **Re-check balances** carried forward and the ledger postings from the journal.
6. **Check against documents** and the bank reconciliation.

**Correcting errors:** never use correction fluid or delete a posted entry. Make a **correcting journal entry** with a clear narration, so the audit trail stays visible. Example: rent of ₦30,000 was wrongly debited to Wages. Correct with **Dr Rent 30,000, Cr Wages 30,000.**

## Month-end routine

A regular month-end routine keeps books accurate and ready for reports:

1. **Record all transactions** for the month (sales, purchases, receipts, payments, petty cash).
2. **Post to the ledger** and check the cashbook totals.
3. **Reconcile the bank statement** to the cashbook.
4. **Count the cash** and petty cash and agree them with the books.
5. **Review receivables:** update the ageing list, chase overdue amounts.
6. **Reconcile supplier statements** and review payables due.
7. **Count the stock** (or reconcile the stock records) and agree to the inventory account.
8. **Record adjustments** (depreciation, accruals, prepayments, bad debts; module 5).
9. **Prepare the trial balance** and investigate any difference.
10. **Prepare the financial statements** (module 6) and review them for sense.
11. **File documents** and back up the records.
12. **Report** to the owner and agree actions.
13. **Close the month:** do not change closed months without a recorded reason.

Set a **timetable** (for example complete by the 5th working day of the next month) and stick to it.

## Try it

```task
{
  "id": "bkp-m04-t1",
  "prompt": "Reconcile the bank for Kunle: cashbook **₦410,000**; bank statement **₦421,500**; **deposit in transit ₦12,000**; **unpresented cheque ₦25,000**; **bank charges ₦1,500** not yet in the cashbook. Work out the **adjusted cashbook balance** and the **adjusted bank balance**, check that they agree and write the **journal entry** for the bank charges.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "Adjusted cashbook = ...",
  "rules": [
    { "label": "Adjusted cashbook ₦408,500", "pattern": "408,?500" },
    { "label": "Adjusted bank balance calculation 421,500 + 12,000 - 25,000", "pattern": "421,?500\\s?\\+\\s?12,?000\\s?[-−]\\s?25,?000" },
    { "label": "Says they agree", "pattern": "agree|match|equal|reconcile" },
    { "label": "Journal: Dr Bank charges 1,500", "pattern": "dr bank charges 1,?500" },
    { "label": "Journal: Cr Cash or Bank 1,500", "pattern": "cr (cash|bank)( at bank)? 1,?500" }
  ],
  "sample": "Adjusted cashbook = 410,000 - 1,500 = ₦408,500.\nAdjusted bank balance = 421,500 + 12,000 - 25,000 = ₦408,500.\nThe two balances agree at ₦408,500, so the bank reconciliation is complete.\nJournal: Dr Bank charges 1,500 / Cr Bank 1,500.",
  "required": true
}
```

```task
{
  "id": "bkp-m04-t2",
  "prompt": "The trial balance does not balance. (a) A transposition: **₦4,650** was recorded as **₦4,560**; (b) rent of **₦30,000** was debited to **Wages**. For (a), work out the difference and why divisibility by 9 helps. For (b), write the **correcting journal entry**. Then name **two other** types of error a trial balance would **not** reveal.",
  "minutes": 12,
  "rows": 9,
  "placeholder": "(a) Difference = ...",
  "rules": [
    { "label": "Difference of 90", "pattern": "\\b90\\b" },
    { "label": "Divisible by 9", "pattern": "9[^\\n]*(divis|transpos|digits)|divis[^\\n]*9" },
    { "label": "Correcting entry Dr Rent 30,000 / Cr Wages 30,000", "pattern": "dr rent 30,?000[\\s\\S]*cr wages 30,?000" },
    { "label": "Names errors not revealed (omission, compensating, wrong account, principle)", "pattern": "omission|omitted|compensat|wrong account|principle|reversal" }
  ],
  "sample": "(a) Difference = 4,650 - 4,560 = 90. A difference divisible by 9 (90 / 9 = 10) suggests two digits were swapped.\n(b) Correcting entry: Dr Rent 30,000 / Cr Wages 30,000 with the narration \"correct rent wrongly posted to wages\".\nA trial balance would not reveal an omission of a whole transaction, or compensating errors that cancel each other.",
  "required": true
}
```

```task
{
  "id": "bkp-m04-t3",
  "prompt": "Write your **month-end checklist** for a small business with at least ten steps, one per line, covering recording, posting, bank reconciliation, cash count, receivables, payables, stock, adjustments, trial balance, statements, backup and closing.",
  "minutes": 10,
  "rows": 12,
  "placeholder": "1. Record all transactions ...",
  "rules": [
    { "label": "At least ten lines", "minLines": 10 },
    { "label": "Bank reconciliation", "pattern": "bank reconcil|reconcile the bank" },
    { "label": "Cash count", "pattern": "count the cash|cash count|petty cash" },
    { "label": "Receivables and payables", "pattern": "receivable|customers?[\\s\\S]*(payable|supplier)|(payable|supplier)[\\s\\S]*(receivable|customer)" },
    { "label": "Stock", "pattern": "stock|inventory" },
    { "label": "Adjustments", "pattern": "adjustment|depreciation|accrual" },
    { "label": "Trial balance and statements", "pattern": "trial balance[\\s\\S]*statements?|statements?[\\s\\S]*trial balance" },
    { "label": "Backup or filing", "pattern": "back ?up|file|archive" }
  ],
  "sample": "1. Record all sales, purchases, receipts and payments for the month.\n2. Post the entries to the ledger and check the cashbook totals.\n3. Reconcile the bank statement to the cashbook.\n4. Count the cash and petty cash and agree them to the books.\n5. Update the customers' ageing list and chase overdue amounts.\n6. Reconcile supplier statements and list payables due.\n7. Count the stock and agree it to the inventory account.\n8. Record adjustments: depreciation, accruals, prepayments and bad debts.\n9. Prepare the trial balance and investigate any difference.\n10. Prepare the financial statements and review them for sense.\n11. File the documents and back up the records.\n12. Report to the owner and close the month.",
  "required": false
}
```

Next lesson: inventory, assets and adjustments.
