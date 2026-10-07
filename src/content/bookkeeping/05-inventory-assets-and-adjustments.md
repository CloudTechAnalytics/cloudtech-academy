---
title: Inventory, Assets and Adjustments
minutes: 30
summary: Keep stock records, record fixed assets and depreciation, handle accruals and prepayments and deal with bad debts.
---

## Stock records

For a business that sells goods, **stock (inventory)** is often the largest asset and the biggest source of error. Two systems:

- **Perpetual:** update the stock records with every purchase and sale, so you always know what you should have. Needs a record per product.
- **Periodic:** count the stock at the end of a period and work out the cost of goods sold: *Opening stock + purchases − closing stock = cost of goods sold.*

Whichever you use, **count the stock physically** at least at each year-end (and more often for important items), compare with the records and investigate differences (theft, damage, errors).

**Valuation.** Stock is valued at the **lower of cost and net realisable value** (what it can be sold for, less costs of sale). Damaged or obsolete stock should be written down. When the cost of identical goods changes over time, you need a method to decide which cost to use for goods sold:

- **FIFO (first in, first out):** assume the oldest stock is sold first.
- **Weighted average cost:** use the average cost of all units.

Example: Kunle buys **100 units at ₦1,000** and later **100 units at ₦1,200,** then sells **150.**

- **FIFO:** the first 100 sold cost ₦1,000 each = 100,000; the next 50 cost ₦1,200 each = 60,000. **Cost of goods sold = ₦160,000.** Closing stock = 50 × 1,200 = **₦60,000.**
- **Weighted average:** average cost = (100,000 + 120,000) ÷ 200 = **₦1,100** per unit. Cost of goods sold = 150 × 1,100 = **₦165,000.** Closing stock = 50 × 1,100 = **₦55,000.**

