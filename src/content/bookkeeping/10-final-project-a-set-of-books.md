---
title: "Final Project: A Set of Books"
minutes: 80
summary: Record a month of transactions for a small business, prepare its financial statements and write a short report.
---

## What you are building

Throughout the course you have followed Kunle's phone-accessories shop. Now you do the whole job yourself, for **a small business of your own choosing.** You will **record a month of transactions, prepare the trial balance, make adjustments, produce the three financial statements and write a short report** to the owner.

Pick a **simple business** you understand: a shop, a salon, a food seller, a tutoring business, a printing business, a transport business or a freelancer. Give it a name and describe what it sells.

**Invent a realistic month of transactions** (at least **12**), using sensible Nigerian prices. Include:

- The **owner investing money** to start (cash).
- **Buying equipment** (an asset).
- **Buying stock or supplies,** some **on credit.**
- **Cash sales** and at least one **credit sale,** with the **cost of goods sold** for each (or a service business with no stock).
- **Paying expenses:** rent, wages, transport or electricity.
- **Paying a supplier** and **receiving payment from a customer.**
- At the end: **adjustments** for **depreciation,** **an accrued expense** and **an allowance for doubtful debts** (or a prepayment).

Use round, clear numbers so that you can check your own work, and make sure the **numbers tie together.**

## Your set of books has seven parts

1. **The business and the transactions:** a short description and your numbered list of transactions with dates and amounts.
2. **The journal:** a journal entry (Dr and Cr) for every transaction.
3. **The ledger balances and trial balance:** the closing balance of each account and a trial balance showing total debits equal total credits.
4. **The adjustments:** depreciation, accrual, prepayment or allowance, with journal entries and amounts.
5. **The financial statements:** profit and loss statement, balance sheet (which must balance) and cash flow statement (which must agree with the cash balance).
6. **The analysis:** gross margin, net margin, current ratio and break-even sales.
7. **The report:** a short report (150 to 250 words) explaining the month to the owner, with three insights and three recommendations, and a note on tax and records you would need to keep (with a reminder to confirm current tax rules).

## Checking your work

Before you submit, run these checks:

- **Every journal entry has equal debits and credits.**
- **The trial balance totals agree.**
- **Net profit** on the profit and loss equals the profit added to equity on the balance sheet.
- **The balance sheet balances** (assets = liabilities + equity).
- **Closing cash** on the cash flow statement equals the cash balance in the ledger and balance sheet.
- **The report's numbers match the statements.**

> [!TIP]
> If something does not balance, use the techniques from module 4: check the arithmetic, look at the size of the difference (divisible by 9? double a figure? equal to one entry?) and re-check each posting against your list of transactions.

## Try it

```task
{
  "id": "bkp-m10-t1",
  "prompt": "Describe your **business and list at least twelve numbered transactions** with dates and amounts, one per line: the owner's investment, equipment, stock on credit, cash sales and cost of goods sold, a credit sale, rent, wages, paying a supplier and a customer paying. After the list, add one line stating the **opening capital**.",
  "minutes": 15,
  "rows": 16,
  "placeholder": "Business: ...\n1. 1 May - owner invests ₦...",
  "rules": [
    { "label": "At least thirteen lines", "minLines": 13 },
    { "label": "Describes the business", "pattern": "business|shop|salon|seller|service" },
    { "label": "Twelve numbered transactions", "pattern": "(^|\\n)\\s*\\d{1,2}\\.\\s", "min": 12 },
    { "label": "Includes owner investment, equipment, stock, sales, rent and wages", "pattern": "invest[\\s\\S]*(equipment|shelves|machine)[\\s\\S]*(stock|inventory|purchase)[\\s\\S]*sale[\\s\\S]*rent[\\s\\S]*wages" },
    { "label": "Naira amounts", "pattern": "₦\\s?\\d", "min": 10 },
    { "label": "States opening capital", "pattern": "capital" }
  ],
  "sample": "Business: Tola's Hair Care, a small shop selling hair products in Yaba\n1. 1 May - owner invests ₦400,000 cash\n2. 2 May - buys equipment for ₦100,000 cash\n3. 3 May - buys stock for ₦180,000 on credit from Beauty Wholesale\n4. 10 May - cash sales ₦140,000, cost of goods ₦84,000\n5. 12 May - credit sale to Ada ₦60,000, cost ₦36,000\n6. 15 May - pays rent ₦25,000\n7. 18 May - pays Beauty Wholesale ₦90,000\n8. 22 May - Ada pays ₦40,000\n9. 25 May - cash sales ₦100,000, cost of goods ₦60,000\n10. 28 May - pays wages ₦35,000\n11. 30 May - pays electricity ₦8,000\n12. 31 May - pays transport ₦7,000\nOpening capital: ₦400,000",
  "required": true
}
```

