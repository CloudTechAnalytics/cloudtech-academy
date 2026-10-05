---
title: Variables and Data Types
minutes: 35
summary: Store values in variables, name them well, know Python's main data types, check a value's type, and convert between types.
---

## Variables

A **variable** is a name that stores a value, so you can use it later. Create one with `=`:

```python
name = "Ifeoma"
age = 20
print(name)
print(age)
```

```text
Ifeoma
20
```

Read `=` as "**is set to**", not "equals": `age = 20` means "set age to 20". The name goes on the left, the value on the right.

Once a variable exists, use its name anywhere you'd use the value:

```python
price = 2500
quantity = 4
total = price * quantity
print(total)
```

```text
10000
```

### Changing a variable

A variable holds one value at a time. Assign again and the old value is replaced:

```python
balance = 5000
print(balance)
balance = 3200
print(balance)
```

```text
5000
3200
```

You can use a variable's current value to work out its new one. This is very common:

```python
balance = 5000
balance = balance - 1800   # spend 1,800
print(balance)
```

```text
3200
```

Python works out the right-hand side first (5000 − 1800), then stores the answer in `balance`. There's a shortcut for it, `balance -= 1800`, and the same for the other operators: `+=`, `*=`, `/=`.

### Naming variables

| Rule | Allowed | Not allowed |
| :-- | :-- | :-- |
| Letters, numbers and underscores only | `first_name`, `total2` | `first-name`, `first name` |
| Can't start with a number | `course2` | `2course` |
| Capitals matter | `Age` and `age` are different variables | |
| Not a Python keyword | `class_name` | `class`, `if`, `for` |

And by convention:

- use **lowercase with underscores** (`monthly_budget`), called snake_case;
- choose names that **say what's inside**: `transport_cost` beats `x` or `tc`.

> [!TIP]
> Good names are the cheapest way to make code readable. `total = price * quantity` explains itself; `t = p * q` doesn't.

### Several at once

You can assign several variables in one line, matching names to values in order:

```python
city, state = "Ibadan", "Oyo"
print(city, state)
```

```text
Ibadan Oyo
```

## Data types

Every value has a **type**, which decides what you can do with it. You can add two numbers, but you can't sensibly multiply two names. Python's main types:

| Type | Name in Python | Examples | Used for |
| :-- | :-- | :-- | :-- |
| text | `str` (string) | `"Lagos"`, `'ECO 201'`, `""` | names, codes, messages |
| whole number | `int` (integer) | `42`, `-7`, `0` | counts, IDs, ages |
| decimal number | `float` | `3.75`, `-0.5`, `2.0` | prices with kobo, averages |
| true or false | `bool` (boolean) | `True`, `False` | yes/no answers |
| nothing | `NoneType` | `None` | "no value yet" |

![Five labelled boxes holding a str, an int, a float, a bool and None, and four type conversions: int of the text 120, str of 12, float of the text 2.5 and int of 2.6 giving 2](/images/courses/python/variables-types.svg "A variable is a labelled box; every value has a type, and you can convert between types.")

Check any value's type with `type()`:

```python
print(type("Lagos"))
print(type(42))
print(type(4.21))
print(type(True))
print(type(None))
```

```text
<class 'str'>
<class 'int'>
<class 'float'>
<class 'bool'>
<class 'NoneType'>
```

### Strings

Text goes in quotes, single or double; both work, as long as they match. Use double quotes when the text contains an apostrophe:

```python
course = 'Economics'
message = "I'm in 200 level"
print(course)
print(message)
```

```text
Economics
I'm in 200 level
```

### Numbers: int and float

A number with a decimal point is a `float`, even if it ends in `.0`:

```python
print(type(5))
print(type(5.0))
```

```text
<class 'int'>
<class 'float'>
```

Don't use commas inside numbers: `60,000` isn't sixty thousand to Python. Write `60000`, or use an underscore to make it readable: `60_000`.

```python
budget = 60_000
print(budget)
```

```text
60000
```

### Booleans

`True` and `False` (capital first letter, no quotes) are answers to yes/no questions. You'll get them from comparisons:

```python
print(25 > 18)
print("Lagos" == "Abuja")
```

```text
True
False
```

You'll use booleans all the time in the lesson on conditions.

### None

`None` means "no value". It's what you store when a value isn't known yet:

```python
graduation_year = None
print(graduation_year)
```

```text
None
```

## Converting between types

Values often arrive as the wrong type, especially numbers stored as text (from a form, a file or a spreadsheet). Text that looks like a number doesn't behave like one:

```python
print("5" + "5")
print(5 + 5)
```

