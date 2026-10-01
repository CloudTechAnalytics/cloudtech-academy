---
title: The brief and the plan
minutes: 25
summary: Meet Voltline Electronics, turn a chief executive's questions into an analysis plan with definitions and deliverables, and get to know the raw data.
---

## The problem

This is the capstone of the Data Analyst track. There are no new functions to learn. Instead, you'll do what a junior analyst is hired to do: take a business problem and a pile of raw data, and come back with answers a leadership team can act on.

The company is **Voltline Electronics**, a chain of eight stores selling phones, laptops, accessories, home appliances and solar power equipment in Lagos, Abuja, Port Harcourt and Ibadan. The chief executive, Ngozi Afolabi, has sent you this:

> "We grew 37% in the first half of this year and the board is delighted. I'm not sure I am. I want to know what's really driving it, which stores and products are doing well and which aren't, and whether our targets make sense. The data is whatever the tills export. I need something I can take to the board in a month, and I need to trust it."

The data comes straight from the stores' tills, with all the problems that implies. Nobody has cleaned it, and nobody has checked it. That's your job too.

## The concept

**Every analysis project follows the same arc**

| Stage | Output | Lesson |
| :-- | :-- | :-- |
| 1. Brief and plan | Questions, definitions, deliverables, a plan | 1 |
| 2. Profile | A list of every problem in the raw data | 2 |
| 3. Clean and prepare | Clean tables and a cleaning log | 3 |
| 4. Model and measures | A model and tested measures | 4 |
| 5. Analyse | Answers, each backed by a number | 5 |
| 6. Dashboard and story | A report and an executive summary | 6 |
| 7. Review and present | A checked, presented, published piece of work | 7 |

Use whichever tools you like: Excel, Power BI, SQL or Python, or a mix. The lessons show the key steps in more than one. What's assessed is the quality of the answers, not the tool.

**A plan starts from the questions, not the data**

Turn the brief into specific questions you can answer with numbers:

1. How much of the 37% growth is real? (Price rise? The new store? More customers?)
2. Which stores are improving, and which are struggling? Why?
3. Which categories make money, not just sales?
4. Are the store targets fair and achievable?
5. Where is money being left on the table (stock-outs, returns, missed add-on sales)?

**Definitions before numbers**

Write these down before you calculate anything, because every number depends on them:

- **Net sales** = quantity × unit price − discount, with returns (negative quantities) included.
- **Gross profit** = net sales − quantity × unit cost, using the cost price in force on the sale date.
- **Like for like** = stores open for the whole of both periods being compared.
- **The analysis period** = 1 January 2025 to 30 June 2026. "H1" means January to June.

**Deliverables**

Agree what you'll hand over: a cleaned dataset with a cleaning log, a dashboard of two or three pages, a one-page executive summary with three recommendations, and your working (queries, workbook or notebook) so someone can check it.

## Example

A first look at the files. The dataset has six CSV files:

| File | Rows | What it is |
| :-- | --: | :-- |
| `sales_raw.csv` | 27,978 | every till line, exactly as exported |
| `stores.csv` | 8 | the eight stores |
| `products.csv` | 22 | the product list with current prices |
| `cost_prices.csv` | 44 | what Voltline pays for each product, with the date each cost applies from |
| `targets.csv` | 138 | monthly net-sales targets by store |
| `stockouts.csv` | 8 | periods when a store had run out of a product |

Look at the grain (what one row represents) of each file. `sales_raw` is one row per **line** of a till transaction, `targets` is one row per **store per month**, and `cost_prices` is one row per **product per cost change**. Combining files at different grains is where many analyses go wrong. You'll deal with it in lesson 4.

## Walkthrough

1. Download the retail dataset and open every file. Write down the grain of each one in a sentence.
2. Read the data dictionary on the dataset card. Note any column whose meaning you're unsure of.
3. Open `sales_raw.csv` and scroll. Without doing any analysis yet, write down three things that look odd.
4. Write your analysis plan (the task below): the questions, your definitions and your deliverables.
5. Set up a project folder: `raw/` (never edited), `clean/`, `analysis/` and `report/`. Keeping the raw files untouched means you can always start again.

## Practice

```dataset
{"dataset": "retail", "files": ["sales_raw", "stores", "products", "cost_prices", "targets", "stockouts"]}
```

