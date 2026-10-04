---
title: First Steps in Python
minutes: 25
summary: What programming is, how to run Python in your browser with Google Colab, print, comments, how Python reads your code, and how to read an error message.
---

## Why Python

A **program** is a list of instructions for a computer, written in a language it understands. **Python** is one of the most popular programming languages in the world, and one of the easiest to read: its instructions look close to plain English. It's used for:

- **data analysis**: cleaning, summarising and charting data (pandas, matplotlib);
- **automation**: renaming files, sending reports, filling spreadsheets;
- **websites and apps**: Instagram's servers run Python;
- **AI and machine learning**: most AI tools are built with it.

If you want a career in data or tech, it's a strong first language, and everything you learn here carries over to other languages.

## Open Google Colab

You don't need to install anything. **Google Colab** runs Python in your browser, for free, on Google's computers.

1. Go to **colab.research.google.com** and sign in with a Google account.
2. Click **New notebook**. It opens with one empty **code cell**.
3. Click **Untitled0.ipynb** at the top and rename it, for example "Python practice".

A notebook is made of **cells**:

| Cell | Holds | How to add |
| :-- | :-- | :-- |
| **Code cell** | Python code you can run | **+ Code** |
| **Text cell** | notes and headings | **+ Text** |

To run a code cell, click the ▶ button on its left, or press **Shift + Enter** (run and move to the next cell). The output appears under the cell. The notebook saves to your Google Drive automatically.

> [!NOTE]
> If Colab sits idle for a while, it **disconnects** and forgets everything you ran. That's normal. Click **Connect**, then run your cells again from the top (**Runtime → Run all**).

## Your first line of code

Type this in a code cell and run it:

```python
print("Hello, I'm learning Python!")
```

```text
Hello, I'm learning Python!
```

`print()` is a **function**: a built-in command that does a job. Its job is to show whatever you put inside the brackets. The text is in quotation marks so Python knows it's text, not code.

You can print several things at once, separated by commas. `print` puts a space between them:

```python
print("Lagos", "Abuja", "Kano")
print("Total:", 2500)
```

```text
Lagos Abuja Kano
Total: 2500
```

Python can also calculate. Without quotes, `2 + 3` is a sum:

```python
print(2 + 3)
print("2 + 3")
```

```text
5
2 + 3
```

The first line works out the answer; the second prints the text exactly as written. Quotes make the difference.

## How Python reads your code

Python runs your code **one line at a time, from top to bottom**:

```python
print("First")
print("Second")
print("Third")
```

```text
First
Second
Third
```

Each instruction usually goes on its own line. Capitals matter: `print` works, `Print` and `PRINT` don't. And in Python, the **spaces at the start of a line** mean something (you'll see why in the lesson on conditions), so for now, start every line at the left edge.

## Comments

Anything after a `#` on a line is a **comment**. Python ignores it; it's a note for people reading your code, including you next month:

```python
# Work out monthly transport cost
print(700 * 2 * 22)  # fare × trips a day × days
```

```text
30800
```

Comments explain **why** the code does something. You'll also use `#` to switch a line off while you test, without deleting it.

## When it goes wrong

Errors are normal, even for experts. Python's error messages tell you what went wrong if you read the **last line** first. The three you'll meet most:

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

A **NameError** means you used a name Python doesn't know: usually a typo, or a variable whose cell you haven't run yet. (After Colab disconnects or restarts, run your earlier cells again.)

```python norun
Print("Hello")
```

```text nocheck
NameError: name 'Print' is not defined
```

Capitals matter: Python knows `print`, not `Print`.

> [!TIP]
> When an error appears, don't panic and don't retype everything. Read the last line, find the line number it mentions, and look closely at that line for a missing quote, bracket or comma.

## Summary

| You want to... | Write |
| :-- | :-- |
| show text | `print("Hello")` |
| show several values | `print("Total:", 2500)` |
| calculate | `print(2 + 3)` |
| add a note | `# comment` |
| run a cell in Colab | **Shift + Enter** |
| start again after a disconnect | **Runtime → Run all** |

## Try it

Open your Colab notebook and work through these. Run your code, then type the result here.

```answer
{
  "id": "py-m01-a1",
  "prompt": "One bus trip costs **₦700**. You make **2 trips a day** for **22 days** in a month. Write the calculation in Python: how much do you spend on transport in the month?",
  "answer": 30800,
  "format": "naira",
  "hint": "print(700 * 2 * 22)",
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
  "prompt": "What **type** is `4.21`? Type the short name Python uses. (Run `type(4.21)` to find out; the next lesson explains types.)",
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
  "prompt": "Write a short program with **at least three `print` lines**: your name, your course, and a calculation (for example your monthly transport cost), with a **comment** above it explaining what it works out. Run it in Colab, then paste your code here.",
  "minutes": 6,
  "rows": 8,
  "placeholder": "# About me\nprint(\"...\")",
  "rules": [
    { "label": "At least three print lines", "pattern": "^\\s*print\\(", "min": 3 },
    { "label": "Text in quotes", "pattern": "print\\(\\s*[\"'][^\"'\\n]+[\"']" },
    { "label": "A calculation with an operator", "pattern": "print\\([^\\n]*\\d+\\s*[-+*/]\\s*\\d+" },
    { "label": "A comment starting with #", "pattern": "#\\s*\\S" }
  ],
  "sample": "# About me\nprint(\"My name is Ifeoma\")\nprint(\"I study Economics\")\n# Monthly transport: fare x trips a day x days\nprint(700 * 2 * 22)",
  "required": true
}
```
