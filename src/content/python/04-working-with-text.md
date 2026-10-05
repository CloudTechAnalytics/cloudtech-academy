---
title: Working with Text
minutes: 30
summary: Strings in depth: quotes and special characters, joining and repeating, length, indexing and slicing, the most useful string methods, splitting and joining, and f-string formatting.
---

## Strings

Text in Python is a **string** (`str`): a sequence of characters in quotes. Single and double quotes work the same way:

```python
course = "Economics"
code = 'ECO 201'
print(course, code)
```

```text
Economics ECO 201
```

Use double quotes when the text contains an apostrophe, or single quotes when it contains double quotes:

```python
print("I'm in 200 level")
print('She said "well done"')
```

```text
I'm in 200 level
She said "well done"
```

### Special characters

A **backslash** `\` starts a special character inside a string:

| Write | Means |
| :-- | :-- |
| `\n` | a new line |
| `\t` | a tab |
| `\'` or `\"` | a quote inside quotes of the same kind |
| `\\` | one backslash |

```python
print("Name:\tAdaeze\nLevel:\t300")
```

```text
Name:	Adaeze
Level:	300
```

For text over several lines, use **triple quotes**:

```python
address = """Block C, Room 14
Queen Amina Hall
University of Lagos"""
print(address)
```

```text
Block C, Room 14
Queen Amina Hall
University of Lagos
```

## Joining and repeating

`+` joins strings; `*` repeats one:

```python
first = "Chidi"
last = "Okeke"
print(first + " " + last)
print("-" * 20)
```

```text
Chidi Okeke
--------------------
```

## Length

`len()` counts the characters, including spaces:

```python
print(len("Chidi Okeke"))
```

```text
11
```

## Indexing: one character

Each character has a position, its **index**, starting at **0**:

| Character | P | y | t | h | o | n |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Index | 0 | 1 | 2 | 3 | 4 | 5 |
| From the end | -6 | -5 | -4 | -3 | -2 | -1 |

```python
word = "Python"
print(word[0])
print(word[2])
print(word[-1])
```

```text
P
t
n
```

Negative indexes count from the end, so `[-1]` is always the last character, however long the string.

## Slicing: part of a string

`text[start:stop]` takes the characters from `start` up to, **but not including**, `stop`:

![The text DATA-2026 with positions 0 to 8 from the left and -9 to -1 from the right; the slice word[0:4] gives DATA and word[5:] gives 2026](/images/courses/python/string-positions.svg "String positions count from 0 on the left and −1 on the right; a slice stops before its end.")

```python
code = "ECO201-2026"
print(code[0:3])
print(code[3:6])
print(code[7:])
print(code[:6])
print(code[-4:])
```

```text
ECO
201
2026
ECO201
2026
```

- Leave out `start` to begin at the start; leave out `stop` to go to the end.
- The number of characters you get is `stop − start`: `[0:3]` gives 3.

## String methods

