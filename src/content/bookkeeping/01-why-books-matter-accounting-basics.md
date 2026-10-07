---
title: "Why Books Matter: Accounting Basics"
minutes: 25
summary: Understand the purpose of bookkeeping, the five types of account, the accounting equation and the difference between cash and accrual accounting.
---

## The purpose of bookkeeping

**Bookkeeping** is the systematic recording of a business's financial transactions: every sale, purchase, payment and receipt. **Accounting** uses those records to produce reports (such as the profit and loss statement and the balance sheet) and to help people make decisions.

Without books, an owner cannot answer basic questions:

- *Am I making a profit, or just handling a lot of cash?*
- *How much do customers owe me, and how much do I owe suppliers?*
- *Can I afford to hire, expand or take a loan?*
- *How much tax is due?*
- *Where is the money going?*

Good books also **prevent fraud and errors,** help you **get loans and attract investors** (banks and funders ask for statements), **support tax filing** and give you **evidence** if there is a dispute. Many small businesses fail not because they lack customers, but because they do not know their numbers.

Throughout this course we follow one small business. **Kunle's Phone Accessories** is a shop in Ikeja that sells phone cases, chargers and earphones. Kunle starts it on **1 March** with ₦500,000 of his own money. We will record its first month, then prepare its statements, budget and tax records.

## Assets, liabilities, equity, income and expenses

Every transaction affects one or more of five types of account:

| Type | What it is | Examples |
| :-- | :-- | :-- |
| **Assets** | Things the business owns or is owed, which have value | Cash, bank balance, stock (inventory), equipment, money owed by customers (receivables), vehicles |
| **Liabilities** | What the business owes to others | Money owed to suppliers (payables), loans, accrued wages, tax owed |
| **Equity (capital)** | The owner's stake: what is left for the owner after liabilities | Money invested by the owner, plus profits kept in the business, minus money taken out (drawings) |
| **Income (revenue)** | Money earned from selling goods or services | Sales, service fees, interest received |
| **Expenses** | Costs of running the business | Rent, wages, electricity, transport, advertising, depreciation |

Be careful with a few common confusions:

- **Buying equipment is not an expense;** it is an asset (it is used over many years). Its cost is spread over its life as **depreciation** (module 5).
- **Buying stock** is an asset until it is sold; then its cost becomes an expense called **cost of goods sold.**
- **Money you take out for yourself** is **drawings** (reducing equity), not a business expense.
- **A loan** brings in cash but is a liability, not income.

## The accounting equation

Everything in accounting rests on one equation:

**Assets = Liabilities + Equity**

What the business owns equals what it owes plus what belongs to the owner. This equation must **always balance.** Rearranged: **Equity = Assets − Liabilities.**

Example: assets are ₦1,200,000 and liabilities ₦450,000. Equity = 1,200,000 − 450,000 = **₦750,000.**

See how Kunle's first transactions keep it balanced:

| Transaction | Assets | = Liabilities | + Equity |
| :-- | :-- | :-- | :-- |
| 1 March: Kunle invests ₦500,000 cash | Cash +500,000 | | Capital +500,000 |
| 2 March: Buys shelves for ₦120,000 cash | Cash −120,000, Equipment +120,000 | | |
| 3 March: Buys ₦200,000 of stock on credit from Alpha Traders | Inventory +200,000 | Payables +200,000 | |

After these three: Assets = Cash 380,000 + Equipment 120,000 + Inventory 200,000 = **₦700,000.** Liabilities = **₦200,000.** Equity = **₦500,000.** Check: 200,000 + 500,000 = 700,000. ✓

**Profit increases equity.** Selling goods for more than they cost increases assets (cash or receivables) and equity (through profit). **Losses reduce equity.**

## Cash and accrual basis

There are two ways to decide **when** to record income and expenses.

**Cash basis:** record income when money is **received** and expenses when money is **paid.** Simple, and many very small businesses use it.

**Accrual basis:** record income when it is **earned** (when you sell or deliver) and expenses when they are **incurred** (when you use the goods or services), whether or not cash has moved. It gives a truer picture of performance, because it matches income with the costs of earning it.

Example: in March Kunle sells goods for ₦80,000 on credit to Ngozi, who pays in April.

- **Cash basis:** the ₦80,000 counts as income in **April.**
- **Accrual basis:** the ₦80,000 counts as income in **March,** and ₦80,000 is recorded as a receivable until she pays.

Which to use? Cash basis is easier, but it can mislead: a business may seem profitable in a month when customers pay, even though it earned little. Accrual shows whether the business is really earning, and is needed for credit sales, stock, accrued expenses and larger businesses. This course teaches the **accrual basis** with a cash view alongside it. Whichever you choose, **be consistent,** and follow the tax rules that apply to you.

## Try it