```answer
{
  "id": "cap-01-p1",
  "prompt": "How many rows (excluding the header) are in **sales_raw.csv**?",
  "answer": 27978,
  "format": "number",
  "dataset": "retail",
  "files": ["sales_raw"],
  "verify": "SELECT COUNT(*) FROM sales_raw",
  "hint": "In Excel, select a column and read the count in the status bar, then subtract the header. In pandas, len(df).",
  "required": true
}
```

```answer
{
  "id": "cap-01-p2",
  "prompt": "How many monthly targets does **Lekki** (store_id 2) have in targets.csv?",
  "answer": 12,
  "format": "number",
  "dataset": "retail",
  "files": ["targets"],
  "verify": "SELECT COUNT(*) FROM targets WHERE store_id = 2",
  "hint": "Filter targets.csv to store_id 2.",
  "explanation": "12 months, from July 2025, when it opened. Every other store has 18. Remember that when you compare stores.",
  "required": true
}
```

```task
{
  "id": "cap-01-t1",
  "prompt": "Write your **analysis plan** for Voltline. Use three headings on their own lines: **Questions**, **Definitions** and **Deliverables**. Under Questions, list at least four specific questions as bullets. Under Definitions, define at least net sales, gross profit and like for like. Under Deliverables, list what you'll hand over.",
  "minutes": 12,
  "rows": 16,
  "placeholder": "Questions\n- ...\n\nDefinitions\n- Net sales: ...\n\nDeliverables\n- ...",
  "rules": [
    { "label": "Has a Questions heading", "pattern": "^\\W*questions\\W*$" },
    { "label": "Has a Definitions heading", "pattern": "^\\W*definitions\\W*$" },
    { "label": "Has a Deliverables heading", "pattern": "^\\W*deliverables\\W*$" },
    { "label": "At least four questions, each ending with a question mark", "pattern": "^\\s*[-*]\\s+.*\\?\\s*$", "min": 4 },
    { "label": "Defines net sales", "pattern": "net sales\\s*[:=-]" },
    { "label": "Defines gross profit", "pattern": "gross (profit|margin)\\s*[:=-]" },
    { "label": "Defines like for like", "pattern": "like[- ]for[- ]like\\s*[:=-]" },
    { "label": "Enough detail: at least 120 words", "minWords": 120 }
  ],
  "sample": "**Questions**\n- How much of H1 2026's growth comes from the price rise, the new Lekki store and real volume?\n- Which stores are growing on a like-for-like basis, and which are falling? Why?\n- Which categories make the most gross profit, not just the most sales?\n- Are the 2026 store targets fair, given the price rise and Lekki's opening?\n- How much do stock-outs, returns and missed accessory sales cost us?\n\n**Definitions**\n- Net sales: quantity × unit price − discount, including returns as negative lines, excluding test transactions and duplicate rows.\n- Gross profit: net sales − quantity × unit cost, using the cost price in force on the sale date.\n- Like for like: stores open for the whole of both periods compared (all except Lekki for 2025 against 2026).\n- Period: 1 January 2025 to 30 June 2026; H1 = January to June.\n\n**Deliverables**\n- Cleaned sales table and a cleaning log.\n- A Power BI report: overview, stores, products and customers pages.\n- A one-page executive summary with three recommendations.\n- My SQL and Power Query steps, so the work can be checked.",
  "note": "Notice how specific the questions are. \"Analyse sales\" can't be finished; \"how much of the growth is the price rise?\" can be answered with one number. Your plan will change as you learn more, and that's normal. Update it rather than abandoning it.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Why write definitions such as 'net sales' before calculating anything?",
    "options": ["It's a formality", "Every number depends on them, and agreeing them first stops two people producing different answers to the same question", "Tools require it", "To make the report longer"],
    "answer": 1,
    "explanation": "Most disagreements about numbers are really disagreements about definitions."
  },
  {
    "prompt": "sales_raw has one row per till line; targets has one row per store per month. What does that mean for joining them?",
    "options": ["Join them directly on store", "They're at different grains: total sales to store and month first, then compare with targets", "They can't be used together", "Use a CROSS JOIN"],
    "answer": 1,
    "explanation": "Joining line-level sales directly to monthly targets would repeat each target once per line."
  },
  {
    "prompt": "Why keep the raw files untouched in their own folder?",
    "options": ["To save space", "So you can always repeat or check your cleaning from the original data", "Tools can't read edited files", "It's required by law"],
    "answer": 1,
    "explanation": "Clean into new files, and keep a record of every step."
  }
]
```
