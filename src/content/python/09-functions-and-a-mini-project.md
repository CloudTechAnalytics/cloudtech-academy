---
title: Functions and a Mini Project
minutes: 35
summary: Write your own functions: parameters and arguments, return versus print, default and keyword arguments, returning several values, scope and docstrings. Then put everything together in a budget tracker for your portfolio.
---

## What a function is

You've been using functions since the first lesson: `print()`, `len()`, `round()`, `sum()`. A **function** is a named block of code that does one job. You can also write your own, so that a calculation you need often is written **once** and **reused**:

- Less repetition: fix a bug in one place, not ten.
- Clearer code: `vat(price)` says what it does.
- Easier testing: check the function on its own.

## Defining and calling a function

![A function area(width, height) with a docstring and a return, called with 4 and 3; print versus return; and local scope and default values](/images/courses/python/functions.svg "Define once, call many times: arguments in, a returned value out.")

```python
def greet():
    print("Welcome to CloudTech Academy")

greet()
greet()
```

```text
Welcome to CloudTech Academy
Welcome to CloudTech Academy
```

- `def` starts the **definition**, followed by the function's name, brackets and a colon.
- The indented block is the **body**: the code that runs when the function is called.
- Defining a function doesn't run it. **Calling** it, `greet()`, does, as many times as you like.

Name functions like variables (lowercase with underscores), ideally with a verb: `calculate_vat`, `print_report`.

## Parameters and arguments

A function becomes useful when you can give it inputs. **Parameters** are the names in the definition; **arguments** are the values you pass when you call it:

```python
def greet(name):
    print(f"Welcome, {name}!")

greet("Adaeze")
greet("Musa")
```

```text
Welcome, Adaeze!
Welcome, Musa!
```

With several parameters, arguments are matched in order:

```python
def describe(name, level):
    print(f"{name} is in {level} level")

describe("Tobi", 200)
```

```text
Tobi is in 200 level
```

## return: sending a result back

`print` shows a value on screen. `return` **sends it back** to the code that called the function, so it can be stored and used:

```python
def vat(price):
    return price * 7.5 / 100

tax = vat(40000)
print(tax)
print(40000 + vat(40000))
```

```text
3000.0
43000.0
```

`return` also **ends** the function: any lines after it in the same block don't run. A grading function can return as soon as it knows the answer:

```python
def grade(score):
    if score >= 70:
        return "A"
    elif score >= 60:
        return "B"
    elif score >= 50:
        return "C"
    return "F"

print(grade(74))
print(grade(48))
```

```text
A
F
```

### print or return?

| | `print` inside the function | `return` from the function |
| :-- | :-- | :-- |
| Shows the value | yes | no (unless you print it) |
| Can you use the value afterwards? | no | yes: store it, add it, compare it |
| Good for | messages to the user | calculations |

Most functions that **calculate** should `return`. A function with no `return` gives back `None`.

## Default values

Give a parameter a **default** with `=` in the definition. If the caller leaves it out, the default is used:

```python
def add_vat(price, rate=7.5):
    return price + price * rate / 100

print(add_vat(40000))
print(add_vat(40000, 10))
```

```text
43000.0
44000.0
```

Parameters with defaults must come **after** those without.

## Keyword arguments

You can name arguments when you call a function, so their order doesn't matter and the call explains itself:

```python
def loan_repayment(amount, months, rate):
    total = amount + amount * rate / 100
    return total / months

print(loan_repayment(amount=120000, months=6, rate=10))
print(loan_repayment(months=6, rate=10, amount=120000))
```

```text
22000.0
22000.0
```

## Returning several values

Return several values separated by commas, and unpack them into several variables:

```python
def summary(scores):
    return min(scores), max(scores), sum(scores) / len(scores)

lowest, highest, average = summary([67, 81, 54, 72, 45])
print(lowest, highest, round(average, 1))
```

```text
45 81 63.8
```

(Python packs the values into a tuple and unpacks them for you.)

## Scope: variables inside functions

Variables created **inside** a function exist only inside it. They're **local**:

```python
def calculate():
    result = 100 * 2
    return result

print(calculate())
```

```text
200
```

Outside, `result` doesn't exist: `print(result)` would give a NameError. That's a good thing: functions don't accidentally overwrite each other's variables. Pass values **in** as arguments and get them **out** with `return`.

## Docstrings

A **docstring** is a description in triple quotes on the first line of the body. It tells other people (and you, later) what the function does:

```python
def naira(amount):
    """Format an amount as naira with thousands separators, e.g. ₦12,500."""
    return f"₦{amount:,.0f}"

print(naira(12500))
print(naira.__doc__)
```

```text
₦12,500
Format an amount as naira with thousands separators, e.g. ₦12,500.
```

In Colab, typing `naira(` also shows the docstring in a pop-up, and `help(naira)` prints it with the function's details.

## Functions that use functions

Functions can call other functions, so you build bigger jobs out of small, tested pieces:

```python
def total_with_vat(prices):
    return sum(add_vat(p) for p in prices)

print(naira(total_with_vat([40000, 8500, 1500])))
```

```text
₦53,750
```