```task
{
  "id": "bkp-m01-t1",
  "prompt": "Classify each as **asset, liability, equity, income or expense**, one per line with a short reason: (1) cash in the till; (2) money owed to Alpha Traders for stock; (3) Kunle's ₦500,000 investment; (4) sales of phone cases; (5) shop rent paid; (6) shelves bought for the shop; (7) money owed by customer Ngozi; (8) a bank loan.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "1. Asset - ...",
  "rules": [
    { "label": "Eight lines", "minLines": 8 },
    { "label": "Cash is an asset", "pattern": "cash[^\\n]*asset|asset[^\\n]*cash|1\\.[^\\n]*asset" },
    { "label": "Money owed to supplier is a liability", "pattern": "alpha[^\\n]*liabilit|owed to[^\\n]*liabilit|2\\.[^\\n]*liabilit" },
    { "label": "Investment is equity", "pattern": "investment[^\\n]*equity|equity[^\\n]*investment|3\\.[^\\n]*equity|capital" },
    { "label": "Sales is income", "pattern": "sales[^\\n]*income|income[^\\n]*sales|4\\.[^\\n]*income|revenue" },
    { "label": "Rent is an expense", "pattern": "rent[^\\n]*expense|5\\.[^\\n]*expense" },
    { "label": "Shelves are an asset (equipment)", "pattern": "shelves[^\\n]*asset|6\\.[^\\n]*asset|equipment" },
    { "label": "Loan is a liability", "pattern": "loan[^\\n]*liabilit|8\\.[^\\n]*liabilit" }
  ],
  "sample": "1. Asset - cash is owned by the business.\n2. Liability - money owed to Alpha Traders.\n3. Equity (capital) - the owner's investment.\n4. Income - sales earn money for the business.\n5. Expense - rent is a cost of running the shop.\n6. Asset - shelves are equipment used for years, not an expense.\n7. Asset - a receivable, money owed to the business.\n8. Liability - a loan must be repaid.",
  "required": true
}
```

```task
{
  "id": "bkp-m01-t2",
  "prompt": "Show the **accounting equation** after each step for Kunle: (a) invests ₦500,000 cash; (b) buys shelves for ₦120,000 cash; (c) buys ₦200,000 of stock on credit. Give the **assets, liabilities and equity** at the end and check that the equation balances. Also work out equity if assets are ₦1,200,000 and liabilities ₦450,000.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "After (a): Assets = ...",
  "rules": [
    { "label": "Assets of ₦700,000", "pattern": "700,?000" },
    { "label": "Liabilities of ₦200,000", "pattern": "200,?000" },
    { "label": "Equity of ₦500,000", "pattern": "500,?000" },
    { "label": "Says it balances", "pattern": "balance" },
    { "label": "Equity of ₦750,000 for the second case", "pattern": "750,?000" }
  ],
  "sample": "After (a): Assets (cash) 500,000 = Liabilities 0 + Equity 500,000.\nAfter (b): Assets: cash 380,000 + equipment 120,000 = 500,000; equity 500,000.\nAfter (c): Assets: cash 380,000 + equipment 120,000 + inventory 200,000 = 700,000; liabilities (payables) 200,000; equity 500,000.\nCheck: 200,000 + 500,000 = 700,000, so the equation balances.\nSecond case: equity = 1,200,000 - 450,000 = ₦750,000.",
  "required": true
}
```

```task
{
  "id": "bkp-m01-t3",
  "prompt": "In March Kunle sells goods for **₦80,000 on credit** to Ngozi, who pays in **April**. Say when the income is recorded under the **cash basis** and under the **accrual basis**, what is recorded in March under accrual, and in 40 to 80 words which method you would recommend for Kunle and why.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Cash basis: ...",
  "rules": [
    { "label": "Cash basis records it in April", "pattern": "cash basis[^\\n]*april|april[^\\n]*cash basis" },
    { "label": "Accrual basis records it in March", "pattern": "accrual[^\\n]*march|march[^\\n]*accrual" },
    { "label": "Receivable recorded", "pattern": "receivable|owed by|ngozi owes" },
    { "label": "Recommends accrual with a reason (true picture, credit sales, matching)", "pattern": "accrual[\\s\\S]*(because|since|true|picture|matching|credit|earned)" },
    { "label": "At least 40 words", "minWords": 40, "maxWords": 140 }
  ],
  "sample": "Cash basis: the ₦80,000 is income in April, when the money is received.\nAccrual basis: it is income in March, when the sale is made, and in March a receivable of ₦80,000 is recorded for money owed by Ngozi.\nI would recommend the accrual basis for Kunle, because he will sell on credit and hold stock, and accrual gives a true picture of what he earned each month by matching income with the related costs.",
  "required": false
}
```

Next lesson: double-entry bookkeeping.
