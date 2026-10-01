---
title: First Steps in Python
minutes: 20
summary: Run Python in your browser with Google Colab, and learn values, variables, types and simple maths, with nothing to install.
---

## Why Python

Python is one of the most popular programming languages in the world, and one of the easiest to read. It's used for data analysis, automation, websites, AI and more. If you want a career in data or tech, it's a strong first language.

## Open Google Colab

You don't need to install anything. **Google Colab** runs Python in your browser for free.

1. Go to **colab.research.google.com** and sign in with a Google account.
2. Click **New notebook**.
3. You'll see a **code cell**. Type code in it and press **Shift + Enter** to run it.

The notebook saves to your Google Drive automatically.

## Your first line of code

```python
print("Hello, I'm learning Python!")
```

Run it. `print()` shows whatever you put inside the brackets.

## Variables

A **variable** is a name that stores a value. Use `=` to assign:

```python
name = "Ifeoma"
age = 20
cgpa = 4.21
is_student = True

print(name)
print("Age:", age)
```

Variable names use lowercase letters and underscores (`first_name`, not `First Name`). They can't start with a number or contain spaces.

## The main types

| Type | Example | Used for |
| :-- | :-- | :-- |
| `str` (string) | `"Lagos"` | Text, always in quotes |
| `int` (integer) | `42` | Whole numbers |
| `float` | `3.75` | Decimal numbers |
| `bool` (boolean) | `True`, `False` | Yes/no values |

Check a type with `type(age)`.

## Maths and text

```python
price = 2500
quantity = 4
total = price * quantity
print("Total: ₦", total)

# f-strings put values inside text
print(f"{name} bought {quantity} items for ₦{total:,}")
```

Operators: `+` add, `-` subtract, `*` multiply, `/` divide, `**` power, `%` remainder. Lines starting with `#` are **comments**; Python ignores them.

> [!NOTE]
> `"5" + "5"` gives `"55"` (joining text), but `5 + 5` gives `10`. If a number is stored as text, convert it with `int("5")` or `float("5.5")`.

## When it goes wrong

Errors are normal, and Python's error messages tell you what went wrong if you read the **last line** first. The three you'll meet most this week:

```python norun
print("Hello)
```

```text nocheck
SyntaxError: unterminated string literal (detected at line 1)
```

A **SyntaxError** means Python can't understand the line: here, the closing quotation mark is missing. Look at the line it names, and the one just before it.

```python norun
print(nmae)
```

```text nocheck
NameError: name 'nmae' is not defined
```

A **NameError** means you used a name Python doesn't know: usually a typo, or a variable whose cell you haven't run yet. (After restarting Colab, run your earlier cells again.)

```python norun
age = 20
print("Age: " + age)
```

```text nocheck
TypeError: can only concatenate str (not "int") to str
```

A **TypeError** means you mixed types that don't go together: here, text plus a number. Fix it with an f-string, `print(f"Age: {age}")`, or by converting, `"Age: " + str(age)`.

## Try it

Open a new Colab notebook called "Python practice" and work through these. Run your code, then type the result here.

```answer
{
  "id": "py-m01-a1",
  "prompt": "One bus trip costs **₦700**. You make **2 trips a day** for **22 days** in a month. Write the calculation in Python: how much do you spend on transport in the month?",
  "answer": 30800,
  "format": "naira",
  "hint": "trips = 2 * 22, then trips * 700",
  "pyVerify": "700 * 2 * 22",
  "required": true
}
```

```answer
{
  "id": "py-m01-a2",
  "prompt": "What does Python give for `\"5\" + \"5\"`? Type exactly what it shows, quotation marks included.",
  "answer": "'55'",
  "format": "text",
  "accept": ["\"55\"", "55"],
  "hint": "Both values are text in quotes, so + joins them.",
  "pyVerify": "repr('5' + '5')",
  "required": true
}
```

```answer
{
  "id": "py-m01-a3",
  "prompt": "What **type** is `4.21`? Type the short name Python uses.",
  "answer": "float",
  "format": "text",
  "accept": ["<class 'float'>", "a float"],
  "pyVerify": "type(4.21).__name__",
  "required": true
}
```

```task
{
  "id": "py-m01-t1",
  "prompt": "Write code that stores **your name, course, level and number of courses** this semester in four variables, then prints one sentence about you with an **f-string**, for example *Ifeoma is a 200 level Economics student taking 9 courses.* Run it in Colab, then paste your code here.",
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