## Mini project: a monthly budget tracker

Put everything together: variables, a dictionary, functions, a loop, maths, f-strings and decisions. Copy this into Colab and run it:

```python
budget = 60000

spending = {
    "Food": 28000,
    "Transport": 12500,
    "Data": 6000,
    "Books": 4500,
    "Other": 5000,
}

def naira(amount):
    return f"₦{amount:,.0f}"

total = sum(spending.values())
left = budget - total

print("Monthly spending")
for item, amount in spending.items():
    share = amount / total * 100
    print(f"{item:<10} {naira(amount):>10}  {share:4.1f}%")

print("-" * 30)
print(f"{'Total':<10} {naira(total):>10}")

if left >= 0:
    print(f"You have {naira(left)} left.")
else:
    print(f"You are over budget by {naira(-left)}.")
```

```text
Monthly spending
Food          ₦28,000  50.0%
Transport     ₦12,500  22.3%
Data           ₦6,000  10.7%
Books          ₦4,500   8.0%
Other          ₦5,000   8.9%
------------------------------
Total         ₦56,000
You have ₦4,000 left.
```

Read it line by line. You've met every piece in this course: the `spending` dictionary, the `naira` function, the loop over `.items()`, the percentage maths, the aligned f-strings and the final `if`.

## When it goes wrong

```python norun
def total_cost(price, quantity):
    price * quantity

print(total_cost(500, 4))
```

```text nocheck
None
```

**Forgetting `return`.** The function calculated the value, then threw it away. Add `return price * quantity`.

```python norun
def greet(name):
    print(f"Hello {name}")

greet()
```

```text nocheck
TypeError: greet() missing 1 required positional argument: 'name'
```

**Missing an argument.** The function needs a name; give it one, or a default (`name="friend"`).

```python norun
greet("Ada")

def greet(name):
    print(f"Hello {name}")
```

```text nocheck
NameError: name 'greet' is not defined
```

**Calling before defining.** Python reads top to bottom, so define functions before you call them (in Colab, run the cell with the `def` first).

## Show it off

Save your notebook, then in Colab choose **File → Save a copy in GitHub** to put it in a repository (see the Git & GitHub course). It's a small but real project for your portfolio.

## Summary

| You want to... | Write |
| :-- | :-- |
| define a function | `def name(params):` + indented body |
| call it | `name(args)` |
| send back a result | `return value` |
| an optional input | `def f(x, rate=7.5):` |
| name the inputs when calling | `f(amount=100, months=6)` |
| return several values | `return a, b` then `x, y = f()` |
| describe it | `"""Docstring."""` on the first line |

## Try it

Run the budget tracker as it is in the lesson, then answer these about **its** numbers.

```answer
{
  "id": "py-m03-a1",
  "prompt": "How much money is **left** from the ₦60,000 budget?",
  "answer": 4000,
  "format": "naira",
  "pyVerify": "budget - sum(spending.values())",
  "required": true
}
```

```answer
{
  "id": "py-m03-a2",
  "prompt": "What **percentage** of total spending goes on **Food**? One decimal place.",
  "answer": 50,
  "format": "percent",
  "pyVerify": "round(spending['Food'] / sum(spending.values()) * 100, 1)",
  "required": true
}
```

```task
{
  "id": "py-m03-t1",
  "prompt": "Extend the tracker with your own month's numbers. Add a function `biggest(spending)` that **returns** the item you spend most on, print it, and print a **warning** for any item over 40% of the total. Run it, then paste your code.",
  "minutes": 12,
  "rows": 16,
  "placeholder": "budget = ...\nspending = {...}\n\ndef biggest(spending):\n    ...",
  "rules": [
    { "label": "A spending dictionary with at least four items", "pattern": "[\"'][^\"'\\n]+[\"']\\s*:\\s*\\d", "min": 4 },
    { "label": "A function called biggest", "pattern": "^\\s*def\\s+biggest\\s*\\(" },
    { "label": "It returns a value", "pattern": "^\\s+return\\s+\\S" },
    { "label": "It finds the largest item (max with key=, or a loop)", "pattern": "max\\([^)]*key\\s*=|for\\s+\\w+(\\s*,\\s*\\w+)?\\s+in\\s+\\w+" },
    { "label": "Loops through items with .items()", "pattern": "\\.items\\(\\)" },
    { "label": "Checks for more than 40%", "pattern": "(>|>=)\\s*(40|0\\.4)\\b" },
    { "label": "Prints a warning", "pattern": "print\\([^\\n]*(warn|over|high|careful|too much|more than|above)" }
  ],
  "sample": "budget = 75000\nspending = {\n    \"Food\": 31000,\n    \"Transport\": 15000,\n    \"Data\": 7000,\n    \"Books\": 6000,\n    \"Other\": 9000,\n}\n\ndef biggest(spending):\n    return max(spending, key=spending.get)\n\ntotal = sum(spending.values())\nprint(f\"You spend most on {biggest(spending)}.\")\nfor item, amount in spending.items():\n    share = amount / total * 100\n    if share > 40:\n        print(f\"Warning: {item} is {share:.0f}% of your spending.\")",
  "required": true
}
```
