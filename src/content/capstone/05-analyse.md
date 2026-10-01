---
title: Analyse
minutes: 30
summary: Answer the chief executive's questions one by one, separate real growth from price and new stores, find what's going wrong where, and put a naira value on missed sales.
---

## The problem

The board is celebrating 37% growth. Your job now is to find out what's underneath it. A headline number like that almost always mixes several stories, some good and some bad, and the bad ones are easy to miss when the total looks healthy.

This lesson works through the plan from lesson 1. For each question you'll get a number, check it, and write down what it means. Those notes become your executive summary in lesson 6.

## The concept

**Decompose the headline**

Revenue growth = price + new stores + everything else (volume and mix in the existing stores). Separate them:

- **New stores**: compare like for like, leaving out stores not open in both periods (Lekki).
- **Price**: compare the like-for-like growth with the 18% price rise. Whatever's left is real change in volume or mix.

**Compare like with like, then look inside**

For each store, compare January to June 2026 with January to June 2025: sales, transactions and average transaction value. When something changes sharply, find the **date** it changed. A step change on a particular date usually has a specific cause.

**Look for money left on the table**

| Leak | Measure |
| :-- | :-- |
| Missed add-on sales | **Attach rate**: the share of phone transactions that include an accessory |
| Returns | **Return rate**: units returned ÷ units sold, by product |
| Stock-outs | **Lost sales estimate**: normal daily sales × days out of stock × price |

**Every estimate needs its assumptions**

A lost-sales figure is an estimate, not a fact. Say how you made it: which period you took as "normal", how many days, which price, and what you ignored (customers who bought a different model instead, for example). An estimate with clear assumptions is useful; one without them isn't trusted.

## Example

The growth, decomposed, for January to June:

| | H1 2025 (₦m) | H1 2026 (₦m) | Growth |
| :-- | --: | --: | --: |
| All stores | 1,551.9 | 2,133.2 | +37.5% |
| Like for like (excluding Lekki) | 1,551.9 | 1,835.2 | +18.3% |
| Lekki (opened July 2025) | 0 | 298.0 | |

Prices rose 18% in January 2026. Like-for-like growth of 18.3% means the existing stores sold almost **exactly the same volume** as a year earlier. The real growth story is one new store and a price rise. That's not a disaster, but it's not what the board thinks either.

## Walkthrough