The two methods give different profits (FIFO's cost of sales is ₦5,000 lower in this example, so profit is ₦5,000 higher). Choose one, apply it consistently and follow the tax and accounting rules that apply to you.

Control stock with: **a stock card** or list for each product, **numbered goods received and issued documents,** secure storage, regular counts, and a record of write-offs.

## Fixed assets and depreciation

**Fixed assets** are long-term assets used in the business (equipment, furniture, vehicles, buildings, computers). They are not expensed when bought; their cost is spread over their useful life through **depreciation,** reflecting that they wear out or become obsolete.

**Straight-line depreciation** (the simplest method):

*Annual depreciation = (Cost − Residual value) ÷ Useful life in years*

Example: Kunle's shelves cost **₦120,000,** with an expected life of **5 years** and no residual value. Annual depreciation = 120,000 ÷ 5 = **₦24,000.** Monthly = 24,000 ÷ 12 = **₦2,000.**

Journal entry for March: **Dr Depreciation expense 2,000, Cr Accumulated depreciation 2,000.** *Accumulated depreciation* is a contra-asset account that reduces the asset's value on the balance sheet. The **net book value (carrying value)** = cost − accumulated depreciation: at the end of March, 120,000 − 2,000 = **₦118,000.**

Keep a **fixed asset register:** description, date bought, cost, useful life, depreciation method, accumulated depreciation, location and serial number. When an asset is sold or scrapped, remove it and record any profit or loss on disposal. Depreciation is a **non-cash expense:** it reduces profit but does not use cash. (Tax rules may allow different depreciation rates; your accountant can advise.)

## Accruals and prepayments

Under the accrual basis, expenses and income belong to the period they relate to, whatever the payment date. Two adjustments handle timing:

**Accrued expense:** an expense **incurred but not yet paid** by the period-end. Example: Kunle's staff earned **₦10,000** of wages in the last days of March, to be paid in April. Record: **Dr Wages 10,000, Cr Accrued wages (a liability) 10,000.** March's wages expense becomes 40,000 + 10,000 = **₦50,000.**

**Prepaid expense:** an expense **paid in advance** that covers future periods. Example: on 1 April Kunle pays **₦90,000** rent for three months (April to June). At the end of April, one month (**₦30,000**) is an expense and **₦60,000** is a **prepayment** (an asset). Record at payment: **Dr Prepaid rent 90,000, Cr Cash 90,000;** each month: **Dr Rent 30,000, Cr Prepaid rent 30,000.**

**Accrued income** (earned but not yet billed) and **deferred income** (paid in advance by customers) work in the same way for income.

Rule of thumb: ask, *"Does this amount belong to this month? Have I recorded all of this month's costs and income?"*

## Bad debts

Some customers do not pay. A **bad debt** is a receivable you decide you will not collect. Record it as an expense: **Dr Bad debts expense, Cr Receivables.** If a debt previously written off is later paid, reverse it.

Because some debts are likely to go bad, many businesses also set up an **allowance for doubtful debts (provision):** an estimate of the share of receivables that will not be paid.

Example: Kunle's receivables at 31 March are **₦30,000.** He estimates **10%** may not be paid. Allowance = 10% × 30,000 = **₦3,000.** Record: **Dr Bad debts expense 3,000, Cr Allowance for doubtful debts 3,000.** On the balance sheet, receivables are shown at 30,000 − 3,000 = **₦27,000** (net).

Prevent bad debts by checking customers before giving credit, setting credit limits, agreeing clear terms, invoicing promptly, following up early and stopping credit to late payers.

**Summary of Kunle's March adjustments:** depreciation ₦2,000; accrued wages ₦10,000; allowance for doubtful debts ₦3,000. These reduce profit by 2,000 + 10,000 + 3,000 = **₦15,000.** Module 6 shows the effect.

## Try it

```task
{
  "id": "bkp-m05-t1",
  "prompt": "Kunle buys **100 units at ₦1,000** and later **100 units at ₦1,200**, then sells **150 units**. Work out the **cost of goods sold** and the **closing stock value** under **FIFO** and under **weighted average cost**, and say which gives the higher profit.",
  "minutes": 12,
  "rows": 10,
  "placeholder": "FIFO cost of goods sold = ...",
  "rules": [
    { "label": "FIFO COGS ₦160,000", "pattern": "160,?000" },
    { "label": "FIFO closing stock ₦60,000", "pattern": "60,?000" },
    { "label": "Average cost ₦1,100", "pattern": "1,?100" },
    { "label": "Average COGS ₦165,000", "pattern": "165,?000" },
    { "label": "Average closing stock ₦55,000", "pattern": "55,?000" },
    { "label": "FIFO gives the higher profit (lower COGS)", "pattern": "fifo[^\\n]*(higher|more)[^\\n]*profit|higher profit[^\\n]*fifo|lower cost" }
  ],
  "sample": "FIFO: first 100 at 1,000 = 100,000, next 50 at 1,200 = 60,000, so cost of goods sold = ₦160,000 and closing stock = 50 x 1,200 = ₦60,000.\nWeighted average: (100,000 + 120,000) / 200 = ₦1,100 a unit, so cost of goods sold = 150 x 1,100 = ₦165,000 and closing stock = 50 x 1,100 = ₦55,000.\nFIFO gives the higher profit, by ₦5,000, because its cost of goods sold is lower.",
  "required": true
}
```

```task
{
  "id": "bkp-m05-t2",
  "prompt": "Kunle's shelves cost **₦120,000**, life **5 years**, no residual value. Work out annual and **monthly depreciation**, write the **March journal entry** and give the **net book value** at the end of March. Then record: **wages accrued ₦10,000** and **an allowance of 10%** on **₦30,000** receivables (journal entries and the amounts).",
  "minutes": 15,
  "rows": 11,
  "placeholder": "Annual depreciation = ...",
  "rules": [
    { "label": "Annual depreciation ₦24,000", "pattern": "24,?000" },
    { "label": "Monthly depreciation ₦2,000", "pattern": "2,?000" },
    { "label": "Journal Dr Depreciation / Cr Accumulated depreciation", "pattern": "dr depreciation[\\s\\S]*cr accumulated depreciation" },
    { "label": "Net book value ₦118,000", "pattern": "118,?000" },
    { "label": "Dr Wages / Cr Accrued wages 10,000", "pattern": "dr wages 10,?000[\\s\\S]*cr accrued wages" },
    { "label": "Allowance ₦3,000, receivables net ₦27,000", "pattern": "3,?000[\\s\\S]*27,?000|27,?000[\\s\\S]*3,?000" }
  ],
  "sample": "Annual depreciation = 120,000 / 5 = ₦24,000; monthly = ₦2,000.\nMarch entry: Dr Depreciation expense 2,000 / Cr Accumulated depreciation 2,000.\nNet book value = 120,000 - 2,000 = ₦118,000.\nAccrued wages: Dr Wages 10,000 / Cr Accrued wages 10,000.\nAllowance: 10% x 30,000 = ₦3,000; Dr Bad debts expense 3,000 / Cr Allowance for doubtful debts 3,000; receivables are shown net at ₦27,000.",
  "required": true
}
```

```task
{
  "id": "bkp-m05-t3",
  "prompt": "On 1 April Kunle pays **₦90,000** rent for **April to June**. Write the **entry at payment**, the **entry each month**, and the **prepayment balance** at the end of April and of May. Explain in one or two sentences why this is not simply ₦90,000 of April expense.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "At payment: Dr Prepaid rent ...",
  "rules": [
    { "label": "Payment entry Dr Prepaid rent 90,000 / Cr Cash", "pattern": "dr prepaid rent 90,?000[\\s\\S]*cr (cash|bank)" },
    { "label": "Monthly entry Dr Rent 30,000 / Cr Prepaid rent 30,000", "pattern": "dr rent 30,?000[\\s\\S]*cr prepaid rent 30,?000" },
    { "label": "Prepayment at end of April ₦60,000", "pattern": "60,?000" },
    { "label": "Prepayment at end of May ₦30,000", "pattern": "30,?000[\\s\\S]*may|may[\\s\\S]*30,?000" },
    { "label": "Explains matching to the months it relates to", "pattern": "relates|matching|belongs|three months|each month|future|period" }
  ],
  "sample": "At payment: Dr Prepaid rent 90,000 / Cr Cash 90,000.\nEach month: Dr Rent 30,000 / Cr Prepaid rent 30,000.\nPrepayment at the end of April = 90,000 - 30,000 = ₦60,000; at the end of May = ₦30,000.\nIt is not all April's expense because the payment covers three months, and under accrual accounting each month should bear only the rent that relates to it.",
  "required": false
}
```

Next lesson: financial statements.