```task
{
  "id": "bkp-m10-t2",
  "prompt": "Write the **journal entries** for all your transactions, one per line in the form \"Dr Account amount / Cr Account amount\" (include the cost of goods sold entries). Then give the **closing balance of the Cash account** with total receipts and payments. At least fourteen lines.",
  "minutes": 20,
  "rows": 18,
  "placeholder": "1. Dr Cash 400,000 / Cr Capital 400,000",
  "rules": [
    { "label": "At least fourteen lines", "minLines": 14 },
    { "label": "At least twelve entries with Dr and Cr", "pattern": "dr [^/\\n]+/\\s*cr", "min": 12 },
    { "label": "Includes cost of goods sold", "pattern": "cost of goods sold|cogs" },
    { "label": "Includes Capital, Equipment, Inventory, Payables, Sales, Rent and Wages", "pattern": "capital[\\s\\S]*equipment[\\s\\S]*inventory[\\s\\S]*payables[\\s\\S]*sales[\\s\\S]*rent[\\s\\S]*wages" },
    { "label": "Cash balance with receipts and payments", "pattern": "receipts[\\s\\S]*payments[\\s\\S]*balance|closing (cash )?balance" }
  ],
  "sample": "1. Dr Cash 400,000 / Cr Capital 400,000\n2. Dr Equipment 100,000 / Cr Cash 100,000\n3. Dr Inventory 180,000 / Cr Payables 180,000\n4. Dr Cash 140,000 / Cr Sales 140,000\n4b. Dr Cost of goods sold 84,000 / Cr Inventory 84,000\n5. Dr Receivables 60,000 / Cr Sales 60,000\n5b. Dr Cost of goods sold 36,000 / Cr Inventory 36,000\n6. Dr Rent 25,000 / Cr Cash 25,000\n7. Dr Payables 90,000 / Cr Cash 90,000\n8. Dr Cash 40,000 / Cr Receivables 40,000\n9. Dr Cash 100,000 / Cr Sales 100,000\n9b. Dr Cost of goods sold 60,000 / Cr Inventory 60,000\n10. Dr Wages 35,000 / Cr Cash 35,000\n11. Dr Electricity 8,000 / Cr Cash 8,000\n12. Dr Transport 7,000 / Cr Cash 7,000\nCash: total receipts = 400,000 + 140,000 + 40,000 + 100,000 = 680,000; total payments = 100,000 + 25,000 + 90,000 + 35,000 + 8,000 + 7,000 = 265,000; closing balance = ₦415,000",
  "required": true
}
```

```task
{
  "id": "bkp-m10-t3",
  "prompt": "Prepare your **trial balance** (each account with its Dr or Cr balance and the **totals**, which must agree), then record **three adjustments** (depreciation, an accrued expense and an allowance for doubtful debts) with their journal entries and amounts. At least fifteen lines.",
  "minutes": 20,
  "rows": 18,
  "placeholder": "Cash 415,000 Dr\n...\nTotal debits = ... Total credits = ...",
  "rules": [
    { "label": "At least fifteen lines", "minLines": 15 },
    { "label": "Accounts with Dr or Cr balances", "pattern": "\\b(dr|cr)\\b", "min": 10 },
    { "label": "States totals of debits and credits", "pattern": "total debits[\\s\\S]*total credits|debits total[\\s\\S]*credits total" },
    { "label": "Says they agree", "pattern": "agree|equal|balance" },
    { "label": "Depreciation adjustment", "pattern": "depreciation" },
    { "label": "Accrual adjustment", "pattern": "accru" },
    { "label": "Allowance or bad debt", "pattern": "allowance|bad debt|doubtful" }
  ],
  "sample": "Cash 415,000 Dr\nReceivables 20,000 Dr\nInventory 0 Dr\nEquipment 100,000 Dr\nPayables 90,000 Cr\nCapital 400,000 Cr\nSales 300,000 Cr\nCost of goods sold 180,000 Dr\nRent 25,000 Dr\nWages 35,000 Dr\nElectricity 8,000 Dr\nTransport 7,000 Dr\nTotal debits = 415,000 + 20,000 + 100,000 + 180,000 + 25,000 + 35,000 + 8,000 + 7,000 = 790,000; total credits = 90,000 + 400,000 + 300,000 = 790,000; they agree\nAdjustment 1 depreciation: 100,000 / 5 years / 12 = 1,667 a month; Dr Depreciation 1,667 / Cr Accumulated depreciation 1,667\nAdjustment 2 accrual: Dr Wages 5,000 / Cr Accrued wages 5,000\nAdjustment 3 allowance for doubtful debts: 10% of 20,000 = 2,000; Dr Bad debts 2,000 / Cr Allowance for doubtful debts 2,000",
  "required": true
}
```

