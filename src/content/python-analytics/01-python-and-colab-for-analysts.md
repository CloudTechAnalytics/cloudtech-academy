---
title: Python and Colab for analysts
minutes: 25
summary: Why analysts use Python, how a Colab notebook works, and the building blocks you'll use in every analysis: values, variables, types, maths and f-strings.
---

## The problem

Kolanut Distribution's analyst, Bisi, rebuilds the same sales report every Monday. She downloads three CSV files, pastes them into Excel, fixes the dates, adds a revenue column, rebuilds two pivot tables and copies the numbers into an email. It takes her most of the morning, and twice this year a pasted range was one row short and the totals were wrong.

**Python** solves both problems. You write the steps once, as code, and run them again every Monday in seconds. The code is also a record of exactly what you did, so anyone can check it, and a mistake fixed once stays fixed.

This course teaches the Python an analyst actually uses: enough of the language to read and write it confidently, then **pandas**, the library for tables of data, from loading files to a finished analysis with charts.

## The concept

**Where you'll write Python: Google Colab**

Colab is a free notebook that runs in your browser on Google's computers. Nothing to install, and pandas and the charting libraries are already there. Open **colab.research.google.com**, sign in with a Google account and choose **New notebook**.

A **notebook** is a list of **cells**:

- **Code cells** hold Python. Click inside one and press **Shift + Enter** to run it and move to the next.
- **Text cells** hold notes, written in Markdown. Use them to explain what you did and what you found: an analysis without explanation isn't finished.

Cells share memory: a variable created in one cell is available in every cell you run afterwards. If you restart the notebook (**Runtime → Restart session**) that memory is wiped, and you run the cells again from the top. **Runtime → Run all** does that in one go.

**Values and variables**

A **variable** is a name for a value. You create it with `=`:

```python
quantity = 14
unit_price = 18600
customer = "Ada Superstore"
```

Names use lowercase letters, numbers and underscores, and can't start with a number. Choose names that say what the value is: `unit_price`, not `x`.

**The four types you'll meet most**

| Type | Example | What it's for |
| :-- | :-- | :-- |
| `int` (whole number) | `14` | Counts, IDs, quantities |
| `float` (decimal number) | `0.05` | Prices with kobo, rates, averages |
| `str` (text, a "string") | `"Lagos"` | Names, categories, codes |
| `bool` (true/false) | `True` | Results of comparisons |

`type(value)` tells you which one you have. Types matter because they decide what you can do: `"14" * 2` gives `"1414"` (text repeated), while `14 * 2` gives `28`. Most "my numbers won't add up" problems in data work are really type problems.

**Maths**

`+ - * /` work as you'd expect. `**` is "to the power of", `//` divides and drops the remainder, `%` gives the remainder, and `round(x, 2)` rounds to 2 decimal places. Brackets control the order, exactly as in a spreadsheet formula.

**f-strings: putting numbers into sentences**

Put an `f` before the quotes and anything inside `{ }` is worked out and inserted. After a colon you can say how to format it: `:,` adds thousands separators, `:.1f` shows one decimal place, `:.1%` shows a percentage.

```python
revenue = 247380.0
print(f"Revenue: ₦{revenue:,.0f}")
print(f"Discount rate: {0.05:.0%}")
```

That prints `Revenue: ₦247,380` and `Discount rate: 5%`.

## Example

Take an order line like the ones in Kolanut's data: 14 cartons of orange juice at ₦18,600 a carton with a 5% discount. Work out its revenue, and the money the discount cost:

```python
quantity = 14
unit_price = 18600
discount_pct = 5

gross = quantity * unit_price
revenue = gross * (1 - discount_pct / 100)
discount_cost = gross - revenue

print(f"Gross value:   ₦{gross:,.0f}")
print(f"Discount cost: ₦{discount_cost:,.0f}")
print(f"Revenue:       ₦{revenue:,.0f}")
```

```text
Gross value:   ₦260,400
Discount cost: ₦13,020
Revenue:       ₦247,380
```

The same formula, `quantity × unit_price × (1 − discount_pct ÷ 100)`, is how revenue is worked out for every order line in this course. In lesson 5 you'll apply it to all 4,266 lines at once.

> [!NOTE]
> `discount_pct / 100` gives `0.05`, a float. Dividing with `/` always gives a float in Python, even `10 / 2` (which is `5.0`). That's why revenue prints as `247380.0` if you don't format it.

## Walkthrough