1. Reproduce the decomposition above in your tool, and check that Lekki plus like for like adds up to the total.
2. Build a table of each store's H1 2025 and H1 2026 net sales and transactions (sales transactions only, not returns). Which store stands out?
3. For that store, plot weekly transactions over the whole period. Find the month the change starts, then check with the business. (When you ask, Voltline's regional manager tells you a competitor opened next door in February 2026. In a real project, that conversation is part of the analysis.)
4. Calculate the attach rate for each store: among transactions that include a phone, the share that also include an accessory.
5. Calculate the return rate for each product. One stands far above the rest.
6. Use `stockouts.csv` to estimate lost sales for the Wuse 5kVA inverter stock-out (the task below).
7. For each finding, write one sentence: the number, and what it means.

## Practice

```answer
{
  "id": "cap-05-p1",
  "prompt": "What was **like-for-like** net sales growth, January to June 2026 against January to June 2025, excluding Lekki? One decimal place.",
  "answer": 18.3,
  "format": "percent",
  "dataset": "retail",
  "files": ["sales_raw"],
  "verify": "WITH c AS (SELECT * FROM (SELECT DISTINCT * FROM sales_raw WHERE product_code <> 'TEST') WHERE substr(txn_id, 1, 3) <> 'LKI') SELECT ROUND(100.0 * (1.0 * SUM(CASE WHEN txn_date LIKE '2026-%' OR txn_date LIKE '__/__/2026' THEN qty * unit_price - discount END) / SUM(CASE WHEN (txn_date BETWEEN '2025-01-01' AND '2025-06-30') OR (txn_date LIKE '__/0_/2025' AND substr(txn_date, 4, 2) BETWEEN '01' AND '06') THEN qty * unit_price - discount END) - 1), 1) FROM c",
  "hint": "Net sales for the seven stores open in both periods, H1 2026 ÷ H1 2025 − 1.",
  "required": true
}
```

```answer
{
  "id": "cap-05-p2",
  "prompt": "At **Port Harcourt**, by how much did the number of **sales transactions** (excluding returns) change between February–June 2025 and February–June 2026? One decimal place (it's negative).",
  "answer": -27.3,
  "format": "percent",
  "dataset": "retail",
  "files": ["sales_raw"],
  "verify": "WITH c AS (SELECT DISTINCT txn_id, substr(txn_date, 7, 4) || '-' || substr(txn_date, 4, 2) AS ym FROM sales_raw WHERE substr(txn_id, 1, 3) = 'PHC' AND qty > 0) SELECT ROUND(100.0 * (SUM(ym BETWEEN '2026-02' AND '2026-06') * 1.0 / SUM(ym BETWEEN '2025-02' AND '2025-06') - 1), 1) FROM c",
  "hint": "Count distinct txn_id where qty > 0, for store code PHC, in each period.",
  "explanation": "Down 27%, starting in February 2026, while every other existing store held steady. A competitor opening nearby is the obvious explanation, and the store manager can confirm it.",
  "required": true
}
```

```answer
{
  "id": "cap-05-p3",
  "prompt": "What is **Garki**'s accessory **attach rate**: the share of its phone transactions that also include an accessory, across the whole period? One decimal place.",
  "answer": 26.9,
  "format": "percent",
  "dataset": "retail",
  "files": ["sales_raw", "products"],
  "verify": "WITH c AS (SELECT DISTINCT s.txn_id, s.line_no, p.category FROM sales_raw s JOIN products p ON p.product_code = s.product_code WHERE substr(s.txn_id, 1, 3) = 'GRK' AND s.qty > 0), t AS (SELECT txn_id, MAX(category = 'Phones') AS phone, MAX(category = 'Accessories') AS acc FROM c GROUP BY txn_id) SELECT ROUND(100.0 * SUM(acc) / COUNT(*), 1) FROM t WHERE phone = 1",
  "hint": "Group lines by transaction; flag whether each has a phone and whether it has an accessory; then, among phone transactions, the share with an accessory.",
  "explanation": "26.9% at Garki against 54.2% at Ikeja. Accessories earn a 44% margin, so lifting Garki to even 40% would add real profit at almost no cost: a training opportunity.",
  "required": true
}
```

```answer
{
  "id": "cap-05-p4",
  "prompt": "What is the **return rate** (units returned ÷ units sold) of the **Zentro Z5 64GB** (VP-101)? One decimal place.",
  "answer": 9.5,
  "format": "percent",
  "dataset": "retail",
  "files": ["sales_raw"],
  "verify": "SELECT ROUND(100.0 * -SUM(CASE WHEN qty < 0 THEN qty END) / SUM(CASE WHEN qty > 0 THEN qty END), 1) FROM (SELECT DISTINCT * FROM sales_raw WHERE product_code = 'VP-101')",
  "hint": "Returned units are the negative quantities. Remove duplicates first.",
  "explanation": "9.5%, against under 2.5% for every other product. That's a quality problem to raise with the supplier, and each return costs a sale, staff time and often the margin.",
  "required": true
}
```

```task
{
  "id": "cap-05-t1",
  "prompt": "Estimate the **sales lost** while Wuse was out of stock of the **Inverter 5kVA** (VP-403), from 2 March to 23 April 2026. Give your **method**, your **assumptions** and the **estimate** in naira, in a short paragraph or a few bullets.",
  "minutes": 10,
  "rows": 8,
  "placeholder": "Method: ...\nAssumptions: ...\nEstimate: ₦...",
  "rules": [
    { "label": "Gives the number of days out of stock", "pattern": "\\b5[23]\\b\\s*days" },
    { "label": "Uses a normal sales rate (per day, week or month) from a period before the stock-out", "pattern": "per (day|week|month)|a (day|week|month)|daily|weekly|monthly" },
    { "label": "States at least one assumption", "pattern": "assum" },
    { "label": "Gives an estimate in naira", "pattern": "₦\\s*\\d|\\bN\\s*\\d|naira" },
    { "label": "Mentions price or margin", "pattern": "price|margin|profit" },
    { "label": "Enough detail: at least 50 words", "minWords": 50 }
  ],
  "sample": "- **Method**: Wuse sold 8 of the 5kVA inverter in the 60 days from 1 January to 1 March 2026, about 0.13 a day. The stock-out lasted 53 days (2 March to 23 April), so about 7 sales were lost.\n- **Estimate**: 7 × ₦932,000 (the 2026 price) ≈ **₦6.5m** of net sales, or about **₦1.1m** of gross profit at the 17% margin.\n- **Assumptions**: January and February were a normal rate (the same months of 2025 were similar); no customer bought a 3.5kVA instead (that one was also out for part of the period, so substitution was limited); lost customers didn't come back later.",
  "note": "Your numbers may differ a little depending on the period you call normal. That's fine, as long as you say what you did. Presenting a range (say ₦5m–₦8m) is often more honest than one precise figure.",
  "required": true
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "Total growth is 37.5%, like-for-like growth is 18.3%, and prices rose 18%. What's the best summary?",
    "options": ["Volume grew strongly", "Existing stores sold about the same volume; the growth came from the price rise and the new Lekki store", "Prices fell", "Lekki is failing"],
    "answer": 1,
    "explanation": "Decompose the headline before celebrating it."
  },
  {
    "prompt": "A store's transactions drop 27% from one particular month. What's the most useful next step?",
    "options": ["Assume the manager is underperforming", "Find the exact date of the change and ask what happened then: a competitor, roadworks, a staff change", "Ignore it", "Average it with other stores"],
    "answer": 1,
    "explanation": "A step change usually has a specific cause. Find the date, then ask."
  },
  {
    "prompt": "Why should a lost-sales estimate state its assumptions?",
    "options": ["To make it longer", "Because it's an estimate: readers need to know what it depends on to judge and trust it", "Assumptions are required by law", "It doesn't need to"],
    "answer": 1,
    "explanation": "An estimate with clear assumptions is useful; one without them gets ignored."
  }
]
```
