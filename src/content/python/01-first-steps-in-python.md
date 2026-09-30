---
title: First Steps in Python
minutes: 25
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

## Try it

1. Create a new Colab notebook called "Python practice".
2. Make variables for your name, course, level and number of courses this semester.
3. Print one sentence using an f-string, for example "Ifeoma is a 200 level Economics student taking 9 courses."
4. Work out how much you'd spend on transport in a month if one trip costs ₦700 and you make 2 trips a day for 22 days. Print the answer with commas.
