---
title: Double-Entry Bookkeeping
minutes: 25
summary: Understand debits and credits, the chart of accounts, journals and ledgers and the trial balance, using Kunle's first month.
---

## Debits and credits

**Double-entry bookkeeping** records **every transaction twice:** once as a **debit** in one account and once as a **credit** in another, for the same amount. This keeps the accounting equation in balance and makes errors easier to find.

Debit and credit are only labels: **debit (Dr) is the left side** of an account and **credit (Cr) is the right side.** They do not mean "good" or "bad." What matters is which accounts they increase:

| Account type | Increases with | Decreases with |
| :-- | :-- | :-- |
| **Assets** | Debit | Credit |
| **Expenses** | Debit | Credit |
| **Liabilities** | Credit | Debit |
| **Equity** | Credit | Debit |
| **Income** | Credit | Debit |

A memory aid: **assets and expenses are on the debit side** of the equation; **liabilities, equity and income are on the credit side.**

For every transaction, ask two questions:

1. **Which two (or more) accounts are affected?**
2. **Does each go up or down, and so is it a debit or a credit?**

Example: Kunle invests ₦500,000 cash. **Cash** (asset) goes up: **Dr Cash 500,000.** **Capital** (equity) goes up: **Cr Capital 500,000.** Total debits equal total credits.

## The chart of accounts

A **chart of accounts** is the list of all accounts the business uses, each with a name and a code. A simple chart for Kunle:

| Code | Account | Type |
| :-- | :-- | :-- |
| 1000 | Cash | Asset |
| 1100 | Receivables (customers) | Asset |
| 1200 | Inventory | Asset |
| 1500 | Equipment | Asset |
| 2000 | Payables (suppliers) | Liability |
| 3000 | Owner's capital | Equity |
| 4000 | Sales | Income |
| 5000 | Cost of goods sold | Expense |
| 6000 | Rent | Expense |
| 6100 | Wages | Expense |

Keep the chart **simple, consistent and logical,** adding accounts only when you need to track something separately. Group codes by type (1000s assets, 2000s liabilities, 3000s equity, 4000s income, 5000s and 6000s expenses).

## Journals and ledgers

A **journal** is the book of first entry: a **chronological** record of each transaction with its debits and credits and a short narration. A **ledger** is the collection of **accounts,** where entries from the journal are **posted** so that you can see each account's balance.

**Journal entry format:**

*Date | Account debited | Account credited | Amount | Narration*

Kunle's March transactions (including the cost of goods sold):

| Date | Debit | Credit | Amount | Narration |
| :-- | :-- | :-- | :-- | :-- |
| 1 Mar | Cash | Capital | 500,000 | Owner invests |
| 2 Mar | Equipment | Cash | 120,000 | Buys shelves |
| 3 Mar | Inventory | Payables | 200,000 | Stock from Alpha Traders on credit |
| 10 Mar | Cash | Sales | 150,000 | Cash sales |
| 10 Mar | Cost of goods sold | Inventory | 90,000 | Cost of goods sold (cash sales) |
| 15 Mar | Receivables | Sales | 80,000 | Credit sale to Ngozi |
| 15 Mar | Cost of goods sold | Inventory | 48,000 | Cost of goods sold (credit sale) |
| 20 Mar | Rent | Cash | 30,000 | Rent for March |
| 25 Mar | Payables | Cash | 100,000 | Pays Alpha Traders |
| 28 Mar | Cash | Receivables | 50,000 | Ngozi pays part |
| 31 Mar | Wages | Cash | 40,000 | Pays wages |

**Posting to ledger accounts** (shown as T-accounts, debits left and credits right). **Cash account:** debits 500,000 + 150,000 + 50,000 = 700,000; credits 120,000 + 30,000 + 100,000 + 40,000 = 290,000. **Balance = 700,000 − 290,000 = ₦410,000 debit.** **Inventory:** debit 200,000; credits 90,000 + 48,000 = 138,000; balance **₦62,000** debit. **Receivables:** debit 80,000; credit 50,000; balance **₦30,000** debit. **Payables:** debit 100,000; credit 200,000; balance **₦100,000** credit.

## The trial balance

A **trial balance** lists every ledger account's balance in a debit or credit column, to check that **total debits equal total credits.**

Kunle's trial balance at 31 March:

| Account | Debit | Credit |
| :-- | :-- | :-- |
| Cash | 410,000 | |
| Receivables | 30,000 | |
| Inventory | 62,000 | |
| Equipment | 120,000 | |
| Payables | | 100,000 |
| Capital | | 500,000 |
| Sales | | 230,000 |
| Cost of goods sold | 138,000 | |
| Rent | 30,000 | |
| Wages | 40,000 | |
| **Total** | **830,000** | **830,000** |

Debits: 410,000 + 30,000 + 62,000 + 120,000 + 138,000 + 30,000 + 40,000 = **830,000.** Credits: 100,000 + 500,000 + 230,000 = **830,000.** They agree, which suggests the books are arithmetically correct.