1. Open a new Colab notebook and rename it `Python for analysts - lesson 1` (click the name at the top).
2. Add a text cell at the top with a heading: `# Lesson 1: Python basics`. Text cells use Markdown, so `#` makes a heading.
3. In a code cell, create the variables `quantity`, `unit_price` and `discount_pct` from the Example, and run it with Shift + Enter.
4. In the next cell, calculate `gross`, `revenue` and `discount_cost`, and print them with f-strings.
5. Run `type(quantity)`, `type(revenue)` and `type("Lagos")` in separate cells and read the results.
6. Try the type trap: run `"14" * 2`, then `int("14") * 2`. `int()` converts text to a whole number; `float()` and `str()` convert to the other types.
7. Choose **Runtime → Restart session**, then run just the last cell. You'll get a `NameError`: after a restart, the variables are gone until you run their cells again. Use **Runtime → Run all**.

## Practice

Do these in your notebook, then type the result here.

```answer
{
  "id": "pyan-01-p1",
  "prompt": "A supermarket orders **25** cartons of body lotion at **₦24,600** each with a **10%** discount. What is the **revenue** of that order line, in naira?",
  "answer": 553500,
  "format": "naira",
  "hint": "revenue = 25 * 24600 * (1 - 10 / 100)",
  "explanation": "Gross value is ₦615,000; the 10% discount costs ₦61,500, leaving ₦553,500.",
  "pyVerify": "25 * 24600 * (1 - 10 / 100)",
  "required": true
}
```

```answer
{
  "id": "pyan-01-p2",
  "prompt": "Kolanut adds **7.5% VAT** on top of revenue when it invoices. What is the VAT on that same order line? Round to the nearest naira.",
  "answer": 41513,
  "format": "naira",
  "hint": "vat = revenue * 7.5 / 100, then round(vat).",
  "explanation": "₦553,500 × 0.075 = ₦41,512.50, which rounds to ₦41,512 or ₦41,513 depending on the rounding rule. Either is accepted. Python's round() gives 41512 because it rounds .5 to the nearest even number ('banker's rounding'), which is worth knowing when a report must match an accounting system to the naira.",
  "tolerance": 1,
  "pyVerify": "round(25 * 24600 * (1 - 10 / 100) * 7.5 / 100)",
  "required": true
}
```

```answer
{
  "id": "pyan-01-p3",
  "prompt": "What does `print(f\"{1234567.891:,.1f}\")` print? Type it exactly.",
  "answer": "1,234,567.9",
  "format": "text",
  "hint": "`,` adds thousands separators and `.1f` keeps one decimal place, rounding the rest.",
  "pyVerify": "f\"{1234567.891:,.1f}\"",
  "required": true
}
```

## Challenge

```answer
{
  "id": "pyan-01-c1",
  "prompt": "What is the result of `7 // 2 + 7 % 2 * 10`? Work it out first, then check in Colab.",
  "answer": 13,
  "format": "number",
  "hint": "`//`, `%` and `*` are worked out before `+`, left to right: 7 // 2 is 3, 7 % 2 is 1.",
  "explanation": "3 + (1 × 10) = 13. When in doubt, add brackets: they make your intention clear to the next reader as well as to Python.",
  "pyVerify": "7 // 2 + 7 % 2 * 10",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "You restart a Colab session and run only the last cell, which uses a variable called revenue. What happens?",
    "options": ["It works, because the notebook remembers revenue", "A NameError: revenue no longer exists until its cell is run again", "Colab deletes the cell", "revenue becomes 0"],
    "answer": 1,
    "explanation": "Restarting wipes the notebook's memory. Run all the cells from the top, or use Runtime → Run all."
  },
  {
    "prompt": "What is \"20\" + \"5\" in Python?",
    "options": ["25", "\"205\"", "An error", "\"25\""],
    "answer": 1,
    "explanation": "Both values are text, so + joins them. Convert with int() or float() first to add them as numbers."
  },
  {
    "prompt": "Which f-string shows 0.184 as 18.4%?",
    "options": ["f\"{0.184:.1%}\"", "f\"{0.184}%\"", "f\"{0.184:,}\"", "f\"{0.184 * 100}\""],
    "answer": 0,
    "explanation": "The % format multiplies by 100 and adds the % sign; .1 keeps one decimal place."
  },
  {
    "prompt": "Why is writing your analysis as code better than repeating the steps by hand each week?",
    "options": ["Code always runs faster than Excel", "The steps are recorded, can be checked, and run the same way every time", "Python doesn't need data", "Managers prefer code"],
    "answer": 1,
    "explanation": "Repeatability and a written record are the main reasons analysts use code."
  }
]
```
