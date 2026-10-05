---
title: Lists, dictionaries, loops and functions
minutes: 30
summary: The core Python you need before pandas: store many values in lists and dictionaries, repeat work with loops, decide with if, and package logic in functions.
---

## The problem

Bisi has a week of daily sales from one Kolanut depot, and a rule from finance: lines worth ₦500,000 or more need a second signature. She could check each number by eye, but next week there will be another list, and the week after that.

Before you can use pandas well, you need the four ideas it's built on: **lists** (many values in order), **dictionaries** (values looked up by name), **loops** (do something for each value) and **functions** (a named, reusable calculation). pandas does most of the looping for you, but when something goes wrong, these are the ideas you'll need to understand what happened.

## The concept

### Lists: values in order

```python
daily_sales = [412500, 389000, 455250, 501300, 298700, 610400, 352900]
sum(daily_sales)
```

```text
3020050
```

- `len(daily_sales)` is how many values there are (7).
- `sum(daily_sales)`, `min(...)`, `max(...)` work on any list of numbers.
- Positions start at **0**: `daily_sales[0]` is the first value, `daily_sales[-1]` the last.
- `daily_sales[1:3]` is a **slice**: positions 1 and 2 (the end position isn't included).
- `daily_sales.append(480000)` adds a value to the end.

### Dictionaries: values by name

A dictionary maps **keys** to **values**. It's how you'd store one row of data, or a lookup table:

```python
category_of = {1: "Beverages", 5: "Snacks", 9: "Household", 13: "Personal care"}
category_of[9]
```

```text
'Household'
```

That returns `'Household'`. Add or change an entry with `category_of[2] = "Beverages"`. Ask for a key that isn't there and you get a `KeyError`; `category_of.get(99, "Unknown")` returns a default instead.

### Loops: do it for each one

```python
for amount in daily_sales:
    print(amount)
```

```text
412500
389000
455250
501300
298700
610400
352900
```

The indented lines run once for each value. Indentation (4 spaces, which Colab adds for you) is how Python knows which lines belong to the loop.

### Decisions: if, elif, else

```python
amount = 610400
if amount >= 500000:
    print("Needs a second signature")
elif amount >= 400000:
    print("Check the customer's credit limit")
else:
    print("OK")
```

```text
Needs a second signature
```

Comparisons give `True` or `False`: `==` (equal), `!=` (not equal), `<`, `<=`, `>`, `>=`. Combine them with `and`, `or` and `not`.

### Functions: name a calculation once, use it everywhere

```python
def line_revenue(quantity, unit_price, discount_pct=0):
    """Revenue of one order line after its discount."""
    return quantity * unit_price * (1 - discount_pct / 100)
line_revenue(14, 18600)
```

```text
260400.0
```

`def` starts a function, the names in brackets are its **parameters**, and `return` sends the answer back. `discount_pct=0` is a **default**: leave it out and it's 0. Now `line_revenue(14, 18600, 5)` gives `247380.0` and `line_revenue(10, 9900)` gives `99000.0`.

## Example

A week of depot sales, checked against finance's rule, with a summary at the end:

```python
days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
daily_sales = [412500, 389000, 455250, 501300, 298700, 610400, 352900]

flagged = []
for day, amount in zip(days, daily_sales):
    if amount >= 500000:
        flagged.append(day)

total = sum(daily_sales)
average = total / len(daily_sales)
best_day = days[daily_sales.index(max(daily_sales))]

print(f"Week total: ₦{total:,}")
print(f"Daily average: ₦{average:,.0f}")
print(f"Best day: {best_day}")
print(f"Need a second signature: {flagged}")
```

```text
Week total: ₦3,020,050
Daily average: ₦431,436
Best day: Sat
Need a second signature: ['Thu', 'Sat']
```

## Walkthrough

1. `zip(days, daily_sales)` pairs the two lists up: `("Mon", 412500)`, `("Tue", 389000)`… so each pass of the loop gets a day and its amount.
2. `flagged = []` starts an empty list; `append` adds each day that meets the rule.
3. `daily_sales.index(max(daily_sales))` finds the **position** of the largest value (5), and `days[5]` turns that position into a day name.
4. Now build a dictionary of totals by category from a few order lines, the way pandas' `groupby` will later:

```python
lines = [("Beverages", 247380), ("Snacks", 99000), ("Beverages", 92400), ("Household", 279600), ("Snacks", 56760)]

totals = {}
for category, revenue in lines:
    totals[category] = totals.get(category, 0) + revenue

totals
```

5. Read the result: `{'Beverages': 339780, 'Snacks': 155760, 'Household': 279600}`. `totals.get(category, 0)` returns the running total so far, or 0 the first time a category appears.
6. Add `line_revenue` from the Concept to your notebook and call it with and without a discount.
7. Deliberately break the indentation of one line inside a loop and run it. Read the `IndentationError`, then fix it. Learning to read error messages is half of programming.

> [!TIP]
> When code doesn't do what you expect, `print()` the values inside the loop. Seeing what the loop actually sees beats staring at the code.

## Practice

Use the week of sales in the Example, in your notebook.

```answer
{
  "id": "pyan-02-p1",
  "prompt": "What is the total of the days whose sales were **below ₦400,000**? Write a loop with an `if` inside it.",
  "answer": 1040600,
  "format": "naira",
  "hint": "Start total_low = 0, then in the loop: if amount < 400000: total_low = total_low + amount",
  "explanation": "Tuesday (₦389,000), Friday (₦298,700) and Sunday (₦352,900).",
  "pyVerify": "sum(a for a in daily_sales if a < 400000)",
  "required": true
}
```

```answer
{
  "id": "pyan-02-p2",
  "prompt": "Write a function `discount_cost(quantity, unit_price, discount_pct)` that returns the money a discount took off a line. What does `discount_cost(20, 15600, 10)` return?",
  "answer": 31200,
  "format": "naira",
  "hint": "The cost is quantity * unit_price * discount_pct / 100.",
  "pyVerify": "20 * 15600 * 10 / 100",
  "required": true
}
```

```answer
{
  "id": "pyan-02-p3",
  "prompt": "In the category totals from the Walkthrough, which category has the **highest** total? Use `max(totals, key=totals.get)`.",
  "answer": "Beverages",
  "format": "text",
  "hint": "max() on a dictionary looks at its keys; key=totals.get tells it to compare them by their values.",
  "pyVerify": "max(totals, key=totals.get)",
  "required": true
}
```

## Challenge

```answer
{
  "id": "pyan-02-c1",
  "prompt": "Using a loop and a counter, on how many days were sales **above the week's average**?",
  "answer": 3,
  "format": "number",
  "hint": "Work out the average first, then count the amounts greater than it.",
  "explanation": "Wednesday, Thursday and Saturday. Monday's ₦412,500 looks high but is just under the ₦431,436 average: exactly the kind of thing that's easy to misjudge by eye.",
  "pyVerify": "sum(1 for a in daily_sales if a > sum(daily_sales) / len(daily_sales))",
  "required": false
}
```

## Check your understanding

```quiz
[
  {
    "prompt": "sales = [120, 340, 560]. What is sales[-1]?",
    "options": ["120", "340", "560", "An error"],
    "answer": 2,
    "explanation": "Negative positions count from the end: -1 is the last value."
  },
  {
    "prompt": "prices = {\"Malt\": 14800}. What does prices.get(\"Soap\", 0) return?",
    "options": ["An error", "0", "14800", "None"],
    "answer": 1,
    "explanation": "get returns the default when the key isn't in the dictionary, instead of raising a KeyError."
  },
  {
    "prompt": "A function calculates a total but your variable is None after calling it. What's the most likely cause?",
    "options": ["The function printed the total instead of returning it", "The list was too long", "Functions can't do maths", "You used a dictionary"],
    "answer": 0,
    "explanation": "print shows a value; return hands it back to the caller. A function with no return gives None."
  },
  {
    "prompt": "How does Python know which lines belong inside a for loop?",
    "options": ["They end with a semicolon", "They're indented under the for line", "They're in curly brackets", "They're in capital letters"],
    "answer": 1,
    "explanation": "Indentation defines blocks in Python."
  }
]
```