A **method** is a function that belongs to a value. You call it with a dot: `text.upper()`. String methods never change the original string (strings can't be changed); they give you a new one.

### Changing case

```python
name = "adaeze OKAFOR"
print(name.upper())
print(name.lower())
print(name.title())
print(name.capitalize())
```

```text
ADAEZE OKAFOR
adaeze okafor
Adaeze Okafor
Adaeze okafor
```

### Removing spaces

Data typed by people often has stray spaces. `strip()` removes them from both ends:

```python
entry = "   lagos  "
print(f"[{entry}]")
print(f"[{entry.strip()}]")
print(f"[{entry.strip().title()}]")
```

```text
[   lagos  ]
[lagos]
[Lagos]
```

You can **chain** methods, as in the last line: strip, then title-case. `lstrip()` and `rstrip()` remove spaces from one side only.

### Finding and replacing

```python
email = "musa.bello@gmail.com"
print(email.replace("gmail.com", "unilag.edu.ng"))
print(email.find("@"))
print(email.count("a"))
print("bello" in email)
print(email.startswith("musa"))
print(email.endswith(".com"))
```

```text
musa.bello@unilag.edu.ng
10
2
True
True
True
```

- `find` gives the index where something first appears, or `-1` if it isn't there.
- `in` asks "is this inside?" and gives `True` or `False`.

### Checking what's in a string

| Method | True when the string... | `"2026"` | `"ECO"` | `"ECO 201"` |
| :-- | :-- | :-- | :-- | :-- |
| `isdigit()` | is all digits | True | False | False |
| `isalpha()` | is all letters | False | True | False |
| `isupper()` | has no lowercase letters | False | True | True |

These are useful for checking input before converting it, for example `if text.isdigit(): number = int(text)`.

## Splitting and joining

`split()` breaks a string into a **list** of pieces. With no argument, it splits on spaces:

```python
sentence = "Data analysis with Python"
print(sentence.split())

line = "Adaeze,Economics,200,4.21"
print(line.split(","))
```

```text
['Data', 'analysis', 'with', 'Python']
['Adaeze', 'Economics', '200', '4.21']
```

The second example is how a line of a CSV file breaks into its values. (Each piece is still text: `"200"`, not `200`.)

`join()` does the opposite: it glues a list of strings together, with the string you call it on between each piece:

```python
parts = ["2026", "09", "15"]
print("-".join(parts))
print(", ".join(["Lagos", "Abuja", "Kano"]))
```

```text
2026-09-15
Lagos, Abuja, Kano
```

## f-strings in depth

An **f-string** puts values inside text. Anything in `{}` is worked out and inserted:

```python
name = "Musa"
fee = 45000
print(f"{name} owes ₦{fee:,}")
print(f"Half is {fee / 2}")
print(f"In capitals: {name.upper()}")
```

```text
Musa owes ₦45,000
Half is 22500.0
In capitals: MUSA
```

After the value, a colon and a **format** control how it looks:

| Format | Does | Example | Shows |
| :-- | :-- | :-- | :-- |
| `:,` | thousands separators | `{45000:,}` | `45,000` |
| `:.2f` | 2 decimal places | `{3.14159:.2f}` | `3.14` |
| `:.0%` | as a percentage | `{0.25:.0%}` | `25%` |
| `:<10` | left-align in 10 spaces | `{"Food":<10}` | `Food      ` |
| `:>10` | right-align in 10 spaces | `{4500:>10}` | `      4500` |
| `:^10` | centre in 10 spaces | `{"Hi":^10}` | `    Hi    ` |

Alignment lines up simple tables:

```python
print(f"{'Item':<10}{'Cost':>10}")
print(f"{'Food':<10}{28000:>10,}")
print(f"{'Data':<10}{6000:>10,}")
```

```text
Item            Cost
Food          28,000
Data           6,000
```

## When it goes wrong

```python norun
word = "Python"
word[0] = "J"
```

```text nocheck
TypeError: 'str' object does not support item assignment
```

Strings **can't be changed** in place. Make a new one instead: `word = "J" + word[1:]`.

```python norun
print("Python"[10])
```

```text nocheck
IndexError: string index out of range
```

"Python" has positions 0 to 5. Slices don't raise this error (`"Python"[3:10]` gives `"hon"`), but single indexes do.

```python norun
name = "musa"
name.upper()
print(name)
```

```text nocheck
musa
```

No error, but no change either: `upper()` returned a new string, and it was thrown away. Store it: `name = name.upper()`.

## Summary

| You want to... | Write |
| :-- | :-- |
| join text | `first + " " + last` |
| count characters | `len(text)` |
| one character | `text[0]`, `text[-1]` |
| part of the text | `text[start:stop]` |
| change case | `.upper()`, `.lower()`, `.title()` |
| remove stray spaces | `.strip()` |
| replace | `.replace("old", "new")` |
| check if it contains | `"x" in text` |
| split into a list | `text.split(",")` |
| join a list | `", ".join(items)` |
| format a value | `f"{value:,.2f}"` |

## Try it

```answer
{
  "id": "py-m06-a1",
  "prompt": "`code = \"ECO201-2026\"`. What does `code[3:6]` give? Type it without quotes.",
  "answer": "201",
  "format": "text",
  "pyVerify": "'ECO201-2026'[3:6]",
  "required": true
}
```

```answer
{
  "id": "py-m06-a2",
  "prompt": "What does `\"   abuja   \".strip().title()` give? Type it without quotes.",
  "answer": "Abuja",
  "format": "text",
  "pyVerify": "'   abuja   '.strip().title()",
  "required": true
}
```

```answer
{
  "id": "py-m06-a3",
  "prompt": "`line = \"Adaeze,Economics,200,4.21\"`. How many items are in `line.split(\",\")`?",
  "answer": 4,
  "format": "number",
  "pyVerify": "len('Adaeze,Economics,200,4.21'.split(','))",
  "required": true
}
```

```task
{
  "id": "py-m06-t1",
  "prompt": "Clean up a messy name and email: start with `name = \"  aDAEZE   okafor \"`. Print the name **stripped and in title case**, print its **initials** (first letter of each part, using `split()` and indexing), and build an email like `adaeze.okafor@student.edu.ng` from it in **lowercase**. Paste your code.",
  "minutes": 10,
  "rows": 10,
  "placeholder": "name = \"  aDAEZE   okafor \"",
  "rules": [
    { "label": "Uses strip()", "pattern": "\\.strip\\(\\)" },
    { "label": "Uses title()", "pattern": "\\.title\\(\\)" },
    { "label": "Splits the name", "pattern": "\\.split\\(" },
    { "label": "Indexes a character with [0]", "pattern": "\\[0\\]" },
    { "label": "Makes it lowercase", "pattern": "\\.lower\\(\\)" },
    { "label": "Builds an email with @", "pattern": "@" }
  ],
  "sample": "name = \"  aDAEZE   okafor \"\nclean = name.strip().title()\nprint(clean)\nparts = clean.split()\nprint(parts[0][0] + parts[1][0])\nemail = \".\".join(parts).lower() + \"@student.edu.ng\"\nprint(email)",
  "required": true
}
```
