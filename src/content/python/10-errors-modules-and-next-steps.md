---
title: Errors, Modules and Next Steps
minutes: 30
summary: Handle errors gracefully with try and except, raise your own, use Python's built-in modules (random, datetime, statistics), install more with pip, and plan what to learn next.
---

## Reading a traceback

When Python hits an error it can't handle, it stops and prints a **traceback**: the trail of lines it was running. Read it from the **bottom**:

```python norun
def average(scores):
    return sum(scores) / len(scores)

print(average([]))
```

```text nocheck
Traceback (most recent call last):
  File "<ipython-input-1>", line 4, in <module>
    print(average([]))
  File "<ipython-input-1>", line 2, in average
    return sum(scores) / len(scores)
ZeroDivisionError: division by zero
```

1. The **last line** says what went wrong: `ZeroDivisionError: division by zero`.
2. The lines above show **where**: line 2, inside `average`, called from line 4.
3. So: `average` was given an empty list, and `len([])` is 0.

The errors you've met in this course:

| Error | Usually means |
| :-- | :-- |
| `SyntaxError` | Python can't read the line: a missing colon, quote or bracket |
| `IndentationError` | a block isn't indented, or indented inconsistently |
| `NameError` | a misspelt name, or a cell that hasn't been run |
| `TypeError` | the wrong type: text plus a number, or a missing argument |
| `ValueError` | the right type but an impossible value: `int("forty")` |
| `IndexError` | a list or string position that doesn't exist |
| `KeyError` | a dictionary key that doesn't exist |
| `ZeroDivisionError` | dividing by zero |

## Handling errors with try and except

Some errors aren't bugs in your code: they come from the outside world. A user types "forty" instead of 40; a file is missing. `try` and `except` let your program **handle** the problem instead of crashing:

![A try block dividing by people: with 4 people the except block is skipped, with 0 it catches a ZeroDivisionError and the program carries on; the try, except, else and finally parts; and how to read a KeyError traceback from the bottom](/images/courses/python/try-except.svg "try runs the risky code; except catches a named error; the program carries on.")

```python
text = "forty"
try:
    age = int(text)
    print(f"Next year you'll be {age + 1}")
except ValueError:
    print(f"'{text}' isn't a number. Please type digits, like 40.")
```

```text
'forty' isn't a number. Please type digits, like 40.
```

1. Python runs the `try` block.
2. If an error happens, it **jumps** to the matching `except` block instead of stopping.
3. If no error happens, the `except` block is skipped.

Try it with a valid value:

```python
text = "40"
try:
    age = int(text)
    print(f"Next year you'll be {age + 1}")
except ValueError:
    print(f"'{text}' isn't a number.")
```

```text
Next year you'll be 41
```

### Catch specific errors

Name the error you expect. You can have several `except` blocks for different errors:

```python
def safe_average(scores):
    try:
        return sum(scores) / len(scores)
    except ZeroDivisionError:
        return 0
    except TypeError:
        print("The list must contain numbers only.")
        return None

print(safe_average([67, 81, 54]))
print(safe_average([]))
print(safe_average([67, "eighty"]))
```

```text
67.33333333333333
0
The list must contain numbers only.
None
```

> [!WARNING]
> Avoid a bare `except:` that catches **everything**. It also hides real bugs, such as a typo in a variable name, and your program carries on with wrong results. Catch the specific errors you expect.

### else and finally

Two optional extras:

- `else` runs only if **no** error happened.
- `finally` runs **always**, error or not, which is useful for clean-up.

```python
try:
    amount = int("2500")
except ValueError:
    print("Not a number")
else:
    print(f"Recorded ₦{amount:,}")
finally:
    print("Check complete")
```

```text
Recorded ₦2,500
Check complete
```

### A loop that keeps asking

Combined with a loop, `try` lets a program keep asking until it gets a valid answer. (This uses `input`, so run it in Colab rather than reading it here.)

```python norun
while True:
    try:
        age = int(input("How old are you? "))
        break
    except ValueError:
        print("Please type a whole number.")
print(f"Thanks. You're {age}.")
```

`while True` loops forever, and `break` leaves the loop once `int()` succeeds.

## Raising your own errors

Your functions can **raise** an error when they're given something that makes no sense, rather than quietly returning a wrong answer:

```python
def apply_discount(price, percent):
    if not 0 <= percent <= 100:
        raise ValueError(f"Discount must be between 0 and 100, not {percent}")
    return price * (1 - percent / 100)

print(apply_discount(40000, 15))
try:
    apply_discount(40000, 150)
except ValueError as error:
    print("Error:", error)
```

```text
34000.0
Error: Discount must be between 0 and 100, not 150
```

`except ValueError as error` gives you the error object, so you can print its message.

## Modules: using code others have written

A **module** is a file of ready-made functions. Python comes with hundreds (the **standard library**). Bring one in with `import`, then use its functions with a dot:

```python
import statistics

scores = [67, 81, 54, 72, 45]
print(statistics.mean(scores))
print(statistics.median(scores))
```

```text
63.8
67
```

Ways to import:

| Write | Then use |
| :-- | :-- |
| `import statistics` | `statistics.mean(x)` |
| `import statistics as st` | `st.mean(x)` (a shorter name) |
| `from statistics import mean` | `mean(x)` (just that function) |

### random

```python
import random

random.seed(1)   # makes the "random" results repeatable, for this lesson
names = ["Adaeze", "Musa", "Tobi", "Chidi"]
print(random.choice(names))
print(random.randint(1, 6))
```

```text
Musa
5
```

`random.choice` picks an item; `random.randint(1, 6)` rolls a die. Without `random.seed`, you'd get different results each run, which is the point. `random.shuffle(names)` mixes a list up.

### datetime

```python
from datetime import date

start = date(2026, 9, 15)
exam = date(2026, 12, 7)
print((exam - start).days, "days until the exam")
print(exam.strftime("%A %d %B %Y"))
```

```text
83 days until the exam
Monday 07 December 2026
```

Subtracting two dates gives the time between them; `strftime` formats a date for people. `date.today()` gives today's date.

## Installing more: pip

Beyond the standard library, thousands of free packages are published for Python. You install them with **pip**. In Colab, run it in a cell with `!` in front:

```bash norun
!pip install requests
```

The most important ones for data work, **pandas** (tables), **matplotlib** (charts) and **numpy** (numbers), are already installed in Colab:

```python norun
import pandas as pd
data = pd.DataFrame({"name": ["Adaeze", "Musa"], "score": [67, 81]})
print(data)
```

You'll use them in the next course.

## What to learn next

You now know the core of Python: values and types, text and numbers, decisions, lists, loops, dictionaries, functions, errors and modules. That's the same foundation every Python programmer builds on. Where to go from here:

| If you want to... | Take |
| :-- | :-- |
| analyse real data with tables and charts | **Python for Data** (short) or **Python for Data Analytics** |
| build programs properly, with tests | **Software Engineering with Python** |
| work with AI models | **Generative AI Engineering** |
| keep your code safe and shared | **Git and GitHub** |

> [!TIP]
> The fastest way to get better is to build small things you actually want: a budget tracker for your real spending, a quiz for your course, a script that renames your photos. When you get stuck, read the error's last line, search it, and try again.

## Summary

| You want to... | Write |
| :-- | :-- |
| handle an expected error | `try: ... except ValueError: ...` |
| run code only if it worked | `else:` after `except` |
| run clean-up code always | `finally:` |
| stop on bad input | `raise ValueError("message")` |
| use a module | `import statistics` then `statistics.mean(x)` |
| pick at random | `random.choice(items)` |
| days between dates | `(date2 - date1).days` |
| install a package in Colab | `!pip install name` |

## Try it

```answer
{
  "id": "py-m10-a1",
  "prompt": "What is the **median** of `[67, 81, 54, 72, 45]`? Use `statistics.median`.",
  "answer": 67,
  "format": "number",
  "pyVerify": "statistics.median([67, 81, 54, 72, 45])",
  "required": true
}
```

```answer
{
  "id": "py-m10-a2",
  "prompt": "How many **days** are there from `date(2026, 9, 15)` to `date(2026, 12, 7)`?",
  "answer": 83,
  "format": "number",
  "pyVerify": "(date(2026, 12, 7) - date(2026, 9, 15)).days",
  "required": true
}
```

```answer
{
  "id": "py-m10-a3",
  "prompt": "Which error does `int(\"twelve\")` raise? Type its name.",
  "answer": "ValueError",
  "format": "text",
  "accept": ["valueerror"],
  "pyVerify": "'ValueError'",
  "required": true
}
```

```task
{
  "id": "py-m10-t1",
  "prompt": "Write a function `parse_amount(text)` that turns text like `\"12,500\"` or `\" 4500 \"` into a number: **strip** spaces, **remove commas**, and convert with `int()` inside a **try**. If it can't be converted, **catch the ValueError** and return `None`. Test it with at least three values, including one that fails. Paste your code.",
  "minutes": 10,
  "rows": 14,
  "placeholder": "def parse_amount(text):\n    try:\n        ...",
  "rules": [
    { "label": "A function called parse_amount", "pattern": "^\\s*def\\s+parse_amount\\s*\\(" },
    { "label": "Uses try and except", "pattern": "^\\s*try\\s*:", "min": 1 },
    { "label": "Catches ValueError specifically", "pattern": "except\\s+ValueError" },
    { "label": "Strips spaces", "pattern": "\\.strip\\(\\)" },
    { "label": "Removes commas", "pattern": "\\.replace\\(\\s*[\"'],[\"']" },
    { "label": "Returns None when it fails", "pattern": "return\\s+None" },
    { "label": "Tests it at least three times", "pattern": "parse_amount\\(\\s*[\"']", "min": 3 }
  ],
  "sample": "def parse_amount(text):\n    \"\"\"Turn text like '12,500' into a number, or None if it isn't one.\"\"\"\n    try:\n        return int(text.strip().replace(\",\", \"\"))\n    except ValueError:\n        return None\n\nprint(parse_amount(\"12,500\"))\nprint(parse_amount(\" 4500 \"))\nprint(parse_amount(\"ten thousand\"))",
  "required": true
}
```