```task
{
  "id": "bkp-m10-t4",
  "prompt": "Prepare your **financial statements** and a **short report**. Give the **profit and loss** (sales, cost of goods sold, gross profit, expenses, net profit), the **balance sheet** (total assets, total liabilities, equity, and that it balances), the **closing cash** from the cash flow statement, then **gross margin, net margin, current ratio and break-even sales**, and a **report of 100 to 200 words** with three insights, three recommendations and a note to confirm current tax rules. At least eleven lines.",
  "minutes": 25,
  "rows": 20,
  "placeholder": "Profit and loss: sales ...\nBalance sheet: ...",
  "rules": [
    { "label": "At least eleven lines", "minLines": 11 },
    { "label": "Profit and loss with gross profit and net profit", "pattern": "gross profit[\\s\\S]*net profit" },
    { "label": "Balance sheet totals and balance", "pattern": "total assets[\\s\\S]*(liabilities|equity)[\\s\\S]*balance" },
    { "label": "Closing cash", "pattern": "closing cash|cash flow" },
    { "label": "Ratios: gross margin, net margin, current ratio", "pattern": "gross margin[\\s\\S]*net margin[\\s\\S]*current ratio" },
    { "label": "Break-even sales", "pattern": "break-?even" },
    { "label": "Insights and recommendations", "pattern": "insight[\\s\\S]*recommend|recommend[\\s\\S]*insight" },
    { "label": "Tax note", "pattern": "tax[\\s\\S]*(confirm|check|current)|(confirm|check|current)[\\s\\S]*tax" },
    { "label": "At least 120 words", "minWords": 120, "maxWords": 450 }
  ],
  "sample": "Profit and loss: sales 300,000; cost of goods sold 180,000; gross profit 120,000; expenses: rent 25,000, wages 40,000 (35,000 paid and 5,000 accrued), electricity 8,000, transport 7,000, depreciation 1,667, bad debts 2,000 = 83,667; net profit 36,333\nBalance sheet: cash 415,000; receivables net 18,000; equipment net 98,333; total assets 531,333; liabilities: payables 90,000 and accrued wages 5,000 = 95,000; equity: capital 400,000 + profit 36,333 = 436,333; total liabilities and equity 531,333, so it balances\nCash flow: operating cash 115,000, investing -100,000, financing 400,000; closing cash 415,000, which agrees with the balance sheet\nGross margin 40%; net margin 12.1%; current ratio = 433,000 / 95,000 = 4.6; break-even sales = fixed costs 81,667 / 40% = about 204,200\nInsight 1: the shop earned a healthy 40% gross margin and a 12% net margin in its first month.\nInsight 2: most of the cash is the owner's capital, and operating cash flow is positive at 115,000.\nInsight 3: break-even sales of about 204,200 are well below the 300,000 achieved, giving a good margin of safety.\nRecommendation 1: collect the remaining ₦20,000 from Ada quickly and set credit limits.\nRecommendation 2: keep stock aligned to the best sellers to protect margin and cash.\nRecommendation 3: set aside cash for tax and keep all invoices and receipts for the records.\nNote: tax rates, VAT registration and filing rules must be confirmed with the tax authority or an accountant before filing.",
  "required": true
}
```

When you are done, submit your complete set of books as your final project.