```text
55
10
```

With text, `+` **joins**; with numbers, it **adds**. Convert with these functions:

| Function | Converts to | Example | Result |
| :-- | :-- | :-- | :-- |
| `int()` | whole number | `int("42")` | `42` |
| `float()` | decimal | `float("3.5")` | `3.5` |
| `str()` | text | `str(2500)` | `"2500"` |
| `bool()` | true or false | `bool(0)` | `False` |

```python
fee_text = "45000"
fee = int(fee_text)
print(fee + 5000)
print(int(9.99))
print(float(7))
print(str(2026) + " budget")
```

```text
50000
9
7.0
2026 budget
```

Note that `int(9.99)` gives `9`: it **cuts off** the decimals, it doesn't round. Use `round(9.99)` to round.

Conversions only work when they make sense:

```python norun
int("forty")
```

```text nocheck
ValueError: invalid literal for int() with base 10: 'forty'
```

A **ValueError** means the value can't be converted.

## Putting values into text

To mix text and numbers in one message, use an **f-string**: put `f` before the opening quote, and variables inside `{curly brackets}`:

```python
name = "Musa"
level = 300
print(f"{name} is in {level} level")
```

```text
Musa is in 300 level
```

Without an f-string, joining text and a number with `+` fails, because they're different types:

```python norun
print("Level: " + level)
```

```text nocheck
TypeError: can only concatenate str (not "int") to str
```

Fix it with an f-string, `f"Level: {level}"`, or by converting, `"Level: " + str(level)`. You'll learn much more about f-strings in the lesson on text.

## Getting input from the user

`input()` pauses your program and waits for someone to type, then gives you what they typed, **always as text**:

```python norun
name = input("What is your name? ")
age = int(input("How old are you? "))
print(f"Hello {name}, next year you'll be {age + 1}")
```

Notice `int(...)` around the second `input`: without it, `age` would be text and `age + 1` would fail. In Colab, a box appears under the cell for you to type into.

## Summary

| You want to... | Write |
| :-- | :-- |
| store a value | `name = "Ifeoma"` |
| update a value | `balance = balance - 1800` or `balance -= 1800` |
| check a type | `type(value)` |
| text to a number | `int("42")`, `float("3.5")` |
| a number to text | `str(2500)` |
| text with values in it | `f"{name} is {age}"` |
| ask the user | `input("Question? ")` (gives text) |

## Try it

```answer
{
  "id": "py-m04-a1",
  "prompt": "You start the month with `balance = 60000`. You spend 12,500 on transport and 28,000 on food, updating `balance` after each. What is `balance` at the end?",
  "answer": 19500,
  "format": "naira",
  "hint": "balance = 60000, then balance -= 12500, then balance -= 28000.",
  "pyVerify": "60000 - 12500 - 28000",
  "required": true
}
```

```answer
{
  "id": "py-m04-a2",
  "prompt": "What does `int(\"45000\") + 5000` give?",
  "answer": 50000,
  "format": "number",
  "pyVerify": "int('45000') + 5000",
  "required": true
}
```

```answer
{
  "id": "py-m04-a3",
  "prompt": "What does `int(7.9)` give?",
  "answer": 7,
  "format": "number",
  "hint": "int() cuts off the decimals; it doesn't round.",
  "pyVerify": "int(7.9)",
  "required": true
}
```

```task
{
  "id": "py-m04-t1",
  "prompt": "Write code that stores **your name, course, level and number of courses** this semester in four variables (at least one text and one number), then prints one sentence about you with an **f-string**, for example *Ifeoma is a 200 level Economics student taking 9 courses.* Run it in Colab, then paste your code here.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "name = \"...\"\ncourse = \"...\"\n...\nprint(f\"...\")",
  "rules": [
    { "label": "At least four variables assigned with =", "pattern": "^\\s*[a-z_][a-z0-9_]*\\s*=\\s*\\S", "min": 4 },
    { "label": "Text values in quotes", "pattern": "=\\s*[\"'][^\"'\\n]+[\"']" },
    { "label": "A number stored without quotes", "pattern": "=\\s*\\d+(\\.\\d+)?\\s*$" },
    { "label": "Prints with an f-string that uses your variables", "pattern": "print\\(\\s*f[\"'][^\"'\\n]*\\{[a-z_][a-z0-9_]*\\}" }
  ],
  "sample": "name = \"Ifeoma\"\ncourse = \"Economics\"\nlevel = 200\ncourses = 9\nprint(f\"{name} is a {level} level {course} student taking {courses} courses.\")",
  "required": true
}
```