A balanced trial balance does **not** prove there are no errors. It will not detect: an entry **omitted** entirely, an entry posted to the **wrong account** of the right type, **compensating errors,** or an amount **wrong on both sides.** But when the trial balance does not balance, there is definitely an error to find (module 4). The trial balance is also the starting point for the **financial statements** (module 6).

## Try it

```task
{
  "id": "bkp-m02-t1",
  "prompt": "Write the **journal entries** (Dr and Cr with amounts) for these Kunle transactions: (1) sells goods for **₦150,000 cash**; (2) the cost of those goods was **₦90,000**; (3) sells goods to Ngozi on credit for **₦80,000**; (4) pays **₦30,000** rent in cash; (5) Ngozi pays **₦50,000**. One entry per line, in the form \"Dr Cash 150,000 / Cr Sales 150,000\".",
  "minutes": 12,
  "rows": 8,
  "placeholder": "1. Dr Cash 150,000 / Cr Sales 150,000",
  "rules": [
    { "label": "Five lines", "minLines": 5 },
    { "label": "Every line has Dr and Cr", "pattern": "dr[^\\n]*cr", "perLine": true },
    { "label": "Cash sale: Dr Cash, Cr Sales 150,000", "pattern": "dr cash 150,?000[\\s\\S]*cr sales 150,?000" },
    { "label": "Cost of goods sold: Dr COGS, Cr Inventory 90,000", "pattern": "dr (cost of goods sold|cogs)[^\\n]*90,?000[\\s\\S]*cr inventory[^\\n]*90,?000|dr (cost of goods sold|cogs) 90,?000" },
    { "label": "Credit sale: Dr Receivables, Cr Sales 80,000", "pattern": "dr receivables 80,?000" },
    { "label": "Rent: Dr Rent, Cr Cash 30,000", "pattern": "dr rent 30,?000" },
    { "label": "Receipt: Dr Cash, Cr Receivables 50,000", "pattern": "dr cash 50,?000" }
  ],
  "sample": "1. Dr Cash 150,000 / Cr Sales 150,000\n2. Dr Cost of goods sold 90,000 / Cr Inventory 90,000\n3. Dr Receivables 80,000 / Cr Sales 80,000\n4. Dr Rent 30,000 / Cr Cash 30,000\n5. Dr Cash 50,000 / Cr Receivables 50,000",
  "required": true
}
```

```task
{
  "id": "bkp-m02-t2",
  "prompt": "Work out the **balance of the Cash account** from these entries: debits **₦500,000, ₦150,000, ₦50,000**; credits **₦120,000, ₦30,000, ₦100,000, ₦40,000**. Show total debits, total credits and the balance, and say whether it is a debit or credit balance and why.",
  "minutes": 8,
  "rows": 7,
  "placeholder": "Total debits = ...",
  "rules": [
    { "label": "Total debits ₦700,000", "pattern": "700,?000" },
    { "label": "Total credits ₦290,000", "pattern": "290,?000" },
    { "label": "Balance ₦410,000", "pattern": "410,?000" },
    { "label": "Debit balance because debits exceed credits (an asset)", "pattern": "debit balance|debits (are )?(more|greater|exceed)|asset" }
  ],
  "sample": "Total debits = 500,000 + 150,000 + 50,000 = ₦700,000.\nTotal credits = 120,000 + 30,000 + 100,000 + 40,000 = ₦290,000.\nBalance = 700,000 - 290,000 = ₦410,000, a debit balance, because debits exceed credits and cash is an asset.",
  "required": true
}
```

```task
{
  "id": "bkp-m02-t3",
  "prompt": "Complete **Kunle's trial balance** from these balances: Cash 410,000 Dr; Receivables 30,000 Dr; Inventory 62,000 Dr; Equipment 120,000 Dr; Payables 100,000 Cr; Capital 500,000 Cr; Sales 230,000 Cr; Cost of goods sold 138,000 Dr; Rent 30,000 Dr; Wages 40,000 Dr. Give the **total debits and credits** and say what the trial balance does **not** prove.",
  "minutes": 10,
  "rows": 9,
  "placeholder": "Total debits = ...",
  "rules": [
    { "label": "Total debits ₦830,000", "pattern": "830,?000" },
    { "label": "Total credits ₦830,000", "pattern": "830,?000[\\s\\S]*830,?000" },
    { "label": "They agree or balance", "pattern": "agree|balance|equal|match" },
    { "label": "Does not prove no errors (omission, wrong account, compensating)", "pattern": "omit|omission|wrong account|compensat|not prove|does not prove|doesn't prove" }
  ],
  "sample": "Total debits = 410,000 + 30,000 + 62,000 + 120,000 + 138,000 + 30,000 + 40,000 = ₦830,000.\nTotal credits = 100,000 + 500,000 + 230,000 = ₦830,000.\nThe two totals agree, so the trial balance balances.\nIt does not prove there are no errors: an omitted entry, an entry posted to the wrong account or errors that cancel each other would not show.",
  "required": false
}
```

Next lesson: recording daily transactions.
